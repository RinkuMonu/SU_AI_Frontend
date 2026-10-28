"use client";

import { normalizeRole } from "./role-routing";

export type ModalType = "plan" | "social" | "brand";

const POPUP_COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes between automated reappearances
const STORAGE_PLAN_DISMISSED = "uzone_plan_modal_dismissed_at";
const STORAGE_SOCIAL_DISMISSED = "uzone_social_modal_dismissed_at";
const STORAGE_ACTIVE_MODAL = "uzone_active_modal";
const STORAGE_INTERACTION_BUSY = "uzone_form_interaction_busy";

/**
 * Checks if the user is currently on a page where popups should never interrupt.
 */
export function isRouteExcludedForPopups(pathname?: string | null): boolean {
  if (!pathname) return true;
  const excludedPrefixes = [
    "/subscription",
    "/payment",
    "/social-platforms",
    "/brand",
    "/login",
    "/signup",
    "/select-role",
    "/preview",
    "/onboarding",
  ];
  return excludedPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * Checks whether the current user or session has reached and selected
 * at least one service in the "Choose Your Business Services" step.
 */
export function hasSelectedBusinessServices(user?: any, business?: any): boolean {
  if (typeof window === "undefined") return false;

  try {
    // 1. Session Storage
    const sessionServices = sessionStorage.getItem("business_selected_services");
    if (sessionServices) {
      const parsed = JSON.parse(sessionServices);
      if (Array.isArray(parsed) && parsed.length > 0) return true;
    }

    // 2. Local Storage
    const localServices =
      localStorage.getItem("business_selected_services") ||
      localStorage.getItem("selected_services");
    if (localServices) {
      const parsed = JSON.parse(localServices);
      if (Array.isArray(parsed) && parsed.length > 0) return true;
    }

    // 3. User object
    if (Array.isArray(user?.selected_services) && user.selected_services.length > 0) {
      return true;
    }

    // 4. Business record
    if (Array.isArray(business?.selected_services) && business.selected_services.length > 0) {
      return true;
    }
    if (Array.isArray(business?.business_services) && business.business_services.length > 0) {
      return true;
    }
  } catch (err) {
    console.warn("Error reading selected business services", err);
  }

  return false;
}

/**
 * Global active popup state (mutex)
 */
let memoryActiveModal: ModalType | null = null;

export function getActiveModal(): ModalType | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem(STORAGE_ACTIVE_MODAL) as ModalType | null;
  return memoryActiveModal || stored || null;
}

export function setActiveModal(modal: ModalType | null): void {
  memoryActiveModal = modal;
  if (typeof window !== "undefined") {
    if (modal) {
      sessionStorage.setItem(STORAGE_ACTIVE_MODAL, modal);
    } else {
      sessionStorage.removeItem(STORAGE_ACTIVE_MODAL);
    }
    window.dispatchEvent(new CustomEvent("popup:active_changed", { detail: { activeModal: modal } }));
  }
}

/**
 * Indicates whether user is actively interacting with a form, fetching website, or performing a Maps search.
 */
export function setFormInteractionBusy(busy: boolean): void {
  if (typeof window === "undefined") return;
  if (busy) {
    sessionStorage.setItem(STORAGE_INTERACTION_BUSY, "true");
  } else {
    sessionStorage.removeItem(STORAGE_INTERACTION_BUSY);
  }
}

export function isFormInteractionBusy(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(STORAGE_INTERACTION_BUSY) === "true";
}

/**
 * Cooldown management for Plan / Billing modal
 */
export function getPlanModalCooldownRemaining(): number {
  if (typeof window === "undefined") return 0;
  const dismissedStr = sessionStorage.getItem(STORAGE_PLAN_DISMISSED);
  if (!dismissedStr) return 0;
  const dismissedAt = parseInt(dismissedStr, 10);
  if (isNaN(dismissedAt)) return 0;
  const elapsed = Date.now() - dismissedAt;
  return Math.max(0, POPUP_COOLDOWN_MS - elapsed);
}

export function recordPlanModalDismissal(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_PLAN_DISMISSED, Date.now().toString());
  if (getActiveModal() === "plan") {
    setActiveModal(null);
  }
}

export function resetPlanModalCooldown(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_PLAN_DISMISSED);
}

/**
 * Cooldown management for Social Connectivity modal
 */
export function getSocialModalCooldownRemaining(): number {
  if (typeof window === "undefined") return 0;
  const dismissedStr = sessionStorage.getItem(STORAGE_SOCIAL_DISMISSED);
  if (!dismissedStr) return 0;
  const dismissedAt = parseInt(dismissedStr, 10);
  if (isNaN(dismissedAt)) return 0;
  const elapsed = Date.now() - dismissedAt;
  return Math.max(0, POPUP_COOLDOWN_MS - elapsed);
}

export function recordSocialModalDismissal(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_SOCIAL_DISMISSED, Date.now().toString());
  if (getActiveModal() === "social") {
    setActiveModal(null);
  }
}

export function resetSocialModalCooldown(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_SOCIAL_DISMISSED);
}

/**
 * Evaluates whether the Plan / Billing popup is eligible to open.
 */
export function isPlanPopupEligible(params: {
  user?: any;
  pathname?: string | null;
  hasActiveQualifyingPlan?: boolean;
}): boolean {
  const { user, pathname, hasActiveQualifyingPlan } = params;

  if (!user) return false;
  if (normalizeRole(user.role) !== "businessman") return false;
  if (isRouteExcludedForPopups(pathname)) return false;
  if (isFormInteractionBusy()) return false;

  // Active modal mutex: do not open if another modal is currently active
  const current = getActiveModal();
  if (current !== null && current !== "plan") return false;

  // Cooldown check
  if (getPlanModalCooldownRemaining() > 0) return false;

  return true;
}

/**
 * Evaluates whether the Social Connectivity popup is eligible to open.
 * Strictly requires having reached and selected services in "Choose Your Business Services".
 */
export function isSocialPopupEligible(params: {
  user?: any;
  business?: any;
  pathname?: string | null;
  hasAtLeastOneConnected?: boolean;
}): boolean {
  const { user, business, pathname, hasAtLeastOneConnected } = params;

  if (!user) return false;
  if (normalizeRole(user.role) !== "businessman") return false;
  if (isRouteExcludedForPopups(pathname)) return false;
  if (isFormInteractionBusy()) return false;

  // CRITICAL REQUIREMENT:
  // Must have reached and selected at least one business service!
  if (!hasSelectedBusinessServices(user, business)) {
    return false;
  }

  // If user already connected at least one account, automatic modal does not nag them
  if (hasAtLeastOneConnected) return false;

  // Active modal mutex
  const current = getActiveModal();
  if (current !== null && current !== "social") return false;

  // Cooldown check
  if (getSocialModalCooldownRemaining() > 0) return false;

  return true;
}
