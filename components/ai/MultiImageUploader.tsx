"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import api from "@/lib/api";

interface MultiImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

export default function MultiImageUploader({
  value = [],
  onChange,
  maxFiles = 4,
}: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    
    if (value.length + files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images in total.`);
      return;
    }

    setUploading(true);

    try {
      const newUrls: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        
        const response = await api.post("/api/v1/fashion/products/upload-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        
        if (response.data.success) {
          let url = response.data.image_url;
          if (url.startsWith("/uploads/")) {
            url = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000") + url;
          }
          newUrls.push(url);
        }
      }
      onChange([...value, ...newUrls]);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload image(s). Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newUrls = [...value];
    newUrls.splice(index, 1);
    onChange(newUrls);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {value.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-border group bg-surface">
            <img src={url} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        
        {value.length < maxFiles && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-brand-purple hover:bg-brand-purple/5 transition-colors flex flex-col items-center justify-center gap-2 text-text-muted hover:text-white"
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-brand-purple" />
            ) : (
              <>
                <Upload className="w-6 h-6" />
                <span className="text-sm font-medium">Upload Image</span>
              </>
            )}
          </button>
        )}
      </div>
      <p className="text-sm text-text-muted">You can upload up to {maxFiles} images ({value.length}/{maxFiles}).</p>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />
    </div>
  );
}
