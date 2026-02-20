"use client";

import type { DemoHcpProfile } from "@/lib/demo-seed";
import { Globe, Linkedin, Twitter, Stethoscope, TrendingUp, Star } from "lucide-react";

interface DigitalFootprintTabProps {
  profile: DemoHcpProfile;
}

export function DigitalFootprintTab({ profile }: DigitalFootprintTabProps) {
  const { digitalPresence } = profile;

  return (
    <div className="space-y-6">
      {/* Scores */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ScoreCard
          label="Engagement Score"
          score={digitalPresence.engagementScore}
          description="Measures digital engagement across platforms"
          color="brand"
        />
        <ScoreCard
          label="KOL Score"
          score={digitalPresence.kolScore}
          description="Key Opinion Leader influence rating"
          color={digitalPresence.isKol ? "purple" : "gray"}
        />
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-2 flex items-center gap-2">
            <Star className="h-4 w-4 text-gray-400" />
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">KOL Status</p>
          </div>
          {digitalPresence.isKol ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-sm font-bold text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                Key Opinion Leader
              </span>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">Not classified as KOL</p>
          )}
          <p className="mt-2 text-xs text-gray-400">
            {digitalPresence.publicationCount} publications tracked
          </p>
        </div>
      </div>

      {/* Social Profiles */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Social Profiles</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <SocialCard
            icon={<Linkedin className="h-5 w-5" />}
            name="LinkedIn"
            active={digitalPresence.hasLinkedIn}
            url={digitalPresence.linkedInUrl}
            color="sky"
          />
          <SocialCard
            icon={<Twitter className="h-5 w-5" />}
            name="Twitter / X"
            active={digitalPresence.hasTwitter}
            handle={digitalPresence.twitterHandle}
            color="gray"
          />
          <SocialCard
            icon={<Stethoscope className="h-5 w-5" />}
            name="Doximity"
            active={digitalPresence.hasDoximity}
            url={digitalPresence.doximityUrl}
            color="emerald"
          />
        </div>
      </div>

      {/* KOL Indicators */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">KOL Indicators</h3>
        </div>
        <div className="space-y-3">
          <Indicator
            label="Publication Volume"
            met={digitalPresence.publicationCount > 10}
            detail={`${digitalPresence.publicationCount} publications (threshold: >10)`}
          />
          <Indicator
            label="Conference Presence"
            met={profile.research.conferenceAppearances.length > 0}
            detail={`${profile.research.conferenceAppearances.length} appearances`}
          />
          <Indicator
            label="Clinical Trial Involvement"
            met={profile.research.clinicalTrials.length > 0}
            detail={`${profile.research.clinicalTrials.length} trials`}
          />
          <Indicator
            label="Multi-Platform Digital Presence"
            met={
              [
                digitalPresence.hasLinkedIn,
                digitalPresence.hasTwitter,
                digitalPresence.hasDoximity,
              ].filter(Boolean).length >= 2
            }
            detail={`Active on ${[digitalPresence.hasLinkedIn, digitalPresence.hasTwitter, digitalPresence.hasDoximity].filter(Boolean).length} platforms`}
          />
          <Indicator
            label="High Prescribing Volume"
            met={profile.prescribingProfile.prescribingVolume === "high"}
            detail={`${profile.prescribingProfile.prescribingVolume} volume prescriber`}
          />
          <Indicator
            label="Industry Engagement"
            met={profile.prescribingProfile.openPayments.length > 0}
            detail={`${profile.prescribingProfile.openPayments.length} payment records`}
          />
        </div>
      </div>
    </div>
  );
}

function ScoreCard({
  label,
  score,
  description,
  color,
}: {
  label: string;
  score: number;
  description: string;
  color: string;
}) {
  const colorMap: Record<string, { bg: string; bar: string; text: string }> = {
    brand: {
      bg: "bg-brand-50 dark:bg-brand-950",
      bar: "bg-brand-500",
      text: "text-brand-700 dark:text-brand-300",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950",
      bar: "bg-purple-500",
      text: "text-purple-700 dark:text-purple-300",
    },
    gray: {
      bg: "bg-gray-50 dark:bg-gray-800",
      bar: "bg-gray-400",
      text: "text-gray-700 dark:text-gray-300",
    },
  };
  const c = colorMap[color] || colorMap.gray;

  return (
    <div className={`rounded-xl p-6 ${c.bg}`}>
      <p className="text-xs font-medium opacity-70">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${c.text}`}>{score}</p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-full rounded-full ${c.bar} transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="mt-2 text-xs opacity-60">{description}</p>
    </div>
  );
}

function SocialCard({
  icon,
  name,
  active,
  url,
  handle,
  color,
}: {
  icon: React.ReactNode;
  name: string;
  active: boolean;
  url?: string;
  handle?: string;
  color: string;
}) {
  const activeColors: Record<string, string> = {
    sky: "border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950",
    gray: "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800",
    emerald: "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950",
  };
  const iconColors: Record<string, string> = {
    sky: "text-sky-600 dark:text-sky-400",
    gray: "text-gray-600 dark:text-gray-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
  };

  return (
    <div
      className={`rounded-xl border p-4 ${
        active
          ? activeColors[color] || activeColors.gray
          : "border-gray-200 bg-gray-50 opacity-50 dark:border-gray-700 dark:bg-gray-800"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={active ? iconColors[color] || "" : "text-gray-400"}>{icon}</span>
        <span className="text-sm font-medium text-gray-900 dark:text-white">{name}</span>
      </div>
      {active ? (
        <p className="mt-2 truncate text-xs text-gray-500 dark:text-gray-400">
          {handle || url || "Active"}
        </p>
      ) : (
        <p className="mt-2 text-xs text-gray-400">Not found</p>
      )}
      <div className="mt-2">
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            active
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
              : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
          }`}
        >
          {active ? "Active" : "Inactive"}
        </span>
      </div>
    </div>
  );
}

function Indicator({ label, met, detail }: { label: string; met: boolean; detail: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
            met
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
              : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
          }`}
        >
          {met ? "\u2713" : "\u2013"}
        </div>
        <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400">{detail}</span>
    </div>
  );
}
