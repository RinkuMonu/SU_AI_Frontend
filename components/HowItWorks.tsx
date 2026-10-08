import React from 'react';
import { Rocket, Edit3, Send, TrendingUp, ChevronRight } from 'lucide-react';

export function HowItWorks() {
  return (
    <section className="py-20 bg-[#0B0F19] relative overflow-hidden border-t border-white/5">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
            <Rocket className="w-4 h-4 text-pink-500" />
            <span className="text-xs font-semibold text-slate-300 tracking-wide">Simple 3-Step Process</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-white tracking-tight">
            How Dhanda<span className="text-[#f0449b]">Grow</span> Works
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 lg:gap-8 xl:gap-12">
          
          {/* Step 1 */}
          <div className="flex items-center gap-5 group w-full md:w-auto justify-center md:justify-start">
            <div className="relative shrink-0">
              <div className="w-6 h-6 rounded-full bg-[#7d36fa] flex items-center justify-center absolute -top-2 -left-2 z-10 text-white text-[11px] font-bold shadow-lg ring-4 ring-[#0B0F19]">
                1
              </div>
              <div className="w-[72px] h-[72px] rounded-2xl bg-[#111827] border border-white/5 flex items-center justify-center shadow-xl relative overflow-hidden group-hover:border-indigo-500/30 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent" />
                <Edit3 className="w-7 h-7 text-[#3b82f6] relative z-10" />
              </div>
            </div>
            <div className="flex flex-col text-left max-w-[180px]">
              <h3 className="text-base font-bold text-white mb-1">Create</h3>
              <p className="text-[13px] text-slate-400 leading-snug font-medium">Use AI to generate content, ideas and strategies</p>
            </div>
          </div>

          <ChevronRight className="hidden md:block w-6 h-6 text-slate-600 shrink-0" />

          {/* Step 2 */}
          <div className="flex items-center gap-5 group w-full md:w-auto justify-center md:justify-start">
            <div className="relative shrink-0">
              <div className="w-6 h-6 rounded-full bg-[#7d36fa] flex items-center justify-center absolute -top-2 -left-2 z-10 text-white text-[11px] font-bold shadow-lg ring-4 ring-[#0B0F19]">
                2
              </div>
              <div className="w-[72px] h-[72px] rounded-2xl bg-[#111827] border border-white/5 flex items-center justify-center shadow-xl relative overflow-hidden group-hover:border-blue-500/30 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
                <Send className="w-7 h-7 text-[#3b82f6] relative z-10" />
              </div>
            </div>
            <div className="flex flex-col text-left max-w-[180px]">
              <h3 className="text-base font-bold text-white mb-1">Publish</h3>
              <p className="text-[13px] text-slate-400 leading-snug font-medium">Schedule and publish across multiple platforms</p>
            </div>
          </div>

          <ChevronRight className="hidden md:block w-6 h-6 text-slate-600 shrink-0" />

          {/* Step 3 */}
          <div className="flex items-center gap-5 group w-full md:w-auto justify-center md:justify-start">
            <div className="relative shrink-0">
              <div className="w-6 h-6 rounded-full bg-[#7d36fa] flex items-center justify-center absolute -top-2 -left-2 z-10 text-white text-[11px] font-bold shadow-lg ring-4 ring-[#0B0F19]">
                3
              </div>
              <div className="w-[72px] h-[72px] rounded-2xl bg-[#111827] border border-white/5 flex items-center justify-center shadow-xl relative overflow-hidden group-hover:border-pink-500/30 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-br from-[#f0449b]/10 to-[#fc9a5d]/10" />
                <TrendingUp className="w-7 h-7 text-[#fc9a5d] relative z-10" />
              </div>
            </div>
            <div className="flex flex-col text-left max-w-[180px]">
              <h3 className="text-base font-bold text-white mb-1">Grow</h3>
              <p className="text-[13px] text-slate-400 leading-snug font-medium">Track performance and scale your business</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
