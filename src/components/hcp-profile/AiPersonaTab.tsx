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
      {/* Archetype Badge + Executive Summary */}
      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-800 dark:bg-indigo-950">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-200 dark:bg-indigo-800">
            <Brain className="h-5 w-5 text-indigo-700 dark:text-indigo-300" />
          </div>
          <div>
            <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
              AI-Generated Archetype
            </p>
            <p className="text-lg font-bold text-indigo-900 dark:text-indigo-100">
              {aiPersona.archetype}
            </p>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-white/60 p-4 dark:bg-gray-900/40">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Executive Summary</p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {aiPersona.executiveSummary}
          </p>
        </div>
      </div>

      {/* Persona Narrative */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center gap-2">
          <Brain className="h-5 w-5 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Persona Narrative</h3>
          <span className="ml-auto rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
            AI Generated
          </span>
        </div>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {aiPersona.narrative}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Key Motivators */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Key Motivators</h3>
          </div>
          <div className="space-y-2">
            {aiPersona.keyMotivators.map((motivator, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-800"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                  {i + 1}
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{motivator}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Communication Preferences */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Communication Preferences
            </h3>
          </div>
          <div className="space-y-2">
            {aiPersona.communicationPreferences.map((pref, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-800"
              >
                <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{pref}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Preferred Channels */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Preferred Channels
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {aiPersona.preferredChannels.map((channel) => (
              <span
                key={channel}
                className="rounded-full bg-indigo-100 px-3 py-1.5 text-sm font-medium capitalize text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
              >
                {channel}
              </span>
            ))}
          </div>
        </div>

        {/* Best Time to Reach */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Best Time to Reach
            </h3>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-emerald-50 px-4 py-3 dark:bg-emerald-950">
            <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              {aiPersona.bestTimeToReach}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
