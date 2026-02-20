"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Zap,
  Cpu,
  HardDrive,
  Smartphone,
  Mail,
  Globe,
  Headphones,
  Bot,
  Package,
  Heart,
  ShieldCheck,
  Stethoscope,
  FileText,
  Boxes,
  Plus,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Minus,
  Phone,
  Send,
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowUpRight,
  BarChart3,
  Activity,
} from "lucide-react";

const c = {
  bg: "#090b0f",
  card: "#0c0e12",
  cardBorder: "#131720",
  textPrimary: "#f7f7f7",
  textSecondary: "#94969c",
  accent: "#0deefd",
  green: "#75dfa6",
  orange: "#f79009",
  red: "#f04438",
  divider: "#1e2028",
  glow: "rgba(13, 238, 253, 0.12)",
};

type IntegrationStatus = "good" | "warning" | "error";

interface Integration {
  name: string;
  status: IntegrationStatus;
  icon: React.ElementType;
  stats: { label: string; value: string }[];
  enabled: boolean;
}

const integrationData: Integration[] = [
  { name: "Samples", status: "warning", icon: Package, stats: [{ label: "Stock:", value: "85%" }, { label: "Low Items:", value: "3" }], enabled: true },
  { name: "Hub Services", status: "good", icon: Heart, stats: [{ label: "Enrolled:", value: "2,458" }, { label: "Growth:", value: "+5%" }], enabled: true },
  { name: "Prior Auth", status: "good", icon: ShieldCheck, stats: [{ label: "Pending:", value: "25" }, { label: "Approved:", value: "65" }], enabled: true },
  { name: "Patient Support", status: "good", icon: Stethoscope, stats: [{ label: "Tickets:", value: "14" }, { label: "Avg Time:", value: "2m" }], enabled: true },
  { name: "Access & Coverage", status: "good", icon: FileText, stats: [{ label: "Verified:", value: "98%" }, { label: "Issues:", value: "12" }], enabled: true },
  { name: "Materials", status: "error", icon: Boxes, stats: [{ label: "Orders:", value: "8" }, { label: "Pending:", value: "2" }], enabled: true },
];

const integrationDetails: Record<string, { description: string; metrics: { label: string; value: string; change?: string }[]; config: { label: string; value: string }[]; recentEvents: { event: string; time: string; status: "success" | "warning" | "error" }[] }> = {
  Samples: {
    description: "Manages sample inventory, fulfillment requests, and shipment tracking across all territories.",
    metrics: [
      { label: "Total Inventory", value: "12,450 units", change: "-3.2%" },
      { label: "Fulfilled This Month", value: "847", change: "+12%" },
      { label: "Avg Fulfillment Time", value: "2.4 days", change: "-8%" },
      { label: "Pending Requests", value: "23" },
    ],
    config: [
      { label: "Auto-reorder Threshold", value: "15%" },
      { label: "Max Per HCP/Month", value: "6 units" },
      { label: "Approval Required", value: "Yes (>3 units)" },
      { label: "Sync Frequency", value: "Real-time" },
    ],
    recentEvents: [
      { event: "Low stock alert: Stelazio 10mg", time: "12m ago", status: "warning" },
      { event: "Shipment #4892 delivered", time: "45m ago", status: "success" },
      { event: "Reorder triggered for Respira 25mg", time: "1h ago", status: "success" },
      { event: "Fulfillment delay: Region NE-2", time: "2h ago", status: "warning" },
      { event: "Inventory sync completed", time: "3h ago", status: "success" },
    ],
  },
  "Hub Services": {
    description: "Patient hub enrollment, benefits verification, and co-pay assistance program management.",
    metrics: [
      { label: "Active Enrollments", value: "2,458", change: "+5%" },
      { label: "New This Month", value: "124", change: "+18%" },
      { label: "Copay Claims Processed", value: "1,892", change: "+7%" },
      { label: "Avg Processing Time", value: "1.8 days" },
    ],
    config: [
      { label: "Auto-Enrollment", value: "Enabled" },
      { label: "Eligibility Check", value: "Real-time" },
      { label: "Copay Cap", value: "$25/fill" },
      { label: "Renewal Period", value: "12 months" },
    ],
    recentEvents: [
      { event: "32 new enrollments processed", time: "1h ago", status: "success" },
      { event: "Benefits verification batch completed", time: "2h ago", status: "success" },
      { event: "Copay card activation: 18 patients", time: "3h ago", status: "success" },
      { event: "Eligibility API latency spike", time: "5h ago", status: "warning" },
      { event: "Monthly enrollment report generated", time: "8h ago", status: "success" },
    ],
  },
  "Prior Auth": {
    description: "Automates prior authorization submissions, tracks approvals, and manages appeals workflows.",
    metrics: [
      { label: "Approval Rate", value: "72%", change: "+4%" },
      { label: "Avg Turnaround", value: "3.2 days", change: "-12%" },
      { label: "Pending Reviews", value: "25" },
      { label: "Appeals Won", value: "84%" },
    ],
    config: [
      { label: "Auto-Submit", value: "Enabled" },
      { label: "Payer Integration", value: "12 payers" },
      { label: "Appeal Auto-Generate", value: "On denial" },
      { label: "Escalation Threshold", value: "5 business days" },
    ],
    recentEvents: [
      { event: "PA #7823 approved (Aetna)", time: "25m ago", status: "success" },
      { event: "PA #7819 requires additional info", time: "1h ago", status: "warning" },
      { event: "Appeal #342 submitted (UHC)", time: "2h ago", status: "success" },
      { event: "PA #7815 denied — auto-appeal triggered", time: "3h ago", status: "error" },
      { event: "Batch submission: 8 new PAs", time: "4h ago", status: "success" },
    ],
  },
  "Patient Support": {
    description: "Handles patient inquiries, coordinates nurse educator sessions, and manages support ticket workflows.",
    metrics: [
      { label: "Open Tickets", value: "14", change: "-22%" },
      { label: "Resolved Today", value: "38", change: "+15%" },
      { label: "Avg Resolution", value: "2m 15s", change: "-18%" },
      { label: "CSAT Score", value: "4.7/5" },
    ],
    config: [
      { label: "Auto-Routing", value: "Enabled" },
      { label: "SLA Target", value: "< 5 minutes" },
      { label: "Escalation Path", value: "Nurse → Supervisor" },
      { label: "After-Hours", value: "AI Assistant fallback" },
    ],
    recentEvents: [
      { event: "Ticket #1204 resolved (injection guidance)", time: "8m ago", status: "success" },
      { event: "Nurse session scheduled: Dr. Chen's patient", time: "20m ago", status: "success" },
      { event: "Ticket #1201 escalated to supervisor", time: "35m ago", status: "warning" },
      { event: "AI handled 12 after-hours inquiries", time: "2h ago", status: "success" },
      { event: "Support satisfaction survey: 94% positive", time: "4h ago", status: "success" },
    ],
  },
  "Access & Coverage": {
    description: "Verifies insurance coverage, checks formulary status, and identifies access barriers for prescribed therapies.",
    metrics: [
      { label: "Verification Rate", value: "98%", change: "+1%" },
      { label: "Formulary Coverage", value: "87%", change: "+3%" },
      { label: "Access Issues Found", value: "12", change: "-25%" },
      { label: "Step Therapy Overrides", value: "8" },
    ],
    config: [
      { label: "Auto-Verify", value: "On prescription" },
      { label: "Payer Database", value: "Updated daily" },
      { label: "Step Therapy Check", value: "Enabled" },
      { label: "Alternative Suggestions", value: "Enabled" },
    ],
    recentEvents: [
      { event: "Coverage verified: 45 new prescriptions", time: "30m ago", status: "success" },
      { event: "Formulary change detected: BlueCross IL", time: "1h ago", status: "warning" },
      { event: "Step therapy exception approved", time: "2h ago", status: "success" },
      { event: "Access barrier alert: 3 patients (Cigna)", time: "3h ago", status: "warning" },
      { event: "Daily payer database sync completed", time: "6h ago", status: "success" },
    ],
  },
  Materials: {
    description: "Manages MLR-approved collateral distribution, tracks material orders, and handles fulfillment workflows.",
    metrics: [
      { label: "Active Materials", value: "34", change: "+2" },
      { label: "Orders This Month", value: "8", change: "-40%" },
      { label: "Pending Fulfillment", value: "2" },
      { label: "MLR Expired", value: "3", change: "+3" },
    ],
    config: [
      { label: "Auto-Fulfill", value: "Disabled (review required)" },
      { label: "MLR Expiry Alert", value: "30 days before" },
      { label: "Max Per Request", value: "50 pieces" },
      { label: "Digital Delivery", value: "Enabled" },
    ],
    recentEvents: [
      { event: "3 materials flagged: MLR expiring soon", time: "1h ago", status: "error" },
      { event: "Order #892 pending review", time: "2h ago", status: "warning" },
      { event: "Digital delivery: Stelazio brochure (14 HCPs)", time: "3h ago", status: "success" },
      { event: "New material uploaded: Respira dosing guide", time: "5h ago", status: "success" },
      { event: "MLR approval received: Cardiovex patient card", time: "8h ago", status: "success" },
    ],
  },
};

interface Channel {
  label: string;
  value: string;
  icon: React.ElementType;
  trend: "up" | "down" | "flat";
  direction: "Inbound" | "Outbound";
}

const channelData: Channel[] = [
  { label: "SMS", value: "854", icon: Smartphone, trend: "up", direction: "Outbound" },
  { label: "Email", value: "1,243", icon: Mail, trend: "flat", direction: "Outbound" },
  { label: "Intelligent Media", value: "432", icon: Globe, trend: "up", direction: "Inbound" },
  { label: "Concierge", value: "128", icon: Headphones, trend: "down", direction: "Inbound" },
  { label: "AI Assistant", value: "2,156", icon: Bot, trend: "up", direction: "Inbound" },
  { label: "Direct Mail", value: "312", icon: Send, trend: "up", direction: "Inbound" },
  { label: "P2P Calling", value: "476", icon: Phone, trend: "up", direction: "Outbound" },
];

interface ChannelDetail {
  description: string;
  metrics: { label: string; value: string; change?: string }[];
  weeklyVolume: number[];
  sampleEngagements: { hcp: string; specialty: string; summary: string; time: string; outcome: string }[];
}

const channelDetails: Record<string, ChannelDetail> = {
  SMS: {
    description: "Outbound SMS outreach for appointment reminders, sample follow-ups, and targeted clinical messaging.",
    metrics: [
      { label: "Messages Sent (30d)", value: "854", change: "+14%" },
      { label: "Delivery Rate", value: "97.2%" },
      { label: "Response Rate", value: "34%", change: "+6%" },
      { label: "Opt-Out Rate", value: "1.2%", change: "-0.3%" },
    ],
    weeklyVolume: [112, 98, 134, 156, 128, 142, 84],
    sampleEngagements: [
      { hcp: "Dr. Sarah Chen", specialty: "Cardiology", summary: "Replied to Stelazio dosing reminder with question about titration schedule", time: "2m ago", outcome: "Engaged — routed to medical" },
      { hcp: "Dr. David Park", specialty: "Neurology", summary: "Confirmed interest in Neurovia lunch-and-learn event", time: "32m ago", outcome: "Event RSVP confirmed" },
      { hcp: "Dr. Amy Walsh", specialty: "Cardiology", summary: "Requested callback re: patient access issue for Respira", time: "1h ago", outcome: "Concierge follow-up scheduled" },
      { hcp: "Dr. Robert Kim", specialty: "Cardiology", summary: "Opened sample request link from SMS", time: "2h ago", outcome: "Sample order placed" },
    ],
  },
  Email: {
    description: "Outbound email campaigns including clinical updates, KOL content, and personalized HCP engagement sequences.",
    metrics: [
      { label: "Emails Sent (30d)", value: "1,243", change: "+8%" },
      { label: "Open Rate", value: "42%", change: "+3%" },
      { label: "Click Rate", value: "12.5%", change: "+1.8%" },
      { label: "Unsubscribe Rate", value: "0.4%" },
    ],
    weeklyVolume: [165, 189, 172, 198, 201, 178, 140],
    sampleEngagements: [
      { hcp: "Dr. James Wilson", specialty: "Neurology", summary: "Opened Neurovia Phase III results email, clicked full study link", time: "5m ago", outcome: "Content engaged — add to nurture" },
      { hcp: "Dr. Lisa Thompson", specialty: "Cardiology", summary: "Forwarded Respira dosing guide to colleague", time: "1h ago", outcome: "Viral share detected" },
      { hcp: "Dr. Emily Zhang", specialty: "Dermatology", summary: "Clicked CTA for Oncurel formulary coverage tool", time: "2h ago", outcome: "Access tool opened" },
      { hcp: "Dr. Kevin Morris", specialty: "Pulmonology", summary: "Replied asking about upcoming Respira webinar dates", time: "3h ago", outcome: "Webinar invite sent" },
    ],
  },
  "Intelligent Media": {
    description: "Inbound content hub with AI-personalized clinical resources, interactive tools, and adaptive learning modules.",
    metrics: [
      { label: "Unique Visitors (30d)", value: "432", change: "+22%" },
      { label: "Avg Session Duration", value: "4m 32s", change: "+18%" },
      { label: "Content Interactions", value: "1,847", change: "+35%" },
      { label: "Return Visitor Rate", value: "61%" },
    ],
    weeklyVolume: [48, 56, 62, 72, 68, 74, 52],
    sampleEngagements: [
      { hcp: "Dr. Maria Garcia", specialty: "Oncology", summary: "Completed Oncurel MOA interactive module (score: 92%)", time: "15m ago", outcome: "Certificate generated" },
      { hcp: "Dr. Sarah Chen", specialty: "Cardiology", summary: "Viewed Stelazio patient case studies (3 of 5 completed)", time: "45m ago", outcome: "Partial completion — nudge scheduled" },
      { hcp: "Dr. Alan Foster", specialty: "Neurology", summary: "Downloaded Neurovia prescribing information PDF", time: "1h ago", outcome: "Resource accessed" },
      { hcp: "Dr. Emily Zhang", specialty: "Dermatology", summary: "Used Oncurel dosing calculator for 2 patient scenarios", time: "2h ago", outcome: "Clinical tool engaged" },
    ],
  },
  Concierge: {
    description: "Inbound high-touch service providing live support for scheduling, access issues, and personalized HCP requests.",
    metrics: [
      { label: "Sessions (30d)", value: "128", change: "-8%" },
      { label: "Avg Handle Time", value: "6m 45s", change: "-12%" },
      { label: "Resolution Rate", value: "94%", change: "+2%" },
      { label: "Satisfaction Score", value: "4.8/5" },
    ],
    weeklyVolume: [22, 18, 20, 16, 19, 17, 16],
    sampleEngagements: [
      { hcp: "Dr. Robert Kim", specialty: "Cardiology", summary: "Called about patient denied PA for Cardiovex — concierge initiated appeal", time: "18m ago", outcome: "Appeal submitted" },
      { hcp: "Dr. Lisa Thompson", specialty: "Cardiology", summary: "Requested speaker program details for Respira regional event", time: "1h ago", outcome: "Speaker deck + logistics sent" },
      { hcp: "Dr. Alan Foster", specialty: "Neurology", summary: "Asked for head-to-head data vs. competitor for Neurovia", time: "3h ago", outcome: "Medical affairs referral" },
      { hcp: "Dr. Kevin Morris", specialty: "Pulmonology", summary: "Inquired about Respira samples for new patient starts", time: "5h ago", outcome: "Sample shipment triggered" },
    ],
  },
  "AI Assistant": {
    description: "Inbound AI-powered conversational assistant handling clinical queries, dosing lookups, and resource recommendations 24/7.",
    metrics: [
      { label: "Conversations (30d)", value: "2,156", change: "+28%" },
      { label: "Containment Rate", value: "89%", change: "+5%" },
      { label: "Avg Messages/Session", value: "4.2" },
      { label: "Escalation Rate", value: "11%", change: "-5%" },
    ],
    weeklyVolume: [280, 295, 310, 325, 312, 340, 294],
    sampleEngagements: [
      { hcp: "Dr. Maria Garcia", specialty: "Oncology", summary: "Asked about Oncurel dose adjustment in renal impairment — AI provided PI guidance", time: "12m ago", outcome: "Resolved in-session" },
      { hcp: "Dr. David Park", specialty: "Neurology", summary: "Queried Neurovia drug interaction with existing regimen", time: "28m ago", outcome: "Resolved — interaction guide sent" },
      { hcp: "Dr. Sarah Chen", specialty: "Cardiology", summary: "Requested Stelazio vs. standard-of-care comparison data", time: "1h ago", outcome: "Escalated to medical affairs" },
      { hcp: "Dr. Amy Walsh", specialty: "Cardiology", summary: "Asked about patient assistance program eligibility criteria", time: "2h ago", outcome: "Hub enrollment link provided" },
    ],
  },
  "Direct Mail": {
    description: "Inbound direct mail fulfillment for physical collateral, sample kits, and targeted promotional materials.",
    metrics: [
      { label: "Pieces Sent (30d)", value: "312", change: "+10%" },
      { label: "Delivery Confirmation", value: "96%" },
      { label: "QR Code Scans", value: "87", change: "+24%" },
      { label: "Follow-Up Conversion", value: "18%" },
    ],
    weeklyVolume: [38, 42, 48, 52, 45, 50, 37],
    sampleEngagements: [
      { hcp: "Dr. Emily Zhang", specialty: "Dermatology", summary: "Scanned QR code from Oncurel patient brochure — landed on dosing tool", time: "25m ago", outcome: "Digital engagement triggered" },
      { hcp: "Dr. James Wilson", specialty: "Neurology", summary: "Received Neurovia welcome kit — office confirmed delivery", time: "2h ago", outcome: "Delivery confirmed" },
      { hcp: "Dr. Lisa Thompson", specialty: "Cardiology", summary: "Mailed Respira clinical summary packet", time: "1d ago", outcome: "In transit" },
      { hcp: "Dr. Robert Kim", specialty: "Cardiology", summary: "Requested additional patient education materials for Cardiovex", time: "2d ago", outcome: "Fulfilled and shipped" },
    ],
  },
  "P2P Calling": {
    description: "Outbound position-to-position calling connecting field reps and medical liaisons directly with HCP offices.",
    metrics: [
      { label: "Calls Made (30d)", value: "476", change: "+16%" },
      { label: "Connect Rate", value: "38%", change: "+4%" },
      { label: "Avg Call Duration", value: "8m 12s", change: "+22%" },
      { label: "Follow-Up Scheduled", value: "42%", change: "+8%" },
    ],
    weeklyVolume: [58, 64, 72, 78, 68, 82, 54],
    sampleEngagements: [
      { hcp: "Dr. Alan Foster", specialty: "Neurology", summary: "MSL call: discussed Neurovia long-term efficacy data from extension study", time: "45m ago", outcome: "F2F meeting requested" },
      { hcp: "Dr. Sarah Chen", specialty: "Cardiology", summary: "Rep call: reviewed Stelazio titration protocol with office staff", time: "1h ago", outcome: "Samples requested" },
      { hcp: "Dr. Kevin Morris", specialty: "Pulmonology", summary: "MSL call: answered questions on Respira in special populations", time: "3h ago", outcome: "Follow-up data package sent" },
      { hcp: "Dr. Maria Garcia", specialty: "Oncology", summary: "Rep call: coordinated Oncurel lunch-and-learn logistics", time: "5h ago", outcome: "Event confirmed for next week" },
    ],
  },
};

function statusDotColor(s: IntegrationStatus) {
  if (s === "good") return c.green;
  if (s === "warning") return c.orange;
  return c.red;
}

function TrendIcon({ trend }: { trend: "up" | "down" | "flat" }) {
  if (trend === "up") return <ChevronUp className="h-3 w-3" style={{ color: c.accent }} />;
  if (trend === "down") return <ChevronDown className="h-3 w-3" style={{ color: c.accent }} />;
  return <Minus className="h-3 w-3" style={{ color: c.accent }} />;
}

function Toggle({ initial }: { initial: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); setOn(!on); }}
      className="relative h-6 w-11 rounded-full transition-colors shrink-0"
      style={{
        backgroundColor: on ? c.accent : "#252830",
        boxShadow: on ? `0 0 8px ${c.accent}66` : "none",
      }}
    >
      <span
        className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform"
        style={{ transform: on ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  );
}

function DashedConnector({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={`flex items-center ${side === "left" ? "justify-end" : "justify-start"}`}
      style={{ width: 48 }}
    >
      <svg width="48" height="2" className="overflow-visible">
        <line
          x1="0" y1="1" x2="48" y2="1"
          stroke={c.accent}
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.35"
        />
        <circle
          cx={side === "left" ? 48 : 0}
          cy="1" r="2.5"
          fill={c.accent}
          opacity="0.5"
        />
      </svg>
    </div>
  );
}

export default function AscendCoordinatorManager() {
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  return (
    <>
      <section
        className="rounded-2xl border overflow-hidden"
        style={{ background: c.bg, borderColor: c.cardBorder }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: c.cardBorder, background: c.card }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ background: `${c.accent}15`, border: `1px solid ${c.accent}30` }}
            >
              <Zap className="h-5 w-5" style={{ color: c.accent }} />
            </div>
            <div>
              <h2
                className="text-sm font-bold uppercase tracking-widest"
                style={{ color: c.textPrimary }}
              >
                Virtual Coordinator
              </h2>
              <p className="text-xs" style={{ color: c.textSecondary }}>
                Virtual Coordinator v2.4
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs" style={{ color: c.textSecondary }}>
              <Cpu className="h-3.5 w-3.5" />
              <span className="font-mono">12%</span>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: c.textSecondary }}>
              <HardDrive className="h-3.5 w-3.5" />
              <span className="font-mono">4.2GB</span>
            </div>
            <span
              className="rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider"
              style={{
                color: c.accent,
                border: `1px solid ${c.accent}40`,
                background: `${c.accent}10`,
                textShadow: `0 0 6px ${c.accent}40`,
              }}
            >
              System Optimal
            </span>
          </div>
        </div>

        {/* ── Body: 3-column layout ── */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-0 px-6 py-6">
          {/* ─ LEFT: Integrations ─ */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: c.textSecondary }}
              >
                Integrations
              </h3>
              <button
                className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold"
                style={{
                  borderColor: c.accent,
                  color: c.accent,
                  background: `${c.accent}08`,
                }}
              >
                <Plus className="h-3 w-3" />
                Add Module
              </button>
            </div>

            <div className="space-y-3">
              {integrationData.map((intg) => (
                <IntegrationRow key={intg.name} integration={intg} onClick={() => setSelectedIntegration(intg)} />
              ))}
            </div>
          </div>

          {/* ─ CENTER: Virtual Coordinator Orb ─ */}
          <div className="flex items-center justify-center px-4" style={{ width: 260 }}>
            <VirtualCoordinatorOrb />
          </div>

          {/* ─ RIGHT: Engagement Channels ─ */}
          <div>
            <div className="mb-4">
              <h3
                className="text-xs font-bold uppercase tracking-widest text-right"
                style={{ color: c.textSecondary }}
              >
                Engagement Channels
              </h3>
            </div>

            <div className="space-y-3">
              {channelData.map((ch) => (
                <ChannelRow key={ch.label} channel={ch} onClick={() => setSelectedChannel(ch)} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div
          className="flex items-center justify-between px-6 py-3 border-t text-xs font-mono"
          style={{ borderColor: c.cardBorder, color: c.textSecondary, background: c.card }}
        >
          <span>6 / 6 modules active</span>
          <span>7 channels routing</span>
          <span style={{ color: c.accent }}>Real-time sync enabled</span>
        </div>
      </section>

      {selectedIntegration && (
        <IntegrationDetailModal
          integration={selectedIntegration}
          onClose={() => setSelectedIntegration(null)}
        />
      )}
      {selectedChannel && (
        <ChannelDetailModal
          channel={selectedChannel}
          onClose={() => setSelectedChannel(null)}
        />
      )}
    </>
  );
}

/* ── Integration Row ── */
function IntegrationRow({ integration, onClick }: { integration: Integration; onClick: () => void }) {
  const Icon = integration.icon;
  return (
    <div className="flex items-center gap-2">
      <div
        role="button"
        tabIndex={0}
        className="flex-1 flex items-center gap-3 rounded-xl border px-3 py-3 cursor-pointer transition-all hover:border-[#0deefd33]"
        style={{
          background: c.card,
          borderColor: c.cardBorder,
          boxShadow: `0 0 1px ${c.accent}15`,
        }}
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      >
        <GripVertical className="h-4 w-4 shrink-0 cursor-grab opacity-30" style={{ color: c.textSecondary }} />
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ background: `${c.accent}10`, border: `1px solid ${c.accent}20` }}
        >
          <Icon className="h-4 w-4" style={{ color: c.accent }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold" style={{ color: c.textPrimary }}>
              {integration.name}
            </span>
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: statusDotColor(integration.status) }}
            />
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            {integration.stats.map((s) => (
              <span key={s.label} className="text-xs">
                <span style={{ color: c.textSecondary }}>{s.label}</span>{" "}
                <span className="font-semibold" style={{ color: c.textPrimary }}>
                  {s.value}
                </span>
              </span>
            ))}
          </div>
        </div>
        <Toggle initial={integration.enabled} />
      </div>
      <DashedConnector side="left" />
    </div>
  );
}

/* ── Channel Row ── */
function ChannelRow({ channel, onClick }: { channel: Channel; onClick: () => void }) {
  const Icon = channel.icon;
  return (
    <div className="flex items-center gap-2">
      <DashedConnector side="right" />
      <div
        role="button"
        tabIndex={0}
        className="flex-1 flex items-center justify-between rounded-xl border px-4 py-3 cursor-pointer transition-all hover:border-[#0deefd33]"
        style={{
          background: c.card,
          borderColor: c.cardBorder,
          boxShadow: `0 0 1px ${c.accent}15`,
        }}
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      >
        <div className="flex items-center gap-2">
          <TrendIcon trend={channel.trend} />
          <span className="text-xs" style={{ color: c.textSecondary }}>
            {channel.direction}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium" style={{ color: c.textSecondary }}>
            {channel.label}
          </span>
          <span
            className="text-2xl font-bold tabular-nums"
            style={{ color: c.accent, textShadow: `0 0 10px ${c.accent}30` }}
          >
            {channel.value}
          </span>
        </div>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ background: `${c.accent}10`, border: `1px solid ${c.accent}20` }}
        >
          <Icon className="h-4 w-4" style={{ color: c.accent }} />
        </div>
      </div>
    </div>
  );
}

/* ── Virtual Coordinator Orb ── */
function VirtualCoordinatorOrb() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${c.accent}08 0%, transparent 70%)`,
        }}
      />

      {/* Outer ring */}
      <div
        className="absolute rounded-full vc-spin-slow"
        style={{
          width: 200,
          height: 200,
          border: `1px solid ${c.accent}18`,
        }}
      />

      {/* Middle ring (dashed, reverse spin) */}
      <svg
        className="absolute vc-spin-reverse"
        width="170"
        height="170"
        viewBox="0 0 170 170"
      >
        <circle
          cx="85"
          cy="85"
          r="83"
          fill="none"
          stroke={c.accent}
          strokeWidth="0.8"
          strokeDasharray="6 6"
          opacity="0.25"
        />
      </svg>

      {/* Inner ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: 140,
          height: 140,
          border: `1px solid ${c.accent}20`,
          boxShadow: `inset 0 0 30px ${c.accent}08`,
        }}
      />

      {/* Center orb */}
      <div
        className="relative flex flex-col items-center justify-center rounded-full z-10"
        style={{
          width: 110,
          height: 110,
          background: `radial-gradient(circle at 40% 35%, ${c.accent}18, ${c.bg} 70%)`,
          border: `1.5px solid ${c.accent}30`,
          boxShadow: `0 0 30px ${c.accent}15, inset 0 0 20px ${c.accent}08`,
        }}
      >
        <Zap className="h-7 w-7 mb-1" style={{ color: c.accent, filter: `drop-shadow(0 0 4px ${c.accent}60)` }} />
        <span
          className="text-[9px] font-bold uppercase tracking-[0.15em] text-center leading-tight"
          style={{ color: c.accent, textShadow: `0 0 8px ${c.accent}40` }}
        >
          Virtual
          <br />
          Coordinator
        </span>
      </div>

      {/* Pulsing dots on outer ring */}
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <div
          key={deg}
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{
            backgroundColor: c.accent,
            opacity: 0.4,
            top: `${50 - 45 * Math.cos((deg * Math.PI) / 180)}%`,
            left: `${50 + 45 * Math.sin((deg * Math.PI) / 180)}%`,
            transform: "translate(-50%, -50%)",
            boxShadow: `0 0 4px ${c.accent}`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Modal Backdrop ── */
function ModalBackdrop({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {children}
    </div>
  );
}

function EventStatusIcon({ status }: { status: "success" | "warning" | "error" }) {
  if (status === "success") return <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: c.green }} />;
  if (status === "warning") return <AlertTriangle className="h-3.5 w-3.5 shrink-0" style={{ color: c.orange }} />;
  return <XCircle className="h-3.5 w-3.5 shrink-0" style={{ color: c.red }} />;
}

/* ── Integration Detail Modal ── */
function IntegrationDetailModal({ integration, onClose }: { integration: Integration; onClose: () => void }) {
  const Icon = integration.icon;
  const details = integrationDetails[integration.name];
  if (!details) return null;

  const statusLabel = integration.status === "good" ? "Healthy" : integration.status === "warning" ? "Needs Attention" : "Error";

  return (
    <ModalBackdrop onClose={onClose}>
      <div
        className="w-full max-w-2xl rounded-2xl border overflow-hidden animate-in fade-in zoom-in-95"
        style={{ background: c.bg, borderColor: c.cardBorder, maxHeight: "85vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: c.cardBorder, background: c.card }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: `${c.accent}15`, border: `1px solid ${c.accent}30` }}>
              <Icon className="h-5 w-5" style={{ color: c.accent }} />
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: c.textPrimary }}>{integration.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: statusDotColor(integration.status) }} />
                <span className="text-xs font-medium" style={{ color: statusDotColor(integration.status) }}>{statusLabel}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/5" style={{ color: c.textSecondary }}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 space-y-6" style={{ maxHeight: "calc(85vh - 72px)" }}>
          <p className="text-sm leading-relaxed" style={{ color: c.textSecondary }}>{details.description}</p>

          {/* Metrics */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: c.textSecondary }}>Key Metrics</h3>
            <div className="grid grid-cols-2 gap-3">
              {details.metrics.map((m) => (
                <div key={m.label} className="rounded-xl border px-4 py-3" style={{ background: c.card, borderColor: c.cardBorder }}>
                  <p className="text-xs mb-1" style={{ color: c.textSecondary }}>{m.label}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold" style={{ color: c.textPrimary }}>{m.value}</span>
                    {m.change && (
                      <span className="flex items-center gap-0.5 text-xs font-medium" style={{ color: m.change.startsWith("-") && !m.label.includes("Time") && !m.label.includes("Issues") ? c.red : c.green }}>
                        <ArrowUpRight className="h-3 w-3" style={{ transform: m.change.startsWith("-") ? "rotate(90deg)" : undefined }} />
                        {m.change}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Configuration */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: c.textSecondary }}>Configuration</h3>
            <div className="rounded-xl border" style={{ background: c.card, borderColor: c.cardBorder }}>
              {details.config.map((cfg, i) => (
                <div key={cfg.label} className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: i < details.config.length - 1 ? `1px solid ${c.cardBorder}` : undefined }}>
                  <span className="text-sm" style={{ color: c.textSecondary }}>{cfg.label}</span>
                  <span className="text-sm font-semibold" style={{ color: c.textPrimary }}>{cfg.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Events */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: c.textSecondary }}>Recent Events</h3>
            <div className="space-y-0 rounded-xl border overflow-hidden" style={{ background: c.card, borderColor: c.cardBorder }}>
              {details.recentEvents.map((ev, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3"
                  style={{ borderBottom: i < details.recentEvents.length - 1 ? `1px solid ${c.cardBorder}` : undefined }}
                >
                  <EventStatusIcon status={ev.status} />
                  <span className="flex-1 text-sm" style={{ color: c.textPrimary }}>{ev.event}</span>
                  <span className="text-xs shrink-0 flex items-center gap-1" style={{ color: c.textSecondary }}>
                    <Clock className="h-3 w-3" />
                    {ev.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
}

/* ── Channel Detail Modal ── */
function ChannelDetailModal({ channel, onClose }: { channel: Channel; onClose: () => void }) {
  const Icon = channel.icon;
  const details = channelDetails[channel.label];
  if (!details) return null;

  const maxVol = Math.max(...details.weeklyVolume);
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <ModalBackdrop onClose={onClose}>
      <div
        className="w-full max-w-3xl rounded-2xl border overflow-hidden"
        style={{ background: c.bg, borderColor: c.cardBorder, maxHeight: "85vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: c.cardBorder, background: c.card }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: `${c.accent}15`, border: `1px solid ${c.accent}30` }}>
              <Icon className="h-5 w-5" style={{ color: c.accent }} />
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: c.textPrimary }}>{channel.label}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    color: channel.direction === "Outbound" ? c.accent : c.green,
                    border: `1px solid ${channel.direction === "Outbound" ? c.accent : c.green}33`,
                  }}
                >
                  {channel.direction}
                </span>
                <span className="text-xs" style={{ color: c.textSecondary }}>
                  <span className="font-bold" style={{ color: c.accent }}>{channel.value}</span> engagements (30d)
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/5" style={{ color: c.textSecondary }}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 space-y-6" style={{ maxHeight: "calc(85vh - 72px)" }}>
          <p className="text-sm leading-relaxed" style={{ color: c.textSecondary }}>{details.description}</p>

          {/* Metrics */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: c.textSecondary }}>
              <span className="flex items-center gap-2"><BarChart3 className="h-3.5 w-3.5" /> Key Metrics</span>
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {details.metrics.map((m) => (
                <div key={m.label} className="rounded-xl border px-4 py-3" style={{ background: c.card, borderColor: c.cardBorder }}>
                  <p className="text-xs mb-1" style={{ color: c.textSecondary }}>{m.label}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold" style={{ color: c.textPrimary }}>{m.value}</span>
                    {m.change && (
                      <span className="text-xs font-medium" style={{ color: m.change.startsWith("-") && !m.label.toLowerCase().includes("opt") && !m.label.toLowerCase().includes("unsub") && !m.label.toLowerCase().includes("escalat") ? c.green : m.change.startsWith("+") ? c.green : c.red }}>
                        {m.change}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Volume Chart */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: c.textSecondary }}>Weekly Volume</h3>
            <div className="rounded-xl border p-4" style={{ background: c.card, borderColor: c.cardBorder }}>
              <div className="flex items-end justify-between gap-2" style={{ height: 100 }}>
                {details.weeklyVolume.map((vol, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-mono" style={{ color: c.textSecondary }}>{vol}</span>
                    <div
                      className="w-full rounded-t-md transition-all"
                      style={{
                        height: `${(vol / maxVol) * 70}px`,
                        background: `linear-gradient(to top, ${c.accent}, ${c.accent}60)`,
                        boxShadow: `0 0 8px ${c.accent}30`,
                      }}
                    />
                    <span className="text-[10px]" style={{ color: c.textSecondary }}>{dayLabels[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sample Engagements */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: c.textSecondary }}>
              <span className="flex items-center gap-2"><Activity className="h-3.5 w-3.5" /> Sample Engagements</span>
            </h3>
            <div className="rounded-xl border overflow-hidden" style={{ background: c.card, borderColor: c.cardBorder }}>
              {details.sampleEngagements.map((eng, i) => (
                <div
                  key={i}
                  className="px-4 py-3.5"
                  style={{ borderBottom: i < details.sampleEngagements.length - 1 ? `1px solid ${c.cardBorder}` : undefined }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold" style={{ color: c.textPrimary }}>{eng.hcp}</span>
                      <span className="text-xs rounded-full px-2 py-0.5" style={{ color: c.textSecondary, border: `1px solid ${c.divider}` }}>{eng.specialty}</span>
                    </div>
                    <span className="text-xs flex items-center gap-1 shrink-0" style={{ color: c.textSecondary }}>
                      <Clock className="h-3 w-3" />
                      {eng.time}
                    </span>
                  </div>
                  <p className="text-sm mb-1.5" style={{ color: c.textSecondary }}>{eng.summary}</p>
                  <span
                    className="inline-flex items-center gap-1 text-xs font-semibold"
                    style={{ color: c.accent }}
                  >
                    <ArrowUpRight className="h-3 w-3" />
                    {eng.outcome}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
}
