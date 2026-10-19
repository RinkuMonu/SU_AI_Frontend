"use client";

import { useState, useEffect } from "react";
import { GenerateReelRequest } from "@/types/reel";
import { FashionService } from "@/services/fashion.service";
import { 
  ShoppingBag, 
  Sparkles, 
  Check, 
  PlusCircle, 
  Layers, 
  Tag, 
  Image as ImageIcon,
  CheckCircle2,
  Package,
  Wand2,
  Film,
  Camera,
  Smartphone,
  Tv,
  Flame,
  Lightbulb,
  Video
} from "lucide-react";

interface ReelMakerFormProps {
  onGenerate: (request: GenerateReelRequest) => void;
  isLoading: boolean;
}

interface ProductItem {
  id: string;
  name: string;
  category?: string;
  description?: string;
  image_url?: string;
  isCustom?: boolean;
  isUserProduct?: boolean;
}

const PRESET_PRODUCTS: ProductItem[] = [
  {
    id: "preset_laptop",
    name: "MacBook Pro M3 Max",
    category: "Computers & Laptops",
    description: "Liquid Retina XDR display, M3 Max chip, all-day battery life for creators & developers",
    image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
  },
  {
    id: "preset_lehenga",
    name: "Royal Crimson Velvet Lehenga",
    category: "Ethnic Fashion",
    description: "Hand-embroidered zardozi and antique gold dabka work for royal weddings",
    image_url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&q=80",
  },
  {
    id: "preset_saree",
    name: "Pure Banarasi Silk Saree",
    category: "Ethnic Fashion",
    description: "Handcrafted zari weave with royal border for festive celebrations & weddings",
    image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80",
  },
  {
    id: "preset_earbuds",
    name: "Noise-Cancelling ANC Earbuds",
    category: "Electronics",
    description: "Ultra bass, 36h playtime, crystal-clear mic, and instant touch controls",
    image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80",
  },
  {
    id: "preset_serum",
    name: "Vitamin C Radiance Glow Serum",
    category: "Beauty & Skincare",
    description: "Pure organic botanical serum for deep hydration and youthful radiant skin",
    image_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80",
  },
  {
    id: "preset_hoodie",
    name: "Oversized Streetwear Hoodie",
    category: "Clothing",
    description: "400 GSM heavyweight cotton with drop-shoulder silhouette and aesthetic print",
    image_url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80",
  },
  {
    id: "preset_watch",
    name: "Smart Fitness Tracker Watch",
    category: "Wearables",
    description: "Curved AMOLED display, 24/7 heart & SpO2 tracking, 10-day battery life",
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
  },
  {
    id: "preset_coffee",
    name: "Artisan Roasted Coffee Beans",
    category: "Food & Beverage",
    description: "Medium-dark single origin Arabica beans with rich chocolate and caramel notes",
    image_url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&q=80",
  },
  {
    id: "preset_biryani",
    name: "Royal Dum Handi Biryani",
    category: "Restaurant & Dining",
    description: "Slow cooked saffron basmati rice with marinated spices, fried onions and fresh mint",
    image_url: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&q=80",
  },
  {
    id: "preset_jewel",
    name: "Heritage Polki Diamond Choker",
    category: "Jewellery & Luxury",
    description: "Uncut polki diamonds set in 22k gold with emerald beads and royal craftsmanship",
    image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80",
  },
];

const PROMPT_SUGGESTIONS = [
  {
    title: "🏎️ Hypercar Sunset Run",
    prompt: "Cinematic drone tracking shot following a sleek metallic gray hypercar accelerating along a dramatic Pacific coastal highway at golden hour. Ocean waves crashing against cliffs below, warm sunset lens flare, 8k photorealistic quality, ultra-smooth motion.",
    style: "Cinematic 8K Photoreal",
    tone: "energetic"
  },
  {
    title: "👗 Haute Couture Paris Runway",
    prompt: "High-fashion model gracefully walking on an illuminated mirror runway in Paris wearing an ethereal crimson silk gown that billows like liquid ruby. Slow-motion fabric movement, flashing paparazzi cameras, dramatic editorial spotlight.",
    style: "High-Fashion Editorial",
    tone: "luxurious"
  },
  {
    title: "☕ Artisanal Espresso Pour",
    prompt: "Ultra-macro 4K commercial shot of rich golden espresso pouring into an elegant glass cup, velvety crema forming on top with swirling steam. Warm amber morning cafe lighting, shallow depth of field, acoustic ambiance.",
    style: "Minimalist Studio Commercial",
    tone: "casual"
  },
  {
    title: "🏙️ Cyberpunk Neo-Tokyo Rain",
    prompt: "A futuristic cyberpunk city in neon rain at dusk. Holographic billboards reflecting in glossy wet asphalt, flying hovercars in distance, cinematic anamorphic bokeh, atmospheric synthwave aesthetics.",
    style: "Cyberpunk Neon Glow",
    tone: "energetic"
  },
  {
    title: "⛰️ Epic Mountain Flight",
    prompt: "FPV dynamic drone dive through a majestic misty alpine valley surrounded by snowcapped peaks and evergreen pines, passing over a crystal turquoise glacial lake as golden sunrise rays break through morning mist.",
    style: "FPV Dynamic Drone Motion",
    tone: "inspiring"
  },
  {
    title: "🏃 Athlete Sunrise Motivation",
    prompt: "Cinematic slow-motion shot of a dedicated sprinter pushing off starting blocks on an empty misty track at dawn. Sweat droplets flying, intense focused eyes, inspirational golden sunrise illuminating the stadium.",
    style: "Cinematic 8K Photoreal",
    tone: "inspiring"
  },
  {
    title: "🍔 Gourmet Smash Burger Smoke",
    prompt: "Delicious artisanal double smash burger with melting aged cheddar, crispy smoked bacon, and caramelized onions, savory steam rising under warm culinary studio lights, macro camera push-in.",
    style: "Minimalist Studio Commercial",
    tone: "energetic"
  },
  {
    title: "💎 Heritage Polki Diamond Sparkle",
    prompt: "Royal handcrafted diamond and emerald necklace turning slowly on luxurious dark midnight velvet. Micro-prismatic caustics and radiant light rays reflecting off each cut gem, ultra-luxury high jewelry showcase.",
    style: "High-Fashion Editorial",
    tone: "luxurious"
  }
];

const VIDEO_STYLES = [
  { id: "Cinematic 8K Photoreal", label: "🎬 Cinematic 8K Photoreal", desc: "Film look, shallow depth of field & realistic lighting" },
  { id: "Cyberpunk Neon Glow", label: "⚡ Cyberpunk Neon", desc: "Vibrant neon lighting, futuristic reflections & dark tones" },
  { id: "Vintage 35mm Analog Film", label: "🎞️ 35mm Retro Film", desc: "Classic grain, warm nostalgic tones & organic lens flares" },
  { id: "Minimalist Studio Commercial", label: "🏢 Minimalist Studio", desc: "Clean solid backdrop, soft studio lighting & luxury feel" },
  { id: "FPV Dynamic Drone Motion", label: "🚁 FPV Dynamic Drone", desc: "Fast-moving, sweeping aerial and fluid tracking shots" },
  { id: "3D Unreal Engine Render", label: "🎨 3D Unreal Render", desc: "Hyper-stylized graphics, raytraced reflections & vivid art" },
];

const OBJECTIVES = [
  { value: "sale", label: "🔥 Flash Sale" },
  { value: "product_launch", label: "🚀 Product Launch" },
  { value: "festival", label: "🎉 Festive Special" },
  { value: "brand_awareness", label: "📢 Brand Story" },
  { value: "offer", label: "🏷️ Special Offer" },
  { value: "testimonial", label: "⭐ Customer Spotlight" },
  { value: "educational", label: "💡 How It Works" },
  { value: "before_after", label: "✨ Before & After" },
];

export function ReelMakerForm({ onGenerate, isLoading }: ReelMakerFormProps) {
  // Top-Level Studio Mode: "prompt" (Google Veo custom prompt) vs "product" (Catalog/Custom product)
  const [studioMode, setStudioMode] = useState<"prompt" | "product">("prompt");

  // Prompt Mode States
  const [promptText, setPromptText] = useState("");
  const [videoStyle, setVideoStyle] = useState("Cinematic 8K Photoreal");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [referenceImageUrl, setReferenceImageUrl] = useState("");

  // Product State
  const [products, setProducts] = useState<ProductItem[]>(PRESET_PRODUCTS);
  const [selectedProductId, setSelectedProductId] = useState<string>("preset_saree");
  const [productMode, setProductMode] = useState<"catalog" | "custom">("catalog");
  
  // Custom Product Inputs
  const [customName, setCustomName] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customImageUrl, setCustomImageUrl] = useState("");

  // Reel Configuration
  const [festivalTheme, setFestivalTheme] = useState("none");
  const [objective, setObjective] = useState("sale");
  const [platform, setPlatform] = useState("instagram");
  const [language, setLanguage] = useState("Hinglish");
  const [duration, setDuration] = useState(15);
  const [tone, setTone] = useState("energetic");
  const [offer, setOffer] = useState("");
  const [instruction, setInstruction] = useState("");

  // Load User's Products on Mount
  useEffect(() => {
    async function loadProducts() {
      try {
        const userProducts = await FashionService.getProducts();
        if (userProducts && userProducts.length > 0) {
          const formattedUserProds: ProductItem[] = userProducts.map((p) => ({
            id: p.id,
            name: p.name,
            category: p.category || "My Product",
            description: p.description || `${p.name} - Premium Collection`,
            image_url: p.image_url,
            isUserProduct: true,
          }));
          setProducts([...formattedUserProds, ...PRESET_PRODUCTS]);
          setSelectedProductId(formattedUserProds[0].id);
        }
      } catch (err) {
        console.log("Using preset products for reels studio");
      }
    }
    loadProducts();
  }, []);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const getEffectiveProduct = () => {
    if (productMode === "custom") {
      return {
        id: "custom_" + Date.now(),
        name: customName.trim() || "Featured Product",
        category: customCategory.trim() || "Custom",
        description: customDescription.trim() || customName.trim(),
        image_url: customImageUrl.trim() || undefined,
      };
    }
    return selectedProduct || PRESET_PRODUCTS[0];
  };

  const handleGenerate = () => {
    // 1. PROMPT MODE (Google Veo Direct Text-to-Video Reel)
    if (studioMode === "prompt") {
      if (!promptText.trim()) {
        alert("Please enter a creative video prompt describing your reel.");
        return;
      }

      onGenerate({
        product_id: "prompt_" + Date.now(),
        product_name: promptText.trim().slice(0, 35) + "...",
        product_category: "AI Studio Reel",
        generation_mode: "prompt",
        prompt: promptText.trim(),
        custom_prompt: promptText.trim(),
        video_style: videoStyle,
        aspect_ratio: aspectRatio,
        product_description: promptText.trim(),
        product_image_url: referenceImageUrl.trim() || undefined,
        objective,
        platform,
        language,
        duration,
        tone,
        offer,
        additional_instruction: `Style: ${videoStyle}. ${instruction}`.trim(),
      });
      return;
    }

    // 2. PRODUCT REEL MODE
    const prod = getEffectiveProduct();
    if (productMode === "custom" && !customName.trim()) {
      alert("Please enter a product name for your reel.");
      return;
    }

    onGenerate({
      product_id: prod.id,
      product_name: prod.name,
      product_category: prod.category,
      generation_mode: "product",
      festival_theme: festivalTheme,
      product_description: prod.description,
      product_image_url: prod.image_url,
      objective,
      platform,
      language,
      duration,
      tone,
      offer,
      additional_instruction: instruction,
    });
  };

  const selectCls = "w-full rounded-xl border border-border bg-[#0a142c] p-3 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all font-medium text-white text-sm cursor-pointer";
  const labelCls = "mb-1.5 block text-xs font-bold text-text-muted uppercase tracking-wider";

  const effectiveProd = getEffectiveProduct();

  return (
    <div className="rounded-3xl border border-border bg-surface shadow-2xl overflow-hidden">
      {/* Studio Header & Top Mode Tabs */}
      <div className="p-6 border-b border-border bg-gradient-to-r from-[#0a142c] via-[#0d1b3a] to-[#0a142c] flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              Google Veo 3.1 &amp; Gemini Studio
            </span>
          </div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            AI Reel Creator
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Generate cinematic, viral short-form video reels with voiceovers and hooks
          </p>
        </div>

        {/* Primary Studio Mode Switcher */}
        <div className="flex items-center bg-black/40 p-1.5 rounded-2xl border border-border shadow-inner">
          <button
            type="button"
            onClick={() => setStudioMode("prompt")}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all text-xs flex items-center gap-2 cursor-pointer ${
              studioMode === "prompt"
                ? "bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-lg shadow-purple-500/25 scale-[1.02]"
                : "text-text-muted hover:text-white"
            }`}
          >
            <Wand2 className="w-4 h-4 text-amber-300" />
            <span>AI Prompt to Reel</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase">Veo</span>
          </button>

          <button
            type="button"
            onClick={() => setStudioMode("product")}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all text-xs flex items-center gap-2 cursor-pointer ${
              studioMode === "product"
                ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/20 scale-[1.02]"
                : "text-text-muted hover:text-white"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Product Reel</span>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">

        {/* ========================================================================= */}
        {/* MODE 1: AI PROMPT TO REEL (GOOGLE VEO & GEMINI)                           */}
        {/* ========================================================================= */}
        {studioMode === "prompt" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Creative Prompt Card */}
            <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-b from-purple-950/20 via-[#070e1e]/80 to-[#070e1e]/60 p-5 space-y-4 shadow-xl shadow-purple-900/5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-sm font-bold text-white flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-amber-400" />
                    Creative Video Prompt *
                  </label>
                  <p className="text-xs text-text-muted mt-0.5">
                    Describe what you want to see: camera motion, subject, environment, lighting &amp; vibe
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/20 self-start sm:self-auto">
                  Google Veo Text-to-Video
                </span>
              </div>

              {/* Main Prompt Input Area */}
              <div className="relative">
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="e.g. Cinematic 9:16 drone tracking shot following a sleek red hypercar speeding along a dramatic coastal cliff road at golden hour, ocean spray, anamorphic lens flare, photorealistic 8K quality, ultra-smooth motion..."
                  rows={4}
                  className="w-full rounded-2xl border border-border bg-[#060c1c] p-4 text-sm font-medium text-white placeholder:text-neutral-500 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/25 focus:outline-none transition-all resize-none shadow-inner leading-relaxed"
                />
                <div className="flex items-center justify-between mt-1 text-[11px] text-text-muted px-1">
                  <span>Be descriptive with camera angles (e.g. macro close-up, low-angle tracking, aerial drone)</span>
                  <span>{promptText.length} chars</span>
                </div>
              </div>

              {/* 1-Click Inspiration Chips */}
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  Try Instant Inspiration Prompts:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  {PROMPT_SUGGESTIONS.map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => {
                        setPromptText(item.prompt);
                        setVideoStyle(item.style);
                        setTone(item.tone);
                      }}
                      className="p-2.5 rounded-xl border border-border/80 bg-[#0a142c] hover:border-brand-purple/60 hover:bg-[#111f42] text-left transition-all group cursor-pointer flex flex-col justify-between"
                    >
                      <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-text-muted line-clamp-1 mt-1">
                        {item.prompt}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual Style Selector */}
            <div className="rounded-2xl border border-border bg-[#070e1e]/60 p-5 space-y-3">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-brand-purple" />
                Select Visual Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {VIDEO_STYLES.map((st) => {
                  const isSelected = videoStyle === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setVideoStyle(st.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "border-brand-purple bg-brand-purple/20 ring-2 ring-brand-purple/30 text-white shadow-md shadow-brand-purple/10"
                          : "border-border bg-[#0a142c] text-text-muted hover:border-brand-purple/40 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{st.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-brand-purple stroke-[3]" />}
                      </div>
                      <p className="text-[11px] text-text-muted mt-1 leading-snug">{st.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Aspect Ratio + Reference Image */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Aspect Ratio (Veo)</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: "9:16", label: "9:16", sub: "Reel / Shorts" },
                    { id: "16:9", label: "16:9", sub: "Landscape" },
                    { id: "1:1", label: "1:1", sub: "Square" },
                  ].map((ar) => (
                    <button
                      key={ar.id}
                      type="button"
                      onClick={() => setAspectRatio(ar.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        aspectRatio === ar.id
                          ? "border-brand-purple bg-brand-purple/20 text-white font-bold"
                          : "border-border bg-[#0a142c] text-text-muted hover:text-white"
                      }`}
                    >
                      <span className="text-xs font-bold block">{ar.label}</span>
                      <span className="text-[10px] text-text-muted block">{ar.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className={labelCls}>Reference Image URL (Optional - Image-to-Video)</label>
                <input
                  value={referenceImageUrl}
                  onChange={(e) => setReferenceImageUrl(e.target.value)}
                  placeholder="https://example.com/reference-photo.jpg (Veo will condition video on this image)"
                  className="w-full rounded-xl border border-border bg-[#0a142c] p-3 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all font-medium text-white text-sm placeholder:text-text-muted"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 2: PRODUCT REEL (CATALOG & CUSTOM PRODUCT)                           */}
        {/* ========================================================================= */}
        {studioMode === "product" && (
          <div className="rounded-2xl border border-border/80 bg-[#070e1e]/60 p-5 space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="text-sm font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-brand-purple" />
                  Select Product to Feature
                </label>
                <p className="text-xs text-text-muted mt-0.5">
                  Every reel script, voiceover, and visuals will be uniquely generated for this product
                </p>
              </div>

              {/* Product Mode Toggle */}
              <div className="flex items-center bg-[#0a142c] p-1 rounded-xl border border-border text-xs">
                <button
                  type="button"
                  onClick={() => setProductMode("catalog")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    productMode === "catalog"
                      ? "bg-brand-purple text-white shadow-sm font-semibold"
                      : "text-text-muted hover:text-white"
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  Catalog &amp; Presets
                </button>
                <button
                  type="button"
                  onClick={() => setProductMode("custom")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    productMode === "custom"
                      ? "bg-brand-purple text-white shadow-sm font-semibold"
                      : "text-text-muted hover:text-white"
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Custom Product
                </button>
              </div>
            </div>

            {/* CATALOG / PRESET GRID */}
            {productMode === "catalog" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
                  {products.map((p) => {
                    const isSelected = selectedProductId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedProductId(p.id)}
                        className={`relative rounded-xl border p-3 text-left transition-all cursor-pointer flex flex-col justify-between group overflow-hidden ${
                          isSelected
                            ? "border-brand-purple bg-brand-purple/15 ring-2 ring-brand-purple/30 shadow-md shadow-brand-purple/10"
                            : "border-border bg-[#0a142c] hover:border-brand-purple/50 hover:bg-[#0d1b3a]"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-brand-purple text-white rounded-full p-1 shadow-md z-10">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}

                        {p.isUserProduct && (
                          <div className="absolute top-2 left-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md px-1.5 py-0.5 text-[10px] font-bold z-10">
                            My Product
                          </div>
                        )}

                        <div className="w-full aspect-video rounded-lg overflow-hidden bg-black/30 mb-2.5 relative">
                          {p.image_url ? (
                            <img
                              src={p.image_url}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-muted">
                              <ImageIcon className="w-6 h-6 opacity-40" />
                            </div>
                          )}
                        </div>

                        <div>
                          {p.category && (
                            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-purple block mb-0.5">
                              {p.category}
                            </span>
                          )}
                          <h4 className="font-semibold text-xs text-white truncate" title={p.name}>
                            {p.name}
                          </h4>
                          {p.description && (
                            <p className="text-[11px] text-text-muted line-clamp-1 mt-0.5">
                              {p.description}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CUSTOM PRODUCT INPUT MODE */}
            {productMode === "custom" && (
              <div className="space-y-4 pt-1 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Product Name *</label>
                    <input
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g. Organic Herbal Face Serum"
                      className="w-full rounded-xl border border-border bg-[#0a142c] p-3 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all font-medium text-white text-sm placeholder:text-text-muted"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Category (Optional)</label>
                    <input
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="e.g. Skincare, Fashion, Electronics"
                      className="w-full rounded-xl border border-border bg-[#0a142c] p-3 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all font-medium text-white text-sm placeholder:text-text-muted"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Product Description / Key Features</label>
                  <textarea
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    placeholder="Highlight key benefits, selling points, or ingredients for the reel script..."
                    rows={2}
                    className="w-full rounded-xl border border-border bg-[#0a142c] p-3 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all font-medium text-white text-sm resize-none placeholder:text-text-muted"
                  />
                </div>

                <div>
                  <label className={labelCls}>Product Image URL (Optional)</label>
                  <input
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="https://example.com/product.jpg"
                    className="w-full rounded-xl border border-border bg-[#0a142c] p-3 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all font-medium text-white text-sm placeholder:text-text-muted"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* SHARED REEL CONFIGURATION: Platform, Duration, Language, Tone */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className={labelCls}>Platform</label>
            <select value={platform} onChange={(e) => setPlatform(e.target.value)} className={selectCls}>
              <option value="instagram">Instagram Reels</option>
              <option value="youtube">YouTube Shorts</option>
              <option value="tiktok">TikTok</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Duration</label>
            <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className={selectCls}>
              <option value={10}>10 Seconds</option>
              <option value={15}>15 Seconds</option>
              <option value={20}>20 Seconds</option>
              <option value={30}>30 Seconds</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className={selectCls}>
              <option value="Hinglish">Hinglish</option>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Voice Tone</label>
            <select value={tone} onChange={(e) => setTone(e.target.value)} className={selectCls}>
              <option value="energetic">Energetic &amp; Viral</option>
              <option value="luxurious">Luxurious &amp; Premium</option>
              <option value="inspiring">Inspiring &amp; Motivational</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual &amp; Chill</option>
            </select>
          </div>
        </div>

        {/* Campaign Objective Pills */}
        <div>
          <label className={labelCls}>Campaign Objective</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {OBJECTIVES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setObjective(value)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-semibold text-left transition-all cursor-pointer ${
                  objective === value
                    ? "border-brand-purple bg-brand-purple/20 text-brand-purple shadow-sm ring-1 ring-brand-purple/40"
                    : "border-border bg-[#0a142c] text-text-muted hover:border-brand-purple/50 hover:bg-brand-purple/10"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Offer / Promo input */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Offer / Promo Callout (Optional)</label>
            <input
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              placeholder="e.g. 50% Off this weekend • Limited Drop"
              className="w-full rounded-xl border border-border bg-[#0a142c] p-3 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all font-medium text-white text-sm placeholder:text-text-muted"
            />
          </div>

          <div>
            <label className={labelCls}>Additional Directives (Optional)</label>
            <input
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="e.g. Include high-bass energetic beat drop"
              className="w-full rounded-xl border border-border bg-[#0a142c] p-3 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all font-medium text-white text-sm placeholder:text-text-muted"
            />
          </div>
        </div>
      </div>

      {/* Primary Submit Button */}
      <div className="px-6 pb-6 pt-2">
        <button
          type="button"
          disabled={isLoading}
          onClick={handleGenerate}
          className="w-full rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 px-6 py-4 font-black text-white shadow-xl shadow-purple-600/30 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer text-base tracking-wide"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating AI Reel with Google Veo &amp; Gemini...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 text-amber-300 animate-pulse shrink-0" />
              <span className="truncate">
                {studioMode === "prompt" 
                  ? "Generate Reel with Google Veo 3.1" 
                  : `Generate AI Reel for ${effectiveProd?.name || "Product"}`}
              </span>
              <span className="ml-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-black/35 text-amber-300 border border-amber-300/30 shrink-0">
                ⚡ 10 Credits
              </span>
            </>
          )}
        </button>
        <p className="text-[11px] text-center text-text-muted mt-2 font-medium">
          Generating 1 Reel deducts 10 credits and updates your Credit History in real-time.
        </p>
      </div>
    </div>
  );
}
