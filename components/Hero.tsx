import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Sparkles, ArrowRight, PlayCircle, Check } from 'lucide-react';

import { PhoneModel } from './PhoneModel';
import { FallingIcons } from './FallingIcons';

export function Hero() {
  return (
    <section className="relative min-h-[85vh] lg:min-h-0 flex items-center pt-24 sm:pt-28 pb-8 sm:pb-10 overflow-hidden bg-background">
      
      {/* 3D Physics Bouncing Background */}
      <FallingIcons />

      {/* Gradient overlays to ensure text readability */}
      <div className="absolute inset-0 z-0 bg-background/80 lg:bg-transparent pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-background via-background/90 to-transparent lg:w-[60%] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        
        {/* Left Content Area */}
        <div className="flex flex-col items-start text-left max-w-2xl py-2 sm:py-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-4 sm:mb-5 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#fc9a5d]" />
            <span className="text-xs sm:text-sm text-white/90 font-medium">AI-Powered Business Growth Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-[38px] sm:text-[50px] md:text-[58px] lg:text-[68px] leading-[1.08] font-bold tracking-tight text-white mb-4 drop-shadow-lg">
            Grow your <br className="hidden sm:block" />
            business with <span className="text-gradient pr-2">AI.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-white/70 max-w-2xl mb-6 sm:mb-7 font-medium leading-relaxed drop-shadow-md">
            All the tools you need to create, publish, automate and grow your business — powered by advanced AI.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 mb-6 sm:mb-7 w-full sm:w-auto">
            <Button variant="default" size="lg" className="w-full sm:w-auto text-sm sm:text-base h-11 sm:h-12 px-6 sm:px-7 group font-semibold shadow-lg" asChild>
              <Link href="/download">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm sm:text-base h-11 sm:h-12 px-6 sm:px-7 bg-black/20 backdrop-blur-md border-white/20 hover:bg-white/10 font-semibold text-white shadow-lg">
              <PlayCircle className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Features List */}
          <div className="flex flex-wrap items-center gap-x-5 sm:gap-x-6 gap-y-2.5 text-xs sm:text-sm text-white/80 font-medium">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center">
                <Check className="w-4 h-4 text-[#fc9a5d] stroke-[2.5]" />
              </div>
              No Credit Card Required
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center">
                <Check className="w-4 h-4 text-[#fc9a5d] stroke-[2.5]" />
              </div>
              Setup in Minutes
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center">
                <Check className="w-4 h-4 text-[#fc9a5d] stroke-[2.5]" />
              </div>
              Used by 10,000+ Businesses
            </div>
          </div>
        </div>

        {/* Right Content Area: 3D Phone Model */}
        <div className="w-full lg:w-1/2 h-[260px] sm:h-[340px] lg:h-[440px] flex items-center justify-center relative z-20 pointer-events-none">
          {/* <PhoneModel /> */}
        </div>

      </div>

      {/* Bottom Curved Divider */}
      <div className="absolute bottom-[0px] left-0 w-full overflow-hidden leading-none z-20 pointer-events-none translate-y-px">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 60" 
          preserveAspectRatio="none" 
          className="relative block w-full h-[28px] sm:h-[38px] lg:h-[48px]"
        >
          <path 
            d="M0,60 Q720,0 1440,60 L1440,60 L0,60 Z" 
            className="fill-white"
          />
        </svg>
      </div>
    </section>
  );
}
