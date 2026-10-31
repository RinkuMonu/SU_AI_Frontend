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
  ProductCategory,
  PhotoshootTabMode
} from "./types";
import { 
  AI_MODELS, 
  ENHANCEMENT_STYLES, 
  PRODUCT_CATEGORIES 
} from "./data";

interface Step4PromptAndVoiceProps {
  mode?: PhotoshootTabMode;
  customPrompt: string;
  productCategory: ProductCategory;
  productName: string;
  productColor: string;
  enhancementStyle: EnhancementStyle;
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
  "High-fashion editorial pose with soft studio daylight and clean neutral background",
  "Casual urban streetwear setting with natural golden hour bokeh and confident expression",
  "Classic Indian festive aesthetic with warm marigold lighting and rich traditional ambience (त्योहारी अंदाज और सुनहरी रोशनी)",
  "Modern minimalist studio portrait with crisp fabric draping and balanced commercial lighting",
  "Elegant full-length walking posture with natural outdoor daylight and subtle blur",
];

const PRODUCT_PROMPT_PRESETS = [
  "Centered on luxury dark onyx stone pedestal with subtle gold rim-lighting",
  "Soft natural golden hour sunlight on neutral warm sand podium with architectural shadows",
  "Pristine white marble counter with fresh botanical green leaves and morning daylight",
  "Clean high-key studio lighting with soft natural drop shadow on pure white background",
  "Vibrant festive Indian setting with warm marigold petals and brass lanterns (दिवाली स्टाइल मार्बल बेस और सुनहरी रोशनी)",
  "Modern Scandinavian oak wood table with minimalist ceramic accents and soft diffused daylight",
];

export const Step4PromptAndVoice: React.FC<Step4PromptAndVoiceProps> = ({
  mode = "avatar",
  customPrompt,
  productCategory,
  productName,
  productColor,
  enhancementStyle,
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

  const presetsToUse = isAvatarMode ? AVATAR_PROMPT_PRESETS : PRODUCT_PROMPT_PRESETS;

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
          <span>Step 4 of 5 • Creative Instructions &amp; Voice Input</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {isAvatarMode ? "Direct Your Model Photoshoot" : "Direct Your Product Photography"}
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
          {isAvatarMode
            ? "Provide custom styling instructions, environment preferences, or speak in Hindi/English/Hinglish."
            : "Specify background aesthetics, lighting mood, podium materials, or speak your instructions."}
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
                <span>Text or Voice Instructions</span>
                <span className="text-[10px] text-neutral-400 font-normal">(English, Hindi, Hinglish)</span>
              </label>

              <div className="flex items-center gap-2">
                <VoiceInputButton
                  onTranscript={(text) => onPromptChange(text)}
                  currentValue={customPrompt}
                  size="sm"
                  tooltip="Speak instructions in Hindi, English, or Hinglish"
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
                placeholder={
                  isAvatarMode
                    ? "Example: Elegant luxury campaign look with soft studio lighting, beige background, and confident pose."
                    : "Example: Place product on white marble slab with morning sunlight, soft palm shadows, and minimalist background."
                }
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
                Quick Inspiration Ideas (Click to append):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {presetsToUse.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-brand-purple/20 border border-white/10 hover:border-brand-purple/40 text-neutral-300 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Backend Prompt Preview Accordion */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  <span>Synthesized AI Directives</span>
                </span>
                {onPreparePrompt && (
                  <button
                    type="button"
                    disabled={isPreparingPrompt}
                    onClick={onPreparePrompt}
                    className="text-xs text-brand-purple hover:text-brand-pink font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isPreparingPrompt ? "Synthesizing..." : "Preview Backend Directives ↻"}
                  </button>
                )}
              </div>

              {preparedPrompt ? (
                <div className="p-3 rounded-xl bg-black/60 border border-brand-purple/20 text-[11px] text-neutral-300 font-mono leading-relaxed max-h-32 overflow-y-auto">
                  {preparedPrompt}
                </div>
              ) : (
                <p className="text-[11px] text-neutral-500 italic">
                  Click &quot;Preview Backend Directives&quot; to inspect how your instructions, product attributes, and lighting are synthesized.
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
                {uploadedImages[0]?.previewUrl && uploadedImages[0].previewUrl.trim() ? (
                  <img
                    src={uploadedImages[0].previewUrl}
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-500">
                    <Box className="w-5 h-5" />
                  </div>
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
              {/* Studio Mode */}
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-neutral-400">Studio Mode:</span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  {isAvatarMode ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5 text-brand-pink" />
                      <span>AI Avatar Photoshoot</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-3.5 h-3.5 text-blue-400" />
                      <span>AI Product Photography</span>
                    </>
                  )}
                </span>
              </div>

              {/* Model Choice (Avatar mode only) */}
              {isAvatarMode && (
                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-neutral-400">Selected Model:</span>
                  <span className="font-bold text-brand-pink flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-brand-pink" />
                    <span>{selectedModel?.name || "Curated Model"}</span>
                  </span>
                </div>
              )}

              {/* Enhancement Style */}
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-neutral-400">Enhancement Style:</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {selectedStyleObj?.name || "Studio Premium"}
                </span>
              </div>

              {/* Selected Angles / Styles Count */}
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-neutral-400">
                  {isAvatarMode ? "Selected Poses:" : "Selected Styles:"}
                </span>
                <span className="font-bold text-brand-purple">
                  {selectedStyles.length} variation {selectedStyles.length === 1 ? "style" : "styles"}
                </span>
              </div>

              {/* Production Resolution */}
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-neutral-400">Output Quality:</span>
                <span className="font-bold text-amber-300">
                  4K Ultra-HD • Commercial Print Ready
                </span>
              </div>

              {/* Credit Cost Display */}
              <div className="flex items-center justify-between py-1.5">
                <span className="text-neutral-400">Generation Cost:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px]">
                    5 Credits
                  </span>
                  <span className="text-[10px] text-neutral-400 font-normal">
                    (Auto-refunded if job fails)
                  </span>
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
          className="px-7 py-3.5 rounded-full bg-gradient-to-r from-brand-purple via-brand-pink to-brand-purple hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-brand-purple/30 transition-all flex items-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 animate-spin text-white" style={{ animationDuration: "3s" }} />
          <span>
            {isGenerating
              ? "Generating Photoshoot..."
              : isAvatarMode
              ? "Generate Avatar Photoshoot"
              : "Generate Product Photoshoot"}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
