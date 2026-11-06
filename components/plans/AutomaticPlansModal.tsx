"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { businessService } from "@/services/business.service";
import { subscriptionService } from "@/services/subscription.service";
import { normalizeRole } from "@/lib/role-routing";
import { shouldDisplayPlansModal, isQualifyingPlanActive } from "@/lib/plan-onboarding";
import {
  recordPlanModalDismissal,
  setActiveModal,
  getActiveModal,
  isPlanPopupEligible,
  setPlansEvaluating,
} from "@/lib/popup-coordinator";
import { AvailablePlansModal } from "./AvailablePlansModal";

export function AutomaticPlansModal() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [sessionDismissed, setSessionDismissed] = useState<boolean>(false);

  /**
   * Queries authoritative backend status and decides whether to display Available Plans.
   */
  const evaluatePlansOnboarding = useCallback(async () => {
    // 1. Wait until user session is ready
    if (isLoading || !user) return;

    // 2. Strict Role Check: Businessman only
    const role = normalizeRole(user.role);
    if (role !== "businessman") {
      setPlansEvaluating(false);
      setIsOpen(false);
      return;
    }

    // 3. Preserve temporary session dismissal for this mounted instance
    if (sessionDismissed) {
      setPlansEvaluating(false);
      setIsOpen(false);
      return;
    }

    // 4. Check eligibility via popup coordinator
    if (
      !isPlanPopupEligible({
        user,
        pathname,
      })
    ) {
      setPlansEvaluating(false);
      setIsOpen(false);
      return;
    }

    setPlansEvaluating(true);
    try {
      const [bizRes, subRes] = await Promise.allSettled([
        businessService.getMyBusiness(),
        subscriptionService.getMySubscription(),
      ]);

      const biz = bizRes.status === "fulfilled" ? bizRes.value : null;
      const sub = subRes.status === "fulfilled" ? subRes.value : null;

      const shouldOpen = shouldDisplayPlansModal({
        userRole: user.role,
        business: biz,
        subscription: sub,
        sessionDismissed,
        pathname,
      });

      if (shouldOpen) {
        setActiveModal("plan");
        setIsOpen(true);
      } else {
        setIsOpen(false);
        setActiveModal(null);
      }
    } catch (err) {
      console.warn("Unable to evaluate plans onboarding state", err);
      setActiveModal(null);
    } finally {
      setPlansEvaluating(false);
    }
  }, [user, isLoading, pathname, sessionDismissed]);

  useEffect(() => {
    evaluatePlansOnboarding();
  }, [evaluatePlansOnboarding]);

  // Listen for popup active changes from coordinator or checkpoints
  useEffect(() => {
    const handleActiveChanged = () => {
      const active = getActiveModal();
      if (active !== null && active !== "plan") {
        setIsOpen(false);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("popup:active_changed", handleActiveChanged);
      return () => {
        window.removeEventListener("popup:active_changed", handleActiveChanged);
      };
    }
  }, []);

  // Listen for insufficient credits to prompt user to upgrade plan
  useEffect(() => {
    const handleInsufficientCredits = () => {
      setActiveModal("plan");
      setIsOpen(true);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("insufficient-credits", handleInsufficientCredits);
      return () => {
        window.removeEventListener("insufficient-credits", handleInsufficientCredits);
      };
    }
  }, []);

  /**
   * Handles user decline or close action.
   * Records cooldown timestamp to prevent nuisance re-popping on every route change.
   */
  const handleDecline = () => {
    setPlansEvaluating(false);
    recordPlanModalDismissal();
    setActiveModal(null);
    setIsOpen(false);
    setSessionDismissed(true);
  };

  /**
   * Called when a plan is successfully activated and verified by the backend.
   */
  const handlePlanActivated = (planId: string) => {
    setPlansEvaluating(false);
    recordPlanModalDismissal();
    setActiveModal(null);
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
