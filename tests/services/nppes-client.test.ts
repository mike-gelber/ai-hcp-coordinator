/**
 * Tests for the NPPES NPI Registry API client.
 */

import {
  queryNppes,
  parseNppesResult,
  lookupNpi,
  NppesApiError,
  NppesTimeoutError,
  NppesRateLimitError,
} from "@/services/nppes-client";
import type { NppesResult, NppesApiResponse } from "@/types/nppes";

// ─── Mock fetch ──────────────────────────────────────────────────────────────

const mockFetch = jest.fn();
global.fetch = mockFetch;

// ─── Fixtures ────────────────────────────────────────────────────────────────

function makeNppesResult(overrides: Partial<NppesResult> = {}): NppesResult {
  return {
    number: 1234567893,
    enumeration_type: "NPI-1",
    created_epoch: 1120780800,
    last_updated_epoch: 1700000000,
    enumeration_date: "2005-07-08",
    last_updated: "2023-11-14",
    status: "A",
    basic: {
      first_name: "John",
      last_name: "Doe",
      middle_name: "M",
      credential: "MD",
      gender: "M",
      name_prefix: "Dr.",
      name_suffix: undefined,
      status: "A",
      enumeration_date: "2005-07-08",
      last_updated: "2023-11-14",
    },
    addresses: [
      {
        country_code: "US",
        country_name: "United States",
        address_purpose: "LOCATION",
        address_type: "DOM",
        address_1: "123 Medical Dr",
        address_2: "Suite 100",
        city: "New York",
        state: "NY",
        postal_code: "100011234",
        telephone_number: "2125551234",
        fax_number: "2125555678",
      },
      {
        country_code: "US",
        country_name: "United States",
        address_purpose: "MAILING",
        address_type: "DOM",
        address_1: "PO Box 999",
        city: "New York",
        state: "NY",
        postal_code: "100019999",
      },
    ],
    taxonomies: [
      {
        code: "207R00000X",
        taxonomy_group: "",
        desc: "Internal Medicine",
        state: "NY",
        license: "123456",
        primary: true,
      },
      {
        code: "207RC0000X",
        taxonomy_group: "",
        desc: "Cardiovascular Disease",
        state: "NY",
        license: "789012",
        primary: false,
      },
    ],
    practiceLocations: [],
    identifiers: [],
    endpoints: [],
    other_names: [],
    ...overrides,
  };
}

function makeApiResponse(
  result: NppesResult | null,
  errors?: NppesApiResponse["Errors"]
): NppesApiResponse {
  return {
    result_count: result ? 1 : 0,
    results: result ? [result] : null,
    ...(errors ? { Errors: errors } : {}),
  };
}

function mockSuccessResponse(data: NppesApiResponse) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => data,
  });
}

function mockErrorResponse(status: number) {
  mockFetch.mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: async () => ({}),
  });
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("queryNppes", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("returns a result for a valid NPI query", async () => {
    const nppesResult = makeNppesResult();
    mockSuccessResponse(makeApiResponse(nppesResult));

    const result = await queryNppes("1234567893");

    expect(result).not.toBeNull();
    expect(result!.number).toBe(1234567893);
    expect(result!.enumeration_type).toBe("NPI-1");
    expect(result!.status).toBe("A");
  });

  it("returns null when NPI is not found", async () => {
    mockSuccessResponse(makeApiResponse(null));

    const result = await queryNppes("9999999999");
    expect(result).toBeNull();
  });

  it("sends correct query parameters", async () => {
    mockSuccessResponse(makeApiResponse(null));

    await queryNppes("1234567893");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("number=1234567893"),
      expect.objectContaining({
        method: "GET",
        headers: { Accept: "application/json" },
      })
    );
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("version=2.1"),
      expect.anything()
    );
  });

  it("throws NppesRateLimitError on 429 response", async () => {
    mockErrorResponse(429);

    await expect(queryNppes("1234567893")).rejects.toThrow(
      NppesRateLimitError
    );
  });

  it("throws NppesApiError on 500 response (retryable)", async () => {
    mockErrorResponse(500);

    await expect(queryNppes("1234567893")).rejects.toThrow(NppesApiError);
    try {
      mockErrorResponse(500);
      await queryNppes("1234567893");
    } catch (e) {
      expect((e as NppesApiError).isRetryable).toBe(true);
      expect((e as NppesApiError).statusCode).toBe(500);
    }
  });

  it("throws NppesApiError on 400 response (non-retryable)", async () => {
    mockErrorResponse(400);

    try {
      await queryNppes("1234567893");
      fail("Expected error to be thrown");
    } catch (e) {
      expect(e).toBeInstanceOf(NppesApiError);
      expect((e as NppesApiError).isRetryable).toBe(false);
    }
  });

  it("throws NppesApiError when NPPES API returns errors array", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        result_count: 0,
        results: null,
        Errors: [
          {
            description: "Invalid NPI",
            field: "number",
            number: "100",
          },
        ],
      }),
    });

    await expect(queryNppes("invalid")).rejects.toThrow("NPPES API error");
  });

  it("throws NppesApiError on network failure (retryable)", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network timeout"));

    try {
      await queryNppes("1234567893");
      fail("Expected error to be thrown");
    } catch (e) {
      expect(e).toBeInstanceOf(NppesApiError);
      expect((e as NppesApiError).isRetryable).toBe(true);
    }
  });
});

describe("parseNppesResult", () => {
  it("parses an individual provider correctly", () => {
    const nppesResult = makeNppesResult();
    const provider = parseNppesResult(nppesResult);

    expect(provider.npi).toBe("1234567893");
    expect(provider.enumerationType).toBe("individual");
    expect(provider.status).toBe("active");
    expect(provider.firstName).toBe("John");
    expect(provider.lastName).toBe("Doe");
    expect(provider.middleName).toBe("M");
    expect(provider.credential).toBe("MD");
    expect(provider.gender).toBe("M");
    expect(provider.namePrefix).toBe("Dr.");
  });

  it("parses practice and mailing addresses", () => {
    const nppesResult = makeNppesResult();
    const provider = parseNppesResult(nppesResult);

    expect(provider.practiceAddresses).toHaveLength(1);
    expect(provider.practiceAddresses[0]).toEqual({
      address1: "123 Medical Dr",
      address2: "Suite 100",
      city: "New York",
      state: "NY",
      postalCode: "100011234",
      phone: "2125551234",
      fax: "2125555678",
    });

    expect(provider.mailingAddresses).toHaveLength(1);
    expect(provider.mailingAddresses[0].address1).toBe("PO Box 999");
  });

  it("parses taxonomies with primary designation", () => {
    const nppesResult = makeNppesResult();
    const provider = parseNppesResult(nppesResult);

    expect(provider.taxonomies).toHaveLength(2);
    expect(provider.primaryTaxonomy).toBeDefined();
    expect(provider.primaryTaxonomy!.code).toBe("207R00000X");
    expect(provider.primaryTaxonomy!.description).toBe("Internal Medicine");
  });

  it("parses an organization provider", () => {
    const orgResult = makeNppesResult({
      enumeration_type: "NPI-2",
      basic: {
        organization_name: "City Hospital",
        status: "A",
        enumeration_date: "2005-07-08",
        last_updated: "2023-11-14",
      },
    });

    const provider = parseNppesResult(orgResult);

    expect(provider.enumerationType).toBe("organization");
    expect(provider.organizationName).toBe("City Hospital");
    expect(provider.firstName).toBeUndefined();
    expect(provider.lastName).toBeUndefined();
  });

  it("parses a deactivated provider", () => {
    const deactivatedResult = makeNppesResult({
      status: "D",
      basic: {
        first_name: "Jane",
        last_name: "Smith",
        status: "D",
        enumeration_date: "2005-07-08",
        last_updated: "2023-11-14",
        deactivation_date: "2022-01-15",
        deactivation_reason_code: "DT",
      },
    });

    const provider = parseNppesResult(deactivatedResult);

    expect(provider.status).toBe("deactivated");
    expect(provider.deactivationDate).toBe("2022-01-15");
    expect(provider.deactivationReasonCode).toBe("DT");
  });

  it("parses dates correctly", () => {
    const nppesResult = makeNppesResult();
    const provider = parseNppesResult(nppesResult);

    expect(provider.enumerationDate).toBe("2005-07-08");
    expect(provider.lastUpdated).toBe("2023-11-14");
  });

  it("handles provider with no taxonomies", () => {
    const noTaxResult = makeNppesResult({ taxonomies: [] });
    const provider = parseNppesResult(noTaxResult);

    expect(provider.taxonomies).toHaveLength(0);
    expect(provider.primaryTaxonomy).toBeUndefined();
  });

  it("handles provider with reactivation date", () => {
    const reactivatedResult = makeNppesResult({
      basic: {
        first_name: "Bob",
        last_name: "Jones",
        status: "A",
        enumeration_date: "2005-07-08",
        last_updated: "2023-11-14",
        deactivation_date: "2020-01-01",
        reactivation_date: "2021-06-01",
      },
    });

    const provider = parseNppesResult(reactivatedResult);

    expect(provider.deactivationDate).toBe("2020-01-01");
    expect(provider.reactivationDate).toBe("2021-06-01");
  });
});

describe("lookupNpi", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("returns parsed provider info for a valid NPI", async () => {
    const nppesResult = makeNppesResult();
    mockSuccessResponse(makeApiResponse(nppesResult));

    const provider = await lookupNpi("1234567893");

    expect(provider).not.toBeNull();
    expect(provider!.npi).toBe("1234567893");
    expect(provider!.firstName).toBe("John");
    expect(provider!.lastName).toBe("Doe");
  });

  it("returns null when NPI is not found", async () => {
    mockSuccessResponse(makeApiResponse(null));

    const provider = await lookupNpi("9999999999");
    expect(provider).toBeNull();
  });

  it("propagates API errors", async () => {
    mockErrorResponse(500);

    await expect(lookupNpi("1234567893")).rejects.toThrow(NppesApiError);
  });
});
