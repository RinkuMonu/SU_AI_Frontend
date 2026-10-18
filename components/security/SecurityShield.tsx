"use client";

import { useEffect } from "react";

/**
 * Silent Security Shield:
 * Protects frontend & API completely in the background without any visible popups, banners, or UI interference.
 */
export function SecurityShield() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Silently prevent Right-Click Context Menu (except inside form inputs/textareas)
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
    };

    // 2. Silently block DevTools & Source View Shortcut Keys
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // F12
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Ctrl+Shift+I / Cmd+Option+I (Inspect)
      // Ctrl+Shift+J / Cmd+Option+J (Console)
      // Ctrl+Shift+C / Cmd+Option+C (Inspect Element)
      if (
        (cmdOrCtrl && e.shiftKey && (e.key === "I" || e.key === "i" || e.keyCode === 73)) ||
        (cmdOrCtrl && e.shiftKey && (e.key === "J" || e.key === "j" || e.keyCode === 74)) ||
        (cmdOrCtrl && e.shiftKey && (e.key === "C" || e.key === "c" || e.keyCode === 67))
      ) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Ctrl+U / Cmd+Option+U (View Page Source)
      if (
        (cmdOrCtrl && (e.key === "U" || e.key === "u" || e.keyCode === 85)) ||
        (isMac && e.metaKey && e.altKey && (e.key === "U" || e.key === "u"))
      ) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Ctrl+S / Cmd+S (Save Page)
      if (cmdOrCtrl && (e.key === "S" || e.key === "s" || e.keyCode === 83)) {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // 3. Silently sanitize console to prevent token leakage
    const originalLog = console.log;
    const originalInfo = console.info;
    const originalDebug = console.debug;

    console.log = (...args: any[]) => {
      const str = String(args[0] || "");
      if (
        str.toLowerCase().includes("token") ||
        str.toLowerCase().includes("bearer") ||
        str.toLowerCase().includes("password") ||
        str.toLowerCase().includes("secret")
      ) {
        return;
      }
      originalLog.apply(console, args);
    };

    console.info = (...args: any[]) => {
      const str = String(args[0] || "");
      if (str.toLowerCase().includes("token") || str.toLowerCase().includes("bearer")) return;
      originalInfo.apply(console, args);
    };

    console.debug = () => {};

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      console.log = originalLog;
      console.info = originalInfo;
      console.debug = originalDebug;
    };
  }, []);

  // Completely invisible - no popups, no banners, no UI disturbance
  return null;
}
