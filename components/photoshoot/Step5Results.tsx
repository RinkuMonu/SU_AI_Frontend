"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Download, 
  Check, 
  RotateCcw, 
  Trash2, 
  Eye, 
  Maximize2, 
  CheckCircle2, 
  X, 
  Loader2, 
  Share2, 
  Bookmark, 
  ArrowLeft, 
  Layers, 
  Camera,
  CheckSquare,
  Square
} from "lucide-react";
import { PhotoshootFinalResult } from "./types";

interface Step5ResultsProps {
  results: PhotoshootFinalResult[];
  selectedResultIds: string[];
  isGenerating: boolean;
  generationProgress: number;
  generationStage: string;
  productName: string;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDeleteResult: (id: string) => void;
  onRegenerateResult: (id: string) => void;
  onSaveToGallery: () => void;
  onDownloadSelected: () => void;
  onDownloadSingle: (item: PhotoshootFinalResult) => void;
  onDownloadZip?: () => void;
  onStartNewPhotoshoot: () => void;
  onBackToEdit: () => void;
}

export const Step5Results: React.FC<Step5ResultsProps> = ({
  results,
  selectedResultIds,
  isGenerating,
  generationProgress,
  generationStage,
  productName,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onDeleteResult,
  onRegenerateResult,
  onSaveToGallery,
  onDownloadSelected,
  onDownloadSingle,
  onDownloadZip,
  onStartNewPhotoshoot,
  onBackToEdit,
}) => {
  const [lightboxItem, setLightboxItem] = useState<PhotoshootFinalResult | null>(null);
  const [gallerySavedNotice, setGallerySavedNotice] = useState(false);

  const allSelected = results.length > 0 && selectedResultIds.length === results.length;

  const handleSaveWithToast = () => {
    onSaveToGallery();
    setGallerySavedNotice(true);
    setTimeout(() => setGallerySavedNotice(false), 3500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Step Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Step 5 of 5 • Commercial Production Ready</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Your Photoshoot Is Ready
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
          High-resolution marketing imagery crafted for {productName || "your product"}. Select, download, or save directly to your gallery.
        </p>
      </div>

      {/* Loading State Banner (When actively generating) */}
      {isGenerating && (
        <div className="bg-[#101224] border border-brand-purple/40 rounded-2xl p-6 text-center space-y-4 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/5 via-brand-pink/5 to-transparent animate-pulse" />

          <div className="relative z-10 space-y-3 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center text-brand-pink mx-auto">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>

            <div>
              <h2 className="text-base font-bold text-white">
                {generationStage || "Generating AI Product Photoshoot..."}
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Synthesizing realistic lighting, shadows, and commercial textures.
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-purple via-brand-pink to-brand-coral transition-all duration-300 rounded-full"
                style={{ width: `${generationProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
              <span>Rendering variations</span>
              <span>{generationProgress}% complete</span>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Saved Toast Notification */}
      {gallerySavedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between shadow-xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">
              Photoshoot saved to My Gallery &amp; Content Library successfully!
            </span>
          </div>
          <button
            type="button"
            onClick={() => setGallerySavedNotice(false)}
            className="text-emerald-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Action Controls Bar */}
      {results.length > 0 && (
        <div className="bg-[#0b0e1b] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          {/* Left: Selection count and Select All button */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={allSelected ? onDeselectAll : onSelectAll}
              className="flex items-center gap-2 text-xs font-semibold text-neutral-200 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-colors cursor-pointer"
            >
              {allSelected ? (
                <>
                  <CheckSquare className="w-4 h-4 text-brand-purple" />
                  <span>Deselect All</span>
                </>
              ) : (
                <>
                  <Square className="w-4 h-4 text-neutral-400" />
                  <span>Select All ({results.length})</span>
                </>
              )}
            </button>

            <span className="text-xs text-neutral-400">
              <strong className="text-white">{selectedResultIds.length}</strong> of {results.length} selected
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {/* Download Selected */}
            <button
              type="button"
              disabled={selectedResultIds.length === 0}
              onClick={onDownloadSelected}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border border-white/10"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Selected ({selectedResultIds.length})</span>
            </button>

            {/* Download ZIP Archive */}
            {onDownloadZip && (
              <button
                type="button"
                onClick={onDownloadZip}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-neutral-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
                title="Download all high-res photos in this photoshoot session as a ZIP archive"
              >
                <Download className="w-3.5 h-3.5 text-brand-pink" />
                <span>Download All (ZIP)</span>
              </button>
            )}

            {/* Save to My Gallery */}
            <button
              type="button"
              onClick={handleSaveWithToast}
              className="px-4 py-2 rounded-xl bg-brand-purple/20 hover:bg-brand-purple/30 text-brand-pink text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-brand-purple/40"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save to My Gallery</span>
            </button>

            {/* Generate Another Photoshoot */}
            <button
              type="button"
              onClick={onStartNewPhotoshoot}
              className="px-4 py-2 rounded-xl bg-brand-gradient hover:opacity-95 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-brand-purple/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Photoshoot</span>
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isGenerating && results.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[#0c0e1b] border border-white/10 space-y-3">
          <Camera className="w-12 h-12 text-neutral-600 mx-auto" />
          <h2 className="text-base font-bold text-white">No Photoshoot Results Yet</h2>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Click back to customize your prompt or re-trigger generation.
          </p>
          <button
            type="button"
            onClick={onBackToEdit}
            className="px-5 py-2.5 rounded-full bg-brand-gradient text-white text-xs font-bold cursor-pointer"
          >
            Back to Customize
          </button>
        </div>
      )}

      {/* Final Images Grid (5-6 Variations) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {results.map((item, index) => {
          const isSelected = selectedResultIds.includes(item.id);

          // Handle individual failed variation
          if (item.isFailed) {
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-rose-500/30 bg-[#160d15] p-5 flex flex-col justify-between shadow-xl min-h-[300px]"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <X className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Variation #{index + 1} Failed</h3>
                    <p className="text-xs text-rose-300/80 mt-1">
                      {item.errorMessage || "This variation timed out during neural generation."}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-rose-500/20">
                  <button
                    type="button"
                    onClick={() => onRegenerateResult(item.id)}
                    disabled={item.isRegenerating}
                    className="w-full py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-bold border border-rose-500/40 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {item.isRegenerating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Retrying...</span>
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retry This Image</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all overflow-hidden flex flex-col justify-between group shadow-xl ${
                isSelected
                  ? "bg-[#141122] border-brand-purple shadow-brand-purple/20 ring-2 ring-brand-purple"
                  : "bg-[#0c0e1a] border-white/10 hover:border-white/20"
              }`}
            >
              {/* Image Preview Container */}
              <div className="relative aspect-square w-full bg-black/60 overflow-hidden select-none">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Top Overlay Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                  <div className="flex items-center gap-1.5">
                    {/* Select Checkbox */}
                    <button
                      type="button"
                      onClick={() => onToggleSelect(item.id)}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-brand-purple border-brand-purple text-white shadow-md"
                          : "bg-black/60 backdrop-blur-md border-white/30 text-transparent hover:border-white"
                      }`}
                      title={isSelected ? "Deselect image" : "Select image"}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>

                    <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-bold border border-white/10">
                      Variation #{index + 1}
                    </span>
                  </div>

                  {/* Quality Pill */}
                  <span className="px-2 py-0.5 rounded-md bg-brand-purple/80 backdrop-blur-md text-white text-[10px] font-bold shadow-md">
                    {item.resolution}
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block leading-tight">
                      {item.styleName}
                    </span>
                    {item.modelUsed && (
                      <span className="text-[10px] text-brand-pink block font-medium">
                        Model: {item.modelUsed}
                      </span>
                    )}
                  </div>

                  {/* Lightbox / Zoom Button */}
                  <button
                    type="button"
                    onClick={() => setLightboxItem(item)}
                    className="p-1.5 rounded-lg bg-black/70 hover:bg-brand-purple text-white transition-colors cursor-pointer shadow-md"
                    title="Fullscreen Lightbox"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-[#111322] border-t border-white/10 flex items-center justify-between gap-2">
                {/* Download Button */}
                <button
                  type="button"
                  onClick={() => onDownloadSingle(item)}
                  className="flex-1 py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-brand-pink" />
                  <span>Download</span>
                </button>

                {/* Regenerate Button */}
                <button
                  type="button"
                  disabled={item.isRegenerating}
                  onClick={() => onRegenerateResult(item.id)}
                  className="py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-semibold border border-white/10 flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:opacity-40"
                  title="Re-roll this specific variation"
                >
                  {item.isRegenerating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-purple" />
                  ) : (
                    <RotateCcw className="w-3.5 h-3.5" />
                  )}
                  <span>Re-roll</span>
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => onDeleteResult(item.id)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-300 border border-white/10 transition-colors cursor-pointer"
                  title="Delete this image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-5xl max-h-[95vh] w-full bg-[#090b16] border border-white/20 rounded-2xl p-4 overflow-hidden shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{lightboxItem.title}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-brand-purple text-white font-bold">
                  {lightboxItem.resolution}
                </span>
                {lightboxItem.modelUsed && (
                  <span className="text-xs text-brand-pink font-semibold">
                    • Model: {lightboxItem.modelUsed}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onDownloadSingle(lightboxItem)}
                  className="px-3 py-1.5 rounded-xl bg-brand-gradient text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Ultra-HD</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLightboxItem(null)}
                  className="text-neutral-400 hover:text-white p-1 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Lightbox Image View */}
            <div className="py-4 flex items-center justify-center max-h-[75vh] overflow-hidden">
              <img
                src={lightboxItem.imageUrl}
                alt={lightboxItem.title}
                className="max-h-[72vh] w-auto object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Prompt details at bottom */}
            <div className="pt-2 border-t border-white/10 text-xs text-neutral-400 truncate">
              <span className="font-semibold text-neutral-300">Prompt:</span> {lightboxItem.prompt}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToEdit}
          className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Custom Prompt</span>
        </button>

        <button
          type="button"
          onClick={onStartNewPhotoshoot}
          className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer border border-white/10"
        >
          <Sparkles className="w-4 h-4 text-brand-pink" />
          <span>Start Another Photoshoot</span>
        </button>
      </div>
    </div>
  );
};

