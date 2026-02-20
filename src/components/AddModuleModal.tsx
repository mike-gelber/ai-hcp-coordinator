"use client";

import { useState } from "react";
import {
  X,
  Search,
  Plus,
  Check,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Microscope,
  DollarSign,
  LifeBuoy,
  Database,
  FileBarChart,
  Pill,
  Stethoscope,
  Scale,
  ClipboardList,
  Megaphone,
  Building2,
  Handshake,
  FlaskConical,
  Star,
  Blocks,
  ArrowRight,
  Shield,
  Clock,
  Zap,
} from "lucide-react";

type ModuleCategory = "all" | "clinical" | "financial" | "support" | "data" | "compliance";

interface ModuleCatalogItem {
  id: string;
  name: string;
  description: string;
  category: ModuleCategory;
  icon: React.ReactNode;
  features: string[];
  tags: string[];
  badge?: "popular" | "new" | "recommended";
  compatibility: string;
  setupTime: string;
}

interface AddModuleModalProps {
  onClose: () => void;
  onAddModule: (moduleId: string) => void;
  installedModuleIds: string[];
}

const catalogModules: ModuleCatalogItem[] = [
  {
    id: "copay-card",
    name: "Co-Pay Card Management",
    description:
      "Manage co-pay card programs including enrollment, activation tracking, and utilization analytics across pharmacy networks.",
    category: "financial",
    icon: <DollarSign className="h-5 w-5" />,
    features: [
      "Real-time activation tracking",
      "Pharmacy network coverage",
      "Utilization analytics dashboard",
      "Automated renewal management",
    ],
    tags: ["Financial", "Patient Access"],
    badge: "popular",
    compatibility: "All brands",
    setupTime: "< 5 min",
  },
  {
    id: "adverse-events",
    name: "Adverse Event Reporting",
    description:
      "Capture, triage, and route adverse event reports with automated severity classification and regulatory timeline tracking.",
    category: "compliance",
    icon: <AlertTriangle className="h-5 w-5" />,
    features: [
      "AI-powered severity classification",
      "FDA MedWatch integration",
      "15-day / 90-day deadline tracking",
      "Automated follow-up workflows",
    ],
    tags: ["Safety", "Regulatory"],
    badge: "recommended",
    compatibility: "All brands",
    setupTime: "< 10 min",
  },
  {
    id: "medical-info",
    name: "Medical Information",
    description:
      "Route and respond to unsolicited medical information requests from HCPs with approved standard response letters.",
    category: "clinical",
    icon: <Stethoscope className="h-5 w-5" />,
    features: [
      "Standard response letter library",
      "Request categorization & routing",
      "Response time SLA tracking",
      "Off-label inquiry handling",
    ],
    tags: ["Clinical", "Information"],
    badge: "popular",
    compatibility: "All brands",
    setupTime: "< 5 min",
  },
  {
    id: "clinical-trials",
    name: "Clinical Trials Connect",
    description:
      "Help HCPs find relevant clinical trials for their patients, with eligibility screening and site referral capabilities.",
    category: "clinical",
    icon: <FlaskConical className="h-5 w-5" />,
    features: [
      "Trial search & matching",
      "Patient eligibility pre-screening",
      "Site referral management",
      "Enrollment status tracking",
    ],
    tags: ["Clinical", "Research"],
    badge: "new",
    compatibility: "Oncology, Rare Disease",
    setupTime: "< 15 min",
  },
  {
    id: "kol-engagement",
    name: "KOL Engagement Tracker",
    description:
      "Track interactions with Key Opinion Leaders across channels, manage advisory boards, and measure engagement impact.",
    category: "data",
    icon: <Star className="h-5 w-5" />,
    features: [
      "Multi-channel interaction log",
      "Advisory board management",
      "Congress activity tracking",
      "Influence scoring & analytics",
    ],
    tags: ["Data", "Engagement"],
    compatibility: "All brands",
    setupTime: "< 5 min",
  },
  {
    id: "specialty-pharmacy",
    name: "Specialty Pharmacy Network",
    description:
      "Monitor fill rates, manage limited distribution networks, and track patient journey through specialty pharmacy fulfillment.",
    category: "financial",
    icon: <Pill className="h-5 w-5" />,
    features: [
      "Fill rate monitoring",
      "LDD network management",
      "Patient journey tracking",
      "Pharmacy performance scorecards",
    ],
    tags: ["Financial", "Distribution"],
    badge: "popular",
    compatibility: "Specialty brands",
    setupTime: "< 10 min",
  },
  {
    id: "claims-reimbursement",
    name: "Claims & Reimbursement",
    description:
      "Track claims status, manage denials and appeals, and provide real-time reimbursement support to HCP offices.",
    category: "financial",
    icon: <FileBarChart className="h-5 w-5" />,
    features: [
      "Real-time claims tracking",
      "Denial management workflow",
      "Appeal letter generation",
      "Coding assistance (ICD/CPT)",
    ],
    tags: ["Financial", "Reimbursement"],
    compatibility: "All brands",
    setupTime: "< 10 min",
  },
  {
    id: "compliance-monitoring",
    name: "Compliance Monitoring",
    description:
      "Monitor field force compliance with OIG guidelines, Sunshine Act reporting, and internal policy adherence in real time.",
    category: "compliance",
    icon: <Scale className="h-5 w-5" />,
    features: [
      "Sunshine Act data capture",
      "HCP spend tracking & limits",
      "Policy violation alerts",
      "Audit trail & reporting",
    ],
    tags: ["Compliance", "Regulatory"],
    compatibility: "All brands",
    setupTime: "< 5 min",
  },
  {
    id: "field-intelligence",
    name: "Field Force Intelligence",
    description:
      "AI-powered insights for field teams including call planning optimization, territory analytics, and competitive intelligence.",
    category: "data",
    icon: <Database className="h-5 w-5" />,
    features: [
      "AI call plan optimization",
      "Territory performance heatmaps",
      "Competitive activity tracking",
      "Rx trend analysis",
    ],
    tags: ["Data", "Analytics"],
    badge: "new",
    compatibility: "All brands",
    setupTime: "< 10 min",
  },
  {
    id: "speaker-programs",
    name: "Speaker Programs",
    description:
      "Manage speaker bureau logistics, event scheduling, HCP nominations, and compliance tracking for promotional events.",
    category: "clinical",
    icon: <Megaphone className="h-5 w-5" />,
    features: [
      "Event scheduling & logistics",
      "Speaker nomination workflow",
      "Attendance tracking",
      "Fair market value compliance",
    ],
    tags: ["Clinical", "Events"],
    compatibility: "All brands",
    setupTime: "< 10 min",
  },
  {
    id: "payer-insights",
    name: "Payer Policy Insights",
    description:
      "Real-time payer policy monitoring, formulary change alerts, and coverage landscape analytics across commercial and Medicare plans.",
    category: "data",
    icon: <Building2 className="h-5 w-5" />,
    features: [
      "Formulary change alerts",
      "Policy update monitoring",
      "Regional coverage heatmaps",
      "Plan comparison tools",
    ],
    tags: ["Data", "Market Access"],
    badge: "recommended",
    compatibility: "All brands",
    setupTime: "< 5 min",
  },
  {
    id: "patient-onboarding",
    name: "Patient Onboarding",
    description:
      "Streamline new patient onboarding with digital intake forms, benefit verification, and personalized support program enrollment.",
    category: "support",
    icon: <Handshake className="h-5 w-5" />,
    features: [
      "Digital intake forms",
      "Automated BV checks",
      "Program recommendation engine",
      "Welcome kit coordination",
    ],
    tags: ["Support", "Patient"],
    badge: "new",
    compatibility: "All brands",
    setupTime: "< 10 min",
  },
  {
    id: "referral-management",
    name: "Referral Management",
    description:
      "Track and manage patient referrals between HCPs, specialists, and treatment centers with status visibility at every step.",
    category: "support",
    icon: <ClipboardList className="h-5 w-5" />,
    features: [
      "Referral status tracking",
      "Specialist network directory",
      "Automated follow-up reminders",
      "Referral analytics & reporting",
    ],
    tags: ["Support", "Coordination"],
    compatibility: "Specialty brands",
    setupTime: "< 5 min",
  },
  {
    id: "lab-diagnostics",
    name: "Lab & Diagnostics",
    description:
      "Coordinate diagnostic testing, biomarker identification, and lab result tracking to support treatment decisions.",
    category: "clinical",
    icon: <Microscope className="h-5 w-5" />,
    features: [
      "Biomarker testing coordination",
      "Lab order management",
      "Result notification workflows",
      "Companion diagnostic tracking",
    ],
    tags: ["Clinical", "Diagnostics"],
    compatibility: "Oncology, Precision Medicine",
    setupTime: "< 15 min",
  },
];

const categories: { key: ModuleCategory; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "All Modules", icon: <Blocks className="h-3.5 w-3.5" /> },
  { key: "clinical", label: "Clinical", icon: <Stethoscope className="h-3.5 w-3.5" /> },
  { key: "financial", label: "Financial", icon: <DollarSign className="h-3.5 w-3.5" /> },
  { key: "support", label: "Support", icon: <LifeBuoy className="h-3.5 w-3.5" /> },
  { key: "data", label: "Data & Analytics", icon: <Database className="h-3.5 w-3.5" /> },
  { key: "compliance", label: "Compliance", icon: <Shield className="h-3.5 w-3.5" /> },
];

function BadgeTag({ type }: { type: "popular" | "new" | "recommended" }) {
  const styles = {
    popular: "bg-amber-500/15 text-amber-400 ring-amber-500/20",
    new: "bg-violet-500/15 text-violet-400 ring-violet-500/20",
    recommended: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/20",
  };
  const labels = { popular: "Popular", new: "New", recommended: "Recommended" };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ring-1 ${styles[type]}`}
    >
      {type === "popular" && <TrendingUp className="h-2.5 w-2.5" />}
      {type === "new" && <Sparkles className="h-2.5 w-2.5" />}
      {type === "recommended" && <Star className="h-2.5 w-2.5" />}
      {labels[type]}
    </span>
  );
}

export function AddModuleModal({ onClose, onAddModule, installedModuleIds }: AddModuleModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ModuleCategory>("all");
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState<Set<string>>(new Set());

  const filtered = catalogModules.filter((mod) => {
    if (selectedCategory !== "all" && mod.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        mod.name.toLowerCase().includes(q) ||
        mod.description.toLowerCase().includes(q) ||
        mod.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleAdd = (moduleId: string) => {
    onAddModule(moduleId);
    setJustAdded((prev) => new Set(prev).add(moduleId));
  };

  const isInstalled = (id: string) => installedModuleIds.includes(id) || justAdded.has(id);

  const installedCount = catalogModules.filter((m) => isInstalled(m.id)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 mt-6 mb-6 w-full max-w-3xl max-h-[calc(100vh-3rem)] overflow-hidden rounded-2xl border border-cyan-900/40 bg-[#070c1a] shadow-[0_0_80px_rgba(34,211,238,0.08)] vc-panel-enter">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0 vc-grid-bg opacity-[0.02]" />

        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-cyan-900/30 bg-[#070c1a]/95 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 ring-1 ring-cyan-500/20">
              <Blocks className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-[14px] font-semibold text-white">Integration Marketplace</h3>
              <p className="text-[11px] text-gray-500">
                {catalogModules.length} modules available &middot; {installedCount} installed
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search modules by name, category, or feature..."
              className="w-full rounded-lg border border-cyan-500/10 bg-[#0a1020]/80 py-2.5 pl-9 pr-3 text-[12px] text-white placeholder-gray-600 focus:border-cyan-500/30 focus:outline-none transition-colors"
              autoFocus
            />
          </div>

          {/* Category pills */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all ${
                  selectedCategory === cat.key
                    ? "bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/25"
                    : "bg-gray-900/50 text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Module grid */}
        <div className="overflow-y-auto max-h-[calc(100vh-16rem)] p-6">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="h-8 w-8 text-gray-700" />
              <p className="mt-3 text-[13px] text-gray-500">No modules match your search</p>
              <p className="mt-1 text-[11px] text-gray-600">
                Try a different keyword or browse by category
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map((mod) => {
                const installed = isInstalled(mod.id);
                const isExpanded = expandedModule === mod.id;
                return (
                  <div
                    key={mod.id}
                    className={`group relative rounded-xl border transition-all duration-200 ${
                      installed
                        ? "border-emerald-500/20 bg-emerald-500/[0.03]"
                        : isExpanded
                          ? "border-cyan-500/30 bg-cyan-500/[0.04]"
                          : "border-cyan-500/10 bg-[#0a1020]/60 hover:border-cyan-500/20"
                    }`}
                  >
                    {/* Card header - always visible */}
                    <button
                      onClick={() => setExpandedModule(isExpanded ? null : mod.id)}
                      className="w-full text-left px-4 py-3.5"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                            installed
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-cyan-500/10 text-cyan-400"
                          }`}
                        >
                          {mod.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[13px] font-medium text-white">{mod.name}</span>
                            {mod.badge && <BadgeTag type={mod.badge} />}
                            {installed && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-emerald-400 ring-1 ring-emerald-500/20">
                                <Check className="h-2.5 w-2.5" />
                                Installed
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-[11px] text-gray-500 leading-relaxed line-clamp-2">
                            {mod.description}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {mod.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md bg-gray-800/60 px-1.5 py-0.5 text-[9px] text-gray-500"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="border-t border-cyan-500/10 px-4 py-3.5 vc-expand-enter">
                        {/* Features */}
                        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-cyan-500/60 mb-2">
                          Features
                        </p>
                        <div className="space-y-1.5 mb-4">
                          {mod.features.map((feature) => (
                            <div key={feature} className="flex items-center gap-2 text-[11px]">
                              <Zap className="h-3 w-3 text-cyan-500/40 shrink-0" />
                              <span className="text-gray-400">{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* Meta info */}
                        <div className="flex items-center gap-4 mb-4 text-[10px] text-gray-500">
                          <span className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            {mod.compatibility}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Setup: {mod.setupTime}
                          </span>
                        </div>

                        {/* Action */}
                        {installed ? (
                          <div className="flex items-center gap-2">
                            <span className="flex-1 text-[11px] text-emerald-400 flex items-center gap-1.5">
                              <Check className="h-3.5 w-3.5" />
                              Module installed and connected
                            </span>
                            <button className="rounded-lg px-3 py-1.5 text-[11px] font-medium text-gray-500 ring-1 ring-gray-700 hover:bg-gray-800 hover:text-gray-300 transition-colors">
                              Configure
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAdd(mod.id)}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500/15 py-2 text-[12px] font-semibold text-cyan-400 ring-1 ring-cyan-500/25 transition-all hover:bg-cyan-500/25 active:scale-[0.98]"
                          >
                            <Plus className="h-4 w-4" />
                            Install Module
                            <ArrowRight className="h-3.5 w-3.5 opacity-50" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-cyan-900/30 px-6 py-3 bg-[#070c1a]/95">
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-600">
            <span>
              Showing {filtered.length} of {catalogModules.length} modules
            </span>
            <span className="text-cyan-500/50">Custom module requests available via API</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { catalogModules };
export type { ModuleCatalogItem };
