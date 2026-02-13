/**
 * NPI Validation Service.
 *
 * Validates NPI numbers against the NPPES registry, returning structured
 * results with status codes and reasons. Includes:
 * - Multi-layer caching: in-memory → Redis → PostgreSQL (all with 24h TTL)
 * - Batch validation with configurable concurrency
 * - Rate-limited NPPES API access via the nppes-client
 */

import { createClient, type RedisClientType } from "redis";
import { lookupNpi, NppesApiError } from "@/services/nppes-client";
import { validateNpi as validateNpiFormat } from "@/lib/npi";
import type {
  NpiValidationResult,
  NpiValidationStatus,
  NppesProviderInfo,
  BatchValidationOptions,
  BatchValidationResult,
} from "@/types/nppes";

// ─── Configuration ──────────────────────────────────────────────────────────

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_TTL_SECONDS = 24 * 60 * 60; // 24 hours (for Redis)
const DEFAULT_BATCH_CONCURRENCY = 2;

// ─── In-Memory Cache ────────────────────────────────────────────────────────

interface CacheEntry {
  result: NpiValidationResult;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry>();

function getFromMemoryCache(npi: string): NpiValidationResult | null {
  const entry = memoryCache.get(npi);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(npi);
    return null;
  }

  return { ...entry.result, cached: true };
}

function setInMemoryCache(npi: string, result: NpiValidationResult): void {
  memoryCache.set(npi, {
    result,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

// ─── Redis Cache ────────────────────────────────────────────────────────────

let redisClient: RedisClientType | null = null;
let redisAvailable = false;

async function getRedisClient(): Promise<RedisClientType | null> {
  if (!process.env.REDIS_URL) return null;

  if (redisClient && redisAvailable) return redisClient;

  try {
    redisClient = createClient({ url: process.env.REDIS_URL });

    redisClient.on("error", () => {
      redisAvailable = false;
    });

    await redisClient.connect();
    redisAvailable = true;
    return redisClient;
  } catch {
    redisAvailable = false;
    return null;
  }
}

function redisCacheKey(npi: string): string {
  return `npi-validation:${npi}`;
}

async function getFromRedisCache(
  npi: string
): Promise<NpiValidationResult | null> {
  try {
    const client = await getRedisClient();
    if (!client) return null;

    const data = await client.get(redisCacheKey(npi));
    if (!data) return null;

    const result = JSON.parse(data) as NpiValidationResult;
    return { ...result, cached: true };
  } catch {
    return null;
  }
}

async function setInRedisCache(
  npi: string,
  result: NpiValidationResult
): Promise<void> {
  try {
    const client = await getRedisClient();
    if (!client) return;

    await client.set(redisCacheKey(npi), JSON.stringify(result), {
      EX: CACHE_TTL_SECONDS,
    });
  } catch {
    // Silently fail — memory cache is the fallback
  }
}

// ─── Database Cache (Prisma) ────────────────────────────────────────────────

/**
 * Prisma client accessor — lazily imported to avoid issues when
 * the database is not available (e.g. in tests or edge runtime).
 */
async function getDbCacheEntry(
  npi: string
): Promise<NpiValidationResult | null> {
  try {
    const { prisma } = await import("@/lib/db");
    const entry = await prisma.npiValidationCache.findUnique({
      where: { npi },
    });

    if (!entry) return null;

    // Check expiration
    if (new Date() > entry.expiresAt) {
      // Clean up expired entry asynchronously
      prisma.npiValidationCache
        .delete({ where: { npi } })
        .catch(() => {});
      return null;
    }

    const result: NpiValidationResult = {
      npi: entry.npi,
      status: entry.status as NpiValidationStatus,
      reason: entry.reason,
      provider: entry.providerData
        ? (entry.providerData as unknown as NppesProviderInfo)
        : undefined,
      validatedAt: entry.validatedAt.toISOString(),
      cached: true,
    };

    // Promote to faster cache layers
    setInMemoryCache(npi, { ...result, cached: false });

    return result;
  } catch {
    // Database unavailable — fall through
    return null;
  }
}

async function setDbCacheEntry(
  npi: string,
  result: NpiValidationResult
): Promise<void> {
  try {
    const { prisma } = await import("@/lib/db");
    const expiresAt = new Date(Date.now() + CACHE_TTL_MS);

    await prisma.npiValidationCache.upsert({
      where: { npi },
      update: {
        status: result.status,
        reason: result.reason,
        providerData: result.provider
          ? (JSON.parse(JSON.stringify(result.provider)) as object)
          : null,
        validatedAt: new Date(result.validatedAt),
        expiresAt,
      },
      create: {
        npi,
        status: result.status,
        reason: result.reason,
        providerData: result.provider
          ? (JSON.parse(JSON.stringify(result.provider)) as object)
          : null,
        validatedAt: new Date(result.validatedAt),
        expiresAt,
      },
    });
  } catch {
    // Database unavailable — in-memory + Redis are fallbacks
  }
}

// ─── Unified Cache Layer ────────────────────────────────────────────────────

async function getFromCache(npi: string): Promise<NpiValidationResult | null> {
  // Layer 1: In-memory (fastest, single-instance)
  const memResult = getFromMemoryCache(npi);
  if (memResult) return memResult;

  // Layer 2: Redis (shared across instances)
  const redisResult = await getFromRedisCache(npi);
  if (redisResult) {
    // Promote to memory cache
    setInMemoryCache(npi, { ...redisResult, cached: false });
    return redisResult;
  }

  // Layer 3: Database (durable, survives restarts)
  const dbResult = await getDbCacheEntry(npi);
  if (dbResult) return dbResult;

  return null;
}

async function setInCache(
  npi: string,
  result: NpiValidationResult
): Promise<void> {
  // Write to all cache layers
  setInMemoryCache(npi, result);
  await Promise.all([
    setInRedisCache(npi, result),
    setDbCacheEntry(npi, result),
  ]);
}

// ─── Validation Logic ───────────────────────────────────────────────────────

function buildResult(
  npi: string,
  status: NpiValidationStatus,
  reason: string,
  provider?: NppesProviderInfo
): NpiValidationResult {
  return {
    npi,
    status,
    reason,
    provider,
    validatedAt: new Date().toISOString(),
    cached: false,
  };
}

/**
 * Validate a single NPI number against the NPPES registry.
 *
 * Returns a structured result with:
 * - "validated": active individual provider
 * - "invalid": not found in registry or bad format
 * - "deactivated": found but deactivated
 * - "organization": found but is Type 2 (organization NPI)
 */
export async function validateNpiRegistry(
  npi: string
): Promise<NpiValidationResult> {
  const cleaned = npi.trim();

  // 1. Format validation (Luhn check)
  const formatCheck = validateNpiFormat(cleaned);
  if (!formatCheck.valid) {
    return buildResult(cleaned, "invalid", formatCheck.error!);
  }

  // 2. Check cache
  const cached = await getFromCache(cleaned);
  if (cached) return cached;

  // 3. Look up in NPPES registry
  let provider: NppesProviderInfo | null;
  try {
    provider = await lookupNpi(cleaned);
  } catch (error) {
    if (error instanceof NppesApiError) {
      throw error; // Let caller handle API errors
    }
    throw error;
  }

  // 4. NPI not found
  if (!provider) {
    const result = buildResult(
      cleaned,
      "invalid",
      "NPI not found in NPPES registry"
    );
    await setInCache(cleaned, result);
    return result;
  }

  // 5. Check if deactivated
  if (provider.status === "deactivated") {
    const reason = provider.deactivationDate
      ? `NPI was deactivated on ${provider.deactivationDate}${
          provider.deactivationReasonCode
            ? ` (reason: ${provider.deactivationReasonCode})`
            : ""
        }`
      : "NPI is deactivated";

    const result = buildResult(cleaned, "deactivated", reason, provider);
    await setInCache(cleaned, result);
    return result;
  }

  // 6. Check if organization (Type 2)
  if (provider.enumerationType === "organization") {
    const result = buildResult(
      cleaned,
      "organization",
      `NPI belongs to an organization: ${provider.organizationName || "unknown"}`,
      provider
    );
    await setInCache(cleaned, result);
    return result;
  }

  // 7. Valid individual provider
  const displayName = [provider.firstName, provider.lastName]
    .filter(Boolean)
    .join(" ");
  const specialty = provider.primaryTaxonomy?.description;
  const reason = specialty
    ? `Active individual provider: ${displayName} (${specialty})`
    : `Active individual provider: ${displayName}`;

  const result = buildResult(cleaned, "validated", reason, provider);
  await setInCache(cleaned, result);
  return result;
}

// ─── Batch Validation ───────────────────────────────────────────────────────

/**
 * Validate multiple NPI numbers with configurable concurrency.
 * Defaults to concurrency of 2 to respect NPPES rate limits.
 */
export async function validateNpiBatch(
  npis: string[],
  options?: BatchValidationOptions
): Promise<BatchValidationResult> {
  const concurrency = options?.concurrency ?? DEFAULT_BATCH_CONCURRENCY;
  const results: NpiValidationResult[] = [];

  // Process in chunks based on concurrency
  for (let i = 0; i < npis.length; i += concurrency) {
    const chunk = npis.slice(i, i + concurrency);
    const chunkResults = await Promise.allSettled(
      chunk.map((npi) => validateNpiRegistry(npi))
    );

    for (let j = 0; j < chunkResults.length; j++) {
      const settled = chunkResults[j];
      if (settled.status === "fulfilled") {
        results.push(settled.value);
      } else {
        // On API error, still return a result with error info
        results.push(
          buildResult(
            chunk[j],
            "invalid",
            `Validation failed: ${settled.reason instanceof Error ? settled.reason.message : String(settled.reason)}`
          )
        );
      }
    }
  }

  const summary = {
    total: results.length,
    validated: results.filter((r) => r.status === "validated").length,
    invalid: results.filter((r) => r.status === "invalid").length,
    deactivated: results.filter((r) => r.status === "deactivated").length,
    organization: results.filter((r) => r.status === "organization").length,
  };

  return { results, summary };
}

// ─── Cache Management ───────────────────────────────────────────────────────

/** Clear the in-memory cache (useful for testing). */
export function clearMemoryCache(): void {
  memoryCache.clear();
}

/** Get the current in-memory cache size. */
export function getMemoryCacheSize(): number {
  // Clean expired entries first
  const now = Date.now();
  for (const [key, entry] of memoryCache.entries()) {
    if (now > entry.expiresAt) {
      memoryCache.delete(key);
    }
  }
  return memoryCache.size;
}

/**
 * Invalidate cache for a specific NPI across all layers.
 * Useful when we know a provider's status has changed.
 */
export async function invalidateNpiCache(npi: string): Promise<void> {
  // Memory
  memoryCache.delete(npi);

  // Redis
  try {
    const client = await getRedisClient();
    if (client) {
      await client.del(redisCacheKey(npi));
    }
  } catch {
    // Ignore Redis errors
  }

  // Database
  try {
    const { prisma } = await import("@/lib/db");
    await prisma.npiValidationCache.delete({ where: { npi } });
  } catch {
    // Ignore DB errors (record may not exist)
  }
}

/**
 * Clean up expired entries from the database cache.
 * Should be called periodically (e.g., via cron or background job).
 */
export async function cleanupExpiredDbCache(): Promise<number> {
  try {
    const { prisma } = await import("@/lib/db");
    const result = await prisma.npiValidationCache.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    return result.count;
  } catch {
    return 0;
  }
}
