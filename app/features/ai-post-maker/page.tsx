'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  ArrowRight, 
  Image as ImageIcon, 
  Layout, 
  Zap, 
  Share2, 
  CheckCircle2, 
  Download, 
  Copy, 
  Check, 
  Palette, 
  Type, 
  Layers, 
  Smartphone, 
  ChevronDown,
  ShoppingBag,
  Utensils,
  Sparkle,
  BadgePercent
} from 'lucide-react';

interface InteractivePreset {
  id: string;
  category: string;
  icon: React.ReactNode;
  prompt: string;
  badge: string;
  headline: string;
  subtext: string;
  offerText: string;
  caption: string;
  hashtags: string[];
  gradient: string;
}

const interactivePresets: InteractivePreset[] = [
  {
    id: 'festival',
    category: '🎉 Festival Mega Sale',
    icon: <Sparkles className="w-4 h-4 text-amber-500" />,
    prompt: 'Create a vibrant Diwali festive discount poster for an ethnic wear boutique with gold sparkles and 40% OFF badge',
    badge: 'DIWALI SPECIAL 🪔',
    headline: 'Celebrate in Style with Festive Kurtis & Sarees',
    subtext: 'Handcrafted royal weaves, pure silk collection & festive accessories.',
    offerText: 'FLAT 40% OFF',
    caption: '✨ Iss Diwali chamkiyen naye festive collection ke saath! Get Flat 40% OFF on all ethnic wear. Limited festive stocks available. Visit store or shop online today! 🪔👗',
    hashtags: ['#DiwaliSale', '#FestiveFashion', '#IndianEthnic', '#Flat40Off', '#DhandaGrowAI'],
    gradient: 'from-amber-600 via-orange-600 to-rose-700'
  },
  {
    id: 'food',
    category: '🍽️ Restaurant & Food',
    icon: <Utensils className="w-4 h-4 text-orange-500" />,
    prompt: 'Make an appetizing weekend dining offer poster for a North Indian restaurant featuring Dum Biryani and Gulab Jamun',
    badge: 'WEEKEND SPECIAL 🥘',
    headline: 'Celebrate with a Royal Festive Feast!',
    subtext: 'Authentic Hyderabadi Dum Biryani, Galouti Kebabs & hot Gulab Jamun.',
    offerText: 'UP TO 25% OFF',
    caption: 'Weekend crave solve karo! 🍛 Enjoy authentic royal delicacies with your family. Flat 25% discount on all dine-in and WhatsApp orders this weekend! 🤤🔥',
    hashtags: ['#WeekendFoodie', '#BiryaniLovers', '#FoodOffer', '#DineInDiscount', '#ZomatoSwiggy'],
    gradient: 'from-orange-600 via-amber-700 to-red-800'
  },
  {
    id: 'salon',
    category: '💄 Salon & Beauty',
    icon: <Sparkle className="w-4 h-4 text-pink-500" />,
    prompt: 'Design an elegant luxury bridal beauty package flyer with gold borders and WhatsApp booking button',
    badge: 'BRIDAL GLOW 💅',
    headline: 'Complete Pre-Wedding Bridal Glow Package',
    subtext: 'Hydra-Facial, Moroccan hair spa, HD makeup & pre-bridal rejuvenation.',
    offerText: 'BOOK ON WHATSAPP',
    caption: 'Turn heads on your special day! 👰 Get professional pre-wedding skin and hair care by master stylists. Slots filling fast for wedding season. Book consultation on WhatsApp! 💖✨',
    hashtags: ['#BridalGlow', '#WeddingSeason', '#SalonSpecial', '#PreBridalCare', '#MakeupArtist'],
    gradient: 'from-pink-600 via-rose-600 to-purple-800'
  },
  {
    id: 'tech',
    category: '📱 Tech & Electronics',
    icon: <BadgePercent className="w-4 h-4 text-blue-500" />,
    prompt: 'Design a high-energy smartphone flash sale banner with zero downpayment EMI badge and midnight expiry',
    badge: 'TECH BONANZA ⚡',
    headline: 'Smartphone Mega Fest — Unbeatable Deals',
    subtext: 'Latest 5G smartphones, free earbuds with every purchase & 0% EMI options.',
    offerText: 'FROM ₹14,999*',
    caption: 'Upgrade your phone today! 🚀 Massive discounts on flagship 5G devices + Instant exchange bonus up to ₹5,000. Offer valid till midnight only! 📱⚡',
    hashtags: ['#MobileDeals', '#SmartphoneBonanza', '#ExchangeOffer', '#ZeroDownPayment', '#TechSale'],
    gradient: 'from-blue-600 via-indigo-600 to-violet-900'
  }
];

const faqs = [
  {
    q: 'Can I automatically include my business logo and phone number on every post?',
    a: 'Yes! Simply save your brand kit once (logo, brand colors, phone number, and address). DhandaGrow AI automatically watermarks and places your contact details harmoniously on every generated poster.'
  },
  {
    q: 'Does AI Postmaker support Hindi, Hinglish, and regional Indian languages?',
    a: 'Absolutely. You can generate poster headings, subtitles, and social captions in Hinglish, Hindi, Marathi, Tamil, Telugu, Gujarati, and English with authentic cultural nuances.'
  },
  {
    q: 'Can I upload raw smartphone photos of my products?',
    a: 'Yes. Our integrated AI background remover isolates your product in 1 second and automatically positions it inside studio-grade backgrounds with realistic lighting and festive decorations.'
  },
  {
    q: 'What image sizes and aspect ratios are supported for social platforms?',
    a: 'AI Postmaker generates in 1:1 Square (Instagram/Facebook feeds), 9:16 Vertical (Stories, WhatsApp Status, Reels covers), and 16:9 Landscape (Twitter, LinkedIn, website banners) with one-click automatic resizing.'
  },
  {
    q: 'Do I get commercial ownership rights of the created posts?',
    a: 'Yes, 100%. All images, captions, and creative assets generated through your DhandaGrow account are completely royalty-free for commercial marketing, social posting, and paid ad campaigns.'
  },
  {
    q: 'How fast does AI Postmaker generate a complete post?',
    a: 'On average, an entire high-resolution creative with matching captions and trending hashtags is generated in under 3 seconds.'
  }
];

export default function PostmakerPage() {
  const [activePreset, setActivePreset] = useState<InteractivePreset>(interactivePresets[0]);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(`${activePreset.caption}\n\n${activePreset.hashtags.join(' ')}`);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  return (
    <main className="min-h-screen bg-white selection:bg-purple-600 selection:text-white">
      <Navbar />
      
      {/* 1. Hero Section */}
      <section className="pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden relative bg-gradient-to-b from-[#faf8f5] via-white to-white">
        {/* Subtle Decorative Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-orange-200/80 mb-6">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span className="text-xs sm:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600">
                  AI-Powered Creative Studio
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-bold text-slate-900 mb-6 tracking-tight leading-[1.1]">
                AI Postmaker for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500">
                  Bharat Businesses
                </span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed font-normal mb-8 max-w-xl">
                Generate stunning festive posters, flash sale flyers, and engaging social posts in seconds. Zero design skills needed — let AI write your captions, pick colors, and brand every creative.
              </p>

              {/* Feature Value Bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 w-full max-w-lg">
                {[
                  '10,000+ Indian Festival Templates',
                  'Hinglish & Regional Captions',
                  'Auto-Logo & Brand Color Sync',
                  'Instant WhatsApp & Instagram Export'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <Link href="/create-ad">
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="h-13 sm:h-14 px-8 text-base shadow-xl shadow-orange-500/20 group font-bold rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 border-0 cursor-pointer w-full sm:w-auto"
                  >
                    <span className="flex items-center gap-2 text-white">
                      Start Creating for Free
                    </span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform text-white" />
                  </Button>
                </Link>

                <a 
                  href="#templates-showcase" 
                  className="inline-flex items-center justify-center h-13 sm:h-14 px-7 text-sm sm:text-base font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-full transition-colors text-center"
                >
                  Explore Templates
                </a>
              </div>
            </div>
            
            {/* Right Hero Image / Mockup */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden border border-orange-200/60 shadow-[0_25px_70px_-15px_rgba(249,115,22,0.18)] bg-white group">
                <img 
                  src="/images/ai-postmaker-hero.jpg" 
                  alt="DhandaGrow AI Postmaker app interface creating festive Indian social media posts" 
                  className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500 select-none"
                />

                {/* Floating Glass Badges */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md border border-white/60 px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-800">
                    Live AI Postmaker Canvas
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl shadow-lg flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">
                    Festival Creatives in 1-Click
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="py-14 border-y border-slate-100 bg-[#fffdfa] relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-orange-100 text-center">
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-2 tracking-tight">10x</h3>
              <p className="text-xs sm:text-[13px] font-bold text-slate-500 uppercase tracking-wider">Faster Content Creation</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-2 tracking-tight">500k+</h3>
              <p className="text-xs sm:text-[13px] font-bold text-slate-500 uppercase tracking-wider">Posts & Ads Generated</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-2 tracking-tight">100+</h3>
              <p className="text-xs sm:text-[13px] font-bold text-slate-500 uppercase tracking-wider">Indian Festival Days</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-2 tracking-tight">7+</h3>
              <p className="text-xs sm:text-[13px] font-bold text-slate-500 uppercase tracking-wider">Indian Languages Supported</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive AI Post Simulator Widget */}
      <section className="py-20 sm:py-28 bg-[#faf9f6] relative border-b border-orange-100/70">
        <div 
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `linear-gradient(to right, #f4e8dc 1px, transparent 1px), linear-gradient(to bottom, #f4e8dc 1px, transparent 1px)`,
            backgroundSize: '36px 36px'
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-orange-600 font-bold text-xs sm:text-sm tracking-wider uppercase inline-block mb-2">
              Interactive Live Preview
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              See How AI Postmaker Works in Real Time
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3">
              Click any business category below to see instant prompts, generated flyer layouts, and ready-to-publish Hinglish captions.
            </p>
          </div>

          {/* Category Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-10">
            {interactivePresets.map((preset) => {
              const isSelected = activePreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => setActivePreset(preset)}
                  className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/25 scale-105'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-orange-300 hover:text-orange-600'
                  }`}
                >
                  <span>{preset.category}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Workspace Card */}
          <div className="bg-white rounded-[28px] sm:rounded-[36px] border border-orange-200/80 shadow-xl shadow-orange-950/5 p-6 sm:p-10 max-w-5xl mx-auto">
            
            {/* Prompt Bar Simulator */}
            <div className="mb-8 bg-[#faf8f5] border border-orange-200/70 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3 w-full">
                <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5 text-orange-600" />
                </div>
                <div className="w-full">
                  <p className="text-[11px] font-bold text-orange-600 uppercase tracking-wider mb-1">
                    AI Prompt Input
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-slate-800 leading-snug">
                    &ldquo;{activePreset.prompt}&rdquo;
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Generated in 0.9s
                </span>
              </div>
            </div>

            {/* Split Preview: Left Graphic Card | Right Caption & Actions */}
            <div className="grid md:grid-cols-12 gap-8 items-stretch">
              
              {/* Graphic Card Preview */}
              <div className="md:col-span-6 flex flex-col">
                <div className={`w-full aspect-square rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-white relative overflow-hidden shadow-lg bg-gradient-to-br ${activePreset.gradient}`}>
                  
                  {/* Decorative background glow */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full blur-xl pointer-events-none" />

                  {/* Card Top Brand & Badge */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-xs font-black tracking-wider uppercase bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      {activePreset.badge}
                    </span>
                    <span className="text-xs font-bold text-white/90">
                      DHANDAGROW STORE
                    </span>
                  </div>

                  {/* Card Main Typography */}
                  <div className="relative z-10 my-auto py-4">
                    <h4 className="font-serif text-2xl sm:text-3xl font-bold leading-tight mb-2 drop-shadow-sm">
                      {activePreset.headline}
                    </h4>
                    <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed max-w-xs">
                      {activePreset.subtext}
                    </p>
                  </div>

                  {/* Card Bottom Offer Callout */}
                  <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/20">
                    <span className="text-lg sm:text-xl font-black bg-white text-slate-900 px-3.5 py-1 rounded-xl shadow-md">
                      {activePreset.offerText}
                    </span>
                    <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg">
                      Shop via WhatsApp 📲
                    </span>
                  </div>

                </div>
                
                <p className="text-center text-xs text-slate-400 mt-2 font-medium">
                  Export ready for Instagram feed, WhatsApp status & Facebook ads
                </p>
              </div>

              {/* Right: AI-Generated Caption & Copy */}
              <div className="md:col-span-6 flex flex-col justify-between bg-[#fffdfa] border border-orange-100 rounded-2xl sm:rounded-3xl p-6 sm:p-7">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                      AI Generated Social Caption
                    </span>
                    <button
                      onClick={handleCopyCaption}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-orange-600 bg-white border border-slate-200 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      {copiedCaption ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Caption</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-white p-4 rounded-xl border border-slate-100 mb-4 whitespace-pre-line">
                    {activePreset.caption}
                  </p>

                  <div className="mb-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Trending Viral Hashtags
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activePreset.hashtags.map((tag, idx) => (
                        <span key={idx} className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100/70">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Direct Action Link */}
                <div className="pt-4 border-t border-orange-100 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    Want to customize fonts, colors or images?
                  </div>
                  <Link href="/create-ad">
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full px-5 cursor-pointer">
                      Customize in Studio
                    </Button>
                  </Link>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. Templates Showcase Section */}
      <section id="templates-showcase" className="py-20 sm:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-orange-600 font-bold text-xs sm:text-sm tracking-wider uppercase inline-block mb-2">
              Template Gallery
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-slate-900 tracking-tight">
              Ready-to-Use Creatives for Every Business
            </h2>
            <p className="text-slate-500 text-base max-w-2xl mx-auto mt-3 font-normal">
              From ethnic apparel and electronics to luxury salons and real estate — choose from thousands of battle-tested templates.
            </p>
          </div>

          {/* Master Showcase Image */}
          <div className="mb-14 rounded-[28px] sm:rounded-[36px] overflow-hidden border border-orange-200/70 shadow-2xl shadow-orange-950/10 group">
            <img 
              src="/images/ai-post-templates-showcase.jpg" 
              alt="AI Postmaker templates showcase for Indian businesses including festival kurtis, smartphone deals, bridal glow packages, and real estate" 
              className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500 select-none"
            />
          </div>

          {/* 4 Highlight Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Festive & Cultural Sales',
                desc: 'Diwali, Holi, Navratri, Eid, Raksha Bandhan, and 100+ local festive sales with gold sparkles and festive lighting.',
                tag: 'High Conversion',
                tagColor: 'bg-amber-100 text-amber-800'
              },
              {
                title: 'Electronics & Gadgets',
                desc: 'Flash sales, festive bonanzas, zero EMI promotions, and gadget unboxing posters with sleek tech styling.',
                tag: 'Bestseller',
                tagColor: 'bg-blue-100 text-blue-800'
              },
              {
                title: 'Salon, Spa & Beauty',
                desc: 'Bridal glow packages, weekend haircut discounts, and seasonal skincare flyers with direct WhatsApp booking.',
                tag: 'WhatsApp Ready',
                tagColor: 'bg-pink-100 text-pink-800'
              },
              {
                title: 'Real Estate & Services',
                desc: 'Luxury apartment launches, coaching classes, gym memberships, and local clinic announcements.',
                tag: 'Lead Gen',
                tagColor: 'bg-emerald-100 text-emerald-800'
              }
            ].map((cat, idx) => (
              <div 
                key={idx} 
                className="bg-[#faf9f6] border border-orange-200/60 rounded-2xl p-6 hover:shadow-lg hover:border-orange-300 transition-all group"
              >
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full inline-block mb-3 ${cat.tagColor}`}>
                  {cat.tag}
                </span>
                <h3 className="font-serif text-lg font-bold text-slate-900 mb-2 leading-snug">
                  {cat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {cat.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. How It Works Section */}
      <section className="py-20 sm:py-28 bg-[#fafbfc] border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-14 sm:mb-20">
            <span className="text-purple-600 font-bold text-xs sm:text-sm tracking-wider uppercase inline-block mb-2">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              From Idea to Published Post in 30 Seconds
            </h2>
            <p className="text-slate-500 text-base max-w-2xl mx-auto mt-3 font-normal">
              No complicated layers or graphic design tools. Just prompt and publish.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            {/* Left AI Workspace Visual */}
            <div className="w-full lg:w-1/2">
              <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-2xl border border-slate-200/80 group">
                <img 
                  src="/images/ai-postmaker-workflow.jpg" 
                  alt="AI Postmaker workspace workflow with smart layers, regional fonts, and Instagram export" 
                  className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500"
                />
              </div>
            </div>
            
            {/* Right Steps Walkthrough */}
            <div className="w-full lg:w-1/2 flex flex-col space-y-8">
              
              <div className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center shadow-xs">
                  <span className="text-lg font-black text-purple-700">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1.5">
                    Type your offer or pick a festival occasion
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-normal">
                    Just type what you want, e.g. &ldquo;Holi discount 30% on sweet boxes&rdquo; or pick from pre-configured festive events on the calendar.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center shadow-xs">
                  <span className="text-lg font-black text-orange-700">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1.5">
                    AI crafts graphics, fonts & captions
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-normal">
                    The engine selects matching typography, places your logo, harmonizes color palettes, and writes engaging Hinglish or Hindi captions with viral hashtags.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center shadow-xs">
                  <span className="text-lg font-black text-emerald-700">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1.5">
                    Export to WhatsApp & Instagram in 1-Click
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-normal">
                    Download in high-resolution PNG or auto-publish straight to your Instagram, WhatsApp Status, and Facebook ad campaigns without compression.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/create-ad">
                  <Button className="h-12 px-7 rounded-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-bold shadow-lg shadow-purple-500/20 cursor-pointer">
                    Try Creating Your First Post Now
                  </Button>
                </Link>
              </div>

            </div>
            
          </div>
        </div>
      </section>

      {/* 6. Postmaker Powerful Features Grid */}
      <section className="py-20 sm:py-28 bg-[#090b14] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#090b14] via-[#0d101d] to-[#090b14]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14 sm:mb-18">
            <span className="text-orange-400 font-bold text-xs sm:text-sm tracking-wider uppercase inline-block mb-2">
              Pro Studio Features
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Everything You Need to Dominate Social Feeds
            </h2>
            <p className="text-slate-400 text-base max-w-2xl mx-auto font-normal">
              Enterprise-grade creative capabilities distilled into a 1-click mobile and web interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Festival Calendar Sync",
                desc: "Never miss an Indian festival. Automatically suggested creatives for Diwali, Holi, Navratri, Eid, and 100+ national events.",
                icon: <Layout className="w-6 h-6 text-[#fc9a5d]" />
              },
              {
                title: "1-Click Auto-Branding",
                desc: "Upload your business logo once. AI automatically positions it alongside your brand color palette and fonts on every post.",
                icon: <ImageIcon className="w-6 h-6 text-[#f0449b]" />
              },
              {
                title: "Multi-Platform Smart Resize",
                desc: "One click to resize your creative across 1:1 Square (Feed), 9:16 Vertical (Stories/Status), and 16:9 Banner (LinkedIn/Web).",
                icon: <Zap className="w-6 h-6 text-[#be32ff]" />
              },
              {
                title: "Studio Product Backgrounds",
                desc: "Upload simple smartphone product photos. AI cleanly removes the background and places your item on luxury podiums and festive sets.",
                icon: <Layers className="w-6 h-6 text-blue-400" />
              },
              {
                title: "Hinglish & Regional Copywriting",
                desc: "Generate persuasive social captions and trending hashtags in Hindi, Hinglish, Marathi, Tamil, Gujarati, and English.",
                icon: <Share2 className="w-6 h-6 text-emerald-400" />
              },
              {
                title: "4x A/B Creative Variations",
                desc: "Unsure which flyer converts best? AI generates 4 unique design variations for every prompt to test on your audience.",
                icon: <Sparkles className="w-6 h-6 text-pink-400" />
              }
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-7 hover:bg-white/[0.08] hover:border-orange-500/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed text-xs sm:text-sm font-normal">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="py-20 sm:py-28 bg-[#faf9f6] border-b border-orange-100/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-orange-600 font-bold text-xs sm:text-sm tracking-wider uppercase inline-block mb-2">
              Got Questions?
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white border border-orange-200/60 rounded-2xl overflow-hidden transition-shadow shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-orange-600 transition-colors cursor-pointer"
                  >
                    <span className="text-sm sm:text-base leading-snug">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-orange-600 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>
      
      {/* 8. Call To Action (CTA) */}
      <section className="py-20 sm:py-28 bg-white relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-purple-700 via-pink-600 to-orange-500 rounded-[32px] sm:rounded-[44px] p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 blur-[100px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2" />
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 relative z-10 tracking-tight leading-tight">
              Ready to Supercharge Your Social Media?
            </h2>
            <p className="text-white/95 text-base sm:text-lg max-w-2xl mx-auto mb-8 relative z-10 font-normal">
              Join thousands of Indian business owners, retail shops, and creators who save hours every week creating professional festive posts with DhandaGrow AI.
            </p>
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/create-ad">
                <Button 
                  size="lg" 
                  className="h-14 px-10 text-base font-bold rounded-full text-purple-900 bg-white hover:bg-slate-50 border-0 shadow-xl cursor-pointer"
                >
                  Try AI Postmaker for Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
