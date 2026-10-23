"use client";

import { useState, useCallback } from "react";
import { ReelMakerForm } from "@/components/reel/ReelMakerForm";
import { ReelGenerationProgress } from "@/components/reel/ReelGenerationProgress";
import { ReelResult } from "@/components/reel/ReelResult";
import { reelService } from "@/services/reel.service";
import { GenerateReelRequest, ReelJobStatus } from "@/types/reel";
import { Sparkles, Sun, Moon } from "lucide-react";
import { InsufficientCreditsAlert } from "@/components/ui/InsufficientCreditsAlert";
import { useTheme } from "@/components/theme/ThemeProvider";

type PageState = "form" | "generating" | "result";

export default function CreateReelPage() {
  const [pageState, setPageState] = useState<PageState>("form");
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [completedResult, setCompletedResult] = useState<ReelJobStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInsufficientCredits, setHasInsufficientCredits] = useState(false);

  const { theme, toggleTheme } = useTheme();

  const handleGenerate = async (request: GenerateReelRequest) => {
    setIsLoading(true);
    setError(null);
    setHasInsufficientCredits(false);
    try {
      const response = await reelService.generateReel(request);
      if (response.success && response.job_id) {
        setActiveJobId(response.job_id);
        setPageState("generating");
      } else {
        setError(response.message || "Failed to start generation job.");
      }
    } catch (err: any) {
      if (err?.response?.status === 402 || err?.message?.toLowerCase().includes("credit")) {
        setHasInsufficientCredits(true);
      } else {
        setError(err?.response?.data?.detail || err.message || "An error occurred while connecting to the API.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobComplete = useCallback((status: ReelJobStatus) => {
    setActiveJobId(null);
    setCompletedResult(status);
    setPageState("result");
    window.dispatchEvent(new Event("credit-update"));
  }, []);

  const handleJobError = useCallback((errMsg: string) => {
    setActiveJobId(null);
    setError(errMsg);
    setPageState("form");
  }, []);

  const handleReset = () => {
    setActiveJobId(null);
    setCompletedResult(null);
    setError(null);
    setHasInsufficientCredits(false);
    setPageState("form");
  };

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 min-h-screen transition-colors">
      
      {/* ──────────────────────────────────────────────
          Top Header: Matching Screenshot with Theme Switcher
         ────────────────────────────────────────────── */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Create Reel
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-[#8b5cf6] dark:text-purple-300 text-[11px] font-extrabold uppercase tracking-wider">
              AI Reel Maker
            </span>
          </div>
          <p className="mt-1 text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm flex items-center gap-1.5">
            <span>Turn your product into a captivating reel with AI</span>
            <span>✨</span>
          </p>
        </div>

        {/* Theme Switcher Toggle (Light / Dark) */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1630] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 text-xs font-bold shadow-sm transition-all cursor-pointer"
            title="Toggle Light or Dark Theme"
          >
            {theme === "light" ? (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-purple-400" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {hasInsufficientCredits && <InsufficientCreditsAlert />}

      {/* Error Banner */}
      {error && (
        <div className="mb-6 rounded-2xl bg-red-500/10 p-4 text-sm text-red-500 dark:text-red-400 border border-red-500/20 flex items-start gap-3 shadow-md">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <strong className="block font-bold mb-0.5">Generation Failed</strong>
            {error}
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* FORM STATE */}
      {pageState === "form" && (
        <ReelMakerForm onGenerate={handleGenerate} isLoading={isLoading} />
      )}

      {/* GENERATING STATE */}
      {pageState === "generating" && activeJobId && (
        <div className="max-w-2xl mx-auto py-8">
          <ReelGenerationProgress
            jobId={activeJobId}
            onComplete={handleJobComplete}
            onError={handleJobError}
          />
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors underline underline-offset-4 cursor-pointer"
            >
              Cancel &amp; Start Over
            </button>
          </div>
        </div>
      )}

      {/* RESULT STATE */}
      {pageState === "result" && completedResult && (
        <div className="py-2">
          <ReelResult result={completedResult} onReset={handleReset} />
        </div>
      )}
    </div>
  );
}
