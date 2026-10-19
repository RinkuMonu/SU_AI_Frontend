"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Sparkles, Megaphone,
  Image as ImageIcon, Video, Camera, TrendingUp, ArrowRight, Zap
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { analyticsService } from "@/services/analytics.service";
import { creditService } from "@/services/credit.service";
import { AnalyticsData } from "@/types/analytics";
import { CreditBalance } from "@/types/credits";
import { AIInsights } from "@/components/ai/AIInsights";
import { Insight } from "@/types/insights";
import { TodaysMarketing } from "@/components/dashboard/TodaysMarketing";
import { RecentActivityList } from "@/components/dashboard/RecentActivityList";

export default function DashboardPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [creditBalance, setCreditBalance] = useState<CreditBalance | null>(null);

  useEffect(() => {
    analyticsService.getAnalyticsOverview(7)
      .then(setAnalytics)
      .catch((e) => console.error("Failed to load analytics", e))
      .finally(() => setLoadingAnalytics(false));

    creditService.getCredits()
      .then(setCreditBalance)
      .catch(() => null);
  }, []);

  const insights: Insight[] = analytics?.recommendation
    ? [
        {
          _id: "rec-1",
          title: "AI Recommendation",
          description: analytics.recommendation.text,
          priority: "High",
          recommendedAction: "Take action now to improve your marketing score.",
          actionType:
            analytics.recommendation.type === "reels"
              ? "Create Reel"
              : analytics.recommendation.type === "content"
              ? "Create Post"
              : "View Analytics",
          actionTarget:
            analytics.recommendation.type === "reels"
              ? "reel"
              : analytics.recommendation.type === "content"
              ? "post"
              : "analytics",
        },
      ]
    : [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {greeting}, {user?.name || "there"}!
          </h1>
          <p className="text-text-muted mt-1 text-sm">Here is your AI marketing summary for the last 7 days.</p>
        </div>

        {creditBalance && (
          <Link
            href="/subscription"
            className="self-start sm:self-auto inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 shadow-lg backdrop-blur-xl transition-all group cursor-pointer"
            title="View Plan Details & Upgrade"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400">Plan:</span>
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 uppercase">
                {creditBalance.plan === "PRO" ? "GROWTH" : creditBalance.plan === "BASIC" ? "STARTER" : (creditBalance.plan || "FREE")}
              </span>
            </div>
            <div className="h-3.5 w-px bg-white/20" />
            <div className="flex items-center gap-1 text-xs text-brand-purple font-bold">
              <Zap className="w-3.5 h-3.5 fill-brand-purple" />
              <span>{creditBalance.credits_remaining} Credits</span>
            </div>
          </Link>
        )}
      </div>

      {/* Live Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-brand-purple/20 to-[#0B1120] border-brand-purple/30 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-brand-purple/60 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:-translate-y-1 transition-all duration-500 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Posts Created</CardTitle>
            <ImageIcon className="h-4 w-4 text-brand-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-purple">
              {loadingAnalytics ? "--" : analytics?.content.posts ?? 0}
            </div>
            <p className="text-xs text-brand-purple/70 mt-1">In the last 7 days</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-brand-pink/20 to-[#0B1120] border-brand-pink/30 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-brand-pink/60 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:-translate-y-1 transition-all duration-500 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Reels Created</CardTitle>
            <Video className="h-4 w-4 text-brand-pink" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-pink">
              {loadingAnalytics ? "--" : analytics?.content.reels ?? 0}
            </div>
            <p className="text-xs text-brand-pink/70 mt-1">In the last 7 days</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white/10 to-[#0B1120] border-white/20 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-1 transition-all duration-500 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">AI Generations</CardTitle>
            <Sparkles className="h-4 w-4 text-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {loadingAnalytics ? "--" : analytics?.ai_usage.total_generations ?? 0}
            </div>
            <p className="text-xs text-brand-coral mt-1">Total AI uses this week</p>
          </CardContent>
        </Card>

        <Link href="/analytics" className="block">
          <Card className="h-full bg-gradient-to-br from-brand-coral/20 to-[#0B1120] border-brand-coral/30 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-brand-coral/60 hover:shadow-[0_0_30px_rgba(251,113,133,0.3)] hover:-translate-y-1 transition-all duration-500 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Marketing Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-brand-coral" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {loadingAnalytics ? "--" : (analytics?.marketing_score.score ?? 0)}/100
              </div>
              <p className="text-xs text-brand-purple mt-1">View full analytics</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Actions Banners - Elevated Ultra-Premium UI */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-brand-coral text-white shadow-md shadow-purple-500/25">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-extrabold tracking-tight text-white">
                Quick Actions
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30">
                AI Studios
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">High-impact creative engines to generate posts, reels, avatars &amp; ads in seconds</p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            4 Active Studios Ready
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* 1. Create Post Banner */}
          <div
            className="relative flex flex-col justify-between h-[205px] sm:h-[215px] rounded-2xl overflow-hidden p-5 border border-purple-500/25 bg-[#0C0E1A]/80 hover:border-purple-400/80 hover:shadow-[0_16px_40px_rgba(168,85,247,0.3)] group transition-all duration-300 hover:-translate-y-1.5 backdrop-blur-xl shadow-lg cursor-pointer select-none"
          >
            {/* Top Luminous Neon Beam */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

            {/* Background Vector Artwork */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/vectors/banner-create-post.svg"
                alt="Create Post Vector"
                fill
                className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] via-[#080B14]/40 via-45% to-transparent transition-opacity duration-300" />
            </div>

            {/* Top Bar: Pill & Action Disc */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase backdrop-blur-md bg-purple-500/20 text-purple-200 border border-purple-400/30 shadow-xs">
                <ImageIcon className="w-3.5 h-3.5 text-purple-300" />
                <span>Post Studio</span>
              </span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md bg-white/10 border border-white/20 text-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-purple-600 group-hover:border-purple-400/60">
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-semibold text-purple-300/90 tracking-wide uppercase">✦ 1-Click Studio</span>
              </div>
              <h3 className="text-xl sm:text-[22px] font-extrabold text-white tracking-tight leading-tight group-hover:text-purple-200 transition-colors">
                Create Post
              </h3>
              <p className="text-xs text-slate-300 font-medium mt-1 line-clamp-1 leading-snug">
                Festive &amp; product creatives in 1 click
              </p>
            </div>
          </div>

          {/* 2. Create Reel Banner */}
          <div
            className="relative flex flex-col justify-between h-[205px] sm:h-[215px] rounded-2xl overflow-hidden p-5 border border-pink-500/25 bg-[#0C0E1A]/80 hover:border-pink-400/80 hover:shadow-[0_16px_40px_rgba(244,63,94,0.3)] group transition-all duration-300 hover:-translate-y-1.5 backdrop-blur-xl shadow-lg cursor-pointer select-none"
          >
            {/* Top Luminous Neon Beam */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

            {/* Background Vector Artwork */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/vectors/banner-create-reel.svg"
                alt="Create Reel Vector"
                fill
                className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] via-[#080B14]/40 via-45% to-transparent transition-opacity duration-300" />
            </div>

            {/* Top Bar: Pill & Action Disc */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase backdrop-blur-md bg-pink-500/20 text-pink-200 border border-pink-400/30 shadow-xs">
                <Video className="w-3.5 h-3.5 text-pink-300" />
                <span>9:16 Video</span>
              </span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md bg-white/10 border border-white/20 text-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-pink-600 group-hover:border-pink-400/60">
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-semibold text-pink-300/90 tracking-wide uppercase">⚡ Viral Audio &amp; Hooks</span>
              </div>
              <h3 className="text-xl sm:text-[22px] font-extrabold text-white tracking-tight leading-tight group-hover:text-pink-200 transition-colors">
                Create Reel
              </h3>
              <p className="text-xs text-slate-300 font-medium mt-1 line-clamp-1 leading-snug">
                Trending audio, hooks &amp; AI captions
              </p>
            </div>
          </div>

          {/* 3. AI Avatar Banner */}
          <div
            className="relative flex flex-col justify-between h-[205px] sm:h-[215px] rounded-2xl overflow-hidden p-5 border border-amber-500/25 bg-[#0C0E1A]/80 hover:border-amber-400/80 hover:shadow-[0_16px_40px_rgba(245,158,11,0.3)] group transition-all duration-300 hover:-translate-y-1.5 backdrop-blur-xl shadow-lg cursor-pointer select-none"
          >
            {/* Top Luminous Neon Beam */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

            {/* Background Vector Artwork */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/vectors/banner-ai-avatar.svg"
                alt="AI Avatar Vector"
                fill
                className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] via-[#080B14]/40 via-45% to-transparent transition-opacity duration-300" />
            </div>

            {/* Top Bar: Pill & Action Disc */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase backdrop-blur-md bg-amber-500/20 text-amber-200 border border-amber-400/30 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Virtual Actor</span>
              </span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md bg-white/10 border border-white/20 text-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-600 group-hover:border-amber-400/60">
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-semibold text-amber-300/90 tracking-wide uppercase">👑 Indian Presenters</span>
              </div>
              <h3 className="text-xl sm:text-[22px] font-extrabold text-white tracking-tight leading-tight group-hover:text-amber-200 transition-colors">
                AI Avatar
              </h3>
              <p className="text-xs text-slate-300 font-medium mt-1 line-clamp-1 leading-snug">
                Realistic Indian presenters &amp; models
              </p>
            </div>
          </div>

          {/* 4. Create Ad Banner */}
          <div
            className="relative flex flex-col justify-between h-[205px] sm:h-[215px] rounded-2xl overflow-hidden p-5 border border-cyan-500/25 bg-[#0C0E1A]/80 hover:border-cyan-400/80 hover:shadow-[0_16px_40px_rgba(6,182,212,0.3)] group transition-all duration-300 hover:-translate-y-1.5 backdrop-blur-xl shadow-lg cursor-pointer select-none"
          >
            {/* Top Luminous Neon Beam */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

            {/* Background Vector Artwork */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/vectors/banner-create-ad.svg"
                alt="Create Ad Vector"
                fill
                className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] via-[#080B14]/40 via-45% to-transparent transition-opacity duration-300" />
            </div>

            {/* Top Bar: Pill & Action Disc */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase backdrop-blur-md bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 shadow-xs">
                <Megaphone className="w-3.5 h-3.5 text-cyan-300" />
                <span>High ROAS</span>
              </span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md bg-white/10 border border-white/20 text-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-cyan-600 group-hover:border-cyan-400/60">
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-semibold text-cyan-300/90 tracking-wide uppercase">📈 Meta &amp; WA Creatives</span>
              </div>
              <h3 className="text-xl sm:text-[22px] font-extrabold text-white tracking-tight leading-tight group-hover:text-cyan-200 transition-colors">
                Create Ad
              </h3>
              <p className="text-xs text-slate-300 font-medium mt-1 line-clamp-1 leading-snug">
                Targeted Meta &amp; WhatsApp creatives
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Marketing */}
      <TodaysMarketing />

      {/* Bottom Section: Recent Activity & AI Insights */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        <div className="col-span-1 lg:col-span-4 min-w-0">
          <RecentActivityList />
        </div>

        <Card className="col-span-1 lg:col-span-3 min-w-0 bg-gradient-to-bl from-[#2B1B2A]/50 to-[#0B1120] border-brand-pink/20 backdrop-blur-xl rounded-2xl hover:border-brand-pink/40 hover:shadow-[0_0_30px_rgba(236,72,153,0.1)] transition-all duration-500 relative overflow-hidden flex flex-col">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-white text-lg sm:text-xl">AI Insights</CardTitle>
            <CardDescription className="text-text-muted text-xs sm:text-sm">
              Personalised recommendations based on your activity.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-4 sm:p-6 pt-0 sm:pt-0">
            {loadingAnalytics ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-28 bg-white/5 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <AIInsights insights={insights} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}