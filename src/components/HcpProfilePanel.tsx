"use client";

import { useState } from "react";
import type { DemoHcpProfile } from "@/lib/demo-seed";
import {
  X,
  MapPin,
  GraduationCap,
  Building2,
  Globe,
  TrendingUp,
  Award,
  User,
  Sparkles,
} from "lucide-react";
import { AgentConversation } from "@/components/AgentConversation";

interface HcpProfilePanelProps {
  profile: DemoHcpProfile;
  onClose: () => void;
}

type PanelTab = "profile" | "strategy";

export function HcpProfilePanel({ profile, onClose }: HcpProfilePanelProps) {
  const [activeTab, setActiveTab] = useState<PanelTab>("profile");

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg flex flex-col border-l border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="shrink-0 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-start justify-between p-6 pb-4">
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

        {/* Tab Navigation */}
        <div className="flex px-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
              activeTab === "profile"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <User className="h-4 w-4" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab("strategy")}
            className={`ml-6 flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
              activeTab === "strategy"
                ? "border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Agent Strategy
            <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold text-violet-700 dark:bg-violet-900 dark:text-violet-300">
              AI
            </span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "profile" ? (
        <div className="flex-1 overflow-y-auto">
          <ProfileTab profile={profile} onSwitchToStrategy={() => setActiveTab("strategy")} />
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <AgentConversation profile={profile} />
        </div>
      )}
    </div>
  );
}

// ─── Profile Tab ────────────────────────────────────────────────────────────

function ProfileTab({
  profile,
  onSwitchToStrategy,
}: {
  profile: DemoHcpProfile;
  onSwitchToStrategy: () => void;
}) {
  return (
    <div className="space-y-6 p-6">
      {/* Quick Tags */}
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
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
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
          profile.prescribingProfile.prescribingVolume === "high"
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
            : profile.prescribingProfile.prescribingVolume === "medium"
            ? "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300"
            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
        }`}>
          {profile.prescribingProfile.prescribingVolume} volume prescriber
        </span>
      </div>

      {/* Location */}
      <Section icon={<MapPin className="h-4 w-4" />} title="Practice Location">
        <p className="text-sm text-gray-700 dark:text-gray-300">{profile.location.addressLine1}</p>
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
          <Row label="Top Therapeutic Area" value={profile.prescribingProfile.topTherapeuticArea} />
          <Row label="Prescribing Volume" value={profile.prescribingProfile.prescribingVolume} />
          <Row label="Brand vs. Generic" value={profile.prescribingProfile.brandVsGeneric.replace("-", " ")} />
        </div>
      </Section>

      {/* Digital Presence */}
      <Section icon={<Globe className="h-4 w-4" />} title="Digital Presence">
        <div className="space-y-2 text-sm">
          <Row label="Publications" value={String(profile.digitalPresence.publicationCount)} />
          <Row label="LinkedIn" value={profile.digitalPresence.hasLinkedIn ? "Active" : "Not found"} />
          <Row label="Twitter/X" value={profile.digitalPresence.hasTwitter ? "Active" : "Not found"} />
          <Row label="Doximity" value={profile.digitalPresence.hasDoximity ? "Active" : "Not found"} />
        </div>
      </Section>

      {/* CTA to Strategy */}
      <button
        onClick={onSwitchToStrategy}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-4 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300 dark:hover:bg-violet-950"
      >
        <Sparkles className="h-4 w-4" />
        View Agent Strategy Session
        <span className="rounded-full bg-violet-200 px-1.5 py-0.5 text-[10px] font-bold text-violet-800 dark:bg-violet-800 dark:text-violet-200">
          AI
        </span>
      </button>
    </div>
  );
}

// ─── Shared Sub-components ──────────────────────────────────────────────────

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
