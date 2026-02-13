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
  "Internal Medicine", "Family Medicine", "Cardiology", "Oncology",
  "Orthopedic Surgery", "Dermatology", "Neurology", "Psychiatry",
  "Gastroenterology", "Endocrinology", "Pulmonology", "Rheumatology",
  "Nephrology", "Hematology", "Infectious Disease", "Allergy & Immunology",
  "Urology", "Ophthalmology", "Pediatrics", "Emergency Medicine",
];

const STATES = [
  "CA", "NY", "TX", "FL", "IL", "PA", "OH", "MA", "NJ", "GA",
  "NC", "MI", "WA", "AZ", "CO", "MN", "MD", "TN", "MO", "CT",
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

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, specialty, state]);

  const volumeColors = {
    high: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    medium: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
    low: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 p-4 dark:border-gray-800">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or NPI..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="">All Specialties</option>
          {SPECIALTIES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="">All States</option>
          {STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {total.toLocaleString()} results
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
            <tr>
              <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-600 dark:text-gray-400">NPI</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Name</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Specialty</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Location</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Yrs</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Volume</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-600 dark:text-gray-400">KOL</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Pubs</th>
              <th className="whitespace-nowrap px-4 py-3 font-medium text-gray-600 dark:text-gray-400">AI Agents</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                    Loading profiles...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-gray-400">
                  No profiles match your filters.
                </td>
              </tr>
            ) : (
              data.map((profile) => (
                <tr
                  key={profile.npi}
                  onClick={() => {
                    onProfileClick?.(profile);
                    router.push(`/dashboard/hcp/${profile.npi}`);
                  }}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">
                    {profile.npi}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                    {profile.firstName} {profile.lastName}
                    <span className="ml-1 text-xs text-gray-400">{profile.credentials}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700 dark:text-gray-300">
                    {profile.primarySpecialty}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-400">
                    {profile.location.city}, {profile.location.state}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center text-gray-600 dark:text-gray-400">
                    {profile.yearsInPractice}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${volumeColors[profile.prescribingProfile.prescribingVolume]}`}>
                      {profile.prescribingProfile.prescribingVolume}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center">
                    {profile.digitalPresence.isKol ? (
                      <span className="inline-flex rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        KOL
                      </span>
                    ) : (
                      <span className="text-gray-300 dark:text-gray-600">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center text-gray-600 dark:text-gray-400">
                    {profile.digitalPresence.publicationCount}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                      <Bot className="h-3 w-3" />
                      2 Active
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
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-30 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-30 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
