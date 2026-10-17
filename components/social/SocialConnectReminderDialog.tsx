"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  X, 
  Clock, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink,
  BellRing,
  ChevronRight
} from "lucide-react";
import { FacebookService } from "@/services/facebook.service";
import { InstagramService } from "@/services/instagram.service";
import api from "@/lib/api";

// ── Official Brand Icons ───────────────────────────────────────────────────

const FacebookBrandIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#1877F2" />
    <path
      d="M15.117 8.52h-1.808c-.282 0-.603.37-.603.882v1.548h2.411l-.328 2.45h-2.083V20h-2.528v-6.6H8.225v-2.45h1.953V9.395c0-1.895 1.155-2.928 2.85-2.928.812 0 1.512.06 1.716.088v1.965z"
      fill="#ffffff"
    />
  </svg>
);

const InstagramBrandIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ig-grad-dlg" cx="0.3" cy="1" r="1">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig-grad-dlg)" />
    <path
      d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zm5.2-8.4a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z"
      fill="#ffffff"
    />
  </svg>
);

const WhatsAppBrandIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="#25D366" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const SNOOZE_STORAGE_KEY = "su_social_reminder_snooze_until";

export function SocialConnectReminderDialog() {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [fbConnected, setFbConnected] = useState(false);
  const [fbPageName, setFbPageName] = useState("");
  const [igConnected, setIgConnected] = useState(false);
  const [whatsAppConnected, setWhatsAppConnected] = useState(false);
  const [showSnoozeOptions, setShowSnoozeOptions] = useState(false);
  const [snoozeFeedback, setSnoozeFeedback] = useState<string | null>(null);

  const checkTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Check connection status for Facebook, Instagram, and WhatsApp
  const checkStatus = async () => {
    if (typeof window === "undefined") return;

    // Check Facebook
    const fbCreds = FacebookService.getStoredCredentials();
    const isFb = Boolean(
      !fbCreds.isExpired &&
      fbCreds.pageId &&
      (fbCreds.pageAccessToken || fbCreds.userAccessToken)
    );
    setFbConnected(isFb);
    if (fbCreds.pageName) setFbPageName(fbCreds.pageName);

    // Check Instagram
    const igCreds = InstagramService.getStoredCredentials();
    const isIg = Boolean(igCreds.accountId || igCreds.accessToken);
    setIgConnected(isIg);

    // Check WhatsApp
    const waPhone = localStorage.getItem("whatsapp_phone_id");
    const waToken = localStorage.getItem("whatsapp_token");
    let isWa = Boolean(waPhone && waToken);
    setWhatsAppConnected(isWa);

    // Also fetch fresh backend status safely
    try {
      const res = await api.get("/api/v1/businesses/me");
      if (res.data) {
        if (res.data.fb_connected || (res.data.fb_page_id && res.data.fb_access_token)) {
          setFbConnected(true);
        }
        if (res.data.ig_connected || (res.data.ig_account_id && res.data.ig_access_token)) {
          setIgConnected(true);
        }
        if (res.data.whatsapp_connected || (res.data.whatsapp_phone_id && res.data.whatsapp_token)) {
          setWhatsAppConnected(true);
        }
      }
    } catch {
      // Backend request fallback is quiet
    }

    return isFb;
  };

  // 2. Evaluate whether to show the reminder dialog
  const evaluateReminder = async () => {
    // If user is already on social platforms settings page, don't obstruct them!
    if (pathname && pathname.startsWith("/social-platforms")) {
      setIsOpen(false);
      return;
    }

    const isFb = await checkStatus();

    // If Facebook is already connected, do not show
    if (isFb) {
      setIsOpen(false);
      return;
    }

    // Check snooze timestamp in localStorage
    const snoozeUntil = localStorage.getItem(SNOOZE_STORAGE_KEY);
    if (snoozeUntil) {
      const snoozeTime = Number(snoozeUntil);
      if (Date.now() < snoozeTime) {
        setIsOpen(false);
        return;
      }
    }

    // If not connected and not snoozed, open dialog!
    setIsOpen(true);
  };

  useEffect(() => {
    // Polite initial delay (1.2 seconds) so dashboard loads smoothly before dialog prompts
    const initialTimer = setTimeout(() => {
      evaluateReminder();
    }, 1200);

    // Check periodically every 5 minutes ("baar baar remind me")
    checkTimerRef.current = setInterval(() => {
      evaluateReminder();
    }, 5 * 60 * 1000);

    return () => {
      clearTimeout(initialTimer);
      if (checkTimerRef.current) clearInterval(checkTimerRef.current);
    };
  }, [pathname]);

  // Handle Snooze / Remind Me Later
  const handleSnooze = (durationMinutes: number, label: string) => {
    const snoozeUntil = Date.now() + durationMinutes * 60 * 1000;
    localStorage.setItem(SNOOZE_STORAGE_KEY, String(snoozeUntil));
    setSnoozeFeedback(`Reminder snoozed for ${label}`);

    setTimeout(() => {
      setSnoozeFeedback(null);
      setShowSnoozeOptions(false);
      setIsOpen(false);
    }, 800);
  };

  const handleDismissDefault = () => {
    // Default 15-minute snooze when user clicks X or standard Dismiss
    handleSnooze(15, "15 minutes");
  };

  const handleNavigate = (path: string) => {
    // Quick snooze so it doesn't immediately reappear during transition
    handleSnooze(30, "30 minutes");
    router.push(path);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-lg bg-gradient-to-b from-[#111728] via-[#0d1222] to-[#080b15] border border-blue-500/30 rounded-2xl shadow-2xl shadow-blue-950/60 overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Top vibrant glowing accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 via-pink-500 to-emerald-400" />

        {/* Close Button */}
        <button
          onClick={handleDismissDefault}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 hover:border-white/20 transition-all cursor-pointer"
          title="Remind me later"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-7 space-y-5">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="relative p-3 rounded-2xl bg-gradient-to-tr from-blue-600/25 to-indigo-600/20 border border-blue-500/40 shadow-lg shadow-blue-500/20 shrink-0">
              <FacebookBrandIcon className="w-8 h-8" />
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-amber-500 text-black shadow">
                <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 border border-amber-500/30 text-amber-400">
                  Required Action
                </span>
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <BellRing className="w-3 h-3 text-blue-400" /> Reminder
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                Please Connect Facebook & Social Accounts
              </h2>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                Your Facebook Page is not connected yet. Connect Facebook, Instagram, and WhatsApp to automate your AI posting, reels, and product promotions!
              </p>
            </div>
          </div>

          {/* Social Platforms Status Cards */}
          <div className="space-y-2.5 pt-1">
            {/* 1. Facebook Card */}
            <div className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
              fbConnected
                ? "bg-emerald-950/20 border-emerald-500/30 text-white"
                : "bg-surface-elevated/70 border-blue-500/30 hover:border-blue-400/50 shadow-sm"
            }`}>
              <div className="flex items-center gap-3 min-w-0">
                <FacebookBrandIcon className="w-6 h-6 shrink-0" />
                <div className="truncate">
                  <div className="font-semibold text-sm text-white flex items-center gap-2">
                    Facebook Page
                    {fbConnected ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Connected
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Not Connected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {fbConnected ? (fbPageName ? `Page: ${fbPageName}` : "Active connection") : "Required to auto-publish AI posts & reels"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleNavigate("/social-platforms/facebook")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0 transition-all cursor-pointer ${
                  fbConnected
                    ? "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30"
                }`}
              >
                {fbConnected ? "Manage" : "Connect"}
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2. Instagram Card */}
            <div className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
              igConnected
                ? "bg-emerald-950/20 border-emerald-500/30 text-white"
                : "bg-surface-elevated/70 border-pink-500/30 hover:border-pink-400/50 shadow-sm"
            }`}>
              <div className="flex items-center gap-3 min-w-0">
                <InstagramBrandIcon className="w-6 h-6 shrink-0" />
                <div className="truncate">
                  <div className="font-semibold text-sm text-white flex items-center gap-2">
                    Instagram Account
                    {igConnected ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Connected
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                        Not Connected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {igConnected ? "Connected for auto-reels & posts" : "Publish reels & feed posts via Meta Graph"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleNavigate("/social-platforms/instagram")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0 transition-all cursor-pointer ${
                  igConnected
                    ? "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30"
                    : "bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white shadow-md shadow-pink-600/30"
                }`}
              >
                {igConnected ? "Manage" : "Connect"}
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3. WhatsApp Card */}
            <div className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
              whatsAppConnected
                ? "bg-emerald-950/20 border-emerald-500/30 text-white"
                : "bg-surface-elevated/70 border-emerald-500/30 hover:border-emerald-400/50 shadow-sm"
            }`}>
              <div className="flex items-center gap-3 min-w-0">
                <WhatsAppBrandIcon className="w-6 h-6 shrink-0" />
                <div className="truncate">
                  <div className="font-semibold text-sm text-white flex items-center gap-2">
                    WhatsApp Business
                    {whatsAppConnected ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Connected
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                        Not Connected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {whatsAppConnected ? "Connected for instant customer reach" : "Broadcast AI promotions directly on WhatsApp"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleNavigate("/social-platforms/whatsapp")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0 transition-all cursor-pointer ${
                  whatsAppConnected
                    ? "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30"
                }`}
              >
                {whatsAppConnected ? "Manage" : "Connect"}
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Feedback banner if snooze clicked */}
          {snoozeFeedback && (
            <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-center text-xs text-blue-300 font-medium animate-in fade-in">
              <Clock className="w-3.5 h-3.5 inline mr-1 text-blue-400" />
              {snoozeFeedback}
            </div>
          )}

          {/* Actions & Remind Me Controls */}
          <div className="space-y-3 pt-2 border-t border-border/50">
            {/* Primary Main Button */}
            <button
              type="button"
              onClick={() => handleNavigate("/social-platforms/facebook")}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FacebookBrandIcon className="w-4 h-4" />
              <span>Connect Facebook Now</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            {/* Remind Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
              {/* Remind Me Later dropdown / toggle */}
              <div className="relative w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowSnoozeOptions(!showSnoozeOptions)}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>Remind Me Later</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showSnoozeOptions ? "rotate-90" : ""}`} />
                </button>

                {showSnoozeOptions && (
                  <div className="mt-1.5 sm:absolute sm:bottom-full sm:left-0 mb-1 w-full sm:w-48 p-1.5 rounded-xl bg-[#161c2e] border border-blue-500/30 shadow-xl z-20 space-y-1 animate-in fade-in zoom-in-95">
                    <button
                      type="button"
                      onClick={() => handleSnooze(15, "15 minutes")}
                      className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>In 15 minutes</span>
                      <span className="text-[10px] text-gray-400">15m</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSnooze(60, "1 hour")}
                      className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>In 1 hour</span>
                      <span className="text-[10px] text-gray-400">1h</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSnooze(24 * 60, "24 hours")}
                      className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>Tomorrow</span>
                      <span className="text-[10px] text-gray-400">24h</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Text Button: Remind me in 30 minutes / dismiss */}
              <button
                type="button"
                onClick={() => handleSnooze(30, "30 minutes")}
                className="text-xs text-gray-400 hover:text-blue-300 underline underline-offset-4 transition-colors cursor-pointer"
              >
                Remind me in 30 minutes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
