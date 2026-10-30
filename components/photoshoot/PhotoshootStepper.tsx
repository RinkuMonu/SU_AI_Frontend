"use client";

import React from "react";
import { Check, Upload, Wand2, Sparkles, MessageSquareText, Image as ImageIcon } from "lucide-react";

interface PhotoshootStepperProps {
  currentStep: 1 | 2 | 3 | 4 | 5;
  onStepClick: (step: 1 | 2 | 3 | 4 | 5) => void;
  canNavigateToStep: (step: 1 | 2 | 3 | 4 | 5) => boolean;
}

const STEPS = [
  { step: 1 as const, title: "Upload Product", shortTitle: "Upload", icon: Upload },
  { step: 2 as const, title: "AI Enhancement", shortTitle: "Enhance", icon: Wand2 },
  { step: 3 as const, title: "Style & Model", shortTitle: "Style", icon: Sparkles },
  { step: 4 as const, title: "Custom Prompt", shortTitle: "Prompt", icon: MessageSquareText },
  { step: 5 as const, title: "Final Results", shortTitle: "Results", icon: ImageIcon },
];

export const PhotoshootStepper: React.FC<PhotoshootStepperProps> = ({
  currentStep,
  onStepClick,
  canNavigateToStep,
}) => {
  return (
    <div className="w-full bg-[#0a0d1a]/80 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-4 mb-6 shadow-xl">
      <div className="flex items-center justify-between max-w-4xl mx-auto relative">
        {/* Continuous connector line behind circles */}
        <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-white/10 -z-0" />
        
        {/* Active progress track */}
        <div 
          className="absolute top-1/2 left-6 -translate-y-1/2 h-0.5 bg-gradient-to-r from-brand-purple to-brand-pink transition-all duration-500 -z-0"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 90}%` }}
        />

        {STEPS.map((s) => {
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
              className={`relative z-10 flex flex-col items-center group transition-all ${
                isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-60"
              }`}
            >
              {/* Step Circle */}
              <div
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                  isCurrent
                    ? "bg-gradient-to-r from-brand-purple to-brand-pink text-white shadow-[0_0_20px_rgba(190,50,255,0.6)] ring-4 ring-brand-purple/20 scale-110"
                    : isCompleted
                    ? "bg-brand-purple text-white shadow-md shadow-brand-purple/30 group-hover:bg-brand-pink"
                    : "bg-[#121422] text-neutral-400 border border-white/15 group-hover:border-white/30"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[3]" />
                ) : (
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>

              {/* Step Label */}
              <div className="mt-2 text-center">
                <span
                  className={`text-[11px] sm:text-xs font-semibold block transition-colors ${
                    isCurrent
                      ? "text-white font-bold"
                      : isCompleted
                      ? "text-neutral-300 group-hover:text-white"
                      : "text-neutral-500"
                  }`}
                >
                  <span className="hidden sm:inline">{s.title}</span>
                  <span className="inline sm:hidden">{s.shortTitle}</span>
                </span>
                <span className="text-[10px] text-neutral-500 hidden md:block">
                  Step {s.step}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

