"use client";

import type { DemoHcpProfile } from "@/lib/demo-seed";
import { ChevronLeft, ChevronRight, Search, Bot } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface HcpTableProps {
  onProfileClick?: (profile: DemoHcpProfile) => void;
}

interface PaginatedResponse {
  data: DemoHcpProfile[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const SPECIALTIES = [
  "Internal Medicine",
  "Family Medicine",
  "Cardiology",
  "Oncology",
  "Orthopedic Surgery",
  "Dermatology",
  "Neurology",
  "Psychiatry",
  "Gastroenterology",
  "Endocrinology",
  "Pulmonology",
  "Rheumatology",
  "Nephrology",
  "Hematology",
  "Infectious Disease",
  "Allergy & Immunology",
  "Urology",
  "Ophthalmology",
  "Pediatrics",
  "Emergency Medicine",
];

const STATES = [
  "CA",
  "NY",
  "TX",
  "FL",
  "IL",
  "PA",
  "OH",
  "MA",
  "NJ",
  "GA",
  "NC",
  "MI",
  "WA",
  "AZ",
  "CO",
  "MN",
  "MD",
  "TN",
  "MO",
  "CT",
];

export function HcpTable({ onProfileClick }: HcpTableProps) {
  const router = useRouter();
  const [data, setData] = useState<DemoHcpProfile[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [state, setState] = useState("");
  const pageSize = 20;

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    if (search) params.set("search", search);
    if (specialty) params.set("specialty", specialty);
    if (state) params.set("state", state);

    try {
      const res = await fetch(`/api/demo/profiles?${params}`);
      const json: PaginatedResponse = await res.json();
      setData(json.data);
      setTotal(json.total);
      setTotalPages(json.totalPages);
    } catch (err) {
      console.error("Failed to fetch profiles:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, specialty, state]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [search, specialty, state]);

  const volumeColors = {
    high: "bg-emerald-500/15 text-emerald-400",
    medium: "bg-cyan-500/15 text-cyan-400",
    low: "bg-gray-500/15 text-gray-400",
  };

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 border-b border-surface-border p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or NPI..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface-elevated py-2 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-500 focus:border-brand-400/50 focus:outline-none focus:ring-1 focus:ring-brand-400/50"
          />
        </div>
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="rounded-lg border border-surface-border bg-surface-elevated px-3 py-2 text-sm text-gray-100 focus:border-brand-400/50 focus:outline-none"
        >
          <option value="">All Specialties</option>
          {SPECIALTIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="rounded-lg border border-surface-border bg-surface-elevated px-3 py-2 text-sm text-gray-100 focus:border-brand-400/50 focus:outline-none"
        >
          <option value="">All States</option>
          {STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-500">{total.toLocaleString()} results</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-surface-border bg-surface-base/50">
            <tr>
              <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-400">NPI</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-400">Name</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-400">Specialty</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-400">Location</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-400">Yrs</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-400">Volume</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-400">KOL</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-400">Pubs</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-400">AI Agents</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border-subtle">
            {loading ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-400 border-t-transparent" />
                    Loading profiles...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-gray-500">
                  No profiles match your filters.
                </td>
              </tr>
            ) : (
              data.map((profile) => (
                <tr
                  key={profile.npi}
                  onClick={() => {
                    onProfileClick?.(profile);
                    router.push(`/hcp/${profile.npi}`);
                  }}
                  className="cursor-pointer hover:bg-surface-hover transition-colors"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-500">
                    {profile.npi}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-100">
                    {profile.firstName} {profile.lastName}
                    <span className="ml-1 text-xs text-gray-500">{profile.credentials}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-300">
                    {profile.primarySpecialty}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-400">
                    {profile.location.city}, {profile.location.state}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center text-gray-400">
                    {profile.yearsInPractice}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${volumeColors[profile.prescribingProfile.prescribingVolume]}`}
                    >
                      {profile.prescribingProfile.prescribingVolume}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center">
                    {profile.digitalPresence.isKol ? (
                      <span className="inline-flex rounded-full bg-purple-500/15 px-2 py-0.5 text-xs font-medium text-purple-400">
                        KOL
                      </span>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center text-gray-400">
                    {profile.digitalPresence.publicationCount}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-400/10 px-2.5 py-1 text-xs font-medium text-brand-400">
                      <Bot className="h-3 w-3" />2 Active
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-surface-border px-4 py-3">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-surface-border p-2 text-gray-400 hover:bg-surface-elevated disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-surface-border p-2 text-gray-400 hover:bg-surface-elevated disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
