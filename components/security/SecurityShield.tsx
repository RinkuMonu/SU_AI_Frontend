"use client";

import { useEffect } from "react";

/**
 * Security Shield:
 * Global handler for unhandled promise rejections and session errors
 * without blocking developer tools, inspect element, or right-click.
 */
export function SecurityShield() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Handle 401 Unauthorized unhandled promise rejections silently
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
