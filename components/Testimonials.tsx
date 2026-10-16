'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2, Users, Star } from 'lucide-react';

interface TeamMemberReview {
  id: string;
  name: string;
  role: string;
  image: string;
  paragraphs: string[];
}

interface CustomerReview {
  id: string;
  name: string;
  role: string;
  business: string;
  city: string;
  image: string;
  rating: number;
  quote: string;
}

// Actual Leadership Team from reference graphics
const teamMembers: TeamMemberReview[] = [
  {
    id: 'dinesh-sir',
    name: 'Dinesh Sir',
    role: 'Founder & Promoter',
    image: '/images/dinesh-sir-clean.png',
    paragraphs: [
      '“The idea behind Dhanda Grow AI came from one simple thought – why should growing a business or personal brand be so difficult and expensive? We created Dhanda Grow AI to make digital growth accessible, simpler, and affordable for everyone. And honestly, we’re just getting started!”'
    ]
  },
  {
    id: 'rajyavardhan-sir',
    name: 'Rajyavardhan sir',
    role: 'Team leader',
    image: '/team/rajya-sir.webp',
    paragraphs: [
      '“Being the team leader at Dhanda Grow AI is all about turning ideas into reality! 🚀 I focus on bringing the team together, solving challenges, and making sure we\'re building something truly useful for businesses and creators. One team, one vision, and big goals ahead! 💻✨”'
    ]
  },
  {
    id: 'vijay-sir',
    name: 'Vijay sir',
    role: 'Full-Stack Developer',
    image: '/team/gupta-vijay.webp',
    paragraphs: [
      '“The fun part of working on Dhanda Grow AI is seeing everything come together – from the interface to the backend. We\'re building something that helps businesses and creators manage social media without juggling a hundred different things!”'
    ]
  },
  {
    id: 'rinku-sir',
    name: 'Rinku Sir',
    role: 'Server Administrator',
    image: '/team/yadav-rinku.webp',
    paragraphs: [
      '“People see the app, but there\'s a whole lot happening behind the scenes! My focus is keeping the infrastructure stable, secure, and ready to handle things smoothly. Because let\'s be real, nobody likes a slow app!”'
    ]
  },
  {
    id: 'deepak-sir',
    name: 'Deepak Sir',
    role: 'Mobile App Developer',
    image: '/team/deepak.webp',
    paragraphs: [
      '“Building the mobile app for DhandaGrow AI is about putting supercharged AI tools right into the pocket of every shopkeeper and creator. Fast, seamless, and built for scale!”'
    ]
  },
  {
    id: 'vishal-sir',
    name: 'Vishal Sir',
    role: 'Data Analyst & Growth',
    image: '/team/vishall.webp',
    paragraphs: [
      '“Analyzing creator metrics and business engagement patterns helps us optimize AI models so every post, caption, and hashtag delivers maximum reach and real customer conversions!”'
    ]
  }
];

// Single clean genuine customer review (No dummy lists or stock photos)
const singleCustomerReview: CustomerReview = {
  id: 'customer-1',
  name: 'BharatFresh Retail',
  role: 'D2C Retail Partner',
  business: 'BharatFresh Organic',
  city: 'Jaipur, Rajasthan',
  image: '/images/logo-icon.png',
  rating: 5,
  quote: '“DhandaGrow AI completely changed how we handle social media marketing. From automatic festival creatives to daily WhatsApp updates, our store footfall and festival orders increased significantly without hiring an expensive agency.”'
};

export function Testimonials() {
  const [activeTab, setActiveTab] = useState<'team' | 'customer'>('team');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // For team: 2 cards per view (slides = 3)
  const itemsPerSlide = 2;
  const totalTeamSlides = Math.ceil(teamMembers.length / itemsPerSlide);
  const totalSlides = activeTab === 'team' ? totalTeamSlides : 1;

  // Auto-play interval for team carousel
  useEffect(() => {
    if (isPaused || activeTab !== 'team') return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % totalTeamSlides);
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused, activeTab, totalTeamSlides]);

  const handlePrev = () => {
    if (activeTab !== 'team') return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalTeamSlides) % totalTeamSlides);
  };

  const handleNext = () => {
    if (activeTab !== 'team') return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalTeamSlides);
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

  // Current pair of team members
  const currentTeamPair = [
    teamMembers[currentIndex * itemsPerSlide],
    teamMembers[currentIndex * itemsPerSlide + 1] || teamMembers[0]
  ];

  return (
    <section 
      className="py-14 sm:py-20 bg-[#faf9f6] relative z-10 w-full overflow-hidden border-t border-orange-100/60"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Decorative Gradient Glows matching logo colors */}
      <div className="absolute top-0 left-10 w-80 h-80 bg-[#FF6B00]/6 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-[#7C3AED]/6 blur-[100px] rounded-full pointer-events-none" />

      {/* Subtle Background Grid matching brand aesthetic */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `linear-gradient(to right, #f4e8dc 1px, transparent 1px), linear-gradient(to bottom, #f4e8dc 1px, transparent 1px)`,
          backgroundSize: '36px 36px'
        }}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header Row matching the user reference graphics */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-10 gap-5">
          
          {/* Decorative Horizontal Line with Dot (Left) */}
          <div className="hidden sm:flex items-center gap-0 w-28 md:w-52">
            <div className="h-[3px] bg-gradient-to-r from-[#FF6B00] via-[#E11D48] to-[#7C3AED] w-full rounded-full" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#7C3AED] shrink-0 -ml-1 shadow-sm" />
          </div>

          {/* Heading on the Right: Exact "WHAT OUR TEAM SAYS?" Graphic Style */}
          <div className="flex items-start gap-2.5 sm:gap-3.5 ml-auto">
            <span className="text-4xl sm:text-5xl md:text-6xl font-serif font-black bg-gradient-to-r from-[#FF6B00] via-[#E11D48] to-[#7C3AED] bg-clip-text text-transparent leading-none select-none">
              &ldquo;
            </span>
            <div className="text-right sm:text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-black uppercase tracking-tight bg-gradient-to-r from-[#FF6B00] via-[#E11D48] to-[#7C3AED] bg-clip-text text-transparent leading-[1.05]">
                {activeTab === 'team' ? (
                  <>WHAT OUR<br />TEAM SAYS?</>
                ) : (
                  <>WHAT OUR<br />CUSTOMERS SAY?</>
                )}
              </h2>
            </div>
          </div>
        </div>

        {/* Tab Switcher: Team (Primary) vs Customer Review (Single clean review) */}
        <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-7">
          <button
            onClick={() => {
              setActiveTab('team');
              setCurrentIndex(0);
            }}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'team'
                ? 'bg-gradient-to-r from-[#FF6B00] via-[#E11D48] to-[#7C3AED] text-white shadow-md shadow-pink-500/20 scale-105'
                : 'bg-white/90 text-slate-600 border border-slate-200/80 hover:border-orange-300 hover:text-slate-900 shadow-xs'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Our Team ({teamMembers.length})
          </button>
          
          <button
            onClick={() => {
              setActiveTab('customer');
              setCurrentIndex(0);
            }}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'customer'
                ? 'bg-gradient-to-r from-[#FF6B00] via-[#E11D48] to-[#7C3AED] text-white shadow-md shadow-purple-500/20 scale-105'
                : 'bg-white/90 text-slate-600 border border-slate-200/80 hover:border-purple-300 hover:text-slate-900 shadow-xs'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            Customer Review
          </button>
        </div>

        {/* TEAM VIEW: 2 Containers per slide with horizontal scroll */}
        {activeTab === 'team' && (
          <div className="relative">
            
            {/* Left Arrow Button */}
            <button
              onClick={handlePrev}
              aria-label="Previous team slide"
              className="hidden md:flex absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/95 border border-pink-200 shadow-lg hover:shadow-xl items-center justify-center text-slate-800 hover:text-[#E11D48] hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Arrow Button */}
            <button
              onClick={handleNext}
              aria-label="Next team slide"
              className="hidden md:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/95 border border-pink-200 shadow-lg hover:shadow-xl items-center justify-center text-slate-800 hover:text-[#E11D48] hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Sliding Cards Container: Exactly 2 Team Containers Side-by-Side */}
            <div className="overflow-hidden py-2 px-1">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`team-${currentIndex}`}
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 items-stretch"
                >
                  {currentTeamPair.map((member, idx) => (
                    <div
                      key={`${member.id}-${idx}`}
                      className="group relative h-full flex"
                    >
                      {/* Outer Frame with Exact Logo Theme Gradient (Orange -> Hot Pink -> Purple) */}
                      <div className="bg-gradient-to-br from-[#FF6B00] via-[#E11D48] to-[#7C3AED] rounded-[28px] sm:rounded-[36px] p-0 pr-2.5 pb-2.5 sm:pr-3.5 sm:pb-3.5 shadow-xl transition-all duration-300 group-hover:shadow-2xl w-full flex">
                        
                        {/* Main Clean Light Card Body (Medium height, compact) */}
                        <div className="bg-[#FFFFFF] rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 lg:p-7 w-full flex flex-col justify-between relative overflow-hidden border border-slate-100 shadow-xs">
                          
                          <div>
                            {/* Top Row: Avatar on Left + Name/Role in Middle + Quote Mark on Right */}
                            <div className="flex items-start gap-4 sm:gap-5 mb-3.5">
                              
                              {/* Circular Avatar with Glowing Logo Theme Gradient Ring */}
                              <div className="relative shrink-0">
                                <div className="p-[3.5px] sm:p-[4px] rounded-full bg-gradient-to-tr from-[#FF6B00] via-[#E11D48] to-[#7C3AED] shadow-md group-hover:scale-105 transition-transform duration-300">
                                  <div className="w-18 h-18 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-full overflow-hidden bg-slate-100">
                                    <Image
                                      src={member.image}
                                      alt={`${member.name} - ${member.role}`}
                                      width={100}
                                      height={100}
                                      className="w-full h-full object-cover object-top"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Name & Role */}
                              <div className="flex-1 min-w-0 pt-1">
                                <h3 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] tracking-tight leading-tight truncate">
                                  {member.name}
                                </h3>
                                <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1 truncate">
                                  {member.role}
                                </p>
                              </div>

                              {/* Large Double Quotation Mark (Right) */}
                              <div className="text-3xl sm:text-4xl font-serif font-black bg-gradient-to-br from-[#FF6B00] via-[#E11D48] to-[#7C3AED] bg-clip-text text-transparent leading-none select-none shrink-0 pl-1">
                                &rdquo;
                              </div>
                            </div>

                            {/* Exact Quotes from User Graphics */}
                            <div className="space-y-2 text-slate-700 italic text-xs sm:text-[13.5px] lg:text-[14px] leading-relaxed font-normal min-h-[68px] sm:min-h-[72px] flex items-start">
                              {member.paragraphs.map((para, pIdx) => (
                                <p key={pIdx} className="leading-relaxed">
                                  {para}
                                </p>
                              ))}
                            </div>
                          </div>

                          {/* Footer Accent */}
                          <div className="flex items-center justify-between pt-3 mt-4 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                            <span className="flex items-center gap-1 text-[#FF6B00] font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              DhandaGrow AI Core Team
                            </span>
                            <span className="text-slate-400">
                              Official Statement
                            </span>
                          </div>

                        </div>

                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Pagination Dots */}
            <div className="flex items-center justify-center gap-2 mt-7 sm:mt-9">
              {Array.from({ length: totalTeamSlides }).map((_, dotIdx) => {
                const isActive = currentIndex === dotIdx;
                return (
                  <button
                    key={dotIdx}
                    onClick={() => {
                      setDirection(dotIdx > currentIndex ? 1 : -1);
                      setCurrentIndex(dotIdx);
                    }}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'w-8 bg-gradient-to-r from-[#FF6B00] via-[#E11D48] to-[#7C3AED] shadow-sm'
                        : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                );
              })}
            </div>

          </div>
        )}

        {/* CUSTOMER VIEW: Single Clean Genuine Review (No dummy data/photos) */}
        {activeTab === 'customer' && (
          <div className="max-w-2xl mx-auto py-2">
            <div className="group relative">
              
              {/* Outer Frame with Exact Logo Theme Gradient */}
              <div className="bg-gradient-to-br from-[#FF6B00] via-[#E11D48] to-[#7C3AED] rounded-[28px] sm:rounded-[36px] p-0 pr-2.5 pb-2.5 sm:pr-3.5 sm:pb-3.5 shadow-xl transition-all duration-300 group-hover:shadow-2xl">
                
                {/* Main Clean Card Body */}
                <div className="bg-[#FFFFFF] rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 w-full flex flex-col justify-between relative overflow-hidden border border-slate-100 shadow-xs">
                  
                  <div>
                    {/* Top Row: Logo Icon on Left + Name/Business in Middle + Stars/Quote on Right */}
                    <div className="flex items-start gap-4 sm:gap-5 mb-4">
                      
                      {/* Circular Avatar with Logo Theme Gradient Ring */}
                      <div className="relative shrink-0">
                        <div className="p-[3.5px] sm:p-[4px] rounded-full bg-gradient-to-tr from-[#FF6B00] via-[#E11D48] to-[#7C3AED] shadow-md">
                          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-white p-2 flex items-center justify-center">
                            <Image
                              src={singleCustomerReview.image}
                              alt={singleCustomerReview.name}
                              width={70}
                              height={70}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Name & Business */}
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] tracking-tight leading-tight">
                            {singleCustomerReview.name}
                          </h3>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200/70 text-[#E11D48]">
                            Verified Customer
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                          {singleCustomerReview.role} • {singleCustomerReview.business}
                        </p>
                        <p className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">
                          {singleCustomerReview.city}
                        </p>
                      </div>

                      {/* Right: Quotation Mark */}
                      <div className="text-3xl sm:text-4xl font-serif font-black bg-gradient-to-br from-[#FF6B00] via-[#E11D48] to-[#7C3AED] bg-clip-text text-transparent leading-none select-none shrink-0 pl-1">
                        &rdquo;
                      </div>
                    </div>

                    {/* 5-Star Rating Row */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(singleCustomerReview.rating)].map((_, starIdx) => (
                        <Star key={starIdx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-xs font-bold text-amber-600 ml-1.5">5.0 Star Verified Review</span>
                    </div>

                    {/* Customer Review Quote */}
                    <p className="text-slate-700 italic text-sm sm:text-[15px] leading-relaxed font-normal">
                      {singleCustomerReview.quote}
                    </p>
                  </div>

                  {/* Trust Footer */}
                  <div className="flex items-center justify-between pt-4 mt-5 border-t border-slate-100 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      Verified Business Partner
                    </span>
                    <span className="text-slate-400">
                      Growing with DhandaGrow AI
                    </span>
                  </div>

                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
