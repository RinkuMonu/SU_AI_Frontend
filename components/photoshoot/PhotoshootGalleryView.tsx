"use client";

import React, { useState, useEffect } from "react";
import { 
  Camera, 
  Sparkles, 
  Download, 
  Trash2, 
  Eye, 
  Maximize2, 
  ArrowRight, 
  UserCheck, 
  Box, 
  Layers, 
  Calendar, 
  FolderOpen, 
  Loader2,
  RefreshCw,
  X,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { 
  productPhotoshootService, 
  BackendGallerySessionItem,
  BackendGeneratedImageItem 
} from "@/services/productPhotoshoot.service";

interface PhotoshootGalleryViewProps {
  onOpenSession: (sessionId: string) => void;
  onReuseProduct: (sessionId: string) => void;
  onStartNew: () => void;
}

export const PhotoshootGalleryView: React.FC<PhotoshootGalleryViewProps> = ({
  onOpenSession,
  onReuseProduct,
  onStartNew,
}) => {
  const [sessions, setSessions] = useState<BackendGallerySessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [modeFilter, setModeFilter] = useState<"all" | "model" | "product_only">("all");
  const [sortBy, setSortBy] = useState<"desc" | "asc">("desc");

  // Selected session detailed inspector
  const [activeSessionDoc, setActiveSessionDoc] = useState<any | null>(null);
  const [isLoadingSessionDoc, setIsLoadingSessionDoc] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const fetchGallery = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productPhotoshootService.getGallery({
        category: selectedCategory === "all" ? undefined : selectedCategory,
        useModel: modeFilter === "all" ? undefined : modeFilter === "model",
        sortBy,
        limit: 24,
      });
      if (res?.success) {
        setSessions(res.sessions || []);
      }
    } catch (err: any) {
      console.warn("Failed to load user gallery:", err);
      setError("Could not load your saved photoshoot history. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [selectedCategory, modeFilter, sortBy]);

  const handleOpenDetailedInspector = async (sessionId: string) => {
    setIsLoadingSessionDoc(true);
    try {
      const res = await productPhotoshootService.getSession(sessionId);
      if (res?.success && res.session) {
        setActiveSessionDoc(res.session);
      }
    } catch (e) {
      console.warn("Could not load session details:", e);
    } finally {
      setIsLoadingSessionDoc(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await productPhotoshootService.deleteImage(imageId);
      if (activeSessionDoc) {
        setActiveSessionDoc((prev: any) => ({
          ...prev,
          generated_images: (prev.generated_images || []).filter((g: any) => g.image_id !== imageId),
        }));
      }
      fetchGallery();
    } catch (e) {
      console.warn("Delete error:", e);
    }
  };

  const handleDownloadSingle = async (imageId: string, filename: string) => {
    try {
      await productPhotoshootService.downloadImageBlob(imageId, filename);
    } catch (e) {
      console.warn("Download error:", e);
    }
  };

  const handleDownloadZip = async (sessionId: string) => {
    try {
      await productPhotoshootService.downloadSessionZip(sessionId);
    } catch (e) {
      console.warn("Download zip error:", e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Gallery Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a0d1a] border border-white/10 rounded-2xl p-5 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-brand-purple" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              My Photoshoot Library
            </h2>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-brand-purple/20 text-brand-pink border border-brand-purple/40">
              {sessions.length} {sessions.length === 1 ? "Session" : "Sessions"}
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Access previous product shoots, download saved high-res assets, or generate new looks for your products.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchGallery}
            disabled={loading}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Refresh gallery"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            onClick={onStartNew}
            className="px-4 py-2 rounded-xl bg-brand-gradient hover:opacity-95 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-brand-purple/20"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>New Photoshoot</span>
          </button>
        </div>
      </div>

      {/* Interactive Gallery Filters & Sort Bar */}
      <div className="bg-[#0b0e1b] border border-white/10 rounded-2xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: "all", label: "All" },
            { id: "Clothing", label: "Clothing" },
            { id: "Jewellery", label: "Jewellery" },
            { id: "Cosmetics", label: "Cosmetics" },
            { id: "Footwear", label: "Footwear" },
            { id: "Bags & Luggage", label: "Bags" },
            { id: "Home & Living", label: "Home" },
            { id: "Electronics", label: "Electronics" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-brand-purple text-white shadow-md shadow-brand-purple/30"
                  : "bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/5"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Mode & Sort Controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end shrink-0">
          {/* Mode Selector */}
          <div className="inline-flex rounded-xl bg-white/5 p-0.5 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setModeFilter("all")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                modeFilter === "all" ? "bg-white/15 text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setModeFilter("model")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                modeFilter === "model" ? "bg-brand-purple/40 text-brand-pink" : "text-neutral-400 hover:text-white"
              }`}
            >
              Model
            </button>
            <button
              type="button"
              onClick={() => setModeFilter("product_only")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                modeFilter === "product_only" ? "bg-blue-500/30 text-blue-300" : "text-neutral-400 hover:text-white"
              }`}
            >
              Product
            </button>
          </div>

          {/* Sort By Date */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "desc" | "asc")}
            aria-label="Sort by date"
            className="bg-[#121528] border border-white/10 text-neutral-300 rounded-xl px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-brand-purple cursor-pointer"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchGallery}
            className="text-xs underline font-semibold text-rose-300 hover:text-white"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && sessions.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[#0c0e1b] border border-white/10 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-pink mx-auto">
            <Camera className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No Previous Photoshoots Yet</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              You haven&apos;t generated any photoshoots yet. Upload a product photo to create your first studio catalog shoot!
            </p>
          </div>
          <button
            type="button"
            onClick={onStartNew}
            className="px-6 py-2.5 rounded-full bg-brand-gradient text-white text-xs font-bold shadow-lg shadow-brand-purple/20 cursor-pointer"
          >
            Start Your First Photoshoot
          </button>
        </div>
      )}

      {/* Sessions Grid */}
      {!loading && sessions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sessions.map((sess) => (
            <div
              key={sess.session_id}
              className="rounded-2xl bg-[#0c0e1a] border border-white/10 hover:border-brand-purple/50 transition-all overflow-hidden flex flex-col justify-between group shadow-xl"
            >
              {/* Thumbnail Header */}
              <div
                className="relative aspect-[16/10] w-full bg-black/60 overflow-hidden cursor-pointer"
                onClick={() => onOpenSession(sess.session_id)}
              >
                {sess.thumbnail_url && sess.thumbnail_url.trim() ? (
                  <img
                    src={sess.thumbnail_url}
                    alt={sess.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-600 bg-white/[0.02]">
                    <Camera className="w-10 h-10" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 flex items-center gap-1">
                    {sess.use_model ? (
                      <>
                        <UserCheck className="w-3 h-3 text-brand-pink" />
                        <span>AI Model</span>
                      </>
                    ) : (
                      <>
                        <Box className="w-3 h-3 text-blue-400" />
                        <span>Product Only</span>
                      </>
                    )}
                  </span>

                  <span className="px-2 py-0.5 rounded-md bg-brand-purple/90 backdrop-blur-md text-[10px] font-bold text-white shadow-md">
                    {sess.total_generated || 0} Photos
                  </span>
                </div>

                {/* Bottom Title on Thumbnail */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <span className="text-xs font-bold text-white block truncate">
                    {sess.title || sess.product_type || "Commercial Photoshoot"}
                  </span>
                  <span className="text-[10px] text-neutral-300 block truncate">
                    {sess.product_category || "General"}
                  </span>
                </div>
              </div>

              {/* Card Meta & Actions */}
              <div className="p-3.5 bg-[#0f1224] border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    <span>
                      {sess.created_at ? new Date(sess.created_at).toLocaleDateString() : "Recent"}
                    </span>
                  </span>

                  {sess.saved_count > 0 && (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{sess.saved_count} saved</span>
                    </span>
                  )}
                </div>

                {/* Buttons Grid */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onOpenSession(sess.session_id)}
                    className="py-1.5 px-2.5 rounded-xl bg-brand-purple/20 hover:bg-brand-purple/30 text-brand-pink text-xs font-bold border border-brand-purple/40 flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <span>View Photos</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onReuseProduct(sess.session_id)}
                    className="py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-semibold border border-white/10 flex items-center justify-center gap-1 transition-all cursor-pointer"
                    title="Start a new photoshoot using this same product"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
                    <span>Shoot Again</span>
                  </button>
                </div>

                {/* Download ZIP button */}
                <button
                  type="button"
                  onClick={() => handleDownloadZip(sess.session_id)}
                  className="w-full py-1 text-[11px] font-semibold text-neutral-400 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Download Session ZIP</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Image Lightbox */}
      {previewImageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setPreviewImageUrl(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full bg-[#0c0e1a] border border-white/20 rounded-2xl p-4 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold text-white">4K Resolution Preview</span>
              <button
                type="button"
                onClick={() => setPreviewImageUrl(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 flex items-center justify-center max-h-[75vh] overflow-hidden">
              {previewImageUrl && previewImageUrl.trim() ? (
                <img
                  src={previewImageUrl}
                  alt="Preview"
                  className="max-h-[70vh] w-auto object-contain rounded-xl"
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PhotoshootGalleryView;

