"use client";

import { useEffect } from "react";

/**
 * Security & Stability Shield:
 * Handles global 401 unhandled rejections to prevent development overlays.
 * Inspect button, right-click context menu, and developer tools are fully enabled.
 */
export function SecurityShield() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Handle 401 Unauthorized unhandled promise rejections cleanly
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      if (
        reason &&
        (reason.isAxiosError || reason.name === "AxiosError") &&
        (reason.response?.status === 401 || reason.status === 401 || reason.__isHandled401)
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null;
}
