"use client";

import type { DemoHcpProfile } from "@/lib/demo-seed";
import { ArrowLeft, MapPin, Award, User } from "lucide-react";
import Link from "next/link";

interface ProfileHeaderProps {
  profile: DemoHcpProfile;
}

function CompletenessRing({ score }: { score: number }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "text-brand-400" : score >= 60 ? "text-amber-400" : "text-rose-400";

  return (
    <div className="relative flex items-center justify-center">
      <svg width="52" height="52" className="-rotate-90">
        <circle
          cx="26"
          cy="26"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-surface-border"
        />
        <circle
          cx="26"
          cy="26"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={color}
        />
      </svg>
      <span className="absolute text-xs font-bold text-gray-300">{score}%</span>
    </div>
  );
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const initials = `${profile.firstName[0]}${profile.lastName[0]}`;

  return (
    <div className="border-b border-surface-border bg-surface-card">
      <div className="px-6 py-6">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-400/20 text-xl font-bold text-brand-400">
              {initials}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">
                  {profile.firstName} {profile.middleName ? profile.middleName + " " : ""}
                  {profile.lastName}
                </h1>
                <span className="rounded-md bg-surface-elevated px-2 py-0.5 text-sm font-medium text-gray-400">
                  {profile.credentials}
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Award className="h-3.5 w-3.5" />
                  {profile.primarySpecialty}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.location.city}, {profile.location.state}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  NPI: {profile.npi}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-brand-400/10 px-3 py-0.5 text-xs font-medium text-brand-400">
                  {profile.primarySpecialty}
                </span>
                <span className="rounded-full bg-surface-elevated px-3 py-0.5 text-xs font-medium text-gray-300">
                  {profile.yearsInPractice} yrs experience
                </span>
                {profile.digitalPresence.isKol && (
                  <span className="rounded-full bg-purple-500/15 px-3 py-0.5 text-xs font-medium text-purple-400">
                    Key Opinion Leader
                  </span>
                )}
                <span
                  className={`rounded-full px-3 py-0.5 text-xs font-medium ${
                    profile.prescribingProfile.prescribingVolume === "high"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : profile.prescribingProfile.prescribingVolume === "medium"
                        ? "bg-cyan-500/15 text-cyan-400"
                        : "bg-surface-elevated text-gray-400"
                  }`}
                >
                  {profile.prescribingProfile.prescribingVolume} volume
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-surface-border bg-surface-elevated px-4 py-3">
            <CompletenessRing score={profile.completenessScore} />
            <div>
              <p className="text-sm font-semibold text-white">Profile Completeness</p>
              <p className="text-xs text-gray-500">
                {profile.completenessScore >= 80
                  ? "Fully enriched"
                  : profile.completenessScore >= 60
                    ? "Partially enriched"
                    : "Needs enrichment"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
