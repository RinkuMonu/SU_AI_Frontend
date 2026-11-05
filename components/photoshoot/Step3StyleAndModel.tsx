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
        <div style={{ backgroundColor: "#081226", fontFamily: "'Roboto', sans-serif" }} className="border border-[#1e2a4a] rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1e2a4a]">
            <div>
              <div className="flex items-center gap-3">
                <span 
                  style={{ background: "linear-gradient(135deg, rgba(47, 18, 98, 0.5) 0%, rgba(20, 10, 45, 0.25) 100%)" }}
                  className="w-8 h-8 rounded-xl border border-[#8b5cf6]/40 text-purple-200 flex items-center justify-center shrink-0 shadow-sm"
                >
                  <Users className="w-4 h-4 text-[#c084fc] stroke-[1.8]" />
                </span>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 
                    style={{ fontSize: "22px", fontFamily: "'Roboto', sans-serif" }}
                    className="font-normal text-white tracking-normal leading-tight"
                  >
                    Select AI Fashion Model
                  </h2>
                  <span className="text-rose-400 font-normal text-xs">*Mandatory</span>
                  {selectedModel && (
                    <span 
                      style={{ background: "rgba(47, 18, 98, 0.45)" }}
                      className="text-xs px-3 py-1 rounded-full text-purple-200 border border-[#8b5cf6]/35 font-normal"
                    >
                      Selected: {selectedModel.name}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-normal pl-11">
                Select a diverse AI model suited for {currentCategoryInfo?.label || "your product"}.
              </p>
            </div>

            {/* Gender Filters: Background #081226 matching Image 2 */}
            <div 
              style={{ backgroundColor: "#071023" }}
              className="flex items-center border border-[#26314c] rounded-full p-1 self-start sm:self-auto shrink-0 shadow-sm"
            >
              <button
                type="button"
                onClick={() => setGenderFilter("all")}
                style={{
                  backgroundColor: "#081226",
                }}
                className={'px-4 sm:px-5 py-1.5 sm:py-2 rounded-full font-normal text-xs sm:text-sm transition-all cursor-pointer ' + (
                  genderFilter === "all"
                    ? "border border-[#8b5cf6] text-purple-100 shadow-md shadow-purple-950/40"
                    : "border border-transparent text-slate-400 hover:text-white"
                )}
              >
                All ({modelsPool.length})
              </button>
              <button
                type="button"
                onClick={() => setGenderFilter("female")}
                style={{
                  backgroundColor: "#081226",
                }}
                className={'px-4 sm:px-5 py-1.5 sm:py-2 rounded-full font-normal text-xs sm:text-sm transition-all cursor-pointer ' + (
                  genderFilter === "female"
                    ? "border border-[#8b5cf6] text-purple-100 shadow-md shadow-purple-950/40"
                    : "border border-transparent text-slate-400 hover:text-white"
                )}
              >
                Female
              </button>
              <button
                type="button"
                onClick={() => setGenderFilter("male")}
                style={{
                  backgroundColor: "#081226",
                }}
                className={'px-4 sm:px-5 py-1.5 sm:py-2 rounded-full font-normal text-xs sm:text-sm transition-all cursor-pointer ' + (
                  genderFilter === "male"
                    ? "border border-[#8b5cf6] text-purple-100 shadow-md shadow-purple-950/40"
                    : "border border-transparent text-slate-400 hover:text-white"
                )}
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
                  style={isSelected ? {
                    boxShadow: "0 0 12px rgba(139, 92, 246, 0.28)",
                  } : {}}
                  className={'rounded-2xl border text-left overflow-hidden transition-all cursor-pointer flex flex-col justify-between group ' + (
                    isSelected
                      ? "bg-[#131E42] border-2 border-[#8b5cf6] ring-1 ring-[#8b5cf6]/40 scale-[1.02]"
                      : "bg-[#0c1630] hover:bg-[#121E45] border-[#1e2a4a]"
                  )}
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
                      <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-black/80 flex flex-col items-center justify-center text-text-muted p-2">
                        <UserCheck className="w-7 h-7 text-purple-300 mb-1" />
                        <span className="text-[11px] text-center text-white font-normal">{model.name}</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-1.5 left-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-white text-[9px] font-normal border border-white/10">
                        {model.gender === "male" ? "Male" : "Female"}
                      </span>
                    </div>

                    {isSelected && (
                      <div 
                        style={{ background: "linear-gradient(135deg, rgba(47, 18, 98, 0.8) 0%, rgba(20, 10, 45, 0.5) 100%)" }}
                        className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full border border-[#8b5cf6] text-purple-100 flex items-center justify-center shadow-md"
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}

                    <div className="absolute bottom-1.5 left-1.5 right-1.5">
                      <span className="text-xs font-normal text-white block leading-tight truncate">
                        {model.name}
                      </span>
                      {isSelected ? (
                        <span className="text-[10px] text-purple-200 font-normal block">
                          Selected
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 block truncate font-normal">
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
      <div style={{ backgroundColor: "#081226", fontFamily: "'Roboto', sans-serif" }} className="border border-[#1e2a4a] rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1e2a4a]">
          <div>
            <div className="flex items-center gap-3">
              <span 
                style={{ background: "linear-gradient(135deg, rgba(47, 18, 98, 0.5) 0%, rgba(20, 10, 45, 0.25) 100%)" }}
                className="w-8 h-8 rounded-xl border border-[#8b5cf6]/40 text-purple-200 flex items-center justify-center shrink-0 shadow-sm"
              >
                <Camera className="w-4 h-4 text-[#c084fc] stroke-[1.8]" />
              </span>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 
                  style={{ fontSize: "22px", fontFamily: "'Roboto', sans-serif" }}
                  className="font-normal text-white tracking-normal leading-tight"
                >
                  {isAvatarMode
                    ? "Select Model Photography Poses"
                    : "Select Commercial Photography Styles"}
                </h2>
                <span 
                  style={{ background: "rgba(47, 18, 98, 0.45)" }}
                  className="text-xs px-3 py-1 rounded-full text-purple-200 border border-[#8b5cf6]/35 font-normal"
                >
                  {selectedStyles.length} Selected
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-normal pl-11">
              {isAvatarMode
                ? "Choose one or more angles and poses for the AI model to showcase your apparel."
                : "Choose one or more lighting environments and studio compositions for your product."}
            </p>
          </div>

          <span className="text-xs text-purple-300 font-normal self-start sm:self-auto">
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
                style={isSelected ? {
                  boxShadow: "0 0 12px rgba(139, 92, 246, 0.28)",
                } : {}}
                className={'rounded-2xl border text-left overflow-hidden transition-all cursor-pointer flex flex-col justify-between group ' + (
                  isSelected
                    ? "bg-[#131E42] border-2 border-[#8b5cf6] ring-1 ring-[#8b5cf6]/40"
                    : "bg-[#0c1630] hover:bg-[#121E45] border-[#1e2a4a]"
                )}
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
                    <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-black/80 flex flex-col items-center justify-center text-text-muted p-2">
                      <Camera className="w-6 h-6 text-purple-400/60 mb-1" />
                      <span className="text-[10px] text-center text-slate-300 font-normal line-clamp-1">{style.name}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-purple-200 text-[10px] font-normal border border-white/10">
                      {style.badge}
                    </span>
                  </div>

                  {/* Checkbox Icon */}
                  <div 
                    style={isSelected ? {
                      background: "linear-gradient(135deg, rgba(47, 18, 98, 0.8) 0%, rgba(20, 10, 45, 0.5) 100%)",
                    } : {}}
                    className={'absolute top-2 right-2 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ' + (
                      isSelected ? "border-[#8b5cf6] text-purple-100 shadow-md" : "border-white/30 bg-black/50"
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-3.5 space-y-1 bg-[#0a142c] flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-normal text-white group-hover:text-purple-200 transition-colors leading-tight">
                      {style.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 mt-1 font-normal">
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
          className="px-6 py-2.5 rounded-full bg-[#0c1630] hover:bg-[#152347] border border-[#26314c] text-slate-300 hover:text-white text-xs font-normal flex items-center gap-2 cursor-pointer transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          disabled={!canProceed}
          onClick={onNext}
          style={{
            background: "linear-gradient(95deg, #7d36fa 0%, #9534fd 18%, #b233fe 36%, #c835ef 52%, #df3dbb 68%, #ee4795 82%, #f76f7b 92%, #fc9a5d 100%)",
          }}
          className="px-9 py-3.5 rounded-full text-white font-medium text-xs sm:text-sm shadow-xl shadow-purple-600/35 hover:opacity-95 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>Continue to Instructions</span>
          <ArrowRight className="w-4 h-4 text-white stroke-[2.2]" />
        </button>
      </div>
    </div>
  );
};
