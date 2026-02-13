"use client";

import type { DemoHcpProfile } from "@/lib/demo-seed";
import { Pill, TrendingUp, DollarSign, BarChart3 } from "lucide-react";

interface PrescribingTabProps {
  profile: DemoHcpProfile;
}

export function PrescribingTab({ profile }: PrescribingTabProps) {
  const { prescribingProfile } = profile;
  const totalPayments = prescribingProfile.openPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MiniStat
          label="Prescribing Volume"
          value={prescribingProfile.prescribingVolume}
          color={
            prescribingProfile.prescribingVolume === "high"
              ? "emerald"
              : prescribingProfile.prescribingVolume === "medium"
                ? "sky"
                : "gray"
          }
        />
        <MiniStat
          label="Brand vs Generic"
          value={prescribingProfile.brandVsGeneric.replace("-", " ")}
          color="indigo"
        />
        <MiniStat
          label="Top Therapeutic Area"
          value={prescribingProfile.topTherapeuticArea}
          color="amber"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Prescribed Drugs */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-2">
            <Pill className="h-5 w-5 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Top Prescribed Drugs
            </h3>
          </div>
          <div className="space-y-3">
            {prescribingProfile.topDrugs.map((drug, i) => {
              const maxVol = Math.max(...prescribingProfile.topDrugs.map((d) => d.rxVolume));
              const pct = (drug.rxVolume / maxVol) * 100;
              return (
                <div key={drug.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">{drug.name}</span>
                      <span className="ml-2 text-xs text-gray-400">{drug.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        {drug.rxVolume} Rx/mo
                      </span>
                      <TrendIcon trend={drug.trend} />
                    </div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Therapeutic Areas */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Therapeutic Areas
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {prescribingProfile.therapeuticAreas.map((area) => (
              <span
                key={area}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                  area === prescribingProfile.topTherapeuticArea
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {area}
                {area === prescribingProfile.topTherapeuticArea && (
                  <span className="ml-1 text-xs opacity-60">(primary)</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Open Payments */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Open Payments Data
            </h3>
          </div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total: ${totalPayments.toLocaleString()}
          </span>
        </div>
        {prescribingProfile.openPayments.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-4">No Open Payments records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-2 pr-4 font-medium text-gray-500 dark:text-gray-400">Year</th>
                  <th className="pb-2 pr-4 font-medium text-gray-500 dark:text-gray-400">
                    Company
                  </th>
                  <th className="pb-2 pr-4 font-medium text-gray-500 dark:text-gray-400">
                    Category
                  </th>
                  <th className="pb-2 text-right font-medium text-gray-500 dark:text-gray-400">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {prescribingProfile.openPayments.map((payment, i) => (
                  <tr key={i}>
                    <td className="py-2.5 pr-4 text-gray-600 dark:text-gray-400">{payment.year}</td>
                    <td className="py-2.5 pr-4 font-medium text-gray-900 dark:text-white">
                      {payment.company}
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        {payment.category}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-medium text-gray-900 dark:text-white">
                      ${payment.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    sky: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
    gray: "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    indigo: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  };

  return (
    <div className={`rounded-xl p-4 ${colorMap[color] || colorMap.gray}`}>
      <p className="text-xs font-medium opacity-70">{label}</p>
      <p className="mt-1 text-lg font-bold capitalize">{value}</p>
    </div>
  );
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "increasing") return <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />;
  if (trend === "decreasing")
    return <TrendingUp className="h-3.5 w-3.5 rotate-180 text-rose-500" />;
  return <span className="text-xs text-gray-400">--</span>;
}
