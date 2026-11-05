"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  UploadCloud, 
  Camera,
  SwitchCamera,
  RotateCcw,
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

  // Camera Capture State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<"user" | "environment">("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Stop active camera stream
  const stopCameraStream = () => {
    if (cameraStreamRef.current) {
      try {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch (_) {}
      cameraStreamRef.current = null;
    }
  };

  // Open device camera with MediaStream
  const handleStartCamera = async (overrideFacing?: "user" | "environment") => {
    stopCameraStream();
    setCameraError(null);
    setCapturedPreview(null);
    setCapturedBlob(null);
    setIsCameraOpen(true);

    const facing = overrideFacing || cameraFacingMode;

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera access is not supported by your browser. Please try another browser.");
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      cameraStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn("Camera getUserMedia error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError("Camera permission blocked. Please allow camera access in your browser address bar (🔒 icon).");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraError("No camera device found. Please connect a webcam or camera.");
      } else {
        setCameraError(err.message || "Could not start camera preview.");
      }
    }
  };

  // Switch between front & rear camera
  const handleToggleCameraFacing = () => {
    const nextFacing = cameraFacingMode === "user" ? "environment" : "user";
    setCameraFacingMode(nextFacing);
    handleStartCamera(nextFacing);
  };

  // Capture still photo frame from video element
  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        setCapturedBlob(blob);
        const url = URL.createObjectURL(blob);
        setCapturedPreview(url);
      },
      "image/jpeg",
      0.95
    );
  };

  // Retake photo
  const handleRetakePhoto = () => {
    if (capturedPreview) {
      try {
        URL.revokeObjectURL(capturedPreview);
      } catch (_) {}
    }
    setCapturedPreview(null);
    setCapturedBlob(null);
  };

  // Confirm captured photo and send into existing upload workflow
  const handleConfirmCapturedPhoto = () => {
    if (!capturedBlob) return;
    const fileName = `camera_photo_${Date.now()}.jpg`;
    const file = new File([capturedBlob], fileName, { type: "image/jpeg" });
    processFiles([file]);

    handleCloseCameraModal();
  };

  // Close camera modal and release hardware
  const handleCloseCameraModal = () => {
    stopCameraStream();
    if (capturedPreview) {
      try {
        URL.revokeObjectURL(capturedPreview);
      } catch (_) {}
    }
    setCapturedPreview(null);
    setCapturedBlob(null);
    setIsCameraOpen(false);
    setCameraError(null);
  };

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

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
        <section style={{ backgroundColor: "#081226", fontFamily: "'Roboto', sans-serif" }} className="lg:col-span-7 border border-[#1e2a4a] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2">
              <span style={{ background: "linear-gradient(135deg, rgba(47, 18, 98, 0.5) 0%, rgba(20, 10, 45, 0.25) 100%)" }} className="w-8 h-8 rounded-xl border border-[#8b5cf6]/40 text-purple-200 flex items-center justify-center shrink-0 shadow-sm">
                <ImageIcon className="w-4 h-4" />
              </span>
              <h2 
                style={{ fontSize: "22px", fontFamily: "'Roboto', sans-serif" }}
                className="font-normal text-white flex items-center gap-2.5 tracking-normal leading-tight"
              >
                <span>Upload Product Images</span>
                <span style={{ background: "rgba(47, 18, 98, 0.45)" }} className="text-xs px-3 py-1 rounded-full text-purple-200 border border-[#8b5cf6]/35 font-normal">
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
                  className="aspect-square rounded-2xl border border-dashed border-[#26314c] bg-[#0c1630]/60 hover:border-[#8b5cf6] hover:bg-[#2F1262]/20 transition-all flex flex-col items-center justify-center cursor-pointer group shadow-sm"
                >
                  <span className="text-purple-400 text-2xl font-normal leading-none mb-1 group-hover:scale-110 group-hover:text-purple-300 transition-all">
                    +
                  </span>
                  <span className="text-[11px] sm:text-xs font-normal text-slate-300 group-hover:text-white">
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
            className={`rounded-3xl border border-dashed border-[#302254] bg-[#0c1630]/70 hover:border-[#8b5cf6] hover:bg-[#0c1630] transition-all p-6 sm:p-7 flex flex-col items-center justify-center text-center cursor-pointer shadow-inner ${
              isDragging ? "border-[#8b5cf6] bg-[#0c1630]" : ""
            }`}
          >
            <UploadCloud className="w-10 h-10 text-purple-400 mb-2 stroke-[1.5]" />
            <p className="text-xs sm:text-sm text-slate-200">
              Drag &amp; drop product images here or{" "}
              <span className="text-purple-300 font-medium hover:underline">browse files</span>
            </p>

            {/* Quick Action Buttons: Upload & Take Photo matching Image 2 */}
            <div className="mt-3 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: "linear-gradient(135deg, rgba(47, 18, 98, 0.45) 0%, rgba(20, 10, 45, 0.25) 100%)",
                }}
                className="px-5 py-2.5 rounded-full border border-[#8b5cf6]/35 hover:border-[#8b5cf6]/70 text-purple-100 hover:text-white text-xs font-normal flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <UploadCloud className="w-4 h-4 text-purple-300" />
                <span>Upload Photo</span>
              </button>

              <button
                type="button"
                onClick={() => handleStartCamera()}
                style={{
                  background: "linear-gradient(135deg, rgba(47, 18, 98, 0.55) 0%, rgba(20, 10, 45, 0.3) 100%)",
                }}
                className="px-6 py-2.5 rounded-full border border-[#8b5cf6]/50 hover:border-[#8b5cf6] text-purple-100 hover:text-white text-xs font-normal flex items-center gap-2 shadow-lg shadow-purple-950/40 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4 text-purple-200" />
                <span className="text-purple-100">Take Photo</span>
              </button>
            </div>

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
        <section style={{ backgroundColor: "#081226", fontFamily: "'Roboto', sans-serif" }} className="lg:col-span-5 border border-[#1e2a4a] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2">
              <span style={{ background: "linear-gradient(135deg, rgba(47, 18, 98, 0.5) 0%, rgba(20, 10, 45, 0.25) 100%)" }} className="w-8 h-8 rounded-xl border border-[#8b5cf6]/40 text-purple-200 flex items-center justify-center shrink-0 shadow-sm">
                <Layers className="w-4 h-4" />
              </span>
              <h2 
                style={{ fontSize: "22px", fontFamily: "'Roboto', sans-serif" }}
                className="font-normal text-white flex items-center tracking-normal leading-tight"
              >
                <span>Product Category</span>
                <span className="text-[#a855f7] ml-1.5">*</span>
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
                  style={{
                    backgroundColor: isSelected ? "#101322" : "#0c1630",
                    backgroundImage: isSelected
                      ? "linear-gradient(135deg, rgba(47, 18, 98, 0.45) 0%, rgba(13, 15, 27, 0.85) 100%)"
                      : "none",
                    boxShadow: isSelected
                      ? "0 0 10px rgba(139, 92, 246, 0.25)"
                      : "none",
                    borderColor: isSelected ? "#8b5cf6" : undefined,
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "border-[#8b5cf6] text-purple-100"
                      : "border-[#26314c] hover:border-slate-400 text-slate-300 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      style={{
                        background: "linear-gradient(135deg, rgba(47, 18, 98, 0.5) 0%, rgba(20, 10, 45, 0.25) 100%)",
                      }}
                      className={`p-2 rounded-xl shrink-0 border transition-all ${
                        isSelected ? "border-[#8b5cf6] text-purple-200" : "border-[#8b5cf6]/20 text-purple-300"
                      }`}
                    >
                      <IconComp className="w-4 h-4 text-[#c084fc] stroke-[1.8]" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-normal truncate leading-tight">
                      {cat.label}
                    </span>
                  </div>

                  {/* Circle Checkmark Badge for Selected Item */}
                  {isSelected && (
                    <span 
                      style={{
                        background: "linear-gradient(135deg, rgba(47, 18, 98, 0.6) 0%, rgba(20, 10, 45, 0.35) 100%)",
                        boxShadow: "0 0 6px rgba(139, 92, 246, 0.25)",
                      }}
                      className="w-5 h-5 rounded-full border border-[#8b5cf6] text-purple-100 flex items-center justify-center shrink-0 ml-1.5"
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Info Callout Box - Option 3 Pixel Match */}
          <div className="bg-[#0c1630] border border-[#26314c] p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-slate-400 mt-4">
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
          className="px-6 py-2.5 rounded-full bg-[#0c1630] hover:bg-[#152347] border border-[#26314c] text-slate-300 hover:text-white text-xs font-normal flex items-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          style={{
            background: "linear-gradient(95deg, #7d36fa 0%, #9534fd 18%, #b233fe 36%, #c835ef 52%, #df3dbb 68%, #ee4795 82%, #f76f7b 92%, #fc9a5d 100%)",
          }}
          className="px-9 py-3.5 rounded-full text-white font-medium text-xs sm:text-sm shadow-xl shadow-purple-600/35 hover:opacity-95 flex items-center gap-2 cursor-pointer transition-all"
        >
          <span className="text-white font-medium">Continue to AI Enhancement</span>
          <ArrowRight className="w-4 h-4 text-white stroke-[2.2]" />
        </button>
      </div>
      {/* Hidden canvas for capturing frame */}
      <canvas ref={canvasRef} className="hidden" />

      {/* CAMERA CAPTURE MODAL */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#0c1228] border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 bg-[#101938] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-purple-300" />
                <h3 className="text-sm font-bold text-white">Take Product Photo</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleCameraFacing}
                  title="Switch camera (Front / Rear)"
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <SwitchCamera className="w-3.5 h-3.5" />
                  <span className="text-[11px] hidden sm:inline">Flip</span>
                </button>
                <button
                  type="button"
                  onClick={handleCloseCameraModal}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Camera Viewport or Captured Preview */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[320px] max-h-[500px] overflow-hidden">
              {cameraError ? (
                <div className="p-6 text-center space-y-3 max-w-sm">
                  <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white">Camera Access Notice</h4>
                  <p className="text-xs text-slate-300">{cameraError}</p>
                  <button
                    type="button"
                    onClick={() => handleStartCamera()}
                    className="px-4 py-2 rounded-xl bg-brand-gradient text-white text-xs font-semibold cursor-pointer shadow-md"
                  >
                    Try Again
                  </button>
                </div>
              ) : capturedPreview ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={capturedPreview}
                    alt="Captured photo preview"
                    className="max-h-[460px] w-full object-contain"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-emerald-500/80 text-white text-[10px] font-bold uppercase tracking-wider">
                    Photo Captured
                  </span>
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover max-h-[460px]"
                  />
                  {/* Subtle viewfinder crosshairs */}
                  <div className="absolute inset-8 border border-white/25 rounded-2xl pointer-events-none" />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-[#101938] border-t border-white/10 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCloseCameraModal}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                {capturedPreview ? (
                  <>
                    <button
                      type="button"
                      onClick={handleRetakePhoto}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmCapturedPhoto}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Use This Photo</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    disabled={Boolean(cameraError)}
                    onClick={handleCapturePhoto}
                    style={{ background: "linear-gradient(135deg, #2F1262 0%, #000000 100%)" }} className="px-6 py-2.5 rounded-full border border-[#8b5cf6] text-purple-100 text-xs font-normal flex items-center gap-2 shadow-lg shadow-purple-950/50 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture Photo</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
