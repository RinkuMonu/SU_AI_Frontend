'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { FeatureExpansionSections } from '@/components/FeatureExpansionSections';
import { FeatureShowcaseSection } from '@/components/FeatureShowcaseSection';
import { 
  Bot, Sparkles, TrendingUp, Target, ArrowRight, CheckCircle2, 
  Zap, MessageSquare, LineChart, BarChart3, ShoppingBag, ShieldCheck, 
  Layers, ChevronDown, Flame, Store, Check, Copy, Clock, Play,
  Calendar, Eye, ChevronRight, Activity, DollarSign, Award, Users
} from 'lucide-react';

interface IndustryPlaybook {
  id: string;
  tabLabel: string;
  badge: string;
  businessName: string;
  businessType: string;
  userPrompt: string;
  budget: string;
  timeline: string;
  projectedRoas: string;
  projectedRevenue: string;
  image: string;
  strategySummary: string;
  milestones: {
    day: string;
    action: string;
    status: 'completed' | 'active' | 'scheduled';
    channel: string;
  }[];
  generatedAssets: {
    title: string;
    format: string;
    description: string;
  }[];
}

const playbooks: IndustryPlaybook[] = [
  {
    id: 'ethnic-fashion',
    tabLabel: '👗 Ethnic & Jewellery D2C',
    badge: 'Festive & Wedding Season Growth',
    businessName: 'Virasat Sarees & Jewellery',
    businessType: 'Handloom Sarees & Kundan Chokers (Jaipur)',
    userPrompt: 'Diwali & Wedding season aa raha hai. Humara Jaipur me showroom hai aur pan-India shipping hai. ₹30,000 budget mein complete campaign plan, reels aur Meta ads setup karo jisse minimum 4x ROAS aaye.',
    budget: '₹30,000',
    timeline: '21 Days Campaign',
    projectedRoas: '5.2x ROAS',
    projectedRevenue: '₹1,56,000',
    image: '/images/product-banarasi-saree.jpg',
    strategySummary: '3-Phase Hyper-Local & Pan-India strategy: Phase 1 teaser reels with festive hooks, Phase 2 Click-to-Social Meta Ads for high-ticket Kundan sets, Phase 3 COD & BOGO offers with urgent countdown.',
    milestones: [
      { day: 'Day 1-3', action: 'Competitor audit in Meta Ad Library & trending festive audio mapping', status: 'completed', channel: 'Market AI' },
      { day: 'Day 4-7', action: 'Publish 6 AI-generated Reels on Royal Banarasi Sarees & bridal looks', status: 'completed', channel: 'Instagram' },
      { day: 'Day 8-15', action: 'Launch Meta Advantage+ Ad Campaign with ₹1,200/day budget', status: 'active', channel: 'Meta Ads' },
      { day: 'Day 16-21', action: 'Automated Social broadcast to past 2,400 customers with BOGO link', status: 'scheduled', channel: 'Social AI' }
    ],
    generatedAssets: [
      { title: 'Royal Banarasi Silk Saree Ad', format: '4:5 Feed Ad', description: 'Headline: Flat 60% OFF Festive Dhamaka with COD & Free Shipping' },
      { title: 'Bridal Kundan Choker Video Reel', format: '9:16 Instagram Reel', description: 'Hinglish audio voiceover explaining 22K gold-plated craftsmanship' },
      { title: 'VIP Customer Social Blast', format: 'Rich Media Message', description: 'Pre-filled message: Namaste! Claim exclusive ₹500 festive voucher' }
    ]
  },
  {
    id: 'ayurveda-beauty',
    tabLabel: '🌿 Ayurvedic & Personal Care',
    badge: 'High Repeat & D2C Subscriptions',
    businessName: 'Kesh & Kanti Botanicals',
    businessType: 'Kumkumadi Oils & Herbal Skincare (Haridwar)',
    userPrompt: 'Humne Kashmiri Kesar serum launch kiya hai. Dark spots aur anti-aging target market hai. Tier-1 aur Tier-2 cities me female buyers ke liye high-converting problem-solution campaign run karni hai.',
    budget: '₹25,000',
    timeline: '30 Days Evergreen',
    projectedRoas: '4.7x ROAS',
    projectedRevenue: '₹1,17,500',
    image: '/images/product-saffron-serum.jpg',
    strategySummary: 'Educational Problem-Solution Funnel: Before/After user journeys, dermatologist-vetted hooks, authentic Hinglish reviews, and Buy 1 Get 1 Free festive incentives driving immediate pre-paid orders.',
    milestones: [
      { day: 'Day 1-5', action: 'Create 8 Before-After aesthetic video reels with natural lighting', status: 'completed', channel: 'AI Reel Maker' },
      { day: 'Day 6-14', action: 'Test 4 ad hook variations (Kashmiri Kesar purity vs Chemical serums)', status: 'active', channel: 'Meta Ads' },
      { day: 'Day 15-22', action: 'Scale winning creative (BOGO angle) with automated budget scaling', status: 'scheduled', channel: 'Ad Scaler' },
      { day: 'Day 23-30', action: 'Automated 7-day post-delivery Social check-in for 5-star Google reviews', status: 'scheduled', channel: 'Review AI' }
    ],
    generatedAssets: [
      { title: '7-Day Glow Challenge Creative', format: 'Carousel Post', description: 'Step-by-step Ayurvedic routine showcasing Kumkumadi saffron oil' },
      { title: 'BOGO Festive Meta Ad', format: 'Feed Creative', description: 'Kashmiri Kesar Radiance in 7 Days Guaranteed · Flat 50% OFF' },
      { title: 'Skin Consultation Chatbot Hook', format: 'DM AI Flow', description: 'AI asks 3 skin questions and auto-recommends exact serum combo' }
    ]
  },
  {
    id: 'local-retail',
    tabLabel: '🏬 Local Retail & Restaurant',
    badge: 'Hyperlocal Foot Traffic & Social Orders',
    businessName: 'Royal Taste Sweets & Cafe',
    businessType: 'Artisanal Sweets, Dry Fruits & Bakery (Delhi NCR)',
    userPrompt: 'Weekend me restaurant aur sweet shop me foot traffic badhana hai. Diwali gifting boxes aur fresh snacks ka local 6km radius mein aggressive promotion chahiye.',
    budget: '₹15,000',
    timeline: '10 Days Hyperlocal',
    projectedRoas: '6.1x Local ROI',
    projectedRevenue: '₹91,500',
    image: '/images/food-feast-banner.jpg',
    strategySummary: 'Pin-code specific Meta Ads targeting sweet lovers & corporate gifters within 6 km. Instant Social menu delivery with 15% first-order discount code to capture repeat local customers.',
    milestones: [
      { day: 'Day 1-2', action: 'Map local competition and setup Geo-fenced radius targeting (6 km)', status: 'completed', channel: 'Meta Ads' },
      { day: 'Day 3-5', action: 'Generate 5 mouthwatering video posts featuring festive packaging & sweets', status: 'completed', channel: 'AI Post Maker' },
      { day: 'Day 6-8', action: 'Launch Click-to-Social campaign for instant gift box bookings', status: 'active', channel: 'Social AI' },
      { day: 'Day 9-10', action: 'Send Friday evening alert to all local leads with weekend tasting invite', status: 'scheduled', channel: 'CRM Engine' }
    ],
    generatedAssets: [
      { title: 'Festive Luxury Mithai Box Ad', format: 'Instagram Story Ad', description: 'Pure desi ghee sweets in royal packaging · Order on Social Media for same-day delivery' },
      { title: 'Weekend Family Feast Reel', format: '9:16 Video Reel', description: 'Crisp visuals of hot samosas & kaju katli with trending festive background sound' },
      { title: 'Corporate Bulk Gifting Catalog', format: 'Social PDF Brochure', description: 'Custom corporate branding on dry fruit hampers with tier-based discounts' }
    ]
  },
  {
    id: 'footwear-accessories',
    tabLabel: '👞 Footwear & Luxury Goods',
    badge: 'High Average Order Value',
    businessName: 'Rivaaz Handcrafted Mojaris',
    businessType: 'Handmade Velvet Mojaris & Leather Footwear (Jodhpur)',
    userPrompt: 'Hum premium embroidered velvet mojaris banate hain. Wedding guest aur groom market ko capture karna hai. Return rate kam rakhne ke liye size guide assistant aur COD rules lagao.',
    budget: '₹22,000',
    timeline: '25 Days Campaign',
    projectedRoas: '4.9x ROAS',
    projectedRevenue: '₹1,07,800',
    image: '/images/product-velvet-mojaris.jpg',
    strategySummary: 'Anti-Shoe-Bite Comfort Angle: Highlight hand-stitched memory foam cushioning and authentic Jaipur velvet craftsmanship. Pre-qualify sizes via Instagram DM AI before confirming COD.',
    milestones: [
      { day: 'Day 1-4', action: 'Identify trending wedding sherwani shades and create matching footwear ads', status: 'completed', channel: 'Catalogue AI' },
      { day: 'Day 5-12', action: 'Run A/B test on "Triple-Cushion Comfort" vs "Royal Royal Aesthetic" angles', status: 'active', channel: 'Meta Ads' },
      { day: 'Day 13-18', action: 'Scale top-converting angle with lookalike audiences of past footwear buyers', status: 'scheduled', channel: 'Growth AI' },
      { day: 'Day 19-25', action: 'Automate size verification on Social Media before order dispatch to cut returns by 40%', status: 'scheduled', channel: 'CRM AI' }
    ],
    generatedAssets: [
      { title: 'Royal Mojari Wedding Reel', format: 'Reel Video', description: 'Step in royal comfort: triple-padded velvet mojaris that never bite your feet' },
      { title: 'Sherwani Matching Carousel', format: 'Product Ad', description: 'Which color matches your kurta? Navy, Emerald Green, or Maroon Zardozi?' },
      { title: 'Smart Size Advisor DM Bot', format: 'Instagram DM Bot', description: 'Calculates exact Indian foot length and suggests true size instantly' }
    ]
  }
];

const capabilities = [
  {
    icon: Target,
    title: 'Autonomous Goal Setting & KPI Roadmaps',
    description: 'Tell the agent your revenue target, festive deadline, or lead goals. It creates a structured day-by-day roadmap with realistic budgets, target ROAS, and expected conversions.',
    tag: 'Strategic Brain'
  },
  {
    icon: Sparkles,
    title: 'End-to-End Creative Generation',
    description: 'Doesn’t just give advice—it produces the actual assets. Generates Instagram Reels, Meta ad banners, festive Social greetings, and high-converting Hinglish captions.',
    tag: 'Creative Studio'
  },
  {
    icon: Zap,
    title: 'Self-Optimizing Meta & Google Campaigns',
    description: 'Monitors real-time ad performance 24/7. Automatically pauses low-CTR ad sets, shifts daily budget to top-performing creatives, and defends your return on ad spend (ROAS).',
    tag: 'Ad Engine'
  },
  {
    icon: MessageSquare,
    title: 'Hinglish & Regional Tone Calibration',
    description: 'Understands cultural nuances of Diwali, Eid, Rakhi, and wedding seasons. Speaks authentic Hinglish, Hindi, or clean English that clicks instantly with Bharat shoppers.',
    tag: 'Cultural NLP'
  },
  {
    icon: ShoppingBag,
    title: 'Synced with Brand Brain & Smart Catalogue',
    description: 'Instantly accesses your uploaded products, pricing, discount thresholds, and brand colors. Never proposes a discount higher than your pre-approved profit margins.',
    tag: 'Neural Memory'
  },
  {
    icon: LineChart,
    title: 'Closed-Loop Leads CRM & Social Sync',
    description: 'Routes every ad lead straight to your Social sales team and Leads CRM. Pre-fills order details and follow-up reminders to ensure zero lost sales.',
    tag: 'Conversion Funnel'
  }
];

const faqs = [
  {
    q: 'How is DhandaGrow AI Marketing Agent different from generic tools like ChatGPT?',
    a: 'ChatGPT only generates text when you prompt it. DhandaGrow AI Marketing Agent is an autonomous execution system specifically built for Indian business owners. It knows your products, your Brand Brain DNA, connects directly to Meta Ads & Social, generates complete multi-channel campaigns with real imagery, schedules the posts, and optimizes your ad spend daily without requiring manual supervision.'
  },
  {
    q: 'Do I need prior marketing or technical knowledge to use this agent?',
    a: 'Not at all! You talk to the AI in simple Hinglish or English just like you would talk to a human marketing consultant (e.g., "Mera banarasi saree ka showroom hai, Diwali sale ke liye campaign banao"). The AI handles audience targeting, copywriting, graphic generation, and ad setup automatically.'
  },
  {
    q: 'Does the AI Agent spend ad budget without my permission?',
    a: 'Never. You always retain complete control. The AI Agent prepares the comprehensive campaign strategy, creative assets, and budget allocation plan for your review. It only deploys or launches campaigns after you click "Approve". Once active, it operates strictly within your pre-set daily budget limits.'
  },
  {
    q: 'Can the agent handle Indian festivals and seasonal sales?',
    a: 'Yes! The agent is natively integrated with our 100+ Indian Festival Engine. It proactively reminds you 15 to 20 days before festivals like Diwali, Karwa Chauth, Eid, Navratri, Holi, and wedding muhurats, preparing early-bird buzz, flash sales, and Social broadcasts in advance.'
  },
  {
    q: 'How does it connect with my other DhandaGrow features?',
    a: 'It acts as the central conductor. When creating video campaigns, it calls the AI Reel Maker. When generating product banners, it pulls from your Smart Catalogue and AI Fashion Photoshoot. All incoming customer inquiries are automatically synced to your Leads CRM and Instagram DM AI.'
  }
];

export default function MarketingAgentPage() {
  const [activePlaybook, setActivePlaybook] = useState<IndustryPlaybook>(playbooks[0]);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(activePlaybook.userPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#070B14] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* 1. Hero Section - Shifted Up with Balanced Padding */}
      <section className="relative pt-20 sm:pt-24 lg:pt-24 pb-12 lg:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Glow ambient background lights */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[750px] h-[550px] bg-gradient-to-tr from-indigo-600/25 via-purple-600/20 to-blue-500/20 blur-[150px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-cyan-500/15 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="text-center max-w-4xl mx-auto">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(99,102,241,0.25)]">
            <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">
              DhandaGrow AI • Autonomous AI CMO
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-indigo-400" />
            <span className="hidden sm:inline-block text-[11px] text-indigo-200/80 font-medium">
              24/7 Digital Marketing Team
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white mb-6">
            Meet Your 24/7 AI CMO. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">
              Marketing Strategies That Execute Themselves.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300/90 leading-relaxed mb-8 max-w-3xl mx-auto font-normal">
            Never hire expensive agencies or struggle with complex ad dashboards again. Tell DhandaGrow AI your business goals in simple Hinglish—it audits competitors, builds 30-day multi-channel campaigns, generates Reels & Meta ads, and continuously optimizes for maximum ROAS.
          </p>

          {/* Core Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> 30-Day Growth Roadmap
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Auto-Generated Reels & Ads
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-300">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Avg. 4.8x ROAS Multiplier
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-300">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" /> Native Direct Lead Funnel
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Button
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-base rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all hover:scale-105 border-0"
              asChild
            >
              <Link href="/login/user">
                <Bot className="w-5 h-5 mr-2" /> Hire Your AI CMO Free
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-14 px-8 text-base rounded-full border-slate-700 bg-slate-900/80 text-white hover:bg-slate-800 backdrop-blur-md"
              onClick={() => {
                const el = document.getElementById('interactive-simulator');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Play className="w-4 h-4 mr-2 text-indigo-400" /> Test Live Campaign Playbook
            </Button>
          </div>

          {/* Metrics Pill Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto rounded-2xl bg-slate-900/60 border border-slate-800/80 p-3 backdrop-blur-xl">
            <div className="flex flex-col items-center justify-center p-3 border-r border-slate-800/80 last:border-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-indigo-400 tracking-tight">24/7</span>
              <span className="text-xs text-slate-400 font-medium mt-1">Autonomous Execution</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 border-r border-slate-800/80 last:border-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">4.8x+</span>
              <span className="text-xs text-slate-400 font-medium mt-1">Average Meta ROAS</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 border-r border-slate-800/80 last:border-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-purple-400 tracking-tight">100+</span>
              <span className="text-xs text-slate-400 font-medium mt-1">Indian Festivals Tracked</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 tracking-tight">0</span>
              <span className="text-xs text-slate-400 font-medium mt-1">Agency Fees Needed</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Mockup: AI Marketing Command Cockpit */}
        <div className="mt-14 max-w-6xl mx-auto relative">
          <div className="relative rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-slate-900/90 to-[#0A0F1D]/90 p-4 sm:p-6 shadow-[0_20px_70px_rgba(79,70,229,0.25)] backdrop-blur-2xl overflow-hidden">
            
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="h-4 w-px bg-slate-800 mx-1" />
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-white tracking-wide">DhandaGrow CMO Cockpit v3.4</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-semibold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Active Campaign Live
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/50">
                  <Activity className="w-3 h-3 text-indigo-400" /> 14 Days Remaining
                </span>
              </div>
            </div>

            {/* Split Screen Content */}
            <div className="grid lg:grid-cols-12 gap-6 items-center">
              
              {/* Left Column: Conversational AI Command Agent */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="rounded-2xl bg-[#060A14] border border-slate-800/90 p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Merchant Voice Prompt</span>
                    <span className="text-[11px] text-indigo-400 font-medium">Hinglish Audio Recognized</span>
                  </div>
                  <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
                    <p className="font-medium text-indigo-200">
                      &quot;Mera Jaipur me Royal Ethnic & Saree business hai. Diwali sale ke liye ₹25,000 budget mein complete 30-day marketing blueprint, 10 reels aur Meta Click-to-Social ads ready kardo.&quot;
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-indigo-950/20 border border-indigo-500/20 p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                    <Bot className="w-4 h-4 text-indigo-400" />
                    <span>AI CMO Autonomous Analysis & Action Plan:</span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-white">Audited 14 Competitors in Rajasthan & Delhi:</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">Identified high-performing hooks: &apos;Pure Handloom Banarasi at Factory Prices&apos; & &apos;Free Matching Jewellery with Bridal Lehengas&apos;.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-white">Created 3-Phase Campaign Funnel:</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">Phase 1: Brand Awareness Reels (₹6K) → Phase 2: Click-to-Social Ads (₹14K) → Phase 3: Last-Chance Retargeting (₹5K).</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                      <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-white">Generated 10 Reels + 6 Meta Banners:</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">Assets ready in Brand Brain with official logo, exact hex colors, and pre-tested festive audio.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between p-3 rounded-xl bg-indigo-900/30 border border-indigo-500/30">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-indigo-300 font-bold">Projected Outcome</span>
                      <p className="text-sm font-bold text-white">₹1,32,000 Revenue (5.28x ROAS)</p>
                    </div>
                    <Button size="sm" className="h-8 text-xs bg-indigo-600 hover:bg-indigo-500 font-bold rounded-lg border-0 shadow-sm" asChild>
                      <Link href="/login/user">Deploy Campaign</Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column: Real Visual Asset & Live Marketing Workspace */}
              <div className="lg:col-span-6 relative">
                <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl group">
                  <Image 
                    src="/images/ai-marketing-workspace.jpg" 
                    alt="DhandaGrow AI Marketing Workspace and Campaign Cockpit" 
                    width={720} 
                    height={460}
                    className="w-full h-[320px] sm:h-[380px] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-black/20" />

                  {/* Floating Analytics Badges over the image */}
                  <div className="absolute top-4 left-4 p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-xl flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Live Meta ROAS</span>
                      <p className="text-sm font-extrabold text-emerald-400">5.28x Active</p>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 backdrop-blur-md shadow-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-5 h-5 text-indigo-300" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Diwali Mahotsav Mega Sale</h4>
                        <p className="text-[11px] text-slate-400">1,248 Social inquiries · 89.2% positive sentiment</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                      ₹1,56,400 Sold
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Industry Playbooks (Simulator) */}
      <section id="interactive-simulator" className="py-20 lg:py-24 bg-[#050811] border-y border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Interactive Playbook Simulator
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              See How Your AI CMO Solves Real Indian Business Challenges
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg">
              Select your business vertical to explore how the agent designs, generates, and deploys hyper-targeted marketing campaigns.
            </p>
          </div>

          {/* Industry Selection Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
            {playbooks.map((p) => {
              const isSelected = activePlaybook.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePlaybook(p)}
                  className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400/50 shadow-[0_0_20px_rgba(99,102,241,0.35)] scale-105'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span>{p.tabLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Active Playbook Detailed Display */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8 backdrop-blur-xl">
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Details: Merchant Brief & Strategy */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Header card */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">{activePlaybook.badge}</span>
                    <h3 className="text-xl font-bold text-white mt-1">{activePlaybook.businessName}</h3>
                    <p className="text-xs text-slate-400">{activePlaybook.businessType}</p>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Budget</span>
                      <p className="text-sm font-bold text-white">{activePlaybook.budget}</p>
                    </div>
                    <div className="w-px h-8 bg-slate-800" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Target ROAS</span>
                      <p className="text-sm font-bold text-emerald-400">{activePlaybook.projectedRoas}</p>
                    </div>
                    <div className="w-px h-8 bg-slate-800" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Expected Sales</span>
                      <p className="text-sm font-bold text-purple-300">{activePlaybook.projectedRevenue}</p>
                    </div>
                  </div>
                </div>

                {/* Prompt & AI Strategy */}
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#060913] border border-slate-800/90">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> Merchant Input
                      </span>
                      <button 
                        onClick={handleCopyPrompt}
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                      >
                        {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedPrompt ? 'Copied' : 'Copy Prompt'}
                      </button>
                    </div>
                    <p className="text-sm text-slate-200 italic leading-relaxed">
                      &quot;{activePlaybook.userPrompt}&quot;
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20">
                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <Bot className="w-4 h-4 text-indigo-400" /> AI CMO Strategy Blueprint
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {activePlaybook.strategySummary}
                    </p>
                  </div>
                </div>

                {/* Milestones Timeline */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" /> 4-Phase Execution Timeline
                  </h4>
                  <div className="space-y-2">
                    {activePlaybook.milestones.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-bold text-[11px] border border-indigo-500/20">
                            {m.day}
                          </span>
                          <span className="text-slate-200 font-medium">{m.action}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase bg-slate-800 px-2 py-0.5 rounded">
                            {m.channel}
                          </span>
                          {m.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          {m.status === 'active' && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                          {m.status === 'scheduled' && <span className="w-2 h-2 rounded-full bg-slate-600" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Visual Campaign Asset & Generated Deliverables */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-black">
                  <Image 
                    src={activePlaybook.image} 
                    alt={activePlaybook.businessName}
                    width={500} 
                    height={380}
                    className="w-full h-[260px] sm:h-[300px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 border border-white/20 backdrop-blur-md text-[11px] font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Auto-Generated Creative
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
                    <span className="text-[10px] uppercase font-bold text-indigo-400">Featured Campaign Focus</span>
                    <h5 className="text-sm font-bold text-white">{activePlaybook.generatedAssets[0].title}</h5>
                    <p className="text-xs text-slate-300 mt-0.5">{activePlaybook.generatedAssets[0].description}</p>
                  </div>
                </div>

                {/* Additional Generated Assets */}
                <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                    Auto-Crafted Campaign Assets:
                  </h4>
                  <div className="space-y-2.5">
                    {activePlaybook.generatedAssets.map((asset, index) => (
                      <div key={index} className="p-2.5 rounded-xl bg-[#070B14] border border-slate-800/80 flex items-start justify-between gap-3 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{asset.title}</span>
                            <span className="text-[10px] text-indigo-300 bg-indigo-500/10 px-2 py-0.2 rounded border border-indigo-500/20 font-bold">
                              {asset.format}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">{asset.description}</p>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 border-0 flex items-center justify-center gap-2" asChild>
                  <Link href="/login/user">
                    Launch This Playbook in DhandaGrow <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. Deep Capabilities Grid */}
      <section className="py-20 lg:py-28 bg-[#070B14] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
              Complete Marketing Automation
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-3">
              Everything An Agency Does. Faster, Smarter, and 24/7.
            </h2>
            <p className="mt-4 text-slate-400 text-base sm:text-lg">
              Built specifically for Indian manufacturers, D2C brands, and retail shops looking to grow their sales without burning money on guesswork.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <div 
                  key={i} 
                  className="rounded-3xl border border-slate-800/90 bg-gradient-to-b from-slate-900/70 to-[#0A0E1A]/70 p-6 sm:p-8 backdrop-blur-xl hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {cap.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-indigo-300 transition-colors">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. Real-time Closed-Loop Analytics Showcase */}
      <section className="py-20 lg:py-24 bg-[#050811] border-t border-slate-800/80 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 flex flex-col gap-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Closed-Loop Performance Engine
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
                Continuous Daily Optimization That Protects Your Budget.
              </h2>
              <p className="text-base text-slate-300 leading-relaxed font-normal">
                Generic marketers launch ads and forget them for weeks. DhandaGrow AI tracks every single rupee spent in real-time. If an ad creative delivers low CTR or high cost per click, the AI automatically pauses it and shifts your budget to the top ROAS winner.
              </p>

              <div className="space-y-3.5 mt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <p className="text-sm text-slate-300">
                    <strong className="text-white">Auto-Kill Fatigue Ads:</strong> Stops ads when frequency hits saturation before ad spend is wasted.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <p className="text-sm text-slate-300">
                    <strong className="text-white">Hinglish Review Sentiment Analysis:</strong> Analyzes customer comments on your posts and generates addressing replies.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <p className="text-sm text-slate-300">
                    <strong className="text-white">Instant Social Retargeting:</strong> Alerts previous purchasers with timely festive discount codes for high repeat purchases.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <Button size="lg" className="rounded-full bg-white text-slate-900 hover:bg-slate-200 font-bold px-8 h-12" asChild>
                  <Link href="/login/user">Experience Auto-Optimization</Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-950 p-2 sm:p-3">
                <Image 
                  src="/images/business-analytics-dashboard.jpg" 
                  alt="DhandaGrow Marketing Analytics Dashboard" 
                  width={720} 
                  height={480}
                  className="rounded-2xl w-full h-[320px] sm:h-[400px] object-cover"
                />
                
                {/* Floating summary badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#070B14]/95 border border-slate-800 backdrop-blur-xl shadow-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Ad Revenue</span>
                    <h4 className="text-lg sm:text-xl font-extrabold text-white">₹6,84,500 <span className="text-xs font-bold text-emerald-400 ml-1">+34.8% vs last month</span></h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Blended ROAS</span>
                    <p className="text-lg sm:text-xl font-extrabold text-indigo-400">4.85x</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Frequently Asked Questions */}
      <section className="py-20 lg:py-24 bg-[#070B14] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Clear Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Everything you need to know about setting up and running your AI Chief Marketing Officer.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
                  >
                    <span className="text-sm sm:text-base font-bold text-white pr-4">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-indigo-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Standard Connected Feature Showcases */}
      <FeatureShowcaseSection feature="marketing-agent" />
      <FeatureExpansionSections feature="marketing-agent" />

      {/* 7. Final High-Impact CTA */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-[#070B14] to-[#04070D] text-center text-white relative overflow-hidden border-t border-slate-800/80">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/15 blur-[140px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Bot className="w-4 h-4 text-indigo-400" /> Start Growing Today
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Hire Your 24/7 AI CMO Today. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">
              Transform Your Business Growth.
            </span>
          </h2>

          <p className="text-base sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of Indian D2C brands, retailers, and business owners scaling their revenue effortlessly with Sevenunique AI & DhandaGrow.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-14 px-10 text-base rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-[0_0_30px_rgba(99,102,241,0.4)] border-0" asChild>
              <Link href="/login/user">
                Start 14-Day Free Trial <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full border-slate-700 bg-slate-900/80 text-white hover:bg-slate-800" asChild>
              <Link href="/contact">
                Schedule Live Demo
              </Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1-Click Meta & Social Connect
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Cancel anytime
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
