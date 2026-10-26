import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { FeatureExpansionSections } from '@/components/FeatureExpansionSections';
import { FeatureShowcaseSection } from '@/components/FeatureShowcaseSection';
import {
  ShoppingBag,
  Sparkles,
  RefreshCw,
  Wand2,
  Package,
  Tag,
  QrCode,
  Smartphone,
  Globe,
  CreditCard,
  Bot,
  CheckCircle2,
  Share2,
  Flame,
  ShieldCheck,
  Search
} from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  hindiName: string;
  categoryLabel: string;
  price: number;
  originalPrice: number;
  stock: number;
  image: string;
  badge: string;
  badgeColor: string;
  aiScore: number;
  sku: string;
  tags: string[];
}

const CATALOGUE_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'Royal Banarasi Kora Silk Saree',
    hindiName: 'शाही बनारसी कोरा सिल्क साड़ी',
    categoryLabel: 'Ethnic & Bridal',
    price: 14999,
    originalPrice: 22500,
    stock: 14,
    image: '/images/product-banarasi-saree.jpg',
    badge: '🔥 Best Seller',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    aiScore: 98,
    sku: 'BNR-SLK-402',
    tags: ['Pure Kora Silk', 'Gold Zari Pallu', 'Wedding Edition']
  },
  {
    id: 'prod-2',
    name: '22KT Kundan & Pearl Choker Set',
    hindiName: '22 कैरेट कुंदन व पर्ल चोकर सेट',
    categoryLabel: 'Fine Jewellery',
    price: 48500,
    originalPrice: 56000,
    stock: 6,
    image: '/images/product-kundan-necklace.jpg',
    badge: '💎 Certified Luxury',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    aiScore: 96,
    sku: 'JWL-KDN-891',
    tags: ['BIS Hallmarked', 'Hydro Kundan', 'Fresh Pearls']
  },
  {
    id: 'prod-3',
    name: 'Kashmiri Kumkumadi Saffron Glow Serum',
    hindiName: 'कश्मीरी शुद्ध केसर कुमकुमादि सीरम',
    categoryLabel: 'Ayurveda & Wellness',
    price: 2499,
    originalPrice: 3200,
    stock: 42,
    image: '/images/product-saffron-serum.jpg',
    badge: '🌿 100% Organic',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    aiScore: 94,
    sku: 'AYU-SFR-105',
    tags: ['Grade A Saffron', 'Sandalwood Base', 'Toxin-Free']
  },
  {
    id: 'prod-4',
    name: 'Handcrafted Royal Velvet Embroidered Mojaris',
    hindiName: 'शाही मखमली जरी कढ़ाई वाली मोजड़ी',
    categoryLabel: 'Handmade Footwear',
    price: 3800,
    originalPrice: 4999,
    stock: 19,
    image: '/images/product-velvet-mojaris.jpg',
    badge: '👑 Royal Heritage',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    aiScore: 92,
    sku: 'FTR-MJR-720',
    tags: ['Genuine Leather Sole', 'Zardozi Embroidery', 'Padded Insole']
  },
  {
    id: 'prod-5',
    name: 'Artisanal Brass Dhokra Peacock Diya Urli',
    hindiName: 'ढोकरा ब्रास मयूर दिया उरली',
    categoryLabel: 'Decor & Festive',
    price: 4200,
    originalPrice: 5500,
    stock: 28,
    image: '/images/product-brass-urli.jpg',
    badge: '🪔 Festive Special',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    aiScore: 91,
    sku: 'HDC-URL-310',
    tags: ['Lost-Wax Casting', 'Pure Brass', 'Diwali Centerpiece']
  },
  {
    id: 'prod-6',
    name: 'Designer Silk Bridal Zardozi Lehenga',
    hindiName: 'डिज़ाइनर सिल्क ब्राइडल ज़रदोज़ी लहंगा',
    categoryLabel: 'Ethnic & Bridal',
    price: 38500,
    originalPrice: 49999,
    stock: 8,
    image: '/images/product-designer-lehenga.jpg',
    badge: '🌸 Trending Couture',
    badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    aiScore: 97,
    sku: 'LHG-ZRD-904',
    tags: ['Raw Silk Flared Skirt', 'Velvet Choli', 'Zardozi Zari']
  }
];

export default function CataloguePage() {
  return (
    <main className="min-h-screen bg-[#070B14] text-slate-100 font-sans selection:bg-emerald-500 selection:text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 lg:pt-24 pb-12 lg:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Glow ambient background lights */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-emerald-500/20 via-teal-500/15 to-violet-600/20 blur-[140px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="text-center max-w-4xl mx-auto">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">
              DhandaGrow AI • Smart Product Catalogue
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-emerald-400" />
            <span className="hidden sm:inline-block text-[11px] text-emerald-200/80 font-medium">
              Real-Time Omnichannel Sync
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white mb-6">
            Turn Phone Snaps into High-Converting Catalogues.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Auto-Sync Across Social, Web & CRM.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300/90 leading-relaxed mb-8 max-w-3xl mx-auto font-normal">
            Upload raw photos from your smartphone. DhandaGrow AI removes messy backgrounds, places sarees and jewellery on virtual Indian models, writes Hinglish SEO product descriptions, and syncs live stock with instant 1-tap UPI QR checkout.
          </p>

          {/* Channels Connected Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
            <span className="text-xs text-slate-400 font-semibold mr-1">Natively Synchronizing:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
              <Smartphone className="w-3.5 h-3.5" /> Social Shop
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-xs font-bold text-pink-400">
              <Share2 className="w-3.5 h-3.5" /> Instagram DMs
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-bold text-teal-400">
              <Globe className="w-3.5 h-3.5" /> Web Storefront
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400">
              <Package className="w-3.5 h-3.5" /> Leads CRM
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-400">
              <QrCode className="w-3.5 h-3.5" /> UPI & Razorpay
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-base rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-[0_0_30px_rgba(16,185,129,0.35)] transition-all hover:scale-105 border-0"
              asChild
            >
              <Link href="/download">
                <Sparkles className="w-5 h-5 mr-2" /> Create AI Catalogue Free
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-14 px-8 text-base rounded-full border-slate-700 bg-slate-900/80 text-white hover:bg-slate-800 backdrop-blur-md"
              asChild
            >
              <Link href="/features/crm">
                <ShoppingBag className="w-5 h-5 mr-2 text-teal-400" /> View Connected CRM
              </Link>
            </Button>
          </div>

          {/* Metrics Pill Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto rounded-2xl bg-slate-900/60 border border-slate-800/80 p-3 backdrop-blur-xl">
            <div className="flex flex-col items-center justify-center p-3 border-r border-slate-800/80 last:border-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">&lt; 5 Sec</span>
              <span className="text-xs text-slate-400 mt-1 font-medium">AI Photo to Listing</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 border-r border-slate-800/80 last:border-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-teal-400 tracking-tight">100% Realtime</span>
              <span className="text-xs text-slate-400 mt-1 font-medium">Omnichannel Stock Lock</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 border-r border-slate-800/80 last:border-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 tracking-tight">₹0 Studio</span>
              <span className="text-xs text-slate-400 mt-1 font-medium">DSLR Expenses Saved</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-purple-300 tracking-tight">3.8x Faster</span>
              <span className="text-xs text-slate-400 mt-1 font-medium">In-Chat UPI Conversions</span>
            </div>
          </div>
        </div>

        {/* Master Inventory Showcase Container (Pure Showcase - Nothing Clickable in UI) */}
        <div className="mt-14 relative rounded-3xl border border-slate-800 bg-slate-950/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-2xl p-4 sm:p-8 select-none">
          {/* Header Controls (Pure Display) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                Live Master Inventory Cockpit (1,240 SKUs)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Real-time synchronized inventory across Social Shop, Instagram DMs & Web Storefront.
              </p>
            </div>

            {/* Read-only Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Omnichannel Sync Active (100% Live)</span>
            </div>
          </div>

          {/* Category Display Pills (Read-only tags) */}
          <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none pointer-events-none">
            {[
              { label: 'All Items (1,240)', active: true },
              { label: '👗 Ethnic & Sarees', active: false },
              { label: '💎 Kundan Jewellery', active: false },
              { label: '🌿 Ayurvedic Skincare', active: false },
              { label: '👞 Royal Mojaris', active: false },
              { label: '🪔 Brass Handicrafts', active: false }
            ].map((cat, i) => (
              <span
                key={i}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                  cat.active
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-900/60 text-slate-400 border border-slate-800'
                }`}
              >
                {cat.label}
              </span>
            ))}
          </div>

          {/* Product Cards Grid (Non-clickable UI Showcase) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-2 pointer-events-none">
            {CATALOGUE_PRODUCTS.map(product => (
              <div
                key={product.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden flex flex-col shadow-lg"
              >
                {/* Card Top: Studio Image & Badges */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border backdrop-blur-md ${product.badgeColor}`}>
                      {product.badge}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-950/80 border border-slate-700 text-[10px] font-bold text-slate-300 backdrop-blur-md">
                      SKU: {product.sku}
                    </span>
                  </div>

                  {/* AI Quality Score */}
                  <div className="absolute bottom-2 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-[11px] font-bold text-emerald-300 backdrop-blur-md">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    AI Score: {product.aiScore}%
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm line-clamp-1 mb-0.5">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mb-2 font-medium">
                      {product.hindiName}
                    </p>

                    {/* Price & MRP */}
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-lg font-extrabold text-emerald-400">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-500 line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    {/* Live Stock Display (Pure Static Read-only - No clickable buttons) */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-3">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-slate-400" />
                        Live Stock:
                      </span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {product.stock} pcs in stock
                      </span>
                    </div>

                    {/* Live Synced Channels Pulsing Indicator */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-4 px-1">
                      <span className="font-medium text-slate-500">Live Synced:</span>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> WA
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-pink-400 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" /> IG
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-teal-400 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" /> Web
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Meta (Read-only Display Tags - Nothing Clickable) */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                    <div className="py-2 px-2.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-semibold flex items-center justify-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-emerald-400" /> UPI QR Active
                    </div>
                    <div className="py-2 px-2.5 rounded-xl bg-slate-800/80 text-slate-300 border border-slate-700/60 text-xs font-semibold flex items-center justify-center gap-1.5">
                      <Wand2 className="w-3.5 h-3.5 text-teal-400" /> AI Copy Synced
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-time Omnichannel Sync Animation Visualizer */}
      <section className="py-20 lg:py-28 bg-[#04070D] border-t border-slate-800/80 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-3">
              Zero Double-Selling • 100% Real-time
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              How the Omnichannel Stock Sync Engine Works.
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              One master inventory server radiates changes across Social, Instagram, and Web Store in under 250 milliseconds.
            </p>
          </div>

          {/* Sync Animation UI Hub */}
          <div className="relative mx-auto w-full max-w-5xl py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Left Endpoints: Instagram & Facebook */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.1)] flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Social Business Shop</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Automated carts & in-chat orders</p>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold mt-1">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Live Synced (12ms)
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-pink-500/30 shadow-[0_0_25px_rgba(236,72,153,0.1)] flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center shrink-0">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Instagram DM Catalogue</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Story tag & Reel purchase links</p>
                    <span className="inline-flex items-center gap-1 text-[10px] text-pink-400 font-bold mt-1">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Live Synced (18ms)
                    </span>
                  </div>
                </div>
              </div>

              {/* Center: DhandaGrow AI Central Truth Hub */}
              <div className="relative p-7 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.25)] flex flex-col items-center text-center">
                <div className="absolute -top-3 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider">
                  Single Source of Truth
                </div>

                <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 animate-pulse">
                  <Package className="w-10 h-10" />
                </div>

                <h3 className="font-extrabold text-xl text-white">DhandaGrow Master Catalog</h3>
                <p className="text-xs text-slate-400 mt-1 mb-4">1,240 Active Products Synchronized</p>

                <div className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 font-medium">Banarasi Silk Saree #402:</span>
                    <span className="text-emerald-400 font-bold">14 units</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-3/4 animate-pulse" />
                  </div>
                  <p className="text-[10px] text-slate-500">Auto-locks stock upon customer checkout</p>
                </div>
              </div>

              {/* Right Endpoints: Live Web Store & UPI Gateway */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-teal-500/30 shadow-[0_0_25px_rgba(20,184,166,0.1)] flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center shrink-0">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Live Web Storefront</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Google Merchant & SEO indexed</p>
                    <span className="inline-flex items-center gap-1 text-[10px] text-teal-400 font-bold mt-1">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Live Synced (14ms)
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.1)] flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Razorpay & UPI Gateway</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Dynamic QR & instant settlement</p>
                    <span className="inline-flex items-center gap-1 text-[10px] text-purple-400 font-bold mt-1">
                      <CheckCircle2 className="w-3 h-3" /> Auto-Deducts on Pay
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 AI Superpowers Grid */}
      <section className="py-20 lg:py-28 bg-[#070B14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-3">
              Engineered for Indian Retailers & D2C Brands
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Everything Needed to Run a High-Volume Catalogue.
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Say goodbye to messy Excel sheets, disconnected Shopify plugins, and stock mismatches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Superpower 1 */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Wand2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">1-Click AI Photoshoot</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Take raw phone photos on any table or bed. DhandaGrow AI removes clutter, irons out wrinkles, and showcases apparel or jewellery on virtual Indian models in royal palace settings.
              </p>
            </div>

            {/* Superpower 2 */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-teal-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Multilingual AI Copywriter</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Gemini 2.0 writes high-converting product descriptions in natural Hinglish, Hindi, and English. Automatically extracts fabrics, wash care instructions, and festive hashtags.
              </p>
            </div>

            {/* Superpower 3 */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Omnichannel Stock Lock</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                When a customer buys your last bridal saree on Social Media, stock decrements instantly on your Website and Instagram Shop, preventing embarrassing double sales.
              </p>
            </div>

            {/* Superpower 4 */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">1-Tap UPI QR In-Chat</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Every product automatically generates a unique checkout link with Google Pay, PhonePe, and Paytm support. Send it into any chat to collect instant advance payment.
              </p>
            </div>

            {/* Superpower 5 */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-pink-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Festive Price Drops & Nudges</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Apply 15% Diwali or Wedding Season discounts across 500 products with one click. Automated nudges notify leads who inquired about those items earlier.
              </p>
            </div>

            {/* Superpower 6 */}
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Tag className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Predictive Restock Alerts</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Receive proactive Instant alerts when fast-moving items dip below safety thresholds, forecasting supplier reorder times before peak wedding rush.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase & Expansion Sections */}
      <FeatureShowcaseSection feature="catalogue" />
      <FeatureExpansionSections feature="catalogue" />

      {/* Bottom CTA */}
      <section className="py-24 bg-gradient-to-b from-[#070B14] to-[#04070D] text-center text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Start Free Today
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Stop Managing Products in Messy Excel. Let DhandaGrow AI Run Your Catalogue.
          </h2>
          <p className="text-slate-400 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
            Sync across Social, Instagram, and your Web Store in 60 seconds with instant UPI checkout.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto h-16 px-10 text-lg rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-[0_0_40px_rgba(16,185,129,0.35)] transition-all hover:scale-105 border-0"
              asChild
            >
              <Link href="/download">Launch Smart Catalogue Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-16 px-8 text-lg rounded-full border-slate-700 bg-slate-900/80 text-white hover:bg-slate-800"
              asChild
            >
              <Link href="/features/crm">Explore Leads CRM</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
