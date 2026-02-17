"use client";

import { useState } from "react";
import {
  Zap,
  Package,
  Users,
  ShieldCheck,
  HeadphonesIcon,
  BadgeCheck,
  ShoppingCart,
  Smartphone,
  Mail,
  Globe,
  Headphones,
  Bot,
  Plus,
  GripVertical,
  Cpu,
  HardDrive,
  ChevronUp,
  ChevronDown,
  Minus,
} from "lucide-react";
import { IntegrationDetailPanel } from "./IntegrationDetailPanel";

interface Integration {
  id: string;
  name: string;
  icon: React.ReactNode;
  metric1: { label: string; value: string };
  metric2: { label: string; value: string };
  status: "active" | "warning" | "inactive";
  enabled: boolean;
}

interface Channel {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
  trend: "up" | "down" | "neutral";
  trendLabel: string;
}

const defaultIntegrations: Integration[] = [
  {
    id: "samples",
    name: "Samples",
    icon: <Package className="h-5 w-5" />,
    metric1: { label: "Stock", value: "85%" },
    metric2: { label: "Low Items", value: "3" },
    status: "warning",
    enabled: true,
  },
  {
    id: "hub-services",
    name: "Hub Services",
    icon: <Users className="h-5 w-5" />,
    metric1: { label: "Enrolled", value: "2,458" },
    metric2: { label: "Growth", value: "+5%" },
    status: "active",
    enabled: true,
  },
  {
    id: "prior-auth",
    name: "Prior Auth",
    icon: <ShieldCheck className="h-5 w-5" />,
    metric1: { label: "Pending", value: "25" },
    metric2: { label: "Approved", value: "65" },
    status: "active",
    enabled: true,
  },
  {
    id: "patient-support",
    name: "Patient Support",
    icon: <HeadphonesIcon className="h-5 w-5" />,
    metric1: { label: "Tickets", value: "14" },
    metric2: { label: "Avg Time", value: "2m" },
    status: "active",
    enabled: true,
  },
  {
    id: "access-coverage",
    name: "Access & Coverage",
    icon: <BadgeCheck className="h-5 w-5" />,
    metric1: { label: "Verified", value: "98%" },
    metric2: { label: "Issues", value: "12" },
    status: "active",
    enabled: true,
  },
  {
    id: "materials",
    name: "Materials",
    icon: <ShoppingCart className="h-5 w-5" />,
    metric1: { label: "Orders", value: "8" },
    metric2: { label: "Pending", value: "2" },
    status: "active",
    enabled: true,
  },
];

const defaultChannels: Channel[] = [
  {
    id: "sms",
    name: "SMS",
    icon: <Smartphone className="h-5 w-5" />,
    count: 854,
    trend: "up",
    trendLabel: "Inbound",
  },
  {
    id: "email",
    name: "Email",
    icon: <Mail className="h-5 w-5" />,
    count: 1243,
    trend: "neutral",
    trendLabel: "Inbound",
  },
  {
    id: "owned-media",
    name: "Owned Media",
    icon: <Globe className="h-5 w-5" />,
    count: 432,
    trend: "up",
    trendLabel: "Inbound",
  },
  {
    id: "concierge",
    name: "Concierge",
    icon: <Headphones className="h-5 w-5" />,
    count: 128,
    trend: "down",
    trendLabel: "Inbound",
  },
  {
    id: "ai-assistant",
    name: "AI Assistant",
    icon: <Bot className="h-5 w-5" />,
    count: 2156,
    trend: "up",
    trendLabel: "Inbound",
  },
];

function StatusDot({ status }: { status: "active" | "warning" | "inactive" }) {
  const colors = {
    active: "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]",
    warning: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]",
    inactive: "bg-gray-500",
  };
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${colors[status]}`} />;
}

function TrendArrow({ trend }: { trend: "up" | "down" | "neutral" }) {
  if (trend === "up") return <ChevronUp className="h-3.5 w-3.5 text-emerald-400" />;
  if (trend === "down") return <ChevronDown className="h-3.5 w-3.5 text-rose-400" />;
  return <Minus className="h-3.5 w-3.5 text-gray-400" />;
}

export function VirtualCoordinator() {
  const [integrations, setIntegrations] = useState<Integration[]>(defaultIntegrations);
  const [channels] = useState<Channel[]>(defaultChannels);
  const [expandedIntegration, setExpandedIntegration] = useState<string | null>(null);

  const toggleIntegration = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIntegrations((prev) => prev.map((i) => (i.id === id ? { ...i, enabled: !i.enabled } : i)));
  };

  const openIntegration = (id: string) => {
    const integration = integrations.find((i) => i.id === id);
    if (integration?.enabled) {
      setExpandedIntegration(id);
    }
  };

  const enabledCount = integrations.filter((i) => i.enabled).length;
  const cpuUsage = 12;
  const memUsage = 4.2;
  const systemStatus =
    enabledCount >= 4 ? "SYSTEM OPTIMAL" : enabledCount >= 2 ? "PARTIAL" : "MINIMAL";

  return (
    <div className="vc-root relative overflow-hidden rounded-2xl border border-cyan-900/40 bg-[#070c1a]">
      {/* Background grid + glow */}
      <div className="pointer-events-none absolute inset-0 vc-grid-bg opacity-[0.035]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-cyan-500/[0.04] blur-[120px]" />

      {/* Header */}
      <div className="relative border-b border-cyan-900/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 ring-1 ring-cyan-500/20">
              <Zap className="h-4 w-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-white uppercase">
                Virtual Coordinator
              </h3>
              <p className="text-[11px] text-cyan-500/60 font-mono">Neural Nexus v2.4</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <Cpu className="h-3.5 w-3.5 text-cyan-500/50" />
              <span className="text-cyan-400">{cpuUsage}%</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <HardDrive className="h-3.5 w-3.5 text-cyan-500/50" />
              <span className="text-cyan-400">{memUsage}GB</span>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ${
                systemStatus === "SYSTEM OPTIMAL"
                  ? "bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20"
                  : systemStatus === "PARTIAL"
                    ? "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20"
                    : "bg-gray-500/10 text-gray-400 ring-1 ring-gray-500/20"
              }`}
            >
              {systemStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Main three-column layout */}
      <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-0">
        {/* Left: Integrations */}
        <div className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-cyan-500/70">
              Integrations
            </h4>
            <button className="flex items-center gap-1.5 rounded-md bg-cyan-500/10 px-2.5 py-1 text-[10px] font-medium text-cyan-400 transition-colors hover:bg-cyan-500/20 ring-1 ring-cyan-500/20">
              <Plus className="h-3 w-3" />
              Add Module
            </button>
          </div>
          <div className="space-y-2.5">
            {integrations.map((integration) => (
              <div
                key={integration.id}
                onClick={() => openIntegration(integration.id)}
                className={`group relative flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300 ${
                  integration.enabled
                    ? "border-cyan-500/15 bg-gradient-to-r from-cyan-500/[0.04] to-transparent hover:border-cyan-500/30 hover:from-cyan-500/[0.08] cursor-pointer"
                    : "border-gray-700/30 bg-gray-900/20 opacity-50"
                }`}
              >
                <button
                  className="cursor-grab text-gray-600 hover:text-gray-400 transition-colors"
                  title="Drag to reorder"
                  onClick={(e) => e.stopPropagation()}
                >
                  <GripVertical className="h-3.5 w-3.5" />
                </button>
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    integration.enabled
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "bg-gray-800 text-gray-500"
                  }`}
                >
                  {integration.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-white truncate group-hover:text-cyan-300 transition-colors">
                      {integration.name}
                    </span>
                    {integration.enabled && <StatusDot status={integration.status} />}
                    {integration.enabled && (
                      <span className="hidden group-hover:inline-flex text-[9px] text-cyan-500/50 tracking-wide uppercase">
                        Details →
                      </span>
                    )}
                  </div>
                  {integration.enabled && (
                    <div className="mt-0.5 flex items-center gap-3 text-[11px] text-gray-400">
                      <span>
                        {integration.metric1.label}:{" "}
                        <span className="font-medium text-gray-300">
                          {integration.metric1.value}
                        </span>
                      </span>
                      <span>
                        {integration.metric2.label}:{" "}
                        <span className="font-medium text-gray-300">
                          {integration.metric2.value}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
                {/* Connection line indicator */}
                <div className="hidden lg:flex items-center gap-1.5 ml-2">
                  {integration.enabled && (
                    <>
                      <div className="h-[1px] w-6 bg-gradient-to-r from-cyan-500/40 to-cyan-500/10" />
                      <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 vc-pulse" />
                    </>
                  )}
                </div>
                {/* Toggle */}
                <button
                  onClick={(e) => toggleIntegration(integration.id, e)}
                  className={`ml-1 flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                    integration.enabled ? "bg-cyan-500/30" : "bg-gray-700/50"
                  }`}
                  title={integration.enabled ? "Disable" : "Enable"}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 rounded-full transition-transform ${
                      integration.enabled
                        ? "translate-x-[18px] bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.5)]"
                        : "translate-x-[3px] bg-gray-500"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Hub visualization */}
        <div className="relative flex items-center justify-center px-4 py-8 lg:px-8 lg:py-12">
          {/* Vertical dividers on desktop */}
          <div className="hidden lg:block absolute left-0 top-6 bottom-6 w-px bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />
          <div className="hidden lg:block absolute right-0 top-6 bottom-6 w-px bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />

          {/* Central orb */}
          <div className="relative flex h-52 w-52 items-center justify-center">
            {/* Outer ring animated */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/20 vc-spin-slow" />
            <div className="absolute inset-2 rounded-full border border-cyan-500/10 vc-spin-reverse" />

            {/* Glow ring */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-500/[0.08] to-teal-500/[0.04] shadow-[0_0_60px_rgba(34,211,238,0.1)]" />

            {/* Inner dark circle */}
            <div className="absolute inset-6 rounded-full border border-cyan-500/20 bg-[#0a1020]" />

            {/* Central content */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 ring-1 ring-cyan-400/30 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
                <Zap className="h-7 w-7 text-cyan-400" />
              </div>
              <div className="mt-1 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                  Neural
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                  Nexus
                </p>
              </div>
            </div>

            {/* Orbiting dots */}
            <div className="absolute inset-0 vc-spin-slow">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
            </div>
            <div className="absolute inset-0 vc-spin-reverse">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]" />
            </div>
          </div>
        </div>

        {/* Right: Engagement Channels */}
        <div className="p-5">
          <div className="mb-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-cyan-500/70">
              Engagement Channels
            </h4>
          </div>
          <div className="space-y-2.5">
            {channels.map((channel) => (
              <div
                key={channel.id}
                className="group relative flex items-center gap-3 rounded-xl border border-cyan-500/15 bg-gradient-to-l from-cyan-500/[0.04] to-transparent px-4 py-3 transition-all hover:border-cyan-500/30 hover:from-cyan-500/[0.08]"
              >
                {/* Connection line indicator */}
                <div className="hidden lg:flex items-center gap-1.5 mr-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 vc-pulse" />
                  <div className="h-[1px] w-6 bg-gradient-to-l from-cyan-500/40 to-cyan-500/10" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-[11px] text-gray-500">
                      <TrendArrow trend={channel.trend} />
                      <span>{channel.trendLabel}</span>
                    </div>
                    <span className="ml-auto text-[13px] font-medium text-white truncate">
                      {channel.name}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold tabular-nums text-cyan-400 vc-glow-text">
                    {channel.count.toLocaleString()}
                  </span>
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                  {channel.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-cyan-900/30 px-6 py-3">
        <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
          <span>
            {enabledCount} / {integrations.length} modules active
          </span>
          <span>{channels.length} channels routing</span>
          <span className="text-cyan-500/50">Real-time sync enabled</span>
        </div>
      </div>

      {/* Integration Detail Panel */}
      {expandedIntegration && (
        <IntegrationDetailPanel
          integrationId={expandedIntegration}
          onClose={() => setExpandedIntegration(null)}
        />
      )}
    </div>
  );
}
