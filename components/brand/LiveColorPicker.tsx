"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Palette,
  Sparkles,
  Pipette,
  Sliders,
  Check,
  ChevronDown,
  RefreshCw,
  Eye,
} from "lucide-react";
import { CURATED_COLOR_PRESETS, isValidHex, formatHex } from "@/lib/brand-kit";

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
}

interface LiveColorPickerProps {
  colors: ColorScheme;
  onChange: (colors: ColorScheme) => void;
  selectedFont?: string;
  className?: string;
}

type ActiveColorTarget = "primary" | "secondary" | "accent";

function StoreGradientIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="liveStoreBadgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fc9a5d" />
          <stop offset="100%" stopColor="#f0449b" />
        </linearGradient>
      </defs>
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" stroke="url(#liveStoreBadgeGrad)" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" stroke="url(#liveStoreBadgeGrad)" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" stroke="url(#liveStoreBadgeGrad)" />
      <path d="M2 7h20" stroke="url(#liveStoreBadgeGrad)" />
      <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" stroke="url(#liveStoreBadgeGrad)" />
    </svg>
  );
}

export function LiveColorPicker({
  colors,
  onChange,
  selectedFont = "Inter",
  className = "",
}: LiveColorPickerProps) {
  const [activeTarget, setActiveTarget] = useState<ActiveColorTarget | null>(null);
  const [hexInput, setHexInput] = useState("");
  const [hexError, setHexError] = useState(false);
  const [gradientAngle, setGradientAngle] = useState(135);
  const [showLivePreview, setShowLivePreview] = useState(true);

  const panelRef = useRef<HTMLDivElement>(null);

  // Sync hex input whenever activeTarget or colors change
  useEffect(() => {
    if (activeTarget) {
      setHexInput(colors[activeTarget]);
      setHexError(false);
    }
  }, [activeTarget, colors]);

  // Click outside to close color picker panel
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setActiveTarget(null);
      }
    };
    if (activeTarget) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeTarget]);

  const handleColorChange = (target: ActiveColorTarget, value: string) => {
    const formatted = formatHex(value);
    onChange({
      ...colors,
      [target]: formatted,
    });
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    if (isValidHex(val)) {
      setHexError(false);
      if (activeTarget) {
        handleColorChange(activeTarget, val);
      }
    } else {
      setHexError(true);
    }
  };

  const handlePresetSelect = (preset: (typeof CURATED_COLOR_PRESETS)[0]) => {
    onChange({
      primary: preset.primary,
      secondary: preset.secondary,
      accent: preset.accent,
    });
  };

  return (
    <div className={`space-y-4 ${className}`} ref={panelRef}>
      {/* 3 Color Swatches matching Image 2 */}
      <div className="grid grid-cols-3 gap-4 py-2">
        {(
          [
            { key: "primary", label: "Primary", color: colors.primary },
            { key: "secondary", label: "Secondary", color: colors.secondary },
            { key: "accent", label: "Accent", color: colors.accent },
          ] as const
        ).map(({ key, label, color }) => {
          const isActive = activeTarget === key;

          return (
            <div
              key={key}
              onClick={() => setActiveTarget(isActive ? null : key)}
              className="group relative p-2 cursor-pointer transition-all duration-200 flex flex-col items-center gap-2"
            >
              {/* Swatch circle */}
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 transition-transform group-hover:scale-105 ${
                  isActive ? "border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105" : "border-white/20"
                }`}
                style={{ backgroundColor: color }}
              />

              {/* Label & Hex code */}
              <div className="text-center w-full min-w-0 mt-1">
                <span className="text-sm sm:text-base font-medium text-slate-300 block truncate">
                  {label}
                </span>
                <span className="text-base sm:text-lg font-mono font-bold text-white uppercase tracking-wider block mt-0.5">
                  {color}
                </span>
              </div>

              {isActive && (
                <div className="absolute top-1 right-2 w-2.5 h-2.5 rounded-full bg-brand-pink animate-pulse" />
              )}
            </div>
          );
        })}
      </div>

      {/* Popover / Panel when swatch is clicked */}
      {activeTarget && (
        <div className="p-4 rounded-xl bg-[#11162C] border border-white/15 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full border border-white/20"
                style={{ backgroundColor: colors[activeTarget] }}
              />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Editing {activeTarget} Color
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTarget(null)}
              className="text-xs text-text-muted hover:text-white transition-colors"
            >
              Done
            </button>
          </div>

          {/* Full Color Spectrum Picker & Eyedropper */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="color"
                value={colors[activeTarget]}
                onChange={(e) => handleColorChange(activeTarget, e.target.value)}
                className="w-full h-11 rounded-lg border border-white/15 cursor-pointer bg-transparent p-1 transition-all hover:border-brand-purple"
                title="Choose from color spectrum"
              />
            </div>

            {/* Manual Hex Input */}
            <div className="w-36">
              <input
                type="text"
                value={hexInput}
                onChange={handleHexInputChange}
                maxLength={7}
                placeholder="#000000"
                className={`w-full h-11 px-3 text-sm font-mono uppercase rounded-lg border bg-[#0B1020] text-white focus:outline-none focus:ring-2 ${
                  hexError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-white/15 focus:ring-brand-purple"
                }`}
              />
            </div>
          </div>

          {hexError && (
            <p className="text-[11px] text-red-400">
              Please enter a valid hex code (e.g. #BE32FF)
            </p>
          )}

          {/* Curated Color Presets */}
          <div className="space-y-2 pt-1 border-t border-white/5">
            <span className="text-[11px] font-medium text-text-muted block">
              Curated Brand Themes
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CURATED_COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 text-left transition-all flex items-center justify-between group"
                >
                  <span className="text-[10px] text-slate-300 group-hover:text-white truncate max-w-[80px]">
                    {preset.name}
                  </span>
                  <div className="flex -space-x-1 shrink-0">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/40"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/40"
                      style={{ backgroundColor: preset.secondary }}
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/40"
                      style={{ backgroundColor: preset.accent }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live Brand Preview Card matching Image 2 & Image 4 */}
      <div className="pt-3 space-y-3">
        <div className="flex items-center gap-3 pb-1">
          <div className="w-9 h-9 rounded-xl bg-[#261720] border border-[#f0449b]/25 flex items-center justify-center shrink-0 shadow-sm">
            <StoreGradientIcon className="w-4 h-4" />
          </div>
          <span className="text-base sm:text-lg font-normal text-white">
            Live brand styling preview
          </span>
        </div>

        <div
          className="p-5 sm:p-6 rounded-2xl border border-white/10 relative overflow-hidden transition-all duration-300 shadow-xl bg-[#081226]"
        >
          <div className="relative z-10 space-y-3.5">
            {/* Heading */}
            <h4
              className="text-lg sm:text-xl font-normal tracking-tight text-white"
              style={{ fontFamily: selectedFont }}
            >
              Your Brand Heading
            </h4>

            {/* Subheading / Body text */}
            <p
              className="text-xs sm:text-sm text-slate-300 leading-relaxed"
              style={{ fontFamily: selectedFont }}
            >
              Consistency across ads, reels and multi-channel campaigns.
            </p>

            {/* Interactive CTA Button & Full Gradient Line matching Image 4 */}
            <div className="pt-2 flex items-center gap-4">
              <button
                type="button"
                className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium text-white shadow-md transition-transform hover:scale-[1.02] active:scale-95 shrink-0"
                style={{
                  background: "linear-gradient(90deg, #fc9a5d 0%, #f0449b 35%, #be32ff 70%, #7d36fa 100%)",
                  fontFamily: selectedFont,
                }}
              >
                Brand Gradient CTA
              </button>

              <div
                className="flex-1 h-1.5 sm:h-2 rounded-full"
                style={{
                  background: "linear-gradient(90deg, #fc9a5d 0%, #f0449b 35%, #be32ff 70%, #7d36fa 100%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
