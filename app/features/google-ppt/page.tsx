'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Presentation,
  Sparkles,
  ArrowRight,
  Download,
  Check,
  Zap,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Wand2,
  FileSpreadsheet,
  Palette,
  Layout,
  Globe2,
  Layers,
  BarChart3,
  Languages,
  Users,
  Plus,
  Minus
} from 'lucide-react';

interface SlideItem {
  slideNumber: number;
  tabTitle: string;
  tag: string;
  title: string;
  subtitle: string;
  bulletPoints: string[];
  stat: string;
  statLabel: string;
  statColor?: string;
}

interface SampleDeck {
  id: string;
  label: string;
  icon: string;
  isCountryBadge?: boolean;
  topic: string;
  fileName: string;
  badgeClass: string;
  slides: SlideItem[];
}

const sampleDecks: SampleDeck[] = [
  {
    id: 'startup',
    label: 'Startup Pitch Deck',
    icon: '🚀',
    topic: 'Investor Pitch Deck for DhandaGrow AI Platform',
    fileName: 'DhandaGrow_Business_Pitch_Deck.gslides',
    badgeClass: 'bg-[#FFE8D6] text-amber-950 border-amber-300 hover:bg-[#FED7B2]',
    slides: [
      {
        slideNumber: 1,
        tabTitle: '01. Overview',
        tag: 'Slide 1: Executive Overview',
        title: 'DhandaGrow: AI Growth Platform',
        subtitle: 'Automated Marketing, Social Media & Sales Intelligence for Modern Enterprises',
        bulletPoints: [
          'Comprehensive 360° AI engine tailored for Indian MSMEs & Brands',
          'Instant post creation, video reels, and festival campaigns in regional languages',
          '10x higher organic reach with zero production overhead'
        ],
        stat: '10,000+',
        statLabel: 'Active Businesses Growing',
        statColor: 'text-[#FF6B00]'
      },
      {
        slideNumber: 2,
        tabTitle: '02. Strategy & Market',
        tag: 'Slide 2: Market Opportunity',
        title: '63 Million+ Indian MSMEs Going Digital',
        subtitle: 'Capturing the massive Tier-2 & Tier-3 regional business automation wave',
        bulletPoints: [
          '78% of regional SMBs struggle with consistent design & content creation',
          'Vernacular content drives 3.4x higher engagement across Bharat',
          'All-in-one SaaS subscription replaces 5 fragmented agency tools'
        ],
        stat: '₹4,500 Cr',
        statLabel: 'Serviceable Addressable Market',
        statColor: 'text-[#FF6B00]'
      },
      {
        slideNumber: 3,
        tabTitle: '03. ROI & Roadmap',
        tag: 'Slide 3: Traction & 12-Month Roadmap',
        title: '3.2x QoQ Revenue Growth & Expansion',
        subtitle: 'Scaling from 10,000 paid merchants to 100,000+ across 12 languages',
        bulletPoints: [
          '84% monthly retention driven by daily festival & sales workflows',
          'Launching native Google Slides & WhatsApp CRM automation suite',
          'Raising Seed+ round to expand enterprise & agency partnerships'
        ],
        stat: '84%',
        statLabel: 'Net Monthly User Retention',
        statColor: 'text-[#FF6B00]'
      }
    ]
  },
  {
    id: 'b2b',
    label: 'B2B Sales Proposal',
    icon: '💼',
    topic: 'Enterprise AI & Marketing Automation Proposal for Retail Chains',
    fileName: 'Retail_B2B_Sales_Proposal.gslides',
    badgeClass: 'bg-[#F3F4F8] text-slate-700 border-slate-200 hover:bg-slate-200/70',
    slides: [
      {
        slideNumber: 1,
        tabTitle: '01. Overview',
        tag: 'Slide 1: Executive Summary',
        title: 'Omnichannel Growth Proposal',
        subtitle: 'Automated Customer Engagement & Regional Marketing Engine',
        bulletPoints: [
          'Centralized brand assets with multi-store local campaign personalization',
          'Automated WhatsApp and SMS re-engagement bots for repeat footfall',
          'Direct integration with existing POS and billing software'
        ],
        stat: '3.6x',
        statLabel: 'Customer Retention Lift',
        statColor: 'text-[#FF6B00]'
      },
      {
        slideNumber: 2,
        tabTitle: '02. Rollout Timeline',
        tag: 'Slide 2: Implementation Plan',
        title: 'Retail Turnaround Timelines',
        subtitle: 'From Onboarding to First Store Campaign in Under 5 Days',
        bulletPoints: [
          'Day 1-2: Store catalog sync and brand color profile setup',
          'Day 3-4: Staff training and automated customer segment mapping',
          'Day 5+: Automated festive campaigns live across 12 outlets'
        ],
        stat: '5 Days',
        statLabel: 'Full Multi-Store Rollout',
        statColor: 'text-[#FF6B00]'
      },
      {
        slideNumber: 3,
        tabTitle: '03. Value & Pricing',
        tag: 'Slide 3: Commercial Proposal',
        title: 'Enterprise Tier & ROI Projections',
        subtitle: 'Flexible Multi-Location Licensing with Zero Infrastructure Lock-In',
        bulletPoints: [
          'Single unified dashboard overseeing inventory marketing for all outlets',
          'Dedicated enterprise support and SLA-guaranteed content rendering',
          'Zero setup fees with flexible quarterly and annual billing options'
        ],
        stat: '99.8%',
        statLabel: 'SLA Reliability Score',
        statColor: 'text-[#FF6B00]'
      }
    ]
  },
  {
    id: 'marketing',
    label: 'Marketing Strategy',
    icon: '📉',
    topic: 'Q4 Festive Season Omnichannel Marketing Strategy for D2C Brands',
    fileName: 'D2C_Q4_Marketing_Strategy.gslides',
    badgeClass: 'bg-[#F0F2FF] text-indigo-800 border-indigo-200 hover:bg-indigo-100/70',
    slides: [
      {
        slideNumber: 1,
        tabTitle: '01. Festive Playbook',
        tag: 'Slide 1: Campaign Overview',
        title: 'Diwali & Q4 Peak Festive Playbook',
        subtitle: 'Capturing High-Intent Indian Shoppers Across Tier 2 & 3 Cities',
        bulletPoints: [
          'Hyper-localized video reels in Hindi, Gujarati, Marathi & Bengali',
          'Flash sale triggers synchronized with payday weekends and Dhanteras',
          'Dynamic AI product photoshoot cards boosting CTR by 62%'
        ],
        stat: '62%',
        statLabel: 'Higher Ad Click-Through Rate',
        statColor: 'text-[#FF6B00]'
      },
      {
        slideNumber: 2,
        tabTitle: '02. Budget & ROAS',
        tag: 'Slide 2: Budget & ROI Model',
        title: 'Channel Budget Allocation',
        subtitle: 'Maximizing Return on Ad Spend (ROAS) Across Meta & Google',
        bulletPoints: [
          '50% Meta Reels & Stories for viral festive discovery',
          '30% Google Search & Shopping for immediate high-intent buyers',
          '20% WhatsApp broadcast automation for loyalty club VIP offers'
        ],
        stat: '4.8x',
        statLabel: 'Target ROAS on Spend',
        statColor: 'text-[#FF6B00]'
      },
      {
        slideNumber: 3,
        tabTitle: '03. Execution Matrix',
        tag: 'Slide 3: Weekly Action Plan',
        title: 'Weekly Sprint & Creative Calendar',
        subtitle: 'Pre-Festive Teasers, Main Festival Blast, and Post-Diwali Clearance',
        bulletPoints: [
          'Pre-Festive: Early-bird gift bundles and coupon code distribution',
          'Festive Week: 24/7 AI conversational ordering bots on WhatsApp & Instagram',
          'Post-Festive: Automated review collection and referral loyalty points'
        ],
        stat: '3.2x',
        statLabel: 'Cart Conversion Surge',
        statColor: 'text-[#FF6B00]'
      }
    ]
  },
  {
    id: 'hindi',
    label: 'हिंदी बिज़नेस रिपोर्ट',
    icon: '🇮🇳',
    isCountryBadge: true,
    topic: 'भारतीय खुदरा व्यापारियों के लिए 2026 की डिजिटल प्रगति रिपोर्ट',
    fileName: 'Bharat_Retail_Digital_Report_Hindi.gslides',
    badgeClass: 'bg-[#F3F4F8] text-slate-700 border-slate-200 hover:bg-slate-200/70',
    slides: [
      {
        slideNumber: 1,
        tabTitle: '01. मुख्य सारांश',
        tag: 'स्लाइड 1: मुख्य सारांश',
        title: 'धंधाग्रो: भारतीय व्यापार का डिजिटल साथी',
        subtitle: 'स्थानीय दुकानों और MSME के लिए आधुनिक AI मार्केटिंग समाधान',
        bulletPoints: [
          'दुकानदारों के लिए बिना किसी एजेंसी के 1 मिनट में पोस्टर और रील्स तैयार',
          'हिंदी और स्थानीय भाषाओं में ग्राहकों को तुरंत व्हाट्सएप ऑफर और बिलिंग',
          'कम लागत में सोशल मीडिया से नए ग्राहकों की भारी संख्या'
        ],
        stat: '10,000+',
        statLabel: 'संतुष्ट भारतीय व्यापारी',
        statColor: 'text-[#FF6B00]'
      },
      {
        slideNumber: 2,
        tabTitle: '02. समस्या व असर',
        tag: 'स्लाइड 2: समस्या और विश्लेषण',
        title: 'पारंपरिक मार्केटिंग की सीमाएं',
        subtitle: 'पर्चे और होर्डिंग के मुकाबले डिजिटल प्रचार क्यों है 5 गुना असरदार',
        bulletPoints: [
          'पर्चे छपवाने और बंटवाने में भारी खर्च और सीमित पहुंच',
          'त्योहारों के मौके पर ग्राहकों तक समय पर न पहुंच पाने का नुकसान',
          'ऑनलाइन ऑर्डर्स और पेमेंट ट्रैकिंग की आसान सुविधा का अभाव'
        ],
        stat: '70%',
        statLabel: 'प्रचार खर्च में भारी बचत',
        statColor: 'text-[#FF6B00]'
      },
      {
        slideNumber: 3,
        tabTitle: '03. लाभ व नतीजे',
        tag: 'स्लाइड 3: डिजिटल परिणाम',
        title: 'व्यापारियों को मिलने वाला सीधा फायदा',
        subtitle: 'हर महीने ₹25,000 से अधिक की बचत और नए ग्राहकों की निरंतर आवक',
        bulletPoints: [
          'मोबाइल से 2 मिनट में आकर्षक व्यापारिक पोस्टर व स्टेटस बनाएं',
          'त्योहारों व विशेष अवसरों पर स्वतः तैयार होने वाले पोस्ट',
          'ग्राहक से सीधे व्हाट्सएप पर जुड़कर बिक्री बढ़ाने की तकनीक'
        ],
        stat: '5 गुना',
        statLabel: 'डिजिटल पहुंच में वृद्धि',
        statColor: 'text-[#FF6B00]'
      }
    ]
  }
];

interface TemplateCardItem {
  id: string;
  category: 'startup' | 'sales' | 'reports';
  slideCount: string;
  badgeRight: string;
  badgeRightClass?: string;
  gradientClass: string;
  categorySubtitle: string;
  subtitleClass?: string;
  bannerTitle: string;
  title: string;
  description: string;
}

const templateDecks: TemplateCardItem[] = [
  {
    id: 'deck-1',
    category: 'startup',
    slideCount: '12 SLIDES',
    badgeRight: 'GOOGLE SLIDES',
    gradientClass: 'bg-gradient-to-br from-[#FF5E62] via-[#FF6B00] to-[#E11D48]',
    categorySubtitle: 'Series A / Seed',
    bannerTitle: 'Investor Pitch Deck',
    title: 'Startup Investor Pitch Deck',
    description: 'Includes Problem, Solution, TAM/SAM/SOM Market Size, Business Model, Traction, and Funding Ask slides.'
  },
  {
    id: 'deck-2',
    category: 'sales',
    slideCount: '10 SLIDES',
    badgeRight: 'PPTX + GSLIDES',
    badgeRightClass: 'bg-amber-400/20 text-amber-300 border border-amber-300/30',
    gradientClass: 'bg-[#151D2A]',
    categorySubtitle: 'High-Converting',
    subtitleClass: 'text-amber-400',
    bannerTitle: 'B2B Sales Proposal',
    title: 'B2B Client Sales Proposal',
    description: 'Structured to close enterprise & MSME deals with pain-point diagnosis, ROI calculator, case studies, and pricing tiers.'
  },
  {
    id: 'deck-3',
    category: 'reports',
    slideCount: '8 SLIDES',
    badgeRight: 'HINDI & ENGLISH',
    gradientClass: 'bg-gradient-to-br from-[#FF7A00] via-[#FF9900] to-[#FF5E00]',
    categorySubtitle: 'Monthly / Quarterly',
    bannerTitle: 'Business Growth Review',
    title: 'Quarterly Business Review (QBR)',
    description: 'Present revenue growth, sales team KPIs, regional performance, and next quarter targets in clean visual slides.'
  },
  {
    id: 'deck-4',
    category: 'sales',
    slideCount: '9 SLIDES',
    badgeRight: 'GOOGLE SLIDES',
    gradientClass: 'bg-gradient-to-br from-[#7C3AED] via-[#C026D3] to-[#DB2777]',
    categorySubtitle: 'Go-To-Market',
    bannerTitle: 'Social & Digital Campaign',
    title: 'Marketing & Festival Campaign',
    description: 'Complete campaign roadmap covering audience personas, Instagram/YouTube funnel, ad budget split, and expected ROAS.'
  },
  {
    id: 'deck-5',
    category: 'startup',
    slideCount: '11 SLIDES',
    badgeRight: 'PPTX + GSLIDES',
    gradientClass: 'bg-gradient-to-br from-[#EA580C] via-[#DC2626] to-[#E11D48]',
    categorySubtitle: 'New Feature / App',
    bannerTitle: 'Product Launch Deck',
    title: 'Product Launch Keynote',
    description: 'Showcase product features, competitive edge, customer testimonials, and launch timeline with bold hero slides.'
  },
  {
    id: 'deck-6',
    category: 'reports',
    slideCount: '10 SLIDES',
    badgeRight: '8+ LANGUAGES',
    gradientClass: 'bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-[#C026D3]',
    categorySubtitle: 'Training & Seminar',
    bannerTitle: 'Workshop & Course Deck',
    title: 'Training & Educational Slides',
    description: 'Ideal for teachers, coaches, and corporate trainers to create structured lesson modules, diagrams, and quiz slides.'
  }
];

const faqs = [
  {
    question: 'Can I directly open and edit generated presentations in Google Slides?',
    answer: 'Yes! DhandaGrow generates 100% native Google Slides presentations. You can export them directly to your Google Drive with a single click, or download them as standard .pptx files that work seamlessly with Google Slides and Microsoft PowerPoint. Every text box, image, chart, and layout remains fully editable.'
  },
  {
    question: 'Can I generate Google PPT slides in Hindi, Hinglish, or regional Indian languages?',
    answer: 'Absolutely. DhandaGrow is built natively for Indian businesses. You can create complete decks in Hindi, Hinglish, Gujarati, Marathi, Bengali, Tamil, Telugu, and English. The AI understands regional business contexts, local idioms, and festive nuances.'
  },
  {
    question: 'What types of presentations can DhandaGrow AI create?',
    answer: 'You can generate investor pitch decks, B2B sales proposals, marketing campaign strategies, quarterly business reviews (QBRs), product launch keynotes, training modules, and educational webinars. Just provide a brief topic or prompt, and DhandaGrow structures the entire presentation.'
  },
  {
    question: 'Does it automatically apply my company logo and brand colors?',
    answer: "Yes. With DhandaGrow's Brand Brain feature, your logo, brand color palettes, fonts, and visual guidelines are automatically applied across every slide, ensuring complete enterprise brand consistency without manual formatting."
  },
  {
    question: 'Is DhandaGrow Google PPT generator free to try?',
    answer: 'Yes, you can generate and preview Google PPT decks for free. Download the DhandaGrow mobile or desktop app to start creating and exporting unlimited presentations today.'
  }
];

export default function GooglePPTPage() {
  const [selectedDeckId, setSelectedDeckId] = useState<string>('startup');
  const [prompt, setPrompt] = useState<string>('');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const activeDeck = sampleDecks.find((d) => d.id === selectedDeckId) || sampleDecks[0];
  const activeSlide = activeDeck.slides[currentSlideIndex] || activeDeck.slides[0];

  const filteredTemplates = selectedCategory === 'all'
    ? templateDecks
    : templateDecks.filter((d) => d.category === selectedCategory);

  const handleSelectDeck = (deck: SampleDeck) => {
    setSelectedDeckId(deck.id);
    setCurrentSlideIndex(0);
  };

  const handlePreviewClick = () => {
    const previewEl = document.getElementById('slide-preview-container');
    if (previewEl) {
      previewEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

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

          <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-8 font-medium max-w-2xl mx-auto">
            Generate complete business presentations, investor pitch decks, and sales slides in seconds. Fully editable and exportable directly to Google Slides and Microsoft PowerPoint.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-5">
            <button
              type="button"
              onClick={handlePreviewClick}
              className="inline-flex items-center gap-2.5 h-13 px-8 text-base rounded-full bg-gradient-to-r from-[#FF6B00] via-[#E11D48] to-[#9333EA] text-white font-bold shadow-[0_12px_30px_-6px_rgba(255,107,0,0.45)] hover:shadow-[0_16px_36px_-6px_rgba(255,107,0,0.55)] select-none cursor-pointer hover:opacity-95 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200" />
              <span>Generate Google PPT Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-13 px-8 text-base rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold shadow-xs"
            >
              <Link href="/download">
                Get the App
              </Link>
            </Button>
          </div>

          {/* Checkmarks Line */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-8 text-xs sm:text-sm text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold text-sm">✓</span>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold text-sm">✓</span>
              <span>100% Editable in Google Slides</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold text-sm">✓</span>
              <span>Supports Hindi, Hinglish & English</span>
            </div>
          </div>

          {/* Interactive Topic Generator Input Box */}
          <div className="w-full max-w-4xl mx-auto rounded-3xl border border-orange-200/80 bg-white shadow-[0_15px_40px_-15px_rgba(255,107,0,0.08)] p-3 sm:p-5 mb-8 text-left">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePreviewClick();
              }}
              className="flex items-center gap-2 sm:gap-3 rounded-2xl border border-slate-200/90 bg-white px-3 sm:px-4 py-1.5 sm:py-2 shadow-2xs focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200/50 transition-all"
            >
              <Zap className="w-5 h-5 text-amber-500 shrink-0 fill-amber-500/20" />
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter any topic (e.g., Investor Pitch Deck for Solar Startup in Jaipur)..."
                className="flex-1 min-w-0 bg-transparent border-0 outline-none text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 font-medium"
              />
              <button
                type="submit"
                className="shrink-0 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-[#090F1E] hover:bg-[#151f38] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
              >
                <span>Preview Slides</span>
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
              </button>
            </form>

            {/* Sample Decks Chips */}
            <div className="flex flex-wrap items-center gap-2 mt-3.5 sm:mt-4 pt-1">
              <span className="text-xs sm:text-[13px] text-slate-500 font-medium shrink-0 mr-1">
                Try sample decks:
              </span>
              {sampleDecks.map((deck) => {
                const isSelected = selectedDeckId === deck.id;
                return (
                  <button
                    key={deck.id}
                    type="button"
                    onClick={() => handleSelectDeck(deck)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-2xs active:scale-95',
                      isSelected
                        ? 'bg-[#FFE8D6] text-amber-950 border-amber-300 ring-2 ring-amber-200/50'
                        : deck.badgeClass
                    )}
                  >
                    {deck.isCountryBadge ? (
                      <span className="text-[10px] font-black px-1 py-0.2 rounded bg-slate-200/90 text-slate-700">IN</span>
                    ) : (
                      <span className="text-xs">{deck.icon}</span>
                    )}
                    <span>{deck.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Slide Deck Preview Container (Matching User Screenshot Exactly) */}
          <div
            id="slide-preview-container"
            className="w-full max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden text-left"
          >
            {/* Top Bar simulating Google Slides UI */}
            <div className="px-5 sm:px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-500 shrink-0">
                  <Presentation className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                    <span>{activeDeck.fileName}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#FFF0D4] text-amber-900 border border-amber-200/60">
                      AI SYNCED
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Exportable to Google Slides & PPTX • 16:9 Widescreen
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm font-medium text-slate-500 whitespace-nowrap">
                  Slide {currentSlideIndex + 1} of {activeDeck.slides.length}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : activeDeck.slides.length - 1))}
                    className="w-7 h-7 rounded-full border border-slate-200/80 bg-white flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer shadow-2xs"
                    aria-label="Previous Slide"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCurrentSlideIndex((prev) => (prev < activeDeck.slides.length - 1 ? prev + 1 : 0))}
                    className="w-7 h-7 rounded-full border border-slate-200/80 bg-white flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer shadow-2xs"
                    aria-label="Next Slide"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Slide Body */}
            <div className="p-6 sm:p-10 bg-white min-h-[330px] flex flex-col justify-between relative">
              <div>
                {/* Tag pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF7EB] border border-amber-200/70 text-amber-900 text-xs font-semibold mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{activeSlide.tag}</span>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-slate-900 tracking-tight leading-tight mb-2">
                  {activeSlide.title}
                </h2>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-slate-500 font-medium mb-6 leading-relaxed">
                  {activeSlide.subtitle}
                </p>

                {/* Bullet Points */}
                <div className="space-y-3.5 max-w-2xl">
                  {activeSlide.bulletPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#FFEADA] text-[#FF6B00] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[2.8]" />
                      </div>
                      <span className="text-sm sm:text-[15px] text-slate-700 font-medium leading-snug">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Stat Bar & Action Buttons */}
              <div className="pt-8 mt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-baseline gap-2">
                  <span className={cn('text-3xl sm:text-4xl font-black tracking-tight', activeSlide.statColor || 'text-[#FF6B00]')}>
                    {activeSlide.stat}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-500 font-medium">
                    {activeSlide.statLabel}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="h-10 px-4 rounded-full border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm shadow-2xs"
                  >
                    <Link href="/download">
                      Download .PPTX
                    </Link>
                  </Button>

                  <Button
                    asChild
                    size="sm"
                    className="h-10 px-5 rounded-full bg-[#0a0f1d] hover:bg-slate-900 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5"
                  >
                    <Link href="/download">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in Google Slides</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Bottom Tabs Strip (Matching User Screenshot Exactly) */}
            <div className="px-5 sm:px-6 py-3 bg-[#FBFBFC] border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                {activeDeck.slides.map((slide, idx) => {
                  const isActive = currentSlideIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={cn(
                        'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer',
                        isActive
                          ? 'border border-orange-300 bg-[#FFF3E8] text-orange-950 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-900'
                      )}
                    >
                      {slide.tabTitle}
                    </button>
                  );
                })}
              </div>

              <span className="text-[11px] sm:text-xs text-slate-400 font-normal">
                Click arrows or tabs to preview deck
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Simple 3-Step Workflow Section (Matching User Design Exactly) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#FFF0E6] border border-[#FFE0CC] text-[#FF6B00] text-xs font-bold uppercase tracking-wider mb-5 shadow-2xs">
          SIMPLE 3-STEP WORKFLOW
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] mb-4">
          From Idea to Google Slides in{' '}
          <span className="text-[#FF6B00]">30</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF5E62] to-[#E11D48]">
            Seconds
          </span>
        </h2>

        <p className="max-w-xl mx-auto text-slate-500 sm:text-slate-600 text-sm sm:text-base leading-relaxed mb-12 sm:mb-16 font-medium">
          No formatting headaches, no blank-slide anxiety. Just type what you need and export ready-to-present slides.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto text-left">
          {/* Step 1 */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-7 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgba(255,107,0,0.06)] hover:border-orange-200/80 transition-all">
            <div className="w-10 h-10 rounded-xl border border-amber-300 bg-amber-50/70 flex items-center justify-center text-amber-700 font-bold text-sm mb-6">
              01
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-3 tracking-tight">
              Enter Topic or Paste Notes
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Type a one-line prompt, paste rough meeting bullet points, or choose from 50+ Indian & global business deck structures.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-7 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgba(255,107,0,0.06)] hover:border-orange-200/80 transition-all">
            <div className="w-10 h-10 rounded-xl border border-pink-300 bg-pink-50/70 flex items-center justify-center text-pink-600 font-bold text-sm mb-6">
              02
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-3 tracking-tight">
              AI Writes & Designs Slides
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              DhandaGrow AI structures your narrative, writes persuasive slide copy, adds KPI callouts, and applies clean visual hierarchy automatically.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-7 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgba(255,107,0,0.06)] hover:border-orange-200/80 transition-all">
            <div className="w-10 h-10 rounded-xl border border-amber-300 bg-amber-50/70 flex items-center justify-center text-amber-600 font-bold text-sm mb-6">
              03
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-3 tracking-tight">
              1-Click Export to Google PPT
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Open directly in <strong className="font-semibold text-slate-900">Google Slides</strong> or download as a standard <strong className="font-semibold text-slate-900">.PPTX</strong> file. Every text box, chart, and shape stays 100% editable.
            </p>
          </div>
        </div>
      </section>

      {/* Why Create Presentations Section (Matching User Image Exactly) */}
      <section className="py-20 sm:py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4 leading-tight">
              Why create presentations with
              <br className="hidden sm:inline" /> DhandaGrow Google PPT?
            </h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
              Transform a single business idea or product description into fully formatted, persuasive slide decks ready to present or export.
            </p>
          </div>

          {/* Top Row: 4 Vertical Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-6">
            {/* Card 1: Google Slides Native */}
            <div className="bg-white rounded-3xl border border-amber-200/70 p-6 sm:p-7 shadow-[0_8px_25px_rgba(255,180,0,0.04)] hover:shadow-md transition-all text-left flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-500 mb-6">
                  <Presentation className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2.5 tracking-tight">
                  Google Slides Native
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed font-normal">
                  Export directly to your Google Drive as editable Google Slides or download as standard .pptx files in 1 click.
                </p>
              </div>
            </div>

            {/* Card 2: Automated Brand Kit */}
            <div className="bg-white rounded-3xl border border-orange-200/70 p-6 sm:p-7 shadow-[0_8px_25px_rgba(255,107,0,0.04)] hover:shadow-md transition-all text-left flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-orange-500 mb-6">
                  <Palette className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2.5 tracking-tight">
                  Automated Brand Kit
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed font-normal">
                  Applies your company&apos;s brand logo, colors, typography, and visual assets across every slide automatically.
                </p>
              </div>
            </div>

            {/* Card 3: Vernacular & Regional */}
            <div className="bg-white rounded-3xl border border-rose-200/70 p-6 sm:p-7 shadow-[0_8px_25px_rgba(244,63,94,0.04)] hover:shadow-md transition-all text-left flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-500 mb-6">
                  <Languages className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2.5 tracking-tight">
                  Vernacular & Regional
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed font-normal">
                  Generate presentations in English, Hindi, Hinglish, Marathi, Gujarati, Bengali, Tamil, and 8+ regional languages.
                </p>
              </div>
            </div>

            {/* Card 4: Instant Pitch Decks */}
            <div className="bg-white rounded-3xl border border-amber-200/70 p-6 sm:p-7 shadow-[0_8px_25px_rgba(255,180,0,0.04)] hover:shadow-md transition-all text-left flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-500 mb-6">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2.5 tracking-tight">
                  Instant Pitch Decks
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed font-normal">
                  Pre-trained templates for investor decks, client proposals, product launches, and monthly business reviews.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Row: 3 Horizontal Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {/* Card 5: Smart Charts & Tables */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-sm transition-all flex items-start gap-3.5 text-left">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-500 shrink-0 mt-0.5">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Smart Charts & Tables
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Turn raw numbers into clean comparison tables, growth timelines, and KPI cards.
                </p>
              </div>
            </div>

            {/* Card 6: AI Slide Rewriter & Expand */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-sm transition-all flex items-start gap-3.5 text-left">
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-500 shrink-0 mt-0.5">
                <Wand2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  AI Slide Rewriter & Expand
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Shorten bulky paragraphs into crisp bullet points or regenerate any single slide.
                </p>
              </div>
            </div>

            {/* Card 7: Team Sharing & Co-Editing */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-sm transition-all flex items-start gap-3.5 text-left">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-500 shrink-0 mt-0.5">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Team Sharing & Co-Editing
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Share Google Slides links directly with co-founders, clients, and sales teams.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready-to-Use Decks Section (Matching User Image Exactly) */}
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-14">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#FF4D6D] mb-2.5">
              READY-TO-USE DECKS
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-[40px] font-black tracking-tight text-slate-900 leading-tight">
              Built for Every Business Goal
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Decks' },
              { id: 'startup', label: 'Startup & Funding' },
              { id: 'sales', label: 'Sales & Marketing' },
              { id: 'reports', label: 'Reports & Education' }
            ].map((tab) => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={cn(
                    'px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs',
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6 Decks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredTemplates.map((deck) => (
            <div
              key={deck.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-orange-200/80 transition-all flex flex-col justify-between text-left group"
            >
              <div>
                {/* Visual Slide Banner */}
                <div
                  className={cn(
                    'h-40 sm:h-44 rounded-2xl p-5 text-white flex flex-col justify-between relative overflow-hidden mb-5 shadow-xs transition-transform duration-300 group-hover:scale-[1.01]',
                    deck.gradientClass
                  )}
                >
                  {/* Subtle decorative glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 relative z-10">
                    <span className="text-[10px] font-extrabold tracking-wider px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-xs text-white uppercase">
                      {deck.slideCount}
                    </span>
                    <span
                      className={cn(
                        'text-[10px] font-extrabold tracking-wider px-2.5 py-1 rounded-md uppercase backdrop-blur-xs',
                        deck.badgeRightClass || 'bg-white/20 text-white'
                      )}
                    >
                      {deck.badgeRight}
                    </span>
                  </div>

                  {/* Banner Title Block */}
                  <div className="relative z-10">
                    <div
                      className={cn(
                        'text-xs font-semibold mb-1',
                        deck.subtitleClass || 'text-white/80'
                      )}
                    >
                      {deck.categorySubtitle}
                    </div>
                    <div className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug">
                      {deck.bannerTitle}
                    </div>
                  </div>
                </div>

                {/* Card Title & Description */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 tracking-tight">
                  {deck.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed mb-6">
                  {deck.description}
                </p>
              </div>

              {/* Bottom CTA Button */}
              <Link
                href="/download"
                className="w-full py-2.5 px-4 rounded-full border border-orange-200/90 hover:border-orange-400 bg-white hover:bg-orange-50/60 text-[#FF6B00] text-xs font-bold flex items-center justify-center gap-1.5 transition-all text-center shadow-2xs group-hover:shadow-xs"
              >
                <span>Use This Template</span>
                <span className="text-sm font-semibold transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Section (Matching User Image Exactly) */}
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        {/* Pill Badge */}
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#FFF0E6] border border-[#FFE0CC] text-[#FF6B00] text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
          SAVE 95% PRESENTATION TIME
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-12 sm:mb-14">
          Manual Slide Making vs.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF5E62] to-[#FF8C00]">
            DhandaGrow AI
          </span>
        </h2>

        {/* Comparison Table Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-orange-200/80 shadow-[0_15px_40px_rgba(255,107,0,0.05)] overflow-hidden text-left">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-[#FFFDFB]/60">
                  <th className="py-4.5 px-6 sm:px-8 text-xs sm:text-sm font-extrabold text-slate-900 w-[30%]">
                    Feature
                  </th>
                  <th className="py-4.5 px-6 sm:px-8 text-xs sm:text-sm font-extrabold text-slate-600 w-[35%]">
                    Manual Google Slides
                  </th>
                  <th className="py-4.5 px-6 sm:px-8 text-xs sm:text-sm font-extrabold text-[#FF6B00] w-[35%]">
                    DhandaGrow Google PPT AI
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {/* Row 1 */}
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4.5 px-6 sm:px-8 font-bold text-slate-900">
                    Time to Create 10 Slides
                  </td>
                  <td className="py-4.5 px-6 sm:px-8 text-slate-500 font-medium">
                    3 to 5 Hours
                  </td>
                  <td className="py-4.5 px-6 sm:px-8 font-bold text-emerald-600">
                    <span className="inline-flex items-center gap-1.5">
                      <span>Under 45 Seconds</span>
                      <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                    </span>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4.5 px-6 sm:px-8 font-bold text-slate-900">
                    Content & Copywriting
                  </td>
                  <td className="py-4.5 px-6 sm:px-8 text-slate-500 font-medium">
                    Write everything from scratch
                  </td>
                  <td className="py-4.5 px-6 sm:px-8 font-bold text-slate-900">
                    AI-researched & structured
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4.5 px-6 sm:px-8 font-bold text-slate-900">
                    Hindi & Regional Languages
                  </td>
                  <td className="py-4.5 px-6 sm:px-8 text-slate-500 font-medium">
                    Slow manual typing
                  </td>
                  <td className="py-4.5 px-6 sm:px-8 font-bold text-slate-900">
                    Native 1-click generation
                  </td>
                </tr>

                {/* Row 4 */}
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4.5 px-6 sm:px-8 font-bold text-slate-900">
                    Brand Colors & Fonts
                  </td>
                  <td className="py-4.5 px-6 sm:px-8 text-slate-500 font-medium">
                    Manual formatting per slide
                  </td>
                  <td className="py-4.5 px-6 sm:px-8 font-bold text-slate-900">
                    Auto-synced Brand Kit
                  </td>
                </tr>

                {/* Row 5 */}
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4.5 px-6 sm:px-8 font-bold text-slate-900">
                    Google Slides & PPTX Export
                  </td>
                  <td className="py-4.5 px-6 sm:px-8 text-slate-500 font-medium">
                    Built-in
                  </td>
                  <td className="py-4.5 px-6 sm:px-8 font-bold text-emerald-600">
                    100% Editable Native Export
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section (Matching User Image Exactly) */}
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-slate-900 tracking-tight leading-tight mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal mb-10 sm:mb-14">
          Everything you need to know about generating and exporting Google Slides with DhandaGrow AI.
        </p>

        <div className="max-w-3xl mx-auto space-y-3 text-left">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className={cn(
                  'bg-white rounded-2xl border transition-all overflow-hidden shadow-2xs',
                  isOpen
                    ? 'border-orange-300 ring-2 ring-orange-200/40 shadow-xs'
                    : 'border-slate-200/90 hover:border-orange-200/90'
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full py-4.5 px-6 flex items-center justify-between gap-4 text-left cursor-pointer transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {faq.question}
                  </span>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[#FF6B00] shrink-0 font-bold">
                    {isOpen ? (
                      <Minus className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 font-normal leading-relaxed border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Final CTA Section (Matching User Image Exactly) */}
      <section className="py-24 sm:py-32 bg-[#FFF4E8] text-center border-t border-orange-100/80 relative overflow-hidden">
        {/* Soft Background Blur Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-orange-300/15 blur-[90px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Centered Top Icon Squircle */}
          <div className="w-13 h-13 rounded-2xl bg-white border border-orange-200/90 shadow-sm flex items-center justify-center text-[#FF6B00] mb-6 mx-auto">
            <Presentation className="w-6 h-6 stroke-[2.2]" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-black tracking-tight text-slate-900 leading-[1.18] mb-4">
            Build your next presentation in under
            <br />
            60 seconds.
          </h2>

          {/* Subtitle */}
          <p className="text-slate-600 font-medium text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-9">
            Say goodbye to blank slide anxiety. Let AI write, design, and structure your Google PPT decks today.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Button
              asChild
              size="lg"
              className="h-12 px-8 text-sm sm:text-base rounded-full bg-gradient-to-r from-[#FF6B00] via-[#FF5E62] to-[#E11D48] text-white font-bold shadow-[0_10px_25px_-5px_rgba(255,107,0,0.45)] hover:shadow-[0_12px_28px_-5px_rgba(255,107,0,0.55)] hover:opacity-95 transition-all"
            >
              <Link href="/download">
                Start Creating Free
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-8 text-sm sm:text-base rounded-full bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-800 font-semibold shadow-2xs transition-all"
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
