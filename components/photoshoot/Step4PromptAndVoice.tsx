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
          <div style={{ backgroundColor: "#081226", fontFamily: "'Roboto', sans-serif" }} className="border border-[#1e2a4a] rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
            {/* Header matching Image 1: Bold hataya & 22px Roboto */}
            <div className="pb-3 border-b border-[#1e2a4a]">
              <div className="flex items-center gap-3">
                <span 
                  style={{ background: "linear-gradient(135deg, rgba(47, 18, 98, 0.5) 0%, rgba(20, 10, 45, 0.25) 100%)" }}
                  className="w-8 h-8 rounded-xl border border-[#8b5cf6]/40 text-purple-200 flex items-center justify-center shrink-0 shadow-sm"
                >
                  <Wand2 className="w-4 h-4 text-[#c084fc] stroke-[1.8]" />
                </span>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 
                    style={{ fontSize: "22px", fontFamily: "'Roboto', sans-serif" }}
                    className="font-normal text-white tracking-normal leading-tight"
                  >
                    Step 4 — Give your instructions
                  </h2>
                  <span className="text-xs text-purple-300 font-normal">(Optional)</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-normal pl-11">
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
                className="w-full rounded-2xl bg-[#071023] border border-[#26314c] p-3.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]/50 resize-none leading-relaxed"
              />

              
            </div>

            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-0.5">
              <span>🎤 Voice input button available above — Hindi, English and other supported languages.</span>
            </p>

            {/* Preset Inspiration Chips - Image 2: Labels size thoda baada */}
            <div className="space-y-2.5 pt-2 border-t border-[#1e2a4a]">
              <span className="text-xs sm:text-sm font-normal text-slate-300 block">
                Quick Inspiration (Click to append):
              </span>
              <div className="flex flex-wrap gap-2">
                {presetsToUse.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="text-xs sm:text-sm px-3.5 py-1.5 rounded-full bg-[#071023] hover:bg-[#131E42] border border-[#26314c] hover:border-[#8b5cf6]/60 text-slate-300 hover:text-white transition-all cursor-pointer text-left leading-relaxed shadow-sm font-normal"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Backend Prompt Preview Accordion */}
            {onPreparePrompt && (
              <div className="space-y-2 pt-2 border-t border-[#1e2a4a]">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-normal text-slate-400 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-blue-400" />
                    <span>Synthesized AI Prompt</span>
                  </span>
                  <button
                    type="button"
                    disabled={isPreparingPrompt}
                    onClick={onPreparePrompt}
                    className="text-xs sm:text-sm text-purple-300 hover:text-purple-200 font-normal transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isPreparingPrompt ? "Synthesizing..." : "Preview Directives ↻"}
                  </button>
                </div>

                {preparedPrompt ? (
                  <div className="p-3.5 rounded-2xl bg-[#071023] border border-[#26314c] text-xs text-slate-300 font-mono leading-relaxed max-h-32 overflow-y-auto">
                    {preparedPrompt}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: "Your current setup" Summary Card - Image 3: Bold hataya & size baada kiya */}
        <div className="lg:col-span-5 space-y-4">
          <div style={{ backgroundColor: "#081226", fontFamily: "'Roboto', sans-serif" }} className="border border-[#1e2a4a] rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 pb-3 border-b border-[#1e2a4a]">
              <span 
                style={{ background: "linear-gradient(135deg, rgba(47, 18, 98, 0.5) 0%, rgba(20, 10, 45, 0.25) 100%)" }}
                className="w-8 h-8 rounded-xl border border-[#8b5cf6]/40 text-purple-200 flex items-center justify-center shrink-0 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-[#c084fc] stroke-[1.8]" />
              </span>
              <h2 
                style={{ fontSize: "20px", fontFamily: "'Roboto', sans-serif" }}
                className="font-normal text-white tracking-normal leading-tight"
              >
                Your current setup
              </h2>
            </div>

            {/* Product Snapshot */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#071023] border border-[#26314c]">
              <div className="w-12 h-12 rounded-xl bg-black/60 overflow-hidden shrink-0 border border-[#8b5cf6]/30 flex items-center justify-center">
                {uploadedImages[0]?.previewUrl && uploadedImages[0].previewUrl.trim() ? (
                  <img
                    src={uploadedImages[0].previewUrl}
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Box className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-normal text-white block truncate">
                  {productName || currentCategoryInfo?.label || "Product"}
                </span>
                <span className="text-xs text-purple-300 font-normal block truncate mt-0.5">
                  Category: {currentCategoryInfo?.label || "General"}
                </span>
                {productColor && (
                  <span className="text-[11px] text-slate-400 font-normal block truncate">
                    Color: {productColor}
                  </span>
                )}
              </div>
            </div>

            {/* Clean Setup Summary Rows - Unbolded & Sized up */}
            <div className="space-y-1 text-xs sm:text-sm divide-y divide-[#1e2a4a]">
              <div className="flex items-center justify-between pt-1.5 pb-2">
                <span className="text-slate-400 font-normal">Workflow:</span>
                <span className="font-normal text-white text-right">
                  {isAvatarMode ? "AI Avatar Photoshoot" : "AI Product Photography"}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-slate-400 font-normal">Selected Enhancement:</span>
                <span className="font-normal text-white flex items-center gap-1.5 text-right">
                  {selectedEnhancedImage?.enhancedUrl && (
                    <img
                      src={selectedEnhancedImage.enhancedUrl}
                      alt="Enhanced"
                      className="w-4 h-4 rounded object-cover border border-[#8b5cf6]/40"
                    />
                  )}
                  <span>
                    {selectedEnhancedImage?.styleName || selectedStyleObj?.name || "Studio Premium"}
                  </span>
                </span>
              </div>

              {isAvatarMode && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-400 font-normal">Selected Model:</span>
                  <span className="font-normal text-purple-300 text-right">
                    {selectedModel?.name || "Selected Model"}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between py-2">
                <span className="text-slate-400 font-normal">
                  {isAvatarMode ? "Model Poses:" : "Photography Style:"}
                </span>
                <span className="font-normal text-purple-300 text-right truncate max-w-[220px]" title={styleNames}>
                  {styleNames || `${selectedStyles.length} selected`}
                </span>
              </div>

              <div className="flex items-start justify-between py-2 gap-2">
                <span className="text-slate-400 font-normal shrink-0">Custom Instructions:</span>
                <span className="font-normal text-slate-300 text-right line-clamp-2 max-w-[220px]">
                  {customPrompt.trim() || "Default commercial studio directives"}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-slate-400 font-normal">Output Quality:</span>
                <span className="font-normal text-amber-300 text-right">
                  4K Ultra-HD • Print Ready
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-slate-400 font-normal">Variations:</span>
                <span className="font-normal text-white text-right">5 High-Res Photos</span>
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
          className="px-6 py-2.5 rounded-full bg-[#0c1630] hover:bg-[#152347] border border-[#26314c] text-slate-300 hover:text-white text-xs font-normal flex items-center gap-2 cursor-pointer transition-all shadow-sm disabled:opacity-50"
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
          style={{
            background: "linear-gradient(95deg, #7d36fa 0%, #9534fd 18%, #b233fe 36%, #c835ef 52%, #df3dbb 68%, #ee4795 82%, #f76f7b 92%, #fc9a5d 100%)",
          }}
          className="px-9 py-3.5 rounded-full text-white font-medium text-xs sm:text-sm shadow-xl shadow-purple-600/35 hover:opacity-95 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Generating Photoshoot...</span>
            </>
          ) : (
            <>
              <span>Generate photoshoot</span>
              <ArrowRight className="w-4 h-4 text-white stroke-[2.2]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
