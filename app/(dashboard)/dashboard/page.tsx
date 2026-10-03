"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles, Megaphone,
  Image as ImageIcon, Video, Camera, TrendingUp
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { analyticsService } from "@/services/analytics.service";
import { AnalyticsData } from "@/types/analytics";
import { AIInsights } from "@/components/ai/AIInsights";
import { Insight } from "@/types/insights";
import { TodaysMarketing } from "@/components/dashboard/TodaysMarketing";

export default function DashboardPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  useEffect(() => {
    analyticsService.getAnalyticsOverview(7)
      .then(setAnalytics)
      .catch((e) => console.error("Failed to load analytics", e))
      .finally(() => setLoadingAnalytics(false));
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {greeting}, {user?.name || "there"}!
        </h1>
        <p className="text-text-muted mt-2">Here is your AI marketing summary for the last 7 days.</p>
      </div>

      {/* Live Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-brand-purple/10 border-brand-purple/20">
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

        <Card className="bg-brand-pink/10 border-brand-pink/20">
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

        <Card className="bg-surface hover:border-brand-purple/50 transition-colors border-border">
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
          <Card className="h-full bg-surface hover:border-brand-pink/50 transition-colors">
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

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-white">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button variant="outline" className="h-24 flex flex-col gap-2 relative overflow-hidden group hover:border-brand-purple hover:bg-brand-purple/10" asChild>
            <Link href="/content?type=post">
              <ImageIcon className="h-6 w-6 text-brand-purple" />
              <span className="font-semibold text-white">Create Post</span>
            </Link>
          </Button>

          <Button variant="outline" className="h-24 flex flex-col gap-2 relative overflow-hidden group hover:border-brand-pink hover:bg-brand-pink/10" asChild>
            <Link href="/create/reel">
              <Video className="h-6 w-6 text-brand-pink" />
              <span className="font-semibold text-white">Create Reel</span>
            </Link>
          </Button>

          <Button variant="outline" className="h-24 flex flex-col gap-2 relative overflow-hidden group hover:border-brand-coral hover:bg-brand-coral/10" asChild>
            <Link href="/ai-photoshoot">
              <Camera className="h-6 w-6 text-brand-coral" />
              <span className="font-semibold text-white">AI Photoshoot</span>
            </Link>
          </Button>

          <Button variant="outline" className="h-24 flex flex-col gap-2 relative overflow-hidden group hover:border-white/50 hover:bg-white/5" asChild>
            <Link href="/create-ad">
              <Megaphone className="h-6 w-6 text-white" />
              <span className="font-semibold text-white">Create Ad</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Today's Marketing */}
      <TodaysMarketing />

      {/* Bottom Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-white">Recent Campaigns</CardTitle>
            <CardDescription className="text-text-muted">
              Your active marketing campaigns performance this week.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[300px] text-text-muted bg-surface-secondary rounded-lg mx-6 mb-6 border border-dashed border-border">
            <Sparkles className="h-10 w-10 text-text-muted mb-4" />
            <p>No active campaigns right now.</p>
            <Button variant="link" className="text-brand-pink mt-2" asChild>
              <Link href="/campaigns">Start a campaign</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-white">AI Insights</CardTitle>
            <CardDescription className="text-text-muted">
              Personalised recommendations based on your activity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingAnalytics ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
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