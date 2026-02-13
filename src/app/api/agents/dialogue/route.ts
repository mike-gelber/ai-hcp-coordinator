import { NextRequest, NextResponse } from "next/server";
import { getDemoProfiles } from "@/lib/demo-seed";
import { generateAgentDialogue } from "@/lib/agent-conversation";

/**
 * GET /api/agents/dialogue?npi=<NPI>
 *
 * Returns the AI Field Force agent dialogue for a given HCP.
 * The dialogue is a conversation between the Strategist and
 * Outreach Specialist agents, tailored to the HCP's profile.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const npi = searchParams.get("npi");

  if (!npi) {
    return NextResponse.json(
      { error: "Missing required parameter: npi" },
      { status: 400 }
    );
  }

  const profiles = getDemoProfiles();
  const profile = profiles.find((p) => p.npi === npi);

  if (!profile) {
    return NextResponse.json(
      { error: `No HCP found with NPI: ${npi}` },
      { status: 404 }
    );
  }

  const messages = generateAgentDialogue(profile);

  return NextResponse.json({
    hcpNpi: npi,
    messages,
    status: "completed",
    startedAt: messages[0]?.timestamp ?? new Date().toISOString(),
    updatedAt: messages[messages.length - 1]?.timestamp ?? new Date().toISOString(),
  });
}
