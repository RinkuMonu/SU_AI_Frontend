'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus, Sparkles, Check, Download, Layers, Play, Pause, RotateCcw } from 'lucide-react';

const FULL_TEXT = 'Create an 8-slide presentation on photosynthesis for my biology assignment.';

const SLIDES = [
  {
    num: '01',
    title: 'Introduction to Photosynthesis',
    subtitle: 'The biochemical engine converting solar radiation into chemical energy.',
    tag: 'Core Concept',
    gradient: 'from-emerald-500 to-teal-600',
    bullets: ['Equation: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂', 'Chloroplast structure & thylakoid membranes', 'Autotrophic nutrition fundamentals'],
  },
  {
    num: '02',
    title: 'Light-Dependent Reactions',
    subtitle: 'Harvesting photons to synthesize ATP and NADPH.',
    tag: 'Phase 1',
    gradient: 'from-teal-500 to-cyan-600',
    bullets: ['Photosystem II & I photon absorption', 'Photolysis of water & oxygen release', 'Proton gradient across thylakoid'],
  },
  {
    num: '03',
    title: 'The Calvin Cycle (Dark Phase)',
    subtitle: 'Enzymatic carbon fixation inside the stroma.',
    tag: 'Phase 2',
    gradient: 'from-indigo-500 to-purple-600',
    bullets: ['RuBisCO enzyme catalytic role', 'Reduction of 3-PGA to G3P', 'Regeneration of RuBP molecule'],
  },
  {
    num: '04',
    title: 'Exam Summary & Key Takeaways',
    subtitle: 'Crucial definitions, formulas and comparison tables.',
    tag: 'High Yield',
    gradient: 'from-emerald-600 to-indigo-600',
    bullets: ['Limiting factors: light, CO₂, temperature', 'C3 vs C4 vs CAM plant adaptations', 'Model exam questions & answers'],
  },
];

export function Automation() {
  const [phase, setPhase] = useState<'typing' | 'clicking' | 'generating' | 'completed'>('typing');
  const [typedChars, setTypedChars] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Typewriter effect
  useEffect(() => {
    if (phase !== 'typing') return;
    if (typedChars < FULL_TEXT.length) {
      const timeout = setTimeout(() => {
        setTypedChars((prev) => prev + 1);
      }, 42);
      return () => clearTimeout(timeout);
    } else {
      // Done typing, move to clicking phase
      const timeout = setTimeout(() => {
        setPhase('clicking');
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [phase, typedChars]);

  // Click & transition to generating
  useEffect(() => {
    if (phase !== 'clicking') return;
    const timeout = setTimeout(() => {
      setPhase('generating');
      setProgress(0);
    }, 1200);
    return () => clearTimeout(timeout);
  }, [phase]);

  // Generating progress bar
  useEffect(() => {
    if (phase !== 'generating') return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setPhase('completed');
          return 100;
        }
        return prev + 5;
      });
    }, 70);
    return () => clearInterval(interval);
  }, [phase]);

  // Completed display pause before restarting loop
  useEffect(() => {
    if (phase !== 'completed' || isPaused) return;
    const timeout = setTimeout(() => {
      setTypedChars(0);
      setProgress(0);
      setPhase('typing');
    }, 5500);
    return () => clearTimeout(timeout);
  }, [phase, isPaused]);

  const handleManualRestart = () => {
    setTypedChars(0);
    setProgress(0);
    setPhase('typing');
  };

  const handleSkipToResult = () => {
    setTypedChars(FULL_TEXT.length);
    setProgress(100);
    setPhase('completed');
  };

  return (
    <section id="automation" className="w-full max-w-full pt-12 sm:pt-16 pb-14 sm:pb-20 bg-[#F7FAF8] relative overflow-hidden border-t border-slate-100 scroll-mt-20">
      {/* Background Soft Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-100/40 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-100/35 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header as requested in Image 1 */}
        <div className="flex flex-col items-center text-center mb-8 sm:mb-10 w-full">
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-slate-900 tracking-tight leading-tight">
            What presentation do you need?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-500 font-normal mt-2.5 max-w-xl mx-auto leading-relaxed">
            Describe it in a sentence. We draft the outline first, then build the slides.
          </p>

          {/* Interactive controls pill */}
          <div className="inline-flex items-center gap-2 mt-4 px-3 py-1 rounded-full bg-white border border-slate-200/90 text-xs text-slate-500 shadow-2xs">
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              className="flex items-center gap-1 hover:text-emerald-700 font-medium cursor-pointer"
            >
              {isPaused ? <Play className="w-3 h-3 text-emerald-600 fill-emerald-600" /> : <Pause className="w-3 h-3 text-amber-600 fill-amber-600" />}
              <span>{isPaused ? 'Resume Demo' : 'Pause Demo'}</span>
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={handleManualRestart}
              className="flex items-center gap-1 hover:text-emerald-700 font-medium cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Replay</span>
            </button>
            {phase !== 'completed' && (
              <>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={handleSkipToResult}
                  className="hover:text-emerald-700 font-medium cursor-pointer"
                >
                  Skip to Slides →
                </button>
              </>
            )}
          </div>
        </div>

        {/* ================= MAIN INTERACTIVE DEMO CARD CONTAINER ================= */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="w-full max-w-4xl mx-auto"
        >
          {/* Top Generator Input Box matching Image 1 */}
          <div className="w-full bg-white rounded-[26px] sm:rounded-[32px] border-2 border-[#52C595] p-5 sm:p-7 shadow-[0_15px_45px_-12px_rgba(82,197,149,0.22)] relative transition-all duration-300">

            {/* Prompt Typewriter Area */}
            <div className="min-h-[58px] sm:min-h-[68px] flex items-start">
              <p className="text-[17px] sm:text-[21px] md:text-[23px] font-medium text-slate-900 tracking-tight leading-snug">
                {FULL_TEXT.slice(0, typedChars)}
                {/* Blinking Typing Cursor */}
                <span className="inline-block w-[2.5px] h-5 sm:h-6 bg-slate-900 ml-1 translate-y-0.5 animate-pulse" />
              </p>
            </div>

            {/* Bottom Controls Row: Pill Badges + Green Action Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100/80 mt-4">

              {/* Left Control Pills */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                {/* Plus Button */}
                <button
                  type="button"
                  className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 text-sm font-semibold transition-colors"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>

                {/* Slides Count */}
                <span className="px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-700 shadow-2xs">
                  8
                </span>

                {/* Tone Pill */}
                <span className="px-4 py-1.5 rounded-full border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-800 shadow-2xs">
                  Professional
                </span>

                {/* Format Pill */}
                <span className="px-4 py-1.5 rounded-full border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-600 hidden min-[480px]:inline-block">
                  Standard
                </span>

                {/* Image Style Pill */}
                <span className="px-4 py-1.5 rounded-full border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-600 hidden sm:inline-block">
                  Stock
                </span>
              </div>

              {/* Right Action Button with Animated Click Cursor */}
              <div className="relative">
                <motion.button
                  type="button"
                  onClick={handleSkipToResult}
                  animate={phase === 'clicking' ? { scale: [1, 0.9, 1] } : { scale: 1 }}
                  transition={{ duration: 0.35 }}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#00875A] hover:bg-[#007048] flex items-center justify-center text-white shadow-md shadow-emerald-700/25 cursor-pointer relative"
                  title="Generate Presentation"
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

          {/* ================= GENERATING & SLIDES PREVIEW VIDEO SEQUENCE ================= */}
          <AnimatePresence mode="wait">
            {phase === 'generating' && (
              <motion.div
                key="generating-view"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="mt-6 w-full bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm flex flex-col items-center text-center"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold mb-4">
                  <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span>AI Drafting Presentation Outline & Visuals...</span>
                </div>

                <div className="w-full max-w-md h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-[#00875A] rounded-full"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: 'linear' }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {progress}% Complete • Generating 8 high-res slides with charts & notes
                </span>
              </motion.div>
            )}

            {phase === 'completed' && (
              <motion.div
                key="completed-view"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4 }}
                className="mt-6 w-full bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-lg shadow-emerald-950/5 flex flex-col gap-5"
              >
                {/* Result Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                        Photosynthesis Biology Assignment (8 Slides)
                      </h4>
                      <p className="text-xs text-slate-500">Drafted outline & built slides in 3.4 seconds</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                      <Layers className="w-3.5 h-3.5" /> 8 Slides
                    </span>
                    <button
                      type="button"
                      onClick={handleManualRestart}
                      className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Deck</span>
                    </button>
                  </div>
                </div>

                {/* 4 Slide Cards Grid representing the generated deck */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 w-full">
                  {SLIDES.map((slide, idx) => (
                    <motion.div
                      key={slide.num}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.35 }}
                      className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-4 flex flex-col justify-between hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all duration-200 group"
                    >
                      <div>
                        {/* Slide Card Header Badge */}
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-[11px] font-bold text-slate-400">SLIDE {slide.num}</span>
                          <span className={`text-[10px] font-semibold text-white px-2 py-0.5 rounded-full bg-gradient-to-r ${slide.gradient}`}>
                            {slide.tag}
                          </span>
                        </div>

                        {/* Title */}
                        <h5 className="font-bold text-slate-900 text-[13.5px] leading-tight mb-1.5 group-hover:text-emerald-700 transition-colors">
                          {slide.title}
                        </h5>

                        {/* Subtitle */}
                        <p className="text-[11.5px] text-slate-500 leading-snug mb-3 line-clamp-2">
                          {slide.subtitle}
                        </p>

                        {/* Bullets */}
                        <ul className="space-y-1.5 text-[11px] text-slate-600 border-t border-slate-200/60 pt-2.5">
                          {slide.bullets.map((b, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                              <span className="line-clamp-1">{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Looping indicator bar */}
                <div className="pt-2 flex items-center justify-between text-[11.5px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live animated demo • Replaying automatically...
                  </span>
                  <button
                    type="button"
                    onClick={handleManualRestart}
                    className="text-emerald-700 font-semibold hover:underline cursor-pointer"
                  >
                    Type New Prompt ↺
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
