'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { FeatureExpansionSections } from '@/components/FeatureExpansionSections';
import { FeatureShowcaseSection } from '@/components/FeatureShowcaseSection';
import {
  Brain,
  Sparkles,
  PaintBucket,
  Type,
  FileImage,
  Network,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  Eye,
  RefreshCw,
  Fingerprint,
  Zap,
  Bot,
  Video,
  Camera,
  MessageCircle,
  Share2,
  Lock,
  Globe
} from 'lucide-react';

export default function BrandBrainPage() {
  const [activeTab, setActiveTab] = useState<'cockpit' | 'architecture' | 'memory'>('cockpit');

  return (
    <main className="min-h-screen bg-[#070B14] text-slate-100 font-sans selection:bg-violet-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Glow ambient background lights */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-violet-600/25 via-fuchsia-600/15 to-emerald-500/20 blur-[150px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="text-center max-w-4xl mx-auto">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(139,92,246,0.25)]">
            <Brain className="w-4 h-4 text-violet-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">
              DhandaGrow AI • Brand Brain™
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-violet-400" />
            <span className="hidden sm:inline-block text-[11px] text-violet-200/80 font-medium">
              Central Neural Business Memory
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white mb-6">
            An AI That Actually <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-300 to-emerald-400">
              Knows Your Business.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300/90 leading-relaxed mb-8 max-w-3xl mx-auto font-normal">
            Stop repeating yourself to generic AI. DhandaGrow Brand Brain™ remembers your official logo, exact hex colors, polite Hinglish voice, 1,240+ Indian products, target audience, and pricing rules—radiating consistent branding across Reels, Photoshoots, WhatsApp, and Ads.
          </p>

          {/* Unified AI Memory Modules Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
            <span className="text-xs text-slate-400 font-semibold mr-1">Stored In Neural Memory:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-bold text-violet-300">
              <PaintBucket className="w-3.5 h-3.5" /> Hex #070B14 & #10B981
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-xs font-bold text-fuchsia-300">
              <Type className="w-3.5 h-3.5" /> Polite Festive Hinglish
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-300">
              <FileImage className="w-3.5 h-3.5" /> 1,240 Indian SKUs
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-300">
              <Fingerprint className="w-3.5 h-3.5" /> Tier 1 & 2 Buyer Persona
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-300">
              <ShieldCheck className="w-3.5 h-3.5" /> Max 20% Discount Lock
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-base rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-[0_0_30px_rgba(139,92,246,0.35)] transition-all hover:scale-105 border-0"
              asChild
            >
              <Link href="/login/user">
                <Sparkles className="w-5 h-5 mr-2" /> Train Brand Brain Free
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-14 px-8 text-base rounded-full border-slate-700 bg-slate-900/80 text-white hover:bg-slate-800 backdrop-blur-md"
              onClick={() => {
                const el = document.getElementById('brain-showcase');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Eye className="w-5 h-5 mr-2 text-violet-400" /> Explore Brain Architecture
            </Button>
          </div>

          {/* Metrics Pill Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto rounded-2xl bg-slate-900/60 border border-slate-800/80 p-3 backdrop-blur-xl">
            <div className="flex flex-col items-center justify-center p-3 border-r border-slate-800/80 last:border-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-violet-400 tracking-tight">100%</span>
              <span className="text-xs text-slate-400 mt-1 font-medium">Brand Consistency</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 border-r border-slate-800/80 last:border-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-fuchsia-400 tracking-tight">0 Repetitions</span>
              <span className="text-xs text-slate-400 mt-1 font-medium">Never Retype Prompts</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 border-r border-slate-800/80 last:border-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">10 Sec</span>
              <span className="text-xs text-slate-400 mt-1 font-medium">1-Click URL Crawl</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-cyan-300 tracking-tight">6 Engines</span>
              <span className="text-xs text-slate-400 mt-1 font-medium">Instant Neural Sync</span>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div id="brain-showcase" className="mt-16 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setActiveTab('cockpit')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'cockpit'
                ? 'bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]'
                : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Brain className="w-4 h-4" />
            Brand Memory Cockpit
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'architecture'
                ? 'bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]'
                : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Network className="w-4 h-4" />
            Cross-Tool Sync Architecture
          </button>
          <button
            onClick={() => setActiveTab('memory')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'memory'
                ? 'bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]'
                : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            4 Pillars of Brand Memory
          </button>
        </div>

        {/* Main Showcase Container */}
        <div className="mt-8 relative rounded-3xl border border-slate-800 bg-slate-950/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-2xl">
          {activeTab === 'cockpit' ? (
            /* HD SaaS Cockpit View */
            <div className="p-4 sm:p-8 flex flex-col items-center">
              <div className="w-full relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
                <Image
                  src="/images/brand-brain-dashboard-hero.jpg"
                  alt="DhandaGrow AI Brand Brain Cockpit"
                  width={1400}
                  height={800}
                  className="w-full h-auto object-cover rounded-xl transition-all duration-700 group-hover:scale-[1.01]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                  <p className="text-sm text-slate-200">
                    DhandaGrow Brand Brain™ Dashboard: Visual Identity, Voice & Tone Engine, Product SKU memory, Demographics map, and pricing guardrails.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-violet-400" />
                <span>Synchronized with 1,240 Indian SKUs, Devanagari Typography & Strict Brand Guardrails</span>
              </div>
            </div>
          ) : activeTab === 'architecture' ? (
            /* Cross-Tool Sync Architecture View */
            <div className="p-4 sm:p-8 flex flex-col items-center">
              <div className="w-full relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
                <Image
                  src="/images/brand-brain-cross-tool-sync.jpg"
                  alt="DhandaGrow AI Brand Brain Cross-Tool Ecosystem"
                  width={1400}
                  height={800}
                  className="w-full h-auto object-cover rounded-xl transition-all duration-700 group-hover:scale-[1.01]"
                />
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Central Vector Brain radiating brand identity into Reel Studio, Photoshoot, WhatsApp CRM, and Ad Creator</span>
              </div>
            </div>
          ) : (
            /* 4 Pillars of Brand Memory (Clean Non-Clickable Display Showcase) */
            <div className="p-6 sm:p-10 select-none pointer-events-none">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-bold text-violet-400 uppercase tracking-widest block mb-2">
                  Permanent Vector Knowledge
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  The 4 Pillars Stored in Your Brand Brain
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pillar 1: Visual Identity */}
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center">
                      <PaintBucket className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">1. Visual Identity & Typography</h4>
                      <p className="text-xs text-slate-400">Never misplace a hex code or font</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-xs text-slate-300">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span>Brand Colors:</span>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#070B14] border border-slate-700" title="#070B14" />
                        <span className="w-4 h-4 rounded-full bg-[#10B981]" title="#10B981" />
                        <span className="w-4 h-4 rounded-full bg-[#8B5CF6]" title="#8B5CF6" />
                        <span className="w-4 h-4 rounded-full bg-[#06B6D4]" title="#06B6D4" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span>Typography:</span>
                      <span className="font-mono text-emerald-400 font-bold">Outfit (Headings) + Hind (Body)</span>
                    </div>
                  </div>
                </div>

                {/* Pillar 2: Voice & Tone */}
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 flex items-center justify-center">
                      <Type className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">2. Cultural Voice & Tone Engine</h4>
                      <p className="text-xs text-slate-400">Warm, festive, and consultative Hinglish</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-xs text-slate-300">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block mb-1">Standard Greeting Style:</span>
                      <span className="text-fuchsia-300 italic">"Namaste Ji! 🙏 Welcome to our festive boutique collection."</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span>Tone Classification:</span>
                      <span className="font-bold text-violet-400">High-Trust • Respectful • Festive</span>
                    </div>
                  </div>
                </div>

                {/* Pillar 3: Product SKU Knowledge */}
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                      <FileImage className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">3. 1,240+ Indian Products & SKUs</h4>
                      <p className="text-xs text-slate-400">Specifications, fabrics & pricing details</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-xs text-slate-300">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span>Connected Categories:</span>
                      <span className="text-emerald-400 font-bold">Banarasi Silk, Kundan, Ayurveda</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span>Return Policy Memory:</span>
                      <span className="text-slate-300">7-Day Hassle-Free Exchange • 100% Insured</span>
                    </div>
                  </div>
                </div>

                {/* Pillar 4: Guardrails & Demographics */}
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">4. Strict Business Guardrails</h4>
                      <p className="text-xs text-slate-400">Prevents hallucinations & margin leakage</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-xs text-slate-300">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span>Discount Ceiling:</span>
                      <span className="text-amber-400 font-bold">Never Exceed 20% Discount</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span>Payment Protocol:</span>
                      <span className="text-teal-400 font-bold">Always Attach Official Razorpay UPI Link</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6 AI Superpowers Grid */}
      <section className="py-20 lg:py-28 bg-[#04070D] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest block mb-3">
              Consistent Branding Across Every Asset
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              When Every AI Tool Shares One Brain, Marketing Never Looks Generic.
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Say goodbye to generic ChatGPT outputs, off-brand color schemes, and inconsistent customer responses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-violet-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Type className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Never Type Prompts Again</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                You don't need to write "Generate in polite festive Hinglish with brand colors". Just click 1-button generate. Brand Brain automatically injects tone, context, and vocabulary into every tool.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-fuchsia-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <PaintBucket className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Automated Color & Font Injection</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Whether generating an Instagram Reel, a Website, or a Diwali Poster, the AI automatically selects your exact hex codes, Devanagari typography, and transparent logo watermark.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Network className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Cross-Tool Intelligence Loops</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                The CRM talks to the Ad Maker. If the CRM detects high buyer inquiries for bridal Banarasi sarees in Jaipur, Brand Brain commands the AI Reel Maker to generate more saree showcase videos.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Business Rules & Guardrails</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Lock hard business rules: "Never offer discounts above 20%", "Always mention BIS Hallmark on gold", and "Attach UPI link on won orders". AI strictly adheres to your guardrails across every chat.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">10-Second URL Brand Extractor</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Simply paste your existing website URL or Instagram handle. Brand Brain crawls your pages, extracting logos, fonts, brand colors, product SKUs, and mission statements automatically.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Continuous Learning & Evolution</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                As you edit AI reels, publish festival posts, and approve WhatsApp messages, Brand Brain continuously adapts to your stylistic preferences, becoming smarter every week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Setup Workflow */}
      <section className="py-20 lg:py-28 bg-[#070B14]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest block mb-2">
              Setup in Under 60 Seconds
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
              How to Train Your AI Brand Brain.
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-center bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 hover:border-violet-500/40 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-violet-600 flex items-center justify-center font-bold text-2xl text-white shrink-0 shadow-lg shadow-violet-600/30">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Paste Your Website or Instagram URL</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Our crawler analyzes your store, extracting your primary logo, hex color codes, typography, brand tone, and catalog listings in under 10 seconds.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 hover:border-fuchsia-500/40 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-fuchsia-600 flex items-center justify-center font-bold text-2xl text-white shrink-0 shadow-lg shadow-fuchsia-600/30">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Set Tone, Languages & Guardrails</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Choose your language preference (Hinglish, Hindi, English), specify target Indian cities (Jaipur, Delhi, Mumbai, Bengaluru), and lock discount limits.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 hover:border-emerald-500/40 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center font-bold text-2xl text-white shrink-0 shadow-lg shadow-emerald-600/30">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Radiates Automatically to All 6 Engines</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Your AI Reel Studio, Photoshoot, WhatsApp CRM, and Ad Creator now produce 100% on-brand marketing without you ever re-typing instructions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase & Expansion Sections */}
      <FeatureShowcaseSection feature="brand-brain" />
      <FeatureExpansionSections feature="brand-brain" />

      {/* Bottom CTA */}
      <section className="py-24 bg-gradient-to-b from-[#070B14] to-[#04070D] text-center text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/15 blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Start Free Today
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Give Your Business a Digital Memory. Stop Treating AI Like a Blank Slate.
          </h2>
          <p className="text-slate-400 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
            Train your DhandaGrow Brand Brain™ in 60 seconds and experience 100% brand-consistent marketing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto h-16 px-10 text-lg rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-[0_0_40px_rgba(139,92,246,0.35)] transition-all hover:scale-105 border-0"
              asChild
            >
              <Link href="/login/user">Setup Brand Brain Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-16 px-8 text-lg rounded-full border-slate-700 bg-slate-900/80 text-white hover:bg-slate-800"
              asChild
            >
              <Link href="/features/crm">Explore Leads CRM</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
