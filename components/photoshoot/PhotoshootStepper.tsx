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
    <div 
      style={{ fontFamily: "'Roboto', sans-serif", backgroundColor: "#071023" }}
      className="w-full border border-[#232738] rounded-3xl px-5 sm:px-10 py-5 shadow-xl mb-6 relative"
    >
      <div className="relative max-w-4xl mx-auto">
        {/* Continuous inactive track behind circles */}
        <div className="absolute top-[22px] sm:top-[24px] left-6 sm:left-12 right-6 sm:right-12 h-[2px] bg-white/10 z-0" />
        
        {/* Active glowing progress track */}
        <div 
          style={{ 
            width: `calc(${progressPercent}% * 0.88)`,
            background: "linear-gradient(90deg, #2F1262 0%, #8b5cf6 100%)" 
          }}
          className="absolute top-[22px] sm:top-[24px] left-6 sm:left-12 h-[2px] shadow-[0_0_12px_rgba(139,92,246,0.55)] transition-all duration-300 ease-out z-0"
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
                  style={{
                    background: isCurrent || isCompleted
                      ? "linear-gradient(135deg, rgba(47, 18, 98, 0.6) 0%, rgba(20, 10, 45, 0.35) 100%)"
                      : "rgba(20, 26, 46, 0.4)",
                  }}
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-normal text-xs transition-all duration-300 z-10 ${
                    isCurrent
                      ? "text-purple-100 border border-[#8b5cf6] shadow-[0_0_20px_rgba(139,92,246,0.45)] ring-4 ring-[#8b5cf6]/20 scale-105"
                      : isCompleted
                      ? "text-purple-200 border border-[#8b5cf6]/50 shadow-md"
                      : "text-slate-400 border border-[#26314c]/70 group-hover:border-slate-400 group-hover:text-slate-200"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-purple-200 stroke-[3]" />
                  ) : (
                    <IconComponent className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-inherit" />
                  )}
                </div>

                {/* Step Title */}
                <div className="mt-2 text-center">
                  <span
                    className={`text-[11px] sm:text-xs block transition-colors ${
                      isCurrent
                        ? "text-white font-medium"
                        : isCompleted
                        ? "text-slate-300 font-normal group-hover:text-white"
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
