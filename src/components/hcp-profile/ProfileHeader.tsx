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
  const color = score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-rose-500";

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
          className="text-gray-200 dark:text-gray-700"
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
      <span className="absolute text-xs font-bold text-gray-700 dark:text-gray-300">{score}%</span>
    </div>
  );
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const initials = `${profile.firstName[0]}${profile.lastName[0]}`;

  return (
    <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          {/* Left: Avatar + Name + Details */}
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
              {initials}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.firstName} {profile.middleName ? profile.middleName + " " : ""}
                  {profile.lastName}
                </h1>
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  {profile.credentials}
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
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

              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                  {profile.primarySpecialty}
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {profile.yearsInPractice} yrs experience
                </span>
                {profile.digitalPresence.isKol && (
                  <span className="rounded-full bg-purple-100 px-3 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                    Key Opinion Leader
                  </span>
                )}
                <span
                  className={`rounded-full px-3 py-0.5 text-xs font-medium ${
                    profile.prescribingProfile.prescribingVolume === "high"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                      : profile.prescribingProfile.prescribingVolume === "medium"
                        ? "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  {profile.prescribingProfile.prescribingVolume} volume
                </span>
              </div>
            </div>
          </div>

          {/* Right: Completeness Score */}
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
            <CompletenessRing score={profile.completenessScore} />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Profile Completeness
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
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
