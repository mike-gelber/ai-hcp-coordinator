"use client";

import { FlaskConical, X } from "lucide-react";

interface DemoBannerProps {
  onReset: () => void;
  profileCount: number;
}

export function DemoBanner({ onReset, profileCount }: DemoBannerProps) {
  return (
    <div className="bg-brand-400/10 border-b border-brand-400/20">
      <div className="flex items-center justify-between px-6 py-2">
        <div className="flex items-center gap-2 text-sm font-medium text-brand-400">
          <FlaskConical className="h-4 w-4" />
          <span>
            Demo Mode — Viewing {profileCount.toLocaleString()} synthetic HCP profiles. Data is not
            real.
          </span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 rounded-md bg-brand-400/20 px-3 py-1 text-xs font-semibold text-brand-400 hover:bg-brand-400/30 transition-colors"
        >
          <X className="h-3 w-3" />
          Exit Demo
        </button>
      </div>
    </div>
  );
}
