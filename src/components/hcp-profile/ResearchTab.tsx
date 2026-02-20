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
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-brand-50 p-4 dark:bg-brand-950">
          <p className="text-xs font-medium text-brand-600 dark:text-brand-400">Publications</p>
          <p className="mt-1 text-2xl font-bold text-brand-700 dark:text-brand-300">
            {profile.digitalPresence.publicationCount}
          </p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950">
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Clinical Trials
          </p>
          <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">
            {research.clinicalTrials.length}
          </p>
        </div>
        <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-950">
          <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
            Conference Appearances
          </p>
          <p className="mt-1 text-2xl font-bold text-amber-700 dark:text-amber-300">
            {research.conferenceAppearances.length}
          </p>
        </div>
      </div>

      {/* Publications */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Publications</h3>
          <span className="ml-auto text-xs text-gray-400">
            Showing {research.publications.length} of {profile.digitalPresence.publicationCount}
          </span>
        </div>
        {research.publications.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-400">No publications found.</p>
        ) : (
          <div className="space-y-3">
            {research.publications.map((pub, i) => (
              <div key={i} className="rounded-lg border border-gray-100 p-4 dark:border-gray-800">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{pub.title}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-brand-600 dark:text-brand-400">
                    {pub.journal}
                  </span>
                  <span>{pub.year}</span>
                  <span>{pub.citationCount} citations</span>
                  <span className="font-mono text-gray-400">DOI: {pub.doi}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clinical Trials */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Clinical Trials</h3>
        </div>
        {research.clinicalTrials.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-400">
            No clinical trial participation recorded.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-2 pr-4 font-medium text-gray-500 dark:text-gray-400">Trial</th>
                  <th className="pb-2 pr-4 font-medium text-gray-500 dark:text-gray-400">Phase</th>
                  <th className="pb-2 pr-4 font-medium text-gray-500 dark:text-gray-400">Role</th>
                  <th className="pb-2 pr-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="pb-2 font-medium text-gray-500 dark:text-gray-400">NCT ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {research.clinicalTrials.map((trial, i) => (
                  <tr key={i}>
                    <td className="py-2.5 pr-4 font-medium text-gray-900 dark:text-white max-w-[280px] truncate">
                      {trial.title}
                    </td>
                    <td className="py-2.5 pr-4 text-gray-600 dark:text-gray-400">{trial.phase}</td>
                    <td className="py-2.5 pr-4 text-gray-600 dark:text-gray-400">{trial.role}</td>
                    <td className="py-2.5 pr-4">
                      <TrialStatusBadge status={trial.status} />
                    </td>
                    <td className="py-2.5 font-mono text-xs text-gray-500 dark:text-gray-400">
                      {trial.nctId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Conference Appearances */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center gap-2">
          <Mic className="h-5 w-5 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Conference Appearances
          </h3>
        </div>
        {research.conferenceAppearances.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-400">
            No conference appearances recorded.
          </p>
        ) : (
          <div className="space-y-3">
            {research.conferenceAppearances.map((conf, i) => (
              <div
                key={i}
                className="flex items-start justify-between rounded-lg border border-gray-100 p-4 dark:border-gray-800"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {conf.conference}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{conf.topic}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {conf.type}
                  </span>
                  <span className="text-xs text-gray-400">{conf.year}</span>
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
    Completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    Recruiting: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
    Active: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    Terminated: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
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
