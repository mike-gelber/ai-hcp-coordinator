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
  Bot,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Shield,
  Video,
  BookOpen,
  Layers,
  Zap,
  GraduationCap,
  FileCheck,
  Pencil,
  ThumbsUp,
  UploadCloud,
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

type Tab = "dashboard" | "virtual-coordinator" | "msl-coordinator" | "engagements";

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
  { hcp: "Dr. Christine Lee", specialty: "Neurology", npi: "3344556677", lastChannel: "Intelligent Media", lastChannelIcon: Globe, lastContact: "4h ago", totalTouches: 18, status: "Active", coordinator: "Neurovia" },
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

/* ── MSL Virtual Coordinator (Tier 1 / Tier 2) ── */

interface MslMessage {
  sender: "hcp" | "tier1" | "system" | "tier2";
  text: string;
  time: string;
  confidence?: number;
}

interface FaqItem {
  question: string;
  answer: string;
  category: string;
  source: string;
}

const mslFaqs: FaqItem[] = [
  { question: "What is the mechanism of action of Stelazio?", answer: "Stelazio is a selective inhibitor of PCSK9 that works by blocking the PCSK9 protein from binding to LDL receptors on the liver surface. This allows more LDL receptors to remain available to clear LDL-C from the bloodstream, resulting in significant reduction of circulating LDL cholesterol levels.", category: "MOA", source: "Stelazio PI Section 12.1" },
  { question: "What are the most common adverse events with Stelazio?", answer: "In clinical trials, the most common adverse reactions (≥5%) were nasopharyngitis (6.1%), upper respiratory tract infection (5.8%), and injection site reactions (5.2%). Serious adverse events were comparable to placebo.", category: "Safety", source: "Stelazio PI Section 6.1" },
  { question: "What is the recommended dosing for Stelazio?", answer: "The recommended dose is 140 mg administered subcutaneously every 2 weeks or 420 mg once monthly. If switching between dosing regimens, administer the first dose of the new regimen on the next scheduled date of the prior regimen.", category: "Dosing", source: "Stelazio PI Section 2.1" },
  { question: "Is Stelazio approved for use in pediatric patients?", answer: "Stelazio is approved for use in pediatric patients aged 10 years and older with heterozygous familial hypercholesterolemia (HeFH). The safety and efficacy in pediatric patients below 10 years have not been established.", category: "Indication", source: "Stelazio PI Section 8.4" },
  { question: "What are the contraindications for Stelazio?", answer: "Stelazio is contraindicated in patients with a history of serious hypersensitivity reaction to Stelazio or any of the excipients. Reactions have included hypersensitivity vasculitis and hypersensitivity reactions requiring hospitalization.", category: "Safety", source: "Stelazio PI Section 4" },
  { question: "Can Stelazio be used in combination with statins?", answer: "Yes. Stelazio can be used in combination with other lipid-lowering therapies including statins and ezetimibe. In the pivotal ODYSSEY trial, Stelazio added to maximally tolerated statin therapy reduced LDL-C by an additional 61% vs placebo at week 24.", category: "Clinical Data", source: "Stelazio PI Section 14.1" },
];

const tier1DemoConversation: MslMessage[] = [
  { sender: "system", text: "Tier 1 MSL Virtual Coordinator activated — Stelazio knowledge base loaded", time: "10:02 AM" },
  { sender: "hcp", text: "I have a patient on maximally tolerated atorvastatin who isn't reaching LDL goal. What additional reduction can I expect if I add Stelazio?", time: "10:02 AM" },
  { sender: "tier1", text: "Great question, Dr. Chen. In the ODYSSEY OUTCOMES trial, patients on maximally tolerated statin therapy who added Stelazio achieved a mean additional LDL-C reduction of 54.7% from baseline at week 12. The median achieved LDL-C was 53.3 mg/dL in the Stelazio group vs 101.4 mg/dL in the placebo group. This additional reduction was sustained through 48 months of follow-up.", time: "10:02 AM", confidence: 97 },
  { sender: "hcp", text: "That's helpful. What about patients with statin intolerance? Can they use Stelazio as monotherapy?", time: "10:03 AM" },
  { sender: "tier1", text: "Yes, Stelazio can be used as monotherapy in patients who are statin-intolerant. In the ODYSSEY ALTERNATIVE trial, statin-intolerant patients treated with Stelazio monotherapy achieved a 45% reduction in LDL-C at week 24 compared to ezetimibe (14.6% reduction). Stelazio monotherapy was well-tolerated with a safety profile similar to the overall clinical program.", time: "10:03 AM", confidence: 95 },
  { sender: "hcp", text: "One more question — I have a complex patient with HeFH, CKD stage 3, and on dialysis. What's the dosing recommendation and do I need to adjust for renal impairment?", time: "10:04 AM" },
  { sender: "tier1", text: "I can confirm that no dose adjustment is required for mild to moderate renal impairment based on the prescribing information. However, for your specific scenario involving CKD stage 3 with dialysis and HeFH, this is a complex clinical situation that would benefit from a more detailed discussion with our Medical Science Liaison team. I'd like to connect you with a live MSL who has deeper expertise in special populations.\n\nWould you like me to escalate this to a Tier 2 live MSL consultation?", time: "10:04 AM", confidence: 62 },
  { sender: "system", text: "⚡ Confidence threshold below 70% — Tier 2 escalation recommended", time: "10:04 AM" },
  { sender: "hcp", text: "Yes, please connect me.", time: "10:05 AM" },
  { sender: "system", text: "🔄 Escalating to Tier 2 — Connecting to Impiricus Connect for live MSL...", time: "10:05 AM" },
  { sender: "system", text: "✅ Connected — Dr. Amanda Torres, MSL (Nephrology/Cardiology specialist) has joined via Impiricus Connect", time: "10:05 AM" },
  { sender: "tier2", text: "Hi Dr. Chen, I'm Dr. Amanda Torres. I've reviewed the Tier 1 conversation summary and understand you have a patient with HeFH, CKD stage 3 on dialysis. Let me address this comprehensively.\n\nPer the prescribing information, no dose adjustment is recommended for renal impairment including patients on dialysis. In pharmacokinetic studies, mild to severe renal impairment had no clinically meaningful effect on Stelazio exposure.\n\nHowever, I want to share some additional context from our post-marketing experience: we have real-world data from approximately 340 patients with CKD stages 3-5 on dialysis, and the LDL-C reduction was consistent with the general population (mean 52.1%). The safety profile was also comparable, with no increased rate of injection site reactions or muscle-related adverse events.\n\nI can send you the full renal subgroup analysis from our Phase III program. Would that be helpful?", time: "10:06 AM" },
  { sender: "hcp", text: "That would be very helpful. Thank you for the thorough response.", time: "10:07 AM" },
  { sender: "tier2", text: "Absolutely. I'll send the renal subgroup data package to your secure portal within the hour. I'm also available for a follow-up discussion if you'd like to review the data together or discuss other complex patients. You can reach me directly through Impiricus Connect anytime.", time: "10:07 AM" },
  { sender: "system", text: "Session summary generated — Tier 1 handled 2/3 questions autonomously, 1 escalated to Tier 2. Full transcript archived.", time: "10:08 AM" },
];

const mslTierStats = [
  { label: "Tier 1 Resolution Rate", value: "84%", detail: "Questions handled without escalation", icon: Bot, accent: "#0deefd" },
  { label: "Avg Response Time (Tier 1)", value: "< 3s", detail: "Instant AI-powered responses", icon: Zap, accent: "#0deefd" },
  { label: "Tier 2 Escalations (30d)", value: "47", detail: "Complex cases routed to live MSL", icon: ArrowRight, accent: "#75dfa6" },
  { label: "Avg Connect Time (Tier 2)", value: "1.4m", detail: "Time to connect with live MSL", icon: Video, accent: "#75dfa6" },
];

/* ── MSL Training Data ── */

interface TrainingSubmission {
  id: string;
  question: string;
  answer: string;
  category: string;
  source: string;
  submittedBy: string;
  submittedAt: string;
  status: "Submitted" | "Under Review" | "Approved" | "Live";
  coordinator: string;
}

const trainingSubmissions: TrainingSubmission[] = [
  {
    id: "TS-001",
    question: "What is the recommended monitoring schedule for hepatic function during Stelazio treatment?",
    answer: "Hepatic function tests (ALT, AST) should be performed at baseline and as clinically indicated thereafter. In clinical trials, hepatic enzyme elevations >3x ULN occurred in 2.1% of Stelazio-treated patients vs 1.8% placebo. If persistent, clinically significant increases are detected, dose reduction or discontinuation should be considered per clinical judgment.",
    category: "Safety",
    source: "Stelazio PI Section 5.2, ODYSSEY LONG TERM Safety Analysis",
    submittedBy: "Dr. Amanda Torres, MSL",
    submittedAt: "Feb 22, 2026",
    status: "Live",
    coordinator: "Stelazio V1.1",
  },
  {
    id: "TS-002",
    question: "How does Stelazio compare to ezetimibe in patients who cannot tolerate any statin?",
    answer: "In the ODYSSEY ALTERNATIVE trial, completely statin-intolerant patients receiving Stelazio achieved 45.0% LDL-C reduction vs 14.6% with ezetimibe at week 24 (p<0.0001). Skeletal muscle-related events were 32.5% with Stelazio vs 41.1% with ezetimibe, though this was not a pre-specified comparison.",
    category: "Clinical Data",
    source: "ODYSSEY ALTERNATIVE Phase III Data, Stelazio PI Section 14.2",
    submittedBy: "Dr. James Rivera, MSL",
    submittedAt: "Feb 20, 2026",
    status: "Approved",
    coordinator: "Stelazio V1.1",
  },
  {
    id: "TS-003",
    question: "Can Stelazio be self-administered by patients, and what injection training is recommended?",
    answer: "Yes, Stelazio is designed for subcutaneous self-injection after proper training. Healthcare providers should instruct patients on proper subcutaneous injection technique, including aseptic technique, and how to use the pre-filled pen correctly. The injection should be administered into the thigh, abdomen (excluding 2-inch area around navel), or upper arm. Injection sites should be rotated with each injection.",
    category: "Dosing",
    source: "Stelazio PI Section 2.3, Patient Injection Guide",
    submittedBy: "Sarah Mitchell, MSL",
    submittedAt: "Feb 19, 2026",
    status: "Under Review",
    coordinator: "Stelazio V1.1",
  },
  {
    id: "TS-004",
    question: "What real-world evidence exists for Neurovia in treatment-resistant epilepsy?",
    answer: "Post-marketing registry data from the EXTEND-RWE study (n=2,847) showed a 52% responder rate (≥50% seizure reduction) in patients with treatment-resistant focal epilepsy at 12 months. Median time to response was 8.2 weeks. Quality of life improvements (QOLIE-31) were significant from month 3 onward.",
    category: "Clinical Data",
    source: "EXTEND-RWE Registry, 12-Month Interim Analysis",
    submittedBy: "Dr. Patricia Huang, MSL",
    submittedAt: "Feb 18, 2026",
    status: "Live",
    coordinator: "Neurovia",
  },
  {
    id: "TS-005",
    question: "What is the drug interaction profile of Stelazio with commonly prescribed cardiovascular medications?",
    answer: "Stelazio has no clinically significant drug-drug interactions with commonly prescribed cardiovascular medications including warfarin, digoxin, and atorvastatin based on dedicated PK studies. No dose adjustments are needed when co-administering with these agents.",
    category: "Safety",
    source: "Stelazio PI Section 7, Drug Interaction Studies",
    submittedBy: "Dr. Amanda Torres, MSL",
    submittedAt: "Feb 15, 2026",
    status: "Submitted",
    coordinator: "Stelazio V1.1",
  },
];

interface TrainingCorrection {
  id: string;
  originalQuestion: string;
  originalAnswer: string;
  suggestedAnswer: string;
  reason: string;
  submittedBy: string;
  submittedAt: string;
  status: "Pending" | "Accepted" | "Rejected";
}

const trainingCorrections: TrainingCorrection[] = [
  {
    id: "TC-001",
    originalQuestion: "What are the most common adverse events with Stelazio?",
    originalAnswer: "In clinical trials, the most common adverse reactions (≥5%) were nasopharyngitis (6.1%), upper respiratory tract infection (5.8%), and injection site reactions (5.2%).",
    suggestedAnswer: "In clinical trials, the most common adverse reactions (≥5%) were nasopharyngitis (6.1%), upper respiratory tract infection (5.8%), and injection site reactions (5.2%). Additionally, in the ODYSSEY OUTCOMES trial, local injection site reactions were reported at 3.8% vs 2.1% placebo. Most reactions were mild and transient, with a discontinuation rate due to injection site reactions of only 0.2%.",
    reason: "Added quantitative injection site data from ODYSSEY OUTCOMES that HCPs frequently ask about in follow-up",
    submittedBy: "Dr. James Rivera, MSL",
    submittedAt: "Feb 21, 2026",
    status: "Accepted",
  },
  {
    id: "TC-002",
    originalQuestion: "Is Stelazio approved for use in pediatric patients?",
    originalAnswer: "Stelazio is approved for use in pediatric patients aged 10 years and older with HeFH.",
    suggestedAnswer: "Stelazio is approved for use in pediatric patients aged 10 years and older with heterozygous familial hypercholesterolemia (HeFH). In the pediatric Phase III study, LDL-C reduction at week 24 was 44.7% vs placebo. Weight-based dosing is not required; the same adult dose (75mg or 150mg Q2W) is used in the pediatric population.",
    reason: "Added pediatric efficacy data and clarified dosing — this is a common follow-up question from pediatric cardiologists",
    submittedBy: "Sarah Mitchell, MSL",
    submittedAt: "Feb 17, 2026",
    status: "Pending",
  },
];

const trainingStatusColor = (s: TrainingSubmission["status"]) => {
  if (s === "Live") return c.green;
  if (s === "Approved") return "#0deefd";
  if (s === "Under Review") return "#f79009";
  return c.textMuted;
};

const correctionStatusColor = (s: TrainingCorrection["status"]) => {
  if (s === "Accepted") return c.green;
  if (s === "Pending") return "#f79009";
  return c.pink;
};

/* ── MSL-Trained Engagement Mapping ── */

interface MslTrainingSource {
  submissionId: string;
  question: string;
  trainedBy: string;
  approvedDate: string;
  confidenceBoost: string;
  coordinator: string;
}

const mslTrainedEngagements: Record<string, MslTrainingSource> = {
  "1234567890": {
    submissionId: "TS-001",
    question: "Hepatic monitoring during Stelazio treatment",
    trainedBy: "Dr. Amanda Torres, MSL",
    approvedDate: "Feb 22, 2026",
    confidenceBoost: "+12% → 97%",
    coordinator: "Stelazio V1.1",
  },
  "9012345678": {
    submissionId: "TS-002",
    question: "Stelazio vs ezetimibe in statin-intolerant patients",
    trainedBy: "Dr. James Rivera, MSL",
    approvedDate: "Feb 20, 2026",
    confidenceBoost: "+18% → 95%",
    coordinator: "Stelazio V1.1",
  },
  "3344556677": {
    submissionId: "TS-004",
    question: "Real-world evidence for Neurovia in treatment-resistant epilepsy",
    trainedBy: "Dr. Patricia Huang, MSL",
    approvedDate: "Feb 18, 2026",
    confidenceBoost: "+22% → 91%",
    coordinator: "Neurovia",
  },
};

function MslVirtualCoordinatorDemo() {
  const [activeDemo, setActiveDemo] = useState<"conversation" | "knowledge" | "training" | null>(null);
  const [visibleMessages, setVisibleMessages] = useState(4);
  const [trainingTab, setTrainingTab] = useState<"submit" | "recent" | "corrections">("recent");

  const showMore = () => setVisibleMessages((v) => Math.min(v + 3, tier1DemoConversation.length));

  const msgStyle = (sender: MslMessage["sender"]) => {
    if (sender === "hcp") return { bg: `${c.accent}10`, border: `1px solid ${c.accent}20`, label: "HCP", labelColor: c.accent, icon: User };
    if (sender === "tier1") return { bg: "#0c0e12", border: `1px solid ${c.divider}`, label: "Tier 1 — AI MSL", labelColor: "#0deefd", icon: Bot };
    if (sender === "tier2") return { bg: `${c.green}08`, border: `1px solid ${c.green}20`, label: "Tier 2 — Live MSL", labelColor: c.green, icon: Video };
    return { bg: "transparent", border: `1px dashed ${c.divider}`, label: "", labelColor: c.textMuted, icon: AlertCircle };
  };

  return (
    <section className="rounded-2xl border overflow-hidden" style={{ background: "#090b0f", borderColor: "#131720" }}>
      {/* Section Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#131720", background: "#0c0e12" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${c.accent}15`, border: `1px solid ${c.accent}30` }}>
            <Shield className="h-5 w-5" style={{ color: c.accent }} />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: c.textPrimary }}>MSL Virtual Coordinator</h2>
            <p className="text-xs" style={{ color: c.textSecondary }}>Tier 1 AI + Tier 2 Live MSL Escalation</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: c.green, border: `1px solid ${c.green}40`, background: `${c.green}10` }}>
            Demo Mode
          </span>
        </div>
      </div>

      {/* Tier Architecture Overview */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Tier 1 Card */}
          <div className="rounded-xl border p-5" style={{ background: "#0c0e12", borderColor: `${c.accent}20` }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: `${c.accent}12`, border: `1px solid ${c.accent}25` }}>
                <Bot className="h-5 w-5" style={{ color: c.accent }} />
              </div>
              <div>
                <h3 className="text-sm font-bold" style={{ color: c.textPrimary }}>Tier 1 — AI MSL</h3>
                <p className="text-xs" style={{ color: c.textSecondary }}>Automated, instant response</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed mb-4" style={{ color: c.textSecondary }}>
              Trained on approved PI, clinical data, and standard MSL responses. Handles FAQs, dosing questions, MOA explanations, safety inquiries, and clinical trial data requests with confidence scoring.
            </p>
            <div className="space-y-2">
              {["Prescribing Information (full PI)", "Phase III clinical trial data", "Dosing & titration protocols", "Safety & adverse event profiles", "Formulary & access information"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs" style={{ color: c.textPrimary }}>
                  <CheckCircle2 className="h-3 w-3 shrink-0" style={{ color: c.accent }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Tier 2 Card */}
          <div className="rounded-xl border p-5" style={{ background: "#0c0e12", borderColor: `${c.green}20` }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: `${c.green}12`, border: `1px solid ${c.green}25` }}>
                <Video className="h-5 w-5" style={{ color: c.green }} />
              </div>
              <div>
                <h3 className="text-sm font-bold" style={{ color: c.textPrimary }}>Tier 2 — Live MSL via Impiricus Connect</h3>
                <p className="text-xs" style={{ color: c.textSecondary }}>Real-time expert escalation</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed mb-4" style={{ color: c.textSecondary }}>
              When Tier 1 confidence drops below threshold or the HCP requests it, the conversation seamlessly escalates to a live Medical Science Liaison through Impiricus Connect with full context transfer.
            </p>
            <div className="space-y-2">
              {["Complex clinical scenarios & special populations", "Off-label or investigational inquiries (redirect)", "Peer-to-peer scientific exchange", "Real-world evidence deep dives", "Adverse event case consultations"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs" style={{ color: c.textPrimary }}>
                  <CheckCircle2 className="h-3 w-3 shrink-0" style={{ color: c.green }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Escalation Flow Diagram */}
        <div className="rounded-xl border p-5 mb-6" style={{ background: "#0c0e12", borderColor: "#131720" }}>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: c.textSecondary }}>Escalation Flow</h3>
          <div className="flex items-center justify-between gap-3">
            {[
              { label: "HCP Question", sub: "Inbound via any channel", icon: User, color: c.accent },
              { label: "Tier 1 AI MSL", sub: "Confidence scoring", icon: Bot, color: c.accent },
              { label: "Confidence Check", sub: "≥70% = Respond  |  <70% = Escalate", icon: Shield, color: "#f79009" },
              { label: "Tier 2 Live MSL", sub: "Impiricus Connect", icon: Video, color: c.green },
              { label: "Resolution", sub: "Archived & tracked", icon: CheckCircle2, color: c.green },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex items-center gap-3 flex-1">
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg mb-2" style={{ background: `${step.color}12`, border: `1px solid ${step.color}25` }}>
                    <step.icon className="h-5 w-5" style={{ color: step.color }} />
                  </div>
                  <p className="text-xs font-semibold" style={{ color: c.textPrimary }}>{step.label}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: c.textSecondary }}>{step.sub}</p>
                </div>
                {i < arr.length - 1 && <ArrowRight className="h-4 w-4 shrink-0 -mt-4" style={{ color: c.textMuted }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {mslTierStats.map((s) => (
            <div key={s.label} className="rounded-xl border p-4" style={{ background: "#0c0e12", borderColor: "#131720" }}>
              <div className="flex items-center gap-2 mb-2">
                <s.icon className="h-3.5 w-3.5" style={{ color: s.accent }} />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: c.textSecondary }}>{s.label}</span>
              </div>
              <p className="text-xl font-bold" style={{ color: c.textPrimary }}>{s.value}</p>
              <p className="text-[11px] mt-0.5" style={{ color: c.textSecondary }}>{s.detail}</p>
            </div>
          ))}
        </div>

        {/* Demo Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveDemo(activeDemo === "conversation" ? null : "conversation")}
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer"
            style={{
              background: activeDemo === "conversation" ? c.accent : `${c.accent}10`,
              color: activeDemo === "conversation" ? "#1a1a1a" : c.accent,
              border: `1px solid ${c.accent}30`,
            }}
          >
            <MessageSquare className="h-4 w-4" />
            Demo Conversation
          </button>
          <button
            onClick={() => setActiveDemo(activeDemo === "knowledge" ? null : "knowledge")}
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer"
            style={{
              background: activeDemo === "knowledge" ? c.accent : `${c.accent}10`,
              color: activeDemo === "knowledge" ? "#1a1a1a" : c.accent,
              border: `1px solid ${c.accent}30`,
            }}
          >
            <BookOpen className="h-4 w-4" />
            Knowledge Base
          </button>
          <button
            onClick={() => setActiveDemo(activeDemo === "training" ? null : "training")}
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer"
            style={{
              background: activeDemo === "training" ? "#f79009" : "#f7900910",
              color: activeDemo === "training" ? "#1a1a1a" : "#f79009",
              border: "1px solid #f7900930",
            }}
          >
            <GraduationCap className="h-4 w-4" />
            Training
          </button>
        </div>

        {/* Demo Conversation Panel */}
        {activeDemo === "conversation" && (
          <div className="rounded-xl border overflow-hidden" style={{ background: "#0c0e12", borderColor: "#131720" }}>
            <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "#131720" }}>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4" style={{ color: c.accent }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: c.textPrimary }}>Live Demo — Tier 1 → Tier 2 Escalation</span>
              </div>
              <span className="text-xs" style={{ color: c.textSecondary }}>Stelazio Virtual Coordinator · Dr. Sarah Chen</span>
            </div>
            <div className="p-5 space-y-4 max-h-[600px] overflow-y-auto">
              {tier1DemoConversation.slice(0, visibleMessages).map((msg, i) => {
                const s = msgStyle(msg.sender);
                const MsgIcon = s.icon;
                return (
                  <div key={i} className={`flex flex-col ${msg.sender === "system" ? "items-center" : msg.sender === "hcp" ? "items-start" : "items-end"}`} style={{ maxWidth: msg.sender === "system" ? "100%" : "85%" , alignSelf: msg.sender === "hcp" ? "flex-start" : msg.sender === "system" ? "center" : "flex-end" }}>
                    <div className="rounded-lg px-4 py-3 w-full" style={{ background: s.bg, border: s.border }}>
                      {msg.sender !== "system" && (
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <MsgIcon className="h-3 w-3" style={{ color: s.labelColor }} />
                            <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: s.labelColor }}>{s.label}</span>
                          </div>
                          {msg.confidence !== undefined && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{
                              color: msg.confidence >= 70 ? c.green : "#f79009",
                              background: msg.confidence >= 70 ? `${c.green}12` : "#f7900912",
                              border: `1px solid ${msg.confidence >= 70 ? c.green : "#f79009"}25`,
                            }}>
                              {msg.confidence}% confidence
                            </span>
                          )}
                        </div>
                      )}
                      <p className={`text-xs leading-relaxed whitespace-pre-line ${msg.sender === "system" ? "text-center" : ""}`} style={{ color: msg.sender === "system" ? c.textMuted : c.textPrimary }}>
                        {msg.text}
                      </p>
                    </div>
                    <span className={`text-[10px] mt-0.5 px-1 ${msg.sender === "system" ? "text-center" : ""}`} style={{ color: c.textMuted }}>{msg.time}</span>
                  </div>
                );
              })}
              {visibleMessages < tier1DemoConversation.length && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={showMore}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer"
                    style={{ color: c.accent, border: `1px solid ${c.accent}30`, background: `${c.accent}08` }}
                  >
                    Continue Conversation
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Knowledge Base Panel */}
        {activeDemo === "knowledge" && (
          <div className="rounded-xl border overflow-hidden" style={{ background: "#0c0e12", borderColor: "#131720" }}>
            <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "#131720" }}>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" style={{ color: c.accent }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: c.textPrimary }}>Tier 1 Knowledge Base — Stelazio</span>
              </div>
              <span className="text-xs" style={{ color: c.textSecondary }}>{mslFaqs.length} trained responses</span>
            </div>
            <div className="divide-y" style={{ borderColor: "#131720" }}>
              {mslFaqs.map((faq, i) => (
                <div key={i} className="px-5 py-4" style={{ borderColor: "#131720" }}>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <p className="text-sm font-semibold" style={{ color: c.textPrimary }}>{faq.question}</p>
                    <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ color: c.accent, border: `1px solid ${c.accent}25`, background: `${c.accent}08` }}>
                      {faq.category}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed mb-2" style={{ color: c.textSecondary }}>{faq.answer}</p>
                  <p className="text-[10px]" style={{ color: c.textMuted }}>Source: {faq.source}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Training Panel */}
        {activeDemo === "training" && (
          <div className="rounded-xl border overflow-hidden" style={{ background: "#0c0e12", borderColor: "#f7900925" }}>
            <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "#131720", background: "#0c0e12" }}>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" style={{ color: "#f79009" }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: c.textPrimary }}>MSL Training Center</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ color: c.green, background: `${c.green}12`, border: `1px solid ${c.green}25` }}>
                  {trainingSubmissions.filter(s => s.status === "Live").length} Live
                </span>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ color: "#f79009", background: "#f7900912", border: "1px solid #f7900925" }}>
                  {trainingSubmissions.filter(s => s.status !== "Live").length} Pending
                </span>
              </div>
            </div>

            {/* Training Sub-tabs */}
            <div className="flex border-b" style={{ borderColor: "#131720" }}>
              {([
                { key: "submit" as const, label: "Submit New Q&A", icon: UploadCloud },
                { key: "recent" as const, label: "Recent Submissions", icon: FileCheck },
                { key: "corrections" as const, label: "Suggest Corrections", icon: Pencil },
              ]).map(({ key, label, icon: TabIcon }) => (
                <button
                  key={key}
                  onClick={() => setTrainingTab(key)}
                  className="flex items-center gap-2 px-5 py-3 text-xs font-semibold transition-colors cursor-pointer"
                  style={{
                    color: trainingTab === key ? "#f79009" : c.textSecondary,
                    borderBottom: trainingTab === key ? "2px solid #f79009" : "2px solid transparent",
                    background: trainingTab === key ? "#f7900908" : "transparent",
                  }}
                >
                  <TabIcon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>

            <div className="p-5">
              {/* Submit New Q&A Tab */}
              {trainingTab === "submit" && (
                <div className="space-y-5">
                  <div className="rounded-xl border p-4" style={{ background: c.bg, borderColor: "#131720" }}>
                    <p className="text-xs font-semibold mb-3" style={{ color: c.textPrimary }}>Add new trained response to the Tier 1 Knowledge Base</p>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5" style={{ color: c.textMuted }}>Coordinator</label>
                        <div className="rounded-lg border px-3 py-2 text-xs" style={{ background: "#0c0e12", borderColor: c.divider, color: c.textSecondary }}>
                          Stelazio Virtual Coordinator V1.1
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5" style={{ color: c.textMuted }}>HCP Question</label>
                        <div className="rounded-lg border px-3 py-2.5 text-xs" style={{ background: "#0c0e12", borderColor: c.divider, color: c.textMuted }}>
                          Enter the question HCPs commonly ask...
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5" style={{ color: c.textMuted }}>Approved MSL Response</label>
                        <div className="rounded-lg border px-3 py-2.5 text-xs min-h-[80px]" style={{ background: "#0c0e12", borderColor: c.divider, color: c.textMuted }}>
                          Enter the approved response the AI should provide...
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5" style={{ color: c.textMuted }}>Category</label>
                          <div className="rounded-lg border px-3 py-2 text-xs flex items-center justify-between" style={{ background: "#0c0e12", borderColor: c.divider, color: c.textSecondary }}>
                            <span>Select category...</span>
                            <ChevronDown className="h-3 w-3" style={{ color: c.textMuted }} />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5" style={{ color: c.textMuted }}>Source / Citation</label>
                          <div className="rounded-lg border px-3 py-2 text-xs" style={{ background: "#0c0e12", borderColor: c.divider, color: c.textMuted }}>
                            PI Section, study name...
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <p className="text-[10px]" style={{ color: c.textMuted }}>Submissions are reviewed by Medical Affairs before going live</p>
                        <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold cursor-pointer" style={{ background: "#f79009", color: "#1a1a1a" }}>
                          <UploadCloud className="h-3.5 w-3.5" />
                          Submit for Review
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Submissions Tab */}
              {trainingTab === "recent" && (
                <div className="space-y-3">
                  {trainingSubmissions.map((sub) => (
                    <div key={sub.id} className="rounded-xl border p-4" style={{ background: c.bg, borderColor: "#131720" }}>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono font-bold" style={{ color: c.textMuted }}>{sub.id}</span>
                            <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" style={{
                              color: trainingStatusColor(sub.status),
                              background: `${trainingStatusColor(sub.status)}12`,
                              border: `1px solid ${trainingStatusColor(sub.status)}25`,
                            }}>
                              {sub.status}
                            </span>
                            <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ color: c.accent, border: `1px solid ${c.accent}25`, background: `${c.accent}08` }}>
                              {sub.category}
                            </span>
                          </div>
                          <p className="text-sm font-semibold mb-1" style={{ color: c.textPrimary }}>{sub.question}</p>
                        </div>
                      </div>
                      <p className="text-xs leading-relaxed mb-3" style={{ color: c.textSecondary }}>{sub.answer}</p>
                      <div className="flex items-center justify-between pt-2" style={{ borderTop: `1px solid ${c.divider}` }}>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px]" style={{ color: c.textMuted }}>Source: {sub.source}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px]" style={{ color: c.textMuted }}>{sub.submittedBy}</span>
                          <span className="text-[10px]" style={{ color: c.textMuted }}>{sub.submittedAt}</span>
                        </div>
                      </div>
                      {sub.status === "Live" && (
                        <div className="mt-3 rounded-lg px-3 py-2 flex items-center gap-2" style={{ background: `${c.green}08`, border: `1px solid ${c.green}15` }}>
                          <CheckCircle2 className="h-3 w-3 shrink-0" style={{ color: c.green }} />
                          <span className="text-[10px] font-medium" style={{ color: c.green }}>Active in Tier 1 Knowledge Base — powering live HCP responses</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Suggest Corrections Tab */}
              {trainingTab === "corrections" && (
                <div className="space-y-5">
                  <div className="rounded-xl border p-4" style={{ background: c.bg, borderColor: "#131720" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Pencil className="h-3.5 w-3.5" style={{ color: "#f79009" }} />
                      <p className="text-xs font-semibold" style={{ color: c.textPrimary }}>Review and improve existing Tier 1 responses</p>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: c.textSecondary }}>
                      Browse the current knowledge base responses below. If you see an answer that could be improved with additional data, nuance, or real-world context, click &quot;Suggest Correction&quot; to submit an enhanced version for review.
                    </p>
                  </div>

                  {/* Pending Corrections */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: c.textSecondary }}>Active Corrections</span>
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ color: "#f79009", background: "#f7900912" }}>
                        {trainingCorrections.length}
                      </span>
                    </div>
                    {trainingCorrections.map((corr) => (
                      <div key={corr.id} className="rounded-xl border p-4 mb-3" style={{ background: c.bg, borderColor: "#131720" }}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-mono font-bold" style={{ color: c.textMuted }}>{corr.id}</span>
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase" style={{
                            color: correctionStatusColor(corr.status),
                            background: `${correctionStatusColor(corr.status)}12`,
                            border: `1px solid ${correctionStatusColor(corr.status)}25`,
                          }}>
                            {corr.status}
                          </span>
                        </div>
                        <p className="text-xs font-semibold mb-2" style={{ color: c.textPrimary }}>{corr.originalQuestion}</p>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="rounded-lg p-3" style={{ background: `${c.pink}06`, border: `1px solid ${c.pink}15` }}>
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: c.pink }}>Current Response</p>
                            <p className="text-[11px] leading-relaxed" style={{ color: c.textSecondary }}>{corr.originalAnswer}</p>
                          </div>
                          <div className="rounded-lg p-3" style={{ background: `${c.green}06`, border: `1px solid ${c.green}15` }}>
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: c.green }}>Suggested Improvement</p>
                            <p className="text-[11px] leading-relaxed" style={{ color: c.textSecondary }}>{corr.suggestedAnswer}</p>
                          </div>
                        </div>

                        <div className="rounded-lg p-3 mb-2" style={{ background: "#f7900908", border: "1px solid #f7900915" }}>
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#f79009" }}>Reason for Change</p>
                          <p className="text-[11px] leading-relaxed" style={{ color: c.textSecondary }}>{corr.reason}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[10px]" style={{ color: c.textMuted }}>{corr.submittedBy} · {corr.submittedAt}</span>
                          {corr.status === "Accepted" && (
                            <div className="flex items-center gap-1.5">
                              <ThumbsUp className="h-3 w-3" style={{ color: c.green }} />
                              <span className="text-[10px] font-medium" style={{ color: c.green }}>Approved — updating knowledge base</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Current KB responses with suggest button */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest block mb-3" style={{ color: c.textSecondary }}>Current Knowledge Base Responses</span>
                    {mslFaqs.slice(0, 3).map((faq, i) => (
                      <div key={i} className="rounded-xl border p-4 mb-3" style={{ background: c.bg, borderColor: "#131720" }}>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <p className="text-xs font-semibold" style={{ color: c.textPrimary }}>{faq.question}</p>
                          <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase" style={{ color: c.accent, border: `1px solid ${c.accent}25`, background: `${c.accent}08` }}>
                            {faq.category}
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed mb-3" style={{ color: c.textSecondary }}>{faq.answer}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px]" style={{ color: c.textMuted }}>Source: {faq.source}</span>
                          <button className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[10px] font-semibold cursor-pointer transition-colors hover:bg-white/5" style={{ borderColor: "#f7900930", color: "#f79009" }}>
                            <Pencil className="h-3 w-3" />
                            Suggest Correction
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function MslCoordinatorView({ onNavigateToEngagements }: { onNavigateToEngagements: () => void }) {
  const liveCount = trainingSubmissions.filter(s => s.status === "Live").length;
  const trainedEngagementCount = Object.keys(mslTrainedEngagements).length;
  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: c.textPrimary }}>MSL Virtual Coordinator</h1>
          <p className="text-sm mt-1" style={{ color: c.textSecondary }}>Tier 1 AI-powered MSL with Tier 2 live escalation to Impiricus Connect</p>
        </div>
        <button
          onClick={onNavigateToEngagements}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors cursor-pointer hover:bg-white/5"
          style={{ border: `1px solid ${c.accent}30`, color: c.accent }}
        >
          <GraduationCap className="h-4 w-4" />
          View MSL Engagements
          <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: `${c.accent}15` }}>{trainedEngagementCount}</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Training Impact Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Live Trained Responses", value: liveCount.toString(), detail: "Active in Tier 1 Knowledge Base", icon: FileCheck, accent: c.green },
          { label: "MSL Engagements", value: trainedEngagementCount.toString(), detail: "HCPs served by trained responses", icon: GraduationCap, accent: "#f79009" },
          { label: "Pending Submissions", value: trainingSubmissions.filter(s => s.status !== "Live").length.toString(), detail: "Awaiting review or approval", icon: Clock, accent: c.accent },
          { label: "Active Corrections", value: trainingCorrections.filter(c => c.status === "Pending").length.toString(), detail: "Suggested improvements in review", icon: Pencil, accent: "#f79009" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border p-4" style={{ background: c.card, borderColor: c.divider }}>
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="h-3.5 w-3.5" style={{ color: s.accent }} />
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: c.textSecondary }}>{s.label}</span>
            </div>
            <p className="text-xl font-bold" style={{ color: c.textPrimary }}>{s.value}</p>
            <p className="text-[11px] mt-0.5" style={{ color: c.textSecondary }}>{s.detail}</p>
          </div>
        ))}
      </div>

      <MslVirtualCoordinatorDemo />
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
  "3344556677": {
    type: "Billboard — Digital Out-of-Home",
    location: "I-405 Southbound, Los Angeles — Digital Billboard #LA-4052",
    campaignName: "Neurovia Epilepsy Awareness — SoCal DOOH Q1 2026",
    scannedAt: "Feb 21, 2026 · 6:12 PM PST",
    device: "iPhone 15 Pro Max · Safari",
    landedOn: "Neurovia Treatment-Resistant Epilepsy Evidence Portal",
    sessionDuration: "8m 03s",
    contentViewed: [
      "EXTEND-RWE real-world evidence summary",
      "Treatment algorithm for refractory focal epilepsy",
      "Patient case studies (3 viewed)",
      "Dosing & titration interactive guide",
    ],
    followUp: "MSL-trained response triggered — RWE data package auto-sent with personalized follow-up from Neurovia coordinator",
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

          {mslTrainedEngagements[engagement.npi] && (
            <div className="rounded-xl border p-4" style={{ background: "#f7900908", borderColor: "#f7900920" }}>
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="h-4 w-4" style={{ color: "#f79009" }} />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#f79009" }}>MSL-Trained Knowledge Source</span>
              </div>
              <p className="text-xs leading-relaxed mb-3" style={{ color: c.textSecondary }}>
                The Tier 1 AI response in this engagement was powered by an MSL training submission, ensuring accuracy and clinical depth.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: c.textMuted }}>Training ID</p>
                  <p className="text-xs font-mono font-medium" style={{ color: c.textPrimary }}>{mslTrainedEngagements[engagement.npi].submissionId}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: c.textMuted }}>Trained By</p>
                  <p className="text-xs font-medium" style={{ color: c.textPrimary }}>{mslTrainedEngagements[engagement.npi].trainedBy}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: c.textMuted }}>Knowledge Applied</p>
                  <p className="text-xs font-medium" style={{ color: c.textPrimary }}>{mslTrainedEngagements[engagement.npi].question}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: c.textMuted }}>Confidence Boost</p>
                  <p className="text-xs font-bold" style={{ color: c.green }}>{mslTrainedEngagements[engagement.npi].confidenceBoost}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: "1px solid #f7900915" }}>
                <CheckCircle2 className="h-3 w-3" style={{ color: c.green }} />
                <span className="text-[10px] font-medium" style={{ color: c.green }}>Approved {mslTrainedEngagements[engagement.npi].approvedDate} — Active in {mslTrainedEngagements[engagement.npi].coordinator} knowledge base</span>
              </div>
            </div>
          )}
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

function EngagementTableRow({ row, onView, onRowClick, hasDetail, detailIcon, isMslTrained }: {
  row: Engagement;
  onView: (e: React.MouseEvent) => void;
  onRowClick: () => void;
  hasDetail: boolean;
  detailIcon: React.ReactNode;
  isMslTrained?: boolean;
}) {
  const ChannelIcon = row.lastChannelIcon;
  return (
    <tr
      className="transition-colors hover:bg-white/[0.04] cursor-pointer"
      style={{ borderBottom: `1px solid ${c.divider}` }}
      onClick={onRowClick}
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div>
            <p className="font-medium" style={{ color: c.textPrimary }}>{row.hcp}</p>
            <p className="text-xs" style={{ color: c.textSecondary }}>{row.specialty}</p>
          </div>
          {isMslTrained && (
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide shrink-0" style={{ color: "#f79009", background: "#f7900912", border: "1px solid #f7900925" }}>
              <GraduationCap className="h-2.5 w-2.5" />
              MSL
            </span>
          )}
        </div>
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
      <div data-demo="engagement-summary" className="grid grid-cols-5 gap-4 mb-6">
        {[
          { label: "Total HCPs", value: engagements.length.toString(), accent: c.accent },
          { label: "Active", value: engagements.filter(e => e.status === "Active").length.toString(), accent: c.green },
          { label: "Cooling Off", value: engagements.filter(e => e.status === "Cooling Off").length.toString(), accent: c.pink },
          { label: "New", value: engagements.filter(e => e.status === "New").length.toString(), accent: c.accent },
          { label: "MSL Engagements", value: engagements.filter(e => mslTrainedEngagements[e.npi]).length.toString(), accent: "#f79009" },
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
                    isMslTrained={!!mslTrainedEngagements[row.npi]}
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
                      isMslTrained={!!mslTrainedEngagements[row.npi]}
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
  const [mslEnabled, setMslEnabled] = useState(true);
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
            const isVc = item.tab === "virtual-coordinator";
            const vcExpanded = isVc && (activeTab === "virtual-coordinator" || activeTab === "msl-coordinator");
            return (
              <div key={item.tab}>
                <button
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
                {isVc && vcExpanded && (
                  <div className="ml-8 mt-1 space-y-0.5">
                    <button
                      onClick={() => setActiveTab("msl-coordinator")}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-semibold transition-colors cursor-pointer text-left group"
                      style={{
                        color: activeTab === "msl-coordinator" ? c.accent : c.textSecondary,
                        background: activeTab === "msl-coordinator" ? c.navActive : "transparent",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="h-3.5 w-3.5" />
                        <span>MSL Coordinator</span>
                      </div>
                      <div
                        role="switch"
                        aria-checked={mslEnabled}
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); setMslEnabled(!mslEnabled); }}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); setMslEnabled(!mslEnabled); } }}
                        className="relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full transition-colors"
                        style={{ background: mslEnabled ? c.accent : c.divider }}
                      >
                        <span
                          className="inline-block h-3 w-3 rounded-full transition-transform mt-0.5"
                          style={{
                            background: mslEnabled ? "#1a1a1a" : c.textMuted,
                            transform: mslEnabled ? "translateX(14px)" : "translateX(2px)",
                          }}
                        />
                      </div>
                    </button>
                  </div>
                )}
              </div>
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
              {activeTab === "msl-coordinator" ? "MSL Coordinator" : navItems.find((n) => n.tab === activeTab)?.label}
            </span>
          </div>

          {/* ═══ Dashboard Tab ═══ */}
          {activeTab === "dashboard" && <DashboardView onNavigateToHcp={handleNavigateToHcp} />}

          {/* ═══ Virtual Coordinator Tab ═══ */}
          {activeTab === "virtual-coordinator" && <VirtualCoordinatorView onNavigateToHcp={handleNavigateToHcp} />}

          {/* ═══ MSL Coordinator Tab ═══ */}
          {activeTab === "msl-coordinator" && <MslCoordinatorView onNavigateToEngagements={() => setActiveTab("engagements")} />}

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
