/**
 * NPI Validation Service.
 *
 * Validates NPI numbers against the NPPES registry, returning structured
 * results with status codes and reasons. Includes:
 * - In-memory cache with 24h TTL (falls back from Redis if unavailable)
 * - Batch validation with configurable concurrency
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

async function getFromRedisCache(npi: string): Promise<NpiValidationResult | null> {
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

async function setInRedisCache(npi: string, result: NpiValidationResult): Promise<void> {
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

// ─── Unified Cache Layer ────────────────────────────────────────────────────

async function getFromCache(npi: string): Promise<NpiValidationResult | null> {
  // Try Redis first (shared across instances), then memory
  const redisResult = await getFromRedisCache(npi);
  if (redisResult) return redisResult;

  return getFromMemoryCache(npi);
}

async function setInCache(npi: string, result: NpiValidationResult): Promise<void> {
  setInMemoryCache(npi, result);
  await setInRedisCache(npi, result);
}

// ─── Validation Logic ───────────────────────────────────────────────────────

function buildResult(
  npi: string,
  status: NpiValidationStatus,
  reason: string,
  provider?: NppesProviderInfo,
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
export async function validateNpiRegistry(npi: string): Promise<NpiValidationResult> {
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
    const result = buildResult(cleaned, "invalid", "NPI not found in NPPES registry");
    await setInCache(cleaned, result);
    return result;
  }

  // 5. Check if deactivated
  if (provider.status === "deactivated") {
    const reason = provider.deactivationDate
      ? `NPI was deactivated on ${provider.deactivationDate}${
          provider.deactivationReasonCode ? ` (reason: ${provider.deactivationReasonCode})` : ""
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
      provider,
    );
    await setInCache(cleaned, result);
    return result;
  }

  // 7. Valid individual provider
  const displayName = [provider.firstName, provider.lastName].filter(Boolean).join(" ");
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
  options?: BatchValidationOptions,
): Promise<BatchValidationResult> {
  const concurrency = options?.concurrency ?? DEFAULT_BATCH_CONCURRENCY;
  const results: NpiValidationResult[] = [];

  // Process in chunks based on concurrency
  for (let i = 0; i < npis.length; i += concurrency) {
    const chunk = npis.slice(i, i + concurrency);
    const chunkResults = await Promise.allSettled(chunk.map((npi) => validateNpiRegistry(npi)));

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
            `Validation failed: ${settled.reason instanceof Error ? settled.reason.message : String(settled.reason)}`,
          ),
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
