"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Palette, 
  Type, 
  MessageSquare, 
  Loader2, 
  ChevronRight,
  ShieldCheck,
  Building2
} from "lucide-react";
import { getBrandKit } from "@/services/brand.service";
import { businessService } from "@/services/business.service";
import { BrandKit } from "@/types/brand";
import { Business } from "@/types";
import { isBrandKitComplete } from "@/lib/brand-kit";
import { useAuth } from "@/components/auth/AuthProvider";

export interface BrandKitToggleCardProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  onBrandKitLoaded?: (brandKit: BrandKit | null, isComplete: boolean) => void;
  compact?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

export function BrandKitToggleCard({
  enabled,
  onChange,
  onBrandKitLoaded,
  compact = false,
  title = "Use My Brand Kit",
  description = "Automatically apply your brand's colors, typography, tone, and logo to this generation.",
  className = "",
}: BrandKitToggleCardProps) {
  const { user } = useAuth();
  const [brandKit, setBrandKit] = useState<BrandKit | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const mountedRef = useRef(true);
  const lastUserIdRef = useRef<string | undefined>(user?.id);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Fetch Brand Kit whenever enabled becomes true or user changes
  useEffect(() => {
    // Reset if user changed
    if (user?.id !== lastUserIdRef.current) {
      lastUserIdRef.current = user?.id;
      setBrandKit(null);
      setBusiness(null);
      setHasLoaded(false);
    }

    if (!enabled && hasLoaded) {
      return;
    }

    let isSubscribed = true;

    async function loadData() {
      setIsLoading(true);
      setFetchError(null);
      try {
        const [brandRes, bizRes] = await Promise.allSettled([
          getBrandKit(),
          businessService.getMyBusiness(),
        ]);

        if (!isSubscribed || !mountedRef.current) return;

        const loadedBrand = brandRes.status === "fulfilled" ? brandRes.value : null;
        const loadedBiz = bizRes.status === "fulfilled" ? bizRes.value : null;

        setBrandKit(loadedBrand);
        setBusiness(loadedBiz);
        setHasLoaded(true);

        const loadedPresence =
          (typeof window !== "undefined"
            ? localStorage.getItem("business_online_presence") || sessionStorage.getItem("business_online_presence")
            : null) ||
          (user as any)?.online_presence ||
          (user as any)?.business_online_presence ||
          (loadedBiz as any)?.online_presence ||
          (loadedBiz as any)?.business_online_presence ||
          "";

        const isPresenceLinked =
          loadedPresence === "website" ||
          loadedPresence === "google_maps" ||
          loadedPresence === "marketplace" ||
          loadedPresence === "b2b" ||
          Boolean(loadedBiz?.website) ||
          Boolean((user as any)?.google_maps_url) ||
          Boolean((loadedBiz as any)?.google_maps_url);

        const complete = isBrandKitComplete(loadedBrand, loadedBiz) || isPresenceLinked;
        if (onBrandKitLoaded) {
          onBrandKitLoaded(loadedBrand, complete);
        }
      } catch (err: any) {
        if (!isSubscribed || !mountedRef.current) return;
        console.warn("Failed to load Brand Kit:", err);
        setFetchError("Unable to load Brand Kit details.");
        if (onBrandKitLoaded) {
          onBrandKitLoaded(null, false);
        }
      } finally {
        if (isSubscribed && mountedRef.current) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isSubscribed = false;
    };
  }, [enabled, user?.id]);

  // Online presence detection (website, google_maps, marketplace, b2b)
  const currentPresence =
    (typeof window !== "undefined"
      ? localStorage.getItem("business_online_presence") || sessionStorage.getItem("business_online_presence")
      : null) ||
    (user as any)?.online_presence ||
    (user as any)?.business_online_presence ||
    (business as any)?.online_presence ||
    "";

  const isOnlinePresenceLinked =
    currentPresence === "website" ||
    currentPresence === "google_maps" ||
    currentPresence === "marketplace" ||
    currentPresence === "b2b" ||
    Boolean(business?.website) ||
    Boolean((user as any)?.google_maps_url) ||
    Boolean((business as any)?.google_maps_url);

  // Fallbacks from business profile / user / onboarding cached data
  const cachedBrandPrefs = typeof window !== "undefined" ? (() => {
    try {
      const stored = sessionStorage.getItem("brand_preferences_data") || localStorage.getItem("brand_preferences_data");
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  })() : null;

  const complete = isBrandKitComplete(brandKit, business) || isOnlinePresenceLinked;
  const effectiveBusinessName =
    brandKit?.business_name ||
    business?.name ||
    user?.businessName ||
    user?.name ||
    "My Brand";

  const primaryColor =
    brandKit?.primary_color ||
    cachedBrandPrefs?.palette?.[0] ||
    (business as any)?.brand_colors?.[0] ||
    "#8B5CF6";

  const secondaryColor =
    brandKit?.secondary_color ||
    cachedBrandPrefs?.palette?.[1] ||
    (business as any)?.brand_colors?.[1] ||
    "#EC4899";

  const accentColor =
    brandKit?.accent_color ||
    cachedBrandPrefs?.palette?.[2] ||
    (business as any)?.brand_colors?.[2] ||
    "#F59E0B";

  const effectiveLogoUrl =
    brandKit?.logo_url ||
    (business as any)?.logo_url ||
    (user as any)?.businessLogo ||
    (user as any)?.avatar ||
    (typeof window !== "undefined" ? sessionStorage.getItem("brand_kit_logo") : null);

  const fontName =
    brandKit?.font ||
    (typeof window !== "undefined" ? sessionStorage.getItem("selected_font") : null) ||
    "Inter";

  const toneName =
    brandKit?.tone ||
    (cachedBrandPrefs?.tones ? cachedBrandPrefs.tones.join(", ") : "Professional");

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        enabled
          ? "bg-[#0b1630] border-brand-purple/40 shadow-lg shadow-purple-500/10 ring-1 ring-brand-purple/20"
          : "bg-surface/80 border-border hover:border-border/80"
      } ${className}`}
    >
      {/* Top Banner Row */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-inner ${
              enabled
                ? "bg-gradient-to-tr from-brand-purple to-pink-500 text-white shadow-purple-500/30"
                : "bg-surface border border-border text-text-muted"
            }`}
          >
            <Sparkles className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="font-semibold text-white text-base tracking-tight">
                {title}
              </h3>
              {enabled && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    complete
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {complete ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" /> Brand Style Applied
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3 h-3" /> Setup Needed
                    </>
                  )}
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted mt-0.5 leading-normal">
              {description}
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            {enabled ? (
              <span className="text-brand-purple font-bold">ON</span>
            ) : (
              <span>OFF</span>
            )}
          </span>

          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-label="Toggle Brand Kit auto-apply"
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-[#070e20] ${
              enabled ? "bg-brand-purple" : "bg-slate-700/60"
            }`}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                enabled ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Expanded Details when Enabled */}
      {enabled && (
        <div className="border-t border-border/60 bg-[#081125]/90 px-4 py-4 sm:px-5 sm:py-4 transition-all">
          {isLoading && !hasLoaded ? (
            <div className="flex items-center justify-center py-4 gap-3 text-text-muted text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-brand-purple" />
              <span>Fetching your saved Brand Kit settings...</span>
            </div>
          ) : complete ? (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              {/* Brand Summary Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface/60 border border-border/80 rounded-xl p-3 sm:p-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  {effectiveLogoUrl ? (
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={effectiveLogoUrl}
                        alt={effectiveBusinessName}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-brand-purple/40 to-pink-500/40 border border-brand-purple/30 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {effectiveBusinessName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm truncate">
                        {effectiveBusinessName}
                      </span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>
                    <p className="text-[11px] text-text-muted truncate">
                      {brandKit?.business_category ||
                        brandKit?.business_type ||
                        (business as any)?.category ||
                        "Business Identity Active"}
                    </p>
                  </div>
                </div>

                {/* View / Edit Brand Kit Action */}
                <Link
                  href="/brand"
                  className="inline-flex items-center gap-1.5 text-xs text-brand-purple hover:text-purple-300 font-semibold self-start sm:self-auto hover:underline px-2.5 py-1 rounded-lg bg-brand-purple/10 border border-brand-purple/20 transition-colors"
                >
                  <span>View Brand Kit</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Color Swatches & Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                {/* Colors */}
                <div className="p-2.5 rounded-xl bg-surface/40 border border-border/60 flex items-center justify-between gap-2">
                  <span className="text-text-muted font-medium flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-brand-purple" />
                    Colors
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-4 h-4 rounded-full border border-white/30 shadow-sm"
                      style={{ backgroundColor: primaryColor }}
                      title={`Primary: ${primaryColor}`}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-white/30 shadow-sm"
                      style={{ backgroundColor: secondaryColor }}
                      title={`Secondary: ${secondaryColor}`}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-white/30 shadow-sm"
                      style={{ backgroundColor: accentColor }}
                      title={`Accent: ${accentColor}`}
                    />
                    <span className="text-[10px] text-text-muted font-mono ml-1">
                      {primaryColor}
                    </span>
                  </div>
                </div>

                {/* Typography */}
                <div className="p-2.5 rounded-xl bg-surface/40 border border-border/60 flex items-center justify-between gap-2">
                  <span className="text-text-muted font-medium flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-pink-400" />
                    Typography
                  </span>
                  <span className="font-semibold text-white truncate max-w-[120px]">
                    {fontName}
                  </span>
                </div>

                {/* Tone / Voice */}
                <div className="p-2.5 rounded-xl bg-surface/40 border border-border/60 flex items-center justify-between gap-2">
                  <span className="text-text-muted font-medium flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    Brand Tone
                  </span>
                  <span className="font-semibold text-white capitalize truncate max-w-[120px]">
                    {toneName}
                  </span>
                </div>
              </div>

              {/* Reassurance text */}
              <p className="text-[11px] text-emerald-400/90 flex items-center gap-1.5 pt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {isOnlinePresenceLinked
                    ? "Brand style from your business profile is automatically applied to generation."
                    : "Saved colors, logo, font, and brand voice will be automatically applied to generation."}
                </span>
              </p>
            </div>
          ) : (
            /* Incomplete or Missing Brand Kit for paths that require manual setup */
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3.5 space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h4 className="font-bold text-amber-300">
                    No Complete Brand Kit Found
                  </h4>
                  <p className="text-amber-200/80 mt-0.5 leading-relaxed">
                    Set up your business name, brand colors, typography, and logo to enable 1-click automatic brand alignment.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-amber-500/20">
                <span className="text-[11px] text-text-muted">
                  Manual customization controls below will be used in the meantime.
                </span>
                <Link
                  href="/brand"
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-white bg-amber-500/20 hover:bg-amber-500/30 px-3 py-1 rounded-lg border border-amber-500/30 transition-colors"
                >
                  <span>Complete Brand Kit</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
