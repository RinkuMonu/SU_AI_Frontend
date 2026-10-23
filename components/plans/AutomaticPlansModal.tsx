"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { getBrandKit } from "@/services/brand.service";
import { businessService } from "@/services/business.service";
import { socialService } from "@/services/social.service";
import { subscriptionService } from "@/services/subscription.service";
import { isBrandKitComplete } from "@/lib/brand-kit";
import { normalizeRole } from "@/lib/role-routing";
import { evaluatePlatformConnections } from "@/lib/social-connectivity";
import { shouldDisplayPlansModal, isQualifyingPlanActive } from "@/lib/plan-onboarding";
import { AvailablePlansModal } from "./AvailablePlansModal";

export function AutomaticPlansModal() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [sessionDismissed, setSessionDismissed] = useState<boolean>(false);
  const [hasEvaluated, setHasEvaluated] = useState<boolean>(false);

  /**
   * Queries authoritative backend status and decides whether to display Step 3: Available Plans.
   */
  const evaluatePlansOnboarding = useCallback(async () => {
    // 1. Wait until user session is ready
    if (isLoading || !user) return;

    // 2. Strict Role Check: Businessman only; Influencer users are excluded
    const role = normalizeRole(user.role);
    if (role !== "businessman") {
      setIsOpen(false);
      return;
    }

    // 3. Do not auto-popup over dedicated management/billing pages
    if (
      pathname === "/subscription" ||
      pathname === "/brand" ||
      pathname?.startsWith("/social-platforms")
    ) {
      setIsOpen(false);
      return;
    }

    // 4. Preserve temporary session dismissal for this mounted session
    if (sessionDismissed) {
      setIsOpen(false);
      return;
    }

    try {
      // 5. Query authoritative backend sources concurrently
      const [brandRes, bizRes, socialRes, subRes] = await Promise.allSettled([
        getBrandKit(),
        businessService.getMyBusiness(),
        socialService.getOnboardingStatus(),
        subscriptionService.getMySubscription(),
      ]);

      const brand = brandRes.status === "fulfilled" ? brandRes.value : null;
      const biz = bizRes.status === "fulfilled" ? bizRes.value : null;
      const socialStatus = socialRes.status === "fulfilled" ? socialRes.value : null;
      const sub = subRes.status === "fulfilled" ? subRes.value : null;

      // 6. Prerequisite 1: Brand Kit must be complete (Step 1)
      const brandDone = isBrandKitComplete(brand, biz);
      if (!brandDone) {
        setIsOpen(false);
        return;
      }

      // 7. Prerequisite 2: Social Media Connectivity must be complete (Step 2: >=1 connected)
      const socialState = evaluatePlatformConnections(biz, socialStatus);
      if (!socialState.hasAtLeastOne) {
        setIsOpen(false);
        return;
      }

      // 8. Evaluate whether to display Available Plans modal
      const shouldOpen = shouldDisplayPlansModal({
        userRole: user.role,
        brandKit: brand,
        business: biz,
        socialConnections: socialState,
        subscription: sub,
        sessionDismissed,
        pathname,
      });

      setIsOpen(shouldOpen);
    } catch (err) {
      console.warn("Unable to evaluate plans onboarding state", err);
    } finally {
      setHasEvaluated(true);
    }
  }, [user, isLoading, pathname, sessionDismissed]);

  useEffect(() => {
    evaluatePlansOnboarding();
  }, [evaluatePlansOnboarding]);

  // Listen for 'social:completed' custom event dispatched when Step 2 finishes
  useEffect(() => {
    const handleSocialCompleted = () => {
      setTimeout(() => {
        evaluatePlansOnboarding();
      }, 350);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("social:completed", handleSocialCompleted);
      return () => {
        window.removeEventListener("social:completed", handleSocialCompleted);
      };
    }
  }, [evaluatePlansOnboarding]);

  /**
   * Handles user decline or close action.
   * Closes the popup for the current mounted session without marking onboarding complete.
   * Reopens after refresh or next dashboard visit while requirement remains incomplete.
   */
  const handleDecline = () => {
    setIsOpen(false);
    setSessionDismissed(true);
  };

  /**
   * Called when a plan is successfully activated and verified by the backend.
   */
  const handlePlanActivated = (planId: string) => {
    setIsOpen(false);
    setSessionDismissed(true);
  };

  if (!isOpen) return null;

  return (
    <AvailablePlansModal
      isOpen={isOpen}
      onClose={handleDecline}
      onPlanActivated={handlePlanActivated}
      isModal={true}
    />
  );
}
