"use client";

import React from "react";
import { X, ExternalLink, Info } from "lucide-react";
import { InstagramIcon, FacebookIcon, LinkedInIcon } from "./SocialIcons";
import { PLATFORM_CONFIGS, SocialPlatformKey } from "@/lib/social-connectivity";

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlatform?: (platform: SocialPlatformKey) => void;
}

export function CreateAccountModal({ isOpen, onClose, onSelectPlatform }: CreateAccountModalProps) {
  if (!isOpen) return null;

  const platforms: {
    key: SocialPlatformKey;
    name: string;
    description: string;
    icon: React.ReactNode;
    url: string;
  }[] = [
    {
      key: "instagram",
      name: "Create Instagram Account",
      description: "Sign up for an Instagram Business account on instagram.com",
      icon: <InstagramIcon className="w-6 h-6" />,
      url: PLATFORM_CONFIGS.instagram.officialSignupUrl,
    },
    {
      key: "facebook",
      name: "Create Facebook Account",
      description: "Register a Facebook Profile or Page on facebook.com",
      icon: <FacebookIcon className="w-6 h-6" />,
      url: PLATFORM_CONFIGS.facebook.officialSignupUrl,
    },
    {
      key: "linkedin",
      name: "Create LinkedIn Account",
      description: "Join LinkedIn for professional networking on linkedin.com",
      icon: <LinkedInIcon className="w-6 h-6" />,
      url: PLATFORM_CONFIGS.linkedin.officialSignupUrl,
    },
  ];

  const handleOpenLink = (url: string, platformKey: SocialPlatformKey) => {
    window.open(url, "_blank", "noopener,noreferrer");
    if (onSelectPlatform) {
      onSelectPlatform(platformKey);
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-account-title"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-[#160E29] border border-white/10 rounded-2xl shadow-2xl p-6 text-white overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 id="create-account-title" className="text-lg font-bold text-white">
              Create a Social Account
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Select a platform to open its official sign-up page in a new tab
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Platform Choices */}
        <div className="mt-4 space-y-3">
          {platforms.map((p) => (
            <button
              key={p.key}
              onClick={() => handleOpenLink(p.url, p.key)}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#22163B] hover:bg-[#2C1D4A] border border-white/5 hover:border-purple-500/30 transition-all group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0">{p.icon}</div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-white group-hover:text-pink-300 transition-colors truncate">
                    {p.name}
                  </div>
                  <div className="text-xs text-gray-400 truncate">{p.description}</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white shrink-0 ml-2 transition-colors" />
            </button>
          ))}
        </div>

        {/* Informational Guidance Callout */}
        <div className="mt-5 p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-start gap-2.5 text-xs text-purple-200">
          <Info className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Creating an account on the platform website does not automatically connect it to DhandhaGrow AI.
            After creating your account, return here and click <strong className="text-white font-semibold">Connect</strong> to authorize and link it.
          </p>
        </div>

        {/* Close Button */}
        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-medium text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
