"use client";

import { useEffect, useState, useCallback } from "react";
import { DemoBanner } from "@/components/DemoBanner";
import { StatCard } from "@/components/StatCard";
import { HcpTable } from "@/components/HcpTable";
import { HcpProfilePanel } from "@/components/HcpProfilePanel";
import { SpecialtyChart } from "@/components/SpecialtyChart";
import type { DemoHcpProfile } from "@/lib/demo-seed";
import { FlaskConical, Users, TrendingUp, Award, BarChart3, Upload, RotateCcw } from "lucide-react";

interface DemoStats {
  total: number;
  bySpecialty: Array<{ name: string; count: number }>;
  byState: Array<{ name: string; count: number }>;
  kolCount: number;
  highVolumeCount: number;
  avgYearsInPractice: number;
}

export default function DashboardPage() {
  const [demoActive, setDemoActive] = useState(false);
  const [stats, setStats] = useState<DemoStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<DemoHcpProfile | null>(null);

  const activateDemo = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/demo", { method: "POST" });
      const json = await res.json();
      setStats(json.stats);
      setDemoActive(true);
    } catch (err) {
      console.error("Failed to activate demo:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetDemo = useCallback(async () => {
    try {
      await fetch("/api/demo", { method: "DELETE" });
      setDemoActive(false);
      setStats(null);
      setSelectedProfile(null);
    } catch (err) {
      console.error("Failed to reset demo:", err);
    }
  }, []);

  // Auto-load demo on mount for demo purposes
  useEffect(() => {
    activateDemo();
  }, [activateDemo]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Demo Banner */}
      {demoActive && stats && <DemoBanner onReset={resetDemo} profileCount={stats.total} />}

      {/* Header */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI HCP Field Force</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Campaign Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            {!demoActive && (
              <button
                onClick={activateDemo}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50 transition-colors"
              >
                <FlaskConical className="h-4 w-4" />
                {loading ? "Loading..." : "Enter Demo Mode"}
              </button>
            )}
            <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">
              <Upload className="h-4 w-4" />
              Upload NPI List
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {!demoActive && !loading ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="rounded-full bg-gray-100 p-6 dark:bg-gray-800">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
              No HCP profiles loaded
            </h2>
            <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
              Upload an NPI target list to get started, or enter Demo Mode to explore the platform
              with 1,000 sample HCP profiles.
            </p>
            <div className="mt-8 flex gap-4">
              <button
                onClick={activateDemo}
                className="flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
              >
                <FlaskConical className="h-4 w-4" />
                Enter Demo Mode
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
                <Upload className="h-4 w-4" />
                Upload NPI List
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            <p className="mt-4 text-sm text-gray-500">Loading demo data...</p>
          </div>
        ) : stats ? (
          /* Dashboard content */
          <div className="space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <StatCard
                label="Total HCPs"
                value={stats.total}
                sublabel="in target list"
                color="indigo"
              />
              <StatCard
                label="Key Opinion Leaders"
                value={stats.kolCount}
                sublabel={`${((stats.kolCount / stats.total) * 100).toFixed(1)}% of total`}
                color="amber"
              />
              <StatCard
                label="High Volume"
                value={stats.highVolumeCount}
                sublabel="prescribers"
                color="emerald"
              />
              <StatCard
                label="Avg Experience"
                value={`${stats.avgYearsInPractice} yrs`}
                sublabel="years in practice"
                color="sky"
              />
              <StatCard
                label="Specialties"
                value={stats.bySpecialty.length}
                sublabel="represented"
                color="rose"
              />
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Profiles by Specialty
                  </h3>
                </div>
                <SpecialtyChart data={stats.bySpecialty} maxItems={10} />
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Profiles by State
                  </h3>
                </div>
                <SpecialtyChart data={stats.byState} maxItems={10} />
              </div>
            </div>

            {/* Pipeline Status */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-gray-400" />
                Pipeline Status
              </h3>
              <div className="flex items-center gap-2">
                {[
                  { label: "Ingested", count: stats.total, color: "bg-indigo-500" },
                  { label: "Validated", count: 0, color: "bg-sky-500" },
                  { label: "Enriched", count: 0, color: "bg-emerald-500" },
                  { label: "Strategy Generated", count: 0, color: "bg-amber-500" },
                  { label: "Outreach Active", count: 0, color: "bg-purple-500" },
                ].map((stage, i) => (
                  <div key={stage.label} className="flex flex-1 flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${stage.count > 0 ? stage.color : "bg-gray-300 dark:bg-gray-700"}`}
                    >
                      {stage.count > 0 ? "✓" : i + 1}
                    </div>
                    <p className="mt-2 text-center text-xs text-gray-600 dark:text-gray-400">
                      {stage.label}
                    </p>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                      {stage.count.toLocaleString()}
                    </p>
                    {i < 4 && <div className="absolute" />}
                  </div>
                ))}
              </div>
            </div>

            {/* HCP Table */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                  <Award className="h-5 w-5 text-gray-400" />
                  HCP Target List
                </h3>
                <button
                  onClick={resetDemo}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset Demo Data
                </button>
              </div>
              <HcpTable onProfileClick={setSelectedProfile} />
            </div>
          </div>
        ) : null}
      </main>

      {/* Profile Panel */}
      {selectedProfile && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setSelectedProfile(null)}
          />
          <HcpProfilePanel profile={selectedProfile} onClose={() => setSelectedProfile(null)} />
        </>
      )}
    </div>
  );
}
