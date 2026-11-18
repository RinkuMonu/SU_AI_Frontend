'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus, Sparkles, Check, Zap } from 'lucide-react';

const PROMPT_TEXT = 'Launch a festive marketing campaign for our business — 25% discount offer, viral Instagram reels, and customer WhatsApp broadcast.';

const MODEL_RESPONSES = {
  gpt: 'Lead with the headline 25% discount in the first 3 seconds of your Reel. Follow with customer testimonial clips, post at 7 PM when traffic peaks, and trigger the WhatsApp broadcast with a direct payment link.',
  claude: 'Center the campaign around festive emotional storytelling rather than just price cuts. Pair high-energy Instagram Reels with interactive polls, and send a personalized VIP early-access broadcast to repeat buyers.',
  gemini: 'Maximize multichannel ROI: sync the 25% festive promo across Instagram, Facebook, and Google Ads. Automate WhatsApp follow-ups for abandoned carts to convert 3x more local customers before the weekend.',
};

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
      fill="url(#gemini-grad-autodemo)"
    />
    <defs>
      <linearGradient id="gemini-grad-autodemo" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1BA1E3" />
        <stop offset="0.5" stopColor="#5B76FB" />
        <stop offset="1" stopColor="#D96570" />
      </linearGradient>
    </defs>
  </svg>
);

export function Automation() {
  const [phase, setPhase] = useState<'typing' | 'clicking' | 'answering' | 'completed'>('typing');
  const [typedChars, setTypedChars] = useState(0);
  const [answerProgress, setAnswerProgress] = useState(0);

  // 1. Typewriter for input prompt
  useEffect(() => {
    if (phase !== 'typing') return;
    if (typedChars < PROMPT_TEXT.length) {
      const timeout = setTimeout(() => {
        setTypedChars((prev) => prev + 1);
      }, 32);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setPhase('clicking');
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [phase, typedChars]);

  // 2. Click button phase
  useEffect(() => {
    if (phase !== 'clicking') return;
    const timeout = setTimeout(() => {
      setPhase('answering');
      setAnswerProgress(0);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [phase]);

  // 3. Multi-model parallel answers typing phase (Image 1)
  useEffect(() => {
    if (phase !== 'answering') return;
    const maxLen = Math.max(
      MODEL_RESPONSES.gpt.length,
      MODEL_RESPONSES.claude.length,
      MODEL_RESPONSES.gemini.length
    );
    if (answerProgress < maxLen) {
      const timeout = setTimeout(() => {
        setAnswerProgress((prev) => prev + 2);
      }, 28);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setPhase('completed');
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [phase, answerProgress]);

  // 4. Completed phase: automatically restart demo after a brief pause
  useEffect(() => {
    if (phase !== 'completed') return;
    const timeout = setTimeout(() => {
      setTypedChars(0);
      setAnswerProgress(0);
      setPhase('typing');
    }, 3500);
    return () => clearTimeout(timeout);
  }, [phase]);

  const handleSkipToAnswer = () => {
    setTypedChars(PROMPT_TEXT.length);
    setAnswerProgress(250);
    setPhase('completed');
  };

  return (
    <section id="automation" className="w-full max-w-full pt-12 sm:pt-16 pb-14 sm:pb-20 bg-white relative overflow-hidden border-t border-slate-100 scroll-mt-20">
      {/* Background DhandaGrow Brand Theme Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-100/30 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-100/30 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-pink-100/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header with DhandaGrow Signature Gradient */}
        <div className="flex flex-col items-center text-center mb-8 sm:mb-10 w-full">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-pink-200/90 text-xs font-semibold mb-3 shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-[#f0449b]" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff]">
              AI Business Autopilot
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-slate-900 tracking-tight leading-tight">
            What campaign <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff]">do you need?</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-500 font-normal mt-2.5 max-w-xl mx-auto leading-relaxed">
            Describe it in a sentence. We compare top AI models to craft the highest-converting strategy, reels, and ads.
          </p>
        </div>

        {/* ================= MAIN INTERACTIVE DEMO CARD WITH BRAND GRADIENT ================= */}
        <div className="w-full max-w-4xl mx-auto">
          {/* Top Generator Input Box wrapped in DhandaGrow Signature Gradient Outline */}
          <div className="p-[2.5px] rounded-[28px] sm:rounded-[34px] bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] shadow-[0_15px_50px_-10px_rgba(240,68,155,0.25)] relative transition-all duration-300">
            <div className="w-full bg-white rounded-[26px] sm:rounded-[32px] p-5 sm:p-7">

              {/* Prompt Typewriter Area */}
              <div className="min-h-[58px] sm:min-h-[68px] flex items-start">
                <p className="text-[17px] sm:text-[20px] md:text-[22px] font-medium text-slate-900 tracking-tight leading-snug">
                  {PROMPT_TEXT.slice(0, typedChars)}
                  {/* Blinking Typing Cursor */}
                  <span className="inline-block w-[2.5px] h-5 sm:h-6 bg-slate-900 ml-1 translate-y-0.5 animate-pulse" />
                </p>
              </div>

              {/* Bottom Controls Row: Pill Badges + Brand Gradient Action Button */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100/80 mt-4">

                {/* Left Control Pills tailored to DhandaGrow */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  {/* Plus Button */}
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 text-sm font-semibold transition-colors"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  {/* Offer Pill */}
                  <span className="px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-700 shadow-2xs">
                    25% Off
                  </span>

                  {/* Tone Pill */}
                  <span className="px-4 py-1.5 rounded-full border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-800 shadow-2xs">
                    High Conversion
                  </span>

                  {/* Channel Pill */}
                  <span className="px-4 py-1.5 rounded-full border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-600 hidden min-[480px]:inline-block">
                    Reels + Ads
                  </span>

                  {/* Broadcast Pill */}
                  <span className="px-4 py-1.5 rounded-full border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-600 hidden sm:inline-block">
                    WhatsApp Auto
                  </span>
                </div>

                {/* Right Action Button with Theme Gradient */}
                <div className="relative">
                  <motion.button
                    type="button"
                    onClick={handleSkipToAnswer}
                    animate={phase === 'clicking' ? { scale: [1, 0.9, 1] } : { scale: 1 }}
                    transition={{ duration: 0.35 }}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:opacity-95 flex items-center justify-center text-white shadow-md shadow-pink-500/30 cursor-pointer relative"
                    title="Generate Campaign Comparison"
                  >
                    <ArrowRight className="w-5 h-5 stroke-[2.5]" />

                    {/* Animated Simulated Cursor moving in clicking phase */}
                    {phase === 'clicking' && (
                      <motion.div
                        initial={{ opacity: 0, x: 24, y: 24 }}
                        animate={{ opacity: 1, x: 2, y: 4 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="absolute -bottom-2 -right-1 pointer-events-none select-none z-30"
                      >
                        <svg className="w-6 h-6 text-slate-900 drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M4 2L20 12L13 14L10 21L4 2Z" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.button>
                </div>

              </div>

            </div>
          </div>

          {/* ================= 3 MODELS COMPARISON VIEW (Matching Image 1) ================= */}
          <AnimatePresence mode="wait">
            {(phase === 'answering' || phase === 'completed') && (
              <motion.div
                key="model-answers-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="mt-6 w-full bg-white rounded-[26px] sm:rounded-[32px] border border-slate-200/90 p-5 sm:p-7 md:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] flex flex-col gap-6"
              >
                {/* Top User Prompt Bubble */}
                <div className="flex justify-end w-full">
                  <div className="inline-flex items-center px-4 sm:px-6 py-2.5 rounded-full border border-slate-200/90 bg-slate-50/80 text-slate-800 text-xs sm:text-sm md:text-[14.5px] font-medium shadow-xs max-w-2xl text-right">
                    {PROMPT_TEXT}
                  </div>
                </div>

                {/* 3 Model Answer Cards Side-by-Side */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 w-full">

                  {/* Card 1: GPT-5.6 Luna */}
                  <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 flex flex-col justify-between shadow-2xs hover:border-pink-300 hover:shadow-md hover:shadow-pink-500/5 transition-all duration-200">
                    <div>
                      {/* Model Header */}
                      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                        <OpenAIIcon />
                        <span className="font-semibold text-slate-900 text-sm sm:text-base">GPT-5.6 Luna</span>
                      </div>
                      {/* Live Typed Answer */}
                      <p className="text-slate-600 text-xs sm:text-[13.5px] leading-relaxed pt-3">
                        {MODEL_RESPONSES.gpt.slice(0, answerProgress)}
                        {phase === 'answering' && answerProgress < MODEL_RESPONSES.gpt.length && (
                          <span className="inline-block w-[2px] h-3.5 bg-slate-800 ml-0.5 animate-pulse" />
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Claude Sonnet 5 */}
                  <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 flex flex-col justify-between shadow-2xs hover:border-pink-300 hover:shadow-md hover:shadow-pink-500/5 transition-all duration-200">
                    <div>
                      {/* Model Header */}
                      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                        <ClaudeIcon />
                        <span className="font-semibold text-slate-900 text-sm sm:text-base">Claude Sonnet 5</span>
                      </div>
                      {/* Live Typed Answer */}
                      <p className="text-slate-600 text-xs sm:text-[13.5px] leading-relaxed pt-3">
                        {MODEL_RESPONSES.claude.slice(0, answerProgress)}
                        {phase === 'answering' && answerProgress < MODEL_RESPONSES.claude.length && (
                          <span className="inline-block w-[2px] h-3.5 bg-slate-800 ml-0.5 animate-pulse" />
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Card 3: Gemini 3.1 Pro */}
                  <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 flex flex-col justify-between shadow-2xs hover:border-pink-300 hover:shadow-md hover:shadow-pink-500/5 transition-all duration-200">
                    <div>
                      {/* Model Header */}
                      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                        <GeminiIcon />
                        <span className="font-semibold text-slate-900 text-sm sm:text-base">Gemini 3.1 Pro</span>
                      </div>
                      {/* Live Typed Answer */}
                      <p className="text-slate-600 text-xs sm:text-[13.5px] leading-relaxed pt-3">
                        {MODEL_RESPONSES.gemini.slice(0, answerProgress)}
                        {phase === 'answering' && answerProgress < MODEL_RESPONSES.gemini.length && (
                          <span className="inline-block w-[2px] h-3.5 bg-slate-800 ml-0.5 animate-pulse" />
                        )}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Bottom Status Bar */}
                {phase === 'completed' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 text-xs text-slate-500"
                  >
                    <div className="flex items-center gap-2 font-medium text-slate-800">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] flex items-center justify-center text-white shadow-2xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span>Consensus Ready • 3 AI strategies generated for DhandaGrow</span>
                    </div>


                  </motion.div>
                )}

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
