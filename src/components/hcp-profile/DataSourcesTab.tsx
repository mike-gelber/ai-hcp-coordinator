"use client";

import type { DemoHcpProfile } from "@/lib/demo-seed";
import { Database, Shield } from "lucide-react";

interface DataSourcesTabProps {
  profile: DemoHcpProfile;
}

export function DataSourcesTab({ profile }: DataSourcesTabProps) {
  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Data Provenance & Audit Trail
          </h3>
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Every data point in this profile is tracked back to its source. This audit trail shows
          where each piece of information was collected from, when it was last updated, and the
          confidence level of the data.
        </p>
      </div>

      {/* Audit Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 p-6 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Source Mapping</h3>
            <span className="ml-auto text-xs text-gray-400">
              {profile.dataSources.length} tracked fields
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-950">
                <th className="whitespace-nowrap px-6 py-3 font-medium text-gray-500 dark:text-gray-400">
                  Data Field
                </th>
                <th className="whitespace-nowrap px-6 py-3 font-medium text-gray-500 dark:text-gray-400">
                  Source
                </th>
                <th className="whitespace-nowrap px-6 py-3 font-medium text-gray-500 dark:text-gray-400">
                  Last Updated
                </th>
                <th className="whitespace-nowrap px-6 py-3 font-medium text-gray-500 dark:text-gray-400">
                  Confidence
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {profile.dataSources.map((source, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="whitespace-nowrap px-6 py-3.5 font-medium text-gray-900 dark:text-white">
                    {source.field}
                  </td>
                  <td className="px-6 py-3.5 text-gray-600 dark:text-gray-400">{source.source}</td>
                  <td className="whitespace-nowrap px-6 py-3.5 text-gray-600 dark:text-gray-400">
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
    high: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    low: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
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
