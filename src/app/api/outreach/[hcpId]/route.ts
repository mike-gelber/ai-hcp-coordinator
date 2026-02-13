/**
 * GET /api/outreach/:hcpId — Retrieve outreach strategy for a specific HCP.
 * DELETE /api/outreach/:hcpId — Delete outreach strategies for a specific HCP.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { OutreachStrategy } from "@/types/outreach";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ hcpId: string }> }
) {
  try {
    const { hcpId } = await params;

    // Verify HCP exists
    const hcp = await prisma.hcpProfile.findUnique({
      where: { id: hcpId },
      select: { id: true, npi: true, firstName: true, lastName: true },
    });

    if (!hcp) {
      return NextResponse.json(
        { success: false, error: `HCP not found: ${hcpId}` },
        { status: 404 }
      );
    }

    // Get the latest outreach plan
    const plan = await prisma.outreachPlan.findFirst({
      where: { hcpId },
      orderBy: { updatedAt: "desc" },
    });

    if (!plan || !plan.strategy) {
      return NextResponse.json(
        {
          success: false,
          error: "No outreach strategy found for this HCP. Generate one first via POST /api/outreach/generate.",
          hcp: {
            id: hcp.id,
            npi: hcp.npi,
            name: `${hcp.firstName} ${hcp.lastName}`,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      strategy: plan.strategy as unknown as OutreachStrategy,
      planId: plan.id,
      status: plan.status,
      channelMix: plan.channelMix,
      createdAt: plan.createdAt.toISOString(),
      updatedAt: plan.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error retrieving outreach strategy:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to retrieve outreach strategy",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ hcpId: string }> }
) {
  try {
    const { hcpId } = await params;

    const deleted = await prisma.outreachPlan.deleteMany({
      where: { hcpId },
    });

    return NextResponse.json({
      success: true,
      message: `Deleted ${deleted.count} outreach plan(s) for HCP ${hcpId}`,
      deletedCount: deleted.count,
    });
  } catch (error) {
    console.error("Error deleting outreach strategies:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete outreach strategies",
      },
      { status: 500 }
    );
  }
}
