"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useLanguage, SupportedLanguage } from "@/context/LanguageContext";

interface LanguageSelectorProps {
  className?: string;
  align?: "left" | "right";
  showLabel?: boolean;
}

export function LanguageSelector({
  className = "",
  align = "right",
  showLabel = true,
}: LanguageSelectorProps) {
  const { language, setLanguage, currentLanguageInfo, supportedLanguages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select Language"
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#15161b] text-neutral-800 dark:text-neutral-200 hover:border-neutral-300 dark:hover:border-white/25 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
      >
        <span>
          {showLabel && <span className="opacity-80">{t("lang_prefix", "Language:")} </span>}
          <strong className="font-bold text-neutral-900 dark:text-white">
            {currentLanguageInfo.shortName}
          </strong>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Language options"
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-2 w-52 max-h-72 overflow-y-auto rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#15161b] shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700`}
        >
          <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-neutral-400 dark:text-neutral-500 border-b border-neutral-100 dark:border-white/5 mb-1">
            Regional & Vernacular (11)
          </div>
          {supportedLanguages.map((item) => {
            const isSelected = item.code === language;
            return (
              <button
                key={item.code}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(item.code)}
                className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-bold"
                    : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5"
                }`}
              >
                <span>{item.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
