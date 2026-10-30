"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  CheckCircle2, 
  User as UserIcon, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Store, 
  Briefcase, 
  Tag, 
  Globe, 
  Calendar, 
  Palette, 
  Upload, 
  ShieldCheck, 
  Layers, 
  Loader2,
  Users,
  Target,
  FileText,
  ShoppingBag,
  Clapperboard,
  Link2,
  X,
  RotateCw,
  Minus,
  Plus,
  Search,
  Pencil,
  Quote,
  Info,
  Image as ImageIcon,
  Star,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Lock,
  Bell,
  AlertTriangle,
  Shield,
  Volume2,
  LayoutDashboard,
  Megaphone,
  Camera,
  Bot,
  Video
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/components/auth/AuthProvider";
import { userService } from "@/services/user.service";
import { businessService } from "@/services/business.service";
import {
  OnboardingService,
  extractErrorMessage,
  ONLINE_PRESENCE_BACKEND_MAP,
  BACKEND_TO_PRESENCE_MAP,
} from "@/services/onboarding.service";
import { authService } from "@/services/auth.service";
import influencerService from "@/services/influencer.service";
import { aiService, WebsiteAnalysisData } from "@/services/ai.service";
import { getBrandKit, updateBrandKit, uploadBrandLogo } from "@/services/brand.service";
import {
  CURATED_COLOR_PRESETS,
  SUPPORTED_FONTS,
  ColorPreset,
  calculateBrandKitCompletion,
} from "@/lib/brand-kit";
import { googleMapsService, GooglePlaceResult } from "@/services/googleMaps.service";
import { BUSINESS_CATEGORIES, BusinessCategoryItem } from "@/lib/business-categories";
import {
  MARKETPLACE_SELLER_PLATFORMS,
  DIRECTORY_LISTING_PLATFORMS,
  B2B_WHOLESALE_PLATFORMS,
  B2B_ADDITIONAL_LISTINGS,
  PlatformItem,
} from "@/lib/marketplace-platforms";
import { PlatformIcon } from "@/components/onboarding/PlatformIcon";
import { AvailablePlansModal } from "@/components/plans/AvailablePlansModal";
import { contentService } from "@/services/content.service";
import { GeneratedPost } from "@/types/content";

type AccountType = "user" | "business" | "influencer";

// Coat Hanger Icon matching reference screenshot for Fashion Photoshoot
const HangerIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 4a2 2 0 0 0-2 2c0 .8.5 1.5 1.2 1.8L3 14a1 1 0 0 0 0 1.2c.2.5.7.8 1.2.8h15.6c.5 0 1-.3 1.2-.8a1 1 0 0 0 0-1.2L12.8 7.8c.7-.3 1.2-1 1.2-1.8a2 2 0 0 0-2-2z" />
  </svg>
);

// Video Camera / Play Icon matching reference screenshot for Marketing Video
const VideoMarketingIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="4" width="14" height="16" rx="2" />
    <path d="m16 9 6-3v12l-6-3" />
    <polygon points="7 10 11 12 7 14 7 10" fill="currentColor" stroke="none" />
  </svg>
);

// 7 Selectable Business Services matching Designer Screenshots (Multi-selection enabled)
export const BUSINESS_SERVICES_OPTIONS = [
  {
    id: "automate_social_media",
    title: "Automate Social Media",
    desc: "Auto post, schedule and grow your brand",
    icon: Megaphone,
    iconBg: "bg-[#EDE9FE] dark:bg-[#3B2D54]",
    iconColor: "text-[#7C3AED] dark:text-[#A78BFA]",
  },
  {
    id: "marketing_video",
    title: "Marketing Video",
    desc: "Create engaging videos with AI",
    icon: VideoMarketingIcon,
    iconBg: "bg-[#FCE7F3] dark:bg-[#4E243B]",
    iconColor: "text-[#EC4899] dark:text-[#F472B6]",
  },
  {
    id: "fashion_photoshoot",
    title: "Fashion Photoshoot",
    desc: "AI model photos for your clothing brand",
    icon: HangerIcon,
    iconBg: "bg-[#F5D0FE] dark:bg-[#4A244E]",
    iconColor: "text-[#C026D3] dark:text-[#E879F9]",
  },
  {
    id: "product_photoshoot",
    title: "Product Photoshoot",
    desc: "Stunning product photos with AI",
    icon: Camera,
    iconBg: "bg-[#FFEDD5] dark:bg-[#523321]",
    iconColor: "text-[#F97316] dark:text-[#FB923C]",
  },
  {
    id: "ai_website_builder",
    title: "AI Website Builder",
    desc: "Create your business website in minutes",
    icon: Globe,
    iconBg: "bg-[#D1FAE5] dark:bg-[#1A3D33]",
    iconColor: "text-[#10B981] dark:text-[#34D399]",
  },
  {
    id: "leads_crm",
    title: "Leads CRM",
    desc: "Manage leads and grow your sales",
    icon: Users,
    iconBg: "bg-[#E0E7FF] dark:bg-[#2A2F5E]",
    iconColor: "text-[#6366F1] dark:text-[#818CF8]",
  },
  {
    id: "ai_marketing_agent",
    title: "AI Marketing Agent",
    desc: "Get an AI agent to grow your business",
    icon: Bot,
    iconBg: "bg-[#EDE9FE] dark:bg-[#3B2D54]",
    iconColor: "text-[#7C3AED] dark:text-[#A78BFA]",
  },
];

// 6 Selectable Presence Cards matching Designer Mockup
export const ONLINE_PRESENCE_OPTIONS = [
  {
    id: "website",
    title: "My Website",
    desc: "I have a business website.",
    icon: Globe,
    iconColor: "text-[#f0449b]",
    businessType: "E-Commerce",
    sellingModel: "Online E-Commerce Store",
  },
  {
    id: "google_maps",
    title: "Google Maps",
    desc: "Customers can find my shop on Google Maps.",
    icon: MapPin,
    iconColor: "text-neutral-300",
    businessType: "Retail Store",
    sellingModel: "Physical Retail Store / Walk-ins",
  },
  {
    id: "marketplace",
    title: "Sell Online",
    desc: "I sell products on Amazon, Flipkart, Meesho, Blinkit, or other marketplaces.",
    logos: "/images/marketplace-logos.png",
    logosAlt: "Amazon, Myntra, Meesho, Blinkit, Flipkart",
    icon: ShoppingBag,
    iconColor: "text-neutral-300",
    businessType: "E-Commerce",
    sellingModel: "Online E-Commerce Store",
  },
  {
    id: "b2b",
    title: "Wholesale / B2B",
    desc: "I sell products to other businesses.",
    logos: "/images/b2b-logos.png",
    logosAlt: "IndiaMART, TradeIndia, Justdial",
    icon: Building2,
    iconColor: "text-neutral-300",
    businessType: "Wholesale",
    sellingModel: "Wholesale & Bulk Orders",
  },
  {
    id: "social_media",
    title: "Social Media Only",
    desc: "My business is on Instagram, Facebook, or other social media.",
    icon: Video,
    iconColor: "text-neutral-300",
    businessType: "Social Commerce",
    sellingModel: "Social Media / Direct Selling",
  },
  {
    id: "none",
    title: "No online presence",
    desc: "I do not have a website or online business page.",
    icon: X,
    iconColor: "text-neutral-300",
    businessType: "Retail Store",
    sellingModel: "Physical Retail Store / Walk-ins",
  },
];

export const SOCIAL_PLATFORM_OPTIONS = [
  {
    id: "instagram",
    name: "Instagram",
    handlePrefix: "@",
    placeholder: "yourbusinesshandle",
    helperText: "e.g. @sharma_fashion",
    color: "#E1306C",
    renderIcon: (className = "w-4 h-4") => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fill="url(#ig-grad-social)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    id: "facebook",
    name: "Facebook",
    handlePrefix: "fb.com/",
    placeholder: "yourbusinesspage",
    helperText: "e.g. fb.com/sharmafashion",
    color: "#1877F2",
    renderIcon: (className = "w-4 h-4") => (
      <svg className={className} viewBox="0 0 24 24" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: "youtube",
    name: "YouTube",
    handlePrefix: "@",
    placeholder: "yourchannel",
    helperText: "e.g. @SharmaFashionVlogs",
    color: "#FF0000",
    renderIcon: (className = "w-4 h-4") => (
      <svg className={className} viewBox="0 0 24 24" fill="#FF0000">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    handlePrefix: "+",
    placeholder: "91 98765 43210",
    helperText: "Business phone or catalog link",
    color: "#25D366",
    renderIcon: (className = "w-4 h-4") => (
      <svg className={className} viewBox="0 0 24 24" fill="#25D366">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    handlePrefix: "in/",
    placeholder: "company/yourbusiness",
    helperText: "e.g. linkedin.com/in/...",
    color: "#0A66C2",
    renderIcon: (className = "w-4 h-4") => (
      <svg className={className} viewBox="0 0 24 24" fill="#0A66C2">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    handlePrefix: "@",
    placeholder: "yourhandle",
    helperText: "e.g. @sharmafashion",
    color: "#FFFFFF",
    renderIcon: (className = "w-4 h-4") => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, login } = useAuth();

  // Selection: "business" (default for DhandaGrow AI) | "influencer" | "user"
  const [accountType, setAccountType] = useState<AccountType>("business");
  const [currentStep, setCurrentStep] = useState(0);

  // Business Services Multi-select State
  const [selectedServices, setSelectedServices] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("business_selected_services") || localStorage.getItem("business_selected_services") || localStorage.getItem("selected_services");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (_) {}
      }
    }
    return [];
  });
  const [servicesError, setServicesError] = useState("");

  const [selectedOnlinePresence, setSelectedOnlinePresence] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("business_online_presence") || localStorage.getItem("business_online_presence") || null;
    }
    return null;
  });

  // Website URL Onboarding State
  const [websiteUrl, setWebsiteUrl] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("business_website_url") || localStorage.getItem("business_website_url") || "";
    }
    return "";
  });
  const [isAnalyzingWebsite, setIsAnalyzingWebsite] = useState(false);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<WebsiteAnalysisData | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState<{
    brandVoice: { status: "pending" | "analyzing" | "completed" | "error"; value?: string };
    colors: { status: "pending" | "analyzing" | "completed" | "error"; primary?: string; accent?: string };
    category: { status: "pending" | "analyzing" | "completed" | "error"; value?: string };
    photos: { status: "pending" | "analyzing" | "completed" | "error"; value?: string };
  }>({
    brandVoice: { status: "pending" },
    colors: { status: "pending" },
    category: { status: "pending" },
    photos: { status: "pending" },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Granular persistence loading states for steps
  const [isSavingGetStarted, setIsSavingGetStarted] = useState(false);
  const [isSavingServices, setIsSavingServices] = useState(false);
  const [isSavingPresence, setIsSavingPresence] = useState(false);
  const [isSavingWebsite, setIsSavingWebsite] = useState(false);
  const [isSavingBusinessDetails, setIsSavingBusinessDetails] = useState(false);
  const [isSavingMarketplace, setIsSavingMarketplace] = useState(false);
  const [isSavingB2b, setIsSavingB2b] = useState(false);
  const [isSavingFirstThing, setIsSavingFirstThing] = useState(false);

  const [isActivatingInfluencer, setIsActivatingInfluencer] = useState(false);

  // ─── Website Onboarding Detailed Stages State ───
  const [businessDetails, setBusinessDetails] = useState({
    business_name: "SevenUnique Tech Solutions Pvt. Ltd.",
    category: "Tech & Electronics",
    business_types: ["Service / Digital", "Product-based"] as string[],
    primary_business_type: "Service / Digital",
    sub_category: "Software Development",
    city: "Jaipur, India",
    logo_url: "",
    tagline: "Website Design Partner For Modern Businesses",
    target_audience: "Startups, enterprises, and growing businesses",
    differentiators: [
      "3500+ successfully delivered projects across various global industries",
      "Government recognized and ISO certified technology solutions provider",
      "Specialized in scalable fintech, ecommerce, and AI solutions",
      "Experienced team of 375+ expert members and developers",
    ] as string[],
    products_services: [
      "Web Development",
      "Mobile App Development",
      "Custom Software Development",
      "AI Development Services",
      "UI/UX Design",
      "QA Testing Automation",
      "Fintech & Payment Solutions",
    ] as string[],
  });

  const [newDifferentiator, setNewDifferentiator] = useState("");
  const [newProductService, setNewProductService] = useState("");

  const [brandPreferences, setBrandPreferences] = useState({
    palette: ["#FFFFFF", "#1E1E2F", "#FC9A5D", "#F0449B", "#BE32FF"],
    tones: ["Modern", "Professional", "Trendy"] as string[],
    language: "English",
  });

  const [websitePhotos, setWebsitePhotos] = useState<string[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSavingBrandPreferences, setIsSavingBrandPreferences] = useState(false);
  const [isSavingPhotos, setIsSavingPhotos] = useState(false);

  // ─── Google Maps Onboarding Flow State ───
  const [mapsSearchQuery, setMapsSearchQuery] = useState("");
  const [mapsSearchResults, setMapsSearchResults] = useState<GooglePlaceResult[]>([]);
  const [isSearchingMaps, setIsSearchingMaps] = useState(false);
  const [mapsSearchError, setMapsSearchError] = useState<string | null>(null);
  const [selectedMapsPlace, setSelectedMapsPlace] = useState<GooglePlaceResult | null>(null);

  const [mapsWebsiteUrl, setMapsWebsiteUrl] = useState("");
  const [mapsCategory, setMapsCategory] = useState("Gift Store & Souvenirs");
  const [mapsSubCategory, setMapsSubCategory] = useState("");
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");

  const [mapsPromotion, setMapsPromotion] = useState("");
  const [mapsAudience, setMapsAudience] = useState("");
  const [mapsDifferentiator, setMapsDifferentiator] = useState("");
  const [mapsLogoUrl, setMapsLogoUrl] = useState("");

  const [mapsPhotos, setMapsPhotos] = useState<string[]>([]);
  const [selectedMapsPhotos, setSelectedMapsPhotos] = useState<string[]>([]);
  const [isUploadingMapsPhoto, setIsUploadingMapsPhoto] = useState(false);
  const [isSavingMapsStep, setIsSavingMapsStep] = useState(false);

  // ─── Marketplace Seller Flow State ───
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<string[]>([]);
  const [customMarketplaceName, setCustomMarketplaceName] = useState("");
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [customListingName, setCustomListingName] = useState("");
  const [marketplaceSkipWebsite, setMarketplaceSkipWebsite] = useState(false);

  // ─── Wholesale / B2B Flow State ───
  const [selectedB2bPlatforms, setSelectedB2bPlatforms] = useState<string[]>([]);
  const [customB2bPlatformName, setCustomB2bPlatformName] = useState("");
  const [selectedB2bListings, setSelectedB2bListings] = useState<string[]>([]);
  const [customB2bListingName, setCustomB2bListingName] = useState("");
  const [b2bSkipWebsite, setB2bSkipWebsite] = useState(false);

  // ─── No Online Presence Flow State ───
  const [noneCategory, setNoneCategory] = useState("Fashion & Apparel");
  const [noneSubCategory, setNoneSubCategory] = useState("");
  const [noneProducts, setNoneProducts] = useState("");
  const [noneAudience, setNoneAudience] = useState("");
  const [noneDifferentiator, setNoneDifferentiator] = useState("");
  const [noneDescription, setNoneDescription] = useState("");
  const [selectedFont, setSelectedFont] = useState("Inter");
  const [isNoneCategoryOpen, setIsNoneCategoryOpen] = useState(false);
  const [noneCategorySearch, setNoneCategorySearch] = useState("");
  const [isSavingBrandKitStep, setIsSavingBrandKitStep] = useState(false);
  const [isUploadingBrandLogo, setIsUploadingBrandLogo] = useState(false);

  // ─── Plan & Subscription Onboarding State ───
  const [showPlansModal, setShowPlansModal] = useState(false);

  // ─── Social Media Only Flow State ───
  const [selectedSocialPlatforms, setSelectedSocialPlatforms] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("business_social_platforms");
        if (saved) return JSON.parse(saved);
      } catch (_) {}
    }
    return ["instagram"];
  });
  const [socialHandles, setSocialHandles] = useState<Record<string, string>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("business_social_handles");
        if (saved) return JSON.parse(saved);
      } catch (_) {}
      const savedIg = localStorage.getItem("instagram_username");
      if (savedIg) return { instagram: savedIg };
    }
    return { instagram: "", facebook: "", youtube: "", whatsapp: "", linkedin: "", twitter: "" };
  });
  const [isSavingSocialPlatforms, setIsSavingSocialPlatforms] = useState(false);

  // ─── First Content Creation & Post Maker Flow State ───
  const [firstThingChoice, setFirstThingChoice] = useState<"post_maker" | "photoshoot" | "reel_maker">("post_maker");
  const [promoPhoto, setPromoPhoto] = useState<string>("");
  const [festivalPhoto, setFestivalPhoto] = useState<string>("");
  const [adPhoto, setAdPhoto] = useState<string>("");
  const [activePhotoChangeTarget, setActivePhotoChangeTarget] = useState<"promo" | "festival" | "ad" | null>(null);
  const [isGeneratingPosts, setIsGeneratingPosts] = useState(false);
  const [generationStatusText, setGenerationStatusText] = useState("Analyzing your business & brand...");
  const [notifyContact, setNotifyContact] = useState("");
  const [isNotifySubmitted, setIsNotifySubmitted] = useState(false);
  const [generatedOnboardingPost, setGeneratedOnboardingPost] = useState<GeneratedPost | null>(null);
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false);

  // ─── Default High-Quality Business Photo Assets ───
  const DEFAULT_BUSINESS_PHOTOS = [
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80"
  ];

  const getAvailablePhotos = () => {
    const list: string[] = [];
    if (selectedPhotos && selectedPhotos.length > 0) list.push(...selectedPhotos);
    if (websitePhotos && websitePhotos.length > 0) {
      websitePhotos.forEach((p) => { if (!list.includes(p)) list.push(p); });
    }
    if (selectedMapsPhotos && selectedMapsPhotos.length > 0) {
      selectedMapsPhotos.forEach((p) => { if (!list.includes(p)) list.push(p); });
    }
    if (mapsPhotos && mapsPhotos.length > 0) {
      mapsPhotos.forEach((p) => { if (!list.includes(p)) list.push(p); });
    }
    if (businessProfile.business_logo && !list.includes(businessProfile.business_logo)) {
      list.push(businessProfile.business_logo);
    }
    DEFAULT_BUSINESS_PHOTOS.forEach((p) => {
      if (!list.includes(p)) list.push(p);
    });
    return list;
  };

  // Helper to detect category from place types or name
  const detectCategoryFromTypes = (types: string[] = [], name: string = ""): BusinessCategoryItem | null => {
    const combined = (types.join(" ") + " " + name).toLowerCase();
    for (const cat of BUSINESS_CATEGORIES) {
      const catNameLower = cat.name.toLowerCase();
      if (combined.includes(catNameLower.split(" ")[0]) || combined.includes(cat.id.replace(/_/g, " "))) {
        return cat;
      }
    }
    if (/gift|toy|mug|hamper|souvenir|flower|card|party/i.test(combined)) {
      return BUSINESS_CATEGORIES.find((c) => c.id === "gift_store") || null;
    }
    if (/cloth|apparel|fashion|garment|wear|boutique|tailor|suit/i.test(combined)) {
      return BUSINESS_CATEGORIES.find((c) => c.id === "fashion_apparel") || null;
    }
    if (/jewel|gold|silver|diamond/i.test(combined)) {
      return BUSINESS_CATEGORIES.find((c) => c.id === "jewellery") || null;
    }
    if (/restaurant|cafe|coffee|dhaba|bistro|food|pizza|burger|kitchen/i.test(combined)) {
      return BUSINESS_CATEGORIES.find((c) => c.id === "restaurant_cafe") || null;
    }
    if (/salon|spa|beauty|parlour|parlor|hair/i.test(combined)) {
      return BUSINESS_CATEGORIES.find((c) => c.id === "salon_spa") || null;
    }
    if (/tech|electronic|mobile|computer|laptop|phone/i.test(combined)) {
      return BUSINESS_CATEGORIES.find((c) => c.id === "tech_electronics") || null;
    }
    if (/gym|fitness|yoga|crossfit/i.test(combined)) {
      return BUSINESS_CATEGORIES.find((c) => c.id === "health_fitness") || null;
    }
    return BUSINESS_CATEGORIES.find((c) => c.id === "gift_store") || BUSINESS_CATEGORIES[0];
  };

  // URL Helper & Validation
  const isValidWebsiteUrl = (raw: string): boolean => {
    const clean = raw.trim();
    if (!clean) return false;
    const pattern = /^(https?:\/\/)?([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/i;
    return pattern.test(clean);
  };

  const getDisplayHostname = (raw: string): string => {
    let clean = raw.trim().toLowerCase();
    clean = clean.replace(/^https?:\/\//, "");
    clean = clean.replace(/\/.*$/, "");
    return clean || raw || "yourwebsite.com";
  };

  // Debounced Google Maps Search Effect
  useEffect(() => {
    if (selectedOnlinePresence !== "google_maps") return;
    const clean = mapsSearchQuery.trim();
    if (!clean || clean.length < 2) {
      setMapsSearchResults([]);
      setIsSearchingMaps(false);
      setMapsSearchError(null);
      return;
    }

    // If currently selected shop matches the query, don't re-trigger search
    if (selectedMapsPlace && selectedMapsPlace.name.toLowerCase() === clean.toLowerCase()) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingMaps(true);
      setMapsSearchError(null);
      try {
        const places = await googleMapsService.searchGooglePlaces(clean);
        setMapsSearchResults(places);
        if (places.length === 0) {
          setMapsSearchError("No shops found matching your search. Try adding your city name or paste your Maps link.");
        }
      } catch (err: any) {
        console.warn("Maps search error:", err);
        setMapsSearchError("Unable to search shops right now. Please check your connection or try again.");
      } finally {
        setIsSearchingMaps(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [mapsSearchQuery, selectedOnlinePresence, selectedMapsPlace]);

  // Restore step, profile, and onboarding data from persistent backend APIs & session
  useEffect(() => {
    let isMounted = true;

    // 1. Initial fast local cache restoration to avoid layout shifts
    if (typeof window !== "undefined") {
      const showPlan = sessionStorage.getItem("show_onboarding_plan");
      if (showPlan === "true") {
        setShowPlansModal(true);
        sessionStorage.removeItem("show_onboarding_plan");
      }
      const savedStep = sessionStorage.getItem("onboarding_step");
      if (savedStep) {
        const stepNum = parseInt(savedStep, 10);
        if (!isNaN(stepNum) && stepNum >= 0 && stepNum <= 25) {
          setCurrentStep(stepNum);
        }
      }
      const savedServices = sessionStorage.getItem("business_selected_services") || localStorage.getItem("business_selected_services") || localStorage.getItem("selected_services");
      if (savedServices) {
        try {
          const parsed = JSON.parse(savedServices);
          if (Array.isArray(parsed) && parsed.length > 0) setSelectedServices(parsed);
        } catch (_) {}
      }
      const savedPresence = sessionStorage.getItem("business_online_presence") || localStorage.getItem("business_online_presence");
      if (savedPresence) setSelectedOnlinePresence(savedPresence);
      const savedUrl = sessionStorage.getItem("business_website_url") || localStorage.getItem("business_website_url");
      if (savedUrl) {
        setWebsiteUrl(savedUrl);
        setBusinessProfile((prev) => ({ ...prev, website: savedUrl }));
      }
      const savedDetails = sessionStorage.getItem("business_details_data");
      if (savedDetails) {
        try {
          const parsed = JSON.parse(savedDetails);
          setBusinessDetails((prev) => ({ ...prev, ...parsed }));
        } catch (_) {}
      }
      const savedBrand = sessionStorage.getItem("brand_preferences_data");
      if (savedBrand) {
        try {
          const parsed = JSON.parse(savedBrand);
          setBrandPreferences((prev) => ({ ...prev, ...parsed }));
        } catch (_) {}
      }
      const savedPhotos = sessionStorage.getItem("website_selected_photos");
      if (savedPhotos) {
        try {
          const parsed = JSON.parse(savedPhotos);
          if (Array.isArray(parsed) && parsed.length > 0) setSelectedPhotos(parsed);
        } catch (_) {}
      }
    }

    // 2. Authoritative backend restoration from persistent storage
    const restoreFromBackend = async () => {
      if (typeof window === "undefined") return;
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        // Query status, services, presence, business profile, brand kit in parallel
        const [statusRes, servicesRes, presenceRes, bizRes, brandRes] = await Promise.allSettled([
          OnboardingService.getStatus(),
          OnboardingService.getSelectedServices(),
          OnboardingService.getOnlinePresence(),
          businessService.getMyBusiness(),
          getBrandKit(),
        ]);

        if (!isMounted) return;

        // Status check
        if (statusRes.status === "fulfilled" && statusRes.value) {
          const s = statusRes.value;
          if (s.is_completed || (s as any).completed) {
            const cached = localStorage.getItem("user");
            const uObj = cached ? JSON.parse(cached) : null;
            if (uObj?.role === "influencer" || uObj?.accountType === "influencer") {
              router.replace("/influencer");
            } else {
              router.replace("/dashboard");
            }
            return;
          }
        }

        // Services restoration
        let restoredServices: string[] = [];
        if (servicesRes.status === "fulfilled" && servicesRes.value) {
          const sVal = servicesRes.value;
          const list = Array.isArray(sVal) ? sVal : (sVal as any).selected_services;
          if (Array.isArray(list) && list.length > 0) {
            restoredServices = list;
            setSelectedServices(restoredServices);
            sessionStorage.setItem("business_selected_services", JSON.stringify(restoredServices));
            localStorage.setItem("business_selected_services", JSON.stringify(restoredServices));
          }
        }

        // Online presence restoration
        let restoredPresence: string | null = null;
        if (presenceRes.status === "fulfilled" && presenceRes.value) {
          const pVal = presenceRes.value;
          const rawKey = pVal.online_presence || pVal.presence;
          if (rawKey) {
            const presenceKey = BACKEND_TO_PRESENCE_MAP[rawKey] || rawKey;
            restoredPresence = presenceKey;
            setSelectedOnlinePresence(presenceKey);
            sessionStorage.setItem("business_online_presence", presenceKey);
            localStorage.setItem("business_online_presence", presenceKey);

            if (pVal.business_type || pVal.selling_model) {
              setBusinessProfile((prev) => ({
                ...prev,
                business_type: pVal.business_type || prev.business_type,
                selling_model: pVal.selling_model || prev.selling_model,
              }));
            }
          }
        }

        // Business Profile restoration
        if (bizRes.status === "fulfilled" && bizRes.value) {
          const biz: any = bizRes.value;
          if (biz && (biz.name || biz.businessName || biz.business_name)) {
            const bName = biz.name || biz.businessName || biz.business_name;
            const bCategory = biz.category || biz.industry || biz.business_category;
            const bLocation = biz.location || biz.city;
            const bDesc = biz.description || biz.business_description;
            const bWeb = biz.website || biz.website_url;
            const bLogo = biz.logo_url || biz.logoUrl || biz.business_logo;

            setBusinessProfile((prev) => ({
              ...prev,
              business_name: bName || prev.business_name,
              business_category: bCategory || prev.business_category,
              city: bLocation ? bLocation.split(",")[0].trim() : prev.city,
              full_address: bLocation || prev.full_address,
              business_description: bDesc || prev.business_description,
              website: bWeb || prev.website,
              business_logo: bLogo || prev.business_logo,
            }));

            setBusinessDetails((prev) => ({
              ...prev,
              business_name: bName || prev.business_name,
              category: bCategory || prev.category,
              city: bLocation || prev.city,
              tagline: bDesc || prev.tagline,
              logo_url: bLogo || prev.logo_url,
            }));

            if (bWeb) {
              setWebsiteUrl(bWeb);
              sessionStorage.setItem("business_website_url", bWeb);
              localStorage.setItem("business_website_url", bWeb);
            }
            if (bLogo) {
              setLogoPreview(bLogo);
            }
          }
        }

        // Brand Kit restoration
        if (brandRes.status === "fulfilled" && brandRes.value) {
          const kit = brandRes.value;
          if (kit) {
            if (kit.business_name) {
              setBusinessProfile((prev) => ({ ...prev, business_name: kit.business_name || "" }));
              setBusinessDetails((prev) => ({ ...prev, business_name: kit.business_name || "" }));
            }
            if (kit.business_category) {
              setNoneCategory(kit.business_category);
            }
            if (kit.font) {
              setSelectedFont(kit.font);
              sessionStorage.setItem("selected_font", kit.font);
            }
            const colors = kit.brand_colors || kit.palette;
            if (colors && colors.length > 0) {
              setBrandPreferences((prev) => ({ ...prev, palette: colors }));
              sessionStorage.setItem("brand_preferences_data", JSON.stringify({ palette: colors }));
            }
            if (kit.tones && kit.tones.length > 0) {
              setBrandPreferences((prev) => ({ ...prev, tones: kit.tones || [] }));
            }
            if (kit.language) {
              setBrandPreferences((prev) => ({ ...prev, language: kit.language || "English" }));
            }
            if (kit.logo_url) {
              setLogoPreview(kit.logo_url);
              setBusinessProfile((prev) => ({ ...prev, business_logo: kit.logo_url || "" }));
              sessionStorage.setItem("brand_kit_logo", kit.logo_url);
            }
            if (kit.target_audience || kit.target_audience_summary) {
              const aud = kit.target_audience || kit.target_audience_summary || "";
              setNoneAudience(aud);
              setBusinessDetails((prev) => ({ ...prev, target_audience: aud }));
            }
            if (kit.products_services && kit.products_services.length > 0) {
              setNoneProducts(kit.products_services.join(", "));
              setBusinessDetails((prev) => ({ ...prev, products_services: kit.products_services || [] }));
            }
            if (kit.differentiators && kit.differentiators.length > 0) {
              setNoneDifferentiator(kit.differentiators[0]);
              setBusinessDetails((prev) => ({ ...prev, differentiators: kit.differentiators || [] }));
            }
            if (kit.selected_photos && kit.selected_photos.length > 0) {
              setSelectedPhotos(kit.selected_photos);
              setWebsitePhotos(kit.selected_photos);
            }
          }
        }

        // Presence-specific state restoration (Maps, Marketplace, Wholesale)
        const activePresence = restoredPresence || selectedOnlinePresence;
        if (activePresence === "google_maps") {
          const mapsState = await OnboardingService.getGoogleMapsState().catch(() => null);
          if (isMounted && mapsState) {
            if (mapsState.place_id && mapsState.name) {
              const placeObj: GooglePlaceResult = {
                id: mapsState.place_id,
                placeId: mapsState.place_id,
                place_id: mapsState.place_id,
                name: mapsState.name,
                address: mapsState.formatted_address || "",
                googleMapsUrl: mapsState.google_maps_url || "",
                website: mapsState.website,
                photos: mapsState.photos || [],
              };
              setSelectedMapsPlace(placeObj);
              setMapsSearchQuery(mapsState.name);
              sessionStorage.setItem("google_maps_place_data", JSON.stringify(placeObj));
            }
            if (mapsState.website) {
              setMapsWebsiteUrl(mapsState.website);
              sessionStorage.setItem("google_maps_website_url", mapsState.website);
            }
            if (mapsState.category) {
              setMapsCategory(mapsState.category);
              sessionStorage.setItem("google_maps_category", mapsState.category);
            }
            if (mapsState.sub_category) {
              setMapsSubCategory(mapsState.sub_category);
              sessionStorage.setItem("google_maps_subcategory", mapsState.sub_category);
            }
            if (mapsState.promotion_text) {
              setMapsPromotion(mapsState.promotion_text);
              sessionStorage.setItem("google_maps_promotion", mapsState.promotion_text);
            }
            if (mapsState.target_audience) {
              setMapsAudience(mapsState.target_audience);
              sessionStorage.setItem("google_maps_audience", mapsState.target_audience);
            }
            if (mapsState.differentiator) {
              setMapsDifferentiator(mapsState.differentiator);
              sessionStorage.setItem("google_maps_differentiator", mapsState.differentiator);
            }
            if (mapsState.logo_url) {
              setMapsLogoUrl(mapsState.logo_url);
              setLogoPreview(mapsState.logo_url);
              sessionStorage.setItem("google_maps_logo", mapsState.logo_url);
            }
            if (mapsState.photos && mapsState.photos.length > 0) {
              setMapsPhotos(mapsState.photos);
              sessionStorage.setItem("google_maps_photos", JSON.stringify(mapsState.photos));
            }
            if (mapsState.selected_photos && mapsState.selected_photos.length > 0) {
              setSelectedMapsPhotos(mapsState.selected_photos);
              sessionStorage.setItem("google_maps_selected_photos", JSON.stringify(mapsState.selected_photos));
            }
          }
        } else if (activePresence === "marketplace") {
          const mktState = await OnboardingService.getMarketplaceState().catch(() => null);
          if (isMounted && mktState) {
            if (mktState.selected_platforms && mktState.selected_platforms.length > 0) {
              setSelectedMarketplaces(mktState.selected_platforms);
              sessionStorage.setItem("marketplace_selected_platforms", JSON.stringify(mktState.selected_platforms));
            }
            if (mktState.custom_platform_name) {
              setCustomMarketplaceName(mktState.custom_platform_name);
              sessionStorage.setItem("marketplace_custom_name", mktState.custom_platform_name);
            }
            if (mktState.directory_listings && mktState.directory_listings.length > 0) {
              setSelectedListings(mktState.directory_listings);
              sessionStorage.setItem("marketplace_selected_listings", JSON.stringify(mktState.directory_listings));
            }
            if (mktState.custom_listing_name) {
              setCustomListingName(mktState.custom_listing_name);
              sessionStorage.setItem("marketplace_custom_listing_name", mktState.custom_listing_name);
            }
            if (mktState.website_url) {
              setWebsiteUrl(mktState.website_url);
              sessionStorage.setItem("business_website_url", mktState.website_url);
            }
            if (mktState.skip_website) {
              setMarketplaceSkipWebsite(true);
              sessionStorage.setItem("marketplace_skip_website", "true");
            }
          }
        } else if (activePresence === "b2b") {
          const b2bState = await OnboardingService.getWholesaleState().catch(() => null);
          if (isMounted && b2bState) {
            if (b2bState.selected_platforms && b2bState.selected_platforms.length > 0) {
              setSelectedB2bPlatforms(b2bState.selected_platforms);
              sessionStorage.setItem("b2b_selected_platforms", JSON.stringify(b2bState.selected_platforms));
            }
            if (b2bState.custom_platform_name) {
              setCustomB2bPlatformName(b2bState.custom_platform_name);
              sessionStorage.setItem("b2b_custom_platform_name", b2bState.custom_platform_name);
            }
            if (b2bState.additional_listings && b2bState.additional_listings.length > 0) {
              setSelectedB2bListings(b2bState.additional_listings);
              sessionStorage.setItem("b2b_selected_listings", JSON.stringify(b2bState.additional_listings));
            }
            if (b2bState.custom_listing_name) {
              setCustomB2bListingName(b2bState.custom_listing_name);
              sessionStorage.setItem("b2b_custom_listing_name", b2bState.custom_listing_name);
            }
            if (b2bState.website_url) {
              setWebsiteUrl(b2bState.website_url);
              sessionStorage.setItem("business_website_url", b2bState.website_url);
            }
            if (b2bState.skip_website) {
              setB2bSkipWebsite(true);
              sessionStorage.setItem("b2b_skip_website", "true");
            }
          }
        }

        // 3. Navigate to next incomplete step if no explicit step in sessionStorage
        const savedSessionStep = sessionStorage.getItem("onboarding_step");
        if (!savedSessionStep) {
          const hasServices = (restoredServices && restoredServices.length > 0) || (selectedServices && selectedServices.length > 0);
          const hasPresence = Boolean(activePresence);
          if (!hasServices) {
            const sIdx = activeSteps.findIndex((s) => s.id === "business_services");
            if (sIdx !== -1) setCurrentStep(sIdx);
          } else if (!hasPresence) {
            const pIdx = activeSteps.findIndex((s) => s.id === "presence");
            if (pIdx !== -1) setCurrentStep(pIdx);
          }
        }
      } catch (e) {
        console.warn("Backend data restoration fallback:", e);
      }
    };

    restoreFromBackend();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectPresence = (presenceId: string) => {
    setSelectedOnlinePresence(presenceId);
    setError("");
    if (typeof window !== "undefined") {
      sessionStorage.setItem("business_online_presence", presenceId);
      localStorage.setItem("business_online_presence", presenceId);
    }
    const match = ONLINE_PRESENCE_OPTIONS.find((o) => o.id === presenceId);
    if (match) {
      setBusinessProfile((prev) => ({
        ...prev,
        business_type: match.businessType,
        selling_model: match.sellingModel,
      }));
    } else if (presenceId === "other") {
      setBusinessProfile((prev) => ({
        ...prev,
        business_type: "Other",
        selling_model: "Other Business Model",
      }));
    }
  };

  const handleGetStarted = async () => {
    setIsSavingGetStarted(true);
    try {
      await OnboardingService.updateProgress({ onboarding_step: 1 });
      const servicesIdx = activeSteps.findIndex((s) => s.id === "business_services");
      const target = servicesIdx !== -1 ? servicesIdx : 1;
      setCurrentStep(target);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(target));
      }
    } catch (err: any) {
      console.warn("Get started progress notice:", err);
      const servicesIdx = activeSteps.findIndex((s) => s.id === "business_services");
      const target = servicesIdx !== -1 ? servicesIdx : 1;
      setCurrentStep(target);
    } finally {
      setIsSavingGetStarted(false);
    }
  };

  const handleServicesBack = () => {
    const getStartedIdx = activeSteps.findIndex((s) => s.id === "get_started");
    const target = getStartedIdx !== -1 ? getStartedIdx : 0;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  const handleToggleService = (serviceId: string) => {
    setSelectedServices((prev) => {
      const exists = prev.includes(serviceId);
      const updated = exists ? prev.filter((id) => id !== serviceId) : [...prev, serviceId];
      if (typeof window !== "undefined") {
        sessionStorage.setItem("business_selected_services", JSON.stringify(updated));
        localStorage.setItem("business_selected_services", JSON.stringify(updated));
        localStorage.setItem("selected_services", JSON.stringify(updated));
      }
      return updated;
    });
    if (servicesError) {
      setServicesError("");
    }
  };

  const handleServicesContinue = async () => {
    if (!selectedServices || selectedServices.length === 0) {
      setServicesError("Please select at least one service for your business to continue.");
      return;
    }
    setServicesError("");
    setIsSavingServices(true);

    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("business_selected_services", JSON.stringify(selectedServices));
        localStorage.setItem("business_selected_services", JSON.stringify(selectedServices));
        localStorage.setItem("selected_services", JSON.stringify(selectedServices));
      }

      await OnboardingService.saveSelectedServices(selectedServices);

      const presenceIdx = activeSteps.findIndex((s) => s.id === "presence");
      const target = presenceIdx !== -1 ? presenceIdx : 2;
      setCurrentStep(target);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(target));
      }
    } catch (err: any) {
      console.error("Failed to save selected services:", err);
      setServicesError(err?.message || "Failed to save selected services. Please try again.");
    } finally {
      setIsSavingServices(false);
    }
  };

  const handlePresenceBack = () => {
    const servicesIdx = activeSteps.findIndex((s) => s.id === "business_services");
    const target = servicesIdx !== -1 ? servicesIdx : 1;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  // ─── Centralized Create Website / Brand Kit Navigation Handler ───
  const handleCreateWebsite = (sourceFlow?: string) => {
    setError("");
    setSelectedOnlinePresence("none");

    if (typeof window !== "undefined") {
      sessionStorage.setItem("business_online_presence", "none");
      localStorage.setItem("business_online_presence", "none");
      sessionStorage.setItem("onboarding_step", "3");

      if (businessProfile.business_name) {
        sessionStorage.setItem("business_name", businessProfile.business_name);
      }
      if (selectedMapsPlace?.name) {
        setBusinessProfile((prev) => ({
          ...prev,
          business_name: prev.business_name || selectedMapsPlace.name,
        }));
      }
    }

    // Step 3 is none_details ("Tell us about your business" / Brand Kit Step 1)
    const idx = activeSteps.findIndex((s) => s.id === "none_details");
    const target = idx !== -1 ? idx : 3;
    setCurrentStep(target);

    // Save choice in background without blocking screen
    OnboardingService.saveOnlinePresence("none", {
      business_type: businessProfile.business_type,
      selling_model: businessProfile.selling_model,
      intent: "create_website",
    }).catch(() => {});
  };

  const handlePresenceContinue = async () => {
    if (!selectedOnlinePresence) {
      setError("Please select where your business lives online.");
      return;
    }
    setError("");
    setIsSavingPresence(true);

    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("business_online_presence", selectedOnlinePresence);
        localStorage.setItem("business_online_presence", selectedOnlinePresence);
      }

      await OnboardingService.saveOnlinePresence(
        selectedOnlinePresence,
        {
          business_type: businessProfile.business_type,
          selling_model: businessProfile.selling_model
        }
      );

      // Route directly to the presence-specific step
      if (selectedOnlinePresence === "website") {
        const idx = activeSteps.findIndex((s) => s.id === "website_url");
        const target = idx !== -1 ? idx : 3;
        setCurrentStep(target);
        if (typeof window !== "undefined") sessionStorage.setItem("onboarding_step", String(target));
      } else if (selectedOnlinePresence === "google_maps") {
        const idx = activeSteps.findIndex((s) => s.id === "maps_search");
        const target = idx !== -1 ? idx : 3;
        setCurrentStep(target);
        if (typeof window !== "undefined") sessionStorage.setItem("onboarding_step", String(target));
      } else if (selectedOnlinePresence === "marketplace" || selectedOnlinePresence === "marketplace_seller") {
        const idx = activeSteps.findIndex((s) => s.id === "marketplace_platforms");
        const target = idx !== -1 ? idx : 3;
        setCurrentStep(target);
        if (typeof window !== "undefined") sessionStorage.setItem("onboarding_step", String(target));
      } else if (selectedOnlinePresence === "b2b" || selectedOnlinePresence === "wholesale_b2b") {
        const idx = activeSteps.findIndex((s) => s.id === "b2b_platforms");
        const target = idx !== -1 ? idx : 3;
        setCurrentStep(target);
        if (typeof window !== "undefined") sessionStorage.setItem("onboarding_step", String(target));
      } else if (selectedOnlinePresence === "social_media") {
        const idx = activeSteps.findIndex((s) => s.id === "social_platforms");
        const target = idx !== -1 ? idx : 3;
        setCurrentStep(target);
        if (typeof window !== "undefined") sessionStorage.setItem("onboarding_step", String(target));
      } else if (
        selectedOnlinePresence === "none" ||
        selectedOnlinePresence === "no_online_presence" ||
        selectedOnlinePresence === "no_website_yet"
      ) {
        const idx = activeSteps.findIndex((s) => s.id === "none_details");
        const target = idx !== -1 ? idx : 3;
        setCurrentStep(target);
        if (typeof window !== "undefined") sessionStorage.setItem("onboarding_step", String(target));
      } else {
        const idx = activeSteps.findIndex((s) => s.id === "identity");
        const target = idx !== -1 ? idx : 3;
        setCurrentStep(target);
        if (typeof window !== "undefined") sessionStorage.setItem("onboarding_step", String(target));
      }
    } catch (err: any) {
      console.error("Failed to save online presence:", err);
      setError(extractErrorMessage(err, "Failed to save online presence. Please try again."));
    } finally {
      setIsSavingPresence(false);
    }
  };


  // ─── Social Media Only Flow Handlers ───
  const handleToggleSocialPlatform = (platformId: string) => {
    setSelectedSocialPlatforms((prev) => {
      const exists = prev.includes(platformId);
      const next = exists ? prev.filter((p) => p !== platformId) : [...prev, platformId];
      if (typeof window !== "undefined") {
        sessionStorage.setItem("business_social_platforms", JSON.stringify(next));
      }
      return next;
    });
  };

  const handleSocialHandleChange = (platformId: string, value: string) => {
    setSocialHandles((prev) => {
      const next = { ...prev, [platformId]: value };
      if (typeof window !== "undefined") {
        sessionStorage.setItem("business_social_handles", JSON.stringify(next));
        if (platformId === "instagram") {
          localStorage.setItem("instagram_username", value.replace(/^@/, "").trim());
        }
      }
      return next;
    });
  };

  const handleSocialPlatformsBack = () => {
    const presenceIdx = activeSteps.findIndex((s) => s.id === "presence");
    const target = presenceIdx !== -1 ? presenceIdx : 2;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  const handleSocialPlatformsContinue = async () => {
    if (selectedSocialPlatforms.length === 0) {
      setError("Please select at least one social media platform.");
      return;
    }
    const hasAtLeastOneHandle = selectedSocialPlatforms.some(
      (p) => socialHandles[p] && socialHandles[p].trim().length > 0
    );
    if (!hasAtLeastOneHandle) {
      setError("Please enter your username or page handle for at least one selected platform.");
      return;
    }
    setError("");
    setIsSavingSocialPlatforms(true);
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("business_social_platforms", JSON.stringify(selectedSocialPlatforms));
        sessionStorage.setItem("business_social_handles", JSON.stringify(socialHandles));
      }
      if (!businessProfile.business_name.trim()) {
        const firstHandle = (socialHandles.instagram || Object.values(socialHandles).find((v) => v && v.trim())) || "";
        const cleanName = firstHandle.replace(/^@/, "").replace(/[^a-zA-Z0-9 ]/g, " ").trim();
        if (cleanName) {
          const capitalized = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
          setBusinessProfile((prev) => ({ ...prev, business_name: capitalized }));
          setBusinessDetails((prev) => ({ ...prev, business_name: capitalized }));
        }
      }
      await OnboardingService.saveOnlinePresence("social_media", {
        business_type: businessProfile.business_type || "Social Commerce",
        selling_model: businessProfile.selling_model || "Social Media / Direct Selling",
        selected_platforms: selectedSocialPlatforms,
        social_handles: socialHandles,
        instagram_handle: socialHandles.instagram,
        facebook_handle: socialHandles.facebook,
        youtube_handle: socialHandles.youtube,
      });
      const identIdx = activeSteps.findIndex((s) => s.id === "identity");
      const target = identIdx !== -1 ? identIdx : currentStep + 1;
      setCurrentStep(target);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(target));
      }
    } catch (err: any) {
      console.error("Failed to save social platforms:", err);
      setError(err?.message || "Failed to save social platforms. Please try again.");
    } finally {
      setIsSavingSocialPlatforms(false);
    }
  };

  const handleSkipSocialPlatforms = () => {
    setError("");
    const identIdx = activeSteps.findIndex((s) => s.id === "identity");
    const target = identIdx !== -1 ? identIdx : currentStep + 1;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  // Screen 1: Website URL Handlers
  const handleWebsiteUrlBack = () => {
    const presenceIdx = activeSteps.findIndex((s) => s.id === "presence");
    const target = presenceIdx !== -1 ? presenceIdx : 2;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  const handleWebsiteUrlContinue = async () => {
    if (!isValidWebsiteUrl(websiteUrl)) {
      setError("Please enter a valid website address.");
      return;
    }
    setError("");
    setIsSavingWebsite(true);
    const formattedUrl = websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`;

    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("business_website_url", formattedUrl);
        localStorage.setItem("business_website_url", formattedUrl);
      }
      setBusinessProfile((prev) => ({ ...prev, website: formattedUrl }));

      await OnboardingService.saveOnlinePresence("website", {
        business_type: businessProfile.business_type,
        selling_model: businessProfile.selling_model,
        website_url: formattedUrl,
      });

      const readingIdx = activeSteps.findIndex((s) => s.id === "website_reading");
      const target = readingIdx !== -1 ? readingIdx : currentStep + 1;
      setCurrentStep(target);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(target));
      }

      startWebsiteAnalysis(formattedUrl);
    } catch (err: any) {
      console.error("Failed to save website url:", err);
      setError(err?.message || "Failed to save website address. Please try again.");
    } finally {
      setIsSavingWebsite(false);
    }
  };

  // Screen 2: Website Reading Handlers
  const handleWebsiteReadingBack = () => {
    const urlIdx = activeSteps.findIndex((s) => s.id === "website_url");
    const target = urlIdx !== -1 ? urlIdx : Math.max(0, currentStep - 1);
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  const handleReadingContinue = () => {
    const detailsIdx = activeSteps.findIndex((s) => s.id === "business_details");
    const target = detailsIdx !== -1 ? detailsIdx : currentStep + 1;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  // Real Backend Website Analysis Trigger
  const startWebsiteAnalysis = async (targetUrl?: string, overridePresence?: string) => {
    const rawUrl = targetUrl || websiteUrl;
    if (!rawUrl || !isValidWebsiteUrl(rawUrl)) return;

    setIsAnalyzingWebsite(true);
    setAnalysisError(null);
    setAnalysisCompleted(false);

    setAnalysisProgress({
      brandVoice: { status: "analyzing" },
      colors: { status: "pending" },
      category: { status: "pending" },
      photos: { status: "pending" },
    });

    const formattedUrl = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;

    try {
      // 1. Immediately persist entered website to backend preserving source
      try {
        const presenceToSave =
          overridePresence ||
          (selectedOnlinePresence ? ONLINE_PRESENCE_BACKEND_MAP[selectedOnlinePresence] : undefined) ||
          selectedOnlinePresence ||
          "website";
        await OnboardingService.updateProgress({
          website: formattedUrl,
          website_url: formattedUrl,
          online_presence: presenceToSave,
          business_type: businessProfile.business_type || (presenceToSave === "wholesale_b2b" ? "Wholesale" : "E-Commerce"),
        });
      } catch (_) {}

      // Staggered status animations matching actual scan phases
      const colorsTimer = setTimeout(() => {
        setAnalysisProgress((prev) => ({
          ...prev,
          colors: { status: "analyzing" },
        }));
      }, 800);

      const categoryTimer = setTimeout(() => {
        setAnalysisProgress((prev) => ({
          ...prev,
          category: { status: "analyzing" },
        }));
      }, 1600);

      const photosTimer = setTimeout(() => {
        setAnalysisProgress((prev) => ({
          ...prev,
          photos: { status: "analyzing" },
        }));
      }, 2400);

      let result: WebsiteAnalysisData | null = null;
      try {
        result = await aiService.analyzeWebsite({
          website_url: formattedUrl,
          primary_goal: "leads_and_sales",
        });
      } catch (apiErr) {
        console.warn("Website analysis fallback applied:", apiErr);
      }

      clearTimeout(colorsTimer);
      clearTimeout(categoryTimer);
      clearTimeout(photosTimer);

      const detectedCategory = result?.category || "Tech & Electronics";
      const detectedBrandVoice = result?.tones?.[0] || (result?.brand_messaging_clarity ? "Modern & Bold" : "Professional");
      const detectedColors = {
        primary: result?.palette?.[0] || "#BE32FF",
        accent: result?.palette?.[2] || "#F0449B",
      };
      const detectedPhotos = `${result?.photos?.length || 4} Visual Assets Detected`;

      setAnalysisResult(result);
      setAnalysisProgress({
        brandVoice: { status: "completed", value: detectedBrandVoice },
        colors: { status: "completed", primary: detectedColors.primary, accent: detectedColors.accent },
        category: { status: "completed", value: detectedCategory },
        photos: { status: "completed", value: detectedPhotos },
      });

      if (result) {
        setBusinessDetails((prev) => ({
          ...prev,
          business_name: result.business_name || prev.business_name,
          category: result.category || prev.category,
          sub_category: result.sub_category || prev.sub_category,
          business_types: result.business_types || prev.business_types,
          primary_business_type: result.primary_business_type || prev.primary_business_type,
          city: result.city || prev.city,
          logo_url: result.logo_url || prev.logo_url,
          tagline: result.tagline || prev.tagline,
          target_audience: result.target_audience || prev.target_audience,
          differentiators: result.differentiators && result.differentiators.length > 0 ? result.differentiators : prev.differentiators,
          products_services: result.products_services && result.products_services.length > 0 ? result.products_services : prev.products_services,
        }));

        if (result.palette && result.palette.length > 0) {
          setBrandPreferences((prev) => ({
            ...prev,
            palette: result.palette || prev.palette,
            tones: result.tones || prev.tones,
            language: result.language || prev.language,
          }));
        }

        if (result.photos && result.photos.length > 0) {
          setWebsitePhotos(result.photos);
          setSelectedPhotos(result.photos.slice(0, 4));
        }
      }

      setBusinessProfile((prev) => ({
        ...prev,
        website: formattedUrl,
        business_name: result?.business_name || prev.business_name,
        business_category: result?.category || prev.business_category || "clothing",
        brand_color: detectedColors.primary,
        city: result?.city?.split(",")?.[0]?.trim() || prev.city,
        business_description: result?.tagline || prev.business_description,
      }));

      setAnalysisCompleted(true);
    } catch (err: any) {
      console.error("Website analysis failed:", err);
      setAnalysisError(err.message || "Failed to analyze website. Please check your URL and retry.");
      setAnalysisProgress({
        brandVoice: { status: "error" },
        colors: { status: "error" },
        category: { status: "error" },
        photos: { status: "error" },
      });
    } finally {
      setIsAnalyzingWebsite(false);
    }
  };

  // ─── Screen 3: Business Details Handlers (Is this your business?) ───
  const handleBusinessDetailsBack = () => {
    const readingIdx = activeSteps.findIndex((s) => s.id === "website_reading");
    const target = readingIdx !== -1 ? readingIdx : 3;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  const handleToggleBusinessType = (type: string) => {
    setBusinessDetails((prev) => {
      const exists = prev.business_types.includes(type);
      let updated: string[];
      let newPrimary = prev.primary_business_type;

      if (exists) {
        if (prev.business_types.length <= 1) return prev;
        updated = prev.business_types.filter((t) => t !== type);
        if (newPrimary === type) {
          newPrimary = updated[0];
        }
      } else {
        updated = [...prev.business_types, type];
        if (!newPrimary) {
          newPrimary = type;
        }
      }
      return {
        ...prev,
        business_types: updated,
        primary_business_type: newPrimary,
      };
    });
  };

  const handleSetPrimaryBusinessType = (type: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBusinessDetails((prev) => ({
      ...prev,
      primary_business_type: type,
      business_types: prev.business_types.includes(type) ? prev.business_types : [...prev.business_types, type],
    }));
  };

  const handleWebsiteLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const uploadedUrl = await uploadBrandLogo(file);
      setBusinessDetails((prev) => ({ ...prev, logo_url: uploadedUrl }));
      setLogoPreview(uploadedUrl);
    } catch (_) {
      const localUrl = URL.createObjectURL(file);
      setBusinessDetails((prev) => ({ ...prev, logo_url: localUrl }));
      setLogoPreview(localUrl);
    }
  };

  const handleRemoveLogo = () => {
    setBusinessDetails((prev) => ({ ...prev, logo_url: "" }));
  };

  const handleAddDifferentiator = () => {
    const val = newDifferentiator.trim();
    if (!val) return;
    setBusinessDetails((prev) => ({
      ...prev,
      differentiators: [...prev.differentiators, val],
    }));
    setNewDifferentiator("");
  };

  const handleRemoveDifferentiator = (index: number) => {
    setBusinessDetails((prev) => ({
      ...prev,
      differentiators: prev.differentiators.filter((_, i) => i !== index),
    }));
  };

  const handleAddProductService = () => {
    const val = newProductService.trim();
    if (!val) return;
    setBusinessDetails((prev) => ({
      ...prev,
      products_services: [...prev.products_services, val],
    }));
    setNewProductService("");
  };

  const handleRemoveProductService = (index: number) => {
    setBusinessDetails((prev) => ({
      ...prev,
      products_services: prev.products_services.filter((_, i) => i !== index),
    }));
  };

  const handleBusinessDetailsContinue = async () => {
    if (!businessDetails.business_name.trim()) {
      setError("Please enter your business name.");
      return;
    }
    setError("");
    setIsSavingBusinessDetails(true);

    try {
      // Sync to parent businessProfile
      setBusinessProfile((prev) => ({
        ...prev,
        business_name: businessDetails.business_name,
        business_type: businessDetails.primary_business_type || businessDetails.business_types[0] || prev.business_type,
        business_category: businessDetails.category,
        city: businessDetails.city.split(",")[0]?.trim() || businessDetails.city,
        business_description: businessDetails.tagline || prev.business_description,
        brand_color: brandPreferences.palette[0] || prev.brand_color,
        business_logo: businessDetails.logo_url || prev.business_logo,
      }));
      if (businessDetails.logo_url) {
        setLogoPreview(businessDetails.logo_url);
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem("business_details_data", JSON.stringify(businessDetails));
      }

      // Persist to Business API
      await businessService.updateBusiness({
        name: businessDetails.business_name.trim(),
        category: businessDetails.category,
        industry: businessDetails.category,
        businessType: businessDetails.primary_business_type || businessDetails.business_types[0],
        location: businessDetails.city,
        description: businessDetails.tagline,
        website: websiteUrl || undefined,
        logoUrl: businessDetails.logo_url || undefined,
      });

      // Persist to Brand Kit API
      await updateBrandKit({
        business_name: businessDetails.business_name,
        business_category: businessDetails.category,
        sub_category: businessDetails.sub_category,
        business_types: businessDetails.business_types,
        primary_business_type: businessDetails.primary_business_type,
        city: businessDetails.city,
        tagline: businessDetails.tagline,
        target_audience: businessDetails.target_audience,
        target_audience_summary: businessDetails.target_audience,
        differentiators: businessDetails.differentiators,
        products_services: businessDetails.products_services,
        services_products_summary: businessDetails.products_services,
        website: websiteUrl,
        logo_url: businessDetails.logo_url,
      });

      await OnboardingService.updateProgress({
        business_name: businessDetails.business_name,
        business_category: businessDetails.category,
        business_type: businessDetails.primary_business_type,
        business_types: businessDetails.business_types,
        sub_category: businessDetails.sub_category,
        city: businessDetails.city,
        tagline: businessDetails.tagline,
        target_audience: businessDetails.target_audience,
        differentiators: businessDetails.differentiators,
        products_services: businessDetails.products_services,
        website_url: websiteUrl,
      });

      // Advance to Screen 4 (brand_preferences)
      const brandIdx = activeSteps.findIndex((s) => s.id === "brand_preferences");
      const target = brandIdx !== -1 ? brandIdx : currentStep + 1;
      setCurrentStep(target);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(target));
      }
    } catch (err: any) {
      console.error("Failed to save business details:", err);
      setError(err?.message || "Failed to save business details. Please retry.");
    } finally {
      setIsSavingBusinessDetails(false);
    }
  };

  // ─── Screen 4: Brand Preferences Handlers (What's your business like?) ───
  const handleBrandPreferencesBack = () => {
    const detailsIdx = activeSteps.findIndex((s) => s.id === "business_details");
    const target = detailsIdx !== -1 ? detailsIdx : currentStep - 1;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  const handleColorChange = (index: number, newColor: string) => {
    setBrandPreferences((prev) => {
      const updated = [...prev.palette];
      updated[index] = newColor;
      return { ...prev, palette: updated };
    });
  };

  const handleToggleTone = (tone: string) => {
    setBrandPreferences((prev) => {
      const exists = prev.tones.includes(tone);
      const updated = exists ? prev.tones.filter((t) => t !== tone) : [...prev.tones, tone];
      return { ...prev, tones: updated };
    });
  };

  const handleSelectLanguage = (lang: string) => {
    setBrandPreferences((prev) => ({ ...prev, language: lang }));
  };

  const handleBrandPreferencesContinue = async () => {
    setIsSavingBrandPreferences(true);
    setError("");
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("brand_preferences_data", JSON.stringify(brandPreferences));
      }

      await updateBrandKit({
        business_name: businessDetails.business_name,
        tagline: businessDetails.tagline,
        target_audience: businessDetails.target_audience,
        brand_colors: brandPreferences.palette,
        palette: brandPreferences.palette,
        primary_color: brandPreferences.palette[0] || "#FC9A5D",
        secondary_color: brandPreferences.palette[1] || "#F0449B",
        accent_color: brandPreferences.palette[2] || "#BE32FF",
        tones: brandPreferences.tones,
        tone: brandPreferences.tones.join(", "),
        language: brandPreferences.language,
        business_types: businessDetails.business_types,
        primary_business_type: businessDetails.primary_business_type,
        sub_category: businessDetails.sub_category,
        city: businessDetails.city,
        differentiators: businessDetails.differentiators,
        products_services: businessDetails.products_services,
        target_audience_summary: businessDetails.target_audience,
        services_products_summary: businessDetails.products_services,
        website: websiteUrl,
        logo_url: businessDetails.logo_url,
      });

      await OnboardingService.updateProgress({
        brand_colors: brandPreferences.palette,
        tones: brandPreferences.tones,
        language: brandPreferences.language,
        target_audience_summary: businessDetails.target_audience,
        services_products_summary: businessDetails.products_services,
      });

      // Advance to Screen 5 (website_photos)
      const photosIdx = activeSteps.findIndex((s) => s.id === "website_photos");
      const target = photosIdx !== -1 ? photosIdx : currentStep + 1;
      setCurrentStep(target);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(target));
      }
    } catch (err: any) {
      console.error("Failed to save brand preferences:", err);
      setError(err?.message || "Failed to save brand preferences. Please retry.");
    } finally {
      setIsSavingBrandPreferences(false);
    }
  };

  // ─── Screen 5: Website Photos Handlers (Pick the photos we should work with) ───
  const handleWebsitePhotosBack = () => {
    const brandIdx = activeSteps.findIndex((s) => s.id === "brand_preferences");
    const target = brandIdx !== -1 ? brandIdx : currentStep - 1;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  const handleTogglePhoto = (photoUrl: string) => {
    setSelectedPhotos((prev) =>
      prev.includes(photoUrl) ? prev.filter((p) => p !== photoUrl) : [...prev, photoUrl]
    );
  };

  const handleSelectAllPhotos = () => {
    if (selectedPhotos.length === websitePhotos.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos([...websitePhotos]);
    }
  };

  const handleRemovePhoto = (photoUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWebsitePhotos((prev) => prev.filter((p) => p !== photoUrl));
    setSelectedPhotos((prev) => prev.filter((p) => p !== photoUrl));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingPhoto(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const uploadedUrl = await uploadBrandLogo(file);
          if (uploadedUrl) newUrls.push(uploadedUrl);
        } catch (_) {
          const localUrl = URL.createObjectURL(file);
          newUrls.push(localUrl);
        }
      }
      setWebsitePhotos((prev) => [...newUrls, ...prev]);
      setSelectedPhotos((prev) => [...newUrls, ...prev]);
    } catch (err) {
      console.error("Photo upload error:", err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleWebsitePhotosContinue = async () => {
    setIsSavingPhotos(true);
    setError("");
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("website_selected_photos", JSON.stringify(selectedPhotos));
      }

      await updateBrandKit({
        selected_photos: selectedPhotos,
      });

      await OnboardingService.updateProgress({
        selected_photos: selectedPhotos,
      });

      // Advance to common completion screen: "Let's make your first thing"
      const firstThingIdx = activeSteps.findIndex((s) => s.id === "first_thing");
      const target = firstThingIdx !== -1 ? firstThingIdx : currentStep + 1;
      setCurrentStep(target);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(target));
      }
    } catch (err: any) {
      console.error("Failed to save photos:", err);
      setError(err?.message || "Failed to save selected photos. Please retry.");
    } finally {
      setIsSavingPhotos(false);
    }
  };

  // ─── Google Maps Flow Handlers ───
  const handleMapsSearchBack = () => {
    const presenceIdx = activeSteps.findIndex((s) => s.id === "presence");
    const target = presenceIdx !== -1 ? presenceIdx : 2;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  const handleSelectMapsShop = (place: GooglePlaceResult) => {
    setSelectedMapsPlace(place);
    setMapsSearchQuery(place.name);
    setMapsSearchError(null);

    // Pre-fill business profile fields
    setBusinessProfile((prev) => ({
      ...prev,
      business_name: place.name,
      full_address: place.address || prev.full_address,
      google_maps_url: place.googleMapsUrl || prev.google_maps_url,
      website: place.website || prev.website,
    }));

    if (place.website) {
      setMapsWebsiteUrl(place.website);
    }

    if (place.photos && place.photos.length > 0) {
      setMapsPhotos(place.photos);
      setSelectedMapsPhotos(place.photos.slice(0, 10));
    }

    // Try detecting category from place types or business name
    const matchedCat = detectCategoryFromTypes(place.types, place.name);
    if (matchedCat) {
      setMapsCategory(matchedCat.name);
      setMapsPromotion(matchedCat.defaultPromote);
    }

    if (typeof window !== "undefined") {
      sessionStorage.setItem("google_maps_place_data", JSON.stringify(place));
      if (place.photos) {
        sessionStorage.setItem("google_maps_photos", JSON.stringify(place.photos));
        sessionStorage.setItem("google_maps_selected_photos", JSON.stringify(place.photos.slice(0, 10)));
      }
    }
  };

  const handleUseShopContinue = async () => {
    if (!selectedMapsPlace) {
      setError("Please search and select your shop on Google Maps.");
      return;
    }
    setError("");
    setIsSavingMapsStep(true);
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("google_maps_place_data", JSON.stringify(selectedMapsPlace));
      }

      await OnboardingService.selectGoogleMapsShop({
        place_id: selectedMapsPlace.placeId || selectedMapsPlace.id || "maps_" + Date.now(),
        name: selectedMapsPlace.name,
        business_name: selectedMapsPlace.name,
        formatted_address: selectedMapsPlace.address,
        google_maps_url: selectedMapsPlace.googleMapsUrl,
        website: selectedMapsPlace.website,
        rating: selectedMapsPlace.rating,
        user_ratings_total: selectedMapsPlace.userRatingsTotal ?? selectedMapsPlace.userRatingCount,
        types: selectedMapsPlace.types,
        photos: selectedMapsPlace.photos,
      });

      await businessService.updateBusiness({
        name: selectedMapsPlace.name,
        location: selectedMapsPlace.address,
        website: selectedMapsPlace.website,
      });

      const websiteIdx = activeSteps.findIndex((s) => s.id === "maps_website");
      const target = websiteIdx !== -1 ? websiteIdx : currentStep + 1;
      setCurrentStep(target);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(target));
      }
    } catch (err: any) {
      console.error("Failed to save selected shop:", err);
      setError(err?.message || "Failed to select shop. Please try again.");
    } finally {
      setIsSavingMapsStep(false);
    }
  };

  const handleMapsWebsiteBack = () => {
    const searchIdx = activeSteps.findIndex((s) => s.id === "maps_search");
    const target = searchIdx !== -1 ? searchIdx : currentStep - 1;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  const handleUseWebsiteContinue = () => {
    if (!isValidWebsiteUrl(mapsWebsiteUrl)) {
      setError("Please enter a valid website address (e.g. yourbusiness.com).");
      return;
    }
    setError("");
    setBusinessProfile((prev) => ({ ...prev, website: mapsWebsiteUrl }));
    if (typeof window !== "undefined") {
      sessionStorage.setItem("google_maps_website_url", mapsWebsiteUrl);
    }
    const catIdx = activeSteps.findIndex((s) => s.id === "maps_category");
    const target = catIdx !== -1 ? catIdx : currentStep + 1;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  const handleSkipWebsite = () => {
    setError("");
    const catIdx = activeSteps.findIndex((s) => s.id === "maps_category");
    const target = catIdx !== -1 ? catIdx : currentStep + 1;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  const handleMapsCategoryBack = () => {
    const webIdx = activeSteps.findIndex((s) => s.id === "maps_website");
    const target = webIdx !== -1 ? webIdx : currentStep - 1;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  const handleMapsCategoryContinue = () => {
    if (!mapsCategory.trim()) {
      setError("Please select a business category.");
      return;
    }
    setError("");
    setBusinessProfile((prev) => ({
      ...prev,
      business_category: mapsCategory,
    }));
    setBusinessDetails((prev) => ({
      ...prev,
      category: mapsCategory,
      sub_category: mapsSubCategory,
    }));
    if (!mapsPromotion) {
      const catObj = BUSINESS_CATEGORIES.find((c) => c.name.toLowerCase() === mapsCategory.toLowerCase());
      if (catObj) {
        setMapsPromotion(catObj.defaultPromote);
      }
    }
    if (typeof window !== "undefined") {
      sessionStorage.setItem("google_maps_category", mapsCategory);
      sessionStorage.setItem("google_maps_subcategory", mapsSubCategory);
    }
    const detailsIdx = activeSteps.findIndex((s) => s.id === "maps_details");
    const target = detailsIdx !== -1 ? detailsIdx : currentStep + 1;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  const handleMapsDetailsBack = () => {
    const catIdx = activeSteps.findIndex((s) => s.id === "maps_category");
    const target = catIdx !== -1 ? catIdx : currentStep - 1;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  const handleMapsLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const uploadedUrl = await uploadBrandLogo(file);
      setMapsLogoUrl(uploadedUrl);
      setLogoPreview(uploadedUrl);
      setBusinessProfile((prev) => ({ ...prev, business_logo: uploadedUrl }));
    } catch (_) {
      const localUrl = URL.createObjectURL(file);
      setMapsLogoUrl(localUrl);
      setLogoPreview(localUrl);
      setBusinessProfile((prev) => ({ ...prev, business_logo: localUrl }));
    }
  };

  const handleRemoveMapsLogo = () => {
    setMapsLogoUrl("");
    setLogoPreview(null);
    setBusinessProfile((prev) => ({ ...prev, business_logo: "" }));
  };

  const handleMapsDetailsContinue = async () => {
    if (!businessProfile.business_name.trim()) {
      setError("Please enter your business name.");
      return;
    }
    if (!mapsPromotion.trim()) {
      setError("Please tell us what we should promote for your business.");
      return;
    }
    setError("");
    setIsSavingMapsStep(true);

    try {
      setBusinessProfile((prev) => ({
        ...prev,
        business_description: mapsPromotion,
        target_location: mapsAudience || prev.target_location,
        business_logo: mapsLogoUrl || prev.business_logo,
      }));
      setBusinessDetails((prev) => ({
        ...prev,
        business_name: businessProfile.business_name,
        target_audience: mapsAudience,
        logo_url: mapsLogoUrl || prev.logo_url,
        differentiators: mapsDifferentiator ? [mapsDifferentiator] : prev.differentiators,
        products_services: mapsPromotion ? [mapsPromotion] : prev.products_services,
      }));

      if (typeof window !== "undefined") {
        sessionStorage.setItem("google_maps_promotion", mapsPromotion);
        sessionStorage.setItem("google_maps_audience", mapsAudience);
        sessionStorage.setItem("google_maps_differentiator", mapsDifferentiator);
        sessionStorage.setItem("google_maps_logo", mapsLogoUrl);
      }

      await OnboardingService.updateGoogleMapsProfile({
        business_name: businessProfile.business_name || "My Business",
        promotion_goal: mapsPromotion || "Promote business",
        category: mapsCategory,
        sub_category: mapsSubCategory,
        website: mapsWebsiteUrl || undefined,
        promotion_text: mapsPromotion,
        target_audience: mapsAudience,
        differentiator: mapsDifferentiator,
        logo_url: mapsLogoUrl,
      });

      await businessService.updateBusiness({
        name: businessProfile.business_name,
        category: mapsCategory,
        description: mapsPromotion,
        logoUrl: mapsLogoUrl || undefined,
      });

      await updateBrandKit({
        business_name: businessProfile.business_name,
        business_category: mapsCategory,
        sub_category: mapsSubCategory,
        target_audience: mapsAudience,
        target_audience_summary: mapsAudience,
        differentiators: mapsDifferentiator ? [mapsDifferentiator] : undefined,
        products_services: mapsPromotion ? [mapsPromotion] : undefined,
        services_products_summary: mapsPromotion ? [mapsPromotion] : undefined,
        logo_url: mapsLogoUrl || undefined,
      });

      const photosIdx = activeSteps.findIndex((s) => s.id === "maps_photos");
      const target = photosIdx !== -1 ? photosIdx : currentStep + 1;
      setCurrentStep(target);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(target));
      }
    } catch (err: any) {
      console.error("Failed to save Maps details:", err);
      setError(err?.message || "Failed to save details. Please retry.");
    } finally {
      setIsSavingMapsStep(false);
    }
  };

  const handleMapsPhotosBack = () => {
    const detailsIdx = activeSteps.findIndex((s) => s.id === "maps_details");
    const target = detailsIdx !== -1 ? detailsIdx : currentStep - 1;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  const handleToggleMapsPhoto = (photoUrl: string) => {
    setSelectedMapsPhotos((prev) => {
      if (prev.includes(photoUrl)) {
        return prev.filter((p) => p !== photoUrl);
      }
      if (prev.length >= 15) {
        setError("You can select up to 15 photos.");
        return prev;
      }
      setError("");
      return [...prev, photoUrl];
    });
  };

  const handleSelectAllMapsPhotos = () => {
    if (selectedMapsPhotos.length === Math.min(mapsPhotos.length, 15)) {
      setSelectedMapsPhotos([]);
    } else {
      setSelectedMapsPhotos(mapsPhotos.slice(0, 15));
    }
  };

  const handleRemoveMapsPhoto = (photoUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMapsPhotos((prev) => prev.filter((p) => p !== photoUrl));
    setSelectedMapsPhotos((prev) => prev.filter((p) => p !== photoUrl));
  };

  const handleMapsPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingMapsPhoto(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const uploadedUrl = await uploadBrandLogo(file);
          if (uploadedUrl) newUrls.push(uploadedUrl);
        } catch (_) {
          const localUrl = URL.createObjectURL(file);
          newUrls.push(localUrl);
        }
      }
      setMapsPhotos((prev) => [...newUrls, ...prev]);
      setSelectedMapsPhotos((prev) => {
        const merged = [...newUrls, ...prev];
        return merged.slice(0, 15);
      });
    } catch (err) {
      console.error("Maps photo upload error:", err);
    } finally {
      setIsUploadingMapsPhoto(false);
    }
  };

  const handleMapsPhotosContinue = async () => {
    if (selectedMapsPhotos.length === 0) {
      setError("Please select or upload at least one photo.");
      return;
    }
    setError("");
    setIsSavingMapsStep(true);
    try {
      setSelectedPhotos(selectedMapsPhotos);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("google_maps_photos", JSON.stringify(mapsPhotos));
        sessionStorage.setItem("google_maps_selected_photos", JSON.stringify(selectedMapsPhotos));
        sessionStorage.setItem("website_selected_photos", JSON.stringify(selectedMapsPhotos));
      }

      await OnboardingService.completeGoogleMaps({
        selected_photos: selectedMapsPhotos,
        category: mapsCategory,
        sub_category: mapsSubCategory,
        promotion_text: mapsPromotion,
        target_audience: mapsAudience,
        differentiator: mapsDifferentiator,
        logo_url: mapsLogoUrl,
        website: mapsWebsiteUrl,
      });

      await updateBrandKit({
        business_name: businessProfile.business_name,
        business_category: mapsCategory,
        selected_photos: selectedMapsPhotos,
      });

      await OnboardingService.updateProgress({
        business_name: businessProfile.business_name,
        business_category: mapsCategory,
        google_maps_url: selectedMapsPlace?.googleMapsUrl,
        selected_photos: selectedMapsPhotos,
      });

      // Advance to common completion screen: "Let's make your first thing"
      const firstThingIdx = activeSteps.findIndex((s) => s.id === "first_thing");
      const target = firstThingIdx !== -1 ? firstThingIdx : currentStep + 1;
      setCurrentStep(target);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(target));
      }
    } catch (err: any) {
      console.error("Failed to save maps photos:", err);
      setError(err?.message || "Failed to save photos. Please retry.");
    } finally {
      setIsSavingMapsStep(false);
    }
  };

  // ─── Marketplace Seller Flow Handlers ───
  const handleToggleMarketplace = (id: string) => {
    setError("");
    setSelectedMarketplaces((prev) => {
      const next = prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id];
      if (typeof window !== "undefined") {
        sessionStorage.setItem("marketplace_selected_platforms", JSON.stringify(next));
      }
      return next;
    });
  };

  const handleMarketplacePlatformsBack = () => {
    const presenceIdx = activeSteps.findIndex((s) => s.id === "presence");
    const target = presenceIdx !== -1 ? presenceIdx : 2;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  const handleMarketplacePlatformsContinue = async () => {
    if (selectedMarketplaces.length === 0) {
      setError("Please select at least one marketplace.");
      return;
    }
    if (selectedMarketplaces.includes("other") && !customMarketplaceName.trim()) {
      setError("Please enter your custom marketplace name.");
      return;
    }
    setError("");
    setIsSavingMarketplace(true);

    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("marketplace_selected_platforms", JSON.stringify(selectedMarketplaces));
        sessionStorage.setItem("marketplace_custom_name", customMarketplaceName);
      }

      await OnboardingService.saveMarketplacePlatforms({
        selected_platforms: selectedMarketplaces,
        custom_platform_name: customMarketplaceName.trim() || undefined,
      });

      // Navigate to the existing URL-entry screen
      const webIdx = activeSteps.findIndex((s) => s.id === "marketplace_website");
      const target = webIdx !== -1 ? webIdx : 4;
      setCurrentStep(target);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(target));
      }
    } catch (err: any) {
      console.error("Failed to save marketplace platforms:", err);
      setError(extractErrorMessage(err, "Failed to save marketplace platforms. Please retry."));
    } finally {
      setIsSavingMarketplace(false);
    }
  };

  const handleToggleListing = (id: string) => {
    setError("");
    if (id === "none_of_these") {
      setSelectedListings((prev) => {
        const next = prev.includes("none_of_these") ? [] : ["none_of_these"];
        if (typeof window !== "undefined") {
          sessionStorage.setItem("marketplace_selected_listings", JSON.stringify(next));
        }
        return next;
      });
      setCustomListingName("");
      return;
    }
    setSelectedListings((prev) => {
      const withoutNone = prev.filter((p) => p !== "none_of_these");
      const next = withoutNone.includes(id)
        ? withoutNone.filter((p) => p !== id)
        : [...withoutNone, id];
      if (typeof window !== "undefined") {
        sessionStorage.setItem("marketplace_selected_listings", JSON.stringify(next));
      }
      return next;
    });
  };

  const handleMarketplaceListingsBack = () => {
    const platIdx = activeSteps.findIndex((s) => s.id === "marketplace_platforms");
    const target = platIdx !== -1 ? platIdx : 2;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  const handleMarketplaceListingsContinue = async () => {
    if (selectedListings.length === 0) {
      setError("Please select where you list your business or choose 'None of these'.");
      return;
    }
    if (selectedListings.includes("other") && !customListingName.trim()) {
      setError("Please enter your custom directory name.");
      return;
    }
    setError("");
    setIsSavingMarketplace(true);

    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("marketplace_selected_listings", JSON.stringify(selectedListings));
        sessionStorage.setItem("marketplace_custom_listing_name", customListingName);
      }

      await OnboardingService.saveMarketplacePlatforms({
        selected_platforms: selectedMarketplaces,
        custom_platform_name: customMarketplaceName.trim() || undefined,
        directory_listings: selectedListings.filter((l) => l !== "none_of_these"),
        custom_listing_name: customListingName.trim() || undefined,
      });

      const webIdx = activeSteps.findIndex((s) => s.id === "marketplace_website");
      const target = webIdx !== -1 ? webIdx : 4;
      setCurrentStep(target);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(target));
      }
    } catch (err: any) {
      console.error("Failed to save marketplace listings:", err);
      setError(extractErrorMessage(err, "Failed to save listings. Please retry."));
    } finally {
      setIsSavingMarketplace(false);
    }
  };

  const handleMarketplaceWebsiteBack = () => {
    const platIdx = activeSteps.findIndex((s) => s.id === "marketplace_platforms");
    const target = platIdx !== -1 ? platIdx : 3;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  const handleMarketplaceWebsiteContinue = async () => {
    if (!isValidWebsiteUrl(websiteUrl)) {
      setError("Please enter a valid website address (e.g. yourbusiness.com).");
      return;
    }
    setError("");
    setIsSavingMarketplace(true);

    try {
      setMarketplaceSkipWebsite(false);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("marketplace_skip_website", "false");
        sessionStorage.setItem("business_website_url", websiteUrl);
      }
      setBusinessProfile((prev) => ({ ...prev, website: websiteUrl }));

      await OnboardingService.saveMarketplaceWebsite({
        website_url: websiteUrl,
        skip_website: false,
      });

      const readingIdx = activeSteps.findIndex((s) => s.id === "website_reading");
      const target = readingIdx !== -1 ? readingIdx : 5;
      setCurrentStep(target);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(target));
      }
      startWebsiteAnalysis(websiteUrl, "marketplace_seller");
    } catch (err: any) {
      console.error("Failed to save marketplace website:", err);
      setError(extractErrorMessage(err, "Failed to save website. Please retry."));
    } finally {
      setIsSavingMarketplace(false);
    }
  };

  const handleSkipMarketplaceWebsite = async () => {
    setError("");
    setIsSavingMarketplace(true);
    try {
      setMarketplaceSkipWebsite(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("marketplace_skip_website", "true");
      }

      await OnboardingService.saveMarketplaceWebsite({
        skip_website: true,
      });

      const identIdx = activeSteps.findIndex((s) => s.id === "identity");
      const target = identIdx !== -1 ? identIdx : 5;
      setCurrentStep(target);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(target));
      }
    } catch (err: any) {
      console.error("Failed to skip website:", err);
      setError(extractErrorMessage(err, "Failed to skip website. Please retry."));
      const identIdx = activeSteps.findIndex((s) => s.id === "identity");
      setCurrentStep(identIdx !== -1 ? identIdx : 5);
    } finally {
      setIsSavingMarketplace(false);
    }
  };

  // ─── Wholesale / B2B Flow Handlers ───
  const handleToggleB2bPlatform = (id: string) => {
    setError("");
    setSelectedB2bPlatforms((prev) => {
      const next = prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id];
      if (typeof window !== "undefined") {
        sessionStorage.setItem("b2b_selected_platforms", JSON.stringify(next));
      }
      return next;
    });
  };

  const handleB2bPlatformsBack = () => {
    const presenceIdx = activeSteps.findIndex((s) => s.id === "presence");
    const target = presenceIdx !== -1 ? presenceIdx : 2;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  const handleB2bPlatformsContinue = async () => {
    if (selectedB2bPlatforms.length === 0) {
      setError("Please select at least one wholesale platform.");
      return;
    }
    if (selectedB2bPlatforms.includes("other") && !customB2bPlatformName.trim()) {
      setError("Please enter your platform name.");
      return;
    }
    setError("");
    setIsSavingB2b(true);

    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("b2b_selected_platforms", JSON.stringify(selectedB2bPlatforms));
        sessionStorage.setItem("b2b_custom_platform_name", customB2bPlatformName);
      }

      await OnboardingService.saveWholesalePlatforms({
        selected_platforms: selectedB2bPlatforms,
        custom_platform_name: customB2bPlatformName.trim() || undefined,
      });

      // Navigate to the existing URL-entry screen
      const webIdx = activeSteps.findIndex((s) => s.id === "b2b_website");
      const target = webIdx !== -1 ? webIdx : 4;
      setCurrentStep(target);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(target));
      }
    } catch (err: any) {
      console.error("Failed to save wholesale platforms:", err);
      setError(extractErrorMessage(err, "Failed to save wholesale platforms. Please retry."));
    } finally {
      setIsSavingB2b(false);
    }
  };

  const handleToggleB2bListing = (id: string) => {
    setError("");
    if (id === "none_of_these") {
      setSelectedB2bListings((prev) => {
        const next = prev.includes("none_of_these") ? [] : ["none_of_these"];
        if (typeof window !== "undefined") {
          sessionStorage.setItem("b2b_selected_listings", JSON.stringify(next));
        }
        return next;
      });
      setCustomB2bListingName("");
      return;
    }
    setSelectedB2bListings((prev) => {
      const withoutNone = prev.filter((p) => p !== "none_of_these");
      const next = withoutNone.includes(id)
        ? withoutNone.filter((p) => p !== id)
        : [...withoutNone, id];
      if (typeof window !== "undefined") {
        sessionStorage.setItem("b2b_selected_listings", JSON.stringify(next));
      }
      return next;
    });
  };

  const handleB2bListingsBack = () => {
    const platIdx = activeSteps.findIndex((s) => s.id === "b2b_platforms");
    const target = platIdx !== -1 ? platIdx : 2;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  const handleB2bListingsContinue = async () => {
    if (selectedB2bListings.length === 0) {
      setError("Please select where else you sell or choose 'None of these'.");
      return;
    }
    if (selectedB2bListings.includes("other") && !customB2bListingName.trim()) {
      setError("Please enter your platform name.");
      return;
    }
    setError("");
    setIsSavingB2b(true);

    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("b2b_selected_listings", JSON.stringify(selectedB2bListings));
        sessionStorage.setItem("b2b_custom_listing_name", customB2bListingName);
      }

      await OnboardingService.saveWholesalePlatforms({
        selected_platforms: selectedB2bPlatforms,
        custom_platform_name: customB2bPlatformName.trim() || undefined,
        additional_listings: selectedB2bListings.filter((l) => l !== "none_of_these"),
        custom_listing_name: customB2bListingName.trim() || undefined,
      });

      const webIdx = activeSteps.findIndex((s) => s.id === "b2b_website");
      const target = webIdx !== -1 ? webIdx : 4;
      setCurrentStep(target);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(target));
      }
    } catch (err: any) {
      console.error("Failed to save wholesale listings:", err);
      setError(extractErrorMessage(err, "Failed to save listings. Please retry."));
    } finally {
      setIsSavingB2b(false);
    }
  };

  const handleB2bWebsiteBack = () => {
    const platIdx = activeSteps.findIndex((s) => s.id === "b2b_platforms");
    const target = platIdx !== -1 ? platIdx : 3;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  const handleB2bWebsiteContinue = async () => {
    if (!isValidWebsiteUrl(websiteUrl)) {
      setError("Please enter a valid website or storefront address.");
      return;
    }
    setError("");
    setIsSavingB2b(true);

    try {
      setB2bSkipWebsite(false);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("b2b_skip_website", "false");
        sessionStorage.setItem("business_website_url", websiteUrl);
      }
      setBusinessProfile((prev) => ({ ...prev, website: websiteUrl }));

      await OnboardingService.saveWholesaleWebsite({
        website_url: websiteUrl,
        skip_website: false,
      });

      const readingIdx = activeSteps.findIndex((s) => s.id === "website_reading");
      const target = readingIdx !== -1 ? readingIdx : 5;
      setCurrentStep(target);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(target));
      }
      startWebsiteAnalysis(websiteUrl, "wholesale_b2b");
    } catch (err: any) {
      console.error("Failed to save wholesale website:", err);
      setError(extractErrorMessage(err, "Failed to save website. Please retry."));
    } finally {
      setIsSavingB2b(false);
    }
  };

  const handleSkipB2bWebsite = async () => {
    setError("");
    setIsSavingB2b(true);
    try {
      setB2bSkipWebsite(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("b2b_skip_website", "true");
      }

      await OnboardingService.saveWholesaleWebsite({
        skip_website: true,
      });

      const identIdx = activeSteps.findIndex((s) => s.id === "identity");
      const target = identIdx !== -1 ? identIdx : 5;
      setCurrentStep(target);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(target));
      }
    } catch (err: any) {
      console.error("Failed to skip wholesale website:", err);
      setError(extractErrorMessage(err, "Failed to skip website. Please retry."));
      const identIdx = activeSteps.findIndex((s) => s.id === "identity");
      setCurrentStep(identIdx !== -1 ? identIdx : 5);
    } finally {
      setIsSavingB2b(false);
    }
  };

  // ─── No Online Presence Flow Handlers ───
  const handleNoneDetailsBack = () => {
    const presenceIdx = activeSteps.findIndex((s) => s.id === "presence");
    const target = presenceIdx !== -1 ? presenceIdx : 2;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  const handleNoneDetailsContinue = async () => {
    const name = businessProfile.business_name.trim();
    if (!name) {
      setError("Please enter your business name.");
      return;
    }
    setError("");
    setIsSavingBrandKitStep(true);
    try {
      const updatedProfile = {
        ...businessProfile,
        business_name: name,
        business_category: noneCategory || businessProfile.business_category || "Fashion & Apparel",
        business_description: noneDescription.trim() || businessProfile.business_description,
      };
      setBusinessProfile(updatedProfile);

      const updatedDetails = {
        ...businessDetails,
        business_name: name,
        category: noneCategory || businessProfile.business_category || "Fashion & Apparel",
        sub_category: noneSubCategory.trim() || businessDetails.sub_category,
        target_audience: noneAudience.trim() || businessDetails.target_audience,
        products_services: noneProducts.trim() ? [noneProducts.trim()] : businessDetails.products_services,
        differentiators: noneDifferentiator.trim() ? [noneDifferentiator.trim()] : businessDetails.differentiators,
      };
      setBusinessDetails(updatedDetails);

      if (typeof window !== "undefined") {
        sessionStorage.setItem("business_profile_data", JSON.stringify(updatedProfile));
        sessionStorage.setItem("business_details_data", JSON.stringify(updatedDetails));
        sessionStorage.setItem("none_category", noneCategory);
        sessionStorage.setItem("none_sub_category", noneSubCategory);
        sessionStorage.setItem("none_products", noneProducts);
        sessionStorage.setItem("none_audience", noneAudience);
        sessionStorage.setItem("none_differentiator", noneDifferentiator);
        sessionStorage.setItem("none_description", noneDescription);
      }

      // Persist to Business API
      await businessService.updateBusiness({
        name: name,
        category: noneCategory || businessProfile.business_category,
        description: noneDescription.trim() || undefined,
      });

      // Save to BrandKit API
      await updateBrandKit({
        business_name: name,
        business_category: noneCategory || businessProfile.business_category,
        business_description: noneDescription.trim() || undefined,
        sub_category: noneSubCategory.trim() || undefined,
        target_audience: noneAudience.trim() || undefined,
        target_audience_summary: noneAudience.trim() || undefined,
        products_services: noneProducts.trim() ? [noneProducts.trim()] : undefined,
        services_products_summary: noneProducts.trim() ? [noneProducts.trim()] : undefined,
        differentiators: noneDifferentiator.trim() ? [noneDifferentiator.trim()] : undefined,
      });

      await OnboardingService.saveOnlinePresence("none", {
        business_type: "Retail Store",
        selling_model: "Physical Retail Store / Walk-ins",
      });

      await OnboardingService.updateProgress({
        business_name: name,
        business_category: noneCategory || businessProfile.business_category,
        onboarding_step: 3,
      });

      // Advance to Brand Kit Style screen
      const brandKitIdx = activeSteps.findIndex((s) => s.id === "none_brand_kit");
      const target = brandKitIdx !== -1 ? brandKitIdx : currentStep + 1;
      setCurrentStep(target);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(target));
      }
    } catch (err: any) {
      console.error("Failed to save business details:", err);
      setError(err?.message || "Failed to save business details. Please retry.");
    } finally {
      setIsSavingBrandKitStep(false);
    }
  };

  const handleNoneDetailsSkip = () => {
    // If business name is blank, use friendly fallback so user is never blocked
    if (!businessProfile.business_name.trim()) {
      setBusinessProfile((prev) => ({
        ...prev,
        business_name: prev.business_name.trim() || "My Business",
      }));
    }
    setError("");
    const brandKitIdx = activeSteps.findIndex((s) => s.id === "none_brand_kit");
    const target = brandKitIdx !== -1 ? brandKitIdx : currentStep + 1;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  const handleNoneBrandKitBack = () => {
    const detailsIdx = activeSteps.findIndex((s) => s.id === "none_details");
    const target = detailsIdx !== -1 ? detailsIdx : currentStep - 1;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  const handleNoneBrandKitContinue = async () => {
    setError("");
    setIsSavingBrandKitStep(true);
    try {
      const primaryColor = brandPreferences.palette[0] || "#BE32FF";
      const secondaryColor = brandPreferences.palette[1] || "#F0449B";
      const accentColor = brandPreferences.palette[2] || "#FC9A5D";

      if (typeof window !== "undefined") {
        sessionStorage.setItem("business_online_presence", "none");
        localStorage.setItem("business_online_presence", "none");
        sessionStorage.setItem("brand_preferences_data", JSON.stringify(brandPreferences));
        localStorage.setItem("brand_preferences_data", JSON.stringify(brandPreferences));
        sessionStorage.setItem("selected_font", selectedFont);
      }

      // Persist to BrandKit API
      await updateBrandKit({
        business_name: businessProfile.business_name.trim() || undefined,
        business_category: noneCategory || businessProfile.business_category,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        accent_color: accentColor,
        brand_colors: brandPreferences.palette,
        palette: brandPreferences.palette,
        font: selectedFont,
        tones: brandPreferences.tones,
        tone: brandPreferences.tones.join(", "),
        language: brandPreferences.language,
        logo_url: businessProfile.business_logo || businessDetails.logo_url || undefined,
      });

      await OnboardingService.updateProgress({
        brand_colors: brandPreferences.palette,
        onboarding_step: 4,
        online_presence: "none",
      });

      // Advance to common completion screen: "Let's make your first thing"
      const firstThingIdx = activeSteps.findIndex((s) => s.id === "first_thing");
      const target = firstThingIdx !== -1 ? firstThingIdx : currentStep + 1;
      setCurrentStep(target);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(target));
      }
    } catch (err: any) {
      console.error("Failed to save brand preferences:", err);
      setError(err?.message || "Failed to save brand preferences. Please retry.");
    } finally {
      setIsSavingBrandKitStep(false);
    }
  };

  const handleNoneBrandKitSkip = () => {
    setError("");
    if (typeof window !== "undefined") {
      sessionStorage.setItem("business_online_presence", "none");
      localStorage.setItem("business_online_presence", "none");
    }
    // Advance to common completion screen: "Let's make your first thing"
    const firstThingIdx = activeSteps.findIndex((s) => s.id === "first_thing");
    const target = firstThingIdx !== -1 ? firstThingIdx : currentStep + 1;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  const handleBrandLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingBrandLogo(true);
    setError("");
    try {
      let logoUrl = "";
      try {
        logoUrl = await uploadBrandLogo(file);
      } catch (_) {
        logoUrl = URL.createObjectURL(file);
      }
      setLogoPreview(logoUrl);
      setBusinessProfile((prev) => ({ ...prev, business_logo: logoUrl }));
      setBusinessDetails((prev) => ({ ...prev, logo_url: logoUrl }));
      if (typeof window !== "undefined") {
        sessionStorage.setItem("brand_kit_logo", logoUrl);
      }
    } catch (err: any) {
      console.error("Logo upload error:", err);
      setError("Failed to upload logo. You can proceed without it or try another image.");
    } finally {
      setIsUploadingBrandLogo(false);
    }
  };

  const handleRemoveBrandLogo = () => {
    setLogoPreview(null);
    setBusinessProfile((prev) => ({ ...prev, business_logo: "" }));
    setBusinessDetails((prev) => ({ ...prev, logo_url: "" }));
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("brand_kit_logo");
    }
  };

  const handleSelectColorPreset = (preset: ColorPreset) => {
    const newPalette = [preset.primary, preset.secondary, preset.accent];
    setBrandPreferences((prev) => ({
      ...prev,
      palette: newPalette,
    }));
    setBusinessProfile((prev) => ({
      ...prev,
      brand_color: preset.primary,
    }));
  };

  const handleSelectInfluencerAndLaunch = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      setIsActivatingInfluencer(true);
      setError("");

      const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      let existingUser: any = stored ? JSON.parse(stored) : {};

      const pendingStr = typeof window !== "undefined" ? sessionStorage.getItem("pending_signup") : null;
      const pending = pendingStr ? JSON.parse(pendingStr) : null;

      const influencerPayload = {
        accountType: "influencer",
        role: "influencer",
        fullName: existingUser.fullName || existingUser.name || influencerProfile.fullName || "Verified Creator",
        name: existingUser.name || existingUser.fullName || influencerProfile.fullName || "Verified Creator",
        onboardingCompleted: true,
        onboarding_step: 3,
      };

      if (pending) {
        const signupPayload = {
          ...influencerPayload,
          email: pending.email,
          password: pending.password,
          confirmPassword: pending.confirmPassword || pending.password,
          otp: pending.otp,
          role: "influencer",
          accountType: "influencer",
        };
        const res = await authService.signup(signupPayload);
        if (res.token && res.user) {
          const u = { ...res.user, role: "influencer", accountType: "influencer", onboardingCompleted: true };
          localStorage.setItem("access_token", res.token);
          localStorage.setItem("user", JSON.stringify(u));
          login(res.token, u);
        }
        sessionStorage.removeItem("pending_signup");
      } else {
        try {
          await userService.updateMe(influencerPayload);
        } catch (_) {}

        const updatedUser = {
          ...existingUser,
          role: "influencer",
          accountType: "influencer",
          onboardingCompleted: true,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        const token = localStorage.getItem("access_token") || "";
        if (token) {
          login(token, updatedUser);
        }
      }

      try {
        await OnboardingService.updateProgress({
          completed: true,
          onboarding_completed: true,
          onboardingCompleted: true,
          is_completed: true,
          onboarding_step: 3,
        });
      } catch (_) {}

      // Directly open Influencer Dashboard
      router.push("/influencer");
    } catch (err: any) {
      console.error("Failed to activate influencer dashboard:", err);
      try {
        const u = JSON.parse(localStorage.getItem("user") || "{}");
        u.role = "influencer";
        u.accountType = "influencer";
        u.onboardingCompleted = true;
        localStorage.setItem("user", JSON.stringify(u));
      } catch (_) {}
      router.push("/influencer");
    } finally {
      setIsActivatingInfluencer(false);
    }
  };


  // Influencer Profile Form State
  const [influencerProfile, setInfluencerProfile] = useState({
    fullName: "",
    username: "",
    category: "Fashion",
    bio: "",
    city: "",
    state: "",
    location: "",
    phone: "",
    preferredLanguage: "hinglish",
    instagram_url: "",
    youtube_url: "",
    follower_count: 50000,
    engagement_rate: 4.8,
    expectedPricePerPost: 5000,
  });

  // User Profile Form State
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    preferredLanguage: "hinglish",
    profileImageUrl: "",
    primaryGoal: "content_creation",
    interests: ["Instagram Reels", "AI Photoshoots"],
    platforms: ["instagram", "youtube", "linkedin"],
  });

  // Business Profile Form State (matching MongoDB document fields)
  const [businessProfile, setBusinessProfile] = useState({
    business_name: "",
    business_type: "Retail Store",
    business_category: "clothing",
    business_description: "",
    business_logo: "",
    brand_color: "#be32ff",
    website: "",
    registration_number: "",
    year_established: new Date().getFullYear().toString(),
    country: "India",
    state: "",
    city: "",
    area: "",
    pincode: "",
    full_address: "",
    google_maps_url: "",
    business_model: "B2C",
    selling_model: "Retail Store",
    target_age_group: ["18-24", "25-34"],
    target_gender: "All",
    target_location: "Local City",
    customer_type: "Mass Market",
    phone: "",
    preferredLanguage: "hinglish",
    selected_services: [] as string[],
  });

  // Initialize fields with pending signup or logged-in user's details
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const pendingRole = sessionStorage.getItem("signup_role");
        if (pendingRole === "influencer") {
          setAccountType("influencer");
        }

        const pendingStr = sessionStorage.getItem("pending_signup");
        if (pendingStr) {
          const pending = JSON.parse(pendingStr);
          if (pending) {
            setUserProfile((prev) => ({
              ...prev,
              fullName: pending.fullName || prev.fullName,
              firstName: pending.firstName || prev.firstName,
              lastName: pending.lastName || prev.lastName,
              email: pending.email || prev.email,
              phone: pending.phone || pending.contactNumber || prev.phone,
            }));
            setBusinessProfile((prev) => ({
              ...prev,
              phone: pending.phone || pending.contactNumber || prev.phone,
              business_name: pending.firstName ? `${pending.firstName}'s Brand` : prev.business_name,
            }));
            setInfluencerProfile((prev) => ({
              ...prev,
              fullName: pending.fullName || pending.name || prev.fullName,
              username: pending.email ? pending.email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_") : prev.username,
              phone: pending.phone || pending.contactNumber || prev.phone,
            }));
            return;
          }
        }

        // Check if user has already completed onboarding via /api/v1/onboarding/status
        const token = localStorage.getItem("access_token");
        if (token) {
          OnboardingService.isCompleted(token).then((done) => {
            if (done) {
              const cached = localStorage.getItem("user");
              const uObj = cached ? JSON.parse(cached) : null;
              if (uObj?.role === "influencer" || uObj?.accountType === "influencer") {
                router.replace("/influencer");
              } else {
                router.replace("/dashboard");
              }
            }
          }).catch(() => {});
        }

        const stored = localStorage.getItem("user");
        const u = stored ? JSON.parse(stored) : user;
        if (u) {
          if (u.onboardingCompleted === true || u.onboarding_completed === true) {
            if (u.role === "influencer" || u.accountType === "influencer") {
              router.replace("/influencer");
            } else {
              router.replace("/dashboard");
            }
            return;
          }
          const first = u.firstName || (u.name ? u.name.split(" ")[0] : "");
          const last = u.lastName || (u.name && u.name.split(" ").length > 1 ? u.name.split(" ").slice(1).join(" ") : "");
          const full = u.fullName || u.name || `${first} ${last}`.trim();

          setUserProfile((prev) => ({
            ...prev,
            fullName: full || prev.fullName,
            firstName: first || prev.firstName,
            lastName: last || prev.lastName,
            email: u.email || prev.email,
            phone: u.contactNumber || u.phone || prev.phone,
            preferredLanguage: u.preferredLanguage || prev.preferredLanguage,
            profileImageUrl: u.profileImageUrl || prev.profileImageUrl,
          }));

          setBusinessProfile((prev) => ({
            ...prev,
            business_name: u.business_name || (first ? `${first}'s Brand` : prev.business_name),
            business_type: u.business_type || prev.business_type,
            business_category: u.business_category || prev.business_category,
            phone: u.contactNumber || u.phone || prev.phone,
            preferredLanguage: u.preferredLanguage || prev.preferredLanguage,
            city: u.city || prev.city,
            state: u.state || prev.state,
          }));

          setInfluencerProfile((prev) => ({
            ...prev,
            fullName: full || prev.fullName,
            username: u.username || (u.email ? u.email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_") : prev.username),
            phone: u.contactNumber || u.phone || prev.phone,
            preferredLanguage: u.preferredLanguage || prev.preferredLanguage,
            city: u.city || prev.city,
            state: u.state || prev.state,
          }));

          if (pendingRole === "influencer" || u.accountType === "influencer" || u.role === "influencer") {
            setAccountType("influencer");
          } else if (u.accountType === "business" || u.role === "business") {
            setAccountType("business");
          } else if (u.accountType === "user") {
            setAccountType("user");
          }
        }
      } catch (err) {
        console.error("Failed to parse stored user in onboarding:", err);
      }
    }
  }, [user]);

  // Handle Logo file upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setLogoPreview(dataUrl);
        setBusinessProfile((prev) => ({ ...prev, business_logo: dataUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Define steps dynamically based on selected AccountType
  const userSteps = [
    { id: "account_type", title: "Account Type", desc: "Select role" },
    { id: "personal_profile", title: "Profile", desc: "Your details" },
    { id: "goals", title: "Goals", desc: "Usage preferences" },
    { id: "ready", title: "Ready", desc: "Start exploring" },
  ];

  const influencerSteps = [
    { id: "account_type", title: "Account Type", desc: "Select role" },
    { id: "creator_profile", title: "Creator Profile", desc: "Niche & media kit" },
    { id: "social_reach", title: "Social Reach", desc: "Platforms & rates" },
    { id: "ready", title: "Ready", desc: "Start collaborating" },
  ];

  const businessSteps = [
    { id: "get_started", title: "Get Started", desc: "Welcome" },
    { id: "business_services", title: "Business Services", desc: "Choose services" },
    { id: "presence", title: "Online Presence", desc: "Where you sell" },
    ...(selectedOnlinePresence === "website"
      ? [
          { id: "website_url", title: "Website", desc: "Your storefront" },
          { id: "website_reading", title: "Reading Website", desc: "AI audit" },
          { id: "business_details", title: "Business Details", desc: "Is this your business?" },
          { id: "brand_preferences", title: "Brand Identity", desc: "What's your business like?" },
          { id: "website_photos", title: "Photos", desc: "Pick website photos" },
        ]
      : selectedOnlinePresence === "google_maps"
      ? [
          { id: "maps_search", title: "Google Maps", desc: "Find your shop" },
          { id: "maps_website", title: "Website", desc: "Storefront link" },
          { id: "maps_category", title: "Category", desc: "Business niche" },
          { id: "maps_details", title: "Business Details", desc: "About your shop" },
          { id: "maps_photos", title: "Photos", desc: "Pick shop photos" },
        ]
      : selectedOnlinePresence === "marketplace" || selectedOnlinePresence === "marketplace_seller"
      ? [
          { id: "marketplace_platforms", title: "Marketplaces", desc: "Where you sell" },
          { id: "marketplace_website", title: "Website", desc: "Storefront link" },
          ...(marketplaceSkipWebsite
            ? [{ id: "identity", title: "Business Identity", desc: "Name & category" }]
            : [
                { id: "website_reading", title: "Reading Website", desc: "AI audit" },
                { id: "business_details", title: "Business Details", desc: "Is this your business?" },
                { id: "brand_preferences", title: "Brand Identity", desc: "What's your business like?" },
                { id: "website_photos", title: "Photos", desc: "Pick website photos" },
              ]),
        ]
      : selectedOnlinePresence === "b2b" || selectedOnlinePresence === "wholesale_b2b"
      ? [
          { id: "b2b_platforms", title: "B2B Channels", desc: "Wholesale platforms" },
          { id: "b2b_website", title: "Storefront", desc: "Storefront link" },
          ...(b2bSkipWebsite
            ? [{ id: "identity", title: "Business Identity", desc: "Name & category" }]
            : [
                { id: "website_reading", title: "Reading Website", desc: "AI audit" },
                { id: "business_details", title: "Business Details", desc: "Is this your business?" },
                { id: "brand_preferences", title: "Brand Identity", desc: "What's your business like?" },
                { id: "website_photos", title: "Photos", desc: "Pick website photos" },
              ]),
        ]
      : selectedOnlinePresence === "social_media"
      ? [
          { id: "social_platforms", title: "Social Profiles", desc: "Select platforms & handles" },
          { id: "identity", title: "Business Identity", desc: "Name & category" },
        ]
      : selectedOnlinePresence === "none" || selectedOnlinePresence === "no_online_presence"
      ? [
          { id: "none_details", title: "Business Basics", desc: "Name & products" },
          { id: "none_brand_kit", title: "Brand Kit", desc: "Colors, font & voice" },
        ]
      : [
          { id: "identity", title: "Business Identity", desc: "Name & category" },
        ]),
    { id: "first_thing", title: "First Creation", desc: "Make your first thing" },
    { id: "post_maker_pick", title: "Pick Photos", desc: "Select post photos" },
    { id: "post_maker_ready", title: "Posts Ready", desc: "Review your output" },
    { id: "registration", title: "Registration", desc: "Contact & legal" },
    { id: "location", title: "Location", desc: "Address details" },
    { id: "audience", title: "Target Audience", desc: "Market & customers" },
    { id: "ready", title: "Ready", desc: "Launch AI engine" },
  ];

  const activeSteps = 
    accountType === "business" 
      ? businessSteps 
      : accountType === "influencer" 
        ? influencerSteps 
        : userSteps;
  const currentStepObj = activeSteps[currentStep] || activeSteps[0];


  const isLastStep = currentStep === activeSteps.length - 1;
  const isFormCardStep =
    currentStepObj.id !== "get_started" &&
    currentStepObj.id !== "business_services" &&
    currentStepObj.id !== "presence" &&
    currentStepObj.id !== "social_platforms" &&
    currentStepObj.id !== "website_url" &&
    currentStepObj.id !== "website_reading" &&
    currentStepObj.id !== "business_details" &&
    currentStepObj.id !== "brand_preferences" &&
    currentStepObj.id !== "website_photos" &&
    currentStepObj.id !== "maps_search" &&
    currentStepObj.id !== "maps_website" &&
    currentStepObj.id !== "maps_category" &&
    currentStepObj.id !== "maps_details" &&
    currentStepObj.id !== "maps_photos" &&
    currentStepObj.id !== "marketplace_platforms" &&
    currentStepObj.id !== "marketplace_listings" &&
    currentStepObj.id !== "marketplace_website" &&
    currentStepObj.id !== "b2b_platforms" &&
    currentStepObj.id !== "b2b_listings" &&
    currentStepObj.id !== "b2b_website" &&
    currentStepObj.id !== "none_details" &&
    currentStepObj.id !== "none_brand_kit" &&
    currentStepObj.id !== "first_thing" &&
    currentStepObj.id !== "post_maker_pick" &&
    currentStepObj.id !== "post_maker_ready";

  // Validation before advancing to next step
  const validateCurrentStep = () => {
    setError("");
    const stepId = currentStepObj?.id;
    if (accountType === "user") {
      if (stepId === "personal_profile") {
        if (!userProfile.fullName.trim()) {
          setError("Please enter your full name.");
          return false;
        }
      }
    } else if (accountType === "influencer") {
      if (stepId === "creator_profile") {
        if (!influencerProfile.fullName.trim()) {
          setError("Please enter your Creator / Display Name.");
          return false;
        }
        if (!influencerProfile.category) {
          setError("Please select your primary niche / category.");
          return false;
        }
      } else if (stepId === "social_reach") {
        if (!influencerProfile.instagram_url.trim() && !influencerProfile.youtube_url.trim()) {
          setError("Please provide at least one social media link or handle (Instagram or YouTube).");
          return false;
        }
      }
    } else {
      if (stepId === "get_started") {
        return true;
      }
      if (stepId === "business_services") {
        if (!selectedServices || selectedServices.length === 0) {
          setError("Please select at least one service for your business to continue.");
          return false;
        }
        return true;
      }
      if (stepId === "presence") {
        if (!selectedOnlinePresence) {
          setError("Please select where your business lives online.");
          return false;
        }
      } else if (stepId === "social_platforms") {
        if (selectedSocialPlatforms.length === 0) {
          setError("Please select at least one social media platform.");
          return false;
        }
        return true;
      } else if (stepId === "website_url") {
        if (!isValidWebsiteUrl(websiteUrl)) {
          setError("Please enter a valid website address.");
          return false;
        }
      } else if (stepId === "website_reading") {
        return true;
      } else if (stepId === "business_details") {
        if (!businessDetails.business_name.trim()) {
          setError("Business Name is required.");
          return false;
        }
      } else if (stepId === "brand_preferences") {
        return true;
      } else if (stepId === "website_photos") {
        return true;
      } else if (stepId === "maps_search") {
        if (!selectedMapsPlace) {
          setError("Please search and select your shop on Google Maps.");
          return false;
        }
      } else if (stepId === "maps_website") {
        return true;
      } else if (stepId === "maps_category") {
        if (!mapsCategory.trim()) {
          setError("Please select a business category.");
          return false;
        }
      } else if (stepId === "maps_details") {
        if (!businessProfile.business_name.trim()) {
          setError("Business Name is required.");
          return false;
        }
        if (!mapsPromotion.trim()) {
          setError("Please tell us what we should promote for your business.");
          return false;
        }
      } else if (stepId === "maps_photos") {
        if (selectedMapsPhotos.length === 0) {
          setError("Please select or upload at least one photo.");
          return false;
        }
      } else if (stepId === "marketplace_platforms") {
        if (selectedMarketplaces.length === 0) {
          setError("Please select at least one marketplace.");
          return false;
        }
        if (selectedMarketplaces.includes("other") && !customMarketplaceName.trim()) {
          setError("Please enter your custom marketplace name.");
          return false;
        }
      } else if (stepId === "marketplace_listings") {
        if (selectedListings.length === 0) {
          setError("Please select where you list your business or choose 'None of these'.");
          return false;
        }
        if (selectedListings.includes("other") && !customListingName.trim()) {
          setError("Please enter your custom directory name.");
          return false;
        }
      } else if (stepId === "marketplace_website") {
        return true;
      } else if (stepId === "b2b_platforms") {
        if (selectedB2bPlatforms.length === 0) {
          setError("Please select at least one wholesale platform.");
          return false;
        }
        if (selectedB2bPlatforms.includes("other") && !customB2bPlatformName.trim()) {
          setError("Please enter your platform name.");
          return false;
        }
      } else if (stepId === "b2b_listings") {
        if (selectedB2bListings.length === 0) {
          setError("Please select where else you sell or choose 'None of these'.");
          return false;
        }
        if (selectedB2bListings.includes("other") && !customB2bListingName.trim()) {
          setError("Please enter your platform name.");
          return false;
        }
      } else if (stepId === "b2b_website") {
        return true;
      } else if (stepId === "none_details") {
        if (!businessProfile.business_name.trim()) {
          setError("Please enter your business name.");
          return false;
        }
      } else if (stepId === "none_brand_kit") {
        return true;
      } else if (stepId === "identity") {
        if (!businessProfile.business_name.trim()) {
          setError("Business Name is required.");
          return false;
        }
        if (!businessProfile.business_category) {
          setError("Please select a business category.");
          return false;
        }
      } else if (stepId === "location") {
        if (!businessProfile.city.trim()) {
          setError("City is required for localized AI marketing.");
          return false;
        }
      }
    }
    return true;
  };

  const handleNext = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!validateCurrentStep()) return;

    if (currentStep < activeSteps.length - 2) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(nextStep));
      }
    } else if (currentStep === activeSteps.length - 2) {
      // Final submission step
      await submitOnboarding();
    } else {
      // Already on ready screen -> Go to Dashboard or Creator Hub
      try {
        await OnboardingService.completeOnboarding();
      } catch (_) {}
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const u = JSON.parse(stored);
          u.onboardingCompleted = true;
          if (accountType === "influencer") {
            u.role = "influencer";
            u.accountType = "influencer";
          }
          localStorage.setItem("user", JSON.stringify(u));
        }
      } catch (_) {}
      if (accountType === "influencer") {
        router.push("/influencer");
      } else {
        router.push("/dashboard");
      }
    }
  };

  // ─── First Creation & Post Maker Flow Handlers ───
  const handleFirstThingContinue = async () => {
    setError("");
    setIsSavingFirstThing(true);
    try {
      const backendChoice: "post_maker" | "ai_photoshoot" | "reel_maker" =
        firstThingChoice === "photoshoot"
          ? "ai_photoshoot"
          : firstThingChoice === "reel_maker"
          ? "reel_maker"
          : "post_maker";

      await OnboardingService.saveFirstContentChoice(backendChoice);

      if (firstThingChoice === "post_maker") {
        const pickIdx = activeSteps.findIndex((s) => s.id === "post_maker_pick");
        const target = pickIdx !== -1 ? pickIdx : currentStep + 1;
        setCurrentStep(target);
        if (typeof window !== "undefined") sessionStorage.setItem("onboarding_step", String(target));
      } else if (firstThingChoice === "photoshoot") {
        router.push("/ai-photoshoot");
      } else if (firstThingChoice === "reel_maker") {
        router.push("/create/reel");
      }
    } catch (err: any) {
      console.error("Failed to save first content choice:", err);
      setError(err?.message || "Failed to save your selection. Please try again.");
    } finally {
      setIsSavingFirstThing(false);
    }
  };

  const handleFirstThingBack = () => {
    if (selectedOnlinePresence === "website") {
      const photosIdx = activeSteps.findIndex((s) => s.id === "website_photos");
      const target = photosIdx !== -1 ? photosIdx : currentStep - 1;
      setCurrentStep(target);
      if (typeof window !== "undefined") sessionStorage.setItem("onboarding_step", String(target));
    } else if (selectedOnlinePresence === "google_maps") {
      const mapsPhotosIdx = activeSteps.findIndex((s) => s.id === "maps_photos");
      const target = mapsPhotosIdx !== -1 ? mapsPhotosIdx : currentStep - 1;
      setCurrentStep(target);
      if (typeof window !== "undefined") sessionStorage.setItem("onboarding_step", String(target));
    } else if (selectedOnlinePresence === "marketplace" || selectedOnlinePresence === "marketplace_seller") {
      if (marketplaceSkipWebsite) {
        const identIdx = activeSteps.findIndex((s) => s.id === "identity");
        const target = identIdx !== -1 ? identIdx : currentStep - 1;
        setCurrentStep(target);
        if (typeof window !== "undefined") sessionStorage.setItem("onboarding_step", String(target));
      } else {
        const photosIdx = activeSteps.findIndex((s) => s.id === "website_photos");
        const target = photosIdx !== -1 ? photosIdx : currentStep - 1;
        setCurrentStep(target);
        if (typeof window !== "undefined") sessionStorage.setItem("onboarding_step", String(target));
      }
    } else if (selectedOnlinePresence === "b2b" || selectedOnlinePresence === "wholesale_b2b") {
      if (b2bSkipWebsite) {
        const identIdx = activeSteps.findIndex((s) => s.id === "identity");
        const target = identIdx !== -1 ? identIdx : currentStep - 1;
        setCurrentStep(target);
        if (typeof window !== "undefined") sessionStorage.setItem("onboarding_step", String(target));
      } else {
        const photosIdx = activeSteps.findIndex((s) => s.id === "website_photos");
        const target = photosIdx !== -1 ? photosIdx : currentStep - 1;
        setCurrentStep(target);
        if (typeof window !== "undefined") sessionStorage.setItem("onboarding_step", String(target));
      }
    } else if (selectedOnlinePresence === "none" || selectedOnlinePresence === "no_online_presence") {
      const brandKitIdx = activeSteps.findIndex((s) => s.id === "none_brand_kit");
      const target = brandKitIdx !== -1 ? brandKitIdx : currentStep - 1;
      setCurrentStep(target);
      if (typeof window !== "undefined") sessionStorage.setItem("onboarding_step", String(target));
    } else {
      setCurrentStep(Math.max(0, currentStep - 1));
    }
  };

  const handlePostMakerPickBack = () => {
    const firstIdx = activeSteps.findIndex((s) => s.id === "first_thing");
    const target = firstIdx !== -1 ? firstIdx : currentStep - 1;
    setCurrentStep(target);
    if (typeof window !== "undefined") sessionStorage.setItem("onboarding_step", String(target));
  };

  const handlePostMakerReadyBack = () => {
    const pickIdx = activeSteps.findIndex((s) => s.id === "post_maker_pick");
    const target = pickIdx !== -1 ? pickIdx : currentStep - 1;
    setCurrentStep(target);
    if (typeof window !== "undefined") sessionStorage.setItem("onboarding_step", String(target));
  };

  const handleGeneratePosts = async () => {
    setIsGeneratingPosts(true);
    setGenerationStatusText("Analyzing your brand and visual style...");
    const businessName = businessProfile.business_name || businessDetails.business_name || "SevenUnique Tech Solutions";
    const category = businessProfile.business_category || businessDetails.category || "Tech & Electronics";
    const activePhoto = promoPhoto || getAvailablePhotos()[0];

    try {
      setGenerationStatusText(`Synthesizing ${businessName}'s promotional voice...`);
      
      let res: any = null;
      try {
        res = await contentService.generateContent({
          type: "Instagram Post",
          platform: "Instagram",
          language: brandPreferences.language || "English",
          tone: brandPreferences.tones[0] || "Professional",
          productName: businessName,
          productDescription: businessProfile.business_description || businessDetails.tagline || `${category} business services and offerings`,
          use_brand_kit: true,
          brand_name: businessName,
          targetAudience: businessDetails.target_audience || "Customers & clients",
          productImages: [activePhoto],
        });
      } catch (apiErr) {
        console.warn("Notice: Content generation API fallback to client synthesis:", apiErr);
      }

      setGenerationStatusText("Packaging high-converting captions and hashtags...");

      const generatedPostData: GeneratedPost = {
        product_id: "onboarding_" + Date.now(),
        platform: "Instagram",
        objective: "Promotions & Brand Growth",
        headline: res?.data?.title || `${businessName} Special Launch & Offers`,
        caption: res?.data?.caption || `Accelerate your results with ${businessName}. Top-tier solutions designed for your needs. Contact us today or visit our storefront to discover more!`,
        call_to_action: res?.data?.callToAction || "Link in bio / Tap to learn more",
        hashtags: Array.isArray(res?.data?.hashtags) && res.data.hashtags.length > 0 
          ? res.data.hashtags 
          : [`#${businessName.replace(/[^a-zA-Z0-9]/g, "")}`, `#${category.replace(/[^a-zA-Z0-9]/g, "")}`, "#BusinessGrowth", "#Trending", "#ScalioAI"],
        image_url: activePhoto,
        media_url: activePhoto,
        creative_direction: "Vibrant high-conversion promotional design with curated brand color accents.",
      };

      setGeneratedOnboardingPost(generatedPostData);

      const readyIdx = activeSteps.findIndex((s) => s.id === "post_maker_ready");
      const target = readyIdx !== -1 ? readyIdx : currentStep + 1;
      setCurrentStep(target);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(target));
      }
    } catch (err: any) {
      console.error("Post generation error:", err);
      const fallbackPost: GeneratedPost = {
        product_id: "onboarding_" + Date.now(),
        platform: "Instagram",
        objective: "Promotions & Brand Growth",
        headline: `${businessName} Special Launch`,
        caption: `Elevate your business with ${businessName}. Quality, consistency, and results. Visit us today!`,
        call_to_action: "Visit profile link",
        hashtags: [`#${businessName.replace(/[^a-zA-Z0-9]/g, "")}`, "#BusinessGrowth", "#DhandaGrow"],
        image_url: activePhoto,
        media_url: activePhoto,
      };
      setGeneratedOnboardingPost(fallbackPost);
      const readyIdx = activeSteps.findIndex((s) => s.id === "post_maker_ready");
      const target = readyIdx !== -1 ? readyIdx : currentStep + 1;
      setCurrentStep(target);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(target));
      }
    } finally {
      setIsGeneratingPosts(false);
    }
  };

  const handleOpenUnlockedPostInCreate = () => {
    const postHeadline =
      generatedOnboardingPost?.headline ||
      `${businessProfile.business_name || businessDetails.business_name || "Business"} Special Launch`;
    const postCaption =
      generatedOnboardingPost?.caption ||
      `Elevate your business with ${businessProfile.business_name || businessDetails.business_name || "us"}! Visit us today.`;
    const postImage =
      generatedOnboardingPost?.image_url ||
      promoPhoto ||
      DEFAULT_BUSINESS_PHOTOS[0];
    const postId = (generatedOnboardingPost as any)?.id || "onboarding_post_unlocked";

    const postToOpen: GeneratedPost = {
      id: postId,
      product_id: "onboarding_sample",
      platform: "Instagram",
      objective: "Promotion",
      headline: postHeadline,
      caption: postCaption,
      call_to_action: generatedOnboardingPost?.call_to_action || "Visit profile link",
      hashtags: generatedOnboardingPost?.hashtags || ["#BusinessGrowth", "#Marketing", "#Viral"],
      image_url: postImage,
      media_url: postImage,
      creative_direction: generatedOnboardingPost?.creative_direction || postHeadline,
    };

    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_post_for_edit", JSON.stringify(postToOpen));
      localStorage.setItem("onboarding_post_for_edit", JSON.stringify(postToOpen));
    }

    try {
      OnboardingService.completeOnboarding().catch(() => {});
    } catch (_) {}

    router.push(`/ai-post?edit_post_id=${encodeURIComponent(postId)}&from=onboarding`);
  };

  const handleLockedPostClick = () => {
    setShowPlansModal(true);
  };

  const handleBack = () => {
    setError("");
    if (accountType === "business") {
      const stepId = currentStepObj?.id;
      if (stepId === "registration") {
        const readyIdx = activeSteps.findIndex((s) => s.id === "post_maker_ready");
        const target = readyIdx !== -1 ? readyIdx : currentStep - 1;
        setCurrentStep(target);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("onboarding_step", String(target));
        }
        return;
      }
      if (stepId === "post_maker_ready") {
        handlePostMakerReadyBack();
        return;
      }
      if (stepId === "post_maker_pick") {
        handlePostMakerPickBack();
        return;
      }
      if (stepId === "first_thing") {
        handleFirstThingBack();
        return;
      }
      if (
        stepId === "website_url" ||
        stepId === "maps_search" ||
        stepId === "marketplace_platforms" ||
        stepId === "b2b_platforms" ||
        stepId === "social_platforms" ||
        stepId === "none_details"
      ) {
        const presenceIdx = activeSteps.findIndex((s) => s.id === "presence");
        const target = presenceIdx !== -1 ? presenceIdx : 2;
        setCurrentStep(target);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("onboarding_step", String(target));
        }
        return;
      }
      if (stepId === "marketplace_listings") {
        const platIdx = activeSteps.findIndex((s) => s.id === "marketplace_platforms");
        const target = platIdx !== -1 ? platIdx : currentStep - 1;
        setCurrentStep(target);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("onboarding_step", String(target));
        }
        return;
      }
      if (stepId === "marketplace_website") {
        const listIdx = activeSteps.findIndex((s) => s.id === "marketplace_listings");
        const target = listIdx !== -1 ? listIdx : currentStep - 1;
        setCurrentStep(target);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("onboarding_step", String(target));
        }
        return;
      }
      if (stepId === "b2b_platforms") {
        const presenceIdx = activeSteps.findIndex((s) => s.id === "presence");
        const target = presenceIdx !== -1 ? presenceIdx : 1;
        setCurrentStep(target);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("onboarding_step", String(target));
        }
        return;
      }
      if (stepId === "b2b_listings") {
        const platIdx = activeSteps.findIndex((s) => s.id === "b2b_platforms");
        const target = platIdx !== -1 ? platIdx : currentStep - 1;
        setCurrentStep(target);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("onboarding_step", String(target));
        }
        return;
      }
      if (stepId === "b2b_website") {
        const listIdx = activeSteps.findIndex((s) => s.id === "b2b_listings");
        const target = listIdx !== -1 ? listIdx : currentStep - 1;
        setCurrentStep(target);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("onboarding_step", String(target));
        }
        return;
      }
      if (stepId === "maps_photos") {
        const detailsIdx = activeSteps.findIndex((s) => s.id === "maps_details");
        const target = detailsIdx !== -1 ? detailsIdx : currentStep - 1;
        setCurrentStep(target);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("onboarding_step", String(target));
        }
        return;
      }
      if (stepId === "maps_details") {
        const catIdx = activeSteps.findIndex((s) => s.id === "maps_category");
        const target = catIdx !== -1 ? catIdx : currentStep - 1;
        setCurrentStep(target);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("onboarding_step", String(target));
        }
        return;
      }
      if (stepId === "maps_category") {
        const webIdx = activeSteps.findIndex((s) => s.id === "maps_website");
        const target = webIdx !== -1 ? webIdx : currentStep - 1;
        setCurrentStep(target);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("onboarding_step", String(target));
        }
        return;
      }
      if (stepId === "maps_website") {
        const searchIdx = activeSteps.findIndex((s) => s.id === "maps_search");
        const target = searchIdx !== -1 ? searchIdx : currentStep - 1;
        setCurrentStep(target);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("onboarding_step", String(target));
        }
        return;
      }
      if (stepId === "maps_search") {
        const presenceIdx = activeSteps.findIndex((s) => s.id === "presence");
        const target = presenceIdx !== -1 ? presenceIdx : 1;
        setCurrentStep(target);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("onboarding_step", String(target));
        }
        return;
      }
      if (stepId === "website_photos") {
        const brandIdx = activeSteps.findIndex((s) => s.id === "brand_preferences");
        const target = brandIdx !== -1 ? brandIdx : currentStep - 1;
        setCurrentStep(target);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("onboarding_step", String(target));
        }
        return;
      }
      if (stepId === "brand_preferences") {
        const detailsIdx = activeSteps.findIndex((s) => s.id === "business_details");
        const target = detailsIdx !== -1 ? detailsIdx : currentStep - 1;
        setCurrentStep(target);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("onboarding_step", String(target));
        }
        return;
      }
      if (stepId === "business_details") {
        const readingIdx = activeSteps.findIndex((s) => s.id === "website_reading");
        const target = readingIdx !== -1 ? readingIdx : currentStep - 1;
        setCurrentStep(target);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("onboarding_step", String(target));
        }
        return;
      }
      if (stepId === "identity") {
        if (selectedOnlinePresence === "social_media") {
          const sIdx = activeSteps.findIndex((s) => s.id === "social_platforms");
          const target = sIdx !== -1 ? sIdx : 3;
          setCurrentStep(target);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("onboarding_step", String(target));
          }
          return;
        }
        if (selectedOnlinePresence === "marketplace" || selectedOnlinePresence === "marketplace_seller") {
          setMarketplaceSkipWebsite(false);
          const webIdx = activeSteps.findIndex((s) => s.id === "marketplace_website");
          const target = webIdx !== -1 ? webIdx : 4;
          setCurrentStep(target);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("onboarding_step", String(target));
          }
          return;
        }
        if (selectedOnlinePresence === "b2b" || selectedOnlinePresence === "wholesale_b2b") {
          setB2bSkipWebsite(false);
          const webIdx = activeSteps.findIndex((s) => s.id === "b2b_website");
          const target = webIdx !== -1 ? webIdx : 4;
          setCurrentStep(target);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("onboarding_step", String(target));
          }
          return;
        }
        const presenceIdx = activeSteps.findIndex((s) => s.id === "presence");
        const target = presenceIdx !== -1 ? presenceIdx : 1;
        setCurrentStep(target);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("onboarding_step", String(target));
        }
        return;
      }
      if (stepId === "website_reading") {
        if (selectedOnlinePresence === "marketplace" || selectedOnlinePresence === "marketplace_seller") {
          const webIdx = activeSteps.findIndex((s) => s.id === "marketplace_website");
          const target = webIdx !== -1 ? webIdx : 4;
          setCurrentStep(target);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("onboarding_step", String(target));
          }
          return;
        }
        if (selectedOnlinePresence === "b2b" || selectedOnlinePresence === "wholesale_b2b") {
          const webIdx = activeSteps.findIndex((s) => s.id === "b2b_website");
          const target = webIdx !== -1 ? webIdx : 4;
          setCurrentStep(target);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("onboarding_step", String(target));
          }
          return;
        }
        const urlIdx = activeSteps.findIndex((s) => s.id === "website_url");
        const target = urlIdx !== -1 ? urlIdx : 2;
        setCurrentStep(target);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("onboarding_step", String(target));
        }
        return;
      }
      if (stepId === "website_url") {
        const presenceIdx = activeSteps.findIndex((s) => s.id === "presence");
        const target = presenceIdx !== -1 ? presenceIdx : 1;
        setCurrentStep(target);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("onboarding_step", String(target));
        }
        return;
      }
    }
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(prevStep));
      }
    }
  };

  // Submit onboarding payload to backend APIs
  const submitOnboarding = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const pendingStr = typeof window !== "undefined" ? sessionStorage.getItem("pending_signup") : null;
      const pending = pendingStr ? JSON.parse(pendingStr) : null;

      if (accountType === "user") {
        // ─── USER ONBOARDING: Send ONLY user profile fields ───
        // Business fields are intentionally NOT sent so they remain null in DB
        const userPayload = {
          accountType: "user",
          role: "user",
          fullName: userProfile.fullName.trim(),
          name: userProfile.fullName.trim(),
          firstName: userProfile.firstName.trim() || userProfile.fullName.split(" ")[0],
          lastName: userProfile.lastName.trim() || userProfile.fullName.split(" ").slice(1).join(" "),
          phone: userProfile.phone.trim() || null,
          contactNumber: userProfile.phone.trim() || null,
          contact_phone: userProfile.phone.trim() || null,
          preferredLanguage: userProfile.preferredLanguage,
          profileImageUrl: userProfile.profileImageUrl || null,
          onboardingCompleted: true,
          onboarding_step: 3,
        };

        if (pending) {
          // Deferred MongoDB account creation: user was not in MongoDB until now!
          const signupPayload = {
            ...userPayload,
            name: userProfile.fullName.trim() || pending.name || pending.fullName,
            fullName: userProfile.fullName.trim() || pending.fullName || pending.name,
            firstName: userProfile.firstName.trim() || pending.firstName || userProfile.fullName.split(" ")[0],
            lastName: userProfile.lastName.trim() || pending.lastName || "",
            email: pending.email,
            password: pending.password,
            confirmPassword: pending.confirmPassword || pending.password,
            phone: userProfile.phone.trim() || pending.phone || pending.contactNumber || null,
            contactNumber: userProfile.phone.trim() || pending.contactNumber || pending.phone || null,
            otp: pending.otp,
            accountType: "user",
          };
          const res = await authService.signup(signupPayload);
          if (res.token && res.user) {
            localStorage.setItem("access_token", res.token);
            localStorage.setItem("user", JSON.stringify(res.user));
            login(res.token, res.user);
          }
          sessionStorage.removeItem("pending_signup");
          try {
            await userService.updateMe(userPayload);
          } catch (_) {}
        } else {
          // Existing session (e.g. Google OAuth user)
          await userService.updateMe(userPayload);
        }

        // Update Onboarding Progress API
        try {
          await OnboardingService.updateProgress({
            onboarding_step: 3,
            social_connection_completed: true,
            business_profile_completed: true,
            completed: true,
            onboarding_completed: true,
            onboardingCompleted: true,
            is_completed: true,
            onboarding_completed_at: new Date().toISOString(),
          });
        } catch (_) {}

        // Advance to Ready step
        setCurrentStep(activeSteps.length - 1);
      } else if (accountType === "influencer") {
        // ─── INFLUENCER / CREATOR ONBOARDING ───
        const influencerPayload = {
          accountType: "influencer",
          role: "influencer",
          fullName: influencerProfile.fullName.trim() || userProfile.fullName.trim(),
          name: influencerProfile.fullName.trim() || userProfile.fullName.trim(),
          username: (influencerProfile.username.trim() || (influencerProfile.fullName.trim() || "creator").toLowerCase().replace(/\s+/g, "_")).replace(/^@/, ""),
          bio: influencerProfile.bio.trim() || undefined,
          category: influencerProfile.category,
          niche: influencerProfile.category,
          city: influencerProfile.city.trim() || undefined,
          state: influencerProfile.state.trim() || undefined,
          location: influencerProfile.location.trim() || (influencerProfile.city ? `${influencerProfile.city}, ${influencerProfile.state}`.replace(/^,\s*|,\s*$/g, "") : "India"),
          phone: influencerProfile.phone.trim() || userProfile.phone.trim() || null,
          contactNumber: influencerProfile.phone.trim() || userProfile.phone.trim() || null,
          contact_phone: influencerProfile.phone.trim() || userProfile.phone.trim() || null,
          preferredLanguage: influencerProfile.preferredLanguage || "hinglish",
          instagram_url: influencerProfile.instagram_url.trim() || undefined,
          youtube_url: influencerProfile.youtube_url.trim() || undefined,
          follower_count: Number(influencerProfile.follower_count) || 50000,
          engagement_rate: Number(influencerProfile.engagement_rate) || 4.8,
          expectedPricePerPost: Number(influencerProfile.expectedPricePerPost) || 5000,
          onboardingCompleted: true,
          onboarding_step: 3,
        };

        if (pending) {
          const signupPayload = {
            ...influencerPayload,
            name: influencerPayload.name,
            fullName: influencerPayload.fullName,
            firstName: influencerPayload.name.split(" ")[0] || pending.firstName,
            lastName: influencerPayload.name.split(" ").slice(1).join(" ") || pending.lastName || "",
            email: pending.email,
            password: pending.password,
            confirmPassword: pending.confirmPassword || pending.password,
            phone: influencerPayload.phone || pending.phone || pending.contactNumber || null,
            contactNumber: influencerPayload.contactNumber || pending.contactNumber || pending.phone || null,
            otp: pending.otp,
            accountType: "influencer",
            role: "influencer",
          };
          const res = await authService.signup(signupPayload);
          if (res.token && res.user) {
            const finalInfUser = { ...res.user, role: "influencer", accountType: "influencer" };
            localStorage.setItem("access_token", res.token);
            localStorage.setItem("user", JSON.stringify(finalInfUser));
            login(res.token, finalInfUser);
          }
          sessionStorage.removeItem("pending_signup");
          try {
            await userService.updateMe(influencerPayload);
          } catch (_) {}
        } else {
          await userService.updateMe(influencerPayload);
        }

        // Update Influencer Profile in /api/v1/influencers/me
        try {
          await influencerService.updateMyProfile({
            fullName: influencerPayload.fullName,
            username: influencerPayload.username,
            bio: influencerPayload.bio,
            category: influencerPayload.category,
            location: influencerPayload.location,
            phone: influencerPayload.phone || undefined,
            instagram_url: influencerPayload.instagram_url,
            youtube_url: influencerPayload.youtube_url,
            follower_count: influencerPayload.follower_count,
            engagement_rate: influencerPayload.engagement_rate,
            expectedPricePerPost: influencerPayload.expectedPricePerPost,
            preferredLanguage: influencerPayload.preferredLanguage,
          });
        } catch (infErr) {
          console.warn("Influencer profile update warning:", infErr);
        }

        // Update Onboarding Progress API
        try {
          await OnboardingService.updateProgress({
            onboarding_step: 3,
            completed: true,
            onboarding_completed: true,
            onboardingCompleted: true,
            is_completed: true,
            onboarding_completed_at: new Date().toISOString(),
          });
        } catch (_) {}

        // Advance to Ready step
        setCurrentStep(activeSteps.length - 1);
      } else {
        const finalSelectedPhotos = selectedOnlinePresence === "google_maps"
          ? (selectedMapsPhotos.length > 0 ? selectedMapsPhotos : selectedPhotos)
          : selectedPhotos;

        const finalMarketplaces = selectedMarketplaces.map((m) =>
          m === "other" && customMarketplaceName.trim() ? customMarketplaceName.trim() : m
        );
        const finalListings = selectedListings
          .filter((l) => l !== "none_of_these")
          .map((l) => (l === "other" && customListingName.trim() ? customListingName.trim() : l));

        const finalB2bPlatforms = selectedB2bPlatforms.map((p) =>
          p === "other" && customB2bPlatformName.trim() ? customB2bPlatformName.trim() : p
        );
        const finalB2bListings = selectedB2bListings
          .filter((l) => l !== "none_of_these")
          .map((l) => (l === "other" && customB2bListingName.trim() ? customB2bListingName.trim() : l));

        const deduplicatedB2bPlatforms = Array.from(new Set([...finalB2bPlatforms, ...finalB2bListings]));

        const finalCategory = selectedOnlinePresence === "google_maps"
          ? mapsCategory
          : selectedOnlinePresence === "none"
            ? (noneCategory || businessProfile.business_category)
            : businessProfile.business_category;

        const finalDescription = selectedOnlinePresence === "none"
          ? (noneDescription || businessProfile.business_description.trim() || null)
          : (mapsPromotion || businessProfile.business_description.trim() || null);

        const finalSubCategory = selectedOnlinePresence === "none"
          ? (noneSubCategory || businessDetails.sub_category)
          : (mapsSubCategory || businessDetails.sub_category);

        const finalDifferentiators = selectedOnlinePresence === "none"
          ? (noneDifferentiator ? [noneDifferentiator] : businessDetails.differentiators)
          : (mapsDifferentiator ? [mapsDifferentiator] : businessDetails.differentiators);

        const finalProducts = selectedOnlinePresence === "none"
          ? (noneProducts ? [noneProducts] : businessDetails.products_services)
          : (mapsPromotion ? [mapsPromotion] : businessDetails.products_services);

        const finalAudience = selectedOnlinePresence === "none"
          ? (noneAudience || businessDetails.target_audience)
          : (mapsAudience || businessDetails.target_audience);

        const finalLogo = logoPreview || mapsLogoUrl || businessProfile.business_logo || null;

        const businessPayload = {
          accountType: "business",
          role: "business",
          business_name: businessProfile.business_name.trim(),
          business_type: businessProfile.business_type,
          business_category: finalCategory,
          business_description: finalDescription,
          business_logo: finalLogo,
          brand_color: brandPreferences.palette[0] || businessProfile.brand_color || null,
          website: businessProfile.website || websiteUrl || mapsWebsiteUrl || null,
          website_url: businessProfile.website || websiteUrl || mapsWebsiteUrl || null,
          registration_number: businessProfile.registration_number.trim() || null,
          year_established: businessProfile.year_established.trim() || null,
          country: businessProfile.country || "India",
          state: businessProfile.state.trim() || null,
          city: businessProfile.city.trim() || null,
          area: businessProfile.area.trim() || null,
          pincode: businessProfile.pincode.trim() || null,
          full_address: businessProfile.full_address.trim() || null,
          google_maps_url: selectedMapsPlace?.googleMapsUrl || businessProfile.google_maps_url.trim() || null,
          business_model: businessProfile.business_model || null,
          selling_model: businessProfile.selling_model || null,
          target_age_group: businessProfile.target_age_group || [],
          target_gender: businessProfile.target_gender || "All",
          target_location: finalAudience || businessProfile.target_location || null,
          customer_type: businessProfile.customer_type || null,
          phone: businessProfile.phone.trim() || null,
          contactNumber: businessProfile.phone.trim() || null,
          contact_phone: businessProfile.phone.trim() || null,
          preferredLanguage: businessProfile.preferredLanguage || "hinglish",
          palette: brandPreferences.palette,
          brand_colors: brandPreferences.palette,
          font: selectedFont,
          tones: brandPreferences.tones,
          business_types: selectedOnlinePresence === "google_maps" ? ["Physical Location", "Product-based"] : businessDetails.business_types,
          primary_business_type: selectedOnlinePresence === "google_maps" ? "Physical Location" : businessDetails.primary_business_type,
          sub_category: finalSubCategory,
          differentiators: finalDifferentiators,
          products_services: finalProducts,
          selected_photos: finalSelectedPhotos,
          target_audience_summary: finalAudience,
          services_products_summary: finalProducts,
          tagline: businessDetails.tagline,
          marketplaces: (selectedOnlinePresence === "marketplace" || selectedOnlinePresence === "marketplace_seller") ? finalMarketplaces : undefined,
          marketplace_listings: (selectedOnlinePresence === "marketplace" || selectedOnlinePresence === "marketplace_seller") ? finalListings : undefined,
          b2b_platforms: (selectedOnlinePresence === "b2b" || selectedOnlinePresence === "wholesale_b2b") ? deduplicatedB2bPlatforms : undefined,
          b2b_listings: (selectedOnlinePresence === "b2b" || selectedOnlinePresence === "wholesale_b2b") ? finalB2bListings : undefined,
          selected_services: selectedServices,
          business_services: selectedServices,
          onboardingCompleted: true,
          onboarding_step: activeSteps.length - 1,
        };

        if (pending) {
          // Deferred MongoDB account creation with all business data:
          const signupPayload = {
            name: businessProfile.business_name.trim(),
            fullName: pending.fullName || businessProfile.business_name.trim(),
            firstName: pending.firstName || businessProfile.business_name.split(" ")[0],
            lastName: pending.lastName || "",
            email: pending.email,
            password: pending.password,
            confirmPassword: pending.confirmPassword || pending.password,
            phone: businessProfile.phone.trim() || pending.phone || pending.contactNumber || null,
            contactNumber: businessProfile.phone.trim() || pending.contactNumber || pending.phone || null,
            otp: pending.otp,
            accountType: "business",
          };
          const res = await authService.signup(signupPayload);
          if (res.token && res.user) {
            localStorage.setItem("access_token", res.token);
            localStorage.setItem("user", JSON.stringify(res.user));
            login(res.token, res.user);
          }
          sessionStorage.removeItem("pending_signup");
          try {
            await userService.updateMe({
              ...businessPayload,
              onboardingData: businessPayload,
            });
          } catch (_) {}
        } else {
          // Existing session (e.g. Google OAuth user)
          await userService.updateMe({
            ...businessPayload,
            onboardingData: businessPayload,
          });
        }

        // Create/Update record in Business Collection
        try {
          await businessService.createBusiness({
            businessName: businessProfile.business_name.trim(),
            name: businessProfile.business_name.trim(),
            businessType: businessProfile.business_type,
            category: finalCategory,
            industry: finalCategory,
            location: `${businessProfile.city}, ${businessProfile.state}`.replace(/^,\s*|,\s*$/g, "") || "India",
            description: finalDescription || undefined,
            website: businessProfile.website || websiteUrl || undefined,
            contact_phone: businessProfile.phone || undefined,
            preferred_language: businessProfile.preferredLanguage || "hinglish",
            preferredLanguage: businessProfile.preferredLanguage || "hinglish",
            targetAudience: finalAudience || "Local",
            selectedServices: selectedServices,
          });
        } catch (_) {
          try {
            await businessService.updateBusiness({
              name: businessProfile.business_name.trim(),
              category: finalCategory,
              location: `${businessProfile.city}, ${businessProfile.state}`.replace(/^,\s*|,\s*$/g, "") || "India",
              description: finalDescription || undefined,
              contact_phone: businessProfile.phone || undefined,
            });
          } catch (_) {}
        }

        // Create/Update BrandKit in Brand Collection
        try {
          await updateBrandKit({
            business_name: businessProfile.business_name.trim(),
            business_category: finalCategory,
            tagline: businessDetails.tagline,
            brand_colors: brandPreferences.palette,
            palette: brandPreferences.palette,
            primary_color: brandPreferences.palette[0] || businessProfile.brand_color || "#fc9a5d",
            secondary_color: brandPreferences.palette[1] || "#f0449b",
            accent_color: brandPreferences.palette[2] || "#be32ff",
            font: selectedFont,
            tones: brandPreferences.tones,
            tone: brandPreferences.tones.join(", "),
            language: brandPreferences.language,
            business_types: businessDetails.business_types,
            primary_business_type: businessDetails.primary_business_type,
            sub_category: finalSubCategory,
            city: businessProfile.city || businessDetails.city,
            differentiators: finalDifferentiators,
            products_services: finalProducts,
            selected_photos: selectedPhotos,
            target_audience_summary: finalAudience,
            services_products_summary: finalProducts,
            website: businessProfile.website || websiteUrl,
            logo_url: finalLogo || undefined,
            marketplaces: (selectedOnlinePresence === "marketplace" || selectedOnlinePresence === "marketplace_seller") ? finalMarketplaces : undefined,
            marketplace_listings: (selectedOnlinePresence === "marketplace" || selectedOnlinePresence === "marketplace_seller") ? finalListings : undefined,
            b2b_platforms: (selectedOnlinePresence === "b2b" || selectedOnlinePresence === "wholesale_b2b") ? deduplicatedB2bPlatforms : undefined,
            b2b_listings: (selectedOnlinePresence === "b2b" || selectedOnlinePresence === "wholesale_b2b") ? finalB2bListings : undefined,
          });
        } catch (_) {}

        // Update Onboarding Progress API
        try {
          await OnboardingService.updateProgress({
            onboarding_step: 6,
            business_profile_completed: true,
            completed: true,
            onboarding_completed: true,
            onboardingCompleted: true,
            is_completed: true,
            onboarding_completed_at: new Date().toISOString(),
          });
          await OnboardingService.completeOnboarding();
        } catch (_) {}

        if (typeof window !== "undefined") {
          sessionStorage.removeItem("onboarding_step");
        }

        // Advance to Ready step
        setCurrentStep(activeSteps.length - 1);
      }
    } catch (err: any) {
      console.error("Onboarding submission failed:", err);
      setError(err.message || "Failed to save profile. Please check the information and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle interest pill
  const toggleInterest = (item: string) => {
    setUserProfile((prev) => {
      const exists = prev.interests.includes(item);
      return {
        ...prev,
        interests: exists ? prev.interests.filter((i) => i !== item) : [...prev.interests, item],
      };
    });
  };

  // Toggle target age group pill
  const toggleAgeGroup = (age: string) => {
    setBusinessProfile((prev) => {
      const exists = prev.target_age_group.includes(age);
      return {
        ...prev,
        target_age_group: exists
          ? prev.target_age_group.filter((a) => a !== age)
          : [...prev.target_age_group, age],
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#070F22] text-[#ededf2] flex flex-col justify-between py-4 sm:py-6 px-4 sm:px-6 relative overflow-x-clip selection:bg-[#be32ff]/30">
      {/* Background ambient lighting matching DhandaGrow dark navy & gradient accent theme */}
      <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-gradient-to-br from-[#fc9a5d]/20 via-[#f0449b]/15 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[32rem] h-[32rem] bg-gradient-to-bl from-[#be32ff]/20 via-[#7d36fa]/10 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/4 w-[30rem] h-[30rem] bg-gradient-to-tr from-[#f0449b]/15 via-[#be32ff]/10 to-transparent rounded-full blur-[150px] pointer-events-none" />

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 1: GET STARTED (Designer Screenshot 1)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "get_started" && (
        <div className="w-full max-w-md mx-auto my-auto py-2 flex flex-col justify-between min-h-[480px] sm:min-h-[540px] animate-in fade-in duration-400 relative z-10 px-2 sm:px-4">
          {/* Top Header / Brand Logo */}
          <div className="flex flex-col items-center justify-center pt-2">
            <div className="flex items-center gap-2">
              <img
                src="/images/logo-icon.png"
                alt="DhandaGrow"
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-[0_0_12px_rgba(240,68,155,0.4)]"
              />
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Dhanda<span className="text-[#fc9a5d]">Grow</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#be32ff]/25 text-[#be32ff] border border-[#be32ff]/40">
                  AI ✦
                </span>
              </div>
            </div>
            <p className="text-[11px] sm:text-xs text-neutral-400 font-medium tracking-wide mt-1">
              India&apos;s AI Business Growth App
            </p>
          </div>

          {/* Heading & Subtext */}
          <div className="text-center space-y-2.5 px-2 mt-4 sm:mt-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Your Business<br />
              Deserve to{" "}
              <span className="bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] bg-clip-text text-transparent">
                Grow
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xs sm:max-w-sm mx-auto leading-relaxed font-normal">
              Create, market, publish and sell - all with the power of AI.
            </p>
          </div>

          {/* 3D Storefront Illustration */}
          <div className="relative my-4 sm:my-6 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-[#fc9a5d]/10 via-[#f0449b]/15 to-[#be32ff]/10 blur-2xl rounded-full transform scale-90 -z-0" />
            <img
              src="/images/onboarding-storefront.png"
              alt="DhandaGrow Business Storefront"
              className="w-full max-w-[320px] sm:max-w-[370px] h-auto object-contain relative z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] select-none pointer-events-none"
            />
          </div>

          {/* Get Started Button */}
          <div className="pt-2 sm:pt-4 pb-2">
            <button
              type="button"
              onClick={handleGetStarted}
              disabled={isSavingGetStarted}
              className="w-full h-13 sm:h-14 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] hover:brightness-110 active:scale-[0.98] text-white font-bold text-base flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(236,72,153,0.4)] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSavingGetStarted ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 2: CHOOSE YOUR BUSINESS SERVICES (New Screen)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "business_services" && (
        <div className="w-full max-w-md sm:max-w-lg mx-auto py-2 flex flex-col justify-between min-h-[520px] sm:min-h-[580px] animate-in fade-in duration-400 relative z-10 px-2 sm:px-4">
          <div>
            {/* Top Bar: Back button, Brand Logo, and spacer */}
            <div className="flex items-center justify-between w-full mb-2">
              <button
                type="button"
                onClick={handleServicesBack}
                aria-label="Go back"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Dhanda<span className="text-[#fc9a5d]">Grow</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#be32ff]/25 text-[#be32ff] border border-[#be32ff]/40">
                  AI ✦
                </span>
              </div>
              <div className="w-10" />
            </div>

            {/* Step 3 of 5 Progress Bar */}
            <div className="w-full mt-3 mb-2">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-neutral-400 font-medium">Step 3 of 5</span>
                <span className="text-[#be32ff] font-bold">60%</span>
              </div>
              <div className="w-full h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "60%" }}
                />
              </div>
            </div>

            {/* Title & Subtitle Area */}
            <div className="mt-4 mb-3">
              <span className="text-[10px] sm:text-[11px] font-bold text-neutral-400 tracking-wider uppercase block">
                LET&apos;S SET UP YOUR BUSINESS
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mt-1">
                Choose Your<br />
                <span className="bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] bg-clip-text text-transparent">
                  Business Services
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-300 mt-1 font-normal">
                Select the tool you want to use for your business
              </p>
            </div>

            {/* 7 Selectable Services Cards (2-Column Grid) */}
            <div className="grid grid-cols-2 gap-3 sm:gap-3.5 my-3">
              {BUSINESS_SERVICES_OPTIONS.map((srv) => {
                const isSelected = selectedServices.includes(srv.id);
                const IconComp = srv.icon;
                return (
                  <div
                    key={srv.id}
                    id={`service-card-${srv.id}`}
                    onClick={() => handleToggleService(srv.id)}
                    className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[148px] sm:min-h-[160px] relative select-none ${
                      isSelected
                        ? "bg-[#F5F3FF] dark:bg-gradient-to-br dark:from-[#201735]/95 dark:to-[#281b3d]/95 border-2 border-[#BE32FF] shadow-[0_0_25px_rgba(190,50,255,0.3)] ring-1 ring-[#BE32FF]/50"
                        : "bg-white/95 dark:bg-[#131728]/85 border-slate-200/90 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-sm"
                    }`}
                  >
                    {/* Top row: Icon at left, Selection indicator circle at right */}
                    <div className="flex items-start justify-between w-full mb-2.5">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${srv.iconBg}`}>
                        <IconComp className={`w-5 h-5 ${srv.iconColor}`} />
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full transition-all flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? "border-[3.5px] border-[#BE32FF] bg-white dark:bg-[#201735]"
                            : "border-2 border-slate-300 dark:border-white/30 bg-transparent"
                        }`}
                      />
                    </div>

                    {/* Bottom text: Title & Description */}
                    <div className="flex-1 flex flex-col justify-end">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                        {srv.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-neutral-400 mt-1 leading-snug font-normal line-clamp-2">
                        {srv.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Validation Message & Bottom Sticky Continue Button */}
          <div className="sticky bottom-0 pt-3 pb-2 bg-gradient-to-t from-[#070F22] via-[#070F22]/95 to-transparent mt-2 z-20">
            {servicesError && (
              <div className="mb-2.5 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-center flex items-center justify-center gap-1.5 animate-in fade-in">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{servicesError}</span>
              </div>
            )}
            <button
              type="button"
              id="services-continue-btn"
              onClick={handleServicesContinue}
              disabled={isSavingServices || selectedServices.length === 0}
              className={`w-full h-13 sm:h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedServices.length > 0 && !isSavingServices
                  ? "bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:brightness-110 active:scale-[0.98] text-white shadow-[0_8px_30px_rgba(240,68,155,0.4)]"
                  : "bg-white/10 text-neutral-500 cursor-not-allowed border border-white/5 opacity-60"
              }`}
            >
              {isSavingServices ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 3: WHERE DOES YOUR BUSINESS LIVE ONLINE? (Designer Screenshot 2)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "presence" && (
        <div className="w-full max-w-md mx-auto my-auto py-2 flex flex-col justify-between min-h-[480px] sm:min-h-[540px] animate-in fade-in duration-400 relative z-10 px-2 sm:px-4">
          <div>
            {/* Top Header: Back button + Brand + Progress Indicator */}
            <div className="flex items-center gap-3 w-full mb-3">
              <button
                type="button"
                onClick={handlePresenceBack}
                aria-label="Go back"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black text-white tracking-tight">
                    Dhanda<span className="text-[#fc9a5d]">Grow</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#be32ff]/25 text-[#be32ff] border border-[#be32ff]/40">
                    AI ✦
                  </span>
                </div>
              </div>
              <div className="w-10" />
            </div>

            {/* Step 4 of 5 Progress */}
            <div className="w-full mb-5">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-neutral-400 font-medium">Step 4 of 5</span>
                <span className="text-[#be32ff] font-bold">80%</span>
              </div>
              <div className="w-full h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "80%" }}
                />
              </div>
            </div>

            {/* Screen 2 Heading */}
            <div className="mb-5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Where does your<br />
                <span className="bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] bg-clip-text text-transparent">
                  business
                </span>{" "}
                live Online?
              </h1>
            </div>

            {/* 5 Selectable Cards */}
            <div className="space-y-3">
              {ONLINE_PRESENCE_OPTIONS.map((opt) => {
                const isSelected =
                  selectedOnlinePresence === opt.id ||
                  (opt.id === "marketplace" && selectedOnlinePresence === "marketplace_seller") ||
                  (opt.id === "b2b" && selectedOnlinePresence === "wholesale_b2b") ||
                  (opt.id === "none" && selectedOnlinePresence === "no_online_presence");
                const IconComp = opt.icon;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectPresence(opt.id)}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer relative overflow-hidden flex items-start gap-3.5 ${
                      isSelected
                        ? "bg-gradient-to-r from-[#201735]/95 via-[#18192e]/95 to-[#1e152e]/95 border-2 border-[#BE32FF] shadow-[0_0_25px_rgba(190,50,255,0.3)] ring-1 ring-[#BE32FF]/50"
                        : "bg-[#131728]/75 border-white/10 hover:border-white/20 hover:bg-[#181d33]/85"
                    }`}
                  >
                    <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <IconComp className={`w-5 h-5 ${opt.iconColor}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                          {opt.title}
                        </h3>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#fc9a5d] to-[#be32ff] flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-white stroke-[3]" />
                          </div>
                        )}
                      </div>

                      {opt.desc && (
                        <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed font-light">
                          {opt.desc}
                        </p>
                      )}

                      {opt.logos && (
                        <div className="mt-2 flex items-center">
                          <img
                            src={opt.logos}
                            alt={opt.logosAlt}
                            className="h-6 sm:h-7 w-auto object-contain select-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* None of these - something else */}
            <div className="text-center pt-3 pb-1">
              <button
                type="button"
                onClick={() => handleSelectPresence("other")}
                className={`text-xs sm:text-sm transition-all cursor-pointer ${
                  selectedOnlinePresence === "other" || selectedOnlinePresence === "something_else"
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-[#fc9a5d] to-[#be32ff] font-bold underline underline-offset-4"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                None of these - something else
              </button>
            </div>

            {/* Error Notice */}
            {error && (
              <div className="mt-3 p-3 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 animate-in fade-in">
                <span className="font-semibold text-red-400">Notice:</span> {error}
              </div>
            )}
          </div>

          {/* Continue Button */}
          <div className="pt-4 pb-2">
            <button
              type="button"
              onClick={handlePresenceContinue}
              disabled={!selectedOnlinePresence || isSavingPresence}
              className={`w-full h-13 sm:h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all duration-200 ${
                selectedOnlinePresence && !isSavingPresence
                  ? "bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] text-white shadow-[0_8px_30px_rgba(236,72,153,0.4)] hover:brightness-110 active:scale-[0.98] cursor-pointer"
                  : "bg-white/10 text-white/40 cursor-not-allowed pointer-events-none opacity-60"
              }`}
            >
              {isSavingPresence ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>


          </div>
        </div>
      )}

      {/* Hidden global SVG defs for social gradients */}
      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <defs>
          <radialGradient id="ig-grad-social" cx="30%" cy="107%" r="150%">
            <stop offset="0%" stopColor="#fdf497" />
            <stop offset="5%" stopColor="#fdf497" />
            <stop offset="45%" stopColor="#fd5949" />
            <stop offset="60%" stopColor="#d6249f" />
            <stop offset="90%" stopColor="#285AEB" />
          </radialGradient>
        </defs>
      </svg>

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN: SOCIAL MEDIA ONLY (social_platforms)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "social_platforms" && (
        <div className="w-full max-w-md mx-auto my-auto py-2 flex flex-col justify-between min-h-[500px] sm:min-h-[560px] animate-in fade-in duration-400 relative z-10 px-3 sm:px-4">
          <div>
            {/* Top Header: Back button + Progress bar (~35%) */}
            <div className="flex items-center gap-3 w-full mb-4">
              <button
                type="button"
                onClick={handleSocialPlatformsBack}
                aria-label="Go back"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "35%" }}
                />
              </div>
            </div>

            {/* Heading */}
            <div className="mb-4">
              <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase block mb-1">
                SOCIAL MEDIA PRESENCE
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Where is your business active on{" "}
                <span className="bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] bg-clip-text text-transparent">
                  Social Media?
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1.5 leading-relaxed">
                Select your active channels and enter your handle so AI can tailor content to your brand.
              </p>
            </div>

            {/* Platform Selection Chips / Grid */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-neutral-300 block mb-2">
                1. Select your active platforms:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {SOCIAL_PLATFORM_OPTIONS.map((plat) => {
                  const isSelected = selectedSocialPlatforms.includes(plat.id);
                  return (
                    <button
                      key={plat.id}
                      type="button"
                      onClick={() => handleToggleSocialPlatform(plat.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center gap-2.5 relative select-none ${
                        isSelected
                          ? "bg-gradient-to-r from-[#201735]/95 to-[#281b3d]/95 border-[#BE32FF] shadow-[0_0_15px_rgba(190,50,255,0.25)] ring-1 ring-[#BE32FF]/50"
                          : "bg-white/[0.04] border-white/10 hover:border-white/20 hover:bg-white/[0.08]"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 overflow-hidden shadow-sm bg-black/40">
                        {plat.renderIcon("w-4 h-4")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">
                          {plat.name}
                        </p>
                        <span className="text-[10px] text-neutral-400 truncate block">
                          {isSelected ? "Selected" : "Tap to add"}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#fc9a5d] to-[#be32ff] flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Usernames / Handles Input Section */}
            {selectedSocialPlatforms.length > 0 && (
              <div className="space-y-3 mb-4 rounded-2xl border border-white/15 bg-white/[0.03] p-3.5 backdrop-blur-md animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-200">
                    2. Enter your usernames / links:
                  </label>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {selectedSocialPlatforms.length} platform{selectedSocialPlatforms.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1">
                  {selectedSocialPlatforms.map((platId) => {
                    const plat = SOCIAL_PLATFORM_OPTIONS.find((p) => p.id === platId);
                    if (!plat) return null;
                    return (
                      <div key={platId} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-neutral-300 font-medium flex items-center gap-1.5">
                            {plat.renderIcon("w-3.5 h-3.5")} {plat.name}
                          </span>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {plat.helperText}
                          </span>
                        </div>
                        <div className="relative flex items-center">
                          <div className="absolute left-3 text-xs font-bold text-neutral-500 select-none">
                            {plat.handlePrefix}
                          </div>
                          <Input
                            type="text"
                            value={socialHandles[platId] || ""}
                            onChange={(e) => handleSocialHandleChange(platId, e.target.value)}
                            placeholder={plat.placeholder}
                            className={`h-10 bg-black/40 border-white/10 text-white placeholder:text-neutral-600 text-xs rounded-xl focus:border-[#be32ff] ${
                              plat.handlePrefix.length > 2 ? "pl-16" : "pl-8"
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Optional Business Name confirmation */}
            <div className="mb-3">
              <label className="text-xs font-medium text-neutral-400 block mb-1">
                Business / Brand Name (Optional)
              </label>
              <Input
                type="text"
                value={businessProfile.business_name}
                onChange={(e) => {
                  setBusinessProfile({ ...businessProfile, business_name: e.target.value });
                  setBusinessDetails({ ...businessDetails, business_name: e.target.value });
                }}
                placeholder="e.g. My Brand / Store Name"
                className="h-10 bg-black/30 border-white/10 text-white placeholder:text-neutral-500 text-xs rounded-xl focus:border-[#be32ff]"
              />
            </div>

            {/* Validation notice */}
            {error && (
              <div className="mb-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 pb-2 space-y-2">
            <button
              type="button"
              onClick={handleSocialPlatformsContinue}
              disabled={isSavingSocialPlatforms}
              className="w-full h-13 sm:h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:brightness-110 active:scale-[0.98] text-white shadow-[0_8px_30px_rgba(240,68,155,0.4)]"
            >
              {isSavingSocialPlatforms ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving profiles...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>

            <div className="pt-3 text-center flex flex-col items-center gap-2">
              <p className="text-xs sm:text-sm text-neutral-400">
                Don&apos;t have a website yet?{" "}
                <button
                  type="button"
                  onClick={() => handleCreateWebsite("social_media")}
                  className="font-bold text-[#f0449b] hover:text-[#ff65b3] transition-colors cursor-pointer hover:underline"
                >
                  Create Website
                </button>
              </p>

              <button
                type="button"
                onClick={handleSkipSocialPlatforms}
                className="text-center text-xs text-neutral-400 hover:text-white transition-colors py-1 px-3 font-medium cursor-pointer"
              >
                Skip handles for now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 3: WHAT'S YOUR WEBSITE? (Reference Screen 1)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "website_url" && (
        <div className="w-full max-w-md mx-auto my-auto py-2 flex flex-col justify-between min-h-[480px] sm:min-h-[540px] animate-in fade-in duration-400 relative z-10 px-2 sm:px-4">
          <div>
            {/* Top Header: Back button + Progress bar (~38%) */}
            <div className="flex items-center gap-3 w-full mb-6">
              <button
                type="button"
                onClick={handleWebsiteUrlBack}
                aria-label="Go back"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "38%" }}
                />
              </div>
            </div>

            {/* Heading */}
            <div className="mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                What&apos;s your{" "}
                <span className="bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] bg-clip-text text-transparent">
                  website?
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1.5 leading-relaxed">
                We&apos;ll read it for you, so there&apos;s no need to type anything.
              </p>
            </div>

            {/* Website URL Input Card matching designer reference (no video player) */}
            <div className="mt-8">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#131728]/75 border border-white/10 focus-within:border-[#BE32FF] focus-within:shadow-[0_0_25px_rgba(190,50,255,0.3)] focus-within:ring-1 focus-within:ring-[#BE32FF]/50 transition-all flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-neutral-300">
                  <Link2 className="w-5 h-5 -rotate-45 text-neutral-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    id="website-url-input"
                    value={websiteUrl}
                    onChange={(e) => {
                      setWebsiteUrl(e.target.value);
                      setError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && isValidWebsiteUrl(websiteUrl)) {
                        handleWebsiteUrlContinue();
                      }
                    }}
                    placeholder="yourwebsite.com"
                    className="w-full bg-transparent border-none text-white text-sm sm:text-base placeholder:text-neutral-500 focus:outline-none tracking-normal font-medium"
                    autoFocus
                  />
                </div>
                {websiteUrl && (
                  <button
                    type="button"
                    onClick={() => setWebsiteUrl("")}
                    className="text-neutral-500 hover:text-white transition-colors p-1"
                    aria-label="Clear input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Validation helper */}
              {websiteUrl && !isValidWebsiteUrl(websiteUrl) && (
                <p className="text-[11px] text-[#f0449b] mt-2 px-1 font-medium flex items-center gap-1.5">
                  <span>Please enter a valid website address (e.g. yourbrand.com)</span>
                </p>
              )}

              {/* Helpful context */}
              <div className="mt-5 p-3.5 rounded-2xl bg-[#be32ff]/10 border border-[#be32ff]/20 text-xs text-neutral-300 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#be32ff] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Our AI scans your products, brand colors, voice, and category automatically from your URL.
                </span>
              </div>
            </div>

            {/* Error Notice */}
            {error && (
              <div className="mt-4 p-3 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 animate-in fade-in">
                <span className="font-semibold text-red-400">Notice:</span> {error}
              </div>
            )}
          </div>

          {/* Continue Button */}
          <div className="pt-4 pb-2">
            <button
              type="button"
              id="website-continue-btn"
              onClick={handleWebsiteUrlContinue}
              disabled={!isValidWebsiteUrl(websiteUrl) || isSavingWebsite}
              className={`w-full h-13 sm:h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all duration-200 ${
                isValidWebsiteUrl(websiteUrl) && !isSavingWebsite
                  ? "bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] text-white shadow-[0_8px_30px_rgba(236,72,153,0.4)] hover:brightness-110 active:scale-[0.98] cursor-pointer"
                  : "bg-white/10 text-white/40 cursor-not-allowed pointer-events-none opacity-60"
              }`}
            >
              {isSavingWebsite ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Scanning & Saving...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>

            <div className="pt-3 text-center">
              <p className="text-xs sm:text-sm text-neutral-400">
                Don&apos;t have a website yet?{" "}
                <button
                  type="button"
                  onClick={() => handleCreateWebsite("website")}
                  className="font-bold text-[#f0449b] hover:text-[#ff65b3] transition-colors cursor-pointer hover:underline"
                >
                  Create Website
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 4: READING YOUR WEBSITE (Reference Screen 2)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "website_reading" && (
        <div className="w-full max-w-md mx-auto my-auto py-2 flex flex-col justify-between min-h-[480px] sm:min-h-[540px] animate-in fade-in duration-400 relative z-10 px-2 sm:px-4">
          <div>
            {/* Top Header: Back button + Centered Website URL Pill */}
            <div className="relative flex items-center justify-center w-full mb-4">
              <button
                type="button"
                onClick={handleWebsiteReadingBack}
                aria-label="Go back"
                className="absolute left-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>

              {/* Website URL Pill Badge matching screenshot */}
              <div className="px-4 py-1.5 rounded-full bg-[#201735]/90 border border-[#be32ff]/40 text-xs sm:text-sm text-neutral-200 font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(190,50,255,0.2)] max-w-[200px] sm:max-w-[240px]">
                <Globe className="w-3.5 h-3.5 text-[#be32ff] shrink-0" />
                <span className="truncate">{getDisplayHostname(websiteUrl)}</span>
              </div>
            </div>

            {/* Heading & Subtitle matching screenshot */}
            <div className="text-center mt-3 sm:mt-5 mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Reading your website.
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1 flex items-center justify-center gap-1.5">
                <span>Spotting your audience...</span>
                <span className="inline-flex gap-1 items-center ml-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#be32ff] animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f0449b] animate-pulse [animation-delay:200ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fc9a5d] animate-pulse [animation-delay:400ms]" />
                </span>
              </p>
            </div>

            {/* 3D Mascot Illustration matching screenshot */}
            <div className="relative my-3 sm:my-5 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-[#be32ff]/20 via-[#7d36fa]/15 to-[#f0449b]/15 blur-3xl rounded-full transform scale-90 -z-0 pointer-events-none" />
              <img
                src="/images/website-analysis-mascot.png"
                alt="AI reading website"
                className="w-full max-w-[240px] sm:max-w-[280px] h-auto object-contain relative z-10 drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] select-none pointer-events-none animate-in zoom-in-95 duration-500"
              />
            </div>

            {/* 2x2 Grid of Status Chips matching designer reference */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm mx-auto mt-2 sm:mt-3">
              {/* Chip 1: Brand Voice */}
              <div className={`p-3 rounded-2xl border transition-all duration-300 flex items-center gap-2.5 ${
                analysisProgress.brandVoice.status === "completed"
                  ? "bg-[#201735]/90 border-[#BE32FF]/50 shadow-[0_0_15px_rgba(190,50,255,0.2)]"
                  : "bg-[#1c1a32]/80 border-white/10"
              }`}>
                {analysisProgress.brandVoice.status === "completed" ? (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#fc9a5d] to-[#be32ff] flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(190,50,255,0.4)]">
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  </div>
                ) : analysisProgress.brandVoice.status === "error" ? (
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                    <span className="text-amber-400 text-xs font-bold">!</span>
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-[#f0449b]/30 border-t-[#f0449b] border-r-[#fc9a5d] animate-spin shrink-0" />
                )}
                <div className="min-w-0">
                  <span className="text-xs sm:text-sm font-semibold text-white block truncate">
                    Brand Voice
                  </span>
                  {analysisProgress.brandVoice.value && (
                    <span className="text-[10px] text-neutral-400 block truncate">
                      {analysisProgress.brandVoice.value}
                    </span>
                  )}
                </div>
              </div>

              {/* Chip 2: Colors */}
              <div className={`p-3 rounded-2xl border transition-all duration-300 flex items-center gap-2.5 ${
                analysisProgress.colors.status === "completed"
                  ? "bg-[#201735]/90 border-[#BE32FF]/50 shadow-[0_0_15px_rgba(190,50,255,0.2)]"
                  : "bg-[#1c1a32]/80 border-white/10"
              }`}>
                {analysisProgress.colors.status === "completed" ? (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#fc9a5d] to-[#be32ff] flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(190,50,255,0.4)]">
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  </div>
                ) : analysisProgress.colors.status === "error" ? (
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                    <span className="text-amber-400 text-xs font-bold">!</span>
                  </div>
                ) : analysisProgress.colors.status === "analyzing" ? (
                  <div className="w-5 h-5 rounded-full border-2 border-[#f0449b]/30 border-t-[#f0449b] border-r-[#fc9a5d] animate-spin shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-white/20 shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <span className="text-xs sm:text-sm font-semibold text-white block truncate">
                    Colors
                  </span>
                  {analysisProgress.colors.status === "completed" && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: analysisProgress.colors.primary || "#BE32FF" }}
                      />
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: analysisProgress.colors.accent || "#F0449B" }}
                      />
                      <span className="text-[10px] text-neutral-400">Palette</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Chip 3: Category */}
              <div className={`p-3 rounded-2xl border transition-all duration-300 flex items-center gap-2.5 ${
                analysisProgress.category.status === "completed"
                  ? "bg-[#201735]/90 border-[#BE32FF]/50 shadow-[0_0_15px_rgba(190,50,255,0.2)]"
                  : "bg-[#1c1a32]/80 border-white/10"
              }`}>
                {analysisProgress.category.status === "completed" ? (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#fc9a5d] to-[#be32ff] flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(190,50,255,0.4)]">
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  </div>
                ) : analysisProgress.category.status === "error" ? (
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                    <span className="text-amber-400 text-xs font-bold">!</span>
                  </div>
                ) : analysisProgress.category.status === "analyzing" ? (
                  <div className="w-5 h-5 rounded-full border-2 border-[#f0449b]/30 border-t-[#f0449b] border-r-[#fc9a5d] animate-spin shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-white/20 shrink-0" />
                )}
                <div className="min-w-0">
                  <span className="text-xs sm:text-sm font-semibold text-white block truncate">
                    Category
                  </span>
                  {analysisProgress.category.value && (
                    <span className="text-[10px] text-neutral-400 block truncate">
                      {analysisProgress.category.value}
                    </span>
                  )}
                </div>
              </div>

              {/* Chip 4: Photos */}
              <div className={`p-3 rounded-2xl border transition-all duration-300 flex items-center gap-2.5 ${
                analysisProgress.photos.status === "completed"
                  ? "bg-[#201735]/90 border-[#BE32FF]/50 shadow-[0_0_15px_rgba(190,50,255,0.2)]"
                  : "bg-[#1c1a32]/80 border-white/10"
              }`}>
                {analysisProgress.photos.status === "completed" ? (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#fc9a5d] to-[#be32ff] flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(190,50,255,0.4)]">
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  </div>
                ) : analysisProgress.photos.status === "error" ? (
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                    <span className="text-amber-400 text-xs font-bold">!</span>
                  </div>
                ) : analysisProgress.photos.status === "analyzing" ? (
                  <div className="w-5 h-5 rounded-full border-2 border-[#f0449b]/30 border-t-[#f0449b] border-r-[#fc9a5d] animate-spin shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-white/20 shrink-0" />
                )}
                <div className="min-w-0">
                  <span className="text-xs sm:text-sm font-semibold text-white block truncate">
                    Photos
                  </span>
                  {analysisProgress.photos.value && (
                    <span className="text-[10px] text-neutral-400 block truncate">
                      {analysisProgress.photos.value}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Error state alert with Retry and Skip options */}
            {analysisError && (
              <div className="mt-4 p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-200 animate-in fade-in max-w-sm mx-auto">
                <p className="font-semibold text-red-400 mb-2">{analysisError}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startWebsiteAnalysis(websiteUrl)}
                    className="flex-1 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Retry</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleReadingContinue}
                    className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-neutral-300 font-medium text-xs transition-all cursor-pointer"
                  >
                    <span>Continue Manually</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action: Continue appears once analysis is completed */}
          <div className="pt-4 pb-2">
            {analysisCompleted ? (
              <button
                type="button"
                id="reading-continue-btn"
                onClick={handleReadingContinue}
                className="w-full h-13 sm:h-14 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] hover:brightness-110 active:scale-[0.98] text-white font-bold text-base flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(236,72,153,0.4)] transition-all cursor-pointer animate-in fade-in"
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            ) : isAnalyzingWebsite ? (
              <div className="w-full h-13 sm:h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-xs sm:text-sm text-neutral-400 font-medium select-none">
                <Loader2 className="w-4 h-4 animate-spin text-[#be32ff]" />
                <span>Reading your website storefront with AI...</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleReadingContinue}
                className="w-full h-13 sm:h-14 rounded-full bg-white/10 hover:bg-white/15 text-white/70 font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN: IS THIS YOUR BUSINESS? (Scrollable Step, Reference Screenshots 1, 2, 3)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "business_details" && (
        <div className="w-full max-w-xl sm:max-w-2xl mx-auto my-auto py-2 flex flex-col justify-between min-h-[580px] sm:min-h-[660px] animate-in fade-in duration-400 relative z-10 px-3 sm:px-6">
          <div className="space-y-6">
            {/* Top Header: Back button + Progress bar (~50%) */}
            <div className="flex items-center gap-3 w-full mb-2">
              <button
                type="button"
                onClick={handleBusinessDetailsBack}
                aria-label="Go back"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "50%" }}
                />
              </div>
            </div>

            {/* Heading */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Is this your business?
              </h1>
            </div>

            {/* Status Banner */}
            <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-500/30 text-purple-200 flex items-center gap-2.5 text-xs sm:text-sm font-medium">
              <RotateCw className="w-4 h-4 text-[#be32ff] animate-spin shrink-0" />
              <span>Still reading your website, more details filling in</span>
            </div>

            {/* Form Fields Container */}
            <div className="space-y-5">
              {/* Field 1: Business name */}
              <div className="space-y-1.5">
                <Label htmlFor="detail-b-name" className="text-xs font-semibold text-neutral-300">
                  Business name
                </Label>
                <Input
                  id="detail-b-name"
                  value={businessDetails.business_name}
                  onChange={(e) =>
                    setBusinessDetails({ ...businessDetails, business_name: e.target.value })
                  }
                  className="h-12 rounded-2xl bg-[#0f1015] border-white/15 text-white text-sm sm:text-base focus:border-[#be32ff] px-4"
                  placeholder="e.g. SevenUnique Tech Solutions Pvt. Ltd."
                />
              </div>

              {/* Field 2: Category */}
              <div className="space-y-1.5">
                <Label htmlFor="detail-b-category" className="text-xs font-semibold text-neutral-300">
                  Category
                </Label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input
                    id="detail-b-category"
                    value={businessDetails.category}
                    onChange={(e) =>
                      setBusinessDetails({ ...businessDetails, category: e.target.value })
                    }
                    className="h-12 pl-10 pr-4 rounded-2xl bg-[#0f1015] border-white/15 text-white text-sm sm:text-base focus:border-[#be32ff]"
                    placeholder="e.g. Tech & Electronics"
                  />
                </div>
              </div>

              {/* Field 3: Business type (pick 1 or more, first tap = primary) */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-neutral-300">
                  Business type (pick 1 or more, first tap = primary)
                </Label>
                <div className="flex flex-wrap gap-2.5">
                  {["Product-based", "Physical Location", "Service / Digital"].map((type) => {
                    const isSelected = businessDetails.business_types.includes(type);
                    const isPrimary = businessDetails.primary_business_type === type;
                    return (
                      <button
                        type="button"
                        key={type}
                        onClick={() => handleToggleBusinessType(type)}
                        className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-r from-[#fc9a5d]/15 to-[#be32ff]/20 border-[#be32ff] text-white shadow-[0_0_15px_rgba(190,50,255,0.25)]"
                            : "bg-[#0f1015] border-white/15 text-neutral-400 hover:text-white hover:border-white/30"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#be32ff] stroke-[3]" />}
                        <span>{type}</span>
                        {isPrimary && (
                          <span
                            onClick={(e) => handleSetPrimaryBusinessType(type, e)}
                            className="ml-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] text-white shadow-sm"
                          >
                            PRIMARY
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Field 4: Sub-category (optional) */}
              <div className="space-y-1.5">
                <Label htmlFor="detail-b-subcat" className="text-xs font-semibold text-neutral-300">
                  Sub-category (optional)
                </Label>
                <div className="relative">
                  <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#be32ff]" />
                  <Input
                    id="detail-b-subcat"
                    value={businessDetails.sub_category}
                    onChange={(e) =>
                      setBusinessDetails({ ...businessDetails, sub_category: e.target.value })
                    }
                    className="h-12 pl-10 pr-10 rounded-2xl bg-[#0f1015] border-white/15 text-white text-sm sm:text-base focus:border-[#be32ff]"
                    placeholder="e.g. Software Development"
                  />
                  {businessDetails.sub_category && (
                    <button
                      type="button"
                      onClick={() =>
                        setBusinessDetails({ ...businessDetails, sub_category: "" })
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Field 5: City (i) */}
              <div className="space-y-1.5">
                <Label htmlFor="detail-b-city" className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <span>City</span>
                  <Info className="w-3.5 h-3.5 text-neutral-400" />
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input
                    id="detail-b-city"
                    value={businessDetails.city}
                    onChange={(e) =>
                      setBusinessDetails({ ...businessDetails, city: e.target.value })
                    }
                    className="h-12 pl-10 pr-4 rounded-2xl bg-[#0f1015] border-white/15 text-white text-sm sm:text-base focus:border-[#be32ff]"
                    placeholder="e.g. Jaipur, India"
                  />
                </div>
              </div>

              {/* Field 6: Logo */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-neutral-300">Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#0f1015] border border-white/15 flex items-center justify-center overflow-hidden p-1.5 shrink-0 shadow-md">
                    {businessDetails.logo_url ? (
                      <img
                        src={businessDetails.logo_url}
                        alt="Logo"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Store className="w-7 h-7 text-neutral-500" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#be32ff] hover:text-[#f0449b] transition-colors cursor-pointer flex items-center gap-1.5">
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Change logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleWebsiteLogoUpload}
                        className="hidden"
                      />
                    </label>
                    {businessDetails.logo_url && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="text-xs font-semibold text-neutral-400 hover:text-red-400 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Field 7: Tagline (optional) */}
              <div className="space-y-1.5">
                <Label htmlFor="detail-b-tagline" className="text-xs font-semibold text-neutral-300">
                  Tagline (optional)
                </Label>
                <Input
                  id="detail-b-tagline"
                  value={businessDetails.tagline}
                  onChange={(e) =>
                    setBusinessDetails({ ...businessDetails, tagline: e.target.value })
                  }
                  className="h-12 px-4 rounded-2xl bg-[#0f1015] border-white/15 text-white text-sm sm:text-base focus:border-[#be32ff]"
                  placeholder="e.g. Website Design Partner For Modern Businesses"
                />
              </div>

              {/* Field 8: Who buys from you (optional) */}
              <div className="space-y-1.5">
                <Label htmlFor="detail-b-audience" className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <span>Who buys from you</span>
                  <Info className="w-3.5 h-3.5 text-neutral-400" />
                </Label>
                <Input
                  id="detail-b-audience"
                  value={businessDetails.target_audience}
                  onChange={(e) =>
                    setBusinessDetails({ ...businessDetails, target_audience: e.target.value })
                  }
                  className="h-12 px-4 rounded-2xl bg-[#0f1015] border-white/15 text-white text-sm sm:text-base focus:border-[#be32ff]"
                  placeholder="e.g. Startups, enterprises, and growing businesses"
                />
              </div>

              {/* Field 9: What makes you different (optional) */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <span>What makes you different (optional)</span>
                  <Info className="w-3.5 h-3.5 text-neutral-400" />
                </Label>
                <div className="space-y-2">
                  {businessDetails.differentiators.map((diff, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-[#0f1015] border border-white/10 flex items-center justify-between gap-3 text-xs sm:text-sm text-neutral-200"
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <Minus className="w-3.5 h-3.5 text-[#fc9a5d] shrink-0" />
                        <span className="leading-snug">{diff}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDifferentiator(idx)}
                        className="text-neutral-400 hover:text-red-400 transition-colors p-1 shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {/* Dashed Add Input */}
                  <div className="p-2 sm:p-2.5 rounded-2xl border-2 border-dashed border-white/20 bg-white/[0.02] flex items-center gap-2">
                    <input
                      type="text"
                      value={newDifferentiator}
                      onChange={(e) => setNewDifferentiator(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddDifferentiator();
                        }
                      }}
                      placeholder="e.g. Same-day delivery in Pune"
                      className="flex-1 bg-transparent border-none text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none px-2"
                    />
                    <button
                      type="button"
                      onClick={handleAddDifferentiator}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Field 10: What you sell (optional) */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-neutral-300">
                  What you sell (optional)
                </Label>
                <div className="space-y-2">
                  {businessDetails.products_services.map((prod, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-[#0f1015] border border-white/10 flex items-center justify-between gap-3 text-xs sm:text-sm text-neutral-200"
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <Minus className="w-3.5 h-3.5 text-[#be32ff] shrink-0" />
                        <span className="leading-snug">{prod}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveProductService(idx)}
                        className="text-neutral-400 hover:text-red-400 transition-colors p-1 shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {/* Dashed Add Input */}
                  <div className="p-2 sm:p-2.5 rounded-2xl border-2 border-dashed border-white/20 bg-white/[0.02] flex items-center gap-2">
                    <input
                      type="text"
                      value={newProductService}
                      onChange={(e) => setNewProductService(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddProductService();
                        }
                      }}
                      placeholder="e.g. Cotton sarees"
                      className="flex-1 bg-transparent border-none text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none px-2"
                    />
                    <button
                      type="button"
                      onClick={handleAddProductService}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Bar with Looks Right Button */}
          <div className="sticky bottom-0 pt-6 pb-4 mt-6 bg-gradient-to-t from-[#070F22] via-[#070F22]/90 to-transparent">
            <button
              type="button"
              id="details-continue-btn"
              onClick={handleBusinessDetailsContinue}
              disabled={isSavingBusinessDetails}
              className="w-full h-13 sm:h-14 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:brightness-110 active:scale-[0.98] text-white font-bold text-base flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(240,68,155,0.4)] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSavingBusinessDetails ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Looks right</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN: WHAT'S YOUR BUSINESS LIKE? (Single Step, Reference Screenshots 4, 5)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "brand_preferences" && (
        <div className="w-full max-w-xl sm:max-w-2xl mx-auto my-auto py-2 flex flex-col justify-between min-h-[580px] sm:min-h-[660px] animate-in fade-in duration-400 relative z-10 px-3 sm:px-6">
          <div className="space-y-6">
            {/* Top Header: Back button + Progress bar (~65%) */}
            <div className="flex items-center gap-3 w-full mb-2">
              <button
                type="button"
                onClick={handleBrandPreferencesBack}
                aria-label="Go back"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "65%" }}
                />
              </div>
            </div>

            {/* Heading & Subtitle */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                What&apos;s {businessDetails.business_name || "your business"} like?
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1">
                Still reading your site — we&apos;ll pre-fill what we find
              </p>
            </div>

            {/* Tagline Quotation Card */}
            <div className="p-4 rounded-2xl bg-[#0f1015]/80 border border-white/10 flex items-start gap-3 shadow-md">
              <Quote className="w-6 h-6 text-[#fc9a5d] shrink-0 rotate-180" />
              <div className="space-y-1">
                <p className="text-sm sm:text-base font-semibold text-white italic">
                  &ldquo;{businessDetails.tagline || "Trusted Website Design Partner For Modern Businesses"}&rdquo;
                </p>
                <p className="text-[11px] text-neutral-400 font-medium">Your tagline</p>
              </div>
            </div>

            {/* Brand Colors */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-semibold text-white text-sm sm:text-base">
                <Palette className="w-4 h-4 text-[#f0449b]" />
                <span>Your brand colors</span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                {brandPreferences.palette.map((color, idx) => (
                  <div key={idx} className="relative group">
                    <label
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white/20 relative shadow-lg cursor-pointer transition-transform hover:scale-105 block"
                      style={{ backgroundColor: color }}
                    >
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => handleColorChange(idx, e.target.value)}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-md">
                        <Pencil className="w-2.5 h-2.5" />
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-neutral-400 font-light">
                We&apos;ll use these colors in your designs. You can update these later in Brand settings.
              </p>
            </div>

            {/* Tone Selector */}
            <div className="space-y-3">
              <h3 className="font-semibold text-white text-sm sm:text-base">
                Pick your tone (as many as fit)
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {[
                  "Modern", "Trendy", "Youthful", "Bold",
                  "Luxurious", "Fun", "Professional",
                  "Minimal", "Traditional", "Warm",
                  "Energetic", "Elegant", "Festive", "Desi",
                  "Premium", "Budget-friendly"
                ].map((tone) => {
                  const isSelected = brandPreferences.tones.includes(tone);
                  return (
                    <button
                      type="button"
                      key={tone}
                      onClick={() => handleToggleTone(tone)}
                      className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-r from-[#fc9a5d]/15 to-[#be32ff]/20 border-[#be32ff] text-white shadow-[0_0_15px_rgba(190,50,255,0.25)]"
                          : "bg-[#0f1015] border-white/15 text-neutral-400 hover:text-white hover:border-white/30"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 inline mr-1 text-[#be32ff] stroke-[3]" />}
                      {tone}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Language Selector */}
            <div className="space-y-3">
              <h3 className="font-semibold text-white text-sm sm:text-base">
                What language should we post in?
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { id: "Hindi", label: "हिंदी" },
                  { id: "English", label: "English" },
                  { id: "Hinglish", label: "Hinglish" },
                  { id: "Tamil", label: "தமிழ்" },
                  { id: "Telugu", label: "తెలుగు" },
                  { id: "Bengali", label: "বাংলা" },
                  { id: "Marathi", label: "मराठी" },
                  { id: "Kannada", label: "ಕನ್ನಡ" },
                  { id: "Gujarati", label: "ગુજરાતી" },
                  { id: "Malayalam", label: "മലയാളം" },
                ].map((lang) => {
                  const isSelected = brandPreferences.language.toLowerCase() === lang.id.toLowerCase() || brandPreferences.language.toLowerCase() === lang.label.toLowerCase();
                  return (
                    <button
                      type="button"
                      key={lang.id}
                      onClick={() => handleSelectLanguage(lang.id)}
                      className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-r from-[#fc9a5d]/20 to-[#be32ff]/25 border-[#be32ff] text-white shadow-[0_0_15px_rgba(190,50,255,0.25)]"
                          : "bg-[#0f1015] border-white/15 text-neutral-400 hover:text-white hover:border-white/30"
                      }`}
                    >
                      {lang.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-neutral-400 font-light">
                You can mix languages later — this is just your default.
              </p>
            </div>

            {/* TARGET AUDIENCE Summary Card */}
            <div className="p-4 rounded-2xl bg-[#0f1015]/80 border border-white/10 space-y-1">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                TARGET AUDIENCE
              </div>
              <p className="text-xs sm:text-sm text-neutral-200">
                {businessDetails.target_audience || "Startups, enterprises, and growing businesses globally"}
              </p>
            </div>

            {/* SERVICES & PRODUCTS Summary Card */}
            <div className="p-4 rounded-2xl bg-[#0f1015]/80 border border-white/10 space-y-2">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                SERVICES &amp; PRODUCTS
              </div>
              <div className="flex flex-wrap gap-2">
                {businessDetails.products_services.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-[#be32ff]/10 border border-[#be32ff]/25 text-purple-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Bottom Bar with Save My Brand Button */}
          <div className="sticky bottom-0 pt-6 pb-4 mt-6 bg-gradient-to-t from-[#070F22] via-[#070F22]/90 to-transparent">
            <button
              type="button"
              id="brand-continue-btn"
              onClick={handleBrandPreferencesContinue}
              disabled={isSavingBrandPreferences}
              className="w-full h-13 sm:h-14 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:brightness-110 active:scale-[0.98] text-white font-bold text-base flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(240,68,155,0.4)] transition-all cursor-pointer disabled:opacity-60"
            >
              {isSavingBrandPreferences ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving brand preferences...</span>
                </>
              ) : (
                <>
                  <span>Save my brand</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN: PICK THE PHOTOS WE SHOULD WORK WITH (Screenshot 6, Web-optimized Layout)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "website_photos" && (
        <div className="w-full max-w-4xl lg:max-w-5xl mx-auto my-auto py-2 flex flex-col justify-between min-h-[580px] sm:min-h-[660px] animate-in fade-in duration-400 relative z-10 px-3 sm:px-6">
          <div className="space-y-6">
            {/* Top Header: Back button + Progress bar (~80%) */}
            <div className="flex items-center gap-3 w-full mb-2">
              <button
                type="button"
                onClick={handleWebsitePhotosBack}
                aria-label="Go back"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "80%" }}
                />
              </div>
            </div>

            {/* Heading & Subtitle */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Pick the photos we should work with
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                We found {websitePhotos.length} photos on your website. Pick the ones that best represent your brand, or add more.
              </p>
            </div>

            {/* Control Bar: Selection Count + Select/Deselect All */}
            <div className="flex items-center justify-between pt-1 pb-1">
              <div className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#be32ff]/15 border border-[#be32ff]/30 text-purple-200 flex items-center gap-2 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#be32ff]" />
                <span>
                  {selectedPhotos.length} of {websitePhotos.length} photos selected
                </span>
              </div>
              <button
                type="button"
                onClick={handleSelectAllPhotos}
                className="text-xs font-medium text-neutral-400 hover:text-white underline cursor-pointer transition-colors"
              >
                {selectedPhotos.length === websitePhotos.length ? "Deselect All" : "Select All"}
              </button>
            </div>

            {/* Responsive Photo Grid (Web Layout: 4 columns on desktop, 2-3 on tablet/mobile) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* Upload Tile */}
              <label className="aspect-square rounded-2xl border-2 border-dashed border-white/20 bg-white/[0.03] hover:bg-white/[0.06] hover:border-[#be32ff] transition-all flex flex-col items-center justify-center p-4 text-center cursor-pointer group shadow-sm">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                {isUploadingPhoto ? (
                  <Loader2 className="w-7 h-7 text-[#be32ff] animate-spin mb-2" />
                ) : (
                  <Upload className="w-7 h-7 text-[#fc9a5d] group-hover:scale-110 transition-transform mb-2" />
                )}
                <span className="text-xs font-semibold text-white">Upload photo</span>
                <span className="text-[10px] text-neutral-400 mt-1">JPG, PNG up to 10MB</span>
              </label>

              {/* Photos List */}
              {websitePhotos.map((photoUrl, idx) => {
                const isSelected = selectedPhotos.includes(photoUrl);
                return (
                  <div
                    key={idx}
                    onClick={() => handleTogglePhoto(photoUrl)}
                    className={`aspect-square rounded-2xl overflow-hidden relative cursor-pointer group transition-all duration-300 ${
                      isSelected
                        ? "border-2 border-[#be32ff] shadow-[0_0_20px_rgba(190,50,255,0.4)]"
                        : "border border-white/10 opacity-70 hover:opacity-100 hover:border-white/30"
                    }`}
                  >
                    <img
                      src={photoUrl}
                      alt={`Website photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Selection Checkmark Badge */}
                    <div className="absolute top-2.5 right-2.5">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#fc9a5d] to-[#be32ff] text-white flex items-center justify-center shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-white/50 bg-black/40 backdrop-blur-sm" />
                      )}
                    </div>

                    {/* Delete Photo Button on Hover */}
                    <button
                      type="button"
                      onClick={(e) => handleRemovePhoto(photoUrl, e)}
                      aria-label="Remove photo"
                      className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 hover:bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm shadow-md"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Empty State if 0 photos */}
            {websitePhotos.length === 0 && (
              <div className="py-12 text-center space-y-3 bg-[#0f1015]/60 border border-white/10 rounded-2xl">
                <ImageIcon className="w-10 h-10 text-neutral-500 mx-auto" />
                <h3 className="text-sm font-semibold text-white">No photos detected yet</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Click the Upload tile above to add your product shots, store images, or brand graphics.
                </p>
              </div>
            )}
          </div>

          {/* Sticky Bottom Bar with Continue Button */}
          <div className="sticky bottom-0 pt-6 pb-4 mt-6 bg-gradient-to-t from-[#070F22] via-[#070F22]/90 to-transparent">
            <button
              type="button"
              id="photos-continue-btn"
              onClick={handleWebsitePhotosContinue}
              disabled={isSavingPhotos}
              className="w-full h-13 sm:h-14 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:brightness-110 active:scale-[0.98] text-white font-bold text-base flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(240,68,155,0.4)] transition-all cursor-pointer disabled:opacity-60"
            >
              {isSavingPhotos ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving selected photos...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          GOOGLE MAPS STEP 1: FIND YOUR SHOP ON GOOGLE MAPS (Reference Screenshots 1, 2, 3, 4)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "maps_search" && (
        <div className="w-full max-w-xl sm:max-w-2xl mx-auto my-auto py-2 flex flex-col justify-between min-h-[580px] sm:min-h-[660px] animate-in fade-in duration-400 relative z-10 px-3 sm:px-6">
          <div className="space-y-6">
            {/* Top Header: Back button + Progress bar (~20%) */}
            <div className="flex items-center gap-3 w-full mb-2">
              <button
                type="button"
                onClick={handleMapsSearchBack}
                aria-label="Go back"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "20%" }}
                />
              </div>
            </div>

            {/* Heading & Subtitle */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Find your shop on Google Maps
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-light">
                Your photos and reviews do most of the work
              </p>
            </div>

            {/* Search Input Box */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                type="text"
                value={mapsSearchQuery}
                onChange={(e) => {
                  setMapsSearchQuery(e.target.value);
                  if (selectedMapsPlace && e.target.value !== selectedMapsPlace.name) {
                    setSelectedMapsPlace(null);
                  }
                }}
                placeholder="Search your shop, or paste Maps link"
                className="h-14 pl-12 pr-11 rounded-2xl bg-[#0f1015] border-white/15 text-white placeholder:text-neutral-500 text-sm sm:text-base focus:border-[#be32ff] shadow-inner"
              />
              {isSearchingMaps ? (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#be32ff] animate-spin" />
              ) : mapsSearchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setMapsSearchQuery("");
                    setSelectedMapsPlace(null);
                    setMapsSearchResults([]);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              ) : null}
            </div>

            {/* Selected Shop Preview Card (Screenshot 4) */}
            {selectedMapsPlace ? (
              <div className="rounded-3xl bg-[#0f1015]/90 border border-[#be32ff]/40 p-4 sm:p-5 space-y-4 shadow-[0_0_30px_rgba(190,50,255,0.2)] animate-in zoom-in-95 duration-300">
                {/* Mosaic / Photo Preview */}
                {selectedMapsPlace.photos && selectedMapsPlace.photos.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 h-44 sm:h-52 rounded-2xl overflow-hidden">
                    <div className="col-span-2 h-full relative overflow-hidden bg-neutral-900">
                      <img
                        src={selectedMapsPlace.photos[0]}
                        alt={selectedMapsPlace.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="col-span-1 grid grid-rows-2 gap-2 h-full">
                      <div className="h-full relative overflow-hidden bg-neutral-900 rounded-lg">
                        <img
                          src={selectedMapsPlace.photos[1] || selectedMapsPlace.photos[0]}
                          alt={`${selectedMapsPlace.name} 2`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="h-full relative overflow-hidden bg-neutral-900 rounded-lg">
                        <img
                          src={selectedMapsPlace.photos[2] || selectedMapsPlace.photos[0]}
                          alt={`${selectedMapsPlace.name} 3`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-32 rounded-2xl bg-gradient-to-r from-purple-900/30 via-pink-900/20 to-orange-900/30 border border-white/10 flex items-center justify-center gap-3 text-neutral-400">
                    <Store className="w-8 h-8 text-[#be32ff]" />
                    <span className="text-sm font-medium">Google Maps listing verified</span>
                  </div>
                )}

                {/* Info row */}
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                      {selectedMapsPlace.name}
                    </h3>
                    {selectedMapsPlace.rating && (
                      <div className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1 shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{selectedMapsPlace.rating}</span>
                        {selectedMapsPlace.userRatingCount && (
                          <span className="text-amber-300/70 font-normal">
                            ({selectedMapsPlace.userRatingCount})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-snug flex items-start gap-1.5 pt-0.5">
                    <MapPin className="w-4 h-4 text-[#fc9a5d] shrink-0 mt-0.5" />
                    <span>{selectedMapsPlace.address}</span>
                  </p>
                </div>

                {/* Change selection button */}
                <div className="pt-1 flex items-center justify-between border-t border-white/10">
                  <span className="text-xs text-neutral-400">Selected Google Maps shop</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMapsPlace(null);
                      setMapsSearchQuery("");
                      setMapsSearchResults([]);
                    }}
                    className="text-xs font-semibold text-[#be32ff] hover:text-[#f0449b] transition-colors cursor-pointer"
                  >
                    Change shop
                  </button>
                </div>
              </div>
            ) : mapsSearchResults.length > 0 ? (
              /* Search Results Dropdown List (Screenshot 3) */
              <div className="rounded-2xl bg-[#0f1015] border border-white/15 overflow-hidden divide-y divide-white/10 shadow-xl max-h-72 sm:max-h-80 overflow-y-auto">
                {mapsSearchResults.map((place) => (
                  <button
                    type="button"
                    key={place.id}
                    onClick={() => handleSelectMapsShop(place)}
                    className="w-full p-3.5 sm:p-4 text-left hover:bg-white/[0.06] transition-colors flex items-start gap-3.5 group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#be32ff]/15 border border-[#be32ff]/30 text-[#be32ff] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-white text-sm sm:text-base truncate group-hover:text-purple-300 transition-colors">
                          {place.name}
                        </span>
                        {place.rating && (
                          <span className="text-amber-400 text-xs font-semibold shrink-0 flex items-center gap-0.5">
                            ★ {place.rating}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                        {place.address}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : mapsSearchError ? (
              /* Error / Empty State */
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-2">
                <p className="text-xs sm:text-sm text-neutral-300">{mapsSearchError}</p>
                <button
                  type="button"
                  onClick={() => {
                    if (mapsSearchQuery) {
                      googleMapsService.searchGooglePlaces(mapsSearchQuery).then((res) => {
                        setMapsSearchResults(res);
                      });
                    }
                  }}
                  className="text-xs font-semibold text-[#be32ff] hover:underline"
                >
                  Retry search
                </button>
              </div>
            ) : (
              /* Help Card (Screenshot 1 & 2) */
              <div className="p-5 rounded-3xl bg-[#0f1015]/80 border border-white/10 space-y-4 shadow-sm">
                <h3 className="font-bold text-white text-sm sm:text-base">
                  Can&apos;t find it? Paste the Maps link instead
                </h3>
                <ol className="space-y-2.5 text-xs sm:text-sm text-neutral-300">
                  <li className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#be32ff]/20 text-[#be32ff] font-bold text-xs flex items-center justify-center shrink-0">
                      1
                    </span>
                    <span>Open the Google Maps app</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#be32ff]/20 text-[#be32ff] font-bold text-xs flex items-center justify-center shrink-0">
                      2
                    </span>
                    <span>Search your shop name</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#be32ff]/20 text-[#be32ff] font-bold text-xs flex items-center justify-center shrink-0">
                      3
                    </span>
                    <span>Tap Share → Copy link</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#be32ff]/20 text-[#be32ff] font-bold text-xs flex items-center justify-center shrink-0">
                      4
                    </span>
                    <span>Come back here and paste it above</span>
                  </li>
                </ol>
                <div className="pt-1">
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-all border border-white/10"
                  >
                    <span>Open Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Bar with "Use this shop" Button */}
          <div className="sticky bottom-0 pt-6 pb-4 mt-6 bg-gradient-to-t from-[#070F22] via-[#070F22]/90 to-transparent">
            <button
              type="button"
              id="maps-use-shop-btn"
              onClick={handleUseShopContinue}
              disabled={!selectedMapsPlace}
              className={`w-full h-13 sm:h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedMapsPlace
                  ? "bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:brightness-110 active:scale-[0.98] text-white shadow-[0_8px_30px_rgba(240,68,155,0.4)]"
                  : "bg-white/10 text-neutral-500 cursor-not-allowed border border-white/5"
              }`}
            >
              <span>Use this shop</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div className="pt-3 text-center">
              <p className="text-xs sm:text-sm text-neutral-400">
                Don&apos;t have a website yet?{" "}
                <button
                  type="button"
                  onClick={() => handleCreateWebsite("google_maps")}
                  className="font-bold text-[#f0449b] hover:text-[#ff65b3] transition-colors cursor-pointer hover:underline"
                >
                  Create Website
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          GOOGLE MAPS STEP 2: GOT A WEBSITE? (Reference Screenshot 5)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "maps_website" && (
        <div className="w-full max-w-xl sm:max-w-2xl mx-auto my-auto py-2 flex flex-col justify-between min-h-[580px] sm:min-h-[660px] animate-in fade-in duration-400 relative z-10 px-3 sm:px-6">
          <div className="space-y-6">
            {/* Top Header: Back button + Progress bar (~38%) */}
            <div className="flex items-center gap-3 w-full mb-2">
              <button
                type="button"
                onClick={handleMapsWebsiteBack}
                aria-label="Go back"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "38%" }}
                />
              </div>
            </div>

            {/* Heading & Subtitle */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Got a website for {selectedMapsPlace?.name || businessProfile.business_name || "your shop"}?
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                We didn&apos;t find one on Google Maps. Paste a link to use it as your source — or skip and we&apos;ll set you up manually.
              </p>
            </div>

            {/* Selected Shop Summary Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0f1015]/90 border border-white/10 flex items-start gap-3.5 shadow-sm">
              <div className="w-9 h-9 rounded-full bg-[#be32ff]/15 border border-[#be32ff]/30 text-[#be32ff] flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="font-bold text-white text-sm sm:text-base leading-tight">
                  {selectedMapsPlace?.name || businessProfile.business_name}
                </h3>
                <p className="text-xs text-neutral-400 leading-snug">
                  {selectedMapsPlace?.address || businessProfile.full_address || "Google Maps verified location"}
                </p>
              </div>
            </div>

            {/* Website URL Input */}
            <div className="space-y-2">
              <div className="relative">
                <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  type="text"
                  value={mapsWebsiteUrl}
                  onChange={(e) => setMapsWebsiteUrl(e.target.value)}
                  placeholder="yourbusiness.com"
                  className="h-14 pl-12 pr-4 rounded-2xl bg-[#0f1015] border-white/15 text-white placeholder:text-neutral-500 text-sm sm:text-base focus:border-[#be32ff] shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Sticky Bottom Bar with "Use this website" and "Skip" */}
          <div className="sticky bottom-0 pt-6 pb-4 mt-6 bg-gradient-to-t from-[#070F22] via-[#070F22]/90 to-transparent space-y-3 text-center">
            <button
              type="button"
              id="maps-use-website-btn"
              onClick={handleUseWebsiteContinue}
              disabled={!mapsWebsiteUrl.trim()}
              className={`w-full h-13 sm:h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mapsWebsiteUrl.trim()
                  ? "bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:brightness-110 active:scale-[0.98] text-white shadow-[0_8px_30px_rgba(240,68,155,0.4)]"
                  : "bg-white/10 text-neutral-500 cursor-not-allowed border border-white/5"
              }`}
            >
              <span>Use this website</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={handleSkipWebsite}
                className="text-xs sm:text-sm font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer py-1 px-2"
              >
                Skip — I don&apos;t have one
              </button>
              <span className="text-neutral-600 text-xs">•</span>
              <button
                type="button"
                onClick={() => handleCreateWebsite("google_maps")}
                className="font-bold text-xs sm:text-sm text-[#f0449b] hover:text-[#ff65b3] transition-colors cursor-pointer hover:underline py-1 px-2"
              >
                Create Website
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          GOOGLE MAPS STEP 3: WHAT KIND OF BUSINESS DO YOU RUN? (Category & Subcategory)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "maps_category" && (
        <div className="w-full max-w-xl sm:max-w-2xl mx-auto my-auto py-2 flex flex-col justify-between min-h-[580px] sm:min-h-[660px] animate-in fade-in duration-400 relative z-10 px-3 sm:px-6">
          <div className="space-y-6">
            {/* Top Header: Back button + Progress bar (~55%) */}
            <div className="flex items-center gap-3 w-full mb-2">
              <button
                type="button"
                onClick={handleMapsCategoryBack}
                aria-label="Go back"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "55%" }}
                />
              </div>
            </div>

            {/* Heading & Subtitle */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                What kind of business do you run?
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-light">
                So we know what to make for you.
              </p>
            </div>

            {/* Field 1: Category Selector Trigger */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-300">Category</Label>
              <button
                type="button"
                onClick={() => setIsCategoryDrawerOpen(true)}
                className="w-full h-14 px-4 rounded-2xl bg-[#0f1015] border border-white/15 hover:border-[#be32ff] transition-all flex items-center justify-between text-left cursor-pointer group shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Search className="w-5 h-5 text-neutral-400 group-hover:text-[#be32ff] transition-colors" />
                  <span className={`text-sm sm:text-base font-semibold truncate ${mapsCategory ? "text-white" : "text-neutral-500"}`}>
                    {mapsCategory || "Select a category"}
                  </span>
                </div>
                <ChevronDown className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors shrink-0" />
              </button>
            </div>

            {/* Field 2: Sub-category (optional) */}
            <div className="space-y-2">
              <Label htmlFor="maps-subcat" className="text-xs font-semibold text-neutral-300">
                Sub-category (optional)
              </Label>
              <div className="relative">
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#be32ff]" />
                <Input
                  id="maps-subcat"
                  type="text"
                  value={mapsSubCategory}
                  onChange={(e) => setMapsSubCategory(e.target.value)}
                  placeholder="Search or type your niche..."
                  className="h-14 pl-11 pr-10 rounded-2xl bg-[#0f1015] border-white/15 text-white placeholder:text-neutral-500 text-sm sm:text-base focus:border-[#be32ff]"
                />
                {mapsSubCategory && (
                  <button
                    type="button"
                    onClick={() => setMapsSubCategory("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Dynamic Suggested Niche Chips */}
              {(() => {
                const currentCat = BUSINESS_CATEGORIES.find(
                  (c) => c.name.toLowerCase() === mapsCategory.toLowerCase()
                );
                const niches = currentCat?.suggestedNiches || [];
                if (niches.length === 0) return null;
                return (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-medium text-neutral-400">Popular niches for {mapsCategory}:</span>
                    <div className="flex flex-wrap gap-2">
                      {niches.map((niche) => {
                        const isSelected = mapsSubCategory === niche;
                        return (
                          <button
                            type="button"
                            key={niche}
                            onClick={() => setMapsSubCategory(niche)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-gradient-to-r from-[#fc9a5d]/20 to-[#be32ff]/25 border-[#be32ff] text-white shadow-sm"
                                : "bg-[#0f1015] border-white/10 text-neutral-300 hover:text-white hover:border-white/25"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 inline mr-1 text-[#be32ff]" />}
                            {niche}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Sticky Bottom Bar with Continue Button */}
          <div className="sticky bottom-0 pt-6 pb-4 mt-6 bg-gradient-to-t from-[#070F22] via-[#070F22]/90 to-transparent">
            <button
              type="button"
              id="maps-category-continue-btn"
              onClick={handleMapsCategoryContinue}
              disabled={!mapsCategory.trim()}
              className={`w-full h-13 sm:h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mapsCategory.trim()
                  ? "bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:brightness-110 active:scale-[0.98] text-white shadow-[0_8px_30px_rgba(240,68,155,0.4)]"
                  : "bg-white/10 text-neutral-500 cursor-not-allowed border border-white/5"
              }`}
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {/* ─── Category Selection Modal / Drawer ─── */}
      {isCategoryDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md max-h-[85vh] bg-[#0c1222] border border-white/15 rounded-3xl p-5 sm:p-6 flex flex-col shadow-2xl relative">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Select a category</h3>
              <button
                type="button"
                onClick={() => {
                  setIsCategoryDrawerOpen(false);
                  setCategorySearchTerm("");
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-neutral-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="py-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  type="text"
                  value={categorySearchTerm}
                  onChange={(e) => setCategorySearchTerm(e.target.value)}
                  placeholder="Search categories..."
                  className="h-11 pl-10 pr-9 rounded-xl bg-[#0f1015] border-white/15 text-white text-xs sm:text-sm focus:border-[#be32ff]"
                />
                {categorySearchTerm && (
                  <button
                    type="button"
                    onClick={() => setCategorySearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Category List */}
            <div className="flex-1 overflow-y-auto space-y-1 divide-y divide-white/5 pr-1 max-h-[55vh]">
              {BUSINESS_CATEGORIES.filter((c) =>
                c.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
              ).map((cat) => {
                const isSelected = mapsCategory === cat.name;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => {
                      setMapsCategory(cat.name);
                      setMapsPromotion(cat.defaultPromote);
                      setIsCategoryDrawerOpen(false);
                      setCategorySearchTerm("");
                    }}
                    className={`w-full p-3 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#be32ff]/15 text-white font-bold"
                        : "text-neutral-300 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <span className="text-xs sm:text-sm">{cat.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#be32ff] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          GOOGLE MAPS STEP 4: TELL US ABOUT YOUR BUSINESS (Business Details & Logo)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "maps_details" && (
        <div className="w-full max-w-xl sm:max-w-2xl mx-auto my-auto py-2 flex flex-col justify-between min-h-[580px] sm:min-h-[660px] animate-in fade-in duration-400 relative z-10 px-3 sm:px-6">
          <div className="space-y-6">
            {/* Top Header: Back button + Progress bar (~70%) */}
            <div className="flex items-center gap-3 w-full mb-2">
              <button
                type="button"
                onClick={handleMapsDetailsBack}
                aria-label="Go back"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "70%" }}
                />
              </div>
            </div>

            {/* Heading & Subtitle */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Tell us about your business
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-light">
                We’ll use this on every post and ad.
              </p>
            </div>

            {/* Form Fields Container */}
            <div className="space-y-4">
              {/* Field 1: Business name (required) */}
              <div className="space-y-1.5">
                <Label htmlFor="maps-b-name" className="text-xs font-semibold text-neutral-300">
                  Business name <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="maps-b-name"
                  type="text"
                  value={businessProfile.business_name}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, business_name: e.target.value })}
                  placeholder="e.g. Gift store (Rudra's villa)"
                  className="h-12 rounded-2xl bg-[#0f1015] border-white/15 text-white text-sm sm:text-base focus:border-[#be32ff] px-4"
                />
              </div>

              {/* Field 2: What should we promote? (required) */}
              <div className="space-y-1.5">
                <Label htmlFor="maps-b-promote" className="text-xs font-semibold text-neutral-300">
                  What should we promote? <span className="text-rose-400">*</span>
                </Label>
                <Input
                  id="maps-b-promote"
                  type="text"
                  value={mapsPromotion}
                  onChange={(e) => setMapsPromotion(e.target.value)}
                  placeholder="e.g. Customized gifts, personalized mugs, handmade hampers"
                  className="h-12 rounded-2xl bg-[#0f1015] border-white/15 text-white text-sm sm:text-base focus:border-[#be32ff] px-4"
                />
              </div>

              {/* Field 3: Who do you sell to? (optional) */}
              <div className="space-y-1.5">
                <Label htmlFor="maps-b-audience" className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <span>Who do you sell to? (optional)</span>
                  <Info className="w-3.5 h-3.5 text-neutral-400" />
                </Label>
                <Input
                  id="maps-b-audience"
                  type="text"
                  value={mapsAudience}
                  onChange={(e) => setMapsAudience(e.target.value)}
                  placeholder="Example: young professionals, parents, local shoppers"
                  className="h-12 rounded-2xl bg-[#0f1015] border-white/15 text-white text-sm sm:text-base focus:border-[#be32ff] px-4"
                />
              </div>

              {/* Field 4: What makes you different? (optional) */}
              <div className="space-y-1.5">
                <Label htmlFor="maps-b-diff" className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <span>What makes you different? (optional)</span>
                  <Info className="w-3.5 h-3.5 text-neutral-400" />
                </Label>
                <Input
                  id="maps-b-diff"
                  type="text"
                  value={mapsDifferentiator}
                  onChange={(e) => setMapsDifferentiator(e.target.value)}
                  placeholder="Example: same-day delivery, organic ingredients"
                  className="h-12 rounded-2xl bg-[#0f1015] border-white/15 text-white text-sm sm:text-base focus:border-[#be32ff] px-4"
                />
              </div>

              {/* Field 5: Logo (optional) */}
              <div className="space-y-2 pt-1">
                <Label className="text-xs font-semibold text-neutral-300">Logo (optional)</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#0f1015] border border-white/15 flex items-center justify-center overflow-hidden p-1.5 shrink-0 shadow-md">
                    {mapsLogoUrl ? (
                      <img src={mapsLogoUrl} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <Store className="w-7 h-7 text-neutral-500" />
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-all cursor-pointer border border-white/10">
                      <Upload className="w-3.5 h-3.5 text-[#fc9a5d]" />
                      <span>{mapsLogoUrl ? "Change logo" : "Upload logo"}</span>
                      <input type="file" accept="image/*" onChange={handleMapsLogoUpload} className="hidden" />
                    </label>
                    {mapsLogoUrl && (
                      <div>
                        <button
                          type="button"
                          onClick={handleRemoveMapsLogo}
                          className="text-xs font-medium text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          Remove logo
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Bar with Continue Button */}
          <div className="sticky bottom-0 pt-6 pb-4 mt-6 bg-gradient-to-t from-[#070F22] via-[#070F22]/90 to-transparent">
            <button
              type="button"
              id="maps-details-continue-btn"
              onClick={handleMapsDetailsContinue}
              disabled={!businessProfile.business_name.trim() || !mapsPromotion.trim()}
              className={`w-full h-13 sm:h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                businessProfile.business_name.trim() && mapsPromotion.trim()
                  ? "bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:brightness-110 active:scale-[0.98] text-white shadow-[0_8px_30px_rgba(240,68,155,0.4)]"
                  : "bg-white/10 text-neutral-500 cursor-not-allowed border border-white/5"
              }`}
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          GOOGLE MAPS STEP 5: PICK BUSINESS PHOTOS
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "maps_photos" && (
        <div className="w-full max-w-4xl lg:max-w-5xl mx-auto my-auto py-2 flex flex-col justify-between min-h-[580px] sm:min-h-[660px] animate-in fade-in duration-400 relative z-10 px-3 sm:px-6">
          <div className="space-y-6">
            {/* Top Header: Back button + Progress bar (~85%) */}
            <div className="flex items-center gap-3 w-full mb-2">
              <button
                type="button"
                onClick={handleMapsPhotosBack}
                aria-label="Go back"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "85%" }}
                />
              </div>
            </div>

            {/* Heading & Subtitle */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Pick the photos we should work with
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                Syncing Google Maps photos… you can upload your own now.
              </p>
            </div>

            {/* Informational Status Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-500/25 flex items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#be32ff] shrink-0" />
                <span className="font-semibold text-white">Google Maps details are ready</span>
              </div>
              <span className="text-neutral-400 text-xs">
                {mapsPhotos.length > 0 ? `${mapsPhotos.length} photos loaded` : "Upload photos below"}
              </span>
            </div>

            {/* Photo count indicator & Select All toggle */}
            <div className="flex items-center justify-between pt-1 pb-1">
              <div className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#be32ff]/15 border border-[#be32ff]/30 text-purple-200 flex items-center gap-2 shadow-sm">
                <span>{selectedMapsPhotos.length} / 15 · more = more variety</span>
              </div>
              {mapsPhotos.length > 0 && (
                <button
                  type="button"
                  onClick={handleSelectAllMapsPhotos}
                  className="text-xs font-medium text-neutral-400 hover:text-white underline cursor-pointer transition-colors"
                >
                  {selectedMapsPhotos.length === Math.min(mapsPhotos.length, 15) ? "Deselect All" : "Select All"}
                </button>
              )}
            </div>

            {/* Responsive Photo Grid (Web Layout: 4 columns on desktop, 2-3 on tablet/mobile) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* Upload Tile */}
              <label className="aspect-square rounded-2xl border-2 border-dashed border-white/20 bg-white/[0.03] hover:bg-white/[0.06] hover:border-[#be32ff] transition-all flex flex-col items-center justify-center p-4 text-center cursor-pointer group shadow-sm">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleMapsPhotoUpload}
                  className="hidden"
                />
                {isUploadingMapsPhoto ? (
                  <Loader2 className="w-7 h-7 text-[#be32ff] animate-spin mb-2" />
                ) : (
                  <Upload className="w-7 h-7 text-[#fc9a5d] group-hover:scale-110 transition-transform mb-2" />
                )}
                <span className="text-xs font-semibold text-white">Upload a photo</span>
                <span className="text-[10px] text-neutral-400 mt-1">JPG, PNG up to 10MB</span>
              </label>

              {/* Photos List */}
              {mapsPhotos.map((photoUrl, idx) => {
                const isSelected = selectedMapsPhotos.includes(photoUrl);
                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleMapsPhoto(photoUrl)}
                    className={`aspect-square rounded-2xl overflow-hidden relative cursor-pointer group transition-all duration-300 ${
                      isSelected
                        ? "border-2 border-[#be32ff] shadow-[0_0_20px_rgba(190,50,255,0.4)]"
                        : "border border-white/10 opacity-70 hover:opacity-100 hover:border-white/30"
                    }`}
                  >
                    <img
                      src={photoUrl}
                      alt={`Shop photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Selection Checkmark Badge */}
                    <div className="absolute top-2.5 right-2.5">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#fc9a5d] to-[#be32ff] text-white flex items-center justify-center shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-white/50 bg-black/40 backdrop-blur-sm" />
                      )}
                    </div>

                    {/* Delete Photo Button on Hover */}
                    <button
                      type="button"
                      onClick={(e) => handleRemoveMapsPhoto(photoUrl, e)}
                      aria-label="Remove photo"
                      className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 hover:bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm shadow-md"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Empty state if no photos yet */}
            {mapsPhotos.length === 0 && (
              <div className="py-12 text-center space-y-3 bg-[#0f1015]/60 border border-white/10 rounded-2xl">
                <ImageIcon className="w-10 h-10 text-neutral-500 mx-auto" />
                <h3 className="text-sm font-semibold text-white">No photos detected yet</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Click the Upload tile above to add your shop front, inside view, or product images.
                </p>
              </div>
            )}
          </div>

          {/* Sticky Bottom Bar with Continue Button */}
          <div className="sticky bottom-0 pt-6 pb-4 mt-6 bg-gradient-to-t from-[#070F22] via-[#070F22]/90 to-transparent">
            <button
              type="button"
              id="maps-photos-continue-btn"
              onClick={handleMapsPhotosContinue}
              disabled={isSavingMapsStep || selectedMapsPhotos.length === 0}
              className={`w-full h-13 sm:h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedMapsPhotos.length > 0 && !isSavingMapsStep
                  ? "bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:brightness-110 active:scale-[0.98] text-white shadow-[0_8px_30px_rgba(240,68,155,0.4)]"
                  : "bg-white/10 text-neutral-500 cursor-not-allowed border border-white/5"
              }`}
            >
              {isSavingMapsStep ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving shop photos...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MARKETPLACE STEP 1: WHICH MARKETPLACES DO YOU SELL ON?
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "marketplace_platforms" && (
        <div className="w-full max-w-md sm:max-w-lg mx-auto my-auto py-2 flex flex-col justify-between min-h-[580px] sm:min-h-[660px] animate-in fade-in duration-400 relative z-10 px-3 sm:px-4">
          <div>
            {/* Top Header: Back button + Progress bar (~25%) */}
            <div className="flex items-center gap-3 w-full mb-6">
              <button
                type="button"
                onClick={handleMarketplacePlatformsBack}
                aria-label="Go back"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "25%" }}
                />
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Which marketplaces do you sell on?
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1.5 leading-relaxed">
                Pick all that apply.
              </p>
            </div>

            {/* Selectable Cards Grid */}
            <div className="grid grid-cols-3 gap-3 sm:gap-3.5 mt-6">
              {MARKETPLACE_SELLER_PLATFORMS.map((item) => {
                const isSelected = selectedMarketplaces.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleToggleMarketplace(item.id)}
                    className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl transition-all duration-200 border text-center cursor-pointer select-none min-h-[110px] sm:min-h-[125px] ${
                      isSelected
                        ? "bg-[#be32ff]/15 border-[#be32ff] shadow-[0_0_20px_rgba(190,50,255,0.25)] ring-1 ring-[#be32ff]/60"
                        : "bg-[#131728]/75 border-white/10 hover:border-white/20 hover:bg-[#131728]"
                    }`}
                  >
                    {/* Selected Checkmark Badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] flex items-center justify-center shadow-md animate-in zoom-in-75 duration-150">
                        <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                      </div>
                    )}

                    {/* Logo Tile */}
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm overflow-hidden p-1.5 shrink-0">
                      <PlatformIcon id={item.id} name={item.name} className="w-8 h-8" />
                    </div>

                    {/* Label */}
                    <span className="mt-2.5 text-xs sm:text-sm font-semibold text-white tracking-tight line-clamp-1">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* If 'Other' is selected, reveal custom input */}
            {selectedMarketplaces.includes("other") && (
              <div className="mt-5 p-3.5 sm:p-4 rounded-2xl bg-[#131728]/80 border border-[#be32ff]/40 shadow-[0_0_20px_rgba(190,50,255,0.15)] animate-in fade-in slide-in-from-top-2 duration-200">
                <Label htmlFor="custom-marketplace-input" className="text-xs font-semibold text-neutral-300 block mb-1.5">
                  Marketplace name <span className="text-[#f0449b]">*</span>
                </Label>
                <input
                  id="custom-marketplace-input"
                  type="text"
                  value={customMarketplaceName}
                  onChange={(e) => {
                    setCustomMarketplaceName(e.target.value);
                    setError("");
                  }}
                  placeholder="e.g. Nykaa, Tata CLiQ, Etsy, Ajio"
                  className="w-full h-11 px-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#be32ff] text-white text-sm focus:outline-none placeholder:text-neutral-500 font-medium transition-all"
                  autoFocus
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 animate-in fade-in">
                <span className="font-semibold text-red-400">Notice:</span> {error}
              </div>
            )}
          </div>

          {/* Continue Button */}
          <div className="pt-6 pb-2">
            <button
              type="button"
              id="marketplace-platforms-continue-btn"
              onClick={handleMarketplacePlatformsContinue}
              disabled={
                isSavingMarketplace ||
                selectedMarketplaces.length === 0 ||
                (selectedMarketplaces.includes("other") && !customMarketplaceName.trim())
              }
              className={`w-full h-13 sm:h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedMarketplaces.length > 0 &&
                !isSavingMarketplace &&
                (!selectedMarketplaces.includes("other") || customMarketplaceName.trim())
                  ? "bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:brightness-110 active:scale-[0.98] text-white shadow-[0_8px_30px_rgba(240,68,155,0.4)]"
                  : "bg-white/10 text-neutral-500 cursor-not-allowed border border-white/5 opacity-60"
              }`}
            >
              {isSavingMarketplace ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>

            <div className="pt-3 text-center">
              <p className="text-xs sm:text-sm text-neutral-400">
                Don&apos;t have a website yet?{" "}
                <button
                  type="button"
                  onClick={() => handleCreateWebsite("marketplace")}
                  className="font-bold text-[#f0449b] hover:text-[#ff65b3] transition-colors cursor-pointer hover:underline"
                >
                  Create Website
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MARKETPLACE STEP 2: WHERE DO YOU LIST YOUR BUSINESS?
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "marketplace_listings" && (
        <div className="w-full max-w-md sm:max-w-lg mx-auto my-auto py-2 flex flex-col justify-between min-h-[580px] sm:min-h-[660px] animate-in fade-in duration-400 relative z-10 px-3 sm:px-4">
          <div>
            {/* Top Header: Back button + Progress bar (~45%) */}
            <div className="flex items-center gap-3 w-full mb-6">
              <button
                type="button"
                onClick={handleMarketplaceListingsBack}
                aria-label="Go back"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "45%" }}
                />
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Where do you list your business?
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1.5 leading-relaxed">
                Pick all that apply.
              </p>
            </div>

            {/* Selectable Cards Grid */}
            <div className="grid grid-cols-3 gap-3 sm:gap-3.5 mt-6">
              {DIRECTORY_LISTING_PLATFORMS.map((item) => {
                const isSelected = selectedListings.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleToggleListing(item.id)}
                    className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl transition-all duration-200 border text-center cursor-pointer select-none min-h-[110px] sm:min-h-[125px] ${
                      isSelected
                        ? "bg-[#be32ff]/15 border-[#be32ff] shadow-[0_0_20px_rgba(190,50,255,0.25)] ring-1 ring-[#be32ff]/60"
                        : "bg-[#131728]/75 border-white/10 hover:border-white/20 hover:bg-[#131728]"
                    }`}
                  >
                    {/* Selected Checkmark Badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] flex items-center justify-center shadow-md animate-in zoom-in-75 duration-150">
                        <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                      </div>
                    )}

                    {/* Logo Tile */}
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm overflow-hidden p-1.5 shrink-0">
                      <PlatformIcon id={item.id} name={item.name} className="w-8 h-8" />
                    </div>

                    {/* Label */}
                    <span className="mt-2.5 text-xs sm:text-sm font-semibold text-white tracking-tight line-clamp-1">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* If 'Other' is selected, reveal custom input */}
            {selectedListings.includes("other") && (
              <div className="mt-5 p-3.5 sm:p-4 rounded-2xl bg-[#131728]/80 border border-[#be32ff]/40 shadow-[0_0_20px_rgba(190,50,255,0.15)] animate-in fade-in slide-in-from-top-2 duration-200">
                <Label htmlFor="custom-listing-input" className="text-xs font-semibold text-neutral-300 block mb-1.5">
                  Directory or platform name <span className="text-[#f0449b]">*</span>
                </Label>
                <input
                  id="custom-listing-input"
                  type="text"
                  value={customListingName}
                  onChange={(e) => {
                    setCustomListingName(e.target.value);
                    setError("");
                  }}
                  placeholder="e.g. Google Business Profile, Urban Company, YellowPages"
                  className="w-full h-11 px-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#be32ff] text-white text-sm focus:outline-none placeholder:text-neutral-500 font-medium transition-all"
                  autoFocus
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 animate-in fade-in">
                <span className="font-semibold text-red-400">Notice:</span> {error}
              </div>
            )}
          </div>

          {/* Continue Button */}
          <div className="pt-6 pb-2">
            <button
              type="button"
              id="marketplace-listings-continue-btn"
              onClick={handleMarketplaceListingsContinue}
              disabled={
                isSavingMarketplace ||
                selectedListings.length === 0 ||
                (selectedListings.includes("other") && !customListingName.trim())
              }
              className={`w-full h-13 sm:h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedListings.length > 0 &&
                !isSavingMarketplace &&
                (!selectedListings.includes("other") || customListingName.trim())
                  ? "bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:brightness-110 active:scale-[0.98] text-white shadow-[0_8px_30px_rgba(240,68,155,0.4)]"
                  : "bg-white/10 text-neutral-500 cursor-not-allowed border border-white/5 opacity-60"
              }`}
            >
              {isSavingMarketplace ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MARKETPLACE STEP 3: DO YOU ALSO HAVE A WEBSITE?
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "marketplace_website" && (
        <div className="w-full max-w-md mx-auto my-auto py-2 flex flex-col justify-between min-h-[480px] sm:min-h-[540px] animate-in fade-in duration-400 relative z-10 px-2 sm:px-4">
          <div>
            {/* Top Header: Back button + Progress bar (~60%) */}
            <div className="flex items-center gap-3 w-full mb-6">
              <button
                type="button"
                onClick={handleMarketplaceWebsiteBack}
                aria-label="Go back"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "60%" }}
                />
              </div>
            </div>

            {/* Heading */}
            <div className="mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Do you also have a{" "}
                <span className="bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] bg-clip-text text-transparent">
                  website?
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1.5 leading-relaxed">
                We&apos;ll read your brand from it — skip if you don&apos;t have one.
              </p>
            </div>

            {/* Website URL Input Card matching existing website screen */}
            <div className="mt-8">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#131728]/75 border border-white/10 focus-within:border-[#BE32FF] focus-within:shadow-[0_0_25px_rgba(190,50,255,0.3)] focus-within:ring-1 focus-within:ring-[#BE32FF]/50 transition-all flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-neutral-300">
                  <Link2 className="w-5 h-5 -rotate-45 text-neutral-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    id="marketplace-website-url-input"
                    value={websiteUrl}
                    onChange={(e) => {
                      setWebsiteUrl(e.target.value);
                      setError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && isValidWebsiteUrl(websiteUrl)) {
                        handleMarketplaceWebsiteContinue();
                      }
                    }}
                    placeholder="yourbusiness.com"
                    className="w-full bg-transparent border-none text-white text-sm sm:text-base placeholder:text-neutral-500 focus:outline-none tracking-normal font-medium"
                    autoFocus
                  />
                </div>
                {websiteUrl && (
                  <button
                    type="button"
                    onClick={() => setWebsiteUrl("")}
                    className="text-neutral-500 hover:text-white transition-colors p-1"
                    aria-label="Clear input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Validation helper */}
              {websiteUrl && !isValidWebsiteUrl(websiteUrl) && (
                <p className="text-[11px] text-[#f0449b] mt-2 px-1 font-medium flex items-center gap-1.5">
                  <span>Please enter a valid website address (e.g. yourbusiness.com)</span>
                </p>
              )}

              {/* Helpful context */}
              <div className="mt-5 p-3.5 rounded-2xl bg-[#be32ff]/10 border border-[#be32ff]/20 text-xs text-neutral-300 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#be32ff] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Our AI scans your products, brand colors, voice, and category automatically from your URL.
                </span>
              </div>
            </div>

            {/* Error Notice */}
            {error && (
              <div className="mt-4 p-3 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 animate-in fade-in">
                <span className="font-semibold text-red-400">Notice:</span> {error}
              </div>
            )}
          </div>

          {/* Continue Button + Skip Action */}
          <div className="pt-4 pb-2 space-y-3">
            <button
              type="button"
              id="marketplace-website-continue-btn"
              onClick={handleMarketplaceWebsiteContinue}
              disabled={!isValidWebsiteUrl(websiteUrl) || isSavingMarketplace}
              className={`w-full h-13 sm:h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all duration-200 ${
                isValidWebsiteUrl(websiteUrl) && !isSavingMarketplace
                  ? "bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] text-white shadow-[0_8px_30px_rgba(236,72,153,0.4)] hover:brightness-110 active:scale-[0.98] cursor-pointer"
                  : "bg-white/10 text-white/40 cursor-not-allowed pointer-events-none opacity-60"
              }`}
            >
              {isSavingMarketplace ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={handleSkipMarketplaceWebsite}
                className="text-center text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors py-1 px-2 font-medium cursor-pointer"
              >
                I&apos;ll enter it myself
              </button>
              <span className="text-neutral-600 text-xs">•</span>
              <button
                type="button"
                onClick={() => handleCreateWebsite("marketplace")}
                className="font-bold text-xs sm:text-sm text-[#f0449b] hover:text-[#ff65b3] transition-colors cursor-pointer hover:underline py-1 px-2"
              >
                Create Website
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          WHOLESALE / B2B STEP 1: WHERE DO YOU SELL YOUR PRODUCTS WHOLESALE?
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "b2b_platforms" && (
        <div className="w-full max-w-md sm:max-w-lg mx-auto my-auto py-2 flex flex-col justify-between min-h-[580px] sm:min-h-[660px] animate-in fade-in duration-400 relative z-10 px-3 sm:px-4">
          <div>
            {/* Top Header: Back button + Progress bar (~25%) */}
            <div className="flex items-center gap-3 w-full mb-6">
              <button
                type="button"
                onClick={handleB2bPlatformsBack}
                aria-label="Go back"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "25%" }}
                />
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Where do you sell your products wholesale?
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1.5 leading-relaxed">
                Select all the platforms you use.
              </p>
            </div>

            {/* Selectable Cards Grid */}
            <div className="grid grid-cols-3 gap-3 sm:gap-3.5 mt-6">
              {B2B_WHOLESALE_PLATFORMS.map((item) => {
                const isSelected = selectedB2bPlatforms.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleToggleB2bPlatform(item.id)}
                    className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl transition-all duration-200 border text-center cursor-pointer select-none min-h-[110px] sm:min-h-[125px] ${
                      isSelected
                        ? "bg-[#be32ff]/15 border-[#be32ff] shadow-[0_0_20px_rgba(190,50,255,0.25)] ring-1 ring-[#be32ff]/60"
                        : "bg-[#131728]/75 border-white/10 hover:border-white/20 hover:bg-[#131728]"
                    }`}
                  >
                    {/* Selected Checkmark Badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] flex items-center justify-center shadow-md animate-in zoom-in-75 duration-150">
                        <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                      </div>
                    )}

                    {/* Logo Tile */}
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm overflow-hidden p-1.5 shrink-0">
                      <PlatformIcon id={item.id} name={item.name} className="w-8 h-8" />
                    </div>

                    {/* Label */}
                    <span className="mt-2.5 text-xs sm:text-sm font-semibold text-white tracking-tight line-clamp-1">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* If 'Other' is selected, reveal custom input */}
            {selectedB2bPlatforms.includes("other") && (
              <div className="mt-5 p-3.5 sm:p-4 rounded-2xl bg-[#131728]/80 border border-[#be32ff]/40 shadow-[0_0_20px_rgba(190,50,255,0.15)] animate-in fade-in slide-in-from-top-2 duration-200">
                <Label htmlFor="custom-b2b-platform-input" className="text-xs font-semibold text-neutral-300 block mb-1.5">
                  Wholesale platform name <span className="text-[#f0449b]">*</span>
                </Label>
                <input
                  id="custom-b2b-platform-input"
                  type="text"
                  value={customB2bPlatformName}
                  onChange={(e) => {
                    setCustomB2bPlatformName(e.target.value);
                    setError("");
                  }}
                  placeholder="e.g. IndustryBuying, Moglix, Power2SME"
                  className="w-full h-11 px-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#be32ff] text-white text-sm focus:outline-none placeholder:text-neutral-500 font-medium transition-all"
                  autoFocus
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 animate-in fade-in">
                <span className="font-semibold text-red-400">Notice:</span> {error}
              </div>
            )}
          </div>

          {/* Continue Button */}
          <div className="pt-6 pb-2">
            <button
              type="button"
              id="b2b-platforms-continue-btn"
              onClick={handleB2bPlatformsContinue}
              disabled={
                isSavingB2b ||
                selectedB2bPlatforms.length === 0 ||
                (selectedB2bPlatforms.includes("other") && !customB2bPlatformName.trim())
              }
              className={`w-full h-13 sm:h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedB2bPlatforms.length > 0 &&
                !isSavingB2b &&
                (!selectedB2bPlatforms.includes("other") || customB2bPlatformName.trim())
                  ? "bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:brightness-110 active:scale-[0.98] text-white shadow-[0_8px_30px_rgba(240,68,155,0.4)]"
                  : "bg-white/10 text-neutral-500 cursor-not-allowed border border-white/5 opacity-60"
              }`}
            >
              {isSavingB2b ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>

            <div className="pt-3 text-center">
              <p className="text-xs sm:text-sm text-neutral-400">
                Don&apos;t have a website yet?{" "}
                <button
                  type="button"
                  onClick={() => handleCreateWebsite("b2b")}
                  className="font-bold text-[#f0449b] hover:text-[#ff65b3] transition-colors cursor-pointer hover:underline"
                >
                  Create Website
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          WHOLESALE / B2B STEP 2: WHERE ELSE DOES YOUR BUSINESS SELL?
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "b2b_listings" && (
        <div className="w-full max-w-md sm:max-w-lg mx-auto my-auto py-2 flex flex-col justify-between min-h-[580px] sm:min-h-[660px] animate-in fade-in duration-400 relative z-10 px-3 sm:px-4">
          <div>
            {/* Top Header: Back button + Progress bar (~45%) */}
            <div className="flex items-center gap-3 w-full mb-6">
              <button
                type="button"
                onClick={handleB2bListingsBack}
                aria-label="Go back"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "45%" }}
                />
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Where else does your business sell?
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1.5 leading-relaxed">
                Pick all that apply.
              </p>
            </div>

            {/* Selectable Cards Grid */}
            <div className="grid grid-cols-3 gap-3 sm:gap-3.5 mt-6">
              {B2B_ADDITIONAL_LISTINGS.map((item) => {
                const isSelected = selectedB2bListings.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleToggleB2bListing(item.id)}
                    className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl transition-all duration-200 border text-center cursor-pointer select-none min-h-[110px] sm:min-h-[125px] ${
                      isSelected
                        ? "bg-[#be32ff]/15 border-[#be32ff] shadow-[0_0_20px_rgba(190,50,255,0.25)] ring-1 ring-[#be32ff]/60"
                        : "bg-[#131728]/75 border-white/10 hover:border-white/20 hover:bg-[#131728]"
                    }`}
                  >
                    {/* Selected Checkmark Badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] flex items-center justify-center shadow-md animate-in zoom-in-75 duration-150">
                        <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                      </div>
                    )}

                    {/* Logo Tile */}
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm overflow-hidden p-1.5 shrink-0">
                      <PlatformIcon id={item.id} name={item.name} className="w-8 h-8" />
                    </div>

                    {/* Label */}
                    <span className="mt-2.5 text-xs sm:text-sm font-semibold text-white tracking-tight line-clamp-1">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* If 'Other' is selected, reveal custom input */}
            {selectedB2bListings.includes("other") && (
              <div className="mt-5 p-3.5 sm:p-4 rounded-2xl bg-[#131728]/80 border border-[#be32ff]/40 shadow-[0_0_20px_rgba(190,50,255,0.15)] animate-in fade-in slide-in-from-top-2 duration-200">
                <Label htmlFor="custom-b2b-listing-input" className="text-xs font-semibold text-neutral-300 block mb-1.5">
                  Platform or channel name <span className="text-[#f0449b]">*</span>
                </Label>
                <input
                  id="custom-b2b-listing-input"
                  type="text"
                  value={customB2bListingName}
                  onChange={(e) => {
                    setCustomB2bListingName(e.target.value);
                    setError("");
                  }}
                  placeholder="e.g. Local Mandi, Trade Directories, Direct Distributor"
                  className="w-full h-11 px-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#be32ff] text-white text-sm focus:outline-none placeholder:text-neutral-500 font-medium transition-all"
                  autoFocus
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 animate-in fade-in">
                <span className="font-semibold text-red-400">Notice:</span> {error}
              </div>
            )}
          </div>

          {/* Continue Button */}
          <div className="pt-6 pb-2">
            <button
              type="button"
              id="b2b-listings-continue-btn"
              onClick={handleB2bListingsContinue}
              disabled={
                isSavingB2b ||
                selectedB2bListings.length === 0 ||
                (selectedB2bListings.includes("other") && !customB2bListingName.trim())
              }
              className={`w-full h-13 sm:h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedB2bListings.length > 0 &&
                !isSavingB2b &&
                (!selectedB2bListings.includes("other") || customB2bListingName.trim())
                  ? "bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:brightness-110 active:scale-[0.98] text-white shadow-[0_8px_30px_rgba(240,68,155,0.4)]"
                  : "bg-white/10 text-neutral-500 cursor-not-allowed border border-white/5 opacity-60"
              }`}
            >
              {isSavingB2b ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          WHOLESALE / B2B STEP 3: DO YOU HAVE A WEBSITE OR ONLINE STOREFRONT?
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "b2b_website" && (
        <div className="w-full max-w-md mx-auto my-auto py-2 flex flex-col justify-between min-h-[480px] sm:min-h-[540px] animate-in fade-in duration-400 relative z-10 px-2 sm:px-4">
          <div>
            {/* Top Header: Back button + Progress bar (~60%) */}
            <div className="flex items-center gap-3 w-full mb-6">
              <button
                type="button"
                onClick={handleB2bWebsiteBack}
                aria-label="Go back"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "60%" }}
                />
              </div>
            </div>

            {/* Heading */}
            <div className="mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Do you have a website or{" "}
                <span className="bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] bg-clip-text text-transparent">
                  online storefront?
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1.5 leading-relaxed">
                Add your link so we can understand your business — or skip and enter details yourself.
              </p>
            </div>

            {/* Website URL Input Card */}
            <div className="mt-8">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#131728]/75 border border-white/10 focus-within:border-[#BE32FF] focus-within:shadow-[0_0_25px_rgba(190,50,255,0.3)] focus-within:ring-1 focus-within:ring-[#BE32FF]/50 transition-all flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-neutral-300">
                  <Link2 className="w-5 h-5 -rotate-45 text-neutral-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    id="b2b-website-url-input"
                    value={websiteUrl}
                    onChange={(e) => {
                      setWebsiteUrl(e.target.value);
                      setError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && isValidWebsiteUrl(websiteUrl)) {
                        handleB2bWebsiteContinue();
                      }
                    }}
                    placeholder="yourbusiness.com"
                    className="w-full bg-transparent border-none text-white text-sm sm:text-base placeholder:text-neutral-500 focus:outline-none tracking-normal font-medium"
                    autoFocus
                  />
                </div>
                {websiteUrl && (
                  <button
                    type="button"
                    onClick={() => setWebsiteUrl("")}
                    className="text-neutral-500 hover:text-white transition-colors p-1"
                    aria-label="Clear input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Validation helper */}
              {websiteUrl && !isValidWebsiteUrl(websiteUrl) && (
                <p className="text-[11px] text-[#f0449b] mt-2 px-1 font-medium flex items-center gap-1.5">
                  <span>Please enter a valid website address (e.g. yourbusiness.com)</span>
                </p>
              )}

              {/* Helpful context */}
              <div className="mt-5 p-3.5 rounded-2xl bg-[#be32ff]/10 border border-[#be32ff]/20 text-xs text-neutral-300 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#be32ff] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Our AI scans your products, catalog, brand colors, voice, and category automatically from your link.
                </span>
              </div>
            </div>

            {/* Error Notice */}
            {error && (
              <div className="mt-4 p-3 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 animate-in fade-in">
                <span className="font-semibold text-red-400">Notice:</span> {error}
              </div>
            )}
          </div>

          {/* Continue Button + Skip Action */}
          <div className="pt-4 pb-2 space-y-3">
            <button
              type="button"
              id="b2b-website-continue-btn"
              onClick={handleB2bWebsiteContinue}
              disabled={!isValidWebsiteUrl(websiteUrl) || isSavingB2b}
              className={`w-full h-13 sm:h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all duration-200 ${
                isValidWebsiteUrl(websiteUrl) && !isSavingB2b
                  ? "bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] text-white shadow-[0_8px_30px_rgba(236,72,153,0.4)] hover:brightness-110 active:scale-[0.98] cursor-pointer"
                  : "bg-white/10 text-white/40 cursor-not-allowed pointer-events-none opacity-60"
              }`}
            >
              {isSavingB2b ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={handleSkipB2bWebsite}
                className="text-center text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors py-1 px-2 font-medium cursor-pointer"
              >
                I&apos;ll enter it myself
              </button>
              <span className="text-neutral-600 text-xs">•</span>
              <button
                type="button"
                onClick={() => handleCreateWebsite("b2b")}
                className="font-bold text-xs sm:text-sm text-[#f0449b] hover:text-[#ff65b3] transition-colors cursor-pointer hover:underline py-1 px-2"
              >
                Create Website
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          NO ONLINE PRESENCE STEP 1: BUSINESS BASICS & WHAT TO PROMOTE (none_details)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "none_details" && (
        <div className="w-full max-w-xl sm:max-w-2xl mx-auto my-auto py-2 flex flex-col justify-between min-h-[580px] sm:min-h-[660px] animate-in fade-in duration-400 relative z-10 px-3 sm:px-6">
          <div className="space-y-6">
            {/* Top Header: Back button + Progress bar (~45%) + Completion Status */}
            <div className="flex items-center gap-3 w-full mb-2">
              <button
                type="button"
                onClick={handleNoneDetailsBack}
                aria-label="Go back"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "45%" }}
                />
              </div>
              <span className="text-[11px] text-[#be32ff] font-semibold bg-[#be32ff]/10 px-2.5 py-1 rounded-full border border-[#be32ff]/20 shrink-0 hidden sm:inline-block">
                Brand Kit · Step 1
              </span>
            </div>

            {/* Friendly Non-Blocking Banner */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-[#be32ff]/10 border border-[#be32ff]/20 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#be32ff] shrink-0 mt-0.5" />
              <div className="text-xs text-neutral-300 space-y-0.5">
                <span className="font-semibold text-white block">
                  Flexible Brand Kit Setup
                </span>
                <span className="text-neutral-400 leading-relaxed block">
                  Only business name is required. You can complete or update your Brand Kit anytime later in Settings.
                </span>
              </div>
            </div>

            {/* Heading & Subtitle */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Tell us about your{" "}
                <span className="bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] bg-clip-text text-transparent">
                  business
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-light">
                We&apos;ll use this information to craft personalized AI posts, ads, and graphics for your brand.
              </p>
            </div>

            {/* Form Fields Container */}
            <div className="space-y-4">
              {/* Field 1: Business Name (Required *) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="none-b-name" className="text-xs font-semibold text-neutral-300">
                    Business name <span className="text-rose-400">*</span>
                  </Label>
                  <span className="text-[11px] text-neutral-500">Required</span>
                </div>
                <Input
                  id="none-b-name"
                  type="text"
                  value={businessProfile.business_name}
                  onChange={(e) => {
                    setBusinessProfile({ ...businessProfile, business_name: e.target.value });
                    setError("");
                  }}
                  placeholder="e.g. Amber & Oak Studio, Ramesh Textiles, Green Cafe"
                  className="h-12 rounded-2xl bg-[#0f1015] border-white/15 text-white text-sm sm:text-base focus:border-[#be32ff] px-4 font-medium"
                  autoFocus
                />
              </div>

              {/* Field 2: Business Category & Suggested Niches */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-neutral-300">
                    Category & industry <span className="text-neutral-500 font-normal">(Optional)</span>
                  </Label>
                  <button
                    type="button"
                    onClick={() => setIsNoneCategoryOpen(true)}
                    className="text-xs text-[#be32ff] hover:text-[#fc9a5d] transition-colors flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <span>Browse all categories</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Active Category Display & Picker Trigger */}
                <div
                  onClick={() => setIsNoneCategoryOpen(true)}
                  className="h-12 px-4 rounded-2xl bg-[#0f1015] border border-white/15 hover:border-white/30 transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Store className="w-4 h-4 text-[#be32ff]" />
                    <span className="text-sm font-semibold text-white">{noneCategory}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-neutral-400" />
                </div>

                {/* Quick Category Chips for Fast 1-Tap Switching */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["Fashion & Apparel", "Jewellery", "Restaurant & Cafe", "Beauty & Wellness", "Grocery & Supermarket", "Tech & Electronics"].map(
                    (cat) => {
                      const isSelected = noneCategory.toLowerCase() === cat.toLowerCase();
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setNoneCategory(cat);
                            const matched = BUSINESS_CATEGORIES.find((c) => c.name.toLowerCase() === cat.toLowerCase());
                            if (matched && !noneProducts.trim()) {
                              setNoneProducts(matched.defaultPromote);
                            }
                          }}
                          className={`text-xs px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#be32ff]/20 text-[#be32ff] font-bold border border-[#be32ff]/40 shadow-[0_0_10px_rgba(190,50,255,0.2)]"
                              : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/10"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    }
                  )}
                </div>

                {/* Optional Sub-category / Niche */}
                <div className="pt-1.5 space-y-1.5">
                  <Input
                    type="text"
                    value={noneSubCategory}
                    onChange={(e) => setNoneSubCategory(e.target.value)}
                    placeholder="Specific niche / sub-category (e.g. Organic sourdough, Bridal lehengas)"
                    className="h-10 rounded-xl bg-white/5 border-white/10 text-white text-xs sm:text-sm focus:border-[#be32ff] px-3.5"
                  />

                  {/* Dynamic Suggested Niche Chips from Selected Category */}
                  {(() => {
                    const matchedCat = BUSINESS_CATEGORIES.find((c) => c.name.toLowerCase() === noneCategory.toLowerCase());
                    if (!matchedCat || !matchedCat.suggestedNiches?.length) return null;
                    return (
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className="text-[11px] text-neutral-500 font-medium">Quick suggestions:</span>
                        {matchedCat.suggestedNiches.slice(0, 4).map((niche) => (
                          <button
                            key={niche}
                            type="button"
                            onClick={() => setNoneSubCategory(niche)}
                            className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                          >
                            + {niche}
                          </button>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Field 3: What should we promote? (Optional) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="none-b-promote" className="text-xs font-semibold text-neutral-300">
                    Products or services to promote <span className="text-neutral-500 font-normal">(Optional)</span>
                  </Label>
                </div>
                <Input
                  id="none-b-promote"
                  type="text"
                  value={noneProducts}
                  onChange={(e) => setNoneProducts(e.target.value)}
                  placeholder="e.g. Artisanal sourdough breads, birthday cakes, breakfast hampers"
                  className="h-12 rounded-2xl bg-[#0f1015] border-white/15 text-white text-sm focus:border-[#be32ff] px-4"
                />
              </div>

              {/* Field 4: Target Audience (Optional) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="none-b-audience" className="text-xs font-semibold text-neutral-300">
                    Target audience <span className="text-neutral-500 font-normal">(Optional)</span>
                  </Label>
                </div>
                <Input
                  id="none-b-audience"
                  type="text"
                  value={noneAudience}
                  onChange={(e) => setNoneAudience(e.target.value)}
                  placeholder="e.g. Local neighborhood foodies, young families, office workers"
                  className="h-12 rounded-2xl bg-[#0f1015] border-white/15 text-white text-sm focus:border-[#be32ff] px-4"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["Local Walk-in Customers", "Young Adults & Gen-Z", "Families with Kids", "Working Professionals", "Pan-India Buyers"].map((aud) => (
                    <button
                      key={aud}
                      type="button"
                      onClick={() => setNoneAudience(aud)}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    >
                      + {aud}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 5: What makes you different / Differentiators (Optional) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="none-b-diff" className="text-xs font-semibold text-neutral-300">
                    What makes your business different? <span className="text-neutral-500 font-normal">(Optional)</span>
                  </Label>
                </div>
                <Input
                  id="none-b-diff"
                  type="text"
                  value={noneDifferentiator}
                  onChange={(e) => setNoneDifferentiator(e.target.value)}
                  placeholder="e.g. 100% organic, baked fresh daily, custom designs, fastest delivery"
                  className="h-12 rounded-2xl bg-[#0f1015] border-white/15 text-white text-sm focus:border-[#be32ff] px-4"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["100% Pure & Handcrafted", "Best Prices Guaranteed", "Freshly Made Daily", "Fast Local Delivery", "Customized to Order"].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setNoneDifferentiator(diff)}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    >
                      + {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 6: Short Business Description (Optional) */}
              <div className="space-y-1.5">
                <Label htmlFor="none-b-desc" className="text-xs font-semibold text-neutral-300">
                  Business story / description <span className="text-neutral-500 font-normal">(Optional)</span>
                </Label>
                <textarea
                  id="none-b-desc"
                  rows={2}
                  value={noneDescription}
                  onChange={(e) => setNoneDescription(e.target.value)}
                  placeholder="Tell us a little about your business background or specialities..."
                  className="w-full p-3 rounded-2xl bg-[#0f1015] border border-white/15 text-white text-xs sm:text-sm focus:border-[#be32ff] focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 animate-in fade-in">
                <span className="font-semibold text-rose-400">Notice:</span> {error}
              </div>
            )}
          </div>

          {/* Sticky Bottom Bar with Continue and Skip for now */}
          <div className="pt-6 pb-2 space-y-3">
            <button
              type="button"
              id="none-details-continue-btn"
              onClick={handleNoneDetailsContinue}
              disabled={isSavingBrandKitStep}
              className="w-full h-13 sm:h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:brightness-110 active:scale-[0.98] text-white shadow-[0_8px_30px_rgba(240,68,155,0.4)]"
            >
              {isSavingBrandKitStep ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Continue to Brand Style</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleNoneDetailsSkip}
              className="w-full text-center text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors py-1.5 font-medium cursor-pointer"
            >
              Skip for now · Continue with defaults
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          NO ONLINE PRESENCE STEP 2: BRAND KIT STYLE & CREATIVE IDENTITY (none_brand_kit)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "none_brand_kit" && (
        <div className="w-full max-w-xl sm:max-w-2xl mx-auto my-auto py-2 flex flex-col justify-between min-h-[580px] sm:min-h-[660px] animate-in fade-in duration-400 relative z-10 px-3 sm:px-6">
          <div className="space-y-6">
            {/* Top Header: Back button + Progress bar (~70%) + Badge */}
            <div className="flex items-center gap-3 w-full mb-2">
              <button
                type="button"
                onClick={handleNoneBrandKitBack}
                aria-label="Go back"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "70%" }}
                />
              </div>
              <span className="text-[11px] text-[#f0449b] font-semibold bg-[#f0449b]/10 px-2.5 py-1 rounded-full border border-[#f0449b]/20 shrink-0 hidden sm:inline-block">
                Brand Kit · Step 2
              </span>
            </div>

            {/* Heading & Subtitle */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Customize your{" "}
                <span className="bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] bg-clip-text text-transparent">
                  Brand Kit
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-light">
                Choose your brand colors, typography, tone, and logo for AI creatives. Everything is optional and editable later.
              </p>
            </div>

            {/* ─── SECTION 1: LOGO UPLOAD (OPTIONAL) ─── */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#131728]/75 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#be32ff]" />
                  <span className="text-xs sm:text-sm font-semibold text-white">Brand Logo</span>
                  <span className="text-[11px] text-neutral-500">(Optional)</span>
                </div>
                {logoPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveBrandLogo}
                    className="text-xs text-rose-400 hover:text-rose-300 font-medium cursor-pointer"
                  >
                    Remove logo
                  </button>
                )}
              </div>

              {logoPreview ? (
                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/15 overflow-hidden flex items-center justify-center p-1.5 shrink-0">
                    <img src={logoPreview} alt="Brand Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs font-semibold text-white truncate">Logo ready for creatives</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Will be placed on all AI generated posters and banners.
                    </p>
                  </div>
                  <label
                    htmlFor="brand-kit-logo-input"
                    className="text-xs font-medium text-[#be32ff] hover:text-[#fc9a5d] px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                  >
                    Change
                  </label>
                  <input
                    id="brand-kit-logo-input"
                    type="file"
                    accept="image/*"
                    onChange={handleBrandLogoUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="brand-kit-logo-input"
                    className="flex flex-col items-center justify-center p-5 rounded-xl border border-dashed border-white/20 hover:border-[#be32ff]/60 bg-white/[0.02] hover:bg-[#be32ff]/[0.04] transition-all cursor-pointer group text-center"
                  >
                    {isUploadingBrandLogo ? (
                      <Loader2 className="w-6 h-6 text-[#be32ff] animate-spin mb-1.5" />
                    ) : (
                      <Upload className="w-6 h-6 text-neutral-400 group-hover:text-[#be32ff] transition-colors mb-1.5" />
                    )}
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      Click to upload your logo
                    </span>
                    <span className="text-[11px] text-neutral-500 mt-0.5">
                      PNG, JPG, SVG, WebP up to 5MB (Transparent background recommended)
                    </span>
                    <span className="text-[11px] text-[#be32ff] font-medium mt-2 bg-[#be32ff]/10 px-2 py-0.5 rounded-md">
                      No logo? Skip it — AI creates one or uses smart typography!
                    </span>
                  </label>
                  <input
                    id="brand-kit-logo-input"
                    type="file"
                    accept="image/*"
                    onChange={handleBrandLogoUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* ─── SECTION 2: BRAND COLORS & 1-CLICK PRESETS ─── */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#131728]/75 border border-white/10 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#f0449b]" />
                  <span className="text-xs sm:text-sm font-semibold text-white">Brand Colors</span>
                  <span className="text-[11px] text-neutral-500">(Curated presets)</span>
                </div>
                {/* Active Palette Preview */}
                <div className="flex items-center gap-1.5">
                  {brandPreferences.palette.slice(0, 3).map((col, idx) => (
                    <div
                      key={idx}
                      className="w-5 h-5 rounded-full border border-white/30 shadow-sm"
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>

              {/* 6 Curated 1-Click Color Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CURATED_COLOR_PRESETS.map((preset) => {
                  const isSelected =
                    brandPreferences.palette[0]?.toLowerCase() === preset.primary.toLowerCase();
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleSelectColorPreset(preset)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#be32ff]/15 border-[#be32ff] shadow-[0_0_15px_rgba(190,50,255,0.25)]"
                          : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center -space-x-1.5">
                          <span
                            className="w-5 h-5 rounded-full border border-white/40 shadow-sm"
                            style={{ backgroundColor: preset.primary }}
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-white/40 shadow-sm"
                            style={{ backgroundColor: preset.secondary }}
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-white/40 shadow-sm"
                            style={{ backgroundColor: preset.accent }}
                          />
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#be32ff]" />}
                      </div>
                      <span className="text-[11px] font-semibold text-white truncate">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Color Adjustment */}
              <div className="pt-1 flex items-center justify-between text-xs text-neutral-400 border-t border-white/5">
                <span>Or pick custom colors:</span>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <span className="text-[11px]">Primary:</span>
                    <input
                      type="color"
                      value={brandPreferences.palette[0] || "#BE32FF"}
                      onChange={(e) => {
                        const col = e.target.value;
                        setBrandPreferences((prev) => ({
                          ...prev,
                          palette: [col, prev.palette[1] || "#F0449B", prev.palette[2] || "#FC9A5D"],
                        }));
                        setBusinessProfile((prev) => ({ ...prev, brand_color: col }));
                      }}
                      className="w-6 h-6 rounded-full border border-white/30 cursor-pointer overflow-hidden bg-transparent"
                    />
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <span className="text-[11px]">Secondary:</span>
                    <input
                      type="color"
                      value={brandPreferences.palette[1] || "#F0449B"}
                      onChange={(e) => {
                        const col = e.target.value;
                        setBrandPreferences((prev) => ({
                          ...prev,
                          palette: [prev.palette[0] || "#BE32FF", col, prev.palette[2] || "#FC9A5D"],
                        }));
                      }}
                      className="w-6 h-6 rounded-full border border-white/30 cursor-pointer overflow-hidden bg-transparent"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* ─── SECTION 3: TYPOGRAPHY / FONT ─── */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#131728]/75 border border-white/10 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#fc9a5d]" />
                  <span className="text-xs sm:text-sm font-semibold text-white">Typography / Font Style</span>
                  <span className="text-[11px] text-neutral-500">(Headline font)</span>
                </div>
                <span className="text-xs font-semibold text-[#be32ff]">{selectedFont}</span>
              </div>

              {/* Supported Fonts Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SUPPORTED_FONTS.map((f) => {
                  const isSelected = selectedFont.toLowerCase() === f.name.toLowerCase();
                  return (
                    <button
                      key={f.name}
                      type="button"
                      onClick={() => setSelectedFont(f.name)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#be32ff]/15 border-[#be32ff] shadow-[0_0_12px_rgba(190,50,255,0.2)]"
                          : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{f.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#be32ff]" />}
                      </div>
                      <span className="text-[10px] text-neutral-400 block mb-1">{f.category}</span>
                      <span className="text-[11px] text-neutral-300 font-medium block truncate">
                        {f.sample}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ─── SECTION 4: BRAND VOICE / TONE ─── */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#131728]/75 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#be32ff]" />
                  <span className="text-xs sm:text-sm font-semibold text-white">Brand Voice / Tone</span>
                  <span className="text-[11px] text-neutral-500">(Select multiple)</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  "Modern",
                  "Professional",
                  "Friendly",
                  "Bold",
                  "Luxurious",
                  "Festive",
                  "Desi / Authentic",
                  "Warm",
                  "Fun & Playful",
                  "Minimal",
                ].map((tone) => {
                  const isSelected = brandPreferences.tones.includes(tone);
                  return (
                    <button
                      key={tone}
                      type="button"
                      onClick={() => handleToggleTone(tone)}
                      className={`text-xs px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#be32ff]/20 text-[#be32ff] font-bold border border-[#be32ff]/50 shadow-[0_0_10px_rgba(190,50,255,0.2)]"
                          : "bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {tone}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ─── SECTION 5: AI CONTENT LANGUAGE ─── */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#131728]/75 border border-white/10 space-y-2.5">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="text-xs sm:text-sm font-semibold text-white">AI Content Language</span>
                <span className="text-[11px] text-neutral-500">(For captions & ad copy)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "English", label: "English" },
                  { id: "hinglish", label: "Hinglish (Conversational)" },
                  { id: "hindi", label: "हिंदी (Hindi)" },
                  { id: "marathi", label: "मराठी (Marathi)" },
                  { id: "gujarati", label: "ગુજરાતી (Gujarati)" },
                  { id: "bengali", label: "বাংলা (Bengali)" },
                  { id: "tamil", label: "தமிழ் (Tamil)" },
                ].map((lang) => {
                  const isSelected =
                    brandPreferences.language.toLowerCase() === lang.id.toLowerCase() ||
                    (lang.id === "English" && brandPreferences.language === "English");
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setBrandPreferences({ ...brandPreferences, language: lang.id })}
                      className={`text-xs px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#f0449b]/20 text-[#f0449b] font-bold border border-[#f0449b]/50 shadow-[0_0_10px_rgba(240,68,155,0.2)]"
                          : "bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      {lang.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 animate-in fade-in">
                <span className="font-semibold text-rose-400">Notice:</span> {error}
              </div>
            )}
          </div>

          {/* Sticky Bottom Bar with Continue and Skip */}
          <div className="pt-6 pb-2 space-y-3">
            <button
              type="button"
              id="none-brand-kit-continue-btn"
              onClick={handleNoneBrandKitContinue}
              disabled={isSavingBrandKitStep}
              className="w-full h-13 sm:h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:brightness-110 active:scale-[0.98] text-white shadow-[0_8px_30px_rgba(240,68,155,0.4)]"
            >
              {isSavingBrandKitStep ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving Brand Kit...</span>
                </>
              ) : (
                <>
                  <span>Save & Continue</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleNoneBrandKitSkip}
              className="w-full text-center text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors py-1.5 font-medium cursor-pointer"
            >
              Skip for now · Use defaults
            </button>
          </div>
        </div>
      )}

      {/* ─── Category Selection Modal for No Online Presence Flow ─── */}
      {isNoneCategoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md max-h-[85vh] bg-[#0c1222] border border-white/15 rounded-3xl p-5 sm:p-6 flex flex-col shadow-2xl relative">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Select business category</h3>
              <button
                type="button"
                onClick={() => {
                  setIsNoneCategoryOpen(false);
                  setNoneCategorySearch("");
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-neutral-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="py-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  type="text"
                  value={noneCategorySearch}
                  onChange={(e) => setNoneCategorySearch(e.target.value)}
                  placeholder="Search categories (e.g. fashion, bakery, salon)..."
                  className="h-11 pl-10 pr-9 rounded-xl bg-[#0f1015] border-white/15 text-white text-xs sm:text-sm focus:border-[#be32ff]"
                  autoFocus
                />
                {noneCategorySearch && (
                  <button
                    type="button"
                    onClick={() => setNoneCategorySearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Category List */}
            <div className="flex-1 overflow-y-auto space-y-1 divide-y divide-white/5 pr-1 max-h-[55vh]">
              {BUSINESS_CATEGORIES.filter((c) =>
                c.name.toLowerCase().includes(noneCategorySearch.toLowerCase())
              ).map((cat) => {
                const isSelected = noneCategory.toLowerCase() === cat.name.toLowerCase();
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => {
                      setNoneCategory(cat.name);
                      if (!noneProducts.trim()) {
                        setNoneProducts(cat.defaultPromote);
                      }
                      setIsNoneCategoryOpen(false);
                      setNoneCategorySearch("");
                    }}
                    className={`w-full p-3 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#be32ff]/15 text-white font-bold"
                        : "text-neutral-300 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <span className="text-xs sm:text-sm">{cat.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#be32ff] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 4: LET'S MAKE YOUR FIRST THING (Reference Screenshot 3)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "first_thing" && (
        <div className="w-full max-w-md mx-auto my-auto py-2 flex flex-col justify-between min-h-[580px] sm:min-h-[660px] animate-in fade-in duration-400 relative z-10 px-3 sm:px-4">
          <div>
            {/* Top Header: Back button + Progress Indicator (~75%) */}
            <div className="flex items-center gap-3 w-full mb-4">
              <button
                type="button"
                onClick={handleFirstThingBack}
                aria-label="Go back"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "75%" }}
                />
              </div>
            </div>

            {/* Video / Guide Hero Banner */}
            <div className="relative rounded-2xl overflow-hidden mb-5 border border-white/10 bg-gradient-to-b from-neutral-900 to-neutral-950 aspect-[16/9] shadow-xl flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"
                alt="Create First Post Guide"
                className="w-full h-full object-cover object-center opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 text-xs font-bold text-white tracking-wide drop-shadow-md">
                Create Your First Post
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90">
                <span className="font-medium drop-shadow">Business setup complete ho gaya</span>
                <span className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded-full text-[10px] backdrop-blur-sm">
                  <Volume2 className="w-3 h-3" /> Tap to mute
                </span>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
                Let&apos;s make your first thing
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400">
                What should we make first for {businessProfile.business_name || businessDetails.business_name || "SevenUnique Tech Solutions"}?
              </p>
            </div>

            {/* Exactly 3 Choices: Post Maker (Recommended), AI Photo Shoot, Reel Maker */}
            <div className="space-y-3">
              {/* Option 1: Post Maker (Recommended) */}
              <div
                onClick={() => setFirstThingChoice("post_maker")}
                className={`relative rounded-2xl p-3.5 border transition-all cursor-pointer ${
                  firstThingChoice === "post_maker"
                    ? "border-emerald-500 bg-emerald-500/[0.08] shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-white text-lg tracking-tight">
                        Post <span className="italic font-serif font-normal text-emerald-400">Maker.</span>
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">Ready for Instagram & WhatsApp</p>
                  </div>
                  {/* Recommended badge + thumbnail strip */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" /> recommended
                    </span>
                    <div className="flex -space-x-2">
                      <img
                        src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=120&auto=format&fit=crop&q=80"
                        alt="Promo sample"
                        className="w-10 h-10 rounded-lg object-cover border border-white/20 shadow"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120&auto=format&fit=crop&q=80"
                        alt="Promo sample 2"
                        className="w-10 h-10 rounded-lg object-cover border border-white/20 shadow"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-emerald-400/90 italic mt-2">
                  Because customers buy these with their eyes
                </p>
              </div>

              {/* Option 2: AI Photo Shoot */}
              <div
                onClick={() => setFirstThingChoice("photoshoot")}
                className={`relative rounded-2xl p-3.5 border transition-all cursor-pointer ${
                  firstThingChoice === "photoshoot"
                    ? "border-emerald-500 bg-emerald-500/[0.08] shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-white text-lg tracking-tight">
                        AI Photo <span className="italic font-serif font-normal text-purple-400">Shoot.</span>
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">Studio-grade product shots with AI</p>
                  </div>
                  <div className="flex -space-x-2 shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=120&auto=format&fit=crop&q=80"
                      alt="Product shot"
                      className="w-10 h-10 rounded-lg object-cover border border-white/20 shadow"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=120&auto=format&fit=crop&q=80"
                      alt="Product shot 2"
                      className="w-10 h-10 rounded-lg object-cover border border-white/20 shadow"
                    />
                  </div>
                </div>
              </div>

              {/* Option 3: Reel Maker */}
              <div
                onClick={() => setFirstThingChoice("reel_maker")}
                className={`relative rounded-2xl p-3.5 border transition-all cursor-pointer ${
                  firstThingChoice === "reel_maker"
                    ? "border-emerald-500 bg-emerald-500/[0.08] shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-white text-lg tracking-tight">
                        Reel <span className="italic font-serif font-normal text-pink-400">Maker.</span>
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">Ready for Instagram & YouTube Shorts</p>
                  </div>
                  <div className="shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                      alt="Reel model"
                      className="w-10 h-10 rounded-lg object-cover border border-white/20 shadow"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Card + CTA */}
          <div className="pt-4 pb-2 space-y-3">
            <div className="flex items-center justify-center">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5" /> First one&apos;s on us — no card needed
              </span>
            </div>

            <button
              type="button"
              onClick={handleFirstThingContinue}
              disabled={isSavingFirstThing}
              className="w-full h-13 sm:h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_8px_30px_rgba(16,185,129,0.35)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSavingFirstThing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 5: POST MAKER - PICK A PHOTO PER POST (Reference Screenshot 4)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "post_maker_pick" && (
        <div className="w-full max-w-md mx-auto my-auto py-2 flex flex-col justify-between min-h-[580px] sm:min-h-[660px] animate-in fade-in duration-400 relative z-10 px-3 sm:px-4">
          {isGeneratingPosts ? (
            /* Real Post Generation Loading Screen */
            <div className="flex-1 flex flex-col justify-between py-6 animate-in fade-in duration-300">
              <div className="space-y-6 text-center">
                <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
                  POST MAKER
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Generating {businessProfile.business_name || businessDetails.business_name}&apos;s 3 posts...
                </h2>

                {/* Animated Pulsing Ring */}
                <div className="relative w-28 h-28 mx-auto my-6 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-ping" />
                  <div className="absolute inset-2 rounded-full border-2 border-emerald-500/50 animate-pulse" />
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/60 flex items-center justify-center backdrop-blur-md">
                    <Loader2 className="w-9 h-9 text-emerald-400 animate-spin" />
                  </div>
                </div>

                {/* Real generation status updates */}
                <p className="text-sm font-medium text-emerald-300/90 animate-pulse px-4">
                  {generationStatusText}
                </p>
              </div>

              {/* "Get notified when your ads are ready" section */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md space-y-3 mt-6">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <span>Get notified when your ads are ready</span>
                </div>
                <p className="text-xs text-neutral-400">
                  Don&apos;t want to wait? We will alert you immediately once creative rendering completes.
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={notifyContact}
                    onChange={(e) => setNotifyContact(e.target.value)}
                    placeholder="Enter phone or email"
                    className="h-10 bg-black/40 border-white/10 text-white placeholder:text-neutral-500 text-xs rounded-xl"
                  />
                  <Button
                    type="button"
                    onClick={() => setIsNotifySubmitted(true)}
                    className="h-10 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold shrink-0"
                  >
                    {isNotifySubmitted ? "✓ Saved" : "Notify me"}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div>
                {/* Top Header: Back button + Progress Indicator (~90%) */}
                <div className="flex items-center gap-3 w-full mb-4">
                  <button
                    type="button"
                    onClick={handlePostMakerPickBack}
                    aria-label="Go back"
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
                  >
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </button>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                      style={{ width: "90%" }}
                    />
                  </div>
                </div>

                {/* Headings */}
                <div className="mb-5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
                    Pick a photo per post.
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-400">
                    We&apos;ll turn your 3 photos into a promo post, a festival post, and an ad post.
                  </p>
                </div>

                {/* 3 Photo Selection Cards */}
                <div className="space-y-3">
                  {/* Card 1: Your promo post */}
                  <div className="rounded-2xl border border-emerald-500/80 bg-white/[0.03] p-3.5 flex items-center gap-3.5 transition-all">
                    <img
                      src={promoPhoto || DEFAULT_BUSINESS_PHOTOS[0]}
                      alt="Promo post"
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-base">Your promo post</h3>
                      <p className="text-xs text-neutral-400 mb-1.5">Shows off your offer or latest arrival.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setActivePhotoChangeTarget("promo");
                          setIsPhotoPickerOpen(true);
                        }}
                        className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        Change photo →
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Your festival post */}
                  <div className="rounded-2xl border border-emerald-500/80 bg-white/[0.03] p-3.5 flex items-center gap-3.5 transition-all">
                    <img
                      src={festivalPhoto || DEFAULT_BUSINESS_PHOTOS[1]}
                      alt="Festival post"
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-base">Your Diwali post</h3>
                      <p className="text-xs text-neutral-400 mb-1.5">in 12 days — in your brand voice.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setActivePhotoChangeTarget("festival");
                          setIsPhotoPickerOpen(true);
                        }}
                        className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        Change photo →
                      </button>
                    </div>
                  </div>

                  {/* Card 3: Your ad post */}
                  <div className="rounded-2xl border border-emerald-500/80 bg-white/[0.03] p-3.5 flex items-center gap-3.5 transition-all">
                    <img
                      src={adPhoto || DEFAULT_BUSINESS_PHOTOS[2]}
                      alt="Ad post"
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-base">Your ad post</h3>
                      <p className="text-xs text-neutral-400 mb-1.5">Offer-led, built for clicks.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setActivePhotoChangeTarget("ad");
                          setIsPhotoPickerOpen(true);
                        }}
                        className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        Change photo →
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-neutral-400 text-center mt-4">
                  Tuned for {businessProfile.business_category || businessDetails.category || "Tech & Electronics"} on Instagram
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4 pb-2">
                <button
                  type="button"
                  onClick={handleGeneratePosts}
                  className="w-full h-13 sm:h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_8px_30px_rgba(16,185,129,0.35)] active:scale-[0.98]"
                >
                  <span>Generate Posts</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 6: POST MAKER OUTPUT READY (Reference Screenshot 5)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "post_maker_ready" && (
        <div className="w-full max-w-md mx-auto my-auto py-2 flex flex-col justify-between min-h-[580px] sm:min-h-[660px] animate-in fade-in duration-400 relative z-10 px-3 sm:px-4">
          <div>
            {/* Top Header: Back button + Full Progress Indicator + Go to Dashboard */}
            <div className="flex items-center justify-between gap-3 w-full mb-4">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={handlePostMakerReadyBack}
                  aria-label="Go back"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden min-w-[50px]">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              {/* Direct Dashboard Button in Upper-Right */}
              <button
                type="button"
                id="onboarding-go-to-dashboard-btn"
                onClick={() => {
                  try {
                    OnboardingService.completeOnboarding().catch(() => {});
                  } catch (_) {}
                  router.push("/dashboard");
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all cursor-pointer shrink-0 active:scale-95 shadow-sm"
              >
                <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                <span className="whitespace-nowrap">Go to Dashboard</span>
              </button>
            </div>

            {/* Header Titles */}
            <div className="text-center mb-4">
              <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase block mb-1">
                POST MAKER
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                {businessProfile.business_name || businessDetails.business_name}&apos;s 3 posts are ready
              </h1>
              <p className="text-xs sm:text-sm text-neutral-300">
                Unlock to download and start posting — captions and hashtags included.
              </p>
            </div>

            {/* Source Chip */}
            <div className="flex justify-center mb-5">
              <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/10 px-3 py-1 rounded-full text-xs text-neutral-300">
                <img
                  src={promoPhoto || DEFAULT_BUSINESS_PHOTOS[0]}
                  alt="Source"
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span>From your photo</span>
              </div>
            </div>

            {/* 3 Post Cards (1 Unlocked, 2 Locked) */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-5">
              {/* Card 1: Unlocked Promo Post */}
              <div
                onClick={handleOpenUnlockedPostInCreate}
                className="group relative aspect-[9/14] rounded-2xl overflow-hidden border-2 border-emerald-400 bg-neutral-900 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer hover:scale-[1.02]"
              >
                <img
                  src={promoPhoto || DEFAULT_BUSINESS_PHOTOS[0]}
                  alt="Promo post output"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-between p-2.5">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[9px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded shadow">
                      Unlocked
                    </span>
                    <button
                      type="button"
                      id="edit-unlocked-post-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenUnlockedPostInCreate();
                      }}
                      className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/90 hover:bg-emerald-400 text-white px-2 py-0.5 rounded-full shadow-md backdrop-blur-sm transition-all"
                    >
                      <Pencil className="w-2.5 h-2.5" />
                      <span>Edit</span>
                    </button>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-white line-clamp-2 leading-tight drop-shadow">
                      {generatedOnboardingPost?.headline || "Promo post"}
                    </p>
                    <span className="text-[9px] text-emerald-300 flex items-center gap-0.5 mt-1 font-semibold group-hover:underline">
                      Tap to edit in AI Post Maker ↗
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Locked Festival Post */}
              <div
                onClick={handleLockedPostClick}
                className="group relative aspect-[9/14] rounded-2xl overflow-hidden border border-amber-500/30 bg-gradient-to-br from-amber-950/70 to-amber-900/40 backdrop-blur-md flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer hover:border-amber-400/60 hover:scale-[1.02]"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-2 shadow-inner">
                  <Lock className="w-5 h-5 text-white/90" />
                </div>
                <h4 className="text-xs font-bold text-amber-200 drop-shadow">Festival post</h4>
                <span className="text-[9px] text-amber-400/80 mt-1">Locked</span>
              </div>

              {/* Card 3: Locked Ad Post */}
              <div
                onClick={handleLockedPostClick}
                className="group relative aspect-[9/14] rounded-2xl overflow-hidden border border-pink-500/30 bg-gradient-to-br from-pink-950/70 to-pink-900/40 backdrop-blur-md flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer hover:border-pink-400/60 hover:scale-[1.02]"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-2 shadow-inner">
                  <Lock className="w-5 h-5 text-white/90" />
                </div>
                <h4 className="text-xs font-bold text-pink-200 drop-shadow">Ad post</h4>
                <span className="text-[9px] text-pink-400/80 mt-1">Locked</span>
              </div>
            </div>

            {/* Captions ready badge */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Captions & hashtags ready to copy</span>
            </div>
          </div>

          {/* Action Button & Links */}
          <div className="pt-4 pb-2 space-y-2">
            <button
              type="button"
              onClick={() => setShowPlansModal(true)}
              className="w-full h-13 sm:h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_8px_30px_rgba(16,185,129,0.35)] active:scale-[0.98]"
            >
              <span>Upgrade to see your output</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>

            <button
              type="button"
              id="edit-unlocked-post-action-btn"
              onClick={handleOpenUnlockedPostInCreate}
              className="w-full text-center text-xs text-neutral-300 hover:text-emerald-400 transition-colors py-1.5 font-medium cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Pencil className="w-3.5 h-3.5 text-emerald-400" />
              <span>Edit unlocked post in AI Post Maker →</span>
            </button>

            <button
              type="button"
              id="bottom-go-to-dashboard-btn"
              onClick={() => {
                try {
                  OnboardingService.completeOnboarding().catch(() => {});
                } catch (_) {}
                router.push("/dashboard");
              }}
              className="w-full text-center text-xs text-neutral-400 hover:text-white transition-colors py-1 font-medium cursor-pointer"
            >
              Skip to Dashboard →
            </button>
          </div>
        </div>
      )}

      {/* ─── Change Photo Selector Modal for Post Maker ─── */}
      {isPhotoPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0c1222] border border-white/15 rounded-3xl p-5 sm:p-6 flex flex-col shadow-2xl relative max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Choose photo</h3>
              <button
                type="button"
                onClick={() => setIsPhotoPickerOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-neutral-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 overflow-y-auto space-y-4">
              <div>
                <Label className="text-xs text-neutral-400 mb-2 block">Upload from device</Label>
                <label className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-dashed border-white/20 hover:border-emerald-500/50 bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer text-xs text-neutral-300 transition-all">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Upload custom image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        let url = "";
                        try {
                          url = await uploadBrandLogo(file);
                        } catch (_) {
                          url = URL.createObjectURL(file);
                        }
                        if (activePhotoChangeTarget === "promo") setPromoPhoto(url);
                        if (activePhotoChangeTarget === "festival") setFestivalPhoto(url);
                        if (activePhotoChangeTarget === "ad") setAdPhoto(url);
                        setIsPhotoPickerOpen(false);
                      } catch (err) {
                        console.error("Upload error:", err);
                      }
                    }}
                  />
                </label>
              </div>

              <div>
                <Label className="text-xs text-neutral-400 mb-2 block">Available business photos</Label>
                <div className="grid grid-cols-3 gap-2">
                  {getAvailablePhotos().map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (activePhotoChangeTarget === "promo") setPromoPhoto(p);
                        if (activePhotoChangeTarget === "festival") setFestivalPhoto(p);
                        if (activePhotoChangeTarget === "ad") setAdPhoto(p);
                        setIsPhotoPickerOpen(false);
                      }}
                      className="aspect-square rounded-xl overflow-hidden border border-white/15 hover:border-emerald-500 focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer relative group"
                    >
                      <img src={p} alt={`Option ${idx}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                        <Check className="w-5 h-5 text-emerald-400" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STEPS 2 ONWARDS: Business Profile / Identity, Registration, Location, Audience & Ready
      ══════════════════════════════════════════════════════════════════════ */}
      {isFormCardStep && (
        <div className="w-full max-w-5xl mx-auto my-auto py-2 z-10 relative">
          {/* Top Progress Bar matching Designer Header */}
          <div className="flex items-center gap-3 w-full mb-6">
            <button
              type="button"
              onClick={handleBack}
              aria-label="Go back"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                style={{
                  width: `${Math.round(((currentStep) / (activeSteps.length - 1)) * 100)}%`,
                }}
              />
            </div>
            <div className="text-xs text-neutral-400 font-medium px-3 py-1 rounded-full bg-white/5 border border-white/10 shrink-0 hidden sm:block">
              Step {currentStep} of {activeSteps.length - 1}
            </div>
          </div>

          {/* Main Form Container Card */}
          <Card className="w-full bg-[#14151f]/90 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(190,50,255,0.1)] backdrop-blur-xl rounded-2xl relative z-10 overflow-hidden">
            <CardContent className="p-6 sm:p-10">

          {/* ══════════════════════════════════════════════════════════════════════
              BRANCH A: USER STEPPER (accountType === 'user')
          ══════════════════════════════════════════════════════════════════════ */}
          {accountType === "user" && currentStepObj.id === "personal_profile" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-white">Your Personal Profile</h2>
                <p className="text-xs text-neutral-400">Tell us a bit about yourself to personalize your creative suite.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="userFullName" className="text-xs font-medium text-neutral-300">Full Name</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="userFullName"
                      placeholder="e.g. Deepak Yadav"
                      value={userProfile.fullName}
                      onChange={(e) => setUserProfile({ ...userProfile, fullName: e.target.value })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="userPhone" className="text-xs font-medium text-neutral-300">Contact Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="userPhone"
                      placeholder="e.g. +91 98765 43210"
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="userLanguage" className="text-xs font-medium text-neutral-300">Preferred Language</Label>
                  <select
                    id="userLanguage"
                    value={userProfile.preferredLanguage}
                    onChange={(e) => setUserProfile({ ...userProfile, preferredLanguage: e.target.value })}
                    className="flex h-11 w-full rounded-xl border border-white/10 bg-[#0f1015] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#be32ff]"
                  >
                    <option value="hinglish">Hinglish (Hindi + English)</option>
                    <option value="hindi">Hindi</option>
                    <option value="english">English</option>
                    <option value="marathi">Marathi</option>
                    <option value="gujarati">Gujarati</option>
                    <option value="punjabi">Punjabi</option>
                    <option value="bengali">Bengali</option>
                    <option value="tamil">Tamil</option>
                    <option value="telugu">Telugu</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {accountType === "user" && currentStepObj.id === "goals" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-white">What would you like to create?</h2>
                <p className="text-xs text-neutral-400">Select what interests you most to curate AI tools on your dashboard.</p>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-medium text-neutral-300">Creative Interests</Label>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    "Instagram Reels",
                    "AI Photoshoots",
                    "Viral Scripts",
                    "Posters & Banners",
                    "Captions & Copywriting",
                    "Fashion AI Modeling",
                    "Festival Greeting Posts",
                    "Personal Portfolio",
                  ].map((item) => {
                    const isSelected = userProfile.interests.includes(item);
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggleInterest(item)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-r from-[#fc9a5d]/20 to-[#be32ff]/20 border-[#be32ff] text-white shadow-[0_0_15px_rgba(190,50,255,0.25)]"
                            : "bg-[#0f1015] border-white/10 text-neutral-400 hover:border-white/20 hover:text-neutral-200"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 inline mr-1 text-[#be32ff]" />}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Label className="text-xs font-medium text-neutral-300">Primary Platforms</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: "instagram", name: "Instagram" },
                    { id: "youtube", name: "YouTube" },
                    { id: "facebook", name: "Facebook" },
                    
                  ].map((p) => {
                    const isSelected = userProfile.platforms.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setUserProfile((prev) => ({
                            ...prev,
                            platforms: isSelected
                              ? prev.platforms.filter((x) => x !== p.id)
                              : [...prev.platforms, p.id],
                          }));
                        }}
                        className={`p-3 rounded-xl border text-center text-xs font-medium cursor-pointer transition-all ${
                          isSelected
                            ? "bg-purple-600/15 border-purple-500/50 text-white"
                            : "bg-[#0f1015] border-white/10 text-neutral-400 hover:text-white"
                        }`}
                      >
                        {p.name}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {accountType === "user" && currentStepObj.id === "ready" && (
            <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-400 py-4">
              <div className="w-20 h-20 bg-gradient-to-tr from-[#fc9a5d]/20 via-[#f0449b]/20 to-[#be32ff]/30 rounded-2xl border border-[#be32ff]/40 flex items-center justify-center mx-auto text-[#be32ff] shadow-[0_0_30px_rgba(190,50,255,0.4)]">
                <Sparkles className="w-10 h-10 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold text-white">
                  Welcome aboard, {userProfile.fullName || "Creator"}!
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                  Your personal creator workspace is ready. Explore high-converting reels, generative photoshoot tools, and automated content creation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0f1015] border border-white/10 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Account Role</span>
                  <span className="text-white font-medium capitalize">Individual User</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Language</span>
                  <span className="text-white font-medium capitalize">{userProfile.preferredLanguage}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-400">Selected Interests</span>
                  <span className="text-white font-medium">{userProfile.interests.length} topics selected</span>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              BRANCH B: BUSINESS STEPPER (accountType === 'business')
              Matches exact DB schema:
              business_name, business_type, business_category, business_description,
              business_logo, brand_color, registration_number, year_established,
              country, state, city, area, pincode, full_address, google_maps_url,
              business_model, selling_model, target_age_group, target_gender,
              target_location, customer_type.
          ══════════════════════════════════════════════════════════════════════ */}
          {accountType === "business" && currentStepObj.id === "identity" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-white">Business Identity &amp; Branding</h2>
                <p className="text-xs text-neutral-400">Configure your business name, industry type, and visual brand identity.</p>
              </div>

              <div className="space-y-4">
                {/* Business Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="b_name" className="text-xs font-medium text-neutral-300">
                    Business Name <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="b_name"
                      placeholder="e.g. Sharma Fashion"
                      value={businessProfile.business_name}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, business_name: e.target.value })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                {/* Business Type & Category Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="b_type" className="text-xs font-medium text-neutral-300">
                      Business Type <span className="text-red-400">*</span>
                    </Label>
                    <select
                      id="b_type"
                      value={businessProfile.business_type}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, business_type: e.target.value })}
                      className="flex h-11 w-full rounded-xl border border-white/10 bg-[#0f1015] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#be32ff]"
                    >
                      <option value="Retail Store">Retail Store / Physical Shop</option>
                      <option value="E-Commerce">E-Commerce / Online Brand</option>
                      <option value="Restaurant">Restaurant / Cafe / Food</option>
                      <option value="Service Provider">Service Provider / Freelance</option>
                      <option value="Manufacturing">Manufacturer / Producer</option>
                      <option value="Healthcare">Doctor / Clinic / Hospital</option>
                      <option value="Salon & Beauty">Salon / Spa / Wellness</option>
                      <option value="Real Estate">Real Estate / Construction</option>
                      <option value="Wholesale">Wholesale &amp; Distribution</option>
                      <option value="Other">Other Business</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="b_category" className="text-xs font-medium text-neutral-300">
                      Category <span className="text-red-400">*</span>
                    </Label>
                    <select
                      id="b_category"
                      value={businessProfile.business_category}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, business_category: e.target.value })}
                      className="flex h-11 w-full rounded-xl border border-white/10 bg-[#0f1015] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#be32ff]"
                    >
                      <option value="clothing">Clothing / Fashion &amp; Apparel</option>
                      <option value="restaurant">Restaurant &amp; Food Services</option>
                      <option value="jewellery">Jewellery &amp; Luxury Accessories</option>
                      <option value="salon">Salon, Beauty &amp; Personal Care</option>
                      <option value="real_estate">Real Estate &amp; Housing</option>
                      <option value="doctor">Healthcare, Doctor &amp; Clinic</option>
                      <option value="gym">Gym &amp; Fitness</option>
                      <option value="electronics">Electronics &amp; Appliances</option>
                      <option value="fmcg">Grocery &amp; FMCG</option>
                      <option value="other">Other Local Business</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label htmlFor="b_desc" className="text-xs font-medium text-neutral-300">Business Description</Label>
                  <textarea
                    id="b_desc"
                    rows={2}
                    placeholder="Short description of your products or services (e.g. Trendy ethnic wear for modern women)..."
                    value={businessProfile.business_description}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, business_description: e.target.value })}
                    className="flex w-full rounded-xl border border-white/10 bg-[#0f1015] px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#be32ff]"
                  />
                </div>

                {/* Logo & Brand Color */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-neutral-300">Business Logo</Label>
                    <div className="flex items-center gap-3">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="w-12 h-12 rounded-xl object-contain border border-white/20 bg-white/5" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl border border-dashed border-white/20 flex items-center justify-center text-neutral-500 bg-white/5">
                          <Upload className="w-5 h-5" />
                        </div>
                      )}
                      <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-xs font-medium text-white transition-colors">
                        <span>Upload Logo</span>
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-neutral-300">Brand Color Accent</Label>
                    <div className="flex items-center gap-2">
                      {["#be32ff", "#f0449b", "#fc9a5d", "#3b82f6", "#10b981", "#eab308"].map((c) => (
                        <button
                          type="button"
                          key={c}
                          onClick={() => setBusinessProfile({ ...businessProfile, brand_color: c })}
                          className={`w-7 h-7 rounded-lg transition-transform ${
                            businessProfile.brand_color === c ? "scale-125 ring-2 ring-white shadow-md" : "opacity-80 hover:opacity-100"
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {accountType === "business" && currentStepObj.id === "registration" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-white">Registration &amp; Contact Info</h2>
                <p className="text-xs text-neutral-400">Add optional official registration details and direct contact numbers.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="b_reg" className="text-xs font-medium text-neutral-300">GSTIN / Registration Number (Optional)</Label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="b_reg"
                      placeholder="e.g. 07AAAAA0000A1Z5"
                      value={businessProfile.registration_number}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, registration_number: e.target.value })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="b_year" className="text-xs font-medium text-neutral-300">Year Established</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="b_year"
                      type="number"
                      placeholder="e.g. 2021"
                      value={businessProfile.year_established}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, year_established: e.target.value })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="b_phone" className="text-xs font-medium text-neutral-300">Official Business Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="b_phone"
                      placeholder="e.g. +91 98765 43210"
                      value={businessProfile.phone}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, phone: e.target.value })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="b_lang" className="text-xs font-medium text-neutral-300">Preferred Marketing Language</Label>
                  <select
                    id="b_lang"
                    value={businessProfile.preferredLanguage}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, preferredLanguage: e.target.value })}
                    className="flex h-11 w-full rounded-xl border border-white/10 bg-[#0f1015] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#be32ff]"
                  >
                    <option value="hinglish">Hinglish (Recommended for Indian Retail)</option>
                    <option value="hindi">Hindi</option>
                    <option value="english">English</option>
                    <option value="marathi">Marathi</option>
                    <option value="gujarati">Gujarati</option>
                    <option value="punjabi">Punjabi</option>
                    <option value="tamil">Tamil</option>
                    <option value="bengali">Bengali</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {accountType === "business" && currentStepObj.id === "location" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-white">Business Location &amp; Address</h2>
                <p className="text-xs text-neutral-400">Enables city-specific ad targeting and local festival promotions.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="b_city" className="text-xs font-medium text-neutral-300">
                    City <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="b_city"
                      placeholder="e.g. Mumbai, Jaipur, Bengaluru"
                      value={businessProfile.city}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, city: e.target.value })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="b_state" className="text-xs font-medium text-neutral-300">State</Label>
                  <Input
                    id="b_state"
                    placeholder="e.g. Maharashtra, Rajasthan, Karnataka"
                    value={businessProfile.state}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, state: e.target.value })}
                    className="h-11 bg-[#0f1015] border-white/10 text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="b_area" className="text-xs font-medium text-neutral-300">Area / Market Name</Label>
                  <Input
                    id="b_area"
                    placeholder="e.g. Andheri West, MI Road, Sector 18"
                    value={businessProfile.area}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, area: e.target.value })}
                    className="h-11 bg-[#0f1015] border-white/10 text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="b_pincode" className="text-xs font-medium text-neutral-300">Pincode</Label>
                  <Input
                    id="b_pincode"
                    placeholder="e.g. 400053"
                    value={businessProfile.pincode}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, pincode: e.target.value })}
                    className="h-11 bg-[#0f1015] border-white/10 text-white"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="b_full_addr" className="text-xs font-medium text-neutral-300">Full Address</Label>
                  <Input
                    id="b_full_addr"
                    placeholder="Shop/Office number, building name, street..."
                    value={businessProfile.full_address}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, full_address: e.target.value })}
                    className="h-11 bg-[#0f1015] border-white/10 text-white"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="b_gmaps" className="text-xs font-medium text-neutral-300">Google Maps Link (Optional)</Label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="b_gmaps"
                      placeholder="https://maps.app.goo.gl/..."
                      value={businessProfile.google_maps_url}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, google_maps_url: e.target.value })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {accountType === "business" && currentStepObj.id === "audience" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-white">Target Audience &amp; Selling Model</h2>
                <p className="text-xs text-neutral-400">Our AI uses this demographic data to craft high-converting ad copy and reel scripts.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="b_model" className="text-xs font-medium text-neutral-300">Business Model</Label>
                    <select
                      id="b_model"
                      value={businessProfile.business_model}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, business_model: e.target.value })}
                      className="flex h-11 w-full rounded-xl border border-white/10 bg-[#0f1015] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#be32ff]"
                    >
                      <option value="B2C">B2C (Business to Consumer)</option>
                      <option value="B2B">B2B (Business to Business)</option>
                      <option value="D2C">D2C (Direct to Consumer)</option>
                      <option value="B2B2C">B2B2C (Hybrid Partnership)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="s_model" className="text-xs font-medium text-neutral-300">Selling Channel</Label>
                    <select
                      id="s_model"
                      value={businessProfile.selling_model}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, selling_model: e.target.value })}
                      className="flex h-11 w-full rounded-xl border border-white/10 bg-[#0f1015] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#be32ff]"
                    >
                      <option value="Retail Store">Physical Retail Store / Walk-ins</option>
                      <option value="Online E-Commerce">Online E-Commerce Store</option>
                      <option value="Hybrid Store">Hybrid (Store + Online/Social)</option>
                      <option value="Wholesale">Wholesale &amp; Bulk Orders</option>
                    </select>
                  </div>
                </div>

                {/* Target Age Group Multi-Select Pills */}
                <div className="space-y-2 pt-1">
                  <Label className="text-xs font-medium text-neutral-300">Target Age Groups</Label>
                  <div className="flex flex-wrap gap-2">
                    {["18-24", "25-34", "35-44", "45-54", "55+"].map((age) => {
                      const isSelected = businessProfile.target_age_group.includes(age);
                      return (
                        <button
                          type="button"
                          key={age}
                          onClick={() => toggleAgeGroup(age)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-pink-600/20 border-pink-500 text-white shadow-sm"
                              : "bg-[#0f1015] border-white/10 text-neutral-400 hover:text-white"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 inline mr-1 text-pink-400" />}
                          {age} yrs
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <Label htmlFor="t_gender" className="text-xs font-medium text-neutral-300">Target Gender</Label>
                    <select
                      id="t_gender"
                      value={businessProfile.target_gender}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, target_gender: e.target.value })}
                      className="flex h-11 w-full rounded-xl border border-white/10 bg-[#0f1015] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#be32ff]"
                    >
                      <option value="All">All Genders</option>
                      <option value="Female">Women / Female Focus</option>
                      <option value="Male">Men / Male Focus</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="t_loc" className="text-xs font-medium text-neutral-300">Target Reach</Label>
                    <select
                      id="t_loc"
                      value={businessProfile.target_location}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, target_location: e.target.value })}
                      className="flex h-11 w-full rounded-xl border border-white/10 bg-[#0f1015] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#be32ff]"
                    >
                      <option value="Local City">Local City / Neighborhood</option>
                      <option value="State-wide">State-wide Reach</option>
                      <option value="Pan India">Pan India Delivery</option>
                      <option value="Global">Global / International</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="c_type" className="text-xs font-medium text-neutral-300">Customer Segment</Label>
                    <select
                      id="c_type"
                      value={businessProfile.customer_type}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, customer_type: e.target.value })}
                      className="flex h-11 w-full rounded-xl border border-white/10 bg-[#0f1015] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#be32ff]"
                    >
                      <option value="Mass Market">Mass Market</option>
                      <option value="Value for Money">Value for Money</option>
                      <option value="Premium / Luxury">Premium / Luxury</option>
                      <option value="B2B Clients">B2B Clients</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {accountType === "business" && currentStepObj.id === "ready" && (
            <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-400 py-4">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto text-white shadow-2xl transition-all"
                style={{
                  background: `linear-gradient(135deg, ${businessProfile.brand_color || "#be32ff"}, #f0449b)`,
                  boxShadow: `0 0 35px ${businessProfile.brand_color || "#be32ff"}55`,
                }}
              >
                <Store className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold text-white">
                  {businessProfile.business_name || "Your Business"} is Ready!
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                  We have mapped your business category, target location, and demographic preferences into our AI Marketing &amp; Ad Engine.
                </p>
              </div>

              {/* Summary of Business Identity */}
              <div className="p-4 rounded-xl bg-[#0f1015] border border-white/10 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Business Name</span>
                  <span className="text-white font-semibold">{businessProfile.business_name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Type &amp; Category</span>
                  <span className="text-white font-medium capitalize">{businessProfile.business_type} • {businessProfile.business_category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Location</span>
                  <span className="text-white font-medium">{businessProfile.city ? `${businessProfile.city}, ${businessProfile.state}` : "India"}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-400">Target Audience</span>
                  <span className="text-white font-medium">{businessProfile.target_gender} • {businessProfile.target_location}</span>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              BRANCH C: INFLUENCER / CREATOR STEPPER (accountType === 'influencer')
          ══════════════════════════════════════════════════════════════════════ */}
          {accountType === "influencer" && currentStepObj.id === "creator_profile" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-white">Creator Identity &amp; Niche</h2>
                <p className="text-xs text-neutral-400">Set up your creator display name, primary content category, and bio for brands to discover.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="infFullName" className="text-xs font-medium text-neutral-300">Creator / Display Name *</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="infFullName"
                      placeholder="e.g. Rohit Verma"
                      value={influencerProfile.fullName}
                      onChange={(e) => setInfluencerProfile({ ...influencerProfile, fullName: e.target.value })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="infUsername" className="text-xs font-medium text-neutral-300">Creator Handle / Username</Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-500 font-bold">@</span>
                    <Input
                      id="infUsername"
                      placeholder="rohit_fashion_vibe"
                      value={influencerProfile.username}
                      onChange={(e) => setInfluencerProfile({ ...influencerProfile, username: e.target.value.replace(/^@/, "") })}
                      className="pl-9 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="infCategory" className="text-xs font-medium text-neutral-300">Primary Content Niche *</Label>
                  <select
                    id="infCategory"
                    value={influencerProfile.category}
                    onChange={(e) => setInfluencerProfile({ ...influencerProfile, category: e.target.value })}
                    className="flex h-11 w-full rounded-xl border border-white/10 bg-[#0f1015] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#be32ff]"
                  >
                    <option value="Fashion">Fashion &amp; Apparel</option>
                    <option value="Technology">Technology &amp; Gadgets</option>
                    <option value="Food &amp; Travel">Food &amp; Travel</option>
                    <option value="Fitness &amp; Health">Fitness &amp; Health</option>
                    <option value="Beauty &amp; Lifestyle">Beauty &amp; Lifestyle</option>
                    <option value="Gaming">Gaming &amp; Esports</option>
                    <option value="Entertainment">Entertainment &amp; Comedy</option>
                    <option value="Business &amp; Finance">Business &amp; Finance</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="infBio" className="text-xs font-medium text-neutral-300">Creator Bio / Profile Summary</Label>
                  <textarea
                    id="infBio"
                    rows={3}
                    placeholder="Briefly describe your content niche, audience vibe, and brand collaboration style..."
                    value={influencerProfile.bio}
                    onChange={(e) => setInfluencerProfile({ ...influencerProfile, bio: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0f1015] p-3 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#be32ff]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="infCity" className="text-xs font-medium text-neutral-300">City</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="infCity"
                      placeholder="e.g. Mumbai"
                      value={influencerProfile.city}
                      onChange={(e) => setInfluencerProfile({ ...influencerProfile, city: e.target.value })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="infState" className="text-xs font-medium text-neutral-300">State / Region</Label>
                  <Input
                    id="infState"
                    placeholder="e.g. Maharashtra"
                    value={influencerProfile.state}
                    onChange={(e) => setInfluencerProfile({ ...influencerProfile, state: e.target.value })}
                    className="h-11 bg-[#0f1015] border-white/10 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {accountType === "influencer" && currentStepObj.id === "social_reach" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-white">Social Channels &amp; Commercials</h2>
                <p className="text-xs text-neutral-400">Add your social channels and base commercial rate per deliverable.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="infInstagram" className="text-xs font-medium text-neutral-300">Instagram Profile Link or Handle *</Label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
                    <Input
                      id="infInstagram"
                      placeholder="https://instagram.com/yourhandle"
                      value={influencerProfile.instagram_url}
                      onChange={(e) => setInfluencerProfile({ ...influencerProfile, instagram_url: e.target.value })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="infYoutube" className="text-xs font-medium text-neutral-300">YouTube Channel URL (Optional)</Label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                    <Input
                      id="infYoutube"
                      placeholder="https://youtube.com/@channel"
                      value={influencerProfile.youtube_url}
                      onChange={(e) => setInfluencerProfile({ ...influencerProfile, youtube_url: e.target.value })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="infFollowers" className="text-xs font-medium text-neutral-300">Total Followers / Audience</Label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="infFollowers"
                      type="number"
                      placeholder="50000"
                      value={influencerProfile.follower_count}
                      onChange={(e) => setInfluencerProfile({ ...influencerProfile, follower_count: Number(e.target.value) })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="infPrice" className="text-xs font-medium text-neutral-300">Expected Rate per Reel (₹ INR)</Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold">₹</span>
                    <Input
                      id="infPrice"
                      type="number"
                      placeholder="5000"
                      value={influencerProfile.expectedPricePerPost}
                      onChange={(e) => setInfluencerProfile({ ...influencerProfile, expectedPricePerPost: Number(e.target.value) })}
                      className="pl-9 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="infPhone" className="text-xs font-medium text-neutral-300">Contact Number (For Private Brand Inquiries)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="infPhone"
                      placeholder="+91 98765 43210"
                      value={influencerProfile.phone}
                      onChange={(e) => setInfluencerProfile({ ...influencerProfile, phone: e.target.value })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {accountType === "influencer" && currentStepObj.id === "ready" && (
            <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-400 py-4">
              <div className="w-20 h-20 bg-gradient-to-tr from-[#fc9a5d]/20 via-[#be32ff]/20 to-[#7d36fa]/30 rounded-2xl border border-[#be32ff]/40 flex items-center justify-center mx-auto text-[#be32ff] shadow-[0_0_30px_rgba(190,50,255,0.4)]">
                <Sparkles className="w-10 h-10 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold text-white">
                  Welcome aboard, {influencerProfile.fullName || "Creator"}!
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                  Your Creator Profile and Media Kit are now live! Brands can discover your profile, send bilateral digital agreements, and fund escrow-secured campaigns.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0f1015] border border-white/10 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Account Type</span>
                  <span className="text-white font-medium capitalize">Creator &amp; Influencer</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Primary Niche</span>
                  <span className="text-white font-medium capitalize">{influencerProfile.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Location</span>
                  <span className="text-white font-medium">{influencerProfile.city ? `${influencerProfile.city}, ${influencerProfile.state}` : "India"}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-400">Starting Reel Rate</span>
                  <span className="text-[#fc9a5d] font-bold">₹{Number(influencerProfile.expectedPricePerPost).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Error notice */}
          {error && (
            <div className="mt-6 p-3.5 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 animate-in fade-in">
              <span className="font-semibold text-red-400">Error:</span> {error}
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0 || isSubmitting}
              className={`h-11 px-4 rounded-xl border-white/10 bg-[#0f1015] text-neutral-300 hover:text-white hover:bg-white/5 text-xs font-semibold ${
                currentStep === 0 ? "opacity-0 pointer-events-none" : ""
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
            </Button>

            <Button
              type="button"
              onClick={(e) => {
                if (currentStep === 0 && accountType === "influencer") {
                  handleSelectInfluencerAndLaunch(e);
                } else {
                  handleNext(e);
                }
              }}
              disabled={isSubmitting}
              className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:to-[#7d36fa] text-white font-bold text-xs tracking-wide shadow-[0_4px_25px_rgba(240,68,155,0.35)] hover:shadow-[0_6px_30px_rgba(190,50,255,0.5)] transition-all cursor-pointer min-w-[140px]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Setup...
                </span>
              ) : isLastStep ? (
                <span className="flex items-center gap-1.5">
                  {accountType === "influencer" ? "Go to Creator Dashboard" : "Go to Dashboard"} <ArrowRight className="w-4 h-4" />
                </span>
              ) : currentStep === activeSteps.length - 2 ? (
                <span className="flex items-center gap-1.5">
                  Complete Setup <Sparkles className="w-4 h-4" />
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  Continue <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  )}

  {/* Subscription Plan Modal */}
  <AvailablePlansModal
    isOpen={showPlansModal}
    onClose={() => setShowPlansModal(false)}
    isModal={true}
  />

  {/* Footer */}
  <footer className="w-full max-w-4xl mx-auto mt-6 text-center text-xs text-neutral-500 z-10 relative">
    &copy; {new Date().getFullYear()} DhandaGrow AI. Tailored for Indian enterprises and creators.
  </footer>
</div>
  );
}
