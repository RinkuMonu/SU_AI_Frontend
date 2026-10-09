"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { OnboardingService, OnboardingStatus } from "@/services/onboarding.service";
import { useAuth } from "@/components/auth/AuthProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const OnboardingContext = createContext<{ status: OnboardingStatus | null; refreshStatus: () => Promise<void> } | null>(null);

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [showBusinessSuccess, setShowBusinessSuccess] = useState(false);
  const [showSocialReminder, setShowSocialReminder] = useState(false);

  const refreshStatus = async () => {
    if (!user) return;
    try {
      const data = await OnboardingService.getStatus();
      setStatus(data);
      
      if (data.business_profile_completed && data.onboarding_step === 1) {
        setShowBusinessSuccess(true);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    refreshStatus();
  }, [user]);

  useEffect(() => {
    if (!status || !status.business_profile_completed || status.social_connection_completed) return;

    if (status.onboarding_step === 2 && status.connected_platforms.length === 0) {
      setShowSocialReminder(true);
    }

    const interval = setInterval(() => {
       if (status.connected_platforms.length === 0 && !showSocialReminder && !showBusinessSuccess) {
          setShowSocialReminder(true);
       }
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [status, showSocialReminder, showBusinessSuccess]);

  const handleBusinessContinue = async () => {
    setShowBusinessSuccess(false);
    await OnboardingService.updateProgress({ onboarding_step: 2 });
    await refreshStatus();
  };

  const handleSocialConnectSkip = () => {
    setShowSocialReminder(false);
  };

  const handleSocialConnectSuccess = async () => {
    setShowSocialReminder(false);
    await OnboardingService.updateProgress({ social_connection_completed: true, onboarding_step: 3 });
    await refreshStatus();
    router.push('/pricing');
  };

  return (
    <OnboardingContext.Provider value={{ status, refreshStatus }}>
      {children}
      
      <Dialog open={showBusinessSuccess} onOpenChange={setShowBusinessSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your business profile has been created successfully!</DialogTitle>
            <DialogDescription>
              Let's connect your social media accounts to unlock the full potential of SevenUnique AI.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleBusinessContinue}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSocialReminder} onOpenChange={setShowSocialReminder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Your Social Media Accounts</DialogTitle>
            <DialogDescription>
              Connect your social media accounts to create, manage, schedule, and publish AI-generated content directly from SevenUnique AI.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
             <Button variant="outline" onClick={() => router.push('/integrations')}>Go to Integrations Page</Button>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={handleSocialConnectSkip}>Remind me later</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </OnboardingContext.Provider>
  );
};
