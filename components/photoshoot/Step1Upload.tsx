"use client";

import React, { useState, useRef } from "react";
import { 
  Upload, 
  X, 
  Plus, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  Shirt,
  Gem,
  Coffee,
  Smartphone,
  Home,
  Flame,
  Package,
  Layers,
  Smile
} from "lucide-react";
import { 
  PhotoshootUploadedImage, 
  ProductCategory, 
  ImageAngle 
} from "./types";
import { PRODUCT_CATEGORIES } from "./data";

interface Step1UploadProps {
  uploadedImages: PhotoshootUploadedImage[];
  productCategory: ProductCategory;
  productName: string;
  productColor: string;
  onImagesChange: (images: PhotoshootUploadedImage[]) => void;
  onCategoryChange: (category: ProductCategory) => void;
  onNameChange: (name: string) => void;
  onColorChange: (color: string) => void;
  onNext: () => void;
}

const MAX_IMAGES = 8;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

const ANGLE_LABELS: Record<ImageAngle, string> = {
  front: "Front Angle",
  back: "Back Angle",
  side: "Side Angle",
  closeup: "Close-up",
  other: "Custom Angle",
};

export const Step1Upload: React.FC<Step1UploadProps> = ({
  uploadedImages,
  productCategory,
  productName,
  productColor,
  onImagesChange,
  onCategoryChange,
  onNameChange,
  onColorChange,
  onNext,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Shirt": return <Shirt className="w-5 h-5" />;
      case "Sparkles": return <Sparkles className="w-5 h-5" />;
      case "Layers": return <Layers className="w-5 h-5" />;
      case "Smile": return <Smile className="w-5 h-5" />;
      case "Gem": return <Gem className="w-5 h-5" />;
      case "Coffee": return <Coffee className="w-5 h-5" />;
      case "Smartphone": return <Smartphone className="w-5 h-5" />;
      case "Home": return <Home className="w-5 h-5" />;
      case "Flame": return <Flame className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const processFiles = (files: FileList | File[]) => {
    setUploadError(null);
    const newItems: PhotoshootUploadedImage[] = [];

    const fileArray = Array.from(files);
    if (uploadedImages.length + fileArray.length > MAX_IMAGES) {
      setUploadError(`You can upload a maximum of ${MAX_IMAGES} product images.`);
    }

    const allowedFiles = fileArray.slice(0, MAX_IMAGES - uploadedImages.length);

    allowedFiles.forEach((file, index) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setUploadError("Only JPG, JPEG, PNG, and WEBP images are supported.");
        return;
      }

      if (file.size > 15 * 1024 * 1024) {
        setUploadError(`File ${file.name} exceeds 15MB size limit.`);
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      // Auto-assign logical default angles: first is front, second is back, third is side, fourth is closeup
      const defaultAngleOrder: ImageAngle[] = ["front", "back", "side", "closeup"];
      const angle = defaultAngleOrder[(uploadedImages.length + index) % defaultAngleOrder.length];

      newItems.push({
        id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        size: file.size,
        url: previewUrl,
        previewUrl,
        angle,
        file,
        uploadedAt: new Date().toISOString(),
      });
    });

    if (newItems.length > 0) {
      onImagesChange([...uploadedImages, ...newItems]);
      // If product name is empty, suggest default from first file
      if (!productName && newItems[0]) {
        const cleanName = newItems[0].name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        onNameChange(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleRemoveImage = (id: string) => {
    const updated = uploadedImages.filter((img) => img.id !== id);
    onImagesChange(updated);
  };

  const handleAngleChange = (id: string, newAngle: ImageAngle) => {
    const updated = uploadedImages.map((img) =>
      img.id === id ? { ...img, angle: newAngle } : img
    );
    onImagesChange(updated);
  };

  const handleLoadDemo = (category: ProductCategory) => {
    onCategoryChange(category);
    let demoImage = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80";
    let demoName = "Classic White Organic T-Shirt";
    let demoColor = "White";

    if (category === "jewellery_accessories") {
      demoImage = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80";
      demoName = "Royal Emerald Kundan Necklace";
      demoColor = "Gold & Emerald";
    } else if (category === "beauty_cosmetics") {
      demoImage = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80";
      demoName = "Hydrating Glow Facial Serum";
      demoColor = "Amber Rose";
    } else if (category === "candles") {
      demoImage = "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80";
      demoName = "Lavender & Vanilla Scented Candle";
      demoColor = "Warm Cream";
    }

    onImagesChange([
      {
        id: `demo_${Date.now()}`,
        name: `${demoName}.jpg`,
        size: 1024 * 720,
        url: demoImage,
        previewUrl: demoImage,
        angle: "front",
        uploadedAt: new Date().toISOString(),
      },
    ]);
    onNameChange(demoName);
    onColorChange(demoColor);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Step Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-purple text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 1 of 5 • Product Ingestion</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Let&apos;s Create Your Product Photoshoot
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
          Upload your product images and transform them into professional marketing visuals.
        </p>
      </div>

      {/* Main Grid: Upload Area & Category Picker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload Dropzone & Previews (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-brand-pink" />
              <span>Product Image Uploads</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 font-normal">
                {uploadedImages.length} / {MAX_IMAGES}
              </span>
            </h2>

            {uploadedImages.length === 0 && (
              <button
                type="button"
                onClick={() => handleLoadDemo(productCategory)}
                className="text-xs text-brand-pink hover:text-white transition-colors underline cursor-pointer"
              >
                Try with Demo Product
              </button>
            )}
          </div>

          {/* Drag & Drop Box */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 relative overflow-hidden ${
              isDragging
                ? "border-brand-purple bg-brand-purple/10 shadow-[0_0_25px_rgba(190,50,255,0.25)] scale-[1.01]"
                : "border-white/15 hover:border-brand-purple/50 bg-[#0f1120]/60 hover:bg-[#121426]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp,image/jpg"
              onChange={handleFileInput}
              className="hidden"
            />

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-purple/20 to-brand-pink/20 border border-brand-purple/30 flex items-center justify-center text-brand-pink shadow-lg">
              <Upload className="w-6 h-6 animate-pulse" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Drag &amp; drop product photos, or{" "}
                <span className="text-brand-pink underline">browse files</span>
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                Supports JPG, JPEG, PNG, WEBP (Up to 15MB each, max {MAX_IMAGES} photos)
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] text-neutral-400">
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">Front View</span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">Back View</span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">Side Profile</span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">Close-up Details</span>
            </div>
          </div>

          {/* Error Banner */}
          {uploadError && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Uploaded Images Gallery Grid */}
          {uploadedImages.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Select angle tags for accurate 3D scene placement:</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadedImages.length >= MAX_IMAGES}
                  className="text-brand-pink hover:text-white flex items-center gap-1 font-semibold cursor-pointer disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add More</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {uploadedImages.map((img, idx) => (
                  <div
                    key={img.id}
                    className="relative rounded-xl border border-white/10 bg-[#0a0d1a] overflow-hidden group hover:border-brand-purple/50 transition-all shadow-md"
                  >
                    {/* Image Preview */}
                    <div className="relative aspect-square w-full bg-black/40 overflow-hidden flex items-center justify-center">
                      {img.previewUrl && img.previewUrl.trim() ? (
                        <img
                          src={img.previewUrl}
                          alt={img.name}
                          className="w-full h-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-600">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}

                      {/* Primary Badge */}
                      {idx === 0 && (
                        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-brand-purple text-white text-[9px] font-bold shadow-sm">
                          Main Hero
                        </div>
                      )}

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(img.id);
                        }}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Angle Selector */}
                    <div className="p-2 border-t border-white/10 bg-[#121424]">
                      <select
                        value={img.angle}
                        onChange={(e) => handleAngleChange(img.id, e.target.value as ImageAngle)}
                        className="w-full text-[10px] font-semibold bg-[#1a1d30] text-neutral-200 border border-white/10 rounded-lg px-2 py-1 outline-none focus:border-brand-purple cursor-pointer"
                      >
                        <option value="front">Front Angle</option>
                        <option value="back">Back Angle</option>
                        <option value="side">Side Angle</option>
                        <option value="closeup">Close-up</option>
                        <option value="other">Custom Angle</option>
                      </select>
                      <p className="text-[9px] text-neutral-400 truncate mt-1">
                        {(img.size / 1024).toFixed(0)} KB • {img.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Category & Product Metadata (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-[#0f1120] border border-white/10 rounded-2xl p-5 space-y-5">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-purple" />
                <span>Product Category *</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Adapts AI lighting, models, and background composition.
              </p>
            </div>

            {/* Category Selector Grid */}
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {PRODUCT_CATEGORIES.map((cat) => {
                const isSelected = productCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => onCategoryChange(cat.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? "bg-gradient-to-r from-brand-purple/20 to-brand-pink/20 border-brand-purple text-white shadow-md shadow-brand-purple/20"
                        : "bg-white/[0.03] hover:bg-white/[0.06] border-white/10 text-neutral-300 hover:text-white"
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                      isSelected ? "bg-brand-purple text-white" : "bg-white/5 text-neutral-400"
                    }`}>
                      {getCategoryIcon(cat.iconName)}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold block truncate leading-tight">
                        {cat.label}
                      </span>
                      <span className="text-[10px] text-neutral-400 truncate block mt-0.5">
                        {cat.sublabel.split(",")[0]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Optional Name & Color */}
            <div className="pt-2 border-t border-white/10 space-y-3">
              <div>
                <label className="text-xs font-semibold text-neutral-200 block mb-1">
                  Product Name / Title <span className="text-neutral-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => onNameChange(e.target.value)}
                  placeholder="e.g. Royal Silk Banarasi Saree, Minimalist Ceramic Vase"
                  className="w-full h-10 rounded-xl bg-black/40 border border-white/10 px-3 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-200 block mb-1">
                  Primary Product Color <span className="text-neutral-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={productColor}
                  onChange={(e) => onColorChange(e.target.value)}
                  placeholder="e.g. Crimson Red &amp; Gold, Matte Black, Pastel Sage"
                  className="w-full h-10 rounded-xl bg-black/40 border border-white/10 px-3 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-brand-purple"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1 Footer Action Bar */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <div className="text-xs text-neutral-400">
          {uploadedImages.length === 0 ? (
            <span className="text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              Upload at least 1 product image to proceed
            </span>
          ) : (
            <span className="text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {uploadedImages.length} {uploadedImages.length === 1 ? "image" : "images"} ready for AI enhancement
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={uploadedImages.length === 0}
          onClick={onNext}
          className="px-6 py-3 rounded-full bg-brand-gradient hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-brand-purple/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>Continue to Enhancement</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

