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
  const [showSocialReminder,  setShowSocialReminder]  = useState(false);
  const reminderTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── fetch onboarding status from backend ──────────────────────────────────
  const refreshStatus = async () => {
    if (!user) return;
    try {
      const data = await OnboardingService.getStatus();
      setStatus(data);

      // If business is done and we are still on step 1 → show success popup
      if (data.business_profile_completed && data.onboarding_step <= 1) {
        setShowBusinessSuccess(true);
      }
    } catch (e: any) {
      if (e?.response?.status !== 404) console.error("onboarding status error:", e);
    }
  };

  // ── on mount / user change: also check localStorage flag from signup page ──
  useEffect(() => {
    if (!user) return;

    // Signup page sets this flag before redirecting to /dashboard
    const justRegistered = localStorage.getItem("business_just_registered");
    if (justRegistered === "1") {
      localStorage.removeItem("business_just_registered");
      setShowBusinessSuccess(true);
    } else {
      refreshStatus();
    }
  }, [user]);

  // ── 10-minute reminder after business success popup is closed ─────────────
  useEffect(() => {
    if (!status) return;
    if (!status.business_profile_completed) return;
    if (status.social_connection_completed)  return;

    // Show social reminder when user is on step 2
    if (status.onboarding_step === 2 && status.connected_platforms.length === 0) {
      setShowSocialReminder(true);
    }

    // Schedule recurring 10-minute reminder
    if (reminderTimer.current) clearInterval(reminderTimer.current);
    reminderTimer.current = setInterval(() => {
      setShowSocialReminder(prev => {
        if (!prev) return true; // only open if not already open
        return prev;
      });
    }, 10 * 60 * 1000);

    return () => {
      if (reminderTimer.current) clearInterval(reminderTimer.current);
    };
  }, [status]);

  // ── handlers ─────────────────────────────────────────────────────────────
  const handleBusinessContinue = async () => {
    setShowBusinessSuccess(false);
    try {
      await OnboardingService.updateProgress({ onboarding_step: 2 });
    } catch {}
    // Immediately show social reminder
    setShowSocialReminder(true);
  };

  const handleSocialSkip = () => setShowSocialReminder(false);

  const handleGoToIntegrations = async () => {
    setShowSocialReminder(false);
    router.push("/integrations");
  };

  // ─── render ───────────────────────────────────────────────────────────────
  return (
    <OnboardingContext.Provider value={{ status, refreshStatus }}>
      {children}

      {/* ── Business Registration Success Modal ── */}
      <Dialog open={showBusinessSuccess} onOpenChange={setShowBusinessSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              🎉 Business Profile Created!
            </DialogTitle>
            <DialogDescription className="text-sm text-white/70 mt-2">
              Your business profile has been created successfully! Let's connect
              your social media accounts to unlock the full potential of
              SevenUnique AI.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              onClick={handleBusinessContinue}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
            >
              Continue → Connect Social Media
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Social Media Connection Reminder Modal ── */}
      <Dialog open={showSocialReminder} onOpenChange={setShowSocialReminder}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              📱 Connect Your Social Media
            </DialogTitle>
            <DialogDescription className="text-sm text-white/70 mt-2">
              Connect Instagram, Facebook, or WhatsApp Business to create,
              schedule, and publish AI-generated content directly from
              SevenUnique AI.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            <Button
              variant="outline"
              onClick={handleGoToIntegrations}
              className="w-full border-purple-500/50 hover:bg-purple-600/10 text-white"
            >
              🔗 Go to Integrations Page
            </Button>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={handleSocialSkip}
              className="text-white/50 hover:text-white"
            >
              Remind me later (10 min)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </OnboardingContext.Provider>
  );
};
