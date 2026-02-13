"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Scale,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  XCircle,
  Shield,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import type { PatentabilityAssessment, Signal } from "@/types/assessment";

const signalConfig: Record<
  Signal,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: typeof CheckCircle;
    description: string;
  }
> = {
  likely: {
    label: "Likely Patentable",
    color: "text-emerald-700 dark:text-emerald-300",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    icon: CheckCircle,
    description: "Your idea shows promising signs of patentability.",
  },
  unclear: {
    label: "Further Analysis Needed",
    color: "text-amber-700 dark:text-amber-300",
    bgColor: "bg-amber-50 dark:bg-amber-950/50",
    borderColor: "border-amber-200 dark:border-amber-800",
    icon: AlertCircle,
    description: "Some aspects of patentability need more investigation.",
  },
  unlikely: {
    label: "Challenges Identified",
    color: "text-red-700 dark:text-red-300",
    bgColor: "bg-red-50 dark:bg-red-950/50",
    borderColor: "border-red-200 dark:border-red-800",
    icon: XCircle,
    description: "Your idea may face challenges, but professional guidance can help.",
  },
};

export default function ResultsPage() {
  const [assessment, setAssessment] = useState<PatentabilityAssessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("patent-buddy-assessment");
    if (stored) {
      try {
        setAssessment(JSON.parse(stored));
      } catch {
        // Invalid data
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-pulse-soft text-slate-500">Loading results...</div>
      </main>
    );
  }

  if (!assessment) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">No Assessment Found</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            It looks like you haven&apos;t submitted an idea yet.
          </p>
          <Link
            href="/assess"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Describe Your Idea
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  const overall = signalConfig[assessment.overallSignal];
  const OverallIcon = overall.icon;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href="/assess"
              className="flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">New Assessment</span>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Scale className="h-4 w-4" />
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">Patent Buddy</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Overall Result */}
        <div
          className={`animate-fade-in-up rounded-2xl border-2 ${overall.borderColor} ${overall.bgColor} p-8 text-center`}
        >
          <OverallIcon className={`mx-auto h-16 w-16 ${overall.color}`} />
          <h1 className={`mt-4 text-3xl font-bold ${overall.color}`}>{overall.label}</h1>
          <p className="mt-2 text-lg text-slate-700 dark:text-slate-300">{assessment.ideaTitle}</p>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
            {assessment.overallSummary}
          </p>
        </div>

        {/* Criteria Breakdown */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Assessment Breakdown
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            How your idea scored on each patent criterion.
          </p>

          <div className="mt-6 space-y-4">
            {assessment.criteria.map((criterion) => {
              const config = signalConfig[criterion.signal];
              const CriterionIcon = config.icon;

              return (
                <div
                  key={criterion.criterion}
                  className="animate-fade-in rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex items-start gap-4">
                    <CriterionIcon className={`mt-0.5 h-6 w-6 shrink-0 ${config.color}`} />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {criterion.label}
                        </h3>
                        <span
                          className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${config.borderColor} ${config.bgColor} ${config.color}`}
                        >
                          {config.label}
                        </span>
                      </div>
                      <p className="mt-2 text-slate-600 dark:text-slate-400">{criterion.summary}</p>

                      {criterion.tips.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Tips to strengthen this area:
                          </p>
                          <ul className="mt-2 space-y-2">
                            {criterion.tips.map((tip, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                              >
                                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Recommended Next Steps
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Here&apos;s what we recommend you do next.
          </p>

          <div className="mt-6 space-y-3">
            {assessment.nextSteps.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                  {i + 1}
                </div>
                <p className="text-slate-700 dark:text-slate-300">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/assess"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
          >
            Assess Another Idea
            <ChevronRight className="h-5 w-5" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/50">
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>Disclaimer:</strong> {assessment.disclaimer}
            </p>
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-8 flex justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/terms" className="hover:text-slate-700 dark:hover:text-slate-300">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-slate-700 dark:hover:text-slate-300">
            Privacy Policy
          </Link>
        </div>
      </div>
    </main>
  );
}
