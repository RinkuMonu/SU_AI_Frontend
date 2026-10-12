import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Sparkles, ArrowRight, PlayCircle, Check } from 'lucide-react';

import { PhoneModel } from './PhoneModel';
import { FallingIcons } from './FallingIcons';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden bg-background">
      
      {/* 3D Physics Bouncing Background */}
      <FallingIcons />

      {/* Gradient overlays to ensure text readability */}
      <div className="absolute inset-0 z-0 bg-background/80 lg:bg-transparent pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-background via-background/90 to-transparent lg:w-[60%] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left Content Area */}
        <div className="flex flex-col items-start text-left max-w-2xl pt-10 pb-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 shadow-xl">
            <Sparkles className="w-4 h-4 text-[#fc9a5d]" />
            <span className="text-sm text-white/90 font-medium">AI-Powered Business Growth Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-[48px] sm:text-[60px] md:text-[72px] lg:text-[84px] leading-[1.05] font-bold tracking-tight text-white mb-6 drop-shadow-lg">
            Grow your <br className="hidden sm:block" />
            business with <span className="text-gradient pr-2">AI.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mb-10 font-medium leading-relaxed drop-shadow-md">
            All the tools you need to create, publish, automate and grow your business — powered by advanced AI.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 w-full sm:w-auto">
            <Button variant="default" size="lg" className="w-full sm:w-auto text-base h-14 px-8 group font-semibold shadow-lg" asChild>
              <Link href="/download">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-14 px-8 bg-black/20 backdrop-blur-md border-white/20 hover:bg-white/10 font-semibold text-white shadow-lg">
              <PlayCircle className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Features List */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-sm text-white/80 font-medium">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center">
                <Check className="w-5 h-5 text-[#fc9a5d] stroke-[3]" />
              </div>
              No Credit Card Required
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center">
                <Check className="w-5 h-5 text-[#fc9a5d] stroke-[3]" />
              </div>
              Setup in Minutes
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center">
                <Check className="w-5 h-5 text-[#fc9a5d] stroke-[3]" />
              </div>
              Used by 10,000+ Businesses
            </div>
          </div>
        </div>

        {/* Right Content Area: 3D Phone Model */}
        <div className="w-full lg:w-1/2 h-[500px] lg:h-[700px] flex items-center justify-center relative z-20 pointer-events-none">
          {/* <PhoneModel /> */}
        </div>

      </div>

      {/* Bottom Curved Divider */}
      <div className="absolute bottom-[0px] left-0 w-full overflow-hidden leading-none z-20 pointer-events-none translate-y-px">
        <svg 
          data-name="Layer 1" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-[60px] md:h-[90px] lg:h-[120px]"
        >
          <path 
            d="M0,120 L0,0 Q600,120 1200,0 L1200,120 Z" 
            className="fill-white"
          />
        </svg>
      </div>
    </section>
  );
}
