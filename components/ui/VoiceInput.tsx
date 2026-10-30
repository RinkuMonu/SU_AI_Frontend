"use client";

import React, { useState } from "react";
import { Mic, MicOff, AlertCircle, X, Sparkles } from "lucide-react";
import { useVoiceToText, VoiceLanguage } from "@/hooks/useVoiceToText";

export interface VoiceInputButtonProps {
  /**
   * Called whenever speech recognition transcribes text.
   * `newFullText` contains the existing text + transcribed speech.
   */
  onTranscript: (newFullText: string) => void;
  /** Current text inside the associated input or textarea */
  currentValue?: string;
  /** Default language for recognition: 'en-IN' (default) or 'hi-IN' */
  defaultLang?: VoiceLanguage;
  /** Whether to show a language selector pill (EN / HI) */
  showLanguageToggle?: boolean;
  /** Optional custom CSS classes for the button container */
  className?: string;
  /** Size variant: 'sm' (compact inline) or 'md' (standard form) */
  size?: "sm" | "md";
  /** Optional placeholder or title override */
  tooltip?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  currentValue = "",
  defaultLang = "en-IN",
  showLanguageToggle = true,
  className = "",
  size = "md",
  tooltip,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);

  const {
    isListening,
    isSupported,
    lang,
    setLang,
    error,
    clearError,
    interimTranscript,
    toggleListening,
    stopListening,
    startListening,
  } = useVoiceToText({
    onTranscript: (text) => onTranscript(text),
    currentValue,
    defaultLang,
  });

  const handleToggleLang = (newLang: VoiceLanguage) => {
    setLang(newLang);
    setShowLangMenu(false);
  };

  const isSmall = size === "sm";

  return (
    <div className={`relative inline-flex items-center gap-1.5 ${className}`}>
      {/* Optional Language Pill Selector */}
      {showLanguageToggle && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLangMenu((prev) => !prev)}
            title={`Voice language: ${lang === "en-IN" ? "English (India)" : "Hindi (India)"}. Click to toggle.`}
            className={`px-1.5 py-0.5 rounded-md font-mono font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              isSmall ? "text-[10px]" : "text-[11px]"
            } ${
              lang === "hi-IN"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "bg-white/[0.06] text-neutral-300 hover:text-white border border-white/10"
            }`}
          >
            <span>{lang === "hi-IN" ? "HI" : "EN"}</span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 bottom-full mb-1.5 z-50 bg-[#12131c] border border-white/15 rounded-xl shadow-2xl p-1 min-w-[120px] text-xs animate-in fade-in zoom-in-95">
              <button
                type="button"
                onClick={() => handleToggleLang("en-IN")}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between cursor-pointer ${
                  lang === "en-IN"
                    ? "bg-gradient-to-r from-[#fc9a5d]/20 to-[#f0449b]/20 text-[#f0449b] font-bold"
                    : "text-neutral-300 hover:bg-white/5"
                }`}
              >
                <span>English (IN)</span>
                {lang === "en-IN" && <span className="text-[10px]">•</span>}
              </button>
              <button
                type="button"
                onClick={() => handleToggleLang("hi-IN")}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between cursor-pointer ${
                  lang === "hi-IN"
                    ? "bg-gradient-to-r from-[#fc9a5d]/20 to-[#f0449b]/20 text-[#f0449b] font-bold"
                    : "text-neutral-300 hover:bg-white/5"
                }`}
              >
                <span>हिन्दी (Hindi)</span>
                {lang === "hi-IN" && <span className="text-[10px]">•</span>}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Microphone Button */}
      <button
        type="button"
        onClick={toggleListening}
        title={
          !isSupported
            ? "Voice typing not supported in this browser"
            : isListening
            ? "Listening... Click to stop"
            : tooltip || `Speak to type (${lang === "hi-IN" ? "Hindi" : "English"})`
        }
        disabled={!isSupported}
        aria-label={isListening ? "Stop voice dictation" : "Start voice dictation"}
        className={`group relative rounded-xl flex items-center justify-center transition-all cursor-pointer ${
          isSmall ? "w-7 h-7" : "w-8 h-8"
        } ${
          !isSupported
            ? "opacity-35 cursor-not-allowed bg-white/5 text-neutral-500"
            : isListening
            ? "bg-rose-500 text-white shadow-[0_0_18px_rgba(244,63,94,0.6)] animate-pulse border border-rose-400"
            : "bg-white/[0.06] hover:bg-white/[0.12] text-neutral-300 hover:text-white border border-white/10 hover:border-[#f0449b]/50 shadow-sm"
        }`}
      >
        {isListening ? (
          <>
            <MicOff className={isSmall ? "w-3.5 h-3.5" : "w-4 h-4 text-white"} />
            {/* Pulsing ring indicator */}
            <span className="absolute -inset-1 rounded-xl bg-rose-500/30 animate-ping pointer-events-none" />
          </>
        ) : (
          <Mic className={`${isSmall ? "w-3.5 h-3.5" : "w-4 h-4"} text-neutral-300 group-hover:text-[#f0449b] transition-colors`} />
        )}
      </button>

      {/* Live Floating Dictation Status Indicator (shown while recording) */}
      {isListening && (
        <div className="absolute right-0 bottom-full mb-2 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#180f28] border border-rose-500/50 shadow-xl shadow-rose-950/40 text-xs whitespace-nowrap animate-in fade-in slide-in-from-bottom-1">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="font-bold text-white text-[11px]">
              Listening ({lang === "hi-IN" ? "Hindi" : "English"})...
            </span>
          </div>

          {/* Equalizer animation */}
          <div className="flex items-center gap-0.5 h-3 px-1">
            <span className="w-0.5 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-0.5 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-0.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>

          {interimTranscript && (
            <span className="max-w-[120px] sm:max-w-[180px] truncate text-[10px] text-neutral-300 italic">
              &quot;{interimTranscript}&quot;
            </span>
          )}

          <button
            type="button"
            onClick={stopListening}
            className="ml-1 text-[10px] font-semibold text-rose-300 hover:text-white underline cursor-pointer"
          >
            Done
          </button>
        </div>
      )}

      {/* Error Tooltip Banner with Step-by-Step Unblock Guide */}
      {error && (
        <div className="absolute right-0 bottom-full mb-2 z-50 w-80 max-w-[92vw] p-3.5 rounded-2xl bg-[#1a0e16] border border-rose-500/50 text-white text-xs shadow-2xl flex flex-col gap-2.5 animate-in fade-in zoom-in-95">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Allow Microphone in Browser</span>
            </div>
            <button
              type="button"
              onClick={clearError}
              className="text-neutral-400 hover:text-white p-0.5 rounded cursor-pointer"
              aria-label="Close notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-black/40 rounded-xl p-2.5 border border-white/5 space-y-1.5 text-[11px] text-neutral-300">
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
              <span>Click the <b>Tune 🎚️ or Lock 🔒 icon</b> in your browser address bar (left of <code>localhost:3000</code>).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
              <span>Switch <b>Microphone</b> to <b>&quot;Allow&quot; (ON)</b>.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
              <span>Click the button below:</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              clearError();
              startListening();
            }}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-lg shadow-rose-950/50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Try Microphone Again</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceInputButton;

