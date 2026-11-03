"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Check,
  Edit2,
  User,
  Tag,
  Share2,
  Target,
  MapPin,
  Heart,
  Loader2,
} from "lucide-react";
import { CreatorOnboardingData } from "./types";

interface Step6ReviewProps {
  data: CreatorOnboardingData;
  onEditStep: (stepNumber: number) => void;
  onSubmit: () => Promise<void>;
  onBack: () => void;
}

export const Step6Review: React.FC<Step6ReviewProps> = ({
  data,
  onEditStep,
  onSubmit,
  onBack,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await onSubmit();
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to save your creator profile. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  const connectedPlatforms = data.socialAccounts.filter(
    (a) => a.connected && a.handle.trim()
  );

  return (
    <div className="max-w-xl mx-auto space-y-6 py-2 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Review Your Details
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Confirm your creator profile and preferences.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center">
          {errorMsg}
        </div>
      )}

      {/* Main Review Card */}
      <div className="bg-[#0B132B] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
        {/* Creator Identity Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            {/* Avatar thumbnail */}
            <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-[#A855F7] to-[#EC4899] shadow-md shadow-[#BE32FF]/20 shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#0E1838] flex items-center justify-center">
                {data.profileImage ? (
                  <img
                    src={data.profileImage}
                    alt={data.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-7 h-7 text-slate-400" />
                )}
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                {data.fullName || "Creator Name"}
              </h3>
              <p className="text-xs font-mono text-[#BE32FF] font-medium">
                @{data.username.replace(/^@/, "") || "username"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onEditStep(2)}
            className="px-3 py-1.5 rounded-lg bg-[#0E1838] hover:bg-[#16234D] border border-white/10 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-[#BE32FF]" />
            <span>Edit</span>
          </button>
        </div>

        {/* Detailed Rows */}
        <div className="space-y-3.5 text-xs sm:text-sm">
          {/* Niche */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2 text-slate-400">
              <Tag className="w-4 h-4 text-[#A855F7]" />
              <span>Niche</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-wrap gap-1.5 justify-end">
                {data.niches.map((n) => (
                  <span
                    key={n}
                    className="px-2 py-0.5 rounded-md bg-[#BE32FF]/15 border border-[#BE32FF]/30 text-purple-200 text-xs font-medium"
                  >
                    {n === "Other" && data.customNiche ? data.customNiche : n}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => onEditStep(3)}
                className="text-slate-500 hover:text-slate-300 ml-1 cursor-pointer"
                aria-label="Edit Niche"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Platforms */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2 text-slate-400">
              <Share2 className="w-4 h-4 text-[#EC4899]" />
              <span>Platforms</span>
            </div>
            <div className="flex items-center gap-2">
              {connectedPlatforms.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                  {connectedPlatforms.map((p) => (
                    <span
                      key={p.platform}
                      className="px-2 py-0.5 rounded-md bg-[#0E1838] border border-white/10 text-xs text-white capitalize flex items-center gap-1.5"
                    >
                      <span className="text-[10px] text-[#EC4899]">●</span>
                      <span>{p.platform}: @{p.handle}</span>
                      {p.isVerified ? (
                        <span className="text-[10px] text-emerald-400 font-semibold">(Verified)</span>
                      ) : (
                        <span className="text-[10px] text-amber-400/80">(Unverified)</span>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-slate-500 text-xs">None linked (can link on dashboard)</span>
              )}
              <button
                type="button"
                onClick={() => onEditStep(4)}
                className="text-slate-500 hover:text-slate-300 ml-1 cursor-pointer"
                aria-label="Edit Platforms"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Goal */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2 text-slate-400">
              <Target className="w-4 h-4 text-[#A855F7]" />
              <span>Primary Goal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium text-right text-xs sm:text-sm">
                {data.goals.join(", ") || "Get Brand Collaborations"}
              </span>
              <button
                type="button"
                onClick={() => onEditStep(5)}
                className="text-slate-500 hover:text-slate-300 ml-1 cursor-pointer"
                aria-label="Edit Goals"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin className="w-4 h-4 text-[#EC4899]" />
              <span>Location</span>
            </div>
            <span className="text-white font-medium">{data.location}</span>
          </div>

          {/* Gender */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2 text-slate-400">
              <User className="w-4 h-4 text-[#A855F7]" />
              <span>Gender</span>
            </div>
            <span className="text-white font-medium">{data.gender}</span>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-3">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl bg-[#0E1838] hover:bg-[#16234D] border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-[#A855F7] to-[#EC4899] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(236,72,153,0.45)] flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Creator Account</span>
              <Check className="w-4 h-4 stroke-[3]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

