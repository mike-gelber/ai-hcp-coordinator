"use client";

import type { DemoHcpProfile } from "@/lib/demo-seed";
import {
  X,
  MapPin,
  GraduationCap,
  Building2,
  Globe,
  TrendingUp,
  Award,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface HcpProfilePanelProps {
  profile: DemoHcpProfile;
  onClose: () => void;
}

export function HcpProfilePanel({ profile, onClose }: HcpProfilePanelProps) {
  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg overflow-y-auto border-l border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {profile.firstName} {profile.middleName ? profile.middleName + " " : ""}
            {profile.lastName}
            <span className="ml-2 text-sm font-normal text-gray-400">{profile.credentials}</span>
          </h2>
          <p className="mt-1 font-mono text-sm text-gray-500">NPI: {profile.npi}</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-6 p-6">
        {/* Quick Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900 dark:text-brand-300">
            {profile.primarySpecialty}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {profile.yearsInPractice} yrs in practice
          </span>
          {profile.digitalPresence.isKol && (
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900 dark:text-purple-300">
              Key Opinion Leader
            </span>
          )}
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              profile.prescribingProfile.prescribingVolume === "high"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                : profile.prescribingProfile.prescribingVolume === "medium"
                  ? "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            {profile.prescribingProfile.prescribingVolume} volume prescriber
          </span>
        </div>

        {/* Location */}
        <Section icon={<MapPin className="h-4 w-4" />} title="Practice Location">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {profile.location.addressLine1}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {profile.location.city}, {profile.location.state} {profile.location.zipCode}
          </p>
          <p className="text-sm text-gray-500">{profile.location.phone}</p>
        </Section>

        {/* Education */}
        <Section icon={<GraduationCap className="h-4 w-4" />} title="Education">
          <p className="text-sm text-gray-700 dark:text-gray-300">{profile.medicalSchool}</p>
        </Section>

        {/* Affiliation */}
        <Section icon={<Building2 className="h-4 w-4" />} title="Affiliation">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {profile.affiliation.organizationName}
          </p>
          <p className="text-sm text-gray-500">
            {profile.affiliation.role} · {profile.affiliation.type.replace("_", " ")}
          </p>
        </Section>

        {/* Board Certifications */}
        <Section icon={<Award className="h-4 w-4" />} title="Board Certifications">
          <div className="flex flex-wrap gap-2">
            {profile.boardCertifications.map((cert) => (
              <span
                key={cert}
                className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {cert}
              </span>
            ))}
          </div>
        </Section>

        {/* Prescribing Profile */}
        <Section icon={<TrendingUp className="h-4 w-4" />} title="Prescribing Profile">
          <div className="space-y-2 text-sm">
            <Row
              label="Top Therapeutic Area"
              value={profile.prescribingProfile.topTherapeuticArea}
            />
            <Row label="Prescribing Volume" value={profile.prescribingProfile.prescribingVolume} />
            <Row
              label="Brand vs. Generic"
              value={profile.prescribingProfile.brandVsGeneric.replace("-", " ")}
            />
          </div>
        </Section>

        {/* Digital Presence */}
        <Section icon={<Globe className="h-4 w-4" />} title="Digital Presence">
          <div className="space-y-2 text-sm">
            <Row label="Publications" value={String(profile.digitalPresence.publicationCount)} />
            <Row
              label="LinkedIn"
              value={profile.digitalPresence.hasLinkedIn ? "Active" : "Not found"}
            />
            <Row
              label="Twitter/X"
              value={profile.digitalPresence.hasTwitter ? "Active" : "Not found"}
            />
            <Row
              label="Doximity"
              value={profile.digitalPresence.hasDoximity ? "Active" : "Not found"}
            />
          </div>
        </Section>

        {/* Enrichment Status (demo placeholder) */}
        <div className="rounded-lg border border-dashed border-gray-300 p-4 dark:border-gray-700">
          <p className="text-center text-sm text-gray-400">
            Enrichment pipeline, outreach strategy, and AI persona will appear here once the full
            pipeline is connected.
          </p>
        </div>

        {/* View Full Profile Link */}
        <Link
          href={`/hcp/${profile.npi}`}
          className="flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-sm font-semibold text-gray-950 transition-colors hover:bg-brand-400"
        >
          <ExternalLink className="h-4 w-4" />
          View Full Profile
        </Link>
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
        <span className="text-gray-400">{icon}</span>
        {title}
      </div>
      <div className="pl-6">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">{value}</span>
    </div>
  );
}
