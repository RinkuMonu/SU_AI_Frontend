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
import { Loader2, AlertCircle } from "lucide-react";

export const CreatorOnboardingContainer: React.FC = () => {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const userId = user?.id || (user as any)?._id || (user as any)?.userId;

  const [data, setData] = useState<CreatorOnboardingData>(INITIAL_ONBOARDING_DATA);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Authoritative initialization directly from backend
  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      try {
        const loaded = await creatorOnboardingService.loadOnboardingData(user);
        if (!isMounted) return;

        // If the backend confirms onboarding is ALREADY completed, route to Influencer Dashboard immediately
        if (loaded.isCompleted) {
          router.replace("/influencer");
          return;
        }

        // New user starts at Screen 1; In-progress user resumes at their saved screen (1-6)
        setData(loaded);
        setIsInitializing(false);
      } catch (_) {
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
  }, [user, isAuthLoading, router]);

  // Form field update helper
  const handleUpdate = useCallback((partial: Partial<CreatorOnboardingData>) => {
    setData((prev) => {
      const next = { ...prev, ...partial };
      creatorOnboardingService.saveLocalDraft(next, userId);
      return next;
    });
  }, [userId]);

  // Navigate directly to previous step
  const handleGoToStep = useCallback((stepNumber: number) => {
    setSaveError(null);
    setData((prev) => {
      const next = { ...prev, step: stepNumber };
      creatorOnboardingService.saveLocalDraft(next, userId);
      return next;
    });
  }, [userId]);

  // Back button helper
  const handleBackStep = useCallback(() => {
    setSaveError(null);
    setData((prev) => {
      const prevStep = Math.max(prev.step - 1, 1);
      const next = { ...prev, step: prevStep };
      creatorOnboardingService.saveLocalDraft(next, userId);
      return next;
    });
  }, [userId]);

  // Step 1 -> Step 2
  const handleStep1Next = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const nextStep = 2;
      setData((prev) => ({ ...prev, step: nextStep }));
      await creatorOnboardingService.saveProgressStep(nextStep, userId);
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, userId]);

  // Step 2 Profile -> Step 3
  const handleStep2Next = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await creatorOnboardingService.saveProfileStep(data, userId);
      const nextStep = 3;
      setData((prev) => ({ ...prev, step: nextStep }));
      await creatorOnboardingService.saveProgressStep(nextStep, userId);
    } catch (err: any) {
      setSaveError(err?.message || "Failed to save profile details. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [data, isSaving, userId]);

  // Step 3 Niche -> Step 4
  const handleStep3Next = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await creatorOnboardingService.saveNichesStep(data, userId);
      const nextStep = 4;
      setData((prev) => ({ ...prev, step: nextStep }));
      await creatorOnboardingService.saveProgressStep(nextStep, userId);
    } catch (err: any) {
      setSaveError(err?.message || "Failed to save niche preferences. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [data, isSaving, userId]);

  // Step 4 Social -> Step 5
  const handleStep4Next = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await creatorOnboardingService.saveSocialAccountsStep(data, userId);
      const nextStep = 5;
      setData((prev) => ({ ...prev, step: nextStep }));
      await creatorOnboardingService.saveProgressStep(nextStep, userId);
    } catch (err: any) {
      setSaveError(err?.message || "Failed to save social platforms.");
    } finally {
      setIsSaving(false);
    }
  }, [data, isSaving, userId]);

  // Step 5 Goals -> Step 6
  const handleStep5Next = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await creatorOnboardingService.saveGoalsStep(data, userId);
      const nextStep = 6;
      setData((prev) => ({ ...prev, step: nextStep }));
      await creatorOnboardingService.saveProgressStep(nextStep, userId);
    } catch (err: any) {
      setSaveError(err?.message || "Failed to save creator goals.");
    } finally {
      setIsSaving(false);
    }
  }, [data, isSaving, userId]);

  // Final review submission on Step 6
  const handleSubmitReview = async () => {
    setSaveError(null);
    const res = await creatorOnboardingService.completeOnboarding(data, userId);
    if (res.success) {
      // ONLY now upon verified backend completion, advance to Step 7 Celebration!
      setData((prev) => ({
        ...prev,
        step: 7,
        isCompleted: true,
        completedAt: new Date().toISOString(),
      }));
    }
  };

  const handleGoToDashboard = () => {
    router.replace("/influencer");
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

        {/* Global Save Error Banner */}
        {saveError && (
          <div className="max-w-xl mx-auto w-full my-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="flex-1">{saveError}</span>
            <button
              type="button"
              onClick={() => setSaveError(null)}
              className="text-rose-400 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Step Component Content */}
        <main className="flex-1 flex flex-col justify-center">
          {currentStep === 1 && (
            <Step1Welcome onNext={handleStep1Next} />
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
              onNext={handleStep2Next}
              onBack={handleBackStep}
            />
          )}

          {currentStep === 3 && (
            <Step3Niche
              selectedNiches={data.niches}
              customNiche={data.customNiche}
              onUpdate={handleUpdate}
              onNext={handleStep3Next}
              onBack={handleBackStep}
            />
          )}

          {currentStep === 4 && (
            <Step4Social
              socialAccounts={data.socialAccounts}
              onUpdate={handleUpdate}
              onNext={handleStep4Next}
              onBack={handleBackStep}
            />
          )}

          {currentStep === 5 && (
            <Step5Goals
              selectedGoals={data.goals}
              onUpdate={handleUpdate}
              onNext={handleStep5Next}
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
