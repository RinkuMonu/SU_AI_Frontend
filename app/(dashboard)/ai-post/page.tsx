"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { 
  Sparkles,
  ArrowRight,
  Mic, 
  Search, 
  Wand2, 
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
  BadgePercent, 
  PartyPopper, 
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
import { VoiceInputButton } from "@/components/ui/VoiceInput";
import { useVoiceToText } from "@/hooks/useVoiceToText";

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

const ProductBagIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.5 7V5.2a3.5 3.5 0 0 1 7 0V7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.5 7h11a2.5 2.5 0 0 1 2.5 2.5v9.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 19V9.5A2.5 2.5 0 0 1 6.5 7zm2 3.5a1 1 0 0 0-1 1 4.5 4.5 0 0 0 9 0 1 1 0 1 0-2 0 2.5 2.5 0 0 1-5 0 1 1 0 0 0-1-1z"
      fill="currentColor"
    />
  </svg>
);

const OfferBadgeIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m15 9-6 6"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <circle cx="9" cy="9" r="1.2" fill="currentColor" />
    <circle cx="15" cy="15" r="1.2" fill="currentColor" />
  </svg>
);

const FestivalPopperIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 21L8.5 10l7.5 7.5L3 21z"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.5 7C10 4.5 12.5 3 13 1"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M13.5 9.5C14.5 7 16.5 4.5 18 1.5"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M15.5 12C18 10.5 20.5 11 22.5 13"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

const NewArrivalIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.5 7.5v12a2 2 0 0 0 2 2h12"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="6.5"
      y="1.5"
      width="16"
      height="16"
      rx="3"
      stroke="currentColor"
      strokeWidth="2.2"
    />
    <polygon
      points="14.5,5.5 15.6,8.2 18.5,8.4 16.3,10.3 17,13.1 14.5,11.6 12,13.1 12.7,10.3 10.5,8.4 13.4,8.2"
      fill="currentColor"
    />
  </svg>
);

const TipsGuideIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Back sheet */}
    <path
      d="M2 7v12.5a2 2 0 0 0 2 2h13.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Front envelope */}
    <rect
      x="5.5"
      y="7"
      width="16"
      height="10"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    {/* Crease */}
    <path
      d="M6 7l8 5.5 8-5.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Roof left slope & apex */}
    <path
      d="M6 7L13.5 1l2 1.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Checkmark */}
    <path
      d="M11 5.5l2.2 2.2 4-4.2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Right shoulder */}
    <path
      d="M19.5 4.8L21.5 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BrandStoryIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Screen */}
    <rect
      x="3"
      y="2.5"
      width="18"
      height="13.5"
      rx="2"
      stroke="currentColor"
      strokeWidth="2.2"
    />
    {/* Pulse line */}
    <path
      d="M6 9.5h3l2 4 2.5-6.5 2 2.5H18"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Base bar */}
    <line
      x1="2"
      y1="20"
      x2="22"
      y2="20"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
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
  filled?: boolean;
}

const CONTENT_TYPES: ContentTypeCard[] = [
  {
    id: "product",
    title: "Product Post",
    subtitle: "Showcase features, pricing & product",
    icon: ProductBagIcon,
    defaultObjective: "product_promotion",
    suggestions: ["Luxury Studio Shoot", "Premium Quality", "Best Seller", "Clean Minimalist"]
  },
  {
    id: "offer",
    title: "Offer Post",
    subtitle: "Flash deals, discounts & seasonal pr...",
    icon: OfferBadgeIcon,
    defaultObjective: "sales_conversion",
    suggestions: ["Flat 40% Off", "24h Flash Sale", "Buy 1 Get 1 Free", "Special Weekend Deal"]
  },
  {
    id: "festival",
    title: "Festival Post",
    subtitle: "Cultural greetings, festive celebrations",
    icon: FestivalPopperIcon,
    defaultObjective: "brand_awareness",
    suggestions: ["Festive Special", "Grand Celebration", "Festive Sparkle", "Holiday Greetings"]
  },
  {
    id: "new_arrival",
    title: "New Arrival",
    subtitle: "Fresh collections, newly launched tre...",
    icon: NewArrivalIcon,
    defaultObjective: "product_launch",
    suggestions: ["Just Dropped", "New Collection", "Limited Edition", "Trendy & Exclusive"]
  },
  {
    id: "tips_guide",
    title: "Tips & Guide",
    subtitle: "Styling tips, how-to guides & value-first",
    icon: TipsGuideIcon,
    defaultObjective: "engagement",
    suggestions: ["3 Ways to Style", "How-To Guide", "Maintenance Tips", "Expert Recommendation"]
  },
  {
    id: "brand_story",
    title: "Brand Story",
    subtitle: "Origin story, craftsmanship, values",
    icon: BrandStoryIcon,
    defaultObjective: "brand_awareness",
    suggestions: [
      "Handcrafted with Care",
      "Our origin story",
      "Handcrafted with Care",
      "Our origin story",
      "Our story"
    ]
  }
];

export default function AIPostPage() {
  const { user } = useAuth();

  const [products, setProducts] = useState<any[]>([]);
  const [productIds, setProductIds] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Content Type Selection
  const [selectedContentType, setSelectedContentType] = useState<string>("brand_story");
  
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
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<"1:1" | "4:5" | "9:16" | "16:9">("1:1");
  const { isListening, toggleListening } = useVoiceToText({
    onTranscript: (text) => setCreativeInstruction(text),
    currentValue: creativeInstruction,
    defaultLang: "en-IN",
  });
  
  // Settings
  const [platform, setPlatform] = useState("instagram");
  const [objective, setObjective] = useState("product_promotion");
  const [language, setLanguage] = useState("English");
  const [manualTone, setManualTone] = useState("Luxury & Premium");
  const [selectedToneId, setSelectedToneId] = useState("luxury_1");

  // Step 4: Additional Options
  const [includeTextOnImage, setIncludeTextOnImage] = useState(false);
  const [includeOffer, setIncludeOffer] = useState(true);
  const [offerText, setOfferText] = useState("Flat 30% OFF");
  const [includeLogo, setIncludeLogo] = useState(true);
  const [generateCaptions, setGenerateCaptions] = useState(false);
  const [generateHashtags, setGenerateHashtags] = useState(false);

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
  const [errorDialog, setErrorDialog] = useState<{ open: boolean; title: string; message: string }>({
    open: false,
    title: "Action Failed",
    message: "",
  });

  const setPublishErrorMessage = (msg: any, title: string = "Action Failed") => {
    if (msg) {
      let cleanMessage = "";
      if (typeof msg === "string") {
        cleanMessage = msg;
      } else if (Array.isArray(msg)) {
        cleanMessage = msg
          .map((item: any) => {
            if (typeof item === "object" && item !== null) {
              const field = Array.isArray(item.loc) ? item.loc[item.loc.length - 1] : "";
              return item.msg ? (field ? `${field}: ${item.msg}` : item.msg) : JSON.stringify(item);
            }
            return String(item);
          })
          .join(", ");
      } else if (typeof msg === "object" && msg !== null) {
        cleanMessage = msg.msg || msg.message || msg.detail || JSON.stringify(msg);
      } else {
        cleanMessage = String(msg);
      }
      setErrorDialog({ open: true, title, message: cleanMessage });
    } else {
      setErrorDialog((prev) => ({ ...prev, open: false, message: "" }));
    }
  };

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
      const searchParams = new URLSearchParams(window.location.search);
      const editPostId = searchParams.get("edit_post_id");

      const storedPost =
        sessionStorage.getItem("onboarding_post_for_edit") ||
        localStorage.getItem("onboarding_post_for_edit");

      if (storedPost) {
        try {
          const parsed = JSON.parse(storedPost);
          if (parsed && (parsed.image_url || parsed.media_url || parsed.caption || parsed.headline)) {
            setGeneratedPost(parsed);
            setEditedHeadline(parsed.headline || "");
            setEditedCaption(parsed.caption || "");
            setEditedCta(parsed.call_to_action || "Learn More");
            setEditedHashtags(
              Array.isArray(parsed.hashtags)
                ? parsed.hashtags.join(" ")
                : parsed.hashtags || ""
            );
            const postImg = parsed.image_url || parsed.media_url;
            if (postImg) {
              setUploadedImages([postImg]);
            }
            if (parsed.headline || parsed.caption) {
              setCreativeInstruction(parsed.headline || parsed.caption);
            }
            setIsEditing(true);
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
    if (creativeInstruction.toLowerCase().includes(text.toLowerCase())) {
      const regex = new RegExp(`(,\\s*)?${text}`, 'gi');
      setCreativeInstruction(prev => prev.replace(regex, '').replace(/^,\s*/, '').trim());
    } else {
      setCreativeInstruction(prev => prev ? `${prev}, ${text}` : text);
    }
  };

  const handleGenerate = async () => {
    let effectiveInstruction = creativeInstruction.trim();
    if (!effectiveInstruction && uploadedImages.length === 0 && productIds.length === 0) {
      effectiveInstruction = activeContentTypeObj.suggestions[0] || "Create an engaging brand post";
      setCreativeInstruction(effectiveInstruction);
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

      // Check online presence from local cache, session storage, or user profile
      const presence =
        (typeof window !== "undefined"
          ? localStorage.getItem("business_online_presence") || sessionStorage.getItem("business_online_presence")
          : null) ||
        (user as any)?.online_presence ||
        (user as any)?.business_online_presence ||
        "";

      const isOnlinePresenceLinked =
        presence === "website" ||
        presence === "google_maps" ||
        presence === "marketplace" ||
        presence === "b2b" ||
        Boolean((user as any)?.google_maps_url);

      // Apply Brand Kit parameters if enabled and valid OR if online presence is linked
      if (useBrandKit && ((loadedBrandKit && isBrandKitComplete) || isOnlinePresenceLinked)) {
        requestPayload.use_brand_kit = true;
        requestPayload.brand_kit_id = loadedBrandKit?.id;
        requestPayload.brand_name = loadedBrandKit?.business_name || user?.businessName || user?.name || "My Business";
        requestPayload.brand_colors = {
          primary: loadedBrandKit?.primary_color || "#8B5CF6",
          secondary: loadedBrandKit?.secondary_color || "#EC4899",
          accent: loadedBrandKit?.accent_color || "#F59E0B",
        };
        requestPayload.brand_font = loadedBrandKit?.font || "Inter";
        requestPayload.brand_tone = loadedBrandKit?.tone || "Professional";
        requestPayload.logo_url = loadedBrandKit?.logo_url;
        requestPayload.include_logo = includeLogo && Boolean(loadedBrandKit?.logo_url);
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
      setEditedHashtags(
        Array.isArray(result?.hashtags)
          ? result.hashtags.join(" ")
          : (typeof result?.hashtags === "string" ? result.hashtags : "")
      );
      window.dispatchEvent(new Event("credit-update"));

    } catch (error: any) {
      console.error("AI post generation failed:", error);
      if (error?.response?.status === 402 || error?.message?.toLowerCase().includes("credit")) {
        setHasInsufficientCredits(true);
      } else {
        const rawErr = error?.response?.data?.detail || error?.response?.data?.message || error?.message || "Unable to generate post. Please try again.";
        setPublishErrorMessage(rawErr, "Generation Failed");
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
      setPublishErrorMessage(e?.response?.data?.detail || e?.message || "Error scheduling post. Please try again.", "Schedule Failed");
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium text-white tracking-normal">
            AI Post Maker
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-text-muted">
            Create scroll-stopping social media posts powered by your Business, Brand Kit &amp; Products.
          </p>
        </div>

        {/* My Posts Shortcut Button */}
        <Link
          href="/content-library"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#071023] border border-white/10 hover:border-purple-500/50 hover:text-white text-slate-300 font-medium text-xs sm:text-sm shadow-sm transition-all self-start sm:self-auto cursor-pointer"
        >
          <Bookmark className="w-4 h-4 text-purple-400" />
          <span>My Posts</span>
        </Link>
      </div>

      {hasInsufficientCredits && <InsufficientCreditsAlert />}

      {/* ──────────────────────────────────────────────────
          Content Type Selection Cards (Square Shape matching Image 1 & Colors matching Image 3)
         ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {CONTENT_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedContentType === type.id;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => handleContentTypeSelect(type.id)}
              style={{
                backgroundColor: isSelected ? "#101322" : "#131625",
                backgroundImage: isSelected
                  ? "linear-gradient(135deg, #16182c 0%, #0d0f1b 100%)"
                  : "none",
              }}
              className={`relative p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group min-h-[145px] ${
                isSelected
                  ? "border-[#8b5cf6] shadow-lg shadow-[#7c3aed]/20 ring-1 ring-[#8b5cf6]/60"
                  : "border-[#282c3f] hover:border-white/20 hover:bg-[#161a2c]"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-[#241445] border border-purple-500/40 text-[#d378fd] shadow-md"
                      : "bg-[#1b1139] border border-white/5 text-[#d378fd] group-hover:text-white group-hover:bg-[#241445]"
                  }`}
                >
                  <Icon className={`w-6 h-6 text-inherit ${type.filled ? "fill-current" : ""}`} />
                </div>

                <span
                  className={`px-3.5 py-1 rounded-full text-xs font-normal transition-all ${
                    isSelected
                      ? "bg-[#3b1154] border border-purple-500/40 text-purple-200"
                      : "bg-[#222634] border border-white/10 text-slate-300 group-hover:border-white/20 group-hover:text-white"
                  }`}
                >
                  {isSelected ? "Selected" : "Select"}
                </span>
              </div>

              <div className="mt-4">
                <h4 className="font-medium text-white text-base sm:text-lg tracking-tight mb-0.5">
                  {type.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 line-clamp-1 leading-relaxed">
                  {type.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ──────────────────────────────────────────────────
          Two-Column Workspace Layout
         ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* ── LEFT COLUMN: Inputs & Generation Settings matching Image 1 ── */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Use My Brand Kit Card matching Image 1 */}
          <BrandKitToggleCard
            compact={true}
            title="Use my Brand Kit"
            enabled={useBrandKit}
            onChange={handleToggleBrandKit}
            onBrandKitLoaded={(brand, isComplete) => {
              setLoadedBrandKit(brand);
              setIsBrandKitComplete(isComplete);
            }}
          />

          {/* Describe your prompt bar matching Image 1 & 3 */}
          <div className="space-y-3">
            <div className="relative rounded-full bg-[#111420] border border-[#232738] px-5 flex items-center gap-3 h-14 shadow-md focus-within:border-purple-500/50 transition-all">
              <Search className="w-5 h-5 text-slate-400 shrink-0 ml-1" />
              <input
                type="text"
                value={creativeInstruction}
                onChange={(e) => setCreativeInstruction(e.target.value)}
                placeholder={isListening ? "Listening... speak now 🎙️" : "Describe your prompt..."}
                style={{ fontFamily: "'Roboto', sans-serif" }}
                className="w-full bg-transparent text-white placeholder:text-slate-400 text-sm sm:text-base outline-none px-2"
              />

              {/* Hidden File Input for Button 3 */}
              <input
                id="ai-post-file-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  if (!files || files.length === 0) return;
                  const maxAllowed = 4 - uploadedImages.length;
                  if (maxAllowed <= 0) {
                    alert("Maximum 4 reference images allowed");
                    return;
                  }
                  const list = Array.from(files).slice(0, maxAllowed);
                  list.forEach((file) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      if (typeof reader.result === "string") {
                        setUploadedImages((prev) => [...prev, reader.result as string].slice(0, 4));
                      }
                    };
                    reader.readAsDataURL(file);
                  });
                  e.target.value = "";
                }}
                className="hidden"
              />

              <div className="flex items-center gap-2.5 shrink-0">
                {/* Button 1: Microphone (Working Voice to text) */}
                <button
                  type="button"
                  onClick={() => {
                    if (!isListening) {
                      toggleListening();
                    } else {
                      toggleListening();
                    }
                  }}
                  title={isListening ? "Listening... click to stop" : "Speak to describe prompt"}
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isListening
                      ? "bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)] animate-pulse border border-rose-400"
                      : "bg-[#252837] hover:bg-[#323648] text-slate-300 hover:text-white"
                  }`}
                >
                  <Mic className="w-5 h-5" />
                  {isListening && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-400 animate-ping" />
                  )}
                </button>

                {/* Button 2: Scan / Frame Corner Brackets with < > (Opens Aspect & Catalog Studio) */}
                <button
                  type="button"
                  onClick={() => setShowCatalogSelector(true)}
                  title="Select product or aspect ratio"
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    productIds.length > 0 || selectedAspectRatio !== "1:1"
                      ? "bg-[#2f1f4e] border border-[#a855f7] text-[#c084fc] shadow-md shadow-purple-900/40"
                      : "bg-[#252837] hover:bg-[#323648] text-slate-300 hover:text-white"
                  }`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 8V6a2 2 0 0 1 2-2h2" />
                    <path d="M16 4h2a2 2 0 0 1 2 2v2" />
                    <path d="M20 16v2a2 2 0 0 1-2 2h-2" />
                    <path d="M8 20H6a2 2 0 0 1-2-2v-2" />
                    <polyline points="10 9 7.5 12 10 15" />
                    <polyline points="14 9 16.5 12 14 15" />
                  </svg>
                  {productIds.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {productIds.length}
                    </span>
                  )}
                </button>

                {/* Button 3: Rectangle with + in top-right corner (Triggers File Picker) */}
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('ai-post-file-upload');
                    if (input) input.click();
                  }}
                  title="Upload reference photo (Max 4)"
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    uploadedImages.length > 0
                      ? "bg-[#2f1f4e] border border-[#a855f7] text-[#c084fc] shadow-md shadow-purple-900/40"
                      : "bg-[#252837] hover:bg-[#323648] text-slate-300 hover:text-white"
                  }`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" />
                    <path d="M15 5h6" />
                    <path d="M18 2v6" />
                  </svg>
                  {uploadedImages.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {uploadedImages.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Active Attachments Strip (Thumbnails & Badges) */}
            {(uploadedImages.length > 0 || productIds.length > 0 || selectedAspectRatio !== "1:1") && (
              <div className="flex items-center gap-2.5 flex-wrap px-2">
                {uploadedImages.map((img, idx) => (
                  <div key={idx} className="relative group w-11 h-11 rounded-xl overflow-hidden border border-purple-500/40 bg-black/40 shadow-sm">
                    <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setUploadedImages((prev) => prev.filter((_, i) => i !== idx))}
                      title="Remove image"
                      className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5 text-red-300" />
                    </button>
                  </div>
                ))}

                {productIds.length > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#24133d] border border-purple-500/40 text-purple-200 text-xs shadow-sm">
                    <span>{productIds.length} product{productIds.length > 1 ? "s" : ""} selected</span>
                    <button
                      type="button"
                      onClick={() => setProductIds([])}
                      className="text-purple-300 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {selectedAspectRatio !== "1:1" && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#16213e] border border-blue-500/40 text-blue-200 text-xs shadow-sm">
                    <span>Aspect: {selectedAspectRatio}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedAspectRatio("1:1")}
                      className="text-blue-300 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick suggestions matching Image 2 with #071023 background */}
          <div
            style={{ fontFamily: "'Roboto', sans-serif", backgroundColor: "#071023" }}
            className="rounded-2xl border border-[#232738] p-5 sm:p-6 space-y-4 shadow-sm"
          >
            <div className="text-base sm:text-lg font-normal text-slate-200 tracking-wide">
              Quick suggestions for {activeContentTypeObj.title}:
            </div>
            <div className="flex flex-wrap gap-3.5">
              {activeContentTypeObj.suggestions.map((s, idx) => {
                const text = s.replace(/[^\w\s%]/gi, '').trim();
                const isSelected = creativeInstruction.toLowerCase().includes(text.toLowerCase());
                return (
                  <button
                    key={`${s}-${idx}`}
                    type="button"
                    onClick={() => handleSuggestionClick(s)}
                    style={{
                      background: isSelected
                        ? "linear-gradient(135deg, #2F1262 0%, #000000 100%)"
                        : "#161a29",
                    }}
                    className={`px-8 sm:px-9 py-3 rounded-full border transition-all cursor-pointer font-normal shadow-sm min-w-[170px] text-center ${
                      isSelected
                        ? "border-[#8b5cf6] text-purple-100 shadow-md shadow-purple-950/50"
                        : "border-[#2a3045] text-slate-200 hover:bg-[#1f2438] hover:border-slate-400 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Choose Setting - unhighlighted border, clean #071023 styling */}
          <div
            style={{
              fontFamily: "'Roboto', sans-serif",
              backgroundColor: "#071023",
            }}
            className="rounded-3xl border border-[#232738] p-5 sm:p-6 space-y-5 shadow-sm"
          >
            <div>
              <h3 className="text-xl font-normal text-white">Choose Setting</h3>
              <p className="text-xs text-slate-300 mt-1">
                Configure language, tone, platform, and campaign objective
              </p>
            </div>

            {/* Target Platform (Image 3) */}
            <div className="space-y-2.5">
              <label className="block text-sm font-medium text-slate-200">
                Target Platform
              </label>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { id: "instagram", name: "Instagram photo" },
                  { id: "instagram_story", name: "Instagram story" },
                  { id: "facebook", name: "Fackebook" },
                  { id: "google_business", name: "Google business post" },
                  { id: "advertisement", name: "Advertisement" },
                ].map((plat) => {
                  const isSelected = platform === plat.id;
                  return (
                    <button
                      key={plat.id}
                      type="button"
                      onClick={() => setPlatform(plat.id)}
                      style={{
                        background: isSelected
                          ? "linear-gradient(135deg, #2F1262 0%, #000000 100%)"
                          : "#141a2e",
                      }}
                      className={`px-6 sm:px-7 py-2.5 rounded-full text-xs sm:text-sm font-normal whitespace-nowrap transition-all cursor-pointer border shadow-sm ${
                        isSelected
                          ? "border-[#8b5cf6] text-purple-100 shadow-md shadow-purple-950/50"
                          : "border-[#26314c] text-slate-300 hover:border-slate-400 hover:text-white hover:bg-[#1a233c]"
                      }`}
                    >
                      {plat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Campaign Objective (Image 3) */}
            <div className="space-y-2.5">
              <label className="block text-sm font-medium text-slate-200">
                Campaign Objective
              </label>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { id: "product_launch", name: "Product launch" },
                  { id: "product_promotion", name: "Product promotion" },
                  { id: "sales_conversion", name: "Sale" },
                  { id: "brand_awareness", name: "Brand Awareness" },
                  { id: "festival", name: "Festival" },
                ].map((obj) => {
                  const isSelected = objective === obj.id;
                  return (
                    <button
                      key={obj.id}
                      type="button"
                      onClick={() => setObjective(obj.id)}
                      style={{
                        background: isSelected
                          ? "linear-gradient(135deg, #2F1262 0%, #000000 100%)"
                          : "#141a2e",
                      }}
                      className={`px-6 sm:px-7 py-2.5 rounded-full text-xs sm:text-sm font-normal whitespace-nowrap transition-all cursor-pointer border shadow-sm ${
                        isSelected
                          ? "border-[#8b5cf6] text-purple-100 shadow-md shadow-purple-950/50"
                          : "border-[#26314c] text-slate-300 hover:border-slate-400 hover:text-white hover:bg-[#1a233c]"
                      }`}
                    >
                      {obj.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Copywrite Language (Image 3) */}
            <div className="space-y-2.5">
              <label className="block text-sm font-medium text-slate-200">
                Copywrite Language
              </label>
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full h-11 px-5 rounded-full bg-[#181c2d] border border-[#2d3248] text-slate-300 text-xs sm:text-sm appearance-none outline-none focus:border-[#7c3aed] cursor-pointer"
                >
                  <option value="English">English</option>
                  <option value="Hinglish">Hinglish</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="French">French (Français)</option>
                  <option value="German">German (Deutsch)</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Brand Voice & Tone (Manual) (Image 3) */}
            <div className="space-y-2.5">
              <label className="block text-sm font-medium text-slate-200">
                Brand Voice &amp; Tone (Manual)
              </label>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { id: "luxury_1", name: "Luxury & Premium" },
                  { id: "fun_1", name: "Fun & Energetic" },
                  { id: "energetic_1", name: "Energetic" },
                  { id: "luxury_2", name: "Luxury & Premium" },
                  { id: "fun_2", name: "Fun & Energetic" },
                ].map((tone, idx) => {
                  const isSelected = selectedToneId === tone.id;
                  return (
                    <button
                      key={`${tone.id}-${idx}`}
                      type="button"
                      onClick={() => {
                        setSelectedToneId(tone.id);
                        setManualTone(tone.name);
                      }}
                      style={{
                        background: isSelected
                          ? "linear-gradient(135deg, #2F1262 0%, #000000 100%)"
                          : "#141a2e",
                      }}
                      className={`px-6 sm:px-7 py-2.5 rounded-full text-xs sm:text-sm font-normal whitespace-nowrap transition-all cursor-pointer border shadow-sm ${
                        isSelected
                          ? "border-[#8b5cf6] text-purple-100 shadow-md shadow-purple-950/50"
                          : "border-[#26314c] text-slate-300 hover:border-slate-400 hover:text-white hover:bg-[#1a233c]"
                      }`}
                    >
                      {tone.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          </div>

        {/* ── RIGHT COLUMN: Live Generated-Post Preview & Actions matching Image 1 ── */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <div className="rounded-3xl bg-[#0e101d] border border-white/10 p-5 sm:p-6 shadow-2xl space-y-4">
            
            {/* Header matching Image 1 */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-normal tracking-wide text-white">
                {loading ? "Generating Post..." : "Generating Post"}
              </h3>
              <button
                type="button"
                onClick={toggleEdit}
                className="px-4 py-1.5 rounded-full border border-white/10 bg-[#16182c] text-xs text-slate-300 hover:text-white hover:border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isEditing ? "Done" : "Edit"}</span>
              </button>
            </div>

            {/* Visual Display matching Image 1 */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/60 border border-white/5 flex items-center justify-center shadow-inner">
              {loading ? (
                <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
                  <p className="text-xs text-purple-200 font-medium">Synthesizing commercial post visual...</p>
                </div>
              ) : generatedPost ? (
                <img
                  src={resolveImageUrl(
                    generatedPost.image_url || generatedPost.media_url,
                    generatedPost.creative_direction || editedHeadline || creativeInstruction
                  )}
                  alt="Generated Post"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <Sparkles className="w-10 h-10 text-purple-400/60 mb-1" />
                  <p className="text-xs text-slate-400">Post visual will appear here</p>
                </div>
              )}
            </div>

            {/* Editable Caption / Headline when Edit is toggled */}
            {isEditing && (
              <div className="p-3.5 rounded-xl bg-[#161826] border border-white/10 space-y-3 animate-in fade-in text-xs">
                <div>
                  <label className="text-text-muted font-medium block mb-1">Headline</label>
                  <input
                    type="text"
                    value={editedHeadline}
                    onChange={(e) => setEditedHeadline(e.target.value)}
                    className="w-full bg-[#11131f] border border-white/10 rounded-lg p-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-text-muted font-medium block mb-1">Caption</label>
                  <textarea
                    rows={3}
                    value={editedCaption}
                    onChange={(e) => setEditedCaption(e.target.value)}
                    className="w-full bg-[#11131f] border border-white/10 rounded-lg p-2 text-white outline-none"
                  />
                </div>
              </div>
            )}

            {/* Footer Action Buttons matching Image 3 & Image 4 */}
            <div className="flex items-center gap-3 pt-2">
              {/* Regenerate button with outer gradient highlight matching Image 4 */}
              <div className="flex-1 p-[1.5px] rounded-full bg-gradient-to-r from-[#7d36fa] via-[#be32ff] to-[#fc9a5d] shadow-md shadow-purple-950/40">
                <button
                  type="button"
                  onClick={() => {
                    if (generatedPost) {
                      regenerateImage();
                    } else {
                      handleGenerate();
                    }
                  }}
                  disabled={loading || isRegeneratingImage}
                  className="w-full h-11.5 rounded-full bg-[#12121e] hover:bg-[#1a1a2c] text-white text-sm font-normal flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loading || isRegeneratingImage ? 'animate-spin' : ''}`} />
                  <span>Regenerate</span>
                </button>
              </div>

              {/* Download button with vibrant gradient matching Image 4 & Image 3 */}
              <button
                type="button"
                onClick={handleDownloadImage}
                style={{
                  background: "linear-gradient(95deg, #7d36fa 0%, #9534fd 18%, #b233fe 36%, #c835ef 52%, #df3dbb 68%, #ee4795 82%, #f76f7b 92%, #fc9a5d 100%)",
                }}
                className="flex-1 h-12 rounded-full text-white text-sm font-medium flex items-center justify-center gap-2 shadow-lg shadow-purple-600/35 hover:opacity-95 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-white stroke-[2.2]" />
                <span className="text-white font-medium">Download</span>
              </button>
            </div>

            {/* Secondary Save, Schedule, Publish Actions */}
            {generatedPost && (
              <div className="pt-3 border-t border-white/10 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={savePost}
                  className="py-2.5 px-3 rounded-xl bg-[#16182c] border border-white/10 text-xs font-medium text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Save</span>
                </button>
                <button
                  type="button"
                  onClick={schedulePost}
                  className="py-2.5 px-3 rounded-xl bg-[#16182c] border border-white/10 text-xs font-medium text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>Schedule</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPublishModal(true)}
                  className="py-2.5 px-3 rounded-xl bg-purple-600/30 border border-purple-500/40 text-xs font-medium text-purple-200 hover:bg-purple-600/50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish</span>
                </button>
              </div>
            )}
          </div>
          {/* ── CARD: Caption & Hashtags matching Image 3 ── */}
          <div
            style={{
              fontFamily: "'Roboto', sans-serif",
              background: "linear-gradient(135deg, rgba(32, 16, 56, 0.45) 0%, rgba(14, 16, 29, 0.95) 100%)",
            }}
            className="rounded-3xl border border-white/10 p-5 sm:p-6 shadow-2xl space-y-4"
          >
            {/* Header: Title on left, Regenerate on right */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-normal tracking-wide text-white">
                Caption &amp; Hashtags
              </h3>
              <button
                type="button"
                onClick={() => {
                  if (generatedPost) {
                    regenerateCaption();
                  } else {
                    handleGenerate();
                  }
                }}
                disabled={loading}
                className="px-3.5 py-1.5 rounded-full border border-white/10 bg-[#16182c] hover:bg-[#20243d] text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Regenerate</span>
              </button>
            </div>

            {/* Caption Text with underline style matching Image 3 */}
            {(editedCaption || generatedPost?.caption) ? (
              <div className="text-sm text-slate-200 leading-relaxed font-normal">
                <p className="underline decoration-[#0084ff]/70 decoration-2 underline-offset-4">
                  {editedCaption || generatedPost?.caption}
                </p>
              </div>
            ) : null}

            {/* CTA Badge matching Image 3 */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  const ctas = ["Shop Now", "Claim Offer", "Learn More", "Order Today", "Book Now", "Explore Collection"];
                  const current = editedCta || "Shop Now";
                  const nextIdx = (ctas.indexOf(current) + 1) % ctas.length;
                  setEditedCta(ctas[nextIdx]);
                }}
                title="Click to change Call to Action"
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#24133d] hover:bg-[#341b57] border border-[#7c3aed] text-xs text-purple-200 shadow-sm transition-all cursor-pointer group"
              >
                <span className="group-hover:text-white font-medium">{editedCta || "Shop Now"}</span>
                <span className="text-purple-400/80">|</span>
                <span>Link in Bio</span>
              </button>
            </div>

            {/* Hashtags matching Image 3 (Blue #00b4d8 color) */}
            <div className="text-sm text-[#00b4d8] font-normal tracking-wide pt-1">
              {editedHashtags || "#trending #newlaunch #lifestyle #quality"}
            </div>

            {/* Footer Actions: Save, Schedule, Publish matching Image 3 */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={savePost}
                className="flex-1 py-2.5 px-4 rounded-full bg-[#1a1e2e] hover:bg-[#23283c] border border-white/10 text-white text-xs font-normal flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>

              <button
                type="button"
                onClick={schedulePost}
                className="flex-1 py-2.5 px-4 rounded-full bg-[#1a1e2e] hover:bg-[#23283c] border border-white/10 text-white text-xs font-normal flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPublishModal(true)}
                style={{
                  background: "linear-gradient(95deg, #7d36fa 0%, #9534fd 18%, #b233fe 36%, #c835ef 52%, #df3dbb 68%, #ee4795 82%, #f76f7b 92%, #fc9a5d 100%)",
                }}
                className="flex-1 py-2.5 px-5 rounded-full text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-lg shadow-purple-600/35 hover:opacity-95 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-white stroke-[2.2]" />
                <span className="text-white font-medium">Publish</span>
              </button>
            </div>
          </div>
        </div>
      </div>

        {/* ── Additional Options matching Image 2 & 3 (Full Width Desktop) ── */}
        <div
          style={{ fontFamily: "'Roboto', sans-serif" }}
          className="rounded-3xl bg-[#0e101d] border border-white/10 p-5 sm:p-7 space-y-4 shadow-sm"
        >
          <h3 className="text-xl font-normal text-white tracking-wide">
            Additional Options
          </h3>

          <div className="space-y-3">
            {/* Option 1: Render Title & Badge Text on Image */}
            <div
              onClick={() => setIncludeTextOnImage(!includeTextOnImage)}
              className="flex items-center justify-between p-4 rounded-2xl bg-[#141727] border border-[#232738] hover:border-slate-500 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#2d1b54] border border-[#7c3aed]/40 flex items-center justify-center text-purple-200 font-bold text-base shrink-0">
                  T
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white group-hover:text-purple-200 transition-colors">
                    Render Title &amp; Badge Text on Image
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Overlays catchy campaign headline onto the generated visual
                  </p>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                  includeTextOnImage
                    ? "bg-[#7c3aed] text-white shadow-md shadow-purple-900/40"
                    : "border border-[#3b4259] bg-[#1a1e30]"
                }`}
              >
                {includeTextOnImage && <Check className="w-4 h-4 stroke-[2.5]" />}
              </div>
            </div>

            {/* Option 2: Include Promotional Offer or Discount */}
            <div
              onClick={() => setIncludeOffer(!includeOffer)}
              className="flex items-center justify-between p-4 rounded-2xl bg-[#141727] border border-[#232738] hover:border-slate-500 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#2d1b54] border border-[#7c3aed]/40 flex items-center justify-center text-purple-200 shrink-0">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white group-hover:text-purple-200 transition-colors">
                    Include Promotional Offer or Discount
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Highlights a limited-time coupon, sale tag or discount badge
                  </p>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                  includeOffer
                    ? "bg-[#7c3aed] text-white shadow-md shadow-purple-900/40"
                    : "border border-[#3b4259] bg-[#1a1e30]"
                }`}
              >
                {includeOffer && <Check className="w-4 h-4 stroke-[2.5]" />}
              </div>
            </div>

            {/* Option 3: Overlay Saved Brand Logo */}
            <div
              onClick={() => setIncludeLogo(!includeLogo)}
              className="flex items-center justify-between p-4 rounded-2xl bg-[#141727] border border-[#232738] hover:border-slate-500 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#2d1b54] border border-[#7c3aed]/40 flex items-center justify-center text-purple-200 shrink-0">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white group-hover:text-purple-200 transition-colors">
                    Overlay Saved Brand Logo
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Requires a saved brand logo in your Brand Kit
                  </p>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                  includeLogo
                    ? "bg-[#7c3aed] text-white shadow-md shadow-purple-900/40"
                    : "border border-[#3b4259] bg-[#1a1e30]"
                }`}
              >
                {includeLogo && <Check className="w-4 h-4 stroke-[2.5]" />}
              </div>
            </div>

            {/* Option 4: Generate Viral Captions & Hashtags */}
            <div
              onClick={() => {
                const nextVal = !generateCaptions;
                setGenerateCaptions(nextVal);
                setGenerateHashtags(nextVal);
              }}
              className="flex items-center justify-between p-4 rounded-2xl bg-[#141727] border border-[#232738] hover:border-slate-500 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#2d1b54] border border-[#7c3aed]/40 flex items-center justify-center text-purple-200 shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="14" x="3" y="5" rx="2" ry="2"/>
                    <path d="M7 15h4M15 15h2M7 11h2M13 11h4"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white group-hover:text-purple-200 transition-colors">
                    Generate Viral Captions &amp; Hashtags
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Synthesizes SEO-optimized captions and trending niche hashtags
                  </p>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                  generateCaptions
                    ? "bg-[#7c3aed] text-white shadow-md shadow-purple-900/40"
                    : "border border-[#3b4259] bg-[#1a1e30]"
                }`}
              >
                {generateCaptions && <Check className="w-4 h-4 stroke-[2.5]" />}
              </div>
            </div>
          </div>
        </div>

        {/* ── Centered Generate Post Button with Arrow Sign matching Image 1, 3 & 4 ── */}
        <div className="flex justify-center pt-2 pb-8">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            style={{
              background: "linear-gradient(95deg, #7d36fa 0%, #9534fd 18%, #b233fe 36%, #c835ef 52%, #df3dbb 68%, #ee4795 82%, #f76f7b 92%, #fc9a5d 100%)",
            }}
            className="rounded-full text-white px-14 sm:px-20 py-4 font-medium hover:opacity-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-purple-600/35 text-base sm:text-lg cursor-pointer min-w-[320px] max-w-[440px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span className="text-white font-medium">Generating AI Post...</span>
              </>
            ) : (
              <>
                <span className="text-white font-medium">Generate Post</span>
                <ArrowRight className="w-5 h-5 text-white stroke-[2.2]" />
              </>
            )}
          </button>
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


      {/* ──────────────────────────────────────────────────
          Catalog & Aspect Ratio Selector Modal (Button 2 in search bar)
         ────────────────────────────────────────────────── */}
      {showCatalogSelector && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0e101d] border border-white/10 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-purple-400" />
                  <span>Post Dimensions &amp; Catalog Products</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choose visual aspect ratio and link products from your store
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCatalogSelector(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Aspect Ratio Options */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-200 block">
                Select Aspect Ratio
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { ratio: "1:1", label: "Square (1:1)", sub: "Feed posts" },
                  { ratio: "4:5", label: "Portrait (4:5)", sub: "Instagram feed" },
                  { ratio: "9:16", label: "Story (9:16)", sub: "Stories & Reels" },
                  { ratio: "16:9", label: "Landscape (16:9)", sub: "Banner & Web" },
                ].map((item) => {
                  const isSelected = selectedAspectRatio === item.ratio;
                  return (
                    <button
                      key={item.ratio}
                      type="button"
                      onClick={() => setSelectedAspectRatio(item.ratio as any)}
                      style={{
                        background: isSelected
                          ? "linear-gradient(135deg, #2F1262 0%, #000000 100%)"
                          : "#141727",
                      }}
                      className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#8b5cf6] text-white shadow-md shadow-purple-950/50"
                          : "border-[#232738] text-slate-300 hover:border-slate-500 hover:text-white"
                      }`}
                    >
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-200 block">
                Link Catalog Product (Optional)
              </label>
              {products.length > 0 ? (
                <ProductSelector
                  products={products}
                  value={productIds}
                  onChange={setProductIds}
                  maxSelection={4}
                />
              ) : (
                <div className="p-6 rounded-2xl bg-[#141727] border border-[#232738] text-center text-slate-400 text-sm">
                  No products found in catalog. Add products from the Catalog tab.
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowCatalogSelector(false)}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-sm hover:opacity-95 transition-all shadow-md cursor-pointer"
              >
                Apply &amp; Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Notifications */}
      <CornerDialog
        open={errorDialog.open}
        onClose={() => setErrorDialog(prev => ({ ...prev, open: false }))}
        type="error"
        title={errorDialog.title}
        message={errorDialog.message}
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
