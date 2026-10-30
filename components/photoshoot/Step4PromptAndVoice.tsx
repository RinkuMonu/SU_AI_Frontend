"use client";

import React from "react";
import { 
  Sparkles, 
  MessageSquareText, 
  Wand2, 
  ArrowRight, 
  ArrowLeft, 
  Camera, 
  Layers, 
  ShieldCheck, 
  UserCheck, 
  Box, 
  Info,
  Sliders,
  CheckCircle2
} from "lucide-react";
import { VoiceInputButton } from "@/components/ui/VoiceInput";
import { 
  AIModelProfile, 
  EnhancementStyle, 
  PhotoshootUploadedImage, 
  ProductCategory 
} from "./types";
import { 
  AI_MODELS, 
  ENHANCEMENT_STYLES, 
  PRESET_PROMPTS, 
  PRODUCT_CATEGORIES 
} from "./data";

interface Step4PromptAndVoiceProps {
  customPrompt: string;
  productCategory: ProductCategory;
  productName: string;
  productColor: string;
  enhancementStyle: EnhancementStyle;
  withModel: boolean;
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

export const Step4PromptAndVoice: React.FC<Step4PromptAndVoiceProps> = ({
  customPrompt,
  productCategory,
  productName,
  productColor,
  enhancementStyle,
  withModel,
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
  const selectedModel = AI_MODELS.find((m) => m.id === selectedModelId);
  const selectedStyleObj = ENHANCEMENT_STYLES.find((s) => s.id === enhancementStyle);
  const currentCategoryInfo = PRODUCT_CATEGORIES.find((c) => c.id === productCategory);

  const handleApplyPreset = (preset: string) => {
    if (customPrompt.trim()) {
      onPromptChange(`${customPrompt.trim()}, ${preset}`);
    } else {
      onPromptChange(preset);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-purple text-xs font-semibold">
          <MessageSquareText className="w-3.5 h-3.5" />
          <span>Step 4 of 5 • Artistic Direction &amp; Voice Input</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Customize Your Photoshoot
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
          Provide optional creative guidance, lighting mood, background environment, or speak your instructions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Prompt Input with Multilingual Voice Dictation (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0c0e1b] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
            {/* Field Header with Character Counter & Voice Button */}
            <div className="flex items-center justify-between">
              <label htmlFor="photoshoot-prompt" className="text-xs font-bold text-white flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-brand-pink" />
                <span>Creative Prompt &amp; Voice Instructions</span>
                <span className="text-[10px] text-neutral-400 font-normal">(Optional)</span>
              </label>

              <div className="flex items-center gap-2">
                <VoiceInputButton
                  onTranscript={(text) => onPromptChange(text)}
                  currentValue={customPrompt}
                  size="sm"
                  tooltip="Speak instructions in Hindi or English"
                />
                <span className="text-[11px] font-mono text-neutral-400">
                  {customPrompt.length} / {MAX_PROMPT_LENGTH}
                </span>
              </div>
            </div>

            {/* Prompt Textarea */}
            <div className="relative">
              <textarea
                id="photoshoot-prompt"
                rows={5}
                maxLength={MAX_PROMPT_LENGTH}
                value={customPrompt}
                onChange={(e) => onPromptChange(e.target.value)}
                placeholder="Describe your desired photoshoot. Example: Create a luxury fashion campaign with soft lighting, a beige background and elegant composition."
                className="w-full rounded-xl bg-black/40 border border-white/10 p-3.5 pb-10 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple resize-none leading-relaxed"
              />

              {/* Bottom Right Inner Voice Button */}
              <div className="absolute right-2.5 bottom-2.5">
                <VoiceInputButton
                  onTranscript={(text) => onPromptChange(text)}
                  currentValue={customPrompt}
                  size="sm"
                />
              </div>
            </div>

            {/* Preset Inspiration Chips */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-xs font-semibold text-neutral-300 block">
                Quick Inspiration Presets (Click to add):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_PROMPTS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-brand-purple/40 text-[11px] text-neutral-300 hover:text-white transition-all text-left cursor-pointer"
                  >
                    + {preset.slice(0, 48)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Synthesized Prompt Preview & Trigger */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-brand-pink" />
                  <span>Synthesized Studio Photographic Prompt:</span>
                </span>
                {onPreparePrompt && (
                  <button
                    type="button"
                    onClick={onPreparePrompt}
                    disabled={isPreparingPrompt}
                    className="text-[11px] font-bold text-brand-purple hover:text-brand-pink transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50"
                  >
                    {isPreparingPrompt ? "Synthesizing..." : "Preview Backend Prompt ↻"}
                  </button>
                )}
              </div>

              {preparedPrompt ? (
                <div className="p-3 rounded-xl bg-black/60 border border-brand-purple/20 text-[11px] text-neutral-300 font-mono leading-relaxed max-h-32 overflow-y-auto">
                  {preparedPrompt}
                </div>
              ) : (
                <p className="text-[11px] text-neutral-500 italic">
                  Click &quot;Preview Backend Prompt&quot; to inspect how your custom instructions, category, and styles are synthesized into photographic directives.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Configuration Summary Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0f1120] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
              <Sparkles className="w-4 h-4 text-brand-purple" />
              <span>Photoshoot Configuration Summary</span>
            </h2>

            {/* Product Snapshot */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="w-12 h-12 rounded-lg bg-black/60 overflow-hidden shrink-0 border border-white/10">
                {uploadedImages[0] && (
                  <img
                    src={uploadedImages[0].previewUrl}
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-white block truncate">
                  {productName || currentCategoryInfo?.label || "Product"}
                </span>
                <span className="text-[11px] text-brand-purple block truncate">
                  Category: {currentCategoryInfo?.label}
                </span>
                {productColor && (
                  <span className="text-[10px] text-neutral-400 block truncate">
                    Color: {productColor}
                  </span>
                )}
              </div>
            </div>

            {/* Settings Rows */}
            <div className="space-y-2.5 text-xs">
              {/* Enhancement Style */}
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-neutral-400">Enhancement Style:</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {selectedStyleObj?.name || "Studio Premium"}
                </span>
              </div>

              {/* Model Choice */}
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-neutral-400">AI Model Mode:</span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  {withModel ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5 text-brand-pink" />
                      <span>{selectedModel?.name || "Selected Model"}</span>
                    </>
                  ) : (
                    <>
                      <Box className="w-3.5 h-3.5 text-blue-400" />
                      <span>Product Only (No Model)</span>
                    </>
                  )}
                </span>
              </div>

              {/* Selected Angles / Styles Count */}
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-neutral-400">Poses / Angles:</span>
                <span className="font-bold text-brand-purple">
                  {selectedStyles.length} variation {selectedStyles.length === 1 ? "style" : "styles"}
                </span>
              </div>

              {/* Production Resolution */}
              <div className="flex items-center justify-between py-1.5">
                <span className="text-neutral-400">Output Quality:</span>
                <span className="font-bold text-amber-300">
                  4K Ultra-HD • Commercial Print Ready
                </span>
              </div>
            </div>

            {/* Fidelity Assurance Notice */}
            <div className="p-3 rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-[11px] text-neutral-300 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-pink shrink-0 mt-0.5" />
              <span>
                Our neural rendering engine preserves your original product shape, colors, logo, and texture without artificial distortion.
              </span>
            </div>
          </div>
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
          <span>Back to Styles</span>
        </button>

        <button
          type="button"
          disabled={isGenerating}
          onClick={onGenerate}
          className="px-8 py-3.5 rounded-full bg-brand-gradient hover:opacity-95 text-white font-extrabold text-sm sm:text-base shadow-2xl shadow-brand-purple/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>Generate Photoshoot Results</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

