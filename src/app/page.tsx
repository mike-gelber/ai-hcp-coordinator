"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Mail,
  Phone,
  MessageSquare,
  Globe,
  Filter,
  ExternalLink,
  MapPin,
  QrCode,
  X,
  Calendar,
  Scan,
  Headphones,
  Send,
  Package,
  User,
  AlertTriangle,
  ChevronUp,
  Play,
  Briefcase,
  Wand2,
  Repeat,
} from "lucide-react";
import AscendCoordinatorManager from "@/components/AscendCoordinatorManager";
import HcpDetailPane from "@/components/HcpDetailPane";

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
  { channel: "SMS", count: 2480, pct: 52 },
  { channel: "Intelligent Media", count: 1890, pct: 40 },
  { channel: "AI Assistant", count: 2156, pct: 45 },
  { channel: "Email", count: 620, pct: 13 },
  { channel: "Concierge", count: 128, pct: 3 },
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
  attention?: string;
}

const engagements: Engagement[] = [
  { hcp: "Dr. Sarah Chen", specialty: "Cardiology", npi: "1234567890", lastChannel: "SMS", lastChannelIcon: MessageSquare, lastContact: "2m ago", totalTouches: 14, status: "Active", coordinator: "Stelazio V1.1", attention: "Requested callback — no rep assigned" },
  { hcp: "Dr. James Wilson", specialty: "Neurology", npi: "2345678901", lastChannel: "Intelligent Media", lastChannelIcon: Globe, lastContact: "5m ago", totalTouches: 8, status: "Active", coordinator: "Neurovia" },
  { hcp: "Dr. Maria Garcia", specialty: "Oncology", npi: "3456789012", lastChannel: "SMS", lastChannelIcon: MessageSquare, lastContact: "12m ago", totalTouches: 22, status: "Active", coordinator: "Oncurel", attention: "Adverse event mentioned in conversation" },
  { hcp: "Dr. Robert Kim", specialty: "Cardiology", npi: "4567890123", lastChannel: "Concierge", lastChannelIcon: Phone, lastContact: "18m ago", totalTouches: 5, status: "Cooling Off", coordinator: "Cardiovex", attention: "Prior auth denied — appeal window closing" },
  { hcp: "Dr. Emily Zhang", specialty: "Dermatology", npi: "5678901234", lastChannel: "Intelligent Media", lastChannelIcon: Globe, lastContact: "25m ago", totalTouches: 11, status: "Active", coordinator: "Oncurel" },
  { hcp: "Dr. David Park", specialty: "Neurology", npi: "6789012345", lastChannel: "SMS", lastChannelIcon: MessageSquare, lastContact: "32m ago", totalTouches: 3, status: "New", coordinator: "Neurovia" },
  { hcp: "Dr. Lisa Thompson", specialty: "Cardiology", npi: "7890123456", lastChannel: "Outbound Direct Mail", lastChannelIcon: Mail, lastContact: "1h ago", totalTouches: 19, status: "Active", coordinator: "Respira", attention: "3 consecutive messages unanswered" },
  { hcp: "Dr. Michael Brown", specialty: "Pulmonology", npi: "8901234567", lastChannel: "AI Assistant", lastChannelIcon: Radio, lastContact: "1.5h ago", totalTouches: 7, status: "Cooling Off", coordinator: "Respira" },
  { hcp: "Dr. Angela Torres", specialty: "Endocrinology", npi: "9012345678", lastChannel: "SMS", lastChannelIcon: MessageSquare, lastContact: "2h ago", totalTouches: 9, status: "Active", coordinator: "Stelazio V1.1" },
  { hcp: "Dr. Kevin Patel", specialty: "Rheumatology", npi: "0123456789", lastChannel: "Email", lastChannelIcon: Mail, lastContact: "2.5h ago", totalTouches: 6, status: "New", coordinator: "Oncurel" },
  { hcp: "Dr. Rachel Adams", specialty: "Oncology", npi: "1122334455", lastChannel: "Intelligent Media", lastChannelIcon: Globe, lastContact: "3h ago", totalTouches: 15, status: "Active", coordinator: "Oncurel" },
  { hcp: "Dr. Steven Nguyen", specialty: "Cardiology", npi: "2233445566", lastChannel: "Concierge", lastChannelIcon: Phone, lastContact: "3.5h ago", totalTouches: 4, status: "Cooling Off", coordinator: "Cardiovex" },
  { hcp: "Dr. Christine Lee", specialty: "Neurology", npi: "3344556677", lastChannel: "SMS", lastChannelIcon: MessageSquare, lastContact: "4h ago", totalTouches: 18, status: "Active", coordinator: "Neurovia" },
  { hcp: "Dr. Mark Sullivan", specialty: "Pulmonology", npi: "4455667788", lastChannel: "Outbound Direct Mail", lastChannelIcon: Mail, lastContact: "5h ago", totalTouches: 2, status: "New", coordinator: "Respira" },
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

function DashboardView({ onNavigateToHcp }: { onNavigateToHcp: (hcpName: string) => void }) {
  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold" style={{ color: c.textPrimary }}>Dashboard</h1>
      </div>

      {/* Stats grid */}
      <div data-demo="dashboard-stats" className="grid grid-cols-4 gap-4 mb-8">
        {dashboardStats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Channel breakdown */}
        <div data-demo="channel-breakdown" className="col-span-1 rounded-xl border p-5" style={{ background: c.card, borderColor: c.divider }}>
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
        <div data-demo="recent-activity" className="col-span-2 rounded-xl border p-5" style={{ background: c.card, borderColor: c.divider }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: c.textPrimary }}>Recent Activity</h2>
          <div className="space-y-0">
            {recentActivity.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-3 rounded-lg px-2 -mx-2 cursor-pointer transition-colors hover:bg-white/[0.04]"
                style={{ borderBottom: i < recentActivity.length - 1 ? `1px solid ${c.divider}` : undefined }}
                onClick={() => onNavigateToHcp(a.hcp)}
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
                <ExternalLink className="h-3.5 w-3.5 shrink-0" style={{ color: c.textMuted }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function VirtualCoordinatorView({ onNavigateToHcp }: { onNavigateToHcp: (hcpName: string) => void }) {
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
      <section data-demo="vc-manager" className="mb-8">
        <AscendCoordinatorManager onNavigateToHcp={onNavigateToHcp} />
      </section>

      {/* Virtual Coordinators Table */}
      <section>
        <div data-demo="vc-table" className="rounded-xl border" style={{ background: c.card, borderColor: c.divider }}>
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

interface QrSource {
  type: string;
  location: string;
  campaignName: string;
  scannedAt: string;
  device: string;
  landedOn: string;
  sessionDuration: string;
  contentViewed: string[];
  followUp: string;
}

const intelligentMediaSources: Record<string, QrSource> = {
  "2345678901": {
    type: "Conference Leave-Behind Flyer",
    location: "AAN 2026 Annual Meeting — San Diego Convention Center, Booth #412",
    campaignName: "Neurovia Phase III Awareness — AAN 2026",
    scannedAt: "Feb 18, 2026 · 2:14 PM PST",
    device: "iPhone 16 Pro · Safari",
    landedOn: "Neurovia Clinical Evidence Hub",
    sessionDuration: "6m 42s",
    contentViewed: [
      "Phase III pivotal trial results (full read)",
      "Mechanism of action interactive module",
      "Dosing & titration calculator",
    ],
    followUp: "Automated nurture sequence triggered — next email in 48h with long-term extension data",
  },
  "5678901234": {
    type: "QR Code — Physician Lounge Display",
    location: "Cedar Sinai Hospital, NYC — 3rd Floor Physician Lounge",
    campaignName: "Oncurel HCP Awareness — NYC Metro Physician Lounges",
    scannedAt: "Feb 19, 2026 · 7:48 AM EST",
    device: "Samsung Galaxy S25 · Chrome",
    landedOn: "Oncurel Dosing & Patient Selection Tool",
    sessionDuration: "4m 18s",
    contentViewed: [
      "Patient selection algorithm walkthrough",
      "Dosing calculator — ran 2 patient scenarios",
      "Formulary coverage lookup (NYC Metro plans)",
    ],
    followUp: "High-intent signal flagged — concierge outreach scheduled within 24h with rep intro",
  },
};

function IntelligentMediaModal({ engagement, onClose }: { engagement: Engagement; onClose: () => void }) {
  const source = intelligentMediaSources[engagement.npi];
  if (!source) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div
        className="relative w-full max-w-lg rounded-2xl border flex flex-col"
        style={{ background: c.card, borderColor: `${c.accent}25`, boxShadow: `0 0 40px ${c.accent}10`, maxHeight: "90vh" }}
      >
        {/* Header — always visible */}
        <div className="shrink-0 flex items-start justify-between px-6 pt-6 pb-4 rounded-t-2xl" style={{ borderBottom: `1px solid ${c.divider}` }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <QrCode className="h-4 w-4" style={{ color: c.accent }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: c.accent }}>Intelligent Media Source</span>
            </div>
            <h2 className="text-base font-bold" style={{ color: c.textPrimary }}>{engagement.hcp}</h2>
            <p className="text-xs mt-0.5" style={{ color: c.textSecondary }}>{engagement.specialty} · NPI {engagement.npi}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 transition-colors hover:bg-white/5 cursor-pointer">
            <X className="h-4 w-4" style={{ color: c.textSecondary }} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="overflow-y-auto px-6 py-5 space-y-5">
          {/* Source type & location */}
          <div className="rounded-xl border p-4" style={{ background: c.bg, borderColor: c.divider }}>
            <div className="flex items-center gap-2 mb-3">
              <Scan className="h-4 w-4" style={{ color: c.accent }} />
              <span className="text-sm font-semibold" style={{ color: c.textPrimary }}>{source.type}</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: c.textMuted }} />
                <span className="text-xs" style={{ color: c.textSecondary }}>{source.location}</span>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: c.textMuted }} />
                <span className="text-xs" style={{ color: c.textSecondary }}>{source.scannedAt}</span>
              </div>
            </div>
          </div>

          {/* Campaign & device */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: c.textMuted }}>Campaign</p>
              <p className="text-xs font-medium" style={{ color: c.textPrimary }}>{source.campaignName}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: c.textMuted }}>Device</p>
              <p className="text-xs font-medium" style={{ color: c.textPrimary }}>{source.device}</p>
            </div>
          </div>

          {/* Session details */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: c.textMuted }}>Session Details</p>
            <div className="rounded-xl border p-4" style={{ background: c.bg, borderColor: c.divider }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs" style={{ color: c.textSecondary }}>Landed on</span>
                <span className="text-xs font-semibold" style={{ color: c.accent }}>{source.landedOn}</span>
              </div>
              <div className="flex items-center justify-between mb-3" style={{ borderTop: `1px solid ${c.divider}`, paddingTop: 12 }}>
                <span className="text-xs" style={{ color: c.textSecondary }}>Session duration</span>
                <span className="text-xs font-semibold" style={{ color: c.textPrimary }}>{source.sessionDuration}</span>
              </div>
              <div style={{ borderTop: `1px solid ${c.divider}`, paddingTop: 12 }}>
                <span className="text-xs" style={{ color: c.textSecondary }}>Content viewed</span>
                <ul className="mt-2 space-y-1.5">
                  {source.contentViewed.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs" style={{ color: c.textPrimary }}>
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: c.accent }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Follow-up */}
          <div className="rounded-xl border p-4" style={{ background: `${c.accent}08`, borderColor: `${c.accent}20` }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: c.accent }}>Automated Follow-Up</p>
            <p className="text-xs leading-relaxed" style={{ color: c.textSecondary }}>{source.followUp}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── SMS Detail Data & Modal ── */

interface SmsFlowDetail {
  campaignName: string;
  flowName: string;
  triggerEvent: string;
  sentAt: string;
  messagePreview: string;
  deliveryStatus: string;
  responseStatus: string;
  responsePreview?: string;
  responseTime?: string;
  flowSteps: { step: string; status: "completed" | "active" | "pending"; detail: string }[];
  nextAction: string;
}

const smsFlowSources: Record<string, SmsFlowDetail> = {
  "1234567890": {
    campaignName: "Stelazio HCP Awareness — Q1 2026",
    flowName: "High-Value Cardiology Re-engagement",
    triggerEvent: "14-day post-sample delivery follow-up",
    sentAt: "Feb 20, 2026 · 9:58 AM EST",
    messagePreview: "Hi Dr. Chen, following up on your Stelazio samples. New real-world data shows 42% improvement in LDL reduction at 12 weeks. Want to see the full results? Reply YES or tap here →",
    deliveryStatus: "Delivered · 9:58 AM",
    responseStatus: "Replied",
    responsePreview: "YES — also curious about the titration protocol for patients already on statins",
    responseTime: "2m after delivery",
    flowSteps: [
      { step: "Sample Delivery Confirmation", status: "completed", detail: "Confirmed Feb 6 — 2 starter packs delivered to office" },
      { step: "7-Day Check-In SMS", status: "completed", detail: "Sent Feb 13 — Opened, no reply" },
      { step: "14-Day Follow-Up + Data Share", status: "active", detail: "Sent Feb 20 — Replied with question (current)" },
      { step: "Route to Medical Affairs", status: "pending", detail: "Triggered by clinical question — queued for MSL callback" },
      { step: "30-Day Prescribing Check-In", status: "pending", detail: "Scheduled Mar 8" },
    ],
    nextAction: "Clinical question detected — routed to MSL team for callback within 4 hours. Titration guide PDF auto-sent.",
  },
  "3456789012": {
    campaignName: "Oncurel Launch Wave 2 — Oncology Targets",
    flowName: "KOL Early Adopter Nurture",
    triggerEvent: "Post-webinar attendee follow-up",
    sentAt: "Feb 20, 2026 · 9:48 AM EST",
    messagePreview: "Dr. Garcia, thank you for attending the Oncurel MOA Deep Dive webinar. Your CME certificate is ready. We also have new Phase III subgroup data — would you like early access? Reply INFO →",
    deliveryStatus: "Delivered · 9:48 AM",
    responseStatus: "Replied",
    responsePreview: "INFO — particularly interested in the renal impairment subgroup",
    responseTime: "12m after delivery",
    flowSteps: [
      { step: "Webinar Registration Confirmation", status: "completed", detail: "Registered Feb 12 via Intelligent Media portal" },
      { step: "Webinar Attendance Verified", status: "completed", detail: "Attended full 45min session on Feb 18" },
      { step: "Post-Webinar Follow-Up SMS", status: "active", detail: "Sent Feb 20 — Replied requesting subgroup data (current)" },
      { step: "Subgroup Data Delivery", status: "pending", detail: "Renal impairment dataset queued for delivery via secure link" },
      { step: "Speaker Program Invitation", status: "pending", detail: "Eligible for regional speaker program — invite pending" },
    ],
    nextAction: "Renal impairment subgroup analysis PDF being prepared by medical affairs. Secure link delivery within 2 hours.",
  },
  "6789012345": {
    campaignName: "Neurovia Awareness — New HCP Onboarding",
    flowName: "First-Touch Welcome Sequence",
    triggerEvent: "NPI added to target list — initial outreach",
    sentAt: "Feb 20, 2026 · 9:28 AM EST",
    messagePreview: "Dr. Park, this is the Neurovia clinical team. We have new data on long-acting oral therapy for MS that may be relevant to your practice. Tap to explore clinical evidence →",
    deliveryStatus: "Delivered · 9:28 AM",
    responseStatus: "No response yet",
    flowSteps: [
      { step: "Target List Ingestion", status: "completed", detail: "NPI validated and enriched via NPPES on Feb 19" },
      { step: "Welcome SMS", status: "active", detail: "Sent Feb 20 — Delivered, awaiting response (current)" },
      { step: "48-Hour Nudge", status: "pending", detail: "If no response, follow-up SMS scheduled Feb 22" },
      { step: "Email Fallback", status: "pending", detail: "If no SMS engagement, pivot to email with clinical summary" },
    ],
    nextAction: "Monitoring for response. 48-hour nudge SMS queued for Feb 22 if no engagement detected.",
  },
};

function SmsDetailModal({ engagement, onClose }: { engagement: Engagement; onClose: () => void }) {
  const flow = smsFlowSources[engagement.npi];
  if (!flow) return null;

  const stepColor = (s: "completed" | "active" | "pending") =>
    s === "completed" ? c.green : s === "active" ? c.accent : c.textMuted;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div
        className="relative w-full max-w-lg rounded-2xl border flex flex-col"
        style={{ background: c.card, borderColor: `${c.accent}25`, boxShadow: `0 0 40px ${c.accent}10`, maxHeight: "90vh" }}
      >
        <div className="shrink-0 flex items-start justify-between px-6 pt-6 pb-4 rounded-t-2xl" style={{ borderBottom: `1px solid ${c.divider}` }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="h-4 w-4" style={{ color: c.accent }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: c.accent }}>SMS Campaign Detail</span>
            </div>
            <h2 className="text-base font-bold" style={{ color: c.textPrimary }}>{engagement.hcp}</h2>
            <p className="text-xs mt-0.5" style={{ color: c.textSecondary }}>{engagement.specialty} · NPI {engagement.npi}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 transition-colors hover:bg-white/5 cursor-pointer">
            <X className="h-4 w-4" style={{ color: c.textSecondary }} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: c.textMuted }}>Campaign</p>
              <p className="text-xs font-medium" style={{ color: c.textPrimary }}>{flow.campaignName}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: c.textMuted }}>Flow</p>
              <p className="text-xs font-medium" style={{ color: c.textPrimary }}>{flow.flowName}</p>
            </div>
          </div>

          <div className="rounded-xl border p-4" style={{ background: c.bg, borderColor: c.divider }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: c.textMuted }}>Trigger</p>
            <p className="text-xs" style={{ color: c.textSecondary }}>{flow.triggerEvent}</p>
            <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${c.divider}` }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: c.textMuted }}>Message Sent</p>
              <div className="rounded-lg p-3" style={{ background: `${c.accent}08`, border: `1px solid ${c.accent}15` }}>
                <p className="text-xs leading-relaxed" style={{ color: c.textPrimary }}>{flow.messagePreview}</p>
                <p className="text-[10px] mt-2" style={{ color: c.textMuted }}>{flow.sentAt} · {flow.deliveryStatus}</p>
              </div>
            </div>
            {flow.responsePreview && (
              <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${c.divider}` }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: c.green }}>HCP Response</p>
                <div className="rounded-lg p-3" style={{ background: `${c.green}08`, border: `1px solid ${c.green}15` }}>
                  <p className="text-xs leading-relaxed" style={{ color: c.textPrimary }}>{flow.responsePreview}</p>
                  <p className="text-[10px] mt-2" style={{ color: c.textMuted }}>{flow.responseTime}</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: c.textMuted }}>Flow Progress</p>
            <div className="space-y-0">
              {flow.flowSteps.map((step, i) => (
                <div key={step.step} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2.5 w-2.5 rounded-full shrink-0 mt-1" style={{ background: stepColor(step.status), boxShadow: step.status === "active" ? `0 0 8px ${c.accent}60` : "none" }} />
                    {i < flow.flowSteps.length - 1 && <div className="w-px flex-1 my-1" style={{ background: c.divider }} />}
                  </div>
                  <div className="pb-4">
                    <p className="text-xs font-semibold" style={{ color: step.status === "pending" ? c.textMuted : c.textPrimary }}>{step.step}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: c.textSecondary }}>{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border p-4" style={{ background: `${c.accent}08`, borderColor: `${c.accent}20` }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: c.accent }}>Next Action</p>
            <p className="text-xs leading-relaxed" style={{ color: c.textSecondary }}>{flow.nextAction}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Concierge Conversation Data & Modal ── */

interface ConciergeMessage {
  sender: "hcp" | "concierge" | "system";
  text: string;
  time: string;
}

interface ConciergeDetail {
  sessionId: string;
  startedAt: string;
  duration: string;
  conciergeAgent: string;
  reason: string;
  resolution: string;
  satisfactionScore: string;
  transcript: ConciergeMessage[];
}

const conciergeSources: Record<string, ConciergeDetail> = {
  "4567890123": {
    sessionId: "CON-2026-02-20-0847",
    startedAt: "Feb 20, 2026 · 9:42 AM EST",
    duration: "8m 14s",
    conciergeAgent: "Jessica M. — Senior Patient Access Specialist",
    reason: "Prior Authorization Denial — Cardiovex",
    resolution: "Appeal submitted to Aetna; peer-to-peer review scheduled Feb 22",
    satisfactionScore: "5/5",
    transcript: [
      { sender: "system", text: "Session started — Dr. Robert Kim connected via Concierge hotline", time: "9:42 AM" },
      { sender: "hcp", text: "Hi, I have a patient who was denied PA for Cardiovex. The denial letter says they need to fail two other agents first, but this patient already failed lisinopril and losartan.", time: "9:42 AM" },
      { sender: "concierge", text: "I'm sorry to hear that, Dr. Kim. Let me pull up the case. Can you confirm the patient's member ID or date of birth?", time: "9:43 AM" },
      { sender: "hcp", text: "Member ID is AET-8834721. DOB 03/15/1961.", time: "9:43 AM" },
      { sender: "concierge", text: "Thank you. I can see the denial — it looks like the payer didn't have documentation of the prior failures on file. I can initiate an appeal with the clinical notes attached. Do you have the chart notes showing lisinopril and losartan failures?", time: "9:44 AM" },
      { sender: "hcp", text: "Yes, I can send those over. What's the fastest way?", time: "9:45 AM" },
      { sender: "concierge", text: "I'll send you a secure upload link right now via SMS. Once I have the notes, I'll file the appeal today and also request a peer-to-peer review, which typically gets scheduled within 48 hours.", time: "9:45 AM" },
      { sender: "system", text: "Secure upload link sent to Dr. Kim's mobile", time: "9:46 AM" },
      { sender: "hcp", text: "Just uploaded the notes. Appreciate the quick help on this.", time: "9:48 AM" },
      { sender: "concierge", text: "Got them. Appeal is being filed now with Aetna. I'll have the peer-to-peer review scheduled and will text you the confirmed date and time. Is there anything else I can help with?", time: "9:49 AM" },
      { sender: "hcp", text: "No, that's everything. Thank you, Jessica.", time: "9:50 AM" },
      { sender: "system", text: "Session ended — Appeal filed, P2P review scheduled for Feb 22", time: "9:50 AM" },
    ],
  },
};

function ConciergeModal({ engagement, onClose }: { engagement: Engagement; onClose: () => void }) {
  const detail = conciergeSources[engagement.npi];
  if (!detail) return null;

  const bubbleStyle = (sender: ConciergeMessage["sender"]) => {
    if (sender === "hcp") return { background: `${c.accent}10`, border: `1px solid ${c.accent}20`, align: "self-start" as const };
    if (sender === "concierge") return { background: c.bg, border: `1px solid ${c.divider}`, align: "self-end" as const };
    return { background: "transparent", border: `1px dashed ${c.divider}`, align: "self-center" as const };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div
        className="relative w-full max-w-lg rounded-2xl border flex flex-col"
        style={{ background: c.card, borderColor: `${c.accent}25`, boxShadow: `0 0 40px ${c.accent}10`, maxHeight: "90vh" }}
      >
        <div className="shrink-0 flex items-start justify-between px-6 pt-6 pb-4 rounded-t-2xl" style={{ borderBottom: `1px solid ${c.divider}` }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Headphones className="h-4 w-4" style={{ color: c.accent }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: c.accent }}>Concierge Conversation</span>
            </div>
            <h2 className="text-base font-bold" style={{ color: c.textPrimary }}>{engagement.hcp}</h2>
            <p className="text-xs mt-0.5" style={{ color: c.textSecondary }}>{engagement.specialty} · NPI {engagement.npi}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 transition-colors hover:bg-white/5 cursor-pointer">
            <X className="h-4 w-4" style={{ color: c.textSecondary }} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: c.textMuted }}>Session ID</p>
              <p className="text-xs font-mono font-medium" style={{ color: c.textPrimary }}>{detail.sessionId}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: c.textMuted }}>Duration</p>
              <p className="text-xs font-medium" style={{ color: c.textPrimary }}>{detail.duration}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: c.textMuted }}>Agent</p>
              <p className="text-xs font-medium" style={{ color: c.textPrimary }}>{detail.conciergeAgent}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: c.textMuted }}>Satisfaction</p>
              <p className="text-xs font-medium" style={{ color: c.green }}>{detail.satisfactionScore}</p>
            </div>
          </div>

          <div className="rounded-xl border p-4" style={{ background: c.bg, borderColor: c.divider }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: c.textMuted }}>Reason</span>
              <span className="text-xs font-semibold" style={{ color: c.pink }}>{detail.reason}</span>
            </div>
            <div className="flex items-center justify-between" style={{ borderTop: `1px solid ${c.divider}`, paddingTop: 8 }}>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: c.textMuted }}>Resolution</span>
              <span className="text-xs font-semibold" style={{ color: c.green }}>{detail.resolution}</span>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: c.textMuted }}>Full Transcript</p>
            <div className="rounded-xl border p-4 space-y-3" style={{ background: c.bg, borderColor: c.divider }}>
              {detail.transcript.map((msg, i) => {
                const style = bubbleStyle(msg.sender);
                return (
                  <div key={i} className={`flex flex-col ${style.align}`} style={{ maxWidth: msg.sender === "system" ? "100%" : "85%" }}>
                    <div className="rounded-lg px-3 py-2" style={{ background: style.background, border: style.border }}>
                      {msg.sender !== "system" && (
                        <div className="flex items-center gap-1.5 mb-1">
                          {msg.sender === "hcp" ? <User className="h-3 w-3" style={{ color: c.accent }} /> : <Headphones className="h-3 w-3" style={{ color: c.green }} />}
                          <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: msg.sender === "hcp" ? c.accent : c.green }}>
                            {msg.sender === "hcp" ? engagement.hcp : "Concierge"}
                          </span>
                        </div>
                      )}
                      <p className={`text-xs leading-relaxed ${msg.sender === "system" ? "text-center italic" : ""}`} style={{ color: msg.sender === "system" ? c.textMuted : c.textPrimary }}>
                        {msg.text}
                      </p>
                    </div>
                    <span className={`text-[10px] mt-0.5 px-1 ${msg.sender === "system" ? "text-center" : ""}`} style={{ color: c.textMuted }}>{msg.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Outbound Direct Mail Data & Modal ── */

interface DirectMailDetail {
  campaignName: string;
  mailPieceType: string;
  routedFrom: string;
  triggerEvent: string;
  createdAt: string;
  shippedAt: string;
  estimatedDelivery: string;
  trackingStatus: string;
  contents: string[];
  recipientAddress: string;
  followUpPlan: string;
}

const directMailSources: Record<string, DirectMailDetail> = {
  "7890123456": {
    campaignName: "Respira Clinical Evidence — Cardiology Tier 1",
    mailPieceType: "Clinical Evidence Portfolio + Sample Request Card",
    routedFrom: "SMS Flow: Respira Re-engagement Sequence (Step 3 — non-responder branch)",
    triggerEvent: "Dr. Thompson did not respond to 2 SMS touches over 14 days. System triggered outbound direct mail as next-best channel based on historical preference data.",
    createdAt: "Feb 13, 2026",
    shippedAt: "Feb 14, 2026 · FedEx Ground",
    estimatedDelivery: "Feb 19, 2026",
    trackingStatus: "Delivered — Signed by front desk (Feb 19, 10:14 AM)",
    contents: [
      "Respira clinical summary card (4-page fold-out)",
      "Real-world evidence booklet — 12-month outcomes data",
      "Sample request reply card (pre-paid postage)",
      "QR code linking to personalized Intelligent Media portal",
    ],
    recipientAddress: "Dr. Lisa Thompson · Cardiology Associates of Manhattan · 425 E 61st St, Suite 200, New York, NY 10065",
    followUpPlan: "Post-delivery SMS scheduled for Feb 21 asking if materials were received. If QR code is scanned, Intelligent Media engagement will auto-trigger next sequence.",
  },
};

function DirectMailModal({ engagement, onClose }: { engagement: Engagement; onClose: () => void }) {
  const detail = directMailSources[engagement.npi];
  if (!detail) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div
        className="relative w-full max-w-lg rounded-2xl border flex flex-col"
        style={{ background: c.card, borderColor: `${c.accent}25`, boxShadow: `0 0 40px ${c.accent}10`, maxHeight: "90vh" }}
      >
        <div className="shrink-0 flex items-start justify-between px-6 pt-6 pb-4 rounded-t-2xl" style={{ borderBottom: `1px solid ${c.divider}` }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Package className="h-4 w-4" style={{ color: c.accent }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: c.accent }}>Outbound Direct Mail</span>
            </div>
            <h2 className="text-base font-bold" style={{ color: c.textPrimary }}>{engagement.hcp}</h2>
            <p className="text-xs mt-0.5" style={{ color: c.textSecondary }}>{engagement.specialty} · NPI {engagement.npi}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 transition-colors hover:bg-white/5 cursor-pointer">
            <X className="h-4 w-4" style={{ color: c.textSecondary }} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: c.textMuted }}>Campaign</p>
              <p className="text-xs font-medium" style={{ color: c.textPrimary }}>{detail.campaignName}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: c.textMuted }}>Mail Piece</p>
              <p className="text-xs font-medium" style={{ color: c.textPrimary }}>{detail.mailPieceType}</p>
            </div>
          </div>

          <div className="rounded-xl border p-4" style={{ background: c.bg, borderColor: c.divider }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: c.accent }}>Routed From</p>
            <p className="text-xs leading-relaxed" style={{ color: c.textPrimary }}>{detail.routedFrom}</p>
            <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${c.divider}` }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: c.textMuted }}>Trigger Reason</p>
              <p className="text-xs leading-relaxed" style={{ color: c.textSecondary }}>{detail.triggerEvent}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border p-3" style={{ background: c.bg, borderColor: c.divider }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: c.textMuted }}>Created</p>
              <p className="text-xs font-medium" style={{ color: c.textPrimary }}>{detail.createdAt}</p>
            </div>
            <div className="rounded-lg border p-3" style={{ background: c.bg, borderColor: c.divider }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: c.textMuted }}>Shipped</p>
              <p className="text-xs font-medium" style={{ color: c.textPrimary }}>{detail.shippedAt}</p>
            </div>
            <div className="rounded-lg border p-3" style={{ background: `${c.green}08`, borderColor: `${c.green}20` }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: c.green }}>Status</p>
              <p className="text-xs font-medium" style={{ color: c.green }}>Delivered</p>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: c.textMuted }}>Package Contents</p>
            <div className="rounded-xl border p-4" style={{ background: c.bg, borderColor: c.divider }}>
              <ul className="space-y-2">
                {detail.contents.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs" style={{ color: c.textPrimary }}>
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: c.accent }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: c.textMuted }}>Ship To</p>
            <p className="text-xs" style={{ color: c.textSecondary }}>{detail.recipientAddress}</p>
          </div>

          <div className="rounded-xl border p-4" style={{ background: `${c.accent}08`, borderColor: `${c.accent}20` }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: c.accent }}>Follow-Up Plan</p>
            <p className="text-xs leading-relaxed" style={{ color: c.textSecondary }}>{detail.followUpPlan}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EngagementTableRow({ row, onView, onRowClick, hasDetail, detailIcon }: {
  row: Engagement;
  onView: (e: React.MouseEvent) => void;
  onRowClick: () => void;
  hasDetail: boolean;
  detailIcon: React.ReactNode;
}) {
  const ChannelIcon = row.lastChannelIcon;
  return (
    <tr
      className="transition-colors hover:bg-white/[0.04] cursor-pointer"
      style={{ borderBottom: `1px solid ${c.divider}` }}
      onClick={onRowClick}
    >
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
        <button
          onClick={onView}
          className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors"
          style={{
            borderColor: hasDetail ? `${c.accent}40` : c.divider,
            color: hasDetail ? c.accent : c.textSecondary,
            cursor: hasDetail ? "pointer" : "default",
          }}
        >
          <span>View</span>
          {detailIcon}
        </button>
      </td>
    </tr>
  );
}

function EngagementsView({ focusedHcp, onClearFocus, demoHcpTab }: { focusedHcp?: string; onClearFocus: () => void; demoHcpTab?: "engagements" | "agentic" | "persona" }) {
  const [selectedMedia, setSelectedMedia] = useState<Engagement | null>(null);
  const [selectedSms, setSelectedSms] = useState<Engagement | null>(null);
  const [selectedConcierge, setSelectedConcierge] = useState<Engagement | null>(null);
  const [selectedDirectMail, setSelectedDirectMail] = useState<Engagement | null>(null);
  const [selectedHcp, setSelectedHcp] = useState<Engagement | null>(null);
  const [allExpanded, setAllExpanded] = useState(true);

  useEffect(() => {
    if (focusedHcp) {
      const match = engagements.find((e) => e.hcp === focusedHcp);
      if (match) {
        setSelectedHcp(match);
        onClearFocus();
      }
    }
  }, [focusedHcp, onClearFocus]);
  const isIntelligentMedia = (row: Engagement) => row.lastChannel === "Intelligent Media" && intelligentMediaSources[row.npi];
  const isSms = (row: Engagement) => row.lastChannel === "SMS" && smsFlowSources[row.npi];
  const isConcierge = (row: Engagement) => row.lastChannel === "Concierge" && conciergeSources[row.npi];
  const isDirectMail = (row: Engagement) => row.lastChannel === "Outbound Direct Mail" && directMailSources[row.npi];
  const hasDetail = (row: Engagement) => isIntelligentMedia(row) || isSms(row) || isConcierge(row) || isDirectMail(row);

  const attentionRows = engagements.filter((e) => e.attention);
  const remainingRows = engagements.filter((e) => !e.attention);

  const handleView = (row: Engagement, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isIntelligentMedia(row)) setSelectedMedia(row);
    else if (isSms(row)) setSelectedSms(row);
    else if (isConcierge(row)) setSelectedConcierge(row);
    else if (isDirectMail(row)) setSelectedDirectMail(row);
    else setSelectedHcp(row);
  };

  const detailIcon = (row: Engagement) =>
    isIntelligentMedia(row) ? <QrCode className="h-3.5 w-3.5" />
    : isSms(row) ? <MessageSquare className="h-3.5 w-3.5" />
    : isConcierge(row) ? <Headphones className="h-3.5 w-3.5" />
    : isDirectMail(row) ? <Package className="h-3.5 w-3.5" />
    : <Eye className="h-3.5 w-3.5" />;

  const tableHeaders = ["HCP", "NPI", "Last Channel", "Last Contact", "Total Touches", "Status", "Coordinator", ""];

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
      <div data-demo="engagement-summary" className="grid grid-cols-4 gap-4 mb-6">
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

      {/* Requires Attention */}
      {attentionRows.length > 0 && (
        <div data-demo="requires-attention" className="rounded-xl border mb-4" style={{ background: c.card, borderColor: `${c.pink}30` }}>
          <div className="flex items-center gap-2.5 px-6 py-3.5" style={{ borderBottom: `1px solid ${c.divider}` }}>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: `${c.pink}15` }}>
              <AlertTriangle className="h-3.5 w-3.5" style={{ color: c.pink }} />
            </div>
            <h3 className="text-sm font-semibold" style={{ color: c.textPrimary }}>Requires Attention</h3>
            <span
              className="ml-1 rounded-full px-2 py-0.5 text-xs font-bold"
              style={{ background: `${c.pink}18`, color: c.pink }}
            >
              {attentionRows.length}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  {tableHeaders.map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: c.textSecondary, borderBottom: `1px solid ${c.divider}` }}>
                      {h === "HCP" ? <span className="flex items-center gap-1">{h}<ChevronDown className="h-3 w-3" /></span> : h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attentionRows.map((row) => (
                  <EngagementTableRow
                    key={row.npi}
                    row={row}
                    onView={(e) => handleView(row, e)}
                    onRowClick={() => setSelectedHcp(row)}
                    hasDetail={!!hasDetail(row)}
                    detailIcon={detailIcon(row)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All Engagements — collapsible */}
      <div data-demo="all-engagements" className="rounded-xl border" style={{ background: c.card, borderColor: c.divider }}>
        <button
          className="flex w-full items-center justify-between px-6 py-3.5 transition-colors hover:bg-white/[0.02]"
          onClick={() => setAllExpanded((v) => !v)}
        >
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm font-semibold" style={{ color: c.textPrimary }}>All Engagements</h3>
            <span
              className="rounded-full px-2 py-0.5 text-xs font-bold"
              style={{ background: `${c.accent}15`, color: c.accent }}
            >
              {remainingRows.length}
            </span>
          </div>
          <ChevronUp
            className="h-4 w-4 transition-transform"
            style={{
              color: c.textSecondary,
              transform: allExpanded ? undefined : "rotate(180deg)",
            }}
          />
        </button>

        {allExpanded && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr>
                    {tableHeaders.map((h) => (
                      <th key={h} className="px-6 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: c.textSecondary, borderBottom: `1px solid ${c.divider}` }}>
                        {h === "HCP" ? <span className="flex items-center gap-1">{h}<ChevronDown className="h-3 w-3" /></span> : h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {remainingRows.map((row) => (
                    <EngagementTableRow
                      key={row.npi}
                      row={row}
                      onView={(e) => handleView(row, e)}
                      onRowClick={() => setSelectedHcp(row)}
                    hasDetail={!!hasDetail(row)}
                    detailIcon={detailIcon(row)}
                  />
                ))}
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
          </>
        )}
      </div>

      {selectedMedia && (
        <IntelligentMediaModal engagement={selectedMedia} onClose={() => setSelectedMedia(null)} />
      )}
      {selectedSms && (
        <SmsDetailModal engagement={selectedSms} onClose={() => setSelectedSms(null)} />
      )}
      {selectedConcierge && (
        <ConciergeModal engagement={selectedConcierge} onClose={() => setSelectedConcierge(null)} />
      )}
      {selectedDirectMail && (
        <DirectMailModal engagement={selectedDirectMail} onClose={() => setSelectedDirectMail(null)} />
      )}
      {selectedHcp && (
        <HcpDetailPane
          engagement={{ hcp: selectedHcp.hcp, specialty: selectedHcp.specialty, npi: selectedHcp.npi }}
          onClose={() => setSelectedHcp(null)}
          initialTab={demoHcpTab}
        />
      )}
    </>
  );
}

/* ─── demo step definitions ─── */

interface DemoStep {
  tab: Tab;
  selector: string;
  title: string;
  body: string;
  position: "top" | "bottom" | "left" | "right";
  action?: string;
}

const demoStepData: Record<string, DemoStep[]> = {
  "brand-manager": [
    { tab: "dashboard", selector: "dashboard-stats", title: "Performance at a Glance", body: "Start your morning by reviewing key performance indicators — total HCPs reached, active coordinators, 30-day engagement volume, and average response times. These metrics give you an immediate pulse on campaign health.", position: "bottom" },
    { tab: "dashboard", selector: "channel-breakdown", title: "Channel Mix Analysis", body: "Understand which engagement channels drive the most HCP interactions. Use this data to optimize budget allocation and refine your omnichannel strategy across SMS, email, AI assistant, and more.", position: "right" },
    { tab: "dashboard", selector: "recent-activity", title: "Live Activity Feed", body: "Monitor HCP interactions in real time. Each row shows who engaged, what they did, and through which channel. Click any physician to jump directly to their full engagement history.", position: "left" },
    { tab: "engagements", selector: "engagement-summary", title: "HCP Portfolio Overview", body: "Get a high-level snapshot of your territory — total HCP count, active engagements, physicians in cooling-off periods, and newly onboarded targets.", position: "bottom" },
    { tab: "engagements", selector: "requires-attention", title: "Priority Alerts", body: "HCPs flagged for immediate action surface here — callback requests without assigned reps, adverse event mentions, and expiring appeal windows. These are your first action items each morning.", position: "bottom" },
    { tab: "engagements", selector: "all-engagements", title: "Full Engagement Table", body: "Browse, filter, and sort all HCP engagements across coordinators and channels. Click any row to open the detailed engagement timeline with AI strategy insights.", position: "top" },
    { tab: "engagements", selector: "hcp-detail-pane", title: "Engagement Timeline", body: "Chronological view of every touchpoint with this HCP — channel used, direction (inbound/outbound), interaction summary, and outcome. This is your single source of truth for relationship history.", position: "left", action: "open-hcp" },
    { tab: "engagements", selector: "hcp-detail-pane", title: "AI Strategy Session", body: "Two AI agents — a Strategist and an Engagement Expert — analyze this HCP's engagement patterns and collaboratively develop an optimal next-best-action plan. Watch their real-time strategic dialogue unfold.", position: "left", action: "hcp-tab:agentic" },
    { tab: "engagements", selector: "hcp-detail-pane", title: "HCP Persona Profile", body: "Deep-dive into the physician's professional profile, prescribing behaviors, communication preferences, decision drivers, and influence level. Use this intelligence to personalize every interaction.", position: "left", action: "hcp-tab:persona" },
  ],
  "vc-setup": [
    { tab: "virtual-coordinator", selector: "vc-manager", title: "Coordinator Command Center", body: "This is the heart of your virtual coordinator — a visual map showing how engagement channels connect through the central intelligence to your system integrations. Watch signals flow in real time.", position: "bottom" },
    { tab: "virtual-coordinator", selector: "vc-channels", title: "Engagement Channels", body: "Each card represents an active engagement channel — SMS, email, intelligent media, concierge, and more. Click any channel to view recent sample engagements and performance details.", position: "left" },
    { tab: "virtual-coordinator", selector: "vc-orb", title: "Central Intelligence", body: "The virtual coordinator orchestrates all channel activity through this central hub. Engagement signals flow from channels, get processed by the AI coordinator, and route to the appropriate downstream integration.", position: "bottom" },
    { tab: "virtual-coordinator", selector: "vc-integrations", title: "System Integrations", body: "Integrations connect the coordinator to your existing tech stack — CRM, EHR, analytics platforms, and patient support programs. Data flows bidirectionally to keep everything synchronized.", position: "right" },
    { tab: "virtual-coordinator", selector: "vc-add-module", title: "Expand Capabilities", body: "Browse the module catalog to add new channels and integrations on the fly. Simply activate a module and it's instantly connected to the coordinator's intelligence layer — no engineering required.", position: "bottom" },
    { tab: "virtual-coordinator", selector: "vc-table", title: "Coordinator Portfolio", body: "Manage all your virtual coordinators from this table — track engagement counts, operational status, version history, and MLR approval status. Click View to drill into any coordinator's configuration.", position: "top" },
  ],
  "rep-engagement": [
    { tab: "engagements", selector: "engagement-summary", title: "Territory at a Glance", body: "As a field rep, start here to assess your territory — how many HCPs are actively engaging, who's cooling off, and which physicians are newly added to your portfolio. Use these numbers to prioritize your day.", position: "bottom" },
    { tab: "engagements", selector: "requires-attention", title: "Priority Follow-Ups", body: "These HCPs need your attention first. From unanswered callback requests to adverse event flags and expiring appeal windows — address these before any planned outreach to maximize impact.", position: "bottom" },
    { tab: "engagements", selector: "all-engagements", title: "Your HCP Portfolio", body: "Your complete engagement log across all channels and coordinators. Sort by last contact, total touches, or status to identify follow-up opportunities and spot patterns in physician engagement.", position: "top" },
    { tab: "engagements", selector: "hcp-detail-pane", title: "Interaction Deep-Dive", body: "Before making any outreach, review the complete touchpoint timeline. See what channels have been used, outcomes achieved, and what actions are pending for this physician.", position: "left", action: "open-hcp" },
    { tab: "engagements", selector: "hcp-detail-pane", title: "AI-Powered Next Best Action", body: "Your AI field force assistants analyze engagement patterns and recommend the optimal next action — which channel to use, what content to send, and the ideal timing for outreach.", position: "left", action: "hcp-tab:agentic" },
    { tab: "engagements", selector: "hcp-detail-pane", title: "Know Your Physician", body: "Understand your HCP's prescribing behavior, communication preferences, and decision drivers. This intelligence helps you tailor every conversation and build stronger, more productive relationships.", position: "left", action: "hcp-tab:persona" },
  ],
};

const demoModules = [
  { id: "brand-manager", title: "Brand Manager Day-in-the-Life", description: "Walk through a typical day for a brand manager using Ascend to monitor campaigns, review HCP engagement, and optimize channel strategy.", icon: Briefcase, duration: "4 min", steps: demoStepData["brand-manager"].length },
  { id: "vc-setup", title: "Virtual Coordinator Set Up", description: "See how to configure a new virtual coordinator from scratch — selecting channels, setting rules, and activating integrations.", icon: Wand2, duration: "3 min", steps: demoStepData["vc-setup"].length },
  { id: "rep-engagement", title: "Rep Engagement Manager", description: "Follow a field rep reviewing HCP interactions, prioritizing follow-ups, and coordinating next-best-actions across channels.", icon: Repeat, duration: "3 min", steps: demoStepData["rep-engagement"].length },
];

/* ─── demo launcher ─── */

function DemoLauncher({ onStart }: { onStart: (demoId: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold shadow-lg transition-all hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${c.accent}, #0abecc)`,
          color: "#0a0c10",
          boxShadow: `0 4px 24px ${c.accent}40, 0 0 0 1px ${c.accent}20`,
        }}
      >
        <Play className="h-4 w-4" style={{ fill: "currentColor" }} />
        Demo
      </button>

      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-96 rounded-2xl border shadow-2xl overflow-hidden"
          style={{
            background: c.bg,
            borderColor: c.divider,
            boxShadow: `0 12px 48px rgba(0,0,0,0.5), 0 0 0 1px ${c.divider}`,
          }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: c.divider, background: c.card }}>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${c.accent}15` }}>
                <Play className="h-4 w-4" style={{ color: c.accent, fill: c.accent }} />
              </div>
              <div>
                <h3 className="text-sm font-bold" style={{ color: c.textPrimary }}>Demo Modules</h3>
                <p className="text-[11px]" style={{ color: c.textSecondary }}>Interactive guided walkthroughs</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-white/5" style={{ color: c.textSecondary }}>
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-3 space-y-2">
            {demoModules.map((mod) => {
              const Icon = mod.icon;
              return (
                <button
                  key={mod.id}
                  onClick={() => { setOpen(false); onStart(mod.id); }}
                  className="w-full flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all hover:border-[#0deefd30] hover:bg-white/[0.02]"
                  style={{ background: c.card, borderColor: c.divider }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg mt-0.5" style={{ background: `${c.accent}10`, border: `1px solid ${c.accent}20` }}>
                    <Icon className="h-5 w-5" style={{ color: c.accent }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: c.textPrimary }}>{mod.title}</p>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: c.textSecondary }}>{mod.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-[11px] font-medium" style={{ color: c.textMuted }}>
                        <Clock className="h-3 w-3" />
                        {mod.duration}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-medium" style={{ color: c.textMuted }}>
                        <Play className="h-3 w-3" />
                        {mod.steps} steps
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 mt-1" style={{ color: c.textMuted }} />
                </button>
              );
            })}
          </div>

          <div className="px-5 py-3 border-t text-center" style={{ borderColor: c.divider }}>
            <p className="text-[11px]" style={{ color: c.textMuted }}>Select a module to begin the guided walkthrough</p>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── demo walkthrough overlay ─── */

function DemoWalkthrough({
  demoId,
  step,
  onNext,
  onPrev,
  onExit,
}: {
  demoId: string;
  step: number;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
}) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const steps = demoStepData[demoId];
  const current = steps?.[step];
  const totalSteps = steps?.length || 0;
  const isFirst = step === 0;
  const isLast = step === totalSteps - 1;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        if (isLast) onExit();
        else onNext();
      } else if (e.key === "ArrowLeft" && !isFirst) {
        e.preventDefault();
        onPrev();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onExit();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onNext, onPrev, onExit, isFirst, isLast]);

  useEffect(() => {
    if (!current) return;
    setRect(null);

    let attempts = 0;
    let rafId: number;
    let timer: ReturnType<typeof setTimeout>;

    const findAndMeasure = () => {
      const el = document.querySelector<HTMLElement>(`[data-demo="${current.selector}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        rafId = requestAnimationFrame(() => {
          setTimeout(() => setRect(el.getBoundingClientRect()), 350);
        });
      } else if (attempts < 30) {
        attempts++;
        timer = setTimeout(findAndMeasure, 100);
      }
    };

    timer = setTimeout(findAndMeasure, 200);

    const updateRect = () => {
      const el = document.querySelector<HTMLElement>(`[data-demo="${current.selector}"]`);
      if (el) setRect(el.getBoundingClientRect());
    };

    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [current?.selector, step]);

  if (!current || !rect) return null;

  const pad = 12;
  const gap = 20;
  const tooltipW = 380;
  const spotlight = {
    top: rect.top - pad,
    left: rect.left - pad,
    width: rect.width + pad * 2,
    height: rect.height + pad * 2,
  };

  const cx = rect.left + rect.width / 2;
  const cy = Math.min(Math.max(rect.top + rect.height / 2, 100), window.innerHeight - 100);
  const tipStyle: React.CSSProperties = { position: "fixed", width: tooltipW, zIndex: 101 };

  let pos = current.position;
  const roomAbove = spotlight.top;
  const roomBelow = window.innerHeight - (spotlight.top + spotlight.height);
  if (pos === "top" && roomAbove < 220) pos = roomBelow > 220 ? "bottom" : "left";
  if (pos === "bottom" && roomBelow < 220) pos = roomAbove > 220 ? "top" : "left";

  switch (pos) {
    case "bottom":
      tipStyle.top = Math.min(spotlight.top + spotlight.height + gap, window.innerHeight - 200);
      tipStyle.left = Math.max(16, Math.min(cx - tooltipW / 2, window.innerWidth - tooltipW - 16));
      break;
    case "top":
      tipStyle.bottom = Math.max(16, window.innerHeight - spotlight.top + gap);
      tipStyle.left = Math.max(16, Math.min(cx - tooltipW / 2, window.innerWidth - tooltipW - 16));
      break;
    case "left": {
      tipStyle.top = Math.max(16, Math.min(cy - 80, window.innerHeight - 260));
      const rightVal = window.innerWidth - spotlight.left + gap;
      if (rightVal + tooltipW > window.innerWidth - 16) {
        tipStyle.left = Math.max(16, spotlight.left - tooltipW - gap);
      } else {
        tipStyle.right = Math.max(16, rightVal);
      }
      break;
    }
    case "right":
      tipStyle.top = Math.max(16, Math.min(cy - 80, window.innerHeight - 260));
      tipStyle.left = Math.min(spotlight.left + spotlight.width + gap, window.innerWidth - tooltipW - 16);
      break;
  }

  return (
    <>
      <div className="fixed inset-0 z-[98]" onClick={onExit} />

      <div
        className="fixed z-[99] rounded-xl pointer-events-none"
        style={{
          top: spotlight.top,
          left: spotlight.left,
          width: spotlight.width,
          height: spotlight.height,
          boxShadow: `0 0 0 9999px rgba(0,0,0,0.75), inset 0 0 0 2px ${c.accent}25`,
          transition: "top 0.4s, left 0.4s, width 0.4s, height 0.4s",
        }}
      />

      <div
        style={{
          ...tipStyle,
          background: c.card,
          border: `1px solid ${c.divider}`,
          boxShadow: `0 12px 48px rgba(0,0,0,0.6), 0 0 24px ${c.accent}10`,
        }}
        className="rounded-xl overflow-hidden"
      >
        <div className="h-1" style={{ background: c.divider }}>
          <div
            className="h-full rounded-r-full transition-all duration-500"
            style={{ background: c.accent, width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>

        <div className="p-4 pb-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1.5 w-1.5 rounded-full" style={{ background: c.accent }} />
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: c.accent }}>
              Step {step + 1} of {totalSteps}
            </span>
          </div>
          <h3 className="text-sm font-bold mb-1.5" style={{ color: c.textPrimary }}>{current.title}</h3>
          <p className="text-xs leading-relaxed" style={{ color: c.textSecondary }}>{current.body}</p>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: c.divider }}>
          <button onClick={onExit} className="text-xs font-medium hover:underline" style={{ color: c.textMuted }}>
            Skip tour
          </button>
          <div className="flex gap-2">
            {!isFirst && (
              <button
                onClick={onPrev}
                className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-white/5"
                style={{ borderColor: c.divider, color: c.textSecondary }}
              >
                <ChevronLeft className="h-3 w-3" /> Back
              </button>
            )}
            <button
              onClick={isLast ? onExit : onNext}
              className="rounded-lg px-4 py-1.5 text-xs font-bold"
              style={{ background: c.accent, color: "#0a0c10" }}
            >
              {isLast ? "Finish" : "Next"}
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
  const [focusedHcp, setFocusedHcp] = useState<string | undefined>();
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [demoStep, setDemoStep] = useState(0);
  const [demoHcpTab, setDemoHcpTab] = useState<"engagements" | "agentic" | "persona" | undefined>();

  const handleNavigateToHcp = useCallback((hcpName: string) => {
    setFocusedHcp(hcpName);
    setActiveTab("engagements");
  }, []);

  const clearFocusedHcp = useCallback(() => setFocusedHcp(undefined), []);

  const applyDemoStep = useCallback((demoId: string, step: number) => {
    const steps = demoStepData[demoId];
    if (!steps?.[step]) return;
    const s = steps[step];
    setDemoStep(step);
    setActiveTab(s.tab);
    if (s.action === "open-hcp") {
      setFocusedHcp("Dr. Sarah Chen");
      setDemoHcpTab("engagements");
    } else if (s.action?.startsWith("hcp-tab:")) {
      setDemoHcpTab(s.action.split(":")[1] as "engagements" | "agentic" | "persona");
    } else {
      setDemoHcpTab(undefined);
    }
  }, []);

  const handleStartDemo = useCallback((demoId: string) => {
    setActiveDemo(demoId);
    applyDemoStep(demoId, 0);
  }, [applyDemoStep]);

  const handleDemoNext = useCallback(() => {
    if (!activeDemo) return;
    applyDemoStep(activeDemo, demoStep + 1);
  }, [activeDemo, demoStep, applyDemoStep]);

  const handleDemoPrev = useCallback(() => {
    if (!activeDemo || demoStep <= 0) return;
    applyDemoStep(activeDemo, demoStep - 1);
  }, [activeDemo, demoStep, applyDemoStep]);

  const handleExitDemo = useCallback(() => {
    setActiveDemo(null);
    setDemoStep(0);
    setDemoHcpTab(undefined);
  }, []);

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
        <div className="flex-1 flex items-end justify-center overflow-hidden px-2 pb-4">
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
          {activeTab === "dashboard" && <DashboardView onNavigateToHcp={handleNavigateToHcp} />}

          {/* ═══ Virtual Coordinator Tab ═══ */}
          {activeTab === "virtual-coordinator" && <VirtualCoordinatorView onNavigateToHcp={handleNavigateToHcp} />}

          {/* ═══ Engagements Tab ═══ */}
          {activeTab === "engagements" && <EngagementsView focusedHcp={focusedHcp} onClearFocus={clearFocusedHcp} demoHcpTab={demoHcpTab} />}
        </div>
      </main>

      {!activeDemo && <DemoLauncher onStart={handleStartDemo} />}
      {activeDemo && (
        <DemoWalkthrough
          demoId={activeDemo}
          step={demoStep}
          onNext={handleDemoNext}
          onPrev={handleDemoPrev}
          onExit={handleExitDemo}
        />
      )}
    </div>
  );
}
