'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, RotateCcw, Plus, Check } from 'lucide-react';

// Crisp SVGs for AI Model Badges
const OpenAIIcon = () => (
  <svg className="w-5 h-5 shrink-0 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.28 9.82a5.98 5.98 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9 6.07 6.07 0 0 0-10.27 2.17 5.98 5.98 0 0 0-4 2.9 6.05 6.05 0 0 0 .74 7.1 5.98 5.98 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.51 2.9A5.98 5.98 0 0 0 13.26 24a6.06 6.06 0 0 0 5.77-4.21 5.99 5.99 0 0 0 4-2.9 6.06 6.06 0 0 0-.75-7.07zm-9.02 12.61a4.48 4.48 0 0 1-2.88-1.04l.14-.08 4.78-2.76a.79.79 0 0 0 .39-.68v-6.74l2.02 1.17a.07.07 0 0 1 .04.05v5.58a4.5 4.5 0 0 1-4.49 4.5zm-9.66-4.13a4.47 4.47 0 0 1-.53-3.01l.14.09 4.78 2.75a.77.77 0 0 0 .78 0l5.85-3.37v2.33a.08.08 0 0 1-.04.06l-4.84 2.8a4.5 4.5 0 0 1-6.14-1.65zM2.34 7.9a4.49 4.49 0 0 1 2.37-1.98v5.68c0 .28.15.54.39.68l5.81 3.35-2.02 1.17a.08.08 0 0 1-.07 0l-4.83-2.79A4.5 4.5 0 0 1 2.34 7.9zm16.1 3.85-5.84-3.37 2.02-1.16a.08.08 0 0 1 .07 0l4.83 2.79a4.5 4.5 0 0 1-.68 8.1v-5.67a.79.79 0 0 0-.4-.69zm2.01-3.02-.14-.08-4.77-2.79a.78.78 0 0 0-.79 0L9.41 9.23V6.9a.07.07 0 0 1 .03-.06l4.83-2.79a4.5 4.5 0 0 1 6.68 4.66zM8.31 12.86l-2.02-1.16a.08.08 0 0 1-.04-.06V6.07a4.5 4.5 0 0 1 7.38-3.45l-.14.08-4.79 2.76a.79.79 0 0 0-.39.68v6.72z" />
  </svg>
);

const ClaudeIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="#D97706">
    <path d="M13.5 2H10.5V8.5L6 4L3.8 6.2L8.5 10.5H2V13.5H8.5L4 18L6.2 20.2L10.5 15.5V22H13.5V15.5L18 20L20.2 17.8L15.5 13.5H22V10.5H15.5L20 6L17.8 3.8L13.5 8.5V2Z" />
  </svg>
);

const GeminiIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
      fill="url(#gemini-grad-consensus)"
    />
    <defs>
      <linearGradient id="gemini-grad-consensus" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1BA1E3" />
        <stop offset="0.5" stopColor="#5B76FB" />
        <stop offset="1" stopColor="#D96570" />
      </linearGradient>
    </defs>
  </svg>
);

// Mouse Cursor SVG pointer icon for the animation
const MouseCursorIcon = () => (
  <svg className="w-6 h-6 text-slate-900 drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 2L20 12L13 14L10 21L4 2Z" />
  </svg>
);

export function Automation() {
  const [viewMode, setViewMode] = useState<'compare' | 'consensus'>('compare');
  const [isPaused, setIsPaused] = useState(false);

  // Auto-cycle between Compare and Consensus views every 6 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setViewMode((prev) => (prev === 'compare' ? 'consensus' : 'compare'));
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section id="automation" className="w-full max-w-full pt-10 sm:pt-14 pb-12 sm:pb-16 bg-[#F5FAF7] relative overflow-hidden border-t border-slate-100 scroll-mt-20">
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-emerald-100/40 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-teal-100/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-6 sm:mb-9 w-full">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-emerald-200/80 mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11.5px] font-semibold text-emerald-800 tracking-wide">Multi-Model Intelligence</span>
          </div>

          <h2 className="text-2xl min-[375px]:text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
            Compare AI answers. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600">Generate consensus</span>.
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-2.5 max-w-lg mx-auto leading-relaxed">
            Run top AI models in parallel, compare their reasoning, and synthesize the ultimate consensus answer in one click.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="inline-flex items-center p-1 rounded-full bg-white border border-slate-200/80 shadow-xs mt-4">
            <button
              type="button"
              onClick={() => setViewMode('compare')}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                viewMode === 'compare'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Compare Answers
            </button>
            <button
              type="button"
              onClick={() => setViewMode('consensus')}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                viewMode === 'consensus'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Consensus Summary
            </button>
          </div>
        </div>

        {/* Main Comparison Sandbox Card */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="w-full bg-white rounded-[24px] sm:rounded-[32px] border border-slate-200/90 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] p-5 sm:p-7 md:p-9 relative transition-all duration-300"
        >

          {/* Top User Prompt Bubble */}
          <div className="flex justify-end w-full mb-5 sm:mb-6">
            <div className="inline-flex items-center px-4 sm:px-6 py-2.5 rounded-full border border-slate-200/90 bg-white text-slate-800 text-xs sm:text-sm md:text-[15px] font-medium shadow-xs">
              Explain photosynthesis for my exam
            </div>
          </div>

          <AnimatePresence mode="wait">
            {viewMode === 'compare' ? (
              /* ================= STATE 1: COMPARE ANSWERS (Image 1) ================= */
              <motion.div
                key="compare-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="w-full flex flex-col"
              >
                {/* Subheading */}
                <div className="text-slate-800 font-semibold text-xs sm:text-sm md:text-[15px] mb-3.5">
                  Compare answers
                </div>

                {/* 3 Model Answer Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5 w-full">

                  {/* Card 1: GPT-5 */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="rounded-2xl border border-emerald-400/50 bg-white p-4 sm:p-5 flex flex-col justify-between shadow-2xs transition-shadow hover:shadow-md"
                  >
                    <div>
                      {/* Model Header */}
                      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                        <OpenAIIcon />
                        <span className="font-semibold text-slate-900 text-sm sm:text-base">GPT-5</span>
                      </div>
                      {/* Answer Body with Highlight */}
                      <p className="text-slate-600 text-xs sm:text-[13.5px] leading-relaxed pt-3">
                        Photosynthesis is how plants turn sunlight, water and carbon{' '}
                        <mark className="bg-[#E6F4EA] text-slate-900 px-1 py-0.5 rounded font-medium">
                          dioxide into their own food, releasing oxygen.
                        </mark>{' '}
                        It happens in the chloroplasts.
                      </p>
                    </div>
                  </motion.div>

                  {/* Card 2: Claude */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="rounded-2xl border border-emerald-400/50 bg-white p-4 sm:p-5 flex flex-col justify-between shadow-2xs transition-shadow hover:shadow-md"
                  >
                    <div>
                      {/* Model Header */}
                      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                        <ClaudeIcon />
                        <span className="font-semibold text-slate-900 text-sm sm:text-base">Claude</span>
                      </div>
                      {/* Answer Body with Highlight */}
                      <p className="text-slate-600 text-xs sm:text-[13.5px] leading-relaxed pt-3">
                        Think of a plant as a{' '}
                        <mark className="bg-[#E6F4EA] text-slate-900 px-1 py-0.5 rounded font-medium">
                          tiny solar kitchen. Sunlight is the power;
                        </mark>{' '}
                        water and carbon dioxide are the ingredients. Out comes glucose, plus oxygen.
                      </p>
                    </div>
                  </motion.div>

                  {/* Card 3: Gemini */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="rounded-2xl border border-emerald-400/50 bg-white p-4 sm:p-5 flex flex-col justify-between shadow-2xs transition-shadow hover:shadow-md"
                  >
                    <div>
                      {/* Model Header */}
                      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                        <GeminiIcon />
                        <span className="font-semibold text-slate-900 text-sm sm:text-base">Gemini</span>
                      </div>
                      {/* Answer Body with Highlight */}
                      <p className="text-slate-600 text-xs sm:text-[13.5px] leading-relaxed pt-3">
                        Plants capture light and convert water and carbon dioxide into glucose, releasing{' '}
                        <mark className="bg-[#E6F4EA] text-slate-900 px-1 py-0.5 rounded font-medium">
                          oxygen as a by-product —the exact terms a
                        </mark>{' '}
                        marker looks for.
                      </p>
                    </div>
                  </motion.div>

                </div>

                {/* Bottom Interactive Button with Animated Cursor Pointer */}
                <div className="relative flex justify-center mt-7 sm:mt-8 w-full">
                  <motion.button
                    type="button"
                    onClick={() => setViewMode('consensus')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 bg-[#00875A] hover:bg-[#007048] text-white font-semibold text-xs sm:text-sm md:text-[15px] px-6 py-2.5 sm:py-3 rounded-full shadow-md shadow-emerald-700/25 transition-all cursor-pointer relative"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Generate consensus</span>

                    {/* Animated Mouse Cursor as seen in Image 1 */}
                    <motion.div
                      className="absolute -bottom-3 -right-2 pointer-events-none select-none"
                      animate={{
                        x: [0, 3, 0],
                        y: [0, 4, 0],
                        scale: [1, 0.95, 1],
                      }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <MouseCursorIcon />
                    </motion.div>
                  </motion.button>
                </div>

              </motion.div>
            ) : (
              /* ================= STATE 2: GENERATE CONSENSUS (Image 2) ================= */
              <motion.div
                key="consensus-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="w-full flex flex-col"
              >
                {/* Inner Consensus Summary Card */}
                <div className="w-full rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">

                  {/* Header Title */}
                  <div className="px-5 sm:px-6 py-3.5 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-slate-800 text-xs sm:text-sm md:text-[15px]">
                      Summarize • Explain photosynthesis for my exam
                    </span>
                    <button
                      type="button"
                      onClick={() => setViewMode('compare')}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Compare Again</span>
                    </button>
                  </div>

                  <div className="p-5 sm:p-6 md:p-7 flex flex-col gap-6">

                    {/* CONSENSUS Block */}
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2">
                        CONSENSUS
                      </div>
                      <p className="text-slate-700 text-xs sm:text-sm md:text-[14.5px] leading-relaxed">
                        All three agree on the core: plants use sunlight, water and carbon dioxide to make their own food, releasing oxygen as a by-product. What changes is the framing —a definition, an analogy, or the exam vocabulary —so pick whichever one lands for you.
                      </p>
                    </div>

                    {/* WHERE THEY DIFFER Block */}
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-3">
                        WHERE THEY DIFFER
                      </div>

                      <div className="flex flex-col divide-y divide-slate-100">

                        {/* GPT-5 Row */}
                        <div className="py-3 flex items-start sm:items-center gap-3">
                          <div className="flex items-center gap-2 w-24 sm:w-28 shrink-0">
                            <OpenAIIcon />
                            <span className="font-semibold text-slate-900 text-xs sm:text-sm">GPT-5</span>
                          </div>
                          <span className="text-slate-600 text-xs sm:text-[13.5px] leading-snug">
                            Straight to the definition —the version you revise from the night before
                          </span>
                        </div>

                        {/* Claude Row */}
                        <div className="py-3 flex items-start sm:items-center gap-3">
                          <div className="flex items-center gap-2 w-24 sm:w-28 shrink-0">
                            <ClaudeIcon />
                            <span className="font-semibold text-slate-900 text-xs sm:text-sm">Claude</span>
                          </div>
                          <span className="text-slate-600 text-xs sm:text-[13.5px] leading-snug">
                            Frames it as a tiny solar-powered kitchen, so the whole process is intuitive
                          </span>
                        </div>

                        {/* Gemini Row */}
                        <div className="py-3 flex items-start sm:items-center gap-3">
                          <div className="flex items-center gap-2 w-24 sm:w-28 shrink-0">
                            <GeminiIcon />
                            <span className="font-semibold text-slate-900 text-xs sm:text-sm">Gemini</span>
                          </div>
                          <span className="text-slate-600 text-xs sm:text-[13.5px] leading-snug">
                            Adds the exact terms a marker looks for: glucose, conversion and oxygen
                          </span>
                        </div>

                      </div>
                    </div>

                  </div>

                </div>

                {/* Back / Repeat Toggle */}
                <div className="flex justify-center mt-6">
                  <button
                    type="button"
                    onClick={() => setViewMode('compare')}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors cursor-pointer py-1.5 px-4 rounded-full hover:bg-slate-100"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>View original model comparison</span>
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
