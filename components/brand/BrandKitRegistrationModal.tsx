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
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  getBrandKit,
  createBrandKit,
  updateBrandKit,
  uploadBrandLogo,
} from "@/services/brand.service";
import { businessService } from "@/services/business.service";
import { imageService } from "@/services/image.service";
import { BrandKit, BrandCreate } from "@/types/brand";
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
} from "@/lib/brand-kit";

interface BrandKitRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  isModal?: boolean; // true if overlay popup, false if embedded page
}

export function BrandKitRegistrationModal({
  isOpen,
  onClose,
  onComplete,
  isModal = true,
}: BrandKitRegistrationModalProps) {
  const { user } = useAuth();

  // Existing data states
  const [existingBrand, setExistingBrand] = useState<BrandKit | null>(null);
  const [existingBusiness, setExistingBusiness] = useState<Business | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Form states
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [logoUploading, setLogoUploading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);

  // Typography & Colors
  const [selectedFont, setSelectedFont] = useState("Inter");
  const [colors, setColors] = useState<ColorScheme>({
    primary: "#BE32FF",
    secondary: "#F0449B",
    accent: "#FC9A5D",
  });

  // Business Details
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0]);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [businessModel, setBusinessModel] = useState(BUSINESS_MODELS[0]);
  const [sellingModel, setSellingModel] = useState(SELLING_MODELS[0]);
  const [businessCategory, setBusinessCategory] = useState("clothing");
  const [businessDescription, setBusinessDescription] = useState("");

  // Target Audience
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("25 - 35");
  const [selectedGender, setSelectedGender] = useState(GENDER_OPTIONS[0]);
  const [selectedCustomerType, setSelectedCustomerType] = useState(CUSTOMER_TYPES[0]);
  const [selectedLocationFocus, setSelectedLocationFocus] = useState(LOCATION_FOCUS_OPTIONS[3]); // Pan-India

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        }

        if (brand.status === "fulfilled" && brand.value) {
          const bk = brand.value;
          setExistingBrand(bk);
          if (bk.logo_url) setLogoUrl(bk.logo_url);
          if (bk.primary_color) {
            setColors((prev) => ({
              ...prev,
              primary: bk.primary_color || prev.primary,
              secondary: bk.secondary_color || prev.secondary,
              accent: bk.accent_color || prev.accent,
            }));
          }
          if (bk.font) setSelectedFont(bk.font);
          if (bk.business_name && !businessName) setBusinessName(bk.business_name);
          if (bk.business_type) setBusinessType(bk.business_type);
          if (bk.registration_number) setRegistrationNumber(bk.registration_number);
          if (bk.business_model) setBusinessModel(bk.business_model);
          if (bk.selling_model) setSellingModel(bk.selling_model);
          if (bk.business_category) setBusinessCategory(bk.business_category);
          if (bk.brand_description && !businessDescription) {
            setBusinessDescription(bk.brand_description);
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

  // Handle Logo Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormError("Logo image size must be less than 5MB.");
      return;
    }

    // Validate type
    if (!file.type.startsWith("image/")) {
      setFormError("Please upload a valid image file (PNG, JPG, SVG, WebP).");
      return;
    }

    setLogoUploading(true);
    setFormError(null);

    try {
      const uploadedUrl = await uploadBrandLogo(file);
      setLogoUrl(uploadedUrl);
      setFormSuccess("Logo uploaded successfully!");
      setTimeout(() => setFormSuccess(null), 3000);
    } catch (err: any) {
      setFormError(err.message || "Failed to upload image. Please try again.");
    } finally {
      setLogoUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Handle AI Logo Generation
  const handleGenerateAiLogo = async () => {
    if (!aiPrompt.trim()) {
      setFormError("Please enter a description for your logo.");
      return;
    }

    setAiGenerating(true);
    setFormError(null);

    try {
      const prompt = `${businessName || "Brand"} logo design: ${aiPrompt.trim()}, clean vector emblem, minimalist luxury style, high resolution, solid dark background`;
      const res = await imageService.generateImage({ prompt });

      if (res.success && res.data?.image_url) {
        setLogoUrl(res.data.image_url);
        setShowAiModal(false);
        setAiPrompt("");
        setFormSuccess("Logo generated with AI successfully!");
        setTimeout(() => setFormSuccess(null), 3000);
      } else {
        setFormError(res.message || "Unable to generate logo with AI. Please try again or upload an image.");
      }
    } catch (err: any) {
      setFormError(err.message || "AI Logo generation failed. Please try again.");
    } finally {
      setAiGenerating(false);
    }
  };

  // Resolve logo URL for display
  const getDisplayLogoUrl = (url: string) => {
    if (!url) return "";
    const clean = url.replace(/\\/g, "/");
    if (clean.startsWith("http")) return clean;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return `${baseUrl}${clean.startsWith("/") ? "" : "/"}${clean}`;
  };

  // Handle Save & Continue
  const handleSaveAndContinue = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!businessName.trim()) {
      setFormError("Please enter your business name.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      // 1. Ensure Business exists or is updated
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

      let savedBusiness = existingBusiness;
      if (existingBusiness) {
        savedBusiness = await businessService.updateBusiness(businessPayload);
      } else {
        savedBusiness = await businessService.createBusiness(businessPayload);
      }
      setExistingBusiness(savedBusiness);

      // 2. Prepare Brand Kit payload
      const audienceSummary = `Age: ${selectedAgeGroup} | Gender: ${selectedGender} | Type: ${selectedCustomerType} | Focus: ${selectedLocationFocus}`;

      const brandPayload: BrandCreate = {
        logo_url: logoUrl || undefined,
        primary_color: colors.primary,
        secondary_color: colors.secondary,
        accent_color: colors.accent,
        font: selectedFont,
        brand_description: businessDescription.trim() || `${businessName} Brand Profile`,
        target_audience: audienceSummary,
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

      // 3. Save or Update Brand Kit
      let savedBrandKit: BrandKit;
      if (existingBrand) {
        savedBrandKit = await updateBrandKit(brandPayload);
      } else {
        savedBrandKit = await createBrandKit(brandPayload);
      }
      setExistingBrand(savedBrandKit);

      setFormSuccess("Brand Kit & Business Information saved successfully!");

      // 4. Trigger completion callback & close
      setTimeout(() => {
        if (onComplete) onComplete();
        onClose();
      }, 1000);
    } catch (err: any) {
      setFormError(
        err.message ||
          "Failed to save Brand Kit details. Please verify your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const content = (
    <div className="w-full max-w-4xl mx-auto text-white space-y-6">
      {/* Header matching reference */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Business{" "}
            <span className="bg-gradient-to-r from-[#BE32FF] via-[#F0449B] to-[#FC9A5D] bg-clip-text text-transparent">
              Information
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Complete your brand kit to power AI-generated posts, reels & ads.
          </p>
        </div>

        {/* Decline / Close button */}
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 flex items-center justify-center text-text-muted hover:text-white transition-colors"
          title="Dismiss for now"
          aria-label="Dismiss for now"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Global Alerts */}
      {formError && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3 animate-in fade-in"
        >
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-200">Attention Required</p>
            <p className="text-xs text-red-300/90 mt-0.5">{formError}</p>
          </div>
        </div>
      )}

      {formSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{formSuccess}</span>
        </div>
      )}

      {initialLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
            <p className="text-xs text-text-muted">Loading your brand configuration...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSaveAndContinue} className="space-y-6">
          {/* SECTION 1: BUSINESS LOGO */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0E1122]/90 border border-white/10 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              Business Logo
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Logo Preview Square */}
              <div className="relative w-28 h-28 rounded-2xl bg-[#070913] border-2 border-white/15 flex items-center justify-center overflow-hidden shrink-0 group">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getDisplayLogoUrl(logoUrl)}
                    alt="Business Logo"
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-3 text-text-muted">
                    <Store className="w-8 h-8 text-white/30 mb-1" />
                    <span className="text-[10px]">No logo uploaded</span>
                  </div>
                )}

                {/* Remove action overlay */}
                {logoUrl && (
                  <button
                    type="button"
                    onClick={() => setLogoUrl("")}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-400 gap-1 text-xs"
                    title="Remove logo"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex-1 w-full flex flex-col sm:flex-row items-stretch gap-3">
                {/* Upload Image Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={logoUploading}
                  className="flex-1 h-12 rounded-xl bg-white/5 border border-white/15 hover:bg-white/10 hover:border-white/30 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                >
                  {logoUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-brand-purple" />
                  ) : (
                    <Upload className="w-4 h-4 text-slate-300" />
                  )}
                  <span>{logoUploading ? "Uploading..." : "Upload Image"}</span>
                </button>

                {/* Generate with AI Button */}
                <button
                  type="button"
                  onClick={() => setShowAiModal(true)}
                  className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#BE32FF]/20 via-[#F0449B]/20 to-[#FC9A5D]/20 border border-[#F0449B]/40 hover:border-[#F0449B]/80 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-[#F0449B]" />
                  <span>Generate with AI</span>
                </button>
              </div>
            </div>

            {/* AI Logo Generation Drawer/Modal */}
            {showAiModal && (
              <div className="mt-3 p-4 rounded-xl bg-[#090C19] border border-brand-purple/30 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-pink" /> Generate Logo with AI
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAiModal(false)}
                    className="text-xs text-text-muted hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. Modern golden monogram with letter A, luxury boutique icon"
                    className="flex-1 h-10 px-3 rounded-lg border border-white/15 bg-surface text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateAiLogo}
                    disabled={aiGenerating}
                    className="px-4 h-10 rounded-lg bg-gradient-to-r from-[#BE32FF] to-[#F0449B] text-white font-semibold text-xs flex items-center gap-1.5 shrink-0 hover:opacity-95 disabled:opacity-50"
                  >
                    {aiGenerating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>{aiGenerating ? "Generating..." : "Generate"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: TYPOGRAPHY & COLOURS (TWO CARDS) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Font Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0E1122]/90 border border-white/10 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                    <Type className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-wide">Font</h3>
                </div>

                {/* Font Selector Dropdown */}
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

              {/* Font Typography Sample matching reference */}
              <div className="p-4 rounded-xl bg-[#090C19] border border-white/5 flex items-center justify-around text-center">
                <div style={{ fontFamily: selectedFont }}>
                  <span className="text-2xl sm:text-3xl font-bold text-white block">Aa</span>
                  <span className="text-xs text-text-muted mt-1 block">Upper & Lower</span>
                </div>
                <div style={{ fontFamily: selectedFont }}>
                  <span className="text-2xl sm:text-3xl font-bold text-white block">Bb</span>
                  <span className="text-xs text-text-muted mt-1 block">Heading Font</span>
                </div>
                <div style={{ fontFamily: selectedFont }}>
                  <span className="text-2xl sm:text-3xl font-bold text-white block">Cc</span>
                  <span className="text-xs text-text-muted mt-1 block">Body Font</span>
                </div>
                <div style={{ fontFamily: selectedFont }}>
                  <span className="text-2xl sm:text-3xl font-bold text-brand-pink block">123</span>
                  <span className="text-xs text-text-muted mt-1 block">Numerals</span>
                </div>
              </div>
            </div>

            {/* Colour Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0E1122]/90 border border-white/10 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                    <Palette className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-wide">Colour</h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-purple/20 text-brand-purple border border-brand-purple/30">
                  Select
                </span>
              </div>

              {/* 3 Color Swatches & Live Picker */}
              <LiveColorPicker
                colors={colors}
                onChange={setColors}
                selectedFont={selectedFont}
              />
            </div>
          </div>

          {/* SECTION 3: BUSINESS DETAILS */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0E1122]/90 border border-white/10 shadow-lg space-y-4">
            <div className="flex items-center gap-2.5 pb-1">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                <Store className="w-4 h-4 text-brand-coral" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-wide">Business Details</h3>
            </div>

            {/* Business Name */}
            <div className="space-y-1.5">
              <label htmlFor="modal-business-name" className="text-xs font-medium text-slate-300">
                Business Name <span className="text-brand-pink">*</span>
              </label>
              <input
                id="modal-business-name"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Enter your business name (e.g. Sharma Apparels)"
                required
                className="w-full h-11 px-3.5 rounded-xl border border-white/15 bg-[#080B17] text-sm text-white placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>

            {/* Business Type & Registration Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="modal-business-type" className="text-xs font-medium text-slate-300">
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
                <label htmlFor="modal-reg-num" className="text-xs font-medium text-slate-300">
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
                <label htmlFor="modal-business-model" className="text-xs font-medium text-slate-300">
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
                <label htmlFor="modal-selling-model" className="text-xs font-medium text-slate-300">
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

            {/* Business Category */}
            <div className="space-y-1.5">
              <label htmlFor="modal-category" className="text-xs font-medium text-slate-300">
                Business Category
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

            {/* Business Description */}
            <div className="space-y-1.5">
              <label htmlFor="modal-desc" className="text-xs font-medium text-slate-300">
                Business Description
              </label>
              <textarea
                id="modal-desc"
                rows={3}
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                placeholder="Describe what you sell, your target customers, and unique features..."
                className="w-full p-3 rounded-xl border border-white/15 bg-[#080B17] text-sm text-white placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>
          </div>

          {/* SECTION 4: TARGET AUDIENCE */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0E1122]/90 border border-white/10 shadow-lg space-y-4">
            <div className="flex items-center gap-2.5 pb-1">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                <Users className="w-4 h-4 text-brand-pink" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-wide">Target Audience</h3>
            </div>

            {/* Age Group Chips matching reference */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-slate-300 block">Age Group</span>
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
                      <span
                        className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                          isSelected ? "bg-[#11162C] text-white" : ""
                        }`}
                      >
                        {age}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gender & Customer Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="modal-gender" className="text-xs font-medium text-slate-300">
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
                <label htmlFor="modal-customer-type" className="text-xs font-medium text-slate-300">
                  Select Customer Type
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
              <label htmlFor="modal-loc-focus" className="text-xs font-medium text-slate-300">
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

          {/* SECTION 5: ACCOUNT DETAILS (READ-ONLY PROFILE DETAILS PER REQUIREMENT 9) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0E1122]/90 border border-white/10 shadow-lg space-y-4">
            <div className="flex items-center gap-2.5 pb-1">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                <Building className="w-4 h-4 text-brand-purple" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-wide">Account Details</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-xs font-medium text-slate-300 block">Registered Email</span>
                <div className="h-11 px-3.5 rounded-xl border border-white/10 bg-[#080B17]/60 text-sm text-slate-300 flex items-center justify-between">
                  <span className="truncate">{user?.email || "merchant@dhandagrow.ai"}</span>
                  <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                    Verified
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-medium text-slate-300 block">Verified Mobile Number</span>
                <div className="h-11 px-3.5 rounded-xl border border-white/10 bg-[#080B17]/60 text-sm text-slate-300 flex items-center justify-between">
                  <span>{user?.phone || user?.phone_number || "Verified Phone"}</span>
                  <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                    OTP Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 6: GENERATING FOR (INFORMATIONAL PREVIEW) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0E1122]/90 border border-white/10 shadow-lg space-y-3">
            <h4 className="text-sm font-bold italic text-white tracking-wide">
              Generating for
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_#34d399]" />
                <span>LinkedIn Post</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_#34d399]" />
                <span>Instagram Post</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_#34d399]" />
                <span>Reels & Stories</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_#34d399]" />
                <span>Marketing Campaigns</span>
              </li>
            </ul>
          </div>

          {/* ACTION BUTTONS: SAVE & CONTINUE + DECLINE */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:flex-1 h-14 rounded-full font-semibold text-base sm:text-lg flex items-center justify-center gap-2 bg-gradient-to-r from-[#BE32FF] via-[#F0449B] to-[#FC9A5D] text-white shadow-[0_0_30px_rgba(240,68,155,0.4)] hover:shadow-[0_0_40px_rgba(240,68,155,0.6)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving Brand Kit...</span>
                </>
              ) : (
                <>
                  <span>Save & Continue</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {isModal && (
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 h-14 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white text-sm font-semibold transition-colors"
              >
                Skip for Now
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );

  // If used as modal overlay
  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300">
        <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#090A15] border border-white/15 p-4 sm:p-8 shadow-2xl custom-scrollbar">
          {content}
        </div>
      </div>
    );
  }

  // If embedded directly on page (e.g. /brand)
  return content;
}
