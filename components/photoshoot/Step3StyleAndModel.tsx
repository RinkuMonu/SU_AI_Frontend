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
  Layers, 
  CheckCircle2, 
  Filter,
  Info,
  AlertCircle
} from "lucide-react";
import { 
  AIModelProfile, 
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
    if (customStyles && customStyles.length > 0) {
      return customStyles;
    }
    if (isAvatarMode) {
      if (productCategory === "jewellery_accessories" || productCategory === "beauty_cosmetics") {
        return MODEL_POSES_JEWELLERY;
      }
      return MODEL_POSES_CLOTHING;
    } else {
      return PRODUCT_ONLY_STYLES;
    }
  }, [isAvatarMode, productCategory, customStyles]);

  const selectedModel = modelsPool.find((m) => m.id === selectedModelId);
  const currentCategoryInfo = PRODUCT_CATEGORIES.find((c) => c.id === productCategory);

  // Validation: In avatar mode, model is mandatory and at least one style is selected
  // In product mode, at least one style is selected
  const canProceed = isAvatarMode 
    ? Boolean(selectedModelId) && selectedStyles.length > 0
    : selectedStyles.length > 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-purple text-xs font-semibold">
          <Camera className="w-3.5 h-3.5" />
          <span>
            {isAvatarMode 
              ? "Step 3 of 5 • Choose Model & Style" 
              : "Step 3 of 5 • Choose Photography Style"}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {isAvatarMode ? "Choose Your Model & Poses" : "Choose Photography Styles"}
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
          {isAvatarMode
            ? "Model selection is mandatory. Pick an AI model to showcase your apparel and select your desired poses."
            : "Select one or more visual photography styles for your commercial product-only photoshoot."}
        </p>
      </div>

      {/* SECTION 1: AI MODEL SELECTION (AVATAR MODE ONLY - MANDATORY) */}
      {isAvatarMode && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0b0e1b] border border-white/10 rounded-2xl p-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-purple" />
                <span>Select AI Model <span className="text-rose-400 font-semibold">*Mandatory</span></span>
                {selectedModel && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-brand-pink font-semibold">
                    Selected: {selectedModel.name} ({selectedModel.gender === "male" ? "Male" : "Female"})
                  </span>
                )}
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Curated models for <span className="text-brand-purple font-medium">{currentCategoryInfo?.label || "your product"}</span>.
              </p>
            </div>

            {/* Gender Filters */}
            <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setGenderFilter("all")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  genderFilter === "all" ? "bg-brand-purple text-white shadow" : "text-neutral-400 hover:text-white"
                }`}
              >
                All Models ({modelsPool.length})
              </button>
              <button
                type="button"
                onClick={() => setGenderFilter("female")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  genderFilter === "female" ? "bg-brand-purple text-white shadow" : "text-neutral-400 hover:text-white"
                }`}
              >
                Female
              </button>
              <button
                type="button"
                onClick={() => setGenderFilter("male")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  genderFilter === "male" ? "bg-brand-purple text-white shadow" : "text-neutral-400 hover:text-white"
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
              <span>Please select an AI model below to continue. Model selection is required for AI Avatar Photoshoot.</span>
            </div>
          )}

          {/* Model Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {filteredModels.map((model) => {
              const isSelected = selectedModelId === model.id;
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => onModelSelect(model.id)}
                  className={`rounded-2xl border text-left overflow-hidden transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? "bg-[#181329] border-brand-purple shadow-xl shadow-brand-purple/30 ring-2 ring-brand-purple scale-[1.02]"
                      : "bg-[#0f1120] hover:bg-[#141628] border-white/10 hover:border-white/20"
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
                      <div className="w-full h-full bg-gradient-to-br from-brand-pink/20 via-black/40 to-black/80 flex flex-col items-center justify-center text-neutral-400 p-3">
                        <UserCheck className="w-8 h-8 text-brand-pink/70 mb-1" />
                        <span className="text-xs text-center text-white font-semibold">{model.name}</span>
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />

                    {/* Gender Badge */}
                    <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                      <span className="px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-white text-[9px] font-semibold border border-white/10">
                        {model.gender === "male" ? "Male" : "Female"}
                      </span>
                    </div>

                    {/* Selected Checkmark */}
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-brand-purple text-white flex items-center justify-center shadow-lg">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}

                    {/* Bottom Info inside image */}
                    <div className="absolute bottom-1.5 left-1.5 right-1.5">
                      <span className="text-xs font-bold text-white block leading-tight">
                        {model.name}
                      </span>
                      <span className="text-[10px] text-brand-pink block truncate font-medium">
                        {model.specialty.split("&")[0]}
                      </span>
                      <span className="text-[8px] text-neutral-400 block font-mono">
                        {model.ethnicity}
                      </span>
                    </div>
                  </div>

                  {/* Description footer */}
                  <div className="p-2 border-t border-white/5 bg-[#121422] text-[9px] text-neutral-400">
                    <p className="line-clamp-2 leading-tight">
                      {model.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: PHOTOGRAPHY STYLES & POSES */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-brand-purple" />
              <span>
                {isAvatarMode
                  ? "Select Model Photography Poses"
                  : "Select Commercial Photography Styles"}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 font-normal">
                {selectedStyles.length} selected
              </span>
            </h2>
            <p className="text-xs text-neutral-400">
              {isAvatarMode
                ? "Choose one or more angles and poses for the AI model."
                : "Choose one or more lighting environments and compositions for your product."}
            </p>
          </div>

          <span className="text-xs text-brand-purple font-medium">
            Multiple selections allowed
          </span>
        </div>

        {/* Photography Styles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {availableStyles.map((style) => {
            const isSelected = selectedStyles.includes(style.id);
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onStyleToggle(style.id)}
                className={`rounded-2xl border text-left overflow-hidden transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? "bg-[#161226] border-brand-purple shadow-xl shadow-brand-purple/20 ring-2 ring-brand-purple"
                    : "bg-[#0f1120] hover:bg-[#141628] border-white/10 hover:border-white/20"
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
                    <div className="w-full h-full bg-gradient-to-br from-brand-purple/20 via-black/40 to-black/80 flex flex-col items-center justify-center text-neutral-400 p-2">
                      <Camera className="w-6 h-6 text-brand-purple/60 mb-1" />
                      <span className="text-[10px] text-center text-neutral-300 font-medium line-clamp-1">{style.name}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-neutral-300 text-[10px] font-semibold border border-white/10">
                      {style.badge}
                    </span>
                  </div>

                  {/* Checkbox Icon */}
                  <div className={`absolute top-2 right-2 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected ? "border-brand-purple bg-brand-purple text-white shadow-md" : "border-white/30 bg-black/50"
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-3 space-y-1 bg-[#111322] flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-brand-pink transition-colors leading-tight">
                      {style.name}
                    </h3>
                    <p className="text-[11px] text-neutral-400 leading-snug line-clamp-2 mt-1">
                      {style.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Enhancement</span>
        </button>

        <button
          type="button"
          disabled={!canProceed}
          onClick={onNext}
          className="px-6 py-3 rounded-full bg-brand-gradient hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-brand-purple/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>Continue to Instructions</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
