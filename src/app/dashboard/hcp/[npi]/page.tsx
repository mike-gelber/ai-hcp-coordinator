"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { DemoHcpProfile } from "@/lib/demo-seed";
import { AgentDialogue } from "@/components/AgentDialogue";
import {
  ArrowLeft,
  MapPin,
  GraduationCap,
  Building2,
  Globe,
  TrendingUp,
  Award,
  Bot,
  Users,
} from "lucide-react";

export default function HcpDetailPage() {
  const params = useParams();
  const router = useRouter();
  const npi = params.npi as string;

  const [profile, setProfile] = useState<DemoHcpProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/demo/profiles?search=${npi}&pageSize=1`
        );
        const json = await res.json();
        const found = json.data?.find(
          (p: DemoHcpProfile) => p.npi === npi
        );
        if (!cancelled) {
          if (found) {
            setProfile(found);
          } else {
            setError("HCP profile not found");
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError("Failed to load profile");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProfile();
    return () => {
      cancelled = true;
    };
  }, [npi]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="mt-4 text-sm text-gray-500">Loading HCP profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
            <Users className="h-8 w-8 text-red-500" />
          </div>
          <p className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            {error || "Profile not found"}
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 py-3 sm:px-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </button>
          <div className="h-5 w-px bg-gray-300 dark:bg-gray-700" />
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                {profile.firstName}{" "}
                {profile.middleName ? profile.middleName + " " : ""}
                {profile.lastName}
                <span className="ml-2 text-sm font-normal text-gray-400">
                  {profile.credentials}
                </span>
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                NPI: {profile.npi} · {profile.primarySpecialty} ·{" "}
                {profile.location.city}, {profile.location.state}
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 dark:bg-indigo-950">
              <Bot className="h-3.5 w-3.5 text-indigo-500" />
              <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                2 AI Agents Active
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content — Two Column Layout */}
      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          {/* Left Column — Profile Summary */}
          <div className="space-y-4">
            <ProfileCard profile={profile} />
          </div>

          {/* Right Column — Agent Dialogue */}
          <div className="relative flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900" style={{ minHeight: "680px" }}>
            <AgentDialogue npi={npi} />
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Profile Card (Compact) ─────────────────────────────────────────────────

function ProfileCard({ profile }: { profile: DemoHcpProfile }) {
  return (
    <div className="space-y-4">
      {/* Quick Tags */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-wrap gap-2">
          <Tag
            text={profile.primarySpecialty}
            variant="indigo"
          />
          <Tag
            text={`${profile.yearsInPractice} yrs in practice`}
            variant="gray"
          />
          {profile.digitalPresence.isKol && (
            <Tag text="Key Opinion Leader" variant="purple" />
          )}
          <Tag
            text={`${profile.prescribingProfile.prescribingVolume} volume`}
            variant={
              profile.prescribingProfile.prescribingVolume === "high"
                ? "emerald"
                : profile.prescribingProfile.prescribingVolume === "medium"
                ? "sky"
                : "gray"
            }
          />
        </div>
      </div>

      {/* Location */}
      <Section icon={<MapPin className="h-4 w-4" />} title="Practice Location">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {profile.location.addressLine1}
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {profile.location.city}, {profile.location.state}{" "}
          {profile.location.zipCode}
        </p>
        <p className="text-sm text-gray-500">{profile.location.phone}</p>
      </Section>

      {/* Education */}
      <Section
        icon={<GraduationCap className="h-4 w-4" />}
        title="Education"
      >
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {profile.medicalSchool}
        </p>
      </Section>

      {/* Affiliation */}
      <Section icon={<Building2 className="h-4 w-4" />} title="Affiliation">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {profile.affiliation.organizationName}
        </p>
        <p className="text-sm text-gray-500">
          {profile.affiliation.role} ·{" "}
          {profile.affiliation.type.replace("_", " ")}
        </p>
      </Section>

      {/* Board Certifications */}
      <Section
        icon={<Award className="h-4 w-4" />}
        title="Board Certifications"
      >
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
      <Section
        icon={<TrendingUp className="h-4 w-4" />}
        title="Prescribing Profile"
      >
        <div className="space-y-1.5 text-sm">
          <Row
            label="Therapeutic Area"
            value={profile.prescribingProfile.topTherapeuticArea}
          />
          <Row
            label="Volume"
            value={profile.prescribingProfile.prescribingVolume}
          />
          <Row
            label="Brand vs. Generic"
            value={profile.prescribingProfile.brandVsGeneric.replace(
              "-",
              " "
            )}
          />
        </div>
      </Section>

      {/* Digital Presence */}
      <Section
        icon={<Globe className="h-4 w-4" />}
        title="Digital Presence"
      >
        <div className="space-y-1.5 text-sm">
          <Row
            label="Publications"
            value={String(profile.digitalPresence.publicationCount)}
          />
          <Row
            label="LinkedIn"
            value={
              profile.digitalPresence.hasLinkedIn ? "Active" : "Not found"
            }
          />
          <Row
            label="Twitter/X"
            value={
              profile.digitalPresence.hasTwitter ? "Active" : "Not found"
            }
          />
          <Row
            label="Doximity"
            value={
              profile.digitalPresence.hasDoximity ? "Active" : "Not found"
            }
          />
        </div>
      </Section>
    </div>
  );
}

// ─── Shared sub-components ──────────────────────────────────────────────────

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
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
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
      <span className="font-medium capitalize text-gray-700 dark:text-gray-300">
        {value}
      </span>
    </div>
  );
}

function Tag({
  text,
  variant,
}: {
  text: string;
  variant: "indigo" | "purple" | "emerald" | "sky" | "gray";
}) {
  const styles = {
    indigo:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    purple:
      "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    emerald:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    sky: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
    gray: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${styles[variant]}`}
    >
      {text}
    </span>
  );
}
