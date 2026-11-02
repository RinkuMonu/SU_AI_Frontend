"use client";

import React, { useMemo, useState } from "react";
import { 
  Sparkles, 
  UserCheck, 
  Box, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Users, 
  Camera, 
  AlertCircle
} from "lucide-react";
import { 
  AIModelProfile, 
  EnhancedVariation,
  PhotographyStyleOption, 
  ProductCategory,
  PhotoshootTabMode
} from "./types";
import { 
  AI_MODELS, 
  MODEL_POSES_CLOTHING, 
  MODEL_POSES_JEWELLERY, 
  PRODUCT_ONLY_STYLES,
  PRODUCT_CATEGORIES 
} from "./data";

interface Step3StyleAndModelProps {
  mode?: PhotoshootTabMode;
  productCategory: ProductCategory;
  withModel?: boolean;
  selectedEnhancedImage?: EnhancedVariation | null;
  selectedModelId: string | null;
  selectedStyles: string[];
  customModels?: AIModelProfile[];
  customStyles?: PhotographyStyleOption[];
  onToggleWithModel?: (withModel: boolean) => void;
  onModelSelect: (modelId: string | null) => void;
  onStyleToggle: (styleId: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export const Step3StyleAndModel: React.FC<Step3StyleAndModelProps> = ({
  mode = "avatar",
  productCategory,
  selectedEnhancedImage,
  selectedModelId,
  selectedStyles,
  customModels,
  customStyles,
  onModelSelect,
  onStyleToggle,
  onBack,
  onNext,
}) => {
  const isAvatarMode = mode === "avatar";
  const modelsPool = customModels && customModels.length > 0 ? customModels : AI_MODELS;
  const [genderFilter, setGenderFilter] = useState<"all" | "female" | "male">("all");

  // Filter models based on product category & gender filter
  const filteredModels = useMemo(() => {
    let pool = modelsPool;
    if (productCategory === "mens_clothing") {
      pool = pool.filter((m) => m.gender === "male");
    } else if (productCategory === "womens_clothing") {
      pool = pool.filter((m) => m.gender === "female");
    }

    if (genderFilter !== "all") {
      pool = pool.filter((m) => m.gender === genderFilter);
    }
    return pool;
  }, [productCategory, modelsPool, genderFilter]);

  // Determine available poses/styles
  const availableStyles: PhotographyStyleOption[] = useMemo(() => {
    if (isAvatarMode) {
      if (customStyles && customStyles.length > 0) {
        return customStyles;
      }
      if (productCategory === "jewellery_accessories" || productCategory === "beauty_cosmetics") {
        return MODEL_POSES_JEWELLERY;
      }
      return MODEL_POSES_CLOTHING;
    } else {
      // In product mode, ensure all 9 canonical product styles are available
      if (!customStyles || customStyles.length === 0) {
        return PRODUCT_ONLY_STYLES;
      }
      const map = new Map<string, PhotographyStyleOption>();
      PRODUCT_ONLY_STYLES.forEach((s) => map.set(s.id, s));
      customStyles.forEach((cs) => {
        if (cs.category !== "model") {
          map.set(cs.id, cs);
        }
      });
      return Array.from(map.values());
    }
  }, [isAvatarMode, productCategory, customStyles]);

  const selectedModel = modelsPool.find((m) => m.id === selectedModelId);
  const currentCategoryInfo = PRODUCT_CATEGORIES.find((c) => c.id === productCategory);

  const canProceed = isAvatarMode 
    ? Boolean(selectedModelId) && selectedStyles.length > 0
    : selectedStyles.length > 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Active Enhanced Product Header Connection */}
      {selectedEnhancedImage && (
        <div className="bg-surface border border-brand-purple/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm bg-gradient-to-r from-brand-purple/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-black/60 overflow-hidden shrink-0 border border-brand-purple/40 p-1 flex items-center justify-center">
              <img
                src={selectedEnhancedImage.enhancedUrl}
                alt={selectedEnhancedImage.styleName}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Active Enhanced Product</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-purple/20 text-brand-pink font-semibold border border-brand-purple/30">
                  {selectedEnhancedImage.styleName}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                {isAvatarMode
                  ? "This enhanced product image will be naturally draped and styled onto your selected AI model."
                  : "This enhanced product image will be placed into your chosen photography style composition."}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* SECTION 1: AI MODEL SELECTION (AVATAR MODE ONLY - MANDATORY) */}
      {isAvatarMode && (
        <div className="bg-[#0B132B] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-purple" />
                <span>Select AI Fashion Model</span>
                <span className="text-rose-400 font-semibold text-xs">*Mandatory</span>
                {selectedModel && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#2D164D] border border-[#A855F7]/40 text-[#E085FF] font-bold">
                    Selected: {selectedModel.name}
                  </span>
                )}
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Select a diverse AI model suited for {currentCategoryInfo?.label || "your product"}.
              </p>
            </div>

            {/* Gender Filters */}
            <div className="flex items-center bg-[#071023] border border-white/10 rounded-xl p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setGenderFilter("all")}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  genderFilter === "all" ? "bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white shadow" : "text-text-muted hover:text-white"
                }`}
              >
                All ({modelsPool.length})
              </button>
              <button
                type="button"
                onClick={() => setGenderFilter("female")}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  genderFilter === "female" ? "bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white shadow" : "text-text-muted hover:text-white"
                }`}
              >
                Female
              </button>
              <button
                type="button"
                onClick={() => setGenderFilter("male")}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  genderFilter === "male" ? "bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white shadow" : "text-text-muted hover:text-white"
                }`}
              >
                Male
              </button>
            </div>
          </div>

          {/* Validation Notice if no model selected */}
          {!selectedModelId && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Model selection is mandatory for AI Avatar Photoshoot. Please pick a model below.</span>
            </div>
          )}

          {/* Model Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
            {filteredModels.map((model) => {
              const isSelected = selectedModelId === model.id;
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => onModelSelect(model.id)}
                  className={`rounded-xl border text-left overflow-hidden transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? "bg-[#131E42] border-2 border-[#BE32FF] ring-2 ring-[#BE32FF]/30 shadow-[0_0_15px_rgba(190,50,255,0.25)] scale-[1.02]"
                      : "bg-[#0E1838] hover:bg-[#121E45] border-white/10"
                  }`}
                >
                  {/* Model Photo Preview */}
                  <div className="relative aspect-[3/4] w-full bg-black/40 overflow-hidden flex items-center justify-center">
                    {model.avatarUrl && model.avatarUrl.trim() ? (
                      <img
                        src={model.avatarUrl}
                        alt={model.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand-pink/20 to-black/80 flex flex-col items-center justify-center text-text-muted p-2">
                        <UserCheck className="w-7 h-7 text-brand-pink/70 mb-1" />
                        <span className="text-[11px] text-center text-white font-semibold">{model.name}</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-1.5 left-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-white text-[9px] font-semibold border border-white/10">
                        {model.gender === "male" ? "Male" : "Female"}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white flex items-center justify-center shadow-lg">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}

                    <div className="absolute bottom-1.5 left-1.5 right-1.5">
                      <span className="text-xs font-bold text-white block leading-tight truncate">
                        {model.name}
                      </span>
                      {isSelected ? (
                        <span className="text-[10px] text-emerald-400 font-bold block">
                          Selected
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 block truncate font-medium">
                          {model.specialty.split("&")[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: PHOTOGRAPHY STYLES & POSES */}
      <div className="bg-[#0B132B] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#E085FF]" />
              <span>
                {isAvatarMode
                  ? "Select Model Photography Poses"
                  : "Select Commercial Photography Styles"}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#2D164D] text-[#E085FF] font-bold border border-[#A855F7]/40">
                {selectedStyles.length} Selected
              </span>
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              {isAvatarMode
                ? "Choose one or more angles and poses for the AI model to showcase your apparel."
                : "Choose one or more lighting environments and studio compositions for your product."}
            </p>
          </div>

          <span className="text-xs text-brand-purple font-semibold self-start sm:self-auto">
            Multiple selections allowed
          </span>
        </div>

        {/* Photography Styles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3.5 pt-1">
          {availableStyles.map((style) => {
            const isSelected = selectedStyles.includes(style.id);
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onStyleToggle(style.id)}
                className={`rounded-xl border text-left overflow-hidden transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? "bg-[#131E42] border-2 border-[#BE32FF] ring-2 ring-[#BE32FF]/30 shadow-[0_0_15px_rgba(190,50,255,0.25)]"
                    : "bg-[#0E1838] hover:bg-[#121E45] border-white/10"
                }`}
              >
                {/* Visual Image Preview */}
                <div className="relative aspect-[4/3] w-full bg-black/40 overflow-hidden flex items-center justify-center">
                  {style.previewUrl && style.previewUrl.trim() ? (
                    <img
                      src={style.previewUrl}
                      alt={style.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-purple/20 to-black/80 flex flex-col items-center justify-center text-text-muted p-2">
                      <Camera className="w-6 h-6 text-brand-purple/60 mb-1" />
                      <span className="text-[10px] text-center text-text-muted font-medium line-clamp-1">{style.name}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-text-secondary text-[10px] font-semibold border border-white/10">
                      {style.badge}
                    </span>
                  </div>

                  {/* Checkbox Icon */}
                  <div className={`absolute top-2 right-2 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected ? "border-transparent bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white shadow" : "border-white/30 bg-black/50"
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-3 space-y-1 bg-[#0a142c] flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-brand-pink transition-colors leading-tight">
                      {style.name}
                    </h3>
                    <p className="text-[11px] text-text-muted leading-snug line-clamp-2 mt-1">
                      {style.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

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
          disabled={!canProceed}
          onClick={onNext}
          className="px-7 py-3 rounded-full bg-gradient-to-r from-[#A855F7] to-[#EC4899] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(236,72,153,0.4)] flex items-center gap-2 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>Continue to Instructions</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
