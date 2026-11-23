'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  Presentation,
  Sparkles,
  ArrowRight,
  FileSpreadsheet,
  Download,
  Share2,
  CheckCircle2,
  Palette,
  Layout,
  Zap,
  Globe2,
  ChevronRight,
  ChevronLeft,
  Sliders,
  Layers,
  Wand2
} from 'lucide-react';

const demoSlides = [
  {
    slideNumber: 1,
    title: 'DhandaGrow: AI Growth Platform',
    subtitle: 'Automated Marketing, Social Media & Sales Intelligence for Modern Enterprises',
    bulletPoints: [
      'Comprehensive 360° AI engine tailored for Indian MSMEs & Brands',
      'Instant post creation, video reels, and festival campaigns in regional languages',
      '10x higher organic reach with zero production overhead'
    ],
    tag: 'Slide 1: Executive Overview',
    accentColor: 'from-amber-500 to-orange-500',
    stat: '10,000+',
    statLabel: 'Active Businesses Growing'
  },
  {
    slideNumber: 2,
    title: 'Market Challenge & Growth Gap',
    subtitle: 'Why 92% of Small Businesses Struggle with Consistent Digital Presence',
    bulletPoints: [
      'High agency fees and prolonged turnaround times for simple social creatives',
      'Language barriers: Standard tools fail at native Hinglish and regional dialects',
      'Scattered toolchains: Managing 5+ separate subscriptions for posts, reels & ads'
    ],
    tag: 'Slide 2: Problem Analysis',
    accentColor: 'from-orange-500 to-rose-500',
    stat: '78%',
    statLabel: 'Cost Reduction with DhandaGrow'
  },
  {
    slideNumber: 3,
    title: 'The AI Solution Architecture',
    subtitle: 'Unified Single-Click Creation to Multi-Channel Automated Publishing',
    bulletPoints: [
      'Brand Brain: Memorizes brand logo, colors, fonts, voice, and product catalog',
      'Omnichannel Publishing: Instagram, WhatsApp, Facebook, LinkedIn, Google & YouTube',
      'Real-Time Lead CRM & AI DM Bot converting inquiries into paying customers'
    ],
    tag: 'Slide 3: Solution & Roadmap',
    accentColor: 'from-amber-600 to-yellow-500',
    stat: '4.8x',
    statLabel: 'Average ROI in 90 Days'
  }
];

export default function GooglePPTPage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const activeSlide = demoSlides[currentSlideIndex];

  return (
    <main className="min-h-screen bg-[#FFFDF7] text-slate-900 font-sans selection:bg-amber-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 sm:pt-28 pb-12 lg:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden text-center relative">
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-amber-400/10 blur-[100px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-orange-400/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-amber-200 mb-6 shadow-xs">
            <Presentation className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">Google PPT & AI Slides</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-[1.1] text-slate-900 max-w-4xl">
            Create Stunning <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500">Google PPT & Slides</span> with AI.
          </h1>

          <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 font-medium max-w-2xl mx-auto">
            Generate complete business presentations, investor pitch decks, and sales slides in seconds. Fully editable and exportable directly to Google Slides and Microsoft PowerPoint.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <div className="inline-flex items-center gap-2 h-13 px-8 text-base rounded-full bg-gradient-to-r from-[#FF7E38] via-[#FF2E93] to-[#C438FF] text-white font-bold shadow-lg select-none cursor-default">
              <Wand2 className="w-4 h-4" />
              Generate Google PPT Free
              <ArrowRight className="w-4 h-4" />
            </div>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-13 px-8 text-base rounded-full bg-white border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold"
            >
              <Link href="/download">
                Get the App
              </Link>
            </Button>
          </div>

          {/* Interactive Slide Deck Preview Container */}
          <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-[0_15px_35px_rgba(0,0,0,0.06)] overflow-hidden text-left">
            {/* Top Bar simulating Google Slides UI */}
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-200 flex items-center justify-center text-amber-600">
                  <Presentation className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span>DhandaGrow_Business_Pitch_Deck.gslides</span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">AI Synced</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Exportable to Google Slides & PPTX</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                  Slide {currentSlideIndex + 1} of {demoSlides.length}
                </span>
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-xs">
                  <button
                    onClick={() => setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : demoSlides.length - 1))}
                    className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors"
                    aria-label="Previous Slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentSlideIndex((prev) => (prev < demoSlides.length - 1 ? prev + 1 : 0))}
                    className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors"
                    aria-label="Next Slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Slide Body */}
            <div className="p-6 sm:p-10 bg-gradient-to-br from-amber-50/30 via-white to-orange-50/20 min-h-[340px] flex flex-col justify-between relative">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 border border-amber-200/80 text-amber-900 text-xs font-bold mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  {activeSlide.tag}
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                  {activeSlide.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 font-medium mb-6">
                  {activeSlide.subtitle}
                </p>

                <div className="space-y-3 max-w-2xl">
                  {activeSlide.bulletPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm sm:text-base text-slate-700 font-normal">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Stat Bar */}
              <div className="pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`text-2xl sm:text-3xl font-black bg-gradient-to-r ${activeSlide.accentColor} bg-clip-text text-transparent`}>
                    {activeSlide.stat}
                  </div>
                  <div className="text-xs text-slate-500 font-medium leading-tight">
                    {activeSlide.statLabel}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold select-none cursor-default shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Open in Google Slides
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Capabilities */}
      <section className="py-20 sm:py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900">
              Why create presentations with DhandaGrow Google PPT?
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Transform a single business idea or product description into fully formatted, persuasive slide decks ready to present or export.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-amber-100 hover:border-amber-300 transition-all">
              <div className="w-11 h-11 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mb-4">
                <Layout className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Google Slides Native</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Export directly to your Google Drive as editable Google Slides or download as standard .pptx files in 1 click.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-amber-100 hover:border-amber-300 transition-all">
              <div className="w-11 h-11 bg-orange-100 text-orange-700 rounded-xl flex items-center justify-center mb-4">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Automated Brand Kit</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Applies your company's brand logo, colors, typography, and visual assets across every slide automatically.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-amber-100 hover:border-amber-300 transition-all">
              <div className="w-11 h-11 bg-rose-100 text-rose-700 rounded-xl flex items-center justify-center mb-4">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Vernacular & Regional</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Generate presentations in English, Hindi, Hinglish, Marathi, Gujarati, Bengali, Tamil, and 6+ regional languages.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-amber-100 hover:border-amber-300 transition-all">
              <div className="w-11 h-11 bg-yellow-100 text-yellow-700 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Instant Pitch Decks</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Pre-trained templates for investor decks, client proposals, product launches, and monthly business reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-20 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 text-center border-t border-amber-100">
        <div className="max-w-4xl mx-auto px-4">
          <Presentation className="w-14 h-14 text-amber-600 mx-auto mb-5" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Build your next presentation in under 60 seconds.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Say goodbye to blank slide anxiety. Let AI write, design, and structure your Google PPT decks today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div
              className="inline-flex items-center justify-center h-13 px-8 text-base rounded-full bg-gradient-to-r from-[#FF7E38] via-[#FF2E93] to-[#C438FF] text-white font-bold shadow-lg select-none cursor-default"
            >
              Start Creating Free
            </div>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-13 px-8 text-base rounded-full bg-white border-slate-300 text-slate-800 font-semibold"
            >
              <Link href="/">
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
