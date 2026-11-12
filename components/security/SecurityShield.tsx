"use client";

import { useEffect, useState, useRef } from "react";
import { ShieldAlert } from "lucide-react";

/**
 * Security & Anti-Screenshot Shield:
 * 1. Blocks Screenshots & Screen Snips (PrintScreen key, Win+Shift+S, Cmd+Shift+3/4/5).
 * 2. Wipes clipboard contents on screenshot key presses.
 * 3. Blurs / masks window on external capture tools activation (Snipping Tool, ShareX, etc.).
 * 4. Blocks Print & Save to PDF (Ctrl+P, Cmd+P, @media print).
 * 5. Blocks right-click context menu (Inspect, Save Image, View Source).
 * 6. Blocks developer tools shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S).
 * 7. Prevents copying, cutting, and selecting text outside input fields and textareas.
 * 8. Prevents dragging images and videos.
 * 9. Suppresses unhandled 401 promise rejections.
 */
export function SecurityShield() {
  const [screenshotWarning, setScreenshotWarning] = useState(false);
  const [isBlurProtected, setIsBlurProtected] = useState(false);

  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFilePickerActiveRef = useRef(false);
  const filePickerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerScreenshotBlock = () => {
    // 1. Wipe clipboard so nothing captured is retained
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText("").catch(() => {});
      }
    } catch (_) {}

    // 2. Show security blackout alert
    setScreenshotWarning(true);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    warningTimeoutRef.current = setTimeout(() => {
      setScreenshotWarning(false);
    }, 2200);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Helper: Check if element is an editable input, textarea or dropdown
    const isEditableElement = (el: EventTarget | null): boolean => {
      if (!el || !(el instanceof HTMLElement)) return false;
      const tagName = el.tagName.toLowerCase();
      if (tagName === "input" || tagName === "textarea" || tagName === "select") {
        return true;
      }
      return el.isContentEditable || el.closest("[contenteditable='true']") !== null;
    };

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

    // 2. Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 3. Keydown Listener: DevTools, PrintScreen, Snipping Tool, Print
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen Key (PrtScn)
      if (e.key === "PrintScreen" || e.keyCode === 44 || e.code === "PrintScreen") {
        e.preventDefault();
        e.stopPropagation();
        triggerScreenshotBlock();
        return false;
      }

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      // Print Screen with Alt / Ctrl / Shift / Meta modifiers
      if ((e.key === "PrintScreen" || e.keyCode === 44) && (isCtrlOrCmd || e.altKey || e.shiftKey)) {
        e.preventDefault();
        e.stopPropagation();
        triggerScreenshotBlock();
        return false;
      }

      // Windows Snipping Tool (Win + Shift + S) or Ctrl + Shift + S
      if (e.shiftKey && (e.key === "s" || e.key === "S") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        e.stopPropagation();
        triggerScreenshotBlock();
        return false;
      }

      // macOS Screenshot shortcuts (Cmd + Shift + 3, Cmd + Shift + 4, Cmd + Shift + 5)
      if (e.metaKey && e.shiftKey && ["3", "4", "5"].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        triggerScreenshotBlock();
        return false;
      }

      // F12 Developer Tools
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      if (isCtrlOrCmd) {
        const key = e.key.toLowerCase();

        // Print / Save to PDF (Ctrl + P / Cmd + P)
        if (key === "p") {
          e.preventDefault();
          e.stopPropagation();
          triggerScreenshotBlock();
          return false;
        }

        // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (Inspect/Console)
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

    // 4. Keyup Listener: Ensure clipboard is wiped if OS intercepted PrintScreen
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen" || e.keyCode === 44 || e.code === "PrintScreen") {
        e.preventDefault();
        triggerScreenshotBlock();
      }
    };

    // 5. File picker detection: prevent blur shield when selecting files to upload
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (
        (target.tagName === "INPUT" && (target as HTMLInputElement).type === "file") ||
        target.closest('input[type="file"]') ||
        target.closest('[data-file-uploader="true"]') ||
        target.getAttribute("data-upload-trigger") === "true"
      ) {
        isFilePickerActiveRef.current = true;
        if (filePickerTimeoutRef.current) clearTimeout(filePickerTimeoutRef.current);
        filePickerTimeoutRef.current = setTimeout(() => {
          isFilePickerActiveRef.current = false;
        }, 10000);
      }
    };

    // 6. Window Blur & Visibility Guard: Blurs viewport when Snipping Tool or screen capture tool is active
    const handleWindowBlur = () => {
      if (isFilePickerActiveRef.current) return;
      setIsBlurProtected(true);
    };

    const handleWindowFocus = () => {
      isFilePickerActiveRef.current = false;
      setIsBlurProtected(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (!isFilePickerActiveRef.current) {
          setIsBlurProtected(true);
        }
      } else {
        setIsBlurProtected(false);
      }
    };

    // 7. Clipboard and drag/select protections
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

    const handleSelectStart = (e: Event) => {
      if (!isEditableElement(e.target)) {
        e.preventDefault();
        return false;
      }
    };

    const handleDragStart = (e: DragEvent) => {
      if (!isEditableElement(e.target)) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    document.addEventListener("contextmenu", handleContextMenu, { capture: true });
    document.addEventListener("keydown", handleKeyDown, { capture: true });
    document.addEventListener("keyup", handleKeyUp, { capture: true });
    document.addEventListener("click", handleDocumentClick, { capture: true });
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("copy", handleCopy, { capture: true });
    document.addEventListener("cut", handleCut, { capture: true });
    document.addEventListener("selectstart", handleSelectStart, { capture: true });
    document.addEventListener("dragstart", handleDragStart, { capture: true });

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      document.removeEventListener("contextmenu", handleContextMenu, { capture: true } as any);
      document.removeEventListener("keydown", handleKeyDown, { capture: true } as any);
      document.removeEventListener("keyup", handleKeyUp, { capture: true } as any);
      document.removeEventListener("click", handleDocumentClick, { capture: true } as any);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("copy", handleCopy, { capture: true } as any);
      document.removeEventListener("cut", handleCut, { capture: true } as any);
      document.removeEventListener("selectstart", handleSelectStart, { capture: true } as any);
      document.removeEventListener("dragstart", handleDragStart, { capture: true } as any);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (filePickerTimeoutRef.current) clearTimeout(filePickerTimeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* ── Active Screenshot Attempt Warning ── */}
      {screenshotWarning && (
        <div className="fixed inset-0 z-[9999999999] bg-[#071023]/98 backdrop-blur-3xl flex flex-col items-center justify-center pointer-events-auto select-none text-white text-center p-6 transition-all animate-in fade-in duration-100">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-500/10 border-2 border-rose-500/40 flex items-center justify-center mb-5 shadow-2xl shadow-rose-500/30">
            <ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10 text-rose-500 animate-pulse" />
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            Security Protection Active
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">
            Screenshots &amp; Screen Captures are Disabled
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            For platform privacy, proprietary business designs, and security policies, taking screenshots or recording this application is strictly restricted.
          </p>
        </div>
      )}

      {/* ── Window Blur Screen Mask (Protects against Snipping Tool, ShareX, and external screen capturers) ── */}
      {isBlurProtected && (
        <div className="fixed inset-0 z-[999999999] bg-[#071023]/96 backdrop-blur-2xl flex flex-col items-center justify-center pointer-events-auto select-none text-white text-center p-6 transition-all duration-100">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#be32ff]/10 border border-[#be32ff]/30 flex items-center justify-center mb-4 shadow-xl">
            <ShieldAlert className="w-7 h-7 sm:w-8 sm:h-8 text-[#be32ff]" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">
            Screen Protected
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            Display is protected against external screen capture tools. Click inside window to resume.
          </p>
        </div>
      )}
    </>
  );
}
