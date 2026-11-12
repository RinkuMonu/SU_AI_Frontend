"use client";

import { usePathname } from "next/navigation";
import { getPageMeta } from "@/config/pageDescriptions";
import { Info, Sparkles } from "lucide-react";
import { isMobileViewport, startDashboardTour } from "@/components/tour/DashboardTour";

interface PageHeaderDescriptionProps {
  customTitle?: string;
  customDescription?: string;
  showTourButton?: boolean;
  className?: string;
}

export function PageHeaderDescription({
  customTitle,
  customDescription,
  showTourButton,
  className = "",
}: PageHeaderDescriptionProps) {
  const pathname = usePathname();
  const meta = getPageMeta(pathname);

  const title = customTitle || meta.name;
  const description = customDescription || meta.shortDescription;
  const isDashboard = pathname === "/dashboard" || pathname === "/";
  const shouldShowTour = showTourButton !== undefined ? showTourButton : isDashboard;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#0E1528]/90 via-[#120F24]/90 to-[#0A0D1A]/90 p-4 sm:p-5 backdrop-blur-xl shadow-lg ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {title}
              </h2>
              {meta.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {meta.badge}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-300/90 mt-1 max-w-3xl leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {shouldShowTour && !isMobileViewport() && (
          <button
            type="button"
            onClick={() => startDashboardTour()}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/50 hover:to-pink-600/50 border border-purple-400/40 text-purple-200 text-xs font-semibold shadow-md transition-all cursor-pointer shrink-0"
            title="Start Interactive Tour Guide"
          >
            <span className="text-sm">🎯</span>
            <span>Tour Guide</span>
          </button>
        )}
      </div>
    </div>
  );
}

