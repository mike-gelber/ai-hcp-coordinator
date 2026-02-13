/**
 * Types for the AI Field Force agents system.
 *
 * Two agents collaborate on each HCP:
 *   - Strategist: Analyzes data to determine the best engagement approach
 *   - Outreach Specialist: Plans and executes outreach, reports results
 */

export type AgentRole = "strategist" | "outreach_specialist";

export interface AgentMessage {
  id: string;
  role: AgentRole;
  content: string;
  timestamp: string;
  /** Optional structured data attached to the message */
  metadata?: {
    type?: "analysis" | "recommendation" | "action" | "report" | "question";
    confidence?: number;
    channels?: string[];
    tags?: string[];
  };
}

export interface AgentProfile {
  role: AgentRole;
  name: string;
  title: string;
  description: string;
  avatar: string; // emoji or icon identifier
  color: string; // tailwind color prefix
}

export interface AgentDialogueSession {
  hcpNpi: string;
  messages: AgentMessage[];
  status: "idle" | "active" | "completed";
  startedAt: string;
  updatedAt: string;
}

/** The two agent personas */
export const AGENT_PROFILES: Record<AgentRole, AgentProfile> = {
  strategist: {
    role: "strategist",
    name: "Dr. Strategy",
    title: "Engagement Strategist",
    description:
      "Analyzes HCP data — prescribing patterns, digital footprint, affiliations, and KOL status — to craft the optimal engagement strategy.",
    avatar: "🧠",
    color: "indigo",
  },
  outreach_specialist: {
    role: "outreach_specialist",
    name: "Alex Outreach",
    title: "Outreach Specialist",
    description:
      "Executes multi-channel outreach campaigns, reports on engagement results, and collaborates on strategy refinements.",
    avatar: "📡",
    color: "emerald",
  },
};
