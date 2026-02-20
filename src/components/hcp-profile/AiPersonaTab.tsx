"use client";

import type { DemoHcpProfile } from "@/lib/demo-seed";
import { Brain, Target, MessageSquare, Clock, Zap } from "lucide-react";

interface AiPersonaTabProps {
  profile: DemoHcpProfile;
}

export function AiPersonaTab({ profile }: AiPersonaTabProps) {
  const { aiPersona } = profile;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-brand-400/30 bg-brand-400/5 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-400/20">
            <Brain className="h-5 w-5 text-brand-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-brand-400">AI-Generated Archetype</p>
            <p className="text-lg font-bold text-white">{aiPersona.archetype}</p>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-surface-card/60 p-4">
          <p className="text-sm font-medium text-gray-300">Executive Summary</p>
          <p className="mt-1 text-sm text-gray-400 leading-relaxed">{aiPersona.executiveSummary}</p>
        </div>
      </div>

      <div className="rounded-xl border border-surface-border bg-surface-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Brain className="h-5 w-5 text-gray-500" />
          <h3 className="text-sm font-semibold text-white">Persona Narrative</h3>
          <span className="ml-auto rounded-full bg-brand-400/10 px-2 py-0.5 text-xs font-medium text-brand-400">
            AI Generated
          </span>
        </div>
        <p className="text-sm leading-relaxed text-gray-300">{aiPersona.narrative}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-surface-border bg-surface-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-gray-500" />
            <h3 className="text-sm font-semibold text-white">Key Motivators</h3>
          </div>
          <div className="space-y-2">
            {aiPersona.keyMotivators.map((motivator, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg bg-surface-elevated px-4 py-3"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-xs font-bold text-amber-400">
                  {i + 1}
                </div>
                <span className="text-sm text-gray-300">{motivator}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-surface-border bg-surface-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-gray-500" />
            <h3 className="text-sm font-semibold text-white">Communication Preferences</h3>
          </div>
          <div className="space-y-2">
            {aiPersona.communicationPreferences.map((pref, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-lg bg-surface-elevated px-4 py-3"
              >
                <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-400" />
                <span className="text-sm text-gray-300">{pref}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-surface-border bg-surface-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-gray-500" />
            <h3 className="text-sm font-semibold text-white">Preferred Channels</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {aiPersona.preferredChannels.map((channel) => (
              <span
                key={channel}
                className="rounded-full bg-brand-400/10 px-3 py-1.5 text-sm font-medium capitalize text-brand-400"
              >
                {channel}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-surface-border bg-surface-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <h3 className="text-sm font-semibold text-white">Best Time to Reach</h3>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-brand-400/10 px-4 py-3">
            <Clock className="h-5 w-5 text-brand-400" />
            <span className="text-sm font-medium text-brand-300">{aiPersona.bestTimeToReach}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
