"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Presentation,
  Sparkles,
  Wand2,
  Plus,
  Trash2,
  Download,
  Share2,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Minimize2,
  Play,
  Layout,
  Palette,
  Layers,
  Globe2,
  CheckCircle2,
  BarChart3,
  FileText,
  Sliders,
  HelpCircle,
  RefreshCw,
  Eye,
  ArrowRight,
  Zap,
  TrendingUp,
  Target,
  Rocket,
  ShieldCheck,
  Star,
  Users,
  Edit3
} from "lucide-react";

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  tag: string;
  bullets: string[];
  statNumber: string;
  statLabel: string;
  speakerNotes: string;
  layout: "split" | "centered" | "cards";
}

const INITIAL_SLIDES: SlideData[] = [
  {
    id: 1,
    title: "DhandaGrow: AI Growth Platform",
    subtitle: "Empowering 63M+ Indian MSMEs with Autonomous Marketing & Sales Intelligence",
    tag: "Slide 1: Executive Overview",
    bullets: [
      "All-in-one AI ecosystem tailored for Indian commerce & regional languages",
      "One-click post generator, cinematic reels, and automated festive engine",
      "10x higher organic reach with zero studio production overhead"
    ],
    statNumber: "10,000+",
    statLabel: "Active Businesses Growing",
    speakerNotes: "Welcome investors. Today we introduce DhandaGrow, the operating system for India's 63 million small businesses that are currently underserved by Western marketing tools.",
    layout: "split"
  },
  {
    id: 2,
    title: "The Market Challenge & Opportunity",
    subtitle: "Why 92% of Small Indian Retailers Struggle to Build Consistent Digital Reach",
    tag: "Slide 2: Problem & Market Size",
    bullets: [
      "Extravagant agency fees (₹25,000 - ₹50,000/mo) out of reach for small shops",
      "Language disconnect: Global AI tools fail at authentic Hinglish and vernacular nuances",
      "Tool fatigue: Juggling separate apps for posters, reels, captions, and WhatsApp leads"
    ],
    statNumber: "₹4.8 Lakh Cr",
    statLabel: "Indian Digital Ad Market Opportunity",
    speakerNotes: "Highlight the massive market gap: local businesses have great products but zero time or budget for graphic designers and agencies.",
    layout: "cards"
  },
  {
    id: 3,
    title: "Unified AI Architecture",
    subtitle: "From Single-Click Creation to Automated Omnichannel Publishing",
    tag: "Slide 3: Solution Architecture",
    bullets: [
      "AI Brand Brain: Learns your logo, hex colors, tone of voice, and products forever",
      "Multichannel Automation: Syncs to Instagram, Facebook, WhatsApp, and Google My Business",
      "Smart Lead CRM & AI DM Bot: Converts comments and enquiries into confirmed sales"
    ],
    statNumber: "4.8x",
    statLabel: "Average Customer ROI in 90 Days",
    speakerNotes: "Walk the audience through the three pillars of DhandaGrow: Create, Automate, and Convert.",
    layout: "split"
  },
  {
    id: 4,
    title: "Financials & Scalable Growth",
    subtitle: "High-Margin SaaS Model with Rapid Viral Word-of-Mouth Adoption",
    tag: "Slide 4: Growth Roadmap",
    bullets: [
      "₹799/mo starting price point unlocks affordable mass-market penetration",
      "78% operational cost reduction compared to traditional creative workflows",
      "140% month-over-month platform engagement expansion across Tier 2 & 3 cities"
    ],
    statNumber: "78%",
    statLabel: "Gross Margin Retention",
    speakerNotes: "Explain our unit economics: low compute cost via multi-model routing and extremely sticky retention due to the Brand Brain feature.",
    layout: "centered"
  }
];

const PRESET_TEMPLATES = [
  {
    name: "Startup Pitch Deck 2026",
    category: "Investor Pitch",
    slidesCount: 8,
    badge: "Most Popular",
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
    icon: Rocket
  },
  {
    name: "Quarterly Sales & Revenue Plan",
    category: "Executive Review",
    slidesCount: 6,
    badge: "Business",
    color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
    icon: BarChart3
  },
  {
    name: "Diwali Festive Campaign Strategy",
    category: "Festive Engine",
    slidesCount: 5,
    badge: "Trending",
    color: "from-rose-500/20 to-pink-500/20 border-rose-500/30",
    icon: Star
  },
  {
    name: "B2B Product Proposal & Pricing",
    category: "Client Proposal",
    slidesCount: 6,
    badge: "Enterprise",
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
    icon: Target
  }
];

export default function PPTMakerDashboard() {
  const [slides, setSlides] = useState<SlideData[]>(INITIAL_SLIDES);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [deckType, setDeckType] = useState("Investor Pitch");
  const [slideCount, setSlideCount] = useState(6);
  const [themeStyle, setThemeStyle] = useState<"cyber" | "corporate" | "sunset" | "rose">("cyber");
  const [language, setLanguage] = useState("Hinglish & English");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const activeSlide = slides[activeSlideIndex] || slides[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Keyboard navigation for presentation fullscreen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      if (e.key === "ArrowRight" || e.key === "Space") {
        setActiveSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowLeft") {
        setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
      } else if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, slides.length]);

  const handleGenerateDeck = () => {
    if (!prompt.trim()) {
      showToast("Please enter a topic or select a prompt suggestion!");
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      const generated: SlideData[] = [
        {
          id: 1,
          title: `${prompt.trim()}: Strategic Overview`,
          subtitle: `AI-Generated ${deckType} tailored for Indian market scalability`,
          tag: "Slide 1: Executive Summary",
          bullets: [
            "Next-generation digital blueprint designed for high conversion",
            "Omnichannel reach covering WhatsApp, Instagram, and web funnel",
            "Automated KPI tracking with live business intelligence"
          ],
          statNumber: "94.6%",
          statLabel: "Predictive Target Accuracy",
          speakerNotes: `Opening remarks for ${prompt}: summarize high-level value proposition and core pillars.`,
          layout: "split"
        },
        {
          id: 2,
          title: "Market Need & Target Audience",
          subtitle: "Addressing structural market inefficiencies with AI automation",
          tag: "Slide 2: Opportunity & Problem",
          bullets: [
            "High customer acquisition cost across crowded digital channels",
            "Customer preference shifting towards vernacular Hinglish communication",
            "Need for rapid 24/7 engagement without increasing headcount"
          ],
          statNumber: "3.2x",
          statLabel: "Faster Conversion Speed",
          speakerNotes: "Highlight why current conventional methods fall short and why this timing is ideal.",
          layout: "cards"
        },
        {
          id: 3,
          title: "Execution Roadmap & Deliverables",
          subtitle: "Phase-by-phase rollout with measurable milestones",
          tag: "Slide 3: Implementation Strategy",
          bullets: [
            "Phase 1: Brand asset synchronization and AI training setup",
            "Phase 2: Full-scale automated content creation and scheduled publishing",
            "Phase 3: Revenue expansion, lead tracking, and performance optimization"
          ],
          statNumber: "14 Days",
          statLabel: "Average Time-to-Value",
          speakerNotes: "Walk the team or investors through the structured phase-based implementation.",
          layout: "split"
        },
        {
          id: 4,
          title: "Projected ROI & Value Realization",
          subtitle: "Clear financial outcomes and performance metrics",
          tag: "Slide 4: Outcome & Next Steps",
          bullets: [
            "75% operational cost reduction versus traditional manual workflows",
            "300%+ increase in qualified buyer inquiries within first quarter",
            "Full compatibility with Google Slides, PowerPoint, and PDF export"
          ],
          statNumber: "₹12.4 Lakh",
          statLabel: "Projected Net Annual Value Added",
          speakerNotes: "Conclude with confidence and open the floor for immediate questions and commitments.",
          layout: "centered"
        }
      ];
      setSlides(generated);
      setActiveSlideIndex(0);
      setIsGenerating(false);
      showToast("🎉 AI Presentation Generated Successfully!");
    }, 1200);
  };

  const handleAddSlide = () => {
    const newSlide: SlideData = {
      id: Date.now(),
      title: "New Presentation Slide",
      subtitle: "Add your customized subtitle and supporting bullet points here",
      tag: `Slide ${slides.length + 1}: Custom Section`,
      bullets: [
        "Key insight or strategic takeaway point #1",
        "Supporting data, market observation, or campaign metric",
        "Actionable next step for team or stakeholder approval"
      ],
      statNumber: "100%",
      statLabel: "Custom Metric",
      speakerNotes: "Add your talking points for this newly created slide.",
      layout: "split"
    };
    setSlides([...slides, newSlide]);
    setActiveSlideIndex(slides.length);
    showToast("New slide added to deck!");
  };

  const handleDeleteSlide = (indexToDelete: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (slides.length <= 1) {
      showToast("Deck must contain at least 1 slide!");
      return;
    }
    const updated = slides.filter((_, idx) => idx !== indexToDelete);
    setSlides(updated);
    if (activeSlideIndex >= updated.length) {
      setActiveSlideIndex(updated.length - 1);
    }
    showToast("Slide removed");
  };

  const handleCopySlideText = () => {
    const text = `${activeSlide.title}\n${activeSlide.subtitle}\n\nKey Points:\n${activeSlide.bullets.map((b) => `• ${b}`).join("\n")}\n\nMetric: ${activeSlide.statNumber} (${activeSlide.statLabel})\n\nNotes: ${activeSlide.speakerNotes}`;
    navigator.clipboard?.writeText(text);
    showToast("Slide content copied to clipboard!");
  };

  // Theme styles for the slide canvas
  const getThemeClasses = () => {
    switch (themeStyle) {
      case "cyber":
        return {
          wrapper: "bg-gradient-to-br from-[#0c1024] via-[#090d1f] to-[#120e29] border-violet-500/30 text-white",
          tagBg: "bg-violet-500/20 border-violet-400/30 text-violet-300",
          accentText: "from-amber-400 via-orange-400 to-rose-400",
          cardBg: "bg-white/[0.04] border-white/10 hover:border-violet-500/40 text-slate-200",
          bulletIcon: "bg-violet-500/20 text-violet-400",
          statBg: "from-violet-400 via-purple-300 to-pink-400"
        };
      case "corporate":
        return {
          wrapper: "bg-gradient-to-br from-[#08181e] via-[#061217] to-[#0d222a] border-emerald-500/30 text-white",
          tagBg: "bg-emerald-500/20 border-emerald-400/30 text-emerald-300",
          accentText: "from-emerald-300 via-teal-300 to-cyan-300",
          cardBg: "bg-white/[0.04] border-white/10 hover:border-emerald-500/40 text-slate-200",
          bulletIcon: "bg-emerald-500/20 text-emerald-400",
          statBg: "from-emerald-400 to-teal-300"
        };
      case "sunset":
        return {
          wrapper: "bg-gradient-to-br from-[#1d120a] via-[#140b07] to-[#251308] border-amber-500/30 text-white",
          tagBg: "bg-amber-500/20 border-amber-400/30 text-amber-300",
          accentText: "from-amber-300 via-orange-300 to-yellow-300",
          cardBg: "bg-white/[0.04] border-white/10 hover:border-amber-500/40 text-slate-200",
          bulletIcon: "bg-amber-500/20 text-amber-400",
          statBg: "from-amber-400 to-orange-400"
        };
      case "rose":
        return {
          wrapper: "bg-gradient-to-br from-[#1f0a17] via-[#14060f] to-[#280c1e] border-rose-500/30 text-white",
          tagBg: "bg-rose-500/20 border-rose-400/30 text-rose-300",
          accentText: "from-rose-300 via-pink-300 to-purple-300",
          cardBg: "bg-white/[0.04] border-white/10 hover:border-rose-500/40 text-slate-200",
          bulletIcon: "bg-rose-500/20 text-rose-400",
          statBg: "from-rose-400 to-pink-400"
        };
    }
  };

  const themeConfig = getThemeClasses();

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-[#12182b] border border-violet-500/40 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Hero / Header Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0d1326] via-[#111833] to-[#0a0f21] border border-white/10 p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.35)]">
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-gradient-to-bl from-amber-500/10 via-purple-500/10 to-transparent blur-[80px] pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-purple-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide">
              <Presentation className="w-4 h-4 text-amber-400" />
              <span>AI Google PPT & Slides Studio 3.0</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              AI Presentation & <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">Google PPT Maker</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Generate fully structured, branded presentation decks for business pitches, investor reviews, and regional marketing in seconds. Export directly to Google Slides or PPTX.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsFullscreen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs"
            >
              <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
              Present Fullscreen
            </button>
            <button
              onClick={() => showToast("Google Slides link prepared! (Export simulation ready)")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7E38] via-[#FF2E93] to-[#C438FF] hover:opacity-95 text-white text-xs sm:text-sm font-bold transition-all shadow-lg"
            >
              <Download className="w-4 h-4" />
              Export Google Slides
            </button>
          </div>
        </div>

        {/* AI Prompt Input Bar */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Wand2 className="w-3.5 h-3.5 text-amber-400" />
              <span>What presentation do you want to create today?</span>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerateDeck()}
                  placeholder="e.g. Seed Pitch Deck for DhandaGrow AI Platform with 10k MSME traction"
                  className="w-full h-12 pl-4 pr-12 rounded-2xl bg-[#070b18] border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/80 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setPrompt("Seed Investor Pitch Deck for DhandaGrow: 10,000+ MSMEs and 4.8x ROI")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-amber-400 hover:text-amber-300"
                >
                  Auto-Fill
                </button>
              </div>

              <button
                onClick={handleGenerateDeck}
                disabled={isGenerating}
                className="h-12 px-6 rounded-2xl bg-gradient-to-r from-[#FF7E38] via-[#FF2E93] to-[#C438FF] hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shrink-0 transition-all shadow-md disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Writing Slides...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Presentation</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Inspiration Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[11px] font-semibold text-slate-500">Quick ideas:</span>
              {[
                "🚀 Startup Seed Pitch Deck",
                "📊 Q4 Revenue & Sales Review",
                "🎉 Diwali Festive Marketing Deck",
                "🛍️ E-Commerce Product Launch"
              ].map((pill, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(pill.replace(/^[^\s]+\s/, ""))}
                  className="px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[11px] font-medium text-slate-300 transition-colors"
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Deck Tuning Options */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/5">
            {/* Deck Type */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-slate-400">Deck Category</span>
              <select
                value={deckType}
                onChange={(e) => setDeckType(e.target.value)}
                className="bg-[#090d1c] border border-white/10 text-white text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-amber-400"
              >
                <option value="Investor Pitch">Investor Pitch</option>
                <option value="Business Sales">Business Sales Proposal</option>
                <option value="Marketing Strategy">Marketing Strategy</option>
                <option value="Product Training">Product Training</option>
              </select>
            </div>

            {/* Theme Style */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-slate-400">Slide Theme</span>
              <select
                value={themeStyle}
                onChange={(e) => setThemeStyle(e.target.value as any)}
                className="bg-[#090d1c] border border-white/10 text-white text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-amber-400"
              >
                <option value="cyber">🌌 Deep Midnight (Cyber)</option>
                <option value="corporate">💼 Emerald Minimal (Executive)</option>
                <option value="sunset">🌅 Royal Gold (Festive)</option>
                <option value="rose">🎨 Modern Rose (Creative)</option>
              </select>
            </div>

            {/* Slide Count */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-slate-400">Deck Length</span>
              <select
                value={slideCount}
                onChange={(e) => setSlideCount(Number(e.target.value))}
                className="bg-[#090d1c] border border-white/10 text-white text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-amber-400"
              >
                <option value={4}>4 Slides (Executive Summary)</option>
                <option value={6}>6 Slides (Standard Pitch)</option>
                <option value={8}>8 Slides (Detailed Deck)</option>
                <option value={10}>10 Slides (Comprehensive)</option>
              </select>
            </div>

            {/* Language */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-slate-400">Language Tone</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-[#090d1c] border border-white/10 text-white text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-amber-400"
              >
                <option value="Hinglish & English">Hinglish & English</option>
                <option value="Pure English">Pure English</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Marathi">Marathi (मराठी)</option>
                <option value="Gujarati">Gujarati (ગુજરાતી)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Slide Studio Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Slide Thumbnails Navigator (3 cols) */}
        <div className="xl:col-span-3 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Slides ({slides.length})</span>
            </span>
            <button
              onClick={handleAddSlide}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-colors"
            >
              <Plus className="w-3 h-3" />
              Add Slide
            </button>
          </div>

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1 custom-scrollbar">
            {slides.map((slide, idx) => {
              const isActive = idx === activeSlideIndex;
              return (
                <div
                  key={slide.id}
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`group relative p-3 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#141b36] border-amber-400/80 shadow-[0_4px_20px_rgba(251,191,36,0.15)] ring-1 ring-amber-400/40"
                      : "bg-[#0c1122] border-white/10 hover:border-white/20 hover:bg-[#10162e]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isActive ? "bg-amber-400 text-slate-900" : "bg-white/10 text-slate-300"}`}>
                        #{idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-white line-clamp-1">
                        {slide.title}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleDeleteSlide(idx, e)}
                      title="Delete Slide"
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 p-1 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Mini Slide Preview Wireframe */}
                  <div className="w-full h-18 rounded-lg bg-[#070b18] border border-white/5 p-2 flex flex-col justify-between overflow-hidden pointer-events-none">
                    <div className="space-y-1">
                      <div className="w-2/3 h-1.5 rounded bg-white/30" />
                      <div className="w-full h-1 rounded bg-white/15" />
                      <div className="w-4/5 h-1 rounded bg-white/10" />
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono">
                      <span>16:9</span>
                      <span className="text-amber-400 font-bold">{slide.statNumber}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Column: Active Slide Canvas (6 cols) */}
        <div className="xl:col-span-6 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Live Slide Canvas
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                Slide {activeSlideIndex + 1} of {slides.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySlideText}
                title="Copy Slide Text"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsFullscreen(true)}
                title="Fullscreen Presentation"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 16:9 Slide Canvas */}
          <div
            className={`w-full aspect-[16/9] rounded-3xl border p-6 sm:p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all relative overflow-hidden ${themeConfig.wrapper}`}
          >
            {/* Background Glow Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Header of the Slide */}
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${themeConfig.tagBg}`}>
                  <Sparkles className="w-3 h-3" />
                  {activeSlide.tag}
                </span>

                <div className="text-[11px] font-mono opacity-60">
                  DHANDAGROW • PRESENTATION
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mb-2 leading-tight">
                {activeSlide.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl">
                {activeSlide.subtitle}
              </p>
            </div>

            {/* Slide Body: Bullets & Stat Callout */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-4 my-2">
              <div className="sm:col-span-8 space-y-2.5">
                {activeSlide.bullets.map((bullet, idx) => (
                  <div key={idx} className={`p-2.5 rounded-xl border flex items-start gap-2.5 text-xs sm:text-sm transition-all ${themeConfig.cardBg}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${themeConfig.bulletIcon}`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="leading-snug">{bullet}</span>
                  </div>
                ))}
              </div>

              {/* Stat Highlight Card */}
              <div className="sm:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.05] border border-white/10 text-center">
                <div className={`text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r ${themeConfig.statBg} bg-clip-text text-transparent`}>
                  {activeSlide.statNumber}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-1 leading-snug">
                  {activeSlide.statLabel}
                </div>
              </div>
            </div>

            {/* Slide Footer */}
            <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="font-semibold text-slate-300">Confidential • For Client Review</span>
              </div>
              <div className="font-mono">
                Slide {activeSlideIndex + 1} / {slides.length}
              </div>
            </div>
          </div>

          {/* Slide Navigation Buttons */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1))}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Slide
            </button>

            <div className="flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlideIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === activeSlideIndex ? "w-6 bg-amber-400" : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setActiveSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0))}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors"
            >
              Next Slide
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: AI Assistant & Speaker Notes (3 cols) */}
        <div className="xl:col-span-3 space-y-4">
          {/* Speaker Notes Card */}
          <div className="rounded-2xl bg-[#0c1122] border border-white/10 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Speaker Notes</span>
              </div>
              <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                Slide #{activeSlideIndex + 1}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#070b18] border border-white/5 text-xs text-slate-300 leading-relaxed max-h-36 overflow-y-auto custom-scrollbar">
              {activeSlide.speakerNotes}
            </div>

            <button
              onClick={() => showToast("Speaker notes copied!")}
              className="w-full py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Copy className="w-3 h-3" />
              Copy Notes
            </button>
          </div>

          {/* Export & Actions Card */}
          <div className="rounded-2xl bg-[#0c1122] border border-white/10 p-4 space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export & Delivery</span>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => showToast("Opening Google Slides sync wizard...")}
                className="w-full p-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Presentation className="w-4 h-4 text-amber-400" />
                  <span>Google Slides (.gslides)</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </button>

              <button
                onClick={() => showToast("PowerPoint (.pptx) download initiated!")}
                className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-blue-400" />
                  <span>PowerPoint (.pptx)</span>
                </div>
                <span className="text-[10px] text-slate-500">HD 1080p</span>
              </button>

              <button
                onClick={() => showToast("Printable PDF deck download initiated!")}
                className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-rose-400" />
                  <span>PDF Document (.pdf)</span>
                </div>
                <span className="text-[10px] text-slate-500">Vector</span>
              </button>
            </div>
          </div>

          {/* Quick Stats / Usage Badge */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-transparent border border-amber-500/20 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-amber-300 font-bold">
              <span>Token Economy</span>
              <span className="bg-amber-400/20 px-2 py-0.5 rounded-full text-[10px]">Free Tier</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Generating a 6-slide deck uses 5 AI presentation credits. Instant cloud sync included.
            </p>
          </div>
        </div>
      </div>

      {/* Pre-made Templates Gallery */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Ready-to-Use Presentation Decks</span>
            </h3>
            <p className="text-xs text-slate-400">
              Click any template to instantly load a tailored slide structure with pre-written Indian MSME data.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESET_TEMPLATES.map((tmpl, idx) => {
            const IconComp = tmpl.icon;
            return (
              <div
                key={idx}
                onClick={() => {
                  setPrompt(tmpl.name);
                  showToast(`Loaded ${tmpl.name} structure!`);
                }}
                className={`p-4 rounded-2xl bg-[#0c1122] border hover:border-amber-400/50 hover:bg-[#121933] transition-all cursor-pointer group flex flex-col justify-between space-y-3 ${tmpl.color}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                      {tmpl.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-tight">
                    {tmpl.name}
                  </h4>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-slate-400">
                  <span>{tmpl.category}</span>
                  <span className="font-semibold text-amber-400 flex items-center gap-1">
                    {tmpl.slidesCount} slides
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Presentation Slideshow Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-[#050814] flex flex-col justify-between p-6 sm:p-12 animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <Presentation className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-base sm:text-lg tracking-tight">
                {activeSlide.title}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-mono">
                Slide {activeSlideIndex + 1} of {slides.length}
              </span>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Exit Fullscreen"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Fullscreen Slide Content */}
          <div className="max-w-5xl mx-auto w-full aspect-[16/9] rounded-3xl border border-white/20 p-8 sm:p-14 flex flex-col justify-between bg-gradient-to-br from-[#0c1126] via-[#090e1f] to-[#12102b] shadow-2xl relative overflow-hidden my-auto">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                {activeSlide.tag}
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
                {activeSlide.title}
              </h2>
              <p className="text-sm sm:text-lg text-slate-300 font-medium max-w-3xl leading-relaxed">
                {activeSlide.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-4">
              <div className="md:col-span-8 space-y-3">
                {activeSlide.bullets.map((b, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-start gap-3 text-sm sm:text-base text-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-amber-500/15 via-orange-500/15 to-transparent border border-amber-500/30 text-center">
                <div className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  {activeSlide.statNumber}
                </div>
                <div className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                  {activeSlide.statLabel}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">DhandaGrow Presentation Studio • Confidential</span>
              <span className="font-mono">Press Esc to exit • Arrow keys to navigate</span>
            </div>
          </div>

          {/* Bottom Navigation Controls */}
          <div className="flex items-center justify-center gap-4 text-white">
            <button
              onClick={() => setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1))}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <div className="text-xs font-mono text-slate-400">
              Slide {activeSlideIndex + 1} of {slides.length}
            </div>
            <button
              onClick={() => setActiveSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0))}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
