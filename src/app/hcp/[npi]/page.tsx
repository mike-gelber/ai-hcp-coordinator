"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { DemoHcpProfile } from "@/lib/demo-seed";
import { ProfileHeader } from "@/components/hcp-profile/ProfileHeader";
import { ProfessionalTab } from "@/components/hcp-profile/ProfessionalTab";
import { PrescribingTab } from "@/components/hcp-profile/PrescribingTab";
import { ResearchTab } from "@/components/hcp-profile/ResearchTab";
import { DigitalFootprintTab } from "@/components/hcp-profile/DigitalFootprintTab";
import { AiPersonaTab } from "@/components/hcp-profile/AiPersonaTab";
import { OutreachTab } from "@/components/hcp-profile/OutreachTab";
import { DataSourcesTab } from "@/components/hcp-profile/DataSourcesTab";
import { AiFieldForceTab } from "@/components/hcp-profile/AiFieldForceTab";
import { Briefcase, Pill, BookOpen, Globe, Brain, Send, Database, Bot } from "lucide-react";

const TABS = [
  { id: "professional", label: "Professional", icon: Briefcase },
  { id: "prescribing", label: "Prescribing", icon: Pill },
  { id: "research", label: "Research", icon: BookOpen },
  { id: "digital", label: "Digital Footprint", icon: Globe },
  { id: "persona", label: "AI Persona", icon: Brain },
  { id: "outreach", label: "Outreach", icon: Send },
  { id: "field_force", label: "AI Field Force", icon: Bot },
  { id: "sources", label: "Data Sources", icon: Database },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function HcpProfilePage() {
  const params = useParams();
  const npi = params.npi as string;
  const [profile, setProfile] = useState<DemoHcpProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("professional");

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/demo/profiles/${npi}`);
        if (!res.ok) {
          setError("Profile not found");
          return;
        }
        const data = await res.json();
        setProfile(data);
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [npi]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-400 border-t-transparent" />
          <p className="text-sm text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {error || "Profile not found"}
          </p>
          <p className="mt-2 text-sm text-gray-500">NPI: {npi}</p>
          <a
            href="/dashboard"
            className="mt-4 inline-block rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-gray-950 hover:bg-brand-400 transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Profile Header */}
      <ProfileHeader profile={profile} />

      {/* Tabs */}
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex gap-1 overflow-x-auto" aria-label="Tabs">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-brand-500 text-brand-600 dark:text-brand-400"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === "professional" && <ProfessionalTab profile={profile} />}
        {activeTab === "prescribing" && <PrescribingTab profile={profile} />}
        {activeTab === "research" && <ResearchTab profile={profile} />}
        {activeTab === "digital" && <DigitalFootprintTab profile={profile} />}
        {activeTab === "persona" && <AiPersonaTab profile={profile} />}
        {activeTab === "outreach" && <OutreachTab profile={profile} />}
        {activeTab === "field_force" && <AiFieldForceTab profile={profile} />}
        {activeTab === "sources" && <DataSourcesTab profile={profile} />}
      </main>
    </div>
  );
}
