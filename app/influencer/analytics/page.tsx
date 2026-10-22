"use client";
import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Calendar,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import influencerService, { InfluencerProfile } from '@/services/influencer.service';
import marketplaceService from '@/services/marketplace.service';

export default function InfluencerAnalyticsPage() {
  const [profile, setProfile] = useState<InfluencerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    influencerService.getMyProfile()
      .then(res => {
        if (res.success && res.data) setProfile(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const followerCount = profile?.follower_count || 0;
  const engagementRate = profile?.engagement_rate || 0.0;
  const estReach = followerCount > 0 ? Math.round(followerCount * 0.35) : 0;
  const estImpressions = followerCount > 0 ? Math.round(followerCount * 0.72) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#be32ff]" /> Social Analytics &amp; Portfolio
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Verified platform reach, authentic engagement metrics, and completed brand campaign deliverables.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#0e0f17] border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">Total Followers</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-[#be32ff]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">
            {loading ? "..." : Number(followerCount).toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> Live verified audience
          </span>
        </Card>

        <Card className="bg-[#0e0f17] border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">Avg Engagement Rate</span>
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">
            {loading ? "..." : `${engagementRate}%`}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            Across recent Reels &amp; Posts
          </span>
        </Card>

        <Card className="bg-[#0e0f17] border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">Estimated Monthly Reach</span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-[#fc9a5d]">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">
            {loading ? "..." : Number(estReach).toLocaleString()}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            Unique profile accounts
          </span>
        </Card>

        <Card className="bg-[#0e0f17] border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">Est. Impressions</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">
            {loading ? "..." : Number(estImpressions).toLocaleString()}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            Estimated campaign views
          </span>
        </Card>
      </div>

      {/* Media Kit Breakdown */}
      <Card className="bg-[#0e0f17] border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Public Media Kit &amp; Rate Structure
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-neutral-400">Standard Reel Deliverable</span>
            <p className="text-lg font-bold text-white">₹{Number(profile?.expectedPricePerPost || 5000).toLocaleString()}</p>
            <p className="text-[11px] text-neutral-500">Includes 30-60s Reel, caption, and 30-day usage.</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-neutral-400">Story Series (3 Slides)</span>
            <p className="text-lg font-bold text-white">₹{Math.round(Number(profile?.expectedPricePerPost || 5000) * 0.5).toLocaleString()}</p>
            <p className="text-[11px] text-neutral-500">Includes sticker links and swipe-up CTAs.</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-neutral-400">Dedicated YouTube Video</span>
            <p className="text-lg font-bold text-white">₹{Math.round(Number(profile?.expectedPricePerPost || 5000) * 2.2).toLocaleString()}</p>
            <p className="text-[11px] text-neutral-500">Includes dedicated review and description links.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
