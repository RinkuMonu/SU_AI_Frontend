"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X, ArrowRight } from "lucide-react";

export interface CornerDialogProps {
  open: boolean;
  onClose: () => void;
  type?: "error" | "success" | "warning" | "info";
  title?: string;
  message: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  autoCloseDuration?: number; // in ms, default 8000. 0 to disable
}

export function CornerDialog({
  open,
  onClose,
  type = "error",
  title,
  message,
  actionText,
  actionHref,
  onAction,
  autoCloseDuration = 8000,
}: CornerDialogProps) {
  const [progress, setProgress] = useState(100);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const remainingTimeRef = useRef<number>(autoCloseDuration);

  // Auto-detect action if not provided
  let effectiveActionText = actionText;
  let effectiveActionHref = actionHref;

  if (!effectiveActionText && !effectiveActionHref && typeof message === "string") {
    const lower = message.toLowerCase();
    if (lower.includes("instagram")) {
      effectiveActionText = "Connect Instagram";
      effectiveActionHref = "/social-platforms/instagram";
    } else if (lower.includes("facebook")) {
      effectiveActionText = "Connect Facebook";
      effectiveActionHref = "/social-platforms/facebook";
    } else if (lower.includes("linkedin")) {
      effectiveActionText = "Connect LinkedIn";
      effectiveActionHref = "/social-platforms/linkedin";

    } else if (lower.includes("social platforms") || lower.includes("settings")) {
      effectiveActionText = "Social Platforms";
      effectiveActionHref = "/social-platforms/facebook";
    }
  }

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Handle countdown & auto-dismiss
  useEffect(() => {
    if (!open || autoCloseDuration <= 0) return;

    remainingTimeRef.current = autoCloseDuration;
    startTimeRef.current = Date.now();
    setProgress(100);

    const interval = 50; // update progress every 50ms
    const step = () => {
      if (isHovered) {
        startTimeRef.current = Date.now();
        return;
      }

      const elapsed = Date.now() - startTimeRef.current;
      const newRemaining = remainingTimeRef.current - elapsed;
      startTimeRef.current = Date.now();
      remainingTimeRef.current = Math.max(0, newRemaining);

      const percent = (remainingTimeRef.current / autoCloseDuration) * 100;
      setProgress(percent);

      if (remainingTimeRef.current <= 0) {
        onCloseRef.current();
      }
    };

    timerRef.current = setInterval(step, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [open, autoCloseDuration, isHovered]);

  if (!open) return null;

  const defaultTitles: Record<string, string> = {
    error: "Publish Failed",
    success: "Success",
    warning: "Attention Required",
    info: "Notice",
  };

  const currentTitle = title || defaultTitles[type] || "Notice";

  const themeStyles = {
    error: {
      border: "border-red-500/40 hover:border-red-500/60",
      glow: "shadow-[0_15px_40px_rgba(239,68,68,0.22)]",
      aura: "bg-red-500/15",
      badgeBg: "bg-red-500/20 border-red-500/30 text-red-400",
      progress: "from-red-500 via-rose-500 to-red-400",
      btnBg: "bg-red-500/20 hover:bg-red-500/30 text-red-200 border-red-500/30",
      icon: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
    },
    success: {
      border: "border-emerald-500/40 hover:border-emerald-500/60",
      glow: "shadow-[0_15px_40px_rgba(16,185,129,0.22)]",
      aura: "bg-emerald-500/15",
      badgeBg: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400",
      progress: "from-emerald-500 via-teal-500 to-green-400",
      btnBg: "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border-emerald-500/30",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    },
    warning: {
      border: "border-amber-500/40 hover:border-amber-500/60",
      glow: "shadow-[0_15px_40px_rgba(245,158,11,0.22)]",
      aura: "bg-amber-500/15",
      badgeBg: "bg-amber-500/20 border-amber-500/30 text-amber-400",
      progress: "from-amber-500 via-yellow-500 to-amber-400",
      btnBg: "bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-500/30",
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    },
    info: {
      border: "border-blue-500/40 hover:border-blue-500/60",
      glow: "shadow-[0_15px_40px_rgba(59,130,246,0.22)]",
      aura: "bg-blue-500/15",
      badgeBg: "bg-blue-500/20 border-blue-500/30 text-blue-400",
      progress: "from-blue-500 via-indigo-500 to-cyan-400",
      btnBg: "bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border-blue-500/30",
      icon: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
    },
  }[type];

  return (
    <div
      role="alert"
      aria-live="assertive"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed bottom-6 right-6 z-[99999] w-[calc(100vw-2rem)] sm:max-w-md bg-[#0a1224]/95 backdrop-blur-2xl border ${themeStyles.border} ${themeStyles.glow} rounded-2xl p-4 sm:p-5 shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in pointer-events-auto overflow-hidden`}
    >
      {/* Ambient background glow aura */}
      <div
        className={`absolute -top-12 -left-12 w-32 h-32 ${themeStyles.aura} rounded-full blur-3xl pointer-events-none`}
      />

      {/* Main Content */}
      <div className="relative flex items-start gap-3.5">
        {/* Icon Badge */}
        <div
          className={`p-2 rounded-xl border ${themeStyles.badgeBg} shadow-inner shrink-0 mt-0.5`}
        >
          {themeStyles.icon}
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 pr-6">
          <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
            {currentTitle}
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed break-words">
            {message}
          </p>

          {/* Action Link / Button if applicable */}
          {(effectiveActionHref || onAction) && (
            <div className="mt-3">
              {effectiveActionHref ? (
                <Link
                  href={effectiveActionHref}
                  onClick={onClose}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${themeStyles.btnBg} transition-all duration-200 shadow-sm cursor-pointer`}
                >
                  <span>{effectiveActionText || "Open"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onAction?.();
                    onClose();
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${themeStyles.btnBg} transition-all duration-200 shadow-sm cursor-pointer`}
                >
                  <span>{effectiveActionText || "Action"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 right-0 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Close"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Auto-Dismiss Progress Bar */}
      {autoCloseDuration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
          <div
            className={`h-full bg-gradient-to-r ${themeStyles.progress} transition-all duration-75`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
