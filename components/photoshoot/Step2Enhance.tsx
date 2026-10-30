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
  Loader2
} from "lucide-react";
import { 
  EnhancedVariation, 
  EnhancementStyle, 
  PhotoshootUploadedImage 
} from "./types";
import { ENHANCEMENT_STYLES } from "./data";

interface Step2EnhanceProps {
  uploadedImages: PhotoshootUploadedImage[];
  enhancedVariations: EnhancedVariation[];
  selectedEnhancedIds: string[];
  enhancementStyle: EnhancementStyle;
  isEnhancing: boolean;
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

  const activeVariation =
    enhancedVariations.find((v) => v.id === activeComparisonId) ||
    enhancedVariations[0];

  const primaryOriginal = uploadedImages[0]?.previewUrl || "";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-purple text-xs font-semibold">
          <Wand2 className="w-3.5 h-3.5" />
          <span>Step 2 of 5 • Neural Clarity &amp; Lighting</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Enhance Your Product Images
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
          Select an AI enhancement lighting grade and choose your preferred enhanced variations.
        </p>
      </div>

      {/* 3 Enhancement Style Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ENHANCEMENT_STYLES.map((st) => {
          const isSelected = enhancementStyle === st.id;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => onStyleSelect(st.id)}
              className={`relative text-left p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between overflow-hidden group ${
                isSelected
                  ? "bg-gradient-to-b from-[#181329] to-[#120f20] border-brand-purple shadow-xl shadow-brand-purple/20 ring-2 ring-brand-purple/50"
                  : "bg-[#0d0f1c] hover:bg-[#121424] border-white/10 hover:border-white/25"
              }`}
            >
              {/* Top Row: Badge & Radio */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected
                      ? "bg-brand-purple text-white shadow-sm"
                      : "bg-white/10 text-neutral-300"
                  }`}
                >
                  {st.badge}
                </span>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-brand-purple bg-brand-purple text-white"
                      : "border-white/30 bg-black/40"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1 mb-4">
                <h2 className="text-base font-bold text-white group-hover:text-brand-pink transition-colors">
                  {st.name}
                </h2>
                <p className="text-xs text-brand-purple font-medium">{st.tagline}</p>
                <p className="text-[11px] text-neutral-400 leading-relaxed pt-1">
                  {st.description}
                </p>
              </div>

              {/* Specs Pill */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-neutral-400">
                <span>{st.lightingType}</span>
                <span className="font-semibold text-neutral-300">{st.idealFor.split(",")[0]}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Product Preservation Guarantee Box */}
      <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-emerald-300">
              100% Product Fidelity &amp; Detail Preservation
            </h2>
            <p className="text-[11px] text-neutral-300">
              Shape, color, brand logos, packaging, fabric weave, and fine product textures remain completely original.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-emerald-200/90 font-medium shrink-0">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">✔ True Color</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">✔ Logo Integrity</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">✔ Fabric Weave</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">✔ Packaging Shape</span>
        </div>
      </div>

      {/* Interactive Before & After Comparison Slider */}
      {activeVariation && (
        <div className="bg-[#0c0e1a] border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-brand-purple" />
                <span>Original vs. Enhanced Comparison</span>
              </h2>
              <p className="text-xs text-neutral-400">
                Drag the slider or toggle to see lighting and background enhancement.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSliderPosition(sliderPosition === 50 ? 0 : 50)}
                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-neutral-300 cursor-pointer"
              >
                {sliderPosition === 0 ? "Show Split (50/50)" : "Show Enhanced Only"}
              </button>
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

          {/* Slider Container */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] max-h-[380px] w-full rounded-xl overflow-hidden select-none bg-black/60 border border-white/10">
            {/* Base (Enhanced Image) */}
            <img
              src={activeVariation.enhancedUrl}
              alt="Enhanced variation"
              className="absolute inset-0 w-full h-full object-contain"
            />
            <div className="absolute top-3 right-3 px-2 py-1 rounded bg-brand-purple/90 backdrop-blur-md text-white text-[10px] font-bold shadow-md">
              AI Enhanced ({activeVariation.styleName})
            </div>

            {/* Clipped Overlay (Original Image) */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={activeVariation.originalUrl || primaryOriginal}
                alt="Original uploaded product"
                className="absolute inset-0 w-full h-full object-contain max-w-none"
                style={{ width: "100%", height: "100%" }}
              />
              <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/80 backdrop-blur-md text-neutral-300 text-[10px] font-bold shadow-md border border-white/10">
                Original Photo
              </div>
            </div>

            {/* Split Line & Drag Handle */}
            <div
              className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] cursor-ew-resize pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-black shadow-xl flex items-center justify-center font-bold text-xs pointer-events-auto cursor-ew-resize">
                ⇄
              </div>
            </div>

            {/* Transparent Range Input Overlay for Dragging */}
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
        </div>
      )}

      {/* Enhancement Variations Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-pink" />
              <span>Select Your Enhanced Variations ({selectedEnhancedIds.length} selected)</span>
            </h2>
            <p className="text-xs text-neutral-400">
              Pick the enhanced lighting looks you want to carry forward into your photoshoot.
            </p>
          </div>

          <button
            type="button"
            onClick={onRegenerateAll}
            disabled={isEnhancing}
            className="text-xs text-brand-purple hover:text-white flex items-center gap-1.5 font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            {isEnhancing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RotateCcw className="w-3.5 h-3.5" />
            )}
            <span>Regenerate All Looks</span>
          </button>
        </div>

        {/* 3 Variations Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {enhancedVariations.map((variation) => {
            const isSelected = selectedEnhancedIds.includes(variation.id);
            const isComparing = activeComparisonId === variation.id;

            return (
              <div
                key={variation.id}
                className={`rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#151224] border-brand-purple shadow-xl shadow-brand-purple/20 ring-1 ring-brand-purple"
                    : "bg-[#0f111e] border-white/10 hover:border-white/20"
                }`}
              >
                {/* Image Preview */}
                <div
                  className="relative aspect-square w-full bg-black/40 overflow-hidden cursor-pointer group"
                  onClick={() => setActiveComparisonId(variation.id)}
                >
                  <img
                    src={variation.enhancedUrl}
                    alt={variation.styleName}
                    className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-brand-purple text-white text-[10px] font-bold shadow-md flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Selected</span>
                    </div>
                  )}

                  {/* Inspect / Zoom button */}
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

                  {/* Active Comparison Indicator */}
                  {isComparing && (
                    <div className="absolute bottom-2 left-2 right-2 py-1 px-2 rounded-lg bg-black/80 backdrop-blur-md text-white text-[10px] text-center font-semibold border border-brand-purple/40">
                      Viewing in Comparison Slider
                    </div>
                  )}
                </div>

                {/* Details & Actions */}
                <div className="p-3.5 space-y-3 bg-[#111322]">
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center justify-between">
                      <span>{variation.styleName}</span>
                      <span className="text-[10px] text-neutral-400 font-normal">
                        Variation #{variation.id.slice(-2)}
                      </span>
                    </h3>
                    <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                      {variation.description}
                    </p>
                  </div>

                  {/* Action Buttons: Pick vs Reject vs Regenerate */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => onVariationToggle(variation.id)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? "bg-brand-purple text-white shadow-md shadow-brand-purple/30"
                          : "bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isSelected ? "Selected" : "Select"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onRegenerateVariation(variation.id)}
                      disabled={variation.isRegenerating}
                      className="py-1.5 px-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs font-semibold border border-white/10 flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
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
            className="relative max-w-4xl max-h-[90vh] w-full bg-[#0a0d1a] border border-white/20 rounded-2xl p-4 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold text-white">Full-Resolution Enhanced Preview</span>
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
                src={lightboxImageUrl}
                alt="Enhanced preview"
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Upload</span>
        </button>

        <button
          type="button"
          disabled={selectedEnhancedIds.length === 0}
          onClick={onNext}
          className="px-6 py-3 rounded-full bg-brand-gradient hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-brand-purple/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>Continue to Photoshoot Style</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
