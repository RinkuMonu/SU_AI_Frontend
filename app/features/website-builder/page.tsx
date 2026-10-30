'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { FeatureExpansionSections } from '@/components/FeatureExpansionSections';
import { FeatureShowcaseSection } from '@/components/FeatureShowcaseSection';
import { VoiceInputButton } from '@/components/ui/VoiceInput';
import { 
  Globe, 
  Wand2, 
  Layout, 
  Smartphone, 
  Search, 
  Zap, 
  Code, 
  ArrowRight, 
  Gauge, 
  CheckCircle2, 
  Mic, 
  Send, 
  Palette, 
  ShoppingBag, 
  Download, 
  Maximize2, 
  RotateCcw, 
  Monitor, 
  Tablet, 
  Check, 
  Bot, 
  Sparkles, 
  Lock, 
  ExternalLink,
  MessageCircle,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';

interface WebsitePreset {
  id: string;
  name: string;
  tag: string;
  businessName: string;
  domain: string;
  industry: string;
  city: string;
  primaryColor: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroCta: string;
  heroImage: string;
  chatUserPrompt: string;
  chatAiReply: string;
  items: {
    title: string;
    description: string;
    price: string;
    image: string;
  }[];
}

const websitePresets: WebsitePreset[] = [
  {
    id: 'ethnic-boutique',
    name: 'Ethnic Wear & Boutique',
    tag: '👗 Fashion & Apparel',
    businessName: 'Shyamal & Kumkum Boutique',
    domain: 'shyamal-kumkum.dhandagrow.site',
    industry: 'Royal Banarasi Silk Sarees & Designer Lehengas',
    city: 'Jaipur, Rajasthan',
    primaryColor: '#d97706',
    heroHeadline: 'Royal Banarasi Silk & Handcrafted Bridal Wear',
    heroSubtitle: 'Handwoven heritage sarees, pure Banarasi silk, and custom bridal lehengas crafted for life’s grandest celebrations.',
    heroCta: 'Explore Collection 🛍️',
    heroImage: '/images/royal-ethnic-banner.jpg',
    chatUserPrompt: 'Create a luxury ethnic boutique website for Shyamal & Kumkum in Jaipur. We sell pure Banarasi silk sarees, bridal lehengas, and have a Flat 40% Festive Sale.',
    chatAiReply: 'Done! I generated a royal burgundy & gold storefront with Banarasi showcase, Flat 40% OFF festive banner, and Social direct checkout.',
    items: [
      {
        title: 'Pure Banarasi Katan Silk Saree',
        description: 'Handwoven pure gold zari motifs on crimson silk.',
        price: '₹14,999',
        image: '/images/royal-ethnic-banner.jpg'
      },
      {
        title: 'Heritage Bridal Velvet Lehenga',
        description: 'Intricate zardozi embroidery with double dupatta.',
        price: '₹34,500',
        image: '/images/diwali-festive-banner.jpg'
      },
      {
        title: 'Organza Silk Partywear Saree',
        description: 'Lightweight pastel fabric with scalloped golden border.',
        price: '₹8,499',
        image: '/images/salon-bridal-banner.jpg'
      }
    ]
  },
  {
    id: 'fine-jewellery',
    name: 'Fine Jewellery & Gold',
    tag: '💎 Gold & Diamond',
    businessName: 'Rang Mahals Fine Jewellery',
    domain: 'rangmahals-jewels.dhandagrow.site',
    industry: '22KT BIS Hallmarked Gold & Diamond Jewellery',
    city: 'Surat, Gujarat',
    primaryColor: '#ca8a04',
    heroHeadline: 'Royal Heritage Kundan & 22KT Gold Collection',
    heroSubtitle: 'Auspicious certified jewellery for weddings and festivals. 0% Making charges on festive bookings with insured doorstep delivery.',
    heroCta: 'Book VIP Lounge Slot 🪙',
    heroImage: '/images/jewellery-festive-banner.jpg',
    chatUserPrompt: 'Build a high-end gold jewellery store for Rang Mahals in Surat with 0% making charge offer and BIS Hallmarked bridal sets.',
    chatAiReply: 'Generated! Configured emerald-green velvet theme, 22KT gold collection cards, zero making charge ribbon, and showroom appointment booking.',
    items: [
      {
        title: 'Royal Kundan Choker Set',
        description: '22KT Hallmarked gold with Burmese ruby beads.',
        price: '₹1,25,000',
        image: '/images/jewellery-festive-banner.jpg'
      },
      {
        title: 'Diamond Polki Bridal Necklace',
        description: 'Certified VVS diamonds with uncut diamond polki.',
        price: '₹2,40,000',
        image: '/images/festivals/dhanteras.png'
      },
      {
        title: 'Traditional Gold Temple Jhumkas',
        description: 'Handcrafted Lakshmi motifs in antique matte finish.',
        price: '₹48,900',
        image: '/images/jewellery-festive-banner.jpg'
      }
    ]
  },
  {
    id: 'royal-dining',
    name: 'Restaurant & Dining',
    tag: '🍛 Food & Restaurant',
    businessName: 'Dawat-e-Khaas Restaurant',
    domain: 'dawat-e-khaas.dhandagrow.site',
    industry: 'Authentic Hyderabadi Dum Biryani & Mughlai',
    city: 'Hyderabad, Telangana',
    primaryColor: '#ea580c',
    heroHeadline: 'Authentic Handi Dum Biryani & Royal Mughlai Curries',
    heroSubtitle: 'Slow-cooked in clay handis over charcoal embers with pure desi ghee. Experience 200-year-old royal Nizami recipes delivered hot to your doorstep.',
    heroCta: 'Order Online (Flat 25% OFF) 🍗',
    heroImage: '/images/food-feast-banner.jpg',
    chatUserPrompt: 'Make an appetizing online food ordering site for Dawat-e-Khaas Hyderabad with our menu, 25% discount code, and 30-minute hot delivery guarantee.',
    chatAiReply: 'Great! Built an appetizing warm saffron & charcoal layout with handi biryani menu, table reservation widget, and 1-tap Social ordering.',
    items: [
      {
        title: 'Special Mutton Dum Biryani Handi',
        description: 'Tender goat meat slow-cooked with aged Basmati rice.',
        price: '₹480',
        image: '/images/food-feast-banner.jpg'
      },
      {
        title: 'Melt-in-Mouth Galouti Kebabs',
        description: 'Smoked minced lamb patties with Ulte Tawe Ka Paratha.',
        price: '₹360',
        image: '/images/food-feast-banner.jpg'
      },
      {
        title: 'Shahi Murgh Nizami Korma',
        description: 'Rich cashew and saffron gravy with tender chicken cuts.',
        price: '₹390',
        image: '/images/food-feast-banner.jpg'
      }
    ]
  }
];

export default function WebsiteBuilderPage() {
  const [selectedPresetId, setSelectedPresetId] = useState('ethnic-boutique');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeLanguage, setActiveLanguage] = useState<'English' | 'Hindi' | 'Hinglish'>('English');
  const [chatInput, setChatInput] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const activePreset = websitePresets.find(p => p.id === selectedPresetId) || websitePresets[0];

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`https://${activePreset.domain}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#0A0D14] text-white font-sans selection:bg-blue-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 lg:pt-24 pb-12 lg:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/15 blur-[130px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm">
            <Globe className="w-4 h-4 text-blue-400" />
            <span>Conversational AI Website Builder</span>
            <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              60s Setup
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
            Build your business website{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              just by talking to AI.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed font-medium mb-10 max-w-3xl mx-auto">
            No drag-and-drop complexity. No coding required. Simply tell DhandaGrow AI about your store in Hindi or English, and watch it generate a complete, responsive, SEO-ready website with online catalogue & Social ordering.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="h-16 px-10 text-lg rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-xl shadow-blue-500/25 border-0 flex items-center gap-2 transition-transform hover:scale-105" asChild>
              <Link href="/login/user">
                <Wand2 className="w-5 h-5" /> Create Your Website Free
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-8 text-base rounded-full border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-white font-semibold" asChild>
              <a href="#interactive-website-editor">
                Try Live Editor Simulator <Sparkles className="w-4 h-4 ml-2 text-blue-400" />
              </a>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Voice & Chat AI Copilot</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Integrated Social & UPI Checkout</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Download Complete ZIP or Host Free</span>
          </div>
        </div>
      </section>

      {/* Interactive Two-Pane Website Builder Studio Simulator */}
      <section id="interactive-website-editor" className="py-16 md:py-24 bg-[#0E131F] border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-500/20">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Two-Pane Live Editor
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Chat on the Left. Watch Website Build on the Right.
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-400">
              This interactive simulator showcases the exact two-pane architecture from your DhandaGrow dashboard. Select a business type below to test how the AI generates and revises sites on the fly.
            </p>
          </div>

          {/* Business Preset Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {websitePresets.map((preset) => {
              const isSelected = preset.id === selectedPresetId;
              return (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPresetId(preset.id)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 border ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-lg shadow-blue-500/20 scale-105'
                      : 'bg-[#121726] text-slate-300 border-slate-800 hover:bg-[#181F33] hover:text-white'
                  }`}
                >
                  <span>{preset.tag.split(' ')[0]}</span>
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>

          {/* TWO-PANE CONTAINER */}
          <div className="rounded-3xl border border-slate-800 bg-[#0B0F19] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[720px]">
            
            {/* LEFT PANE: AI EDITOR CHAT (400px width on desktop) */}
            <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-slate-800 bg-[#111827] flex flex-col text-left">
              
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-800 bg-gradient-to-r from-blue-950/40 to-purple-950/40 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-400" />
                    AI Website Editor
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Chat to build & modify your site</p>
                </div>
                
                {/* Language Pills */}
                <div className="flex gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800 text-[10px]">
                  {(['English', 'Hindi', 'Hinglish'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLanguage(lang)}
                      className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                        activeLanguage === lang 
                          ? 'bg-blue-600 text-white' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Steps Pill Bar */}
              <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Phase 4: Template & Catalog</span>
                </span>
                <span className="text-blue-400 font-mono font-bold bg-blue-500/10 px-2 py-0.5 rounded">
                  Live Sync
                </span>
              </div>

              {/* Chat Messages Flow */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[460px] custom-scrollbar bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
                
                {/* AI Welcome Message */}
                <div className="flex gap-2.5 items-start">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow text-xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-slate-800/90 text-slate-200 text-xs p-3 rounded-2xl rounded-tl-none border border-slate-700/60 leading-relaxed shadow-sm">
                    {activeLanguage === 'Hindi' 
                      ? 'नमस्ते! DhandaGrow AI Website Builder में आपका स्वागत है। आपके व्यवसाय का क्या नाम है और आप क्या बेचते हैं?'
                      : activeLanguage === 'Hinglish'
                      ? 'Namaste! Welcome to DhandaGrow AI Website Builder. Aapke business ka naam kya hai aur aap kya sell karte hain?'
                      : 'Hello! I am your AI Website Designer. Tell me your business name, city, and what products or services you offer.'}
                  </div>
                </div>

                {/* User Prompt */}
                <div className="flex gap-2.5 items-start justify-end">
                  <div className="bg-blue-600 text-white text-xs p-3 rounded-2xl rounded-tr-none max-w-[85%] leading-relaxed shadow-md">
                    {activePreset.chatUserPrompt}
                  </div>
                  <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-white shrink-0 text-[10px] font-bold">
                    ME
                  </div>
                </div>

                {/* AI Generation Step Card */}
                <div className="p-3.5 rounded-2xl bg-[#0F172A] border border-blue-500/30 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-blue-400">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" /> Generating Website Content
                    </span>
                    <span className="font-mono text-emerald-400">100%</span>
                  </div>
                  <div className="space-y-1 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Check className="w-3 h-3 text-emerald-400" /> Building Hero Banner & Branding
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Check className="w-3 h-3 text-emerald-400" /> Generating 3-Item Product Showcase
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Check className="w-3 h-3 text-emerald-400" /> Integrating Social Order Button
                    </div>
                  </div>
                </div>

                {/* AI Reply Message */}
                <div className="flex gap-2.5 items-start">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow text-xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-slate-800/90 text-slate-200 text-xs p-3 rounded-2xl rounded-tl-none border border-slate-700/60 leading-relaxed shadow-sm">
                    {activePreset.chatAiReply}
                  </div>
                </div>

              </div>

              {/* Chat Input Bar */}
              <div className="p-3 border-t border-slate-800 bg-slate-900/90">
                <div className="flex items-center gap-2">
                  <VoiceInputButton
                    onTranscript={(text) => setChatInput(text)}
                    currentValue={chatInput}
                    size="sm"
                    tooltip="Speak site changes (English/Hindi)"
                  />
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Tell AI to modify your site (e.g. 'Add festive banner')..."
                    className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-3 h-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <Button 
                    size="sm" 
                    className="h-9 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                    asChild
                  >
                    <Link href="/login/user">
                      <Send className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Speak or type revisions in Hindi or English</span>
                  <Link href="/login/user" className="text-blue-400 hover:underline font-semibold">
                    Open Full Builder ➔
                  </Link>
                </div>
              </div>

            </div>

            {/* RIGHT PANE: LIVE BROWSER PREVIEW (Full Responsive Rendering) */}
            <div className="lg:col-span-7 bg-[#0F172A] flex flex-col text-left">
              
              {/* Browser Mockup Top Navigation Bar */}
              <div className="h-12 bg-slate-950 px-4 flex items-center justify-between border-b border-slate-800">
                {/* Window Dots */}
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>

                {/* URL Bar */}
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-slate-300 text-[11px] font-mono max-w-[280px] sm:max-w-[340px] truncate">
                  <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">https://{activePreset.domain}</span>
                </div>

                {/* Device & Export Controls */}
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-slate-400">
                    <button 
                      onClick={() => setDeviceMode('desktop')} 
                      className={`p-1 rounded ${deviceMode === 'desktop' ? 'bg-slate-800 text-white' : 'hover:text-white'}`}
                      title="Desktop View"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setDeviceMode('tablet')} 
                      className={`p-1 rounded ${deviceMode === 'tablet' ? 'bg-slate-800 text-white' : 'hover:text-white'}`}
                      title="Tablet View"
                    >
                      <Tablet className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setDeviceMode('mobile')} 
                      className={`p-1 rounded ${deviceMode === 'mobile' ? 'bg-slate-800 text-white' : 'hover:text-white'}`}
                      title="Mobile View"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-7 text-[11px] px-2.5 border-slate-700 bg-slate-900 text-slate-300 hover:text-white"
                    asChild
                  >
                    <Link href="/login/user">
                      <Download className="w-3 h-3 mr-1" /> Export ZIP
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Website Preview Canvas Frame */}
              <div className="flex-1 p-2 sm:p-4 bg-slate-950 flex justify-center items-start overflow-y-auto max-h-[640px] custom-scrollbar">
                
                {/* Dynamically Sized Device Frame */}
                <div 
                  className={`bg-white text-slate-900 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${
                    deviceMode === 'mobile' 
                      ? 'w-[320px] border-4 border-slate-800' 
                      : deviceMode === 'tablet' 
                      ? 'w-[560px] border-2 border-slate-800' 
                      : 'w-full'
                  }`}
                >
                  
                  {/* Generated Website Sticky Navbar */}
                  <nav className="bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-7 h-7 rounded-lg text-white font-black text-xs flex items-center justify-center shadow"
                        style={{ backgroundColor: activePreset.primaryColor }}
                      >
                        {activePreset.businessName[0]}
                      </div>
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900 tracking-tight truncate max-w-[150px] sm:max-w-none">
                        {activePreset.businessName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                      <span className="hidden sm:inline text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer">
                        Catalog
                      </span>
                      <span className="hidden sm:inline text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer">
                        Offers
                      </span>
                      <Button 
                        size="sm" 
                        className="h-7 sm:h-8 px-3 text-[11px] font-bold text-white rounded-full shadow border-0"
                        style={{ backgroundColor: activePreset.primaryColor }}
                        asChild
                      >
                        <Link href="/login/user">
                          Order Now
                        </Link>
                      </Button>
                    </div>
                  </nav>

                  {/* Generated Website Hero Section */}
                  <div className="relative bg-gradient-to-r from-slate-50 to-amber-50/30 p-5 sm:p-8 border-b border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                      <div className="sm:col-span-7 space-y-3">
                        <span 
                          className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${activePreset.primaryColor}15`, color: activePreset.primaryColor }}
                        >
                          {activePreset.city} • Verified Store
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                          {activePreset.heroHeadline}
                        </h2>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          {activePreset.heroSubtitle}
                        </p>
                        <div className="pt-2 flex flex-wrap gap-2">
                          <Button 
                            size="sm" 
                            className="h-8 px-4 text-xs font-bold text-white rounded-lg shadow border-0"
                            style={{ backgroundColor: activePreset.primaryColor }}
                            asChild
                          >
                            <Link href="/login/user">
                              {activePreset.heroCta}
                            </Link>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 px-3 text-xs font-bold text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100 rounded-lg"
                            asChild
                          >
                            <Link href="/login/user">
                              <MessageCircle className="w-3.5 h-3.5 mr-1" /> Social Us
                            </Link>
                          </Button>
                        </div>
                      </div>

                      <div className="sm:col-span-5">
                        <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 relative">
                          <img 
                            src={activePreset.heroImage} 
                            alt={activePreset.businessName} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Generated Website Products / Services Grid */}
                  <div className="p-5 sm:p-8 bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                          Featured Products & Catalog
                        </h3>
                        <p className="text-[11px] text-slate-500">Curated selections with instant checkout</p>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400">
                        3 Items
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {activePreset.items.map((item, idx) => (
                        <div key={idx} className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50 hover:shadow-md transition-shadow">
                          <div className="aspect-[4/3] bg-slate-900 overflow-hidden relative">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            <span 
                              className="absolute top-2 right-2 text-[10px] font-bold text-white px-2 py-0.5 rounded shadow"
                              style={{ backgroundColor: activePreset.primaryColor }}
                            >
                              {item.price}
                            </span>
                          </div>
                          <div className="p-3">
                            <h4 className="font-bold text-xs text-slate-900 truncate">{item.title}</h4>
                            <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                            <Button 
                              size="sm" 
                              className="w-full mt-2.5 h-7 text-[10px] font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800"
                              asChild
                            >
                              <Link href="/login/user">
                                Quick Buy
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Generated Website Footer */}
                  <footer className="bg-slate-900 text-white p-6 border-t border-slate-800 text-xs">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-sm">{activePreset.businessName}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {activePreset.city} • Open Today: 10:00 AM - 9:00 PM
                        </p>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Powered by DhandaGrow AI Website Engine
                      </div>
                    </div>
                  </footer>

                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4-Step How It Works (Project-aligned) */}
      <section className="py-24 bg-[#0A0D14] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-500/20">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            Zero Learning Curve
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
            From Conversation to Live Website in 4 Steps
          </h2>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-16">
            Unlike WordPress or Wix, you never need to learn complex web tools. Just converse naturally with your AI designer.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            
            <div className="bg-[#121726] p-6 rounded-3xl border border-slate-800 text-left relative hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-sm mb-4 shadow-lg shadow-blue-500/30">
                1
              </div>
              <h3 className="text-base font-bold text-white mb-2">Speak or Type</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Tell the AI your shop name, products, city, and pricing in English, Hindi, or Hinglish via voice or text.
              </p>
            </div>

            <div className="bg-[#121726] p-6 rounded-3xl border border-slate-800 text-left relative hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-black text-sm mb-4 shadow-lg shadow-indigo-500/30">
                2
              </div>
              <h3 className="text-base font-bold text-white mb-2">AI Builds Full Site</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                The engine writes compelling headlines, formats product cards, pairs brand colors, and generates responsive code.
              </p>
            </div>

            <div className="bg-[#121726] p-6 rounded-3xl border border-slate-800 text-left relative hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-black text-sm mb-4 shadow-lg shadow-purple-500/30">
                3
              </div>
              <h3 className="text-base font-bold text-white mb-2">Chat to Revise</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Want to change something? Just chat: &ldquo;Make button green&rdquo; or &ldquo;Add 20% discount offer banner&rdquo; and it updates live.
              </p>
            </div>

            <div className="bg-[#121726] p-6 rounded-3xl border border-slate-800 text-left relative hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-black text-sm mb-4 shadow-lg shadow-emerald-500/30">
                4
              </div>
              <h3 className="text-base font-bold text-white mb-2">Publish or Download</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Go live instantly on your free `.dhandagrow.site` subdomain, connect a custom domain, or download the clean HTML/CSS ZIP.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Grid Features */}
      <section className="py-24 bg-[#0E131F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
              Everything built-in for Indian small businesses.
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
              Not just a static webpage. It is an automated digital storefront that captures leads and processes payments.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-[#121726] p-8 rounded-3xl border border-slate-800 hover:border-slate-700 transition-colors text-left">
              <MessageCircle className="w-8 h-8 text-emerald-400 mb-5" />
              <h3 className="text-lg font-bold text-white mb-2">1-Click Social Ordering</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Every product card includes an instant Social button that sends the exact product name, size, and price directly to your Social Business chat.
              </p>
            </div>
            
            <div className="bg-[#121726] p-8 rounded-3xl border border-slate-800 hover:border-slate-700 transition-colors text-left">
              <Smartphone className="w-8 h-8 text-blue-400 mb-5" />
              <h3 className="text-lg font-bold text-white mb-2">100% Mobile Responsive</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Over 85% of Indian retail customers shop via smartphones. Your AI-generated website looks flawlessly tailored on iPhones, Androids, and tablets.
              </p>
            </div>

            <div className="bg-[#121726] p-8 rounded-3xl border border-slate-800 hover:border-slate-700 transition-colors text-left">
              <Search className="w-8 h-8 text-indigo-400 mb-5" />
              <h3 className="text-lg font-bold text-white mb-2">Built-in Local Google SEO</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                The AI automatically inserts local schema markup, meta titles, geo-tags, and structured data so local customers searching Google find your shop first.
              </p>
            </div>

            <div className="bg-[#121726] p-8 rounded-3xl border border-slate-800 hover:border-slate-700 transition-colors text-left">
              <Download className="w-8 h-8 text-purple-400 mb-5" />
              <h3 className="text-lg font-bold text-white mb-2">Full Code Ownership (ZIP Export)</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                No vendor lock-in. Export clean, human-readable HTML, Tailwind CSS, and asset files in a single `.zip` file to host anywhere you want.
              </p>
            </div>

            <div className="bg-[#121726] p-8 rounded-3xl border border-slate-800 hover:border-slate-700 transition-colors text-left">
              <Zap className="w-8 h-8 text-amber-400 mb-5" />
              <h3 className="text-lg font-bold text-white mb-2">Direct CRM Lead Capture</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Inquiries and contact forms automatically stream into your DhandaGrow Leads CRM, notifying you instantly with contact details.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-950/40 via-[#121726] to-slate-900 p-8 rounded-3xl border border-emerald-500/30 text-left">
              <Gauge className="w-8 h-8 text-emerald-400 mb-5" />
              <h3 className="text-lg font-bold text-white mb-2">Sub-Second Load Time</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Built on modern edge infrastructure with zero bloated plugins for maximum speed and Google PageSpeed 100/100 rating.
              </p>
              <div className="flex gap-2">
                <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px] font-bold font-mono">Performance: 100</div>
                <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px] font-bold font-mono">SEO: 100</div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Feature Showcase & Expansion Sections */}
      <FeatureShowcaseSection feature="website-builder" />
      <FeatureExpansionSections feature="website-builder" />

      {/* Bottom CTA */}
      <section className="py-24 bg-gradient-to-b from-[#0E131F] to-[#0A0D14] text-center border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold mb-6 border border-blue-500/20">
            <Globe className="w-4 h-4" />
            <span>Join 10,000+ Indian Businesses Online</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
            Stop losing customers to outdated websites.
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
            Create your complete business website in 60 seconds. Talk to the AI, customize your catalogue, and publish live today.
          </p>
          <Button size="lg" className="h-16 px-12 text-lg rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-xl shadow-blue-500/25 border-0" asChild>
            <Link href="/login/user">
              Build Your Website Now <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
