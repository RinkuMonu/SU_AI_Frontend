"use client";

import React from "react";
import { Check } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

interface CreatorStepperProps {
  currentStep: number; // 1 to 7
  onStepClick?: (step: number) => void;
  canNavigateToStep?: (step: number) => boolean;
}

export const CreatorStepper: React.FC<CreatorStepperProps> = ({
  currentStep,
  onStepClick,
  canNavigateToStep,
}) => {
  const steps = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="w-full pb-4">
      {/* Top Header Row matching Option / Reference */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
        <div className="flex items-center gap-3">
          <Logo size="default" variant="horizontal" theme="dark" />
        </div>

        {currentStep === 1 ? (
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#2D164D] text-[#E085FF] border border-[#A855F7]/40 shadow-sm">
            Creator Onboarding
          </span>
        ) : currentStep <= 6 ? (
          <span className="text-xs sm:text-sm font-semibold text-slate-300">
            Step <span className="text-white font-bold">{currentStep}</span> of 7
          </span>
        ) : (
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            Account Ready
          </span>
        )}
      </div>

      {/* 7-Step Horizontal Stepper (shown for steps 2 to 6) */}
      {currentStep >= 2 && currentStep <= 6 && (
        <div className="relative max-w-xl mx-auto px-4 mb-6">
          {/* Background track */}
          <div className="absolute top-1/2 -translate-y-1/2 left-8 right-8 h-[2px] bg-white/10 -z-0" />

          {/* Active progress track */}
          <div
            className="absolute top-1/2 -translate-y-1/2 left-8 h-[2px] bg-gradient-to-r from-[#A855F7] to-[#EC4899] shadow-[0_0_12px_rgba(236,72,153,0.55)] transition-all duration-300 -z-0"
            style={{ width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% * 0.85)` }}
          />

          {/* Circles */}
          <div className="flex items-center justify-between relative z-10">
            {steps.map((s) => {
              const isCompleted = s < currentStep;
              const isCurrent = s === currentStep;
              const isClickable = canNavigateToStep ? canNavigateToStep(s) : s < currentStep;

              return (
                <button
                  key={s}
                  type="button"
                  disabled={!isClickable}
                  onClick={() => onStepClick && isClickable && onStepClick(s)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                    isCurrent
                      ? "bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white shadow-[0_0_15px_rgba(236,72,153,0.6)] ring-2 ring-[#EC4899]/40 scale-110"
                      : isCompleted
                      ? "bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-sm"
                      : "bg-[#0E1838] text-slate-400 border border-white/15"
                  } ${isClickable ? "cursor-pointer hover:scale-105" : "cursor-default"}`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                  ) : (
                    <span>{s}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
