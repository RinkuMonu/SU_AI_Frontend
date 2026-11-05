"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Upload,
  Paperclip,
  Mic,
  Sparkles,
  Palette,
  Type,
  Store,
  Users,
  Building,
  Check,
  X,
  Loader2,
  AlertCircle,
  Download,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Eye,
  ZoomIn,
  Sliders,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Save,
  HelpCircle,
  Layers,
  Wand2,
  Circle,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { VoiceInputButton } from "@/components/ui/VoiceInput";
import { useRouter } from "next/navigation";
import {
  getBrandKit,
  createBrandKit,
  updateBrandKit,
  uploadBrandLogo,
  generateBrandLogo,
} from "@/services/brand.service";
import { businessService } from "@/services/business.service";
import { userService } from "@/services/user.service";
import { BrandKit, BrandCreate, AILogoVariationItem } from "@/types/brand";
import { Business } from "@/types";
import { LiveColorPicker, ColorScheme } from "./LiveColorPicker";
import { aiService, WebsiteAnalysisData } from "@/services/ai.service";
import { setFormInteractionBusy } from "@/lib/popup-coordinator";
import {
  SUPPORTED_FONTS,
  BUSINESS_TYPES,
  BUSINESS_MODELS,
  SELLING_MODELS,
  BUSINESS_CATEGORIES,
  AUDIENCE_AGE_GROUPS,
  GENDER_OPTIONS,
  CUSTOMER_TYPES,
  LOCATION_FOCUS_OPTIONS,
  CURATED_COLOR_PRESETS,
  calculateBrandKitCompletion,
  createSvgLogoFallback,
} from "@/lib/brand-kit";

export interface BrandKitRegistrationModalProps {
  onBack?: () => void;
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  isModal?: boolean; // true if overlay popup, false if embedded page
  initialStep?: StepId;
  onStepChange?: (step: StepId) => void;
}


const SUB_CATEGORIES_MAP: Record<string, string[]> = {
  clothing: [
    "Men's Wear",
    "Women's Ethnic & Western",
    "Kids & Baby Wear",
    "Footwear & Shoes",
    "Activewear & Sportswear",
    "Accessories & Bags",
  ],
  jewellery: [
    "Gold & Diamond Jewellery",
    "Fashion & Imitation Jewellery",
    "Silver Articles & Ornaments",
    "Bridal & Wedding Collection",
    "Watches & Accessories",
  ],
  restaurant: [
    "Fine Dining & Family Restaurant",
    "Cafe & Coffee Shop",
    "Bakery, Cakes & Desserts",
    "Fast Food & Street Food",
    "Cloud Kitchen / Delivery Only",
    "Bar & Lounge",
  ],
  salon: [
    "Unisex Salon & Hair Studio",
    "Bridal Makeup Studio",
    "Luxury Spa & Wellness",
    "Nail & Lash Art Studio",
    "Skin & Dermatology Care",
  ],
  electronics: [
    "Smartphones & Tablets",
    "Laptops & Computers",
    "Home Appliances & TV",
    "Audio & Headphones",
    "Smart Gadgets & Wearables",
  ],
  grocery: [
    "Supermarket & Departmental",
    "Organic & Farm Fresh",
    "Dairy, Milk & Ice Cream",
    "Gourmet & Imported Foods",
  ],
  fitness: [
    "Gym & Fitness Center",
    "Yoga & Meditation Studio",
    "Crossfit & Strength Training",
    "Zumba & Dance Fitness",
    "Sports Club & Academy",
  ],
  real_estate: [
    "Residential Apartments & Flats",
    "Commercial & Office Spaces",
    "Luxury Villas & Plots",
    "Interior Design & Architecture",
  ],
  doctor: [
    "Dental Clinic & Implantology",
    "Dermatology & Cosmetology",
    "Eye Care & Opticals",
    "Pediatrics & Child Care",
    "Multi-speciality Clinic",
    "Pharmacy & Diagnostic Lab",
  ],
  education: [
    "Competitive Exam Coaching (JEE/NEET/UPSC)",
    "K-12 School Tuitions",
    "Language & Communication Academy",
    "Skill Development & Tech Bootcamps",
    "Music & Arts School",
  ],
};

const DEFAULT_SUB_CATEGORIES = [
  "Retail & Consumer Goods",
  "Premium & Luxury Products",
  "Budget & Everyday Value",
  "Custom & Tailored Solutions",
  "Services & Consultation",
  "Online & Direct Delivery",
];

// 10 Curated AI Logo Styles
function StoreGradientIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="storeBadgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fc9a5d" />
          <stop offset="100%" stopColor="#f0449b" />
        </linearGradient>
      </defs>
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" stroke="url(#storeBadgeGrad)" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" stroke="url(#storeBadgeGrad)" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" stroke="url(#storeBadgeGrad)" />
      <path d="M2 7h20" stroke="url(#storeBadgeGrad)" />
      <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" stroke="url(#storeBadgeGrad)" />
    </svg>
  );
}

export const LOGO_STYLES = [
  { id: "minimalist_modern", label: "Minimalist Modern", desc: "Clean geometric vector icon & iconic silhouette" },
  { id: "luxury_premium", label: "Premium Luxury", desc: "Regal gold crest, elegant symmetry & boutique luxury" },
  { id: "3d_dimensional", label: "3D & Dimensional", desc: "Smooth ceramic & metallic textures with soft ambient depth" },
  { id: "tech_futuristic", label: "Tech & Futuristic", desc: "Cybernetic nodes, electric neon & cutting-edge AI" },
  { id: "organic_natural", label: "Organic & Natural", desc: "Botanical leaves, flowing curves & eco-friendly green" },
  { id: "bold_playful", label: "Bold & Playful", desc: "Vibrant pop geometry, energetic curves & creative spirit" },
  { id: "mascot_illustrated", label: "Mascot & Character", desc: "Friendly expressive character with bold vector outlines" },
  { id: "geometric_abstract", label: "Geometric & Abstract", desc: "Golden ratio lines, isometric precision & modern mark" },
  { id: "elegant_monogram", label: "Monogram & Typography", desc: "Sophisticated initials with luxury fashion ligatures" },
  { id: "emblem_badge", label: "Heritage Seal / Badge", desc: "Vintage circular seal, delicate filigree & authentic stamp" },
];

export const BRAND_TONES = [
  "Professional & Trustworthy",
  "Luxury & High-End",
  "Friendly & Approachable",
  "Modern & Innovative",
  "Bold & Disruptive",
  "Artisanal & Natural",
];

type StepId = "basics" | "logo" | "identity" | "audience" | "review";

export function BrandKitRegistrationModal({
  isOpen,
  onClose,
  onComplete,
  isModal = true,
  onBack,
  initialStep = "basics",
  onStepChange,
}: BrandKitRegistrationModalProps) {
  const { user } = useAuth();
  const router = useRouter();
  const isDummyName = (str?: string | null) => {
    if (!str) return true;
    const s = str.toLowerCase().trim();
    return s.includes("user's brand") || s.includes("user’s brand") || s.includes("'s brand") || s.includes("’s brand") || s === "my business";
  };
  const isDummyWeb = (str?: string | null) => {
    if (!str) return true;
    const s = str.toLowerCase().trim();
    return s.includes("zudio") || s.includes("example.com");
  };
  const isDummyDesc = (str?: string | null) => {
    if (!str) return true;
    const s = str.toLowerCase().trim();
    return s.includes("verified online business presence") || s === "description";
  };


  // Active Wizard Step
  const [currentStep, setCurrentStep] = useState<StepId>(initialStep || "basics");

  useEffect(() => {
    if (initialStep) {
      setCurrentStep(initialStep);
    }
  }, [initialStep]);

  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, [currentStep, onStepChange]);

  // Existing Data States
  const [existingBrand, setExistingBrand] = useState<BrandKit | null>(null);
  const [existingBusiness, setExistingBusiness] = useState<Business | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // SECTION A: Business Basics
  const [businessName, setBusinessName] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [tagline, setTagline] = useState("");

  // Website Auto-Fill & Analysis States
  const [websiteAnalysisLoading, setWebsiteAnalysisLoading] = useState(false);
  const [websiteAnalysisError, setWebsiteAnalysisError] = useState<string | null>(null);
  const [websiteAnalysisNotice, setWebsiteAnalysisNotice] = useState<string | null>(null);
  const [hasPreservedManualFields, setHasPreservedManualFields] = useState(false);
  const lastAnalyzedUrlRef = useRef<string>("");
  const manuallyEditedFieldsRef = useRef<Set<string>>(new Set());
  const cachedWebsiteDataRef = useRef<WebsiteAnalysisData | null>(null);


  // SECTION B: Logo Studio
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [logoUploading, setLogoUploading] = useState(false);
  const [showAiStudio, setShowAiStudio] = useState(true);
  const [aiPrompt, setAiPrompt] = useState("");
  const [selectedLogoStyle, setSelectedLogoStyle] = useState("minimalist_modern");
  const [transparentBg, setTransparentBg] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [generatedVariations, setGeneratedVariations] = useState<AILogoVariationItem[]>([]);
  const [zoomLogoUrl, setZoomLogoUrl] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);

  // SECTION C: Brand Identity
  const [selectedFont, setSelectedFont] = useState("Inter");
  const [colors, setColors] = useState<ColorScheme>({
    primary: "#BE32FF",
    secondary: "#F0449B",
    accent: "#FC9A5D",
  });
  const [selectedTone, setSelectedTone] = useState(BRAND_TONES[0]);

  // SECTION D: Audience & Business Details
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0]);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [businessModel, setBusinessModel] = useState(BUSINESS_MODELS[0]);
  const [sellingModel, setSellingModel] = useState(SELLING_MODELS[0]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("25 - 35");
  const [selectedGender, setSelectedGender] = useState(GENDER_OPTIONS[0]);
  const [selectedCustomerType, setSelectedCustomerType] = useState(CUSTOMER_TYPES[0]);
  const [selectedLocationFocus, setSelectedLocationFocus] = useState(LOCATION_FOCUS_OPTIONS[3]); // Pan-India
  const [showAdvancedBusiness, setShowAdvancedBusiness] = useState(false);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [logoNotice, setLogoNotice] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  // Non-blocking auto-dismiss for errors
  useEffect(() => {
    if (formError) {
      const timer = setTimeout(() => setFormError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [formError]);

  // Dynamic Brand Kit completion calculation from active form fields
  const currentProgress = useMemo(() => {
    return calculateBrandKitCompletion(
      {
        business_name: businessName,
        business_description: businessDescription,
        business_category: businessCategory,
        sub_category: subCategory,
        logo_url: logoUrl,
        primary_color: colors.primary,
        secondary_color: colors.secondary,
        accent_color: colors.accent,
        font: selectedFont,
        tone: selectedTone,
        target_audience: `${selectedAgeGroup} | ${selectedGender} | ${selectedCustomerType}`,
        customer_type: selectedCustomerType,
        location_focus: selectedLocationFocus,
        business_model: businessModel,
      },
      existingBusiness ? { ...existingBusiness, name: businessName || existingBusiness.name } : { name: businessName }
    );
  }, [
    businessName,
    businessDescription,
    businessCategory,
    logoUrl,
    colors,
    selectedFont,
    selectedTone,
    selectedAgeGroup,
    selectedGender,
    selectedCustomerType,
    selectedLocationFocus,
    businessModel,
    existingBusiness,
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing business and brand kit data
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setInitialLoading(true);
        const [biz, brand] = await Promise.allSettled([
          businessService.getMyBusiness(),
          getBrandKit(),
        ]);

        if (!isMounted) return;

        if (biz.status === "fulfilled" && biz.value) {
          const b = biz.value;
          setExistingBusiness(b);
          if (b.name && !isDummyName(b.name)) setBusinessName(b.name);
          if (b.category) setBusinessCategory(b.category);
          if (b.description && !isDummyDesc(b.description)) setBusinessDescription(b.description);
          if (b.location) setSelectedLocationFocus(b.location);
        }

        if (brand.status === "fulfilled" && brand.value) {
          const bk = brand.value;
          setExistingBrand(bk);
          if (bk.logo_url) {
            setLogoUrl(bk.logo_url);
            setLogoLoadFailed(false);
          }
          if (bk.primary_color) {
            setColors((prev) => ({
              ...prev,
              primary: bk.primary_color || prev.primary,
              secondary: bk.secondary_color || prev.secondary,
              accent: bk.accent_color || prev.accent,
            }));
          }
          if (bk.font) setSelectedFont(bk.font);
          if (bk.tone) setSelectedTone(bk.tone);
          if (bk.website && !isDummyWeb(bk.website)) setWebsite(bk.website);
          if (bk.business_name && !isDummyName(bk.business_name) && !businessName) setBusinessName(bk.business_name);
          if (bk.business_type) setBusinessType(bk.business_type);
          if (bk.registration_number) setRegistrationNumber(bk.registration_number);
          if (bk.business_model) setBusinessModel(bk.business_model);
          if (bk.selling_model) setSellingModel(bk.selling_model);
          if (bk.business_category) setBusinessCategory(bk.business_category);
          if (bk.sub_category) setSubCategory(bk.sub_category);
          const loadedDesc = bk.business_description || bk.brand_description;
          if (loadedDesc && !isDummyDesc(loadedDesc) && !businessDescription) {
            setBusinessDescription(loadedDesc);
          }
          if (bk.age_group) setSelectedAgeGroup(bk.age_group);
          if (bk.gender) setSelectedGender(bk.gender);
          if (bk.customer_type) setSelectedCustomerType(bk.customer_type);
          if (bk.location_focus) setSelectedLocationFocus(bk.location_focus);
        }

        // SECTION B: Prefill from cached onboarding session data across all 6 business flows
        if (typeof window !== "undefined") {
          try {
            const cachedBizProfileStr = sessionStorage.getItem("business_profile");
            const cachedBizProfile = cachedBizProfileStr ? JSON.parse(cachedBizProfileStr) : null;
            const cachedName = sessionStorage.getItem("business_name");
            const cachedWeb = sessionStorage.getItem("business_website_url");
            const cachedCat = sessionStorage.getItem("business_category") || sessionStorage.getItem("google_maps_category");
            const cachedSocialHandlesStr = sessionStorage.getItem("business_social_handles");
            const cachedSocialHandles = cachedSocialHandlesStr ? JSON.parse(cachedSocialHandlesStr) : null;
            const mapsPlaceStr = sessionStorage.getItem("google_maps_place_data");
            const mapsPlace = mapsPlaceStr ? JSON.parse(mapsPlaceStr) : null;
            const mapsWeb = sessionStorage.getItem("google_maps_website_url");
            const mapsLogo = sessionStorage.getItem("google_maps_logo");

            const bk = brand.status === "fulfilled" ? brand.value : null;
            const b = biz.status === "fulfilled" ? biz.value : null;

            // 1. Business Name
            if (!bk?.business_name && !b?.name) {
              const candidateName =
                cachedName ||
                cachedBizProfile?.business_name ||
                mapsPlace?.name ||
                (cachedSocialHandles?.instagram ? String(cachedSocialHandles.instagram).replace(/^@/, "") : null);
              if (!isDummyName(candidateName)) {
                setBusinessName(candidateName);
              }
            }

            // 2. Industry / Category
            if (!bk?.business_category && (!b?.category || b.category === "clothing")) {
              const catRaw = cachedCat || cachedBizProfile?.business_category || cachedBizProfile?.category || mapsPlace?.types?.[0];
              if (catRaw) {
                const matched = BUSINESS_CATEGORIES.find(
                  (c) => c.value.toLowerCase() === catRaw.toLowerCase() || c.label.toLowerCase().includes(catRaw.toLowerCase())
                );
                if (matched) setBusinessCategory(matched.value);
              }
            }

            // 3. Website URL
            if (!bk?.website && !b?.website) {
              const candidateUrl = cachedWeb || cachedBizProfile?.website || mapsWeb || mapsPlace?.website;
              if (!isDummyWeb(candidateUrl)) setWebsite(candidateUrl);
            }

            // 4. Description
            if (!bk?.business_description && !bk?.brand_description) {
              const candidateDesc = b?.description || cachedBizProfile?.description;
              if (!isDummyDesc(candidateDesc)) setBusinessDescription(candidateDesc);
            }

            // 5. Address / Location
            if (!bk?.location_focus && !b?.location) {
              const candidateLoc = cachedBizProfile?.city || cachedBizProfile?.full_address || mapsPlace?.address;
              if (candidateLoc) setSelectedLocationFocus(candidateLoc);
            }

            // 6. Logo / Image
            if (!bk?.logo_url && !b?.logo_url) {
              const candidateLogo = mapsLogo || cachedBizProfile?.logo_url || (mapsPlace?.photos && mapsPlace.photos[0]);
              if (
                typeof candidateLogo === "string" &&
                (candidateLogo.startsWith("http://") || candidateLogo.startsWith("https://") || candidateLogo.startsWith("/") || candidateLogo.startsWith("data:"))
              ) {
                setLogoUrl(candidateLogo);
                setLogoLoadFailed(false);
              }
            }
          } catch (cacheErr) {
            console.warn("Could not read cached business details", cacheErr);
          }
        }
      } catch (err) {
        console.warn("Brand kit loading non-blocking error", err);
      } finally {
        if (isMounted) setInitialLoading(false);
      }
    }

    if (isOpen) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  /**
   * Automatically fetches available business details from website URL and auto-fills fields.
   * Preserves manually entered values unless user explicitly chooses to overwrite them.
   * Avoids duplicate API calls.
   */
  const handleAnalyzeWebsite = async (urlInput?: string, forceOverwrite = false) => {
    let target = (urlInput || website || "").trim();
    if (!target) {
      setWebsiteAnalysisError("Please enter a website URL first.");
      return;
    }

    if (!target.startsWith("http://") && !target.startsWith("https://")) {
      target = `https://${target}`;
      setWebsite(target);
    }

    // Basic URL format validation
    try {
      const parsed = new URL(target);
      if (!parsed.hostname || !parsed.hostname.includes(".")) {
        throw new Error("Invalid domain structure");
      }
    } catch {
      setWebsiteAnalysisError("Please enter a valid website address (e.g. https://yourbrand.com).");
      return;
    }

    // Avoid duplicate requests for identical URL unless forceOverwrite or retry
    if (target === lastAnalyzedUrlRef.current && !forceOverwrite && !websiteAnalysisError) {
      return;
    }

    setWebsiteAnalysisLoading(true);
    setWebsiteAnalysisError(null);
    setWebsiteAnalysisNotice(null);
    setHasPreservedManualFields(false);
    setFormInteractionBusy(true);
    lastAnalyzedUrlRef.current = target;

    try {
      const data = await aiService.analyzeWebsite({ website_url: target });
      cachedWebsiteDataRef.current = data;

      let preservedCount = 0;
      let filledCount = 0;

      // 1. Business Name
      if (data.business_name) {
        if (typeof window !== "undefined") {
          localStorage.setItem("business_name", data.business_name);
          localStorage.setItem("onboarding_business_name", data.business_name);
        }
        businessService.updateBusiness({
          name: data.business_name,
          businessName: data.business_name,
        }).catch(() => null);
        userService.updateProfile({
          business_name: data.business_name,
          businessName: data.business_name,
        }).catch(() => null);

        if (forceOverwrite || !businessName.trim() || !manuallyEditedFieldsRef.current.has("businessName")) {
          setBusinessName(data.business_name);
          filledCount++;
        } else {
          preservedCount++;
        }
      }

      // 2. Industry / Category
      if (data.category) {
        const catLower = data.category.toLowerCase();
        const matched = BUSINESS_CATEGORIES.find(
          (c) => c.value.toLowerCase() === catLower || c.label.toLowerCase().includes(catLower)
        );
        if (matched) {
          if (forceOverwrite || !manuallyEditedFieldsRef.current.has("businessCategory")) {
            setBusinessCategory(matched.value);
            filledCount++;
          } else {
            preservedCount++;
          }
        }
      }

      // 3. Tagline
      if (data.tagline) {
        if (forceOverwrite || !tagline.trim() || !manuallyEditedFieldsRef.current.has("tagline")) {
          setTagline(data.tagline);
          filledCount++;
        } else {
          preservedCount++;
        }
      }

      // 4. Business Description
      const descCandidate = data.business_description || data.brand_messaging_clarity;
      if (descCandidate) {
        const cleanDesc = descCandidate.slice(0, 500);
        if (forceOverwrite || !businessDescription.trim() || !manuallyEditedFieldsRef.current.has("businessDescription")) {
          setBusinessDescription(cleanDesc);
          filledCount++;
        } else {
          preservedCount++;
        }
      }

      // 5. Logo URL
      if (data.logo_url) {
        if (forceOverwrite || !logoUrl || !manuallyEditedFieldsRef.current.has("logoUrl")) {
          setLogoUrl(data.logo_url);
          setLogoLoadFailed(false);
          filledCount++;
        } else {
          preservedCount++;
        }
      }

      // 6. Brand Colors / Palette
      const candidateColors = data.brand_colors || data.palette;
      if (Array.isArray(candidateColors) && candidateColors.length >= 2) {
        if (forceOverwrite || !manuallyEditedFieldsRef.current.has("colors")) {
          setColors({
            primary: candidateColors[0],
            secondary: candidateColors[1],
            accent: candidateColors[2] || candidateColors[0],
          });
          filledCount++;
        } else {
          preservedCount++;
        }
      }

      // 7. Tone
      if (Array.isArray(data.tones) && data.tones.length > 0) {
        const toneLower = data.tones[0].toLowerCase();
        const matchedTone = BRAND_TONES.find((t) => t.toLowerCase().includes(toneLower));
        if (matchedTone && (forceOverwrite || !manuallyEditedFieldsRef.current.has("selectedTone"))) {
          setSelectedTone(matchedTone);
          filledCount++;
        }
      }

      if (preservedCount > 0 && !forceOverwrite) {
        setHasPreservedManualFields(true);
        setWebsiteAnalysisNotice(
          `Auto-filled ${filledCount} field(s) from website. Preserved ${preservedCount} manual field(s).`
        );
      } else {
        setWebsiteAnalysisNotice("Website analyzed successfully! Business information populated.");
      }
    } catch (err: any) {
      console.error("Website auto-fill error:", err);
      setWebsiteAnalysisError(
        err?.message || "Could not analyze website. Please check the URL or continue entering details manually."
      );
    } finally {
      setWebsiteAnalysisLoading(false);
      setFormInteractionBusy(false);
    }
  };


  // URL resolution for logo image: handles local port, proxying, and broken domains
  const getDisplayLogoUrl = (url?: string | null): string => {
    if (!url) return "";
    const clean = url.replace(/\\/g, "/").trim();
    if (clean.startsWith("data:") || clean.startsWith("blob:")) return clean;

    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    // If points to remote api.dhandagrow.com while developing on localhost, normalize
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      if (clean.startsWith("https://api.dhandagrow.com/uploads/")) {
        return clean.replace("https://api.dhandagrow.com", apiBase);
      }
    }

    if (clean.startsWith("http://") || clean.startsWith("https://")) {
      return clean;
    }

    return `${apiBase}${clean.startsWith("/") ? "" : "/"}${clean}`;
  };

  // Handle Logo Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormError("Logo image size must be less than 5MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFormError("Please upload a valid image file (PNG, JPG, SVG, WebP).");
      return;
    }

    setLogoUploading(true);
    setFormError(null);

    try {
      const uploadedUrl = await uploadBrandLogo(file);
      setLogoUrl(uploadedUrl);
      setLogoLoadFailed(false);
      setFormSuccess("Logo uploaded successfully!");
      setTimeout(() => setFormSuccess(null), 3000);
    } catch (err: any) {
      setFormError(err.response?.data?.detail || err.message || "Failed to upload image. Please try again.");
    } finally {
      setLogoUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Handle AI Logo Generation via dedicated brand logo pipeline with robust fallbacks
  const handleGenerateAiLogo = async (variationSeed?: number) => {
    const effectiveName = businessName.trim() || existingBusiness?.name || "Brand";

    setAiGenerating(true);
    setFormError(null);
    setLogoNotice(null);

    try {
      const res = await generateBrandLogo({
        business_name: effectiveName,
        brand_name: effectiveName,
        business_category: businessCategory,
        style: selectedLogoStyle,
        preferred_colors: [colors.primary, colors.secondary, colors.accent],
        prompt: aiPrompt.trim() || undefined,
        tagline: tagline.trim() || undefined,
        brand_voice: selectedTone,
        transparent_background: transparentBg,
        variation_seed: variationSeed,
        num_variations: 3,
        save_to_brand_kit: false,
      });

      if (res && res.logo_url) {
        setLogoUrl(res.logo_url);
        setLogoLoadFailed(false);
        if (res.variations && res.variations.length > 0) {
          setGeneratedVariations(res.variations);
        } else {
          setGeneratedVariations([
            { logo_url: res.logo_url, seed: res.seed || 101, style: selectedLogoStyle },
          ]);
        }
        setLogoNotice({ type: "success", message: "AI Logo generated successfully!" });
        setFormSuccess("AI Logo generated successfully!");
        setTimeout(() => {
          setLogoNotice(null);
          setFormSuccess(null);
        }, 3500);
      } else {
        // Fallback: Generate vector monogram logo with user's selected palette
        const fallbackSvg = createSvgLogoFallback(effectiveName, colors.primary, colors.secondary);
        setLogoUrl(fallbackSvg);
        setLogoLoadFailed(false);
        setGeneratedVariations([
          { logo_url: fallbackSvg, seed: 101, style: selectedLogoStyle },
          { logo_url: createSvgLogoFallback(effectiveName, colors.secondary, colors.accent), seed: 102, style: "monogram_gradient" },
          { logo_url: createSvgLogoFallback(effectiveName, colors.primary, colors.accent), seed: 103, style: "monogram_bold" },
        ]);
        setLogoNotice({ type: "info", message: "Created custom vector monogram logo using your brand palette!" });
        setTimeout(() => setLogoNotice(null), 4000);
      }
    } catch (err: any) {
      // Preserve all entered form data!
      // Fallback: Generate high-res vector monogram so user is never blocked
      const fallbackSvg = createSvgLogoFallback(effectiveName, colors.primary, colors.secondary);
      setLogoUrl(fallbackSvg);
      setLogoLoadFailed(false);
      setGeneratedVariations([
        { logo_url: fallbackSvg, seed: 101, style: selectedLogoStyle },
        { logo_url: createSvgLogoFallback(effectiveName, colors.secondary, colors.accent), seed: 102, style: "monogram_gradient" },
        { logo_url: createSvgLogoFallback(effectiveName, colors.primary, colors.accent), seed: 103, style: "monogram_bold" },
      ]);
      const errMsg = err.response?.data?.detail?.message || err.response?.data?.detail || err.message;
      const cleanErr = typeof errMsg === "string" ? errMsg : "AI service temporarily busy";
      setLogoNotice({
        type: "info",
        message: `${cleanErr}. Generated a vector monogram logo using your brand palette.`,
      });
      setTimeout(() => setLogoNotice(null), 5000);
    } finally {
      setAiGenerating(false);
    }
  };

  // Save partial Draft (Allows saving without filling all required fields)
  const handleSaveDraft = async () => {
    setIsDraftSaving(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const audienceSummary = `Age: ${selectedAgeGroup} | Gender: ${selectedGender} | Type: ${selectedCustomerType} | Focus: ${selectedLocationFocus}`;

      const brandPayload: BrandCreate = {
        logo_url: logoUrl || undefined,
        primary_color: colors.primary,
        secondary_color: colors.secondary,
        accent_color: colors.accent,
        font: selectedFont,
        tone: selectedTone,
        business_description: businessDescription.trim() || undefined,
        brand_description: businessDescription.trim() || undefined,
        target_audience: audienceSummary,
        website: website.trim() || undefined,
        social_style: `Theme: ${colors.primary}-${colors.secondary} | Model: ${businessModel}`,
        business_name: businessName.trim() || undefined,
        business_type: businessType,
        registration_number: registrationNumber.trim() || undefined,
        business_model: businessModel,
        selling_model: sellingModel,
        business_category: businessCategory,
        age_group: selectedAgeGroup,
        gender: selectedGender,
        customer_type: selectedCustomerType,
        location_focus: selectedLocationFocus,
        contact: {
          email: user?.email || "",
          phone: user?.phone || user?.phone_number || "",
        },
      };

      let savedBrandKit: BrandKit;
      if (existingBrand) {
        savedBrandKit = await updateBrandKit(brandPayload);
      } else {
        savedBrandKit = await createBrandKit(brandPayload);
      }
      setExistingBrand(savedBrandKit);

      // Dispatch dynamic update event
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("brandkit:updated", { detail: savedBrandKit }));
      }

      setFormSuccess("Brand Kit draft saved!");
      setTimeout(() => setFormSuccess(null), 3000);
    } catch (err: any) {
      const msg = err.response?.data?.detail?.message || err.response?.data?.detail || err.message || "Failed to save draft.";
      setFormError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setIsDraftSaving(false);
    }
  };

  // Skip incomplete details and continue directly to Dashboard (saving whatever was typed)
  const handleSkipToDashboard = async () => {
    setIsDraftSaving(true);
    setFormError(null);

    const effectiveName =
      businessName.trim() ||
      existingBusiness?.name ||
      existingBrand?.business_name ||
      "My Business";

    try {
      // 1. Cache entered details to sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.setItem("business_name", effectiveName);
        if (website.trim()) sessionStorage.setItem("business_website_url", website.trim());
        if (businessCategory) sessionStorage.setItem("business_category", businessCategory);
      }

      // 2. Persist entered details to backend in the background so user doesn't lose what they entered
      const audienceSummary = `Age: ${selectedAgeGroup} | Gender: ${selectedGender} | Type: ${selectedCustomerType} | Focus: ${selectedLocationFocus}`;
      const brandPayload: BrandCreate = {
        logo_url: logoUrl || undefined,
        primary_color: colors.primary,
        secondary_color: colors.secondary,
        accent_color: colors.accent,
        font: selectedFont,
        tone: selectedTone,
        business_description: businessDescription.trim() || undefined,
        brand_description: businessDescription.trim() || undefined,
        target_audience: audienceSummary,
        website: website.trim() || undefined,
        social_style: `Theme: ${colors.primary}-${colors.secondary} | Model: ${businessModel}`,
        business_name: effectiveName,
        business_type: businessType,
        registration_number: registrationNumber.trim() || undefined,
        business_model: businessModel,
        selling_model: sellingModel,
        business_category: businessCategory,
        age_group: selectedAgeGroup,
        gender: selectedGender,
        customer_type: selectedCustomerType,
        location_focus: selectedLocationFocus,
        contact: {
          email: user?.email || "",
          phone: user?.phone || user?.phone_number || "",
        },
      };

      if (existingBrand) {
        await updateBrandKit(brandPayload);
      } else {
        await createBrandKit(brandPayload);
      }

      if (effectiveName && effectiveName !== "My Business") {
        const businessPayload = {
          name: effectiveName,
          category: businessCategory,
          location: selectedLocationFocus,
          description: businessDescription.trim() || undefined,
        };
        if (existingBusiness) {
          await businessService.updateBusiness(businessPayload);
        } else {
          await businessService.createBusiness(businessPayload);
        }
      }
    } catch (saveErr) {
      console.warn("Non-blocking draft save before skip:", saveErr);
    } finally {
      setIsDraftSaving(false);
      if (typeof window !== "undefined") {
        window.location.href = "/dashboard";
      } else {
        onClose();
      }
    }
  };

  // Complete & Save Brand Kit (Flexible partial submission allowed)
  const handleCompleteSubmission = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const effectiveName = businessName.trim() || existingBusiness?.name || existingBrand?.business_name;
    // Only genuinely essential field is business name
    if (!effectiveName) {
      setCurrentStep("basics");
      setFormError("Please enter your business name.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      // 1. Save / Update business entity
      const businessPayload = {
        name: effectiveName,
        category: businessCategory,
        location: selectedLocationFocus,
        description: businessDescription.trim() || undefined,
        target_customer: `${selectedAgeGroup} | ${selectedGender} | ${selectedCustomerType}`,
        preferred_language: "hinglish",
        contact_email: user?.email || "",
        contact_phone: user?.phone || user?.phone_number || "",
      };

      if (existingBusiness) {
        await businessService.updateBusiness(businessPayload);
      } else {
        await businessService.createBusiness(businessPayload);
      }

      // 2. Prepare full Brand Kit payload (partial submission allowed)
      const audienceSummary = `Age: ${selectedAgeGroup} | Gender: ${selectedGender} | Type: ${selectedCustomerType} | Focus: ${selectedLocationFocus}`;

      const brandPayload: BrandCreate = {
        logo_url: logoUrl || undefined,
        primary_color: colors.primary,
        secondary_color: colors.secondary,
        accent_color: colors.accent,
        font: selectedFont,
        tone: selectedTone,
        business_description: businessDescription.trim() || undefined,
        brand_description: businessDescription.trim() || undefined,
        target_audience: audienceSummary,
        website: website.trim() || undefined,
        social_style: `Theme: ${colors.primary}-${colors.secondary} | Model: ${businessModel}`,
        business_name: effectiveName,
        business_type: businessType,
        registration_number: registrationNumber.trim() || undefined,
        business_model: businessModel,
        selling_model: sellingModel,
        business_category: businessCategory,
        age_group: selectedAgeGroup,
        gender: selectedGender,
        customer_type: selectedCustomerType,
        location_focus: selectedLocationFocus,
        contact: {
          email: user?.email || "",
          phone: user?.phone || user?.phone_number || "",
        },
      };

      let savedBrandKit: BrandKit;
      if (existingBrand) {
        savedBrandKit = await updateBrandKit(brandPayload);
      } else {
        savedBrandKit = await createBrandKit(brandPayload);
      }
      setExistingBrand(savedBrandKit);

      // Dispatch dynamic updates for side notification and toggles
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("brandkit:updated", { detail: savedBrandKit }));
        window.dispatchEvent(new CustomEvent("brandkit:completed", { detail: savedBrandKit }));
      }

      setFormSuccess("Brand Kit saved successfully!");

      setTimeout(() => {
        if (onComplete) onComplete();
        onClose();
      }, 900);
    } catch (err: any) {
      const errDetail = err.response?.data?.detail;
      if (errDetail && errDetail.errors) {
        const firstKey = Object.keys(errDetail.errors)[0];
        setFormError(`${firstKey.replace("_", " ")}: ${errDetail.errors[firstKey]}`);
      } else {
        setFormError(err.response?.data?.detail || err.message || "Failed to complete Brand Kit.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Step definitions
  const steps: { id: StepId; label: string; icon: React.ReactNode }[] = [
    { id: "basics", label: "Basics", icon: <Store className="w-4 h-4" /> },
    { id: "logo", label: "Logo Studio", icon: <Sparkles className="w-4 h-4" /> },
    { id: "identity", label: "Brand Identity", icon: <Palette className="w-4 h-4" /> },
    { id: "audience", label: "Audience & Model", icon: <Users className="w-4 h-4" /> },
    { id: "review", label: "Review & Save", icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  // Business initials for fallback avatar
  const initials = (businessName.trim() || "Brand")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const content = (
    <div className="w-full max-w-5xl lg:max-w-6xl mx-auto text-white space-y-6 sm:space-y-7 py-2 sm:py-4">
      {/* HEADER WITH PROGRESS */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          {(onBack || currentStepIndex > 0) && (
            <button
              type="button"
              onClick={() => {
                if (currentStepIndex > 0) {
                  const prevStep = steps[currentStepIndex - 1].id;
                  setCurrentStep(prevStep);
                } else if (onBack) {
                  onBack();
                }
              }}
              aria-label="Go back"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-purple/20 text-brand-purple border border-brand-purple/30">
                Brand Kit Setup
              </span>
            <span className="text-xs text-text-muted">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-normal tracking-wide text-white mt-1">
            Business Information
          </h1>
        </div>
      </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isDraftSaving || initialLoading}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
            title="Save draft progress"
          >
            {isDraftSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-pink" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={handleSkipToDashboard}
            disabled={isDraftSaving}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-semibold text-white hover:border-white/30 transition-all cursor-pointer"
            title="Skip for now and continue to dashboard"
          >
            <span>Skip for Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {isModal && (
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 flex items-center justify-center text-text-muted hover:text-white transition-colors"
              title="Dismiss"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* STEP TABS / STEPPER (Image 2 style) */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-[#071023] border border-white/10 shrink-0">
        {steps.map((st, idx) => {
          const isActive = currentStep === st.id;
          const isDone = idx < currentStepIndex;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => setCurrentStep(st.id)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-normal transition-all ${
                isActive
                  ? "border border-[#5b21b6]/40 text-white shadow-sm"
                  : isDone
                  ? "text-emerald-300 hover:bg-white/5"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
              style={
                isActive
                  ? {
                      background: "linear-gradient(180deg, #38156d 0%, #2c1056 65%, #180830 85%, #0a0314 100%)",
                    }
                  : undefined
              }
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  isActive
                    ? "bg-[#43187d] text-white font-normal"
                    : isDone
                    ? "bg-emerald-500 text-[#090C19] font-normal"
                    : "bg-white/10 text-slate-300 font-normal"
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
              </span>
              <span className="truncate hidden sm:inline font-normal">{st.label}</span>
            </button>
          );
        })}
      </div>
      {/* BRAND KIT DYNAMIC COMPLETION INDICATOR */}
      <div className="py-2.5 px-4 rounded-xl sm:rounded-2xl bg-[#090C19] border border-brand-purple/20 space-y-1.5 shrink-0 text-xs sm:text-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-semibold text-white">
              Brand Kit completion: <span className="text-brand-pink font-bold">{currentProgress.percentage}%</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {currentProgress.completedSections.length} of 4 completed
            </span>
            {currentProgress.pendingSections.length > 0 && (
              <span className="text-slate-400">
                ({currentProgress.pendingSections.join(", ")} pending)
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Progress Bar Track */}
        <div className="h-1.5 sm:h-2 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${currentProgress.percentage}%`,
              background: "linear-gradient(90deg, #fc9a5d 0%, #f0449b 50%, #7d36fa 100%)",
            }}
          />
        </div>
      </div>

      {/* GLOBAL ALERTS */}
      {formError && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in"
        >
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-200">Attention Required</p>
            <p className="text-red-300/90 mt-0.5">{formError}</p>
          </div>
          <button type="button" onClick={() => setFormError(null)} className="text-red-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {formSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{formSuccess}</span>
          </div>
          <button type="button" onClick={() => setFormSuccess(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {initialLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
            <p className="text-xs text-text-muted">Loading your brand configuration...</p>
          </div>
        </div>
      ) : (
        <div className="w-full space-y-6 sm:space-y-7">
          {/* ========================================================================= */}
          {/* STEP 1: BUSINESS BASICS                                                   */}
          {/* ========================================================================= */}
          {currentStep === "basics" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1122]/90 border border-white/10 shadow-xl space-y-5 sm:space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <div className="w-9 h-9 rounded-xl bg-[#261720] border border-[#f0449b]/25 flex items-center justify-center shrink-0 shadow-sm">
                    <StoreGradientIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide">
                      Business Basics
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Tell us about your brand to customize AI-generated marketing content.
                    </p>
                  </div>
                </div>

                {/* Business Name */}
                <div className="space-y-2.5">
                  <label htmlFor="modal-business-name" className="text-base sm:text-lg font-medium text-slate-200 block">
                    Business Name
                  </label>
                  <input
                    id="modal-business-name"
                    type="text"
                    value={businessName}
                    onChange={(e) => {
                      setBusinessName(e.target.value);
                      manuallyEditedFieldsRef.current.add("businessName");
                    }}
                    placeholder="Your business name"
                    className="w-full h-11 sm:h-12 px-4 rounded-xl border border-white/15 bg-[#080B17] text-sm text-white placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>

                {/* Business Category & Brand Tagline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-2.5">
                    <label htmlFor="modal-category" className="text-base sm:text-lg font-medium text-slate-200 block">
                      Business Category
                    </label>
                    <select
                      id="modal-category"
                      value={businessCategory}
                      onChange={(e) => {
                        setBusinessCategory(e.target.value);
                        manuallyEditedFieldsRef.current.add("businessCategory");
                      }}
                      className="w-full h-11 sm:h-12 px-4 rounded-xl border border-white/15 bg-[#080B17] text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    >
                      <option value="" disabled className="bg-[#080B17] text-slate-400">Your category</option>
                      {BUSINESS_CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value} className="bg-[#080B17] text-white">
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2.5">
                    <label htmlFor="modal-tagline" className="text-base sm:text-lg font-medium text-slate-200 block">
                      Brand Tagline <span className="text-xs sm:text-sm text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input
                      id="modal-tagline"
                      type="text"
                      value={tagline}
                      onChange={(e) => {
                        setTagline(e.target.value);
                        manuallyEditedFieldsRef.current.add("tagline");
                      }}
                      placeholder="Eg- Elegance in every diamond"
                      className="w-full h-11 sm:h-12 px-4 rounded-xl border border-white/15 bg-[#080B17] text-sm text-white placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    />
                  </div>
                </div>

                {/* Business Type & Sub - Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-2.5">
                    <label htmlFor="modal-business-type-step1" className="text-base sm:text-lg font-medium text-slate-200 block">
                      Business Type
                    </label>
                    <select
                      id="modal-business-type-step1"
                      value={businessType}
                      onChange={(e) => {
                        setBusinessType(e.target.value);
                        manuallyEditedFieldsRef.current.add("businessType");
                      }}
                      className="w-full h-11 sm:h-12 px-4 rounded-xl border border-white/15 bg-[#080B17] text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    >
                      <option value="" disabled className="bg-[#080B17] text-slate-400">Your business type</option>
                      {BUSINESS_TYPES.map((type) => (
                        <option key={type} value={type} className="bg-[#080B17] text-white">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2.5">
                    <label htmlFor="modal-sub-category" className="text-base sm:text-lg font-medium text-slate-200 block">
                      Sub - Category
                    </label>
                    <select
                      id="modal-sub-category"
                      value={subCategory}
                      onChange={(e) => {
                        setSubCategory(e.target.value);
                        manuallyEditedFieldsRef.current.add("subCategory");
                      }}
                      className="w-full h-11 sm:h-12 px-4 rounded-xl border border-white/15 bg-[#080B17] text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    >
                      <option value="" disabled className="bg-[#080B17] text-slate-400">Your sub - category</option>
                      {(SUB_CATEGORIES_MAP[businessCategory] || DEFAULT_SUB_CATEGORIES).map((sub) => (
                        <option key={sub} value={sub} className="bg-[#080B17] text-white">
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Website URL (Enter URL to auto-fill brand kit) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="modal-website" className="text-base sm:text-lg font-medium text-slate-200 block">
                      Website URL <span className="text-xs sm:text-sm text-slate-400 font-normal">(Enter URL to auto-fill brand kit)</span>
                    </label>
                    {websiteAnalysisLoading && (
                      <span className="text-[11px] text-brand-pink flex items-center gap-1.5 font-medium animate-pulse">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Fetching business info...
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        id="modal-website"
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        onBlur={() => {
                          const clean = website.trim();
                          if (clean && clean.length > 3 && clean !== lastAnalyzedUrlRef.current && !websiteAnalysisLoading) {
                            handleAnalyzeWebsite(clean);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAnalyzeWebsite(website);
                          }
                        }}
                        placeholder="Your website"
                        className="w-full h-11 sm:h-12 px-4 rounded-xl border border-white/15 bg-[#080B17] text-sm text-white placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAnalyzeWebsite(website, true)}
                      disabled={websiteAnalysisLoading || !website.trim()}
                      className="h-11 sm:h-12 px-4 sm:px-5 rounded-xl bg-gradient-to-b from-[#2F1262] to-[#000000] hover:from-[#3a167d] hover:to-[#080312] border border-[#4c1d95]/70 text-xs font-semibold text-white transition-all flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-40 shadow-[0_4px_16px_rgba(47,18,98,0.4)]"
                      title="Fetch business details from website"
                    >
                      {websiteAnalysisLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#b18cf8]" />
                          <span>Fetching...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-[#b18cf8]" />
                          <span>Auto-fill</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Feedback / Error / Retry Banner */}
                  {websiteAnalysisNotice && (
                    <div className="p-2.5 rounded-xl bg-purple-950/50 border border-purple-500/30 text-xs text-purple-200 flex items-center justify-between gap-2 animate-in fade-in">
                      <div className="flex items-center gap-2 min-w-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{websiteAnalysisNotice}</span>
                      </div>
                      {hasPreservedManualFields && (
                        <button
                          type="button"
                          onClick={() => handleAnalyzeWebsite(website, true)}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-white underline-offset-2 hover:underline shrink-0 cursor-pointer"
                        >
                          Overwrite all
                        </button>
                      )}
                    </div>
                  )}

                  {websiteAnalysisError && (
                    <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-xs text-rose-200 flex items-center justify-between gap-2 animate-in fade-in">
                      <div className="flex items-center gap-2 min-w-0">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="truncate">{websiteAnalysisError}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAnalyzeWebsite(website, true)}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-[11px] font-bold text-white flex items-center gap-1 shrink-0 cursor-pointer"
                        title="Retry analyzing website"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Retry</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Business Description */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <label htmlFor="modal-desc" className="text-base sm:text-lg font-medium text-slate-200">
                      Business Description
                    </label>
                    <VoiceInputButton
                      onTranscript={(text) => {
                        setBusinessDescription(text);
                        manuallyEditedFieldsRef.current.add("businessDescription");
                      }}
                      currentValue={businessDescription}
                      size="sm"
                      tooltip="Speak business description (English/Hindi)"
                    />
                    <span className="text-[11px] text-text-muted ml-auto">
                      {businessDescription.length}/500 chars (min 5)
                    </span>
                  </div>
                  <div className="relative">
                    <textarea
                      id="modal-desc"
                      rows={4}
                      maxLength={500}
                      value={businessDescription}
                      onChange={(e) => {
                        setBusinessDescription(e.target.value);
                        manuallyEditedFieldsRef.current.add("businessDescription");
                      }}
                      placeholder="Your business description"
                      className="w-full p-3.5 sm:p-4 pb-8 rounded-xl border border-white/15 bg-[#080B17] text-sm text-white placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-purple leading-relaxed"
                    />
                    <div className="absolute right-2 bottom-2">
                      <VoiceInputButton
                        onTranscript={(text) => {
                          setBusinessDescription(text);
                          manuallyEditedFieldsRef.current.add("businessDescription");
                        }}
                        currentValue={businessDescription}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleSkipToDashboard}
                  className="w-full sm:w-auto px-6 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Skip for Now &amp; Go to Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const effective = businessName.trim() || existingBusiness?.name || existingBrand?.business_name || "My Brand";
                    if (!businessName.trim()) {
                      setBusinessName(effective);
                    }
                    setFormError(null);
                    setCurrentStep("logo");
                  }}
                  className="w-full sm:w-auto px-7 h-12 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] via-[#be32ff] to-[#7d36fa] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-[0_4px_20px_rgba(240,68,155,0.35)] transition-all cursor-pointer"
                >
                  <span>Continue to Logo Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: LOGO STUDIO                                                       */}
          {/* ========================================================================= */}
          {currentStep === "logo" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1122]/90 border border-white/10 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#261720] border border-[#f0449b]/25 flex items-center justify-center shrink-0 shadow-sm">
                      <StoreGradientIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide">
                        Business Logo Studio
                      </h2>
                      <p className="text-xs sm:text-sm text-text-muted mt-0.5">
                        Generate distinctive vector artwork with AI or upload an existing logo.
                      </p>
                    </div>
                  </div>
                </div>

                {/* LOGO WORKSPACE & PREVIEW */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  {/* Left: Preview Box */}
                  <div className="md:col-span-5 flex flex-col items-center">
                    <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-2xl bg-[#070913] border-2 border-white/15 flex items-center justify-center overflow-hidden shadow-2xl group">
                      {logoUrl && !logoLoadFailed ? (
                        <>
                          {/* Top-right direct download button matching Image 2 */}
                          <a
                            href={getDisplayLogoUrl(logoUrl)}
                            download={`${businessName || "brand"}_logo.png`}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all z-20 shadow-md"
                            title="Download Logo"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getDisplayLogoUrl(logoUrl)}
                            alt="Brand Logo"
                            onError={() => setLogoLoadFailed(true)}
                            className="w-full h-full object-contain p-3 transition-transform group-hover:scale-105"
                          />
                          {/* Action Overlay */}
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button
                              type="button"
                              onClick={() => setZoomLogoUrl(getDisplayLogoUrl(logoUrl))}
                              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
                              title="Zoom & Inspect"
                            >
                              <ZoomIn className="w-4 h-4" />
                            </button>
                            <a
                              href={getDisplayLogoUrl(logoUrl)}
                              download={`${businessName || "brand"}_logo.png`}
                              target="_blank"
                              rel="noreferrer"
                              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
                              title="Download PNG"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        </>
                      ) : (
                        /* Modern Empty State (Never broken icon) */
                        <div className="flex flex-col items-center justify-center text-center p-4">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#BE32FF]/20 to-[#F0449B]/20 border border-[#F0449B]/30 flex items-center justify-center mb-2 shadow-inner">
                            <span className="text-xl font-bold bg-gradient-to-r from-[#BE32FF] to-[#FC9A5D] bg-clip-text text-transparent">
                              {initials}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-slate-300">No Logo Selected</span>
                          <span className="text-[10px] text-text-muted mt-0.5">Upload or generate with AI</span>
                        </div>
                      )}
                    </div>

                    {/* Logo Helper Status */}
                    {logoUrl && (
                      <div className="mt-2.5 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[11px] text-emerald-300 font-medium">Logo asset verified</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Quick Action Controls */}
                  <div className="md:col-span-7 flex flex-col gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      className="hidden"
                    />

                    {/* Generate with AI Big CTA */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowAiStudio(true);
                        document.getElementById('ai-logo-customization-studio')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full h-[74px] sm:h-[77px] rounded-[12px] bg-[#B1B1B1]/[0.12] border border-[#693780] shadow-[inset_0_4px_22.3px_-2px_#693780] hover:bg-[#B1B1B1]/[0.16] transition-all flex items-center px-4 sm:px-5 group cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-full bg-[#272333] border border-white/10 flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform">
                          <Wand2 className="w-5 h-5 text-[#d946ef]" />
                        </div>
                        <div className="text-left">
                          <span className="block text-sm sm:text-base font-semibold text-white">
                            Generate Logo with AI
                          </span>
                          <span className="block text-xs text-slate-300 mt-0.5">
                            Take action now to improve your marketing score.
                          </span>
                        </div>
                      </div>
                    </button>

                    {/* Upload File Button with Image 2 gradient highlight corner border */}
                    <div className="w-full p-[1.5px] rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] via-[#be32ff] to-[#7d36fa] shadow-[0_2px_12px_rgba(240,68,155,0.25)] hover:shadow-[0_4px_16px_rgba(240,68,155,0.4)] transition-all">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={logoUploading}
                        className="w-full h-11 sm:h-12 rounded-full bg-[#0E1122] hover:bg-[#13172c] text-white font-medium text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
                      >
                        {logoUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
                            <span>Uploading logo...</span>
                          </>
                        ) : (
                          <>
                            <span>Upload Logo</span>
                            <Paperclip className="w-4 h-4 text-slate-300" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI LOGO GENERATION EXPANDABLE STUDIO */}
                {showAiStudio && (
                  <div id="ai-logo-customization-studio" className="mt-4 p-5 sm:p-6 rounded-2xl bg-[#090C19] border border-white/10 space-y-5 animate-in fade-in">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#261720] border border-[#f0449b]/25 flex items-center justify-center shrink-0 shadow-sm">
                          <StoreGradientIcon className="w-4 h-4" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-normal text-white">
                          AI Logo Customization Studio
                        </h3>
                      </div>
                      <span className="text-xs text-text-muted">Powered by AI Vector Engine</span>
                    </div>

                    {/* Logo Feedback / Non-blocking inline notification */}
                    {logoNotice && (
                      <div
                        className={`p-3 rounded-xl text-xs flex items-center justify-between animate-in fade-in ${
                          logoNotice.type === "success"
                            ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                            : "bg-brand-purple/20 border border-brand-purple/40 text-purple-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {logoNotice.type === "success" ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Sparkles className="w-4 h-4 text-brand-pink shrink-0" />
                          )}
                          <span>{logoNotice.message}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setLogoNotice(null)}
                          className="text-text-muted hover:text-white p-0.5"
                          title="Dismiss notice"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* 1. Logo Style Selector */}
                    <div className="space-y-3">
                      <label className="text-base sm:text-lg font-normal text-slate-200 block">
                        Select Logo Direction / Style
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        {LOGO_STYLES.map((st) => {
                          const isSel = selectedLogoStyle === st.id;
                          return (
                            <button
                              key={st.id}
                              type="button"
                              onClick={() => setSelectedLogoStyle(st.id)}
                              className={`p-4 sm:p-5 rounded-2xl text-left transition-all flex flex-col justify-between min-h-[125px] sm:min-h-[140px] bg-[#081226] ${
                                isSel
                                  ? "border-2 border-white/40 shadow-md"
                                  : "border border-white/10 hover:border-white/20"
                              }`}
                            >
                              <div>
                                <span className={`text-sm sm:text-base block font-normal ${isSel ? "text-white" : "text-slate-200"}`}>
                                  {st.label}
                                </span>
                                <span className="text-xs sm:text-sm text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                                  {st.desc}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. Visual Prompt & Guidance */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#261720] border border-[#f0449b]/25 flex items-center justify-center shrink-0 shadow-sm">
                          <StoreGradientIcon className="w-4 h-4" />
                        </div>
                        <label htmlFor="ai-prompt-input" className="text-base sm:text-lg font-normal text-slate-200">
                          Visual Theme or Symbol Preference <span className="text-xs sm:text-sm text-text-muted">(Optional)</span>
                        </label>
                      </div>
                      <input
                        id="ai-prompt-input"
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="e.g. Diamond crown emblem, falcon wing, interlocking golden monogram, sleek geometric polygon"
                        className="w-full h-12 px-3.5 rounded-xl border border-white/15 bg-[#080B17] text-sm sm:text-base text-white placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                      />
                    </div>

                    {/* 3. Color Direction & Options */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#261720] border border-[#f0449b]/25 flex items-center justify-center shrink-0 shadow-sm">
                          <StoreGradientIcon className="w-4 h-4" />
                        </div>
                        <span className="text-base sm:text-lg font-normal text-slate-200">Using Palette:</span>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full border border-white/20 shadow-xs" style={{ backgroundColor: colors.primary }} title={`Primary ${colors.primary}`} />
                          <span className="w-6 h-6 rounded-full border border-white/20 shadow-xs" style={{ backgroundColor: colors.secondary }} title={`Secondary ${colors.secondary}`} />
                          <span className="w-6 h-6 rounded-full border border-white/20 shadow-xs" style={{ backgroundColor: colors.accent }} title={`Accent ${colors.accent}`} />
                        </div>
                      </div>

                      <label className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={transparentBg}
                          onChange={(e) => setTransparentBg(e.target.checked)}
                          className="rounded border-white/20 bg-[#080B17] text-brand-pink focus:ring-brand-purple"
                        />
                        <span>Isolated flat background</span>
                      </label>
                    </div>

                    {/* 4. Action Trigger Button */}
                    <div className="pt-2 flex justify-center">
                      <button
                        type="button"
                        onClick={() => handleGenerateAiLogo()}
                        disabled={aiGenerating}
                        className="w-full max-w-sm sm:max-w-md h-12 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] via-[#be32ff] to-[#7d36fa] text-white font-normal text-sm sm:text-base flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 shadow-[0_4px_20px_rgba(240,68,155,0.35)] transition-all cursor-pointer"
                      >
                        {aiGenerating ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Crafting your brand logo artwork...</span>
                          </>
                        ) : (
                          <>
                            <span>Generate AI Logo</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* 5. VARIATIONS GALLERY */}
                    {generatedVariations.length > 0 && (
                      <div className="pt-4 border-t border-white/10 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-brand-pink" /> Generated Variations Gallery
                          </span>
                          <button
                            type="button"
                            onClick={() => handleGenerateAiLogo(Math.floor(Math.random() * 900000) + 10000)}
                            disabled={aiGenerating}
                            className="text-[11px] text-brand-pink hover:underline flex items-center gap-1 disabled:opacity-50"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Generate More</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          {generatedVariations.map((v, vIdx) => {
                            const isCurrent = logoUrl === v.logo_url;
                            return (
                              <div
                                key={vIdx}
                                className={`relative rounded-xl p-2 bg-[#0E1122] border transition-all flex flex-col items-center group cursor-pointer ${
                                  isCurrent ? "border-brand-pink shadow-[0_0_15px_rgba(240,68,155,0.3)]" : "border-white/10 hover:border-white/30"
                                }`}
                                onClick={() => {
                                  setLogoUrl(v.logo_url);
                                  setLogoLoadFailed(false);
                                }}
                              >
                                <div className="w-full aspect-square rounded-lg bg-[#070913] flex items-center justify-center overflow-hidden mb-1.5">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={getDisplayLogoUrl(v.logo_url)}
                                    alt={`Variation ${vIdx + 1}`}
                                    className="w-full h-full object-contain p-1"
                                    onError={(e) => {
                                      // Fallback on variation load issue
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                </div>
                                <div className="w-full flex items-center justify-between text-[10px]">
                                  <span className="text-slate-300 font-semibold">Option {vIdx + 1}</span>
                                  {isCurrent && (
                                    <span className="text-brand-pink font-bold flex items-center gap-0.5">
                                      <Check className="w-3 h-3" /> Selected
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* DELETE CONFIRMATION MODAL */}
                {showDeleteConfirm && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-200 flex items-center justify-between animate-in fade-in">
                    <span>Are you sure you want to remove the current logo?</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setLogoUrl("");
                          setShowDeleteConfirm(false);
                        }}
                        className="px-3 py-1 rounded-lg bg-red-500 text-white font-bold text-xs hover:bg-red-600"
                      >
                        Yes, Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-3 py-1 rounded-lg bg-white/10 text-white text-xs hover:bg-white/20"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep("basics")}
                  className="w-full sm:w-auto px-5 h-12 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Basics</span>
                </button>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleSkipToDashboard}
                    className="flex-1 sm:flex-initial px-5 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Skip for Now
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormError(null);
                      setCurrentStep("identity");
                    }}
                    className="flex-1 sm:flex-initial px-7 h-12 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] via-[#be32ff] to-[#7d36fa] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-[0_4px_20px_rgba(240,68,155,0.35)] transition-all cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: BRAND IDENTITY (TYPOGRAPHY & COLOURS)                             */}
          {/* ========================================================================= */}
          {currentStep === "identity" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. TYPOGRAPHY CARD */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#0E1122]/90 border border-white/10 shadow-lg space-y-4">
                  <div className="space-y-3 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#261720] border border-[#f0449b]/25 flex items-center justify-center shrink-0 shadow-sm">
                        <StoreGradientIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide">Brand Typography</h2>
                        <p className="text-xs sm:text-sm text-text-muted mt-0.5">Primary font used across posts and titles</p>
                      </div>
                    </div>

                    <div className="w-full sm:w-64 pt-0.5">
                      <select
                        value={selectedFont}
                        onChange={(e) => {
                          setSelectedFont(e.target.value);
                          manuallyEditedFieldsRef.current.add("font");
                        }}
                        className="w-full h-11 px-3.5 rounded-xl border border-white/15 bg-[#0B1020] text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                      >
                        {SUPPORTED_FONTS.map((font) => (
                          <option key={font.name} value={font.name} className="bg-[#0B1020] text-white">
                            {font.name} ({font.category})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Typography Specimen Display */}
                  <div className="p-4 rounded-xl bg-[#090C19] border border-white/5 flex items-center justify-around text-center">
                    <div style={{ fontFamily: selectedFont }}>
                      <span className="text-2xl sm:text-3xl font-normal text-white block">Aa</span>
                      <span className="text-xs text-text-muted mt-1 block">Upper & Lower</span>
                    </div>
                    <div style={{ fontFamily: selectedFont }}>
                      <span className="text-2xl sm:text-3xl font-normal text-white block">Heading</span>
                      <span className="text-xs text-text-muted mt-1 block">{selectedFont}</span>
                    </div>
                    <div style={{ fontFamily: selectedFont }}>
                      <span className="text-2xl sm:text-3xl font-normal text-brand-pink block">123</span>
                      <span className="text-xs text-text-muted mt-1 block">Numerals</span>
                    </div>
                  </div>
                </div>

                {/* 2. BRAND PERSONALITY / TONE */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#0E1122]/90 border border-white/10 shadow-lg space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                    <div className="w-9 h-9 rounded-xl bg-[#261720] border border-[#f0449b]/25 flex items-center justify-center shrink-0 shadow-sm">
                      <StoreGradientIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide">Brand Personality</h2>
                      <p className="text-xs sm:text-sm text-text-muted mt-0.5">Guides caption tone and copywriting</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {BRAND_TONES.map((tone) => {
                      const isSel = selectedTone === tone;
                      return (
                        <button
                          key={tone}
                          type="button"
                          onClick={() => {
                            setSelectedTone(tone);
                            manuallyEditedFieldsRef.current.add("selectedTone");
                          }}
                          className={`h-11 sm:h-12 px-4 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-center text-center ${
                            isSel
                              ? "border-2 border-white/40 bg-[#081226] text-white shadow-md"
                              : "bg-[#080B17] border border-white/10 hover:border-white/20 text-slate-300"
                          }`}
                        >
                          <span className="truncate">{tone}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 3. COLOR PALETTE WITH SMART PRESETS & LIVE PICKER */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0E1122]/90 border border-white/10 shadow-lg space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                  <div className="w-9 h-9 rounded-xl bg-[#261720] border border-[#f0449b]/25 flex items-center justify-center shrink-0 shadow-sm">
                    <StoreGradientIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide">Brand Color Palette</h2>
                    <p className="text-xs sm:text-sm text-text-muted mt-0.5">Used for ads banner, gradients and typography accents</p>
                  </div>
                </div>

                {/* Live Color Picker Component */}
                <LiveColorPicker
                  colors={colors}
                  onChange={(c) => {
                    setColors(c);
                    manuallyEditedFieldsRef.current.add("colors");
                  }}
                  selectedFont={selectedFont}
                />
              </div>


              {/* Navigation buttons matching Image 2 & Image 4 */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep("basics")}
                  className="w-full sm:w-auto px-6 h-11 sm:h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to basic</span>
                </button>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleSkipToDashboard}
                    className="flex-1 sm:flex-initial px-6 h-11 sm:h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Skip for Now
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormError(null);
                      setCurrentStep("audience");
                    }}
                    className="flex-1 sm:flex-initial px-8 h-11 sm:h-12 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] via-[#be32ff] to-[#7d36fa] text-white font-medium text-sm sm:text-base flex items-center justify-center gap-2 hover:opacity-95 shadow-[0_4px_20px_rgba(240,68,155,0.35)] transition-all cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: AUDIENCE & STRUCTURE                                              */}
          {/* ========================================================================= */}
          {currentStep === "audience" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* CARD 1: TARGET AUDIENCE DEMOGRAPHICS (Image 1) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0E1122]/90 border border-white/10 shadow-lg space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <div className="w-9 h-9 rounded-xl bg-[#261720] border border-[#f0449b]/25 flex items-center justify-center shrink-0 shadow-sm">
                    <StoreGradientIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide">
                      Target Audience Demographics
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Specifies who your marketing campaigns should target.
                    </p>
                  </div>
                </div>

                {/* Target Audience Age Group Chips */}
                <div className="space-y-2.5">
                  <span className="text-base sm:text-lg font-normal text-slate-200 block">
                    Target Audience
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {AUDIENCE_AGE_GROUPS.map((age) => {
                      const isSelected = selectedAgeGroup === age;
                      return (
                        <button
                          key={age}
                          type="button"
                          onClick={() => setSelectedAgeGroup(age)}
                          className={`h-11 sm:h-12 rounded-xl text-sm sm:text-base font-normal transition-all duration-200 flex items-center justify-center ${
                            isSelected
                              ? "p-[1.5px] bg-gradient-to-r from-[#BE32FF] via-[#F0449B] to-[#FC9A5D] shadow-[0_0_15px_rgba(240,68,155,0.4)]"
                              : "bg-[#080B17] border border-white/10 hover:border-white/20 text-slate-300"
                          }`}
                        >
                          <span className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                            isSelected ? "bg-[#11162C] text-white" : ""
                          }`}>
                            {age}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Gender Focus & Customer Segment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="modal-gender" className="text-base sm:text-lg font-normal text-slate-200 block">
                      Gender Focus
                    </label>
                    <select
                      id="modal-gender"
                      value={selectedGender}
                      onChange={(e) => setSelectedGender(e.target.value)}
                      className="w-full h-11 sm:h-12 px-4 rounded-xl border border-white/15 bg-[#080B17] text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    >
                      {GENDER_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#080B17] text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="modal-customer-type" className="text-base sm:text-lg font-normal text-slate-200 block">
                      Customer Segment
                    </label>
                    <select
                      id="modal-customer-type"
                      value={selectedCustomerType}
                      onChange={(e) => setSelectedCustomerType(e.target.value)}
                      className="w-full h-11 sm:h-12 px-4 rounded-xl border border-white/15 bg-[#080B17] text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    >
                      {CUSTOMER_TYPES.map((type) => (
                        <option key={type} value={type} className="bg-[#080B17] text-white">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location Focus */}
                <div className="space-y-2">
                  <label htmlFor="modal-loc-focus" className="text-base sm:text-lg font-normal text-slate-200 block">
                    Location Focus
                  </label>
                  <select
                    id="modal-loc-focus"
                    value={selectedLocationFocus}
                    onChange={(e) => setSelectedLocationFocus(e.target.value)}
                    className="w-full h-11 sm:h-12 px-4 rounded-xl border border-white/15 bg-[#080B17] text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  >
                    {LOCATION_FOCUS_OPTIONS.map((loc) => (
                      <option key={loc} value={loc} className="bg-[#080B17] text-white">
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* CARD 2: BUSINESS STRUCTURE & DETAILS (Image 2) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0E1122]/90 border border-white/10 shadow-lg space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <div className="w-9 h-9 rounded-xl bg-[#261720] border border-[#f0449b]/25 flex items-center justify-center shrink-0 shadow-sm">
                    <StoreGradientIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide">
                      Target Audience Demographics
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Specifies who your marketing campaigns should target.
                    </p>
                  </div>
                </div>

                {/* Business Type & Registration Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="modal-business-type" className="text-base sm:text-lg font-normal text-slate-200 block">
                      Business Type
                    </label>
                    <select
                      id="modal-business-type"
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full h-11 sm:h-12 px-4 rounded-xl border border-white/15 bg-[#080B17] text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    >
                      {BUSINESS_TYPES.map((type) => (
                        <option key={type} value={type} className="bg-[#080B17] text-white">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="modal-reg-num" className="text-base sm:text-lg font-normal text-slate-200 block">
                      Registration Number <span className="text-xs sm:text-sm text-text-muted">(Optional)</span>
                    </label>
                    <input
                      id="modal-reg-num"
                      type="text"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      placeholder="Eg- End consumer (Everyday Shoppers)"
                      className="w-full h-11 sm:h-12 px-4 rounded-xl border border-white/15 bg-[#080B17] text-sm sm:text-base text-white placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-purple uppercase"
                    />
                  </div>
                </div>

                {/* Business Model & Selling Model */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="modal-business-model" className="text-base sm:text-lg font-normal text-slate-200 block">
                      Business Model
                    </label>
                    <select
                      id="modal-business-model"
                      value={businessModel}
                      onChange={(e) => setBusinessModel(e.target.value)}
                      className="w-full h-11 sm:h-12 px-4 rounded-xl border border-white/15 bg-[#080B17] text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    >
                      {BUSINESS_MODELS.map((model) => (
                        <option key={model} value={model} className="bg-[#080B17] text-white">
                          {model}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="modal-selling-model" className="text-base sm:text-lg font-normal text-slate-200 block">
                      Selling Model
                    </label>
                    <select
                      id="modal-selling-model"
                      value={sellingModel}
                      onChange={(e) => setSellingModel(e.target.value)}
                      className="w-full h-11 sm:h-12 px-4 rounded-xl border border-white/15 bg-[#080B17] text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    >
                      {SELLING_MODELS.map((model) => (
                        <option key={model} value={model} className="bg-[#080B17] text-white">
                          {model}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Navigation buttons matching Image 2 */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep("identity")}
                  className="w-full sm:w-auto px-6 h-11 sm:h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to basic</span>
                </button>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleSkipToDashboard}
                    className="flex-1 sm:flex-initial px-6 h-11 sm:h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Skip for Now
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormError(null);
                      setCurrentStep("review");
                    }}
                    className="flex-1 sm:flex-initial px-8 h-11 sm:h-12 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] via-[#be32ff] to-[#7d36fa] text-white font-medium text-sm sm:text-base flex items-center justify-center gap-2 hover:opacity-95 shadow-[0_4px_20px_rgba(240,68,155,0.35)] transition-all cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5: REVIEW & SAVE                                                     */}
          {/* ========================================================================= */}
          {currentStep === "review" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* CARD 1: BRAND SUMMARY CARD (Image 2) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0E1122]/90 border border-white/10 shadow-lg space-y-5">
                {/* Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <div className="w-9 h-9 rounded-xl bg-[#261720] border border-[#f0449b]/25 flex items-center justify-center shrink-0 shadow-sm">
                    <StoreGradientIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide">
                      Brand Kit Summary & Confirmation
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Review your configuration before saving to your profile.
                    </p>
                  </div>
                </div>

                {/* Profile Top Row: Logo, Name/Category, Palette Swatches */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Logo Preview (Enlarged per Image 4) */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-black border border-white/15 flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
                      {logoUrl && !logoLoadFailed ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getDisplayLogoUrl(logoUrl)}
                          alt="Logo"
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <div className="text-xl sm:text-2xl font-medium text-brand-pink">{initials}</div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-lg sm:text-xl font-normal text-white">
                        {businessName || "User xyz!"}
                      </h3>
                      <div>
                        <span className="text-xs font-normal px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 inline-block">
                          {BUSINESS_CATEGORIES.find((c) => c.value === businessCategory)?.label || businessCategory || "Fashion & Apparel"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Palette Swatches */}
                  <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-3 shrink-0 self-start sm:self-center">
                    <span className="text-xs text-slate-400 font-normal">Palette:</span>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full border border-white/20 shadow-xs" style={{ backgroundColor: colors.primary }} title={`Primary ${colors.primary}`} />
                      <span className="w-6 h-6 rounded-full border border-white/20 shadow-xs" style={{ backgroundColor: colors.secondary }} title={`Secondary ${colors.secondary}`} />
                      <span className="w-6 h-6 rounded-full border border-white/20 shadow-xs" style={{ backgroundColor: colors.accent }} title={`Accent ${colors.accent}`} />
                    </div>
                  </div>
                </div>

                {/* 4 Details Columns with divided box and increased font weight (Image 3) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10 border border-white/10 rounded-2xl bg-white/[0.02] overflow-hidden text-xs sm:text-sm">
                  <div className="p-4 sm:p-5 space-y-1.5">
                    <span className="text-xs sm:text-sm text-slate-400 font-normal block">Typography</span>
                    <span className="font-semibold text-white text-sm sm:text-base block tracking-wide">{selectedFont || "Montserrat"}</span>
                  </div>
                  <div className="p-4 sm:p-5 space-y-1.5">
                    <span className="text-xs sm:text-sm text-slate-400 font-normal block">Tone & Voice</span>
                    <span className="font-semibold text-white text-sm sm:text-base truncate block tracking-wide">{selectedTone || "Modern, Professional"}</span>
                  </div>
                  <div className="p-4 sm:p-5 space-y-1.5">
                    <span className="text-xs sm:text-sm text-slate-400 font-normal block">Target Audience</span>
                    <span className="font-semibold text-white text-sm sm:text-base block tracking-wide">{selectedAgeGroup || "15 - 25"} | {selectedGender ? selectedGender.split(" ")[0] : "Primarily"}</span>
                  </div>
                  <div className="p-4 sm:p-5 space-y-1.5">
                    <span className="text-xs sm:text-sm text-slate-400 font-normal block">Location Focus</span>
                    <span className="font-semibold text-white text-sm sm:text-base truncate block tracking-wide">{selectedLocationFocus ? selectedLocationFocus.split("(")[0].trim() : "Regional / State-wide"}</span>
                  </div>
                </div>

                {/* Business Description */}
                <div className="pt-3 border-t border-white/5 space-y-1.5">
                  <span className="text-xs sm:text-sm text-slate-400 font-normal block">
                    Business Description
                  </span>
                  <p className="text-slate-300 text-xs sm:text-sm font-normal leading-relaxed">
                    {businessDescription.trim() || "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
                  </p>
                </div>
              </div>

              {/* CARD 2: BRAND KIT COMPLETION (Image 2) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0E1122]/90 border border-white/10 shadow-lg space-y-5">
                {/* Header row: Completion % and Remaining pill */}
                <div className="flex items-center justify-between">
                  <span className="text-base sm:text-lg font-normal text-white">
                    Brand Kit Completion: <span className="text-brand-pink font-normal">{currentProgress.percentage}%</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400 font-normal">
                    Remaining : {currentProgress.remainingPercentage}%
                  </span>
                </div>

                {/* 5 Milestones row with solid green filled icons (Image 1) */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  {[
                    { id: "basics", name: "Basics" },
                    { id: "logo", name: "Logo Studio" },
                    { id: "identity", name: "Brand Identity" },
                    { id: "audience", name: "Audience & Model" },
                    { id: "review", name: "Review & Save" },
                  ].map((m) => (
                    <div key={m.id} className="flex items-center gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-sm">
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#090C19] stroke-[3]" />
                      </div>
                      <span className="text-xs sm:text-sm font-normal text-white">{m.name}</span>
                    </div>
                  ))}
                </div>

                {/* Linked Account row with green filled verified icon */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-300 font-normal">
                    Linked Account: <span className="text-white font-normal">{user?.email ? user.email.split("@")[0] : "User"}</span>
                  </span>
                  <span className="text-emerald-400 font-normal flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-sm">
                      <Check className="w-2.5 h-2.5 text-[#090C19] stroke-[3]" />
                    </div>
                    Verified Profile
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS (Matching Image 2 & Image 3) */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setCurrentStep("audience")}
                  className="w-full sm:w-auto px-6 h-11 sm:h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs sm:text-sm font-normal flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to basic</span>
                </button>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleSkipToDashboard}
                    className="flex-1 sm:flex-initial px-6 h-11 sm:h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs sm:text-sm font-normal transition-colors cursor-pointer"
                  >
                    Skip for Now
                  </button>

                  <button
                    type="button"
                    onClick={handleCompleteSubmission}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-initial px-8 h-11 sm:h-12 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] via-[#be32ff] to-[#7d36fa] text-white font-normal text-sm sm:text-base flex items-center justify-center gap-2 hover:opacity-95 shadow-[0_4px_20px_rgba(240,68,155,0.35)] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

            {/* LIGHTBOX / ZOOM MODAL */}
      {zoomLogoUrl && (
        <div
          className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setZoomLogoUrl(null)}
        >
          <div
            className="relative max-w-lg w-full rounded-3xl bg-[#090C19] border border-white/20 p-6 flex flex-col items-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-sm font-bold text-white">Logo Full Preview</span>
              <button
                type="button"
                onClick={() => setZoomLogoUrl(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full aspect-square rounded-2xl bg-[#070913] border border-white/15 my-4 flex items-center justify-center overflow-hidden p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zoomLogoUrl}
                alt="Enlarged Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="w-full flex gap-3">
              <a
                href={zoomLogoUrl}
                download={`${businessName || "brand"}_logo.png`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#BE32FF] to-[#F0449B] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Download High-Res PNG</span>
              </a>
              <button
                type="button"
                onClick={() => setZoomLogoUrl(null)}
                className="px-5 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // If used as modal overlay
  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300">
        <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#090A15] border border-white/15 p-4 sm:p-8 shadow-2xl custom-scrollbar">
          {content}
        </div>
      </div>
    );
  }

  // If embedded directly on page (e.g. /brand)
  return content;
}
