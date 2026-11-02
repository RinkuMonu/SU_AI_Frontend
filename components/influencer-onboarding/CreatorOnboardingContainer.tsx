"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CreatorStepper } from "./CreatorStepper";
import { Step1Welcome } from "./Step1Welcome";
import { Step2Profile } from "./Step2Profile";
import { Step3Niche } from "./Step3Niche";
import { Step4Social } from "./Step4Social";
import { Step5Goals } from "./Step5Goals";
import { Step6Review } from "./Step6Review";
import { Step7Success } from "./Step7Success";
import {
  CreatorOnboardingData,
  INITIAL_ONBOARDING_DATA,
} from "./types";
import { creatorOnboardingService } from "@/services/creator-onboarding.service";
import { useAuth } from "@/components/auth/AuthProvider";
import { Loader2 } from "lucide-react";

export const CreatorOnboardingContainer: React.FC = () => {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [data, setData] = useState<CreatorOnboardingData>(INITIAL_ONBOARDING_DATA);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize draft from localStorage & remote profile via service
  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      try {
        const loaded = await creatorOnboardingService.loadOnboardingData(user);
        if (isMounted) {
          setData(loaded);
          setIsInitializing(false);
        }
      } catch (err) {
        console.warn("Error loading creator onboarding data:", err);
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    }

    if (!isAuthLoading) {
      initialize();
    }

    return () => {
      isMounted = false;
    };
  }, [user, isAuthLoading]);

  // Update helper
  const handleUpdate = useCallback((partial: Partial<CreatorOnboardingData>) => {
    setData((prev) => {
      const next = { ...prev, ...partial };
      creatorOnboardingService.saveLocalDraft(next);
      return next;
    });
  }, []);

  // Step transitions
  const handleGoToStep = useCallback((stepNumber: number) => {
    setData((prev) => {
      const next = { ...prev, step: stepNumber };
      creatorOnboardingService.syncStepToBackend(next).catch(() => {});
      return next;
    });
  }, []);

  const handleNextStep = useCallback(() => {
    setData((prev) => {
      const nextStep = Math.min(prev.step + 1, 7);
      const next = { ...prev, step: nextStep };
      creatorOnboardingService.syncStepToBackend(next).catch(() => {});
      return next;
    });
  }, []);

  const handleBackStep = useCallback(() => {
    setData((prev) => {
      const prevStep = Math.max(prev.step - 1, 1);
      const next = { ...prev, step: prevStep };
      creatorOnboardingService.saveLocalDraft(next);
      return next;
    });
  }, []);

  // Final review submission
  const handleSubmitReview = async () => {
    await creatorOnboardingService.completeOnboarding(data);
    setData((prev) => ({
      ...prev,
      step: 7,
      isCompleted: true,
      completedAt: new Date().toISOString(),
    }));
  };

  const handleGoToDashboard = () => {
    router.push("/influencer");
  };

  if (isAuthLoading || isInitializing) {
    return (
      <div className="min-h-screen bg-[#071023] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#BE32FF]" />
          <p className="text-xs text-slate-400 font-medium">
            Loading Creator Onboarding...
          </p>
        </div>
      </div>
    );
  }

  const currentStep = data.step;

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#071023] text-white flex flex-col justify-between selection:bg-[#BE32FF] selection:text-white">
      {/* Background ambient gradient glow matching design */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#6B21A8]/20 via-[#BE32FF]/10 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-gradient-to-tl from-[#EC4899]/15 via-[#A855F7]/10 to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-5 sm:py-7 flex-1 flex flex-col">
        {/* Top Header & Horizontal Progress Tracker */}
        <CreatorStepper
          currentStep={currentStep}
          onStepClick={(s) => {
            if (s < currentStep) {
              handleGoToStep(s);
            }
          }}
        />

        {/* Step Component Content */}
        <main className="flex-1 flex flex-col justify-center">
          {currentStep === 1 && (
            <Step1Welcome onNext={() => handleGoToStep(2)} />
          )}

          {currentStep === 2 && (
            <Step2Profile
              fullName={data.fullName}
              username={data.username}
              profileImage={data.profileImage}
              bio={data.bio}
              location={data.location}
              gender={data.gender}
              onUpdate={handleUpdate}
              onNext={handleNextStep}
              onBack={handleBackStep}
            />
          )}

          {currentStep === 3 && (
            <Step3Niche
              selectedNiches={data.niches}
              customNiche={data.customNiche}
              onUpdate={handleUpdate}
              onNext={handleNextStep}
              onBack={handleBackStep}
            />
          )}

          {currentStep === 4 && (
            <Step4Social
              socialAccounts={data.socialAccounts}
              onUpdate={handleUpdate}
              onNext={handleNextStep}
              onBack={handleBackStep}
            />
          )}

          {currentStep === 5 && (
            <Step5Goals
              selectedGoals={data.goals}
              onUpdate={handleUpdate}
              onNext={handleNextStep}
              onBack={handleBackStep}
            />
          )}

          {currentStep === 6 && (
            <Step6Review
              data={data}
              onEditStep={handleGoToStep}
              onSubmit={handleSubmitReview}
              onBack={handleBackStep}
            />
          )}

          {currentStep === 7 && (
            <Step7Success
              creatorName={data.fullName}
              onGoToDashboard={handleGoToDashboard}
            />
          )}
        </main>
      </div>

      {/* Subtle bottom decorative purple-pink wavy accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#BE32FF]/40 to-transparent opacity-60" />
    </div>
  );
};
