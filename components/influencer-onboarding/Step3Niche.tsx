"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Shirt,
  Heart,
  Dumbbell,
  Utensils,
  Plane,
  Headphones,
  BookOpen,
  TrendingUp,
  MoreHorizontal,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";

interface Step3NicheProps {
  selectedNiches: string[];
  customNiche?: string;
  onUpdate: (fields: { niches: string[]; customNiche?: string }) => void;
  onNext: () => void;
  onBack: () => void;
}

interface NicheOption {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NICHE_OPTIONS: NicheOption[] = [
  { id: "Fashion & Style", title: "Fashion & Style", icon: Shirt },
  { id: "Beauty & Skincare", title: "Beauty & Skincare", icon: Heart },
  { id: "Fitness & Health", title: "Fitness & Health", icon: Dumbbell },
  { id: "Food & Recipes", title: "Food & Recipes", icon: Utensils },
  { id: "Travel & Lifestyle", title: "Travel & Lifestyle", icon: Plane },
  { id: "Tech & Gadgets", title: "Tech & Gadgets", icon: Headphones },
  { id: "Education & Learning", title: "Education & Learning", icon: BookOpen },
  { id: "Business & Finance", title: "Business & Finance", icon: TrendingUp },
  { id: "Other", title: "Other", icon: MoreHorizontal },
];

export const Step3Niche: React.FC<Step3NicheProps> = ({
  selectedNiches,
  customNiche = "",
  onUpdate,
  onNext,
  onBack,
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isTypingCustom, setIsTypingCustom] = useState(
    selectedNiches.includes("Other") || !!customNiche
  );

  const toggleNiche = (id: string) => {
    setErrorMsg(null);
    let next: string[];
    if (selectedNiches.includes(id)) {
      // allow deselect if more than 1 selected
      if (selectedNiches.length === 1) {
        setErrorMsg("Please select at least one niche that best fits your content.");
        return;
      }
      next = selectedNiches.filter((n) => n !== id);
      if (id === "Other") {
        setIsTypingCustom(false);
      }
    } else {
      next = [...selectedNiches, id];
      if (id === "Other") {
        setIsTypingCustom(true);
      }
    }
    onUpdate({ niches: next });
  };

  const handleContinue = () => {
    if (selectedNiches.length === 0) {
      setErrorMsg("Please select at least one niche to continue.");
      return;
    }
    if (selectedNiches.includes("Other") && !customNiche.trim()) {
      setErrorMsg("Please specify your custom niche for 'Other'.");
      return;
    }
    setErrorMsg(null);
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-2 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Choose Your Niche
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Select the category that best fits your content. (You can choose multiple)
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center">
          {errorMsg}
        </div>
      )}

      {/* 3x3 Grid of 9 Niche Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {NICHE_OPTIONS.map((item) => {
          const isSelected = selectedNiches.includes(item.id);
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleNiche(item.id)}
              className={`relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border transition-all text-center group cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-b from-[#BE32FF]/20 to-[#EC4899]/10 border-[#BE32FF] shadow-[0_0_20px_rgba(190,50,255,0.3)] ring-1 ring-[#BE32FF]"
                  : "bg-[#0B132B]/80 hover:bg-[#0E1838] border-white/10 hover:border-white/20"
              }`}
            >
              {/* Check indicator if selected */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-gradient-to-r from-[#A855F7] to-[#EC4899] flex items-center justify-center text-white shadow-sm">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              {/* Icon Container */}
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                  isSelected
                    ? "bg-gradient-to-br from-[#A855F7] to-[#EC4899] text-white shadow-md shadow-[#BE32FF]/30"
                    : "bg-[#111C44] text-slate-300 group-hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Title */}
              <span
                className={`text-xs sm:text-sm font-semibold tracking-tight transition-colors ${
                  isSelected ? "text-white" : "text-slate-300 group-hover:text-white"
                }`}
              >
                {item.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom Niche Input if "Other" is active */}
      {isTypingCustom && selectedNiches.includes("Other") && (
        <div className="p-4 rounded-2xl bg-[#0B132B] border border-[#BE32FF]/40 space-y-2 animate-in fade-in duration-200">
          <label className="text-xs font-semibold text-slate-300 block">
            Specify your custom niche / category:
          </label>
          <div className="relative">
            <Sparkles className="w-4 h-4 text-[#BE32FF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={customNiche}
              onChange={(e) => onUpdate({ niches: selectedNiches, customNiche: e.target.value })}
              placeholder="e.g. Anime Cosplay, Web3, Stand-up Comedy..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#071023] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#BE32FF]"
            />
          </div>
        </div>
      )}

      {/* Selected tags preview */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
        <span className="text-slate-400 font-medium">Selected:</span>
        {selectedNiches.map((n) => (
          <span
            key={n}
            className="px-2.5 py-1 rounded-full bg-[#BE32FF]/15 border border-[#BE32FF]/40 text-purple-200 font-medium"
          >
            {n === "Other" && customNiche.trim() ? customNiche : n}
          </span>
        ))}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-3">
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
          disabled={selectedNiches.length === 0}
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

