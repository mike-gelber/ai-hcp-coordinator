/**
 * POST /api/outreach/generate — Generate outreach strategy for a single HCP.
 * POST /api/outreach/generate?batch=true — Generate strategies for multiple HCPs.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  generateAndPersistStrategy,
  generateStrategiesBatch,
} from "@/services/outreach-strategy";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const isBatch = request.nextUrl.searchParams.get("batch") === "true";

    if (isBatch) {
      return handleBatchGenerate(body);
    }

    return handleSingleGenerate(body);
  } catch (error) {
    console.error("Outreach strategy generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate outreach strategy",
      },
      { status: 500 }
    );
  }
}

async function handleSingleGenerate(body: {
  hcpId?: string;
  forceRegenerate?: boolean;
  useAI?: boolean;
}) {
  const { hcpId, forceRegenerate, useAI } = body;

  if (!hcpId || typeof hcpId !== "string") {
    return NextResponse.json(
      { success: false, error: "hcpId is required" },
      { status: 400 }
    );
  }

  const result = await generateAndPersistStrategy(hcpId, {
    forceRegenerate,
    useAI,
  });

  if (!result.success) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json(result);
}

async function handleBatchGenerate(body: {
  hcpIds?: string[];
  forceRegenerate?: boolean;
  useAI?: boolean;
}) {
  const { hcpIds, forceRegenerate, useAI } = body;

  if (!hcpIds || !Array.isArray(hcpIds) || hcpIds.length === 0) {
    return NextResponse.json(
      { success: false, error: "hcpIds array is required and must not be empty" },
      { status: 400 }
    );
  }

  if (hcpIds.length > 100) {
    return NextResponse.json(
      {
        success: false,
        error: "Batch size limited to 100 HCPs per request",
      },
      { status: 400 }
    );
  }

  const result = await generateStrategiesBatch(hcpIds, {
    forceRegenerate,
    useAI,
  });

  return NextResponse.json({
    success: true,
    ...result,
  });
}
