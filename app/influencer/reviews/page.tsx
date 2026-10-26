"use client";
import React from 'react';
import { Star, ShieldCheck, MessageSquare, ThumbsUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function InfluencerReviewsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="pb-4 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Star className="w-6 h-6 text-[#fc9a5d]" /> Brand Reviews &amp; Ratings
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Authentic client ratings, delivery scores, and verified feedback from completed collaborations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#0e0f17] border-white/10 rounded-2xl p-5 text-center space-y-2">
          <span className="text-xs text-neutral-400">Overall Rating</span>
          <p className="text-4xl font-black text-white">5.0</p>
          <div className="flex justify-center gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map(n => <Star key={n} className="w-4 h-4 fill-amber-400" />)}
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold block">100% On-Time Delivery</span>
        </Card>

        <Card className="bg-[#0e0f17] border-white/10 rounded-2xl p-5 space-y-2 md:col-span-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Rating Breakdown</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-neutral-300">Communication &amp; Responsiveness</span>
              <span className="text-emerald-400 font-bold">5.0 / 5.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-300">Content Quality &amp; Brief Adherence</span>
              <span className="text-emerald-400 font-bold">4.9 / 5.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-300">Timeliness &amp; Deadlines</span>
              <span className="text-emerald-400 font-bold">5.0 / 5.0</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-[#0e0f17] border-white/10 rounded-2xl p-8 text-center">
        <CardContent className="space-y-2">
          <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
          <h3 className="text-sm font-bold text-white">Verified Feedback System</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Reviews can only be submitted by verified brands upon successful completion of a bilateral campaign and escrow release.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
