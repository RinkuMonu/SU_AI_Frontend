"use client";

import { useEffect } from "react";

/**
 * Security & Stability Shield:
 * 1. Global handler for unhandled promise rejections and 401 session errors.
 * 2. Blocks right-click context menu (Inspect, View Source, etc.).
 * 3. Blocks developer tools shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S).
 * 4. Prevents copying, cutting, and selecting text outside input fields and textareas.
 */
export function SecurityShield() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Handle 401 Unauthorized unhandled promise rejections cleanly
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

    // Helper: Check if element is an editable input, textarea or dropdown
    const isEditableElement = (el: EventTarget | null): boolean => {
      if (!el || !(el instanceof HTMLElement)) return false;
      const tagName = el.tagName.toLowerCase();
      if (tagName === "input" || tagName === "textarea" || tagName === "select") {
        return true;
      }
      return el.isContentEditable || el.closest("[contenteditable='true']") !== null;
    };

    // 2. Disable right-click context menu (inspect dialog box)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 3. Disable DevTools shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, etc.)
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      if (isCtrlOrCmd) {
        const key = e.key.toLowerCase();

        // Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Element Inspector)
        if (e.shiftKey && (key === "i" || key === "j" || key === "c")) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        // Ctrl+U (View Page Source)
        if (key === "u") {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        // Ctrl+S (Save Page)
        if (key === "s") {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        // Ctrl+C (Copy) outside input fields
        if (key === "c" && !isEditableElement(e.target)) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
    };

    // 4. Disable Copy & Cut events outside editable elements
    const handleCopy = (e: ClipboardEvent) => {
      if (!isEditableElement(e.target)) {
        e.preventDefault();
        return false;
      }
    };

    const handleCut = (e: ClipboardEvent) => {
      if (!isEditableElement(e.target)) {
        e.preventDefault();
        return false;
      }
    };

    // 5. Disable selection of text outside editable elements
    const handleSelectStart = (e: Event) => {
      if (!isEditableElement(e.target)) {
        e.preventDefault();
        return false;
      }
    };

    // 6. Disable dragging text and images
    const handleDragStart = (e: DragEvent) => {
      if (!isEditableElement(e.target)) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    document.addEventListener("contextmenu", handleContextMenu, { capture: true });
    document.addEventListener("keydown", handleKeyDown, { capture: true });
    document.addEventListener("copy", handleCopy, { capture: true });
    document.addEventListener("cut", handleCut, { capture: true });
    document.addEventListener("selectstart", handleSelectStart, { capture: true });
    document.addEventListener("dragstart", handleDragStart, { capture: true });

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      document.removeEventListener("contextmenu", handleContextMenu, { capture: true } as any);
      document.removeEventListener("keydown", handleKeyDown, { capture: true } as any);
      document.removeEventListener("copy", handleCopy, { capture: true } as any);
      document.removeEventListener("cut", handleCut, { capture: true } as any);
      document.removeEventListener("selectstart", handleSelectStart, { capture: true } as any);
      document.removeEventListener("dragstart", handleDragStart, { capture: true } as any);
    };
  }, []);

  return null;
}
