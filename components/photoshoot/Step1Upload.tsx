"use client";

import React, { useState, useRef } from "react";
import { 
  UploadCloud, 
  X, 
  Plus, 
  Image as ImageIcon, 
  Check, 
  AlertCircle, 
  ArrowRight,
  ArrowLeft,
  Shirt,
  Gem,
  Coffee,
  Smartphone,
  Home,
  Sparkles,
  Layers,
  Maximize2,
  Info,
  RefreshCw,
  Utensils
} from "lucide-react";
import { 
  PhotoshootUploadedImage, 
  ProductCategory, 
  ImageAngle,
  PhotoshootTabMode
} from "./types";
import { PRODUCT_CATEGORIES } from "./data";

interface Step1UploadProps {
  mode?: PhotoshootTabMode;
  uploadedImages: PhotoshootUploadedImage[];
  productCategory: ProductCategory;
  productName: string;
  productColor: string;
  onImagesChange: (images: PhotoshootUploadedImage[]) => void;
  onCategoryChange: (category: ProductCategory) => void;
  onNameChange: (name: string) => void;
  onColorChange: (color: string) => void;
  onNext: () => void;
  onBack?: () => void;
}

const MAX_IMAGES = 4;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

// Option 3 Primary Categories Display
const DISPLAY_CATEGORIES: { id: ProductCategory; label: string; icon: any }[] = [
  { id: "food_beverage", label: "Food & Spices", icon: Coffee },
  { id: "crockery_kitchenware", label: "Crockery & Kitchen", icon: Utensils },
  { id: "furniture_living", label: "Furniture & Living", icon: Home },
  { id: "jewellery_accessories", label: "Jewellery", icon: Gem },
  { id: "beauty_cosmetics", label: "Beauty & Cosmetics", icon: Sparkles },
  { id: "electronics", label: "Electronics", icon: Smartphone },
  { id: "clothing", label: "Clothing & Apparel", icon: Shirt },
  { id: "mens_clothing", label: "Men's Clothing", icon: Shirt },
];

export const Step1Upload: React.FC<Step1UploadProps> = ({
  mode = "avatar",
  uploadedImages,
  productCategory,
  productName,
  productColor,
  onImagesChange,
  onCategoryChange,
  onNameChange,
  onColorChange,
  onNext,
  onBack,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replacingImageId, setReplacingImageId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const processFiles = (files: FileList | File[]) => {
    setUploadError(null);
    const newItems: PhotoshootUploadedImage[] = [];

    const fileArray = Array.from(files);
    if (uploadedImages.length + fileArray.length > MAX_IMAGES) {
      setUploadError(`You can upload up to ${MAX_IMAGES} product images.`);
    }

    const allowedFiles = fileArray.slice(0, MAX_IMAGES - uploadedImages.length);

    allowedFiles.forEach((file, index) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setUploadError("Only JPG, JPEG, PNG, and WEBP images are supported.");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`File ${file.name} exceeds 10MB size limit.`);
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      const defaultAngleOrder: ImageAngle[] = ["front", "back", "side", "topdown", "angle45", "closeup"];
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

  const handleTriggerReplace = (id: string) => {
    setReplacingImageId(id);
    replaceInputRef.current?.click();
  };

  const handleReplaceFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && replacingImageId) {
      const file = e.target.files[0];
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setUploadError("Only JPG, JPEG, PNG, and WEBP images are supported.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`File ${file.name} exceeds 10MB size limit.`);
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      const updated = uploadedImages.map((img) => {
        if (img.id === replacingImageId) {
          return {
            ...img,
            name: file.name,
            size: file.size,
            url: previewUrl,
            previewUrl,
            file,
            uploadedAt: new Date().toISOString(),
          };
        }
        return img;
      });
      onImagesChange(updated);
      setReplacingImageId(null);
      if (replaceInputRef.current) replaceInputRef.current.value = "";
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Hidden file input for adding new photos */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/jpg"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Hidden file input for replacing single photo */}
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        onChange={handleReplaceFileInput}
        className="hidden"
      />

      {/* Main Grid: Upload Product Images on Left, Category on Right - Option 3 Spec */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Product Images (7 cols) */}
        <section className="lg:col-span-7 bg-[#0B132B] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#A855F7]/25 to-[#EC4899]/25 text-[#EC4899] border border-[#EC4899]/30 flex items-center justify-center shrink-0">
                <ImageIcon className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Upload Product Images</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#2D164D] text-[#E085FF] border border-[#A855F7]/40 font-bold">
                  {uploadedImages.length} / {MAX_IMAGES}
                </span>
              </h2>
            </div>
            <p className="text-xs text-text-muted mt-1">
              Upload 1–4 clear product photos from different angles for the best results.
            </p>
          </div>

          {/* Upload Error Banner */}
          {uploadError && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* 4-Slot Image Row - Option 3 Pixel Match */}
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((slotIndex) => {
              const img = uploadedImages[slotIndex];

              if (img) {
                return (
                  <div
                    key={img.id}
                    className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-[#0E1838] shadow group"
                  >
                    <img
                      src={img.previewUrl}
                      alt={img.name}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />

                    {/* Top Right Close X Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(img.id);
                      }}
                      className="w-6 h-6 rounded-full bg-black/75 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow absolute top-2 right-2 z-10 cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>

                    {/* Quick Replace on hover */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTriggerReplace(img.id);
                      }}
                      className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/75 hover:bg-brand-purple text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                      title="Replace photo"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>

                    {/* Angle Selector Bar */}
                    <div className="absolute inset-x-0 bottom-0 p-1 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                      <select
                        value={img.angle}
                        onChange={(e) => handleAngleChange(img.id, e.target.value as ImageAngle)}
                        className="w-full text-[10px] font-semibold bg-black/70 text-white border border-white/20 rounded px-1.5 py-0.5 outline-none cursor-pointer"
                      >
                        <option value="front">Front View</option>
                        <option value="back">Back View</option>
                        <option value="side">Side View</option>
                        <option value="topdown">Top-Down</option>
                        <option value="angle45">45° Angle</option>
                        <option value="closeup">Close-up</option>
                        <option value="other">Other Angle</option>
                      </select>
                    </div>
                  </div>
                );
              }

              // Empty Slot
              return (
                <button
                  key={`empty_${slotIndex}`}
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border border-dashed border-white/20 bg-[#0E1838]/40 hover:border-[#A855F7] hover:bg-[#A855F7]/5 transition-all flex flex-col items-center justify-center cursor-pointer group"
                >
                  <span className="text-[#EC4899] text-xl font-bold leading-none mb-1 group-hover:scale-110 transition-transform">
                    +
                  </span>
                  <span className="text-[11px] sm:text-xs font-medium text-slate-300 group-hover:text-white">
                    Add Image
                  </span>
                </button>
              );
            })}
          </div>

          {/* Large Drag & Drop Box - Option 3 Pixel Match */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`rounded-2xl border border-dashed border-[#A855F7]/40 bg-[#121133]/60 hover:border-[#EC4899] hover:bg-[#121133]/80 transition-all p-6 flex flex-col items-center justify-center text-center cursor-pointer ${
              isDragging ? "border-[#EC4899] bg-[#121133]" : ""
            }`}
          >
            <UploadCloud className="w-9 h-9 text-[#EC4899] mb-2 stroke-[1.5]" />
            <p className="text-xs sm:text-sm text-slate-200">
              Drag &amp; drop product images here or{" "}
              <span className="text-[#E085FF] font-semibold hover:underline">browse files</span>
            </p>

            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-3 flex-wrap justify-center">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>JPG, PNG, WEBP</span>
              </span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Up to 4 images</span>
              </span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Max 10 MB each</span>
              </span>
            </div>
          </div>
        </section>

        {/* Right Column: Product Category (5 cols) - Option 3 Pixel Match */}
        <section className="lg:col-span-5 bg-[#0B132B] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#A855F7]/25 to-[#EC4899]/25 text-[#EC4899] border border-[#EC4899]/30 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-white flex items-center">
                <span>Product Category</span>
                <span className="text-[#EC4899] ml-1">*</span>
              </h2>
            </div>
            <p className="text-xs text-text-muted mt-1">
              Select product type to calibrate AI lighting &amp; camera perspective.
            </p>
          </div>

          {/* 2-Column Category Grid with Option 3 Checkmark Badge */}
          <div className="grid grid-cols-2 gap-2.5">
            {DISPLAY_CATEGORIES.map((cat) => {
              const isSelected = productCategory === cat.id;
              const IconComp = cat.icon;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onCategoryChange(cat.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-[#131E42] border-2 border-[#BE32FF] ring-2 ring-[#BE32FF]/30 text-white shadow-[0_0_15px_rgba(190,50,255,0.25)]"
                      : "bg-[#0E1838] hover:bg-[#121E45] border-white/10 text-slate-300 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg shrink-0 ${
                        isSelected ? "bg-[#BE32FF]/20 text-[#BE32FF]" : "bg-white/5 text-slate-400"
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold truncate leading-tight">
                      {cat.label}
                    </span>
                  </div>

                  {/* Pink Circle Checkmark Badge for Selected Item - Option 3 Match */}
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(236,72,153,0.5)] ml-2">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Info Callout Box - Option 3 Pixel Match */}
          <div className="bg-[#0E1838]/60 border border-white/10 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-slate-400 mt-4">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Choose the right category for more accurate lighting, background and product presentation.
            </p>
          </div>
        </section>
      </div>

      {/* Bottom Action Footer - Option 3 Pixel Match */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl bg-[#0E1838] hover:bg-[#16234D] border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          disabled={uploadedImages.length === 0}
          onClick={onNext}
          className="px-7 py-3 rounded-full bg-gradient-to-r from-[#A855F7] to-[#EC4899] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(236,72,153,0.4)] flex items-center gap-2 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>Continue to AI Enhancement</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
