"use client";

import { FlaskConical, X } from "lucide-react";

interface DemoBannerProps {
  onReset: () => void;
  profileCount: number;
}

export function DemoBanner({ onReset, profileCount }: DemoBannerProps) {
  return (
    <div className="bg-amber-500 text-amber-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm font-medium">
          <FlaskConical className="h-4 w-4" />
          <span>
            Demo Mode — Viewing {profileCount.toLocaleString()} synthetic HCP profiles. Data is not
            real.
          </span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 rounded-md bg-amber-600 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-700 transition-colors"
        >
          <X className="h-3 w-3" />
          Exit Demo
        </button>
      </div>
    </div>
  );
}
