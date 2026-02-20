"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Link2,
  Megaphone,
  Settings,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/virtual-coordinator", label: "Virtual Coordinator", icon: Users },
  { href: "/connect", label: "Connect", icon: Link2 },
  { href: "/campaign-builder", label: "Campaign Builder", icon: Megaphone },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 flex w-[220px] flex-col bg-surface-card border-r border-surface-border">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-400">
          <span className="text-sm font-bold text-surface-base">I</span>
        </div>
        <span className="text-base font-bold tracking-tight text-white">IMPIRICUS</span>
      </div>

      {/* Navigation */}
      <nav className="mt-2 flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href === "/dashboard" && pathname?.startsWith("/hcp")) ||
            (item.href === "/dashboard" && pathname === "/");

          return (
            <Link
              key={item.href}
              href={item.href === "/virtual-coordinator" ? "/dashboard" : item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-400 text-surface-base"
                  : "text-gray-400 hover:bg-surface-hover hover:text-gray-200"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Neural Nexus graphic placeholder */}
      <div className="mx-4 mb-4 rounded-xl bg-surface-elevated p-4">
        <div className="flex flex-col items-center">
          <div className="relative mb-3 h-24 w-24">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-400/30 via-purple-500/20 to-rose-500/20 blur-lg" />
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-brand-400/60 via-cyan-500/40 to-purple-500/30" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-brand-300/50 via-brand-400/40 to-purple-400/20 backdrop-blur-sm" />
          </div>
          <p className="text-sm font-semibold text-white">Ion Neural Nexus</p>
          <p className="text-xs text-gray-500">Placeholder Copy</p>
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-surface-border px-3 py-3 space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-surface-hover hover:text-gray-200 transition-colors"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        <Link
          href="/support"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-surface-hover hover:text-gray-200 transition-colors"
        >
          <HelpCircle className="h-4 w-4" />
          Support
        </Link>
      </div>

      {/* User profile */}
      <div className="border-t border-surface-border px-3 py-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-surface-hover transition-colors">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-400/20 text-brand-400 text-xs font-bold">
            MG
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-white">Mike Gelber</p>
            <p className="text-xs text-gray-500 truncate">Mike.Gelber@impiricus.com</p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
        </button>
      </div>
    </aside>
  );
}
