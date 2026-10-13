'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Camera, 
  Aperture, 
  Layers, 
  Sparkles, 
  Droplet, 
  MoveRight, 
  Image as ImageIcon, 
  Box, 
  Sliders, 
  Sun, 
  Maximize2, 
  CheckCircle2, 
  ChevronDown, 
  Download, 
  Zap, 
  ShoppingBag, 
  Palette, 
  Flame 
} from 'lucide-react';

interface PresetSet {
  id: string;
  name: string;
  category: string;
  lighting: string;
  description: string;
  idealFor: string;
  badge: string;
  badgeColor: string;
}

const virtualSets: PresetSet[] = [
  {
    id: 'festive-silk',
    name: 'Festive Crimson Silk & Diya Glow',
    category: 'Indian Festive & Heritage',
    lighting: 'Warm Sunset 3200K Softbox',
    description: 'Rich royal red silk folds, glowing terracotta diyas, and fresh marigold flower petals with warm golden rim lighting.',
    idealFor: 'Jewelry, Festive Kurtis, Sweets, Puja Gifts',
    badge: 'Diwali Bestseller',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  },
  {
    id: 'marble-luxury',
    name: 'Italian Carrara Marble & Botanical Shadows',
    category: 'Luxury Beauty & Cosmetics',
    lighting: 'Diffused Morning Daylight f/1.8',
    description: 'Polished white marble slabs, gentle pink satin drapes, water caustics, and delicate organic olive branch shadows.',
    idealFor: 'Skincare Serums, Fragrances, Creams, Cosmetics',
    badge: 'High Conversion',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  },
  {
    id: 'urban-neon',
    name: 'Cyberpunk Neon & Wet Asphalt',
    category: 'Streetwear & Electronics',
    lighting: 'Dual Split Cyan & Magenta Neon',
    description: 'Rain-slicked dark pavement with vibrant neon reflections, gritty atmospheric mist, and sharp metallic rim highlights.',
    idealFor: 'Sneakers, Gaming Audio, Tech Wearables, Energy Drinks',
    badge: 'Trending Gen Z',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
  },
  {
    id: 'rustic-earth',
    name: 'Organic Teak Wood & Fresh Botanicals',
    category: 'Ayurveda & Organic Foods',
    lighting: 'Warm Ambient Window Light',
    description: 'Aged textured wood planks, rustic linen cloth, scattered star anise, cinnamon quills, and dewy mint leaves.',
    idealFor: 'Herbal Teas, Spices, Dry Fruits, Cold-Pressed Oils',
    badge: '100% Natural Vibe',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30'
  }
];

const photoshootFaqs = [
  {
    q: 'Do I need a plain white wall or special lighting to click my product?',
    a: 'No! You can literally click your product on a messy wooden table, kitchen counter, or bed under normal room lighting. DhandaGrow AI uses advanced computer vision to isolate your product with sub-pixel precision and rebuild the entire lighting from scratch.'
  },
  {
    q: 'How does it handle complex glass transparency and reflections?',
    a: 'Unlike basic background removers that cut out glass awkwardly, our AI models understand ray-traced optics. It preserves the transparency of perfume bottles, liquid colors, metallic specular highlights, and casts realistic contact shadows on the new ground plane.'
  },
  {
    q: 'Are the photoshoots compliant with Amazon, Flipkart, and Meesho?',
    a: 'Yes, 100%. You can generate pure white background (RGB 255,255,255) marketplace-compliant hero images with 85% frame filling, as well as editorial lifestyle creatives for Instagram, Shopify, and catalog banners.'
  },
  {
    q: 'Can I generate multiple angles of the same product consistently?',
    a: 'Yes! You can upload different angles of your product (front, 45-degree angle, top-down flat-lay) and apply the exact same virtual set and lighting parameters to maintain consistent catalog aesthetics.'
  },
  {
    q: 'What resolution do I get for final downloads?',
    a: 'Every render is generated in full high resolution and can be upscaled to crystal-clear 4K Ultra-HD (3840 x 2160) at 300 DPI, making it ready for digital ads as well as physical print hoardings and packaging.'
  },
  {
    q: 'How much money does this save compared to a traditional physical studio?',
    a: 'A typical commercial product photoshoot in Mumbai or Bangalore costs ₹25,000 to ₹1,00,000 for studio rental, lighting equipment, props, and photographers. With DhandaGrow AI, you generate infinite studio-grade variations for a fraction of the cost in 3 seconds.'
  }
];

export default function PhotoshootPage() {
  const [activeSet, setActiveSet] = useState<PresetSet>(virtualSets[0]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-emerald-500/30 selection:text-white font-sans">
      <Navbar />
      
      {/* 1. Cinematic Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        {/* Deep ambient glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/20 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-blue-900/15 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <Aperture className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold tracking-widest uppercase text-slate-300">
              The Virtual Darkroom • AI Product Studio
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[90px] font-bold mb-6 tracking-tighter leading-[0.95]">
            Studio Quality. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 font-serif italic pr-4">
              Zero Studio.
            </span>
          </h1>
          
          <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed mb-10">
            Upload a raw smartphone product photo. Let our AI magically build the set, adjust ray-traced lighting, and snap a million-dollar commercial campaign shot in 3 seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/create-ad">
              <Button 
                variant="default" 
                size="lg" 
                className="h-14 sm:h-16 px-10 text-base sm:text-lg rounded-full bg-white text-black hover:bg-slate-200 transition-all font-bold shadow-[0_0_40px_rgba(255,255,255,0.3)] cursor-pointer"
              >
                Launch Virtual Studio
              </Button>
            </Link>

            <a 
              href="#virtual-sets" 
              className="inline-flex items-center justify-center h-14 sm:h-16 px-8 text-base font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors"
            >
              Explore Virtual Sets
            </a>
          </div>
        </div>

        {/* Hero Panorama Viewfinder Image */}
        <div className="w-full max-w-[92vw] lg:max-w-6xl mx-auto mt-16 sm:mt-20 relative z-10 rounded-[32px] sm:rounded-[44px] overflow-hidden border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,0.8)] group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none" />
          
          <img 
            src="/images/ai-photoshoot-hero.jpg" 
            alt="AI Virtual Studio commercial photography of Aurelia Perfume and Samadhi Restorative Cream on Carrara Marble with studio lighting" 
            className="w-full h-[380px] sm:h-[500px] md:h-[620px] object-cover group-hover:scale-[1.01] transition-transform duration-700 select-none"
          />

          {/* Viewfinder HUD Overlays */}
          <div className="absolute inset-4 sm:inset-6 border border-white/20 z-20 pointer-events-none rounded-2xl sm:rounded-3xl">
            {/* Viewfinder Corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-400" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-400" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-400" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-400" />
            
            {/* Center Focus Reticle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 border border-white/30 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
            </div>

            {/* Top Left Rec Badge */}
            <div className="absolute top-3 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-mono font-bold tracking-wider text-white">4K RAY-TRACED</span>
            </div>

            {/* Bottom Floating Lighting Pill */}
            <div className="absolute bottom-3 left-4 hidden sm:flex items-center gap-3 bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Sun className="w-3.5 h-3.5" /> Studio Warm 3200K
              </span>
              <span className="text-slate-500">|</span>
              <span className="font-mono">Depth of Field: f/1.8</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300 font-medium">Italian Carrara Marble</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Stats Strip */}
      <section className="py-14 border-y border-white/10 bg-zinc-950 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-white/10 text-center">
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2 tracking-tight">98%</h3>
              <p className="text-xs sm:text-[13px] font-bold text-slate-400 uppercase tracking-wider">Cheaper than Physical Studios</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2 tracking-tight">3s</h3>
              <p className="text-xs sm:text-[13px] font-bold text-slate-400 uppercase tracking-wider">Average Render Speed</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2 tracking-tight">4K</h3>
              <p className="text-xs sm:text-[13px] font-bold text-slate-400 uppercase tracking-wider">Ultra-HD Print Ready</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2 tracking-tight">50+</h3>
              <p className="text-xs sm:text-[13px] font-bold text-slate-400 uppercase tracking-wider">Virtual Set Environments</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Before & After Showcase: The Real Magic */}
      <section className="py-20 sm:py-28 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-emerald-400 font-bold text-xs sm:text-sm tracking-wider uppercase inline-block mb-2">
              Transforming Ordinary Photos
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              From Cluttered Table to World-Class Catalog
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-light">
              See how our computer vision models isolate your raw phone photo and create magazine-cover quality lighting, water caustics, and reflections.
            </p>
          </div>

          {/* Master Before/After Comparison Card */}
          <div className="rounded-[28px] sm:rounded-[40px] overflow-hidden border border-white/15 shadow-[0_20px_70px_rgba(16,185,129,0.12)] bg-zinc-950 max-w-5xl mx-auto group">
            <img 
              src="/images/ai-photoshoot-before-after.jpg" 
              alt="Before and After: Raw smartphone photo on messy desk vs AI virtual studio render on water ripples with gold botanical leaves" 
              className="w-full h-auto object-cover select-none group-hover:scale-[1.01] transition-transform duration-500"
            />
          </div>

          {/* 3 Value Highlights Below Before/After */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-10">
            <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <Box className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Zero Studio Props Needed</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
                No need to buy expensive acrylic pedestals, water trays, or marble slabs. AI synthesizes them photorealistically.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <Sun className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Ray-Traced Caustics & Reflections</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
                Water ripples and glossy surfaces reflect your product’s true colors and geometry with physical fidelity.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-950 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Amazon & Marketplace Ready</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
                Instant high-converting lifestyle imagery that boosts click-through rates (CTR) and builds instant buyer trust.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Virtual Sets Showcase Section */}
      <section id="virtual-sets" className="py-20 sm:py-28 bg-zinc-950 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-emerald-400 font-bold text-xs sm:text-sm tracking-wider uppercase inline-block mb-2">
              Virtual Environments
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Curated Studio Sets for Indian E-Commerce
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-light">
              From festive temple diyas and crimson silks to cyberpunk streetwear and organic Ayurveda — pick any mood.
            </p>
          </div>

          {/* Master 4 Sets Collage Image */}
          <div className="mb-14 rounded-[28px] sm:rounded-[40px] overflow-hidden border border-white/15 shadow-2xl group max-w-6xl mx-auto">
            <img 
              src="/images/ai-photoshoot-sets.jpg" 
              alt="4 AI photoshoot sets: Indian festive jewelry on silk, cyberpunk sneaker on wet neon street, Ayurvedic tea on wood, luxury watch on frosted cube" 
              className="w-full h-auto object-cover select-none group-hover:scale-[1.01] transition-transform duration-500"
            />
          </div>

          {/* Interactive Set Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {virtualSets.map((set) => {
              const isSelected = activeSet.id === set.id;
              return (
                <div
                  key={set.id}
                  onClick={() => setActiveSet(set)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-zinc-900 border-emerald-500/80 shadow-lg shadow-emerald-500/10'
                      : 'bg-black/60 border-white/10 hover:border-white/30 hover:bg-zinc-900/60'
                  }`}
                >
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block border mb-3 ${set.badgeColor}`}>
                      {set.badge}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug">
                      {set.name}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-light mb-4">
                      {set.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 text-[11px] text-slate-300">
                    <span className="text-slate-500 block mb-0.5">Ideal for:</span>
                    <span className="font-semibold text-emerald-400">{set.idealFor}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. Production Capabilities (The Complete Toolkit) */}
      <section className="py-20 sm:py-28 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-14 sm:mb-20">
            <span className="text-cyan-400 font-bold text-xs sm:text-sm tracking-wider uppercase inline-block mb-2">
              Pro Photography Engine
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              The Virtual Photographer’s Superpowers
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-light">
              Engineered with advanced 3D surface topology and physics-based lighting simulation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Sub-Pixel Edge Extraction",
                desc: "Accurately isolates transparent glass bottles, delicate jewelry chains, fuzzy wool fabrics, and intricate product edges without jagged artifacts.",
                icon: <Layers className="w-6 h-6 text-emerald-400" />
              },
              {
                title: "Ray-Traced Contact Shadows",
                desc: "Calculates the real ground contact surface and casts physically realistic ambient occlusion shadows that ground the product naturally.",
                icon: <Sun className="w-6 h-6 text-cyan-400" />
              },
              {
                title: "Controllable Depth of Field",
                desc: "Adjust camera aperture simulation from razor-sharp f/16 catalog clarity down to creamy f/1.4 creamy bokeh for luxury mood shots.",
                icon: <Aperture className="w-6 h-6 text-purple-400" />
              },
              {
                title: "Batch Catalog Processing",
                desc: "Upload 50 raw smartphone product photos at once. AI applies the same studio lighting and set geometry across your entire collection.",
                icon: <Zap className="w-6 h-6 text-amber-400" />
              },
              {
                title: "Instant 4K Upscale & Color Balance",
                desc: "Super-resolves raw camera noise into crisp 300 DPI 4K assets with natural color tone retention that represents true product colors.",
                icon: <Maximize2 className="w-6 h-6 text-blue-400" />
              },
              {
                title: "Multi-Angle Lighting Continuity",
                desc: "Keeps key lights, fill lights, and rim reflections identical across front, isometric 45°, and top-down product angles.",
                icon: <Sliders className="w-6 h-6 text-pink-400" />
              }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="p-7 rounded-2xl sm:rounded-3xl bg-zinc-950 border border-white/10 hover:border-emerald-500/40 hover:bg-zinc-900/60 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed text-xs sm:text-sm font-light">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. FAQs Section */}
      <section className="py-20 sm:py-28 bg-zinc-950 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-emerald-400 font-bold text-xs sm:text-sm tracking-wider uppercase inline-block mb-2">
              Virtual Studio FAQs
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
                  className="bg-black border border-white/10 rounded-2xl overflow-hidden transition-all"
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
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-slate-400 leading-relaxed font-light border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 7. Sleek High-Converting Darkroom CTA */}
      <section className="py-20 sm:py-28 bg-black relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] sm:rounded-[44px] bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-white/15 flex flex-col md:flex-row items-center justify-between p-10 sm:p-16 relative overflow-hidden shadow-2xl">
            {/* Ambient emerald backlight */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
            
            <div className="mb-8 md:mb-0 relative z-10 text-center md:text-left max-w-xl">
              <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider block mb-2">
                Zero Setup • Instant Catalog
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white leading-tight">
                Shoot your first campaign in 3 seconds.
              </h2>
              <p className="text-slate-400 text-base sm:text-lg font-light">
                No physical studio, lighting crew, or expensive props. Try DhandaGrow AI Photoshoot today.
              </p>
            </div>
            
            <Link href="/create-ad" className="relative z-10">
              <Button 
                size="lg" 
                className="h-14 sm:h-16 px-10 rounded-full bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-base sm:text-lg flex items-center gap-2 border-0 shadow-[0_0_40px_rgba(52,211,153,0.3)] cursor-pointer"
              >
                Open Virtual Darkroom <MoveRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
