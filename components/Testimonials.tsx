'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: string;
  headline: string;
  quote: string;
  author: string;
  role: string;
  companyName: string;
  companyLogo: React.ReactNode;
}

const testimonials: Testimonial[] = [
  {
    id: 'logipe',
    headline: 'Great products; competitive pricing',
    quote: 'Competitive pricing and top-notch quality have been the reasons we chose DhandaGrow over other brands. Their customer profiling and 1-click checkout increased our order conversions by 38%.',
    author: 'Mrityunjay Hiremath',
    role: 'CEO, LogiPe',
    companyName: 'LogiPe',
    companyLogo: (
      <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-800">
        Logi<span className="text-[#00c9a7]">Pe</span><span className="text-[#ff9800]">.</span>
      </span>
    )
  },
  {
    id: 'equitas',
    headline: 'Trust them with round-the-clock support',
    quote: 'Round-the-clock support from team DhandaGrow has been one of the building blocks of our long association with the brand. Their DPDP compliance and Indian tier-4 vault gave our audit committee full confidence.',
    author: 'Murugesh',
    role: 'Head - Bangalore Branch, Equitas Bank',
    companyName: 'Equitas Bank',
    companyLogo: (
      <span className="font-bold text-sm sm:text-base tracking-wider uppercase text-[#0d3b66] bg-blue-50/80 px-2.5 py-1 rounded-md border border-blue-100">
        Equitas
      </span>
    )
  },
  {
    id: 'bombay-shaving',
    headline: 'Our festive video ad ROAS grew to 4.2x',
    quote: 'Producing high-converting AI reels in Hinglish and regional languages used to take days of agency back-and-forth. With DhandaGrow AI, we churn out 15 viral reels a week with zero friction.',
    author: 'Aanya Khandelwal',
    role: 'Head of Growth, Bombay Shaving Co.',
    companyName: 'Bombay Shaving Co.',
    companyLogo: (
      <span className="font-bold text-xs sm:text-sm tracking-widest uppercase text-slate-800 border-b-2 border-orange-500 pb-0.5">
        BOMBAY SHAVING
      </span>
    )
  },
  {
    id: 'bharatfresh',
    headline: 'UPI AutoPay made recurring orders 100% automated',
    quote: 'Our retail subscription repeat deliveries are completely hassle-free now. Zero manual payment follow-ups, and GST invoices sync directly to Tally every midnight without error.',
    author: 'Vikramaditya Singhania',
    role: 'Founder, BharatFresh Supply',
    companyName: 'BharatFresh',
    companyLogo: (
      <span className="font-black text-sm sm:text-base tracking-tight text-emerald-700">
        Bharat<span className="text-orange-500">Fresh</span>
      </span>
    )
  },
  {
    id: 'mediaspark',
    headline: 'Studio-quality AI voiceovers & viral caption sync',
    quote: 'The Hindi and Marathi AI voice quality is indistinguishable from human dubbing artists. Our social media agency has scaled client campaign delivery 5x without increasing headcount.',
    author: 'Rohan Mathur',
    role: 'Creative Director, MediaSpark Studios',
    companyName: 'MediaSpark',
    companyLogo: (
      <span className="font-extrabold text-sm sm:text-base text-violet-700 tracking-tight">
        Media<span className="text-orange-500">Spark</span>⚡
      </span>
    )
  }
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Group testimonials in pairs for desktop view
  // On desktop: 2 cards side by side per slide
  const totalSlides = Math.ceil(testimonials.length / 2);

  // Auto-play interval
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, totalSlides]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  // Currently visible pair of cards
  const slideCards = [
    testimonials[currentIndex * 2],
    testimonials[currentIndex * 2 + 1] || testimonials[0] // Fallback to first if odd count
  ];

  return (
    <section 
      className="py-16 sm:py-24 bg-[#faf9f6] relative z-10 w-full overflow-hidden border-t border-orange-100/60"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Subtle Background Grid Matching PaymentsStackSection */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `linear-gradient(to right, #f4e8dc 1px, transparent 1px), linear-gradient(to bottom, #f4e8dc 1px, transparent 1px)`,
          backgroundSize: '36px 36px'
        }}
      />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-orange-600 font-semibold text-xs sm:text-sm tracking-wider uppercase inline-block">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-slate-900 tracking-tight mt-2 leading-[1.2]">
            What Our Customers are Saying
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          
          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous testimonial"
            className="hidden md:flex absolute -left-5 lg:-left-7 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 border border-orange-200/80 shadow-md hover:shadow-lg items-center justify-center text-slate-700 hover:text-orange-600 hover:scale-105 transition-all cursor-pointer backdrop-blur-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            aria-label="Next testimonial"
            className="hidden md:flex absolute -right-5 lg:-right-7 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 border border-orange-200/80 shadow-md hover:shadow-lg items-center justify-center text-slate-700 hover:text-orange-600 hover:scale-105 transition-all cursor-pointer backdrop-blur-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Cards Grid / Slider */}
          <div className="overflow-hidden px-1 py-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch"
              >
                {slideCards.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className="bg-[#fffdfa] rounded-[24px] sm:rounded-[28px] border border-orange-200/60 shadow-[0_12px_36px_-12px_rgba(249,115,22,0.07)] p-6 sm:p-9 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-[0_18px_45px_-10px_rgba(249,115,22,0.12)] hover:border-orange-300"
                  >
                    {/* Top Orange Double Quote */}
                    <div>
                      <div className="text-orange-500 font-serif text-4xl sm:text-5xl leading-none select-none mb-3">
                        &ldquo;&ldquo;
                      </div>

                      {/* Headline in Serif */}
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4 leading-snug">
                        {item.headline}
                      </h3>

                      {/* Quote Body */}
                      <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed mb-6 font-normal">
                        {item.quote}
                      </p>
                    </div>

                    {/* Bottom Author & Company Logo */}
                    <div className="flex items-center justify-between pt-5 border-t border-orange-100/70 mt-auto">
                      <div>
                        <p className="text-orange-600 font-bold text-sm sm:text-base leading-snug">
                          {item.author}
                        </p>
                        <p className="text-slate-500 text-xs sm:text-[13px] font-medium mt-0.5">
                          {item.role}
                        </p>
                      </div>

                      <div className="shrink-0 pl-3">
                        {item.companyLogo}
                      </div>
                    </div>

                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Pagination Dots */}
          <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10">
            {Array.from({ length: totalSlides }).map((_, dotIdx) => {
              const isActive = currentIndex === dotIdx;
              return (
                <button
                  key={dotIdx}
                  onClick={() => setCurrentIndex(dotIdx)}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'w-7 sm:w-8 bg-orange-600 shadow-xs'
                      : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
