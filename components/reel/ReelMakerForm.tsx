"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { GenerateReelRequest } from "@/types/reel";
import { FashionService } from "@/services/fashion.service";
import { imageService } from "@/services/image.service";
import { reelService, CategoryItem } from "@/services/reel.service";
import { useTheme } from "@/components/theme/ThemeProvider";
import { 
  Sparkles, 
  UploadCloud, 
  X, 
  Check, 
  ShoppingBag, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Music, 
  Mic, 
  FileAudio, 
  Search, 
  RefreshCw, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Shirt, 
  Smartphone, 
  Square, 
  Monitor, 
  Wand2, 
  Image as ImageIcon,
  CheckCircle2,
  Tag,
  Info,
  Clock,
  Layers,
  ArrowRight
} from "lucide-react";

interface ReelMakerFormProps {
  onGenerate: (request: GenerateReelRequest) => void;
  isLoading: boolean;
}

interface ProductItem {
  id: string;
  name: string;
  category?: string;
  subcategory?: string;
  productType?: string;
  description?: string;
  price?: string | number;
  image_url?: string;
  isCustom?: boolean;
  isUserProduct?: boolean;
}

interface TaxonomyCategory {
  id: string;
  name: string;
  icon: string;
  subcategories: {
    id: string;
    name: string;
    productTypes: string[];
  }[];
}

const DEFAULT_TAXONOMY: TaxonomyCategory[] = [
  {
    id: "fashion_clothing",
    name: "Clothing",
    icon: "👕",
    subcategories: [
      {
        id: "men",
        name: "Men",
        productTypes: ["T-Shirt", "Shirt", "Jeans", "Jacket", "Hoodie", "Kurti", "Blazer", "Trousers", "Tracksuit"],
      },
      {
        id: "women",
        name: "Women",
        productTypes: ["Saree", "Kurti", "Dress", "Top", "Lehenga", "Jeans", "Jacket", "Skirt", "Gown"],
      },
      {
        id: "kids",
        name: "Kids",
        productTypes: ["T-Shirt", "Dress", "Shorts", "Nightwear", "Romper", "Ethnic Set"],
      },
    ],
  },
  {
    id: "furniture_home",
    name: "Furniture & Home",
    icon: "🛋️",
    subcategories: [
      {
        id: "living_room",
        name: "Living Room",
        productTypes: ["Sofa", "Recliner", "Lounge Chair", "Coffee Table", "TV Unit", "Bookshelf"],
      },
      {
        id: "bedroom",
        name: "Bedroom",
        productTypes: ["Bed", "Wardrobe", "Mattress", "Dressing Table", "Nightstand"],
      },
      {
        id: "dining_room",
        name: "Dining Room",
        productTypes: ["Dining Table", "Dining Chair", "Bar Stool", "Crockery Unit"],
      },
    ],
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: "📱",
    subcategories: [
      {
        id: "mobile_audio",
        name: "Mobile & Audio",
        productTypes: ["Smartphone", "Wireless Earbuds", "Headphones", "Smartwatch", "Bluetooth Speaker"],
      },
      {
        id: "computers",
        name: "Computers",
        productTypes: ["Laptop", "Tablet", "Gaming PC", "Monitor", "Mechanical Keyboard"],
      },
      {
        id: "appliances",
        name: "Home Appliances",
        productTypes: ["Smart TV", "Air Conditioner", "Air Fryer", "Microwave", "Refrigerator"],
      },
    ],
  },
  {
    id: "beauty_personal_care",
    name: "Beauty & Skincare",
    icon: "💄",
    subcategories: [
      {
        id: "skincare",
        name: "Skincare",
        productTypes: ["Face Serum", "Face Wash", "Moisturizer", "Sunscreen", "Night Cream", "Face Mask"],
      },
      {
        id: "makeup",
        name: "Makeup",
        productTypes: ["Matte Lipstick", "Liquid Foundation", "Eyeliner & Kajal", "Compact Powder", "Blush"],
      },
      {
        id: "haircare",
        name: "Haircare",
        productTypes: ["Organic Shampoo", "Hair Growth Oil", "Hair Conditioner", "Hair Serum"],
      },
    ],
  },
  {
    id: "food_beverages",
    name: "Food & Dining",
    icon: "🍔",
    subcategories: [
      {
        id: "restaurant",
        name: "Restaurant Dishes",
        productTypes: ["Biryani", "Woodfire Pizza", "Smash Burger", "Royal Thali", "Artisan Dessert"],
      },
      {
        id: "packaged",
        name: "Packaged & Bakery",
        productTypes: ["Roasted Coffee Beans", "Artisan Tea", "Handcrafted Cookies", "Gourmet Chocolates"],
      },
    ],
  },
  {
    id: "jewellery_luxury",
    name: "Jewellery & Luxury",
    icon: "💎",
    subcategories: [
      {
        id: "precious",
        name: "Precious Jewellery",
        productTypes: ["Polki Choker", "Diamond Ring", "Gold Earrings", "Kundan Bangles", "Pendant"],
      },
      {
        id: "fashion_jewel",
        name: "Fashion Accessories",
        productTypes: ["Layered Necklace", "Silver Anklet", "Statement Bracelet", "Luxury Watch"],
      },
    ],
  },
];

const QUICK_TAGS = ["T-Shirt", "Shirt", "Jeans", "Kurti", "Saree", "Jacket", "Sofa", "Earbuds", "Serum", "Watch"];

const DEFAULT_SAMPLE_IMAGE = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80";

const CAMPAIGN_OBJECTIVES = [
  { value: "product_launch", label: "Product Launch", desc: "Introduce product with compelling hook & confirmed features" },
  { value: "flash_sale", label: "Flash Sale", desc: "Urgent limited-time pricing and call to action" },
  { value: "festival", label: "Festival Special", desc: "Festive mood, cultural resonance and festive gifting" },
  { value: "brand_story", label: "Brand Story", desc: "Focus on craftsmanship, brand values and quality" },
  { value: "how_it_works", label: "How It Works", desc: "Step-by-step product walkthrough and practical utility" },
  { value: "customer_spotlight", label: "Customer Spotlight", desc: "Social proof, reviews and buyer satisfaction" },
  { value: "product_showcase", label: "Product Showcase", desc: "Clean 360 aesthetic showcase with feature callouts" },
  { value: "new_arrival", label: "New Arrival", desc: "Exciting seasonal collection drop announcement" },
  { value: "educational", label: "Educational", desc: "Tips, tricks, styling hacks and problem solving" },
  { value: "offer_promotion", label: "Offer / Promotion", desc: "Discount bundles, freebies and special promo codes" },
  { value: "store_promotion", label: "Store Promotion", desc: "Drive local footfall and online store orders" },
  { value: "custom", label: "Custom", desc: "Tailored reel script configured via your prompt" },
];

const OFFER_OPTIONS = [
  { value: "none", label: "None" },
  { value: "10% Off", label: "10% Off" },
  { value: "15% Off", label: "15% Off" },
  { value: "20% Off", label: "20% Off" },
  { value: "25% Off", label: "25% Off" },
  { value: "30% Off", label: "30% Off" },
  { value: "50% Off", label: "50% Off" },
  { value: "Buy 1 Get 1 Free", label: "Buy 1 Get 1 Free (BOGO)" },
  { value: "Flat ₹500 Off", label: "Flat ₹500 Off" },
  { value: "Free Delivery", label: "Free Delivery" },
  { value: "custom", label: "Custom Discount..." },
];

const VOICE_TONES = [
  { value: "energetic", label: "Energetic", desc: "High energy, punchy, exciting pacing" },
  { value: "professional", label: "Professional", desc: "Polished, authoritative, business-like" },
  { value: "friendly", label: "Friendly", desc: "Warm, welcoming, relatable everyday tone" },
  { value: "premium", label: "Premium", desc: "Sophisticated, calm, luxury brand tone" },
  { value: "conversational", label: "Conversational", desc: "Casual friend-to-friend recommendation" },
  { value: "storytelling", label: "Storytelling", desc: "Narrative-driven, emotionally engaging" },
];

const MUSIC_OPTIONS = [
  { value: "bollywood", label: "Bollywood Trending" },
  { value: "cinematic", label: "Cinematic" },
  { value: "soft", label: "Soft Ambient" },
  { value: "corporate", label: "Corporate" },
  { value: "upbeat", label: "Upbeat" },
  { value: "festive", label: "Festive" },
  { value: "elegant", label: "Elegant" },
  { value: "energetic", label: "Energetic" },
  { value: "none", label: "No Music" },
];

export function ReelMakerForm({ onGenerate, isLoading }: ReelMakerFormProps) {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // ──────────────────────────────────────────────
  // STATE: Step 1 — Product & Category Selection
  // ──────────────────────────────────────────────
  const [taxonomy, setTaxonomy] = useState<TaxonomyCategory[]>(DEFAULT_TAXONOMY);
  const [selectedCategory, setSelectedCategory] = useState("fashion_clothing");
  const [selectedSubcategory, setSelectedSubcategory] = useState("men");
  const [selectedProductType, setSelectedProductType] = useState("T-Shirt");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [userProducts, setUserProducts] = useState<ProductItem[]>([]);
  const [selectedCatalogProduct, setSelectedCatalogProduct] = useState<ProductItem | null>(null);

  // ──────────────────────────────────────────────
  // STATE: Step 2 — Visual Mode (Image vs Text)
  // ──────────────────────────────────────────────
  const [visualMode, setVisualMode] = useState<"image" | "text">("image");
  const [uploadedImages, setUploadedImages] = useState<string[]>([DEFAULT_SAMPLE_IMAGE]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [enhanceWithAI, setEnhanceWithAI] = useState(false);
  const [enhancementPrompt, setEnhancementPrompt] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementMessage, setEnhancementMessage] = useState<string | null>(null);

  // Text-to-Image Generation
  const [textPrompt, setTextPrompt] = useState(
    "A premium cotton men's T-shirt, round neck, available in multiple colours, stylish and comfortable"
  );
  const [isGeneratingVisual, setIsGeneratingVisual] = useState(false);
  const [generatedVisualUrl, setGeneratedVisualUrl] = useState<string | null>(null);
  const [visualError, setVisualError] = useState<string | null>(null);

  // ──────────────────────────────────────────────
  // STATE: Step 3 — Campaign Details
  // ──────────────────────────────────────────────
  const [campaignObjective, setCampaignObjective] = useState("product_launch");
  const [offerDiscount, setOfferDiscount] = useState("20% Off");
  const [customDiscountText, setCustomDiscountText] = useState("");
  const [additionalMessage, setAdditionalMessage] = useState("Limited time offer! Free Delivery");
  const [showAdvancedOffer, setShowAdvancedOffer] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [offerStartDate, setOfferStartDate] = useState("");
  const [offerEndDate, setOfferEndDate] = useState("");
  const [offerTerms, setOfferTerms] = useState("");

  // ──────────────────────────────────────────────
  // STATE: Step 4 — Reel Settings
  // ──────────────────────────────────────────────
  const [language, setLanguage] = useState("English");
  const [duration, setDuration] = useState(30);
  const [platform, setPlatform] = useState("instagram");
  const [voiceoverMode, setVoiceoverMode] = useState<"ai" | "upload" | "none">("ai");
  const [voiceTone, setVoiceTone] = useState("energetic");
  const [voiceLanguage, setVoiceLanguage] = useState("English");
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState<string | null>(null);
  const [uploadedAudioName, setUploadedAudioName] = useState<string | null>(null);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [backgroundMusic, setBackgroundMusic] = useState("bollywood");
  const [autoCaptions, setAutoCaptions] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "1:1" | "16:9">("9:16");

  // ──────────────────────────────────────────────
  // STATE: Step 5 — Optional Advanced Prompt
  // ──────────────────────────────────────────────
  const [customPrompt, setCustomPrompt] = useState("");

  // ──────────────────────────────────────────────
  // STATE: Live Preview Simulator
  // ──────────────────────────────────────────────
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [showSummaryDrawer, setShowSummaryDrawer] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Load Backend Categories and User Store Products on Mount
  useEffect(() => {
    async function loadData() {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

      // 1. Try loading backend taxonomy categories
      if (token) {
        try {
          const catRes = await reelService.getCategories();
          if (catRes.success && catRes.data && catRes.data.length > 0) {
            const mappedCats: TaxonomyCategory[] = catRes.data.map((c: any) => ({
              id: c.id,
              name: c.name,
              icon: c.icon || "📦",
              subcategories: (c.subcategories || []).map((s: any) => ({
                id: s.id || s.subcategory_id || "general",
                name: s.name,
                productTypes: s.productTypes || [s.name],
              })),
            }));
            setTaxonomy(mappedCats);
            if (mappedCats[0]) {
              setSelectedCategory(mappedCats[0].id);
              if (mappedCats[0].subcategories[0]) {
                setSelectedSubcategory(mappedCats[0].subcategories[0].id);
                setSelectedProductType(mappedCats[0].subcategories[0].productTypes[0] || "General Product");
              }
            }
          }
        } catch (catErr) {
          console.warn("Using default taxonomy:", catErr);
        }
      }

      // 2. Load User Store Products
      if (token) {
        try {
          const prods = await FashionService.getProducts();
          if (prods && prods.length > 0) {
            const mapped: ProductItem[] = prods.map((p) => ({
              id: p.id,
              name: p.name,
              category: p.category || "General",
              description: p.description || p.name,
              image_url: p.image_url,
              isUserProduct: true,
            }));
            setUserProducts(mapped);
          }
        } catch (err) {
          console.warn("Using sample catalog products:", err);
        }
      }
    }

    loadData();
  }, []);

  // Current category object
  const currentCategoryObj = useMemo(() => {
    return taxonomy.find((c) => c.id === selectedCategory) || taxonomy[0];
  }, [taxonomy, selectedCategory]);

  // Current subcategory object
  const currentSubcategoryObj = useMemo(() => {
    return (
      currentCategoryObj.subcategories.find((s) => s.id === selectedSubcategory) ||
      currentCategoryObj.subcategories[0]
    );
  }, [currentCategoryObj, selectedSubcategory]);

  // Handle category change -> reset subcategory & product type
  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    const cat = taxonomy.find((c) => c.id === catId);
    if (cat && cat.subcategories.length > 0) {
      setSelectedSubcategory(cat.subcategories[0].id);
      setSelectedProductType(cat.subcategories[0].productTypes[0] || "General Product");
    }
    setSelectedCatalogProduct(null);
  };

  // Handle subcategory change -> reset product type
  const handleSubcategoryChange = (subId: string) => {
    setSelectedSubcategory(subId);
    const sub = currentCategoryObj.subcategories.find((s) => s.id === subId);
    if (sub && sub.productTypes.length > 0) {
      setSelectedProductType(sub.productTypes[0]);
    }
    setSelectedCatalogProduct(null);
  };

  // Quick tag selection
  const handleQuickTagClick = (tag: string) => {
    setSelectedProductType(tag);
    for (const cat of taxonomy) {
      for (const sub of cat.subcategories) {
        if (sub.productTypes.some((p) => p.toLowerCase() === tag.toLowerCase())) {
          setSelectedCategory(cat.id);
          setSelectedSubcategory(sub.id);
          return;
        }
      }
    }
  };

  // Search keyword with backend integration
  const handleSearchChange = async (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }

    // Check local taxonomy first
    const lower = q.toLowerCase();
    for (const cat of taxonomy) {
      for (const sub of cat.subcategories) {
        const found = sub.productTypes.find((pt) => pt.toLowerCase().includes(lower));
        if (found) {
          setSelectedCategory(cat.id);
          setSelectedSubcategory(sub.id);
          setSelectedProductType(found);
          break;
        }
      }
    }

    // Call backend search endpoint
    setIsSearching(true);
    try {
      const res = await reelService.searchProducts(q.trim());
      if (res.success && res.data) {
        setSearchResults(res.data);
      }
    } catch {
      // Ignore background search errors
    } finally {
      setIsSearching(false);
    }
  };

  // Catalogue product select
  const handleSelectCatalogProduct = (prod: ProductItem) => {
    setSelectedCatalogProduct(prod);
    setSelectedProductType(prod.name);
    if (prod.image_url) {
      setUploadedImages([prod.image_url]);
      setActiveImageIndex(0);
      setVisualMode("image");
    }
    if (prod.description) {
      setTextPrompt(prod.description);
    }
    setShowCatalogModal(false);
  };

  // Image Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingImage(true);
    setValidationError(null);

    const newUrls: string[] = [];
    for (let i = 0; i < Math.min(files.length, 10); i++) {
      const file = files[i];
      try {
        const uploadedUrl = await reelService.uploadImage(file);
        newUrls.push(uploadedUrl);
      } catch (err) {
        console.error("Failed to upload image", err);
      }
    }

    if (newUrls.length > 0) {
      setUploadedImages((prev) => [...newUrls, ...prev.filter((u) => u !== DEFAULT_SAMPLE_IMAGE)].slice(0, 10));
      setActiveImageIndex(0);
      setVisualMode("image");
    }
    setIsUploadingImage(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages((prev) => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      return updated.length > 0 ? updated : [DEFAULT_SAMPLE_IMAGE];
    });
    if (activeImageIndex >= indexToRemove && activeImageIndex > 0) {
      setActiveImageIndex((prev) => prev - 1);
    }
  };

  // Trigger manual AI Image Enhancement test/preview
  const handleTriggerEnhance = async () => {
    const targetImg = uploadedImages[activeImageIndex] || uploadedImages[0];
    if (!targetImg) return;
    setIsEnhancing(true);
    setEnhancementMessage(null);
    try {
      const res = await reelService.enhanceImage({
        image_url: targetImg,
        prompt: enhancementPrompt || "Studio commercial lighting, high clarity, realistic product presentation",
        product_name: effectiveProductName,
        category: currentCategoryObj.name,
      });

      if (res.success && res.enhanced_image_url) {
        setUploadedImages((prev) => {
          const next = [...prev];
          next[activeImageIndex] = res.enhanced_image_url;
          return next;
        });
        setEnhancementMessage("Image successfully enhanced with AI studio lighting! ✨");
      } else {
        setEnhancementMessage("I couldn't enhance this image. You can retry or continue with the original image.");
      }
    } catch {
      setEnhancementMessage("I couldn't enhance this image. You can retry or continue with the original image.");
    } finally {
      setIsEnhancing(false);
    }
  };

  // Generate Visual from Text
  const handleGenerateProductVisual = async () => {
    if (!textPrompt.trim()) {
      setVisualError("Please enter a product description first.");
      return;
    }
    setIsGeneratingVisual(true);
    setVisualError(null);
    try {
      const res = await imageService.generateImage({
        prompt: `Commercial studio product photography of ${selectedProductType || "product"}: ${textPrompt}. Clean background, high-end cinematic studio lighting, photorealistic 8K, commercial advertising quality.`,
      });
      if (res?.data?.image_url) {
        setGeneratedVisualUrl(res.data.image_url);
        setUploadedImages((prev) => [res.data!.image_url, ...prev]);
        setActiveImageIndex(0);
      } else {
        setVisualError("I couldn't generate the product visual. Please try another description.");
      }
    } catch {
      setVisualError("I couldn't generate the product visual. Please try another description.");
    } finally {
      setIsGeneratingVisual(false);
    }
  };

  // Audio Upload handler
  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAudio(true);
    try {
      const audioUrl = await reelService.uploadAudio(file);
      setUploadedAudioUrl(audioUrl);
      setUploadedAudioName(file.name);
    } catch (err) {
      console.error("Failed to upload audio", err);
    } finally {
      setIsUploadingAudio(false);
    }
  };

  // Active preview image
  const currentPreviewImage = useMemo(() => {
    if (visualMode === "text" && generatedVisualUrl) {
      return generatedVisualUrl;
    }
    return uploadedImages[activeImageIndex] || uploadedImages[0] || DEFAULT_SAMPLE_IMAGE;
  }, [visualMode, generatedVisualUrl, uploadedImages, activeImageIndex]);

  // Dynamic Effective Product Name & Offer
  const effectiveProductName = useMemo(() => {
    if (selectedCatalogProduct) return selectedCatalogProduct.name;
    if (searchQuery.trim()) return searchQuery.trim();
    return selectedProductType || "Featured Product";
  }, [selectedCatalogProduct, searchQuery, selectedProductType]);

  const effectiveOffer = useMemo(() => {
    if (offerDiscount === "custom") return customDiscountText || "Special Offer";
    if (offerDiscount === "none") return "";
    return offerDiscount;
  }, [offerDiscount, customDiscountText]);

  // Final Form Validation and Submission
  const handleGenerateSubmit = () => {
    setValidationError(null);

    // Validation
    if (visualMode === "image" && (!uploadedImages.length || !uploadedImages[0])) {
      setValidationError("Please upload at least one product image or switch to 'Create From Text'.");
      return;
    }

    if (visualMode === "text" && !textPrompt.trim() && !generatedVisualUrl) {
      setValidationError("Please describe your product or click 'Generate Product Visual' before continuing.");
      return;
    }

    const payload: GenerateReelRequest = {
      product_id: selectedCatalogProduct?.id || `prod_${Date.now()}`,
      product_name: effectiveProductName,
      product_category: currentCategoryObj.name,
      subcategory: currentSubcategoryObj.name,
      product_type: selectedProductType,
      generation_mode: "product",
      product_description: textPrompt || `${effectiveProductName} in ${currentCategoryObj.name}`,
      product_image_url: currentPreviewImage,
      product_images: uploadedImages,
      enhance_image: visualMode === "image" && enhanceWithAI,
      image_enhancement_prompt: enhancementPrompt || undefined,
      objective: campaignObjective,
      platform,
      language,
      duration,
      tone: voiceTone,
      voiceover_type: voiceoverMode,
      voice_tone: voiceoverMode === "ai" ? voiceTone : undefined,
      voice_language: voiceoverMode === "ai" ? voiceLanguage : undefined,
      voice_audio_url: voiceoverMode === "upload" ? (uploadedAudioUrl || undefined) : undefined,
      background_music: backgroundMusic,
      captions_enabled: autoCaptions,
      offer: effectiveOffer || undefined,
      offer_type: campaignObjective,
      offer_discount: effectiveOffer || undefined,
      promo_code: promoCode || undefined,
      offer_start_date: offerStartDate || undefined,
      offer_end_date: offerEndDate || undefined,
      offer_terms: offerTerms || undefined,
      additional_instruction: [
        customPrompt ? `Instructions: ${customPrompt}` : "",
        additionalMessage ? `Message: ${additionalMessage}` : "",
        `Aspect ratio: ${aspectRatio}`,
      ]
        .filter(Boolean)
        .join(". "),
    };

    onGenerate(payload);
  };

  return (
    <div className="w-full">
      {/* Validation Alert */}
      {validationError && (
        <div className="mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 text-sm text-amber-300 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400" />
            <span className="font-semibold">{validationError}</span>
          </div>
          <button
            type="button"
            onClick={() => setValidationError(null)}
            className="text-amber-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ──────────────────────────────────────────────
            LEFT COLUMN: The 5 Numbered Setup Steps (7-8 cols)
           ────────────────────────────────────────────── */}
        <div className="lg:col-span-8 space-y-6">

          {/* ══════════════════════════════════════════
              STEP 1: Choose Product / Category
             ══════════════════════════════════════════ */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1630] p-6 shadow-sm transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center text-xs font-black shadow-md shadow-purple-500/20">
                  1
                </span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Choose Product / Category
                </h2>
              </div>

              {/* Saved Catalogue Quick-Select */}
              {userProducts.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowCatalogModal(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8b5cf6] hover:text-[#7c3aed] dark:text-purple-400 dark:hover:text-purple-300 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Choose from catalogue ({userProducts.length})</span>
                </button>
              )}
            </div>

            {/* Selected Catalog Product Notification Banner */}
            {selectedCatalogProduct && (
              <div className="mb-4 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 flex items-center justify-between text-xs text-purple-900 dark:text-purple-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8b5cf6]" />
                  <span>
                    Loaded catalogue product: <strong>{selectedCatalogProduct.name}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCatalogProduct(null)}
                  className="text-purple-600 dark:text-purple-400 hover:underline cursor-pointer font-medium"
                >
                  Use a different product
                </button>
              </div>
            )}

            {/* 3 Selects + 1 Search input in responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {/* Category */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#071023] pl-3 pr-7 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:border-[#8b5cf6] focus:outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                  >
                    {taxonomy.map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-white dark:bg-[#0B1630] text-slate-900 dark:text-white">
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Sub Category */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Sub Category
                </label>
                <div className="relative">
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => handleSubcategoryChange(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#071023] pl-3 pr-7 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:border-[#8b5cf6] focus:outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                  >
                    {currentCategoryObj.subcategories.map((sub) => (
                      <option key={sub.id} value={sub.id} className="bg-white dark:bg-[#0B1630] text-slate-900 dark:text-white">
                        {sub.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Product Type */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Product Type
                </label>
                <div className="relative">
                  <select
                    value={selectedProductType}
                    onChange={(e) => {
                      setSelectedProductType(e.target.value);
                      setSelectedCatalogProduct(null);
                    }}
                    className="w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#071023] pl-3 pr-7 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:border-[#8b5cf6] focus:outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                  >
                    {currentSubcategoryObj.productTypes.map((pt) => (
                      <option key={pt} value={pt} className="bg-white dark:bg-[#0B1630] text-slate-900 dark:text-white">
                        {pt}
                      </option>
                    ))}
                    <option value="custom" className="bg-white dark:bg-[#0B1630] text-slate-900 dark:text-white">
                      Custom Product...
                    </option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Search or Custom Input */}
              <div className="relative">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Search / Custom
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="e.g. t-shirt, saree, sofa..."
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#071023] pl-8 pr-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:border-[#8b5cf6] focus:outline-none placeholder:text-slate-400"
                  />
                  {isSearching && (
                    <RefreshCw className="w-3 h-3 text-slate-400 absolute right-3 top-3 animate-spin" />
                  )}
                </div>

                {/* Instant Search Results Dropdown */}
                {searchResults.length > 0 && searchQuery && (
                  <div className="absolute top-full left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1630] shadow-xl p-1.5 custom-scrollbar">
                    {searchResults.map((item, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setSelectedProductType(item.name);
                          if (item.category) {
                            const matchedCat = taxonomy.find((c) => c.name.toLowerCase() === item.category.toLowerCase() || c.id === item.category);
                            if (matchedCat) setSelectedCategory(matchedCat.id);
                          }
                          if (item.image_url) {
                            setUploadedImages([item.image_url]);
                            setActiveImageIndex(0);
                            setVisualMode("image");
                          }
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer flex items-center justify-between"
                      >
                        <span className="font-semibold text-slate-900 dark:text-white truncate">{item.name}</span>
                        <span className="text-[10px] text-slate-400 capitalize">{item.category || item.source}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Filter Tag Pills (Screenshot layout) */}
            <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
              {QUICK_TAGS.map((tag) => {
                const isActive = selectedProductType === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleQuickTagClick(tag)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#8b5cf6] text-white shadow-sm shadow-purple-500/20"
                        : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/5"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>


          {/* ══════════════════════════════════════════
              STEP 2: Add Product Image or Describe with Prompt
             ══════════════════════════════════════════ */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1630] p-6 shadow-sm transition-all">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center text-xs font-black shadow-md shadow-purple-500/20">
                2
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Add Product Image or Describe with Prompt
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Upload photos for AI enhancement or type a description to generate visuals
                </p>
              </div>
            </div>

            {/* Two Side-By-Side Cards (Exactly matching the screenshot) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* OPTION A: Upload Product Images */}
              <div
                onClick={() => setVisualMode("image")}
                className={`rounded-xl border p-4.5 flex flex-col justify-between transition-all cursor-pointer ${
                  visualMode === "image"
                    ? "border-[#8b5cf6] ring-1 ring-[#8b5cf6]/20 bg-purple-50/20 dark:bg-purple-950/10"
                    : "border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#071023]/50 hover:border-slate-300 dark:hover:border-white/20"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#8b5cf6]" />
                      Upload Product Images
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      JPG, PNG, WEBP (Max 10)
                    </span>
                  </div>

                  {/* Dropzone Container */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="border-2 border-dashed border-slate-300 dark:border-white/15 rounded-xl p-5 text-center bg-white/70 dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-all cursor-pointer group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/40 text-[#8b5cf6] mx-auto flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      {isUploadingImage ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <UploadCloud className="w-5 h-5" />
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Upload Product Images
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Drag &amp; drop or click to browse
                    </p>
                  </div>

                  {/* Image Thumbnails Row */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-3.5 flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                      {uploadedImages.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex(idx);
                            setVisualMode("image");
                          }}
                          className={`relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                            activeImageIndex === idx && visualMode === "image"
                              ? "border-[#8b5cf6] shadow-sm"
                              : "border-slate-200 dark:border-white/10 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Product preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {uploadedImages.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(idx);
                              }}
                              className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/75 text-white flex items-center justify-center text-[10px] hover:bg-red-600 transition-colors cursor-pointer"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Image Enhancement Option */}
                <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enhanceWithAI}
                        onChange={(e) => setEnhanceWithAI(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-[#8b5cf6] focus:ring-[#8b5cf6] cursor-pointer"
                      />
                      <span>Enhance product image with AI</span>
                    </label>

                    {enhanceWithAI && (
                      <button
                        type="button"
                        disabled={isEnhancing}
                        onClick={handleTriggerEnhance}
                        className="text-[11px] font-bold text-[#8b5cf6] hover:text-[#7c3aed] flex items-center gap-1 cursor-pointer"
                      >
                        {isEnhancing ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3" />
                        )}
                        <span>Enhance Now</span>
                      </button>
                    )}
                  </div>

                  {enhanceWithAI && (
                    <div className="mt-2 space-y-1">
                      <input
                        type="text"
                        value={enhancementPrompt}
                        onChange={(e) => setEnhancementPrompt(e.target.value)}
                        placeholder="How should the product look? e.g. Give this a luxury setting with cinematic lighting"
                        className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#071023] px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#8b5cf6] focus:outline-none"
                      />
                      {enhancementMessage && (
                        <p className={`text-[10px] font-medium ${enhancementMessage.includes('I couldn\'t') ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {enhancementMessage}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* OPTION B: Describe with a Prompt */}
              <div
                onClick={() => setVisualMode("text")}
                className={`rounded-xl border p-4.5 flex flex-col justify-between transition-all cursor-pointer ${
                  visualMode === "text"
                    ? "border-[#8b5cf6] ring-1 ring-[#8b5cf6]/20 bg-purple-50/20 dark:bg-purple-950/10"
                    : "border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#071023]/50 hover:border-slate-300 dark:hover:border-white/20"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Wand2 className="w-4 h-4 text-[#8b5cf6]" />
                      Or describe your product with a prompt
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      {textPrompt.length}/500
                    </span>
                  </div>

                  <textarea
                    rows={4}
                    maxLength={500}
                    value={textPrompt}
                    onChange={(e) => setTextPrompt(e.target.value)}
                    placeholder="Example: A premium cotton men's T-shirt, round neck, available in multiple colours, stylish and comfortable..."
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#071023] p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#8b5cf6] focus:outline-none resize-none leading-relaxed"
                  />

                  {visualError && (
                    <p className="mt-1.5 text-[11px] text-red-500 font-medium">
                      {visualError}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    No image? Generate visual first
                  </span>
                  <button
                    type="button"
                    disabled={isGeneratingVisual || !textPrompt.trim()}
                    onClick={handleGenerateProductVisual}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-bold shadow-sm shadow-purple-500/20 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isGeneratingVisual ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate Product Visual</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>


          {/* ══════════════════════════════════════════
              STEP 3: Campaign Details
             ══════════════════════════════════════════ */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1630] p-6 shadow-sm transition-all">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center text-xs font-black shadow-md shadow-purple-500/20">
                3
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Campaign Details
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Configure marketing objective, promotional offers and highlight message
                </p>
              </div>
            </div>

            {/* 3 Fields in responsive row (Screenshot layout) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Campaign Objective */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Campaign Objective
                </label>
                <div className="relative">
                  <select
                    value={campaignObjective}
                    onChange={(e) => setCampaignObjective(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#071023] pl-3 pr-7 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:border-[#8b5cf6] focus:outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                  >
                    {CAMPAIGN_OBJECTIVES.map((obj) => (
                      <option key={obj.value} value={obj.value} className="bg-white dark:bg-[#0B1630] text-slate-900 dark:text-white">
                        {obj.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Offer / Discount */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Offer / Discount (Optional)
                </label>
                <div className="relative">
                  <select
                    value={offerDiscount}
                    onChange={(e) => setOfferDiscount(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#071023] pl-3 pr-7 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:border-[#8b5cf6] focus:outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                  >
                    {OFFER_OPTIONS.map((off) => (
                      <option key={off.value} value={off.value} className="bg-white dark:bg-[#0B1630] text-slate-900 dark:text-white">
                        {off.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>

                {offerDiscount === "custom" && (
                  <input
                    type="text"
                    value={customDiscountText}
                    onChange={(e) => setCustomDiscountText(e.target.value)}
                    placeholder="e.g. Flat ₹300 Off, Buy 2 Get 1"
                    className="mt-2 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#071023] px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:border-[#8b5cf6] focus:outline-none"
                  />
                )}
              </div>

              {/* Additional Message */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Additional Message (Optional)
                </label>
                <input
                  type="text"
                  value={additionalMessage}
                  onChange={(e) => setAdditionalMessage(e.target.value)}
                  placeholder="e.g. Limited time offer, Free Delivery, etc."
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#071023] px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:border-[#8b5cf6] focus:outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Collapsible Advanced Offer Details */}
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowAdvancedOffer(!showAdvancedOffer)}
                className="text-[11px] font-semibold text-[#8b5cf6] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                {showAdvancedOffer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                <span>{showAdvancedOffer ? "Hide promo code & dates" : "+ Add promo code, validity dates or terms"}</span>
              </button>

              {showAdvancedOffer && (
                <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                      Promo Code
                    </label>
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="e.g. SAVE20"
                      className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#071023] px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:border-[#8b5cf6] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={offerStartDate}
                      onChange={(e) => setOfferStartDate(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#071023] px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-[#8b5cf6] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={offerEndDate}
                      onChange={(e) => setOfferEndDate(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#071023] px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-[#8b5cf6] focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>


          {/* ══════════════════════════════════════════
              STEP 4: Reel Settings
             ══════════════════════════════════════════ */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1630] p-6 shadow-sm transition-all">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center text-xs font-black shadow-md shadow-purple-500/20">
                4
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Reel Settings
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select narration language, length, voice style and export aspect ratio
                </p>
              </div>
            </div>

            {/* Row 1 of Settings: Language, Duration, Platform, Voiceover */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
              {/* Language */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Language
                </label>
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value);
                      setVoiceLanguage(e.target.value);
                    }}
                    className="w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#071023] pl-3 pr-7 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:border-[#8b5cf6] focus:outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                  >
                    <option value="English" className="bg-white dark:bg-[#0B1630] text-slate-900 dark:text-white">English</option>
                    <option value="Hindi" className="bg-white dark:bg-[#0B1630] text-slate-900 dark:text-white">Hindi</option>
                    <option value="Hinglish" className="bg-white dark:bg-[#0B1630] text-slate-900 dark:text-white">Hinglish</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Duration
                </label>
                <div className="relative">
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#071023] pl-3 pr-7 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:border-[#8b5cf6] focus:outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                  >
                    <option value={15} className="bg-white dark:bg-[#0B1630] text-slate-900 dark:text-white">15 Seconds</option>
                    <option value={30} className="bg-white dark:bg-[#0B1630] text-slate-900 dark:text-white">30 Seconds</option>
                    <option value={45} className="bg-white dark:bg-[#0B1630] text-slate-900 dark:text-white">45 Seconds</option>
                    <option value={60} className="bg-white dark:bg-[#0B1630] text-slate-900 dark:text-white">60 Seconds</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Platform */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Platform
                </label>
                <div className="relative">
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#071023] pl-3 pr-7 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:border-[#8b5cf6] focus:outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                  >
                    <option value="instagram" className="bg-white dark:bg-[#0B1630] text-slate-900 dark:text-white">Instagram Reels</option>
                    <option value="facebook" className="bg-white dark:bg-[#0B1630] text-slate-900 dark:text-white">Facebook Reels</option>
                    <option value="youtube" className="bg-white dark:bg-[#0B1630] text-slate-900 dark:text-white">YouTube Shorts</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Voiceover Mode Segmented Controls */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Voiceover
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#071023] border border-slate-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setVoiceoverMode("ai")}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      voiceoverMode === "ai"
                        ? "bg-[#8b5cf6] text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Mic className="w-3 h-3" />
                    <span>AI Voice</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setVoiceoverMode("upload");
                      audioInputRef.current?.click();
                    }}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      voiceoverMode === "upload"
                        ? "bg-[#8b5cf6] text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <FileAudio className="w-3 h-3" />
                    <span>Upload Audio</span>
                  </button>
                </div>
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/mpeg,audio/mp3,audio/wav,audio/m4a,audio/ogg"
                  onChange={handleAudioUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Audio Upload File Badge */}
            {voiceoverMode === "upload" && uploadedAudioName && (
              <div className="mb-4 p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 flex items-center justify-between text-xs text-purple-900 dark:text-purple-200">
                <span className="flex items-center gap-2 truncate">
                  <FileAudio className="w-4 h-4 text-[#8b5cf6] flex-shrink-0" />
                  <span className="truncate">{uploadedAudioName}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setUploadedAudioUrl(null);
                    setUploadedAudioName(null);
                  }}
                  className="text-red-500 hover:text-red-700 ml-2 font-semibold cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Row 2 of Settings: Voice Tone, Background Music, Auto Captions, Aspect Ratio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 items-end">
              {/* Voice Tone */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Voice Tone
                </label>
                <div className="relative">
                  <select
                    disabled={voiceoverMode === "none"}
                    value={voiceTone}
                    onChange={(e) => setVoiceTone(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#071023] pl-3 pr-7 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:border-[#8b5cf6] focus:outline-none disabled:opacity-50 cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                  >
                    {VOICE_TONES.map((vt) => (
                      <option key={vt.value} value={vt.value} className="bg-white dark:bg-[#0B1630] text-slate-900 dark:text-white">
                        {vt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Background Music */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Background Music
                </label>
                <div className="relative">
                  <select
                    value={backgroundMusic}
                    onChange={(e) => setBackgroundMusic(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#071023] pl-3 pr-7 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:border-[#8b5cf6] focus:outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                  >
                    {MUSIC_OPTIONS.map((m) => (
                      <option key={m.value} value={m.value} className="bg-white dark:bg-[#0B1630] text-slate-900 dark:text-white">
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Auto Captions (CC) Toggle */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Auto Captions (CC)
                </label>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#071023] px-3.5 py-2.5">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Add captions
                  </span>
                  <button
                    type="button"
                    onClick={() => setAutoCaptions(!autoCaptions)}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      autoCaptions ? "bg-[#8b5cf6]" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        autoCaptions ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Aspect Ratio */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#071023] border border-slate-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setAspectRatio("9:16")}
                    className={`py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      aspectRatio === "9:16"
                        ? "bg-[#8b5cf6] text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>9:16</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio("1:1")}
                    className={`py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      aspectRatio === "1:1"
                        ? "bg-[#8b5cf6] text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Square className="w-3 h-3" />
                    <span>1:1</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio("16:9")}
                    className={`py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      aspectRatio === "16:9"
                        ? "bg-[#8b5cf6] text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Monitor className="w-3 h-3" />
                    <span>16:9</span>
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
              * Selecting a platform configures the video dimensions and format. It does not publish the reel automatically.
            </p>
          </div>


          {/* ══════════════════════════════════════════
              STEP 5: Prompt (Optional)
             ══════════════════════════════════════════ */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1630] p-6 shadow-sm transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center text-xs font-black shadow-md shadow-purple-500/20">
                  5
                </span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Prompt (Optional)
                </h2>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                {customPrompt.length}/800
              </span>
            </div>

            <textarea
              rows={3}
              maxLength={800}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Give specific instructions for the reel, e.g. 'Show product features, highlight discount, use modern and dramatic style, end with a WhatsApp CTA...'"
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#071023] p-3.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]/30 focus:outline-none resize-none leading-relaxed transition-all"
            />
          </div>

        </div>


        {/* ──────────────────────────────────────────────
            RIGHT COLUMN: Live Reel Preview & Generate CTA (4-5 cols)
           ────────────────────────────────────────────── */}
        <div className="lg:col-span-4 lg:sticky lg:top-6 space-y-4 max-h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar pr-1">
          
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1630] p-5 shadow-lg">
            
            {/* Preview Card Header */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Preview (Sample)</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-[#8b5cf6] text-[10px] font-bold">
                  {aspectRatio}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                This is a sample preview. Your final reel will be generated based on your inputs.
              </p>
            </div>

            {/* 9:16 Mockup Screen (Smartphone frame matching screenshot) */}
            <div className="relative mx-auto w-full max-w-[280px] aspect-[9/16] rounded-2xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-800">
              
              {/* Product Visual / Image */}
              <img
                src={currentPreviewImage}
                alt="Product Reel Preview"
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isPlayingPreview ? "scale-105" : "scale-100"
                }`}
              />

              {/* Gradient Dark Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60 pointer-events-none" />

              {/* Dynamic Top Badge (e.g. PREMIUM MEN'S T-SHIRT • 20% OFF) */}
              <div className="absolute top-4 left-3 right-3 text-center">
                <div className="inline-block px-3 py-1 rounded-md bg-[#eab308] text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                  {effectiveProductName} {effectiveOffer ? `• ${effectiveOffer}` : ""}
                </div>
              </div>

              {/* Center Play Button Overlay */}
              <button
                type="button"
                onClick={() => setIsPlayingPreview(!isPlayingPreview)}
                className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg"
              >
                {isPlayingPreview ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white ml-0.5 fill-white" />
                )}
              </button>

              {/* Right Side Social Actions (Instagram/TikTok reel icons) */}
              <div className="absolute right-2.5 bottom-16 flex flex-col items-center gap-3.5 text-white">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  </div>
                  <span className="text-[9px] font-bold mt-0.5">12.4K</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold mt-0.5">156</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold mt-0.5">1.1K</span>
                </div>

                <div className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                  <Bookmark className="w-4 h-4" />
                </div>
              </div>

              {/* Bottom Caption & Audio Scrubber */}
              <div className="absolute bottom-3 left-3 right-12 text-left text-white">
                <p className="text-[11px] font-extrabold line-clamp-2 leading-tight drop-shadow-md">
                  {additionalMessage || "Upgrade your everyday style with premium comfort!"}
                </p>
                <p className="text-[10px] text-slate-300 font-medium mt-1 truncate flex items-center gap-1">
                  <Music className="w-2.5 h-2.5 flex-shrink-0 animate-spin" />
                  <span>{backgroundMusic !== "none" ? `Original Audio • ${backgroundMusic}` : "Voiceover Only"}</span>
                </p>

                {/* Scrubber progress */}
                <div className="mt-2 flex items-center gap-1.5">
                  <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-[#8b5cf6] rounded-full transition-all duration-300 ${
                        isPlayingPreview ? "w-2/3" : "w-1/4"
                      }`}
                    />
                  </div>
                  <span className="text-[8px] font-mono text-slate-300">0:{duration}</span>
                </div>
              </div>
            </div>

            {/* Storyboard Scene Thumbnails (4 scenes below phone mockup) */}
            <div className="mt-3.5 pt-3 border-t border-slate-200 dark:border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
                Storyboard Flow (4 Scenes)
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { title: "01. Hook Intro", desc: "Attention" },
                  { title: "02. Feature Callout", desc: "Features" },
                  { title: "03. Offer Badge", desc: "Discount" },
                  { title: "04. Clear CTA", desc: "Buy Now" },
                ].map((sc, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 text-center"
                  >
                    <div className="w-full h-8 rounded bg-purple-100/50 dark:bg-purple-950/40 flex items-center justify-center text-[10px] font-bold text-[#8b5cf6] mb-1">
                      Scene {idx + 1}
                    </div>
                    <span className="text-[9px] font-bold text-slate-800 dark:text-slate-200 block truncate">
                      {sc.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Compact Form Summary Toggle */}
            <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-white/10">
              <button
                type="button"
                onClick={() => setShowSummaryDrawer(!showSummaryDrawer)}
                className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <span>View Reel Configuration</span>
                {showSummaryDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showSummaryDrawer && (
                <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-[#071023] border border-slate-200/80 dark:border-white/10 text-[11px] space-y-1.5 text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Product:</span>
                    <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[150px]">{effectiveProductName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Category:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{currentCategoryObj.name} ({currentSubcategoryObj.name})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Length:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{duration}s • {platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Voiceover:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{voiceoverMode === "ai" ? `AI (${voiceTone})` : voiceoverMode === "upload" ? "Custom Audio" : "None"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Music:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{backgroundMusic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Offer:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{effectiveOffer || "None"}</span>
                  </div>
                </div>
              )}
            </div>

            {/* PRIMARY CTA: Generate Reel (Gradient button matching screenshot) */}
            <div className="mt-4">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleGenerateSubmit}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#d946ef] hover:opacity-95 text-white font-extrabold text-sm shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Preparing Generation...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Reel</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* ──────────────────────────────────────────────
          Catalogue Selection Modal
         ────────────────────────────────────────────── */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1630] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#8b5cf6]" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Select Product from Catalogue
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCatalogModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[350px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {userProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => handleSelectCatalogProduct(prod)}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-white/10 hover:border-[#8b5cf6] bg-slate-50 dark:bg-white/[0.02] hover:bg-purple-50/30 dark:hover:bg-purple-950/20 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.image_url || DEFAULT_SAMPLE_IMAGE}
                      alt={prod.name}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-white/10"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#8b5cf6]">
                        {prod.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {prod.description || prod.category}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-[#8b5cf6] text-white text-[11px] font-bold shadow-sm cursor-pointer"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCatalogModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
