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
      <div className="grid gap-4 sm:grid-cols-3">
        <MiniStat
          label="Prescribing Volume"
          value={prescribingProfile.prescribingVolume}
          color={
            prescribingProfile.prescribingVolume === "high"
              ? "emerald"
              : prescribingProfile.prescribingVolume === "medium"
                ? "cyan"
                : "gray"
          }
        />
        <MiniStat
          label="Brand vs Generic"
          value={prescribingProfile.brandVsGeneric.replace("-", " ")}
          color="brand"
        />
        <MiniStat
          label="Top Therapeutic Area"
          value={prescribingProfile.topTherapeuticArea}
          color="amber"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-surface-border bg-surface-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Pill className="h-5 w-5 text-gray-500" />
            <h3 className="text-sm font-semibold text-white">Top Prescribed Drugs</h3>
          </div>
          <div className="space-y-3">
            {prescribingProfile.topDrugs.map((drug) => {
              const maxVol = Math.max(...prescribingProfile.topDrugs.map((d) => d.rxVolume));
              const pct = (drug.rxVolume / maxVol) * 100;
              return (
                <div key={drug.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium text-white">{drug.name}</span>
                      <span className="ml-2 text-xs text-gray-500">{drug.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">{drug.rxVolume} Rx/mo</span>
                      <TrendIcon trend={drug.trend} />
                    </div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-elevated">
                    <div
                      className="h-full rounded-full bg-brand-400 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-surface-border bg-surface-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gray-500" />
            <h3 className="text-sm font-semibold text-white">Therapeutic Areas</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {prescribingProfile.therapeuticAreas.map((area) => (
              <span
                key={area}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                  area === prescribingProfile.topTherapeuticArea
                    ? "bg-brand-400/10 text-brand-400"
                    : "bg-surface-elevated text-gray-300"
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

      <div className="rounded-xl border border-surface-border bg-surface-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-gray-500" />
            <h3 className="text-sm font-semibold text-white">Open Payments Data</h3>
          </div>
          <span className="text-sm font-medium text-gray-400">
            Total: ${totalPayments.toLocaleString()}
          </span>
        </div>
        {prescribingProfile.openPayments.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-4">No Open Payments records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="pb-2 pr-4 font-medium text-gray-500">Year</th>
                  <th className="pb-2 pr-4 font-medium text-gray-500">Company</th>
                  <th className="pb-2 pr-4 font-medium text-gray-500">Category</th>
                  <th className="pb-2 text-right font-medium text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border-subtle">
                {prescribingProfile.openPayments.map((payment, i) => (
                  <tr key={i}>
                    <td className="py-2.5 pr-4 text-gray-400">{payment.year}</td>
                    <td className="py-2.5 pr-4 font-medium text-white">{payment.company}</td>
                    <td className="py-2.5 pr-4">
                      <span className="rounded-full bg-surface-elevated px-2 py-0.5 text-xs font-medium text-gray-300">
                        {payment.category}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-medium text-white">
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
    emerald: "bg-emerald-500/10 text-emerald-400",
    cyan: "bg-cyan-500/10 text-cyan-400",
    gray: "bg-surface-elevated text-gray-300",
    brand: "bg-brand-400/10 text-brand-400",
    amber: "bg-amber-500/10 text-amber-400",
  };

  return (
    <div
      className={`rounded-xl border border-surface-border p-4 ${colorMap[color] || colorMap.gray}`}
    >
      <p className="text-xs font-medium opacity-70">{label}</p>
      <p className="mt-1 text-lg font-bold capitalize">{value}</p>
    </div>
  );
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "increasing") return <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />;
  if (trend === "decreasing")
    return <TrendingUp className="h-3.5 w-3.5 rotate-180 text-rose-400" />;
  return <span className="text-xs text-gray-500">--</span>;
}
