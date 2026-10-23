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
  Bot,
  Mic,
  Sparkles,
  Zap,
  ArrowRight,
  Eye,
  CheckCircle2,
  Share2,
  Video,
  Camera,
  MessageCircle,
  QrCode,
  Globe,
  LineChart,
  Megaphone,
  ShieldCheck,
  TrendingUp,
  Clock,
  Layers,
  Cpu
} from 'lucide-react';

export default function UNIAIPage() {
  const [activeTab, setActiveTab] = useState<'cockpit' | 'architecture' | 'execution'>('cockpit');

  return (
    <main className="min-h-screen bg-[#070B14] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 lg:pt-24 pb-12 lg:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Glow ambient background lights */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-500/20 via-violet-600/15 to-emerald-500/20 blur-[150px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-blue-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="text-center max-w-4xl mx-auto">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">
              DhandaGrow AI • UNI AI™
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-cyan-400" />
            <span className="hidden sm:inline-block text-[11px] text-cyan-200/80 font-medium">
              Autonomous AI Co-Founder
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white mb-6">
            Speak in Hinglish.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-violet-400">
              Watch Your Business Run Autonomously.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300/90 leading-relaxed mb-8 max-w-3xl mx-auto font-normal">
            UNI isn't just a chatbot. It's the central intelligence director of DhandaGrow AI. Speak or chat with UNI in natural Hinglish, and watch it coordinate AI Reels, Photoshoots, Social broadcasts, and Leads CRM simultaneously.
          </p>

          {/* Core Command Modules Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
            <span className="text-xs text-slate-400 font-semibold mr-1">Command Capabilities:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-300">
              <Mic className="w-3.5 h-3.5" /> Hinglish Voice Commands
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-bold text-violet-300">
              <Zap className="w-3.5 h-3.5" /> 6-Engine Orchestration
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-300">
              <MessageCircle className="w-3.5 h-3.5" /> Morning Social Briefs
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-xs font-bold text-pink-300">
              <QrCode className="w-3.5 h-3.5" /> Dynamic UPI Tracking
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-base rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-[0_0_30px_rgba(6,182,212,0.35)] transition-all hover:scale-105 border-0"
              asChild
            >
              <Link href="/login/user">
                <Sparkles className="w-5 h-5 mr-2" /> Talk to UNI AI Free
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-14 px-8 text-base rounded-full border-slate-700 bg-slate-900/80 text-white hover:bg-slate-800 backdrop-blur-md"
              onClick={() => {
                const el = document.getElementById('uni-showcase');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Eye className="w-5 h-5 mr-2 text-cyan-400" /> Explore Cockpit & Execution
            </Button>
          </div>

          {/* Metrics Pill Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto rounded-2xl bg-slate-900/60 border border-slate-800/80 p-3 backdrop-blur-xl">
            <div className="flex flex-col items-center justify-center p-3 border-r border-slate-800/80 last:border-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 tracking-tight">&lt; 3 Sec</span>
              <span className="text-xs text-slate-400 mt-1 font-medium">Speech-to-Execution</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 border-r border-slate-800/80 last:border-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-violet-400 tracking-tight">6 Engines</span>
              <span className="text-xs text-slate-400 mt-1 font-medium">Simultaneous Swarm</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 border-r border-slate-800/80 last:border-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">100% Hinglish</span>
              <span className="text-xs text-slate-400 mt-1 font-medium">Voice & Audio Native</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-teal-300 tracking-tight">4.2x Faster</span>
              <span className="text-xs text-slate-400 mt-1 font-medium">Campaign Go-Live</span>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div id="uni-showcase" className="mt-16 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setActiveTab('cockpit')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'cockpit'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Bot className="w-4 h-4" />
            Conversational AI Cockpit
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'architecture'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            Multi-Agent Swarm Ecosystem
          </button>
          <button
            onClick={() => setActiveTab('execution')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'execution'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Zap className="w-4 h-4" />
            Live Voice Execution Ripple
          </button>
        </div>

        {/* Main Showcase Container */}
        <div className="mt-8 relative rounded-3xl border border-slate-800 bg-slate-950/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-2xl">
          {activeTab === 'cockpit' ? (
            /* HD SaaS Cockpit View */
            <div className="p-4 sm:p-8 flex flex-col items-center">
              <div className="w-full relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
                <Image
                  src="/images/uni-ai-cockpit-hero.jpg"
                  alt="DhandaGrow UNI AI Autonomous Co-Founder Cockpit"
                  width={1400}
                  height={800}
                  className="w-full h-auto object-cover rounded-xl transition-all duration-700 group-hover:scale-[1.01]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                  <p className="text-sm text-slate-200">
                    Real-time UNI AI Cockpit: Natural Hinglish voice prompt decomposes into simultaneous reel creation, Social broadcasting, CRM listening, and storefront discount launch.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Connected to Gemini 2.0 Flash Audio, Official Meta Cloud API & Razorpay Instant Settlement</span>
              </div>
            </div>
          ) : activeTab === 'architecture' ? (
            /* Multi-Agent Swarm View */
            <div className="p-4 sm:p-8 flex flex-col items-center">
              <div className="w-full relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
                <Image
                  src="/images/brand-brain-cross-tool-sync.jpg"
                  alt="DhandaGrow UNI AI Multi-Agent Swarm Orchestration"
                  width={1400}
                  height={800}
                  className="w-full h-auto object-cover rounded-xl transition-all duration-700 group-hover:scale-[1.01]"
                />
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>UNI AI simultaneously orchestrates AI Reel Studio, Photoshoots, Social CRM & Ad Creator</span>
              </div>
            </div>
          ) : (
            /* Live Voice Execution Ripple (Pure Non-Clickable Display Showcase) */
            <div className="p-6 sm:p-10 select-none pointer-events-none">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-2">
                  1 Voice Command • 4 Simultaneous Executions
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  The UNI AI Execution Ripple
                </h3>
              </div>

              {/* Sample Voice Instruction Box */}
              <div className="max-w-3xl mx-auto p-5 rounded-2xl bg-slate-900 border border-cyan-500/30 mb-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <Mic className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    User Voice Note (Hinglish):
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-white">
                    "UNI, agle hafte Dhanteras jewellery aur bridal Banarasi saree par 15% discount ke sath Meta ads, Social broadcast aur landing page schedule kardo!"
                  </p>
                </div>
              </div>

              {/* 4 Simultaneous Execution Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mb-3">
                    <Video className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">1. AI Reel Maker</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Rendered 3 viral 9:16 Instagram Reels with festive Hindi voiceover, dynamic subtitles, and beat-sync music.
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 mt-3">
                    <CheckCircle2 className="w-3 h-3" /> 3 Reels Scheduled
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-3">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">2. Social AI</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Prepared 340 personalized broadcast messages with festive product cards and instant UPI checkout QR links.
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 mt-3">
                    <CheckCircle2 className="w-3 h-3" /> Ready to Broadcast
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-3">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">3. Storefront Sale</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Automatically updated live prices, applied 15% discount banner, and locked stock across 65 bridal jewellery SKUs.
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-400 mt-3">
                    <CheckCircle2 className="w-3 h-3" /> Live Storefront
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-3">
                    <LineChart className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">4. CRM Tracking</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Set up multi-channel lead tracking and assigned sales reps to close inbound buyer DMs with automated follow-ups.
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-400 mt-3">
                    <CheckCircle2 className="w-3 h-3" /> Active Listening
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6 Core Superpowers Grid */}
      <section className="py-20 lg:py-28 bg-[#04070D] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-3">
              Autonomous Business Command
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              More Than a Chatbot. A True Digital Co-Founder.
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              UNI doesn't stop at giving advice. It has hands on the wheel of your entire DhandaGrow marketing and sales suite.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Voice-First Hinglish Native</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Send voice notes while traveling or in your showroom. UNI understands casual Indian business vocabulary, festive dates, and Hindi idioms seamlessly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-violet-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Multi-Agent Swarm Controller</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                UNI commands the AI Reel Maker, Photoshoots, Ad Generator, and Leads CRM. One instruction triggers a coordinated multi-channel rollout.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Proactive Social Morning Briefs</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                UNI alerts you before you even ask: "Good morning! Yesterday's reel drove 14 inquiries and ₹34,000 in sales. Should I boost it today with ₹500 ad spend?"
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-pink-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Direct UPI & Revenue Attribution</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Unlike ChatGPT which only writes copy, UNI tracks the entire money flow from reel view to customer Customer chat and Razorpay UPI settlement.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Strategic Profit Planning</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Ask UNI: "How do I double my online saree orders for Karwa Chauth?" and get a mathematical plan covering photoshoot sets, ad budget, and DM follow-ups.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-teal-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Emergency Pause & Flash Sales</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                If an item runs out of stock, say: "UNI, pause the Banarasi saree ads and launch an emergency 24-hr flash sale on velvet mojaris instead."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase & Expansion Sections */}
      <FeatureShowcaseSection feature="uni-ai" />
      <FeatureExpansionSections feature="uni-ai" />

      {/* Bottom CTA */}
      <section className="py-24 bg-gradient-to-b from-[#070B14] to-[#04070D] text-center text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-500/15 blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Start Free Today
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Talk to UNI AI Today. Experience the Future of Business Management.
          </h2>
          <p className="text-slate-400 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
            Say goodbye to fragmented tools. Command your entire marketing and sales engine with a single voice note.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto h-16 px-10 text-lg rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-[0_0_40px_rgba(6,182,212,0.35)] transition-all hover:scale-105 border-0"
              asChild
            >
              <Link href="/login/user">Launch UNI AI Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-16 px-8 text-lg rounded-full border-slate-700 bg-slate-900/80 text-white hover:bg-slate-800"
              asChild
            >
              <Link href="/features/brand-brain">Explore Brand Brain</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
