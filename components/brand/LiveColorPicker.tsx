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
      {/* 3 Color Swatch Rows matching the reference card */}
      <div className="grid grid-cols-3 gap-3">
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
              className={`group relative p-3 rounded-xl cursor-pointer border transition-all duration-200 flex flex-col items-center gap-2 ${
                isActive
                  ? "bg-white/10 border-brand-purple shadow-[0_0_15px_rgba(190,50,255,0.3)] ring-1 ring-brand-purple"
                  : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              {/* Swatch circle */}
              <div
                className="w-10 h-10 rounded-full border-2 border-white/30 shadow-md transition-transform group-hover:scale-105"
                style={{ backgroundColor: color }}
              />

              {/* Label & Hex code */}
              <div className="text-center w-full min-w-0">
                <span className="text-[11px] font-medium text-text-muted block truncate">
                  {label}
                </span>
                <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider block">
                  {color}
                </span>
              </div>

              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
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

      {/* Live Brand Preview Card */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 focus:outline-none"
          >
            <Eye className="w-3.5 h-3.5 text-brand-pink" />
            <span>Live Brand Styling Preview</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${
                showLivePreview ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Gradient angle slider control */}
          <div className="flex items-center gap-2 text-[11px] text-text-muted">
            <span>Angle: {gradientAngle}&deg;</span>
            <input
              type="range"
              min="0"
              max="360"
              step="15"
              value={gradientAngle}
              onChange={(e) => setGradientAngle(Number(e.target.value))}
              className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-brand-pink"
            />
          </div>
        </div>

        {showLivePreview && (
          <div
            className="p-4 rounded-xl border border-white/10 relative overflow-hidden transition-all duration-300 shadow-xl"
            style={{
              backgroundColor: "#0B0E1F",
              borderColor: colors.accent + "40",
            }}
          >
            {/* Ambient background glow from brand colors */}
            <div
              className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-30 pointer-events-none"
              style={{ backgroundColor: colors.primary }}
            />
            <div
              className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full blur-3xl opacity-25 pointer-events-none"
              style={{ backgroundColor: colors.secondary }}
            />

            <div className="relative z-10 space-y-3">
              {/* Sample Heading in Primary Color with Selected Font */}
              <div className="flex items-center justify-between">
                <h4
                  className="text-base sm:text-lg font-bold tracking-tight transition-colors"
                  style={{
                    color: colors.primary,
                    fontFamily: selectedFont,
                  }}
                >
                  Your Brand Heading
                </h4>

                {/* Accent Tag */}
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                  style={{
                    color: colors.accent,
                    borderColor: colors.accent + "60",
                    backgroundColor: colors.accent + "15",
                  }}
                >
                  Accent Highlight
                </span>
              </div>

              {/* Sample Subheading / Body text */}
              <p
                className="text-xs text-slate-300 leading-relaxed"
                style={{ fontFamily: selectedFont }}
              >
                Consistency across ads, reels, and multi-channel campaigns.
              </p>

              {/* Interactive CTA Button with dynamic gradient */}
              <div className="pt-1 flex items-center gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white shadow-md transition-transform hover:scale-[1.02] active:scale-95"
                  style={{
                    background: `linear-gradient(${gradientAngle}deg, ${colors.primary} 0%, ${colors.secondary} 55%, ${colors.accent} 100%)`,
                    fontFamily: selectedFont,
                  }}
                >
                  Brand Gradient CTA
                </button>

                <div className="flex-1 h-2 rounded-full overflow-hidden border border-white/10 bg-white/5">
                  <div
                    className="w-full h-full"
                    style={{
                      background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
