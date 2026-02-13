import { NextRequest, NextResponse } from "next/server";
import { getDemoProfiles } from "@/lib/demo-seed";

/**
 * GET /api/demo/profiles/[npi] — Get a single demo HCP profile by NPI.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ npi: string }> }
) {
  const { npi } = await params;
  const profiles = getDemoProfiles();
  const profile = profiles.find((p) => p.npi === npi);

  if (!profile) {
    return NextResponse.json(
      { error: "Profile not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(profile);
}
