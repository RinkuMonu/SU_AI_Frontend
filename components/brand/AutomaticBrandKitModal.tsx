"use client";

import React from "react";
import { BrandKitCompletionNotification } from "./BrandKitCompletionNotification";

/**
 * Replaces the old blocking modal with the non-blocking Brand Kit Completion Notification.
 * Keeps existing imports and layout references intact without showing disruptive popups.
 */
export function AutomaticBrandKitModal() {
  return <BrandKitCompletionNotification />;
}
