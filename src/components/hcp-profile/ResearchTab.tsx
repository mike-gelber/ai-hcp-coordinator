"use client";

import type { DemoHcpProfile } from "@/lib/demo-seed";
import { BookOpen, FlaskConical, Mic } from "lucide-react";

interface ResearchTabProps {
  profile: DemoHcpProfile;
}

export function ResearchTab({ profile }: ResearchTabProps) {
  const { research } = profile;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-surface-border bg-brand-400/10 p-4">
          <p className="text-xs font-medium text-brand-400">Publications</p>
          <p className="mt-1 text-2xl font-bold text-brand-300">
            {profile.digitalPresence.publicationCount}
          </p>
        </div>
        <div className="rounded-xl border border-surface-border bg-emerald-500/10 p-4">
          <p className="text-xs font-medium text-emerald-400">Clinical Trials</p>
          <p className="mt-1 text-2xl font-bold text-emerald-300">
            {research.clinicalTrials.length}
          </p>
        </div>
        <div className="rounded-xl border border-surface-border bg-amber-500/10 p-4">
          <p className="text-xs font-medium text-amber-400">Conference Appearances</p>
          <p className="mt-1 text-2xl font-bold text-amber-300">
            {research.conferenceAppearances.length}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-surface-border bg-surface-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-gray-500" />
          <h3 className="text-sm font-semibold text-white">Publications</h3>
          <span className="ml-auto text-xs text-gray-500">
            Showing {research.publications.length} of {profile.digitalPresence.publicationCount}
          </span>
        </div>
        {research.publications.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">No publications found.</p>
        ) : (
          <div className="space-y-3">
            {research.publications.map((pub, i) => (
              <div key={i} className="rounded-lg border border-surface-border p-4">
                <p className="text-sm font-medium text-white">{pub.title}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span className="font-medium text-brand-400">{pub.journal}</span>
                  <span>{pub.year}</span>
                  <span>{pub.citationCount} citations</span>
                  <span className="font-mono text-gray-500">DOI: {pub.doi}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-surface-border bg-surface-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-gray-500" />
          <h3 className="text-sm font-semibold text-white">Clinical Trials</h3>
        </div>
        {research.clinicalTrials.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">
            No clinical trial participation recorded.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="pb-2 pr-4 font-medium text-gray-500">Trial</th>
                  <th className="pb-2 pr-4 font-medium text-gray-500">Phase</th>
                  <th className="pb-2 pr-4 font-medium text-gray-500">Role</th>
                  <th className="pb-2 pr-4 font-medium text-gray-500">Status</th>
                  <th className="pb-2 font-medium text-gray-500">NCT ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border-subtle">
                {research.clinicalTrials.map((trial, i) => (
                  <tr key={i}>
                    <td className="py-2.5 pr-4 font-medium text-white max-w-[280px] truncate">
                      {trial.title}
                    </td>
                    <td className="py-2.5 pr-4 text-gray-400">{trial.phase}</td>
                    <td className="py-2.5 pr-4 text-gray-400">{trial.role}</td>
                    <td className="py-2.5 pr-4">
                      <TrialStatusBadge status={trial.status} />
                    </td>
                    <td className="py-2.5 font-mono text-xs text-gray-500">{trial.nctId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-surface-border bg-surface-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Mic className="h-5 w-5 text-gray-500" />
          <h3 className="text-sm font-semibold text-white">Conference Appearances</h3>
        </div>
        {research.conferenceAppearances.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">
            No conference appearances recorded.
          </p>
        ) : (
          <div className="space-y-3">
            {research.conferenceAppearances.map((conf, i) => (
              <div
                key={i}
                className="flex items-start justify-between rounded-lg border border-surface-border p-4"
              >
                <div>
                  <p className="text-sm font-medium text-white">{conf.conference}</p>
                  <p className="mt-1 text-xs text-gray-500">{conf.topic}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-surface-elevated px-2 py-0.5 text-xs font-medium text-gray-300">
                    {conf.type}
                  </span>
                  <span className="text-xs text-gray-500">{conf.year}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TrialStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Completed: "bg-emerald-500/15 text-emerald-400",
    Recruiting: "bg-cyan-500/15 text-cyan-400",
    Active: "bg-amber-500/15 text-amber-400",
    Terminated: "bg-rose-500/15 text-rose-400",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
        colors[status] || colors.Active
      }`}
    >
      {status}
    </span>
  );
}
