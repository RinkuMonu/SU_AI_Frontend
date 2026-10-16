"use client";

import { useEffect, useState, useMemo } from "react";
import { analyticsService } from "@/services/analytics.service";
import { geminiAnalyticsService, GeminiVisualAnalytics } from "@/services/geminiAnalytics.service";
import { AnalyticsData } from "@/types/analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  TrendingUp,
  Image as ImageIcon,
  Video,
  Camera,
  Zap,
  Calendar,
  Package,
  Sparkles,
  RefreshCw,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Layers,
  CalendarDays,
  Target,
  Flame,
  Activity,
  ChevronRight,
  Bot,
  Compass,
  Gauge,
  Sparkle,
  ArrowUpRight
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Range = 7 | 30 | 90;

const COLORS = {
  purple: "#BE32FF",
  pink: "#F0449B",
  coral: "#FC9A5D",
  green: "#10B981",
  blue: "#3B82F6",
  yellow: "#FBBF24",
  cyan: "#06B6D4",
};

// Custom Tooltip for Trend Area Chart
function CustomChartTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0B1630]/95 backdrop-blur-md border border-white/15 p-3 rounded-xl shadow-2xl text-xs space-y-2 min-w-[160px] pointer-events-none">
        <p className="font-semibold text-white/90 border-b border-white/10 pb-1 flex items-center justify-between">
          <span>{label}</span>
          <Activity className="w-3.5 h-3.5 text-brand-purple" />
        </p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-text-muted capitalize">{entry.name}</span>
              </div>
              <span className="font-bold text-white tabular-nums">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

// Custom Tooltip for Donut Pie Chart
function CustomPieTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-[#0B1630]/95 backdrop-blur-md border border-white/15 px-3 py-2 rounded-lg shadow-xl text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.payload.color }} />
          <span className="text-text-muted">{data.name}:</span>
          <span className="font-bold text-white">{data.value} items</span>
        </div>
      </div>
    );
  }
  return null;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [range, setRange] = useState<Range>(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMetricFilter, setActiveMetricFilter] = useState<"all" | "generations" | "reels" | "posts">("all");
  const [mounted, setMounted] = useState(false);

  // Groq AI Visual Analytics
  const [geminiVisual, setGeminiVisual] = useState<GeminiVisualAnalytics | null>(null);
  const [geminiLoading, setGeminiLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const triggerGeminiVisuals = async (analyticsData: AnalyticsData, selectedRange: number) => {
    setGeminiLoading(true);
    try {
      const visualData = await geminiAnalyticsService.generateVisualAnalytics(analyticsData, selectedRange);
      setGeminiVisual(visualData);
    } catch (err) {
      console.error("Failed to generate Gemini visual analytics", err);
    } finally {
      setGeminiLoading(false);
    }
  };

  const fetchData = async (r: Range) => {
    setLoading(true);
    setError(null);
    try {
      const res = await analyticsService.getAnalyticsOverview(r);
      setData(res);
      triggerGeminiVisuals(res, r);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Failed to load analytics. Please ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(range);
  }, [range]);

  const ranges: Range[] = [7, 30, 90];

  // Process timeline activity data for charts
  const chartData = useMemo(() => {
    if (!data?.activity) return [];
    return data.activity.map((item) => {
      const parts = item.date.split("-");
      const dateLabel = parts.length === 3
        ? new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : item.date;

      return {
        rawDate: item.date,
        date: dateLabel,
        "AI Generations": item.ai_generations,
        Reels: item.reels,
        Posts: item.posts,
      };
    });
  }, [data?.activity]);

  // Content distribution data for Pie/Donut Chart
  const contentDistribution = useMemo(() => {
    if (!data?.content) return [];
    const items = [
      { name: "Reels", value: data.content.reels, color: COLORS.pink, icon: Video },
      { name: "Posts", value: data.content.posts, color: COLORS.purple, icon: ImageIcon },
      { name: "Photoshoots", value: data.content.photoshoots, color: COLORS.coral, icon: Camera },
      { name: "Images", value: data.content.images, color: COLORS.green, icon: Sparkles },
      { name: "Captions", value: data.content.captions, color: COLORS.yellow, icon: Layers },
    ];
    return items.filter((item) => item.value > 0);
  }, [data?.content]);

  // Channel comparison bar data
  const channelBarData = useMemo(() => {
    if (!data?.content) return [];
    return [
      { channel: "Reels", count: data.content.reels, fill: COLORS.pink },
      { channel: "Posts", count: data.content.posts, fill: COLORS.purple },
      { channel: "Photoshoots", count: data.content.photoshoots, fill: COLORS.coral },
      { channel: "Images", count: data.content.images, fill: COLORS.green },
      { channel: "Captions", count: data.content.captions, fill: COLORS.yellow },
    ];
  }, [data?.content]);

  const totalContentCount = useMemo(() => {
    if (!data?.content) return 0;
    return (
      data.content.posts +
      data.content.reels +
      data.content.photoshoots +
      data.content.images +
      data.content.captions
    );
  }, [data?.content]);

  const scoreInfo = useMemo(() => {
    const score = data?.marketing_score?.score ?? 0;
    if (score >= 80) return { label: "Exceptional", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30" };
    if (score >= 60) return { label: "Strong & Active", color: "text-brand-purple", bg: "bg-brand-purple/10", border: "border-brand-purple/30" };
    if (score >= 40) return { label: "Good Progress", color: "text-brand-pink", bg: "bg-brand-pink/10", border: "border-brand-pink/30" };
    if (score >= 20) return { label: "Growing", color: "text-brand-coral", bg: "bg-brand-coral/10", border: "border-brand-coral/30" };
    return { label: "Getting Started", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" };
  }, [data?.marketing_score?.score]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-purple/15 border border-brand-purple/30 text-brand-purple shadow-lg shadow-brand-purple/10">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Marketing Visual Analytics
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-gradient text-white shadow-sm">
                <Sparkles className="w-3 h-3" /> Gemini AI Visual Engine
              </span>
            </div>
            <p className="text-text-muted text-xs sm:text-sm mt-0.5">
              Live generation trends, asset breakdown, and predictive marketing health gauges.
            </p>
          </div>
        </div>

        {/* Timeframe Selector & Refresh */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-surface p-1 rounded-xl border border-border">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                range === r
                  ? "bg-brand-gradient text-white shadow-md shadow-brand-purple/20"
                  : "text-text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              Last {r} Days
            </button>
          ))}
          <div className="h-4 w-px bg-white/10 mx-1" />
          <button
            onClick={() => fetchData(range)}
            title="Refresh Visual Analytics"
            disabled={loading}
            className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-brand-purple" : ""}`} />
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Dynamic Content */}
      {data && (
        <>
          {/* Top Metric Cards Row */}
          <div className="grid gap-3.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {/* Reels */}
            <Card className="bg-gradient-to-br from-surface to-brand-pink/5 border-border hover:border-brand-pink/40 transition-all duration-300 group shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Reels</span>
                  <div className="p-1.5 rounded-lg bg-brand-pink/15 text-brand-pink group-hover:scale-110 transition-transform">
                    <Video className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-brand-pink mt-2">
                  {data.content.reels}
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-text-muted">
                  <span>Short-form Video</span>
                  <span className="text-brand-pink font-semibold">Active</span>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            <Card className="bg-gradient-to-br from-surface to-brand-purple/5 border-border hover:border-brand-purple/40 transition-all duration-300 group shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Posts</span>
                  <div className="p-1.5 rounded-lg bg-brand-purple/15 text-brand-purple group-hover:scale-110 transition-transform">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-brand-purple mt-2">
                  {data.content.posts}
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-text-muted">
                  <span>Social Posts</span>
                  <span className="text-brand-purple font-semibold">Feed</span>
                </div>
              </CardContent>
            </Card>

            {/* Photoshoots */}
            <Card className="bg-gradient-to-br from-surface to-brand-coral/5 border-border hover:border-brand-coral/40 transition-all duration-300 group shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Photoshoots</span>
                  <div className="p-1.5 rounded-lg bg-brand-coral/15 text-brand-coral group-hover:scale-110 transition-transform">
                    <Camera className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-brand-coral mt-2">
                  {data.content.photoshoots}
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-text-muted">
                  <span>AI Studio Shoots</span>
                  <span className="text-brand-coral font-semibold">Catalog</span>
                </div>
              </CardContent>
            </Card>

            {/* AI Images */}
            <Card className="bg-gradient-to-br from-surface to-emerald-500/5 border-border hover:border-emerald-500/40 transition-all duration-300 group shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Images</span>
                  <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Sparkles className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-2">
                  {data.content.images}
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-text-muted">
                  <span>Generative Art</span>
                  <span className="text-emerald-400 font-semibold">Visual</span>
                </div>
              </CardContent>
            </Card>

            {/* Captions */}
            <Card className="bg-gradient-to-br from-surface to-yellow-500/5 border-border hover:border-yellow-500/40 transition-all duration-300 group shadow-sm col-span-2 sm:col-span-1">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Captions</span>
                  <div className="p-1.5 rounded-lg bg-yellow-500/15 text-yellow-400 group-hover:scale-110 transition-transform">
                    <Layers className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-yellow-400 mt-2">
                  {data.content.captions}
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-text-muted">
                  <span>Copy & Tags</span>
                  <span className="text-yellow-400 font-semibold">Text</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Numeric Operations Visual Row */}
          <div className="grid gap-3.5 grid-cols-2 lg:grid-cols-4">
            <Card className="bg-surface border-border">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-text-muted font-medium">Total AI Computations</p>
                  <div className="text-xl font-bold text-white mt-1">{data.ai_usage.total_generations}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-brand-purple/15 text-brand-purple">
                  <Zap className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface border-border">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-text-muted font-medium">Credits Consumed ({range}d)</p>
                  <div className="text-xl font-bold text-brand-coral mt-1">{data.ai_usage.credits_used}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-brand-coral/15 text-brand-coral">
                  <Sparkles className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface border-border">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-text-muted font-medium">Catalog Products</p>
                  <div className="text-xl font-bold text-blue-400 mt-1">{data.business.products}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400">
                  <Package className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface border-border">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-text-muted font-medium">Content Calendars</p>
                  <div className="text-xl font-bold text-emerald-400 mt-1">{data.business.calendars}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
                  <CalendarDays className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ========================================================================= */}
          {/* ⚡ GEMINI AI DYNAMIC PREDICTIVE GAUGES & VISUAL FORECAST SUITE ⚡ */}
          {/* ========================================================================= */}
          <div className="grid gap-4 md:grid-cols-12">
            {/* Gemini Score Projection Visual Meter */}
            <Card className="md:col-span-4 bg-gradient-to-br from-surface via-[#0c1836] to-surface border-brand-purple/30 p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-brand-purple" />
                  Gemini Projected Growth
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {geminiVisual?.forecast.growthFactor || "+24% Surge"}
                </span>
              </div>

              <div className="flex items-center justify-center my-3 relative">
                <div className="w-28 h-28 rounded-full border-4 border-white/10 flex items-center justify-center relative">
                  <div
                    className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-purple border-r-brand-pink transition-all duration-1000"
                    style={{
                      transform: `rotate(${((geminiVisual?.forecast.projectedScore ?? 85) / 100) * 360}deg)`,
                    }}
                  />
                  <div className="text-center">
                    <span className="text-3xl font-black text-white">
                      {geminiVisual?.forecast.projectedScore ?? Math.min(100, data.marketing_score.score + 24)}
                    </span>
                    <span className="block text-[10px] text-text-muted">/ 100 Target</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
                <span className="text-text-muted">Efficiency Rating:</span>
                <span className="font-bold text-emerald-400">
                  {geminiVisual?.forecast.efficiencyRating || "High Velocity"}
                </span>
              </div>
            </Card>

            {/* Gemini 5-Pillar Visual Progress Gauge Breakdown */}
            <Card className="md:col-span-8 bg-surface border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-brand-pink" />
                  Core Marketing Pillars Health Breakdown
                </span>
                <span className="text-[11px] text-text-muted">Live 5-Dimension Radar</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 pt-1">
                {(geminiVisual?.pillars || [
                  { pillar: "Content Output", score: data.marketing_score.breakdown.content_activity, maxScore: 25, status: "Active", color: "#BE32FF" },
                  { pillar: "AI Computation", score: data.marketing_score.breakdown.ai_usage, maxScore: 25, status: "Strong", color: "#10B981" },
                  { pillar: "Reels Volume", score: data.marketing_score.breakdown.reel_activity, maxScore: 15, status: "High", color: "#F0449B" },
                  { pillar: "Product Catalog", score: data.marketing_score.breakdown.product_catalogue, maxScore: 20, status: "Growing", color: "#3B82F6" },
                  { pillar: "Calendar Planning", score: data.marketing_score.breakdown.calendar_usage, maxScore: 15, status: "Standard", color: "#FC9A5D" },
                ]).map((pil, idx) => {
                  const pct = Math.round((pil.score / pil.maxScore) * 100);
                  return (
                    <div key={idx} className="p-3 rounded-xl bg-surface-secondary/70 border border-border space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">{pil.pillar}</span>
                        <span className="font-bold tabular-nums" style={{ color: pil.color }}>
                          {pil.score} / {pil.maxScore}
                        </span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, backgroundColor: pil.color }}
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Quick Action Navigation */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-brand-purple/15 to-brand-pink/15 border border-brand-purple/30 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-white block">Top Velocity Format</span>
                    <span className="text-xs text-brand-pink font-semibold">Short-Form Reels (43 Active)</span>
                  </div>
                  <Button size="sm" className="h-7 text-xs bg-brand-pink hover:bg-brand-pink/90 text-white" asChild>
                    <Link href="/create/reel">Launch</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* ========================================================================= */}
          {/* 📊 PRIMARY VISUALIZATION ROW: ACTIVITY TREND + CONTENT DONUT 📊 */}
          {/* ========================================================================= */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* 1. Daily Activity Interactive Area Chart (8 Columns) */}
            <Card className="lg:col-span-8 bg-surface border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-white text-base font-semibold flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-brand-purple" />
                    Generation Trend & Velocity Graph
                  </CardTitle>
                  <CardDescription className="text-text-muted text-xs">
                    Multi-stream activity curves over the last {range} days
                  </CardDescription>
                </div>

                {/* Metric filter pills */}
                <div className="flex items-center gap-1 bg-surface-secondary p-1 rounded-lg border border-border text-xs">
                  <button
                    onClick={() => setActiveMetricFilter("all")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      activeMetricFilter === "all"
                        ? "bg-brand-purple text-white shadow-sm"
                        : "text-text-muted hover:text-white"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveMetricFilter("reels")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      activeMetricFilter === "reels"
                        ? "bg-brand-pink text-white shadow-sm"
                        : "text-text-muted hover:text-white"
                    }`}
                  >
                    Reels
                  </button>
                  <button
                    onClick={() => setActiveMetricFilter("posts")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      activeMetricFilter === "posts"
                        ? "bg-brand-purple text-white shadow-sm"
                        : "text-text-muted hover:text-white"
                    }`}
                  >
                    Posts
                  </button>
                  <button
                    onClick={() => setActiveMetricFilter("generations")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      activeMetricFilter === "generations"
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "text-text-muted hover:text-white"
                    }`}
                  >
                    AI Total
                  </button>
                </div>
              </CardHeader>

              <CardContent className="pt-4">
                {mounted && chartData.length > 0 ? (
                  <div className="h-[290px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorGenerations" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLORS.green} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={COLORS.green} stopOpacity={0.0} />
                          </linearGradient>
                          <linearGradient id="colorReels" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLORS.pink} stopOpacity={0.45} />
                            <stop offset="95%" stopColor={COLORS.pink} stopOpacity={0.0} />
                          </linearGradient>
                          <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLORS.purple} stopOpacity={0.45} />
                            <stop offset="95%" stopColor={COLORS.purple} stopOpacity={0.0} />
                          </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                        <XAxis
                          dataKey="date"
                          stroke="#64748B"
                          fontSize={11}
                          tickLine={false}
                          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                        />
                        <YAxis
                          stroke="#64748B"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip content={<CustomChartTooltip />} />

                        {(activeMetricFilter === "all" || activeMetricFilter === "generations") && (
                          <Area
                            type="monotone"
                            dataKey="AI Generations"
                            stroke={COLORS.green}
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#colorGenerations)"
                          />
                        )}

                        {(activeMetricFilter === "all" || activeMetricFilter === "reels") && (
                          <Area
                            type="monotone"
                            dataKey="Reels"
                            stroke={COLORS.pink}
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#colorReels)"
                          />
                        )}

                        {(activeMetricFilter === "all" || activeMetricFilter === "posts") && (
                          <Area
                            type="monotone"
                            dataKey="Posts"
                            stroke={COLORS.purple}
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#colorPosts)"
                          />
                        )}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[290px] flex flex-col items-center justify-center text-text-muted bg-surface-secondary/40 rounded-xl border border-dashed border-border">
                    <BarChart3 className="h-8 w-8 mb-2 opacity-30 text-brand-purple" />
                    <p className="text-sm font-medium">No activity recorded for this period</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 2. Content Distribution Donut Chart (4 Columns) */}
            <Card className="lg:col-span-4 bg-surface border-border flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-base font-semibold flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4 text-brand-pink" />
                  Asset Share Distribution
                </CardTitle>
                <CardDescription className="text-text-muted text-xs">
                  Proportion across creative engines
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col justify-between pt-0">
                {mounted && contentDistribution.length > 0 ? (
                  <>
                    <div className="h-[180px] w-full relative flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={contentDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={52}
                            outerRadius={75}
                            paddingAngle={3}
                            dataKey="value"
                            stroke="none"
                          >
                            {contentDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomPieTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>

                      {/* Center Stats overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-black text-white leading-none">
                          {totalContentCount}
                        </span>
                        <span className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">
                          Assets
                        </span>
                      </div>
                    </div>

                    {/* Donut Legend */}
                    <div className="space-y-1.5 mt-2 pt-2 border-t border-border">
                      {contentDistribution.map((item) => {
                        const Icon = item.icon;
                        const pct = totalContentCount > 0 ? Math.round((item.value / totalContentCount) * 100) : 0;
                        return (
                          <div key={item.name} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                              <span className="text-text-muted flex items-center gap-1">
                                <Icon className="w-3 h-3" />
                                {item.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 font-medium">
                              <span className="text-white font-semibold">{item.value}</span>
                              <span className="text-text-muted/70 text-[10px] w-8 text-right">{pct}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="h-[240px] flex flex-col items-center justify-center text-text-muted bg-surface-secondary/40 rounded-xl border border-dashed border-border my-auto">
                    <PieChartIcon className="h-8 w-8 mb-2 opacity-30 text-brand-pink" />
                    <p className="text-xs text-text-muted">No content created yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ========================================================================= */}
          {/* 📊 SECONDARY VISUALIZATION ROW: CHANNEL BAR COMPARISON & ACTIVITY LOG 📊 */}
          {/* ========================================================================= */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Horizontal / Channel Comparison Bar Chart (5 Columns) */}
            <Card className="lg:col-span-5 bg-surface border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-base font-semibold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-emerald-400" />
                  Format Production Comparison
                </CardTitle>
                <CardDescription className="text-text-muted text-xs">
                  Volume comparison across generated formats
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-2">
                {mounted && (
                  <div className="h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={channelBarData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                        <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis dataKey="channel" type="category" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} width={80} />
                        <Tooltip
                          cursor={{ fill: "rgba(255,255,255,0.03)" }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const d = payload[0].payload;
                              return (
                                <div className="bg-[#0B1630] border border-white/15 px-3 py-1.5 rounded-lg text-xs font-semibold text-white">
                                  {d.channel}: <span className="text-brand-pink">{d.count} items</span>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                          {channelBarData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Daily Activity Matrix Log (7 Columns) */}
            <Card className="lg:col-span-7 bg-surface border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-white text-base font-semibold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-brand-coral" />
                    Daily Output Matrix
                  </CardTitle>
                  <CardDescription className="text-text-muted text-xs">
                    Recent 10 active days timeline output
                  </CardDescription>
                </div>
                <span className="text-xs text-text-muted">Total: {totalContentCount} items</span>
              </CardHeader>

              <CardContent className="pt-2">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-border text-text-muted uppercase tracking-wider">
                        <th className="pb-2 font-semibold">Date</th>
                        <th className="pb-2 font-semibold text-center">Posts</th>
                        <th className="pb-2 font-semibold text-center">Reels</th>
                        <th className="pb-2 font-semibold text-center">AI Gen</th>
                        <th className="pb-2 font-semibold text-right">Intensity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {[...data.activity]
                        .reverse()
                        .slice(0, 7)
                        .map((day) => {
                          const totalDay = day.posts + day.reels + day.ai_generations;
                          return (
                            <tr key={day.date} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-2.5 text-white font-medium flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-text-muted" />
                                {day.date}
                              </td>
                              <td className="py-2.5 text-center">
                                {day.posts > 0 ? (
                                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-brand-purple/15 text-brand-purple">
                                    {day.posts}
                                  </span>
                                ) : (
                                  <span className="text-white/20">—</span>
                                )}
                              </td>
                              <td className="py-2.5 text-center">
                                {day.reels > 0 ? (
                                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-brand-pink/15 text-brand-pink">
                                    {day.reels}
                                  </span>
                                ) : (
                                  <span className="text-white/20">—</span>
                                )}
                              </td>
                              <td className="py-2.5 text-center">
                                {day.ai_generations > 0 ? (
                                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400">
                                    {day.ai_generations}
                                  </span>
                                ) : (
                                  <span className="text-white/20">—</span>
                                )}
                              </td>
                              <td className="py-2.5 text-right">
                                <div className="inline-flex items-center gap-2">
                                  <div className="w-16 bg-white/10 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className="bg-brand-gradient h-full rounded-full"
                                      style={{
                                        width: `${Math.min(100, Math.max(15, totalDay * 20))}%`,
                                      }}
                                    />
                                  </div>
                                  <span className="font-bold text-white tabular-nums">{totalDay}</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}