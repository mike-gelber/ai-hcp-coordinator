/**
 * GET /api/outreach — List all outreach strategies with optional filters.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "20", 10)));

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const [plans, total] = await Promise.all([
      prisma.outreachPlan.findMany({
        where,
        include: {
          hcp: {
            select: {
              id: true,
              npi: true,
              firstName: true,
              lastName: true,
              primarySpecialty: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.outreachPlan.count({ where }),
    ]);

    const data = plans.map((plan) => ({
      id: plan.id,
      hcpId: plan.hcpId,
      hcpName: `${plan.hcp.firstName} ${plan.hcp.lastName}`,
      hcpNpi: plan.hcp.npi,
      hcpSpecialty: plan.hcp.primarySpecialty,
      status: plan.status,
      channelMix: plan.channelMix,
      persona: plan.persona,
      createdAt: plan.createdAt.toISOString(),
      updatedAt: plan.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error listing outreach strategies:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to list outreach strategies",
      },
      { status: 500 },
    );
  }
}
