'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Video, 
  ArrowRight, 
  Music, 
  Subtitles, 
  Zap, 
  Clapperboard, 
  Wand2, 
  Sparkles, 
  CheckCircle2, 
  Mic2, 
  Copy, 
  Check, 
  Play, 
  Share2, 
  Layers, 
  ChevronDown, 
  Volume2, 
  Flame, 
  Clock, 
  Globe 
} from 'lucide-react';

interface ReelPreset {
  id: string;
  category: string;
  productName: string;
  objective: string;
  duration: string;
  voiceArtist: string;
  language: string;
  hook: string;
  scenes: {
    title: string;
    description: string;
    onScreenText: string;
  }[];
  caption: string;
  hashtags: string[];
  gradient: string;
}

const reelPresets: ReelPreset[] = [
  {
    id: 'saree',
    category: '👗 Ethnic Fashion & Festive',
    productName: 'Kanjeevaram Silk Saree',
    objective: '🛍️ Festive Sale',
    duration: '30s',
    voiceArtist: 'Priya S. (Energetic Hinglish)',
    language: 'Hinglish',
    hook: 'Stop scrolling! Iss Diwali traditional look chahiye jo sab dekhte reh jayein?',
    scenes: [
      {
        title: 'Scene 1: Viral Hook',
        description: 'Dramatic close-up of gold zari border with festive sparkles & royal lighting',
        onScreenText: 'THIS DIWALI, SHINE BRIGHT! 🪔'
      },
      {
        title: 'Scene 2: Craftsmanship & Fabric',
        description: 'Smooth slow-motion drape showing pure silk weave and rich pallu details',
        onScreenText: 'PURE SILK • HANDLOOM WEAVE'
      },
      {
        title: 'Scene 3: Limited Festive Offer & CTA',
        description: 'Bold discount badge with WhatsApp order button and link in bio prompt',
        onScreenText: 'FLAT 40% OFF — TAP LINK IN BIO!'
      }
    ],
    caption: '✨ Iss festive season pehniye authentic Kanjeevaram Silk! Flat 40% OFF Diwali special. COD available across India. WhatsApp pe order karne ke liye tap link in bio! 🪔👗',
    hashtags: ['#DiwaliReels', '#EthnicFashion', '#SareeLove', '#ViralReels', '#DhandaGrowAI'],
    gradient: 'from-amber-600 via-orange-600 to-rose-700'
  },
  {
    id: 'food',
    category: '🍛 Restaurant & Cloud Kitchen',
    productName: 'Hyderabadi Dum Biryani Feast',
    objective: '🔥 Weekend Offer',
    duration: '15s',
    voiceArtist: 'Deepak M. (Upbeat Hindi)',
    language: 'Hindi',
    hook: 'Craving authentic dum biryani? Ek baar ye dekh lijiye, bhookh dugni ho jayegi!',
    scenes: [
      {
        title: 'Scene 1: Sizzling Steam Hook',
        description: 'Handi opening with rising aromatic saffron steam and tender meat pieces',
        onScreenText: 'WEEKEND BIRYANI CRAVINGS? 🥘'
      },
      {
        title: 'Scene 2: Thali Spread & Sides',
        description: 'Fast-paced rhythmic cut of Mirchi ka Salan, Raita, and hot Gulab Jamun',
        onScreenText: 'AUTHENTIC DUM COOKED'
      },
      {
        title: 'Scene 3: Direct WhatsApp / Zomato Callout',
        description: 'Instant discount code popup with 20-minute delivery guarantee badge',
        onScreenText: 'FLAT 25% OFF ON WHATSAPP 📲'
      }
    ],
    caption: 'Weekend crave solve karo! 🤤 Authentic slow-cooked Hyderabadi Dum Biryani with rich spices & tender meat. WhatsApp or Swiggy pe 25% discount paane ke liye order now! 🍛🔥',
    hashtags: ['#BiryaniReels', '#FoodieDiaries', '#WeekendFood', '#ZomatoSwiggy', '#FoodOffer'],
    gradient: 'from-orange-600 via-amber-700 to-red-800'
  },
  {
    id: 'tech',
    category: '📱 Gadgets & Electronics',
    productName: 'Pro AMOLED Smartwatch',
    objective: '🚀 Product Launch',
    duration: '30s',
    voiceArtist: 'Arjun K. (Tech Reviewer English)',
    language: 'English/Hinglish',
    hook: 'Tired of ordinary smartwatches? This budget beast looks like an 80k flagship!',
    scenes: [
      {
        title: 'Scene 1: Premium Metallic Hook',
        description: 'Curved AMOLED screen turning on in dark neon lighting with fluid dial',
        onScreenText: 'BEST SMARTWATCH UNDER ₹2,999? ⌚'
      },
      {
        title: 'Scene 2: Core Feature Highlights',
        description: 'Split-screen showing 24/7 SpO2 tracking, Bluetooth calling & 10-day battery',
        onScreenText: 'AMOLED • BT CALLING • 10-DAY BATTERY'
      },
      {
        title: 'Scene 3: Flash Launch Bonus',
        description: 'Free extra silicone strap offer and zero downpayment EMI badge',
        onScreenText: 'LIMITED LAUNCH PRICE — BUY NOW!'
      }
    ],
    caption: 'Upgrade your wrist game today! 🚀 Curved AMOLED display, crystal clear Bluetooth calling, and 100+ sports modes. Launch offer expires midnight. Link in bio! ⚡',
    hashtags: ['#TechReels', '#SmartwatchDeals', '#GadgetReview', '#UnboxingReels', '#TrendingTech'],
    gradient: 'from-blue-600 via-indigo-600 to-violet-900'
  },
  {
    id: 'beauty',
    category: '💄 Salon, Spa & Skincare',
    productName: 'Bridal Glow Transformation',
    objective: '✨ Before / After',
    duration: '15s',
    voiceArtist: 'Ananya R. (Soft Glam Hindi)',
    language: 'Hindi/Hinglish',
    hook: 'Get glass skin for your wedding season in just 3 simple steps!',
    scenes: [
      {
        title: 'Scene 1: Relatable Skin Problem Hook',
        description: 'Dull tired skin closeup with bold text: "Tired of stubborn tan & wedding stress?"',
        onScreenText: 'GET GLASS SKIN IN 3 STEPS ✨'
      },
      {
        title: 'Scene 2: Hydra-Facial Treatment',
        description: 'Aesthetic soothing spa footage with gentle water jet & botanical serum',
        onScreenText: 'DEEP HYDRATION & DETOX'
      },
      {
        title: 'Scene 3: Radiant Bridal Glow & Booking CTA',
        description: 'Stunning radiant bride smile with WhatsApp booking button & slot timer',
        onScreenText: 'BOOK BRIDAL PACKAGE ON WHATSAPP 💖'
      }
    ],
    caption: 'Turn heads on your special day! 👰 Experience our clinical Hydra-Glow bridal therapy. Slots booking fast for this wedding season. DM or WhatsApp us today! ✨💆‍♀️',
    hashtags: ['#BridalGlow', '#SkincareReels', '#SalonTransformation', '#WeddingPrep', '#GlassSkin'],
    gradient: 'from-pink-600 via-rose-600 to-purple-800'
  }
];

const reelFaqs = [
  {
    q: 'Do I need any video recording gear, cameras, or a microphone?',
    a: 'Not at all! You can generate high-converting video reels just by uploading product photos or typing a prompt. DhandaGrow AI automatically generates the visuals, animated kinetic text, voiceovers, and background music.'
  },
  {
    q: 'Does it support Indian regional languages and Hinglish?',
    a: 'Yes! DhandaGrow AI Reel Maker is built specifically for Indian businesses. We support natural-sounding AI voiceovers and captions in Hinglish, Hindi, Tamil, Telugu, Marathi, Gujarati, Bengali, and Indian-accented English.'
  },
  {
    q: 'What are kinetic captions, and do they really increase views?',
    a: 'Kinetic captions are word-by-word highlighted subtitles (made famous by Alex Hormozi and Ali Abdaal). Over 75% of Instagram users watch Reels on mute; kinetic captions keep viewers hooked and increase watch-time retention by up to 40%.'
  },
  {
    q: 'Can I choose my own video duration?',
    a: 'Yes. You can generate 15-second punchy offer reels (ideal for high-converting ads and sales), 30-second storytelling reels (ideal for engagement and viral hooks), or 60-second deep-dive feature reels.'
  },
  {
    q: 'Are the background music tracks copyright-safe for business ads?',
    a: 'Yes, 100%. All background music and audio tracks included in DhandaGrow AI are fully licensed and royalty-free, making them 100% safe for Instagram, YouTube Shorts, and Facebook commercial ads without copyright strikes.'
  },
  {
    q: 'How fast does the AI Reel Maker generate a complete video?',
    a: 'Once you click generate, the AI writes the hook, synthesizes the voiceover, syncs the footage, and renders the 1080p vertical video in approximately 60 seconds.'
  }
];

export default function ReelMakerPage() {
  const [activePreset, setActivePreset] = useState<ReelPreset>(reelPresets[0]);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(`${activePreset.caption}\n\n${activePreset.hashtags.join(' ')}`);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  return (
    <main className="min-h-screen bg-white selection:bg-pink-600 selection:text-white">
      <Navbar />
      
      {/* 1. Hero Section */}
      <section className="pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden relative bg-gradient-to-b from-[#fdf8fa] via-white to-white">
        {/* Subtle Decorative Gradient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-pink-200/80 mb-6">
                <Video className="w-4 h-4 text-pink-500" />
                <span className="text-xs sm:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-violet-600">
                  AI Viral Video Engine
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-bold text-slate-900 mb-6 tracking-tight leading-[1.1]">
                AI Reel Maker for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-violet-600">
                  High-Growth Brands
                </span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed font-normal mb-8 max-w-xl">
                Turn simple product photos or prompts into viral Instagram Reels & YouTube Shorts in 60 seconds. Auto-synced Hinglish voiceovers, Alex Hormozi-style kinetic captions, and high-converting hooks.
              </p>

              {/* Feature Value Bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 w-full max-w-lg">
                {[
                  'Viral Hooks & 3-Scene Storyboard',
                  'Natural Regional & Hinglish Voices',
                  'Word-by-Word Kinetic Subtitles',
                  '1-Click WhatsApp & Instagram Export'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <Link href="/login/user">
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="h-13 sm:h-14 px-8 text-base shadow-xl shadow-pink-500/25 group font-bold rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-violet-600 hover:from-pink-700 hover:to-violet-700 border-0 cursor-pointer w-full sm:w-auto"
                  >
                    <span className="flex items-center gap-2 text-white">
                      Create Your First Reel Free
                    </span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform text-white" />
                  </Button>
                </Link>

                <a 
                  href="#reel-formats-showcase" 
                  className="inline-flex items-center justify-center h-13 sm:h-14 px-7 text-sm sm:text-base font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-full transition-colors text-center"
                >
                  Watch Sample Reels
                </a>
              </div>
            </div>
            
            {/* Right Hero Mockup */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden border border-pink-200/60 shadow-[0_25px_70px_-15px_rgba(236,72,153,0.18)] bg-slate-900 group">
                <img 
                  src="/images/ai-reel-maker-hero.jpg" 
                  alt="DhandaGrow AI Reel Maker creating viral 9:16 Instagram Reel with Hinglish voiceover and multi-scene timeline" 
                  className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500 select-none"
                />

                {/* Floating Glass Badges */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md border border-white/60 px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-800">
                    Live 9:16 Reel Preview
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl shadow-lg flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-xs font-bold text-white">
                    4.2x Watch-Time Retention
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-pink-100 text-center">
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-violet-600 mb-2 tracking-tight">2M+</h3>
              <p className="text-xs sm:text-[13px] font-bold text-slate-500 uppercase tracking-wider">Reels & Shorts Generated</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-violet-600 mb-2 tracking-tight">4.8x</h3>
              <p className="text-xs sm:text-[13px] font-bold text-slate-500 uppercase tracking-wider">Average Watch Time Boost</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-violet-600 mb-2 tracking-tight">60s</h3>
              <p className="text-xs sm:text-[13px] font-bold text-slate-500 uppercase tracking-wider">Average Generation Time</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-violet-600 mb-2 tracking-tight">100%</h3>
              <p className="text-xs sm:text-[13px] font-bold text-slate-500 uppercase tracking-wider">Copyright-Safe Music</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Reel Simulator Widget */}
      <section className="py-20 sm:py-28 bg-[#faf9f6] relative border-b border-pink-100/70">
        <div 
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `linear-gradient(to right, #f8e7ee 1px, transparent 1px), linear-gradient(to bottom, #f8e7ee 1px, transparent 1px)`,
            backgroundSize: '36px 36px'
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-pink-600 font-bold text-xs sm:text-sm tracking-wider uppercase inline-block mb-2">
              Interactive Storyboard Simulator
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Test DhandaGrow’s 3-Scene Reel Engine
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3">
              Click any business category below to see instant viral hooks, 3-scene storyboards, and AI Hinglish voiceover configurations.
            </p>
          </div>

          {/* Preset Selector Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-10">
            {reelPresets.map((preset) => {
              const isSelected = activePreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => setActivePreset(preset)}
                  className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-pink-600 to-violet-600 text-white shadow-lg shadow-pink-600/25 scale-105'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-pink-300 hover:text-pink-600'
                  }`}
                >
                  <span>{preset.category}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Workspace Card */}
          <div className="bg-white rounded-[28px] sm:rounded-[36px] border border-pink-200/80 shadow-xl shadow-pink-950/5 p-6 sm:p-10 max-w-5xl mx-auto">
            
            {/* Top Config Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#fdf8fa] border border-pink-100 mb-8">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Product</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">{activePreset.productName}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Objective</span>
                <span className="text-xs sm:text-sm font-bold text-pink-600">{activePreset.objective}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Duration</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">{activePreset.duration} (Vertical 9:16)</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">AI Voice</span>
                <span className="text-xs sm:text-sm font-bold text-purple-700">{activePreset.voiceArtist}</span>
              </div>
            </div>

            {/* Split View: Left Hook & 3 Scenes | Right Caption & Action */}
            <div className="grid md:grid-cols-12 gap-8 items-stretch">
              
              {/* Left: 3-Scene Storyboard */}
              <div className="md:col-span-7 flex flex-col space-y-4">
                
                {/* Hook Callout */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-transparent border border-pink-200/80">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Flame className="w-4 h-4 text-pink-600" />
                    <span className="text-xs font-bold text-pink-700 uppercase tracking-wider">
                      Opening Hook (First 3 Seconds)
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    &ldquo;{activePreset.hook}&rdquo;
                  </p>
                </div>

                {/* 3 Scenes Timeline */}
                <div className="space-y-3">
                  {activePreset.scenes.map((scene, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3.5 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <div className="w-7 h-7 rounded-lg bg-pink-100 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-black text-pink-700">{idx + 1}</span>
                      </div>
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">{scene.title}</h4>
                          <span className="text-[10px] font-mono font-bold bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded">
                            {idx === 0 ? '0-5s' : idx === 1 ? '5-20s' : '20-30s'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-normal mb-1.5">
                          {scene.description}
                        </p>
                        <span className="inline-block text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100/60">
                          Text: {scene.onScreenText}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              {/* Right: Caption, Hashtags & Action */}
              <div className="md:col-span-5 flex flex-col justify-between bg-[#fffdfa] border border-pink-100 rounded-2xl sm:rounded-3xl p-6 sm:p-7">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">
                      Auto-Generated Caption
                    </span>
                    <button
                      onClick={handleCopyCaption}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-pink-600 bg-white border border-slate-200 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      {copiedCaption ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-white p-4 rounded-xl border border-slate-100 mb-4 whitespace-pre-line">
                    {activePreset.caption}
                  </p>

                  <div className="mb-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Trending Reel Audio & Tags
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activePreset.hashtags.map((tag, idx) => (
                        <span key={idx} className="text-xs font-semibold text-pink-700 bg-pink-50 px-2.5 py-1 rounded-md border border-pink-100/70">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-pink-100 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 font-medium">
                    Ready to render in full HD?
                  </div>
                  <Link href="/login/user">
                    <Button size="sm" className="bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-full px-5 cursor-pointer shadow-md shadow-pink-500/20">
                      Create Full Reel
                    </Button>
                  </Link>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. Viral Reel Formats Showcase Section */}
      <section id="reel-formats-showcase" className="py-20 sm:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-pink-600 font-bold text-xs sm:text-sm tracking-wider uppercase inline-block mb-2">
              Formats That Go Viral
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Curated for Instagram & YouTube Algorithms
            </h2>
            <p className="text-slate-500 text-base max-w-2xl mx-auto mt-3 font-normal">
              From festive sales and food cravings to tech unboxings and bridal transformations — formats engineered for maximum views.
            </p>
          </div>

          {/* Master Formats Collage Image */}
          <div className="mb-14 rounded-[28px] sm:rounded-[36px] overflow-hidden border border-pink-200/70 shadow-2xl shadow-pink-950/10 group">
            <img 
              src="/images/ai-reel-formats-showcase.jpg" 
              alt="Viral Instagram Reel formats for Indian businesses: Festive fashion, gourmet biryani, tech review, and bridal glow" 
              className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500 select-none"
            />
          </div>

          {/* 4 Format Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Viral Hook + Flash Sale',
                desc: 'Pattern-interrupting opening hook with bold kinetic text to stop fast-scrolling shoppers within the first 1.5 seconds.',
                badge: '26.3K Likes',
                badgeColor: 'bg-rose-100 text-rose-800'
              },
              {
                title: 'Sizzling Culinary Teaser',
                desc: 'Mouthwatering sensory close-ups paired with upbeat regional music to trigger instant weekend cravings and delivery orders.',
                badge: '34.2K Likes',
                badgeColor: 'bg-amber-100 text-amber-800'
              },
              {
                title: 'Gadget & Tech Teardown',
                desc: 'Curiosity-driven comparisons, pricing reveals, and feature breakdowns that generate massive comment section debate.',
                badge: '31.9K Likes',
                badgeColor: 'bg-blue-100 text-blue-800'
              },
              {
                title: 'Before & After Transformation',
                desc: 'Social-proof transformations for salons, skincare, fitness, and home decor with high save and share velocity.',
                badge: '41.5K Likes',
                badgeColor: 'bg-purple-100 text-purple-800'
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="bg-[#faf9f6] border border-pink-200/60 rounded-2xl p-6 hover:shadow-lg hover:border-pink-300 transition-all group"
              >
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full inline-block mb-3 ${item.badgeColor}`}>
                  {item.badge}
                </span>
                <h3 className="font-serif text-lg font-bold text-slate-900 mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {item.desc}
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
            <span className="text-violet-600 font-bold text-xs sm:text-sm tracking-wider uppercase inline-block mb-2">
              Studio Walkthrough
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Automated 3-Scene Production Pipeline
            </h2>
            <p className="text-slate-500 text-base max-w-2xl mx-auto mt-3 font-normal">
              From raw product photos to a finished 1080p vertical video with zero editing knowledge.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            {/* Left AI Editing Studio Visual */}
            <div className="w-full lg:w-1/2">
              <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-2xl border border-slate-200/80 group">
                <img 
                  src="/images/ai-reel-maker-workflow.jpg" 
                  alt="AI Reel Maker production studio with 3-scene storyboard, voiceover waveform, and WhatsApp order CTA" 
                  className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500"
                />
              </div>
            </div>
            
            {/* Right Steps Walkthrough */}
            <div className="w-full lg:w-1/2 flex flex-col space-y-8">
              
              <div className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center shadow-xs">
                  <span className="text-lg font-black text-pink-700">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1.5">
                    Pick a product or input a campaign idea
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-normal">
                    Select an item from your catalog or describe your offer. AI auto-detects your selling points and writes 3 attention-grabbing hooks.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center shadow-xs">
                  <span className="text-lg font-black text-violet-700">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1.5">
                    AI synthesizes voiceover & syncs kinetic text
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-normal">
                    Choose an emotional Indian voice (Hinglish, Hindi, Tamil, etc.). AI adds animated word-by-word kinetic captions with emoji highlights.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center shadow-xs">
                  <span className="text-lg font-black text-emerald-700">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1.5">
                    Auto-publish to Instagram & YouTube Shorts
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-normal">
                    Export high-bitrate 1080p MP4 or schedule automatic publishing straight to your Instagram account with captions and viral hashtags included.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/login/user">
                  <Button className="h-12 px-7 rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-violet-600 hover:from-pink-700 hover:to-violet-700 text-white font-bold shadow-lg shadow-pink-500/20 cursor-pointer">
                    Generate Your First Video Now
                  </Button>
                </Link>
              </div>

            </div>
            
          </div>
        </div>
      </section>

      {/* 6. Pro Reel Features Grid */}
      <section className="py-20 sm:py-28 bg-[#090b14] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#090b14] via-[#0d101d] to-[#090b14]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14 sm:mb-18">
            <span className="text-pink-400 font-bold text-xs sm:text-sm tracking-wider uppercase inline-block mb-2">
              Viral Growth Engine
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Built to Keep Audiences Hooked Till the Last Second
            </h2>
            <p className="text-slate-400 text-base max-w-2xl mx-auto font-normal">
              Every feature is tuned around retention metrics, share velocity, and organic algorithmic reach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Alex Hormozi-Style Kinetic Captions",
                desc: "Eye-catching word-by-word animated subtitles with dynamic color changes and emojis that keep mute-browsers reading.",
                icon: <Subtitles className="w-6 h-6 text-[#fc9a5d]" />
              },
              {
                title: "50+ Indian Regional AI Voices",
                desc: "High-energy, authentic voices across Hindi, Hinglish, Tamil, Telugu, Marathi, Bengali, and English with zero robotic flatness.",
                icon: <Mic2 className="w-6 h-6 text-[#f0449b]" />
              },
              {
                title: "Dynamic B-Roll & Footage Matching",
                desc: "AI intelligently cuts between macro product shots, lifestyle scenes, and animated call-to-actions to maximize visual motion.",
                icon: <Layers className="w-6 h-6 text-[#be32ff]" />
              },
              {
                title: "Beat-Synced Background Audio",
                desc: "Thousands of royalty-free, trending audio tracks auto-synced to cut precisely on the beat drops and scene transitions.",
                icon: <Music className="w-6 h-6 text-blue-400" />
              },
              {
                title: "1-Click Multi-Platform Resizing",
                desc: "Seamless 9:16 vertical exports ready for Instagram Reels, YouTube Shorts, and Facebook Video Ads without letterboxing.",
                icon: <Video className="w-6 h-6 text-emerald-400" />
              },
              {
                title: "Direct WhatsApp Order CTAs",
                desc: "Overlay custom WhatsApp contact stickers, discount vouchers, and bio link animations directly on the closing screen.",
                icon: <Share2 className="w-6 h-6 text-pink-400" />
              }
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-7 hover:bg-white/[0.08] hover:border-pink-500/40 transition-all group"
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

      {/* 7. FAQs Section */}
      <section className="py-20 sm:py-28 bg-[#faf9f6] border-b border-pink-100/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-pink-600 font-bold text-xs sm:text-sm tracking-wider uppercase inline-block mb-2">
              Reel Creation FAQs
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {reelFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white border border-pink-200/60 rounded-2xl overflow-hidden transition-shadow shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-pink-600 transition-colors cursor-pointer"
                  >
                    <span className="text-sm sm:text-base leading-snug">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-pink-600 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
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
          <div className="bg-gradient-to-br from-pink-600 via-purple-600 to-violet-700 rounded-[32px] sm:rounded-[44px] p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 blur-[100px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2" />
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 relative z-10 tracking-tight leading-tight">
              Ready to Go Viral on Instagram & Shorts?
            </h2>
            <p className="text-white/95 text-base sm:text-lg max-w-2xl mx-auto mb-8 relative z-10 font-normal">
              Join thousands of business founders and marketers who create studio-quality reels in seconds with DhandaGrow AI.
            </p>
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login/user">
                <Button 
                  size="lg" 
                  className="h-14 px-10 text-base font-bold rounded-full text-purple-900 bg-white hover:bg-slate-50 border-0 shadow-xl cursor-pointer"
                >
                  Generate Your First Reel Free
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
