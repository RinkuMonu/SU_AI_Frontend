"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Check,
  ExternalLink,
  Info,
} from "lucide-react";
import { SocialAccountItem } from "./types";

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
  colorBg: string;
  badgeBg: string;
  iconSvg: React.ReactNode;
  urlPrefix: string;
}

const PLATFORMS: PlatformMeta[] = [
  {
    platform: "instagram",
    name: "Instagram",
    placeholder: "ananyacreator",
    colorBg: "from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
    badgeBg: "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
    urlPrefix: "https://instagram.com/",
    iconSvg: (
      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    platform: "youtube",
    name: "YouTube",
    placeholder: "AnanyaVerma",
    colorBg: "from-red-600 to-red-700",
    badgeBg: "bg-[#FF0000]",
    urlPrefix: "https://youtube.com/@",
    iconSvg: (
      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    platform: "tiktok",
    name: "TikTok",
    placeholder: "ananyacreator",
    colorBg: "from-black to-slate-900",
    badgeBg: "bg-black border border-white/20",
    urlPrefix: "https://tiktok.com/@",
    iconSvg: (
      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    platform: "facebook",
    name: "Facebook",
    placeholder: "ananyaofficial",
    colorBg: "from-blue-600 to-blue-700",
    badgeBg: "bg-[#1877F2]",
    urlPrefix: "https://facebook.com/",
    iconSvg: (
      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
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
      // If toggled on with no handle, keep empty handle so user can type
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
    });
  };

  const connectedCount = socialAccounts.filter((a) => a.connected && a.handle.trim()).length;

  return (
    <div className="max-w-xl mx-auto space-y-6 py-2 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Connect Your Social Platforms
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Link your accounts to showcase your reach and engagement.
        </p>
      </div>

      {/* Social Platforms Stack */}
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
                {/* Left: Icon & Platform Name */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${p.badgeBg}`}
                  >
                    {p.iconSvg}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{p.name}</h3>
                    <p className="text-[11px] text-slate-400">
                      {isConnected && account.handle ? `@${account.handle}` : "Not linked"}
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
            </div>
          );
        })}
      </div>

      {/* Info notice box matching screenshot */}
      <div className="p-3.5 rounded-2xl bg-[#0E1838] border border-white/10 flex items-center gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-[#BE32FF] shrink-0" />
        <p className="leading-relaxed">
          Your profile, audience and engagement will be visible to brands on DhandaGrow.
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

        <div className="flex items-center gap-3">
          {connectedCount === 0 && (
            <button
              type="button"
              onClick={onNext}
              className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer transition-colors"
            >
              Skip for now
            </button>
          )}

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

