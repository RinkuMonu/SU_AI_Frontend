"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
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
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  getBrandKit,
  createBrandKit,
  updateBrandKit,
  uploadBrandLogo,
  generateBrandLogo,
} from "@/services/brand.service";
import { businessService } from "@/services/business.service";
import { BrandKit, BrandCreate, AILogoVariationItem } from "@/types/brand";
import { Business } from "@/types";
import { LiveColorPicker, ColorScheme } from "./LiveColorPicker";
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
} from "@/lib/brand-kit";

interface BrandKitRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  isModal?: boolean; // true if overlay popup, false if embedded page
}

// 10 Curated AI Logo Styles
export const LOGO_STYLES = [
  { id: "minimalist_modern", label: "Minimalist Modern", desc: "Clean geometric vector icon & iconic silhouette" },
  { id: "luxury_premium", label: "Premium Luxury", desc: "Regal gold crest, elegant symmetry & boutique luxury" },
  { id: "geometric_abstract", label: "Geometric & Abstract", desc: "Golden ratio lines, isometric precision & modern mark" },
  { id: "3d_dimensional", label: "3D & Dimensional", desc: "Smooth ceramic & metallic textures with soft ambient depth" },
  { id: "tech_futuristic", label: "Tech & Futuristic", desc: "Cybernetic nodes, electric neon & cutting-edge AI" },
  { id: "elegant_monogram", label: "Monogram & Typography", desc: "Sophisticated initials with luxury fashion ligatures" },
  { id: "mascot_illustrated", label: "Mascot & Character", desc: "Friendly expressive character with bold vector outlines" },
  { id: "organic_natural", label: "Organic & Natural", desc: "Botanical leaves, flowing curves & eco-friendly green" },
  { id: "bold_playful", label: "Bold & Playful", desc: "Vibrant pop geometry, energetic curves & creative spirit" },
  { id: "emblem_badge", label: "Heritage Seal / Badge", desc: "Vintage circular seal, delicate filigree & authentic stamp" },
];

export const BRAND_TONES = [
  "Professional & Trustworthy",
  "Luxury & High-End",
  "Modern & Innovative",
  "Friendly & Approachable",
  "Bold & Disruptive",
  "Artisanal & Natural",
];

type StepId = "basics" | "logo" | "identity" | "audience" | "review";

export function BrandKitRegistrationModal({
  isOpen,
  onClose,
  onComplete,
  isModal = true,
}: BrandKitRegistrationModalProps) {
  const { user } = useAuth();

  // Active Wizard Step
  const [currentStep, setCurrentStep] = useState<StepId>("basics");

  // Existing Data States
  const [existingBrand, setExistingBrand] = useState<BrandKit | null>(null);
  const [existingBusiness, setExistingBusiness] = useState<Business | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // SECTION A: Business Basics
  const [businessName, setBusinessName] = useState("");
  const [businessCategory, setBusinessCategory] = useState("clothing");
  const [businessDescription, setBusinessDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [tagline, setTagline] = useState("");

  // SECTION B: Logo Studio
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [logoUploading, setLogoUploading] = useState(false);
  const [showAiStudio, setShowAiStudio] = useState(false);
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
          if (b.name) setBusinessName(b.name);
          if (b.category) setBusinessCategory(b.category);
          if (b.description) setBusinessDescription(b.description);
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
          if (bk.website) setWebsite(bk.website);
          if (bk.business_name && !businessName) setBusinessName(bk.business_name);
          if (bk.business_type) setBusinessType(bk.business_type);
          if (bk.registration_number) setRegistrationNumber(bk.registration_number);
          if (bk.business_model) setBusinessModel(bk.business_model);
          if (bk.selling_model) setSellingModel(bk.selling_model);
          if (bk.business_category) setBusinessCategory(bk.business_category);
          const loadedDesc = bk.business_description || bk.brand_description;
          if (loadedDesc && !businessDescription) {
            setBusinessDescription(loadedDesc);
          }
          if (bk.age_group) setSelectedAgeGroup(bk.age_group);
          if (bk.gender) setSelectedGender(bk.gender);
          if (bk.customer_type) setSelectedCustomerType(bk.customer_type);
          if (bk.location_focus) setSelectedLocationFocus(bk.location_focus);
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

  // Handle AI Logo Generation via dedicated brand logo pipeline
  const handleGenerateAiLogo = async (variationSeed?: number) => {
    const effectiveName = businessName.trim() || existingBusiness?.name || "Brand";

    setAiGenerating(true);
    setFormError(null);

    try {
      const res = await generateBrandLogo({
        business_name: effectiveName,
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
        setFormSuccess("AI Logo generated successfully!");
        setTimeout(() => setFormSuccess(null), 3500);
      } else {
        setFormError("Logo generation completed without a valid image reference. Please try again.");
      }
    } catch (err: any) {
      const msg = err.response?.data?.detail?.message || err.response?.data?.detail || err.message || "AI Logo generation failed. Please try again.";
      setFormError(typeof msg === "string" ? msg : JSON.stringify(msg));
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

      setFormSuccess("Brand Kit draft saved!");
      setTimeout(() => setFormSuccess(null), 3000);
    } catch (err: any) {
      const msg = err.response?.data?.detail?.message || err.response?.data?.detail || err.message || "Failed to save draft.";
      setFormError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setIsDraftSaving(false);
    }
  };

  // Complete & Save Brand Kit (Full validation required)
  const handleCompleteSubmission = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Field-level check for smooth UX
    if (!businessName.trim()) {
      setCurrentStep("basics");
      setFormError("Please enter your business name.");
      return;
    }

    if (!logoUrl) {
      setCurrentStep("logo");
      setFormError("Please upload or generate a logo for your brand.");
      return;
    }

    if (!businessDescription.trim() || businessDescription.trim().length < 5) {
      setCurrentStep("basics");
      setFormError("Please provide a business description (at least 5 characters).");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      // 1. Save / Update business entity
      const businessPayload = {
        name: businessName.trim(),
        category: businessCategory,
        location: selectedLocationFocus,
        description: businessDescription.trim(),
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

      // 2. Prepare full Brand Kit payload
      const audienceSummary = `Age: ${selectedAgeGroup} | Gender: ${selectedGender} | Type: ${selectedCustomerType} | Focus: ${selectedLocationFocus}`;

      const brandPayload: BrandCreate = {
        logo_url: logoUrl,
        primary_color: colors.primary,
        secondary_color: colors.secondary,
        accent_color: colors.accent,
        font: selectedFont,
        tone: selectedTone,
        business_description: businessDescription.trim(),
        brand_description: businessDescription.trim(),
        target_audience: audienceSummary,
        website: website.trim() || undefined,
        social_style: `Theme: ${colors.primary}-${colors.secondary} | Model: ${businessModel}`,
        business_name: businessName.trim(),
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

      setFormSuccess("Brand Kit completed successfully!");

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
    <div className="w-full max-w-4xl mx-auto text-white space-y-6">
      {/* HEADER WITH PROGRESS */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-purple/20 text-brand-purple border border-brand-purple/30">
              Brand Kit Setup
            </span>
            <span className="text-xs text-text-muted">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Business{" "}
            <span className="bg-gradient-to-r from-[#BE32FF] via-[#F0449B] to-[#FC9A5D] bg-clip-text text-transparent">
              Information
            </span>
          </h1>
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

      {/* STEP TABS / STEPPER */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-[#090C19] border border-white/10">
        {steps.map((st, idx) => {
          const isActive = currentStep === st.id;
          const isDone = idx < currentStepIndex;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => setCurrentStep(st.id)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-gradient-to-r from-[#BE32FF]/20 to-[#F0449B]/20 border border-[#F0449B]/40 text-white shadow-sm"
                  : isDone
                  ? "text-emerald-300 hover:bg-white/5"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                isActive
                  ? "bg-brand-pink text-white"
                  : isDone
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-white/10 text-slate-300"
              }`}>
                {isDone ? <Check className="w-3 h-3" /> : idx + 1}
              </span>
              <span className="truncate hidden sm:inline">{st.label}</span>
            </button>
          );
        })}
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
        <div>
          {/* ========================================================================= */}
          {/* STEP 1: BUSINESS BASICS                                                   */}
          {/* ========================================================================= */}
          {currentStep === "basics" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0E1122]/90 border border-white/10 shadow-lg space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center text-brand-purple">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white tracking-wide uppercase">
                      Business Basics
                    </h2>
                    <p className="text-[11px] text-text-muted">
                      Tell us about your brand to customize AI-generated marketing content.
                    </p>
                  </div>
                </div>

                {/* Business Name */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="modal-business-name" className="text-xs font-semibold text-slate-200">
                      Business Name <span className="text-brand-pink">*</span>
                    </label>
                    <span className="text-[10px] text-text-muted">Used on all branded collateral</span>
                  </div>
                  <input
                    id="modal-business-name"
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Aura Luxe Jewels, Sharma Textiles"
                    required
                    className="w-full h-11 px-3.5 rounded-xl border border-white/15 bg-[#080B17] text-sm text-white placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>

                {/* Category & Tagline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="modal-category" className="text-xs font-semibold text-slate-200">
                      Industry / Category <span className="text-brand-pink">*</span>
                    </label>
                    <select
                      id="modal-category"
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-white/15 bg-[#080B17] text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    >
                      {BUSINESS_CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value} className="bg-[#080B17] text-white">
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="modal-tagline" className="text-xs font-semibold text-slate-200">
                      Brand Tagline <span className="text-[10px] text-text-muted">(Optional)</span>
                    </label>
                    <input
                      id="modal-tagline"
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="e.g. Elegance in every diamond"
                      className="w-full h-11 px-3.5 rounded-xl border border-white/15 bg-[#080B17] text-sm text-white placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    />
                  </div>
                </div>

                {/* Website URL */}
                <div className="space-y-1.5">
                  <label htmlFor="modal-website" className="text-xs font-semibold text-slate-200">
                    Website URL <span className="text-[10px] text-text-muted">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="modal-website"
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://www.yourbrand.com"
                      className="w-full h-11 pl-9 pr-3.5 rounded-xl border border-white/15 bg-[#080B17] text-sm text-white placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    />
                    <ExternalLink className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Business Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="modal-desc" className="text-xs font-semibold text-slate-200">
                      Business Description <span className="text-brand-pink">*</span>
                    </label>
                    <span className="text-[10px] text-text-muted">
                      {businessDescription.length}/500 chars (min 5)
                    </span>
                  </div>
                  <textarea
                    id="modal-desc"
                    rows={3}
                    maxLength={500}
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    placeholder="Describe what you sell, your target customers, signature products, and brand values..."
                    className="w-full p-3 rounded-xl border border-white/15 bg-[#080B17] text-sm text-white placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-purple leading-relaxed"
                  />
                </div>
              </div>

              {/* Navigation button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!businessName.trim()) {
                      setFormError("Please enter your business name.");
                      return;
                    }
                    if (!businessDescription.trim() || businessDescription.trim().length < 5) {
                      setFormError("Please provide a business description (at least 5 characters).");
                      return;
                    }
                    setFormError(null);
                    setCurrentStep("logo");
                  }}
                  className="px-6 h-12 rounded-full bg-gradient-to-r from-[#BE32FF] to-[#F0449B] text-white font-semibold text-sm flex items-center gap-2 hover:opacity-95 shadow-md transition-all"
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
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0E1122]/90 border border-white/10 shadow-lg space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-brand-pink/20 border border-brand-pink/30 flex items-center justify-center text-brand-pink">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white tracking-wide uppercase">
                        Brand Logo Studio
                      </h2>
                      <p className="text-[11px] text-text-muted">
                        Generate distinctive vector artwork with AI or upload an existing logo.
                      </p>
                    </div>
                  </div>

                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                      title="Remove current logo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  )}
                </div>

                {/* LOGO WORKSPACE & PREVIEW */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  {/* Left: Preview Box */}
                  <div className="md:col-span-5 flex flex-col items-center">
                    <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-2xl bg-[#070913] border-2 border-white/15 flex items-center justify-center overflow-hidden shadow-2xl group">
                      {logoUrl && !logoLoadFailed ? (
                        <>
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
                      onClick={() => setShowAiStudio(!showAiStudio)}
                      className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#BE32FF]/20 via-[#F0449B]/20 to-[#FC9A5D]/20 border border-[#F0449B]/50 hover:border-[#F0449B] text-white font-semibold text-sm flex items-center justify-between px-4 transition-all shadow-md group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#BE32FF] to-[#F0449B] flex items-center justify-center shadow-md">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <span className="block text-xs sm:text-sm font-bold text-white">
                            Generate Logo with AI
                          </span>
                          <span className="block text-[10px] text-slate-300">
                            Custom vector artwork in 10 visual directions
                          </span>
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform ${showAiStudio ? "rotate-180" : ""}`} />
                    </button>

                    {/* Upload File Button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={logoUploading}
                      className="w-full h-12 rounded-xl bg-white/5 border border-white/15 hover:bg-white/10 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                    >
                      {logoUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-brand-purple" />
                      ) : (
                        <Upload className="w-4 h-4 text-slate-300" />
                      )}
                      <span>{logoUploading ? "Uploading logo..." : "Upload Logo from Computer (PNG, JPG, SVG)"}</span>
                    </button>

                    {/* Download & Preview Actions if Logo exists */}
                    {logoUrl && (
                      <div className="flex gap-2">
                        <a
                          href={getDisplayLogoUrl(logoUrl)}
                          download={`${businessName || "brand"}_logo.png`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5 text-brand-pink" />
                          <span>Download PNG</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => setZoomLogoUrl(getDisplayLogoUrl(logoUrl))}
                          className="flex-1 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <ZoomIn className="w-3.5 h-3.5 text-brand-purple" />
                          <span>Zoom Preview</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI LOGO GENERATION EXPANDABLE STUDIO */}
                {showAiStudio && (
                  <div className="mt-4 p-5 rounded-2xl bg-[#090C19] border border-brand-purple/40 space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <Wand2 className="w-4 h-4 text-brand-pink" />
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                          AI Logo Customization Studio
                        </h3>
                      </div>
                      <span className="text-[11px] text-text-muted">Powered by AI Vector Engine</span>
                    </div>

                    {/* 1. Logo Style Selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-200 block">
                        Select Logo Direction / Style
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {LOGO_STYLES.map((st) => {
                          const isSel = selectedLogoStyle === st.id;
                          return (
                            <button
                              key={st.id}
                              type="button"
                              onClick={() => setSelectedLogoStyle(st.id)}
                              className={`p-2.5 rounded-xl text-left transition-all flex flex-col justify-between ${
                                isSel
                                  ? "bg-gradient-to-tr from-[#BE32FF]/20 to-[#F0449B]/20 border border-[#F0449B] shadow-sm"
                                  : "bg-[#0E1122] border border-white/10 hover:border-white/20"
                              }`}
                            >
                              <span className={`text-[11px] font-bold block ${isSel ? "text-white" : "text-slate-300"}`}>
                                {st.label}
                              </span>
                              <span className="text-[9px] text-text-muted line-clamp-2 mt-1 leading-snug">
                                {st.desc}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. Visual Prompt & Guidance */}
                    <div className="space-y-1.5">
                      <label htmlFor="ai-prompt-input" className="text-xs font-semibold text-slate-200 block">
                        Visual Theme or Symbol Preference <span className="text-[10px] text-text-muted">(Optional)</span>
                      </label>
                      <input
                        id="ai-prompt-input"
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="e.g. Diamond crown emblem, falcon wing, interlocking golden monogram, sleek geometric polygon"
                        className="w-full h-11 px-3.5 rounded-xl border border-white/15 bg-[#080B17] text-xs text-white placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                      />
                    </div>

                    {/* 3. Color Direction & Options */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-300">Using Palette:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full border border-white/20 shadow-xs" style={{ backgroundColor: colors.primary }} title={`Primary ${colors.primary}`} />
                          <span className="w-4 h-4 rounded-full border border-white/20 shadow-xs" style={{ backgroundColor: colors.secondary }} title={`Secondary ${colors.secondary}`} />
                          <span className="w-4 h-4 rounded-full border border-white/20 shadow-xs" style={{ backgroundColor: colors.accent }} title={`Accent ${colors.accent}`} />
                        </div>
                      </div>

                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
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
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => handleGenerateAiLogo()}
                        disabled={aiGenerating}
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-[#BE32FF] via-[#F0449B] to-[#FC9A5D] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 shadow-lg transition-all"
                      >
                        {aiGenerating ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Crafting your brand logo artwork...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>Generate AI Logo Now</span>
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
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep("basics")}
                  className="px-5 h-12 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Basics</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormError(null);
                    setCurrentStep("identity");
                  }}
                  className="px-6 h-12 rounded-full bg-gradient-to-r from-[#BE32FF] to-[#F0449B] text-white font-semibold text-sm flex items-center gap-2 hover:opacity-95 shadow-md transition-all"
                >
                  <span>Continue to Brand Identity</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
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
                  <div className="flex items-center justify-between pb-1 border-b border-white/5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                        <Type className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-white tracking-wide">Brand Typography</h2>
                        <p className="text-[10px] text-text-muted">Primary font used across posts and titles</p>
                      </div>
                    </div>

                    <select
                      value={selectedFont}
                      onChange={(e) => setSelectedFont(e.target.value)}
                      className="h-8 px-2.5 rounded-lg border border-white/15 bg-[#0B1020] text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    >
                      {SUPPORTED_FONTS.map((font) => (
                        <option key={font.name} value={font.name} className="bg-[#0B1020] text-white">
                          {font.name} ({font.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Typography Specimen Display */}
                  <div className="p-4 rounded-xl bg-[#090C19] border border-white/5 flex items-center justify-around text-center">
                    <div style={{ fontFamily: selectedFont }}>
                      <span className="text-2xl sm:text-3xl font-bold text-white block">Aa</span>
                      <span className="text-[10px] text-text-muted mt-1 block">Upper & Lower</span>
                    </div>
                    <div style={{ fontFamily: selectedFont }}>
                      <span className="text-2xl sm:text-3xl font-bold text-white block">Heading</span>
                      <span className="text-[10px] text-text-muted mt-1 block">{selectedFont}</span>
                    </div>
                    <div style={{ fontFamily: selectedFont }}>
                      <span className="text-2xl sm:text-3xl font-bold text-brand-pink block">123</span>
                      <span className="text-[10px] text-text-muted mt-1 block">Numerals</span>
                    </div>
                  </div>

                  {/* Font Description */}
                  <p className="text-[11px] text-slate-300 italic">
                    {SUPPORTED_FONTS.find((f) => f.name === selectedFont)?.sample || "Versatile typography"}
                  </p>
                </div>

                {/* 2. BRAND PERSONALITY / TONE */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#0E1122]/90 border border-white/10 shadow-lg space-y-4">
                  <div className="flex items-center gap-2.5 pb-1 border-b border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                      <Sliders className="w-4 h-4 text-brand-coral" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white tracking-wide">Brand Personality</h2>
                      <p className="text-[10px] text-text-muted">Guides caption tone and copywriting</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {BRAND_TONES.map((tone) => {
                      const isSel = selectedTone === tone;
                      return (
                        <button
                          key={tone}
                          type="button"
                          onClick={() => setSelectedTone(tone)}
                          className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                            isSel
                              ? "bg-gradient-to-r from-[#BE32FF]/20 to-[#F0449B]/20 border border-[#F0449B] text-white shadow-xs"
                              : "bg-[#080B17] border border-white/10 hover:border-white/20 text-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{tone}</span>
                            {isSel && <Check className="w-3.5 h-3.5 text-brand-pink" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 3. COLOR PALETTE WITH SMART PRESETS & LIVE PICKER */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0E1122]/90 border border-white/10 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                      <Palette className="w-4 h-4 text-brand-pink" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white tracking-wide">Brand Color Palette</h2>
                      <p className="text-[10px] text-text-muted">Used for ads, banners, gradients, and typography accents</p>
                    </div>
                  </div>

                  {/* Smart Palette Suggestions Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-text-muted mr-1">Presets:</span>
                    {CURATED_COLOR_PRESETS.slice(0, 4).map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setColors({
                            primary: preset.primary,
                            secondary: preset.secondary,
                            accent: preset.accent,
                          });
                        }}
                        className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-slate-300 flex items-center gap-1 transition-colors"
                        title={preset.name}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: preset.primary }} />
                        <span className="truncate max-w-[80px]">{preset.name.split(" ")[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Color Picker Component */}
                <LiveColorPicker
                  colors={colors}
                  onChange={setColors}
                  selectedFont={selectedFont}
                />
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep("logo")}
                  className="px-5 h-12 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Logo</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormError(null);
                    setCurrentStep("audience");
                  }}
                  className="px-6 h-12 rounded-full bg-gradient-to-r from-[#BE32FF] to-[#F0449B] text-white font-semibold text-sm flex items-center gap-2 hover:opacity-95 shadow-md transition-all"
                >
                  <span>Continue to Audience</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: AUDIENCE & STRUCTURE                                              */}
          {/* ========================================================================= */}
          {currentStep === "audience" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0E1122]/90 border border-white/10 shadow-lg space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand-pink">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white tracking-wide uppercase">
                      Target Audience Demographics
                    </h2>
                    <p className="text-[11px] text-text-muted">Specifies who your marketing campaigns should target.</p>
                  </div>
                </div>

                {/* Age Group Chips */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-200 block">Target Age Group</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {AUDIENCE_AGE_GROUPS.map((age) => {
                      const isSelected = selectedAgeGroup === age;
                      return (
                        <button
                          key={age}
                          type="button"
                          onClick={() => setSelectedAgeGroup(age)}
                          className={`h-11 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center ${
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

                {/* Gender Focus & Customer Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="modal-gender" className="text-xs font-semibold text-slate-200">
                      Gender Focus
                    </label>
                    <select
                      id="modal-gender"
                      value={selectedGender}
                      onChange={(e) => setSelectedGender(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-white/15 bg-[#080B17] text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    >
                      {GENDER_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#080B17] text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="modal-customer-type" className="text-xs font-semibold text-slate-200">
                      Customer Segment
                    </label>
                    <select
                      id="modal-customer-type"
                      value={selectedCustomerType}
                      onChange={(e) => setSelectedCustomerType(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-white/15 bg-[#080B17] text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
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
                <div className="space-y-1.5">
                  <label htmlFor="modal-loc-focus" className="text-xs font-semibold text-slate-200">
                    Location Focus
                  </label>
                  <select
                    id="modal-loc-focus"
                    value={selectedLocationFocus}
                    onChange={(e) => setSelectedLocationFocus(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-white/15 bg-[#080B17] text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  >
                    {LOCATION_FOCUS_OPTIONS.map((loc) => (
                      <option key={loc} value={loc} className="bg-[#080B17] text-white">
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ADVANCED BUSINESS STRUCTURE (PROGRESSIVE DISCLOSURE) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0E1122]/90 border border-white/10 shadow-lg space-y-4">
                <button
                  type="button"
                  onClick={() => setShowAdvancedBusiness(!showAdvancedBusiness)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                      <Building className="w-4 h-4 text-brand-purple" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-wide">
                        Business Structure & Legal Details
                      </h3>
                      <p className="text-[10px] text-text-muted">Business model, selling model, and registration</p>
                    </div>
                  </div>
                  {showAdvancedBusiness ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {showAdvancedBusiness && (
                  <div className="pt-3 border-t border-white/5 space-y-4 animate-in fade-in">
                    {/* Business Type & Registration Number */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="modal-business-type" className="text-xs font-semibold text-slate-200">
                          Business Type
                        </label>
                        <select
                          id="modal-business-type"
                          value={businessType}
                          onChange={(e) => setBusinessType(e.target.value)}
                          className="w-full h-11 px-3 rounded-xl border border-white/15 bg-[#080B17] text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                        >
                          {BUSINESS_TYPES.map((type) => (
                            <option key={type} value={type} className="bg-[#080B17] text-white">
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="modal-reg-num" className="text-xs font-semibold text-slate-200">
                          Registration Number <span className="text-[10px] text-text-muted">(Optional)</span>
                        </label>
                        <input
                          id="modal-reg-num"
                          type="text"
                          value={registrationNumber}
                          onChange={(e) => setRegistrationNumber(e.target.value)}
                          placeholder="GSTIN / Udyam / Reg #"
                          className="w-full h-11 px-3.5 rounded-xl border border-white/15 bg-[#080B17] text-sm text-white placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-purple uppercase"
                        />
                      </div>
                    </div>

                    {/* Business Model & Selling Model */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="modal-business-model" className="text-xs font-semibold text-slate-200">
                          Business Model
                        </label>
                        <select
                          id="modal-business-model"
                          value={businessModel}
                          onChange={(e) => setBusinessModel(e.target.value)}
                          className="w-full h-11 px-3 rounded-xl border border-white/15 bg-[#080B17] text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                        >
                          {BUSINESS_MODELS.map((model) => (
                            <option key={model} value={model} className="bg-[#080B17] text-white">
                              {model}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="modal-selling-model" className="text-xs font-semibold text-slate-200">
                          Selling Model
                        </label>
                        <select
                          id="modal-selling-model"
                          value={sellingModel}
                          onChange={(e) => setSellingModel(e.target.value)}
                          className="w-full h-11 px-3 rounded-xl border border-white/15 bg-[#080B17] text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
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
                )}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep("identity")}
                  className="px-5 h-12 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Identity</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormError(null);
                    setCurrentStep("review");
                  }}
                  className="px-6 h-12 rounded-full bg-gradient-to-r from-[#BE32FF] to-[#F0449B] text-white font-semibold text-sm flex items-center gap-2 hover:opacity-95 shadow-md transition-all"
                >
                  <span>Continue to Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5: REVIEW & SAVE                                                     */}
          {/* ========================================================================= */}
          {currentStep === "review" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0E1122]/90 border border-white/10 shadow-lg space-y-5">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white tracking-wide uppercase">
                      Brand Kit Summary & Confirmation
                    </h2>
                    <p className="text-[11px] text-text-muted">Review your configuration before saving to your profile.</p>
                  </div>
                </div>

                {/* INTERACTIVE BRAND CARD SUMMARY */}
                <div className="p-5 rounded-2xl bg-[#080B17] border border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Logo Preview */}
                      <div className="w-16 h-16 rounded-xl bg-[#070913] border border-white/15 flex items-center justify-center overflow-hidden shrink-0">
                        {logoUrl && !logoLoadFailed ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={getDisplayLogoUrl(logoUrl)}
                            alt="Logo"
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <div className="text-sm font-bold text-brand-pink">{initials}</div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white">
                          {businessName || "Your Business Name"}
                        </h3>
                        {tagline && <p className="text-xs text-text-muted italic">&ldquo;{tagline}&rdquo;</p>}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                            {BUSINESS_CATEGORIES.find((c) => c.value === businessCategory)?.label || businessCategory}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Ready
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Color Swatches Pill */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-[10px] text-text-muted">Palette:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-md border border-white/20" style={{ backgroundColor: colors.primary }} title={`Primary ${colors.primary}`} />
                        <span className="w-5 h-5 rounded-md border border-white/20" style={{ backgroundColor: colors.secondary }} title={`Secondary ${colors.secondary}`} />
                        <span className="w-5 h-5 rounded-md border border-white/20" style={{ backgroundColor: colors.accent }} title={`Accent ${colors.accent}`} />
                      </div>
                    </div>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/5 text-xs">
                    <div>
                      <span className="text-[10px] text-text-muted block">Typography</span>
                      <span className="font-semibold text-white">{selectedFont}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-text-muted block">Tone & Voice</span>
                      <span className="font-semibold text-white truncate block">{selectedTone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-text-muted block">Target Audience</span>
                      <span className="font-semibold text-white">{selectedAgeGroup} | {selectedGender.split(" ")[0]}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-text-muted block">Location Focus</span>
                      <span className="font-semibold text-white truncate block">{selectedLocationFocus.split("(")[0]}</span>
                    </div>
                  </div>

                  {/* Business Description in Summary */}
                  <div className="pt-3 border-t border-white/5 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">
                        Business Description
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep("basics")}
                        className="text-[10px] text-brand-purple hover:text-brand-pink transition-colors underline"
                      >
                        Edit
                      </button>
                    </div>
                    {businessDescription.trim() ? (
                      <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">
                        {businessDescription}
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setFormError("Please provide a business description (at least 5 characters).");
                          setCurrentStep("basics");
                        }}
                        className="text-amber-400 hover:text-amber-300 text-xs flex items-center gap-1.5 underline underline-offset-2"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Description missing — click here to add on Basics step</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Account details verified badge */}
                <div className="p-3 rounded-xl bg-[#080B17]/60 border border-white/5 flex items-center justify-between text-xs text-text-muted">
                  <span>Linked Account: <strong className="text-slate-200">{user?.email || "User"}</strong></span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Verified Profile
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS: SAVE & CONTINUE + DRAFT */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep("audience")}
                  className="w-full sm:w-auto px-6 h-14 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Edit</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isDraftSaving || isSubmitting}
                  className="w-full sm:w-auto px-6 h-14 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isDraftSaving ? <Loader2 className="w-4 h-4 animate-spin text-brand-pink" /> : <Save className="w-4 h-4" />}
                  <span>Save Draft</span>
                </button>

                <button
                  type="button"
                  onClick={handleCompleteSubmission}
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 h-14 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 bg-gradient-to-r from-[#BE32FF] via-[#F0449B] to-[#FC9A5D] text-white shadow-[0_0_30px_rgba(240,68,155,0.4)] hover:shadow-[0_0_40px_rgba(240,68,155,0.6)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Completing Brand Kit...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete & Save Brand Kit</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
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
