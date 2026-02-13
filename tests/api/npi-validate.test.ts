/**
 * Tests for the NPI validation API endpoint.
 *
 * POST /api/npi/validate — single or batch validation
 * GET  /api/npi/validate?npi=... — single validation
 */

import { GET, POST } from "@/app/api/npi/validate/route";
import * as npiValidation from "@/services/npi-validation";
import * as nppesClient from "@/services/nppes-client";
import { NextRequest } from "next/server";
import type { NpiValidationResult, NppesProviderInfo } from "@/types/nppes";

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock("@/services/npi-validation");
jest.mock("@/services/nppes-client", () => {
  const actual = jest.requireActual("@/services/nppes-client");
  return { ...actual };
});

const mockValidateNpiRegistry =
  npiValidation.validateNpiRegistry as jest.MockedFunction<
    typeof npiValidation.validateNpiRegistry
  >;
const mockValidateNpiBatch =
  npiValidation.validateNpiBatch as jest.MockedFunction<
    typeof npiValidation.validateNpiBatch
  >;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeRequest(url: string, init?: RequestInit): NextRequest {
  return new NextRequest(new URL(url, "http://localhost:3000"), init);
}

function makeValidationResult(
  overrides: Partial<NpiValidationResult> = {}
): NpiValidationResult {
  return {
    npi: "1234567893",
    status: "validated",
    reason: "Active individual provider: John Doe (Internal Medicine)",
    validatedAt: "2024-01-01T00:00:00.000Z",
    cached: false,
    provider: {
      npi: "1234567893",
      enumerationType: "individual",
      status: "active",
      firstName: "John",
      lastName: "Doe",
      credential: "MD",
      gender: "M",
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
        },
      ],
      mailingAddresses: [],
      enumerationDate: "2005-07-08",
      lastUpdated: "2023-11-14",
    } as NppesProviderInfo,
    ...overrides,
  };
}

// ─── GET Tests ───────────────────────────────────────────────────────────────

describe("GET /api/npi/validate", () => {
  beforeEach(() => {
    mockValidateNpiRegistry.mockReset();
  });

  it("validates a single NPI via query parameter", async () => {
    const validResult = makeValidationResult();
    mockValidateNpiRegistry.mockResolvedValueOnce(validResult);

    const request = makeRequest("/api/npi/validate?npi=1234567893");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.npi).toBe("1234567893");
    expect(data.status).toBe("validated");
    expect(data.provider).toBeDefined();
    expect(data.provider.name).toBe("John Doe");
    expect(data.provider.type).toBe("individual");
    expect(data.provider.specialty).toBe("Internal Medicine");
  });

  it("returns 400 when npi query param is missing", async () => {
    const request = makeRequest("/api/npi/validate");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Missing");
  });

  it("handles NPPES API errors", async () => {
    mockValidateNpiRegistry.mockRejectedValueOnce(
      new nppesClient.NppesApiError("API down", 502, true)
    );

    const request = makeRequest("/api/npi/validate?npi=1234567893");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(502);
    expect(data.error).toBe("NPPES API error");
    expect(data.retryable).toBe(true);
  });

  it("handles unexpected errors with 500", async () => {
    mockValidateNpiRegistry.mockRejectedValueOnce(new Error("unexpected"));

    const request = makeRequest("/api/npi/validate?npi=1234567893");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal server error");
  });

  it("returns invalid status for bad NPI", async () => {
    const invalidResult = makeValidationResult({
      status: "invalid",
      reason: "NPI not found in NPPES registry",
      provider: undefined,
    });
    mockValidateNpiRegistry.mockResolvedValueOnce(invalidResult);

    const request = makeRequest("/api/npi/validate?npi=9999999999");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe("invalid");
    expect(data.provider).toBeUndefined();
  });
});

// ─── POST Tests (Single) ────────────────────────────────────────────────────

describe("POST /api/npi/validate (single)", () => {
  beforeEach(() => {
    mockValidateNpiRegistry.mockReset();
  });

  it("validates a single NPI from JSON body", async () => {
    const validResult = makeValidationResult();
    mockValidateNpiRegistry.mockResolvedValueOnce(validResult);

    const request = makeRequest("/api/npi/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ npi: "1234567893" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.npi).toBe("1234567893");
    expect(data.status).toBe("validated");
    expect(data.provider.name).toBe("John Doe");
  });

  it("returns 400 for invalid JSON body", async () => {
    const request = makeRequest("/api/npi/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Invalid JSON");
  });

  it("returns 400 for missing npi field", async () => {
    const request = makeRequest("/api/npi/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid request");
  });

  it("returns 400 for empty npi string", async () => {
    const request = makeRequest("/api/npi/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ npi: "" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid request");
  });
});

// ─── POST Tests (Batch) ─────────────────────────────────────────────────────

describe("POST /api/npi/validate (batch)", () => {
  beforeEach(() => {
    mockValidateNpiBatch.mockReset();
  });

  it("validates multiple NPIs from JSON body", async () => {
    mockValidateNpiBatch.mockResolvedValueOnce({
      results: [
        makeValidationResult({ npi: "1234567893" }),
        makeValidationResult({
          npi: "1245319599",
          status: "invalid",
          reason: "NPI not found",
          provider: undefined,
        }),
      ],
      summary: {
        total: 2,
        validated: 1,
        invalid: 1,
        deactivated: 0,
        organization: 0,
      },
    });

    const request = makeRequest("/api/npi/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ npis: ["1234567893", "1245319599"] }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.results).toHaveLength(2);
    expect(data.summary.total).toBe(2);
    expect(data.summary.validated).toBe(1);
    expect(data.summary.invalid).toBe(1);
  });

  it("returns 400 for empty npis array", async () => {
    const request = makeRequest("/api/npi/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ npis: [] }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid request");
  });

  it("returns 400 for npis array exceeding 100", async () => {
    const npis = Array(101).fill("1234567893");

    const request = makeRequest("/api/npi/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ npis }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid request");
  });

  it("handles NPPES API errors in batch mode", async () => {
    mockValidateNpiBatch.mockRejectedValueOnce(
      new nppesClient.NppesApiError("API failure", 502, true)
    );

    const request = makeRequest("/api/npi/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ npis: ["1234567893"] }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(502);
    expect(data.error).toBe("NPPES API error");
    expect(data.retryable).toBe(true);
  });
});

// ─── Response format ─────────────────────────────────────────────────────────

describe("response formatting", () => {
  beforeEach(() => {
    mockValidateNpiRegistry.mockReset();
  });

  it("formats provider location in response", async () => {
    const validResult = makeValidationResult();
    mockValidateNpiRegistry.mockResolvedValueOnce(validResult);

    const request = makeRequest("/api/npi/validate?npi=1234567893");
    const response = await GET(request);
    const data = await response.json();

    expect(data.provider.location).toEqual({
      city: "New York",
      state: "NY",
      postalCode: "100011234",
    });
  });

  it("returns null location when no practice address", async () => {
    const noAddressResult = makeValidationResult({
      provider: {
        ...makeValidationResult().provider!,
        practiceAddresses: [],
      },
    });
    mockValidateNpiRegistry.mockResolvedValueOnce(noAddressResult);

    const request = makeRequest("/api/npi/validate?npi=1234567893");
    const response = await GET(request);
    const data = await response.json();

    expect(data.provider.location).toBeNull();
  });

  it("includes cached flag in response", async () => {
    const cachedResult = makeValidationResult({ cached: true });
    mockValidateNpiRegistry.mockResolvedValueOnce(cachedResult);

    const request = makeRequest("/api/npi/validate?npi=1234567893");
    const response = await GET(request);
    const data = await response.json();

    expect(data.cached).toBe(true);
  });

  it("formats organization name for Type 2 NPI", async () => {
    const orgResult = makeValidationResult({
      status: "organization",
      reason: "NPI belongs to an organization: City Hospital",
      provider: {
        ...makeValidationResult().provider!,
        enumerationType: "organization",
        organizationName: "City Hospital",
        firstName: undefined,
        lastName: undefined,
      },
    });
    mockValidateNpiRegistry.mockResolvedValueOnce(orgResult);

    const request = makeRequest("/api/npi/validate?npi=1234567893");
    const response = await GET(request);
    const data = await response.json();

    expect(data.provider.name).toBe("City Hospital");
    expect(data.provider.type).toBe("organization");
  });
});
