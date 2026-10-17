'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, TrendingUp, Target, ArrowRight, CheckCircle2, 
  Zap, Copy, Check, MessageCircle, Layers, SplitSquareHorizontal, 
  Eye, ShieldCheck, ChevronDown, ShoppingBag, Percent, Star, Flame, Store
} from 'lucide-react';
import { FeatureShowcaseSection } from '@/components/FeatureShowcaseSection';

interface AdPreset {
  id: string;
  category: string;
  productName: string;
  originalPrice: string;
  offerPrice: string;
  discountBadge: string;
  image: string;
  hook: string;
  headline: string;
  primaryText: {
    hinglish: string;
    hindi: string;
    english: string;
  };
  ctaText: string;
  badges: string[];
}

const adPresets: AdPreset[] = [
  {
    id: 'saree',
    category: 'Ethnic & Saree',
    productName: 'Royal Banarasi Silk Saree',
    originalPrice: '₹4,999',
    offerPrice: '₹1,999',
    discountBadge: 'FLAT 60% OFF',
    image: '/images/product-banarasi-saree.jpg',
    hook: '🔥 Festive Dhamaka! Pure Zari Banarasi Sarees at Factory-Direct Prices',
    headline: 'Diwali Special Banarasi Sarees · Flat 60% OFF',
    primaryText: {
      hinglish: 'Iss festive season mein lagie sabse khoobsurat! ✨ Pure handloom Banarasi silk saree gold zari work ke saath. Cash on Delivery available aur 7 din ki aasaan return policy. Aaj hi order karein!',
      hindi: 'इस त्यौहारी सीज़न में पहनिए असली बनारसी सिल्क साड़ी! ✨ शुद्ध जरी वर्क, पूरे भारत में फ्री डिलीवरी और कैश ऑन डिलीवरी की सुविधा उपलब्ध। सीमित स्टॉक, आज ही बुक करें!',
      english: 'Elevate your festive elegance with our Royal Banarasi Silk Saree. Features authentic golden zari border and pure silk drape. Cash on Delivery available across India with 7-day hassle-free returns.'
    },
    ctaText: 'Order on WhatsApp',
    badges: ['Cash on Delivery', 'Free Shipping', '7-Day Return', 'Pure Zari Weave']
  },
  {
    id: 'jewellery',
    category: 'Bridal Jewellery',
    productName: 'Royal Kundan Choker Set',
    originalPrice: '₹6,499',
    offerPrice: '₹2,499',
    discountBadge: 'WEDDING OFFER 62% OFF',
    image: '/images/product-kundan-necklace.jpg',
    hook: '✨ Bollywood Bridal Glow without the 1-Lakh Price Tag!',
    headline: 'Handcrafted Kundan Choker Set with Matching Jhumkas',
    primaryText: {
      hinglish: 'Shaadi ya reception ke liye royal look chahiye? 👑 Handcrafted 22K gold-plated Kundan choker set with pearls. Pehli baar local showroom price se 60% sasta. Order karein WhatsApp par!',
      hindi: 'शादी और रिसेप्शन के लिए शाही लुक! 👑 22K गोल्ड प्लेटेड कुंदन चोकर सेट मैचिंग झुमकों के साथ। पूरे भारत में कैश ऑन डिलीवरी उपलब्ध। आज ही वॉट्सऐप पर आर्डर करें!',
      english: 'Look like royalty at every wedding. Handcrafted 22K gold-plated Kundan choker set adorned with semi-precious stones. 100% tarnish-resistant with Cash on Delivery across India.'
    },
    ctaText: 'Book on WhatsApp',
    badges: ['22K Gold Plated', 'Anti-Tarnish', 'Cash on Delivery', 'Matching Jhumkas']
  },
  {
    id: 'skincare',
    category: 'Ayurvedic Skincare',
    productName: 'Kumkumadi Saffron Glow Serum',
    originalPrice: '₹1,899',
    offerPrice: '₹799',
    discountBadge: 'BUY 1 GET 1 FREE',
    image: '/images/product-saffron-serum.jpg',
    hook: '🌿 Kashmiri Saffron Radiance in 7 Days Guaranteed!',
    headline: 'Ayurvedic Saffron Glow Elixir · 100% Herbal & Toxin Free',
    primaryText: {
      hinglish: 'Dull skin aur dark spots ko bolo alvida! ✨ Pure Kashmiri Kesar aur 26 Ayurvedic herbs se bana Kumkumadi serum. Visible radiance sirf 7 dino mein. Buy 1 Get 1 Free offer limited time ke liye!',
      hindi: 'प्राकृतिक कश्मीरी केसर से पाइए चेहरे पर कुदरती निखार! 🌿 100% शुद्ध आयुर्वेदिक और केमिकल-मुक्त। सिर्फ 7 दिनों में असर दिखें। आज का स्पेशल ऑफर: 1 के साथ 1 फ्री!',
      english: 'Say goodbye to pigmentation and uneven skin tone. 100% pure Ayurvedic Kumkumadi oil enriched with real Kashmiri saffron. Clinically proven results in 7 days. Buy 1 Get 1 Free today!'
    },
    ctaText: 'Claim Festive BOGO',
    badges: ['100% Ayurvedic', 'Kashmiri Saffron', 'No Parabens', 'Visible in 7 Days']
  },
  {
    id: 'footwear',
    category: 'Royal Footwear',
    productName: 'Handcrafted Velvet Mojaris',
    originalPrice: '₹2,999',
    offerPrice: '₹1,299',
    discountBadge: 'FLAT 55% OFF',
    image: '/images/product-velvet-mojaris.jpg',
    hook: '👞 Royal Comfort with Pure Memory Cushion Sole!',
    headline: 'Hand-Embroidered Velvet Mojaris · Traditional Meets Luxury',
    primaryText: {
      hinglish: 'Kurta pajama ya sherwani ke saath pehniye authentic Jaipur mojaris! 👑 Pure velvet fabric aur triple-padded sole taaki shaadi mein poore din comfortable rahein. Cash on Delivery available!',
      hindi: 'कुर्ते-पायजामे और शेरवानी पर पहनिए रॉयल मोजरी! 👑 असली मखमली कपड़ा और ट्रिपल कुशन सोल जो दे दिनभर का आराम। पूरे भारत में कैश ऑन डिलीवरी की सुविधा उपलब्ध!',
      english: 'Complete your wedding attire with handcrafted royal velvet mojaris. Triple-cushioned insole ensures all-day comfort without shoe bites. Available in classic navy and emerald green.'
    },
    ctaText: 'Shop Now on WhatsApp',
    badges: ['Pure Velvet', 'Memory Foam Cushion', 'Anti-Bite Collar', 'Cash on Delivery']
  }
];

const faqs = [
  {
    q: 'Are ad creatives generated by DhandaGrow compliant with Meta & Google policies?',
    a: 'Yes, 100%. Our AI ad engine adheres strictly to Meta Facebook/Instagram Advertising Standards and Google Ads policies. Headlines, text-to-image ratios, and claim structures are calibrated to eliminate ad rejection risks.'
  },
  {
    q: 'Can I create Click-to-WhatsApp ads with pre-filled message hooks?',
    a: 'Yes! DhandaGrow AI is built specifically for Indian businesses where WhatsApp is the primary closing channel. The AI writes click-worthy opening WhatsApp messages (e.g., "Namaste! I want to book this Banarasi Saree at ₹1,999") so prospects message you directly.'
  },
  {
    q: 'How does the A/B creative variation generator work?',
    a: 'For any product or offer, DhandaGrow AI automatically generates 5 psychologically distinct ad angles: Urgency/FOMO, Direct Discount, Social Proof/Customer Review, Curiosity Hook, and Problem-Solution. You can test these simultaneously to discover your highest ROAS winner.'
  },
  {
    q: 'Do I get complete commercial ownership of generated creatives?',
    a: 'Yes. All image compositions, product backgrounds, headlines, and copywriting produced in DhandaGrow AI are 100% royalty-free for commercial use across paid Meta ads, Google Performance Max, hoardings, and print brochures.'
  },
  {
    q: 'How does it integrate with my Meta Ads Manager and WhatsApp CRM?',
    a: 'You can export high-resolution assets in 4:5 (Feed), 9:16 (Story/Reels), and 16:9 (Display) formats in one click, or push them directly into connected Meta Ads campaigns with auto-synced lead capture into DhandaGrow Leads CRM.'
  }
];

export default function AIAdsPage() {
  const [activePreset, setActivePreset] = useState<AdPreset>(adPresets[0]);
  const [selectedFormat, setSelectedFormat] = useState<'feed' | 'story' | 'whatsapp'>('feed');
  const [selectedLang, setSelectedLang] = useState<'hinglish' | 'hindi' | 'english'>('hinglish');
  const [copiedText, setCopiedText] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleCopyAdCopy = () => {
    const textToCopy = `Headline: ${activePreset.headline}\n\nPrimary Text:\n${activePreset.primaryText[selectedLang]}\n\nOffer: ${activePreset.discountBadge} - ${activePreset.offerPrice} (M.R.P ${activePreset.originalPrice})\nCTA: ${activePreset.ctaText}\n\nBadges: ${activePreset.badges.join(' | ')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2200);
  };

  const handleShareWhatsApp = () => {
    const text = `*${activePreset.headline}*\n\n${activePreset.primaryText[selectedLang]}\n\n👉 *Offer Price:* ${activePreset.offerPrice} (~${activePreset.originalPrice}~)\n🔥 *Deal:* ${activePreset.discountBadge}\n\n🚚 ${activePreset.badges.join(' • ')}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="min-h-screen bg-[#070b14] text-white selection:bg-emerald-500 selection:text-black font-sans">
      <Navbar />

      {/* 1. High-Performance Hero Section */}
      <section className="pt-20 sm:pt-24 lg:pt-24 pb-10 lg:pb-14 overflow-hidden relative bg-gradient-to-b from-[#060911] via-[#090e1c] to-[#070b14]">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none -translate-y-1/2" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 mb-6 backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  AI Advertisement Maker for Bharat
                </span>
                <span className="bg-emerald-500/20 text-emerald-200 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-500/30">
                  v2.0 Active
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-bold text-white mb-5 tracking-tight leading-[1.08]">
                High-ROAS Ad Creatives <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 font-serif italic">
                  in 3 Seconds Flat.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal mb-8 max-w-xl">
                Stop burning ad spend on generic Canva banners that get ignored. Generate high-converting Meta, Instagram, Google, and WhatsApp Click-to-Chat ads with automatic price slash badges, Indian trust triggers, and persuasive Hinglish hooks.
              </p>

              {/* Value Bullet Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 w-full max-w-lg">
                {[
                  '4.8x Average Return on Ad Spend (ROAS)',
                  'Hinglish & Regional Persuasive Copy',
                  'Auto Price-Slash & COD Trust Badges',
                  'Instant Click-to-WhatsApp Setup',
                  'Meta & Google Policy Compliant',
                  'Multi-Format Auto Resize (4:5, 9:16, 16:9)'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <Link href="/login/user">
                  <Button 
                    size="lg" 
                    className="h-13 sm:h-14 px-8 text-base font-bold rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 shadow-xl shadow-emerald-500/20 border-0 cursor-pointer w-full sm:w-auto hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      Launch AI Ad Studio
                    </span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>

                <a 
                  href="#ad-simulator" 
                  className="inline-flex items-center justify-center h-13 sm:h-14 px-7 text-sm sm:text-base font-semibold text-slate-200 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/40 rounded-full transition-all text-center"
                >
                  <Eye className="w-4 h-4 mr-2 text-emerald-400" />
                  Try Live Ad Simulator
                </a>
              </div>

              <div className="mt-6 flex items-center gap-4 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Meta Approved
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" /> ~3s Generation
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-cyan-400" /> Brand Kit Sync
                </span>
              </div>
            </div>

            {/* Right Column: Hero Ad Studio Mockup */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden border border-emerald-500/30 bg-[#0d1322] shadow-[0_20px_70px_rgba(16,185,129,0.18)] p-4 sm:p-5 group">
                
                {/* Header Bar */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="ml-2 text-xs font-mono text-slate-400">DhandaGrow-Meta-AdStudio.ai</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <Flame className="w-3 h-3" /> 4.8x ROAS Winner
                    </span>
                  </div>
                </div>

                {/* Ad Preview Card Visual */}
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-950">
                  <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
                    <img 
                      src="/images/product-banarasi-saree.jpg" 
                      alt="DhandaGrow AI Advertisement Maker generating high-converting Banarasi Saree ad creative" 
                      className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500 select-none"
                    />

                    {/* Floating Ad Overlays */}
                    <div className="absolute top-3 left-3 bg-rose-600 text-white font-black text-xs px-3 py-1 rounded-lg shadow-lg flex items-center gap-1.5 uppercase tracking-wider">
                      <Percent className="w-3.5 h-3.5" /> FLAT 60% OFF
                    </div>

                    <div className="absolute top-3 right-3 bg-black/85 backdrop-blur-md border border-white/20 text-amber-300 font-bold text-xs px-3 py-1 rounded-lg shadow-md flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.9 (1,240+ Reviews)
                    </div>

                    {/* Price & COD Banner */}
                    <div className="absolute bottom-3 left-3 right-3 bg-black/85 backdrop-blur-md border border-white/15 p-3 rounded-xl flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base sm:text-lg font-black text-white">₹1,999</span>
                          <span className="text-xs line-through text-slate-400">₹4,999</span>
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                            COD Available
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 truncate max-w-[220px]">Pure Handloom Banarasi Silk · Free Shipping</p>
                      </div>

                      <div className="shrink-0 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-500/25">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Order via WhatsApp</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-bar stats */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">CTR Lift</p>
                    <p className="text-base font-black text-emerald-400">+340%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Cost Per Lead</p>
                    <p className="text-base font-black text-white">₹8.50</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Meta Sync</p>
                    <p className="text-base font-black text-cyan-400">Instant</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Key Performance Metrics Bar */}
      <section className="py-8 border-y border-emerald-500/20 bg-[#060a14] relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x-0 md:divide-x divide-white/10 text-center">
            <div className="flex flex-col items-center justify-center p-2">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-1.5 tracking-tight">4.8x</h3>
              <p className="text-xs sm:text-[13px] font-bold text-slate-400 uppercase tracking-wider">Average Meta Ads ROAS</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-1.5 tracking-tight">₹8.50</h3>
              <p className="text-xs sm:text-[13px] font-bold text-slate-400 uppercase tracking-wider">Avg. WhatsApp Lead Cost</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-1.5 tracking-tight">50,000+</h3>
              <p className="text-xs sm:text-[13px] font-bold text-slate-400 uppercase tracking-wider">Bharat Ads Generated</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-1.5 tracking-tight">~3s</h3>
              <p className="text-xs sm:text-[13px] font-bold text-slate-400 uppercase tracking-wider">Multi-Format Render Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Live Ad Creative & Hook Simulator */}
      <section id="ad-simulator" className="py-10 sm:py-14 bg-[#0a0f1d] relative border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2.5 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              Live Interactive Ad Simulator
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Test DhandaGrow High-ROAS Ad Engine
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-2.5">
              Select an Indian retail product, toggle formats (Feed, Story, WhatsApp), test Hinglish or Hindi copy, and see how DhandaGrow AI crafts high-converting creatives.
            </p>
          </div>

          {/* Product Category Selector Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6">
            {adPresets.map((preset) => {
              const isSelected = activePreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => setActivePreset(preset)}
                  className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105'
                      : 'bg-[#121829] text-slate-300 border border-white/10 hover:border-emerald-500/40 hover:text-white'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{preset.category}</span>
                </button>
              );
            })}
          </div>

          {/* Simulator Workspace Card */}
          <div className="bg-[#0f172a] rounded-[28px] sm:rounded-[36px] border border-emerald-500/30 p-6 sm:p-8 max-w-5xl mx-auto shadow-2xl">
            
            {/* Top Workspace Controls: Format & Language */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-5 mb-5 border-b border-white/10">
              
              {/* Ad Format Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                  Format:
                </span>
                <div className="inline-flex bg-[#1e293b] p-1 rounded-xl">
                  <button
                    onClick={() => setSelectedFormat('feed')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedFormat === 'feed'
                        ? 'bg-emerald-500 text-slate-950 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    4:5 Meta Feed
                  </button>
                  <button
                    onClick={() => setSelectedFormat('story')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedFormat === 'story'
                        ? 'bg-emerald-500 text-slate-950 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    9:16 Story/Reel
                  </button>
                  <button
                    onClick={() => setSelectedFormat('whatsapp')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedFormat === 'whatsapp'
                        ? 'bg-emerald-500 text-slate-950 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Click-to-WhatsApp
                  </button>
                </div>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                  Language:
                </span>
                <div className="inline-flex bg-[#1e293b] p-1 rounded-xl">
                  <button
                    onClick={() => setSelectedLang('hinglish')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedLang === 'hinglish'
                        ? 'bg-emerald-500 text-slate-950 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Hinglish (Best ROAS)
                  </button>
                  <button
                    onClick={() => setSelectedLang('hindi')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedLang === 'hindi'
                        ? 'bg-emerald-500 text-slate-950 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Hindi
                  </button>
                  <button
                    onClick={() => setSelectedLang('english')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedLang === 'english'
                        ? 'bg-emerald-500 text-slate-950 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

            </div>

            {/* Split View: Left Visual Ad Preview | Right Copywriting & CTA */}
            <div className="grid md:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Column: Visual Ad Card Preview */}
              <div className="md:col-span-6 flex flex-col justify-between">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black group">
                  <div className={`relative overflow-hidden ${selectedFormat === 'story' ? 'aspect-[9/16] max-h-[460px] mx-auto' : 'aspect-[4/3] sm:aspect-[4/5]'}`}>
                    <img 
                      src={activePreset.image} 
                      alt={activePreset.productName}
                      className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500 select-none"
                    />

                    {/* Top Discount Badge */}
                    <div className="absolute top-3 left-3 bg-rose-600 text-white font-black text-xs px-3 py-1 rounded-lg shadow-lg flex items-center gap-1">
                      <Percent className="w-3 h-3" /> {activePreset.discountBadge}
                    </div>

                    {/* Format Tag */}
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md border border-white/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                      {selectedFormat === 'feed' ? 'Meta Feed 4:5' : selectedFormat === 'story' ? 'Story 9:16' : 'Click-to-WhatsApp'}
                    </div>

                    {/* Bottom Floating Price Strip */}
                    <div className="absolute bottom-3 left-3 right-3 bg-[#0d1322]/90 backdrop-blur-md border border-white/15 p-3 rounded-xl">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-black text-white">{activePreset.offerPrice}</span>
                          <span className="text-xs text-slate-400 line-through">{activePreset.originalPrice}</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                          Cash on Delivery
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-200 truncate">{activePreset.productName}</p>
                    </div>
                  </div>
                </div>

                {/* Trust Badges Strip */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {activePreset.badges.map((b, i) => (
                    <span key={i} className="text-[11px] font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                      ✓ {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Copywriting & High-Converting Headline */}
              <div className="md:col-span-6 flex flex-col justify-between bg-[#131b2e] border border-white/10 rounded-2xl p-5 sm:p-6">
                <div>
                  
                  {/* Psychological Opening Hook */}
                  <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                      Tested Psychological Hook
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                      {activePreset.hook}
                    </p>
                  </div>

                  {/* Headline & Copy Button */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Ad Headline &amp; Body Copy
                    </span>
                    <button
                      onClick={handleCopyAdCopy}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-emerald-400 bg-white/5 border border-white/10 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      {copiedText ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Primary Text Content */}
                  <div className="bg-[#0b101d] p-3.5 rounded-xl border border-white/5 mb-4">
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal whitespace-pre-line">
                      {activePreset.primaryText[selectedLang]}
                    </p>
                  </div>

                  {/* Call to Action Bar */}
                  <div className="p-3 bg-[#0b101d] rounded-xl border border-white/5 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Button CTA:</span>
                    <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                      {activePreset.ctaText}
                    </span>
                  </div>

                </div>

                {/* Direct Action Hub */}
                <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <button
                    onClick={handleShareWhatsApp}
                    className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Share Offer to WhatsApp
                  </button>

                  <Link href="/login/user" className="w-full sm:w-auto">
                    <Button size="default" className="h-11 w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer">
                      Launch Full Ad Studio &rarr;
                    </Button>
                  </Link>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. Multi-Format Ad Showcase Collage */}
      <section className="py-10 sm:py-14 bg-[#070b14] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-6 sm:mb-8">
            <span className="text-emerald-400 font-bold text-xs sm:text-sm tracking-wider uppercase inline-block mb-2">
              Multi-Placement Mastery
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              One Campaign Idea · Ready for Every Screen
            </h2>
            <p className="text-slate-400 text-base max-w-2xl mx-auto mt-2.5 font-normal">
              Whether you are running Instagram Feed ads, high-converting WhatsApp Click-to-Chat campaigns, or Google Display banners — DhandaGrow formats everything automatically.
            </p>
          </div>

          {/* Master Ad Collage Image */}
          <div className="mb-8 rounded-[28px] sm:rounded-[36px] overflow-hidden border border-emerald-500/30 shadow-2xl group bg-slate-950 max-w-6xl mx-auto">
            <img 
              src="/images/ai-marketing-workspace.jpg" 
              alt="DhandaGrow AI Advertisement Maker multi-format ad engine for Indian businesses" 
              className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500 select-none"
            />
          </div>

          {/* 4 Placement Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: 'Meta Feed Ads (4:5)',
                desc: 'Pattern-interrupting borders, price drop tags, and bold typography optimized for maximum thumb-stop rate in Instagram & Facebook feeds.',
                tag: 'High Conversion',
                badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              },
              {
                title: 'Click-to-WhatsApp Ads',
                desc: 'Pre-filled message hooks sending buyers straight into WhatsApp chat for direct closing, COD verification, and instant upselling.',
                tag: 'Lowest CPA',
                badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30'
              },
              {
                title: 'Story & Reel Ads (9:16)',
                desc: 'Full-screen vertical motion cards with animated swipe-up stickers, flash timer urgency, and mobile-first layouts.',
                tag: 'Viral Reach',
                badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
              },
              {
                title: 'Google Performance Max',
                desc: 'Auto-cutout product photos placed on clean high-contrast studio podiums with 300 DPI clarity for Google Shopping & Display.',
                tag: 'Search & Display',
                badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 hover:border-emerald-500/50 hover:bg-[#131d33] transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block border mb-3 ${item.badgeColor}`}>
                    {item.tag}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Comparison Matrix: Traditional Agency vs Generic Tools vs DhandaGrow AI */}
      <section className="py-10 sm:py-14 bg-[#0a0f1d] relative border-y border-emerald-500/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-6 sm:mb-8">
            <span className="text-emerald-400 font-bold text-xs sm:text-sm tracking-wider uppercase inline-block mb-2">
              The Performance Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Why Indian Merchants Choose DhandaGrow
            </h2>
            <p className="text-slate-400 text-base max-w-2xl mx-auto mt-2.5 font-normal">
              Compare how DhandaGrow AI Advertisement Maker outclasses expensive performance agencies and generic international Canva templates.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse bg-[#0d1322] rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/30">
              <thead>
                <tr className="bg-slate-950 text-white text-xs sm:text-sm">
                  <th className="p-4 sm:p-5 font-bold">Feature / Requirement</th>
                  <th className="p-4 sm:p-5 font-semibold text-slate-400">Freelance / Ad Agency</th>
                  <th className="p-4 sm:p-5 font-semibold text-slate-400">Generic Canva / DIY</th>
                  <th className="p-4 sm:p-5 font-bold text-emerald-400 bg-emerald-950/60">DhandaGrow AI Ad Maker</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs sm:text-sm text-slate-300">
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Ad Creative Turnaround</td>
                  <td className="p-4 sm:p-5 text-slate-400">3 – 5 Days</td>
                  <td className="p-4 sm:p-5 text-slate-400">2 – 3 Hours manual editing</td>
                  <td className="p-4 sm:p-5 font-black text-emerald-400 bg-emerald-500/10">⚡ Under 3 Seconds</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Monthly Retainer Cost</td>
                  <td className="p-4 sm:p-5 text-slate-400">₹25,000 – ₹50,000 / mo</td>
                  <td className="p-4 sm:p-5 text-slate-400">₹4,000 subscription + manual time</td>
                  <td className="p-4 sm:p-5 font-black text-emerald-400 bg-emerald-500/10">Included in DhandaGrow</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Hinglish &amp; Bharat Copy Nuance</td>
                  <td className="p-4 sm:p-5 text-slate-400">Hit or miss copywriters</td>
                  <td className="p-4 sm:p-5 text-slate-400">Zero (Manual typing only)</td>
                  <td className="p-4 sm:p-5 font-black text-emerald-400 bg-emerald-500/10">Native High-ROAS Nuance</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Price Slash &amp; COD Badging</td>
                  <td className="p-4 sm:p-5 text-slate-400">Manual revisions required</td>
                  <td className="p-4 sm:p-5 text-slate-400">Manual layout alignment</td>
                  <td className="p-4 sm:p-5 font-black text-emerald-400 bg-emerald-500/10">100% Automated Stamping</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">1-Click WhatsApp Lead Setup</td>
                  <td className="p-4 sm:p-5 text-slate-400">Complex URL tracking setup</td>
                  <td className="p-4 sm:p-5 text-slate-400">Not supported</td>
                  <td className="p-4 sm:p-5 font-black text-emerald-400 bg-emerald-500/10">Instant Pre-filled Hook</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* 6. Pro Ad Engine Features Grid */}
      <section className="py-10 sm:py-14 bg-[#070b14] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-6 sm:mb-8">
            <span className="text-emerald-400 font-bold text-xs sm:text-sm tracking-wider uppercase inline-block mb-2">
              Engineered for High ROAS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Enterprise Ad Tools Built for Indian Merchants
            </h2>
            <p className="text-slate-400 text-base max-w-2xl mx-auto mt-2.5 font-normal">
              Everything you need to launch, test, and scale winning campaigns on Meta and Google without graphic designers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Automated 5-Angle A/B Testing",
                desc: "AI produces 5 psychologically distinct ad angles (FOMO, Price Drop, Social Proof, Curiosity, Direct) so you find winning creative fast.",
                icon: <SplitSquareHorizontal className="w-6 h-6 text-emerald-400" />
              },
              {
                title: "100+ Indian Festival Campaigns",
                desc: "Pre-calibrated templates for Diwali, Holi, Navratri, Eid, Rakhi, and Wedding Bonanza with gold borders and festive lighting.",
                icon: <Sparkles className="w-6 h-6 text-amber-400" />
              },
              {
                title: "Auto-Logo & Brand Color Stamping",
                desc: "AI Brand Brain automatically places your brand logo, font pairing, and signature color scheme on every generated creative.",
                icon: <Layers className="w-6 h-6 text-cyan-400" />
              },
              {
                title: "Click-to-WhatsApp Lead Funnel",
                desc: "Send buyers straight to WhatsApp chat with pre-filled message hooks and sync inquiries directly with DhandaGrow Leads CRM.",
                icon: <MessageCircle className="w-6 h-6 text-emerald-400" />
              },
              {
                title: "Multi-Platform Smart Resize",
                desc: "One click to resize and re-layout your creative across Meta Feed (4:5), Stories/Reels (9:16), and Google Display banners.",
                icon: <Target className="w-6 h-6 text-blue-400" />
              },
              {
                title: "100% Commercial Rights & 4K Quality",
                desc: "Download full 300 DPI print-ready and ad-network-ready creatives with zero watermark and complete commercial ownership.",
                icon: <ShieldCheck className="w-6 h-6 text-teal-400" />
              }
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className="bg-[#0e1424] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-7 hover:border-emerald-500/40 hover:bg-[#12192e] transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5 tracking-tight group-hover:text-emerald-400 transition-colors">
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
      <section className="py-10 sm:py-14 bg-[#0a0f1d] border-t border-emerald-500/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-6 sm:mb-8">
            <span className="text-emerald-400 font-bold text-xs sm:text-sm tracking-wider uppercase inline-block mb-2">
              Common Questions
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-white hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <span className="text-sm sm:text-base leading-snug">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-emerald-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 8. Feature Showcase Section Integration */}
      <FeatureShowcaseSection feature="ai-ads" />

      {/* 9. High-Converting Call To Action (CTA) */}
      <section className="py-10 sm:py-14 bg-[#070b14] relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl border border-emerald-500/30">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2" />
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 relative z-10 tracking-tight leading-tight">
              Ready to Supercharge Your Ad ROAS?
            </h2>
            <p className="text-white/95 text-base sm:text-lg max-w-2xl mx-auto mb-8 relative z-10 font-normal">
              Join thousands of Indian D2C brands, retail merchants, and performance marketers who save hours every week creating winning ads with DhandaGrow AI.
            </p>
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login/user">
                <Button 
                  size="lg" 
                  className="h-14 px-10 text-base font-bold rounded-full text-slate-950 bg-emerald-400 hover:bg-emerald-300 border-0 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-slate-950 mr-2" />
                  Launch AI Ad Studio for Free
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
