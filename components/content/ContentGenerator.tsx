"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Loader2, 
  Sparkles, 
  Wand2, 
  ChevronDown, 
  Share2, 
  Globe, 
  Smile, 
  Package, 
  Users, 
  FileText, 
  Target, 
  MousePointerClick, 
  MessageSquare,
  Sliders,
  Flame,
  Zap,
  ShoppingBag,
  Upload,
  X,
  RefreshCw,
  Image as ImageIcon,
  Tag,
  Check,
  CheckCircle2,
  AlertCircle,
  Film,
  Megaphone,
  Layers,
  IndianRupee,
  Plus
} from 'lucide-react';
import { GenerateContentRequest } from '@/types/content';
import { getProducts } from '@/services/product.service';
import { BrandKitToggleCard } from '@/components/brand/BrandKitToggleCard';
import { BrandKit } from '@/types/brand';
import api from '@/lib/api';

interface ContentGeneratorProps {
  initialType?: string;
  initialProductId?: string;
  onGenerate: (data: GenerateContentRequest) => Promise<void>;
  isLoading: boolean;
}

interface ContentTypeItem {
  id: string;
  label: string;
  category: 'social' | 'caption' | 'ad' | 'promo' | 'reel';
  icon: any;
  defaultPlatform: string;
  desc: string;
}

const CONTENT_TYPES: ContentTypeItem[] = [
  // Social Posts
  { id: "Instagram Post", label: "Instagram Post", category: "social", icon: Share2, defaultPlatform: "Instagram", desc: "Engaging visual post with hook & copy" },
  { id: "Facebook Post", label: "Facebook Post", category: "social", icon: Share2, defaultPlatform: "Facebook", desc: "Community-driven high engagement post" },
  { id: "LinkedIn Post", label: "LinkedIn Post", category: "social", icon: Share2, defaultPlatform: "LinkedIn", desc: "Thought leadership & business post" },
  // Captions
  { id: "Instagram Caption", label: "Instagram Caption", category: "caption", icon: FileText, defaultPlatform: "Instagram", desc: "Catchy caption with emojis & hashtags" },
  { id: "Ad Copy", label: "Short & Punchy Copy", category: "caption", icon: Zap, defaultPlatform: "Instagram", desc: "High conversion micro-copy" },
  // Advertisements
  { id: "Product Advertisement", label: "Product Advertisement", category: "ad", icon: Megaphone, defaultPlatform: "Instagram", desc: "Conversion-optimized commercial ad copy" },
  // Promotional
  { id: "Promotional Content", label: "Promotional Content", category: "promo", icon: Tag, defaultPlatform: "Instagram", desc: "Flash sale, offer & discount launch" },
  { id: "Festival Post", label: "Festival Post", category: "promo", icon: Sparkles, defaultPlatform: "Instagram", desc: "Cultural festive greeting & holiday special" },
  // Reels
  { id: "Reel Script", label: "Reel / Video Script", category: "reel", icon: Film, defaultPlatform: "Instagram", desc: "Multi-scene script with hook, visual cue & CTA" },
];

const CAMPAIGN_OBJECTIVES = [
  { value: "product_promotion", label: "Product Promotion", desc: "Showcase product traits & premium quality" },
  { value: "sales_conversion", label: "Flash Sale / Offer", desc: "Urgency, discount pricing & limited stock" },
  { value: "brand_awareness", label: "Brand Awareness", desc: "Story, craft, trustworthiness & reputation" },
  { value: "festival_special", label: "Festival Special", desc: "Cultural celebration & festive greetings" },
  { value: "new_arrival", label: "New Arrival Launch", desc: "Fresh seasonal drop & early bird access" },
];

const QUICK_FEATURE_SUGGESTIONS = [
  "100% Pure & Authentic",
  "Handcrafted with Care",
  "Premium Luxury Feel",
  "Limited Festive Edition",
  "Free Express Shipping",
  "Eco-Friendly Materials",
  "Easy 7-Day Exchange"
];

const QUICK_AUDIENCES = [
  "Festive & Wedding Shoppers",
  "Young Working Professionals",
  "Luxury Fashion Lovers",
  "Students & Gen-Z Trendsetters",
  "Families & Homemakers"
];

const QUICK_CTAS = [
  "Shop now link in bio",
  "DM us 'ORDER' to buy",
  "Limited stock — tap link",
  "Claim your exclusive 20% off",
  "Comment YES for pricing details"
];

const MANUAL_TONES = [
  "Professional",
  "Friendly",
  "Luxury & Premium",
  "Urgent & Direct",
  "Emotional & Warm",
  "Funny & Relatable",
  "Storytelling"
];

export function ContentGenerator({ initialType, initialProductId, onGenerate, isLoading }: ContentGeneratorProps) {
  // Brand Kit State
  const [useBrandKit, setUseBrandKit] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("su_content_use_brand_kit");
      return stored !== "false";
    }
    return true;
  });
  const [loadedBrandKit, setLoadedBrandKit] = useState<BrandKit | null>(null);
  const [isBrandKitComplete, setIsBrandKitComplete] = useState<boolean>(false);

  // Content Selection
  const [selectedType, setSelectedType] = useState<string>(initialType || "Instagram Post");
  const [platform, setPlatform] = useState<string>("Instagram");
  const [language, setLanguage] = useState<string>("English");
  const [manualTone, setManualTone] = useState<string>("Professional");

  // Product Fields
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [price, setPrice] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [campaignObjective, setCampaignObjective] = useState("product_promotion");
  const [callToAction, setCallToAction] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");

  // Product Image Uploads
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);

  // Product Catalog Integration
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>(initialProductId || "");
  const [showCatalogSelector, setShowCatalogSelector] = useState(false);

  // Form Validation & Feedback
  const [validationError, setValidationError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  // Load existing products from catalog
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        if (data && data.length > 0) {
          setProducts(data);
          if (initialProductId) {
            const found = data.find((p: any) => p.id === initialProductId);
            if (found) {
              setProductName(found.name || "");
              setProductDescription(found.description || "");
              if (found.price) setPrice(String(found.price));
              if (found.images && found.images.length > 0) {
                setUploadedImages(found.images);
              }
            }
          }
        }
      } catch (err) {
        console.warn("Catalog fetch fallback", err);
      }
    }
    loadProducts();
  }, [initialProductId]);

  const handleToggleBrandKit = (enabled: boolean) => {
    setUseBrandKit(enabled);
    if (typeof window !== "undefined") {
      localStorage.setItem("su_content_use_brand_kit", enabled ? "true" : "false");
    }
  };

  const handleCatalogSelect = (productId: string) => {
    setSelectedCatalogId(productId);
    const prod = products.find(p => p.id === productId);
    if (prod) {
      setProductName(prod.name || "");
      if (prod.description) setProductDescription(prod.description);
      if (prod.price) setPrice(String(prod.price));
      if (prod.images && prod.images.length > 0) {
        setUploadedImages(prod.images.slice(0, 4));
      }
      setValidationError(null);
    }
  };

  // Image Upload Handling (supports both direct API upload and local preview fallback)
  const processFiles = async (files: File[]) => {
    if (files.length === 0) return;
    if (uploadedImages.length + files.length > 4) {
      alert("You can upload a maximum of 4 product images.");
      return;
    }

    setIsUploading(true);
    setValidationError(null);

    const newUrls: string[] = [];

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post("/api/v1/fashion/products/upload-image", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        if (response.data?.success && response.data?.image_url) {
          newUrls.push(response.data.image_url);
        } else {
          // Local fallback preview URL
          newUrls.push(URL.createObjectURL(file));
        }
      } catch (err) {
        console.warn("Upload API fallback to local URL preview", err);
        newUrls.push(URL.createObjectURL(file));
      }
    }

    setUploadedImages(prev => [...prev, ...newUrls]);
    setIsUploading(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const startReplaceImage = (index: number) => {
    setReplaceIndex(index);
    replaceInputRef.current?.click();
  };

  const handleReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || replaceIndex === null) return;
    const file = e.target.files[0];
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/api/v1/fashion/products/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const url = response.data?.image_url || URL.createObjectURL(file);
      setUploadedImages(prev => {
        const next = [...prev];
        next[replaceIndex] = url;
        return next;
      });
    } catch {
      const fallbackUrl = URL.createObjectURL(file);
      setUploadedImages(prev => {
        const next = [...prev];
        next[replaceIndex] = fallbackUrl;
        return next;
      });
    } finally {
      setIsUploading(false);
      setReplaceIndex(null);
      e.target.value = "";
    }
  };

  const handleAddFeatureChip = (chip: string) => {
    if (features.includes(chip)) return;
    setFeatures(prev => (prev ? `${prev} • ${chip}` : chip));
  };

  const handleAddAudienceChip = (chip: string) => {
    if (targetAudience.includes(chip)) return;
    setTargetAudience(prev => (prev ? `${prev}, ${chip}` : chip));
  };

  // Submission validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Ensure user provided either a product name, description, or at least one image
    if (!productName.trim() && !productDescription.trim() && uploadedImages.length === 0) {
      setValidationError("Please provide a Product Name, Description, or upload at least one product photo.");
      return;
    }

    const payload: GenerateContentRequest = {
      type: selectedType,
      platform,
      language,
      tone: useBrandKit && loadedBrandKit?.tone ? loadedBrandKit.tone : manualTone,
      productId: selectedCatalogId || undefined,
      productName: productName.trim() || undefined,
      productDescription: productDescription.trim() || undefined,
      features: features.trim() || undefined,
      price: price.trim() || undefined,
      targetAudience: targetAudience.trim() || undefined,
      campaignObjective,
      productImages: uploadedImages,
      callToAction: callToAction.trim() || undefined,
      additionalInstructions: additionalInstructions.trim() || undefined,
      // Brand Kit parameters
      use_brand_kit: useBrandKit && isBrandKitComplete,
      brand_kit_id: (useBrandKit && loadedBrandKit) ? loadedBrandKit.id : undefined,
      brand_name: (useBrandKit && loadedBrandKit) ? loadedBrandKit.business_name : undefined,
      brand_colors: (useBrandKit && loadedBrandKit) ? {
        primary: loadedBrandKit.primary_color,
        secondary: loadedBrandKit.secondary_color,
        accent: loadedBrandKit.accent_color,
      } : undefined,
      brand_font: (useBrandKit && loadedBrandKit) ? loadedBrandKit.font : undefined,
      brand_tone: (useBrandKit && loadedBrandKit) ? loadedBrandKit.tone : undefined,
      logo_url: (useBrandKit && loadedBrandKit?.logo_url) ? loadedBrandKit.logo_url : undefined,
      include_logo: Boolean(useBrandKit && loadedBrandKit?.logo_url),
    };

    await onGenerate(payload);
  };

  return (
    <Card className="border border-border/80 bg-surface/90 backdrop-blur-xl shadow-2xl rounded-2xl relative overflow-hidden transition-all">
      <CardHeader className="pb-4 border-b border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-purple/20 flex items-center justify-center text-brand-purple border border-brand-purple/30 shadow-inner shrink-0">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Product-Based AI Studio
              </CardTitle>
              <CardDescription className="text-xs text-text-muted mt-0.5">
                Generate high-converting posts, captions, ads &amp; reels from your product details.
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-semibold self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>AI Copywriter &amp; Visuals</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5 space-y-6">
        
        {/* Prominent Use My Brand Kit Toggle */}
        <BrandKitToggleCard
          enabled={useBrandKit}
          onChange={handleToggleBrandKit}
          onBrandKitLoaded={(brand, complete) => {
            setLoadedBrandKit(brand);
            setIsBrandKitComplete(complete);
          }}
          title="Use My Brand Kit"
          description="Automatically infuse your brand's colors, typography, logo, and brand tone into this content."
        />

        {/* Validation Warning Alert */}
        {validationError && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span className="font-semibold">{validationError}</span>
            </div>
            <button
              type="button"
              onClick={() => setValidationError(null)}
              className="text-amber-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* ══════════════════════════════════════════
              SECTION 1: Product Photos & Uploads
             ══════════════════════════════════════════ */}
          <div className="space-y-3.5 rounded-2xl bg-[#091226] border border-border/80 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <Label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-purple/20 text-brand-purple text-xs font-bold flex items-center justify-center">1</span>
                  Product Photos (Up to 4)
                </Label>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Drag &amp; drop product photos or select from your catalog. Vision models analyze color, cut &amp; style.
                </p>
              </div>

              {products.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowCatalogSelector(!showCatalogSelector)}
                  className="text-xs font-semibold text-brand-purple hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>{showCatalogSelector ? "Hide Catalog" : "Pick from Catalog"}</span>
                </button>
              )}
            </div>

            {/* Catalog Selector Dropdown */}
            {showCatalogSelector && products.length > 0 && (
              <div className="p-3 rounded-xl bg-surface border border-border space-y-2 animate-in fade-in duration-200">
                <span className="text-xs font-semibold text-white block">Select a saved product:</span>
                <select
                  value={selectedCatalogId}
                  onChange={(e) => handleCatalogSelect(e.target.value)}
                  className="w-full bg-[#0a142c] border border-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-purple cursor-pointer"
                >
                  <option value="">-- Choose from your catalog --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.price ? `(₹${p.price})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Hidden File Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
            />
            <input
              ref={replaceInputRef}
              type="file"
              accept="image/*"
              onChange={handleReplaceFile}
              className="hidden"
            />

            {/* Drag & Drop Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => {
                if (uploadedImages.length < 4) fileInputRef.current?.click();
              }}
              className={`rounded-xl border-2 border-dashed p-4 sm:p-5 text-center transition-all cursor-pointer ${
                isDragging
                  ? "border-brand-purple bg-brand-purple/10"
                  : "border-border/80 hover:border-brand-purple/50 bg-[#060d1d]/80 hover:bg-[#060d1d]"
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-brand-purple/15 flex items-center justify-center text-brand-purple">
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-white">
                    {isUploading ? "Uploading photos..." : "Click or drag & drop product photos here"}
                  </p>
                  <p className="text-[11px] text-text-muted">
                    Supports JPG, PNG, WEBP (Max 4 images • {uploadedImages.length}/4 added)
                  </p>
                </div>
              </div>
            </div>

            {/* Uploaded Images Thumbnails Grid */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {uploadedImages.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden bg-black/50 border border-border group shadow-sm"
                  >
                    <img
                      src={url}
                      alt={`Product photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Primary Badge */}
                    {idx === 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-brand-purple text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                        MAIN
                      </span>
                    )}

                    {/* Hover Overlay Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          startReplaceImage(idx);
                        }}
                        title="Replace this image"
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(idx);
                        }}
                        title="Remove image"
                        className="p-1.5 rounded-lg bg-rose-500/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════
              SECTION 2: Product Information
             ══════════════════════════════════════════ */}
          <div className="space-y-4 rounded-2xl bg-[#091226] border border-border/80 p-4 sm:p-5">
            <Label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-purple/20 text-brand-purple text-xs font-bold flex items-center justify-center">2</span>
              Product Details &amp; Highlights
            </Label>

            {/* Product Name & Price Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="prodName" className="text-xs font-semibold text-slate-200">
                  Product Name <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="prodName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Royal Kanjivaram Silk Saree"
                  className="h-10 rounded-xl bg-surface border-border text-white text-xs placeholder:text-text-muted/60 focus:border-brand-purple"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prodPrice" className="text-xs font-semibold text-slate-200">
                  Price / Discounted Price <span className="text-text-muted font-normal">(Optional)</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs font-semibold">₹</span>
                  <Input
                    id="prodPrice"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="4,999"
                    className="h-10 pl-7 rounded-xl bg-surface border-border text-white text-xs placeholder:text-text-muted/60 focus:border-brand-purple"
                  />
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="prodDesc" className="text-xs font-semibold text-slate-200">
                  Product Description
                </Label>
                <span className="text-[10px] text-text-muted font-mono">{productDescription.length}/400 chars</span>
              </div>
              <textarea
                id="prodDesc"
                rows={3}
                maxLength={400}
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="e.g. Traditional pure silk saree woven with intricate golden zari motifs and regal contrast pallu, perfect for grand weddings and festivals."
                className="w-full rounded-xl border border-border bg-surface p-3 text-xs text-white placeholder:text-text-muted/60 focus:outline-none focus:border-brand-purple leading-relaxed"
              />
            </div>

            {/* Features / Key Selling Points */}
            <div className="space-y-1.5">
              <Label htmlFor="prodFeatures" className="text-xs font-semibold text-slate-200">
                Key Features / Bullet Points <span className="text-text-muted font-normal">(Optional)</span>
              </Label>
              <Input
                id="prodFeatures"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                placeholder="e.g. 100% Pure Mulberry Silk • Zari Woven Border • Lightweight Festive Drape • Unstitched Blouse Piece"
                className="h-10 rounded-xl bg-surface border-border text-white text-xs placeholder:text-text-muted/60 focus:border-brand-purple"
              />
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-text-muted">Suggestions:</span>
                {QUICK_FEATURE_SUGGESTIONS.map((feat) => (
                  <button
                    key={feat}
                    type="button"
                    onClick={() => handleAddFeatureChip(feat)}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border/80 text-text-muted hover:text-white hover:border-brand-purple transition-colors cursor-pointer"
                  >
                    + {feat}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Audience & Campaign Objective */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="space-y-1.5">
                <Label htmlFor="prodAudience" className="text-xs font-semibold text-slate-200">
                  Target Audience <span className="text-text-muted font-normal">(Optional)</span>
                </Label>
                <Input
                  id="prodAudience"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Brides &amp; wedding shoppers in India"
                  className="h-10 rounded-xl bg-surface border-border text-white text-xs placeholder:text-text-muted/60 focus:border-brand-purple"
                />
                <div className="flex flex-wrap gap-1 pt-1">
                  {QUICK_AUDIENCES.map((aud) => (
                    <button
                      key={aud}
                      type="button"
                      onClick={() => handleAddAudienceChip(aud)}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border/80 text-text-muted hover:text-white hover:border-brand-purple transition-colors cursor-pointer"
                    >
                      + {aud}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="campaignObj" className="text-xs font-semibold text-slate-200">
                  Campaign Objective
                </Label>
                <div className="relative">
                  <select
                    id="campaignObj"
                    value={campaignObjective}
                    onChange={(e) => setCampaignObjective(e.target.value)}
                    className="w-full h-10 appearance-none rounded-xl border border-border bg-surface px-3 text-xs text-white focus:outline-none focus:border-brand-purple cursor-pointer pr-8"
                  >
                    {CAMPAIGN_OBJECTIVES.map((obj) => (
                      <option key={obj.value} value={obj.value}>
                        {obj.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════
              SECTION 3: Content Type Selection
             ══════════════════════════════════════════ */}
          <div className="space-y-3 rounded-2xl bg-[#091226] border border-border/80 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-purple/20 text-brand-purple text-xs font-bold flex items-center justify-center">3</span>
                Select Content Type
              </Label>
              <span className="text-[11px] text-text-muted">Choose your desired output format</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {CONTENT_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      setSelectedType(type.id);
                      setPlatform(type.defaultPlatform);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                      isSelected
                        ? "bg-brand-purple/15 border-brand-purple ring-1 ring-brand-purple"
                        : "bg-surface border-border hover:border-border/80"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isSelected ? "bg-brand-purple text-white" : "bg-white/5 text-text-muted group-hover:text-white"
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-brand-purple" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white tracking-tight">{type.label}</h4>
                      <p className="text-[10px] text-text-muted leading-tight mt-0.5 line-clamp-1">{type.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ══════════════════════════════════════════
              SECTION 4: Platform, Language & Tone
             ══════════════════════════════════════════ */}
          <div className="space-y-4 rounded-2xl bg-[#091226] border border-border/80 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-purple/20 text-brand-purple text-xs font-bold flex items-center justify-center">4</span>
                Platform &amp; Language Options
              </Label>
              {useBrandKit && isBrandKitComplete && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Brand Voice Applied
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Target Platform */}
              <div className="space-y-1.5">
                <Label htmlFor="platformSelect" className="text-xs font-semibold text-slate-200">
                  Target Social Platform
                </Label>
                <select
                  id="platformSelect"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border bg-surface px-3 text-xs text-white focus:outline-none focus:border-brand-purple cursor-pointer"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="YouTube">YouTube</option>
                </select>
              </div>

              {/* Copywriting Language */}
              <div className="space-y-1.5">
                <Label htmlFor="languageSelect" className="text-xs font-semibold text-slate-200">
                  Copywriting Language
                </Label>
                <select
                  id="languageSelect"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border bg-surface px-3 text-xs text-white focus:outline-none focus:border-brand-purple cursor-pointer"
                >
                  <option value="English">English (Global Luxury &amp; Professional)</option>
                  <option value="Hinglish">🇮🇳 Hinglish (Most Popular for Conversions)</option>
                  <option value="Hindi">हिंदी (Hindi)</option>
                  <option value="Gujarati">ગુજરાતી (Gujarati)</option>
                  <option value="Marathi">मराठी (Marathi)</option>
                  <option value="Punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
                  <option value="Tamil">தமிழ் (Tamil)</option>
                  <option value="Telugu">తెలుగు (Telugu)</option>
                  <option value="Bengali">বাংলা (Bengali)</option>
                </select>
              </div>
            </div>

            {/* Manual Tone Selection when Brand Kit is OFF */}
            {!useBrandKit && (
              <div className="pt-2 border-t border-border/50 space-y-2 animate-in fade-in">
                <Label className="text-xs font-semibold text-slate-200">Brand Voice &amp; Tone (Manual)</Label>
                <div className="flex flex-wrap gap-1.5">
                  {MANUAL_TONES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setManualTone(t)}
                      className={`text-xs px-2.5 py-1 rounded-xl border font-medium transition-all cursor-pointer ${
                        manualTone === t
                          ? "bg-brand-purple/20 border-brand-purple text-white ring-1 ring-brand-purple"
                          : "bg-surface border-border text-text-muted hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Call To Action */}
            <div className="space-y-1.5 pt-1">
              <Label htmlFor="ctaInput" className="text-xs font-semibold text-slate-200">
                Call to Action (CTA) <span className="text-text-muted font-normal">(Optional)</span>
              </Label>
              <Input
                id="ctaInput"
                value={callToAction}
                onChange={(e) => setCallToAction(e.target.value)}
                placeholder="e.g. Shop now link in bio"
                className="h-10 rounded-xl bg-surface border-border text-white text-xs placeholder:text-text-muted/60 focus:border-brand-purple"
              />
              <div className="flex flex-wrap gap-1 pt-1">
                {QUICK_CTAS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCallToAction(c)}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border/80 text-text-muted hover:text-white hover:border-brand-purple transition-colors cursor-pointer"
                  >
                    + {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Custom Instructions */}
            <div className="space-y-1.5 pt-1">
              <Label htmlFor="addInst" className="text-xs font-semibold text-slate-200">
                Additional Custom Instructions <span className="text-text-muted font-normal">(Optional)</span>
              </Label>
              <textarea
                id="addInst"
                rows={2}
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                placeholder="Any special offers, hashtags, emojis, or styling nuances you want AI to include?"
                className="w-full rounded-xl border border-border bg-surface p-2.5 text-xs text-white placeholder:text-text-muted/60 focus:outline-none focus:border-brand-purple leading-relaxed"
              />
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading || (!productName.trim() && !productDescription.trim() && uploadedImages.length === 0)}
              className="w-full h-13 bg-brand-gradient hover:opacity-95 text-white font-bold text-sm rounded-xl shadow-xl shadow-brand-purple/20 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                  Generating AI Content &amp; Visuals...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4 text-white animate-pulse" />
                  Generate {selectedType}
                  <span className="text-xs font-normal opacity-80 ml-1">
                    ({useBrandKit && isBrandKitComplete ? "With Brand Kit" : "Standard"})
                  </span>
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
