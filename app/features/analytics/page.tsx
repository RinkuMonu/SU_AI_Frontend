'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { FeatureExpansionSections } from '@/components/FeatureExpansionSections';
import { FeatureShowcaseSection } from '@/components/FeatureShowcaseSection';
import {
  TrendingUp,
  BarChart3,
  Sparkles,
  Zap,
  Activity,
  ArrowRight,
  Gauge,
  Target,
  MessageCircle,
  Video,
  Camera,
  Layers,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Package,
  Clock,
  Flame,
  ArrowUpRight,
  ShieldCheck,
  Bot,
  RefreshCw,
  Share2,
  Users,
  Eye,
  ShoppingBag
} from 'lucide-react';

interface AnalyticsPreset {
  id: string;
  name: string;
  tag: string;
  location: string;
  specialty: string;
  reels: number;
  posts: number;
  photoshoots: number;
  images: number;
  captions: number;
  totalGenerations: number;
  creditsUsed: number;
  marketingScore: number;
  scoreStatus: string;
  scoreColor: string;
  reach: string;
  reachNum: number;
  whatsappEnquiries: string;
  whatsappNum: number;
  leads: string;
  leadsNum: number;
  roas: string;
  peakTime: string;
  festiveCampaign: string;
  geminiInsightTitle: string;
  geminiInsightText: string;
  recommendationAction: string;
}

const analyticsPresets: AnalyticsPreset[] = [
  {
    id: 'ethnic-boutique',
    name: 'Ethnic Wear & Boutique',
    tag: '👗 Fashion & Apparel',
    location: 'Jaipur, Rajasthan',
    specialty: 'Banarasi Silk Sarees & Bridal Lehengas',
    reels: 142,
    posts: 88,
    photoshoots: 56,
    images: 112,
    captions: 194,
    totalGenerations: 592,
    creditsUsed: 1480,
    marketingScore: 94,
    scoreStatus: 'Exceptional Vitality',
    scoreColor: '#10B981',
    reach: '850K',
    reachNum: 850,
    whatsappEnquiries: '1,240',
    whatsappNum: 1240,
    leads: '482',
    leadsNum: 482,
    roas: '4.2x',
    peakTime: '7:30 PM - 9:30 PM',
    festiveCampaign: 'Navratri & Diwali Bridal Blast',
    geminiInsightTitle: 'High-Converting Festive Asset Identified',
    geminiInsightText: 'Velvet Lehenga reels drove 3.4x higher WhatsApp catalogue inquiries than static posts. Boost evening reel scheduling between 7:30 PM and 9:15 PM ahead of Dhanteras rush.',
    recommendationAction: 'Schedule 2 Velvet Reels for Tonight'
  },
  {
    id: 'fine-jewellery',
    name: 'Fine Jewellery & Gold',
    tag: '💎 Gold & Diamond',
    location: 'Surat, Gujarat',
    specialty: '22KT BIS Hallmarked Jewellery & Polki Sets',
    reels: 96,
    posts: 114,
    photoshoots: 62,
    images: 84,
    captions: 160,
    totalGenerations: 516,
    creditsUsed: 1290,
    marketingScore: 91,
    scoreStatus: 'Exceptional Vitality',
    scoreColor: '#10B981',
    reach: '620K',
    reachNum: 620,
    whatsappEnquiries: '980',
    whatsappNum: 980,
    leads: '345',
    leadsNum: 345,
    roas: '5.1x',
    peakTime: '1:30 PM - 3:00 PM & 8:00 PM - 10:00 PM',
    festiveCampaign: 'Dhanteras Shubh Muhurat Offers',
    geminiInsightTitle: 'ROAS Optimization Alert',
    geminiInsightText: '0% Making Charge creatives generated 42 showroom appointments. Meta ad creative #4 has exhausted ₹6,200 with low conversions—redirect budget to Kundan Choker showcase video.',
    recommendationAction: 'Reallocate ₹6,200 to Kundan Video'
  },
  {
    id: 'royal-dining',
    name: 'Restaurant & Dining',
    tag: '🍛 Food & Restaurant',
    location: 'Hyderabad, Telangana',
    specialty: 'Authentic Dum Biryani & Royal Mughlai',
    reels: 168,
    posts: 92,
    photoshoots: 34,
    images: 140,
    captions: 178,
    totalGenerations: 612,
    creditsUsed: 1530,
    marketingScore: 89,
    scoreStatus: 'Strong & Active',
    scoreColor: '#BE32FF',
    reach: '1.12M',
    reachNum: 1120,
    whatsappEnquiries: '2,150',
    whatsappNum: 2150,
    leads: '890',
    leadsNum: 890,
    roas: '3.8x',
    peakTime: '6:00 PM - 9:30 PM (Dinner Rush)',
    festiveCampaign: 'Weekend Royal Handi Feast',
    geminiInsightTitle: 'Immediate Revenue Opportunity',
    geminiInsightText: 'Weekend Biryani handi promo reels delivered 48% direct WhatsApp online orders. Launch an evening flash story with Flat 25% discount code precisely at 6:45 PM for maximum dinner pickup.',
    recommendationAction: 'Launch Evening Biryani Promo'
  }
];

export default function AnalyticsPage() {
  const [selectedPresetId, setSelectedPresetId] = useState('ethnic-boutique');
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activePreset = analyticsPresets.find(p => p.id === selectedPresetId) || analyticsPresets[0];

  // Dynamic multipliers based on selected range
  const multiplier = timeRange === 7 ? 0.35 : timeRange === 30 ? 1 : 2.75;
  const scaledReels = Math.round(activePreset.reels * multiplier);
  const scaledPosts = Math.round(activePreset.posts * multiplier);
  const scaledPhotoshoots = Math.round(activePreset.photoshoots * multiplier);
  const scaledImages = Math.round(activePreset.images * multiplier);
  const scaledCaptions = Math.round(activePreset.captions * multiplier);
  const scaledTotalGen = Math.round(activePreset.totalGenerations * multiplier);
  const scaledCredits = Math.round(activePreset.creditsUsed * multiplier);
  const scaledWhatsapp = Math.round(activePreset.whatsappNum * multiplier);
  const scaledLeads = Math.round(activePreset.leadsNum * multiplier);
  const scaledReach = timeRange === 7 
    ? `${Math.round(activePreset.reachNum * 0.35)}K` 
    : timeRange === 30 
      ? activePreset.reach 
      : `${(activePreset.reachNum * 2.75 / 1000).toFixed(2)}M`;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <main className="min-h-screen bg-[#0A0D14] text-white font-sans selection:bg-cyan-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 lg:pt-24 pb-12 lg:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-600/15 blur-[140px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/3 right-1/4 w-[480px] h-[480px] bg-purple-600/15 blur-[130px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>AI Marketing Visual Analytics</span>
            <span className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              Gemini & Groq Engine
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
            Stop guessing your marketing.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              See every lead & revenue spike in real-time.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed font-medium mb-10 max-w-3xl mx-auto">
            One unified intelligence cockpit tailored for Indian businesses. Monitor AI content velocity across Reels, Posts & Photoshoots, track WhatsApp catalogue conversions, and get predictive Gemini recommendations on peak posting times and festival campaigns.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="h-16 px-10 text-lg rounded-full bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-bold shadow-xl shadow-cyan-500/25 border-0 flex items-center gap-2 transition-transform hover:scale-105" asChild>
              <Link href="/login/user">
                <BarChart3 className="w-5 h-5" /> Launch Analytics Free
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-8 text-base rounded-full border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-white font-semibold" asChild>
              <a href="#interactive-analytics-cockpit">
                Explore Live Demo Cockpit <Sparkles className="w-4 h-4 ml-2 text-cyan-400" />
              </a>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Gemini Marketing Health Score (0-100)</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> WhatsApp & Instagram Lead Attribution</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Automated Festival Spike Alerts</span>
          </div>
        </div>

        {/* Featured Visual Dashboard Frame */}
        <div className="mt-14 relative max-w-6xl mx-auto rounded-3xl border border-cyan-500/30 bg-[#0B0F19] p-3 shadow-2xl shadow-cyan-950/40">
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-800/80">
            <Image
              src="/images/business-analytics-dashboard.jpg"
              alt="DhandaGrow AI Business Analytics Cockpit"
              fill
              className="object-cover"
              priority
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14]/80 via-transparent to-transparent" />
            
            {/* Live Floating Badge */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4 bg-slate-900/85 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Live Marketing Intelligence</p>
                  <p className="text-sm font-bold text-white">Tracking 1.8M+ Short-Form Reel Views & ₹12.4L+ Customer Revenue</p>
                </div>
              </div>
              <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs h-9" asChild>
                <Link href="/login/user">
                  Connect Your Business <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Analytics Cockpit Simulator */}
      <section id="interactive-analytics-cockpit" className="py-16 md:py-24 bg-[#0E131F] border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3 border border-cyan-500/20">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              Live Dashboard Simulator
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Test Real Marketing Analytics for Your Business
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-400">
              This interactive simulator reflects the exact analytics engine running in your DhandaGrow dashboard. Select a business type below to test how metrics scale across timeframes.
            </p>
          </div>

          {/* Business Preset Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {analyticsPresets.map((preset) => {
              const isSelected = preset.id === selectedPresetId;
              return (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPresetId(preset.id)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 border ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white border-cyan-400 shadow-lg shadow-cyan-500/20 scale-105'
                      : 'bg-[#121726] text-slate-300 border-slate-800 hover:bg-[#181F33] hover:text-white'
                  }`}
                >
                  <span>{preset.tag.split(' ')[0]}</span>
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>

          {/* DASHBOARD COCKPIT CONTAINER */}
          <div className="rounded-3xl border border-slate-800 bg-[#0B0F19] shadow-2xl p-5 sm:p-7 space-y-6">
            
            {/* Top Bar: Business Info, Timeframe Switcher & Refresh */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                    {activePreset.name} — Marketing Cockpit
                  </h3>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {activePreset.location}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Active Focus: <span className="text-slate-200 font-medium">{activePreset.specialty}</span> • Campaign: <span className="text-purple-400 font-semibold">{activePreset.festiveCampaign}</span>
                </p>
              </div>

              {/* Timeframe & Action Buttons */}
              <div className="flex items-center gap-2 self-start md:self-auto bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
                {([7, 30, 90] as const).map((days) => (
                  <button
                    key={days}
                    onClick={() => setTimeRange(days)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      timeRange === days
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Last {days} Days
                  </button>
                ))}

                <div className="h-4 w-px bg-slate-800 mx-1" />

                <button
                  onClick={handleRefresh}
                  title="Refresh Live Data"
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
                </button>
              </div>
            </div>

            {/* 5-Column Content Velocity Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              
              {/* Reels Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#121726] to-[#F0449B]/10 border border-slate-800 hover:border-[#F0449B]/40 transition-all text-left group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Short Reels</span>
                  <div className="p-1.5 rounded-lg bg-[#F0449B]/20 text-[#F0449B] group-hover:scale-110 transition-transform">
                    <Video className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#F0449B] mt-2">
                  {scaledReels}
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Viral Short-Form</span>
                  <span className="text-emerald-400 font-bold">+28% MoM</span>
                </div>
              </div>

              {/* Social Posts Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#121726] to-[#BE32FF]/10 border border-slate-800 hover:border-[#BE32FF]/40 transition-all text-left group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Branded Posts</span>
                  <div className="p-1.5 rounded-lg bg-[#BE32FF]/20 text-[#BE32FF] group-hover:scale-110 transition-transform">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#BE32FF] mt-2">
                  {scaledPosts}
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Feed Creatives</span>
                  <span className="text-emerald-400 font-bold">+18% MoM</span>
                </div>
              </div>

              {/* Photoshoots Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#121726] to-[#FC9A5D]/10 border border-slate-800 hover:border-[#FC9A5D]/40 transition-all text-left group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">AI Photoshoots</span>
                  <div className="p-1.5 rounded-lg bg-[#FC9A5D]/20 text-[#FC9A5D] group-hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#FC9A5D] mt-2">
                  {scaledPhotoshoots}
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Studio Sets</span>
                  <span className="text-emerald-400 font-bold">+34% MoM</span>
                </div>
              </div>

              {/* Generative Images */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#121726] to-emerald-500/10 border border-slate-800 hover:border-emerald-500/40 transition-all text-left group">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Images & Posters</span>
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-2">
                  {scaledImages}
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Festival Banners</span>
                  <span className="text-emerald-400 font-bold">+22% MoM</span>
                </div>
              </div>

              {/* Captions & Copy */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#121726] to-amber-500/10 border border-slate-800 hover:border-amber-500/40 transition-all text-left group col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hinglish Captions</span>
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-2">
                  {scaledCaptions}
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Tags & Promos</span>
                  <span className="text-emerald-400 font-bold">+41% MoM</span>
                </div>
              </div>

            </div>

            {/* Middle Section: Live Trend Chart + Gemini Marketing Health Score */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column (8 cols): Trend Chart with Multi-Series Curves */}
              <div className="lg:col-span-8 p-5 rounded-2xl bg-[#121726] border border-slate-800 flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-bold text-white">Daily Content Velocity & Generation Waves</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> AI Total ({scaledTotalGen})
                    </span>
                    <span className="flex items-center gap-1.5 text-[#F0449B]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F0449B]" /> Reels ({scaledReels})
                    </span>
                    <span className="flex items-center gap-1.5 text-[#BE32FF]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#BE32FF]" /> Posts ({scaledPosts})
                    </span>
                  </div>
                </div>

                {/* SVG Visual Multi-Line Chart with Glowing Gradients */}
                <div className="relative w-full h-56 sm:h-64 my-2">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 700 220" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="cyanAreaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="pinkAreaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f0449b" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#f0449b" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    <line x1="0" y1="30" x2="700" y2="30" stroke="#1e293b" strokeDasharray="3 3" />
                    <line x1="0" y1="80" x2="700" y2="80" stroke="#1e293b" strokeDasharray="3 3" />
                    <line x1="0" y1="130" x2="700" y2="130" stroke="#1e293b" strokeDasharray="3 3" />
                    <line x1="0" y1="180" x2="700" y2="180" stroke="#1e293b" strokeDasharray="3 3" />

                    {/* AI Total Area */}
                    <path
                      d="M 0 170 Q 100 130, 200 145 T 400 90 T 550 60 T 700 35 L 700 210 L 0 210 Z"
                      fill="url(#cyanAreaGradient)"
                    />
                    {/* AI Total Stroke */}
                    <path
                      d="M 0 170 Q 100 130, 200 145 T 400 90 T 550 60 T 700 35"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="3.5"
                    />

                    {/* Reels Stroke & Area */}
                    <path
                      d="M 0 190 Q 110 160, 220 170 T 420 115 T 570 95 T 700 70 L 700 210 L 0 210 Z"
                      fill="url(#pinkAreaGradient)"
                    />
                    <path
                      d="M 0 190 Q 110 160, 220 170 T 420 115 T 570 95 T 700 70"
                      fill="none"
                      stroke="#f0449b"
                      strokeWidth="2.5"
                    />

                    {/* Posts Stroke */}
                    <path
                      d="M 0 195 Q 120 180, 240 185 T 440 140 T 590 130 T 700 110"
                      fill="none"
                      stroke="#be32ff"
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                    />

                    {/* High-Impact Marker Dots */}
                    <circle cx="550" cy="60" r="5" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="700" cy="35" r="5" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="570" cy="95" r="4.5" fill="#f0449b" stroke="#ffffff" strokeWidth="2" />
                  </svg>
                </div>

                {/* Bottom Chart Footer Stats */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">AI Computations</span>
                    <span className="font-extrabold text-white text-sm">{scaledTotalGen} Runs</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Credits Used ({timeRange}d)</span>
                    <span className="font-extrabold text-cyan-400 text-sm">{scaledCredits} Credits</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Peak Hour Window</span>
                    <span className="font-extrabold text-purple-400 text-sm">{activePreset.peakTime.split(' ')[0]} {activePreset.peakTime.split(' ')[1]}</span>
                  </div>
                </div>
              </div>

              {/* Right Column (4 cols): Gemini Marketing Health Score & Breakdown */}
              <div className="lg:col-span-4 p-5 rounded-2xl bg-gradient-to-br from-[#121726] via-[#0d162a] to-[#121726] border border-cyan-500/30 flex flex-col justify-between text-left">
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Gauge className="w-4 h-4 text-cyan-400" />
                    Gemini Marketing Score
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {activePreset.scoreStatus}
                  </span>
                </div>

                {/* Radial Score Gauge */}
                <div className="flex items-center justify-center my-4 relative">
                  <div className="w-32 h-32 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center relative bg-slate-900/80 shadow-inner">
                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                      {activePreset.marketingScore}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">OUT OF 100</span>
                    <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 border-r-purple-500 border-b-transparent border-l-transparent animate-spin duration-1000 pointer-events-none" />
                  </div>
                </div>

                {/* Score Breakdown Bars */}
                <div className="space-y-2.5 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Content Velocity</span>
                      <span className="font-bold text-cyan-400">96%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-cyan-400 rounded-full w-[96%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>WhatsApp Enquiries Funnel</span>
                      <span className="font-bold text-emerald-400">92%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full w-[92%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Reel Momentum & Virality</span>
                      <span className="font-bold text-[#F0449B]">94%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-[#F0449B] rounded-full w-[94%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Catalogue Depth (Connected Stock)</span>
                      <span className="font-bold text-purple-400">88%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-purple-400 rounded-full w-[88%]" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Engine: Gemini 1.5 Flash</span>
                  <span className="text-cyan-400 font-semibold">100% Calibrated</span>
                </div>
              </div>

            </div>

            {/* Omnichannel External Signals Row (Instagram Reach, WhatsApp Enquiries, Leads, ROAS) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              
              <div className="p-4 rounded-2xl bg-[#121726] border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold">Instagram & FB Reach</p>
                  <p className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">{scaledReach}</p>
                  <span className="text-[10px] text-emerald-400 font-bold">↑ +38% this month</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#121726] border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold">WhatsApp Enquiries</p>
                  <p className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-0.5">{scaledWhatsapp}</p>
                  <span className="text-[10px] text-emerald-400 font-bold">1-Tap Direct Chats</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#121726] border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold">CRM Hot Leads Captured</p>
                  <p className="text-xl sm:text-2xl font-extrabold text-cyan-400 mt-0.5">{scaledLeads}</p>
                  <span className="text-[10px] text-emerald-400 font-bold">Automated Influx</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#121726] border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold">Campaign ROAS</p>
                  <p className="text-xl sm:text-2xl font-extrabold text-amber-400 mt-0.5">{activePreset.roas}</p>
                  <span className="text-[10px] text-amber-400 font-bold">Return On Ad Spend</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
              </div>

            </div>

            {/* Gemini AI Actionable Recommendation Card */}
            <div className="rounded-2xl bg-gradient-to-r from-cyan-950/40 via-[#121726] to-purple-950/40 border border-cyan-500/40 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-left">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/30">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Gemini Predictive Signal
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      High Impact
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
                    {activePreset.geminiInsightTitle}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    {activePreset.geminiInsightText}
                  </p>
                </div>
              </div>

              <Button size="sm" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs h-10 px-5 shrink-0 shadow-md shadow-cyan-500/20" asChild>
                <Link href="/login/user">
                  {activePreset.recommendationAction} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* Deep-Dive Intelligence & Real Image Showcase */}
      <section className="py-20 bg-[#0A0D14] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider mb-3 border border-purple-500/20">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Strategic AI Marketing Engine
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Turn Raw Marketing Data Into Exact Next Actions
            </h2>
            <p className="mt-3 text-base text-slate-400">
              Everything in DhandaGrow connects together. When an AI reel maker video performs well, analytics recognizes the hook pattern and festival engine automatically scales it.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
            {/* Visual Screenshot of Intelligence Engine */}
            <div className="lg:col-span-7 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl relative aspect-[16/9] group">
              <Image
                src="/images/analytics-intelligence-showcase.jpg"
                alt="AI Marketing Intelligence India Market with WhatsApp Funnel and Festive Spikes"
                fill
                className="object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 rounded-xl text-xs text-slate-300">
                <span className="font-bold text-white">Festive Spike & Funnel Analysis:</span> Visualizing Diwali, Dussehra & Bhai Dooj spikes with 9.5% direct conversion rate.
              </div>
            </div>

            {/* 4 Core Pillars */}
            <div className="lg:col-span-5 space-y-4 text-left">
              
              <div className="p-5 rounded-2xl bg-[#121726] border border-slate-800 hover:border-cyan-500/40 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Video className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white">Content Velocity & Format ROI</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Know whether 15-second Reels, Studio Photoshoots, or Carousel Banners generate more revenue for your catalog, with side-by-side format conversion rates.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#121726] border border-slate-800 hover:border-emerald-500/40 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white">Full WhatsApp & CRM Funnel</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Trace the complete journey from an Instagram impression to a WhatsApp catalogue click and instant UPI checkout—all tracked automatically without manual pixel setups.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#121726] border border-slate-800 hover:border-purple-500/40 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white">Peak-Hour Posting Calibration</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Gemini analyzes customer interaction timestamps across Indian cities to recommend exact publishing windows (e.g., 7:30 PM - 9:30 PM for wedding ethnic wear).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#121726] border border-slate-800 hover:border-amber-500/40 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white">Ad Spend & Fatigue Guardrails</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Get automatic flags when creative fatigue sets in or ad campaigns spend without conversions, with 1-click budget re-allocation recommendations.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Feature Showcase & Expansion Sections */}
      <FeatureShowcaseSection feature="analytics" />
      <FeatureExpansionSections feature="analytics" />

      {/* Bottom CTA */}
      <section className="py-24 bg-gradient-to-b from-[#0E131F] to-[#0A0D14] text-center border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold mb-6 border border-cyan-500/20">
            <Activity className="w-4 h-4" />
            <span>Join 10,000+ Indian Businesses Growing With AI</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
            Stop losing money on blind marketing.
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
            Track your entire content engine, evaluate your marketing score, and double down on what actually drives sales with DhandaGrow AI Analytics.
          </p>
          <Button size="lg" className="h-16 px-12 text-lg rounded-full bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-bold shadow-xl shadow-cyan-500/25 border-0" asChild>
            <Link href="/login/user">
              Access Your Analytics Dashboard <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
