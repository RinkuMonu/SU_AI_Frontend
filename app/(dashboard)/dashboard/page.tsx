"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Sparkles,
  Image as ImageIcon,
  Video,
  Camera,
  TrendingUp,
  Wand2,
  ArrowRight,
  Zap,
  FileText,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { analyticsService } from "@/services/analytics.service";
import { creditService } from "@/services/credit.service";
import { businessService } from "@/services/business.service";
import { AnalyticsData } from "@/types/analytics";
import { CreditBalance } from "@/types/credits";
import { AIInsights } from "@/components/ai/AIInsights";
import { Insight } from "@/types/insights";
import { TodaysMarketing } from "@/components/dashboard/TodaysMarketing";
import { RecentActivityList } from "@/components/dashboard/RecentActivityList";
import { BillingReportModal } from "@/components/dashboard/BillingReportModal";

export default function DashboardPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [creditBalance, setCreditBalance] = useState<CreditBalance | null>(null);
  const [businessProfile, setBusinessProfile] = useState<any>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    analyticsService.getAnalyticsOverview(7)
      .then(setAnalytics)
      .catch((e) => console.error("Failed to load analytics", e))
      .finally(() => setLoadingAnalytics(false));

    creditService.getCredits()
      .then(setCreditBalance)
      .catch(() => null);

    businessService.getMyBusiness()
      .then((biz) => {
        if (biz) setBusinessProfile(biz);
      })
      .catch(() => null);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("payment") === "success" || params.get("order_id")) {
        const orderId = params.get("order_id");
        setPaymentSuccessMsg(
          orderId
            ? `Your payment for order ${orderId} has been verified and plan activated!`
            : "Your payment has been verified successfully! Your active plan and AI credits have been updated."
        );
      }
    }
  }, []);

  const insights: Insight[] = [
    {
      _id: "rec-1",
      title: "AI Recommendation",
      description: analytics?.recommendation?.text || "Lorem ipsum dolor sit amet consectetur adipiscing elit do eiusmod tempor incididunt.",
      priority: "High",
      recommendedAction: "Take action now to improve your marketing score.",
      actionType: "Create Reel",
      actionTarget: "reel",
    },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  // Stat values with intelligent fallback to reference designs
  const postsCount = analytics?.content.posts ?? 0;
  const reelsCount = analytics?.content.reels ?? 0;
  const aiGensCount = analytics?.ai_usage.total_generations ?? 0;
  const marketingScore = analytics?.marketing_score.score ?? 60;

  return (
    <div className="relative space-y-8 animate-in fade-in duration-500 overflow-x-hidden max-w-full">
      {/* Subtle Background Glows contained inside overflow-hidden to prevent scrollbars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#7d36fa]/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-24 w-[28rem] h-[28rem] bg-[#be32ff]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-[#f0449b]/10 rounded-full blur-[140px]" />
      </div>

      {paymentSuccessMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-2xl flex items-center justify-between shadow-lg animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">Payment Successful!</p>
              <p className="text-xs text-emerald-300/90">{paymentSuccessMsg}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/subscription?tab=transactions"
              className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Transaction Report</span>
            </Link>
            <button
              onClick={() => setPaymentSuccessMsg(null)}
              className="text-gray-400 hover:text-white text-xs px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Top Welcome Header with Gradient Name & Billing / Credits Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-white">
            {greeting},{" "}
            <span className="bg-gradient-to-r from-[#7d36fa] via-[#be32ff] via-[#f0449b] to-[#fc9a5d] bg-clip-text text-transparent font-normal">
              {(
              (user?.name && !user.name.startsWith("User ") && user.name.trim() !== "User" && user.name.trim()) ||
              (user?.fullName && !user.fullName.startsWith("User ") && user.fullName.trim() !== "User" && user.fullName.trim()) ||
              businessProfile?.name ||
              businessProfile?.business_name ||
              businessProfile?.businessName ||
              user?.business_name ||
              user?.businessName ||
              (typeof window !== "undefined" && (localStorage.getItem("business_name") || localStorage.getItem("onboarding_business_name"))) ||
              user?.name ||
              user?.fullName ||
              "Member"
            )}
            </span>
            !
          </h1>
          <p className="text-slate-400 mt-1 text-xs sm:text-sm">
            Here is your AI marketing summary for the last 7 days.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <Button
            onClick={() => setShowReportModal(true)}
            variant="outline"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white text-xs font-semibold shadow-md backdrop-blur-xl transition-all cursor-pointer hover:border-purple-500/30"
            title="View & Download Billing & Payment Report"
          >
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <span>Billing report</span>
          </Button>

          <Link
            href="/subscription"
            className="inline-flex items-center gap-3 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 shadow-md backdrop-blur-xl transition-all group cursor-pointer hover:border-purple-500/30"
            title="View Plan Details & Upgrade"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400">Plan -</span>
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 uppercase">
                {creditBalance?.plan === "PRO" ? "GROWTH" : creditBalance?.plan === "BASIC" ? "STARTER" : (creditBalance?.plan || "GROWTH")}
              </span>
            </div>
            <div className="h-3.5 w-px bg-white/20" />
            <div className="flex items-center gap-1 text-xs text-[#be32ff] font-bold">
              <Zap className="w-3.5 h-3.5 fill-[#be32ff]" />
              <span>{creditBalance ? creditBalance.credits_remaining : 1331} Credits</span>
            </div>
          </Link>
        </div>
      </div>

      {/* 4 Stats Cards matching Reference Image 1, 2 (2F1262 & 071023) & 3 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Post Created */}
        <div className="relative rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-[#1d103a]/90 via-[#100c24]/95 to-[#071023] border border-[#2F1262]/60 hover:border-[#b18cf8]/50 hover:shadow-[0_8px_25px_rgba(47,18,98,0.35)] hover:-translate-y-1 transition-all duration-300 group shadow-sm">
          <div className="flex items-start justify-between">
            <span className="text-3xl sm:text-4xl font-bold text-[#b18cf8] tracking-tight">
              {postsCount}
            </span>
            <ImageIcon className="w-5 h-5 text-[#b18cf8] mt-0.5 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-sm sm:text-base font-medium text-white mt-3 leading-tight">Post Created</h3>
          <p className="text-xs text-slate-400 mt-1">In the last 7 days</p>
        </div>

        {/* 2. Reel Created */}
        <div className="relative rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-[#1d103a]/90 via-[#100c24]/95 to-[#071023] border border-[#2F1262]/60 hover:border-[#b18cf8]/50 hover:shadow-[0_8px_25px_rgba(47,18,98,0.35)] hover:-translate-y-1 transition-all duration-300 group shadow-sm">
          <div className="flex items-start justify-between">
            <span className="text-3xl sm:text-4xl font-bold text-[#b18cf8] tracking-tight">
              {reelsCount}
            </span>
            <svg className="w-5 h-5 text-[#b18cf8] mt-0.5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="m15.5 10-3 2v-1.5a.5.5 0 0 0-.5-.5h-3.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5H12a.5.5 0 0 0 .5-.5V12l3 2v-4z" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <h3 className="text-sm sm:text-base font-medium text-white mt-3 leading-tight">Reel Created</h3>
          <p className="text-xs text-slate-400 mt-1">In the last 7 days</p>
        </div>

        {/* 3. AI Generations */}
        <div className="relative rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-[#1d103a]/90 via-[#100c24]/95 to-[#071023] border border-[#2F1262]/60 hover:border-[#b18cf8]/50 hover:shadow-[0_8px_25px_rgba(47,18,98,0.35)] hover:-translate-y-1 transition-all duration-300 group shadow-sm">
          <div className="flex items-start justify-between">
            <span className="text-3xl sm:text-4xl font-bold text-[#b18cf8] tracking-tight">
              {aiGensCount}
            </span>
            <Wand2 className="w-5 h-5 text-[#b18cf8] mt-0.5 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-sm sm:text-base font-medium text-white mt-3 leading-tight">AI Generations</h3>
          <p className="text-xs text-slate-400 mt-1">Total AI uses this week</p>
        </div>

        {/* 4. Marketing Score */}
        <Link href="/analytics" className="block group">
          <div className="relative rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-[#1d103a]/90 via-[#100c24]/95 to-[#071023] border border-[#2F1262]/60 hover:border-[#b18cf8]/50 hover:shadow-[0_8px_25px_rgba(47,18,98,0.35)] hover:-translate-y-1 transition-all duration-300 h-full shadow-sm">
            <div className="flex items-start justify-between">
              <span className="text-3xl sm:text-4xl font-bold text-[#b18cf8] tracking-tight">
                {marketingScore}/100
              </span>
              <TrendingUp className="w-5 h-5 text-[#b18cf8] mt-0.5 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-sm sm:text-base font-medium text-white mt-3 leading-tight">Marketing Score</h3>
            <p className="text-xs text-slate-400 mt-1 group-hover:text-purple-300 transition-colors">
              View full analytics
            </p>
          </div>
        </Link>
      </div>

      {/* Quick Actions with User Attached Images matching Reference Image 2 */}
      <div className="space-y-3.5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-white">
            Quick Actions
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-1">
            High-impact creative engines to generate posts, reels and avatars in seconds
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Post Created (Full-box image with text overlay at bottom) */}
          <Link href="/ai-post" className="block group">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0c1020] aspect-[16/10.5] sm:aspect-[16/10] hover:border-purple-500/50 hover:shadow-[0_14px_35px_rgba(190,50,255,0.25)] transition-all duration-300 hover:-translate-y-1">
              <Image
                src="/images/dashboard/quick-action-post.jpg"
                alt="Post Created"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 pt-12 sm:pt-16 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 flex flex-col justify-end">
                <h3 className="text-lg sm:text-xl font-normal text-white group-hover:text-purple-300 transition-colors leading-snug">
                  Post Created
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5 leading-normal">
                  Festive &amp; product creatives in 1 click
                </p>
              </div>
            </div>
          </Link>

          {/* Card 2: Reel Created (Full-box image with text overlay at bottom) */}
          <Link href="/create/reel" className="block group">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0c1020] aspect-[16/10.5] sm:aspect-[16/10] hover:border-purple-500/50 hover:shadow-[0_14px_35px_rgba(190,50,255,0.25)] transition-all duration-300 hover:-translate-y-1">
              <Image
                src="/images/dashboard/quick-action-reel.jpg"
                alt="Reel Created"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 pt-12 sm:pt-16 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 flex flex-col justify-end">
                <h3 className="text-lg sm:text-xl font-normal text-white group-hover:text-purple-300 transition-colors leading-snug">
                  Reel Created
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5 leading-normal">
                  Trending audio, hooks &amp; AI captions
                </p>
              </div>
            </div>
          </Link>

          {/* Card 3: AI Avatar (Full-box image with text overlay at bottom - Scaled larger) */}
          <Link href="/fashion-ai/photoshoot" className="block group">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0c1020] aspect-[16/10.5] sm:aspect-[16/10] hover:border-purple-500/50 hover:shadow-[0_14px_35px_rgba(190,50,255,0.25)] transition-all duration-300 hover:-translate-y-1">
              <Image
                src="/images/dashboard/quick-action-avatar.jpg"
                alt="AI Avatar"
                fill
                className="object-cover object-[center_top] scale-110 group-hover:scale-115 transition-transform duration-500"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 pt-12 sm:pt-16 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 flex flex-col justify-end">
                <h3 className="text-lg sm:text-xl font-normal text-white group-hover:text-purple-300 transition-colors leading-snug">
                  AI Avatar
                </h3>
                <p className="text-xs sm:text-sm text-pink-200/90 mt-0.5 leading-normal">
                  Realistic Indian presenters &amp; models
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Today's Marketing Section */}
      <TodaysMarketing />

      {/* Bottom Section: Recent Activity & AI Insights */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        <div className="col-span-1 lg:col-span-4 min-w-0">
          <RecentActivityList />
        </div>

        <div className="col-span-1 lg:col-span-3 min-w-0">
          <Card className="h-full bg-gradient-to-br from-[#12162e]/90 via-[#0c1020]/95 to-[#080d1e] border-white/10 backdrop-blur-xl rounded-2xl hover:border-purple-500/40 hover:shadow-[0_10px_30px_rgba(190,50,255,0.15)] transition-all duration-500 relative overflow-hidden flex flex-col shadow-sm">
            <CardHeader className="p-4 sm:p-6 pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-white text-xl sm:text-2xl font-normal tracking-tight">
                  AI Insights
                </CardTitle>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/15 text-[#be32ff] border border-purple-500/30">
                  High Priority
                </span>
              </div>
              <CardDescription className="text-slate-400 text-xs sm:text-sm mt-1">
                Personalised recommendations based on your activity.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-4 sm:p-6 pt-0">
              <AIInsights insights={insights} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Billing Report Modal */}
      {showReportModal && (
        <BillingReportModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
}
