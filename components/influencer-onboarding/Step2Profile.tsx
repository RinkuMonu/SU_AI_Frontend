"use client";

import React, { useRef, useState } from "react";
import { User, MapPin, Camera, ArrowRight, ArrowLeft, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { creatorOnboardingService } from "@/services/creator-onboarding.service";

interface Step2ProfileProps {
  fullName: string;
  username: string;
  profileImage: string;
  bio: string;
  location: string;
  gender: string;
  onUpdate: (fields: {
    fullName?: string;
    username?: string;
    profileImage?: string;
    bio?: string;
    location?: string;
    gender?: string;
  }) => void;
  onNext: () => void;
  onBack: () => void;
}

const INDIAN_CITIES = [
  "Jaipur, India",
  "Mumbai, India",
  "Delhi NCR, India",
  "Bengaluru, India",
  "Hyderabad, India",
  "Pune, India",
  "Ahmedabad, India",
  "Kolkata, India",
  "Chandigarh, India",
  "Indore, India",
  "Surat, India",
  "Lucknow, India",
  "Chennai, India",
  "Goa, India",
  "Other / Global",
];

const GENDER_OPTIONS = ["Female", "Male", "Non-binary", "Prefer not to say"];

export const Step2Profile: React.FC<Step2ProfileProps> = ({
  fullName,
  username,
  profileImage,
  bio,
  location,
  gender,
  onUpdate,
  onNext,
  onBack,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        setErrorMsg("Please select a valid image file (JPG, PNG, WEBP).");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Image size exceeds 5MB limit.");
        return;
      }

      setErrorMsg(null);
      setIsUploadingPhoto(true);

      // Instant local preview
      const localPreview = URL.createObjectURL(file);
      onUpdate({ profileImage: localPreview });

      try {
        const uploadedUrl = await creatorOnboardingService.uploadAvatar(file);
        if (uploadedUrl) {
          onUpdate({ profileImage: uploadedUrl });
        }
      } catch (err) {
        console.warn("Avatar upload to backend failed, keeping local preview:", err);
      } finally {
        setIsUploadingPhoto(false);
      }
    }
  };

  const cleanUsername = username.replace(/^@/, "").trim();
  const isValid = fullName.trim().length >= 2 && cleanUsername.length >= 3;

  const handleContinue = () => {
    if (!isValid) {
      setErrorMsg("Please provide your Full Name and a valid Username (at least 3 characters).");
      return;
    }
    setErrorMsg(null);
    onNext();
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 py-2 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Set Up Your Creator Profile
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Add your basic details to get started.
        </p>
      </div>

      {/* Profile Photo Upload */}
      <div className="flex flex-col items-center justify-center pt-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoSelect}
          className="hidden"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#A855F7] via-[#EC4899] to-[#FC9A5D] cursor-pointer group hover:scale-105 transition-transform shadow-lg shadow-brand-purple/20"
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-[#0E1838] flex items-center justify-center relative">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-slate-400 group-hover:text-white transition-colors" />
            )}

            {isUploadingPhoto && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-[#BE32FF]" />
              </div>
            )}
          </div>

          {/* Camera overlay badge */}
          <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white flex items-center justify-center shadow-md border-2 border-[#090A15]">
            <Camera className="w-3.5 h-3.5" />
          </span>
        </div>
        <span className="text-[11px] text-slate-400 mt-2 font-medium">
          {profileImage ? "Change Photo" : "Upload Profile Photo (Optional)"}
        </span>
      </div>

      {/* Form Fields */}
      <div className="bg-[#0B132B] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Full Name */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Full Name <span className="text-[#EC4899]">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => onUpdate({ fullName: e.target.value })}
              placeholder="e.g. Ananya Verma"
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#071023] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#BE32FF] focus:ring-1 focus:ring-[#BE32FF] transition-all"
            />
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Creator Username <span className="text-[#EC4899]">*</span>
          </label>
          <div className="relative">
            <span className="text-sm font-bold text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              @
            </span>
            <input
              type="text"
              value={cleanUsername}
              onChange={(e) => onUpdate({ username: e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, "") })}
              placeholder="ananyacreator"
              className="w-full h-11 pl-9 pr-4 rounded-xl bg-[#071023] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#BE32FF] focus:ring-1 focus:ring-[#BE32FF] transition-all font-mono"
            />
          </div>
        </div>

        {/* Location & Gender Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Location */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              City / Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={location}
                onChange={(e) => onUpdate({ location: e.target.value })}
                className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#071023] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#BE32FF] transition-all cursor-pointer"
              >
                {INDIAN_CITIES.map((c) => (
                  <option key={c} value={c} className="bg-[#0B132B] text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => onUpdate({ gender: e.target.value })}
              className="w-full h-11 px-3.5 rounded-xl bg-[#071023] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#BE32FF] transition-all cursor-pointer"
            >
              {GENDER_OPTIONS.map((g) => (
                <option key={g} value={g} className="bg-[#0B132B] text-white">
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bio (Optional) */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Short Bio <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <textarea
            rows={2}
            maxLength={180}
            value={bio}
            onChange={(e) => onUpdate({ bio: e.target.value })}
            placeholder="Tell brands and followers what your content is about..."
            className="w-full p-3 rounded-xl bg-[#071023] border border-white/10 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#BE32FF] resize-none"
          />
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl bg-[#0E1838] hover:bg-[#16234D] border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          disabled={!isValid}
          onClick={handleContinue}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-[#A855F7] to-[#EC4899] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(236,72,153,0.4)] flex items-center gap-2 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02]"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

