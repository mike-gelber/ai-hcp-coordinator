"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Zap,
  Cpu,
  HardDrive,
  Smartphone,
  Mail,
  Globe,
  Headphones,
  Package,
  Heart,
  ShieldCheck,
  Stethoscope,
  FileText,
  Boxes,
  Plus,
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
  Search,
  Truck,
  ClipboardList,
  Syringe,
  Building2,
  Megaphone,
  UserCheck,
  FlaskConical,
  CalendarCheck,
  Lock,
  BadgeCheck,
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

type ModuleCategory = "Patient Services" | "Field Operations" | "Compliance & Safety" | "Analytics" | "Clinical";

interface CatalogModule {
  name: string;
  description: string;
  icon: React.ElementType;
  category: ModuleCategory;
  tags: string[];
  popular?: boolean;
}

const activeModuleNames = new Set(integrationData.map((i) => i.name));

const moduleCatalog: CatalogModule[] = [
  { name: "Samples", description: "Track and manage sample inventory, fulfillment, and HCP distribution across territories.", icon: Package, category: "Field Operations", tags: ["samples", "inventory", "fulfillment"] },
  { name: "Hub Services", description: "Patient hub enrollment, benefits verification, and co-pay assistance programs.", icon: Heart, category: "Patient Services", tags: ["hub", "enrollment", "copay"] },
  { name: "Prior Auth", description: "Automate prior authorization submissions, track approvals, and manage appeals.", icon: ShieldCheck, category: "Patient Services", tags: ["prior auth", "payer", "appeals"] },
  { name: "Patient Support", description: "Handle patient inquiries, coordinate nurse educators, and manage tickets.", icon: Stethoscope, category: "Patient Services", tags: ["support", "nurse", "tickets"] },
  { name: "Access & Coverage", description: "Verify insurance coverage, check formulary status, and identify access barriers.", icon: FileText, category: "Patient Services", tags: ["coverage", "formulary", "insurance"] },
  { name: "Materials", description: "Manage MLR-approved collateral distribution, orders, and fulfillment workflows.", icon: Boxes, category: "Field Operations", tags: ["materials", "collateral", "mlr"] },
  { name: "Logistics & Shipping", description: "End-to-end shipment tracking, carrier management, and delivery confirmation for all outbound fulfillment.", icon: Truck, category: "Field Operations", tags: ["shipping", "tracking", "delivery"], popular: true },
  { name: "Field Reporting", description: "Capture and aggregate field rep visit reports, call plans, and territory insights in real time.", icon: ClipboardList, category: "Field Operations", tags: ["field", "reports", "territory"] },
  { name: "Injection Training", description: "Schedule and track injection training sessions for HCPs and patients, including certification.", icon: Syringe, category: "Clinical", tags: ["injection", "training", "certification"], popular: true },
  { name: "Site Management", description: "Manage clinical sites, office contacts, and scheduling preferences across your network.", icon: Building2, category: "Field Operations", tags: ["sites", "offices", "contacts"] },
  { name: "Campaign Orchestration", description: "Design, schedule, and monitor multi-channel promotional campaigns with audience targeting.", icon: Megaphone, category: "Analytics", tags: ["campaigns", "targeting", "promotions"], popular: true },
  { name: "KOL Management", description: "Identify, engage, and track key opinion leaders with relationship scoring and interaction history.", icon: UserCheck, category: "Clinical", tags: ["kol", "speakers", "influence"] },
  { name: "Medical Information", description: "Route and respond to unsolicited medical inquiries with compliant, AI-assisted drafting.", icon: FlaskConical, category: "Compliance & Safety", tags: ["medinfo", "inquiries", "compliant"] },
  { name: "Event Management", description: "Plan and execute speaker programs, advisory boards, and promotional events with compliance checks.", icon: CalendarCheck, category: "Field Operations", tags: ["events", "speakers", "advisory"], popular: true },
  { name: "Adverse Event Reporting", description: "Capture, triage, and escalate adverse events with automated regulatory submission workflows.", icon: AlertTriangle, category: "Compliance & Safety", tags: ["adverse events", "pharmacovigilance", "safety"] },
  { name: "Consent Management", description: "Track and enforce HCP communication consent preferences across all channels and touchpoints.", icon: Lock, category: "Compliance & Safety", tags: ["consent", "opt-in", "preferences"] },
  { name: "Credentialing", description: "Verify HCP credentials, state licenses, and DEA registrations with automated renewal alerts.", icon: BadgeCheck, category: "Compliance & Safety", tags: ["credentials", "licenses", "verification"] },
];

const allCategories: ModuleCategory[] = ["Patient Services", "Field Operations", "Clinical", "Analytics", "Compliance & Safety"];

interface Channel {
  label: string;
  value: string;
  icon: React.ElementType;
  trend: "up" | "down" | "flat";
  direction: "Inbound" | "Outbound";
}

const channelData: Channel[] = [
  { label: "SMS", value: "2,480", icon: Smartphone, trend: "up", direction: "Outbound" },
  { label: "Email", value: "620", icon: Mail, trend: "flat", direction: "Outbound" },
  { label: "Intelligent Media", value: "1,890", icon: Globe, trend: "up", direction: "Inbound" },
  { label: "Concierge", value: "128", icon: Headphones, trend: "down", direction: "Inbound" },
  { label: "Outbound Direct Mail", value: "312", icon: Send, trend: "up", direction: "Outbound" },
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
    description: "Outbound SMS outreach for appointment reminders, sample follow-ups, and targeted clinical messaging. Primary engagement channel.",
    metrics: [
      { label: "Messages Sent (30d)", value: "2,480", change: "+18%" },
      { label: "Delivery Rate", value: "97.2%" },
      { label: "Response Rate", value: "38%", change: "+6%" },
      { label: "Opt-Out Rate", value: "1.2%", change: "-0.3%" },
    ],
    weeklyVolume: [310, 328, 362, 398, 354, 382, 346],
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
      { label: "Emails Sent (30d)", value: "620", change: "+4%" },
      { label: "Open Rate", value: "42%", change: "+3%" },
      { label: "Click Rate", value: "12.5%", change: "+1.8%" },
      { label: "Unsubscribe Rate", value: "0.4%" },
    ],
    weeklyVolume: [78, 92, 86, 98, 94, 88, 84],
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
      { label: "Unique Visitors (30d)", value: "1,890", change: "+34%" },
      { label: "Avg Session Duration", value: "5m 18s", change: "+22%" },
      { label: "Content Interactions", value: "6,420", change: "+42%" },
      { label: "Return Visitor Rate", value: "68%" },
    ],
    weeklyVolume: [220, 248, 272, 298, 284, 310, 258],
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
  "Outbound Direct Mail": {
    description: "Outbound fulfillment for physical collateral, sample kits, and targeted promotional materials.",
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
  const [showAddModule, setShowAddModule] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

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
        <div ref={gridRef} className="relative grid grid-cols-[1fr_auto_1fr] items-start gap-0 px-6 py-6">
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
                className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-[#0deefd12]"
                style={{
                  borderColor: c.accent,
                  color: c.accent,
                  background: `${c.accent}08`,
                }}
                onClick={() => setShowAddModule(true)}
              >
                <Plus className="h-3 w-3" />
                Add Module
              </button>
            </div>

            <div className="space-y-3">
              {integrationData.map((intg, i) => (
                <IntegrationRow key={intg.name} integration={intg} onClick={() => setSelectedIntegration(intg)} index={i} />
              ))}
            </div>
          </div>

          {/* ─ CENTER: Virtual Coordinator Orb ─ */}
          <div className="flex items-center justify-center px-4 self-center" style={{ width: 260 }}>
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
              {channelData.map((ch, i) => (
                <ChannelRow key={ch.label} channel={ch} onClick={() => setSelectedChannel(ch)} index={i} />
              ))}
            </div>
          </div>

          <FlowAnimationLayer containerRef={gridRef} />
        </div>

        {/* ── Footer ── */}
        <div
          className="flex items-center justify-between px-6 py-3 border-t text-xs font-mono"
          style={{ borderColor: c.cardBorder, color: c.textSecondary, background: c.card }}
        >
          <span>6 / 6 modules active</span>
          <span>6 channels routing</span>
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
      {showAddModule && (
        <AddModuleModal onClose={() => setShowAddModule(false)} />
      )}
    </>
  );
}

/* ── Integration Row ── */
function IntegrationRow({ integration, onClick, index }: { integration: Integration; onClick: () => void; index: number }) {
  const Icon = integration.icon;
  return (
    <div className="flex items-center gap-2" data-flow-integration={index}>
      <div
        role="button"
        tabIndex={0}
        className="flex-1 flex items-center gap-3 rounded-xl border px-3 py-3 cursor-pointer transition-all hover:border-[#0deefd33]"
        style={{
          background: c.card,
          borderColor: c.cardBorder,
          boxShadow: `0 0 1px ${c.accent}15`,
          minHeight: 62,
        }}
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      >
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
function ChannelRow({ channel, onClick, index }: { channel: Channel; onClick: () => void; index: number }) {
  const Icon = channel.icon;
  return (
    <div className="flex items-center gap-2" data-flow-channel={index}>
      <DashedConnector side="right" />
      <div
        role="button"
        tabIndex={0}
        className="flex-1 flex items-center gap-3 rounded-xl border px-3 py-3 cursor-pointer transition-all hover:border-[#0deefd33]"
        style={{
          background: c.card,
          borderColor: c.cardBorder,
          boxShadow: `0 0 1px ${c.accent}15`,
          minHeight: 62,
        }}
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      >
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ background: `${c.accent}10`, border: `1px solid ${c.accent}20` }}
        >
          <Icon className="h-4 w-4" style={{ color: c.accent }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold" style={{ color: c.textPrimary }}>
              {channel.label}
            </span>
            <TrendIcon trend={channel.trend} />
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span
              className="text-xl font-bold tabular-nums"
              style={{ color: c.accent, textShadow: `0 0 10px ${c.accent}30` }}
            >
              {channel.value}
            </span>
            <span
              className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
              style={{
                background: channel.direction === "Outbound" ? `${c.accent}15` : `${c.textSecondary}15`,
                color: channel.direction === "Outbound" ? c.accent : c.textSecondary,
                border: `1px solid ${channel.direction === "Outbound" ? c.accent : c.textSecondary}25`,
              }}
            >
              {channel.direction}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Virtual Coordinator Orb ── */
function VirtualCoordinatorOrb() {
  return (
    <div data-flow-orb className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
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

/* ── Flow Animation ── */
interface FlowDot {
  id: number;
  channelIdx: number;
  integrationIdx: number;
}

function pickChannel(): number {
  const weights = [40, 8, 15, 5, 7, 10];
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return 0;
}

function FlowDotElement({
  chCard,
  chNearOrb,
  orbPos,
  intNearOrb,
  intCard,
  onComplete,
}: {
  chCard: { x: number; y: number };
  chNearOrb: { x: number; y: number };
  orbPos: { x: number; y: number };
  intNearOrb: { x: number; y: number };
  intCard: { x: number; y: number };
  onComplete: () => void;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let rafId: number;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const orbitRadius = 55 + Math.random() * 20;
    const orbitDuration = 2000 + Math.random() * 1500;
    const connectorMs = 700;
    const spiralMs = 400;
    const exitMs = 400;

    const entryAngle = Math.atan2(
      chNearOrb.y - orbPos.y,
      chNearOrb.x - orbPos.x,
    );
    const entryDist = Math.hypot(
      chNearOrb.x - orbPos.x,
      chNearOrb.y - orbPos.y,
    );

    el.style.left = `${chCard.x}px`;
    el.style.top = `${chCard.y}px`;
    el.style.opacity = "0";
    el.style.transition = "none";

    // Phase 1: fade in
    let t = 30;
    timers.push(
      setTimeout(() => {
        el.style.transition = "opacity 0.2s ease";
        el.style.opacity = "1";
      }, t),
    );

    // Phase 2: travel along channel connector (horizontal)
    t += 220;
    timers.push(
      setTimeout(() => {
        el.style.transition = `left ${connectorMs}ms linear`;
        el.style.left = `${chNearOrb.x}px`;
      }, t),
    );

    // Phase 3: spiral into orbit + orbit (single rAF loop)
    t += connectorMs + 30;
    const totalOrbMs = spiralMs + orbitDuration;
    timers.push(
      setTimeout(() => {
        el.style.transition = "none";
        const start = performance.now();
        const animate = (now: number) => {
          const elapsed = now - start;
          let a: number, r: number;

          if (elapsed < spiralMs) {
            const p = elapsed / spiralMs;
            const ep = p * p * (3 - 2 * p);
            r = entryDist + (orbitRadius - entryDist) * ep;
            a = entryAngle + p * (Math.PI * 0.5);
          } else {
            const op = Math.min((elapsed - spiralMs) / orbitDuration, 1);
            r = orbitRadius;
            a = entryAngle + Math.PI * 0.5 + op * Math.PI * 2;
          }

          el.style.left = `${orbPos.x + Math.cos(a) * r}px`;
          el.style.top = `${orbPos.y + Math.sin(a) * r}px`;
          if (elapsed < totalOrbMs) rafId = requestAnimationFrame(animate);
        };
        rafId = requestAnimationFrame(animate);
      }, t),
    );

    // Phase 4: exit orbit → integration connector endpoint
    t += totalOrbMs + 30;
    timers.push(
      setTimeout(() => {
        cancelAnimationFrame(rafId);
        el.style.transition = `left ${exitMs}ms ease-in-out, top ${exitMs}ms ease-in-out`;
        el.style.left = `${intNearOrb.x}px`;
        el.style.top = `${intNearOrb.y}px`;
      }, t),
    );

    // Phase 5: travel along integration connector (horizontal)
    t += exitMs + 30;
    timers.push(
      setTimeout(() => {
        el.style.transition = `left ${connectorMs}ms linear`;
        el.style.left = `${intCard.x}px`;
      }, t),
    );

    // Phase 6: fade out
    t += connectorMs - 150;
    timers.push(
      setTimeout(() => {
        el.style.transition = "opacity 0.4s ease-out";
        el.style.opacity = "0";
      }, t),
    );

    timers.push(setTimeout(() => onCompleteRef.current(), t + 500));

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={elRef}
      style={{ position: "absolute", pointerEvents: "none", zIndex: 15 }}
    >
      <div
        style={{
          position: "absolute",
          width: 28,
          height: 28,
          borderRadius: "50%",
          backgroundColor: `${c.accent}18`,
          filter: "blur(6px)",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: c.accent,
          boxShadow: `0 0 8px ${c.accent}, 0 0 18px ${c.accent}aa, 0 0 32px ${c.accent}50`,
          transform: "translate(-50%, -50%)",
          animation: "flow-dot-pulse 1.5s ease-in-out infinite",
        }}
      />
    </div>
  );
}

function FlowAnimationLayer({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [dots, setDots] = useState<FlowDot[]>([]);
  const [positions, setPositions] = useState<{
    channels: {
      cardEdge: { x: number; y: number };
      nearOrb: { x: number; y: number };
    }[];
    integrations: {
      nearOrb: { x: number; y: number };
      cardEdge: { x: number; y: number };
    }[];
    orb: { x: number; y: number };
  } | null>(null);
  const nextIdRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const calc = () => {
      const rect = container.getBoundingClientRect();
      const orbEl = container.querySelector<HTMLElement>("[data-flow-orb]");
      if (!orbEl) return;

      const orbRect = orbEl.getBoundingClientRect();
      const orb = {
        x: orbRect.left + orbRect.width / 2 - rect.left,
        y: orbRect.top + orbRect.height / 2 - rect.top,
      };

      // Channel rows: [DashedConnector 48px] [gap 8px] [card]
      const channelEls = Array.from(
        container.querySelectorAll<HTMLElement>("[data-flow-channel]"),
      ).sort(
        (a, b) =>
          Number(a.dataset.flowChannel) - Number(b.dataset.flowChannel),
      );
      const channels = channelEls.map((el) => {
        const r = el.getBoundingClientRect();
        const cy = r.top + r.height / 2 - rect.top;
        return {
          cardEdge: { x: r.left + 56 - rect.left, y: cy },
          nearOrb: { x: r.left - rect.left, y: cy },
        };
      });

      // Integration rows: [card] [gap 8px] [DashedConnector 48px]
      const intEls = Array.from(
        container.querySelectorAll<HTMLElement>("[data-flow-integration]"),
      ).sort(
        (a, b) =>
          Number(a.dataset.flowIntegration) -
          Number(b.dataset.flowIntegration),
      );
      const integrations = intEls.map((el) => {
        const r = el.getBoundingClientRect();
        const cy = r.top + r.height / 2 - rect.top;
        return {
          nearOrb: { x: r.right - rect.left, y: cy },
          cardEdge: { x: r.right - 56 - rect.left, y: cy },
        };
      });

      setPositions({ channels, integrations, orb });
    };

    calc();
    const observer = new ResizeObserver(calc);
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef]);

  useEffect(() => {
    if (!positions || positions.channels.length === 0) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    const spawn = () => {
      const channelIdx = pickChannel();
      const integrationIdx = Math.floor(
        Math.random() * positions.integrations.length,
      );
      const id = nextIdRef.current++;
      setDots((prev) => [...prev, { id, channelIdx, integrationIdx }]);
      timeoutId = setTimeout(spawn, 11000 + Math.random() * 5000);
    };

    timeoutId = setTimeout(spawn, 2000);
    return () => clearTimeout(timeoutId);
  }, [positions]);

  const removeDot = useCallback((id: number) => {
    setDots((prev) => prev.filter((d) => d.id !== id));
  }, []);

  if (!positions || positions.channels.length === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {dots.map((dot) => (
        <FlowDotElement
          key={dot.id}
          chCard={positions.channels[dot.channelIdx].cardEdge}
          chNearOrb={positions.channels[dot.channelIdx].nearOrb}
          orbPos={positions.orb}
          intNearOrb={positions.integrations[dot.integrationIdx].nearOrb}
          intCard={positions.integrations[dot.integrationIdx].cardEdge}
          onComplete={() => removeDot(dot.id)}
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
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

/* ── Add Module Modal ── */
function AddModuleModal({ onClose }: { onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ModuleCategory | "All">("All");
  const [configuring, setConfiguring] = useState<CatalogModule | null>(null);

  const filtered = moduleCatalog.filter((m) => {
    if (activeCategory !== "All" && m.category !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.tags.some((t) => t.includes(q));
    }
    return true;
  });

  if (configuring) {
    return (
      <ModalBackdrop onClose={onClose}>
        <ModuleConfigPanel module={configuring} onBack={() => setConfiguring(null)} onClose={onClose} />
      </ModalBackdrop>
    );
  }

  return (
    <ModalBackdrop onClose={onClose}>
      <div
        className="w-full max-w-3xl rounded-2xl border overflow-hidden flex flex-col"
        style={{ background: c.bg, borderColor: c.cardBorder, maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: c.cardBorder, background: c.card }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: `${c.accent}15`, border: `1px solid ${c.accent}30` }}>
              <Plus className="h-5 w-5" style={{ color: c.accent }} />
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: c.textPrimary }}>Add Module</h2>
              <p className="text-xs mt-0.5" style={{ color: c.textSecondary }}>Browse and activate integration modules</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/5" style={{ color: c.textSecondary }}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search + Filters */}
        <div className="shrink-0 px-6 py-4 space-y-3 border-b" style={{ borderColor: c.cardBorder }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: c.textSecondary }} />
            <input
              type="text"
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border pl-10 pr-4 py-2.5 text-sm outline-none transition-colors focus:border-[#0deefd40]"
              style={{
                background: c.card,
                borderColor: c.cardBorder,
                color: c.textPrimary,
              }}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {(["All", ...allCategories] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="rounded-full px-3 py-1 text-xs font-medium transition-colors"
                style={{
                  background: activeCategory === cat ? `${c.accent}20` : `${c.textSecondary}10`,
                  color: activeCategory === cat ? c.accent : c.textSecondary,
                  border: `1px solid ${activeCategory === cat ? c.accent + "40" : "transparent"}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Module Grid */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Search className="h-8 w-8 mb-3" style={{ color: c.textSecondary, opacity: 0.4 }} />
              <p className="text-sm font-medium" style={{ color: c.textSecondary }}>No modules match your search</p>
              <p className="text-xs mt-1" style={{ color: c.textSecondary, opacity: 0.6 }}>Try a different keyword or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((mod) => {
                const Icon = mod.icon;
                const isActive = activeModuleNames.has(mod.name);
                return (
                  <div
                    key={mod.name}
                    className="group relative rounded-xl border p-4 transition-all"
                    style={{
                      background: c.card,
                      borderColor: isActive ? `${c.green}30` : c.cardBorder,
                      opacity: isActive ? 0.7 : 1,
                    }}
                  >
                    {mod.popular && !isActive && (
                      <span
                        className="absolute top-3 right-3 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                        style={{ background: `${c.accent}18`, color: c.accent, border: `1px solid ${c.accent}25` }}
                      >
                        Popular
                      </span>
                    )}
                    {isActive && (
                      <span
                        className="absolute top-3 right-3 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                        style={{ background: `${c.green}18`, color: c.green, border: `1px solid ${c.green}25` }}
                      >
                        Active
                      </span>
                    )}
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg mt-0.5"
                        style={{
                          background: isActive ? `${c.green}10` : `${c.accent}10`,
                          border: `1px solid ${isActive ? c.green : c.accent}20`,
                        }}
                      >
                        <Icon className="h-4 w-4" style={{ color: isActive ? c.green : c.accent }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold" style={{ color: c.textPrimary }}>{mod.name}</p>
                        <p className="text-xs mt-1 leading-relaxed" style={{ color: c.textSecondary }}>{mod.description}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] rounded-full px-2 py-0.5" style={{ background: `${c.textSecondary}12`, color: c.textSecondary }}>
                            {mod.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    {!isActive && (
                      <button
                        onClick={() => setConfiguring(mod)}
                        className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-semibold transition-colors hover:bg-[#0deefd08]"
                        style={{ borderColor: `${c.accent}30`, color: c.accent }}
                      >
                        <Plus className="h-3 w-3" />
                        Configure & Add
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-between px-6 py-3 border-t text-xs" style={{ borderColor: c.cardBorder, color: c.textSecondary, background: c.card }}>
          <span>{filtered.length} module{filtered.length !== 1 ? "s" : ""} shown</span>
          <span>{activeModuleNames.size} / {moduleCatalog.length} active</span>
        </div>
      </div>
    </ModalBackdrop>
  );
}

/* ── Module Config Panel (step 2 of Add Module) ── */
function ModuleConfigPanel({ module, onBack, onClose }: { module: CatalogModule; onBack: () => void; onClose: () => void }) {
  const Icon = module.icon;
  const [activating, setActivating] = useState(false);
  const [activated, setActivated] = useState(false);

  const handleActivate = () => {
    setActivating(true);
    setTimeout(() => {
      setActivating(false);
      setActivated(true);
    }, 1800);
  };

  return (
    <div
      className="w-full max-w-2xl rounded-2xl border overflow-hidden flex flex-col"
      style={{ background: c.bg, borderColor: c.cardBorder, maxHeight: "90vh" }}
    >
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: c.cardBorder, background: c.card }}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/5"
            style={{ color: c.textSecondary }}
          >
            <ChevronUp className="h-4 w-4 -rotate-90" />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: `${c.accent}15`, border: `1px solid ${c.accent}30` }}>
            <Icon className="h-5 w-5" style={{ color: c.accent }} />
          </div>
          <div>
            <h2 className="text-base font-bold" style={{ color: c.textPrimary }}>{module.name}</h2>
            <p className="text-xs mt-0.5" style={{ color: c.textSecondary }}>{module.category}</p>
          </div>
        </div>
        <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/5" style={{ color: c.textSecondary }}>
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body */}
      <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
        <p className="text-sm leading-relaxed" style={{ color: c.textSecondary }}>{module.description}</p>

        {/* Pre-configured settings preview */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: c.textSecondary }}>Default Configuration</h3>
          <div className="rounded-xl border" style={{ background: c.card, borderColor: c.cardBorder }}>
            {[
              { label: "Sync Mode", value: "Real-time" },
              { label: "Auto-Routing", value: "Enabled" },
              { label: "Notifications", value: "All events" },
              { label: "Data Retention", value: "90 days" },
            ].map((cfg, i, arr) => (
              <div key={cfg.label} className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${c.cardBorder}` : undefined }}>
                <span className="text-sm" style={{ color: c.textSecondary }}>{cfg.label}</span>
                <span className="text-sm font-semibold" style={{ color: c.textPrimary }}>{cfg.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Connected systems */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: c.textSecondary }}>Will Connect To</h3>
          <div className="flex flex-wrap gap-2">
            {["Virtual Coordinator", "Analytics Engine", "Notification Hub"].map((sys) => (
              <span
                key={sys}
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium"
                style={{ borderColor: c.cardBorder, color: c.textPrimary, background: c.card }}
              >
                <Zap className="h-3 w-3" style={{ color: c.accent }} />
                {sys}
              </span>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: c.textSecondary }}>Requirements</h3>
          <div className="space-y-2">
            {[
              { text: "API credentials configured", met: true },
              { text: "Admin role required for activation", met: true },
              { text: "Compatible with current system version", met: true },
            ].map((req) => (
              <div key={req.text} className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: c.green }} />
                <span className="text-sm" style={{ color: c.textSecondary }}>{req.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activation success state */}
        {activated && (
          <div
            className="flex items-center gap-3 rounded-xl border px-4 py-3"
            style={{ borderColor: `${c.green}30`, background: `${c.green}08` }}
          >
            <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: c.green }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: c.green }}>Module Activated</p>
              <p className="text-xs mt-0.5" style={{ color: c.textSecondary }}>
                {module.name} is now connected to Virtual Coordinator and will appear in your integrations panel.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 flex items-center justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: c.cardBorder, background: c.card }}>
        <button
          onClick={onBack}
          className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5"
          style={{ borderColor: c.cardBorder, color: c.textSecondary }}
        >
          Back
        </button>
        {!activated ? (
          <button
            onClick={handleActivate}
            disabled={activating}
            className="flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition-all"
            style={{
              background: activating ? `${c.accent}30` : c.accent,
              color: activating ? c.accent : c.bg,
              opacity: activating ? 0.8 : 1,
            }}
          >
            {activating ? (
              <>
                <div
                  className="h-3.5 w-3.5 rounded-full border-2 animate-spin"
                  style={{ borderColor: `${c.accent}30`, borderTopColor: c.accent }}
                />
                Activating...
              </>
            ) : (
              <>
                <Zap className="h-3.5 w-3.5" />
                Activate Module
              </>
            )}
          </button>
        ) : (
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition-all"
            style={{ background: c.green, color: c.bg }}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Done
          </button>
        )}
      </div>
    </div>
  );
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
        className="w-full max-w-2xl rounded-2xl border overflow-hidden animate-in fade-in zoom-in-95 flex flex-col"
        style={{ background: c.bg, borderColor: c.cardBorder, maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b rounded-t-2xl" style={{ borderColor: c.cardBorder, background: c.card }}>
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

        {/* Body — scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
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
        className="w-full max-w-3xl rounded-2xl border overflow-hidden flex flex-col"
        style={{ background: c.bg, borderColor: c.cardBorder, maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b rounded-t-2xl" style={{ borderColor: c.cardBorder, background: c.card }}>
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

        {/* Body — scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
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
