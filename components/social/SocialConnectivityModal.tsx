"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  UserPlus,
  Loader2,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Info,
} from "lucide-react";
import { InstagramIcon, FacebookIcon, LinkedInIcon } from "./SocialIcons";
import { socialService } from "@/services/social.service";
import { businessService } from "@/services/business.service";
import {
  evaluatePlatformConnections,
  PlatformConnectionState,
  SocialPlatformKey,
  PLATFORM_CONFIGS,
} from "@/lib/social-connectivity";

interface SocialConnectivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueSuccess?: () => void;
  isModal?: boolean;
}

export function SocialConnectivityModal({
  isOpen,
  onClose,
  onContinueSuccess,
  isModal = true,
}: SocialConnectivityModalProps) {
  const router = useRouter();

  // Platform connection state
  const [connectionState, setConnectionState] = useState<PlatformConnectionState>({
    instagram: false,
    facebook: false,
    linkedin: false,
    connectedCount: 0,
    hasAtLeastOne: false,
  });

  // Loading & status flags
  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(true);
  const [activeConnectingPlatform, setActiveConnectingPlatform] = useState<SocialPlatformKey | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [infoNotice, setInfoNotice] = useState<string | null>(null);
  const [showRequirementNotice, setShowRequirementNotice] = useState<boolean>(false);

  // Secondary "Create Account" options state
  const [showCreateAccountOptions, setShowCreateAccountOptions] = useState<boolean>(false);

  /**
   * Refreshes the authoritative connection status from the backend.
   */
  const loadStatus = useCallback(async () => {
    setIsLoadingStatus(true);
    setErrorMessage(null);

    try {
      // 1. Try authoritative social onboarding status endpoint
      let statusData: any = null;
      let bizData: any = null;

      const [statusRes, bizRes] = await Promise.allSettled([
        socialService.getOnboardingStatus(),
        businessService.getMyBusiness(),
      ]);

      if (statusRes.status === "fulfilled") {
        statusData = statusRes.value;
      }
      if (bizRes.status === "fulfilled") {
        bizData = bizRes.value;
      }

      const calculated = evaluatePlatformConnections(bizData, statusData);
      setConnectionState(calculated);
    } catch (err: any) {
      console.warn("Could not retrieve social connection status", err);
      // Fallback: check business record directly
      try {
        const biz = await businessService.getMyBusiness();
        const calculated = evaluatePlatformConnections(biz);
        setConnectionState(calculated);
      } catch (fallbackErr: any) {
        setErrorMessage(
          "Unable to load connection status. Please ensure the server is available and click retry."
        );
      }
    } finally {
      setIsLoadingStatus(false);
    }
  }, []);

  // Fetch status on initial mount / when modal opens
  useEffect(() => {
    if (isOpen) {
      loadStatus();
    }
  }, [isOpen, loadStatus]);

  // Check URL query parameters for OAuth returns (e.g., ?instagram_connected=true or ?error=...)
  useEffect(() => {
    if (typeof window === "undefined" || !isOpen) return;

    const params = new URLSearchParams(window.location.search);
    const igConnected = params.get("instagram_connected") === "true";
    const fbConnected = params.get("facebook_connected") === "true";
    const liConnected = params.get("linkedin_connected") === "true";

    const igError = params.get("instagram_error") || params.get("error");
    const fbError = params.get("error_description");
    const liError = params.get("linkedin_error");

    if (igConnected || fbConnected || liConnected) {
      const platformName = igConnected ? "Instagram" : fbConnected ? "Facebook" : "LinkedIn";
      setSuccessNotice(`${platformName} successfully authorized and connected!`);
      setInfoNotice(null);
      loadStatus();

      // Clean query params from address bar
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (igError || fbError || liError) {
      const errorText = decodeURIComponent(igError || fbError || liError || "Authorization was cancelled or failed.");
      setErrorMessage(`Authorization notice: ${errorText}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [isOpen, loadStatus]);

  /**
   * Initiates the OAuth flow for a specific platform.
   */
  const handleConnect = async (platform: SocialPlatformKey) => {
    if (activeConnectingPlatform) return; // Prevent duplicate clicks
    setActiveConnectingPlatform(platform);
    setErrorMessage(null);
    setSuccessNotice(null);
    setInfoNotice(null);
    setShowRequirementNotice(false);

    try {
      const authUrl = await socialService.getConnectUrl(platform);
      if (authUrl) {
        // Navigate safely to provider authorization page
        window.location.href = authUrl;
      } else {
        throw new Error("Authorization URL could not be generated.");
      }
    } catch (err: any) {
      console.error(`Failed to initiate connect for ${platform}`, err);
      const detail =
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to reach authorization provider. Please verify your connection and try again.";
      setErrorMessage(`Unable to connect to ${platform.charAt(0).toUpperCase() + platform.slice(1)}: ${detail}`);
      setActiveConnectingPlatform(null);
    }
  };

  /**
   * Handles selection of a platform from the Create Account options.
   * Redirects user to that platform's official registration page in a new browser tab.
   * Does NOT mark the account connected (backend remains source of truth).
   */
  const handleSelectRegistrationPlatform = (platformKey: SocialPlatformKey) => {
    const config = PLATFORM_CONFIGS[platformKey];
    if (!config) return;

    // Open official registration page in a new browser tab
    window.open(config.officialSignupUrl, "_blank", "noopener,noreferrer");

    // Close the options menu and show clear return guidance
    setShowCreateAccountOptions(false);
    setInfoNotice(
      `Official ${config.name} sign-up opened in a new tab. After creating your account, return here and click 'Connect' above to complete authorization.`
    );
  };

  /**
   * Handles the primary Continue button.
   * Enabled only when at least 1 account is connected.
   */
  const handleContinue = async () => {
    if (!connectionState.hasAtLeastOne) {
      setShowRequirementNotice(true);
      return;
    }

    // Authoritative check before advancing
    try {
      setIsLoadingStatus(true);
      let latestBiz: any = null;
      try {
        latestBiz = await businessService.getMyBusiness();
      } catch (_) {}

      let latestStatus: any = null;
      try {
        latestStatus = await socialService.getOnboardingStatus();
      } catch (_) {}

      const latestState = evaluatePlatformConnections(latestBiz, latestStatus);
      if (!latestState.hasAtLeastOne) {
        setShowRequirementNotice(true);
        setIsLoadingStatus(false);
        return;
      }

      // Proceed to Billing & Plans (the next configured step in Business onboarding)
      if (onContinueSuccess) {
        onContinueSuccess();
      } else {
        router.push("/subscription");
      }
    } catch (err) {
      console.error("Error during onboarding continuation", err);
      router.push("/subscription");
    } finally {
      setIsLoadingStatus(false);
    }
  };

  if (!isOpen) return null;

  const registrationChoices: {
    key: SocialPlatformKey;
    name: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: "instagram",
      name: "Instagram",
      icon: <InstagramIcon className="w-5 h-5 rounded-md" />,
    },
    {
      key: "facebook",
      name: "Facebook",
      icon: <FacebookIcon className="w-5 h-5 rounded-full" />,
    },
    {
      key: "linkedin",
      name: "LinkedIn",
      icon: <LinkedInIcon className="w-5 h-5 rounded-md" />,
    },
  ];

  const content = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="social-modal-title"
      className="relative w-full max-w-md bg-gradient-to-b from-[#180E2F] via-[#120A24] to-[#0A0515] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 text-white overflow-hidden flex flex-col justify-between"
    >
      {/* Subtle radial ambient glows */}
      <div className="absolute -top-24 -left-24 w-52 h-52 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-52 h-52 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Back / Decline Button */}
      <div className="flex items-center justify-between relative z-10">
        <button
          onClick={onClose}
          type="button"
          aria-label="Decline and close for now"
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all border border-white/10 shadow-sm"
          title="Decline for now"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {isLoadingStatus && (
          <div className="flex items-center gap-1.5 text-xs text-purple-300">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Checking...</span>
          </div>
        )}
      </div>

      {/* Heading & Subtitle */}
      <div className="mt-5 relative z-10">
        <h2 id="social-modal-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
          Connect Your
          <span className="block mt-0.5 bg-gradient-to-r from-[#FF7A50] via-[#FF3E7F] to-[#C026D3] bg-clip-text text-transparent">
            Social Media Accounts
          </span>
        </h2>
        <p className="mt-2.5 text-xs sm:text-sm text-gray-300/80 leading-relaxed font-normal">
          Link your social media accounts to create, schedule and manage content - all in one place.
        </p>
      </div>

      {/* Guidance / Info Notice */}
      {infoNotice && (
        <div className="mt-4 p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-start gap-2.5 text-xs text-purple-200 animate-in fade-in">
          <Info className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">{infoNotice}</div>
        </div>
      )}

      {/* Notifications / Error / Success Banners */}
      {successNotice && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-start gap-2.5 text-xs text-emerald-200 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{successNotice}</div>
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 flex items-start justify-between gap-2.5 text-xs text-red-200 animate-in fade-in">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
          <button
            onClick={loadStatus}
            aria-label="Retry status check"
            className="p-1 text-red-300 hover:text-white shrink-0"
            title="Retry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {showRequirementNotice && !connectionState.hasAtLeastOne && (
        <div className="mt-4 p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 flex items-start gap-2.5 text-xs text-amber-200 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            Please connect at least one social media account (Instagram, Facebook, or LinkedIn) to continue onboarding.
          </div>
        </div>
      )}

      {/* Platform Rows Card Container */}
      <div className="mt-6 bg-[#1A1132]/90 border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5 shadow-inner relative z-10">
        {/* Row 1: Instagram */}
        <div className="p-4 flex items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="shrink-0 drop-shadow-md">
              <InstagramIcon className="w-10 h-10 rounded-xl" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-white text-base truncate block">Instagram</span>
              {connectionState.instagram && connectionState.details?.instagram?.name && (
                <span className="text-[11px] text-pink-300/80 truncate block">
                  @{connectionState.details.instagram.name}
                </span>
              )}
            </div>
          </div>

          <div className="shrink-0">
            {connectionState.instagram ? (
              <span className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#FF3377] via-[#D82672] to-[#B0249D] shadow-md shadow-pink-500/25 flex items-center gap-1.5">
                Connected
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handleConnect("instagram")}
                disabled={activeConnectingPlatform !== null}
                className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-[#2A1F45] hover:bg-[#382B5A] active:scale-95 disabled:opacity-50 transition-all border border-white/10 shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                {activeConnectingPlatform === "instagram" ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect"
                )}
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Facebook */}
        <div className="p-4 flex items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="shrink-0 drop-shadow-md">
              <FacebookIcon className="w-10 h-10 rounded-xl" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-white text-base truncate block">Facebook</span>
              {connectionState.facebook && connectionState.details?.facebook?.name && (
                <span className="text-[11px] text-blue-300/80 truncate block">
                  {connectionState.details.facebook.name}
                </span>
              )}
            </div>
          </div>

          <div className="shrink-0">
            {connectionState.facebook ? (
              <span className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#FF3377] via-[#D82672] to-[#B0249D] shadow-md shadow-pink-500/25 flex items-center gap-1.5">
                Connected
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handleConnect("facebook")}
                disabled={activeConnectingPlatform !== null}
                className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-[#2A1F45] hover:bg-[#382B5A] active:scale-95 disabled:opacity-50 transition-all border border-white/10 shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                {activeConnectingPlatform === "facebook" ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect"
                )}
              </button>
            )}
          </div>
        </div>

        {/* Row 3: LinkedIn */}
        <div className="p-4 flex items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="shrink-0 drop-shadow-md">
              <LinkedInIcon className="w-10 h-10 rounded-xl" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-white text-base truncate block">LinkedIn</span>
              {connectionState.linkedin && connectionState.details?.linkedin?.name && (
                <span className="text-[11px] text-blue-300/80 truncate block">
                  {connectionState.details.linkedin.name}
                </span>
              )}
            </div>
          </div>

          <div className="shrink-0">
            {connectionState.linkedin ? (
              <span className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#FF3377] via-[#D82672] to-[#B0249D] shadow-md shadow-pink-500/25 flex items-center gap-1.5">
                Connected
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handleConnect("linkedin")}
                disabled={activeConnectingPlatform !== null}
                className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-[#2A1F45] hover:bg-[#382B5A] active:scale-95 disabled:opacity-50 transition-all border border-white/10 shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                {activeConnectingPlatform === "linkedin" ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect"
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="mt-8 space-y-3 relative z-10">
        {/* Primary Continue Button */}
        <button
          type="button"
          onClick={handleContinue}
          disabled={!connectionState.hasAtLeastOne && isLoadingStatus}
          aria-label={
            connectionState.hasAtLeastOne
              ? "Continue to next onboarding step"
              : "Connect at least one platform to continue"
          }
          className={`w-full py-4 px-6 rounded-full font-bold text-base flex items-center justify-center gap-2.5 transition-all shadow-lg ${
            connectionState.hasAtLeastOne
              ? "bg-gradient-to-r from-[#7B3FE4] via-[#DE3A80] to-[#FF7A45] hover:opacity-95 text-white shadow-purple-900/40 active:scale-[0.99] cursor-pointer ring-1 ring-white/20"
              : "bg-gradient-to-r from-[#7B3FE4]/40 via-[#DE3A80]/40 to-[#FF7A45]/40 text-white/50 cursor-not-allowed border border-white/5"
          }`}
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Secondary Create Account Button */}
        <button
          type="button"
          onClick={() => setShowCreateAccountOptions((prev) => !prev)}
          className="w-full py-3.5 px-6 rounded-full font-semibold text-sm text-gray-200 bg-[#201738] hover:bg-[#2C204B] active:scale-[0.99] transition-all border border-white/10 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-purple-300" />
          <span>Create Account</span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              showCreateAccountOptions ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Three Platform Options for Create Account */}
        {showCreateAccountOptions && (
          <div className="p-3 rounded-2xl bg-[#1D1438] border border-white/10 shadow-xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-[11px] text-gray-400 px-2 pt-1 font-medium">
              Select a platform to sign up on its official website:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {registrationChoices.map((choice) => (
                <button
                  key={choice.key}
                  type="button"
                  onClick={() => handleSelectRegistrationPlatform(choice.key)}
                  className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-[#281B4B] hover:bg-[#342460] border border-white/5 hover:border-pink-500/30 transition-all text-center cursor-pointer group"
                >
                  <div className="shrink-0 group-hover:scale-105 transition-transform">
                    {choice.icon}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-white group-hover:text-pink-300">
                    <span>{choice.name}</span>
                    <ExternalLink className="w-2.5 h-2.5 text-gray-400 group-hover:text-white" />
                  </div>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-400/80 px-2 pb-0.5 leading-tight">
              Opens registration in a new tab. After signing up, return here and click <strong className="text-white">Connect</strong> above.
            </p>
          </div>
        )}

        {/* Subtle decline / skip for now link */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-white transition-colors underline-offset-4 hover:underline cursor-pointer"
          >
            Skip for now (you can connect later from the sidebar)
          </button>
        </div>
      </div>
    </div>
  );

  if (!isModal) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      {content}
    </div>
  );
}
