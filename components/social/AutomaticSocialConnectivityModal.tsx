"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { getBrandKit } from "@/services/brand.service";
import { businessService } from "@/services/business.service";
import { socialService } from "@/services/social.service";
import { isBrandKitComplete } from "@/lib/brand-kit";
import { normalizeRole } from "@/lib/role-routing";
import { evaluatePlatformConnections, shouldDisplaySocialModal } from "@/lib/social-connectivity";
import { SocialConnectivityModal } from "./SocialConnectivityModal";

export function AutomaticSocialConnectivityModal() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [sessionDismissed, setSessionDismissed] = useState(false);
  const [hasEvaluated, setHasEvaluated] = useState(false);

  /**
   * Evaluates onboarding prerequisites and queries backend for authoritative status.
   */
  const evaluateOnboardingState = useCallback(async () => {
    // 1. Wait until authentication state is ready
    if (isLoading || !user) return;

    // 2. Strict Role Check: Influencers and non-business accounts NEVER see this popup
    const role = normalizeRole(user.role);
    if (role !== "businessman") {
      setIsOpen(false);
      return;
    }

    // 3. Do not auto-popup over dedicated management pages
    if (
      pathname.startsWith("/social-platforms") ||
      pathname === "/brand" ||
      pathname === "/subscription"
    ) {
      setIsOpen(false);
      return;
    }

    // 4. If dismissed in this mounted session, preserve dismissal
    if (sessionDismissed) {
      setIsOpen(false);
      return;
    }

    try {
      // 5. Query authoritative backend sources concurrently
      const [brandRes, bizRes, socialRes] = await Promise.allSettled([
        getBrandKit(),
        businessService.getMyBusiness(),
        socialService.getOnboardingStatus(),
      ]);

      const brand = brandRes.status === "fulfilled" ? brandRes.value : null;
      const biz = bizRes.status === "fulfilled" ? bizRes.value : null;
      const socialStatus = socialRes.status === "fulfilled" ? socialRes.value : null;

      // 6. Check Brand Kit prerequisite
      const brandKitComplete = isBrandKitComplete(brand, biz);
      if (!brandKitComplete) {
        // Brand Kit is incomplete; Brand Kit modal has priority. Do not show social modal yet.
        setIsOpen(false);
        return;
      }

      // 7. Check platform connections
      const connectionState = evaluatePlatformConnections(biz, socialStatus);

      // 8. If at least 1 account is connected, stop displaying popup
      if (connectionState.hasAtLeastOne) {
        setIsOpen(false);
        return;
      }

      // 9. Brand Kit complete & 0 social accounts connected: display modal
      const shouldOpen = shouldDisplaySocialModal({
        userRole: user.role,
        brandKit: brand,
        business: biz,
        connectionState,
        sessionDismissed,
        pathname,
      });

      setIsOpen(shouldOpen);
    } catch (err) {
      console.warn("Unable to evaluate social connectivity onboarding state", err);
    } finally {
      setHasEvaluated(true);
    }
  }, [user, isLoading, pathname, sessionDismissed]);

  // Run evaluation on mount and route changes
  useEffect(() => {
    evaluateOnboardingState();
  }, [evaluateOnboardingState]);

  // Listen for the 'brandkit:completed' custom event dispatched when Brand Kit is finished
  useEffect(() => {
    const handleBrandKitCompleted = () => {
      // Small tick to allow backend persistence to settle
      setTimeout(() => {
        evaluateOnboardingState();
      }, 300);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("brandkit:completed", handleBrandKitCompleted);
      return () => {
        window.removeEventListener("brandkit:completed", handleBrandKitCompleted);
      };
    }
  }, [evaluateOnboardingState]);

  /**
   * Handles user decline or close action.
   * Closes the popup for the current mounted session without marking onboarding complete.
   * Allows reopening on page refresh or next dashboard visit if accounts remain 0.
   */
  const handleDecline = () => {
    setIsOpen(false);
    setSessionDismissed(true);
  };

  /**
   * Handles successful continuation after >=1 account is connected.
   */
  const handleContinueSuccess = () => {
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
