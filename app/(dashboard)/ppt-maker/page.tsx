"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Edit3,
  Search,
  UploadCloud,
  Link2,
  Crown,
  Undo2,
  Redo2,
  Save,
  SlidersHorizontal,
  FolderOpen,
  Image as ImageIcon,
  PieChart,
  History,
  Settings as SettingsIcon,
  Video,
  FileUp,
  GraduationCap,
  Briefcase,
  DollarSign,
  Cpu,
  Monitor,
  Laptop,
  CheckCheck
} from "lucide-react";

type ActiveTab = "hub" | "wizard" | "editor" | "templates";

interface SlideItem {
  id: number;
  title: string;
  subtitle: string;
  tag: string;
  bullets: string[];
  features: string[];
  statNumber: string;
  statLabel: string;
}

const SAMPLE_SLIDES: SlideItem[] = [
  {
    id: 1,
    title: "AI in Digital Marketing",
    subtitle: "Smarter Strategy. Greater Growth.",
    tag: "Slide 1 • Overview",
    bullets: [
      "Autonomous campaign generation tailored for Indian MSMEs",
      "Real-time creative optimization across social platforms",
      "Multi-modal AI routing for cost-efficient content delivery"
    ],
    features: ["Automate Marketing", "Boost Engagement", "Grow Business"],
    statNumber: "10,000+",
    statLabel: "Active Businesses Scaled"
  },
  {
    id: 2,
    title: "Market Opportunity & The Growth Gap",
    subtitle: "Solving High CAC & Fragmented Creative Toolchains",
    tag: "Slide 2 • Market Analysis",
    bullets: [
      "92% of local Indian retail businesses lack full-time marketing agencies",
      "Vernacular Hinglish communication drives 140% higher conversion",
      "Unified single-dashboard replacement for 5+ fragmented apps"
    ],
    features: ["Lower CAC", "Vernacular Reach", "Zero Setup Time"],
    statNumber: "₹4.8 Lakh Cr",
    statLabel: "Indian Commerce Ad Spend"
  },
  {
    id: 3,
    title: "Unified AI Architecture",
    subtitle: "From 1-Click Creative Creation to Multi-Channel Publishing",
    tag: "Slide 3 • Solution",
    bullets: [
      "Brand Brain: Permanent memory of logo, hex colors, and products",
      "Instagram, WhatsApp, and Google My Business native automation",
      "Integrated Lead CRM that converts inquiries into confirmed orders"
    ],
    features: ["Brand Brain", "Auto Scheduler", "Omnichannel Bot"],
    statNumber: "4.8x",
    statLabel: "Average ROI in 90 Days"
  },
  {
    id: 4,
    title: "Scale Roadmap & Projections",
    subtitle: "High-Margin SaaS Model with Rapid Viral Word-of-Mouth",
    tag: "Slide 4 • Financials",
    bullets: [
      "₹799/month starting plan unlocks massive mass-market adoption",
      "78% operational cost reduction compared to legacy creative studios",
      "Expanding native vernacular models for 10+ regional languages"
    ],
    features: ["High Margins", "Sticky Retention", "Pan-India Scale"],
    statNumber: "78%",
    statLabel: "Gross Margin Retention"
  }
];

const TEMPLATES_LIST = [
  {
    id: "business-pitch",
    title: "Business Pitch Deck",
    category: "Business",
    slidesCount: 12,
    badge: "Popular",
    badgeColor: "bg-purple-600 text-white",
    gradient: "from-blue-600/30 via-indigo-600/20 to-purple-600/30",
    border: "border-purple-500/30",
    icon: Briefcase
  },
  {
    id: "marketing-strategy",
    title: "Marketing Strategy",
    category: "Marketing",
    slidesCount: 15,
    badge: "Trending",
    badgeColor: "bg-amber-500 text-slate-950",
    gradient: "from-amber-500/30 via-orange-500/20 to-yellow-500/30",
    border: "border-amber-500/30",
    icon: TrendingUp
  },
  {
    id: "educational-presentation",
    title: "Educational Presentation",
    category: "Education",
    slidesCount: 10,
    badge: "Recommended",
    badgeColor: "bg-emerald-500 text-slate-950",
    gradient: "from-emerald-500/30 via-teal-500/20 to-cyan-500/30",
    border: "border-emerald-500/30",
    icon: GraduationCap
  },
  {
    id: "financial-report",
    title: "Financial Report",
    category: "Finance",
    slidesCount: 12,
    badge: "Quarterly",
    badgeColor: "bg-blue-600 text-white",
    gradient: "from-cyan-500/30 via-blue-500/20 to-indigo-500/30",
    border: "border-blue-500/30",
    icon: DollarSign
  },
  {
    id: "startup-pitch",
    title: "Startup Pitch",
    category: "Business",
    slidesCount: 14,
    badge: "Investor Ready",
    badgeColor: "bg-rose-500 text-white",
    gradient: "from-rose-500/30 via-pink-500/20 to-purple-500/30",
    border: "border-rose-500/30",
    icon: Rocket
  },
  {
    id: "project-report",
    title: "Project Report",
    category: "Management",
    slidesCount: 8,
    badge: "Internal",
    badgeColor: "bg-slate-700 text-white",
    gradient: "from-slate-600/30 via-gray-600/20 to-zinc-600/30",
    border: "border-slate-500/30",
    icon: FileText
  },
  {
    id: "creative-portfolio",
    title: "Creative Showcase",
    category: "Design",
    slidesCount: 16,
    badge: "Creative",
    badgeColor: "bg-fuchsia-600 text-white",
    gradient: "from-fuchsia-500/30 via-pink-500/20 to-rose-500/30",
    border: "border-fuchsia-500/30",
    icon: Palette
  },
  {
    id: "tech-deepdive",
    title: "Technology Roadmap",
    category: "Technology",
    slidesCount: 10,
    badge: "Technical",
    badgeColor: "bg-indigo-600 text-white",
    gradient: "from-indigo-500/30 via-cyan-500/20 to-blue-500/30",
    border: "border-indigo-500/30",
    icon: Cpu
  }
];

export default function PPTMakerPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("hub");

  // Wizard state
  const [wizardTopic, setWizardTopic] = useState("AI in Digital Marketing");
  const [wizardCategory, setWizardCategory] = useState("Business");
  const [wizardDescription, setWizardDescription] = useState("");
  const [wizardType, setWizardType] = useState("Pitch Deck");
  const [wizardSlideCount, setWizardSlideCount] = useState<number>(10);
  const [wizardStep, setWizardStep] = useState(1);

  // Editor state
  const [slides, setSlides] = useState<SlideItem[]>(SAMPLE_SLIDES);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState("modern");
  const [selectedColor, setSelectedColor] = useState("#8b5cf6");
  const [fontFamily, setFontFamily] = useState("Poppins");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Templates search and filter
  const [templateFilter, setTemplateFilter] = useState("All Templates");
  const [templateSearch, setTemplateSearch] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeSlide = slides[activeSlideIndex] || slides[0];

  const handleCreateFromWizard = () => {
    const newTopic = wizardTopic.trim() || "Untitled Presentation";
    const generated: SlideItem[] = [
      {
        id: 1,
        title: newTopic,
        subtitle: `${wizardCategory} Overview • AI Generated Strategy`,
        tag: "Slide 1 • Title",
        bullets: [
          `Key strategic pillar for ${newTopic}`,
          "Market dynamics and actionable execution roadmap",
          "Comprehensive milestones with verified ROI metrics"
        ],
        features: ["Strategy", "Execution", "Growth"],
        statNumber: `${wizardSlideCount} Slides`,
        statLabel: "Complete AI Deck Ready"
      },
      ...SAMPLE_SLIDES.slice(1)
    ];
    setSlides(generated);
    setActiveSlideIndex(0);
    setActiveTab("editor");
    showToast("🎉 Presentation generated successfully!");
  };

  const handleAddSlide = () => {
    const newSlide: SlideItem = {
      id: Date.now(),
      title: "New Presentation Slide",
      subtitle: "Click to edit headline and bullet points",
      tag: `Slide ${slides.length + 1} • Custom`,
      bullets: [
        "Primary strategic insight or business observation",
        "Supporting data point, research finding, or KPI",
        "Clear recommendation or decision milestone"
      ],
      features: ["Pillar 1", "Pillar 2", "Pillar 3"],
      statNumber: "100%",
      statLabel: "Target Completion"
    };
    setSlides([...slides, newSlide]);
    setActiveSlideIndex(slides.length);
    showToast("Slide added!");
  };

  const filteredTemplates = TEMPLATES_LIST.filter((tmpl) => {
    const matchesFilter =
      templateFilter === "All Templates" ||
      tmpl.category.toLowerCase() === templateFilter.toLowerCase();
    const matchesSearch =
      tmpl.title.toLowerCase().includes(templateSearch.toLowerCase()) ||
      tmpl.category.toLowerCase().includes(templateSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20 text-slate-100 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-[#12182b] border border-violet-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Secondary Navigation Bar for PPT Maker (matches Image 2 sidebar/tabs) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#0b1021]/80 backdrop-blur-xl border border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("hub")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "hub"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Presentation className="w-4 h-4 text-amber-400" />
            <span>Studio Hub</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("wizard");
              setWizardStep(1);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "wizard"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Wand2 className="w-4 h-4 text-purple-400" />
            <span>Create with AI</span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30">
              New
            </span>
          </button>

          <button
            onClick={() => setActiveTab("editor")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "editor"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Layout className="w-4 h-4 text-cyan-400" />
            <span>Slide Studio Canvas</span>
          </button>

          <button
            onClick={() => setActiveTab("templates")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "templates"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <FolderOpen className="w-4 h-4 text-emerald-400" />
            <span>Templates Library</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast("Upgraded to Pro Preview!")}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-purple-500/20 border border-amber-500/30 hover:border-amber-400 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Pro Tier Active</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. VIEW: STUDIO HUB (Matches Top Left in Image 2)                          */}
      {/* ========================================================================= */}
      {activeTab === "hub" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Hero Banner with 3D Robot & Presentation Graphic */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c1026] via-[#111738] to-[#0a0e24] border border-white/10 p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 right-0 w-[550px] h-[350px] bg-gradient-to-bl from-purple-500/20 via-blue-500/20 to-transparent blur-[90px] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Content */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold tracking-wide">
                  <Star className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
                  <span>AI-Powered Presentation Studio</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
                  Create Stunning Presentations with{" "}
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                    AI PPT Maker
                  </span>
                </h1>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                  Turn your ideas into professional, visually appealing presentations in seconds. Full compatibility with Google Slides, PowerPoint, and PDF export.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setActiveTab("wizard");
                      setWizardStep(1);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white text-sm font-bold transition-all shadow-lg shadow-purple-600/30"
                  >
                    <span>Create New Presentation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveTab("editor")}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-sm font-semibold transition-all"
                  >
                    <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>Watch Demo</span>
                  </button>
                </div>
              </div>

              {/* Right Illustration: 3D Robot Mascot & Floating Slides Card */}
              <div className="lg:col-span-5 flex items-center justify-center relative">
                <div className="relative w-full max-w-[340px] aspect-square rounded-3xl bg-gradient-to-tr from-purple-600/30 via-indigo-600/20 to-amber-500/20 p-1 border border-white/20 shadow-2xl flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[#070b1a]/80 backdrop-blur-md rounded-3xl" />
                  
                  {/* Floating Elements */}
                  <div className="relative z-10 flex flex-col items-center text-center p-6 space-y-4">
                    <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-0.5 shadow-2xl shadow-orange-500/40">
                      <div className="w-full h-full bg-[#0d1226] rounded-[22px] flex items-center justify-center">
                        <Presentation className="w-12 h-12 text-amber-400" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-purple-600 border border-white flex items-center justify-center text-white text-xs font-bold">
                        P
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-white">AI Presentation Bot</h4>
                      <p className="text-xs text-slate-400">Ready to build your next deck</p>
                    </div>

                    <div className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-xs font-mono">
                      <span className="text-amber-400 font-bold">Google Slides Synced</span>
                      <span className="text-emerald-400">● Live</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Stat Badges Under Hero (Matches Image 2) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-white">250+</div>
                  <div className="text-[11px] text-slate-400 font-medium">Presentations Created</div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 fill-emerald-400" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-white">4.9/5</div>
                  <div className="text-[11px] text-slate-400 font-medium">User Rating</div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-white">50K+</div>
                  <div className="text-[11px] text-slate-400 font-medium">Downloads</div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-white">10K+</div>
                  <div className="text-[11px] text-slate-400 font-medium">Pro Users</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions (4 Cards in a row, matches Image 2) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white tracking-tight">Quick Actions</h3>
              <button
                onClick={() => setActiveTab("templates")}
                className="text-xs font-semibold text-purple-400 hover:text-purple-300"
              >
                View All →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Create with AI */}
              <div
                onClick={() => {
                  setActiveTab("wizard");
                  setWizardStep(1);
                }}
                className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/30 via-[#10142e] to-[#0c1024] border border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer group shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                  Create with AI
                </h4>
                <p className="text-xs text-slate-400">Generate in seconds</p>
              </div>

              {/* 2. Start from Template */}
              <div
                onClick={() => setActiveTab("templates")}
                className="p-5 rounded-2xl bg-gradient-to-br from-blue-900/30 via-[#10142e] to-[#0c1024] border border-blue-500/30 hover:border-blue-400 transition-all cursor-pointer group shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Layout className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                  Start from Template
                </h4>
                <p className="text-xs text-slate-400">Choose a template</p>
              </div>

              {/* 3. Upload Document */}
              <div
                onClick={() => showToast("Upload Document wizard ready (PDF, Word, TXT)")}
                className="p-5 rounded-2xl bg-gradient-to-br from-emerald-900/30 via-[#10142e] to-[#0c1024] border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer group shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                  Upload Document
                </h4>
                <p className="text-xs text-slate-400">PDF, Word, more</p>
              </div>

              {/* 4. Import from URL */}
              <div
                onClick={() => showToast("URL importer ready (Website to PPT)")}
                className="p-5 rounded-2xl bg-gradient-to-br from-amber-900/30 via-[#10142e] to-[#0c1024] border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer group shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Link2 className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                  Import from URL
                </h4>
                <p className="text-xs text-slate-400">Website to PPT</p>
              </div>
            </div>
          </div>

          {/* Popular Templates Row (Matches Image 2) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white tracking-tight">Popular Templates</h3>
              <button
                onClick={() => setActiveTab("templates")}
                className="text-xs font-semibold text-purple-400 hover:text-purple-300"
              >
                View All Templates →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TEMPLATES_LIST.slice(0, 4).map((tmpl) => {
                const IconC = tmpl.icon;
                return (
                  <div
                    key={tmpl.id}
                    className="rounded-2xl bg-[#0c1126] border border-white/10 hover:border-purple-500/50 transition-all overflow-hidden group shadow-lg flex flex-col justify-between"
                  >
                    {/* Visual Card Top */}
                    <div className={`h-28 bg-gradient-to-br ${tmpl.gradient} p-4 flex flex-col justify-between relative`}>
                      <span className={`self-start text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${tmpl.badgeColor}`}>
                        {tmpl.badge}
                      </span>
                      <div className="self-end w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
                        <IconC className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                          {tmpl.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">{tmpl.slidesCount} Slides</p>
                      </div>

                      <button
                        onClick={() => {
                          setWizardTopic(tmpl.title);
                          setActiveTab("editor");
                          showToast(`Loaded ${tmpl.title}!`);
                        }}
                        className="w-full py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>Use Template</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. VIEW: WIZARD (Matches Top Right in Image 2)                             */}
      {/* ========================================================================= */}
      {activeTab === "wizard" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <button
              onClick={() => setActiveTab("hub")}
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <button
              onClick={() => showToast("Draft saved successfully!")}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300"
            >
              Saved Drafts
            </button>
          </div>

          {/* Stepper Header */}
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 text-purple-400 text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Create Your AI Presentation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Follow the steps to generate your stunning presentation
            </h2>
          </div>

          {/* Stepper 5-Circles Indicator */}
          <div className="flex items-center justify-center gap-2 sm:gap-6 max-w-2xl mx-auto py-2">
            {[
              { num: 1, label: "Basic Info" },
              { num: 2, label: "Content" },
              { num: 3, label: "Design" },
              { num: 4, label: "Media" },
              { num: 5, label: "Review" }
            ].map((step, idx) => {
              const isActive = step.num === wizardStep;
              const isPast = step.num < wizardStep;
              return (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => setWizardStep(step.num)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isActive
                          ? "bg-purple-600 text-white shadow-lg shadow-purple-600/50 ring-2 ring-purple-400"
                          : isPast
                          ? "bg-emerald-500 text-slate-950"
                          : "bg-white/10 text-slate-400"
                      }`}
                    >
                      {isPast ? <Check className="w-3.5 h-3.5" /> : step.num}
                    </button>
                    <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
                      {step.label}
                    </span>
                  </div>
                  {idx < 4 && <div className="w-4 sm:w-10 h-0.5 bg-white/10 mb-4" />}
                </div>
              );
            })}
          </div>

          {/* Wizard Form Card */}
          <div className="max-w-4xl mx-auto rounded-3xl bg-[#0c1024] border border-white/10 p-6 sm:p-8 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Fields (8 cols) */}
              <div className="lg:col-span-8 space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Basic Information</h3>
                    <p className="text-xs text-slate-400">Tell us about your presentation</p>
                  </div>
                </div>

                {/* Presentation Topic */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      Presentation Topic <span className="text-purple-400">*</span>
                    </label>
                    <span className="text-[10px] text-slate-500">{wizardTopic.length}/100</span>
                  </div>
                  <input
                    type="text"
                    value={wizardTopic}
                    onChange={(e) => setWizardTopic(e.target.value)}
                    placeholder="e.g. AI in Digital Marketing"
                    maxLength={100}
                    className="w-full h-11 px-4 rounded-xl bg-[#070b18] border border-white/15 text-white text-sm focus:outline-none focus:border-purple-400"
                  />
                </div>

                {/* Category & Presentation Type Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Category</label>
                    <select
                      value={wizardCategory}
                      onChange={(e) => setWizardCategory(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-[#070b18] border border-white/15 text-white text-sm focus:outline-none focus:border-purple-400"
                    >
                      <option value="Business">Business</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Education">Education</option>
                      <option value="Finance">Finance</option>
                      <option value="Technology">Technology</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Presentation Type</label>
                    <select
                      value={wizardType}
                      onChange={(e) => setWizardType(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-[#070b18] border border-white/15 text-white text-sm focus:outline-none focus:border-purple-400"
                    >
                      <option value="Pitch Deck">Pitch Deck</option>
                      <option value="Sales Deck">Sales Pitch Deck</option>
                      <option value="Strategy">Strategy Overview</option>
                      <option value="Training">Training & Education</option>
                    </select>
                  </div>
                </div>

                {/* Description Optional */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">Description (Optional)</label>
                    <span className="text-[10px] text-slate-500">{wizardDescription.length}/300</span>
                  </div>
                  <textarea
                    rows={3}
                    value={wizardDescription}
                    onChange={(e) => setWizardDescription(e.target.value)}
                    placeholder="Add more details about your presentation goals, audience, or key milestones..."
                    maxLength={300}
                    className="w-full p-3 rounded-xl bg-[#070b18] border border-white/15 text-white text-sm focus:outline-none focus:border-purple-400 resize-none"
                  />
                </div>

                {/* Number of Slides Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Number of Slides</label>
                  <div className="flex flex-wrap items-center gap-2">
                    {[5, 10, 15, 20].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setWizardSlideCount(count)}
                        className={`w-12 h-10 rounded-xl text-xs font-bold transition-all ${
                          wizardSlideCount === count
                            ? "bg-purple-600 text-white shadow-md shadow-purple-600/40 ring-2 ring-purple-400"
                            : "bg-[#070b18] border border-white/10 text-slate-300 hover:border-white/30"
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setWizardSlideCount(12)}
                      className="px-3 h-10 rounded-xl text-xs font-semibold bg-[#070b18] border border-white/10 text-slate-400 hover:text-white"
                    >
                      Custom
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side Illustration Card */}
              <div className="lg:col-span-4 rounded-2xl bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-transparent border border-white/10 p-6 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400">
                  <Presentation className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Let&apos;s create something amazing!</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    AI will automatically structure, format, and style all {wizardSlideCount} slides based on your input.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => setActiveTab("hub")}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFromWizard}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold transition-all shadow-lg flex items-center gap-2"
              >
                <span>Next: Generate Presentation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VIEW: SLIDE STUDIO / EDITOR (Matches Bottom Left in Image 2)            */}
      {/* ========================================================================= */}
      {activeTab === "editor" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Top Bar (Matches Image 2 Editor Bar) */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#0c1024] border border-white/10 shadow-lg">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab("hub")}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
                title="Back to Hub"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-white">
                  {activeSlide.title}
                </span>
                <Edit3 className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-white" />
              </div>

              {/* Undo / Redo */}
              <div className="hidden sm:flex items-center gap-1 pl-3 border-l border-white/10 text-slate-400">
                <button
                  onClick={() => showToast("Undo")}
                  className="p-1.5 hover:text-white hover:bg-white/5 rounded-lg"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => showToast("Redo")}
                  className="p-1.5 hover:text-white hover:bg-white/5 rounded-lg"
                >
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast("Live slide preview opened")}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Preview</span>
              </button>

              <button
                onClick={() => showToast("Slide saved to cloud!")}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-emerald-400" />
                <span>Save</span>
              </button>

              <button
                onClick={() => showToast("Downloading PowerPoint & Google Slides package...")}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-xs font-bold text-white flex items-center gap-1.5 shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download ▾</span>
              </button>
            </div>
          </div>

          {/* Editor Workspace 3 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column: Slides Strip (2.5 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Slides ({slides.length})
                </span>
                <button
                  onClick={handleAddSlide}
                  className="px-2 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white text-[11px] font-bold transition-all flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </div>

              <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1 custom-scrollbar">
                {slides.map((s, idx) => {
                  const isActive = idx === activeSlideIndex;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isActive
                          ? "bg-purple-900/30 border-purple-400 shadow-md ring-1 ring-purple-400"
                          : "bg-[#0c1024] border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1.5">
                        <span className="font-bold text-white">#{idx + 1}</span>
                        <span className="line-clamp-1">{s.tag}</span>
                      </div>
                      <div className="h-14 rounded-lg bg-[#070b18] border border-white/5 p-1.5 flex flex-col justify-between overflow-hidden">
                        <div className="text-[10px] font-bold text-slate-200 line-clamp-1">
                          {s.title}
                        </div>
                        <div className="flex items-center justify-between text-[8px] text-slate-500">
                          <span>16:9</span>
                          <span className="text-purple-400">{s.statNumber}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Center Canvas: 16:9 Widescreen (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="w-full aspect-[16/9] rounded-3xl bg-gradient-to-br from-[#0c1126] via-[#090e1f] to-[#12102b] border border-purple-500/30 p-6 sm:p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                {/* Glow lights */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Top of Slide */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-orange-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                      D
                    </div>
                    <span className="text-xs font-extrabold tracking-tight text-white">
                      DhandaGrow
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-400/20">
                    {activeSlide.tag}
                  </span>
                </div>

                {/* Main Headline & Graphic */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-auto">
                  <div className="md:col-span-8 space-y-3">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                      {activeSlide.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium">
                      {activeSlide.subtitle}
                    </p>

                    <div className="space-y-2 pt-2">
                      {activeSlide.bullets.map((b, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3D Laptop / AI Graphic on Right (Matches Image 2 Editor) */}
                  <div className="md:col-span-4 flex items-center justify-center">
                    <div className="w-full max-w-[180px] aspect-square rounded-2xl bg-gradient-to-tr from-purple-600/20 to-blue-600/20 border border-white/10 p-3 flex flex-col items-center justify-center text-center space-y-2 shadow-xl">
                      <Laptop className="w-12 h-12 text-purple-400" />
                      <div className="text-[10px] font-mono text-slate-300">AI Engine 3.0</div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-purple-500/30 text-purple-200">
                        HD 1080p
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Feature Pills */}
                <div className="relative z-10 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {activeSlide.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[11px] font-semibold text-slate-300 flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        {feat}
                      </span>
                    ))}
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">
                    Slide {activeSlideIndex + 1} of {slides.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Inspector Panel (Design / Insert / Animate) (2.5 cols) */}
            <div className="lg:col-span-3 rounded-2xl bg-[#0c1024] border border-white/10 p-4 space-y-4 shadow-lg">
              {/* Tabs: Design | Insert | Animate (Matches Image 2) */}
              <div className="flex items-center border-b border-white/10 pb-2 text-xs font-semibold">
                <button className="flex-1 text-center py-1 text-purple-400 border-b-2 border-purple-400 font-bold">
                  Design
                </button>
                <button
                  onClick={() => showToast("Insert assets panel")}
                  className="flex-1 text-center py-1 text-slate-400 hover:text-white"
                >
                  Insert
                </button>
                <button
                  onClick={() => showToast("Animations panel")}
                  className="flex-1 text-center py-1 text-slate-400 hover:text-white"
                >
                  Animate
                </button>
              </div>

              {/* Theme Thumbnails */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "modern", name: "Modern", color: "from-purple-600 to-indigo-600" },
                    { id: "corporate", name: "Corporate", color: "from-blue-600 to-cyan-600" },
                    { id: "minimal", name: "Minimal", color: "from-emerald-600 to-teal-600" }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setSelectedTheme(t.id);
                        showToast(`Theme updated to ${t.name}`);
                      }}
                      className={`h-12 rounded-xl bg-gradient-to-br ${t.color} border transition-all text-[10px] font-bold text-white flex items-end p-1.5 ${
                        selectedTheme === t.id
                          ? "border-white ring-2 ring-purple-400"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Palette */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Color Palette</label>
                <div className="flex items-center gap-2">
                  {["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ec4899"].map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        showToast("Slide accent color updated");
                      }}
                      style={{ backgroundColor: color }}
                      className={`w-6 h-6 rounded-full transition-all ${
                        selectedColor === color ? "ring-2 ring-white scale-110" : "opacity-80 hover:opacity-100"
                      }`}
                      aria-label={`Color ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Font Family */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Font Family</label>
                <select
                  value={fontFamily}
                  onChange={(e) => {
                    setFontFamily(e.target.value);
                    showToast(`Font changed to ${e.target.value}`);
                  }}
                  className="w-full h-9 px-3 rounded-xl bg-[#070b18] border border-white/15 text-white text-xs focus:outline-none focus:border-purple-400"
                >
                  <option value="Poppins">Poppins</option>
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Outfit">Outfit</option>
                </select>
              </div>

              {/* Slide Size */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Slide Size</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-[#070b18] border border-white/15 text-white text-xs focus:outline-none focus:border-purple-400"
                >
                  <option value="16:9">16:9 (Widescreen HD)</option>
                  <option value="4:3">4:3 (Standard)</option>
                  <option value="A4">A4 Print</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. VIEW: TEMPLATES LIBRARY (Matches Bottom Right in Image 2)               */}
      {/* ========================================================================= */}
      {activeTab === "templates" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-purple-400" />
                <span>Presentation Templates Library</span>
              </h2>
              <p className="text-xs text-slate-400">
                Browse our professionally curated presentation templates for Indian commerce & startups.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
                placeholder="Search templates..."
                className="w-full h-10 pl-9 pr-4 rounded-xl bg-[#0c1024] border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          {/* Category Filter Pills (Matches Image 2: All, Business, Education, Marketing, Finance, Technology) */}
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
            {[
              "All Templates",
              "Business",
              "Education",
              "Marketing",
              "Finance",
              "Technology",
              "Management",
              "Design"
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setTemplateFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  templateFilter === cat
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "bg-white/5 hover:bg-white/10 text-slate-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Templates Grid (8 Cards, matches Bottom Right in Image 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredTemplates.map((tmpl) => {
              const IconComp = tmpl.icon;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => {
                    setWizardTopic(tmpl.title);
                    setWizardCategory(tmpl.category);
                    setActiveTab("editor");
                    showToast(`Loaded ${tmpl.title}!`);
                  }}
                  className="rounded-2xl bg-[#0c1126] border border-white/10 hover:border-purple-500/50 transition-all overflow-hidden cursor-pointer group shadow-xl flex flex-col justify-between"
                >
                  {/* Card Visual Header */}
                  <div className={`h-36 bg-gradient-to-br ${tmpl.gradient} p-4 flex flex-col justify-between relative`}>
                    <span className={`self-start text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${tmpl.badgeColor}`}>
                      {tmpl.badge}
                    </span>
                    <div className="self-end w-9 h-9 rounded-xl bg-black/40 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                        {tmpl.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                        <span>{tmpl.category}</span>
                        <span>{tmpl.slidesCount} Slides</span>
                      </div>
                    </div>

                    <button className="w-full py-2 rounded-xl bg-purple-600/20 group-hover:bg-purple-600 text-purple-300 group-hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                      <span>Use Template</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
