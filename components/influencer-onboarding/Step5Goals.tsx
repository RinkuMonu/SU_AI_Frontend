"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Handshake,
  TrendingUp,
  Zap,
  PlaySquare,
  Check,
} from "lucide-react";

interface Step5GoalsProps {
  selectedGoals: string[];
  onUpdate: (fields: { goals: string[] }) => void;
  onNext: () => void;
  onBack: () => void;
}

interface GoalOption {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const GOAL_OPTIONS: GoalOption[] = [
  {
    id: "Get Brand Collaborations",
    title: "Get Brand Collaborations",
    subtitle: "Work with brands & run campaigns",
    icon: Handshake,
  },
  {
    id: "Grow My Audience",
    title: "Grow My Audience",
    subtitle: "Increase reach & engagement",
    icon: TrendingUp,
  },
  {
    id: "Monetize My Content",
    title: "Monetize My Content",
    subtitle: "Earn through brand deals",
    icon: Zap,
  },
  {
    id: "Create AI-Powered Content",
    title: "Create AI-Powered Content",
    subtitle: "Create reels, posts & ads with AI",
    icon: PlaySquare,
  },
];

export const Step5Goals: React.FC<Step5GoalsProps> = ({
  selectedGoals,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleGoal = (id: string) => {
    setErrorMsg(null);
    let next: string[];
    if (selectedGoals.includes(id)) {
      if (selectedGoals.length === 1) {
        setErrorMsg("Please select at least one primary goal to continue.");
        return;
      }
      next = selectedGoals.filter((g) => g !== id);
    } else {
      next = [...selectedGoals, id];
    }
    onUpdate({ goals: next });
  };

  const handleContinue = () => {
    if (selectedGoals.length === 0) {
      setErrorMsg("Please choose at least one goal.");
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
          Your Goals on DhandaGrow
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Tell us what you want to achieve as a creator. (Select all that apply)
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center">
          {errorMsg}
        </div>
      )}

      {/* 2x2 Grid of Goals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {GOAL_OPTIONS.map((item) => {
          const isSelected = selectedGoals.includes(item.id);
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleGoal(item.id)}
              className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border transition-all text-center group cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-b from-[#BE32FF]/20 to-[#EC4899]/10 border-[#BE32FF] shadow-[0_0_20px_rgba(190,50,255,0.3)] ring-1 ring-[#BE32FF]"
                  : "bg-[#0B132B]/80 hover:bg-[#0E1838] border-white/10 hover:border-white/20"
              }`}
            >
              {/* Checkmark Badge */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-gradient-to-r from-[#A855F7] to-[#EC4899] flex items-center justify-center text-white shadow-sm">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                  isSelected
                    ? "bg-gradient-to-br from-[#A855F7] to-[#EC4899] text-white shadow-md shadow-[#BE32FF]/30"
                    : "bg-[#111C44] text-slate-300 group-hover:text-white"
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
              <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                {item.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4">
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
          disabled={selectedGoals.length === 0}
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

