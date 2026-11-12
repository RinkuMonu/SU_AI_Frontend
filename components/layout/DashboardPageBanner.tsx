"use client";

import { usePathname } from "next/navigation";
import { getPageMeta } from "@/config/pageDescriptions";
import { Sparkles, Info, X, ChevronRight, Compass } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { isMobileViewport, startDashboardTour } from "@/components/tour/DashboardTour";

export function DashboardPageBanner() {
  const pathname = usePathname();
  const [dismissedPages, setDismissedPages] = useState<Record<string, boolean>>({});

  // Reset or check dismissal on path change
  const isDashboard = pathname === "/dashboard" || pathname === "/";
  const meta = getPageMeta(pathname);

  // If on main dashboard, the dashboard already has its dedicated hero greeting
  if (isDashboard) {
    return null;
  }

  const isDismissed = dismissedPages[meta.path];
  if (isDismissed) {
    return null;
  }

  return (
    <div className="mb-6 relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-r from-[#0d1326]/95 via-[#130f26]/95 to-[#0b0e1c]/95 p-4 sm:p-5 backdrop-blur-xl shadow-lg animate-in fade-in slide-in-from-top-1 duration-300">
      {/* Subtle top glow line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 shrink-0 mt-0.5 shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-400">
                {meta.category}
              </span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {meta.name}
              </h1>
              {meta.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {meta.badge}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-300/90 mt-1 max-w-3xl leading-relaxed">
              {meta.shortDescription}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {!isMobileViewport() && (
            <Link
              href="/dashboard"
              onClick={() => {
                setTimeout(() => {
                  startDashboardTour();
                }, 400);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-200 text-xs font-semibold shadow-xs transition-all cursor-pointer"
              title="Go to Dashboard & Start Tour Guide"
            >
              <Compass className="w-3.5 h-3.5 text-purple-400" />
              <span>Dashboard Tour</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setDismissedPages((prev) => ({ ...prev, [meta.path]: true }))}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            title="Dismiss description banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

