"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Globe,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Loader2,
  Trash2,
  RefreshCw,
  PlusCircle,
  UserPlus,
  Settings,
} from "lucide-react";
import { InstagramIcon, FacebookIcon, LinkedInIcon } from "@/components/social/SocialIcons";
import { CreateAccountModal } from "@/components/social/CreateAccountModal";
import { socialService, SocialPlatformStatusItem } from "@/services/social.service";
import { businessService } from "@/services/business.service";
import { evaluatePlatformConnections, PlatformConnectionState, SocialPlatformKey, PLATFORM_CONFIGS } from "@/lib/social-connectivity";

export default function SocialPlatformsOverviewPage() {
  const [connectionState, setConnectionState] = useState<PlatformConnectionState>({
    instagram: false,
    facebook: false,
    linkedin: false,
    connectedCount: 0,
    hasAtLeastOne: false,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [connectingPlatform, setConnectingPlatform] = useState<SocialPlatformKey | null>(null);
  const [disconnectingPlatform, setDisconnectingPlatform] = useState<SocialPlatformKey | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState<boolean>(false);

  const fetchStatuses = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [statusRes, bizRes] = await Promise.allSettled([
        socialService.getOnboardingStatus(),
        businessService.getMyBusiness(),
      ]);

      const statusData = statusRes.status === "fulfilled" ? statusRes.value : null;
      const bizData = bizRes.status === "fulfilled" ? bizRes.value : null;

      const calculated = evaluatePlatformConnections(bizData, statusData);
      setConnectionState(calculated);
    } catch (err: any) {
      console.warn("Could not fetch platform statuses", err);
      try {
        const biz = await businessService.getMyBusiness();
        setConnectionState(evaluatePlatformConnections(biz));
      } catch (fallbackErr) {
        setErrorMessage("Unable to fetch social connection statuses. Please check your connection and retry.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  // Handle OAuth return query params
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const igConnected = params.get("instagram_connected") === "true";
    const fbConnected = params.get("facebook_connected") === "true";
    const liConnected = params.get("linkedin_connected") === "true";

    const err = params.get("error") || params.get("error_description") || params.get("linkedin_error") || params.get("instagram_error");

    if (igConnected || fbConnected || liConnected) {
      const name = igConnected ? "Instagram" : fbConnected ? "Facebook" : "LinkedIn";
      setSuccessMessage(`${name} account successfully connected!`);
      fetchStatuses();
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (err) {
      setErrorMessage(`Authorization notice: ${decodeURIComponent(err)}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [fetchStatuses]);

  const handleConnect = async (platform: SocialPlatformKey) => {
    if (connectingPlatform) return;
    setConnectingPlatform(platform);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const authUrl = await socialService.getConnectUrl(platform);
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        throw new Error("Unable to obtain authorization URL");
      }
    } catch (err: any) {
      console.error(`Connect error for ${platform}:`, err);
      const detail = err?.response?.data?.detail || err?.message || "Failed to initiate authorization.";
      setErrorMessage(`Failed to connect ${PLATFORM_CONFIGS[platform].name}: ${detail}`);
      setConnectingPlatform(null);
    }
  };

  const handleDisconnect = async (platform: SocialPlatformKey) => {
    const platformName = PLATFORM_CONFIGS[platform].name;
    const confirmPrompt = window.confirm(
      `Are you sure you want to disconnect ${platformName}? Automated publishing to this account will be suspended.`
    );
    if (!confirmPrompt) return;

    setDisconnectingPlatform(platform);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await socialService.disconnect(platform);
      setSuccessMessage(res.message || `${platformName} has been disconnected.`);
      await fetchStatuses();
    } catch (err: any) {
      console.error(`Disconnect error for ${platform}:`, err);
      const detail = err?.response?.data?.detail || err?.message || "Failed to disconnect platform.";
      setErrorMessage(`Unable to disconnect ${platformName}: ${detail}`);
    } finally {
      setDisconnectingPlatform(null);
    }
  };

  const platforms: {
    key: SocialPlatformKey;
    name: string;
    description: string;
    icon: React.ReactNode;
    connected: boolean;
    manageHref: string;
    detailsName?: string | null;
  }[] = [
    {
      key: "instagram",
      name: "Instagram",
      description: "Auto-publish Reels, single images, and carousel posts directly to your Instagram Business account.",
      icon: <InstagramIcon className="w-10 h-10 rounded-xl" />,
      connected: connectionState.instagram,
      manageHref: "/social-platforms/instagram",
      detailsName: connectionState.details?.instagram?.name,
    },
    {
      key: "facebook",
      name: "Facebook",
      description: "Distribute marketing campaigns, posts, and announcements directly to your connected Facebook Page.",
      icon: <FacebookIcon className="w-10 h-10 rounded-xl" />,
      connected: connectionState.facebook,
      manageHref: "/social-platforms/facebook",
      detailsName: connectionState.details?.facebook?.name,
    },
    {
      key: "linkedin",
      name: "LinkedIn",
      description: "Publish professional content, thought leadership, and product launches to your LinkedIn Profile or Company Page.",
      icon: <LinkedInIcon className="w-10 h-10 rounded-xl" />,
      connected: connectionState.linkedin,
      manageHref: "/social-platforms/linkedin",
      detailsName: connectionState.details?.linkedin?.name,
    },
  ];

  return (
    <div 
      style={{ backgroundColor: "#081226", fontFamily: "'Roboto', sans-serif" }} 
      className="-my-6 -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 py-4 h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] overflow-hidden flex flex-col justify-start animate-in fade-in duration-300"
    >
      <div className="max-w-6xl mx-auto w-full space-y-3.5 flex-1 flex flex-col justify-start">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#1e2a4a] pb-3 shrink-0">
          <div>
            <div className="flex items-center gap-3.5">
              {/* Restored pink/purple-to-amber gradient logo matching user uploaded image */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8b5cf6]/25 via-[#ec4899]/20 to-[#f59e0b]/15 border border-[#8b5cf6]/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                <svg 
                  className="w-6 h-6 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <defs>
                    <linearGradient id="globeColorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fb923c" />
                      <stop offset="45%" stopColor="#f43f5e" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                  <circle cx="12" cy="12" r="10" stroke="url(#globeColorGrad)" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" stroke="url(#globeColorGrad)" />
                  <path d="M2 12h20" stroke="url(#globeColorGrad)" />
                </svg>
              </div>
              <div>
                {/* Non-bold, expanded tracking title */}
                <h1 className="text-2xl sm:text-3xl font-normal tracking-wide text-white">
                  Social Media Connectivity
                </h1>
                <p className="text-sm text-slate-400 mt-1 font-normal tracking-wide">
                  Manage your connected accounts, authorization statuses, and auto-publishing permissions.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateAccountOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#0c1630] hover:bg-[#152348] border border-[#1e2a4a] text-sm font-normal text-white flex items-center gap-2 transition-colors cursor-pointer tracking-wide"
            >
              <UserPlus className="w-4 h-4 text-blue-400" />
              <span>Create New Account</span>
            </button>

            <button
              onClick={fetchStatuses}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-[#0c1630] hover:bg-[#152348] border border-[#1e2a4a] text-gray-300 hover:text-white transition-colors cursor-pointer"
              title="Refresh status"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Onboarding Requirement Status Banner */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-[#0c1630] border border-[#1e2a4a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm shrink-0">
          <div className="flex items-center gap-3.5">
            {connectionState.hasAtLeastOne ? (
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
            )}
            <div>
              {/* Non-bold, expanded banner title */}
              <h3 className="font-normal text-white text-base tracking-wide">
                Onboarding Requirement: {connectionState.hasAtLeastOne ? "Complete" : "Action Required"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-normal tracking-wide">
                {connectionState.hasAtLeastOne
                  ? `You have connected ${connectionState.connectedCount} of 3 supported platform(s). Content scheduling and automated publishing are unlocked.`
                  : "Connect at least one platform (Instagram, Facebook, or LinkedIn) to complete business onboarding."}
              </p>
            </div>
          </div>

          {connectionState.hasAtLeastOne && (
            <Link
              href="/subscription"
              className="px-5 py-2.5 rounded-xl bg-brand-gradient hover:opacity-95 text-white font-medium text-xs sm:text-sm shadow-md shrink-0 transition-opacity tracking-wide"
            >
              Proceed to Billing &rarr;
            </Link>
          )}
        </div>

        {/* Feedback Banners */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3 text-sm text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-normal tracking-wide">{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center gap-3 text-sm text-red-300 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span className="font-normal tracking-wide">{errorMessage}</span>
          </div>
        )}

        {/* Platforms Grid matching Image 4 color code with low glow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
          {platforms.map((p) => {
            const isConnecting = connectingPlatform === p.key;
            const isDisconnecting = disconnectingPlatform === p.key;

            return (
              <div
                key={p.key}
                className={`rounded-2xl bg-[#0c1630] p-6 flex flex-col justify-between transition-all group ${
                  p.connected
                    ? "border border-[#8b5cf6]/50 shadow-[0_0_14px_rgba(139,92,246,0.18)]"
                    : "border border-[#1e2a4a] hover:border-[#8b5cf6]/40 hover:shadow-[0_0_12px_rgba(139,92,246,0.12)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="shrink-0">
                      {p.icon}
                    </div>

                    {/* Status badge matching Image 4 */}
                    {p.connected ? (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-normal bg-[#3b1154] border border-[#7c25b0]/60 text-purple-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-300" />
                        Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-normal bg-[#1c2333] border border-[#2a354c] text-slate-300">
                        Not Connected
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    {/* Non-bold title with expanded tracking */}
                    <h3 className="text-xl font-normal text-white tracking-wide">
                      {p.name}
                    </h3>
                    {p.connected && p.detailsName && (
                      <p className="text-xs font-mono text-purple-300 mt-0.5 truncate">
                        @{p.detailsName}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed font-normal tracking-wide">
                      {p.description}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-3 pt-3 border-t border-[#1e2a4a] flex flex-col gap-2">
                  {p.connected ? (
                    <div className="flex items-center gap-2">
                      <Link
                        href={p.manageHref}
                        className="flex-1 py-2.5 rounded-xl bg-[#162138] hover:bg-[#1e2d4d] text-xs font-normal tracking-wide text-white border border-[#23314f] flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        Settings
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDisconnect(p.key)}
                        disabled={isDisconnecting}
                        className="py-2.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-xs font-normal text-red-400 border border-red-500/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        title="Disconnect Account"
                      >
                        {isDisconnecting ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => handleConnect(p.key)}
                        disabled={isConnecting || connectingPlatform !== null}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ff7a59] via-[#e244b2] to-[#8a3ffc] hover:opacity-95 active:scale-[0.99] disabled:opacity-50 text-xs font-medium tracking-wide text-white shadow-[0_0_12px_rgba(138,63,252,0.22)] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        {isConnecting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Authorizing...</span>
                          </>
                        ) : (
                          <>
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>Connect {p.name}</span>
                          </>
                        )}
                      </button>

                      <Link
                        href={p.manageHref}
                        className="text-center text-[11px] text-gray-400 hover:text-white transition-colors"
                      >
                        Manual API Credentials &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Create Account Modal */}
        <CreateAccountModal
          isOpen={isCreateAccountOpen}
          onClose={() => setIsCreateAccountOpen(false)}
        />
      </div>
    </div>
  );
}
