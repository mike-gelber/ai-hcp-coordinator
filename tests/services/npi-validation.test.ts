/**
 * Tests for the NPI Validation Service.
 *
 * Tests validation logic, caching, batch validation, and error handling.
 */

import {
  validateNpiRegistry,
  validateNpiBatch,
  clearMemoryCache,
  getMemoryCacheSize,
  invalidateNpiCache,
  cleanupExpiredDbCache,
} from "@/services/npi-validation";
import * as nppesClient from "@/services/nppes-client";
import type { NppesProviderInfo } from "@/types/nppes";

// ─── Mocks ───────────────────────────────────────────────────────────────────

// Mock only the lookup function, keep error classes real
jest.mock("@/services/nppes-client", () => {
  const actual = jest.requireActual("@/services/nppes-client");
  return {
    ...actual,
    lookupNpi: jest.fn(),
  };
});
const mockLookupNpi = nppesClient.lookupNpi as jest.MockedFunction<
  typeof nppesClient.lookupNpi
>;

// Mock Redis (not available in test env)
jest.mock("redis", () => ({
  createClient: jest.fn(() => ({
    connect: jest.fn().mockRejectedValue(new Error("No Redis")),
    on: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
  })),
}));

// Mock Prisma DB (not available in test env)
jest.mock("@/lib/db", () => ({
  prisma: {
    npiValidationCache: {
      findUnique: jest.fn().mockResolvedValue(null),
      upsert: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
  },
}));

// ─── Fixtures ────────────────────────────────────────────────────────────────

function makeProviderInfo(
  overrides: Partial<NppesProviderInfo> = {}
): NppesProviderInfo {
  return {
    npi: "1234567893",
    enumerationType: "individual",
    status: "active",
    firstName: "John",
    lastName: "Doe",
    middleName: "M",
    credential: "MD",
    gender: "M",
    namePrefix: "Dr.",
    primaryTaxonomy: {
      code: "207R00000X",
      description: "Internal Medicine",
      license: "123456",
      state: "NY",
    },
    taxonomies: [
      {
        code: "207R00000X",
        description: "Internal Medicine",
        primary: true,
        license: "123456",
        state: "NY",
      },
    ],
    practiceAddresses: [
      {
        address1: "123 Medical Dr",
        city: "New York",
        state: "NY",
        postalCode: "100011234",
        phone: "2125551234",
      },
    ],
    mailingAddresses: [],
    enumerationDate: "2005-07-08",
    lastUpdated: "2023-11-14",
    ...overrides,
  };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("validateNpiRegistry", () => {
  beforeEach(() => {
    clearMemoryCache();
    mockLookupNpi.mockReset();
  });

  // ── Format validation ──────────────────────────────────────────────────

  describe("format validation", () => {
    it("rejects empty NPI", async () => {
      const result = await validateNpiRegistry("");
      expect(result.status).toBe("invalid");
      expect(result.reason).toContain("empty");
      expect(result.cached).toBe(false);
    });

    it("rejects NPI with wrong length", async () => {
      const result = await validateNpiRegistry("12345");
      expect(result.status).toBe("invalid");
      expect(result.reason).toContain("10 digits");
    });

    it("rejects NPI with bad check digit", async () => {
      const result = await validateNpiRegistry("1234567890");
      expect(result.status).toBe("invalid");
      expect(result.reason).toContain("Luhn");
    });

    it("does not call NPPES API for invalid format", async () => {
      await validateNpiRegistry("bad");
      expect(mockLookupNpi).not.toHaveBeenCalled();
    });
  });

  // ── Valid individual provider ──────────────────────────────────────────

  describe("valid individual provider", () => {
    it("returns 'validated' for an active individual NPI", async () => {
      mockLookupNpi.mockResolvedValueOnce(makeProviderInfo());

      const result = await validateNpiRegistry("1234567893");

      expect(result.status).toBe("validated");
      expect(result.npi).toBe("1234567893");
      expect(result.reason).toContain("Active individual provider");
      expect(result.reason).toContain("John Doe");
      expect(result.reason).toContain("Internal Medicine");
      expect(result.provider).toBeDefined();
      expect(result.provider!.firstName).toBe("John");
      expect(result.cached).toBe(false);
      expect(result.validatedAt).toBeTruthy();
    });

    it("includes provider info with taxonomy and addresses", async () => {
      mockLookupNpi.mockResolvedValueOnce(makeProviderInfo());

      const result = await validateNpiRegistry("1234567893");

      expect(result.provider!.primaryTaxonomy!.code).toBe("207R00000X");
      expect(result.provider!.practiceAddresses).toHaveLength(1);
      expect(result.provider!.practiceAddresses[0].state).toBe("NY");
    });

    it("handles provider without specialty", async () => {
      const noSpecialty = makeProviderInfo({
        primaryTaxonomy: undefined,
        taxonomies: [],
      });
      mockLookupNpi.mockResolvedValueOnce(noSpecialty);

      const result = await validateNpiRegistry("1234567893");

      expect(result.status).toBe("validated");
      expect(result.reason).toContain("Active individual provider");
      expect(result.reason).toContain("John Doe");
      expect(result.reason).not.toContain("(");
    });
  });

  // ── NPI not found ─────────────────────────────────────────────────────

  describe("NPI not found", () => {
    it("returns 'invalid' when NPI is not in NPPES", async () => {
      mockLookupNpi.mockResolvedValueOnce(null);

      const result = await validateNpiRegistry("1234567893");

      expect(result.status).toBe("invalid");
      expect(result.reason).toContain("not found");
      expect(result.provider).toBeUndefined();
    });
  });

  // ── Deactivated NPI ────────────────────────────────────────────────────

  describe("deactivated NPI", () => {
    it("returns 'deactivated' with date and reason", async () => {
      const deactivated = makeProviderInfo({
        status: "deactivated",
        deactivationDate: "2022-01-15",
        deactivationReasonCode: "DT",
      });
      mockLookupNpi.mockResolvedValueOnce(deactivated);

      const result = await validateNpiRegistry("1234567893");

      expect(result.status).toBe("deactivated");
      expect(result.reason).toContain("deactivated on 2022-01-15");
      expect(result.reason).toContain("reason: DT");
      expect(result.provider).toBeDefined();
    });

    it("handles deactivated without date", async () => {
      const deactivated = makeProviderInfo({
        status: "deactivated",
      });
      mockLookupNpi.mockResolvedValueOnce(deactivated);

      const result = await validateNpiRegistry("1234567893");

      expect(result.status).toBe("deactivated");
      expect(result.reason).toContain("deactivated");
    });
  });

  // ── Organization NPI ───────────────────────────────────────────────────

  describe("organization NPI", () => {
    it("returns 'organization' for Type 2 NPI", async () => {
      const orgProvider = makeProviderInfo({
        enumerationType: "organization",
        organizationName: "City Hospital",
        firstName: undefined,
        lastName: undefined,
      });
      mockLookupNpi.mockResolvedValueOnce(orgProvider);

      const result = await validateNpiRegistry("1234567893");

      expect(result.status).toBe("organization");
      expect(result.reason).toContain("organization");
      expect(result.reason).toContain("City Hospital");
      expect(result.provider).toBeDefined();
    });

    it("handles organization without name", async () => {
      const orgProvider = makeProviderInfo({
        enumerationType: "organization",
        organizationName: undefined,
        firstName: undefined,
        lastName: undefined,
      });
      mockLookupNpi.mockResolvedValueOnce(orgProvider);

      const result = await validateNpiRegistry("1234567893");

      expect(result.status).toBe("organization");
      expect(result.reason).toContain("unknown");
    });
  });

  // ── Caching ────────────────────────────────────────────────────────────

  describe("caching", () => {
    it("caches validated results in memory", async () => {
      mockLookupNpi.mockResolvedValueOnce(makeProviderInfo());

      // First call — hits NPPES
      const first = await validateNpiRegistry("1234567893");
      expect(first.cached).toBe(false);
      expect(mockLookupNpi).toHaveBeenCalledTimes(1);

      // Second call — should use cache
      const second = await validateNpiRegistry("1234567893");
      expect(second.cached).toBe(true);
      expect(second.status).toBe("validated");
      expect(mockLookupNpi).toHaveBeenCalledTimes(1); // Still 1 call
    });

    it("caches invalid (not found) results", async () => {
      mockLookupNpi.mockResolvedValueOnce(null);

      await validateNpiRegistry("1234567893");
      const second = await validateNpiRegistry("1234567893");

      expect(second.cached).toBe(true);
      expect(second.status).toBe("invalid");
      expect(mockLookupNpi).toHaveBeenCalledTimes(1);
    });

    it("caches deactivated results", async () => {
      mockLookupNpi.mockResolvedValueOnce(
        makeProviderInfo({ status: "deactivated" })
      );

      await validateNpiRegistry("1234567893");
      const second = await validateNpiRegistry("1234567893");

      expect(second.cached).toBe(true);
      expect(second.status).toBe("deactivated");
    });

    it("caches organization results", async () => {
      mockLookupNpi.mockResolvedValueOnce(
        makeProviderInfo({
          enumerationType: "organization",
          organizationName: "Test Org",
        })
      );

      await validateNpiRegistry("1234567893");
      const second = await validateNpiRegistry("1234567893");

      expect(second.cached).toBe(true);
      expect(second.status).toBe("organization");
    });

    it("does not cache format validation failures", async () => {
      // Format failures are cheap to compute; no need to cache
      await validateNpiRegistry("bad");
      expect(getMemoryCacheSize()).toBe(0);
    });

    it("clearMemoryCache clears all entries", async () => {
      mockLookupNpi.mockResolvedValueOnce(makeProviderInfo());

      await validateNpiRegistry("1234567893");
      expect(getMemoryCacheSize()).toBe(1);

      clearMemoryCache();
      expect(getMemoryCacheSize()).toBe(0);
    });
  });

  // ── Error handling ─────────────────────────────────────────────────────

  describe("error handling", () => {
    it("propagates NppesApiError from NPPES client", async () => {
      mockLookupNpi.mockRejectedValueOnce(
        new nppesClient.NppesApiError("API failure", 500, true)
      );

      await expect(validateNpiRegistry("1234567893")).rejects.toThrow(
        nppesClient.NppesApiError
      );
    });

    it("propagates unexpected errors", async () => {
      mockLookupNpi.mockRejectedValueOnce(new Error("unexpected"));

      await expect(validateNpiRegistry("1234567893")).rejects.toThrow(
        "unexpected"
      );
    });
  });

  // ── Input trimming ─────────────────────────────────────────────────────

  describe("input handling", () => {
    it("trims whitespace from NPI", async () => {
      mockLookupNpi.mockResolvedValueOnce(makeProviderInfo());

      const result = await validateNpiRegistry("  1234567893  ");

      expect(result.status).toBe("validated");
      expect(result.npi).toBe("1234567893");
    });
  });
});

// ─── Batch Validation ────────────────────────────────────────────────────────

describe("validateNpiBatch", () => {
  beforeEach(() => {
    clearMemoryCache();
    mockLookupNpi.mockReset();
  });

  it("validates multiple NPIs and returns results with summary", async () => {
    mockLookupNpi
      .mockResolvedValueOnce(makeProviderInfo({ npi: "1234567893" }))
      .mockResolvedValueOnce(null);

    const batch = await validateNpiBatch(["1234567893", "1245319599"]);

    expect(batch.results).toHaveLength(2);
    expect(batch.summary.total).toBe(2);
    expect(batch.summary.validated).toBe(1);
    expect(batch.summary.invalid).toBe(1);
  });

  it("handles mixed validation statuses", async () => {
    mockLookupNpi
      .mockResolvedValueOnce(makeProviderInfo({ npi: "1234567893" }))
      .mockResolvedValueOnce(
        makeProviderInfo({
          npi: "1245319599",
          status: "deactivated",
          deactivationDate: "2022-01-01",
        })
      )
      .mockResolvedValueOnce(
        makeProviderInfo({
          npi: "1679576722",
          enumerationType: "organization",
          organizationName: "Test Clinic",
        })
      );

    const batch = await validateNpiBatch([
      "1234567893",
      "1245319599",
      "1679576722",
    ]);

    expect(batch.summary.validated).toBe(1);
    expect(batch.summary.deactivated).toBe(1);
    expect(batch.summary.organization).toBe(1);
    expect(batch.summary.total).toBe(3);
  });

  it("includes format-invalid NPIs in results", async () => {
    const batch = await validateNpiBatch(["bad", "1234567890"]);

    expect(batch.results).toHaveLength(2);
    expect(batch.summary.invalid).toBe(2);
    expect(mockLookupNpi).not.toHaveBeenCalled();
  });

  it("handles API errors gracefully in batch mode", async () => {
    mockLookupNpi
      .mockResolvedValueOnce(makeProviderInfo({ npi: "1234567893" }))
      .mockRejectedValueOnce(
        new nppesClient.NppesApiError("API failure", 500, true)
      );

    const batch = await validateNpiBatch(["1234567893", "1245319599"]);

    expect(batch.results).toHaveLength(2);
    expect(batch.results[0].status).toBe("validated");
    expect(batch.results[1].status).toBe("invalid");
    expect(batch.results[1].reason).toContain("Validation failed");
  });

  it("respects concurrency setting", async () => {
    // With concurrency=1, lookups happen sequentially
    mockLookupNpi
      .mockResolvedValueOnce(makeProviderInfo({ npi: "1234567893" }))
      .mockResolvedValueOnce(
        makeProviderInfo({
          npi: "1245319599",
          firstName: "Jane",
          lastName: "Smith",
        })
      );

    const batch = await validateNpiBatch(["1234567893", "1245319599"], {
      concurrency: 1,
    });

    expect(batch.results).toHaveLength(2);
    expect(batch.summary.validated).toBe(2);
  });

  it("returns empty results for empty input", async () => {
    const batch = await validateNpiBatch([]);

    expect(batch.results).toHaveLength(0);
    expect(batch.summary.total).toBe(0);
  });
});

// ─── Cache Management ────────────────────────────────────────────────────────

describe("cache management", () => {
  beforeEach(() => {
    clearMemoryCache();
    mockLookupNpi.mockReset();
  });

  it("getMemoryCacheSize returns correct count", async () => {
    expect(getMemoryCacheSize()).toBe(0);

    mockLookupNpi
      .mockResolvedValueOnce(makeProviderInfo({ npi: "1234567893" }))
      .mockResolvedValueOnce(null);

    await validateNpiRegistry("1234567893");
    expect(getMemoryCacheSize()).toBe(1);

    await validateNpiRegistry("1245319599");
    expect(getMemoryCacheSize()).toBe(2);
  });

  it("invalidateNpiCache removes entry from memory cache", async () => {
    mockLookupNpi.mockResolvedValueOnce(makeProviderInfo({ npi: "1234567893" }));

    await validateNpiRegistry("1234567893");
    expect(getMemoryCacheSize()).toBe(1);

    await invalidateNpiCache("1234567893");
    expect(getMemoryCacheSize()).toBe(0);
  });

  it("invalidateNpiCache allows re-lookup from NPPES", async () => {
    mockLookupNpi
      .mockResolvedValueOnce(makeProviderInfo({ npi: "1234567893" }))
      .mockResolvedValueOnce(
        makeProviderInfo({
          npi: "1234567893",
          firstName: "Updated",
          lastName: "Name",
        })
      );

    // First call
    const first = await validateNpiRegistry("1234567893");
    expect(first.provider!.firstName).toBe("John");
    expect(mockLookupNpi).toHaveBeenCalledTimes(1);

    // Invalidate
    await invalidateNpiCache("1234567893");

    // Second call should hit NPPES again
    const second = await validateNpiRegistry("1234567893");
    expect(second.cached).toBe(false);
    expect(second.provider!.firstName).toBe("Updated");
    expect(mockLookupNpi).toHaveBeenCalledTimes(2);
  });

  it("cleanupExpiredDbCache runs without error", async () => {
    const count = await cleanupExpiredDbCache();
    expect(typeof count).toBe("number");
  });
});
