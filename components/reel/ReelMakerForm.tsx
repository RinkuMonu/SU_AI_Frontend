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
  Package
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
];

const OBJECTIVES = [
  { value: "sale", label: "🛍️ Sale" },
  { value: "product_launch", label: "🚀 Product Launch" },
  { value: "festival", label: "🎉 Festival" },
  { value: "brand_awareness", label: "📣 Brand Awareness" },
  { value: "offer", label: "🎁 Offer" },
  { value: "testimonial", label: "⭐ Testimonial" },
  { value: "educational", label: "📚 Educational" },
  { value: "before_after", label: "✨ Before/After" },
];

export function ReelMakerForm({ onGenerate, isLoading }: ReelMakerFormProps) {
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
        // Fallback to presets silently
        console.log("Using preset products for reels studio");
      }
    }
    loadProducts();
  }, []);

  // Find currently selected product item
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
    const prod = getEffectiveProduct();
    if (productMode === "custom" && !customName.trim()) {
      alert("Please enter a product name for your reel.");
      return;
    }

    onGenerate({
      product_id: prod.id,
      product_name: prod.name,
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
    <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
      {/* Form header */}
      <div className="px-6 py-5 border-b border-border bg-[#0a142c]/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-purple" />
            Reel Configuration
          </h2>
          <p className="text-sm text-text-muted mt-0.5">
            Select your product and customize details to generate a unique AI reel
          </p>
        </div>
        {effectiveProd && (
          <div className="flex items-center gap-2 bg-brand-purple/10 border border-brand-purple/30 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">Target:</span>
            <span className="text-xs font-semibold text-white truncate max-w-[150px] sm:max-w-[180px]">
              {effectiveProd.name}
            </span>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* PRODUCT SELECTION SECTION */}
        <div className="rounded-2xl border border-border/80 bg-[#070e1e]/60 p-5 space-y-4">
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

            {/* Mode Toggle */}
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

              {/* Quick Preset Chips for 1-click auto-fill */}
              <div>
                <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">
                  Quick Fill Suggestions:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: "Bridal Silk Lehenga", cat: "Ethnic Fashion", desc: "Hand-embroidered bridal lehenga with royal zari work" },
                    { name: "Wireless Gaming Mouse", cat: "Electronics", desc: "Ultra-low latency RGB wireless gaming mouse with 26k DPI" },
                    { name: "Handcrafted Leather Wallet", cat: "Accessories", desc: "Genuine top-grain RFID blocking minimalist leather wallet" },
                    { name: "Matcha Green Tea Powder", cat: "Health & Wellness", desc: "Ceremonial grade pure Japanese organic antioxidant matcha" },
                    { name: "Waterproof Smart Fitness Band", cat: "Wearables", desc: "Heart rate, step counter, sleep tracker with AMOLED screen" },
                  ].map((s) => (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => {
                        setCustomName(s.name);
                        setCustomCategory(s.cat);
                        setCustomDescription(s.desc);
                      }}
                      className="px-2.5 py-1 rounded-lg border border-border bg-[#0a142c] text-xs font-medium text-text-muted hover:text-white hover:border-brand-purple transition-all cursor-pointer"
                    >
                      {s.name}
                    </button>
                  ))}
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

        {/* Platform + Duration row */}
        <div className="grid grid-cols-2 gap-4">
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
        </div>

        {/* Language + Tone row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className={selectCls}>
              <option>English</option>
              <option>Hindi</option>
              <option>Hinglish</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Tone</label>
            <select value={tone} onChange={(e) => setTone(e.target.value)} className={selectCls}>
              <option value="energetic">Energetic</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="funny">Funny</option>
            </select>
          </div>
        </div>

        {/* Objective pills */}
        <div>
          <label className={labelCls}>Objective</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {OBJECTIVES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setObjective(value)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-semibold text-left transition-all cursor-pointer ${
                  objective === value
                    ? "border-brand-purple bg-brand-purple/20 text-brand-purple shadow-sm"
                    : "border-border bg-[#0a142c] text-text-muted hover:border-brand-purple/50 hover:bg-brand-purple/10"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Offer */}
        <div>
          <label className={labelCls}>Offer / Promo (Optional)</label>
          <input
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            placeholder="e.g. 50% Off this weekend"
            className="w-full rounded-xl border border-border bg-[#0a142c] p-3 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all font-medium text-white text-sm placeholder:text-text-muted"
          />
        </div>

        {/* Instructions */}
        <div>
          <label className={labelCls}>Additional Instructions (Optional)</label>
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Any specific requests or hook for the video?"
            rows={3}
            className="w-full rounded-xl border border-border bg-[#0a142c] p-3 focus:border-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all font-medium text-white text-sm resize-none placeholder:text-text-muted"
          />
        </div>
      </div>

      {/* Submit button */}
      <div className="px-6 pb-6">
        <button
          type="button"
          disabled={isLoading}
          onClick={handleGenerate}
          className="w-full rounded-2xl bg-brand-gradient px-6 py-4 font-bold text-white shadow-lg shadow-purple-500/20 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-base"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Unique AI Reel...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate AI Reel for {effectiveProd?.name || "Product"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

