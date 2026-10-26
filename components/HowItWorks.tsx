'use client';

import React from 'react';
import { Rocket, Edit3, Send, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProcessStep {
  number: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  colorFrom: string;
  colorTo: string;
  glowColor: string;
}

const stepsData: ProcessStep[] = [
  {
    number: 1,
    title: 'Create',
    description: 'Use AI to generate viral reels, ads, posts & growth strategies.',
    icon: Edit3,
    colorFrom: '#FF6B00',
    colorTo: '#FF5722',
    glowColor: 'rgba(255, 87, 34, 0.45)'
  },
  {
    number: 2,
    title: 'Publish',
    description: 'Auto-schedule & publish across Instagram, YouTube & Meta.',
    icon: Send,
    colorFrom: '#ec4899',
    colorTo: '#be185d',
    glowColor: 'rgba(236, 72, 153, 0.45)'
  },
  {
    number: 3,
    title: 'Grow',
    description: 'Capture direct customer leads, auto DM funnels & scale revenue.',
    icon: TrendingUp,
    colorFrom: '#8b5cf6',
    colorTo: '#6d28d9',
    glowColor: 'rgba(139, 92, 246, 0.45)'
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-10 sm:py-14 bg-[#0B0F19] relative overflow-hidden border-t border-white/5 scroll-mt-20">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-sm">
            <Rocket className="w-4 h-4 text-pink-500" />
            <span className="text-xs font-semibold text-slate-300 tracking-wide">Simple 3-Step Process</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-white tracking-tight">
            How Dhanda<span className="text-[#f0449b]">Grow</span> Works
          </h2>
        </div>

        {/* 3 Process Cards Wrapper */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* Continuous Flowing Neon Laser Beams (Desktop) */}
          <div className="hidden md:block pointer-events-none">
            {/* Segment 1: Step 1 to Step 2 */}
            <div className="absolute left-[16.666%] w-[33.333%] top-[27px] -translate-y-1/2 z-10 px-8">
              {/* Dark Track line */}
              <div className="relative w-full h-[2.5px] bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-[#FF6B00] to-[#ec4899] rounded-full shadow-[0_0_14px_rgba(255,107,0,0.9)]"
                  animate={{
                    left: ['-40%', '120%']
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
              {/* Sequential Flow Chevrons */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 bg-[#0B0F19]/90 px-1 py-0.5 rounded-full border border-white/15 shadow-2xs">
                <motion.span
                  className="w-1.5 h-1.5 border-t-2 border-r-2 border-[#FF6B00] rotate-45 inline-block"
                  animate={{ opacity: [0.25, 1, 0.25] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: 0 }}
                />
                <motion.span
                  className="w-1.5 h-1.5 border-t-2 border-r-2 border-[#ec4899] rotate-45 inline-block"
                  animate={{ opacity: [0.25, 1, 0.25] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: 0.25 }}
                />
              </div>
            </div>

            {/* Segment 2: Step 2 to Step 3 */}
            <div className="absolute left-[50%] w-[33.333%] top-[27px] -translate-y-1/2 z-10 px-8">
              {/* Dark Track line */}
              <div className="relative w-full h-[2.5px] bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-[#ec4899] to-[#8b5cf6] rounded-full shadow-[0_0_14px_rgba(236,72,153,0.9)]"
                  animate={{
                    left: ['-40%', '120%']
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.1
                  }}
                />
              </div>
              {/* Sequential Flow Chevrons */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 bg-[#0B0F19]/90 px-1 py-0.5 rounded-full border border-white/15 shadow-2xs">
                <motion.span
                  className="w-1.5 h-1.5 border-t-2 border-r-2 border-[#ec4899] rotate-45 inline-block"
                  animate={{ opacity: [0.25, 1, 0.25] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: 0 }}
                />
                <motion.span
                  className="w-1.5 h-1.5 border-t-2 border-r-2 border-[#8b5cf6] rotate-45 inline-block"
                  animate={{ opacity: [0.25, 1, 0.25] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: 0.25 }}
                />
              </div>
            </div>
          </div>

          {/* Cards Grid: Ultra-Compact height widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 lg:gap-5 relative z-20">
            {stepsData.map((step, idx) => (
              <div 
                key={step.number}
                className="relative flex flex-col items-center group"
              >
                {/* Mobile Vertical Connector Line between stacked steps */}
                {idx > 0 && (
                  <div className="md:hidden flex flex-col items-center justify-center -mt-3 mb-2 select-none z-10">
                    <div className="relative w-[2px] h-7 bg-white/15 rounded-full overflow-hidden">
                      <motion.div
                        className="absolute left-0 right-0 h-4 bg-gradient-to-b from-[#FF6B00] to-[#8b5cf6] rounded-full"
                        animate={{ top: ['-50%', '120%'] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>
                    <div className="w-1.5 h-1.5 border-b-2 border-r-2 border-white/40 rotate-45 -mt-1" />
                  </div>
                )}

                {/* 3D Circular Orb Icon Token with gentle floating animation */}
                <motion.div 
                  animate={{ y: [0, -3.5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: idx * 0.35 }}
                  className="w-[54px] h-[54px] rounded-full p-[2px] shadow-lg relative z-30 -mb-5 group-hover:scale-105 transition-transform duration-300 shrink-0 cursor-default"
                  style={{
                    background: `linear-gradient(135deg, ${step.colorFrom} 0%, ${step.colorTo} 100%)`,
                    boxShadow: `0 6px 16px -2px ${step.glowColor}`
                  }}
                >
                  {/* Inner orb face with ambient highlight ring */}
                  <div 
                    className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden border border-white/30"
                    style={{
                      backgroundColor: step.colorFrom
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-black/35" />
                    <step.icon className="w-5 h-5 text-white relative z-10 stroke-[2] drop-shadow-md" />
                  </div>

                  {/* Step Number Badge */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#0B0F19] border border-white/25 flex items-center justify-center text-[8.5px] font-bold text-white shadow-md">
                    {step.number}
                  </div>
                </motion.div>

                {/* Super Compact Height Dark Widget Container */}
                <div className="w-full max-w-[280px] bg-[#101626]/90 backdrop-blur-md rounded-xl border border-white/[0.08] pt-6 pb-2 px-3 text-center relative overflow-hidden shadow-md shadow-black/25 group-hover:border-white/20 transition-all duration-300 flex flex-col items-center">
                  
                  {/* Subtle inner radial glow */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-5 transition-opacity group-hover:opacity-10"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${step.colorFrom}, transparent 70%)`
                    }}
                  />

                  {/* Step Title */}
                  <h3 className="text-xs sm:text-[13.5px] font-bold text-white mb-0.5 tracking-tight group-hover:text-pink-400 transition-colors">
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="text-[10px] sm:text-[10.5px] text-slate-400 leading-tight font-normal max-w-[185px] mx-auto">
                    {step.description}
                  </p>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
