'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring 
} from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeftRight 
} from 'lucide-react';

export function PaymentsStackSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress through the pinned section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Spring smoothing for natural, flicker-free movement
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 22,
    mass: 0.35,
  });

  // Transform coordinates for each card (Desktop target offsets)
  // 1. Live Payment Transactions (Top-Left / Top-Center)
  const card1X = useTransform(springProgress, [0, 0.85], [0, -220]);
  const card1Y = useTransform(springProgress, [0, 0.85], [0, -220]);
  const card1Scale = useTransform(springProgress, [0, 0.85], [0.72, 1]);
  const card1Opacity = useTransform(springProgress, [0, 0.4, 0.85], [0.35, 0.8, 1]);

  // 2. Woman with Smartphone & Payment Methods Overlay (Top-Right)
  const card2X = useTransform(springProgress, [0, 0.85], [0, 310]);
  const card2Y = useTransform(springProgress, [0, 0.85], [0, -200]);
  const card2Scale = useTransform(springProgress, [0, 0.85], [0.72, 1]);
  const card2Opacity = useTransform(springProgress, [0, 0.4, 0.85], [0.35, 0.8, 1]);

  // 3. Customer Support Agent (Mid-Left)
  const card3X = useTransform(springProgress, [0, 0.85], [0, -360]);
  const card3Y = useTransform(springProgress, [0, 0.85], [0, 40]);
  const card3Scale = useTransform(springProgress, [0, 0.85], [0.7, 1]);
  const card3Opacity = useTransform(springProgress, [0, 0.4, 0.85], [0.35, 0.8, 1]);

  // 4. Abhishek Multi-Currency Account (Bottom-Left / Bottom-Center)
  const card4X = useTransform(springProgress, [0, 0.85], [0, -110]);
  const card4Y = useTransform(springProgress, [0, 0.85], [0, 240]);
  const card4Scale = useTransform(springProgress, [0, 0.85], [0.72, 1]);
  const card4Opacity = useTransform(springProgress, [0, 0.4, 0.85], [0.35, 0.8, 1]);

  // 5. No Hidden Charges (Bottom-Right)
  const card5X = useTransform(springProgress, [0, 0.85], [0, 330]);
  const card5Y = useTransform(springProgress, [0, 0.85], [0, 180]);
  const card5Scale = useTransform(springProgress, [0, 0.85], [0.72, 1]);
  const card5Opacity = useTransform(springProgress, [0, 0.4, 0.85], [0.35, 0.8, 1]);

  // Center Headline scale & line pathLength
  const headlineScale = useTransform(springProgress, [0, 0.85], [0.94, 1.02]);
  const linesOpacity = useTransform(springProgress, [0, 0.5, 0.85], [0.1, 0.35, 0.6]);
  const linesProgress = useTransform(springProgress, [0, 0.85], [0.2, 1]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[220vh] bg-gradient-to-b from-[#f8fcf9] via-[#edf7f1] to-[#f8fcf9] select-none"
    >
      {/* Sticky viewport frame that pins during scroll */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-4 sm:px-6">
        
        {/* Soft Ambient Radial Lights in Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[550px] h-[550px] bg-lime-200/35 rounded-full blur-[150px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white/70 rounded-full blur-[100px]" />
        </div>

        {/* Dynamic Curved SVG Circuit/Connecting Lines */}
        <motion.svg 
          className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
          style={{ opacity: linesOpacity }}
        >
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#86efac" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#4ade80" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Lines radiating from center outwards */}
          <motion.path 
            d="M 50% 50% Q 40% 32% 35% 24%" 
            fill="none" 
            stroke="url(#lineGrad)" 
            strokeWidth="1.5" 
            strokeDasharray="4 4"
            style={{ pathLength: linesProgress }}
          />
          <motion.path 
            d="M 50% 50% Q 65% 36% 72% 25%" 
            fill="none" 
            stroke="url(#lineGrad)" 
            strokeWidth="1.5" 
            strokeDasharray="4 4"
            style={{ pathLength: linesProgress }}
          />
          <motion.path 
            d="M 50% 50% Q 32% 52% 22% 52%" 
            fill="none" 
            stroke="url(#lineGrad)" 
            strokeWidth="1.5" 
            strokeDasharray="4 4"
            style={{ pathLength: linesProgress }}
          />
          <motion.path 
            d="M 50% 50% Q 44% 68% 42% 78%" 
            fill="none" 
            stroke="url(#lineGrad)" 
            strokeWidth="1.5" 
            strokeDasharray="4 4"
            style={{ pathLength: linesProgress }}
          />
          <motion.path 
            d="M 50% 50% Q 65% 62% 74% 72%" 
            fill="none" 
            stroke="url(#lineGrad)" 
            strokeWidth="1.5" 
            strokeDasharray="4 4"
            style={{ pathLength: linesProgress }}
          />
        </motion.svg>

        {/* Center Container: Headline & Floating Expanding Cards */}
        <div className="relative w-full max-w-6xl mx-auto flex items-center justify-center">

          {/* 1. TOP-LEFT CARD: Live Payment Transactions */}
          <motion.div
            style={{
              x: card1X,
              y: card1Y,
              scale: card1Scale,
              opacity: card1Opacity,
            }}
            transition={{ type: 'spring', stiffness: 90, damping: 20 }}
            className="absolute z-20 pointer-events-auto"
          >
            <div className="bg-[#d2f88b] p-3 sm:p-3.5 rounded-[30px] shadow-[0_15px_35px_-5px_rgba(132,204,22,0.3)] border border-lime-300/50 w-[240px] sm:w-[275px]">
              <div className="bg-white rounded-[22px] p-3.5 sm:p-4 shadow-sm border border-slate-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] sm:text-[12px] font-semibold text-slate-700 leading-tight">
                      Live Payment<br />Transactions
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                      2,847
                    </div>
                    <div className="text-[9px] font-bold text-emerald-600 mt-0.5">
                      ↑ 2.5% VS. LAST WEEK
                    </div>
                  </div>
                </div>

                {/* Green Wavy Area Chart SVG */}
                <div className="w-full mt-2 h-12 sm:h-14 relative">
                  <svg viewBox="0 0 240 60" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="liveChartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M 0 38 Q 30 52 60 28 T 120 18 T 180 38 T 240 12 L 240 60 L 0 60 Z" 
                      fill="url(#liveChartGrad)" 
                    />
                    <path 
                      d="M 0 38 Q 30 52 60 28 T 120 18 T 180 38 T 240 12" 
                      fill="none" 
                      stroke="#22c55e" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                    />
                    <circle cx="120" cy="18" r="3.5" fill="#22c55e" stroke="#fff" strokeWidth="2" />
                    <line x1="120" y1="18" x2="120" y2="60" stroke="#22c55e" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. TOP-RIGHT CARD: Smiling Woman with Payment Method Badges */}
          <motion.div
            style={{
              x: card2X,
              y: card2Y,
              scale: card2Scale,
              opacity: card2Opacity,
            }}
            transition={{ type: 'spring', stiffness: 90, damping: 20 }}
            className="absolute z-20 pointer-events-auto"
          >
            <div className="w-[220px] sm:w-[250px] lg:w-[270px] aspect-[4/3] sm:aspect-square rounded-[30px] overflow-hidden shadow-[0_20px_45px_-10px_rgba(0,0,0,0.18)] relative border border-slate-200/60 group">
              <Image 
                src="/images/payments/woman-logistics.jpg" 
                alt="Business owner using mobile payments" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 220px, 270px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Floating Glassmorphism Payment Brands Matrix */}
              <div className="absolute inset-x-2.5 bottom-2.5 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-2 sm:p-2.5 shadow-lg">
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                  {/* PhonePe */}
                  <div className="h-6 sm:h-7 rounded-lg bg-[#5f259f] flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
                    पे
                  </div>
                  {/* GPay */}
                  <div className="h-6 sm:h-7 rounded-lg bg-white flex items-center justify-center font-bold text-[10px] text-slate-800 shadow-sm border border-slate-100">
                    <span className="text-blue-500">G</span><span className="text-red-500">P</span><span className="text-yellow-500">a</span><span className="text-green-500">y</span>
                  </div>
                  {/* Paytm */}
                  <div className="h-6 sm:h-7 rounded-lg bg-[#002e6e] flex items-center justify-center text-cyan-400 font-extrabold text-[9px] shadow-sm">
                    Paytm
                  </div>
                  {/* RuPay */}
                  <div className="h-6 sm:h-7 rounded-lg bg-white flex items-center justify-center font-bold text-[9px] text-[#006e33] shadow-sm border border-slate-100">
                    RuPay
                  </div>
                  {/* VISA */}
                  <div className="h-6 sm:h-7 rounded-lg bg-[#1434cb] flex items-center justify-center text-white font-black text-[9px] shadow-sm italic">
                    VISA
                  </div>
                  {/* Apple Pay */}
                  <div className="h-6 sm:h-7 rounded-lg bg-black flex items-center justify-center text-white font-bold text-[9px] shadow-sm">
                    Pay
                  </div>
                  {/* UPI */}
                  <div className="h-6 sm:h-7 rounded-lg bg-white flex items-center justify-center font-black text-[9px] text-[#22c55e] shadow-sm border border-slate-100">
                    UPI
                  </div>
                  {/* Mastercard */}
                  <div className="h-6 sm:h-7 rounded-lg bg-slate-900 flex items-center justify-center gap-0.5 shadow-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block -mr-1" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block opacity-90" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 3. MID-LEFT CARD: Smiling Customer Support Representative */}
          <motion.div
            style={{
              x: card3X,
              y: card3Y,
              scale: card3Scale,
              opacity: card3Opacity,
            }}
            transition={{ type: 'spring', stiffness: 90, damping: 20 }}
            className="absolute z-20 pointer-events-auto"
          >
            <div className="w-[200px] sm:w-[230px] lg:w-[250px] aspect-square rounded-[30px] overflow-hidden shadow-[0_20px_45px_-10px_rgba(0,0,0,0.18)] relative border border-slate-200/60 group">
              <Image 
                src="/images/payments/support-agent.jpg" 
                alt="24/7 Assisted customer setup agent" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 200px, 250px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />

              {/* Floating Assisted Onboarding Card */}
              <div className="absolute inset-x-2.5 bottom-2.5 bg-white/45 backdrop-blur-md border border-white/60 rounded-2xl p-2.5 sm:p-3 shadow-lg flex flex-col gap-1.5 text-center">
                <span className="text-[11px] font-bold text-slate-900 leading-tight">
                  Welcome onboard
                </span>
                <div className="bg-white/95 text-slate-900 text-[10px] font-semibold py-1.5 px-3 rounded-xl flex items-center justify-between shadow-sm">
                  <span>Start assisted setup</span>
                  <ArrowRight className="w-3 h-3 ml-1 text-slate-700" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* 4. BOTTOM-CENTER / BOTTOM-LEFT CARD: Abhishek Multi-Currency Account */}
          <motion.div
            style={{
              x: card4X,
              y: card4Y,
              scale: card4Scale,
              opacity: card4Opacity,
            }}
            transition={{ type: 'spring', stiffness: 90, damping: 20 }}
            className="absolute z-20 pointer-events-auto"
          >
            <div className="bg-[#043320] rounded-[28px] p-3.5 sm:p-4 shadow-[0_20px_40px_-10px_rgba(4,51,32,0.4)] w-[240px] sm:w-[275px] border border-emerald-800/40 text-white">
              {/* Profile Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600/50 border border-emerald-400/40 flex items-center justify-center font-bold text-xs text-white">
                    A
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold leading-tight">Abhishek</span>
                    <span className="text-[9px] text-emerald-300/70 font-mono">372145</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm sm:text-base font-black text-white tracking-tight">
                    ₹11,000.00
                  </span>
                </div>
              </div>

              {/* White Currency Pill with Flags */}
              <div className="bg-white text-slate-800 rounded-xl py-1.5 px-2.5 flex items-center justify-between shadow-md mt-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">🇮🇳</span>
                  <span className="text-[11px] font-bold text-slate-800">INR</span>
                </div>
                
                <ArrowLeftRight className="w-3 h-3 text-slate-400" />

                <div className="flex items-center gap-1 text-xs">
                  <span>🇺🇸</span>
                  <span>🇬🇧</span>
                  <span>🇧🇷</span>
                  <span>🇹🇭</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 5. BOTTOM-RIGHT CARD: "No Hidden Charges" Blue Card */}
          <motion.div
            style={{
              x: card5X,
              y: card5Y,
              scale: card5Scale,
              opacity: card5Opacity,
            }}
            transition={{ type: 'spring', stiffness: 90, damping: 20 }}
            className="absolute z-20 pointer-events-auto"
          >
            <div className="bg-[#139fe0] rounded-[28px] p-3.5 sm:p-4 shadow-[0_20px_45px_-10px_rgba(19,159,224,0.4)] w-[210px] sm:w-[245px] aspect-square flex flex-col justify-between relative overflow-hidden border border-sky-400/40 text-white">
              {/* Top Text */}
              <div className="text-2xl sm:text-[28px] font-black tracking-tight leading-none">
                No Hidden
              </div>

              {/* Center Phone Screen with Neon Outline */}
              <div className="relative w-24 sm:w-28 aspect-[9/13] mx-auto rounded-xl overflow-hidden border-2 border-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.7)] rotate-[-6deg] my-1">
                <Image 
                  src="/images/payments/phone-charges.jpg" 
                  alt="Transparent charges mobile interface" 
                  fill 
                  className="object-cover"
                  sizes="120px"
                />
              </div>

              {/* Bottom Text */}
              <div className="text-2xl sm:text-[28px] font-black tracking-tight leading-none text-right">
                Charges
              </div>
            </div>
          </motion.div>

          {/* CENTER HERO HEADLINE: Exact match to reference without extra buttons */}
          <motion.div 
            style={{ scale: headlineScale }}
            className="relative z-30 text-center max-w-xl mx-auto px-4 py-8 pointer-events-none"
          >
            <h2 className="text-4xl sm:text-5xl md:text-[58px] lg:text-[66px] font-black tracking-tight text-[#111827] leading-[1.08]">
              The whole <br />
              payments stack, <br />
              on one platform.
            </h2>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
