"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  X, 
  Minimize2, 
  Maximize2,
  ArrowRight,
  ShieldCheck,
  Palette
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getBrandKit } from "@/services/brand.service";
import { businessService } from "@/services/business.service";
import { calculateBrandKitCompletion, BrandKitProgress } from "@/lib/brand-kit";
import { normalizeRole } from "@/lib/role-routing";

export function BrandKitCompletionNotification() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [progress, setProgress] = useState<BrandKitProgress | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchStatus = async () => {
    if (isLoading || !user) return;
    const role = normalizeRole(user.role);
    if (role !== "businessman") return;

    // Check online presence from local cache, session storage, or user profile
    const presence =
      (typeof window !== "undefined"
        ? localStorage.getItem("business_online_presence") || sessionStorage.getItem("business_online_presence")
        : null) ||
      (user as any)?.online_presence ||
      (user as any)?.business_online_presence ||
      "";

    // RULE: Website, Google Maps, Marketplace, and Wholesale/B2B users
    // do NOT show the Brand Kit completion popup. Business info is already available.
    if (presence && presence !== "none") {
      setProgress(null);
      return;
    }

    try {
      const [brandRes, bizRes] = await Promise.allSettled([
        getBrandKit(),
        businessService.getMyBusiness(),
      ]);

      const brand = brandRes.status === "fulfilled" ? brandRes.value : null;
      const biz = bizRes.status === "fulfilled" ? bizRes.value : null;

      // Re-verify online presence from fetched business record if not in local storage
      const resolvedPresence =
        presence ||
        (biz as any)?.online_presence ||
        (biz as any)?.business_online_presence ||
        (biz?.website ? "website" : "") ||
        ((biz as any)?.google_maps_url || (user as any)?.google_maps_url ? "google_maps" : "") ||
        "";

      if (resolvedPresence && resolvedPresence !== "none") {
        setProgress(null);
        return;
      }

      const calc = calculateBrandKitCompletion(brand, biz);
      setProgress(calc);
    } catch (err) {
      console.warn("Failed to calculate brand kit completion", err);
    }
  };

  useEffect(() => {
    fetchStatus();

    const handleUpdate = () => {
      fetchStatus();
    };

    window.addEventListener("brandkit:updated", handleUpdate);
    window.addEventListener("brandkit:completed", handleUpdate);

    return () => {
      window.removeEventListener("brandkit:updated", handleUpdate);
      window.removeEventListener("brandkit:completed", handleUpdate);
    };
  }, [user?.id, isLoading]);

  // Check online presence directly before rendering
  const activePresence =
    (typeof window !== "undefined"
      ? localStorage.getItem("business_online_presence") || sessionStorage.getItem("business_online_presence")
      : null) ||
    (user as any)?.online_presence ||
    (user as any)?.business_online_presence ||
    ((user as any)?.google_maps_url ? "google_maps" : "") ||
    "";

  // Do not show on public auth pages, on the dedicated /brand page itself,
  // or for any user whose online presence is Website, Google Maps, Marketplace, or Wholesale/B2B
  if (!isMounted || isLoading || !user || isDismissed) return null;
  if (activePresence && activePresence !== "none") return null;
  if (pathname === "/brand" || pathname.startsWith("/login") || pathname.startsWith("/register")) return null;
  if (!progress || progress.percentage >= 100) return null;

  // Minimized Floating Bubble
  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-40 animate-in fade-in zoom-in duration-200">
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-[#0b1630] border border-brand-purple/40 text-white shadow-2xl hover:border-brand-purple transition-all cursor-pointer group"
          title="Click to expand Brand Kit progress"
        >
          <div className="w-6 h-6 rounded-lg bg-brand-purple/20 text-brand-purple flex items-center justify-center">
            <Palette className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">Brand Kit</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-brand-purple text-white">
                {progress.percentage}%
              </span>
            </div>
          </div>
          <Maximize2 className="w-3 h-3 text-text-muted group-hover:text-white ml-1 transition-colors" />
        </button>
      </div>
    );
  }

  // Expanded Floating Notification Panel
  return (
    <div className="fixed bottom-5 right-5 z-40 max-w-sm w-full mx-4 sm:mx-0 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="rounded-2xl border border-brand-purple/40 bg-[#091226]/95 backdrop-blur-xl shadow-2xl p-4 sm:p-4.5 space-y-3.5 text-white ring-1 ring-brand-purple/20">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-purple to-pink-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-purple-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>Brand Kit Setup</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-brand-purple/25 text-brand-purple border border-brand-purple/30">
                  {progress.percentage}%
                </span>
              </h4>
              <p className="text-[11px] text-text-muted truncate">
                Remaining: {progress.remainingPercentage}% to full brand power
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="text-text-muted hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              title="Minimize panel"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="text-text-muted hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              title="Dismiss for this session"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-1">
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-brand-purple via-pink-500 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-medium text-text-muted">
            <span>{progress.completedSections.length} of 4 sections completed</span>
            <span>{progress.percentage}% done</span>
          </div>
        </div>

        {/* Completed & Pending Sections Breakdown */}
        <div className="space-y-1.5 pt-1 border-t border-border/60 text-xs">
          {progress.sections.map((sec) => (
            <div key={sec.id} className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                {sec.completed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                )}
                <span className={sec.completed ? "text-slate-200 font-medium" : "text-text-muted"}>
                  {sec.name}
                </span>
              </div>
              <span className={`text-[10px] font-mono ${sec.completed ? "text-emerald-400 font-bold" : "text-text-muted"}`}>
                {sec.completed ? "Done" : "Pending"}
              </span>
            </div>
          ))}
        </div>

        {/* Action Button: Complete Brand Kit */}
        <div className="pt-1">
          <Link
            href="/brand"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-brand-gradient hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all cursor-pointer"
          >
            <span>Complete Brand Kit</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
