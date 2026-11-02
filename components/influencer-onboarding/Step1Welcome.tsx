"use client";

import React from "react";
import { ArrowRight, Sparkles, Video, TrendingUp, Gem } from "lucide-react";

interface Step1WelcomeProps {
  onNext: () => void;
}

export const Step1Welcome: React.FC<Step1WelcomeProps> = ({ onNext }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4 animate-in fade-in duration-300">
      {/* Left Column: Headline, Value Propositions, CTA */}
      <div className="lg:col-span-7 space-y-6">
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
            Become a{" "}
            <span className="bg-gradient-to-r from-[#BE32FF] via-[#F0449B] to-[#FC9A5D] bg-clip-text text-transparent block">
              DhandaGrow Creator
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Collaborate with top brands, create engaging content, and grow your influence with AI.
          </p>
        </div>

        {/* 3 Value Propositions matching reference */}
        <div className="space-y-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-white/10 hover:border-white/20 transition-all flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A855F7]/25 to-[#EC4899]/25 text-[#EC4899] border border-[#EC4899]/30 flex items-center justify-center shrink-0">
              <Gem className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Get Brand Collaborations</h3>
              <p className="text-xs text-slate-400">Unlock paid sponsorships, product gifting, and long-term brand ambassador deals.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-white/10 hover:border-white/20 transition-all flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A855F7]/25 to-[#EC4899]/25 text-[#EC4899] border border-[#EC4899]/30 flex items-center justify-center shrink-0">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Create Reels with AI Tools</h3>
              <p className="text-xs text-slate-400">Generate viral Hindi/English scripts, trending audio hooks, and high-converting captions.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-white/10 hover:border-white/20 transition-all flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A855F7]/25 to-[#EC4899]/25 text-[#EC4899] border border-[#EC4899]/30 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Track Earnings &amp; Growth</h3>
              <p className="text-xs text-slate-400">Unified creator dashboard with automated milestone payouts and audience metrics.</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onNext}
            className="w-full sm:w-auto px-9 py-3.5 rounded-full bg-gradient-to-r from-[#A855F7] to-[#EC4899] hover:opacity-95 text-white font-bold text-sm shadow-[0_0_25px_rgba(236,72,153,0.45)] transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Column: Hero Visual with Floating Social Badges */}
      <div className="lg:col-span-5 relative flex items-center justify-center">
        {/* Glow backdrop */}
        <div className="absolute w-72 h-72 sm:w-80 sm:h-80 bg-gradient-to-tr from-[#BE32FF]/30 to-[#F0449B]/30 rounded-full blur-[70px] pointer-events-none" />

        {/* Creator Frame */}
        <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-b from-[#131E42] to-[#0B132B] shadow-2xl p-2">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
            alt="DhandaGrow Creator"
            className="w-full h-full object-cover rounded-2xl"
          />

          {/* Floating Instagram Badge */}
          <div className="absolute top-6 left-4 bg-black/75 backdrop-blur-md border border-white/15 rounded-2xl p-2.5 shadow-xl flex items-center gap-2 animate-bounce duration-1000">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow">
              IG
            </div>
            <div className="pr-1 text-left">
              <span className="text-[10px] text-slate-400 block font-medium">Instagram</span>
              <span className="text-xs font-bold text-white leading-none">120K reach</span>
            </div>
          </div>

          {/* Floating YouTube Badge */}
          <div className="absolute top-1/3 -right-2 bg-black/75 backdrop-blur-md border border-white/15 rounded-2xl p-2.5 shadow-xl flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white text-xs font-bold shadow">
              YT
            </div>
            <div className="pr-1 text-left">
              <span className="text-[10px] text-slate-400 block font-medium">YouTube</span>
              <span className="text-xs font-bold text-white leading-none">45K Subs</span>
            </div>
          </div>

          {/* Floating TikTok/Shorts Badge */}
          <div className="absolute bottom-8 right-6 bg-black/75 backdrop-blur-md border border-white/15 rounded-2xl p-2.5 shadow-xl flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#25F4EE]/20 border border-[#FE2C55]/40 flex items-center justify-center text-[#25F4EE] text-xs font-bold shadow">
              TT
            </div>
            <div className="pr-1 text-left">
              <span className="text-[10px] text-slate-400 block font-medium">Shorts</span>
              <span className="text-xs font-bold text-white leading-none">Viral Reels</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

