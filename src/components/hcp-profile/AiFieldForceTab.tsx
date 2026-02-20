"use client";

import type { DemoHcpProfile } from "@/lib/demo-seed";
import { AgentDialogue } from "@/components/AgentDialogue";
import { AGENT_PROFILES } from "@/types/agents";
import { Bot, Sparkles } from "lucide-react";

interface AiFieldForceTabProps {
  profile: DemoHcpProfile;
}

export function AiFieldForceTab({ profile }: AiFieldForceTabProps) {
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-6 dark:border-brand-800 dark:bg-brand-950">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-200 dark:bg-brand-800">
            <Sparkles className="h-5 w-5 text-brand-700 dark:text-brand-300" />
          </div>
          <div>
            <p className="text-xs font-medium text-brand-600 dark:text-brand-400">AI Field Force</p>
            <p className="text-lg font-bold text-brand-900 dark:text-brand-100">
              2 Active Agents Collaborating
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-brand-800 dark:text-brand-200">
          Two AI-powered field force agents are working on Dr. {profile.lastName}&apos;s engagement
          strategy. The <strong>Strategist</strong> analyzes data to determine the optimal approach,
          while the <strong>Outreach Specialist</strong> plans and executes multi-channel campaigns.
        </p>
      </div>

      {/* Agent Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {(["strategist", "outreach_specialist"] as const).map((role) => {
          const agent = AGENT_PROFILES[role];
          const isStrategist = role === "strategist";
          return (
            <div
              key={role}
              className={`rounded-xl border p-5 shadow-sm ${
                isStrategist
                  ? "border-brand-200 bg-white dark:border-brand-800 dark:bg-gray-900"
                  : "border-emerald-200 bg-white dark:border-emerald-800 dark:bg-gray-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{agent.avatar}</span>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{agent.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{agent.title}</p>
                </div>
                <div
                  className={`ml-auto flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                    isStrategist
                      ? "bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                  }`}
                >
                  <div
                    className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                      isStrategist ? "bg-brand-500" : "bg-emerald-500"
                    }`}
                  />
                  Active
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{agent.description}</p>
            </div>
          );
        })}
      </div>

      {/* Agent Dialogue */}
      <div
        className="relative flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        style={{ minHeight: "640px" }}
      >
        <AgentDialogue npi={profile.npi} />
      </div>
    </div>
  );
}
