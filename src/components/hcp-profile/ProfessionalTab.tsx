"use client";

import type { DemoHcpProfile } from "@/lib/demo-seed";
import { GraduationCap, Building2, Award, Clock } from "lucide-react";

interface ProfessionalTabProps {
  profile: DemoHcpProfile;
}

export function ProfessionalTab({ profile }: ProfessionalTabProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Education */}
      <Card>
        <CardHeader icon={<GraduationCap className="h-5 w-5" />} title="Education" />
        <div className="space-y-4">
          <InfoRow label="Medical School" value={profile.medicalSchool} />
          <InfoRow label="Residency" value={profile.residency} />
          <InfoRow label="Years in Practice" value={`${profile.yearsInPractice} years`} />
        </div>
      </Card>

      {/* Affiliations */}
      <Card>
        <CardHeader icon={<Building2 className="h-5 w-5" />} title="Affiliations" />
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <p className="font-medium text-gray-900 dark:text-white">
            {profile.affiliation.organizationName}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {profile.affiliation.role}
          </p>
          <span className="mt-2 inline-block rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700 capitalize dark:bg-indigo-900 dark:text-indigo-300">
            {profile.affiliation.type.replace("_", " ")}
          </span>
        </div>
      </Card>

      {/* Board Certifications */}
      <Card>
        <CardHeader icon={<Award className="h-5 w-5" />} title="Board Certifications" />
        <div className="space-y-2">
          {profile.boardCertifications.map((cert) => (
            <div
              key={cert}
              className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
                <Award className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{cert}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Practice Details */}
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
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {children}
    </div>
  );
}

function CardHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="text-gray-400">{icon}</span>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-right text-sm font-medium text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}
