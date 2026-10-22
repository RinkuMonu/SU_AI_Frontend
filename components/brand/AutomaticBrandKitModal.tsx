"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { getBrandKit } from "@/services/brand.service";
import { businessService } from "@/services/business.service";
import { isBrandKitComplete } from "@/lib/brand-kit";
import { BrandKitRegistrationModal } from "./BrandKitRegistrationModal";
import { normalizeRole } from "@/lib/role-routing";

export function AutomaticBrandKitModal() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [sessionDismissed, setSessionDismissed] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkBrandKitStatus() {
      // 1. Wait until user session is ready
      if (isLoading || !user) return;

      // 2. Do not apply this popup behavior to Influencer/Creator accounts or admin
      const role = normalizeRole(user.role);
      if (role !== "businessman") return;

      // 3. Do not auto-popup over the dedicated /brand page
      if (pathname === "/brand") return;

      // 4. If dismissed in this mounted session, do not repeatedly reopen
      if (sessionDismissed) return;

      try {
        // 5. Query authoritative backend status
        const [brandRes, bizRes] = await Promise.allSettled([
          getBrandKit(),
          businessService.getMyBusiness(),
        ]);

        if (!isMounted) return;

        const brand = brandRes.status === "fulfilled" ? brandRes.value : null;
        const biz = bizRes.status === "fulfilled" ? bizRes.value : null;

        const complete = isBrandKitComplete(brand, biz);

        if (!complete) {
          setIsOpen(true);
        }
      } catch (err) {
        console.warn("Failed to check brand kit completion status", err);
      } finally {
        if (isMounted) setHasChecked(true);
      }
    }

    checkBrandKitStatus();

    return () => {
      isMounted = false;
    };
  }, [user, isLoading, pathname, sessionDismissed]);

  const handleDecline = () => {
    // Dismiss modal for this mounted session without marking complete
    setIsOpen(false);
    setSessionDismissed(true);
  };

  const handleComplete = () => {
    setIsOpen(false);
    setSessionDismissed(true);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("brandkit:completed"));
    }
  };

  if (!isOpen) return null;

  return (
    <BrandKitRegistrationModal
      isOpen={isOpen}
      onClose={handleDecline}
      onComplete={handleComplete}
      isModal={true}
    />
  );
}
