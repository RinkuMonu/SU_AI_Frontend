import React from 'react';
import { Button } from './ui/button';

export function Hero() {
  return (
    <section className="relative min-h-[850px] flex items-center justify-center pt-32 pb-20 overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 scale-105"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#fc9a5d]/10 via-background/0 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center">
        
        {/* Main Heading */}
        <h1 className="text-[44px] sm:text-[64px] md:text-[80px] lg:text-[110px] leading-[1.05] font-semibold tracking-tighter text-white max-w-5xl mb-8">
          Grow your business <br className="hidden md:block" />
          with <span className="text-[#fc9a5d] italic pr-2">AI.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mb-10 font-medium">
          AI-powered tools that help your business create, publish and grow faster — while you focus on what matters.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button variant="default" size="lg" className="w-full sm:w-auto">
            Get Started
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Explore Platform
          </Button>
        </div>

        {/* Floating Info Panel - Mobile hidden, desktop absolute */}
        <div className="hidden lg:flex absolute right-4 bottom-12 glass-panel rounded-2xl p-5 items-center gap-5 w-[320px] animate-in slide-in-from-right-8 fade-in duration-1000 delay-500">
          <div className="flex flex-col flex-1">
            <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase mb-1">Your business is growing</span>
            <span className="text-sm font-medium text-white">AI-powered marketing</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-[2px] bg-white/10 rounded-full overflow-hidden">
              <div className="h-1/2 w-full bg-gradient-to-b from-[#fc9a5d] via-[#f0449b] to-[#7d36fa] rounded-full animate-pulse" />
            </div>
            <span className="text-3xl font-light text-white tracking-tighter">
              24<span className="text-[#f0449b]">/</span>7
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
