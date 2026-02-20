"use client";

import type { DemoHcpProfile } from "@/lib/demo-seed";
import { Database, Shield } from "lucide-react";

interface DataSourcesTabProps {
  profile: DemoHcpProfile;
}

export function DataSourcesTab({ profile }: DataSourcesTabProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-surface-border bg-surface-card p-6">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-gray-500" />
          <h3 className="text-sm font-semibold text-white">Data Provenance & Audit Trail</h3>
        </div>
        <p className="mt-2 text-sm text-gray-400">
          Every data point in this profile is tracked back to its source. This audit trail shows
          where each piece of information was collected from, when it was last updated, and the
          confidence level of the data.
        </p>
      </div>

      <div className="rounded-xl border border-surface-border bg-surface-card">
        <div className="border-b border-surface-border p-6">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-gray-500" />
            <h3 className="text-sm font-semibold text-white">Source Mapping</h3>
            <span className="ml-auto text-xs text-gray-500">
              {profile.dataSources.length} tracked fields
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-surface-border bg-surface-base/50">
                <th className="whitespace-nowrap px-6 py-3 font-medium text-gray-500">
                  Data Field
                </th>
                <th className="whitespace-nowrap px-6 py-3 font-medium text-gray-500">Source</th>
                <th className="whitespace-nowrap px-6 py-3 font-medium text-gray-500">
                  Last Updated
                </th>
                <th className="whitespace-nowrap px-6 py-3 font-medium text-gray-500">
                  Confidence
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border-subtle">
              {profile.dataSources.map((source, i) => (
                <tr key={i} className="hover:bg-surface-hover transition-colors">
                  <td className="whitespace-nowrap px-6 py-3.5 font-medium text-white">
                    {source.field}
                  </td>
                  <td className="px-6 py-3.5 text-gray-400">{source.source}</td>
                  <td className="whitespace-nowrap px-6 py-3.5 text-gray-400">
                    {source.lastUpdated}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3.5">
                    <ConfidenceBadge level={source.confidence} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ConfidenceBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    high: "bg-emerald-500/15 text-emerald-400",
    medium: "bg-amber-500/15 text-amber-400",
    low: "bg-rose-500/15 text-rose-400",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
        colors[level] || colors.medium
      }`}
    >
      {level}
    </span>
  );
}
