"use client";

import React, { useState } from "react";
import {
  Wand2,
  Sparkles,
  Check,
  RotateCcw,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Eye,
  Maximize2,
  CheckCircle2,
  Layers,
  Sliders,
  X,
  Loader2,
  Image as ImageIcon,
  Camera,
  Film,
  ShoppingBag
} from "lucide-react";
import {
  EnhancedVariation,
  EnhancementStyle,
  PhotoshootUploadedImage,
  ProductCategory
} from "./types";
import { ENHANCEMENT_STYLES, PRODUCT_CATEGORIES } from "./data";
import {
  resolvePhotoshootUrl,
  handlePhotoshootImageError,
  PHOTOSHOOT_FALLBACK_PRODUCT,
  PHOTOSHOOT_FALLBACK_ENHANCED,
} from "./photoshootUtils";

interface Step2EnhanceProps {
  uploadedImages: PhotoshootUploadedImage[];
  enhancedVariations: EnhancedVariation[];
  selectedEnhancedIds: string[];
  enhancementStyle: EnhancementStyle;
  isEnhancing: boolean;
  detectedAnalysis?: any;
  productCategory?: ProductCategory;
  onCategoryChange?: (category: ProductCategory) => void;
  onStyleSelect: (style: EnhancementStyle) => void;
  onVariationToggle: (id: string) => void;
  onRegenerateVariation: (id: string) => void;
  onRegenerateAll: () => void;
  onBack: () => void;
  onNext: () => void;
}

export const Step2Enhance: React.FC<Step2EnhanceProps> = ({
  uploadedImages,
  enhancedVariations,
  selectedEnhancedIds,
  enhancementStyle,
  isEnhancing,
  detectedAnalysis,
  productCategory,
  onCategoryChange,
  onStyleSelect,
  onVariationToggle,
  onRegenerateVariation,
  onRegenerateAll,
  onBack,
  onNext,
}) => {
  const [activeComparisonId, setActiveComparisonId] = useState<string | null>(
    enhancedVariations[0]?.id || null
  );
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"slider" | "side_by_side">("slider");

  const activeVariation =
    enhancedVariations.find((v) => v.id === activeComparisonId) ||
    enhancedVariations[0];

  const primaryOriginal = uploadedImages[0]?.url || uploadedImages[0]?.previewUrl || "";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Step Header Card matching Image 3 with #081226 and 30px Roboto */}
      <div 
        style={{ backgroundColor: "#081226", fontFamily: "'Roboto', sans-serif" }}
        className="border border-[#1e2a4a] rounded-3xl p-5 sm:p-6 shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span 
              style={{ background: "linear-gradient(135deg, rgba(47, 18, 98, 0.5) 0%, rgba(20, 10, 45, 0.25) 100%)" }}
              className="w-10 h-10 rounded-2xl border border-[#8b5cf6]/40 text-purple-200 flex items-center justify-center shrink-0 shadow-sm"
            >
              <Wand2 className="w-5 h-5 text-[#c084fc] stroke-[1.8]" />
            </span>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 
                  style={{ fontSize: "22px", fontFamily: "'Roboto', sans-serif" }}
                  className="font-normal text-white tracking-normal leading-tight"
                >
                  Step 2 — AI Product Enhancement
                </h2>
                <span style={{ background: "rgba(47, 18, 98, 0.45)" }} className="text-xs px-3 py-1 rounded-full text-purple-200 border border-[#8b5cf6]/35 font-normal">
                  AI Vision Calibrated
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                AI analyzes the uploaded images and creates different professional treatments while preserving the original product.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRegenerateAll}
            disabled={isEnhancing}
            style={{ background: "linear-gradient(135deg, rgba(47, 18, 98, 0.45) 0%, rgba(20, 10, 45, 0.25) 100%)" }}
            className="px-6 sm:px-7 py-2.5 rounded-full border border-[#8b5cf6]/35 hover:border-[#8b5cf6]/70 text-purple-100 hover:text-white text-xs font-normal flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto disabled:opacity-50 shadow-md"
          >
            {isEnhancing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-300" />
            ) : (
              <RotateCcw className="w-3.5 h-3.5 text-purple-300" />
            )}
            <span>Regenerate Looks</span>
          </button>
        </div>

        {/* AI Inspection Metadata Strip */}
        {detectedAnalysis && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3.5 mt-3.5 border-t border-border text-xs">
            <div className="bg-[#071023] border border-border rounded-xl p-2.5">
              <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block">
                Product Type
              </span>
              <p className="font-bold text-white truncate mt-0.5">
                {detectedAnalysis.product_type || "Commercial Item"}
              </p>
            </div>
            <div className="bg-[#071023] border border-border rounded-xl p-2.5">
              <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block">
                Detected Colors
              </span>
              <p className="font-bold text-white truncate mt-0.5">
                {Array.isArray(detectedAnalysis.main_colors) && detectedAnalysis.main_colors.length > 0
                  ? detectedAnalysis.main_colors.join(", ")
                  : "Original Colors"}
              </p>
            </div>
            <div className="bg-[#071023] border border-border rounded-xl p-2.5">
              <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block">
                Material Texture
              </span>
              <p className="font-bold text-text-secondary truncate mt-0.5">
                {detectedAnalysis.material_and_texture || "Commercial Grade"}
              </p>
            </div>
            <div className="bg-[#071023] border border-border rounded-xl p-2.5">
              <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block">
                Fidelity
              </span>
              <p className="font-bold text-emerald-400 truncate mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Preserved</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3 Enhancement Style Selector Cards with Image 1 Glow & Dark Purple Low Opacity Placeholders */}
      <div 
        style={{ fontFamily: "'Roboto', sans-serif" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-3.5"
      >
        {ENHANCEMENT_STYLES.map((st) => {
          const isSelected = enhancementStyle === st.id;
          const StyleIcon = st.id === "studio_premium" ? Camera : st.id === "luxury_cinematic" ? Film : ShoppingBag;

          return (
            <button
              key={st.id}
              type="button"
              onClick={() => onStyleSelect(st.id)}
              style={{
                backgroundColor: isSelected ? "#101322" : "#081226",
                backgroundImage: isSelected
                  ? "linear-gradient(135deg, rgba(47, 18, 98, 0.45) 0%, rgba(13, 15, 27, 0.85) 100%)"
                  : "none",
                boxShadow: isSelected
                  ? "0 0 12px rgba(139, 92, 246, 0.25)"
                  : "none",
                borderColor: isSelected ? "#8b5cf6" : undefined,
              }}
              className={`relative text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden group min-h-[160px] ${
                isSelected
                  ? "border-[#8b5cf6]"
                  : "border-[#1e2a4a] hover:border-slate-400 hover:bg-[#0c1630]"
              }`}
            >
              {/* Top Row: Icon Placeholder + Badge & Radio Checkmark matching Image 1 */}
              <div className="flex items-center justify-between mb-3 w-full">
                <div className="flex items-center gap-2.5">
                  <div
                    style={{
                      background: "linear-gradient(135deg, rgba(47, 18, 98, 0.5) 0%, rgba(20, 10, 45, 0.25) 100%)",
                    }}
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                      isSelected
                        ? "border-[#8b5cf6] text-[#c084fc] shadow-[0_0_12px_rgba(139,92,246,0.35)]"
                        : "border-[#8b5cf6]/25 text-purple-300 group-hover:text-white"
                    }`}
                  >
                    <StyleIcon className="w-5 h-5 text-inherit stroke-[1.8]" />
                  </div>

                  <span
                    style={{
                      background: isSelected
                        ? "rgba(47, 18, 98, 0.55)"
                        : "rgba(20, 26, 46, 0.5)",
                    }}
                    className={`text-[11px] font-normal px-2.5 py-0.5 rounded-full border ${
                      isSelected
                        ? "border-[#8b5cf6]/50 text-purple-100 shadow-sm"
                        : "border-[#26314c] text-purple-300"
                    }`}
                  >
                    {st.badge}
                  </span>
                </div>

                <div
                  style={{
                    background: isSelected
                      ? "linear-gradient(135deg, rgba(47, 18, 98, 0.6) 0%, rgba(20, 10, 45, 0.35) 100%)"
                      : "rgba(0,0,0,0.4)",
                  }}
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-[#8b5cf6] text-purple-100 shadow-[0_0_6px_rgba(139,92,246,0.25)]"
                      : "border-white/30"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1 mb-3">
                <h3 className="text-sm sm:text-base font-normal text-white group-hover:text-purple-200 transition-colors">
                  {st.name}
                </h3>
                <p className="text-xs text-purple-300 font-normal">{st.tagline}</p>
                <p className="text-xs text-slate-400 leading-snug pt-0.5 line-clamp-2 font-normal">
                  {st.description}
                </p>
              </div>

              {/* Specs Pill */}
              <div className="pt-2.5 border-t border-[#1e2a4a] flex items-center justify-between text-[11px] text-slate-400 font-normal">
                <span>{st.lightingType}</span>
                <span className="font-normal text-slate-300">{st.idealFor.split(",")[0]}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Before & After Comparison */}
      {activeVariation && (
        <div style={{ backgroundColor: "#081226", fontFamily: "'Roboto', sans-serif" }} className="border border-[#1e2a4a] rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span style={{ background: "linear-gradient(135deg, rgba(47, 18, 98, 0.45) 0%, rgba(20, 10, 45, 0.25) 100%)" }} className="w-7 h-7 rounded-lg border border-[#8b5cf6]/35 text-purple-200 flex items-center justify-center shrink-0">
                  <Sliders className="w-4 h-4 text-[#c084fc] stroke-[1.8]" />
                </span>
                <span className="font-normal">Original vs. AI Enhanced Inspection</span>
                <span className="text-xs text-purple-300 font-normal">
                  ({activeVariation.styleName})
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                Inspect edge sharpness, lighting fidelity, and true product color preservation.
              </p>
            </div>

            {/* View Mode Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center bg-[#090d1f] border border-white/10 rounded-xl p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("slider")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    viewMode === "slider" ? "bg-brand-purple text-white shadow" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Split Slider
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("side_by_side")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    viewMode === "side_by_side" ? "bg-brand-purple text-white shadow" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Side by Side
                </button>
              </div>

              {viewMode === "slider" && (
                <button
                  type="button"
                  onClick={() => setSliderPosition(sliderPosition === 50 ? 0 : 50)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-neutral-300 cursor-pointer"
                >
                  {sliderPosition === 0 ? "50/50" : "Enhanced"}
                </button>
              )}

              <button
                type="button"
                onClick={() => setLightboxImageUrl(activeVariation.enhancedUrl)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white cursor-pointer"
                title="Zoom view"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* View Mode 1: Split Slider */}
          {viewMode === "slider" ? (
            <div className="relative aspect-[16/9] sm:aspect-[21/9] max-h-[360px] w-full rounded-xl overflow-hidden select-none bg-black/60 border border-white/10">
              {activeVariation?.enhancedUrl && activeVariation.enhancedUrl.trim() ? (
                <img
                  src={resolvePhotoshootUrl(activeVariation.enhancedUrl)}
                  alt="Enhanced variation"
                  className="absolute inset-0 w-full h-full object-contain p-2"
                  onError={(e) => handlePhotoshootImageError(e, PHOTOSHOOT_FALLBACK_ENHANCED)}
                />
              ) : null}
              <div style={{ background: "#2F1262" }} className="absolute top-3 right-3 px-2 py-0.5 rounded border border-[#8b5cf6]/40 text-purple-100 text-[10px] font-normal shadow">
                AI Enhanced ({activeVariation?.styleName || "Calibrated"})
              </div>

              {/* Clipped Overlay (Original Image) */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                {(activeVariation?.originalUrl || primaryOriginal) && (activeVariation?.originalUrl || primaryOriginal).trim() ? (
                  <img
                    src={resolvePhotoshootUrl(activeVariation?.originalUrl || primaryOriginal)}
                    alt="Original product"
                    className="absolute inset-0 w-full h-full object-contain p-2"
                    onError={(e) => handlePhotoshootImageError(e, PHOTOSHOOT_FALLBACK_PRODUCT)}
                  />
                ) : null}
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-neutral-300 text-[10px] font-bold shadow border border-white/10">
                  Original Photo
                </div>
              </div>

              {/* Split Line & Handle */}
              <div
                className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] cursor-ew-resize pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white text-black shadow-xl flex items-center justify-center font-bold text-xs pointer-events-auto cursor-ew-resize">
                  ⇄
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                aria-label="Comparison slider"
              />
            </div>
          ) : (
            /* View Mode 2: Side-by-Side Dual Card View */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-[#090d1f] p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-300">
                  <span>Original Photo</span>
                  <button
                    type="button"
                    onClick={() => setLightboxImageUrl(activeVariation?.originalUrl || primaryOriginal)}
                    className="text-neutral-400 hover:text-white"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-black/50 flex items-center justify-center">
                  {(activeVariation?.originalUrl || primaryOriginal) && (activeVariation?.originalUrl || primaryOriginal).trim() ? (
                    <img
                      src={resolvePhotoshootUrl(activeVariation?.originalUrl || primaryOriginal)}
                      alt="Original"
                      className="w-full h-full object-contain p-2"
                      onError={(e) => handlePhotoshootImageError(e, PHOTOSHOOT_FALLBACK_PRODUCT)}
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-neutral-600" />
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-brand-purple/40 bg-brand-purple/5 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <span className="text-purple-300 font-normal">AI Enhanced ({activeVariation?.styleName || "Calibrated"})</span>
                  <button
                    type="button"
                    onClick={() => setLightboxImageUrl(activeVariation?.enhancedUrl || null)}
                    className="text-neutral-400 hover:text-white"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-black/50 flex items-center justify-center">
                  {activeVariation?.enhancedUrl && activeVariation.enhancedUrl.trim() ? (
                    <img
                      src={resolvePhotoshootUrl(activeVariation.enhancedUrl)}
                      alt="Enhanced"
                      className="w-full h-full object-contain p-2"
                      onError={(e) => handlePhotoshootImageError(e, PHOTOSHOOT_FALLBACK_ENHANCED)}
                    />
                  ) : (
                    <Sparkles className="w-8 h-8 text-neutral-600" />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Enhancement Variations Grid */}
      <div style={{ backgroundColor: "#081226", fontFamily: "'Roboto', sans-serif" }} className="border border-[#1e2a4a] rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span style={{ background: "linear-gradient(135deg, rgba(47, 18, 98, 0.45) 0%, rgba(20, 10, 45, 0.25) 100%)" }} className="w-7 h-7 rounded-lg border border-[#8b5cf6]/35 text-purple-200 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#c084fc] stroke-[1.8]" />
              </span>
              <span className="font-normal">Select Enhanced Variations</span>
              <span style={{ background: "#2F1262" }} className="text-xs px-2.5 py-0.5 rounded-full text-purple-200 font-normal border border-[#8b5cf6]/40">
                {selectedEnhancedIds.length} selected
              </span>
            </h3>
            <p className="text-xs text-neutral-400">
              Select the enhanced lighting versions you want to carry forward into your photoshoot.
            </p>
          </div>
        </div>

        {/* 3 Variations Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {enhancedVariations.map((variation) => {
            const isSelected = selectedEnhancedIds.includes(variation.id);
            const isComparing = activeComparisonId === variation.id;

            return (
              <div
                key={variation.id}
                className={`rounded-xl border transition-all overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#141228] border-[#8b5cf6] shadow-[0_0_12px_rgba(139,92,246,0.25)]"
                    : "bg-[#090d1f] border-white/10 hover:border-white/20"
                }`}
              >
                {/* Image Preview */}
                <div
                  className="relative aspect-square w-full bg-black/40 overflow-hidden cursor-pointer group flex items-center justify-center"
                  onClick={() => setActiveComparisonId(variation.id)}
                >
                  {variation.enhancedUrl && variation.enhancedUrl.trim() ? (
                    <img
                      src={resolvePhotoshootUrl(variation.enhancedUrl)}
                      alt={variation.styleName}
                      className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => handlePhotoshootImageError(e, PHOTOSHOOT_FALLBACK_ENHANCED)}
                    />
                  ) : (
                    <Sparkles className="w-8 h-8 text-neutral-600" />
                  )}

                  {isSelected && (
                    <div style={{ background: "linear-gradient(135deg, #2F1262 0%, #000000 100%)" }} className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full border border-[#8b5cf6] text-purple-100 text-[10px] font-normal shadow-md flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Selected</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxImageUrl(variation.enhancedUrl);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-brand-purple text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                    title="Zoom in"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  {isComparing && (
                    <div className="absolute bottom-2 left-2 right-2 py-0.5 px-2 rounded-lg bg-black/80 backdrop-blur-md text-white text-[10px] text-center font-semibold border border-brand-purple/40">
                      Comparing Above
                    </div>
                  )}
                </div>

                {/* Details & Actions */}
                <div className="p-3 space-y-2.5 bg-[#0e1328]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{variation.styleName}</span>
                    <span className="text-[10px] text-neutral-400">1:1 Square</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
                    <button
                      type="button"
                      disabled={variation.isRegenerating || isEnhancing}
                      onClick={() => onVariationToggle(variation.id)}
                      style={{ background: isSelected ? "linear-gradient(135deg, #2F1262 0%, #000000 100%)" : undefined }} className={`py-1.5 px-2 rounded-lg text-xs font-normal transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                        isSelected
                          ? "text-purple-100 border border-[#8b5cf6] shadow shadow-purple-900/40"
                          : "bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10"
                      }`}
                    >
                      {variation.isRegenerating ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Rendering...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3 h-3" />
                          <span>{isSelected ? "Selected" : "Select"}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onRegenerateVariation(variation.id)}
                      disabled={variation.isRegenerating || isEnhancing}
                      className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs font-semibold border border-white/10 flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Re-roll this variation"
                    >
                      {variation.isRegenerating ? (
                        <Loader2 className="w-3 h-3 animate-spin text-brand-purple" />
                      ) : (
                        <RotateCcw className="w-3 h-3" />
                      )}
                      <span>Re-roll</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setLightboxImageUrl(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full bg-[#0e1328] border border-white/20 rounded-2xl p-4 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold text-white">Enhanced Preview</span>
              <button
                type="button"
                onClick={() => setLightboxImageUrl(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 flex items-center justify-center max-h-[75vh] overflow-hidden">
              <img
                src={resolvePhotoshootUrl(lightboxImageUrl)}
                alt="Enhanced preview"
                className="max-h-[70vh] w-auto object-contain rounded-xl"
                onError={(e) => handlePhotoshootImageError(e, PHOTOSHOOT_FALLBACK_ENHANCED)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation - Option 3 Visual Match */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl bg-[#0E1838] hover:bg-[#16234D] border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          style={{
            background: "linear-gradient(95deg, #7d36fa 0%, #9534fd 18%, #b233fe 36%, #c835ef 52%, #df3dbb 68%, #ee4795 82%, #f76f7b 92%, #fc9a5d 100%)",
          }}
          className="px-9 py-3.5 rounded-full text-white font-medium text-xs sm:text-sm shadow-xl shadow-purple-600/35 hover:opacity-95 flex items-center gap-2 cursor-pointer transition-all"
        >
          <span className="text-white font-medium">Continue to Choose Style</span>
          <ArrowRight className="w-4 h-4 text-white stroke-[2.2]" />
        </button>
      </div>
    </div>
  );
};
