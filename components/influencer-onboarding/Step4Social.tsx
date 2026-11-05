"use client";

import React from "react";
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Info,
  Link as LinkIcon,
} from "lucide-react";
import { SocialAccountItem } from "./types";
import { InstagramIcon, FacebookIcon, LinkedInIcon } from "@/components/social/SocialIcons";

interface Step4SocialProps {
  socialAccounts: SocialAccountItem[];
  onUpdate: (fields: { socialAccounts: SocialAccountItem[] }) => void;
  onNext: () => void;
  onBack: () => void;
}

interface PlatformMeta {
  platform: SocialAccountItem["platform"];
  name: string;
  placeholder: string;
  iconSvg: React.ReactNode;
  urlPrefix: string;
  description: string;
}

const PLATFORMS: PlatformMeta[] = [
  {
    platform: "instagram",
    name: "Instagram",
    placeholder: "your_instagram_handle",
    urlPrefix: "https://instagram.com/",
    description: "Reels, Posts & Audience Metrics",
    iconSvg: <InstagramIcon className="w-5 h-5" />,
  },
  {
    platform: "facebook",
    name: "Facebook",
    placeholder: "your_facebook_page",
    urlPrefix: "https://facebook.com/",
    description: "Creator Page & Audience Reach",
    iconSvg: <FacebookIcon className="w-5 h-5" />,
  },
  {
    platform: "linkedin",
    name: "LinkedIn",
    placeholder: "your_linkedin_profile",
    urlPrefix: "https://linkedin.com/in/",
    description: "Professional Brand Deals & Thought Leadership",
    iconSvg: <LinkedInIcon className="w-5 h-5" />,
  },
];

export const Step4Social: React.FC<Step4SocialProps> = ({
  socialAccounts,
  onUpdate,
  onNext,
  onBack,
}) => {
  const getAccount = (platformName: SocialAccountItem["platform"]): SocialAccountItem => {
    const existing = socialAccounts.find((a) => a.platform === platformName);
    return (
      existing || {
        platform: platformName,
        handle: "",
        url: "",
        connected: false,
        isVerified: false,
      }
    );
  };

  const updateAccount = (
    platformName: SocialAccountItem["platform"],
    updates: Partial<SocialAccountItem>
  ) => {
    const exists = socialAccounts.some((a) => a.platform === platformName);
    let next: SocialAccountItem[];
    if (exists) {
      next = socialAccounts.map((a) =>
        a.platform === platformName ? { ...a, ...updates } : a
      );
    } else {
      next = [
        ...socialAccounts,
        {
          platform: platformName,
          handle: "",
          url: "",
          connected: false,
          isVerified: false,
          ...updates,
        },
      ];
    }
    onUpdate({ socialAccounts: next });
  };

  const handleToggle = (platformName: SocialAccountItem["platform"]) => {
    const current = getAccount(platformName);
    const newConnected = !current.connected;
    updateAccount(platformName, {
      connected: newConnected,
    });
  };

  const handleHandleChange = (
    platformName: SocialAccountItem["platform"],
    rawHandle: string,
    prefix: string
  ) => {
    const clean = rawHandle.replace(/^@/, "").trim();
    updateAccount(platformName, {
      handle: clean,
      url: clean ? `${prefix}${clean}` : "",
      connected: clean.length > 0 ? true : getAccount(platformName).connected,
      isVerified: false, // Never mark verified purely based on manually entered text
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 py-2 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Connect Your Social Platforms
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Link your accounts to showcase your reach and engagement (Optional).
        </p>
      </div>

      {/* Non-Mandatory Informational Banner */}
      <div className="p-3.5 rounded-2xl bg-[#0E1838] border border-[#BE32FF]/30 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-5 h-5 text-[#BE32FF] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-white">Optional Step:</strong> Social account connection is not mandatory during onboarding. You will be prompted to connect and officially verify your accounts upon entering your Creator Dashboard.
        </p>
      </div>

      {/* Social Platforms Stack (Instagram, Facebook, LinkedIn ONLY) */}
      <div className="space-y-3.5">
        {PLATFORMS.map((p) => {
          const account = getAccount(p.platform);
          const isConnected = account.connected;

          return (
            <div
              key={p.platform}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                isConnected
                  ? "bg-[#0B132B] border-[#BE32FF]/50 shadow-[0_0_15px_rgba(190,50,255,0.15)] ring-1 ring-[#BE32FF]/30"
                  : "bg-[#0B132B]/70 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                {/* Left: Icon & Platform Info */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    {p.iconSvg}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{p.name}</h3>
                    <p className="text-[11px] text-slate-400">
                      {account.handle ? (
                        <span className="text-slate-300 font-mono">@{account.handle}</span>
                      ) : (
                        p.description
                      )}
                    </p>
                  </div>
                </div>

                {/* Right: Username Input & Toggle Switch */}
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <span className="text-xs text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      @
                    </span>
                    <input
                      type="text"
                      value={account.handle}
                      onChange={(e) =>
                        handleHandleChange(p.platform, e.target.value, p.urlPrefix)
                      }
                      placeholder={p.placeholder}
                      className="w-32 sm:w-44 h-9 pl-6 pr-2.5 rounded-lg bg-[#071023] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#BE32FF] transition-all font-mono"
                    />
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => handleToggle(p.platform)}
                    aria-label={`Toggle ${p.name}`}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer shrink-0 ${
                      isConnected
                        ? "bg-gradient-to-r from-[#A855F7] to-[#EC4899]"
                        : "bg-slate-700/60"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform shadow-md ${
                        isConnected ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Status Note: Never claim verified on manual inputs */}
              {account.handle && (
                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <LinkIcon className="w-3 h-3 text-[#BE32FF]" />
                    <span>Handle configured</span>
                  </span>
                  <span className="text-amber-400/90 font-medium">
                    OAuth verification pending
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Safety Notice */}
      <div className="p-3.5 rounded-2xl bg-[#0E1838] border border-white/10 flex items-center gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <p className="leading-relaxed">
          Official OAuth verification ensures your follower metrics and genuine reach are highlighted to verified brands.
        </p>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-3">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl bg-[#0E1838] hover:bg-[#16234D] border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onNext}
            className="text-xs text-slate-400 hover:text-white underline cursor-pointer transition-colors"
          >
            Skip for now
          </button>

          <button
            type="button"
            onClick={onNext}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-[#A855F7] to-[#EC4899] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(236,72,153,0.4)] flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
