/**
 * NPI Validation API endpoint.
 *
 * POST /api/npi/validate — Validate one or more NPIs
 *   Body: { npi: "1234567890" } or { npis: ["1234567890", "0987654321"] }
 *
 * GET /api/npi/validate?npi=1234567890 — Validate a single NPI
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  validateNpiRegistry,
  validateNpiBatch,
} from "@/services/npi-validation";
import { NppesApiError } from "@/services/nppes-client";
import type { NpiValidationResult } from "@/types/nppes";

// ─── Request Schemas ────────────────────────────────────────────────────────

const singleNpiSchema = z.object({
  npi: z.string().min(1, "NPI is required"),
});

const batchNpiSchema = z.object({
  npis: z
    .array(z.string().min(1))
    .min(1, "At least one NPI is required")
    .max(100, "Maximum 100 NPIs per request"),
});

const requestSchema = z.union([singleNpiSchema, batchNpiSchema]);

// ─── Response Helpers ───────────────────────────────────────────────────────

function formatSingleResult(result: NpiValidationResult) {
  return {
    npi: result.npi,
    status: result.status,
    reason: result.reason,
    cached: result.cached,
    validatedAt: result.validatedAt,
    ...(result.provider && {
      provider: {
        name: result.provider.enumerationType === "individual"
          ? [result.provider.firstName, result.provider.lastName]
              .filter(Boolean)
              .join(" ")
          : result.provider.organizationName,
        type: result.provider.enumerationType,
        specialty: result.provider.primaryTaxonomy?.description ?? null,
        credential: result.provider.credential ?? null,
        gender: result.provider.gender ?? null,
        enumerationDate: result.provider.enumerationDate,
        location: result.provider.practiceAddresses[0]
          ? {
              city: result.provider.practiceAddresses[0].city,
              state: result.provider.practiceAddresses[0].state,
              postalCode: result.provider.practiceAddresses[0].postalCode,
            }
          : null,
      },
    }),
  };
}

// ─── GET Handler ────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const npi = searchParams.get("npi");

  if (!npi) {
    return NextResponse.json(
      { error: "Missing required query parameter: npi" },
      { status: 400 }
    );
  }

  try {
    const result = await validateNpiRegistry(npi);
    return NextResponse.json(formatSingleResult(result));
  } catch (error) {
    return handleApiError(error);
  }
}

// ─── POST Handler ───────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body" },
      { status: 400 }
    );
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid request",
        details: parsed.error.issues.map((i) => i.message),
      },
      { status: 400 }
    );
  }

  try {
    // Single NPI
    if ("npi" in parsed.data) {
      const result = await validateNpiRegistry(parsed.data.npi);
      return NextResponse.json(formatSingleResult(result));
    }

    // Batch NPIs
    const batchResult = await validateNpiBatch(parsed.data.npis);
    return NextResponse.json({
      results: batchResult.results.map(formatSingleResult),
      summary: batchResult.summary,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// ─── Error Handling ─────────────────────────────────────────────────────────

function handleApiError(error: unknown): NextResponse {
  if (error instanceof NppesApiError) {
    const status = error.statusCode ?? 502;
    return NextResponse.json(
      {
        error: "NPPES API error",
        message: error.message,
        retryable: error.isRetryable,
      },
      { status: status >= 400 && status < 600 ? status : 502 }
    );
  }

  console.error("Unexpected error in NPI validation endpoint:", error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
