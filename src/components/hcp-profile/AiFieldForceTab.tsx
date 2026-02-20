"use client";

import type { DemoHcpProfile } from "@/lib/demo-seed";
import { AgentDialogue } from "@/components/AgentDialogue";
import { AGENT_PROFILES } from "@/types/agents";
import { Sparkles } from "lucide-react";

interface AiFieldForceTabProps {
  profile: DemoHcpProfile;
}

export function AiFieldForceTab({ profile }: AiFieldForceTabProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-brand-400/30 bg-brand-400/5 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-400/20">
            <Sparkles className="h-5 w-5 text-brand-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-brand-400">AI Field Force</p>
            <p className="text-lg font-bold text-white">2 Active Agents Collaborating</p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-gray-300">
          Two AI-powered field force agents are working on Dr. {profile.lastName}&apos;s engagement
          strategy. The <strong className="text-white">Strategist</strong> analyzes data to
          determine the optimal approach, while the{" "}
          <strong className="text-white">Outreach Specialist</strong> plans and executes
          multi-channel campaigns.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {(["strategist", "outreach_specialist"] as const).map((role) => {
          const agent = AGENT_PROFILES[role];
          const isStrategist = role === "strategist";
          return (
            <div
              key={role}
              className={`rounded-xl border p-5 ${
                isStrategist
                  ? "border-brand-400/30 bg-surface-card"
                  : "border-emerald-500/30 bg-surface-card"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{agent.avatar}</span>
                <div>
                  <p className="text-sm font-bold text-white">{agent.name}</p>
                  <p className="text-xs text-gray-500">{agent.title}</p>
                </div>
                <div
                  className={`ml-auto flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                    isStrategist
                      ? "bg-brand-400/10 text-brand-400"
                      : "bg-emerald-500/10 text-emerald-400"
                  }`}
                >
                  <div
                    className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                      isStrategist ? "bg-brand-400" : "bg-emerald-500"
                    }`}
                  />
                  Active
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-400">{agent.description}</p>
            </div>
          );
        })}
      </div>

      <div
        className="relative flex flex-col rounded-xl border border-surface-border bg-surface-card"
        style={{ minHeight: "640px" }}
      >
        <AgentDialogue npi={profile.npi} />
      </div>
    </div>
  );
}
