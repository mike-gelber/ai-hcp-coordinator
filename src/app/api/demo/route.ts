import { NextResponse } from "next/server";
import { getDemoProfiles, getDemoStats } from "@/lib/demo-seed";

/**
 * GET /api/demo — Get demo mode status and stats.
 */
export async function GET() {
  const stats = getDemoStats();
  return NextResponse.json({
    active: true,
    stats,
  });
}

/**
 * POST /api/demo — Activate demo mode, return the loaded profiles.
 */
export async function POST() {
  const profiles = getDemoProfiles();
  const stats = getDemoStats();

  return NextResponse.json({
    success: true,
    message: `Demo mode activated with ${profiles.length} HCP profiles`,
    stats,
  });
}

/**
 * DELETE /api/demo — Reset demo mode.
 */
export async function DELETE() {
  return NextResponse.json({
    success: true,
    message: "Demo mode reset. All demo data cleared.",
  });
}
