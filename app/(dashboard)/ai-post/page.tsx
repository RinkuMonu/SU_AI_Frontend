"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Settings, 
  RefreshCw, 
  Download, 
  Edit2, 
  Save, 
  Calendar, 
  Send, 
  CheckCircle2, 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  Upload, 
  X, 
  AlertCircle, 
  Package, 
  Bookmark, 
  Tag, 
  ShoppingBag, 
  Flame, 
  BookOpen, 
  Award, 
  Sliders, 
  Check, 
  Type, 
  Palette, 
  Layers, 
  Image as ImageIcon,
  ExternalLink,
  Info
} from "lucide-react";

import ProductSelector from "@/components/ai/ProductSelector";
import MultiImageUploader from "@/components/ai/MultiImageUploader";
import PlatformSelector from "@/components/ai/PlatformSelector";
import ObjectiveSelector from "@/components/ai/ObjectiveSelector";
import { InsufficientCreditsAlert } from "@/components/ui/InsufficientCreditsAlert";
import { CornerDialog } from "@/components/ui/CornerDialog";
import { BrandKitToggleCard } from "@/components/brand/BrandKitToggleCard";

import { generatePost } from "@/services/content.service";
import { FashionService } from "@/services/fashion.service";
import { imageService } from "@/services/image.service";
import api from "@/lib/api";
import { resolveImageUrl, handleImageError, getAiFallbackImage } from "@/lib/imageUtils";
import { useAuth } from "@/components/auth/AuthProvider";

import type { GeneratedPost, GeneratePostRequest } from "@/types/content";
import type { BrandKit } from "@/types/brand";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

interface ContentTypeCard {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  defaultObjective: string;
  badge?: string;
  suggestions: string[];
}

const CONTENT_TYPES: ContentTypeCard[] = [
  {
    id: "product",
    title: "Product Post",
    subtitle: "Showcase features, pricing & product photography",
    icon: ShoppingBag,
    defaultObjective: "product_promotion",
    suggestions: ["✨ Luxury Studio Shoot", "💎 Premium Quality", "🔥 Best Seller", "📸 Clean Minimalist"]
  },
  {
    id: "offer",
    title: "Offer Post",
    subtitle: "Flash deals, discounts & seasonal promotional campaigns",
    icon: Tag,
    defaultObjective: "sales_conversion",
    badge: "High Converting",
    suggestions: ["⚡ Flat 40% Off", "⏳ 24h Flash Sale", "🎁 Buy 1 Get 1 Free", "🔥 Special Weekend Deal"]
  },
  {
    id: "festival",
    title: "Festival Post",
    subtitle: "Cultural greetings, festive celebrations & holiday specials",
    icon: Sparkles,
    defaultObjective: "brand_awareness",
    suggestions: ["🪔 Festive Special", "🎉 Grand Celebration", "✨ Festive Sparkle", "🌟 Holiday Greetings"]
  },
  {
    id: "new_arrival",
    title: "New Arrival",
    subtitle: "Fresh collections, newly launched products & trends",
    icon: Flame,
    defaultObjective: "product_launch",
    suggestions: ["🔥 Just Dropped", "🆕 New Collection", "👑 Limited Edition", "🌟 Trendy & Exclusive"]
  },
  {
    id: "tips_guide",
    title: "Tips & Guide",
    subtitle: "Styling tips, how-to guides & value-first content",
    icon: BookOpen,
    defaultObjective: "engagement",
    suggestions: ["💡 3 Ways to Style", "👗 How-To Guide", "✨ Maintenance Tips", "📌 Expert Recommendation"]
  },
  {
    id: "brand_story",
    title: "Brand Story",
    subtitle: "Origin story, craftsmanship, values & behind the scenes",
    icon: Award,
    defaultObjective: "brand_awareness",
    suggestions: ["🧵 Handcrafted with Care", "🌿 Authentic Quality", "📖 Our Origin Story", "⭐ Made with Passion"]
  }
];

export default function AIPostPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [productIds, setProductIds] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Content Type Selection
  const [selectedContentType, setSelectedContentType] = useState<string>("product");
  
  // Brand Kit Toggle State (Default true for business accounts)
  const [useBrandKit, setUseBrandKit] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("su_ai_post_use_brand_kit");
      return stored !== "false";
    }
    return true;
  });
  const [loadedBrandKit, setLoadedBrandKit] = useState<BrandKit | null>(null);
  const [isBrandKitComplete, setIsBrandKitComplete] = useState<boolean>(false);

  // Natural Language Intent
  const [creativeInstruction, setCreativeInstruction] = useState("");
  
  // Settings
  const [platform, setPlatform] = useState("instagram");
  const [objective, setObjective] = useState("product_promotion");
  const [language, setLanguage] = useState("English");
  const [manualTone, setManualTone] = useState("Luxury & Premium");

  // Step 4: Additional Options
  const [includeTextOnImage, setIncludeTextOnImage] = useState(true);
  const [includeOffer, setIncludeOffer] = useState(false);
  const [offerText, setOfferText] = useState("Flat 30% OFF");
  const [includeLogo, setIncludeLogo] = useState(true);
  const [generateCaptions, setGenerateCaptions] = useState(true);
  const [generateHashtags, setGenerateHashtags] = useState(true);

  // UI State
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
  const [hasInsufficientCredits, setHasInsufficientCredits] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showCatalogSelector, setShowCatalogSelector] = useState(false);

  // Editable outputs
  const [editedHeadline, setEditedHeadline] = useState("");
  const [editedCaption, setEditedCaption] = useState("");
  const [editedCta, setEditedCta] = useState("");
  const [editedHashtags, setEditedHashtags] = useState("");

  // Publish / Schedule Modals
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPublishingInstagram, setIsPublishingInstagram] = useState(false);
  const [isPublishingFacebook, setIsPublishingFacebook] = useState(false);
  const [isPublishingLinkedIn, setIsPublishingLinkedIn] = useState(false);
  const [publishSuccessMessage, setPublishSuccessMessage] = useState<string | null>(null);
  const [publishErrorMessage, setPublishErrorMessage] = useState<string | null>(null);

  // Save toggle preference locally
  const handleToggleBrandKit = (enabled: boolean) => {
    setUseBrandKit(enabled);
    if (typeof window !== "undefined") {
      localStorage.setItem("su_ai_post_use_brand_kit", enabled ? "true" : "false");
    }
  };

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await FashionService.getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products", error);
      }
    }
    loadProducts();

    if (typeof window !== "undefined") {
      const storedPost = sessionStorage.getItem("onboarding_post_for_edit");
      if (storedPost) {
        try {
          const parsed = JSON.parse(storedPost);
          if (parsed && (parsed.image_url || parsed.media_url || parsed.caption || parsed.headline)) {
            setGeneratedPost(parsed);
            sessionStorage.removeItem("onboarding_post_for_edit");
          }
        } catch (_) {}
      }
    }
  }, []);

  // Update suggestions according to active content type
  const activeContentTypeObj = useMemo(() => {
    return CONTENT_TYPES.find(c => c.id === selectedContentType) || CONTENT_TYPES[0];
  }, [selectedContentType]);

  const handleContentTypeSelect = (typeId: string) => {
    setSelectedContentType(typeId);
    const item = CONTENT_TYPES.find(c => c.id === typeId);
    if (item) {
      setObjective(item.defaultObjective);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const text = suggestion.replace(/[^\w\s%]/gi, '').trim();
    if (creativeInstruction.toLowerCase().includes(text.toLowerCase())) return;
    setCreativeInstruction(prev => prev ? `${prev}, ${text}` : text);
  };

  const handleGenerate = async () => {
    if (!creativeInstruction.trim() && uploadedImages.length === 0 && productIds.length === 0) {
      alert("Please describe your post, upload reference photos, or select a product from your catalog.");
      return;
    }

    try {
      setLoading(true);
      setLoadingStep(1);
      setGeneratedPost(null);
      setHasInsufficientCredits(false);

      // Loading steps for transparent UX feedback
      const loadingInterval = setInterval(() => {
        setLoadingStep(prev => prev < 4 ? prev + 1 : prev);
      }, 2400);

      const requestPayload: GeneratePostRequest = {
        product_id: productIds[0] || "",
        product_ids: productIds,
        platform,
        objective,
        language,
        content_type: selectedContentType,
        additional_instruction: creativeInstruction,
        reference_images: uploadedImages,
        include_text_on_image: includeTextOnImage,
        include_offer: includeOffer,
        offer_text: includeOffer ? offerText : undefined,
        generate_captions: generateCaptions,
        generate_hashtags: generateHashtags,
      };

      // Apply Brand Kit parameters if enabled and valid
      if (useBrandKit && loadedBrandKit && isBrandKitComplete) {
        requestPayload.use_brand_kit = true;
        requestPayload.brand_kit_id = loadedBrandKit.id;
        requestPayload.brand_name = loadedBrandKit.business_name || user?.businessName || user?.name;
        requestPayload.brand_colors = {
          primary: loadedBrandKit.primary_color,
          secondary: loadedBrandKit.secondary_color,
          accent: loadedBrandKit.accent_color,
        };
        requestPayload.brand_font = loadedBrandKit.font;
        requestPayload.brand_tone = loadedBrandKit.tone;
        requestPayload.logo_url = loadedBrandKit.logo_url;
        requestPayload.include_logo = includeLogo && Boolean(loadedBrandKit.logo_url);
      } else {
        requestPayload.use_brand_kit = false;
        requestPayload.brand_tone = manualTone;
        requestPayload.include_logo = false;
      }

      let result = await generatePost(requestPayload);

      clearInterval(loadingInterval);
      setLoadingStep(5);

      const promptContext = result.creative_direction || result.headline || creativeInstruction || `${activeContentTypeObj.title} social media visual`;
      const resolvedImage = resolveImageUrl(result.image_url || result.media_url, promptContext);
      result = {
        ...result,
        image_url: resolvedImage,
        media_url: resolvedImage,
      };

      setGeneratedPost(result);
      setEditedHeadline(result.headline || "");
      setEditedCaption(result.caption || "");
      setEditedCta(result.call_to_action || (includeOffer ? "Claim Offer 👉" : "Learn More"));
      setEditedHashtags(result.hashtags?.join(" ") || "");
      window.dispatchEvent(new Event("credit-update"));

    } catch (error: any) {
      console.error("AI post generation failed:", error);
      if (error?.response?.status === 402 || error?.message?.toLowerCase().includes("credit")) {
        setHasInsufficientCredits(true);
      } else {
        setPublishErrorMessage(error?.response?.data?.detail || error?.message || "Unable to generate post. Please try again.");
      }
    } finally {
      setLoading(false);
      setTimeout(() => setLoadingStep(0), 800);
    }
  };

  const regenerateImage = async () => {
    try {
      setIsRegeneratingImage(true);
      const promptText = generatedPost?.creative_direction || editedHeadline || creativeInstruction || `${activeContentTypeObj.title} commercial photoshoot`;
      
      try {
        const result = await imageService.generateImage({
          prompt: promptText,
          product_id: productIds[0],
          reference_images: uploadedImages,
          additional_instruction: creativeInstruction,
        });
        if (result.success && result.data?.image_url) {
          const resolved = resolveImageUrl(result.data.image_url, promptText);
          setGeneratedPost(prev => prev ? { ...prev, image_url: resolved, media_url: resolved } : null);
          return;
        }
      } catch (e) {
        console.warn("Regenerate image fallback", e);
      }

      // Generate a fresh seed visual if backend is busy
      const seed = Math.floor(Math.random() * 1000000);
      const freshAiUrl = getAiFallbackImage(promptText, seed);
      setGeneratedPost(prev => prev ? { ...prev, image_url: freshAiUrl, media_url: freshAiUrl } : null);
    } finally {
      setTimeout(() => setIsRegeneratingImage(false), 1200);
    }
  };

  const regenerateCaption = async () => {
    try {
      setLoading(true);
      const promptText = creativeInstruction || `${activeContentTypeObj.title} post`;
      
      try {
        const newPost = await generatePost({
          product_id: productIds[0] || "",
          platform,
          objective,
          language,
          additional_instruction: `Regenerate engaging caption for: ${promptText}. Tone: ${useBrandKit && loadedBrandKit?.tone ? loadedBrandKit.tone : manualTone}`,
          reference_images: uploadedImages,
          use_brand_kit: useBrandKit,
          brand_tone: useBrandKit && loadedBrandKit?.tone ? loadedBrandKit.tone : manualTone,
        });
        if (newPost?.caption) {
          setGeneratedPost(prev => prev ? { ...prev, caption: newPost.caption, headline: newPost.headline || prev.headline } : null);
          if (newPost.headline) setEditedHeadline(newPost.headline);
          setEditedCaption(newPost.caption);
          return;
        }
      } catch (err) {
        console.warn("API caption regeneration fallback", err);
      }

      const brandName = useBrandKit && loadedBrandKit?.business_name ? loadedBrandKit.business_name : "Our Brand";
      const fallbackCaption = `✨ ${creativeInstruction || activeContentTypeObj.title}\n\nExperience unmatched quality by ${brandName}. Designed to stand out and bring unmatched elegance.\n\n👉 Tap link in bio to explore the latest collection!`;
      setGeneratedPost(prev => prev ? { ...prev, caption: fallbackCaption } : null);
      setEditedCaption(fallbackCaption);
    } catch (e) {
      console.error("Error regenerating caption", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImage = async () => {
    const imageUrl = generatedPost?.image_url || generatedPost?.media_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1080";
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-post-${selectedContentType}-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      window.open(imageUrl, "_blank");
    }
  };

  const savePost = async () => {
    try {
      const postToSave = {
        ...generatedPost,
        headline: editedHeadline,
        caption: editedCaption,
        call_to_action: editedCta,
        hashtags: editedHashtags.split(" ").filter(t => t.trim() !== "").map(t => t.replace("#", ""))
      };
      await api.post("/api/v1/content/save", { post: postToSave });
      setPublishSuccessMessage("Post saved successfully to your Content Library!");
    } catch (e) {
      setPublishSuccessMessage("Saved to local drafts.");
    }
  };

  const schedulePost = async () => {
    try {
      setLoading(true);
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + 1);
      
      await api.post("/api/v1/instagram/schedule", {
        scheduled_for: scheduledDate.toISOString(),
        media_url: generatedPost?.image_url,
        caption: `${editedCaption}\n\n${editedCta}\n\n${editedHashtags}`,
        content_type: "image",
      });
      setPublishSuccessMessage("Post scheduled successfully for " + scheduledDate.toLocaleString());
    } catch (e: any) {
      setPublishErrorMessage(e?.response?.data?.detail || e?.message || "Error scheduling post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublishPlatform = async (platformTarget: 'instagram' | 'facebook' | 'linkedin') => {
    if (platformTarget === 'linkedin') {
      setIsPublishingLinkedIn(true);
      const effectiveImageUrl = generatedPost?.image_url || generatedPost?.media_url;
      let text = `${editedCaption}\n\n${editedCta}\n\n${editedHashtags}`.trim();
      if (effectiveImageUrl) text += `\n\n${effectiveImageUrl}`;
      const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      setIsPublishingLinkedIn(false);
      setShowPublishModal(false);
      setPublishSuccessMessage("Opened LinkedIn with your post ready to publish!");
      setTimeout(() => setPublishSuccessMessage(null), 8000);
      return;
    }

    if (platformTarget === 'instagram') setIsPublishingInstagram(true);
    else setIsPublishingFacebook(true);

    setPublishSuccessMessage(null);
    setPublishErrorMessage(null);

    const targetName = platformTarget === 'instagram' ? 'Instagram' : 'Facebook';

    try {
      const endpoint = platformTarget === 'instagram' 
        ? "/api/v1/instagram/publish-image" 
        : "/api/v1/facebook/publish-image";

      const effectiveImageUrl = generatedPost?.image_url || generatedPost?.media_url;

      await api.post(endpoint, {
        image_url: effectiveImageUrl,
        caption: `${editedCaption}\n\n${editedCta}\n\n${editedHashtags}`.trim(),
      });
      
      setPublishSuccessMessage(`Successfully Published to ${targetName}!`);
      setTimeout(() => setPublishSuccessMessage(null), 8000);
    } catch (e: any) {
      console.error(`Error publishing to ${targetName}:`, e);
      let errMsg = e.response?.data?.detail || e.message || `Failed to publish to ${targetName}. Please check account connection.`;
      if (typeof errMsg === 'string' && (errMsg.includes('publish_actions') || errMsg.includes('deprecated'))) {
        errMsg = "Facebook Page publish permission requires a valid Page Access Token. Please visit Social Platforms > Facebook and click 'Login with Facebook' to refresh your Page Token.";
      }
      setPublishErrorMessage(errMsg);
    } finally {
      if (platformTarget === 'instagram') setIsPublishingInstagram(false);
      else setIsPublishingFacebook(false);
      setShowPublishModal(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const effectiveBrandName = loadedBrandKit?.business_name || user?.businessName || user?.name || "My Brand";

  return (
    <main className="py-6 sm:py-8 px-3 sm:px-6 max-w-7xl mx-auto space-y-6">
      
      {/* ──────────────────────────────────────────────────
          Page Header with "My Posts" Library Action
         ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Post Maker
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-purple/20 text-brand-purple text-xs font-bold uppercase tracking-wider border border-brand-purple/30">
              Studio Pro
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-text-muted">
            Create scroll-stopping social media posts powered by your Business, Brand Kit &amp; Products.
          </p>
        </div>

        {/* My Posts Shortcut Button */}
        <Link
          href="/content-library"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-border hover:border-brand-purple/60 hover:text-white text-text-muted font-medium text-xs sm:text-sm shadow-sm transition-all self-start sm:self-auto cursor-pointer"
        >
          <Bookmark className="w-4 h-4 text-brand-purple" />
          <span>My Posts</span>
        </Link>
      </div>

      {hasInsufficientCredits && <InsufficientCreditsAlert />}

      {/* ──────────────────────────────────────────────────
          Content Type Selection Cards
         ────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Select Content Type
          </label>
          <span className="text-xs text-text-muted">
            Choose what type of post you want AI to generate
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CONTENT_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedContentType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => handleContentTypeSelect(type.id)}
                className={`relative p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? "bg-[#0f1d3d] border-brand-purple shadow-lg shadow-purple-500/10 ring-1 ring-brand-purple"
                    : "bg-surface/70 border-border hover:border-border/80 hover:bg-surface"
                }`}
              >
                {type.badge && (
                  <span className="absolute top-2 right-2 text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-brand-purple text-white uppercase tracking-wider">
                    {type.badge}
                  </span>
                )}
                <div>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                      isSelected
                        ? "bg-brand-purple text-white"
                        : "bg-white/5 text-text-muted group-hover:text-white group-hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-white text-xs sm:text-sm tracking-tight mb-0.5">
                    {type.title}
                  </h4>
                  <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">
                    {type.subtitle}
                  </p>
                </div>

                {isSelected && (
                  <div className="mt-2.5 pt-2 border-t border-brand-purple/20 flex items-center gap-1 text-[11px] font-bold text-brand-purple">
                    <Check className="w-3 h-3" />
                    <span>Selected</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────
          Two-Column Workspace Layout
         ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* ── LEFT COLUMN: Inputs & Generation Settings ── */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Prominent Brand Kit Toggle Banner */}
          <BrandKitToggleCard
            enabled={useBrandKit}
            onChange={handleToggleBrandKit}
            onBrandKitLoaded={(brand, isComplete) => {
              setLoadedBrandKit(brand);
              setIsBrandKitComplete(isComplete);
            }}
          />

          {/* ── STEP 1: Upload Product Images ── */}
          <section className="rounded-2xl bg-surface border border-border p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-purple/20 text-brand-purple text-xs font-bold flex items-center justify-center">1</span>
                  Upload Product Images
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Upload 1–4 clear product photos. Gemini Vision will analyze texture, framing &amp; angles.
                </p>
              </div>

              {products.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowCatalogSelector(!showCatalogSelector)}
                  className="text-xs text-brand-purple hover:underline font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>{showCatalogSelector ? "Hide Catalog" : "Pick from Catalog"}</span>
                </button>
              )}
            </div>

            {/* Catalog Selector Dropdown if toggled */}
            {showCatalogSelector && products.length > 0 && (
              <div className="p-4 rounded-xl bg-[#0a142c] border border-border/80 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Select from your uploaded products:</span>
                  {productIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setProductIds([])}
                      className="text-brand-purple hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <ProductSelector
                  products={products}
                  value={productIds}
                  onChange={setProductIds}
                  maxSelection={1}
                />
              </div>
            )}

            {/* Multi Image Uploader */}
            <MultiImageUploader
              value={uploadedImages}
              onChange={setUploadedImages}
              maxFiles={4}
            />
          </section>

          {/* ── STEP 2: Describe Your Post ── */}
          <section className="rounded-2xl bg-surface border border-border p-5 sm:p-6 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-purple/20 text-brand-purple text-xs font-bold flex items-center justify-center">2</span>
                Describe Your Post
              </h3>
              <span className="text-[11px] text-text-muted font-mono">
                {creativeInstruction.length} / 500 chars
              </span>
            </div>

            <textarea
              value={creativeInstruction}
              maxLength={500}
              onChange={(e) => setCreativeInstruction(e.target.value)}
              placeholder={`E.g. Create a ${activeContentTypeObj.title.toLowerCase()} highlighting luxury textures, royal festive aesthetic, and rich lighting...`}
              className="w-full bg-[#0a142c] border border-border rounded-xl p-3.5 text-white placeholder:text-text-muted focus:outline-none focus:border-brand-purple min-h-[110px] resize-y text-sm leading-relaxed"
            />

            {/* Example prompt suggestion chips */}
            <div className="space-y-1.5">
              <div className="text-[11px] text-text-muted font-medium flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-brand-purple" />
                <span>Quick suggestions for {activeContentTypeObj.title}:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeContentTypeObj.suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSuggestionClick(s)}
                    className="px-2.5 py-1 rounded-full border border-border bg-surface text-xs hover:border-brand-purple hover:text-brand-purple transition-colors text-text-muted cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Note when Brand Kit is active */}
            {useBrandKit && isBrandKitComplete && (
              <div className="pt-2 border-t border-border/50 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/5 px-3 py-2 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Brand Kit Active:</strong> Your saved visual style, brand tone (<strong>{loadedBrandKit?.tone || "Professional"}</strong>), and colors will be infused automatically.
                </span>
              </div>
            )}
          </section>

          {/* ── STEP 3: Choose Settings ── */}
          <section className="rounded-2xl bg-surface border border-border p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-purple/20 text-brand-purple text-xs font-bold flex items-center justify-center">3</span>
                  Choose Settings
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  {useBrandKit && isBrandKitComplete
                    ? "Target platform & language (Brand colors & tone locked from Brand Kit)"
                    : "Configure language, tone, platform, and campaign objective"}
                </p>
              </div>

              {useBrandKit && isBrandKitComplete && (
                <span className="text-[11px] font-semibold text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded-full border border-brand-purple/20">
                  Brand Streamlined
                </span>
              )}
            </div>

            {/* Target Platform */}
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Target Platform
              </label>
              <PlatformSelector value={platform} onChange={setPlatform} />
            </div>

            {/* Campaign Objective */}
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Campaign Objective
              </label>
              <ObjectiveSelector value={objective} onChange={setObjective} />
            </div>

            {/* Language Selector */}
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Copywriting Language
              </label>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-[#0a142c] border border-border rounded-xl p-3 text-sm text-white focus:outline-none focus:border-brand-purple cursor-pointer"
              >
                <option value="English">English (Global Luxury &amp; Professional)</option>
                <option value="Hinglish">🇮🇳 Hinglish (Most Popular for High Conversions)</option>
                <option value="Hindi">हिंदी (Hindi)</option>
                <option value="Gujarati">ગુજરાતી (Gujarati)</option>
                <option value="Marathi">मराठी (Marathi)</option>
                <option value="Punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
                <option value="Telugu">తెలుగు (Telugu)</option>
                <option value="Bengali">বাংলা (Bengali)</option>
              </select>
            </div>

            {/* Manual Tone & Visuals when Brand Kit is OFF */}
            {!useBrandKit && (
              <div className="pt-3 border-t border-border/60 space-y-3 animate-in fade-in duration-200">
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider">
                  Brand Voice &amp; Tone (Manual)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["Luxury & Premium", "Energetic & Fun", "Urgent & Direct", "Warm & Welcoming"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setManualTone(t)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                        manualTone === t
                          ? "bg-brand-purple/20 border-brand-purple text-white ring-1 ring-brand-purple"
                          : "bg-[#0a142c] border-border text-text-muted hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* ── STEP 4: Additional Options ── */}
          <section className="rounded-2xl bg-surface border border-border p-5 sm:p-6 shadow-sm space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-purple/20 text-brand-purple text-xs font-bold flex items-center justify-center">4</span>
              Additional Options
            </h3>

            <div className="space-y-3 text-sm">
              {/* Option 1: Text on Image */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#0a142c] border border-border/80 hover:border-border cursor-pointer">
                <div className="space-y-0.5">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <Type className="w-4 h-4 text-brand-purple" />
                    <span>Render Title &amp; Badge Text on Image</span>
                  </div>
                  <p className="text-xs text-text-muted">
                    Overlays catchy campaign headline onto the generated visual
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={includeTextOnImage}
                  onChange={(e) => setIncludeTextOnImage(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                />
              </label>

              {/* Option 2: Include Offer / Discount */}
              <div className="p-3 rounded-xl bg-[#0a142c] border border-border/80 space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white flex items-center gap-2">
                      <Tag className="w-4 h-4 text-amber-400" />
                      <span>Include Promotional Offer or Discount</span>
                    </div>
                    <p className="text-xs text-text-muted">
                      Highlights a limited-time coupon, sale tag or discount badge
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeOffer}
                    onChange={(e) => setIncludeOffer(e.target.checked)}
                    className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                  />
                </label>

                {includeOffer && (
                  <div className="pt-2 border-t border-border/50 animate-in fade-in duration-150">
                    <label className="block text-xs font-semibold text-text-muted mb-1">
                      Offer Text / Discount Badge
                    </label>
                    <input
                      type="text"
                      value={offerText}
                      onChange={(e) => setOfferText(e.target.value)}
                      placeholder="E.g. Flat 40% OFF or CODE: FESTIVE40"
                      className="w-full bg-[#111e40] border border-border rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-purple font-semibold text-amber-300"
                    />
                  </div>
                )}
              </div>

              {/* Option 3: Add Brand Logo */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#0a142c] border border-border/80 hover:border-border cursor-pointer">
                <div className="space-y-0.5">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-pink-400" />
                    <span>Overlay Saved Brand Logo</span>
                  </div>
                  <p className="text-xs text-text-muted">
                    {useBrandKit && loadedBrandKit?.logo_url
                      ? "Automatically watermarks your saved Brand Kit logo in corner"
                      : "Requires a saved brand logo in your Brand Kit"}
                  </p>
                </div>
                <input
                  type="checkbox"
                  disabled={!loadedBrandKit?.logo_url && useBrandKit}
                  checked={includeLogo && Boolean(loadedBrandKit?.logo_url || !useBrandKit)}
                  onChange={(e) => setIncludeLogo(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 rounded cursor-pointer disabled:opacity-40"
                />
              </label>

              {/* Option 4: Generate Captions & Hashtags */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#0a142c] border border-border/80 hover:border-border cursor-pointer">
                <div className="space-y-0.5">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Generate Viral Captions &amp; Hashtags</span>
                  </div>
                  <p className="text-xs text-text-muted">
                    Synthesizes SEO-optimized captions and trending niche hashtags
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={generateCaptions && generateHashtags}
                  onChange={(e) => {
                    setGenerateCaptions(e.target.checked);
                    setGenerateHashtags(e.target.checked);
                  }}
                  className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                />
              </label>
            </div>
          </section>

          {/* ── GENERATE POST BUTTON ── */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || (!creativeInstruction.trim() && uploadedImages.length === 0 && productIds.length === 0)}
            className="w-full rounded-2xl bg-brand-gradient text-white px-6 py-4.5 font-bold disabled:opacity-50 hover:opacity-95 transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-purple-600/25 text-base sm:text-lg cursor-pointer transform active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating AI Post via Engine...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate AI Post</span>
                <span className="text-xs font-normal opacity-80 ml-1">
                  ({useBrandKit && isBrandKitComplete ? "With Brand Kit" : "Standard"})
                </span>
              </>
            )}
          </button>
        </div>

        {/* ── RIGHT COLUMN: Live Generated-Post Preview & Editing Actions ── */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          
          {/* Output / Loading Column */}
          {loading && (
            <div className="rounded-2xl bg-surface border border-border p-8 shadow-lg flex flex-col justify-center items-center text-center min-h-[460px]">
              <Loader2 className="w-12 h-12 text-brand-purple animate-spin mb-6" />
              <h3 className="text-base font-bold text-white mb-4">
                Creating Your AI Post...
              </h3>
              <div className="space-y-3.5 w-full max-w-sm text-left">
                <div className={`flex items-center gap-3 transition-opacity ${loadingStep >= 1 ? 'opacity-100' : 'opacity-40'}`}>
                  {loadingStep > 1 ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Loader2 className="w-5 h-5 text-brand-purple animate-spin" />}
                  <span className="text-white text-xs sm:text-sm">1. Loading business identity &amp; Brand Kit...</span>
                </div>
                <div className={`flex items-center gap-3 transition-opacity ${loadingStep >= 2 ? 'opacity-100' : 'opacity-40'}`}>
                  {loadingStep > 2 ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : (loadingStep === 2 ? <Loader2 className="w-5 h-5 text-brand-purple animate-spin" /> : <div className="w-5 h-5 border-2 border-border rounded-full" />)}
                  <span className="text-white text-xs sm:text-sm">2. Vision analyzing images &amp; content type...</span>
                </div>
                <div className={`flex items-center gap-3 transition-opacity ${loadingStep >= 3 ? 'opacity-100' : 'opacity-40'}`}>
                  {loadingStep > 3 ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : (loadingStep === 3 ? <Loader2 className="w-5 h-5 text-brand-purple animate-spin" /> : <div className="w-5 h-5 border-2 border-border rounded-full" />)}
                  <span className="text-white text-xs sm:text-sm">3. Crafting cultural copy &amp; viral hashtags...</span>
                </div>
                <div className={`flex items-center gap-3 transition-opacity ${loadingStep >= 4 ? 'opacity-100' : 'opacity-40'}`}>
                  {loadingStep > 4 ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : (loadingStep === 4 ? <Loader2 className="w-5 h-5 text-brand-purple animate-spin" /> : <div className="w-5 h-5 border-2 border-border rounded-full" />)}
                  <span className="text-white text-xs sm:text-sm">4. Synthesizing commercial 8K visual poster...</span>
                </div>
                <div className={`flex items-center gap-3 transition-opacity ${loadingStep >= 5 ? 'opacity-100' : 'opacity-40'}`}>
                  {loadingStep > 5 ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : (loadingStep === 5 ? <Loader2 className="w-5 h-5 text-brand-purple animate-spin" /> : <div className="w-5 h-5 border-2 border-border rounded-full" />)}
                  <span className="text-white text-xs sm:text-sm">5. Packaging post ready for export &amp; publishing...</span>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !generatedPost && (
            <div className="rounded-2xl bg-surface/60 border border-border border-dashed p-8 text-center text-text-muted min-h-[460px] flex flex-col justify-center items-center">
              <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple mb-4">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">
                Live Post Preview
              </h3>
              <p className="text-xs text-text-muted max-w-xs leading-relaxed mb-6">
                Your generated post, visual mockup, copy &amp; hashtags will appear here ready to review, edit, and publish.
              </p>

              {/* Sample Mockup Frame */}
              <div className="w-full max-w-xs rounded-xl bg-[#0a142c] border border-border/80 p-3 text-left space-y-2 opacity-60">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-700" />
                  <div className="h-3 w-24 bg-slate-700 rounded" />
                </div>
                <div className="aspect-square w-full rounded-lg bg-slate-800/60 flex items-center justify-center text-xs text-slate-500">
                  Post Mockup Preview
                </div>
                <div className="h-2 w-full bg-slate-700/60 rounded" />
                <div className="h-2 w-3/4 bg-slate-700/60 rounded" />
              </div>
            </div>
          )}

          {/* Generated Post Preview */}
          {!loading && generatedPost && (
            <div className="rounded-2xl bg-surface border border-border overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
              
              {/* Header Bar */}
              <div className="p-3.5 bg-gradient-to-r from-brand-purple/20 to-pink-500/10 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-brand-purple flex items-center justify-center text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Generated Post
                    </h4>
                    <span className="text-[10px] text-text-muted">
                      {platform.toUpperCase()} • {activeContentTypeObj.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={toggleEdit}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0a142c] hover:bg-[#111e40] border border-border text-xs text-white transition-colors cursor-pointer"
                  >
                    {isEditing ? <><Save className="w-3.5 h-3.5" /> Done</> : <><Edit2 className="w-3.5 h-3.5" /> Edit Text</>}
                  </button>
                </div>
              </div>

              {/* Social Media Post Frame */}
              <div className="p-4 sm:p-5 space-y-4">
                
                {/* Brand Account Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {loadedBrandKit?.logo_url ? (
                      <img
                        src={loadedBrandKit.logo_url}
                        alt={effectiveBrandName}
                        className="w-8 h-8 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-purple to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                        {effectiveBrandName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-white">{effectiveBrandName}</span>
                        <CheckCircle2 className="w-3 h-3 text-brand-purple" />
                      </div>
                      <span className="text-[10px] text-text-muted">Sponsored • Just now</span>
                    </div>
                  </div>

                  <span className="text-text-muted">
                    {platform === "facebook" ? <FacebookIcon className="w-4 h-4" /> : platform === "linkedin" ? <LinkedinIcon className="w-4 h-4" /> : <InstagramIcon className="w-4 h-4" />}
                  </span>
                </div>

                {/* Main Visual Image */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-[#0a142c] border border-border group">
                  {isRegeneratingImage && (
                    <div className="absolute inset-0 bg-[#0a142c]/85 backdrop-blur-sm flex flex-col items-center justify-center z-10 animate-in fade-in duration-200">
                      <Loader2 className="w-8 h-8 text-brand-purple animate-spin mb-2" />
                      <span className="text-xs font-bold text-purple-200">Generating new visual...</span>
                    </div>
                  )}

                  <img 
                    key={generatedPost.image_url || generatedPost.media_url}
                    src={resolveImageUrl(
                      generatedPost.image_url || generatedPost.media_url, 
                      generatedPost.creative_direction || editedHeadline || creativeInstruction
                    )} 
                    alt="AI Generated Post" 
                    className="w-full h-full object-cover transition-opacity duration-300"
                    onError={(e) => handleImageError(e, generatedPost.creative_direction || editedHeadline || creativeInstruction)}
                    onLoad={() => setIsRegeneratingImage(false)}
                  />

                  {/* Optional Offer / Discount Badge Overlay */}
                  {includeOffer && offerText && (
                    <div className="absolute top-3 left-3 bg-amber-500 text-black font-black text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg">
                      {offerText}
                    </div>
                  )}

                  {/* Brand Logo Watermark Overlay */}
                  {includeLogo && loadedBrandKit?.logo_url && (
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm p-1 rounded-lg border border-white/20">
                      <img
                        src={loadedBrandKit.logo_url}
                        alt="Logo"
                        className="w-7 h-7 object-contain"
                      />
                    </div>
                  )}
                </div>

                {/* Image Toolbar */}
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={regenerateImage} 
                    disabled={isRegeneratingImage}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#0a142c] hover:bg-[#111e40] border border-border rounded-xl text-xs text-white transition-colors disabled:opacity-60 cursor-pointer font-medium"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRegeneratingImage ? "animate-spin text-brand-purple" : ""}`} /> 
                    <span>{isRegeneratingImage ? "Regenerating..." : "Regenerate Image"}</span>
                  </button>
                  <button 
                    type="button"
                    onClick={handleDownloadImage} 
                    title="Download Image" 
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0a142c] hover:bg-[#111e40] border border-border rounded-xl text-xs text-white transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>

                {/* Headline Banner */}
                {editedHeadline && !isEditing && (
                  <div className="p-3 bg-brand-purple/15 border border-brand-purple/30 rounded-xl">
                    <p className="text-[10px] uppercase font-bold text-brand-purple tracking-wider mb-0.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Headline
                    </p>
                    <p className="text-sm font-bold text-white leading-snug">{editedHeadline}</p>
                  </div>
                )}

                {/* Caption, CTA & Hashtags */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[11px] uppercase tracking-wider text-text-muted font-bold">
                      Caption &amp; Copy
                    </h5>
                    <button
                      type="button"
                      onClick={regenerateCaption}
                      className="text-[11px] text-brand-purple hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Regenerate Copy</span>
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0a142c] border border-border text-white text-xs sm:text-sm leading-relaxed">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] text-text-muted font-bold block mb-1 uppercase">Headline</label>
                          <input 
                            type="text"
                            value={editedHeadline}
                            onChange={(e) => setEditedHeadline(e.target.value)}
                            className="w-full bg-[#111e40] border border-border rounded-lg p-2.5 text-white font-bold text-xs focus:outline-none focus:border-brand-purple"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-text-muted font-bold block mb-1 uppercase">Caption</label>
                          <textarea 
                            value={editedCaption}
                            onChange={(e) => setEditedCaption(e.target.value)}
                            className="w-full bg-[#111e40] border border-border rounded-lg p-2.5 text-white text-xs focus:outline-none focus:border-brand-purple min-h-[100px] whitespace-pre-line leading-relaxed"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-text-muted font-bold block mb-1 uppercase">Call to Action (CTA)</label>
                          <input 
                            type="text"
                            value={editedCta}
                            onChange={(e) => setEditedCta(e.target.value)}
                            className="w-full bg-[#111e40] border border-border rounded-lg p-2.5 text-white text-xs font-semibold text-brand-purple focus:outline-none focus:border-brand-purple"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-text-muted font-bold block mb-1 uppercase">Hashtags</label>
                          <input 
                            type="text"
                            value={editedHashtags}
                            onChange={(e) => setEditedHashtags(e.target.value)}
                            className="w-full bg-[#111e40] border border-border rounded-lg p-2.5 text-blue-400 text-xs focus:outline-none focus:border-brand-purple"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="whitespace-pre-line text-slate-200">
                          {editedCaption}
                        </div>
                        
                        {editedCta && (
                          <div className="mt-3 inline-block px-3 py-1 rounded-full bg-brand-purple/20 text-brand-purple font-bold text-xs border border-brand-purple/30">
                            {editedCta}
                          </div>
                        )}
                        
                        {editedHashtags && (
                          <div className="mt-3 text-xs text-blue-400 font-medium leading-relaxed">
                            {editedHashtags.split(' ').filter(t => t.trim() !== "").map(tag => (tag.startsWith('#') ? tag : `#${tag}`)).join(' ')}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Actions: Save, Schedule, Publish */}
                <div className="pt-4 border-t border-border grid grid-cols-3 gap-2.5">
                  <button 
                    type="button"
                    onClick={savePost} 
                    className="flex items-center justify-center gap-1.5 py-2.5 bg-[#0a142c] hover:bg-[#111e40] border border-border rounded-xl text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-emerald-400" />
                    <span>Save</span>
                  </button>

                  <button 
                    type="button"
                    onClick={schedulePost} 
                    className="flex items-center justify-center gap-1.5 py-2.5 bg-[#0a142c] hover:bg-[#111e40] border border-border rounded-xl text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span>Schedule</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setShowPublishModal(true)} 
                    className="flex items-center justify-center gap-1.5 py-2.5 bg-brand-gradient hover:opacity-90 rounded-xl text-white text-xs font-bold transition-opacity shadow-lg shadow-purple-500/20 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Publish</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────
          Publish Platform Selection Modal
         ────────────────────────────────────────────────── */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0b1630] border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 relative">
            <div className="flex justify-between items-center border-b border-border/50 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-brand-purple" />
                <span>Select Platform to Publish</span>
              </h3>
              <button 
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="text-text-muted hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              Select which connected social channel you want to publish this post to:
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handlePublishPlatform('instagram')}
                disabled={isPublishingInstagram || isPublishingFacebook || isPublishingLinkedIn}
                className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isPublishingInstagram ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Publishing to Instagram...</>
                ) : (
                  <>
                    <InstagramIcon className="w-4 h-4" />
                    <span>Publish to Instagram</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handlePublishPlatform('facebook')}
                disabled={isPublishingFacebook || isPublishingInstagram || isPublishingLinkedIn}
                className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs sm:text-sm transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isPublishingFacebook ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Publishing to Facebook...</>
                ) : (
                  <>
                    <FacebookIcon className="w-4 h-4" />
                    <span>Publish to Facebook</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handlePublishPlatform('linkedin')}
                disabled={isPublishingFacebook || isPublishingInstagram || isPublishingLinkedIn}
                className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-[#0A66C2] hover:bg-[#095196] text-white font-bold text-xs sm:text-sm transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isPublishingLinkedIn ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Opening LinkedIn...</>
                ) : (
                  <>
                    <LinkedinIcon className="w-4 h-4" />
                    <span>Publish to LinkedIn</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Notifications */}
      <CornerDialog
        open={!!publishErrorMessage}
        onClose={() => setPublishErrorMessage(null)}
        type="error"
        title="Publish Failed"
        message={publishErrorMessage || ""}
      />

      <CornerDialog
        open={!!publishSuccessMessage}
        onClose={() => setPublishSuccessMessage(null)}
        type="success"
        title="Published Successfully"
        message={publishSuccessMessage || ""}
      />
    </main>
  );
}
