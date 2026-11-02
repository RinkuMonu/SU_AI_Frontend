"use client";

import React from "react";
import { 
  Sparkles, 
  MessageSquareText, 
  Wand2, 
  ArrowRight, 
  ArrowLeft, 
  Camera, 
  UserCheck, 
  Box, 
  Info,
  Loader2
} from "lucide-react";
import { VoiceInputButton } from "@/components/ui/VoiceInput";
import { 
  AIModelProfile, 
  EnhancedVariation,
  EnhancementStyle, 
  PhotoshootUploadedImage, 
  ProductCategory,
  PhotoshootTabMode
} from "./types";
import { 
  AI_MODELS, 
  ENHANCEMENT_STYLES, 
  PRODUCT_CATEGORIES,
  MODEL_POSES_CLOTHING,
  MODEL_POSES_JEWELLERY,
  PRODUCT_ONLY_STYLES
} from "./data";

interface Step4PromptAndVoiceProps {
  mode?: PhotoshootTabMode;
  customPrompt: string;
  productCategory: ProductCategory;
  productName: string;
  productColor: string;
  enhancementStyle: EnhancementStyle;
  selectedEnhancedImage?: EnhancedVariation | null;
  withModel?: boolean;
  selectedModelId: string | null;
  selectedStyles: string[];
  uploadedImages: PhotoshootUploadedImage[];
  isGenerating: boolean;
  preparedPrompt?: string;
  isPreparingPrompt?: boolean;
  onPreparePrompt?: () => void;
  onPromptChange: (prompt: string) => void;
  onBack: () => void;
  onGenerate: () => void;
}

const MAX_PROMPT_LENGTH = 600;

const AVATAR_PROMPT_PRESETS = [
  "High-fashion editorial pose with soft studio daylight and clean luxury background",
  "Casual urban streetwear setting with natural golden hour bokeh and confident expression",
  "Keep the original product colour, texture, and label details completely accurate",
  "Show the model in a modern luxury lifestyle setting with soft warm lighting",
  "Modern minimalist studio portrait with crisp fabric draping and commercial lighting",
  "Classic Indian festive aesthetic with warm marigold lighting and rich traditional ambience",
];

const PRODUCT_PROMPT_PRESETS = [
  "Make the background more luxurious with marble textures and subtle architectural accents",
  "Use soft golden lighting with warm natural shadows and crisp highlights",
  "Create a premium product advertisement with clean commercial studio presentation",
  "Keep the original product colour, texture, and packaging details completely unchanged",
  "Show the product in a modern lifestyle setting with elegant ambient daylight",
  "Position on a minimalist travertine stone pedestal with soft botanical shadows",
];

export const Step4PromptAndVoice: React.FC<Step4PromptAndVoiceProps> = ({
  mode = "avatar",
  customPrompt,
  productCategory,
  productName,
  productColor,
  enhancementStyle,
  selectedEnhancedImage,
  selectedModelId,
  selectedStyles,
  uploadedImages,
  isGenerating,
  preparedPrompt,
  isPreparingPrompt,
  onPreparePrompt,
  onPromptChange,
  onBack,
  onGenerate,
}) => {
  const isAvatarMode = mode === "avatar";
  const selectedModel = AI_MODELS.find((m) => m.id === selectedModelId);
  const selectedStyleObj = ENHANCEMENT_STYLES.find((s) => s.id === enhancementStyle);
  const currentCategoryInfo = PRODUCT_CATEGORIES.find((c) => c.id === productCategory);

  const allStylesPool = isAvatarMode
    ? [...MODEL_POSES_CLOTHING, ...MODEL_POSES_JEWELLERY]
    : PRODUCT_ONLY_STYLES;
  const styleNames = selectedStyles
    .map((sId) => allStylesPool.find((s) => s.id === sId)?.name || sId)
    .join(", ");

  const presetsToUse = isAvatarMode ? AVATAR_PROMPT_PRESETS : PRODUCT_PROMPT_PRESETS;

  const handleApplyPreset = (preset: string) => {
    if (customPrompt.trim()) {
      onPromptChange(`${customPrompt.trim()}, ${preset}`);
    } else {
      onPromptChange(preset);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Prompt Input with Voice Dictation (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0B132B] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
            {/* Header */}
            <div className="pb-3 border-b border-white/10">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Step 4 — Give your instructions</span>
                <span className="text-xs text-text-muted font-normal">(Optional)</span>
              </h2>
              <p className="text-xs text-text-muted mt-1">
                Tell the AI how you want your photoshoot to look. Type or use the microphone to dictate in your preferred language.
              </p>
            </div>

            {/* Instruction Field Header */}
            <div className="flex items-center justify-between pt-1">
              <label htmlFor="photoshoot-prompt" className="text-xs font-semibold text-text-secondary flex items-center gap-2">
                <Wand2 className="w-3.5 h-3.5 text-brand-pink" />
                <span>Optional creative direction</span>
              </label>

              <div className="flex items-center gap-2">
                <VoiceInputButton
                  onTranscript={(text) => onPromptChange(text)}
                  currentValue={customPrompt}
                  size="sm"
                  tooltip="Speak instructions in Hindi, English, or Hinglish"
                />
                <span className="text-[11px] font-mono text-text-muted">
                  {customPrompt.length} / {MAX_PROMPT_LENGTH}
                </span>
              </div>
            </div>

            {/* Prompt Textarea */}
            <div className="relative">
              <textarea
                id="photoshoot-prompt"
                rows={4}
                maxLength={MAX_PROMPT_LENGTH}
                value={customPrompt}
                onChange={(e) => onPromptChange(e.target.value)}
                placeholder={
                  isAvatarMode
                    ? "Create a premium, realistic ecommerce photoshoot. Keep the original product colour, fabric, shape and details accurate. Use soft studio lighting and a clean luxury background."
                    : "Create a commercial product photography shoot. Place product on white marble pedestal with soft morning daylight and clean shadows. Keep packaging details sharp and true to life."
                }
                className="w-full rounded-xl bg-[#071023] border border-white/15 p-3.5 pb-10 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#BE32FF] focus:ring-1 focus:ring-[#BE32FF] resize-none leading-relaxed"
              />

              <div className="absolute right-2.5 bottom-2.5">
                <VoiceInputButton
                  onTranscript={(text) => onPromptChange(text)}
                  currentValue={customPrompt}
                  size="sm"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-0.5">
              <span>🎤 Voice input button available above — Hindi, English and other supported languages.</span>
            </p>

            {/* Preset Inspiration Chips */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-[11px] font-semibold text-text-secondary block">
                Quick Inspiration (Click to append):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {presetsToUse.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-[#071023] hover:bg-[#131E42] border border-white/10 hover:border-[#BE32FF]/40 text-text-muted hover:text-white transition-colors cursor-pointer text-left"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Backend Prompt Preview Accordion */}
            {onPreparePrompt && (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>Synthesized AI Prompt</span>
                  </span>
                  <button
                    type="button"
                    disabled={isPreparingPrompt}
                    onClick={onPreparePrompt}
                    className="text-xs text-[#E085FF] hover:text-[#EC4899] font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isPreparingPrompt ? "Synthesizing..." : "Preview Directives ↻"}
                  </button>
                </div>

                {preparedPrompt ? (
                  <div className="p-3 rounded-xl bg-[#071023] border border-white/10 text-[11px] text-text-secondary font-mono leading-relaxed max-h-28 overflow-y-auto">
                    {preparedPrompt}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: "Your current setup" Summary Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0B132B] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 pb-2.5 border-b border-white/10">
              <Sparkles className="w-4 h-4 text-[#BE32FF]" />
              <span>Your current setup</span>
            </h2>

            {/* Product Snapshot */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#071023] border border-border">
              <div className="w-12 h-12 rounded-lg bg-black/60 overflow-hidden shrink-0 border border-white/10">
                {uploadedImages[0]?.previewUrl && uploadedImages[0].previewUrl.trim() ? (
                  <img
                    src={uploadedImages[0].previewUrl}
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted">
                    <Box className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-white block truncate">
                  {productName || currentCategoryInfo?.label || "Product"}
                </span>
                <span className="text-[11px] text-brand-purple block truncate">
                  Category: {currentCategoryInfo?.label || "General"}
                </span>
                {productColor && (
                  <span className="text-[10px] text-text-muted block truncate">
                    Color: {productColor}
                  </span>
                )}
              </div>
            </div>

            {/* Clean Setup Summary Rows */}
            <div className="space-y-2 text-xs divide-y divide-border">
              <div className="flex items-center justify-between pt-1 pb-1.5">
                <span className="text-text-muted">Workflow:</span>
                <span className="font-bold text-white">
                  {isAvatarMode ? "AI Avatar Photoshoot" : "AI Product Photography"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-text-muted">Selected Enhancement:</span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  {selectedEnhancedImage?.enhancedUrl && (
                    <img
                      src={selectedEnhancedImage.enhancedUrl}
                      alt="Enhanced"
                      className="w-4 h-4 rounded object-cover border border-brand-purple/40"
                    />
                  )}
                  <span>
                    {selectedEnhancedImage?.styleName || selectedStyleObj?.name || "Studio Premium"}
                  </span>
                </span>
              </div>

              {isAvatarMode && (
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-text-muted">Selected Model:</span>
                  <span className="font-bold text-brand-pink">
                    {selectedModel?.name || "Selected Model"}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between py-1.5">
                <span className="text-text-muted">
                  {isAvatarMode ? "Model Poses:" : "Photography Style:"}
                </span>
                <span className="font-bold text-brand-purple text-right truncate max-w-[200px]" title={styleNames}>
                  {styleNames || `${selectedStyles.length} selected`}
                </span>
              </div>

              <div className="flex items-start justify-between py-1.5 gap-2">
                <span className="text-text-muted shrink-0">Custom Instructions:</span>
                <span className="font-medium text-text-secondary text-right line-clamp-2 max-w-[200px]">
                  {customPrompt.trim() || "Default commercial studio directives"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-text-muted">Output Quality:</span>
                <span className="font-bold text-amber-300">
                  4K Ultra-HD • Print Ready
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-text-muted">Variations:</span>
                <span className="font-bold text-white">5 High-Res Photos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 4 Footer Action Bar - Option 3 Visual Match */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isGenerating}
          className="px-6 py-2.5 rounded-xl bg-[#0E1838] hover:bg-[#16234D] border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span className="text-xs text-slate-500 hidden sm:inline">
          Step 4 of 5
        </span>

        <button
          type="button"
          disabled={isGenerating}
          onClick={onGenerate}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-[#A855F7] to-[#EC4899] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(236,72,153,0.4)] flex items-center gap-2 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating Photoshoot...</span>
            </>
          ) : (
            <>
              <span>Generate photoshoot</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
