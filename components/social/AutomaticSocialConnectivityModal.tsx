"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { businessService } from "@/services/business.service";
import { socialService } from "@/services/social.service";
import { normalizeRole } from "@/lib/role-routing";
import { evaluatePlatformConnections, shouldDisplaySocialModal } from "@/lib/social-connectivity";
import {
  recordSocialModalDismissal,
  setActiveModal,
  getActiveModal,
  isSocialPopupEligible,
  hasSelectedBusinessServices,
} from "@/lib/popup-coordinator";
import { SocialConnectivityModal } from "./SocialConnectivityModal";

export function AutomaticSocialConnectivityModal() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [sessionDismissed, setSessionDismissed] = useState(false);

  /**
   * Evaluates onboarding prerequisites and queries backend for authoritative status.
   */
  const evaluateOnboardingState = useCallback(async () => {
    // 1. Wait until authentication state is ready
    if (isLoading || !user) return;

    // 2. Strict Role Check: Businessman only
    const role = normalizeRole(user.role);
    if (role !== "businessman") {
      setIsOpen(false);
      return;
    }

    // 3. If dismissed in this mounted session, preserve dismissal
    if (sessionDismissed) {
      setIsOpen(false);
      return;
    }

    // 4. Critical Eligibility Rule: User must have reached and selected at least 1 service
    // in "Choose Your Business Services" step
    if (!hasSelectedBusinessServices(user)) {
      setIsOpen(false);
      return;
    }

    // 5. Check eligibility via popup coordinator (route exclusion, mutex, cooldown, busy checks)
    if (
      !isSocialPopupEligible({
        user,
        pathname,
      })
    ) {
      setIsOpen(false);
      return;
    }

    try {
      // 6. Query authoritative backend sources concurrently
      const [bizRes, socialRes] = await Promise.allSettled([
        businessService.getMyBusiness(),
        socialService.getOnboardingStatus(),
      ]);

      const biz = bizRes.status === "fulfilled" ? bizRes.value : null;
      const socialStatus = socialRes.status === "fulfilled" ? socialRes.value : null;

      // 7. Check platform connections
      const connectionState = evaluatePlatformConnections(biz, socialStatus);

      // 8. If at least 1 account is connected, stop displaying automatic popup
      if (connectionState.hasAtLeastOne) {
        setIsOpen(false);
        return;
      }

      // 9. Evaluate whether to display modal
      const shouldOpen = shouldDisplaySocialModal({
        userRole: user.role,
        business: biz,
        connectionState,
        sessionDismissed,
        pathname,
      });

      if (shouldOpen) {
        setActiveModal("social");
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    } catch (err) {
      console.warn("Unable to evaluate social connectivity onboarding state", err);
    }
  }, [user, isLoading, pathname, sessionDismissed]);

  // Run evaluation on mount and route changes
  useEffect(() => {
    evaluateOnboardingState();
  }, [evaluateOnboardingState]);

  // Listen for popup active changes from coordinator or checkpoints
  useEffect(() => {
    const handleActiveChanged = () => {
      const active = getActiveModal();
      if (active !== null && active !== "social") {
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

  /**
   * Handles user decline or close action.
   * Closes the popup and records cooldown to prevent nuisance popping on every navigation.
   */
  const handleDecline = () => {
    recordSocialModalDismissal();
    setActiveModal(null);
    setIsOpen(false);
    setSessionDismissed(true);
  };

  /**
   * Handles successful continuation after >=1 account is connected.
   */
  const handleContinueSuccess = () => {
    recordSocialModalDismissal();
    setActiveModal(null);
    setIsOpen(false);
    setSessionDismissed(true);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("social:completed"));
    }
  };

  if (!isOpen) return null;

  return (
    <SocialConnectivityModal
      isOpen={isOpen}
      onClose={handleDecline}
      onContinueSuccess={handleContinueSuccess}
      isModal={true}
    />
  );
}

