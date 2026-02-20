"use client";

import type { DemoHcpProfile } from "@/lib/demo-seed";
import { GraduationCap, Building2, Award, Clock } from "lucide-react";

interface ProfessionalTabProps {
  profile: DemoHcpProfile;
}

export function ProfessionalTab({ profile }: ProfessionalTabProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader icon={<GraduationCap className="h-5 w-5" />} title="Education" />
        <div className="space-y-4">
          <InfoRow label="Medical School" value={profile.medicalSchool} />
          <InfoRow label="Residency" value={profile.residency} />
          <InfoRow label="Years in Practice" value={`${profile.yearsInPractice} years`} />
        </div>
      </Card>

      <Card>
        <CardHeader icon={<Building2 className="h-5 w-5" />} title="Affiliations" />
        <div className="rounded-lg border border-surface-border bg-surface-elevated p-4">
          <p className="font-medium text-white">{profile.affiliation.organizationName}</p>
          <p className="mt-1 text-sm text-gray-500">{profile.affiliation.role}</p>
          <span className="mt-2 inline-block rounded-full bg-brand-400/10 px-2.5 py-0.5 text-xs font-medium text-brand-400 capitalize">
            {profile.affiliation.type.replace("_", " ")}
          </span>
        </div>
      </Card>

      <Card>
        <CardHeader icon={<Award className="h-5 w-5" />} title="Board Certifications" />
        <div className="space-y-2">
          {profile.boardCertifications.map((cert) => (
            <div
              key={cert}
              className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface-elevated px-3 py-2.5"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-400/15">
                <Award className="h-3.5 w-3.5 text-brand-400" />
              </div>
              <span className="text-sm font-medium text-white">{cert}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader icon={<Clock className="h-5 w-5" />} title="Practice Details" />
        <div className="space-y-4">
          <InfoRow label="Primary Specialty" value={profile.primarySpecialty} />
          {profile.subSpecialty && <InfoRow label="Sub-Specialty" value={profile.subSpecialty} />}
          <InfoRow label="Gender" value={profile.gender === "M" ? "Male" : "Female"} />
          <InfoRow label="Credentials" value={profile.credentials} />
          <InfoRow
            label="Practice Location"
            value={`${profile.location.addressLine1}, ${profile.location.city}, ${profile.location.state} ${profile.location.zipCode}`}
          />
          <InfoRow label="Phone" value={profile.location.phone} />
        </div>
      </Card>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-card p-6">{children}</div>
  );
}

function CardHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="text-gray-500">{icon}</span>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-right text-sm font-medium text-white">{value}</span>
    </div>
  );
}
