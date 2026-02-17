"use client";

import { useState } from "react";
import {
  X,
  Package,
  Users,
  ShieldCheck,
  HeadphonesIcon,
  BadgeCheck,
  ShoppingCart,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  Search,
  FileText,
  Send,
  CircleDot,
  ChevronRight,
  Star,
  Filter,
  Bot,
} from "lucide-react";

interface IntegrationDetailPanelProps {
  integrationId: string;
  onClose: () => void;
}

/* ───────────────────── Shared helpers ───────────────────── */

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="h-1.5 w-full rounded-full bg-gray-800">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function Badge({
  label,
  variant,
}: {
  label: string;
  variant: "success" | "warning" | "danger" | "info" | "neutral";
}) {
  const styles = {
    success: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/20",
    warning: "bg-amber-500/15 text-amber-400 ring-amber-500/20",
    danger: "bg-rose-500/15 text-rose-400 ring-rose-500/20",
    info: "bg-cyan-500/15 text-cyan-400 ring-cyan-500/20",
    neutral: "bg-gray-500/15 text-gray-400 ring-gray-500/20",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 ${styles[variant]}`}
    >
      {label}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-500/70">
      {children}
    </h4>
  );
}

function StatMini({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-cyan-500/10 bg-cyan-500/[0.03] p-3">
      <p className="text-[10px] text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="mt-0.5 text-lg font-bold text-white vc-glow-text">{value}</p>
      {sub && <p className="text-[10px] text-gray-500">{sub}</p>}
    </div>
  );
}

/* ───────────────────── Samples Panel ───────────────────── */

function SamplesDetail() {
  const [selectedTab, setSelectedTab] = useState<"inventory" | "orders" | "compliance">(
    "inventory",
  );

  const inventory = [
    { name: "Xarelto 20mg", sku: "XAR-20", stock: 240, capacity: 500, status: "ok" as const },
    { name: "Xarelto 15mg", sku: "XAR-15", stock: 82, capacity: 500, status: "low" as const },
    {
      name: "Jardiance 10mg",
      sku: "JAR-10",
      stock: 45,
      capacity: 300,
      status: "critical" as const,
    },
    { name: "Jardiance 25mg", sku: "JAR-25", stock: 310, capacity: 400, status: "ok" as const },
    {
      name: "Entresto 49/51mg",
      sku: "ENT-49",
      stock: 28,
      capacity: 200,
      status: "critical" as const,
    },
    { name: "Keytruda 100mg", sku: "KEY-100", stock: 175, capacity: 250, status: "ok" as const },
  ];

  const recentOrders = [
    {
      id: "ORD-4821",
      hcp: "Dr. Sarah Chen",
      item: "Xarelto 20mg",
      qty: 50,
      date: "2h ago",
      status: "shipped" as const,
    },
    {
      id: "ORD-4820",
      hcp: "Dr. James Wilson",
      item: "Jardiance 10mg",
      qty: 30,
      date: "5h ago",
      status: "processing" as const,
    },
    {
      id: "ORD-4819",
      hcp: "Dr. Maria Santos",
      item: "Entresto 49/51mg",
      qty: 20,
      date: "1d ago",
      status: "delivered" as const,
    },
    {
      id: "ORD-4818",
      hcp: "Dr. Robert Kim",
      item: "Keytruda 100mg",
      qty: 15,
      date: "1d ago",
      status: "delivered" as const,
    },
    {
      id: "ORD-4817",
      hcp: "Dr. Emily Park",
      item: "Xarelto 15mg",
      qty: 40,
      date: "2d ago",
      status: "delivered" as const,
    },
  ];

  const tabs = [
    { key: "inventory" as const, label: "Inventory" },
    { key: "orders" as const, label: "Recent Orders" },
    { key: "compliance" as const, label: "Compliance" },
  ];

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatMini label="Total SKUs" value="6" sub="Active products" />
        <StatMini label="Stock Level" value="85%" sub="Avg. across all" />
        <StatMini label="Low Stock" value="3" sub="Need reorder" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-gray-900/50 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            className={`flex-1 rounded-md px-3 py-1.5 text-[11px] font-medium transition-all ${
              selectedTab === tab.key
                ? "bg-cyan-500/15 text-cyan-400 shadow-sm"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {selectedTab === "inventory" && (
        <div className="space-y-2">
          {inventory.map((item) => (
            <div
              key={item.sku}
              className="flex items-center gap-3 rounded-lg border border-cyan-500/10 bg-[#0a1020]/80 px-3 py-2.5"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-medium text-white truncate">{item.name}</span>
                  {item.status === "critical" && (
                    <AlertTriangle className="h-3 w-3 text-rose-400 shrink-0" />
                  )}
                  {item.status === "low" && (
                    <AlertTriangle className="h-3 w-3 text-amber-400 shrink-0" />
                  )}
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <MiniBar
                    value={item.stock}
                    max={item.capacity}
                    color={
                      item.status === "critical"
                        ? "bg-gradient-to-r from-rose-500 to-rose-400"
                        : item.status === "low"
                          ? "bg-gradient-to-r from-amber-500 to-amber-400"
                          : "bg-gradient-to-r from-cyan-500 to-teal-400"
                    }
                  />
                  <span className="shrink-0 text-[10px] text-gray-500">
                    {item.stock}/{item.capacity}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-gray-600">{item.sku}</span>
              {(item.status === "critical" || item.status === "low") && (
                <button className="shrink-0 rounded-md bg-cyan-500/10 px-2 py-1 text-[10px] font-medium text-cyan-400 ring-1 ring-cyan-500/20 hover:bg-cyan-500/20 transition-colors">
                  Reorder
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedTab === "orders" && (
        <div className="space-y-2">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center gap-3 rounded-lg border border-cyan-500/10 bg-[#0a1020]/80 px-3 py-2.5"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-cyan-500/50">{order.id}</span>
                  <span className="text-[12px] font-medium text-white truncate">{order.hcp}</span>
                </div>
                <div className="mt-0.5 text-[11px] text-gray-500">
                  {order.item} &middot; Qty: {order.qty} &middot; {order.date}
                </div>
              </div>
              <Badge
                label={order.status}
                variant={
                  order.status === "delivered"
                    ? "success"
                    : order.status === "shipped"
                      ? "info"
                      : "warning"
                }
              />
            </div>
          ))}
        </div>
      )}

      {selectedTab === "compliance" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-cyan-500/10 bg-[#0a1020]/80 p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-[12px] font-medium text-white">PDMA Compliance</span>
              <Badge label="Passed" variant="success" />
            </div>
            <div className="space-y-2 text-[11px] text-gray-400">
              <div className="flex justify-between">
                <span>Sample accountability</span>
                <span className="text-emerald-400">100%</span>
              </div>
              <div className="flex justify-between">
                <span>Signature collection rate</span>
                <span className="text-emerald-400">98.5%</span>
              </div>
              <div className="flex justify-between">
                <span>Reconciliation (last audit)</span>
                <span className="text-emerald-400">Compliant</span>
              </div>
              <div className="flex justify-between">
                <span>State license verification</span>
                <span className="text-emerald-400">All current</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-amber-500/10 bg-amber-500/[0.03] p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span className="text-[12px] font-medium text-white">Action Items</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-gray-400">
              <div className="flex items-start gap-2">
                <CircleDot className="h-3 w-3 text-amber-400 mt-0.5 shrink-0" />
                <span>3 HCPs approaching annual sample limit</span>
              </div>
              <div className="flex items-start gap-2">
                <CircleDot className="h-3 w-3 text-amber-400 mt-0.5 shrink-0" />
                <span>2 state license renewals due within 30 days</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────────────── Hub Services Panel ───────────────────── */

function HubServicesDetail() {
  const [activeProgram, setActiveProgram] = useState<string | null>(null);

  const programs = [
    {
      id: "copay",
      name: "Co-Pay Assistance",
      enrolled: 1240,
      pending: 45,
      approved: 95,
      color: "from-cyan-500 to-teal-400",
    },
    {
      id: "pap",
      name: "Patient Assistance (PAP)",
      enrolled: 680,
      pending: 22,
      approved: 88,
      color: "from-violet-500 to-purple-400",
    },
    {
      id: "bridge",
      name: "Bridge Program",
      enrolled: 340,
      pending: 18,
      approved: 92,
      color: "from-amber-500 to-orange-400",
    },
    {
      id: "specialty",
      name: "Specialty Pharmacy",
      enrolled: 198,
      pending: 8,
      approved: 97,
      color: "from-emerald-500 to-green-400",
    },
  ];

  const recentEnrollments = [
    {
      patient: "J. Smith",
      program: "Co-Pay Assistance",
      status: "approved" as const,
      date: "30m ago",
    },
    { patient: "M. Johnson", program: "PAP", status: "pending" as const, date: "2h ago" },
    {
      patient: "L. Williams",
      program: "Bridge Program",
      status: "approved" as const,
      date: "3h ago",
    },
    {
      patient: "R. Davis",
      program: "Co-Pay Assistance",
      status: "under_review" as const,
      date: "5h ago",
    },
    {
      patient: "K. Brown",
      program: "Specialty Pharmacy",
      status: "approved" as const,
      date: "1d ago",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <StatMini label="Total Enrolled" value="2,458" sub="+5% this month" />
        <StatMini label="Pending" value="93" sub="Avg 1.2d process" />
        <StatMini label="Approval Rate" value="94%" sub="Last 30 days" />
      </div>

      <SectionTitle>Programs</SectionTitle>
      <div className="space-y-2">
        {programs.map((prog) => (
          <button
            key={prog.id}
            onClick={() => setActiveProgram(activeProgram === prog.id ? null : prog.id)}
            className={`w-full text-left rounded-lg border px-3 py-3 transition-all ${
              activeProgram === prog.id
                ? "border-cyan-500/30 bg-cyan-500/[0.06]"
                : "border-cyan-500/10 bg-[#0a1020]/80 hover:border-cyan-500/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-white">{prog.name}</span>
              <ChevronRight
                className={`h-3.5 w-3.5 text-gray-500 transition-transform ${activeProgram === prog.id ? "rotate-90" : ""}`}
              />
            </div>
            <div className="mt-2 flex items-center gap-4 text-[10px] text-gray-500">
              <span>
                Enrolled:{" "}
                <span className="text-gray-300 font-medium">{prog.enrolled.toLocaleString()}</span>
              </span>
              <span>
                Pending: <span className="text-amber-400 font-medium">{prog.pending}</span>
              </span>
              <span>
                Approval: <span className="text-emerald-400 font-medium">{prog.approved}%</span>
              </span>
            </div>
            <div className="mt-2">
              <MiniBar value={prog.enrolled} max={1400} color={`bg-gradient-to-r ${prog.color}`} />
            </div>
            {activeProgram === prog.id && (
              <div className="mt-3 pt-3 border-t border-cyan-500/10 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="rounded-md bg-gray-900/60 p-2">
                    <span className="text-gray-500">Avg Processing</span>
                    <p className="text-white font-medium mt-0.5">1.2 days</p>
                  </div>
                  <div className="rounded-md bg-gray-900/60 p-2">
                    <span className="text-gray-500">Renewals Due</span>
                    <p className="text-amber-400 font-medium mt-0.5">12 this month</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 rounded-md bg-cyan-500/10 px-2 py-1.5 text-[10px] font-medium text-cyan-400 ring-1 ring-cyan-500/20 hover:bg-cyan-500/20 transition-colors">
                    View Enrollees
                  </button>
                  <button className="flex-1 rounded-md bg-cyan-500/10 px-2 py-1.5 text-[10px] font-medium text-cyan-400 ring-1 ring-cyan-500/20 hover:bg-cyan-500/20 transition-colors">
                    Program Config
                  </button>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      <SectionTitle>Recent Enrollments</SectionTitle>
      <div className="space-y-1.5">
        {recentEnrollments.map((e, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-md bg-[#0a1020]/60 px-3 py-2 text-[11px]"
          >
            <span className="text-white font-medium w-24 truncate">{e.patient}</span>
            <span className="text-gray-500 flex-1 truncate">{e.program}</span>
            <span className="text-gray-600">{e.date}</span>
            <Badge
              label={e.status === "under_review" ? "Review" : e.status}
              variant={
                e.status === "approved" ? "success" : e.status === "pending" ? "warning" : "info"
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────── Prior Auth Panel ───────────────────── */

function PriorAuthDetail() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const pipeline = [
    { key: "submitted", label: "Submitted", count: 12, color: "bg-cyan-500" },
    { key: "in_review", label: "In Review", count: 8, color: "bg-amber-500" },
    { key: "info_needed", label: "Info Needed", count: 5, color: "bg-rose-500" },
    { key: "approved", label: "Approved", count: 65, color: "bg-emerald-500" },
    { key: "denied", label: "Denied", count: 3, color: "bg-gray-500" },
  ];

  const requests = [
    {
      id: "PA-2841",
      patient: "J. Thompson",
      drug: "Keytruda 100mg",
      payer: "Aetna",
      stage: "in_review" as const,
      submitted: "2h ago",
      priority: "high" as const,
    },
    {
      id: "PA-2840",
      patient: "S. Martinez",
      drug: "Jardiance 10mg",
      payer: "UHC",
      stage: "info_needed" as const,
      submitted: "4h ago",
      priority: "medium" as const,
    },
    {
      id: "PA-2839",
      patient: "D. Lee",
      drug: "Entresto 49/51mg",
      payer: "Cigna",
      stage: "submitted" as const,
      submitted: "6h ago",
      priority: "high" as const,
    },
    {
      id: "PA-2838",
      patient: "A. Patel",
      drug: "Xarelto 20mg",
      payer: "BCBS",
      stage: "approved" as const,
      submitted: "1d ago",
      priority: "low" as const,
    },
    {
      id: "PA-2837",
      patient: "C. Wang",
      drug: "Keytruda 100mg",
      payer: "Humana",
      stage: "approved" as const,
      submitted: "1d ago",
      priority: "medium" as const,
    },
    {
      id: "PA-2836",
      patient: "E. Rivera",
      drug: "Jardiance 25mg",
      payer: "Aetna",
      stage: "denied" as const,
      submitted: "2d ago",
      priority: "high" as const,
    },
  ];

  const filtered = selectedStage ? requests.filter((r) => r.stage === selectedStage) : requests;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <StatMini label="Pending" value="25" sub="Active requests" />
        <StatMini label="Approved" value="65" sub="This month" />
        <StatMini label="Avg Turnaround" value="2.4d" sub="Time to decision" />
      </div>

      <SectionTitle>Authorization Pipeline</SectionTitle>
      <div className="flex gap-1.5">
        {pipeline.map((stage) => (
          <button
            key={stage.key}
            onClick={() => setSelectedStage(selectedStage === stage.key ? null : stage.key)}
            className={`flex-1 rounded-lg border p-2 text-center transition-all ${
              selectedStage === stage.key
                ? "border-cyan-500/30 bg-cyan-500/[0.06]"
                : "border-cyan-500/10 bg-[#0a1020]/80 hover:border-cyan-500/20"
            }`}
          >
            <div
              className={`mx-auto h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${stage.color}`}
            >
              {stage.count}
            </div>
            <p className="mt-1 text-[9px] text-gray-500 leading-tight">{stage.label}</p>
          </button>
        ))}
      </div>
      {selectedStage && (
        <div className="flex items-center gap-2 text-[10px]">
          <Filter className="h-3 w-3 text-cyan-500/50" />
          <span className="text-gray-500">
            Filtering:{" "}
            <span className="text-cyan-400">
              {pipeline.find((s) => s.key === selectedStage)?.label}
            </span>
          </span>
          <button
            onClick={() => setSelectedStage(null)}
            className="ml-auto text-gray-600 hover:text-gray-400"
          >
            Clear
          </button>
        </div>
      )}

      <SectionTitle>Requests</SectionTitle>
      <div className="space-y-2">
        {filtered.map((req) => (
          <div
            key={req.id}
            className="rounded-lg border border-cyan-500/10 bg-[#0a1020]/80 px-3 py-2.5 hover:border-cyan-500/20 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-cyan-500/50">{req.id}</span>
              {req.priority === "high" && <Badge label="High" variant="danger" />}
              {req.priority === "medium" && <Badge label="Med" variant="warning" />}
              <span className="ml-auto text-[10px] text-gray-600">{req.submitted}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-3 text-[11px]">
              <span className="text-white font-medium">{req.patient}</span>
              <ArrowRight className="h-3 w-3 text-gray-600" />
              <span className="text-gray-400">{req.drug}</span>
              <span className="ml-auto text-gray-500">{req.payer}</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Badge
                label={req.stage.replace("_", " ")}
                variant={
                  req.stage === "approved"
                    ? "success"
                    : req.stage === "denied"
                      ? "danger"
                      : req.stage === "info_needed"
                        ? "warning"
                        : "info"
                }
              />
              {req.stage === "info_needed" && (
                <button className="ml-auto rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400 ring-1 ring-amber-500/20 hover:bg-amber-500/20 transition-colors">
                  Upload Docs
                </button>
              )}
              {req.stage === "denied" && (
                <button className="ml-auto rounded-md bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-400 ring-1 ring-cyan-500/20 hover:bg-cyan-500/20 transition-colors">
                  Appeal
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────── Patient Support Panel ───────────────────── */

function PatientSupportDetail() {
  const [filter, setFilter] = useState<"all" | "open" | "resolved">("all");

  const tickets = [
    {
      id: "TK-1092",
      subject: "Dosage adjustment inquiry",
      priority: "high" as const,
      status: "open" as const,
      assignee: "AI Agent",
      time: "3m",
      channel: "SMS",
    },
    {
      id: "TK-1091",
      subject: "Insurance coverage question",
      priority: "medium" as const,
      status: "open" as const,
      assignee: "AI Agent",
      time: "12m",
      channel: "Email",
    },
    {
      id: "TK-1090",
      subject: "Refill request assistance",
      priority: "low" as const,
      status: "open" as const,
      assignee: "L. Torres",
      time: "28m",
      channel: "Phone",
    },
    {
      id: "TK-1089",
      subject: "Side effects reporting",
      priority: "high" as const,
      status: "escalated" as const,
      assignee: "Dr. Review",
      time: "45m",
      channel: "Chat",
    },
    {
      id: "TK-1088",
      subject: "Delivery status follow-up",
      priority: "low" as const,
      status: "resolved" as const,
      assignee: "AI Agent",
      time: "1h",
      channel: "SMS",
    },
    {
      id: "TK-1087",
      subject: "Program enrollment help",
      priority: "medium" as const,
      status: "resolved" as const,
      assignee: "AI Agent",
      time: "2h",
      channel: "Email",
    },
  ];

  const filtered =
    filter === "all"
      ? tickets
      : filter === "open"
        ? tickets.filter((t) => t.status === "open" || t.status === "escalated")
        : tickets.filter((t) => t.status === "resolved");

  const satisfactionData = [
    { label: "Very Satisfied", pct: 62, color: "bg-emerald-500" },
    { label: "Satisfied", pct: 24, color: "bg-cyan-500" },
    { label: "Neutral", pct: 9, color: "bg-amber-500" },
    { label: "Unsatisfied", pct: 5, color: "bg-rose-500" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-3">
        <StatMini label="Open" value="14" />
        <StatMini label="Escalated" value="3" />
        <StatMini label="Avg Time" value="2m" />
        <StatMini label="CSAT" value="4.6" sub="/5.0" />
      </div>

      <SectionTitle>Active Tickets</SectionTitle>
      <div className="flex gap-1 rounded-lg bg-gray-900/50 p-1 mb-3">
        {(["all", "open", "resolved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 rounded-md px-3 py-1.5 text-[11px] font-medium transition-all capitalize ${
              filter === f ? "bg-cyan-500/15 text-cyan-400" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map((ticket) => (
          <div
            key={ticket.id}
            className="rounded-lg border border-cyan-500/10 bg-[#0a1020]/80 px-3 py-2.5 hover:border-cyan-500/20 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-[10px]">
              <span className="font-mono text-cyan-500/50">{ticket.id}</span>
              {ticket.priority === "high" && <Badge label="Urgent" variant="danger" />}
              {ticket.status === "escalated" && <Badge label="Escalated" variant="warning" />}
              <span className="ml-auto text-gray-600 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {ticket.time}
              </span>
            </div>
            <p className="mt-1 text-[12px] font-medium text-white">{ticket.subject}</p>
            <div className="mt-1.5 flex items-center gap-3 text-[10px] text-gray-500">
              <span className="flex items-center gap-1">
                {ticket.assignee === "AI Agent" ? (
                  <Bot className="h-3 w-3 text-cyan-400" />
                ) : (
                  <Users className="h-3 w-3" />
                )}
                {ticket.assignee}
              </span>
              <span>{ticket.channel}</span>
              {ticket.status === "open" && (
                <button className="ml-auto rounded-md bg-cyan-500/10 px-2 py-0.5 text-cyan-400 ring-1 ring-cyan-500/20 hover:bg-cyan-500/20 transition-colors">
                  Respond
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <SectionTitle>Satisfaction Breakdown</SectionTitle>
      <div className="space-y-2">
        {satisfactionData.map((s) => (
          <div key={s.label} className="flex items-center gap-3 text-[11px]">
            <span className="w-24 text-gray-500">{s.label}</span>
            <div className="flex-1">
              <MiniBar value={s.pct} max={100} color={s.color} />
            </div>
            <span className="w-8 text-right text-gray-400">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────── Access & Coverage Panel ───────────────────── */

function AccessCoverageDetail() {
  const [searchQuery, setSearchQuery] = useState("");

  const verificationStats = [
    { payer: "Aetna", verified: 245, total: 250, issues: 2 },
    { payer: "UnitedHealthcare", verified: 312, total: 320, issues: 3 },
    { payer: "Cigna", verified: 198, total: 205, issues: 4 },
    { payer: "BCBS", verified: 410, total: 415, issues: 1 },
    { payer: "Humana", verified: 156, total: 160, issues: 2 },
  ];

  const issues = [
    {
      id: "AC-091",
      patient: "T. Anderson",
      payer: "Cigna",
      issue: "Step therapy required",
      severity: "high" as const,
      action: "Peer-to-peer scheduled",
    },
    {
      id: "AC-090",
      patient: "N. Garcia",
      payer: "UHC",
      issue: "Formulary exclusion",
      severity: "high" as const,
      action: "Exception request filed",
    },
    {
      id: "AC-089",
      patient: "B. Taylor",
      payer: "Aetna",
      issue: "Quantity limit exceeded",
      severity: "medium" as const,
      action: "Awaiting review",
    },
    {
      id: "AC-088",
      patient: "W. Harris",
      payer: "Cigna",
      issue: "Non-preferred tier",
      severity: "low" as const,
      action: "Tier exception pending",
    },
  ];

  const formularyStatus = [
    { drug: "Xarelto", tier: "Preferred", coverage: 92 },
    { drug: "Jardiance", tier: "Non-Preferred", coverage: 78 },
    { drug: "Entresto", tier: "Preferred", coverage: 88 },
    { drug: "Keytruda", tier: "Specialty", coverage: 95 },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <StatMini label="Verified" value="98%" sub="Of total lives" />
        <StatMini label="Active Issues" value="12" sub="Require action" />
        <StatMini label="Avg Verify" value="0.8s" sub="Processing time" />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-600" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by payer, patient, or drug..."
          className="w-full rounded-lg border border-cyan-500/10 bg-[#0a1020]/80 py-2 pl-8 pr-3 text-[11px] text-white placeholder-gray-600 focus:border-cyan-500/30 focus:outline-none transition-colors"
        />
      </div>

      <SectionTitle>Payer Verification</SectionTitle>
      <div className="space-y-2">
        {verificationStats.map((payer) => (
          <div
            key={payer.payer}
            className="flex items-center gap-3 rounded-lg border border-cyan-500/10 bg-[#0a1020]/80 px-3 py-2"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-white">{payer.payer}</span>
                <span className="text-[10px] text-gray-500">
                  {payer.verified}/{payer.total}
                </span>
              </div>
              <div className="mt-1.5">
                <MiniBar
                  value={payer.verified}
                  max={payer.total}
                  color="bg-gradient-to-r from-cyan-500 to-teal-400"
                />
              </div>
            </div>
            {payer.issues > 0 && <Badge label={`${payer.issues} issues`} variant="warning" />}
          </div>
        ))}
      </div>

      <SectionTitle>Formulary Coverage</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        {formularyStatus.map((drug) => (
          <div key={drug.drug} className="rounded-lg border border-cyan-500/10 bg-[#0a1020]/80 p-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-white">{drug.drug}</span>
              <Badge
                label={drug.tier}
                variant={
                  drug.tier === "Preferred"
                    ? "success"
                    : drug.tier === "Specialty"
                      ? "info"
                      : "warning"
                }
              />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <MiniBar
                value={drug.coverage}
                max={100}
                color="bg-gradient-to-r from-cyan-500 to-teal-400"
              />
              <span className="text-[10px] text-gray-400">{drug.coverage}%</span>
            </div>
          </div>
        ))}
      </div>

      <SectionTitle>Active Issues</SectionTitle>
      <div className="space-y-2">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="rounded-lg border border-cyan-500/10 bg-[#0a1020]/80 px-3 py-2.5 hover:border-cyan-500/20 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-[10px]">
              <span className="font-mono text-cyan-500/50">{issue.id}</span>
              <Badge
                label={issue.severity}
                variant={
                  issue.severity === "high"
                    ? "danger"
                    : issue.severity === "medium"
                      ? "warning"
                      : "neutral"
                }
              />
              <span className="ml-auto text-gray-500">{issue.payer}</span>
            </div>
            <p className="mt-1 text-[12px] font-medium text-white">
              {issue.patient} &mdash; {issue.issue}
            </p>
            <p className="mt-0.5 text-[10px] text-gray-500 flex items-center gap-1">
              <ArrowRight className="h-3 w-3 text-cyan-500/40" />
              {issue.action}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────── Materials Panel ───────────────────── */

function MaterialsDetail() {
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "clinical" | "patient" | "marketing"
  >("all");

  const materials = [
    {
      id: "MAT-001",
      name: "Prescribing Information Guide",
      category: "clinical" as const,
      format: "PDF",
      requested: 142,
      rating: 4.8,
    },
    {
      id: "MAT-002",
      name: "Patient Education Brochure",
      category: "patient" as const,
      format: "Print",
      requested: 98,
      rating: 4.5,
    },
    {
      id: "MAT-003",
      name: "Mechanism of Action Video",
      category: "clinical" as const,
      format: "Video",
      requested: 215,
      rating: 4.9,
    },
    {
      id: "MAT-004",
      name: "Dosing Quick Reference Card",
      category: "clinical" as const,
      format: "Print",
      requested: 310,
      rating: 4.7,
    },
    {
      id: "MAT-005",
      name: "Patient Savings Card",
      category: "patient" as const,
      format: "Digital",
      requested: 189,
      rating: 4.3,
    },
    {
      id: "MAT-006",
      name: "Disease State Overview",
      category: "marketing" as const,
      format: "PDF",
      requested: 67,
      rating: 4.1,
    },
  ];

  const orders = [
    { id: "MO-482", hcp: "Dr. Chen", items: 3, status: "shipped" as const, date: "Today" },
    { id: "MO-481", hcp: "Dr. Wilson", items: 1, status: "processing" as const, date: "Today" },
    { id: "MO-480", hcp: "Dr. Santos", items: 5, status: "delivered" as const, date: "Yesterday" },
    { id: "MO-479", hcp: "Dr. Kim", items: 2, status: "delivered" as const, date: "Yesterday" },
  ];

  const categories = ["all", "clinical", "patient", "marketing"] as const;
  const filtered =
    selectedCategory === "all"
      ? materials
      : materials.filter((m) => m.category === selectedCategory);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <StatMini label="Active Materials" value="6" sub="Available items" />
        <StatMini label="Orders" value="8" sub="This week" />
        <StatMini label="Pending" value="2" sub="In fulfillment" />
      </div>

      <SectionTitle>Material Catalog</SectionTitle>
      <div className="flex gap-1 rounded-lg bg-gray-900/50 p-1 mb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex-1 rounded-md px-2 py-1.5 text-[10px] font-medium capitalize transition-all ${
              selectedCategory === cat
                ? "bg-cyan-500/15 text-cyan-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map((mat) => (
          <div
            key={mat.id}
            className="rounded-lg border border-cyan-500/10 bg-[#0a1020]/80 px-3 py-2.5 hover:border-cyan-500/20 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-cyan-500/40 shrink-0" />
              <span className="text-[12px] font-medium text-white flex-1 truncate">{mat.name}</span>
              <Badge label={mat.format} variant="info" />
            </div>
            <div className="mt-1.5 flex items-center gap-4 text-[10px] text-gray-500">
              <span className="flex items-center gap-1">
                <Send className="h-3 w-3" />
                {mat.requested} requests
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-400" />
                {mat.rating}
              </span>
              <Badge label={mat.category} variant="neutral" />
              <button className="ml-auto rounded-md bg-cyan-500/10 px-2 py-0.5 text-cyan-400 ring-1 ring-cyan-500/20 hover:bg-cyan-500/20 transition-colors">
                Order
              </button>
            </div>
          </div>
        ))}
      </div>

      <SectionTitle>Recent Orders</SectionTitle>
      <div className="space-y-1.5">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center gap-3 rounded-md bg-[#0a1020]/60 px-3 py-2 text-[11px]"
          >
            <span className="font-mono text-cyan-500/50">{order.id}</span>
            <span className="text-white font-medium flex-1 truncate">{order.hcp}</span>
            <span className="text-gray-600">{order.items} items</span>
            <span className="text-gray-600">{order.date}</span>
            <Badge
              label={order.status}
              variant={
                order.status === "delivered"
                  ? "success"
                  : order.status === "shipped"
                    ? "info"
                    : "warning"
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────── Panel header icons by id ───────────────────── */

const panelConfig: Record<string, { icon: React.ReactNode; title: string; description: string }> = {
  samples: {
    icon: <Package className="h-5 w-5 text-cyan-400" />,
    title: "Samples Management",
    description: "Inventory tracking, ordering, and PDMA compliance for sample distribution",
  },
  "hub-services": {
    icon: <Users className="h-5 w-5 text-cyan-400" />,
    title: "Hub Services",
    description: "Patient enrollment programs, co-pay assistance, and bridge programs",
  },
  "prior-auth": {
    icon: <ShieldCheck className="h-5 w-5 text-cyan-400" />,
    title: "Prior Authorization",
    description: "Authorization pipeline, request tracking, and payer communications",
  },
  "patient-support": {
    icon: <HeadphonesIcon className="h-5 w-5 text-cyan-400" />,
    title: "Patient Support",
    description: "Support tickets, AI-powered responses, and satisfaction monitoring",
  },
  "access-coverage": {
    icon: <BadgeCheck className="h-5 w-5 text-cyan-400" />,
    title: "Access & Coverage",
    description: "Insurance verification, formulary status, and coverage issue resolution",
  },
  materials: {
    icon: <ShoppingCart className="h-5 w-5 text-cyan-400" />,
    title: "Materials",
    description: "Educational materials catalog, ordering, and HCP distribution tracking",
  },
};

/* ───────────────────── Main Export ───────────────────── */

export function IntegrationDetailPanel({ integrationId, onClose }: IntegrationDetailPanelProps) {
  const config = panelConfig[integrationId];
  if (!config) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 mt-8 mb-8 w-full max-w-2xl max-h-[calc(100vh-4rem)] overflow-hidden rounded-2xl border border-cyan-900/40 bg-[#070c1a] shadow-[0_0_80px_rgba(34,211,238,0.08)] vc-panel-enter">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0 vc-grid-bg opacity-[0.02]" />

        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-cyan-900/30 bg-[#070c1a]/95 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 ring-1 ring-cyan-500/20">
              {config.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-[14px] font-semibold text-white">{config.title}</h3>
              <p className="text-[11px] text-gray-500">{config.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-colors"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(100vh-10rem)] p-6">
          {integrationId === "samples" && <SamplesDetail />}
          {integrationId === "hub-services" && <HubServicesDetail />}
          {integrationId === "prior-auth" && <PriorAuthDetail />}
          {integrationId === "patient-support" && <PatientSupportDetail />}
          {integrationId === "access-coverage" && <AccessCoverageDetail />}
          {integrationId === "materials" && <MaterialsDetail />}
        </div>

        {/* Footer */}
        <div className="border-t border-cyan-900/30 px-6 py-3 bg-[#070c1a]/95">
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.5)]" />
              Connected
            </span>
            <span>Last sync: just now</span>
            <button className="text-cyan-500/50 hover:text-cyan-400 transition-colors">
              View API Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
