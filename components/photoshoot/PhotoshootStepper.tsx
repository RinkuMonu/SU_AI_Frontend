"use client";

import React from "react";
import { Check, Upload, Wand2, Sparkles, MessageSquareText, Image as ImageIcon } from "lucide-react";

interface PhotoshootStepperProps {
  currentStep: 1 | 2 | 3 | 4 | 5;
  mode?: "avatar" | "product";
  onStepClick: (step: 1 | 2 | 3 | 4 | 5) => void;
  canNavigateToStep: (step: 1 | 2 | 3 | 4 | 5) => boolean;
}

export const PhotoshootStepper: React.FC<PhotoshootStepperProps> = ({
  currentStep,
  mode = "avatar",
  onStepClick,
  canNavigateToStep,
}) => {
  const steps = [
    { step: 1 as const, title: "Upload Product", shortTitle: "Upload", icon: Upload },
    { step: 2 as const, title: "AI Enhancement", shortTitle: "Enhance", icon: Wand2 },
    { 
      step: 3 as const, 
      title: mode === "avatar" ? "Model & Style" : "Choose Style", 
      shortTitle: mode === "avatar" ? "Model" : "Style", 
      icon: Sparkles 
    },
    { step: 4 as const, title: "Instructions", shortTitle: "Instructions", icon: MessageSquareText },
    { step: 5 as const, title: "Final Photos", shortTitle: "Final Photos", icon: ImageIcon },
  ];

  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full bg-[#0B132B] border border-white/10 rounded-2xl px-5 sm:px-10 py-5 shadow-xl mb-6 relative">
      <div className="relative max-w-4xl mx-auto">
        {/* Continuous inactive track behind circles */}
        <div className="absolute top-[22px] sm:top-[24px] left-6 sm:left-12 right-6 sm:right-12 h-[2px] bg-white/10 z-0" />
        
        {/* Active glowing progress track */}
        <div 
          className="absolute top-[22px] sm:top-[24px] left-6 sm:left-12 h-[2px] bg-gradient-to-r from-[#A855F7] to-[#EC4899] shadow-[0_0_12px_rgba(236,72,153,0.55)] transition-all duration-300 ease-out z-0"
          style={{ width: `calc(${progressPercent}% * 0.88)` }}
        />

        {/* Steps */}
        <div className="flex items-center justify-between relative z-10">
          {steps.map((s) => {
            const isCompleted = s.step < currentStep;
            const isCurrent = s.step === currentStep;
            const isClickable = canNavigateToStep(s.step);
            const IconComponent = s.icon;

            return (
              <button
                key={s.step}
                type="button"
                disabled={!isClickable}
                onClick={() => onStepClick(s.step)}
                className={`flex flex-col items-center group transition-all focus:outline-none ${
                  isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                }`}
              >
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 z-10 ${
                    isCurrent
                      ? "bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white shadow-[0_0_20px_rgba(236,72,153,0.6)] ring-4 ring-[#EC4899]/20 scale-105"
                      : isCompleted
                      ? "bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-md"
                      : "bg-[#0E1838] text-slate-400 border border-white/15 group-hover:border-white/30 group-hover:text-slate-200"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-white stroke-[3]" />
                  ) : (
                    <IconComponent className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  )}
                </div>

                {/* Step Title */}
                <div className="mt-2 text-center">
                  <span
                    className={`text-[11px] sm:text-xs block transition-colors ${
                      isCurrent
                        ? "text-white font-bold"
                        : isCompleted
                        ? "text-slate-300 font-medium group-hover:text-white"
                        : "text-slate-400 font-normal"
                    }`}
                  >
                    <span className="hidden sm:inline">{s.step}. {s.title}</span>
                    <span className="inline sm:hidden">{s.step}. {s.shortTitle}</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
