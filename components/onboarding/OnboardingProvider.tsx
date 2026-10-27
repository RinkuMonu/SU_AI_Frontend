"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { OnboardingService, OnboardingStatus } from "@/services/onboarding.service";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// ─── Context ─────────────────────────────────────────────────────────────────
interface OnboardingCtx {
  status: OnboardingStatus | null;
  refreshStatus: () => Promise<void>;
}
const OnboardingContext = createContext<OnboardingCtx | null>(null);
export const useOnboarding = () => useContext(OnboardingContext);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router   = useRouter();

  const [status,              setStatus]              = useState<OnboardingStatus | null>(null);
  const [showBusinessSuccess, setShowBusinessSuccess] = useState(false);

  // ── fetch onboarding status from backend ──────────────────────────────────
  const refreshStatus = async () => {
    if (!user) return;
    try {
      const data = await OnboardingService.getStatus();
      setStatus(data);

      if (user?.accountType === "business" && data.business_profile_completed && data.onboarding_step <= 1) {
        setShowBusinessSuccess(true);
      }
    } catch (e: any) {
      if (
        e?.response?.status !== 401 &&
        e?.response?.status !== 404 &&
        e?.code !== "ERR_NETWORK" &&
        e?.message !== "Network Error"
      ) {
        console.warn("onboarding status error:", e?.message || e);
      }
    }
  };

  // ── on mount / user change: check localStorage flag from signup page ──────
  useEffect(() => {
    if (!user) return;

    const justRegistered = localStorage.getItem("business_just_registered");
    if (justRegistered === "1") {
      localStorage.removeItem("business_just_registered");
      setShowBusinessSuccess(true);
    } else {
      refreshStatus();
    }
  }, [user]);

  // ── handlers ─────────────────────────────────────────────────────────────
  const handleBusinessContinue = async () => {
    setShowBusinessSuccess(false);
    try {
      await OnboardingService.updateProgress({ onboarding_step: 2 });
    } catch {}
    router.push("/social-platforms/facebook");
  };

  // ─── render ───────────────────────────────────────────────────────────────
  return (
    <OnboardingContext.Provider value={{ status, refreshStatus }}>
      {children}

      {/* ── Business Registration Success Modal ── */}
      <Dialog open={showBusinessSuccess} onOpenChange={setShowBusinessSuccess}>
        <DialogContent className="sm:max-w-md border border-purple-500/30 bg-[#0B1120] shadow-2xl shadow-purple-900/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">🎉</span> Business Profile Created!
            </DialogTitle>
            <DialogDescription className="text-sm text-white/60 mt-2 leading-relaxed">
              Your business profile has been created successfully! Let&apos;s connect
              your social media accounts to unlock the full potential of DhandaGrow AI.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              onClick={handleBusinessContinue}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg shadow-purple-500/25 transition-all duration-200"
            >
              Continue → Connect Social Media
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </OnboardingContext.Provider>
  );
};
