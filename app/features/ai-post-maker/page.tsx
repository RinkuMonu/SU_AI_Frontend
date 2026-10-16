'use client';

import React, { useState, useId } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { FeatureShowcaseSection } from '@/components/FeatureShowcaseSection';
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
  BadgePercent,
  Send,
  Eye,
  Sliders,
  Globe,
  Languages,
  RotateCw,
  Crown,
  MessageCircle,
  CheckCheck,
  Wand2,
  Building2,
  Calendar,
  Flame,
  Star,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Store
} from 'lucide-react';

interface InteractivePreset {
  id: string;
  category: string;
  tag: string;
  icon: string;
  businessName: string;
  businessCity: string;
  brandColor: string;
  aspectImages: {
    square: string;
    story: string;
    banner: string;
  };
  prompt: string;
  badge: string;
  headline: string;
  subtext: string;
  offerText: string;
  captions: {
    hinglish: string;
    hindi: string;
    english: string;
  };
  hashtags: string[];
  ctaText: string;
  simulatedTime: string;
}

const interactivePresets: InteractivePreset[] = [
  {
    id: 'ethnic',
    category: '👗 Royal Ethnic & Bridal Wear',
    tag: 'Luxury Boutique',
    icon: '✨',
    businessName: 'Shyamal & Kumkum Boutique',
    businessCity: 'Jaipur, Rajasthan',
    brandColor: '#d97706',
    aspectImages: {
      square: '/images/diwali-festive-banner.jpg',
      story: '/images/diwali-festive-banner.jpg',
      banner: '/images/diwali-festive-banner.jpg',
    },
    prompt: 'Create a royal ethnic luxury promotional banner for Shyamal & Kumkum Boutique featuring handcrafted Banarasi silk sarees, ornate golden border, and Flat 40% OFF badge',
    badge: 'SPECIAL SALE ✨',
    headline: 'Royal Ethnic Luxury Sale: Pure Banarasi Silk & Designer Outfits',
    subtext: 'Handcrafted royal weaves, pure Banarasi silk collection & boutique designer wear.',
    offerText: 'FLAT 40% OFF',
    captions: {
      hinglish: '✨ Apne style ko banayein royal! Shyamal & Kumkum ke exclusive collection par paayein Flat 40% OFF. Pure Banarasi silk sarees aur designer outfits available. Direct showroom visit karein ya WhatsApp par order book karein! 👗✨',
      hindi: '✨ अपने अंदाज़ को बनाएं और भी ख़ास Shyamal & Kumkum के साथ! हमारे शुद्ध बनारसी सिल्क एवं डिज़ाइनर परिधानों पर पाएं फ्लैट 40% की विशेष छूट। सीमित स्टॉक उपलब्ध। आज ही व्हाट्सएप पर आर्डर करें! 👗✨',
      english: '✨ Elevate your personal style with royal luxury from Shyamal & Kumkum Boutique. Enjoy Flat 40% OFF on handcrafted Banarasi silk sarees and designer ethnic wear. Order now via WhatsApp! 👗✨',
    },
    hashtags: ['#EthnicWear', '#RoyalFashion', '#BanarasiSaree', '#ShyamalKumkum', '#LuxuryBoutique', '#VocalForLocal'],
    ctaText: 'Order via WhatsApp 📲',
    simulatedTime: '0.8s'
  },
  {
    id: 'food',
    category: '🍛 Restaurant & Dining',
    tag: 'Weekend Special',
    icon: '🥘',
    businessName: 'Dawat-e-Khaas Restaurant',
    businessCity: 'Hyderabad, Telangana',
    brandColor: '#ea580c',
    aspectImages: {
      square: '/images/food-feast-banner.jpg',
      story: '/images/food-feast-banner.jpg',
      banner: '/images/food-feast-banner.jpg',
    },
    prompt: 'Make an appetizing dining offer banner for a heritage North Indian restaurant featuring slow-cooked Dum Biryani, Galouti Kebabs and Flat 25% OFF badge',
    badge: 'ROYAL FEAST 🥘',
    headline: 'Savor Authentic Hyderabadi Dum Biryani & Kebabs',
    subtext: 'Slow-cooked in clay pots with pure desi ghee and hand-pounded royal spices.',
    offerText: 'FLAT 25% OFF',
    captions: {
      hinglish: 'Weekend crave solve karo! 🍛 Taste pure royal tradition with our slow-cooked Dum Biryani and melting Galouti Kebabs. Flat 25% discount on family dine-ins and WhatsApp direct deliveries! 🤤🔥',
      hindi: 'स्वादिष्ट सप्ताहांत की दावत! 🍛 हमारी खास हांडी दम बिरयानी और कबाब पर पाएं फ्लैट 25% की छूट। पूरे परिवार के साथ पधारें या सीधे व्हाट्सएप पर गरमा-गरम आर्डर करें! 🤤🔥',
      english: 'Indulge in royal culinary perfection! 🍛 Authentic slow-cooked Hyderabadi Dum Biryani & melt-in-mouth Galouti Kebabs with Flat 25% OFF on dine-in and WhatsApp takeaway orders! 🥘✨',
    },
    hashtags: ['#DumBiryani', '#WeekendFeast', '#HyderabadiBiryani', '#FoodieHeaven', '#DawatEKhaas', '#RoyalDining'],
    ctaText: 'Book Table / Order 🍗',
    simulatedTime: '0.9s'
  },
  {
    id: 'jewellery',
    category: '💎 Fine Jewellery & Gold',
    tag: 'Royal Heritage',
    icon: '💍',
    businessName: 'Rang Mahals Fine Jewellery',
    businessCity: 'Surat, Gujarat',
    brandColor: '#ca8a04',
    aspectImages: {
      square: '/images/jewellery-festive-banner.jpg',
      story: '/images/jewellery-festive-banner.jpg',
      banner: '/images/jewellery-festive-banner.jpg',
    },
    prompt: 'Design an opulent luxury jewellery promotion banner for Rang Mahals showcasing 22KT gold Kundan necklace with zero making charge ribbon and velvet luxury showcase background',
    badge: 'ROYAL COLLECTION 🪙',
    headline: 'Royal Heritage Jewellery Collection: 22KT Gold & Kundan',
    subtext: 'Exquisite 22KT BIS Hallmarked gold, certified diamonds & Kundan Polki collection.',
    offerText: '0% MAKING CHARGES',
    captions: {
      hinglish: 'Apne shubh avsar par ghar laayein kripa aur barkat! 🪙 Rang Mahals ke 100% BIS Hallmarked 22KT Gold and Polki jewellery par paayein ZERO Making Charges. Exclusive catalogue dekhne ke liye WhatsApp karein! ✨💍',
      hindi: 'अपने शुभ अवसरों पर घर लाएं सुख-समृद्धि और मां लक्ष्मी की कृपा! 🪙 रंग महल्स के 100% बीआईएस हॉलमार्क स्वर्ण आभूषणों पर 0% मेकिंग चार्ज। अपनी पसंद का आभूषण बुक करने के लिए व्हाट्सएप करें! ✨',
      english: 'Celebrate timeless elegance with eternal heritage from Rang Mahals! 🪙 100% BIS Hallmarked 22KT Gold & Kundan Jewellery with Zero Making Charges. Request the private catalogue on WhatsApp! 💍✨',
    },
    hashtags: ['#GoldJewellery', '#PolkiJewellery', '#BridalJewellery', '#BISHallmark', '#RangMahals', '#FineJewellery'],
    ctaText: 'Get Gold Catalogue 📲',
    simulatedTime: '1.0s'
  },
  {
    id: 'electronics',
    category: '📱 Mobile & Electronics',
    tag: 'Mega Flash Sale',
    icon: '⚡',
    businessName: 'NextGen Mobile Plaza',
    businessCity: 'New Delhi',
    brandColor: '#2563eb',
    aspectImages: {
      square: '/images/tech-mobile-banner.jpg',
      story: '/images/tech-mobile-banner.jpg',
      banner: '/images/tech-mobile-banner.jpg',
    },
    prompt: 'Design a high-energy smartphone flash sale banner with zero downpayment EMI badge, flash sale countdown and free earbuds callout',
    badge: 'MEGA FLASH SALE ⚡',
    headline: 'Mega 5G Smartphone Flash Sale: Flagship Deals',
    subtext: 'Latest 5G flagship devices, free noise-cancelling earbuds & 0% EMI options.',
    offerText: 'FROM ₹14,999*',
    captions: {
      hinglish: 'Sabse bada smartphone flash sale! 🚀 Flagship 5G smartphones par paayein flat ₹5,000 instant bank discount + Free ANC Earbuds. ₹0 Downpayment No-Cost EMI available. Stock limited hai, WhatsApp par book karein! 📱⚡',
      hindi: 'वर्ष की सबसे बड़ी स्मार्टफोन सेल! 🚀 सभी प्रमुख 5G मोबाइल पर पाएं फ्लैट ₹5,000 की तत्काल छूट एवं मुफ्त इयरबड्स। ₹0 डाउनपेमेंट पर आसान ईएमआई। आज ही बुक करें! 📱🔥',
      english: 'Upgrade to lightning-fast 5G with our exclusive mega sale! 🚀 Flagship smartphones with ₹0 Down Payment, No-Cost EMI and Free ANC Wireless Earbuds worth ₹3,999. Limited stock available. Claim on WhatsApp! ⚡📱',
    },
    hashtags: ['#5GSmartphone', '#MobileDeals', '#NoCostEMI', '#MegaTechSale', '#NextGenMobile', '#ElectronicsDeal'],
    ctaText: 'Claim 5G Deal 📱',
    simulatedTime: '0.7s'
  },
  {
    id: 'salon',
    category: '💄 Salon & Beauty Spa',
    tag: 'Bridal Makeover',
    icon: '💅',
    businessName: 'Aura Luxury Salon & Spa',
    businessCity: 'Mumbai, Maharashtra',
    brandColor: '#db2777',
    aspectImages: {
      square: '/images/salon-bridal-banner.jpg',
      story: '/images/salon-bridal-banner.jpg',
      banner: '/images/salon-bridal-banner.jpg',
    },
    prompt: 'Design an elegant luxury bridal beauty package banner with gold borders, glowing Indian bride portrait and direct WhatsApp consultation button',
    badge: 'BRIDAL GLOW 💅',
    headline: 'Complete Pre-Wedding Luxury Bridal Glow Package',
    subtext: '7-Step Hydra-Facial, Moroccan hair spa, HD airbrush makeover & skin detox.',
    offerText: 'SAVE ₹4,000',
    captions: {
      hinglish: 'Apne special day par dikhiye sabse khoobsurat! 👰 Pre-wedding luxury bridal package par paayein Flat ₹4,000 OFF. Includes Hydra-Facial, Hair Spa & HD Makeover trial. Limited slots, WhatsApp par abhi book karein! 💖✨',
      hindi: 'अपनी शादी के दिन दिखें सबसे खास और चमकदार! 👰 हमारे विशेष ब्राइडल ग्लो पैकेज पर पाएं ₹4,000 की भारी बचत। सीमित स्लॉट उपलब्ध। परामर्श के लिए व्हाट्सएप करें! 💖',
      english: 'Turn heads on your dream wedding day! 👰 Comprehensive 7-Step Pre-Bridal Glow ritual, luxury Moroccan hair spa, and master HD makeover. Save ₹4,000. Book consultation on WhatsApp! 💅💖',
    },
    hashtags: ['#BridalGlow', '#WeddingSeason', '#LuxurySalonMumbai', '#HDMakeover', '#PreBridalCare', '#AuraSalon'],
    ctaText: 'Book Salon Slot 💅',
    simulatedTime: '0.8s'
  },
  {
    id: 'fashion',
    category: '🛍️ Streetwear & Apparel',
    tag: 'Fresh Drop',
    icon: '👕',
    businessName: 'Urban Desi Streetwear',
    businessCity: 'Bengaluru, Karnataka',
    brandColor: '#7c3aed',
    aspectImages: {
      square: '/images/streetwear-drop-banner.jpg',
      story: '/images/streetwear-drop-banner.jpg',
      banner: '/images/streetwear-drop-banner.jpg',
    },
    prompt: 'Create a vibrant Gen-Z Indian streetwear drop poster featuring oversized 280 GSM cotton tees, utility cargos and flat ₹599 badge',
    badge: 'STREETWEAR DROP 🔥',
    headline: 'Limited Edition 280 GSM Heavyweight Streetwear',
    subtext: 'Pure combed cotton oversized tees, utility cargos & pan-India COD.',
    offerText: 'FLAT ₹599 + COD',
    captions: {
      hinglish: 'Street drip is officially unlocked! 🔥 100% combed heavyweight cotton oversized tees & utility cargos starting flat ₹599 with Pan-India Cash on Delivery. WhatsApp pe tap karke size confirm karo! ⚡🧢',
      hindi: 'नया स्ट्रीटवियर कलेक्शन आ गया है! 🔥 280 जीएसएम प्रीमियम कॉटन ओवरसाइज़्ड टी-शर्ट्स और कार्गो मात्र ₹599 में। कैश ऑन डिलीवरी उपलब्ध। अभी व्हाट्सएप पर ऑर्डर करें! ⚡',
      english: 'Level up your daily street drip! 🔥 280 GSM Ultra-heavyweight combed cotton oversized tees and utility cargos starting flat ₹599. Pan-India COD available. Cop yours on WhatsApp now! 🧢⚡',
    },
    hashtags: ['#StreetwearIndia', '#OversizedTee', '#UrbanDesi', '#GenZFashion', '#StreetwearDrop', '#DesiStreetwear'],
    ctaText: 'Cop Drip via WhatsApp ⚡',
    simulatedTime: '0.7s'
  }
];

const backendPipelineSteps = [
  {
    step: '01',
    title: 'Brand Memory & Identity Sync',
    desc: 'Auto-retrieves your business name, primary & secondary brand hex colors, typography, and watermarks your brand logo with zero manual positioning.',
    badge: 'Step 1 • Context'
  },
  {
    step: '02',
    title: 'Product Catalog & Gemini Vision',
    desc: 'Select directly from your product catalog or upload raw phone photos. Google Gemini Multimodal Vision extracts subject details, cuts, and textures.',
    badge: 'Step 2 • Multimodal AI'
  },
  {
    step: '03',
    title: 'Occasion & Commercial Sale Engine',
    desc: 'Generates tailored commercial themes, seasonal sales, wedding specials, flash discounts, and cultural aesthetics with authentic luxury lighting.',
    badge: 'Step 3 • Bharat Nuances'
  },
  {
    step: '04',
    title: 'Regional Copywriting & CTA Engine',
    desc: 'Generates high-converting headlines, culturally relatable Hinglish or Hindi captions with emojis, and persuasive Call-to-Actions (CTAs).',
    badge: 'Step 4 • Copy Engine'
  },
  {
    step: '05',
    title: '8K Realistic Creative Synthesizer',
    desc: 'Renders crisp, photorealistic commercial posters tailored for authentic Indian skin tones, natural lighting, and luxury retail aesthetics.',
    badge: 'Step 5 • 8K Generation'
  },
  {
    step: '06',
    title: '1-Click Multi-Channel Syndication',
    desc: 'Instantly publish or schedule across WhatsApp Status & Groups, Instagram Feed/Reels, Facebook, and LinkedIn without format degradation.',
    badge: 'Step 6 • Instant Export'
  }
];

const faqs = [
  {
    q: 'How does the AI Post Maker integrate with our Business Profile and Brand Kit?',
    a: 'Once you set up your Brand Kit (Logo, brand colors, fonts, phone number, and location), the AI engine automatically injects these into every post. It places your logo watermark harmoniously, respects your brand palette, and appends your verified business contact info.'
  },
  {
    q: 'Does it support Hinglish, Hindi, and regional Indian languages?',
    a: 'Yes, 100%! The AI is natively trained on Bharat marketing nuances. You can toggle between Hinglish (casual conversational style with high conversion), शुद्ध हिंदी (Pure Hindi), English, Marathi, Gujarati, Tamil, and Bengali.'
  },
  {
    q: 'Can I upload raw smartphone photos of my products?',
    a: 'Absolutely. With Gemini Multimodal Vision, you can upload simple phone pictures of your kurtis, food dishes, jewellery, or store products. The AI isolates the primary subject and embeds it into high-end studio lighting and festive environments.'
  },
  {
    q: 'What aspect ratios are supported for different social media platforms?',
    a: 'The engine generates three standard formats in one click: 1:1 Square (Instagram & Facebook feed), 9:16 Vertical (WhatsApp Status & Instagram Stories), and 16:9 Landscape (LinkedIn & website banners).'
  },
  {
    q: 'How does 1-click WhatsApp sharing and Instagram publishing work?',
    a: 'After generating a post, clicking "Share via WhatsApp" opens WhatsApp with pre-filled captions, hashtags, and creative links ready to broadcast to your customers. You can also connect your Instagram/Facebook account for direct in-app publishing.'
  },
  {
    q: 'Do I get complete commercial ownership of all generated creatives?',
    a: 'Yes. All images, posters, headlines, and copy generated via DhandaGrow AI are 100% royalty-free for commercial use across paid advertisements, print flyers, social media, and billboards.'
  }
];

export default function PostmakerPage() {
  const [activePreset, setActivePreset] = useState<InteractivePreset>(interactivePresets[0]);
  const [selectedAspect, setSelectedAspect] = useState<'square' | 'story' | 'banner'>('square');
  const [selectedLang, setSelectedLang] = useState<'hinglish' | 'hindi' | 'english'>('hinglish');
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [customPrompt, setCustomPrompt] = useState('');

  const handleCopyCaption = () => {
    const textToCopy = `${activePreset.captions[selectedLang]}\n\n${activePreset.ctaText}\n\n${activePreset.hashtags.join(' ')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2200);
  };

  const handleSimulateGeneration = () => {
    setIsSimulating(true);
    setSimStep(1);

    setTimeout(() => setSimStep(2), 350);
    setTimeout(() => setSimStep(3), 750);
    setTimeout(() => setSimStep(4), 1100);
    setTimeout(() => {
      setIsSimulating(false);
      setSimStep(0);
    }, 1400);
  };

  const handleShareWhatsApp = () => {
    const shareText = `${activePreset.headline}\n\n${activePreset.captions[selectedLang]}\n\n👉 *${activePreset.offerText}*\n${activePreset.ctaText}\n\n${activePreset.hashtags.join(' ')}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] selection:bg-purple-600 selection:text-white text-slate-900">
      <Navbar />
      
      {/* 1. Hero Section */}
      <section className="pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden relative bg-gradient-to-b from-[#faf6f0] via-[#ffffff] to-[#faf8f5]">
        {/* Ambient Decorative Backdrops */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-orange-200/40 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-orange-200/90 mb-6">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span className="text-xs sm:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-600 to-orange-600">
                  AI-Powered Creative Studio for Bharat
                </span>
                <span className="bg-orange-100 text-orange-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-full ml-1">
                  v2.0 Active
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-bold text-slate-900 mb-6 tracking-tight leading-[1.1]">
                AI Postmaker for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500">
                  Bharat Businesses
                </span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed font-normal mb-8 max-w-xl">
                Generate studio-grade festive posters, flash sale flyers, and engaging social posts in seconds. Zero design skills required — automatic brand logo sync, regional Hinglish copywriting, and 1-click WhatsApp &amp; Instagram publishing.
              </p>

              {/* Feature Value Bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-9 w-full max-w-lg">
                {[
                  '10,000+ High-Converting Brand Templates',
                  'Hinglish & Regional Captions',
                  'Auto-Logo & Brand Color Sync',
                  'Instant WhatsApp & Instagram Export',
                  'Gemini Vision Reference Matching',
                  '8K Ultra-Realistic Commercial Graphics'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <Link href="/login/user">
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="h-14 px-8 text-base shadow-xl group font-bold rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 border-0 cursor-pointer w-full sm:w-auto text-white animate-shimmer-btn animate-pulse-glow hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-200 animate-spin" style={{ animationDuration: '4s' }} />
                      Launch AI Post Maker Studio
                    </span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1.5 transition-transform" />
                  </Button>
                </Link>

                <a 
                  href="#interactive-studio" 
                  className="inline-flex items-center justify-center h-14 px-7 text-sm sm:text-base font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-orange-300 hover:scale-102 active:scale-98 rounded-full transition-all duration-200 text-center shadow-xs"
                >
                  <Eye className="w-4 h-4 mr-2 text-orange-600" />
                  Try Live Interactive Studio
                </a>
              </div>

              <div className="mt-6 flex items-center gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Commercial Rights
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" /> Instant in ~3s
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-purple-600" /> Brand Kit Connected
                </span>
              </div>
            </div>
            
            {/* Right Column: Hero Visual Canvas */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden border border-orange-200/80 shadow-[0_25px_70px_-15px_rgba(249,115,22,0.22)] bg-white group">
                <img 
                  src="/images/ai-postmaker-hero.jpg" 
                  alt="DhandaGrow AI Postmaker app interface creating festive Indian social media posts" 
                  className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500 select-none"
                />

                {/* Floating Glass Badges */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md border border-white/60 px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-800">
                    Live AI Postmaker Studio
                  </span>
                </div>

                <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-semibold text-white">
                    Hinglish &amp; Hindi AI Copy
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-white/20 px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Studio-Grade Commercial Posters in 1-Click</p>
                      <p className="text-[11px] text-slate-300">Auto-logo stamping &amp; WhatsApp status export</p>
                    </div>
                  </div>
                  <Link href="/login/user">
                    <span className="text-xs font-bold bg-white text-slate-900 px-3.5 py-1.5 rounded-lg hover:bg-orange-50 hover:scale-105 active:scale-95 transition-all duration-200 shrink-0 inline-block shadow-sm">
                      Try Now &rarr;
                    </span>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Key Metrics Bar */}
      <section className="py-12 border-y border-orange-100 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x-0 md:divide-x divide-orange-100 text-center">
            <div className="flex flex-col items-center justify-center p-2">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-1.5 tracking-tight">10x</h3>
              <p className="text-xs sm:text-[13px] font-bold text-slate-600 uppercase tracking-wider">Faster Content Creation</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-1.5 tracking-tight">500,000+</h3>
              <p className="text-xs sm:text-[13px] font-bold text-slate-600 uppercase tracking-wider">Bharat Creatives Generated</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-1.5 tracking-tight">100+</h3>
              <p className="text-xs sm:text-[13px] font-bold text-slate-600 uppercase tracking-wider">Ready-to-Use Business Themes</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 mb-1.5 tracking-tight">98.6%</h3>
              <p className="text-xs sm:text-[13px] font-bold text-slate-600 uppercase tracking-wider">WhatsApp Engagement Lift</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive AI Post Simulator Widget */}
      <section id="interactive-studio" className="py-20 sm:py-28 bg-[#faf8f5] relative border-b border-orange-100">
        <div 
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `linear-gradient(to right, #f4e8dc 1px, transparent 1px), linear-gradient(to bottom, #f4e8dc 1px, transparent 1px)`,
            backgroundSize: '36px 36px'
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              Interactive Live Preview
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              See How AI Postmaker Works in Real Time
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3">
              Choose your business category, switch aspect ratios, toggle Hinglish or Hindi languages, and experience how DhandaGrow AI constructs high-converting social creatives.
            </p>
          </div>

          {/* Category Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
            {interactivePresets.map((preset) => {
              const isSelected = activePreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setActivePreset(preset);
                    setCustomPrompt(preset.prompt);
                  }}
                  className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/25 scale-105'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-orange-300 hover:text-orange-600 shadow-xs'
                  }`}
                >
                  <span>{preset.icon}</span>
                  <span>{preset.category}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Workspace Card */}
          <div className="bg-white rounded-[28px] sm:rounded-[36px] border border-orange-200/90 shadow-2xl shadow-orange-950/5 p-6 sm:p-10 max-w-6xl mx-auto">
            
            {/* Top Workspace Controls: Aspect Ratio & Language */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
              
              {/* Aspect Ratio Switcher */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
                  Format:
                </span>
                <div className="inline-flex bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setSelectedAspect('square')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedAspect === 'square'
                        ? 'bg-white text-orange-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    1:1 Square (Feed)
                  </button>
                  <button
                    onClick={() => setSelectedAspect('story')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedAspect === 'story'
                        ? 'bg-white text-orange-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    9:16 Vertical (Status)
                  </button>
                  <button
                    onClick={() => setSelectedAspect('banner')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedAspect === 'banner'
                        ? 'bg-white text-orange-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    16:9 Banner (Web)
                  </button>
                </div>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
                  Copy Language:
                </span>
                <div className="inline-flex bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setSelectedLang('hinglish')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedLang === 'hinglish'
                        ? 'bg-white text-purple-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🇮🇳 Hinglish
                  </button>
                  <button
                    onClick={() => setSelectedLang('hindi')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedLang === 'hindi'
                        ? 'bg-white text-purple-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    हिंदी (Hindi)
                  </button>
                  <button
                    onClick={() => setSelectedLang('english')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedLang === 'english'
                        ? 'bg-white text-purple-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* Brand Auto-Stamp Tag */}
              <div className="hidden lg:flex items-center gap-2 bg-orange-50 border border-orange-200/80 px-3 py-1.5 rounded-xl">
                <Building2 className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-xs font-bold text-orange-900">
                  {activePreset.businessName}
                </span>
                <span className="text-[10px] text-orange-700/80">({activePreset.businessCity})</span>
              </div>

            </div>

            {/* Prompt Bar Simulator */}
            <div className="mb-8 bg-[#faf8f5] border border-orange-200/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3 w-full">
                <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5 text-orange-600" />
                </div>
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                      AI Creative Prompt
                    </p>
                    <span className="text-[10px] text-slate-400">• Gemini 2.5 Multimodal Engine</span>
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-slate-800 leading-snug">
                    &ldquo;{customPrompt || activePreset.prompt}&rdquo;
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3 self-end md:self-center">
                <button
                  onClick={handleSimulateGeneration}
                  disabled={isSimulating}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2 transition-all shadow-md shadow-orange-600/20 cursor-pointer disabled:opacity-50"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                  {isSimulating ? 'Synthesizing...' : 'Re-generate'}
                </button>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/90 px-3 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  {activePreset.simulatedTime}
                </span>
              </div>
            </div>

            {/* Simulation Overlay Banner if active */}
            {isSimulating && (
              <div className="mb-6 p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-semibold flex items-center gap-3 animate-pulse">
                <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
                <span>
                  {simStep === 1 && "1/4: Syncing brand colors and logo watermark from Brand Kit..."}
                  {simStep === 2 && "2/4: Gemini Vision analyzing subject attributes and festive palette..."}
                  {simStep === 3 && `3/4: Crafting regional ${selectedLang} copywriting and viral hashtags...`}
                  {simStep === 4 && "4/4: Synthesizing 8K commercial resolution poster..."}
                </span>
              </div>
            )}

            {/* Split Preview: Left Graphic Card | Right Caption & Actions */}
            <div className="grid lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Graphic Card Preview */}
              <div className="lg:col-span-6 flex flex-col items-center">
                <div 
                  className={`w-full rounded-2xl sm:rounded-3xl relative overflow-hidden shadow-2xl border border-slate-200/90 transition-all duration-300 group bg-slate-950 ${
                    selectedAspect === 'square' 
                      ? 'aspect-square max-w-[480px]' 
                      : selectedAspect === 'story'
                      ? 'aspect-[9/16] max-w-[340px]'
                      : 'aspect-[16/9] max-w-[540px]'
                  }`}
                >
                  {/* High-Resolution Commercial Marketing Banner */}
                  <img 
                    src={
                      selectedAspect === 'story' 
                        ? activePreset.aspectImages.story 
                        : selectedAspect === 'banner'
                        ? activePreset.aspectImages.banner
                        : activePreset.aspectImages.square
                    } 
                    alt={activePreset.headline}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 select-none"
                  />

                  {/* Subtle Floating Status Pill (Top) */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10 pointer-events-none">
                    <span className="text-[11px] font-bold tracking-wide bg-slate-900/85 text-white backdrop-blur-md px-3 py-1 rounded-full shadow-md border border-white/20 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Live AI Banner
                    </span>
                    <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
                      8K Ultra HD
                    </span>
                  </div>

                  {/* Subtle Hover Action Overlay */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <a
                      href={
                        selectedAspect === 'story' 
                          ? activePreset.aspectImages.story 
                          : selectedAspect === 'banner'
                          ? activePreset.aspectImages.banner
                          : activePreset.aspectImages.square
                      }
                      download={`festive-banner-${activePreset.id}.jpg`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-900 font-bold text-xs rounded-xl shadow-lg hover:bg-orange-50 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-orange-600" />
                      Download Banner
                    </a>
                  </div>

                  {/* Format Indicator Watermark */}
                  <div className="absolute bottom-2.5 right-2.5 z-10 pointer-events-none">
                    <span className="text-[9px] font-bold bg-black/75 text-white/90 px-2.5 py-1 rounded-md backdrop-blur-sm">
                      {selectedAspect === 'square' ? '1080 × 1080 • Square Feed' : selectedAspect === 'story' ? '1080 × 1920 • Vertical Story' : '1920 × 1080 • Banner'}
                    </span>
                  </div>

                </div>
                
                <p className="text-center text-xs text-slate-500 mt-3 font-medium">
                  Export-ready advertising banner with authentic Indian styling &amp; festive marketing graphics
                </p>
              </div>

              {/* Right: AI-Generated Caption, Hashtags & Instant Sharing */}
              <div className="lg:col-span-6 flex flex-col justify-between bg-[#fffdfa] border border-orange-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-xs">
                <div>
                  
                  {/* Header: Platform & Copy action */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                        D
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 leading-none">
                          {activePreset.businessName}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          AI Generated • {selectedLang.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleCopyCaption}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-orange-600 bg-white border border-slate-200 hover:border-orange-300 px-3 py-1.5 rounded-lg transition-all shadow-2xs cursor-pointer"
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

                  {/* Caption Content Box */}
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-orange-100 shadow-2xs mb-4">
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-line mb-3">
                      {activePreset.captions[selectedLang]}
                    </p>

                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-orange-600">
                      <span>Call to Action:</span>
                      <span className="bg-orange-50 px-2 py-0.5 rounded text-orange-700">
                        {activePreset.ctaText}
                      </span>
                    </div>
                  </div>

                  {/* Trending Hashtags */}
                  <div className="mb-6">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Targeted Trending Hashtags
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activePreset.hashtags.map((tag, idx) => (
                        <span key={idx} className="text-xs font-semibold text-purple-700 bg-purple-50/80 hover:bg-purple-100 px-2.5 py-1 rounded-md border border-purple-200/60 transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Direct Action Hub */}
                <div className="pt-5 border-t border-orange-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <button
                    onClick={handleShareWhatsApp}
                    className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Share to WhatsApp
                  </button>

                  <Link href="/login/user" className="w-full sm:w-auto">
                    <Button size="default" className="h-11 w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-600/20 animate-shimmer-btn hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
                      Open in Studio &rarr;
                    </Button>
                  </Link>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. Complete Backend Flow Section */}
      <section className="py-20 sm:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider mb-3">
              <Layers className="w-3.5 h-3.5 text-purple-600" />
              Backend Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              The 6-Step DhandaGrow AI Post Engine
            </h2>
            <p className="text-slate-600 text-base max-w-2xl mx-auto mt-3 font-normal">
              How our multimodal AI pipeline transforms your brand memory and product catalog into high-converting social creatives without manual graphic design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {backendPipelineSteps.map((step, idx) => (
              <div 
                key={idx}
                className="bg-[#faf8f5] border border-orange-200/80 hover:border-orange-400 rounded-3xl p-7 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500">
                      {step.step}
                    </span>
                    <span className="text-[11px] font-bold text-orange-700 bg-orange-100/90 px-3 py-1 rounded-full">
                      {step.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2.5 tracking-tight group-hover:text-orange-600 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-orange-200/50 flex items-center gap-2 text-xs font-bold text-purple-700">
                  <CheckCheck className="w-4 h-4 text-emerald-600" />
                  <span>Fully Automated Pipeline</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/login/user">
              <Button size="lg" className="h-14 px-9 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-bold shadow-xl shadow-purple-500/25 animate-shimmer-btn animate-pulse-glow hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group">
                <span>Start Generating with the Engine</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform" />
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* 5. Master Templates Showcase */}
      <section id="templates-showcase" className="py-20 sm:py-28 bg-[#faf8f5] relative border-y border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-orange-600 font-bold text-xs sm:text-sm tracking-wider uppercase inline-block mb-2">
              Template Gallery
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Ready-to-Use Creatives for Every Business
            </h2>
            <p className="text-slate-600 text-base max-w-2xl mx-auto mt-3 font-normal">
              From ethnic apparel and electronics to luxury salons, cloud kitchens, and jewellery — choose from thousands of battle-tested templates.
            </p>
          </div>

          {/* Master Showcase Image */}
          <div className="mb-14 rounded-[28px] sm:rounded-[36px] overflow-hidden border border-orange-200/80 shadow-2xl shadow-orange-950/10 group bg-white">
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
                title: 'Retail & Commercial Sales',
                desc: 'Mega flash sales, wedding season collections, promotional discounts, and branded flyers with gold luxury borders and 3D typography.',
                tag: 'High Conversion',
                tagColor: 'bg-amber-100 text-amber-900'
              },
              {
                title: 'Electronics & Gadgets',
                desc: 'Flash sales, festive bonanzas, zero EMI promotions, and gadget unboxing posters with sleek tech styling.',
                tag: 'Bestseller',
                tagColor: 'bg-blue-100 text-blue-900'
              },
              {
                title: 'Salon, Spa & Beauty',
                desc: 'Bridal glow packages, weekend haircut discounts, and seasonal skincare flyers with direct WhatsApp booking.',
                tag: 'WhatsApp Ready',
                tagColor: 'bg-pink-100 text-pink-900'
              },
              {
                title: 'Real Estate & Services',
                desc: 'Luxury apartment launches, coaching classes, gym memberships, and local clinic announcements.',
                tag: 'Lead Gen',
                tagColor: 'bg-emerald-100 text-emerald-900'
              }
            ].map((cat, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-orange-200/80 rounded-2xl p-6 hover:shadow-lg hover:border-orange-300 transition-all group"
              >
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full inline-block mb-3 ${cat.tagColor}`}>
                  {cat.tag}
                </span>
                <h3 className="font-serif text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-orange-600 transition-colors">
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

      {/* 6. Comparison Matrix: Traditional vs Generic Tools vs DhandaGrow AI */}
      <section className="py-20 sm:py-28 bg-white relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-14 sm:mb-18">
            <span className="text-purple-600 font-bold text-xs sm:text-sm tracking-wider uppercase inline-block mb-2">
              The Smarter Choice
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Why Indian Merchants Choose DhandaGrow
            </h2>
            <p className="text-slate-600 text-base max-w-2xl mx-auto mt-3 font-normal">
              Compare how DhandaGrow AI outperforms traditional design agencies and generic international Canva templates.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse bg-white rounded-3xl overflow-hidden shadow-xl border border-orange-200/80">
              <thead>
                <tr className="bg-slate-900 text-white text-xs sm:text-sm">
                  <th className="p-4 sm:p-5 font-bold">Feature / Requirement</th>
                  <th className="p-4 sm:p-5 font-semibold text-slate-300">Freelance Agency</th>
                  <th className="p-4 sm:p-5 font-semibold text-slate-300">Generic Canva/Design</th>
                  <th className="p-4 sm:p-5 font-bold text-orange-400 bg-slate-800/90">DhandaGrow AI Postmaker</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900">Creation Turnaround</td>
                  <td className="p-4 sm:p-5 text-slate-500">24 – 48 Hours</td>
                  <td className="p-4 sm:p-5 text-slate-500">1 – 2 Hours manual editing</td>
                  <td className="p-4 sm:p-5 font-black text-emerald-600 bg-orange-50/40">⚡ Under 3 Seconds</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900">Monthly Expense</td>
                  <td className="p-4 sm:p-5 text-slate-500">₹15,000 – ₹30,000 / mo</td>
                  <td className="p-4 sm:p-5 text-slate-500">₹4,000 subscription + time</td>
                  <td className="p-4 sm:p-5 font-black text-emerald-600 bg-orange-50/40">Included in DhandaGrow</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900">Hinglish &amp; Regional Copy</td>
                  <td className="p-4 sm:p-5 text-slate-500">Hit or miss</td>
                  <td className="p-4 sm:p-5 text-slate-500">Zero (Manual typing)</td>
                  <td className="p-4 sm:p-5 font-black text-emerald-600 bg-orange-50/40">Native Bharat Nuance</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900">Brand Logo &amp; Color Stamping</td>
                  <td className="p-4 sm:p-5 text-slate-500">Manual review needed</td>
                  <td className="p-4 sm:p-5 text-slate-500">Manual placement</td>
                  <td className="p-4 sm:p-5 font-black text-emerald-600 bg-orange-50/40">100% Automated Sync</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900">1-Click WhatsApp Export</td>
                  <td className="p-4 sm:p-5 text-slate-500">Email / Drive download</td>
                  <td className="p-4 sm:p-5 text-slate-500">Manual download &amp; re-upload</td>
                  <td className="p-4 sm:p-5 font-black text-emerald-600 bg-orange-50/40">Instant 1-Click Share</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* 7. Pro Features Grid (Dark Studio Theme) */}
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
                title: "Multi-Channel Direct Publish",
                desc: "Send posts directly to Instagram, WhatsApp chat broadcast, Facebook page, and LinkedIn feed without downloading.",
                icon: <Send className="w-6 h-6 text-pink-400" />
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

      {/* 8. FAQ Section */}
      <section className="py-20 sm:py-28 bg-[#faf8f5] border-b border-orange-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-orange-600 font-bold text-xs sm:text-sm tracking-wider uppercase inline-block mb-2">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white border border-orange-200/80 rounded-2xl overflow-hidden transition-shadow shadow-xs"
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
      
      {/* 9. Feature Showcase Section Integration */}
      <FeatureShowcaseSection feature="ai-post-maker" />

      {/* 10. Call To Action (CTA) */}
      <section className="py-20 sm:py-28 bg-white relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-purple-700 via-pink-600 to-orange-500 rounded-[32px] sm:rounded-[44px] p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 blur-[100px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2" />
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 relative z-10 tracking-tight leading-tight">
              Ready to Supercharge Your Social Media?
            </h2>
            <p className="text-white/95 text-base sm:text-lg max-w-2xl mx-auto mb-8 relative z-10 font-normal">
              Join thousands of Indian business owners, retail shops, and creators who save hours every week creating professional marketing posts &amp; flyers with DhandaGrow AI.
            </p>
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login/user">
                <Button 
                  size="lg" 
                  className="h-14 px-10 text-base font-bold rounded-full text-purple-900 bg-white hover:bg-slate-50 border-0 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 animate-shimmer-btn cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-orange-500 mr-2" />
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
