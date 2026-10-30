"use client";

import React, { forwardRef } from "react";
import { VoiceInputButton } from "./VoiceInput";

export interface VoicePromptTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  onValueChange?: (val: string) => void;
  showCharCount?: boolean;
}

export const VoicePromptTextarea = forwardRef<
  HTMLTextAreaElement,
  VoicePromptTextareaProps
>(
  (
    {
      label,
      helperText,
      value = "",
      onChange,
      onValueChange,
      maxLength,
      showCharCount = true,
      className = "",
      rows = 4,
      placeholder = "Type or click the microphone to speak...",
      ...rest
    },
    ref
  ) => {
    const currentStr = String(value || "");

    const handleTranscript = (newFullText: string) => {
      if (maxLength && newFullText.length > maxLength) {
        newFullText = newFullText.slice(0, maxLength);
      }
      if (onValueChange) {
        onValueChange(newFullText);
      }
      if (onChange) {
        const syntheticEvent = {
          target: { value: newFullText },
          currentTarget: { value: newFullText },
        } as React.ChangeEvent<HTMLTextAreaElement>;
        onChange(syntheticEvent);
      }
    };

    return (
      <div className="w-full space-y-1.5">
        {(label || showCharCount) && (
          <div className="flex items-center justify-between">
            {label ? (
              <label className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                {label}
              </label>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              {showCharCount && maxLength && (
                <span className="text-[11px] text-text-muted font-mono">
                  {currentStr.length}/{maxLength}
                </span>
              )}
              {/* Top Header Mic button */}
              <VoiceInputButton
                onTranscript={handleTranscript}
                currentValue={currentStr}
                size="sm"
              />
            </div>
          </div>
        )}

        <div className="relative">
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => {
              if (onChange) onChange(e);
              if (onValueChange) onValueChange(e.target.value);
            }}
            rows={rows}
            maxLength={maxLength}
            placeholder={placeholder}
            className={`w-full rounded-xl border border-white/10 bg-[#0a142c] p-3.5 pb-10 text-xs sm:text-sm text-white placeholder:text-text-muted/60 focus:outline-none focus:border-[#f0449b] focus:ring-1 focus:ring-[#f0449b]/30 leading-relaxed transition-all ${className}`}
            {...rest}
          />

          {/* Bottom right embedded mic & action strip */}
          <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1.5 pointer-events-auto">
            <VoiceInputButton
              onTranscript={handleTranscript}
              currentValue={currentStr}
              size="sm"
            />
          </div>
        </div>

        {helperText && (
          <p className="text-[11px] text-text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

VoicePromptTextarea.displayName = "VoicePromptTextarea";

export default VoicePromptTextarea;

