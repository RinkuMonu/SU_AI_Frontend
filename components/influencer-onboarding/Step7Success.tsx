"use client";

import React from "react";
import {
  Check,
  Handshake,
  PlaySquare,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface Step7SuccessProps {
  creatorName: string;
  onGoToDashboard: () => void;
}

export const Step7Success: React.FC<Step7SuccessProps> = ({
  creatorName,
  onGoToDashboard,
}) => {
  return (
    <div className="max-w-xl mx-auto py-4 space-y-7 text-center animate-in zoom-in-95 duration-500">
      {/* Starburst Glowing Badge */}
      <div className="flex justify-center pt-2">
        <div className="relative">
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#A855F7] to-[#EC4899] rounded-full blur-2xl opacity-50 scale-125" />

          {/* Scalloped Starburst shape */}
          <div className="relative w-24 h-24 rounded-[32px] bg-gradient-to-tr from-[#A855F7] via-[#BE32FF] to-[#EC4899] flex items-center justify-center shadow-[0_0_40px_rgba(190,50,255,0.6)] rotate-6 hover:rotate-0 transition-transform">
            <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm flex items-center justify-center -rotate-6">
              <Check className="w-9 h-9 text-white stroke-[3.5]" />
            </div>
          </div>
        </div>
      </div>

      {/* Heading & Subtitle */}
      <div className="space-y-2 px-4">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Your Creator Account is Ready!
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          {creatorName ? `Welcome aboard, ${creatorName}! ` : ""}
          Start exploring brand collaborations, create amazing content with AI, and
          grow your influence on DhandaGrow.
        </p>
      </div>

      {/* 3 Horizontal Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
        {/* Deal 1 */}
        <div className="bg-[#0B132B] border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:border-[#BE32FF]/40 transition-colors group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A855F7]/30 to-[#EC4899]/20 text-white flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Handshake className="w-5 h-5 text-[#EC4899]" />
          </div>
          <span className="text-xs font-bold text-white">Find Brand Deals</span>
        </div>

        {/* Deal 2 */}
        <div className="bg-[#0B132B] border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:border-[#BE32FF]/40 transition-colors group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A855F7]/30 to-[#EC4899]/20 text-white flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <PlaySquare className="w-5 h-5 text-[#BE32FF]" />
          </div>
          <span className="text-xs font-bold text-white">Create Reels with AI</span>
        </div>

        {/* Deal 3 */}
        <div className="bg-[#0B132B] border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:border-[#BE32FF]/40 transition-colors group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A855F7]/30 to-[#EC4899]/20 text-white flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5 text-[#A855F7]" />
          </div>
          <span className="text-xs font-bold text-white">Track Earnings</span>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-4">
        <button
          type="button"
          onClick={onGoToDashboard}
          className="w-full sm:w-auto px-10 py-3.5 rounded-full bg-gradient-to-r from-[#A855F7] via-[#BE32FF] to-[#EC4899] hover:opacity-95 text-white font-black text-sm shadow-[0_0_30px_rgba(236,72,153,0.5)] flex items-center justify-center gap-2.5 mx-auto cursor-pointer transition-all hover:scale-[1.03]"
        >
          <span>Go to Creator Dashboard</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};

