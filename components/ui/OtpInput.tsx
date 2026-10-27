"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  length?: number;
  autoFocus?: boolean;
  hasError?: boolean;
  className?: string;
  boxClassName?: string;
}

export function OtpInput({
  value,
  onChange,
  onComplete,
  disabled = false,
  length = 6,
  autoFocus = true,
  hasError = false,
  className,
  boxClassName,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [length, autoFocus, disabled]);

  const digits = Array.from({ length }, (_, i) => value[i] || "");

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    // Extract only digits
    const cleanDigit = rawVal.replace(/\D/g, "");

    if (cleanDigit.length === 0) {
      // Empty / cleared
      const nextValue = value.slice(0, index) + "" + value.slice(index + 1);
      onChange(nextValue);
      return;
    }

    // Single digit input
    const char = cleanDigit.slice(-1);
    const chars = value.split("");
    while (chars.length < length) chars.push("");
    chars[index] = char;
    const nextValue = chars.join("").slice(0, length);
    onChange(nextValue);

    // Auto-advance focus to next cell
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (nextValue.length === length && onComplete) {
      onComplete(nextValue);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // Move back and clear previous
        const chars = value.split("");
        chars[index - 1] = "";
        const nextValue = chars.join("");
        onChange(nextValue);
        inputRefs.current[index - 1]?.focus();
      } else if (digits[index]) {
        // Clear current
        const chars = value.split("");
        chars[index] = "";
        onChange(chars.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain");
    const pasteDigits = pasteData.replace(/\D/g, "").slice(0, length);

    if (pasteDigits.length > 0) {
      onChange(pasteDigits);
      const focusIndex = Math.min(pasteDigits.length, length - 1);
      inputRefs.current[focusIndex]?.focus();

      if (pasteDigits.length === length && onComplete) {
        onComplete(pasteDigits);
      }
    }
  };

  return (
    <div
      role="group"
      aria-label="6-digit verification code"
      className={cn("flex items-center justify-center gap-2 sm:gap-3", className)}
    >
      {Array.from({ length }).map((_, index) => {
        const digit = digits[index] || "";
        const isCurrentFocus =
          value.length === index || (value.length === length && index === length - 1);

        return (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={digit}
            disabled={disabled}
            aria-label={`Digit ${index + 1} of ${length}`}
            aria-invalid={hasError ? "true" : "false"}
            onChange={(e) => handleInputChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={cn(
              "w-11 h-14 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl transition-all outline-none",
              "bg-white dark:bg-[#15161b] text-neutral-900 dark:text-white border shadow-sm",
              hasError
                ? "border-red-500 bg-red-50/50 dark:bg-red-500/10 text-red-500 dark:text-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : digit
                ? "border-emerald-500 dark:border-emerald-500 text-neutral-900 dark:text-white ring-2 ring-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                : "border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20",
              disabled && "opacity-50 cursor-not-allowed",
              boxClassName
            )}
          />
        );
      })}
    </div>
  );
}
