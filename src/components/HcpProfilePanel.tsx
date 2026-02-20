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
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg overflow-y-auto border-l border-surface-border bg-surface-card shadow-2xl">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-start justify-between border-b border-surface-border bg-surface-card p-6">
        <div>
          <h2 className="text-xl font-bold text-white">
            {profile.firstName} {profile.middleName ? profile.middleName + " " : ""}
            {profile.lastName}
            <span className="ml-2 text-sm font-normal text-gray-500">{profile.credentials}</span>
          </h2>
          <p className="mt-1 font-mono text-sm text-gray-500">NPI: {profile.npi}</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-gray-500 hover:bg-surface-elevated hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-6 p-6">
        {/* Quick Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-brand-400/10 px-3 py-1 text-xs font-medium text-brand-400">
            {profile.primarySpecialty}
          </span>
          <span className="rounded-full bg-surface-elevated px-3 py-1 text-xs font-medium text-gray-300">
            {profile.yearsInPractice} yrs in practice
          </span>
          {profile.digitalPresence.isKol && (
            <span className="rounded-full bg-purple-500/15 px-3 py-1 text-xs font-medium text-purple-400">
              Key Opinion Leader
            </span>
          )}
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              profile.prescribingProfile.prescribingVolume === "high"
                ? "bg-emerald-500/15 text-emerald-400"
                : profile.prescribingProfile.prescribingVolume === "medium"
                  ? "bg-cyan-500/15 text-cyan-400"
                  : "bg-surface-elevated text-gray-400"
            }`}
          >
            {profile.prescribingProfile.prescribingVolume} volume prescriber
          </span>
        </div>

        {/* Location */}
        <Section icon={<MapPin className="h-4 w-4" />} title="Practice Location">
          <p className="text-sm text-gray-300">{profile.location.addressLine1}</p>
          <p className="text-sm text-gray-300">
            {profile.location.city}, {profile.location.state} {profile.location.zipCode}
          </p>
          <p className="text-sm text-gray-500">{profile.location.phone}</p>
        </Section>

        {/* Education */}
        <Section icon={<GraduationCap className="h-4 w-4" />} title="Education">
          <p className="text-sm text-gray-300">{profile.medicalSchool}</p>
        </Section>

        {/* Affiliation */}
        <Section icon={<Building2 className="h-4 w-4" />} title="Affiliation">
          <p className="text-sm font-medium text-gray-300">
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
                className="rounded-md bg-surface-elevated px-2 py-1 text-xs text-gray-300"
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

        {/* Enrichment Status */}
        <div className="rounded-lg border border-dashed border-surface-border p-4">
          <p className="text-center text-sm text-gray-500">
            Enrichment pipeline, outreach strategy, and AI persona will appear here once the full
            pipeline is connected.
          </p>
        </div>

        {/* View Full Profile Link */}
        <Link
          href={`/hcp/${profile.npi}`}
          className="flex items-center justify-center gap-2 rounded-lg bg-brand-400 px-4 py-3 text-sm font-semibold text-surface-base transition-colors hover:bg-brand-300"
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
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
        <span className="text-gray-500">{icon}</span>
        {title}
      </div>
      <div className="pl-6">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-300 capitalize">{value}</span>
    </div>
  );
}
