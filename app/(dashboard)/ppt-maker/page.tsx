"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Presentation,
  Sparkles,
  Wand2,
  Play,
  Layers,
  Star,
  Download,
  Crown,
  Gift,
  ArrowRight,
  ChevronDown,
  Check,
  CheckCircle2,
  Lightbulb,
  ImageIcon,
  BarChart2,
  Mic,
  Briefcase,
  Users,
  Globe2,
  FileText,
  Rocket,
  X,
  ExternalLink,
  Laptop,
  FolderOpen,
  Zap,
  TrendingUp,
  GraduationCap,
  DollarSign
} from "lucide-react";

export default function PPTMakerPage() {
  // Form State
  const [topic, setTopic] = useState("AI in Digital Marketing");
  const [presentationType, setPresentationType] = useState("Select Type");
  const [targetAudience, setTargetAudience] = useState("Professionals");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Business");
  const [numberOfSlides, setNumberOfSlides] = useState<number | string>(10);
  const [language, setLanguage] = useState("English");

  // Feature Toggles (Switches)
  const [includeAIImages, setIncludeAIImages] = useState(true);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeSpeakerNotes, setIncludeSpeakerNotes] = useState(true);

  // Stepper state
  const [currentStep, setCurrentStep] = useState(1);

  // Modals & UI states
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isGeneratedModalOpen, setIsGeneratedModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleNextStep = () => {
    if (!topic.trim()) {
      showToast("Please enter a presentation topic!");
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGeneratedModalOpen(true);
      showToast("✨ AI Presentation generated successfully!");
    }, 1000);
  };

  const templates = [
    { title: "Business Pitch Deck", cat: "Business", slides: 12, icon: Briefcase },
    { title: "Marketing Strategy 2026", cat: "Marketing", slides: 15, icon: TrendingUp },
    { title: "Educational Workshop", cat: "Education", slides: 10, icon: GraduationCap },
    { title: "Financial Q4 Report", cat: "Finance", slides: 12, icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-[#081226] text-white font-sans -mx-4 sm:-mx-6 md:-mx-8 -my-6 p-4 sm:p-6 md:p-8 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-[#0e1b3d] border border-purple-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP HERO CARD (Exact Match with Image 2)                               */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0d1633] via-[#101a3d] to-[#0c142c] border border-white/10 p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-[450px] h-[350px] bg-gradient-to-bl from-cyan-500/15 via-purple-500/20 to-transparent blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-[300px] h-[300px] bg-blue-500/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & CTA Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              <span className="text-[#38bdf8]">AI </span>
              <span className="text-white">PPT Maker</span>
            </h1>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
              Create Stunning Presentations with the{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-[#f97316] bg-clip-text text-transparent">
                Power of AI.
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Turn your ideas into professional, visually appealing presentations in seconds with AI.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={handleNextStep}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#081226] hover:bg-[#0d1c3a] border border-purple-500/40 hover:border-purple-400 text-white text-sm font-bold transition-all shadow-lg shadow-black/50 group"
              >
                <Sparkles className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform" />
                <span>Create New Presentation</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/15 text-white text-sm font-semibold transition-all"
              >
                <Play className="w-4 h-4 text-white fill-white" />
                <span>Watch Demo</span>
              </button>
            </div>
          </div>

          {/* Right Visual 3D Graphic Composition (5 Cols) */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            {/* Floating Energy Sparks */}
            <div className="absolute -top-4 right-8 text-cyan-400 text-xl animate-pulse">✦</div>
            <div className="absolute top-1/2 -left-4 text-purple-400 text-sm animate-pulse">✦</div>
            <div className="absolute bottom-4 right-1/4 text-pink-400 text-xs animate-pulse">✦</div>

            {/* Lightning bolt badge */}
            <div className="absolute -top-2 left-6 w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/40 z-20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>

            {/* 3D Composition Container */}
            <div className="relative w-full max-w-[400px] aspect-[4/3] flex items-center justify-center">
              {/* Back tilted photo card */}
              <div className="absolute left-0 top-6 w-36 h-28 rounded-2xl bg-gradient-to-br from-blue-600/40 to-cyan-500/20 border border-white/20 p-2 shadow-xl -rotate-12 transform hover:rotate-0 transition-transform duration-500 overflow-hidden">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#121c3b] to-[#0a1126] flex flex-col justify-between p-2">
                  <div className="w-12 h-1.5 rounded bg-white/40" />
                  <div className="h-10 rounded-lg bg-gradient-to-r from-amber-500/40 via-rose-500/30 to-purple-500/40 border border-white/10" />
                  <div className="flex gap-1">
                    <div className="w-6 h-1 rounded bg-white/30" />
                    <div className="w-10 h-1 rounded bg-white/20" />
                  </div>
                </div>
              </div>

              {/* Right tilted charts card */}
              <div className="absolute right-0 top-4 w-36 h-32 rounded-2xl bg-gradient-to-br from-purple-600/40 to-pink-500/20 border border-white/20 p-2 shadow-xl rotate-12 transform hover:rotate-0 transition-transform duration-500 overflow-hidden">
                <div className="w-full h-full rounded-xl bg-[#0d1633] p-2 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-purple-300">Growth 4.8x</span>
                    <BarChart2 className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  {/* Mini bar chart */}
                  <div className="flex items-end gap-1.5 h-14 justify-between pt-2">
                    <div className="w-3 h-5 rounded-t bg-purple-500/40" />
                    <div className="w-3 h-8 rounded-t bg-purple-500/60" />
                    <div className="w-3 h-10 rounded-t bg-purple-500/80" />
                    <div className="w-3 h-13 rounded-t bg-gradient-to-t from-purple-500 to-pink-400" />
                  </div>
                </div>
              </div>

              {/* Center Main Tablet Frame with AI Robot & Headline */}
              <div className="relative z-10 w-72 h-44 rounded-2xl bg-gradient-to-b from-[#182347] to-[#0a1024] border-2 border-white/25 shadow-2xl p-2.5 flex flex-col justify-between transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                {/* Tablet Screen */}
                <div className="w-full h-full rounded-xl bg-gradient-to-r from-[#0d1838] via-[#101f4a] to-[#0b1430] p-3 flex items-center justify-between relative overflow-hidden">
                  <div className="space-y-1.5 max-w-[150px] relative z-10">
                    <div className="text-[10px] font-bold tracking-wider uppercase text-cyan-300">
                      DhandaGrow Presentation
                    </div>
                    <h3 className="text-sm font-black text-white leading-tight">
                      AI Power for a Smarter Tomorrow
                    </h3>
                    <p className="text-[9px] text-slate-300 font-mono">
                      Innovate • Automate • Grow
                    </p>
                  </div>

                  {/* Robot Avatar Graphic */}
                  <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 border border-cyan-400/30 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-white via-slate-200 to-slate-400 border-2 border-cyan-400 shadow-lg flex items-center justify-center relative">
                      {/* Robot Eye & Visor */}
                      <div className="w-9 h-3 rounded-full bg-slate-900 border border-cyan-400 flex items-center justify-around px-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      </div>
                      <div className="absolute -top-1 w-2 h-1 rounded-t bg-cyan-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3D Glossy PowerPoint "P" Icon in Foreground */}
              <div className="absolute -bottom-2 right-6 z-20 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ea580c] via-[#f97316] to-[#fb923c] p-0.5 shadow-2xl shadow-orange-500/50 transform rotate-6 hover:scale-110 transition-transform duration-300">
                <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-[#d946ef]/20 to-[#c2410c] flex items-center justify-center text-white font-black text-2xl drop-shadow-md">
                  P
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. STATS & PROMO STRIP (5 Cards in a Row - Exact Match with Image 2)      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Card 1: 250+ Presentations Created */}
        <div className="p-4 rounded-2xl bg-[#0c142c] border border-white/10 hover:border-purple-500/40 transition-all flex items-center gap-3.5 shadow-md">
          <div className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-white leading-none">250+</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Presentations Created</div>
          </div>
        </div>

        {/* Card 2: 4.9/5 User Rating */}
        <div className="p-4 rounded-2xl bg-[#0c142c] border border-white/10 hover:border-emerald-500/40 transition-all flex items-center gap-3.5 shadow-md">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-emerald-400" />
          </div>
          <div>
            <div className="text-lg font-black text-white leading-none">4.9/5</div>
            <div className="text-xs text-slate-400 font-medium mt-1">User Rating</div>
          </div>
        </div>

        {/* Card 3: 50K+ Downloads */}
        <div className="p-4 rounded-2xl bg-[#0c142c] border border-white/10 hover:border-blue-500/40 transition-all flex items-center gap-3.5 shadow-md">
          <div className="w-11 h-11 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-white leading-none">50K+</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Downloads</div>
          </div>
        </div>

        {/* Card 4: Pro Users 10K+ */}
        <div className="p-4 rounded-2xl bg-[#0c142c] border border-white/10 hover:border-amber-500/40 transition-all flex items-center gap-3.5 shadow-md">
          <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Pro Users</div>
            <div className="text-lg font-black text-white leading-none mt-1">10K+</div>
          </div>
        </div>

        {/* Card 5: Promo Card (Get 50% OFF Upgrade Now -> with Gift illustration) */}
        <div
          onClick={() => showToast("50% OFF Coupon applied to Pro Plan!")}
          className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-amber-900/40 border border-pink-500/30 hover:border-pink-400 transition-all cursor-pointer flex items-center justify-between shadow-md group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-white shrink-0 shadow-md">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-amber-300 tracking-wide uppercase">
                Get 50% OFF
              </div>
              <div className="text-[11px] text-pink-200 group-hover:text-white font-semibold transition-colors flex items-center gap-1">
                <span>Upgrade Now</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          <div className="text-2xl group-hover:scale-110 transition-transform">🎁</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN FORM CARD: CREATE YOUR AI PRESENTATION (Exact Match with Image 2) */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-[#0c142c]/95 border border-white/10 p-6 sm:p-8 md:p-9 shadow-2xl space-y-7 relative">
        {/* Card Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Create Your AI Presentation
              </h2>
              <p className="text-xs text-slate-400">
                Just fill in few details and let AI do the magic!
              </p>
            </div>
          </div>

          {/* Use Template Button */}
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-semibold text-slate-200 transition-all self-start sm:self-auto shadow-sm"
          >
            <FolderOpen className="w-4 h-4 text-purple-400" />
            <span>Use Template</span>
          </button>
        </div>

        {/* Stepper Progress Bar (1: Basic Information, 2: Content Settings, 3: Design & Style, 4: Media & Features, 5: Review & Generate) */}
        <div className="relative py-2 max-w-4xl mx-auto">
          {/* Horizontal Connecting Line */}
          <div className="absolute top-5 left-6 right-6 h-0.5 bg-white/10 -z-0" />

          <div className="grid grid-cols-5 gap-2 relative z-10 text-center">
            {/* Step 1: Basic Information (Active) */}
            <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setCurrentStep(1)}>
              <div
                className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                  currentStep === 1
                    ? "bg-[#be32ff] text-white shadow-lg shadow-[#be32ff]/50 ring-4 ring-[#be32ff]/30"
                    : "bg-[#0a1024] border border-white/20 text-slate-400"
                }`}
              >
                1
              </div>
              <span className={`text-[11px] sm:text-xs font-semibold ${currentStep === 1 ? "text-purple-300" : "text-slate-400"}`}>
                Basic Information
              </span>
            </div>

            {/* Step 2: Content Settings */}
            <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setCurrentStep(2)}>
              <div
                className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                  currentStep === 2
                    ? "bg-[#be32ff] text-white shadow-lg shadow-[#be32ff]/50 ring-4 ring-[#be32ff]/30"
                    : "bg-[#0a1024] border border-white/20 text-slate-400"
                }`}
              >
                2
              </div>
              <span className={`text-[11px] sm:text-xs font-medium ${currentStep === 2 ? "text-purple-300 font-semibold" : "text-slate-400"}`}>
                Content Settings
              </span>
            </div>

            {/* Step 3: Design & Style */}
            <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setCurrentStep(3)}>
              <div
                className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                  currentStep === 3
                    ? "bg-[#be32ff] text-white shadow-lg shadow-[#be32ff]/50 ring-4 ring-[#be32ff]/30"
                    : "bg-[#0a1024] border border-white/20 text-slate-400"
                }`}
              >
                3
              </div>
              <span className={`text-[11px] sm:text-xs font-medium ${currentStep === 3 ? "text-purple-300 font-semibold" : "text-slate-400"}`}>
                Design & Style
              </span>
            </div>

            {/* Step 4: Media & Features */}
            <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setCurrentStep(4)}>
              <div
                className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                  currentStep === 4
                    ? "bg-[#be32ff] text-white shadow-lg shadow-[#be32ff]/50 ring-4 ring-[#be32ff]/30"
                    : "bg-[#0a1024] border border-white/20 text-slate-400"
                }`}
              >
                4
              </div>
              <span className={`text-[11px] sm:text-xs font-medium ${currentStep === 4 ? "text-purple-300 font-semibold" : "text-slate-400"}`}>
                Media & Features
              </span>
            </div>

            {/* Step 5: Review & Generate */}
            <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setCurrentStep(5)}>
              <div
                className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                  currentStep === 5
                    ? "bg-[#be32ff] text-white shadow-lg shadow-[#be32ff]/50 ring-4 ring-[#be32ff]/30"
                    : "bg-[#0a1024] border border-white/20 text-slate-400"
                }`}
              >
                5
              </div>
              <span className={`text-[11px] sm:text-xs font-medium ${currentStep === 5 ? "text-purple-300 font-semibold" : "text-slate-400"}`}>
                Review & Generate
              </span>
            </div>
          </div>
        </div>

        {/* Form Body: 2 Columns (Left 3D Illustration Graphic + Right Form Fields) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          {/* Left Column (3.5 cols): 3D Presentation Slides Illustration with PowerPoint Tile */}
          <div className="lg:col-span-4 flex items-center justify-center pt-4">
            <div className="relative w-full max-w-[280px] aspect-[4/5] rounded-3xl bg-gradient-to-b from-[#101b3d] to-[#070e22] border border-white/10 p-5 flex flex-col justify-between shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Top Slide Card: Business Growth with Rising Bar Chart */}
              <div className="rounded-2xl bg-white p-3.5 text-slate-900 shadow-xl space-y-2 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-800">Business Growth</span>
                  <span className="text-[9px] font-mono text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full font-bold">+140%</span>
                </div>
                {/* Visual Chart */}
                <div className="h-14 rounded-lg bg-slate-50 border border-slate-200 p-1 flex items-end justify-between gap-1.5">
                  <div className="w-full h-4 rounded-sm bg-blue-300" />
                  <div className="w-full h-7 rounded-sm bg-blue-400" />
                  <div className="w-full h-10 rounded-sm bg-blue-500" />
                  <div className="w-full h-13 rounded-sm bg-gradient-to-t from-blue-600 to-indigo-600" />
                </div>
              </div>

              {/* Lower Layer: Large 3D PowerPoint Tile Floating */}
              <div className="flex flex-col items-center justify-center py-2 relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#ea580c] via-[#f97316] to-[#fb923c] p-1 shadow-2xl shadow-orange-500/50 transform rotate-6 hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                  <span className="text-white font-black text-4xl drop-shadow-md">P</span>
                </div>
              </div>

              <div className="text-center space-y-1">
                <div className="text-xs font-bold text-white tracking-wide">Multi-Format Presentation</div>
                <div className="text-[10px] text-slate-400">Exportable to PowerPoint & Google Slides</div>
              </div>
            </div>
          </div>

          {/* Right Column (8.5 cols): All Input Fields & Toggles */}
          <div className="lg:col-span-8 space-y-5">
            {/* Row 1: Topic, Presentation Type, Target Audience */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Presentation Topic */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <label className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>Presentation Topic</span>
                    <span className="text-purple-400">*</span>
                  </label>
                  <span className="text-[10px] text-slate-500">{topic.length}/100</span>
                </div>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. AI in Digital Marketing"
                  maxLength={100}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#070d1e] border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-400 placeholder-slate-500 transition-colors"
                />
              </div>

              {/* Presentation Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Rocket className="w-3.5 h-3.5 text-purple-400" />
                  <span>Presentation Type</span>
                </label>
                <div className="relative">
                  <select
                    value={presentationType}
                    onChange={(e) => setPresentationType(e.target.value)}
                    className="w-full h-11 px-3.5 pr-8 rounded-xl bg-[#070d1e] border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-400 appearance-none transition-colors"
                  >
                    <option value="Select Type">Select Type</option>
                    <option value="Pitch Deck">Pitch Deck</option>
                    <option value="Business Sales">Business Sales</option>
                    <option value="Marketing Strategy">Marketing Strategy</option>
                    <option value="Training & Workshop">Training & Workshop</option>
                    <option value="Quarterly Report">Quarterly Report</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Target Audience */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Target Audience</span>
                </label>
                <div className="relative">
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full h-11 px-3.5 pr-8 rounded-xl bg-[#070d1e] border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-400 appearance-none transition-colors"
                  >
                    <option value="Professionals">Professionals</option>
                    <option value="Investors">Investors & VC</option>
                    <option value="Clients">Potential Clients</option>
                    <option value="Students">Students & Learners</option>
                    <option value="Internal Team">Internal Team</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Row 2: Description (Left) + Number of Slides & Language (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              {/* Description */}
              <div className="md:col-span-6 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <label className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>Description (Optional)</span>
                  </label>
                  <span className="text-[10px] text-slate-500">{description.length}/500</span>
                </div>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us more about your presentation..."
                  maxLength={500}
                  className="w-full p-3 rounded-xl bg-[#070d1e] border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-400 placeholder-slate-500 transition-colors resize-none"
                />
              </div>

              {/* Number of Slides & Language */}
              <div className="md:col-span-6 space-y-4">
                {/* Number of Slides */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>Number of Slides</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {[5, 10, 15, 20].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setNumberOfSlides(num)}
                        className={`w-11 h-10 rounded-xl text-xs font-bold transition-all ${
                          numberOfSlides === num
                            ? "bg-purple-600 text-white shadow-md shadow-purple-600/40 ring-2 ring-purple-400"
                            : "bg-[#070d1e] border border-white/15 text-slate-300 hover:border-white/30"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setNumberOfSlides(12)}
                      className={`px-3 h-10 rounded-xl text-xs font-semibold transition-all ${
                        typeof numberOfSlides === "string" || numberOfSlides === 12
                          ? "bg-purple-600/30 border border-purple-400 text-purple-200"
                          : "bg-[#070d1e] border border-white/15 text-slate-400 hover:text-white"
                      }`}
                    >
                      Custom
                    </button>
                  </div>
                </div>

                {/* Language */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Language</span>
                  </label>
                  <div className="relative">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full h-11 px-3.5 pr-8 rounded-xl bg-[#070d1e] border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-400 appearance-none transition-colors"
                    >
                      <option value="English">🇮🇳 English</option>
                      <option value="Hinglish">🇮🇳 Hinglish</option>
                      <option value="Hindi">🇮🇳 Hindi (हिंदी)</option>
                      <option value="Marathi">🇮🇳 Marathi (मराठी)</option>
                      <option value="Gujarati">🇮🇳 Gujarati (ગુજરાતી)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                <span>Category</span>
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-3.5 pr-8 rounded-xl bg-[#070d1e] border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-400 appearance-none transition-colors"
                >
                  <option value="Business">💼 Business</option>
                  <option value="Marketing">📈 Marketing</option>
                  <option value="Education">🎓 Education</option>
                  <option value="Finance">💰 Finance</option>
                  <option value="Technology">⚡ Technology</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Row 4: 3 Feature Toggles (Include AI Images, Include Charts, Speaker Notes) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              {/* Toggle 1: Include AI Images */}
              <div
                onClick={() => setIncludeAIImages(!includeAIImages)}
                className="p-3.5 rounded-2xl bg-[#070d1e] border border-white/15 hover:border-white/30 transition-all cursor-pointer flex items-center justify-between shadow-sm select-none"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Include AI Images</div>
                    <div className="text-[10px] text-slate-400">Get stunning visuals</div>
                  </div>
                </div>

                {/* Switch */}
                <div className={`w-10 h-5.5 rounded-full transition-colors p-0.5 flex items-center ${includeAIImages ? "bg-purple-600 justify-end" : "bg-slate-700 justify-start"}`}>
                  <div className="w-4.5 h-4.5 rounded-full bg-white shadow-md" />
                </div>
              </div>

              {/* Toggle 2: Include Charts */}
              <div
                onClick={() => setIncludeCharts(!includeCharts)}
                className="p-3.5 rounded-2xl bg-[#070d1e] border border-white/15 hover:border-white/30 transition-all cursor-pointer flex items-center justify-between shadow-sm select-none"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
                    <BarChart2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Include Charts</div>
                    <div className="text-[10px] text-slate-400">Add data insights</div>
                  </div>
                </div>

                {/* Switch */}
                <div className={`w-10 h-5.5 rounded-full transition-colors p-0.5 flex items-center ${includeCharts ? "bg-purple-600 justify-end" : "bg-slate-700 justify-start"}`}>
                  <div className="w-4.5 h-4.5 rounded-full bg-white shadow-md" />
                </div>
              </div>

              {/* Toggle 3: Speaker Notes */}
              <div
                onClick={() => setIncludeSpeakerNotes(!includeSpeakerNotes)}
                className="p-3.5 rounded-2xl bg-[#070d1e] border border-white/15 hover:border-white/30 transition-all cursor-pointer flex items-center justify-between shadow-sm select-none"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Speaker Notes</div>
                    <div className="text-[10px] text-slate-400">Get talking points</div>
                  </div>
                </div>

                {/* Switch */}
                <div className={`w-10 h-5.5 rounded-full transition-colors p-0.5 flex items-center ${includeSpeakerNotes ? "bg-purple-600 justify-end" : "bg-slate-700 justify-start"}`}>
                  <div className="w-4.5 h-4.5 rounded-full bg-white shadow-md" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer: Pro Tip (Left) + Gradient Next Step Button (Right) */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="text-amber-300">Pro Tip:</strong> Be specific about your topic for better results!
            </span>
          </div>

          <button
            onClick={handleNextStep}
            disabled={isGenerating}
            style={{
              background: "linear-gradient(90deg, #fc9a5d 0%, #f0449b 35%, #be32ff 70%, #7d36fa 100%)",
            }}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl hover:opacity-95 text-white font-bold text-sm transition-all shadow-lg shadow-[#f0449b]/25 group disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating Presentation...</span>
              </>
            ) : (
              <>
                <span>Next Step: Content Settings</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: TEMPLATES PICKER MODAL                                           */}
      {/* ========================================================================= */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-3xl rounded-3xl bg-[#0c142c] border border-white/20 p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsTemplateModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-purple-400" />
                <span>Select a Presentation Template</span>
              </h3>
              <p className="text-xs text-slate-400">
                Click any template to auto-populate the topic and settings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-1">
              {templates.map((tmpl, idx) => {
                const IconC = tmpl.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setTopic(tmpl.title);
                      setCategory(tmpl.cat);
                      setNumberOfSlides(tmpl.slides);
                      setIsTemplateModalOpen(false);
                      showToast(`Loaded ${tmpl.title}!`);
                    }}
                    className="p-4 rounded-2xl bg-[#070d1e] border border-white/10 hover:border-purple-400/60 hover:bg-[#111a3b] transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <IconC className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                          {tmpl.title}
                        </h4>
                        <p className="text-[11px] text-slate-400">{tmpl.cat} • {tmpl.slides} Slides</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: WATCH DEMO PREVIEW MODAL                                         */}
      {/* ========================================================================= */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-3xl bg-[#0c142c] border border-white/20 p-6 sm:p-8 space-y-4 shadow-2xl relative text-center">
            <button
              onClick={() => setIsDemoModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-400 mx-auto flex items-center justify-center">
              <Play className="w-8 h-8 fill-purple-400" />
            </div>

            <h3 className="text-xl font-bold text-white">
              AI Presentation Studio Demo
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              See how DhandaGrow AI transforms raw prompts into structured pitch decks with speaker notes and instant Google Slides export.
            </p>

            <div className="p-4 rounded-2xl bg-[#070d1e] border border-white/10 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Instant 1-Click Multi-Slide Generation</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Automatic 16:9 Widescreen Layouts</span>
              </div>
              <div className="flex items-center gap-2 text-purple-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Direct Google Slides & PowerPoint Sync</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsDemoModalOpen(false);
                handleNextStep();
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold"
            >
              Try Generation Now
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: GENERATED PRESENTATION SUCCESS MODAL                             */}
      {/* ========================================================================= */}
      {isGeneratedModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-3xl rounded-3xl bg-[#0c142c] border border-purple-500/30 p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsGeneratedModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-bold shadow-lg">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Presentation Ready!</h3>
                <p className="text-xs text-slate-400">
                  Topic: <strong className="text-white">{topic}</strong> • {numberOfSlides} Slides Generated
                </p>
              </div>
            </div>

            {/* Generated Slide Preview Card */}
            <div className="rounded-2xl bg-gradient-to-br from-[#0e1938] to-[#070e24] border border-purple-500/30 p-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-purple-300">
                <span>SLIDE 1 OF {numberOfSlides}</span>
                <span>HD 1080P • 16:9</span>
              </div>
              <h2 className="text-2xl font-black text-white">{topic}</h2>
              <p className="text-sm text-slate-300">
                Strategic overview and execution roadmap tailored for {targetAudience}.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <div className="p-3 rounded-xl bg-white/[0.05] border border-white/10 text-xs">
                  <div className="font-bold text-white">Market Analysis</div>
                  <div className="text-[11px] text-slate-400 mt-1">High conversion strategy</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.05] border border-white/10 text-xs">
                  <div className="font-bold text-white">Execution Plan</div>
                  <div className="text-[11px] text-slate-400 mt-1">Timeline & key deliverables</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.05] border border-white/10 text-xs">
                  <div className="font-bold text-white">Projected ROI</div>
                  <div className="text-[11px] text-slate-400 mt-1">Measurable business growth</div>
                </div>
              </div>
            </div>

            {/* Export & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast("Google Slides link generated!")}
                  className="px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <Presentation className="w-4 h-4 text-amber-400" />
                  <span>Open in Google Slides</span>
                </button>
                <button
                  onClick={() => showToast("PowerPoint (.pptx) download initiated!")}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold flex items-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .pptx</span>
                </button>
              </div>

              <button
                onClick={() => setIsGeneratedModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
