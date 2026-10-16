'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { FeatureShowcaseSection } from '@/components/FeatureShowcaseSection';
import { 
  Camera, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ChevronDown, 
  Zap, 
  Shirt,
  User,
  Sliders,
  Store,
  Layers,
  Flame,
  ShieldCheck,
  Eye,
  Crown,
  Check,
  ShoppingBag,
  Palette,
  Copy,
  Loader2
} from 'lucide-react';

interface FashionPreset {
  id: string;
  garmentName: string;
  category: string;
  color: string;
  gender: 'female' | 'male';
  modelStyle: string;
  pose: string;
  background: string;
  shotType: string;
  view: string;
  image: string;
  badge: string;
  badgeColor: string;
  description: string;
}

const fashionPresets: FashionPreset[] = [
  {
    id: 'saree',
    garmentName: 'Banarasi Silk Saree',
    category: 'Saree',
    color: 'Red and Gold Multi-color',
    gender: 'female',
    modelStyle: 'Traditional Fashion',
    pose: 'STANDING',
    background: 'STUDIO',
    shotType: 'FULL_BODY',
    view: 'FRONT',
    image: '/images/fashion-photoshoot-hero.jpg',
    badge: 'Ethnic Bestseller ✨',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    description: 'Intricate golden zari embroidery and pallu pleats draped on a graceful Indian fashion model with studio softbox lighting.'
  },
  {
    id: 'kurti',
    garmentName: 'Embroidered Anarkali Kurti',
    category: 'Kurti / Dress',
    color: 'Pastel Floral Pink',
    gender: 'female',
    modelStyle: 'Casual Editorial',
    pose: 'STANDING',
    background: 'OUTDOOR GARDEN',
    shotType: 'FULL_BODY',
    view: 'FRONT',
    image: '/images/fashion-categories-showcase.jpg',
    badge: 'Festive Everyday 🌸',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    description: 'Lightweight flared Anarkali silhouette with floral threadwork captured under natural golden hour daylight.'
  },
  {
    id: 'sherwani',
    garmentName: 'Royal Heritage Sherwani Set',
    category: 'Sherwani / Kurta',
    color: 'Midnight Blue & Gold',
    gender: 'male',
    modelStyle: 'Royal Heritage',
    pose: 'STANDING',
    background: 'HERITAGE PALACE',
    shotType: 'FULL_BODY',
    view: 'FRONT',
    image: '/images/fashion-categories-showcase.jpg',
    badge: 'Groom & Wedding 👑',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    description: 'Handcrafted zari brocade sherwani with regal posture set against Rajasthani stone palace arches.'
  },
  {
    id: 'streetwear',
    garmentName: '280 GSM Oversized Hoodie',
    category: 'Streetwear / Hoodie',
    color: 'Electric Purple Drip',
    gender: 'male',
    modelStyle: 'Urban Streetwear',
    pose: 'SITTING',
    background: 'MODERN CAFE',
    shotType: 'UPPER_BODY',
    view: 'FRONT',
    image: '/images/fashion-categories-showcase.jpg',
    badge: 'Gen-Z Trending 🔥',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    description: 'Heavyweight streetwear silhouette styled with relaxed cafe ambience and contemporary aesthetic.'
  }
];

const photoshootFaqs = [
  {
    q: 'How does AI Photoshoot generate models wearing our specific clothing items?',
    a: 'DhandaGrow AI allows you to either select "Custom Clothing" (specifying category, color, and fabric pattern) or choose items directly from your uploaded Product Catalog. The AI accurately reconstructs realistic fabric drape, pleats, embroidery textures, and lighting on lifelike Indian models.'
  },
  {
    q: 'Can I shoot Indian ethnic wear like Sarees, Kurtis, and Lehengas?',
    a: 'Yes, absolutely! The AI is natively trained on Indian ethnic and western clothing, including Banarasi and Kanjeevaram sarees, Anarkali suits, bridal lehengas, kurtas, sherwanis, and Gen-Z oversized streetwear.'
  },
  {
    q: 'Can I change the model gender, pose, and background?',
    a: 'Yes! In Step 2 (Model & Style Settings), you can choose Female or Male models, pick poses (Standing, Sitting, Walking), and select environments like Clean Studio, Heritage Palace Courtyard, Outdoor Garden, or Modern Cafe.'
  },
  {
    q: 'Are these fashion photos compliant with Myntra, Amazon, Flipkart, and Meesho?',
    a: 'Yes, 100%. You can generate high-resolution full-body marketplace-compliant catalog shots on clean backgrounds, as well as creative lifestyle shots for Instagram, Facebook ads, and Shopify stores.'
  },
  {
    q: 'How much money does this save compared to a traditional physical model shoot?',
    a: 'A standard fashion model photoshoot in India costs ₹35,000 to ₹1,50,000 per day for model fees, makeup artists, photographers, studio rent, and post-production retouching. With DhandaGrow AI, you generate runway-grade photos in seconds for a fraction of the cost.'
  },
  {
    q: 'Do I get complete commercial rights for marketing and advertisements?',
    a: 'Yes! All fashion imagery generated through DhandaGrow AI is 100% royalty-free with complete commercial rights for e-commerce listings, print catalogs, digital ads, hoardings, and social media.'
  }
];

interface HeroSlide {
  id: string;
  image: string;
  title: string;
  category: string;
  color: string;
  model: string;
  pose: string;
  set: string;
  badge: string;
  tags: { text: string; top: string; left: string }[];
}

const heroShowcaseSlides: HeroSlide[] = [
  {
    id: 'saree',
    image: '/images/fashion-photoshoot-hero.jpg',
    title: 'Banarasi Saree Photoshoot',
    category: 'Saree',
    color: 'Red & Gold Multi-color',
    model: 'Model: Indian Female #104',
    pose: 'Pose: STANDING',
    set: 'Set: STUDIO SOFTBOX',
    badge: 'Category: Saree • Red & Gold Multi-color',
    tags: [
      { text: '98.6% Banarasi Silk Zari', top: '34%', left: '46%' },
      { text: 'Auto-Pleat Drape Physics', top: '65%', left: '53%' },
      { text: 'Key Light: 3200K Diffused', top: '22%', left: '22%' }
    ]
  },
  {
    id: 'before-after',
    image: '/images/fashion-photoshoot-before-after.jpg',
    title: 'Raw to Runway Transformation',
    category: 'Transformation',
    color: 'Folded Garment ➔ Runway',
    model: 'DhandaGrow Virtual Studio',
    pose: 'SIDE BY SIDE',
    set: 'Set: RUNWAY LUXURY',
    badge: 'Transformation: Flat Lay ➔ Runway Model',
    tags: [
      { text: 'Raw Flat Lay Garment', top: '45%', left: '22%' },
      { text: 'AI Model & Drape Synthesized', top: '38%', left: '72%' },
      { text: 'Amazon / Myntra 300 DPI Export', top: '82%', left: '48%' }
    ]
  },
  {
    id: 'categories',
    image: '/images/fashion-categories-showcase.jpg',
    title: 'Multi-Category Fashion Engine',
    category: 'Apparel Suite',
    color: 'Ethnic & Modern Collection',
    model: 'Diverse Regional Indian Models',
    pose: '4x POSES: STANDING, SITTING, WALKING',
    set: 'STUDIO / GARDEN / PALACE / CAFE',
    badge: 'Multi-Style: Saree • Kurti • Sherwani • Streetwear',
    tags: [
      { text: 'Royal Saree • Studio', top: '16%', left: '10%' },
      { text: 'Anarkali Kurti • Garden', top: '16%', left: '34%' },
      { text: 'Royal Sherwani • Palace', top: '16%', left: '58%' },
      { text: 'Streetwear • Cafe', top: '16%', left: '82%' }
    ]
  }
];

const sampleCatalogProducts = [
  {
    id: 'prod-1',
    name: 'Pure Banarasi Silk Saree',
    category: 'Saree',
    color: 'Red & Gold Multi-color',
    image: '/images/fashion-photoshoot-hero.jpg',
    resultImage: '/images/fashion-photoshoot-hero.jpg',
    gender: 'female' as const,
    style: 'traditional',
    pose: 'STANDING',
    bg: 'STUDIO'
  },
  {
    id: 'prod-2',
    name: 'Embroidered Anarkali Kurti',
    category: 'Kurti',
    color: 'Pastel Floral Pink',
    image: '/images/fashion-categories-showcase.jpg',
    resultImage: '/images/fashion-categories-showcase.jpg',
    gender: 'female' as const,
    style: 'editorial',
    pose: 'STANDING',
    bg: 'OUTDOOR GARDEN'
  },
  {
    id: 'prod-3',
    name: 'Royal Zari Sherwani Set',
    category: 'Sherwani',
    color: 'Midnight Blue & Gold',
    image: '/images/fashion-categories-showcase.jpg',
    resultImage: '/images/fashion-categories-showcase.jpg',
    gender: 'male' as const,
    style: 'royal_heritage',
    pose: 'STANDING',
    bg: 'HERITAGE PALACE'
  },
  {
    id: 'prod-4',
    name: '280 GSM Oversized Hoodie',
    category: 'Streetwear',
    color: 'Electric Purple Drip',
    image: '/images/streetwear-drop-banner.jpg',
    resultImage: '/images/fashion-categories-showcase.jpg',
    gender: 'male' as const,
    style: 'streetwear',
    pose: 'SITTING',
    bg: 'MODERN CAFE'
  }
];

export default function PhotoshootPage() {
  const [activePreset, setActivePreset] = useState<FashionPreset>(fashionPresets[0]);
  const [inputType, setInputType] = useState<'custom' | 'product'>('custom');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  // Exact Flow Form State (matching app/(dashboard)/fashion-ai/photoshoot/page.tsx)
  const [selectedCategory, setSelectedCategory] = useState<string>('Saree');
  const [selectedColor, setSelectedColor] = useState<string>('Red and Gold Multi-color');
  const [selectedGender, setSelectedGender] = useState<'female' | 'male'>('female');
  const [selectedStyle, setSelectedStyle] = useState<string>('traditional');
  const [selectedPose, setSelectedPose] = useState<string>('STANDING');
  const [selectedBackground, setSelectedBackground] = useState<string>('STUDIO');
  const [selectedShotType, setSelectedShotType] = useState<string>('FULL_BODY');
  const [selectedView, setSelectedView] = useState<string>('FRONT');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-1');

  // Live Simulation & Output State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [generatedResult, setGeneratedResult] = useState<{
    image: string;
    title: string;
    category: string;
    color: string;
    gender: string;
    pose: string;
    background: string;
    time: string;
  } | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      triggerSlideChange((prev) => (prev + 1) % heroShowcaseSlides.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [isPaused]);

  const triggerSlideChange = (newIndexOrFn: number | ((prev: number) => number)) => {
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 350);
    if (typeof newIndexOrFn === 'function') {
      setHeroSlideIndex(newIndexOrFn);
    } else {
      setHeroSlideIndex(newIndexOrFn);
    }
  };

  const handleSelectPreset = (preset: FashionPreset) => {
    setActivePreset(preset);
    setSelectedCategory(preset.category.split(' ')[0]);
    setSelectedColor(preset.color);
    setSelectedGender(preset.gender);
    setSelectedPose(preset.pose);
    setSelectedBackground(preset.background);
    if (preset.id === 'saree') setSelectedStyle('traditional');
    else if (preset.id === 'kurti') setSelectedStyle('editorial');
    else if (preset.id === 'sherwani') setSelectedStyle('royal_heritage');
    else if (preset.id === 'streetwear') setSelectedStyle('streetwear');
  };

  const handleSelectProduct = (prod: typeof sampleCatalogProducts[0]) => {
    setSelectedProductId(prod.id);
    setSelectedCategory(prod.category);
    setSelectedColor(prod.color);
    setSelectedGender(prod.gender);
    setSelectedStyle(prod.style);
    setSelectedPose(prod.pose);
    setSelectedBackground(prod.bg);
  };

  const handleSimulatePhotoshoot = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSimulating(true);
    setSimStep(1);

    setTimeout(() => setSimStep(2), 350);
    setTimeout(() => setSimStep(3), 700);
    setTimeout(() => setSimStep(4), 1050);
    setTimeout(() => {
      setIsSimulating(false);
      setSimStep(0);

      let resultImg = '/images/fashion-photoshoot-hero.jpg';
      if (selectedCategory === 'Kurti') resultImg = '/images/fashion-categories-showcase.jpg';
      else if (selectedCategory === 'Sherwani') resultImg = '/images/fashion-categories-showcase.jpg';
      else if (selectedCategory === 'Streetwear') resultImg = '/images/fashion-categories-showcase.jpg';
      else if (selectedCategory === 'Lehenga') resultImg = '/images/royal-ethnic-banner.jpg';

      setGeneratedResult({
        image: resultImg,
        title: inputType === 'custom' ? `${selectedColor} ${selectedCategory}` : (sampleCatalogProducts.find(p => p.id === selectedProductId)?.name || `${selectedColor} ${selectedCategory}`),
        category: selectedCategory,
        color: selectedColor,
        gender: selectedGender,
        pose: selectedPose,
        background: selectedBackground,
        time: '1.2s'
      });
    }, 1400);
  };

  const handleCopyPrompt = () => {
    const promptText = `Generate high-fashion 4k editorial photoshoot of an Indian ${selectedGender} model wearing ${selectedColor} ${selectedCategory}, ${selectedPose.toLowerCase()} pose in ${selectedBackground.toLowerCase()} setting with studio lighting, realistic fabric draping, 85mm lens f/1.4.`;
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const currentHeroSlide = heroShowcaseSlides[heroSlideIndex];

  return (
    <main className="min-h-screen bg-[#06080f] text-white selection:bg-purple-600/40 selection:text-white font-sans">
      <Navbar />
      
      {/* 1. Cinematic Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden flex flex-col items-center justify-center">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-900/20 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-pink-900/15 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-purple-500/20 mb-8 backdrop-blur-md shadow-lg shadow-purple-950/20">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold tracking-widest uppercase text-slate-200">
              AI Photoshoot Studio • Virtual Model Photography
            </span>
            <span className="bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-purple-500/30">
              v2.0 Active
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[84px] font-black mb-6 tracking-tight leading-[1.02]">
            From Raw Garment <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 font-serif italic pr-2">
              To Runway Model.
            </span>
          </h1>
          
          <p className="text-base md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            Generate professional fashion photography for your clothing items. Turn folded sarees, kurtis, lehengas, and streetwear into high-fashion model shoots on diverse Indian models in 3 seconds — zero studio rent or model hiring costs.
          </p>
          
          {/* Key Value Highlights Bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 w-full max-w-lg text-left">
            {[
              'Indian Male & Female AI Fashion Models',
              'Sarees, Kurtis, Lehengas & Streetwear',
              'Standing, Walking & Editorial Poses',
              'Studio, Palace & Outdoor Environments'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="/login/user" className="w-full sm:w-auto">
              <Button 
                variant="default" 
                size="lg" 
                className="h-14 sm:h-16 px-9 text-base sm:text-lg rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold shadow-xl shadow-purple-900/30 cursor-pointer w-full sm:w-auto border-0"
              >
                <span>Launch Fashion Photoshoot</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <a 
              href="#interactive-simulator" 
              className="inline-flex items-center justify-center h-14 sm:h-16 px-8 text-sm sm:text-base font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/40 rounded-full transition-all text-center w-full sm:w-auto"
            >
              <Eye className="w-4 h-4 mr-2 text-purple-400" />
              Try Live Model Simulator
            </a>
          </div>
        </div>

        {/* Hero Panorama Viewfinder with Animated Model Slideshow & Laser Scanner */}
        <div 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="w-full max-w-[94vw] lg:max-w-6xl mx-auto mt-14 sm:mt-18 relative z-10 rounded-[32px] sm:rounded-[44px] overflow-hidden border border-purple-500/30 shadow-[0_25px_90px_rgba(147,51,234,0.25)] bg-zinc-950 group select-none"
        >
          {/* Subtle Ambient Backing Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/35 z-10 pointer-events-none" />

          {/* Camera Shutter Flash Effect */}
          {isFlashing && (
            <div className="absolute inset-0 bg-white/35 z-40 pointer-events-none animate-camera-flash" />
          )}

          {/* AI Scanning Laser Line (Animates across photo) */}
          <div className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-purple-400 to-transparent shadow-[0_0_20px_#c084fc] pointer-events-none z-20 animate-laser-scan">
            <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-3 h-3 rounded-full bg-purple-300 blur-[1px] animate-pulse" />
          </div>

          {/* Dynamic Images with Crossfade & Subtle Breathing Zoom Animation */}
          <div className="relative w-full h-[420px] sm:h-[560px] md:h-[680px] overflow-hidden">
            {heroShowcaseSlides.map((slide, idx) => {
              const isActive = idx === heroSlideIndex;
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    isActive ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none -z-10'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className={`w-full h-full object-cover select-none transition-transform duration-[7000ms] ease-out ${
                      isActive ? 'scale-[1.03] animate-float-subtle' : 'scale-100'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Viewfinder HUD Overlays */}
          <div className="absolute inset-4 sm:inset-6 border border-white/20 z-20 pointer-events-none rounded-2xl sm:rounded-3xl">
            {/* Viewfinder Corners with Glowing Pulse */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-purple-400 animate-focus-pulse" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-purple-400 animate-focus-pulse" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-purple-400 animate-focus-pulse" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-purple-400 animate-focus-pulse" />

            {/* Central Animated Camera Reticle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60 sm:opacity-85">
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center">
                {/* Rotating Dashed Degree Ring */}
                <div className="absolute inset-0 border border-dashed border-purple-400/50 rounded-full animate-reticle-spin" />
                {/* Outer Focus Circle */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 border border-white/30 rounded-full flex items-center justify-center animate-focus-pulse">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" />
                </div>
                {/* Center Crosshairs */}
                <div className="absolute w-6 h-[1px] bg-purple-400/70" />
                <div className="absolute h-6 w-[1px] bg-purple-400/70" />
              </div>
            </div>

            {/* Dynamic AI Recognition Tags (Floating on active slide) */}
            <div className="hidden md:block">
              {currentHeroSlide.tags.map((tag, tIdx) => (
                <div
                  key={tIdx}
                  style={{ top: tag.top, left: tag.left }}
                  className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-black/80 backdrop-blur-md border border-purple-500/40 px-3 py-1 rounded-full text-[11px] font-semibold text-purple-200 shadow-lg shadow-purple-950/40 animate-float-subtle"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                  <span>{tag.text}</span>
                </div>
              ))}
            </div>

            {/* Top Left Rec Badge */}
            <div className="absolute top-3 left-4 flex items-center gap-2 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-[11px] font-mono font-bold tracking-wider text-white">
                LIVE AI FASHION PHOTO PREVIEW
              </span>
              <span className="text-[10px] font-mono text-purple-400 font-semibold hidden sm:inline-block">
                • 4K RAW
              </span>
            </div>

            {/* Top Right Live Tag */}
            <div className="absolute top-3 right-4 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-purple-500/30 text-xs font-bold text-amber-300 shadow-md">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentHeroSlide.badge}</span>
            </div>

            {/* Bottom Floating Lighting Pill & Interactive Selectors */}
            <div className="absolute bottom-3 left-4 right-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pointer-events-auto">
              <div className="hidden sm:flex items-center gap-3 bg-black/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-purple-400 font-bold">
                  <Camera className="w-3.5 h-3.5" /> {currentHeroSlide.model}
                </span>
                <span className="text-slate-600">|</span>
                <span className="font-mono text-slate-300">{currentHeroSlide.pose}</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-300 font-medium">{currentHeroSlide.set}</span>
                <span className="text-slate-600">|</span>
                <span className="text-emerald-400 font-semibold">Amazon &amp; Myntra Ready</span>
              </div>

              {/* Interactive Slide Controls & Thumbnail Selectors */}
              <div className="flex items-center justify-end gap-1.5 bg-black/85 backdrop-blur-md p-1.5 rounded-xl border border-white/15 self-end">
                {heroShowcaseSlides.map((slide, sIdx) => {
                  const isSel = sIdx === heroSlideIndex;
                  return (
                    <button
                      key={slide.id}
                      onClick={() => triggerSlideChange(sIdx)}
                      className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                        isSel
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/30'
                          : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {sIdx === 0 ? 'Saree' : sIdx === 1 ? 'Runway' : '4x Styles'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Stats Strip */}
      <section className="py-14 border-y border-white/10 bg-[#090b14] relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-white/10 text-center">
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2 tracking-tight">₹1.5L+</h3>
              <p className="text-xs sm:text-[13px] font-bold text-slate-400 uppercase tracking-wider">Saved per Seasonal Shoot</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2 tracking-tight">3s</h3>
              <p className="text-xs sm:text-[13px] font-bold text-slate-400 uppercase tracking-wider">Average Generation Time</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2 tracking-tight">100%</h3>
              <p className="text-xs sm:text-[13px] font-bold text-slate-400 uppercase tracking-wider">Commercial Rights &amp; Ownership</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2 tracking-tight">10x</h3>
              <p className="text-xs sm:text-[13px] font-bold text-slate-400 uppercase tracking-wider">Faster Catalog Production</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Before & After Showcase: Raw to Runway Transformation */}
      <section className="py-20 sm:py-28 bg-[#06080f] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-purple-400 font-bold text-xs sm:text-sm tracking-wider uppercase inline-block mb-2">
              The Real Magic
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Raw Garment to High-Fashion Runway
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-normal">
              See how folded sarees or raw catalog clothing photos transform into magazine-worthy editorial fashion shoots with realistic Indian models, fabric drapes, and authentic jewelry.
            </p>
          </div>

          {/* Master Before/After Comparison Card */}
          <div className="rounded-[28px] sm:rounded-[40px] overflow-hidden border border-purple-500/30 shadow-[0_20px_70px_rgba(168,85,247,0.15)] bg-zinc-950 max-w-5xl mx-auto group">
            <img 
              src="/images/fashion-photoshoot-before-after.jpg" 
              alt="Raw to Runway: Folded Banarasi saree garment on white background transformed into luxury Indian fashion model photoshoot" 
              className="w-full h-auto object-cover select-none group-hover:scale-[1.01] transition-transform duration-500"
            />
          </div>

          {/* 3 Step Breakdown Below Transformation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
            <div className="p-6 rounded-2xl bg-[#0d101d] border border-white/10 hover:border-purple-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 font-black">
                1
              </div>
              <h4 className="text-base font-bold text-white mb-2">1. Select Garment or Color</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                Choose custom clothing (e.g. Saree, Kurti, Lehenga, Shirt) with color/pattern details, or select directly from your uploaded products.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0d101d] border border-white/10 hover:border-purple-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-4 font-black">
                2
              </div>
              <h4 className="text-base font-bold text-white mb-2">2. Model &amp; Style Settings</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                Pick model gender, style (Fashion, Bridal, Streetwear), pose (Standing, Walking, Sitting), and set environment (Studio, Palace, Cafe).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0d101d] border border-white/10 hover:border-purple-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 font-black">
                3
              </div>
              <h4 className="text-base font-bold text-white mb-2">3. Instant Fashion Render</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                AI synthesizes ray-traced lighting, natural skin tones, and authentic fabric draping in seconds. Download in 4K or publish to catalogs.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Live Interactive Fashion Photoshoot Flow Workspace (Matches Dashboard Flow) */}
      <section id="interactive-simulator" className="py-20 sm:py-28 bg-[#090b14] relative border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-bold uppercase tracking-wider mb-3">
              <Camera className="w-3.5 h-3.5 text-purple-400" />
              Live Interactive Studio Flow
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Experience the Actual Photoshoot Workflow
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-normal">
              Select custom clothing or catalog garments, configure Indian model gender &amp; styles, and run real-time AI fashion shoot generations right here.
            </p>
          </div>

          {/* Quick Preset Selector Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-10">
            {fashionPresets.map((preset) => {
              const isSelected = activePreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30 scale-105'
                      : 'bg-[#121626] text-slate-300 border border-white/10 hover:border-purple-400/50 hover:text-white'
                  }`}
                >
                  <span>{preset.category}</span>
                  <span className="text-[10px] opacity-75">({preset.color.split(' ')[0]})</span>
                </button>
              );
            })}
          </div>

          {/* Two-Column Interactive Workspace: Left Form | Right Live Studio Preview */}
          <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
            
            {/* Left: The Actual Fashion Photoshoot Form (Matching Screenshot 2 & dashboard) */}
            <div className="lg:col-span-7 bg-[#0e1222] rounded-[28px] sm:rounded-[36px] border border-purple-500/30 shadow-2xl p-6 sm:p-8">
              
              <div className="space-y-7">
                
                {/* Form fields: Non-clickable preview of the dashboard interface */}
                <div className="pointer-events-none select-none space-y-7 cursor-default">
                  {/* 1. Select Garment Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <label className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-black">1</span>
                        Select Garment
                      </label>
                      
                      <div className="flex bg-[#161a2e] p-1 rounded-xl border border-white/10">
                        <button
                          type="button"
                          tabIndex={-1}
                          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 text-white shadow-sm"
                        >
                          Custom Clothing
                        </button>
                        <button
                          type="button"
                          tabIndex={-1}
                          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-400"
                        >
                          My Products
                        </button>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 border border-white/10 rounded-2xl bg-[#13172c] space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-300">Clothing Category</label>
                          <select 
                            disabled
                            tabIndex={-1}
                            className="w-full bg-[#1b203a] border border-white/15 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none cursor-default opacity-90"
                            value={selectedCategory}
                            onChange={() => {}}
                          >
                            <option value="Saree">Saree</option>
                            <option value="Kurti">Kurti / Anarkali</option>
                            <option value="Lehenga">Lehenga / Bridal</option>
                            <option value="Sherwani">Sherwani / Kurta</option>
                            <option value="Streetwear">Streetwear Hoodie</option>
                            <option value="Dress">Western Dress</option>
                            <option value="Shirt">Shirt / T-Shirt</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-300">Color / Pattern</label>
                          <input 
                            type="text"
                            readOnly
                            tabIndex={-1}
                            placeholder="e.g. Red, Multi-color, Floral print..."
                            className="w-full bg-[#1b203a] border border-white/15 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none cursor-default opacity-90"
                            value={selectedColor}
                            onChange={() => {}}
                          />
                        </div>
                      </div>

                      {/* Quick Color Suggestions */}
                      <div className="pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Quick Color Ideas:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            'Red and Gold Multi-color',
                            'Pastel Floral Pink',
                            'Midnight Blue & Gold',
                            'Emerald Green Silk',
                            'Electric Purple',
                            'Black & Gold Zari'
                          ].map((c) => (
                            <span
                              key={c}
                              className={`text-[11px] px-2.5 py-1 rounded-md border ${
                                selectedColor === c 
                                  ? 'bg-purple-500/20 text-purple-300 border-purple-400/50' 
                                  : 'bg-[#1b203a] text-slate-400 border-white/10'
                              }`}
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-purple-300 bg-purple-500/10 p-3 rounded-xl border border-purple-500/20">
                        <Shirt className="w-4 h-4 text-purple-400 shrink-0" />
                        <span>We will generate a highly realistic fashion photo based on the category and color you type!</span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Model & Style Settings Section */}
                  <div className="space-y-4 pt-5 border-t border-white/10">
                    <label className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center text-xs font-black">2</span>
                      Model &amp; Style Settings
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Model Gender</label>
                        <select 
                          disabled
                          tabIndex={-1}
                          className="w-full bg-[#161a2e] border border-white/15 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none cursor-default opacity-90"
                          value={selectedGender}
                          onChange={() => {}}
                        >
                          <option value="female">Female Model</option>
                          <option value="male">Male Model</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Model Style</label>
                        <select 
                          disabled
                          tabIndex={-1}
                          className="w-full bg-[#161a2e] border border-white/15 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none cursor-default opacity-90"
                          value={selectedStyle}
                          onChange={() => {}}
                        >
                          <option value="fashion">High Fashion Editorial</option>
                          <option value="traditional">Traditional Indian Bridal / Festive</option>
                          <option value="editorial">Casual Chic Lifestyle</option>
                          <option value="royal_heritage">Royal Heritage</option>
                          <option value="streetwear">Urban Streetwear</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Pose</label>
                        <select 
                          disabled
                          tabIndex={-1}
                          className="w-full bg-[#161a2e] border border-white/15 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none cursor-default opacity-90"
                          value={selectedPose}
                          onChange={() => {}}
                        >
                          <option value="STANDING">STANDING</option>
                          <option value="WALKING">WALKING</option>
                          <option value="SITTING">SITTING</option>
                          <option value="HANDS IN POCKETS">HANDS IN POCKETS</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Background Environment</label>
                        <select 
                          disabled
                          tabIndex={-1}
                          className="w-full bg-[#161a2e] border border-white/15 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none cursor-default opacity-90"
                          value={selectedBackground}
                          onChange={() => {}}
                        >
                          <option value="STUDIO">STUDIO (Clean Softbox Lighting)</option>
                          <option value="HERITAGE PALACE">HERITAGE PALACE (Rajasthani Courtyard)</option>
                          <option value="OUTDOOR GARDEN">OUTDOOR GARDEN (Sunlit Daylight)</option>
                          <option value="MODERN CAFE">MODERN CAFE (Urban Ambient)</option>
                          <option value="LUXURY STORE">LUXURY STORE (Marble Interior)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Shot Type</label>
                        <select 
                          disabled
                          tabIndex={-1}
                          className="w-full bg-[#161a2e] border border-white/15 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none cursor-default opacity-90"
                          value={selectedShotType}
                          onChange={() => {}}
                        >
                          <option value="FULL_BODY">FULL BODY</option>
                          <option value="UPPER_BODY">UPPER BODY (WAIST UP)</option>
                          <option value="CLOSE_UP">CLOSE UP (FABRIC DETAIL)</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Camera View</label>
                        <select 
                          disabled
                          tabIndex={-1}
                          className="w-full bg-[#161a2e] border border-white/15 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none cursor-default opacity-90"
                          value={selectedView}
                          onChange={() => {}}
                        >
                          <option value="FRONT">FRONT VIEW</option>
                          <option value="SIDE">SIDE VIEW</option>
                          <option value="THREE_QUARTER">THREE-QUARTER VIEW</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generate Button: Clickable CTA that redirects directly to /login/user */}
                <Link href="/login/user" className="w-full block pt-1">
                  <Button 
                    type="button"
                    className="w-full h-14 bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-purple-600/30 text-base cursor-pointer border-0"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Generate Fashion Photoshoot</span>
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </Button>
                </Link>

              </div>

            </div>

            {/* Right: Live Interactive Render Output & Simulation HUD */}
            <div className="lg:col-span-5 bg-[#0e1222] rounded-[28px] sm:rounded-[36px] border border-purple-500/30 shadow-2xl p-6 sm:p-7 flex flex-col justify-between h-full sticky top-28">
              
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Live Studio Output View
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                    4K RAY-TRACED
                  </span>
                </div>

                {/* Visual Viewport with Simulation overlay */}
                <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black aspect-[3/4] shadow-inner mb-4 group">
                  <img 
                    src={generatedResult ? generatedResult.image : '/images/fashion-photoshoot-hero.jpg'} 
                    alt="AI Fashion Photoshoot Generation Result"
                    className={`w-full h-full object-cover transition-all duration-700 select-none ${
                      isSimulating ? 'blur-sm scale-105' : 'blur-0 scale-100'
                    }`}
                  />

                  {/* Corner Camera Brackets */}
                  <div className="absolute inset-3 border border-white/20 pointer-events-none rounded-xl">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-400" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-400" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-400" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-400" />
                  </div>

                  {/* Laser Scan line during simulation */}
                  {isSimulating && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-30">
                      <div className="w-14 h-14 rounded-2xl bg-purple-600/30 border border-purple-400/50 flex items-center justify-center text-purple-300 mb-4 animate-focus-pulse">
                        <Sparkles className="w-7 h-7 text-purple-300 animate-spin" style={{ animationDuration: '3s' }} />
                      </div>
                      
                      <div className="w-full bg-white/10 rounded-full h-2 mb-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${simStep * 25}%` }}
                        />
                      </div>

                      <p className="text-xs font-bold text-white mb-1">
                        {simStep === 1 && `Extracting ${selectedColor} ${selectedCategory} fabric geometry...`}
                        {simStep === 2 && `Rigging Indian ${selectedGender} model in ${selectedPose} posture...`}
                        {simStep === 3 && `Lighting simulation: Ray-traced ${selectedBackground} environment...`}
                        {simStep === 4 && 'Synthesizing 4K Ultra-HD Runway Photograph...'}
                      </p>
                      <span className="text-[11px] text-purple-300 font-mono">DhandaGrow AI Photoshoot Studio</span>
                    </div>
                  )}

                  {/* Floating Top Badge */}
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 flex items-center gap-1.5 z-20">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[11px] font-bold text-white">
                      {generatedResult ? generatedResult.title : `${selectedColor} ${selectedCategory}`}
                    </span>
                  </div>

                  {/* Floating Bottom Specs Pill */}
                  <div className="absolute bottom-3 left-3 right-3 bg-black/85 backdrop-blur-md p-2.5 rounded-xl border border-white/15 text-[11px] text-slate-300 flex items-center justify-between z-20">
                    <span className="text-purple-300 font-semibold">{selectedPose} • {selectedBackground.split(' ')[0]}</span>
                    <span className="text-emerald-400 font-bold">Drape: 99.4% Accurate</span>
                  </div>
                </div>

                {/* Generated Prompt Details */}
                <div className="p-3.5 rounded-xl bg-[#14182b] border border-white/5 mb-4 text-xs text-slate-300">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Generated Synthesis Prompt</span>
                    <button 
                      onClick={handleCopyPrompt}
                      className="inline-flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 cursor-pointer font-semibold"
                    >
                      {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedPrompt ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                    Indian {selectedGender} model wearing {selectedColor} {selectedCategory}, {selectedPose.toLowerCase()} in {selectedBackground.toLowerCase()} set, ray-traced soft lighting, 85mm f/1.4.
                  </p>
                </div>
              </div>

              {/* Bottom Dashboard Redirection Call-To-Action */}
              <div className="pt-3 border-t border-white/10 space-y-2.5">
                <Link href="/login/user" className="w-full block">
                  <Button className="w-full h-12 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold text-sm cursor-pointer border-0 shadow-lg flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Launch Full Studio in Dashboard</span>
                    <ArrowRight className="w-4 h-4 ml-1 text-purple-600" />
                  </Button>
                </Link>
                <p className="text-[10px] text-center text-slate-400">
                  Ready to batch generate full catalogs? Sign in to unlock high-res unmetered renders.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. Fashion Categories Showcase Grid */}
      <section className="py-20 sm:py-28 bg-[#06080f] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-purple-400 font-bold text-xs sm:text-sm tracking-wider uppercase inline-block mb-2">
              Indian Apparel Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Engineered for Every Garment Category
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-normal">
              Whether you sell bridal Banarasi sarees, daily wear kurtis, regal groom sherwanis, or trendy streetwear, DhandaGrow AI produces flawless catalog aesthetics.
            </p>
          </div>

          {/* Master 4 Categories Collage Image */}
          <div className="mb-14 rounded-[28px] sm:rounded-[40px] overflow-hidden border border-purple-500/25 shadow-2xl group max-w-6xl mx-auto">
            <img 
              src="/images/fashion-categories-showcase.jpg" 
              alt="4 Indian Fashion Photoshoot Categories: Crimson Banarasi Saree, Pastel Anarkali Kurti, Royal Sherwani, and Purple Streetwear Hoodie" 
              className="w-full h-auto object-cover select-none group-hover:scale-[1.01] transition-transform duration-500"
            />
          </div>

          {/* 4 Category Detailed Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: 'Royal Sarees & Silks',
                category: 'Saree & Ethnic Wear',
                desc: 'Authentic pleats, flowing pallu drapes, and ray-traced golden zari reflections for festive and bridal catalogues.',
                badge: 'Saree Collection',
                badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              },
              {
                title: 'Kurtis, Suits & Anarkalis',
                category: 'Women Everyday & Festive',
                desc: 'Crisp embroidery details, flowy georgette silhouettes, and sunlit outdoor garden settings for modern boutiques.',
                badge: 'Kurti Showcase',
                badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30'
              },
              {
                title: 'Royal Sherwanis & Kurtas',
                category: 'Men Ethnic & Wedding',
                desc: 'Regal masculine postures, structured brocade collars, and Rajasthani heritage palace architectural backdrops.',
                badge: 'Men Ethnic',
                badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              },
              {
                title: 'Gen-Z Streetwear & Drops',
                category: 'Western & Casuals',
                desc: 'Oversized heavy cotton tees, dynamic cafe and urban street poses, tailored for modern youth brands.',
                badge: 'Streetwear Drop',
                badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="bg-[#0d101d] border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 hover:bg-[#121626] transition-all flex flex-col justify-between"
              >
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block border mb-3 ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal mb-4">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-white/10 text-[11px] text-purple-400 font-semibold">
                  {item.category}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. Pro Production Capabilities */}
      <section className="py-20 sm:py-28 bg-[#090b14] relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-14 sm:mb-20">
            <span className="text-purple-400 font-bold text-xs sm:text-sm tracking-wider uppercase inline-block mb-2">
              Virtual Model Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Why Indian Brands Choose DhandaGrow
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-normal">
              Eliminate model contracts, photographer schedules, and studio rent while getting magazine-quality imagery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Authentic Indian Skin Tones",
                desc: "AI models trained on diverse regional Indian complexions, facial aesthetics, and styling for maximum local conversion.",
                icon: <User className="w-6 h-6 text-purple-400" />
              },
              {
                title: "Realistic Fabric Physics & Drape",
                desc: "Sub-pixel physics simulation renders natural garment folds, pallu falls, pleat shadows, and intricate zari textures.",
                icon: <Layers className="w-6 h-6 text-pink-400" />
              },
              {
                title: "Controllable Poses & Camera Views",
                desc: "Choose standing, walking, or sitting poses with front, side, and three-quarter angles for complete catalog coverage.",
                icon: <Camera className="w-6 h-6 text-amber-400" />
              },
              {
                title: "Catalog & Custom Clothing Mode",
                desc: "Type category and color directly, or pick products from your store inventory for automated batch fashion shoots.",
                icon: <Shirt className="w-6 h-6 text-emerald-400" />
              },
              {
                title: "Zero Retouching & Instant 4K",
                desc: "Commercial 300 DPI high-definition imagery ready immediately for Amazon, Flipkart, Meesho, Myntra, and hoardings.",
                icon: <Zap className="w-6 h-6 text-blue-400" />
              },
              {
                title: "Virtual Sets from Studios to Palaces",
                desc: "Switch between clean white commercial studio backdrops, luxury royal palace arches, modern cafes, and outdoor gardens.",
                icon: <Store className="w-6 h-6 text-rose-400" />
              }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="p-7 rounded-2xl sm:rounded-3xl bg-[#0d101d] border border-white/10 hover:border-purple-500/40 hover:bg-[#121626] transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
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
      <section className="py-20 sm:py-28 bg-[#06080f] border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-purple-400 font-bold text-xs sm:text-sm tracking-wider uppercase inline-block mb-2">
              AI Photoshoot FAQs
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {photoshootFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-[#0e1222] border border-white/10 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-white hover:text-purple-400 transition-colors cursor-pointer"
                  >
                    <span className="text-sm sm:text-base leading-snug">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-purple-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
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

      {/* 8. Feature Showcase Section Integration & High-Converting CTA */}
      <FeatureShowcaseSection feature="ai-photoshoot" />
      <section className="py-20 sm:py-28 bg-[#06080f] relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] sm:rounded-[44px] bg-gradient-to-br from-purple-950 via-[#120f26] to-[#070913] border border-purple-500/30 flex flex-col md:flex-row items-center justify-between p-10 sm:p-16 relative overflow-hidden shadow-2xl">
            {/* Ambient purple backlight */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/15 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
            
            <div className="mb-8 md:mb-0 relative z-10 text-center md:text-left max-w-xl">
              <span className="text-purple-400 font-bold text-xs uppercase tracking-wider block mb-2">
                Zero Model Fees • Instant Indian Catalog
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white leading-tight">
                Shoot your first fashion model campaign today.
              </h2>
              <p className="text-slate-300 text-base sm:text-lg font-normal">
                No physical studio, lighting crew, or model contracts. Generate high-fashion photography in 3 seconds with DhandaGrow AI.
              </p>
            </div>
            
            <Link href="/login/user" className="relative z-10">
              <Button 
                size="lg" 
                className="h-14 sm:h-16 px-10 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-bold text-base sm:text-lg flex items-center gap-2 border-0 shadow-[0_0_40px_rgba(168,85,247,0.35)] cursor-pointer"
              >
                <span>Launch Fashion Photoshoot</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
