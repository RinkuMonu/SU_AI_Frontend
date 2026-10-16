import React from 'react';
import Link from 'next/link';
import { Rocket, ArrowRight, Play, CreditCard, Clock, XCircle } from 'lucide-react';

export function CTA() {
  return (
    <section className="pt-7 sm:pt-9 pb-5 sm:pb-7 bg-white relative overflow-hidden border-t border-slate-100">
      {/* Soft ambient gradient glow in DhandaGrow theme */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[260px] bg-gradient-to-r from-orange-100/35 via-pink-100/35 to-purple-100/35 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 mb-3 sm:mb-4 shadow-2xs">
          <Rocket className="w-3.5 h-3.5 text-[#FF6B00]" />
          <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#E11D48] to-[#7C3AED]">
            Ready to Grow?
          </span>
        </div>
        
        {/* Compact Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-slate-900 tracking-tight mb-2.5 max-w-3xl mx-auto leading-[1.16]">
          Start Growing Your Business <br className="hidden sm:inline" />
          with DhandaGrow Today
        </h2>
        
        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-[17px] text-slate-600 mb-5 sm:mb-6 max-w-xl mx-auto font-medium leading-relaxed">
          Join thousands of businesses already using AI to grow faster, smarter and bigger.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 w-full">
          <Link 
            href="/download" 
            className="w-full sm:w-auto px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#FF6B00] via-[#E11D48] to-[#7C3AED] text-white font-bold hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-pink-500/25 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
          >
            Get Started Free <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          
          <button className="w-full sm:w-auto px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-white text-slate-900 font-semibold border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer">
            <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Play className="w-2.5 h-2.5 ml-0.5 fill-current" />
            </div>
            Watch Demo
          </button>
        </div>
        
        {/* Trust Badges Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-7 text-slate-500 text-xs sm:text-[13px] font-semibold">
          <div className="flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>No Credit Card</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#E11D48]" />
            <span>Setup in Minutes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Cancel Anytime</span>
          </div>
        </div>

      </div>
    </section>
  );
}
