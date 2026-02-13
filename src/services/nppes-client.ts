/**
 * NPPES NPI Registry API client.
 *
 * Queries the CMS NPPES API (v2.1) to look up provider information by NPI.
 * Implements rate limiting (max 2 req/s) and graceful error handling.
 *
 * API docs: https://npiregistry.cms.hhs.gov/api-page
 */

import type { NppesApiResponse, NppesResult, NppesProviderInfo, NppesAddress } from "@/types/nppes";

// ─── Configuration ──────────────────────────────────────────────────────────

const NPPES_API_URL = process.env.NPPES_API_URL || "https://npiregistry.cms.hhs.gov/api/";
const API_VERSION = "2.1";
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_REQUESTS_PER_SECOND = 2;

// ─── Rate Limiter ───────────────────────────────────────────────────────────

class RateLimiter {
  private timestamps: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number, windowMs: number = 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async waitForSlot(): Promise<void> {
    const now = Date.now();

    // Remove timestamps outside the window
    this.timestamps = this.timestamps.filter((t) => now - t < this.windowMs);

    if (this.timestamps.length >= this.maxRequests) {
      // Wait until the oldest request exits the window
      const oldest = this.timestamps[0];
      const waitTime = this.windowMs - (now - oldest) + 10; // +10ms buffer
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      // Clean up again after waiting
      const updated = Date.now();
      this.timestamps = this.timestamps.filter((t) => updated - t < this.windowMs);
    }

    this.timestamps.push(Date.now());
  }
}

const rateLimiter = new RateLimiter(MAX_REQUESTS_PER_SECOND);

// ─── Error Types ────────────────────────────────────────────────────────────

export class NppesApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly isRetryable: boolean = false,
  ) {
    super(message);
    this.name = "NppesApiError";
  }
}

export class NppesTimeoutError extends NppesApiError {
  constructor() {
    super("NPPES API request timed out", undefined, true);
    this.name = "NppesTimeoutError";
  }
}

export class NppesRateLimitError extends NppesApiError {
  constructor() {
    super("NPPES API rate limit exceeded", 429, true);
    this.name = "NppesRateLimitError";
  }
}

// ─── API Client ─────────────────────────────────────────────────────────────

/**
 * Query the NPPES API for a single NPI number.
 * Returns the raw NPPES result or null if not found.
 */
export async function queryNppes(npi: string): Promise<NppesResult | null> {
  await rateLimiter.waitForSlot();

  const url = new URL(NPPES_API_URL);
  url.searchParams.set("version", API_VERSION);
  url.searchParams.set("number", npi);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    if (response.status === 429) {
      throw new NppesRateLimitError();
    }

    if (!response.ok) {
      throw new NppesApiError(
        `NPPES API returned status ${response.status}`,
        response.status,
        response.status >= 500,
      );
    }

    const data: NppesApiResponse = await response.json();

    // API-level errors (e.g., invalid parameters)
    if (data.Errors && data.Errors.length > 0) {
      const errorMsg = data.Errors.map((e) => e.description).join("; ");
      throw new NppesApiError(`NPPES API error: ${errorMsg}`);
    }

    // No results found
    if (!data.results || data.result_count === 0) {
      return null;
    }

    return data.results[0];
  } catch (error: unknown) {
    if (error instanceof NppesApiError) {
      throw error;
    }
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new NppesTimeoutError();
    }
    throw new NppesApiError(
      `Failed to query NPPES API: ${error instanceof Error ? error.message : String(error)}`,
      undefined,
      true,
    );
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Response Parsing ───────────────────────────────────────────────────────

function parseAddress(addr: NppesAddress) {
  return {
    address1: addr.address_1,
    address2: addr.address_2 || undefined,
    city: addr.city,
    state: addr.state,
    postalCode: addr.postal_code,
    phone: addr.telephone_number || undefined,
    fax: addr.fax_number || undefined,
  };
}

/**
 * Parse a raw NPPES result into a structured NppesProviderInfo.
 */
export function parseNppesResult(result: NppesResult): NppesProviderInfo {
  const isIndividual = result.enumeration_type === "NPI-1";
  const isActive = result.status === "A";

  const practiceAddresses = result.addresses
    .filter((a) => a.address_purpose === "LOCATION")
    .map(parseAddress);

  const mailingAddresses = result.addresses
    .filter((a) => a.address_purpose === "MAILING")
    .map(parseAddress);

  const taxonomies = (result.taxonomies || []).map((t) => ({
    code: t.code,
    description: t.desc,
    primary: t.primary,
    license: t.license,
    state: t.state,
  }));

  const primaryTaxonomy = taxonomies.find((t) => t.primary);

  const provider: NppesProviderInfo = {
    npi: String(result.number),
    enumerationType: isIndividual ? "individual" : "organization",
    status: isActive ? "active" : "deactivated",

    // Taxonomy
    primaryTaxonomy: primaryTaxonomy
      ? {
          code: primaryTaxonomy.code,
          description: primaryTaxonomy.description,
          license: primaryTaxonomy.license,
          state: primaryTaxonomy.state,
        }
      : undefined,
    taxonomies,

    // Addresses
    practiceAddresses,
    mailingAddresses,

    // Dates
    enumerationDate: result.enumeration_date,
    lastUpdated: result.last_updated,
  };

  if (isIndividual) {
    provider.firstName = result.basic.first_name;
    provider.lastName = result.basic.last_name;
    provider.middleName = result.basic.middle_name || undefined;
    provider.credential = result.basic.credential || undefined;
    provider.gender = result.basic.gender || undefined;
    provider.namePrefix = result.basic.name_prefix || undefined;
    provider.nameSuffix = result.basic.name_suffix || undefined;
  } else {
    provider.organizationName = result.basic.organization_name;
  }

  // Deactivation info
  if (result.basic.deactivation_date) {
    provider.deactivationDate = result.basic.deactivation_date;
    provider.deactivationReasonCode = result.basic.deactivation_reason_code || undefined;
  }
  if (result.basic.reactivation_date) {
    provider.reactivationDate = result.basic.reactivation_date;
  }

  return provider;
}

/**
 * Look up an NPI and return parsed provider info, or null if not found.
 */
export async function lookupNpi(npi: string): Promise<NppesProviderInfo | null> {
  const result = await queryNppes(npi);
  if (!result) return null;
  return parseNppesResult(result);
}
