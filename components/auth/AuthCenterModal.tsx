"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  X,
  Sparkles,
  ShieldCheck,
  Compass,
} from "lucide-react";

export type AuthModalStatus = "analyzing" | "navigating" | "error" | "success";
export type AuthProviderType = "Google" | "LinkedIn" | "Facebook" | "Gmail" | "Instagram" | "Email" | "General";

export interface AuthCenterModalProps {
  open: boolean;
  onClose: () => void;
  status: AuthModalStatus;
  provider?: AuthProviderType;
  title?: string;
  message?: string;
  onRetry?: () => void;
  actionText?: string;
  actionHref?: string;
}

export function AuthCenterModal({
  open,
  onClose,
  status,
  provider = "General",
  title,
  message,
  onRetry,
  actionText,
  actionHref,
}: AuthCenterModalProps) {
  const [showCancel, setShowCancel] = useState(false);

  // Allow user to cancel if stuck in analyzing for more than 4 seconds
  useEffect(() => {
    if (!open) {
      setShowCancel(false);
      return;
    }
    if (status === "analyzing" || status === "navigating") {
      const timer = setTimeout(() => setShowCancel(true), 4000);
      return () => clearTimeout(timer);
    }
    setShowCancel(false);
  }, [open, status]);

  if (!open) return null;

  // Google SVG Icon reusable component
  const googleIcon = (
    <svg className="w-8 h-8" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );

  // Provider specific details
  const providerMeta = {
    Google: {
      name: "Google",
      color: "#4285F4",
      glow: "rgba(66,133,244,0.3)",
      icon: googleIcon,
    },
    LinkedIn: {
      name: "LinkedIn",
      color: "#0A66C2",
      glow: "rgba(10,102,194,0.3)",
      icon: (
        <svg className="w-8 h-8 text-[#0A66C2] fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    Facebook: {
      name: "Facebook",
      color: "#1877F2",
      glow: "rgba(24,119,242,0.3)",
      icon: (
        <svg className="w-8 h-8 text-[#1877F2] fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    Gmail: {
      name: "Google",
      color: "#4285F4",
      glow: "rgba(66,133,244,0.3)",
      icon: googleIcon,
    },
    Instagram: {
      name: "Instagram",
      color: "#E1306C",
      glow: "rgba(225,48,108,0.3)",
      icon: (
        <svg className="w-8 h-8 text-[#E1306C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
    },
    Email: {
      name: "DhandaGrow",
      color: "#be32ff",
      glow: "rgba(190,50,255,0.3)",
      icon: <Sparkles className="w-8 h-8 text-[#be32ff]" />,
    },
    General: {
      name: "DhandaGrow",
      color: "#be32ff",
      glow: "rgba(190,50,255,0.3)",
      icon: <ShieldCheck className="w-8 h-8 text-[#be32ff]" />,
    },
  }[provider];

  // Default content based on status
  const defaultHeadings: Record<AuthModalStatus, { title: string; desc: string }> = {
    analyzing: {
      title: `Connecting with ${providerMeta.name}`,
      desc: "Analyzing request & establishing secure handshake...",
    },
    navigating: {
      title: "Redirecting...",
      desc: `Navigating to ${providerMeta.name} secure session. Please hold on...`,
    },
    error: {
      title: "Authentication Failed",
      desc: message || "We were unable to complete the request. Please verify and try again.",
    },
    success: {
      title: "Authentication Successful",
      desc: "Welcome back! Redirecting to your dashboard...",
    },
  };

  const displayTitle = title || defaultHeadings[status].title;
  const displayDesc = message || defaultHeadings[status].desc;

  // Auto-detect if error message encourages signup
  const isSignupEncouraged =
    status === "error" &&
    displayDesc.toLowerCase().includes("sign up");

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      {/* Centered Modal Card */}
      <div
        className={`relative w-full max-w-sm sm:max-w-md bg-[#0a1122]/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 text-center border shadow-2xl overflow-hidden transition-all duration-300 animate-in zoom-in-95 ${
          status === "error"
            ? "border-red-500/40 shadow-[0_0_60px_rgba(239,68,68,0.22)]"
            : status === "success"
            ? "border-emerald-500/40 shadow-[0_0_60px_rgba(16,185,129,0.22)]"
            : status === "navigating"
            ? "border-cyan-500/40 shadow-[0_0_60px_rgba(6,182,212,0.25)]"
            : "border-purple-500/35 shadow-[0_0_60px_rgba(190,50,255,0.22)]"
        }`}
      >
        {/* Ambient Top Glow */}
        <div
          className={`absolute -top-16 -left-16 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-40 ${
            status === "error"
              ? "bg-red-500"
              : status === "success"
              ? "bg-emerald-500"
              : status === "navigating"
              ? "bg-cyan-500"
              : "bg-purple-500"
          }`}
        />

        {/* Ambient Bottom Glow */}
        <div
          className={`absolute -bottom-16 -right-16 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-30 ${
            status === "error"
              ? "bg-rose-500"
              : status === "success"
              ? "bg-teal-500"
              : status === "navigating"
              ? "bg-blue-500"
              : "bg-pink-500"
          }`}
        />

        {/* Top-Right Close Button (Only in error state or when cancel is available) */}
        {(status === "error" || showCancel) && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors z-10"
            title="Close dialog"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Visual Centerpiece Icon with Concentric Radar Pulse */}
        <div className="relative flex items-center justify-center mx-auto mb-6 w-24 h-24">
          {/* Radar Waves */}
          {status === "analyzing" && (
            <>
              <div className="absolute inset-0 rounded-full border border-purple-500/30 animate-ping opacity-75" />
              <div className="absolute -inset-2 rounded-full border border-purple-500/20 animate-pulse" />
            </>
          )}

          {status === "navigating" && (
            <>
              <div className="absolute inset-0 rounded-full border border-cyan-400/40 animate-ping opacity-60" />
              <div className="absolute -inset-2 rounded-full border border-cyan-400/25 animate-pulse" />
            </>
          )}

          {/* Core Circle */}
          <div
            className={`relative w-20 h-20 rounded-2xl flex items-center justify-center border shadow-xl transition-all duration-300 ${
              status === "error"
                ? "bg-red-500/15 border-red-500/30 text-red-400"
                : status === "success"
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                : status === "navigating"
                ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400"
                : "bg-white/5 border-white/15"
            }`}
          >
            {status === "error" ? (
              <AlertCircle className="w-10 h-10 text-red-400 animate-bounce" />
            ) : status === "success" ? (
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            ) : status === "navigating" ? (
              <Compass className="w-10 h-10 text-cyan-400 animate-spin duration-1000" />
            ) : (
              providerMeta.icon
            )}

            {/* Spinner Overlay on Provider Icon during Analyzing */}
            {status === "analyzing" && (
              <div className="absolute -bottom-1 -right-1 bg-[#0a1122] rounded-full p-1 border border-purple-500/40 shadow">
                <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Step Badge */}
        {status === "analyzing" && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
            <span>Analyzing & Connecting...</span>
          </div>
        )}

        {status === "navigating" && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>Navigating Secure Session...</span>
          </div>
        )}

        {status === "error" && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span>Error Encountered</span>
          </div>
        )}

        {status === "success" && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Handshake Verified</span>
          </div>
        )}

        {/* Headings */}
        <h3 className="text-xl font-bold text-white tracking-tight">
          {displayTitle}
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-sm mx-auto break-words">
          {displayDesc}
        </p>

        {/* Shimmer Bar during analyzing / navigating */}
        {(status === "analyzing" || status === "navigating") && (
          <div className="mt-6 w-full bg-white/5 h-1.5 rounded-full overflow-hidden relative">
            <div
              className={`h-full rounded-full animate-[shimmer_1.5s_infinite] ${
                status === "navigating"
                  ? "bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-2/3"
                  : "bg-gradient-to-r from-transparent via-purple-500 to-transparent w-2/3"
              }`}
              style={{
                animation: "shimmer 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
            />
          </div>
        )}

        {/* Action Controls for Error State */}
        {status === "error" && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            {isSignupEncouraged ? (
              <Link
                href="/signup"
                onClick={onClose}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#be32ff] to-[#fc9a5d] text-white font-semibold text-xs shadow-lg hover:opacity-95 transition-all cursor-pointer"
              >
                <span>Create New Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : actionHref ? (
              <Link
                href={actionHref}
                onClick={onClose}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#be32ff] hover:bg-[#a824e6] text-white font-semibold text-xs shadow-lg transition-all cursor-pointer"
              >
                <span>{actionText || "Proceed"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : onRetry ? (
              <button
                type="button"
                onClick={() => {
                  onRetry();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#be32ff] to-[#fc9a5d] text-white font-semibold text-xs shadow-lg hover:opacity-95 transition-all cursor-pointer"
              >
                <span>Try Again</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : null}

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-semibold text-xs border border-white/10 transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Cancel option if taking long */}
        {(status === "analyzing" || status === "navigating") && showCancel && (
          <div className="mt-5">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-neutral-400 hover:text-white underline underline-offset-4 transition-colors"
            >
              Cancel & return to login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
