"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  LayoutDashboard,
  Radio,
  Users,
  Settings,
  HelpCircle,
  ChevronDown,
  Search,
  MoreVertical,
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  TrendingUp,
  Activity,
  BarChart3,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Mail,
  Phone,
  MessageSquare,
  Globe,
  Filter,
  ExternalLink,
} from "lucide-react";
import AscendCoordinatorManager from "@/components/AscendCoordinatorManager";

const IonAnimation = dynamic(() => import("@/components/IonAnimation"), { ssr: false });

/* ─── colour tokens (from Figma) ─── */
const c = {
  bg: "#090b0f",
  sidebar: "#0c0e12",
  card: "#0c0e12",
  navActive: "#181b22",
  textPrimary: "#f7f7f7",
  textSecondary: "#94969c",
  textMuted: "#85888e",
  accent: "#0deefd",
  green: "#75dfa6",
  pink: "#d73371",
  badgeBg: "#12151b",
  divider: "#1e2028",
};

type Tab = "dashboard" | "virtual-coordinator" | "engagements";

/* ─── data ─── */

const navItems: { label: string; icon: typeof LayoutDashboard; tab: Tab }[] = [
  { label: "Dashboard", icon: LayoutDashboard, tab: "dashboard" },
  { label: "Virtual Coordinator", icon: Radio, tab: "virtual-coordinator" },
  { label: "Engagements", icon: Users, tab: "engagements" },
];

const footerNav = [
  { label: "Settings", icon: Settings },
  { label: "Support", icon: HelpCircle },
];

interface Coordinator {
  name: string;
  ta: string;
  engaged: string;
  status: "Draft" | "Paused" | "Active";
  created: string;
  version: string;
  mlr: "Submitted" | "Comment to Change" | "Under Review" | "Approved";
}

const coordinators: Coordinator[] = [
  { name: "Stelazio Virtual Coordinator V1.1", ta: "TA: Cardiology", engaged: "-", status: "Draft", created: "1/1/25", version: "v1.1", mlr: "Submitted" },
  { name: "Diabetes Care Coordinator", ta: "TA: Neurology", engaged: "125", status: "Paused", created: "1/1/25", version: "v1.0", mlr: "Comment to Change" },
  { name: "Cardiovex", ta: "TA: Cardiology", engaged: "-", status: "Draft", created: "1/1/25", version: "v1.2", mlr: "Under Review" },
  { name: "Neurovia", ta: "TA: Neurology", engaged: "138", status: "Active", created: "1/1/25", version: "v2.1", mlr: "Approved" },
  { name: "Oncurel", ta: "Target: Dermatologists", engaged: "146", status: "Active", created: "1/1/25", version: "v1.0", mlr: "Approved" },
  { name: "Respira", ta: "Target: Cardiologists", engaged: "200", status: "Active", created: "1/1/25", version: "v1.1", mlr: "Approved" },
];

/* ─── helpers ─── */

function statusColor(s: "Draft" | "Paused" | "Active") {
  if (s === "Draft") return c.accent;
  if (s === "Active") return c.green;
  return c.pink;
}

function mlrColor(m: string) {
  if (m === "Approved") return c.green;
  if (m === "Comment to Change") return c.pink;
  return c.accent;
}

/* ─── dashboard data ─── */

const dashboardStats = [
  { label: "Total HCPs Reached", value: "1,247", change: "+12.5%", up: true, icon: Users },
  { label: "Active Coordinators", value: "6", change: "+2", up: true, icon: Radio },
  { label: "Engagements (30d)", value: "3,842", change: "+8.3%", up: true, icon: Activity },
  { label: "Avg. Response Time", value: "1.2m", change: "-15%", up: true, icon: Clock },
];

const channelBreakdown = [
  { channel: "SMS", count: 854, pct: 22 },
  { channel: "Email", count: 1243, pct: 32 },
  { channel: "Owned Media", count: 432, pct: 11 },
  { channel: "Concierge", count: 128, pct: 3 },
  { channel: "AI Assistant", count: 2156, pct: 56 },
];

const recentActivity = [
  { hcp: "Dr. Sarah Chen", action: "Responded to SMS", time: "2m ago", channel: "SMS" },
  { hcp: "Dr. James Wilson", action: "Opened email campaign", time: "5m ago", channel: "Email" },
  { hcp: "Dr. Maria Garcia", action: "Completed AI chat session", time: "12m ago", channel: "AI Assistant" },
  { hcp: "Dr. Robert Kim", action: "Requested samples via concierge", time: "18m ago", channel: "Concierge" },
  { hcp: "Dr. Emily Zhang", action: "Viewed owned media content", time: "25m ago", channel: "Owned Media" },
  { hcp: "Dr. David Park", action: "Replied to SMS outreach", time: "32m ago", channel: "SMS" },
];

/* ─── engagements data ─── */

interface Engagement {
  hcp: string;
  specialty: string;
  npi: string;
  lastChannel: string;
  lastChannelIcon: typeof Mail;
  lastContact: string;
  totalTouches: number;
  status: "Active" | "Cooling Off" | "New";
  coordinator: string;
}

const engagements: Engagement[] = [
  { hcp: "Dr. Sarah Chen", specialty: "Cardiology", npi: "1234567890", lastChannel: "SMS", lastChannelIcon: MessageSquare, lastContact: "2m ago", totalTouches: 14, status: "Active", coordinator: "Stelazio V1.1" },
  { hcp: "Dr. James Wilson", specialty: "Neurology", npi: "2345678901", lastChannel: "Email", lastChannelIcon: Mail, lastContact: "5m ago", totalTouches: 8, status: "Active", coordinator: "Neurovia" },
  { hcp: "Dr. Maria Garcia", specialty: "Oncology", npi: "3456789012", lastChannel: "AI Assistant", lastChannelIcon: Radio, lastContact: "12m ago", totalTouches: 22, status: "Active", coordinator: "Oncurel" },
  { hcp: "Dr. Robert Kim", specialty: "Cardiology", npi: "4567890123", lastChannel: "Concierge", lastChannelIcon: Phone, lastContact: "18m ago", totalTouches: 5, status: "Cooling Off", coordinator: "Cardiovex" },
  { hcp: "Dr. Emily Zhang", specialty: "Dermatology", npi: "5678901234", lastChannel: "Owned Media", lastChannelIcon: Globe, lastContact: "25m ago", totalTouches: 11, status: "Active", coordinator: "Oncurel" },
  { hcp: "Dr. David Park", specialty: "Neurology", npi: "6789012345", lastChannel: "SMS", lastChannelIcon: MessageSquare, lastContact: "32m ago", totalTouches: 3, status: "New", coordinator: "Neurovia" },
  { hcp: "Dr. Lisa Thompson", specialty: "Cardiology", npi: "7890123456", lastChannel: "Email", lastChannelIcon: Mail, lastContact: "1h ago", totalTouches: 19, status: "Active", coordinator: "Respira" },
  { hcp: "Dr. Michael Brown", specialty: "Pulmonology", npi: "8901234567", lastChannel: "AI Assistant", lastChannelIcon: Radio, lastContact: "1.5h ago", totalTouches: 7, status: "Cooling Off", coordinator: "Respira" },
];

/* ─── components ─── */

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ color, border: `1px solid ${color}33` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

function StatCard({ label, value, change, up, icon: Icon }: typeof dashboardStats[0]) {
  return (
    <div className="rounded-xl border p-5" style={{ background: c.card, borderColor: c.divider }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: c.textSecondary }}>{label}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${c.accent}12` }}>
          <Icon className="h-4 w-4" style={{ color: c.accent }} />
        </div>
      </div>
      <p className="text-2xl font-bold" style={{ color: c.textPrimary }}>{value}</p>
      <div className="mt-1 flex items-center gap-1 text-xs font-medium" style={{ color: up ? c.green : c.pink }}>
        {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
        {change}
        <span style={{ color: c.textMuted }}>vs last period</span>
      </div>
    </div>
  );
}

/* ─── tab views ─── */

function DashboardView() {
  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold" style={{ color: c.textPrimary }}>Dashboard</h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {dashboardStats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Channel breakdown */}
        <div className="col-span-1 rounded-xl border p-5" style={{ background: c.card, borderColor: c.divider }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: c.textPrimary }}>Channel Breakdown</h2>
          <div className="space-y-4">
            {channelBreakdown.map((ch) => (
              <div key={ch.channel}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium" style={{ color: c.textSecondary }}>{ch.channel}</span>
                  <span className="text-sm font-bold" style={{ color: c.textPrimary }}>{ch.count.toLocaleString()}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: c.divider }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${ch.pct}%`, background: c.accent }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="col-span-2 rounded-xl border p-5" style={{ background: c.card, borderColor: c.divider }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: c.textPrimary }}>Recent Activity</h2>
          <div className="space-y-0">
            {recentActivity.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-3"
                style={{ borderBottom: i < recentActivity.length - 1 ? `1px solid ${c.divider}` : undefined }}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: `${c.accent}12` }}>
                  <Activity className="h-4 w-4" style={{ color: c.accent }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: c.textPrimary }}>{a.hcp}</p>
                  <p className="text-xs" style={{ color: c.textSecondary }}>{a.action}</p>
                </div>
                <Badge label={a.channel} color={c.accent} />
                <span className="text-xs shrink-0" style={{ color: c.textMuted }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function VirtualCoordinatorView() {
  return (
    <>
      {/* Page title row */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold" style={{ color: c.textPrimary }}>
          Virtual Coordinator
        </h1>
        <button
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold"
          style={{ background: c.accent, color: "#1a1a1a" }}
        >
          <Plus className="h-4 w-4" />
          New Virtual Coordinator
        </button>
      </div>

      {/* Virtual Coordinator Manager */}
      <section className="mb-8">
        <AscendCoordinatorManager />
      </section>

      {/* Virtual Coordinators Table */}
      <section>
        <div className="rounded-xl border" style={{ background: c.card, borderColor: c.divider }}>
          <div className="p-6 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-lg font-semibold" style={{ color: c.textPrimary }}>Virtual Coordinators</h2>
                  <span className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ color: c.textSecondary, border: `1px solid ${c.divider}` }}>
                    52 Interactions
                  </span>
                </div>
                <p className="text-sm" style={{ color: c.textSecondary }}>
                  Monitor and review all HCP interactions with this virtual coordinator
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: c.divider, background: c.bg }}>
                  <Search className="h-4 w-4" style={{ color: c.textMuted }} />
                  <span className="text-sm" style={{ color: c.textMuted }}>Search</span>
                </div>
                <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold" style={{ background: c.accent, color: "#1a1a1a" }}>
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr style={{ borderTop: `1px solid ${c.divider}` }}>
                  {["Coordinators", "Total Engaged HCPs", "Status", "Created", "Version", "MLR Status", ""].map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: c.textSecondary, borderBottom: `1px solid ${c.divider}` }}>
                      {h === "Coordinators" ? <span className="flex items-center gap-1">{h}<ChevronDown className="h-3 w-3" /></span> : h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coordinators.map((row) => (
                  <tr key={row.name} className="transition-colors hover:bg-white/[0.02]" style={{ borderBottom: `1px solid ${c.divider}` }}>
                    <td className="px-6 py-4">
                      <p className="font-medium" style={{ color: c.textPrimary }}>{row.name}</p>
                      <p className="text-xs" style={{ color: c.textSecondary }}>{row.ta}</p>
                    </td>
                    <td className="px-6 py-4" style={{ color: c.textSecondary }}>{row.engaged}</td>
                    <td className="px-6 py-4"><Badge label={row.status} color={statusColor(row.status)} /></td>
                    <td className="px-6 py-4" style={{ color: c.textSecondary }}>{row.created}</td>
                    <td className="px-6 py-4" style={{ color: c.textSecondary }}>{row.version}</td>
                    <td className="px-6 py-4"><Badge label={row.mlr} color={mlrColor(row.mlr)} /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold" style={{ borderColor: c.divider, color: c.textSecondary }}>
                          <span>View</span><Eye className="h-3.5 w-3.5" />
                        </button>
                        <button className="p-1" style={{ color: c.textSecondary }}><MoreVertical className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: `1px solid ${c.divider}` }}>
            <p className="text-sm font-medium" style={{ color: c.textSecondary }}>Page 1 of 10</p>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold" style={{ borderColor: c.divider, color: c.textSecondary, background: c.badgeBg }}>
                <ChevronLeft className="h-4 w-4" />Previous
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold" style={{ borderColor: c.divider, color: c.textSecondary, background: c.badgeBg }}>
                Next<ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function engagementStatusColor(s: Engagement["status"]) {
  if (s === "Active") return c.green;
  if (s === "Cooling Off") return c.pink;
  return c.accent;
}

function EngagementsView() {
  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: c.textPrimary }}>Engagements</h1>
          <p className="text-sm mt-1" style={{ color: c.textSecondary }}>HCP-level engagement history across all coordinators and channels</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: c.divider, background: c.bg }}>
            <Search className="h-4 w-4" style={{ color: c.textMuted }} />
            <span className="text-sm" style={{ color: c.textMuted }}>Search HCPs…</span>
          </div>
          <button className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold" style={{ borderColor: c.divider, color: c.textSecondary }}>
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold" style={{ background: c.accent, color: "#1a1a1a" }}>
            <ExternalLink className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total HCPs", value: engagements.length.toString(), accent: c.accent },
          { label: "Active", value: engagements.filter(e => e.status === "Active").length.toString(), accent: c.green },
          { label: "Cooling Off", value: engagements.filter(e => e.status === "Cooling Off").length.toString(), accent: c.pink },
          { label: "New", value: engagements.filter(e => e.status === "New").length.toString(), accent: c.accent },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border px-5 py-4 flex items-center gap-4" style={{ background: c.card, borderColor: c.divider }}>
            <div className="h-10 w-1 rounded-full" style={{ background: s.accent }} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: c.textSecondary }}>{s.label}</p>
              <p className="text-xl font-bold" style={{ color: c.textPrimary }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Engagements table */}
      <div className="rounded-xl border" style={{ background: c.card, borderColor: c.divider }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                {["HCP", "NPI", "Last Channel", "Last Contact", "Total Touches", "Status", "Coordinator", ""].map((h) => (
                  <th key={h} className="px-6 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: c.textSecondary, borderBottom: `1px solid ${c.divider}` }}>
                    {h === "HCP" ? <span className="flex items-center gap-1">{h}<ChevronDown className="h-3 w-3" /></span> : h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {engagements.map((row) => {
                const ChannelIcon = row.lastChannelIcon;
                return (
                  <tr key={row.npi} className="transition-colors hover:bg-white/[0.02]" style={{ borderBottom: `1px solid ${c.divider}` }}>
                    <td className="px-6 py-4">
                      <p className="font-medium" style={{ color: c.textPrimary }}>{row.hcp}</p>
                      <p className="text-xs" style={{ color: c.textSecondary }}>{row.specialty}</p>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs" style={{ color: c.textSecondary }}>{row.npi}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ChannelIcon className="h-3.5 w-3.5" style={{ color: c.accent }} />
                        <span style={{ color: c.textSecondary }}>{row.lastChannel}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4" style={{ color: c.textSecondary }}>{row.lastContact}</td>
                    <td className="px-6 py-4" style={{ color: c.textPrimary }}>{row.totalTouches}</td>
                    <td className="px-6 py-4"><Badge label={row.status} color={engagementStatusColor(row.status)} /></td>
                    <td className="px-6 py-4" style={{ color: c.textSecondary }}>{row.coordinator}</td>
                    <td className="px-6 py-4">
                      <button className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold" style={{ borderColor: c.divider, color: c.textSecondary }}>
                        <span>View</span><Eye className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: `1px solid ${c.divider}` }}>
          <p className="text-sm font-medium" style={{ color: c.textSecondary }}>Showing {engagements.length} of 1,247 HCPs</p>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold" style={{ borderColor: c.divider, color: c.textSecondary, background: c.badgeBg }}>
              <ChevronLeft className="h-4 w-4" />Previous
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold" style={{ borderColor: c.divider, color: c.textSecondary, background: c.badgeBg }}>
              Next<ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── page ─── */

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: c.bg, fontFamily: "'Inter', sans-serif" }}>
      {/* ── Sidebar ── */}
      <aside
        className="flex w-72 shrink-0 flex-col border-r"
        style={{ background: c.sidebar, borderColor: c.divider }}
      >
        {/* Logo */}
        <div className="px-4 pt-6 pb-2">
          <img src="/logo.svg" alt="Impiricus" className="h-6" />
        </div>

        {/* Nav */}
        <nav className="mt-4 space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.tab === activeTab;
            return (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors cursor-pointer text-left"
                style={{
                  color: isActive ? c.accent : c.textSecondary,
                  background: isActive ? c.navActive : "transparent",
                }}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Ion Animation */}
        <div className="flex-1 flex items-center justify-center overflow-hidden px-2">
          <IonAnimation className="w-full max-w-[260px]" />
        </div>

        {/* Footer nav */}
        <div className="space-y-1 px-3 pb-2">
          {footerNav.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold cursor-pointer"
                style={{ color: c.textSecondary }}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </div>
            );
          })}
        </div>

        {/* User card */}
        <div
          className="mx-3 mb-4 flex items-center gap-3 rounded-lg p-3"
          style={{ background: c.card, border: `1px solid ${c.divider}` }}
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
            style={{ background: "#2a2d35", color: c.textPrimary }}
          >
            MG
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold" style={{ color: c.textPrimary }}>
              Mike Gelber
            </p>
            <p className="truncate text-xs" style={{ color: c.textSecondary }}>
              Mike.Gelber@impiricus.com
            </p>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0" style={{ color: c.textSecondary }} />
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto" style={{ scrollbarGutter: "stable" }}>
        <div className="p-8">
          {/* Breadcrumbs */}
          <div className="mb-1 flex items-center gap-2 text-sm" style={{ color: c.textSecondary }}>
            <span className="font-semibold flex items-center gap-2">
              <span
                className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold"
                style={{ background: "#2a2d35", color: c.textPrimary }}
              >
                MG
              </span>
              Mike Gelber
            </span>
            <span style={{ color: c.textMuted }}>/</span>
            <span className="font-semibold" style={{ color: "#fff" }}>
              {navItems.find((n) => n.tab === activeTab)?.label}
            </span>
          </div>

          {/* ═══ Dashboard Tab ═══ */}
          {activeTab === "dashboard" && <DashboardView />}

          {/* ═══ Virtual Coordinator Tab ═══ */}
          {activeTab === "virtual-coordinator" && <VirtualCoordinatorView />}

          {/* ═══ Engagements Tab ═══ */}
          {activeTab === "engagements" && <EngagementsView />}
        </div>
      </main>
    </div>
  );
}
