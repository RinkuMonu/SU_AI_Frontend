"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  Unlink,
  Link as LinkIcon,
  Clock,
} from "lucide-react";
import { InstagramIcon, FacebookIcon, LinkedInIcon } from "@/components/social/SocialIcons";
import {
  influencerSocialService,
  PlatformKey,
  SocialPlatformInfo,
} from "@/services/influencer-social.service";

interface InfluencerSocialConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  onRefreshProfile?: () => void;
}

interface PlatformEntry {
  key: PlatformKey;
  name: string;
  subtitle: string;
  colorBorder: string;
  icon: React.ReactNode;
}

const PLATFORMS: PlatformEntry[] = [
  {
    key: "instagram",
    name: "Instagram",
    subtitle: "Sync Reels, Posts, and Audience Engagement",
    colorBorder: "border-pink-500/30 hover:border-pink-500/60",
    icon: <InstagramIcon className="w-6 h-6" />,
  },
  {
    key: "facebook",
    name: "Facebook",
    subtitle: "Link Creator Page and Community Follower Reach",
    colorBorder: "border-blue-500/30 hover:border-blue-500/60",
    icon: <FacebookIcon className="w-6 h-6" />,
  },
  {
    key: "linkedin",
    name: "LinkedIn",
    subtitle: "Qualify for High-Ticket B2B & Executive Brand Deals",
    colorBorder: "border-sky-500/30 hover:border-sky-500/60",
    icon: <LinkedInIcon className="w-6 h-6" />,
  },
];

export function InfluencerSocialConnectionModal({
  isOpen,
  onClose,
  userId,
  onRefreshProfile,
}: InfluencerSocialConnectionModalProps) {
  const [platformStatus, setPlatformStatus] = useState<Record<PlatformKey, SocialPlatformInfo>>({
    instagram: { platform: "instagram", status: "NOT_CONNECTED", is_verified: false, verification_method: "none" },
    facebook: { platform: "facebook", status: "NOT_CONNECTED", is_verified: false, verification_method: "none" },
    linkedin: { platform: "linkedin", status: "NOT_CONNECTED", is_verified: false, verification_method: "none" },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [disconnectingPlatform, setDisconnectingPlatform] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const res = await influencerSocialService.getStatus();
      if (res && res.platforms) {
        setPlatformStatus({
          instagram: res.platforms.instagram || { platform: "instagram", status: "NOT_CONNECTED", is_verified: false, verification_method: "none" },
          facebook: res.platforms.facebook || { platform: "facebook", status: "NOT_CONNECTED", is_verified: false, verification_method: "none" },
          linkedin: res.platforms.linkedin || { platform: "linkedin", status: "NOT_CONNECTED", is_verified: false, verification_method: "none" },
        });
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen, fetchStatus]);

  // Connect platform via official OAuth authorization
  const handleConnect = async (platformKey: PlatformKey) => {
    setConnectingPlatform(platformKey);
    setErrorMessage(null);

    try {
      const authUrl = await influencerSocialService.getConnectUrl(platformKey);
      if (authUrl) {
        // Redirect creator to official OAuth login / consent screen
        window.location.href = authUrl;
      } else {
        throw new Error(`Failed to retrieve connect URL for ${platformKey}`);
      }
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.detail ||
          err?.message ||
          `Unable to initiate ${platformKey} connection. Please try again.`
      );
      setConnectingPlatform(null);
    }
  };

  // Disconnect platform
  const handleDisconnect = async (platformKey: PlatformKey) => {
    setDisconnectingPlatform(platformKey);
    setErrorMessage(null);

    try {
      await influencerSocialService.disconnect(platformKey);
      await fetchStatus();
      if (onRefreshProfile) onRefreshProfile();
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.detail ||
          err?.message ||
          `Failed to disconnect ${platformKey}.`
      );
    } finally {
      setDisconnectingPlatform(null);
    }
  };

  // Skip for later: remember dismissal in localStorage and backend so it does NOT reopen on refresh
  const handleSkipForLater = async () => {
    if (typeof window !== "undefined") {
      const storageKey = userId
        ? `influencer_social_popup_dismissed_${userId}`
        : "influencer_social_popup_dismissed";
      localStorage.setItem(storageKey, "true");
    }
    // Also notify backend
    influencerSocialService.dismissPrompt().catch(() => {});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0B132B] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(190,50,255,0.25)] text-white space-y-5 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-20 bg-gradient-to-b from-[#BE32FF]/30 to-transparent blur-3xl pointer-events-none -z-0" />

        {/* Modal Header */}
        <div className="flex items-start justify-between relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#BE32FF]/20 to-[#EC4899]/20 border border-[#BE32FF]/40 text-[#d87aff] text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#BE32FF]" />
              <span>Creator Onboarding Completed</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight pt-1">
              Connect Your Social Platforms
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Link your channels to display genuine metrics and qualify for verified brand collaborations.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSkipForLater}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Notice */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="flex-1">{errorMessage}</span>
          </div>
        )}

        {/* Platforms List (Instagram, Facebook, LinkedIn ONLY) */}
        <div className="space-y-3 relative z-10">
          {PLATFORMS.map((p) => {
            const item = platformStatus[p.key];
            const isVerified = Boolean(item && item.is_verified && item.verification_method === "oauth");
            const isConnected = Boolean(item && (item.status === "VERIFIED" || item.platform_account_id));
            const isConnecting = connectingPlatform === p.key;
            const isDisconnecting = disconnectingPlatform === p.key;

            return (
              <div
                key={p.key}
                className={`p-3.5 sm:p-4 rounded-2xl bg-[#071023] border ${p.colorBorder} transition-all flex items-center justify-between gap-3`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0">{p.icon}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{p.name}</h4>
                      {isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Verified OAuth</span>
                        </span>
                      ) : isConnected ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                          <LinkIcon className="w-3 h-3 text-blue-400" />
                          <span>Connected</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-700/30 text-slate-400 border border-white/10">
                          <Clock className="w-3 h-3" />
                          <span>Not Linked</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {isVerified && item.platform_username
                        ? `@${item.platform_username}`
                        : item.display_name
                        ? item.display_name
                        : p.subtitle}
                    </p>
                  </div>
                </div>

                {/* Platform Action Button */}
                <div className="shrink-0">
                  {isConnected ? (
                    <button
                      type="button"
                      disabled={isDisconnecting}
                      onClick={() => handleDisconnect(p.key)}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isDisconnecting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Unlink className="w-3.5 h-3.5" />
                      )}
                      <span>Disconnect</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isConnecting || isLoading}
                      onClick={() => handleConnect(p.key)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#BE32FF] to-[#EC4899] hover:opacity-95 text-white text-xs font-bold shadow-[0_0_15px_rgba(190,50,255,0.35)] flex items-center gap-1.5 transition-all hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
                    >
                      {isConnecting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Connecting...</span>
                        </>
                      ) : (
                        <>
                          <span>Connect</span>
                          <ExternalLink className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust & Verification Guarantee */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2.5 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-[11px] text-slate-300">
            DhandaGrow uses direct platform OAuth. We never store your passwords or post without your explicit permission.
          </span>
        </div>

        {/* Footer: Skip for Later & Dashboard Action */}
        <div className="flex items-center justify-between pt-1 relative z-10 border-t border-white/10">
          <button
            type="button"
            onClick={handleSkipForLater}
            className="text-xs text-slate-400 hover:text-white font-medium underline underline-offset-4 cursor-pointer transition-colors"
          >
            Skip for Later
          </button>

          <button
            type="button"
            onClick={handleSkipForLater}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/15 transition-all cursor-pointer"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
