"use client";

import { useState, useEffect } from "react";
import { BrandKitRegistrationModal } from "@/components/brand/BrandKitRegistrationModal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  UserPlus,
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
  Eye,
  EyeOff,
  Bell,
  AlertTriangle,
  Shield,
  Volume2,
  Settings,
  LayoutDashboard,
  Megaphone,
  Camera,
  Bot,
  Video,
  Zap,
  TrendingUp,
  LogOut
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
const HangerIcon = ({ className = "w-5 h-5", fill = "currentColor", fillOpacity = 0.25 }: { className?: string; fill?: string; fillOpacity?: number | string }) => (
  <svg
    viewBox="0 0 24 24"
    fill={fill}
    fillOpacity={fillOpacity}
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
const VideoMarketingIcon = ({ className = "w-5 h-5", fill = "currentColor", fillOpacity = 0.25 }: { className?: string; fill?: string; fillOpacity?: number | string }) => (
  <svg
    viewBox="0 0 24 24"
    fill={fill}
    fillOpacity={fillOpacity}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="4" width="14" height="16" rx="2" />
    <path d="m16 9 6-3v12l-6-3" />
    <polygon points="7 10 11 12 7 14 7 10" fill="currentColor" stroke="none" fillOpacity={1} />
  </svg>
);

// Selectable Business Services (with Leads, CRM, AI Marketing Agent as Coming Soon)
export const BUSINESS_SERVICES_OPTIONS = [
  {
    id: "automate_social_media",
    title: "Automate Social Media",
    desc: "Auto post, schedule and grow your brand",
    icon: Megaphone,
    iconBg: "bg-[#3B2D54] border border-[#7C3AED]/40",
    iconColor: "text-[#7C3AED] dark:text-[#A78BFA]",
    comingSoon: false,
  },
  {
    id: "marketing_video",
    title: "Marketing Video",
    desc: "Create engaging videos with AI",
    icon: VideoMarketingIcon,
    iconBg: "bg-[#4E243B] border border-[#EC4899]/40",
    iconColor: "text-[#EC4899] dark:text-[#F472B6]",
    comingSoon: false,
  },
  {
    id: "fashion_photoshoot",
    title: "Fashion Photoshoot",
    desc: "AI model photos for your clothing brand",
    icon: HangerIcon,
    iconBg: "bg-[#4A244E] border border-[#C026D3]/40",
    iconColor: "text-[#C026D3] dark:text-[#E879F9]",
    comingSoon: false,
  },
  {
    id: "product_photoshoot",
    title: "Product Photoshoot",
    desc: "Stunning product photos with AI",
    icon: Camera,
    iconBg: "bg-[#523321] border border-[#F97316]/40",
    iconColor: "text-[#F97316] dark:text-[#FB923C]",
    comingSoon: false,
  },
  {
    id: "ai_website_builder",
    title: "AI Website Builder",
    desc: "Create your business website in minutes",
    icon: Globe,
    iconBg: "bg-[#1A3D33] border border-[#10B981]/40",
    iconColor: "text-[#10B981] dark:text-[#34D399]",
    comingSoon: false,
  },
  {
    id: "leads",
    title: "Leads",
    desc: "Capture and track customer inquiries",
    icon: Users,
    iconBg: "bg-[#2A2F5E] border border-[#6366F1]/40",
    iconColor: "text-[#6366F1] dark:text-[#818CF8]",
    comingSoon: true,
  },
  {
    id: "crm",
    title: "CRM",
    desc: "Manage customer pipeline and sales",
    icon: Target,
    iconBg: "bg-[#2A2F5E] border border-[#6366F1]/40",
    iconColor: "text-[#6366F1] dark:text-[#818CF8]",
    comingSoon: true,
  },
  {
    id: "ai_marketing_agent",
    title: "AI Marketing Agent",
    desc: "Get an AI agent to grow your business",
    icon: Bot,
    iconBg: "bg-[#3B2D54] border border-[#7C3AED]/40",
    iconColor: "text-[#7C3AED] dark:text-[#A78BFA]",
    comingSoon: true,
  },
];

// 6 Selectable Presence Cards matching Designer Mockup
export const ONLINE_PRESENCE_OPTIONS = [
  {
    id: "website",
    title: "Business Website",
    desc: "Shopify, WooCommerce, or your own",
    icon: Globe,
    iconBg: "bg-[#292259] border border-[#7C3AED]/40",
    iconColor: "text-[#A78BFA]",
    businessType: "E-Commerce",
    sellingModel: "Online E-Commerce Store",
  },
  {
    id: "google_maps",
    title: "Google Maps",
    desc: "Business listing, address and available public information",
    icon: MapPin,
    iconBg: "bg-[#452312] border border-[#F97316]/40",
    iconColor: "text-[#FB923C]",
    businessType: "Retail Store",
    sellingModel: "Physical Retail Store / Walk-ins",
  },
  {
    id: "marketplace",
    title: "Marketplace seller",
    desc: "",
    logos: "/images/marketplace-logos.png",
    logosAlt: "Amazon, Myntra, Meesho, Blinkit, Flipkart",
    icon: ShoppingBag,
    iconBg: "bg-[#471833] border border-[#EC4899]/40",
    iconColor: "text-[#F472B6]",
    businessType: "E-Commerce",
    sellingModel: "Online E-Commerce Store",
  },
  {
    id: "b2b",
    title: "Wholesale / B2B",
    desc: "",
    logos: "/images/b2b-logos.png",
    logosAlt: "Moglix, Udaan, TradeIndia, Justdial",
    icon: Building2,
    iconBg: "bg-[#2A1D57] border border-[#8B5CF6]/40",
    iconColor: "text-[#A78BFA]",
    businessType: "Wholesale",
    sellingModel: "Wholesale & Bulk Orders",
  },
  {
    id: "none",
    title: "No Online Presence",
    desc: "If the business does not have an online presence, continue with the manual setup",
    icon: X,
    iconBg: "bg-[#481422] border border-[#E11D48]/40",
    iconColor: "text-[#FB7185]",
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
  const { user, login, logout } = useAuth();

  useEffect(() => {
    if (user?.role === "influencer") {
      router.replace("/onboarding/influencer");
    }
  }, [user, router]);

  useEffect(() => {
    if (user?.role === "influencer") {
      router.replace("/onboarding/influencer");
    }
  }, [user, router]);

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
          if (Array.isArray(parsed) && parsed.length > 0) {
            const comingSoonIds = new Set(BUSINESS_SERVICES_OPTIONS.filter((s: any) => s.comingSoon).map((s: any) => s.id));
            return parsed.filter((id: string) => !comingSoonIds.has(id));
          }
        } catch (_) { }
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
    palette: ["#FC9A5D", "#F0449A", "#BD32FF", "#7E36FA", "#6533BA"],
    tones: ["Modern", "Professional", "Trendy"] as string[],
    language: "English",
  });

  const [websitePhotos, setWebsitePhotos] = useState<string[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [showAllTones, setShowAllTones] = useState(false);
  const [isSavingBusinessDetails2, setIsSavingBusinessDetails2] = useState(false);
  const [isSavingBrandPreferences, setIsSavingBrandPreferences] = useState(false);
  const [isSavingPhotos, setIsSavingPhotos] = useState(false);

  // ─── Google Maps Onboarding Flow State ───
  const [mapsSearchQuery, setMapsSearchQuery] = useState("");
  const [mapsSearchResults, setMapsSearchResults] = useState<GooglePlaceResult[]>([]);
  const [isSearchingMaps, setIsSearchingMaps] = useState(false);
  const [mapsSearchError, setMapsSearchError] = useState<string | null>(null);
  const [selectedMapsPlace, setSelectedMapsPlace] = useState<GooglePlaceResult | null>(null);

  const [mapsWebsiteUrl, setMapsWebsiteUrl] = useState("");
  const [mapsCategory, setMapsCategory] = useState("");
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
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
  const [createAccountPlatform, setCreateAccountPlatform] = useState<"instagram" | "facebook" | "linkedin">("facebook");
  const [socialAuthModalMode, setSocialAuthModalMode] = useState<"login" | "create">("login");
  const [createAccountHandle, setCreateAccountHandle] = useState("");
  const [socialAuthPassword, setSocialAuthPassword] = useState("");
  const [showSocialAuthPassword, setShowSocialAuthPassword] = useState(false);
  const [socialAuthFullName, setSocialAuthFullName] = useState("");
  const [socialAuthEmail, setSocialAuthEmail] = useState("");
  const [socialAuthError, setSocialAuthError] = useState("");
  const [isSubmittingSocialAuth, setIsSubmittingSocialAuth] = useState(false);

  const [connectedSocialAccounts, setConnectedSocialAccounts] = useState<{ [key: string]: boolean }>({
    instagram: true,
    facebook: false,
    linkedin: false,
  });

  const handleOpenSocialAuth = (platform: "instagram" | "facebook" | "linkedin", mode: "login" | "create" = "login") => {
    setCreateAccountPlatform(platform);
    setSocialAuthModalMode(mode);
    setSocialAuthError("");
    setSocialAuthPassword("");
    setShowSocialAuthPassword(false);

    const existingHandle = socialHandles?.[platform] || "";
    const suggested = businessProfile.business_name
      ? `@${businessProfile.business_name.toLowerCase().replace(/\s+/g, "")}`
      : "";
    setCreateAccountHandle(existingHandle || suggested);
    setSocialAuthFullName(businessProfile.business_name || "");
    setSocialAuthEmail(user?.email || "");
    setIsCreateAccountModalOpen(true);
  };

  const handleToggleConnectAccount = (platformKey: "instagram" | "facebook" | "linkedin") => {
    if (connectedSocialAccounts[platformKey]) {
      // Toggle off / disconnect
      setConnectedSocialAccounts((prev) => {
        const next = { ...prev, [platformKey]: false };
        const connectedList = Object.keys(next).filter((k) => next[k]);
        setSelectedSocialPlatforms(connectedList);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("business_social_platforms", JSON.stringify(connectedList));
          sessionStorage.setItem("connected_social_accounts", JSON.stringify(next));
        }
        return next;
      });
    } else {
      // Open login modal for this platform
      handleOpenSocialAuth(platformKey, "login");
    }
  };

  const handleSubmitSocialAuth = async () => {
    setSocialAuthError("");
    const handle = createAccountHandle.trim();
    if (!handle) {
      setSocialAuthError("Please enter your account username or email.");
      return;
    }
    if (!socialAuthPassword.trim()) {
      setSocialAuthError("Please enter your account password to connect.");
      return;
    }

    setIsSubmittingSocialAuth(true);

    try {
      const formattedHandle = handle.startsWith("@") || handle.includes("@") || handle.includes("/")
        ? handle
        : `@${handle}`;

      setSocialHandles((prev) => {
        const next = { ...prev, [createAccountPlatform]: formattedHandle };
        if (typeof window !== "undefined") {
          sessionStorage.setItem("business_social_handles", JSON.stringify(next));
          if (createAccountPlatform === "instagram") {
            localStorage.setItem("instagram_username", formattedHandle.replace(/^@/, "").trim());
          }
        }
        return next;
      });

      setConnectedSocialAccounts((prev) => {
        const next = { ...prev, [createAccountPlatform]: true };
        const connectedList = Object.keys(next).filter((k) => next[k]);
        setSelectedSocialPlatforms(connectedList);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("business_social_platforms", JSON.stringify(connectedList));
          sessionStorage.setItem("connected_social_accounts", JSON.stringify(next));
        }
        return next;
      });

      setIsCreateAccountModalOpen(false);
    } catch (err: any) {
      setSocialAuthError(extractErrorMessage(err, "Failed to connect account. Please try again."));
    } finally {
      setIsSubmittingSocialAuth(false);
    }
  };

  const [selectedSocialPlatforms, setSelectedSocialPlatforms] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("business_social_platforms");
        if (saved) return JSON.parse(saved);
      } catch (_) { }
    }
    return ["instagram"];
  });
  const [socialHandles, setSocialHandles] = useState<Record<string, string>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("business_social_handles");
        if (saved) return JSON.parse(saved);
      } catch (_) { }
      const savedIg = localStorage.getItem("instagram_username");
      if (savedIg) return { instagram: savedIg };
    }
    return { instagram: "", facebook: "", youtube: "", whatsapp: "", linkedin: "", twitter: "" };
  });
  const [isSavingSocialPlatforms, setIsSavingSocialPlatforms] = useState(false);

  // ─── First Content Creation & Post Maker Flow State ───
  const [firstThingChoice, setFirstThingChoice] = useState<"fashion_studio" | "product_studio" | "post_maker" | "reel_maker" | "photoshoot">("post_maker");
  const [promoPhoto, setPromoPhoto] = useState<string>("");
  const [festivalPhoto, setFestivalPhoto] = useState<string>("");
  const [adPhoto, setAdPhoto] = useState<string>("");
  const [activePhotoChangeTarget, setActivePhotoChangeTarget] = useState<"promo" | "festival" | "ad" | null>(null);
  const [isGeneratingPosts, setIsGeneratingPosts] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(25);
  const [generationStage, setGenerationStage] = useState<"studying" | "first_step" | "daily_posts">("studying");
  const [generationStatusText, setGenerationStatusText] = useState("Analyzing your business & brand...");
  const [notifyContact, setNotifyContact] = useState("");
  const [isNotifySubmitted, setIsNotifySubmitted] = useState(false);
  const [generatedOnboardingPost, setGeneratedOnboardingPost] = useState<GeneratedPost | null>(null);
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false);

  // ─── Default High-Quality Business Photo Assets ───
  const DEFAULT_BUSINESS_PHOTOS = [
    "/images/fashion-photoshoot-hero.jpg",
    "/images/influencer-ootd-post.jpg",
    "/images/product-kundan-necklace.jpg",
    "/images/ai-poster-mockup.jpg"
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
        } catch (_) { }
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
        } catch (_) { }
      }
      const savedBrand = sessionStorage.getItem("brand_preferences_data");
      if (savedBrand) {
        try {
          const parsed = JSON.parse(savedBrand);
          setBrandPreferences((prev) => ({ ...prev, ...parsed }));
        } catch (_) { }
      }
      const savedScraped = sessionStorage.getItem("website_scraped_photos");
      if (savedScraped) {
        try {
          const parsed = JSON.parse(savedScraped);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setWebsitePhotos(parsed);
            setSelectedPhotos(parsed);
          }
        } catch (_) { }
      }
      const savedPhotos = sessionStorage.getItem("website_selected_photos");
      if (savedPhotos) {
        try {
          const parsed = JSON.parse(savedPhotos);
          if (Array.isArray(parsed) && parsed.length > 0) setSelectedPhotos(parsed);
        } catch (_) { }
      }
    }

    // 2. Authoritative backend restoration from persistent storage
    const restoreFromBackend = async () => {
      if (typeof window === "undefined") return;

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

        // Status check - do not auto-redirect away from onboarding on page load so screen holds
        if (statusRes.status === "fulfilled" && statusRes.value) {
          const s = statusRes.value;
          // Keep user on onboarding flow without buffering/flickering
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

        // 3. Navigate to next incomplete step only if user has already passed get_started
        //    (i.e., they have selected services or presence from a previous session).
        //    If no explicit step in sessionStorage AND no prior progress, stay at step 0 (get_started).
        const savedSessionStep = sessionStorage.getItem("onboarding_step");
        if (!savedSessionStep) {
          const hasServices = (restoredServices && restoredServices.length > 0) || (selectedServices && selectedServices.length > 0);
          const hasPresence = Boolean(activePresence);
          // Only skip get_started if user already has prior progress (services selected)
          if (hasServices && !hasPresence) {
            const pIdx = activeSteps.findIndex((s) => s.id === "presence");
            if (pIdx !== -1) setCurrentStep(pIdx);
          } else if (hasServices && hasPresence) {
            // Presence already selected too — stay where they were (step 0 is safe fallback)
            // Don't force-jump anywhere; let the backend step restoration handle it
          }
          // If !hasServices: stay at step 0 = get_started (do NOT jump to business_services)
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

    // Save selection in background
    OnboardingService.saveOnlinePresence(presenceId, {
      business_type: match?.businessType || (presenceId === "other" ? "Other" : businessProfile.business_type),
      selling_model: match?.sellingModel || (presenceId === "other" ? "Other Business Model" : businessProfile.selling_model),
    }).catch(() => {});

    // Immediately open clicked screen: index 3 is always the dedicated first screen of chosen flow
    setCurrentStep(3);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", "3");
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
    const srv = BUSINESS_SERVICES_OPTIONS.find((s) => s.id === serviceId);
    if ((srv as any)?.comingSoon) {
      return;
    }
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
    const comingSoonIds = new Set(BUSINESS_SERVICES_OPTIONS.filter((s: any) => s.comingSoon).map((s: any) => s.id));
    const validServices = selectedServices.filter((id) => !comingSoonIds.has(id));
    if (!validServices || validServices.length === 0) {
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
    }).catch(() => { });
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

      // Route directly to the presence-specific step (index 3 is always the dedicated first step)
      setCurrentStep(3);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", "3");
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
    setError("");
    setIsSavingSocialPlatforms(true);
    try {
      const connectedList = Object.keys(connectedSocialAccounts).filter((k) => connectedSocialAccounts[k]);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("business_social_platforms", JSON.stringify(connectedList));
        sessionStorage.setItem("connected_social_accounts", JSON.stringify(connectedSocialAccounts));
      }
      await OnboardingService.saveOnlinePresence("social_media", {
        business_type: businessProfile.business_type || "Social Commerce",
        selling_model: businessProfile.selling_model || "Social Media / Direct Selling",
        selected_platforms: connectedList,
        connected_accounts: connectedList,
      }).catch(() => {});

      const firstThingIdx = activeSteps.findIndex((s) => s.id === "first_thing");
      const target = firstThingIdx !== -1 ? firstThingIdx : currentStep + 1;
      setCurrentStep(target);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(target));
      }
    } catch (err: any) {
      console.warn("Non-blocking error saving social platforms:", err);
      const firstThingIdx = activeSteps.findIndex((s) => s.id === "first_thing");
      const target = firstThingIdx !== -1 ? firstThingIdx : currentStep + 1;
      setCurrentStep(target);
    } finally {
      setIsSavingSocialPlatforms(false);
    }
  };

  const handleSkipSocialPlatforms = () => {
    setError("");
    const firstThingIdx = activeSteps.findIndex((s) => s.id === "first_thing");
    const target = firstThingIdx !== -1 ? firstThingIdx : currentStep + 1;
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
      } catch (_) { }

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
        if (result.business_name && result.business_name.trim()) {
          const bClean = result.business_name.trim();
          if (typeof window !== "undefined") {
            localStorage.setItem("business_name", bClean);
            localStorage.setItem("onboarding_business_name", bClean);
            sessionStorage.setItem("business_name", bClean);
          }
          businessService.updateBusiness({
            name: bClean,
            businessName: bClean,
            website: formattedUrl,
            category: result.category || undefined,
          }).catch(() => null);
          userService.updateProfile({
            business_name: bClean,
            businessName: bClean,
          }).catch(() => null);
        }

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
          setSelectedPhotos(result.photos);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("website_scraped_photos", JSON.stringify(result.photos));
            sessionStorage.setItem("website_selected_photos", JSON.stringify(result.photos));
          }
        } else if (formattedUrl) {
          // If backend didn't return photos, fetch dynamically via our live scraper route
          try {
            const scrapeRes = await fetch(`/api/onboarding/scrape-photos?url=${encodeURIComponent(formattedUrl)}`);
            if (scrapeRes.ok) {
              const scrapeData = await scrapeRes.json();
              if (Array.isArray(scrapeData?.photos) && scrapeData.photos.length > 0) {
                setWebsitePhotos(scrapeData.photos);
                setSelectedPhotos(scrapeData.photos);
                if (typeof window !== "undefined") {
                  sessionStorage.setItem("website_scraped_photos", JSON.stringify(scrapeData.photos));
                  sessionStorage.setItem("website_selected_photos", JSON.stringify(scrapeData.photos));
                }
              }
            }
          } catch (_) {}
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
        businessName: businessDetails.business_name.trim(),
        category: businessDetails.category,
        industry: businessDetails.category,
        businessType: businessDetails.primary_business_type || businessDetails.business_types[0],
        location: businessDetails.city,
        description: businessDetails.tagline,
        website: websiteUrl || undefined,
        logoUrl: businessDetails.logo_url || undefined,
      });

      // Also persist to User Profile API so user.business_name stays synced
      try {
        await userService.updateProfile({
          business_name: businessDetails.business_name.trim(),
          businessName: businessDetails.business_name.trim(),
        });
      } catch (_) {}

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

      // Advance to Screen 4 (business_details_2)
      const details2Idx = activeSteps.findIndex((s) => s.id === "business_details_2");
      const target = details2Idx !== -1 ? details2Idx : currentStep + 1;
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
  const handleBusinessDetails2Back = () => {
    const detailsIdx = activeSteps.findIndex((s) => s.id === "business_details");
    const target = detailsIdx !== -1 ? detailsIdx : currentStep - 1;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  const handleBusinessDetails2Continue = async () => {
    setIsSavingBusinessDetails2(true);
    setError("");
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("business_details_data", JSON.stringify(businessDetails));
      }

      await updateBrandKit({
        business_name: businessDetails.business_name,
        tagline: businessDetails.tagline,
        target_audience: businessDetails.target_audience,
        differentiators: businessDetails.differentiators,
        products_services: businessDetails.products_services,
        website: websiteUrl,
        logo_url: businessDetails.logo_url,
      });

      await OnboardingService.updateProgress({
        tagline: businessDetails.tagline,
        target_audience: businessDetails.target_audience,
        differentiators: businessDetails.differentiators,
        products_services: businessDetails.products_services,
        website_url: websiteUrl,
      });

      // Advance to Brand Identity (brand_preferences - Image 1)
      const brandIdx = activeSteps.findIndex((s) => s.id === "brand_preferences");
      const target = brandIdx !== -1 ? brandIdx : currentStep + 1;
      setCurrentStep(target);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(target));
      }
    } catch (err: any) {
      console.error("Failed to save business profile details:", err);
      setError(err?.message || "Failed to save details. Please retry.");
    } finally {
      setIsSavingBusinessDetails2(false);
    }
  };

  const handleBrandPreferencesBack = () => {
    const details2Idx = activeSteps.findIndex((s) => s.id === "business_details_2");
    const target = details2Idx !== -1 ? details2Idx : currentStep - 1;
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

      // Advance to Screen 5: Brand Services & Audience (Image 2)
      const servicesIdx = activeSteps.findIndex((s) => s.id === "brand_services");
      const target = servicesIdx !== -1 ? servicesIdx : currentStep + 1;
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

  // ─── Screen 5: Brand Services & Audience Handlers (Image 2) ───
  const [isSavingBrandServices, setIsSavingBrandServices] = useState(false);
  const [newServiceInput, setNewServiceInput] = useState("");
  const [isAddingService, setIsAddingService] = useState(false);

  const handleBrandServicesBack = () => {
    const brandIdx = activeSteps.findIndex((s) => s.id === "brand_preferences");
    const target = brandIdx !== -1 ? brandIdx : currentStep - 1;
    setCurrentStep(target);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboarding_step", String(target));
    }
  };

  const handleBrandServicesContinue = async () => {
    setIsSavingBrandServices(true);
    setError("");
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("business_details_data", JSON.stringify(businessDetails));
      }

      await updateBrandKit({
        business_name: businessDetails.business_name,
        tagline: businessDetails.tagline,
        target_audience: businessDetails.target_audience,
        differentiators: businessDetails.differentiators,
        products_services: businessDetails.products_services,
        website: websiteUrl,
        logo_url: businessDetails.logo_url,
      });

      await OnboardingService.updateProgress({
        target_audience: businessDetails.target_audience,
        products_services: businessDetails.products_services,
        target_audience_summary: businessDetails.target_audience,
        services_products_summary: businessDetails.products_services,
      });

      // Advance to Screen 6 (website_photos)
      const photosIdx = activeSteps.findIndex((s) => s.id === "website_photos");
      const target = photosIdx !== -1 ? photosIdx : currentStep + 1;
      setCurrentStep(target);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(target));
      }
    } catch (err: any) {
      console.error("Failed to save brand details:", err);
      setError(err?.message || "Failed to save details. Please retry.");
    } finally {
      setIsSavingBrandServices(false);
    }
  };

  // ─── Screen 6: Website Photos Handlers (Pick the photos we should work with) ───
  const handleWebsitePhotosBack = () => {
    const brandServicesIdx = activeSteps.findIndex((s) => s.id === "brand_services");
    const target = brandServicesIdx !== -1 ? brandServicesIdx : currentStep - 1;
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
    const photosToUse = place.photos && place.photos.length > 0
      ? place.photos
      : [
          "/images/places/gt_mall_1.jpg",
          "/images/places/gt_mall_2.jpg",
          "/images/places/gt_mall_3.jpg",
        ];
    const placeWithPhotos = {
      ...place,
      photos: photosToUse,
    };
    setSelectedMapsPlace(placeWithPhotos);
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

    setMapsPhotos(photosToUse);
    setSelectedMapsPhotos(photosToUse.slice(0, 10));

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

      const firstThingIdx = activeSteps.findIndex((s) => s.id === "first_thing");
      const target = firstThingIdx !== -1 ? firstThingIdx : currentStep + 1;
      setCurrentStep(target);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(target));
      }
    } catch (err: any) {
      console.error("Failed to skip website:", err);
      setError(extractErrorMessage(err, "Failed to skip website. Please retry."));
      const firstThingIdx = activeSteps.findIndex((s) => s.id === "first_thing");
      setCurrentStep(firstThingIdx !== -1 ? firstThingIdx : currentStep + 1);
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

      const firstThingIdx = activeSteps.findIndex((s) => s.id === "first_thing");
      const target = firstThingIdx !== -1 ? firstThingIdx : currentStep + 1;
      setCurrentStep(target);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_step", String(target));
      }
    } catch (err: any) {
      console.error("Failed to skip wholesale website:", err);
      setError(extractErrorMessage(err, "Failed to skip website. Please retry."));
      const firstThingIdx = activeSteps.findIndex((s) => s.id === "first_thing");
      setCurrentStep(firstThingIdx !== -1 ? firstThingIdx : currentStep + 1);
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

      const existingUser: any = (user || {}) as any;

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
        if (res.user) {
          const u = { ...res.user, role: "influencer", accountType: "influencer", onboardingCompleted: true };
          login(u);
        }
        sessionStorage.removeItem("pending_signup");
      } else {
        try {
          await userService.updateMe(influencerPayload);
        } catch (_) { }

        const updatedUser = {
          ...existingUser,
          role: "influencer",
          accountType: "influencer",
          onboardingCompleted: true,
        };
        login(updatedUser as any);
      }

      try {
        await OnboardingService.updateProgress({
          completed: true,
          onboarding_completed: true,
          onboardingCompleted: true,
          is_completed: true,
          onboarding_step: 3,
        });
      } catch (_) { }

      // Directly open Influencer Dashboard
      router.push("/onboarding/influencer");
    } catch (err: any) {
      console.error("Failed to activate influencer dashboard:", err);
      if (user) {
        login({
          ...user,
          role: "influencer",
          accountType: "influencer",
          onboardingCompleted: true,
        });
      }
      try {
        const u = JSON.parse(localStorage.getItem("user") || "{}");
        u.role = "influencer";
        u.accountType = "influencer";
        u.onboardingCompleted = true;
        localStorage.setItem("user", JSON.stringify(u));
      } catch (_) { }
      router.push("/onboarding/influencer");
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

        // User is actively on onboarding flow - do not auto-redirect away
        const stored = localStorage.getItem("user");
        const u = stored ? JSON.parse(stored) : user;
        if (u) {
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
        { id: "business_details_2", title: "Business Profile", desc: "Is this your business?" },
        { id: "brand_preferences", title: "Brand Identity", desc: "What's your business like?" },
        { id: "brand_services", title: "Brand Services", desc: "What's your business like?" },
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
              ? []
              : [
                { id: "website_reading", title: "Reading Website", desc: "AI audit" },
                { id: "business_details", title: "Business Details", desc: "Is this your business?" },
                { id: "business_details_2", title: "Business Profile", desc: "Is this your business?" },
                { id: "brand_preferences", title: "Brand Identity", desc: "What's your business like?" },
                { id: "brand_services", title: "Brand Services", desc: "What's your business like?" },
                { id: "website_photos", title: "Photos", desc: "Pick website photos" },
              ]),
          ]
          : selectedOnlinePresence === "b2b" || selectedOnlinePresence === "wholesale_b2b"
            ? [
              { id: "b2b_platforms", title: "B2B Channels", desc: "Wholesale platforms" },
              { id: "b2b_website", title: "Storefront", desc: "Storefront link" },
              ...(b2bSkipWebsite
                ? []
                : [
                  { id: "website_reading", title: "Reading Website", desc: "AI audit" },
                  { id: "business_details", title: "Business Details", desc: "Is this your business?" },
                  { id: "brand_preferences", title: "Brand Identity", desc: "What's your business like?" },
                  { id: "website_photos", title: "Photos", desc: "Pick website photos" },
                ]),
            ]
            : selectedOnlinePresence === "social_media"
              ? [
                { id: "social_platforms", title: "Social Profiles", desc: "Connect social media" },
              ]
              : selectedOnlinePresence === "none" || selectedOnlinePresence === "no_online_presence"
                ? [
                  { id: "none_details", title: "Business Basics", desc: "Name & products" },
                  { id: "none_brand_kit", title: "Brand Kit", desc: "Colors, font & voice" },
                ]
                : []),
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

  // Lock body/html scroll on single-screen steps to completely eliminate double scrollbars
  useEffect(() => {
    if (typeof document === "undefined") return;
    const noScrollSteps = [
      "business_details",
      "business_details_2",
      "brand_preferences",
      "brand_services",
      "presence",
      "get_started",
      "maps_details",
      "maps_website",
      "website_connect",
      "website_url",
    ];
    if (currentStepObj && noScrollSteps.includes(currentStepObj.id)) {
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.height = "100%";
      document.body.style.overflow = "hidden";
      document.body.style.height = "100%";
    } else {
      document.documentElement.style.overflow = "auto";
      document.documentElement.style.height = "auto";
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, [currentStepObj?.id]);

  // Safeguard: Ensure user is never stranded on a legacy identity screen
  useEffect(() => {
    if (accountType === "business" && currentStepObj && (currentStepObj.id as string) === "identity") {
      if (selectedOnlinePresence === "social_media") {
        const idx = activeSteps.findIndex((s) => s.id === "social_platforms");
        if (idx !== -1) setCurrentStep(idx);
      } else if (selectedOnlinePresence === "google_maps") {
        const idx = activeSteps.findIndex((s) => s.id === "maps_search");
        if (idx !== -1) setCurrentStep(idx);
      } else if (selectedOnlinePresence === "none" || selectedOnlinePresence === "no_online_presence") {
        const idx = activeSteps.findIndex((s) => s.id === "none_details");
        if (idx !== -1) setCurrentStep(idx);
      } else if (selectedOnlinePresence === "marketplace" || selectedOnlinePresence === "marketplace_seller") {
        const idx = activeSteps.findIndex((s) => s.id === "marketplace_platforms");
        if (idx !== -1) setCurrentStep(idx);
      } else if (selectedOnlinePresence === "b2b" || selectedOnlinePresence === "wholesale_b2b") {
        const idx = activeSteps.findIndex((s) => s.id === "b2b_platforms");
        if (idx !== -1) setCurrentStep(idx);
      } else if (selectedOnlinePresence === "website") {
        const idx = activeSteps.findIndex((s) => s.id === "website_url");
        if (idx !== -1) setCurrentStep(idx);
      } else {
        const pIdx = activeSteps.findIndex((s) => s.id === "presence");
        if (pIdx !== -1) setCurrentStep(pIdx);
      }
    }
  }, [currentStepObj?.id, selectedOnlinePresence, activeSteps, accountType]);

  // Dynamic website photos fetcher when entering website_photos step
  useEffect(() => {
    if (currentStepObj?.id === "website_photos" && websitePhotos.length === 0 && websiteUrl) {
      const fetchLivePhotos = async () => {
        try {
          const res = await fetch(`/api/onboarding/scrape-photos?url=${encodeURIComponent(websiteUrl)}`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data?.photos) && data.photos.length > 0) {
              setWebsitePhotos(data.photos);
              setSelectedPhotos(data.photos);
              if (typeof window !== "undefined") {
                sessionStorage.setItem("website_scraped_photos", JSON.stringify(data.photos));
                sessionStorage.setItem("website_selected_photos", JSON.stringify(data.photos));
              }
            }
          }
        } catch (_) {}
      };
      fetchLivePhotos();
    }
  }, [currentStepObj?.id, websitePhotos.length, websiteUrl]);


  const isLastStep = currentStep === activeSteps.length - 1;
  const isFormCardStep =
    currentStepObj.id !== "get_started" &&
    currentStepObj.id !== "business_services" &&
    currentStepObj.id !== "presence" &&
    currentStepObj.id !== "social_platforms" &&
    currentStepObj.id !== "website_url" &&
    currentStepObj.id !== "website_reading" &&
    currentStepObj.id !== "business_details" &&
    currentStepObj.id !== "business_details_2" &&
    currentStepObj.id !== "brand_preferences" &&
    currentStepObj.id !== "brand_services" &&
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
        return true;
      } else if (stepId === "website_url") {
        if (!isValidWebsiteUrl(websiteUrl)) {
          setError("Please enter a valid website address.");
          return false;
        }
      } else if (stepId === "website_reading") {
        return true;
      } else if (stepId === "business_details" || stepId === "business_details_2") {
        if (!businessDetails.business_name.trim()) {
          setError("Business Name is required.");
          return false;
        }
      } else if (stepId === "brand_preferences" || stepId === "brand_services") {
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
        if (user) {
          login({
            ...user,
            onboardingCompleted: true,
            ...(accountType === "influencer"
              ? { role: "influencer", accountType: "influencer" }
              : {}),
          });
        }
      } catch (err) {
        console.error("Failed to mark onboarding complete:", err);
      }
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
      } catch (_) { }
      if (accountType === "influencer") {
        router.push("/onboarding/influencer");
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
      if (firstThingChoice === "fashion_studio") {
        try {
          sessionStorage.setItem("dhandagrow_photoshoot_active_tab", "avatar");
          await OnboardingService.saveFirstContentChoice("ai_photoshoot");
        } catch (_) {}
        router.push("/ai-photoshoot/avatar");
        return;
      }

      if (firstThingChoice === "product_studio") {
        try {
          sessionStorage.setItem("dhandagrow_photoshoot_active_tab", "product");
          await OnboardingService.saveFirstContentChoice("ai_photoshoot");
        } catch (_) {}
        router.push("/ai-photoshoot/product");
        return;
      }

      if (firstThingChoice === "reel_maker") {
        // Reel Maker is coming soon: do not allow proceeding
        return;
      }

      // Default: proceed with Post Maker flow
      try {
        await OnboardingService.saveFirstContentChoice("post_maker");
      } catch (err) {
        console.warn("Notice: Continuing to post selection:", err);
      }

      const pickIdx = activeSteps.findIndex((s) => s.id === "post_maker_pick");
      const target = pickIdx !== -1 ? pickIdx : currentStep + 1;
      setCurrentStep(target);
      if (typeof window !== "undefined") sessionStorage.setItem("onboarding_step", String(target));
    } catch (err: any) {
      console.error("Failed to proceed from first thing:", err);
      const pickIdx = activeSteps.findIndex((s) => s.id === "post_maker_pick");
      const target = pickIdx !== -1 ? pickIdx : currentStep + 1;
      setCurrentStep(target);
      if (typeof window !== "undefined") sessionStorage.setItem("onboarding_step", String(target));
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
        const platIdx = activeSteps.findIndex((s) => s.id === "marketplace_website");
        const target = platIdx !== -1 ? platIdx : currentStep - 1;
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
        const platIdx = activeSteps.findIndex((s) => s.id === "b2b_website");
        const target = platIdx !== -1 ? platIdx : currentStep - 1;
        setCurrentStep(target);
        if (typeof window !== "undefined") sessionStorage.setItem("onboarding_step", String(target));
      } else {
        const photosIdx = activeSteps.findIndex((s) => s.id === "website_photos");
        const target = photosIdx !== -1 ? photosIdx : currentStep - 1;
        setCurrentStep(target);
        if (typeof window !== "undefined") sessionStorage.setItem("onboarding_step", String(target));
      }
    } else if (selectedOnlinePresence === "social_media") {
      const sIdx = activeSteps.findIndex((s) => s.id === "social_platforms");
      const target = sIdx !== -1 ? sIdx : 3;
      setCurrentStep(target);
      if (typeof window !== "undefined") sessionStorage.setItem("onboarding_step", String(target));
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
    setGenerationStage("studying");
    setGenerationProgress(20);
    setGenerationStatusText("Setting your mood");
    const businessName = businessProfile.business_name || businessDetails.business_name || "SevenUnique Tech Solution";
    const category = businessProfile.business_category || businessDetails.category || "Testing electronics";
    const activePhoto = promoPhoto || getAvailablePhotos()[0] || DEFAULT_BUSINESS_PHOTOS[0];

    try {
      // Stage 1: Studying your photo (Image 1)
      await new Promise((r) => setTimeout(r, 1000));
      setGenerationProgress(60);
      await new Promise((r) => setTimeout(r, 1000));
      setGenerationProgress(100);
      await new Promise((r) => setTimeout(r, 600));

      // Stage 2: You just took the first step (Image 2)
      setGenerationStage("first_step");
      await new Promise((r) => setTimeout(r, 2600));

      // Stage 3: Your daily posts are being made (Image 3)
      setGenerationStage("daily_posts");

      // Background post synthesis
      try {
        const res = await contentService.generateContent({
          type: "Instagram Post",
          platform: "Instagram",
          language: brandPreferences.language || "English",
          tone: brandPreferences.tones[0] || "Professional",
          productName: businessName,
          productDescription: businessProfile.business_description || businessDetails.tagline || (category + " business services and offerings"),
          use_brand_kit: true,
          brand_name: businessName,
          targetAudience: businessDetails.target_audience || "Customers and clients",
          productImages: [activePhoto],
        });

        const generatedPostData: GeneratedPost = {
          product_id: "onboarding_" + Date.now(),
          platform: "Instagram",
          objective: "Promotions and Brand Growth",
          headline: res?.data?.title || (businessName + " Special Launch & Offers"),
          caption: res?.data?.caption || ("Accelerate your results with " + businessName + ". Top-tier solutions designed for your needs."),
          call_to_action: res?.data?.callToAction || "Link in bio / Tap to learn more",
          hashtags: Array.isArray(res?.data?.hashtags) && res.data.hashtags.length > 0
            ? res.data.hashtags
            : ["#" + businessName.replace(/[^a-zA-Z0-9]/g, ""), "#" + category.replace(/[^a-zA-Z0-9]/g, ""), "#BusinessGrowth", "#DhandaGrow"],
          image_url: activePhoto,
          media_url: activePhoto,
          creative_direction: "Vibrant high-conversion promotional design with curated brand color accents.",
        };
        setGeneratedOnboardingPost(generatedPostData);
      } catch (synthErr) {
        console.warn("Client fallback for generated post:", synthErr);
        const fallbackPost: GeneratedPost = {
          product_id: "onboarding_" + Date.now(),
          platform: "Instagram",
          objective: "Promotions and Brand Growth",
          headline: businessName + " Special Launch",
          caption: "Elevate your business with " + businessName + ". Quality, consistency, and results.",
          call_to_action: "Visit profile link",
          hashtags: ["#" + businessName.replace(/[^a-zA-Z0-9]/g, ""), "#BusinessGrowth", "#DhandaGrow"],
          image_url: activePhoto,
          media_url: activePhoto,
        };
        setGeneratedOnboardingPost(fallbackPost);
      }
    } catch (err: any) {
      console.error("Post generation flow error:", err);
      setGenerationStage("daily_posts");
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
      OnboardingService.completeOnboarding().catch(() => { });
    } catch (_) { }

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
          if (res.user) {
            login(res.user);
          }
          sessionStorage.removeItem("pending_signup");
          try {
            await userService.updateMe(userPayload);
          } catch (_) { }
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
        } catch (_) { }

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
          if (res.user) {
            const finalInfUser = { ...res.user, role: "influencer", accountType: "influencer" };
            login(finalInfUser);
          }
          sessionStorage.removeItem("pending_signup");
          try {
            await userService.updateMe(influencerPayload);
          } catch (_) { }
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
        } catch (_) { }

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
          if (res.user) {
            login(res.user);
          }
          sessionStorage.removeItem("pending_signup");
          try {
            await userService.updateMe({
              ...businessPayload,
              onboardingData: businessPayload,
            });
          } catch (_) { }
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
          } catch (_) { }
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
        } catch (_) { }

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
        } catch (_) { }

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
    <div className={`${
      currentStepObj.id === "get_started"
        ? "h-screen h-[100dvh] max-h-screen overflow-hidden p-0"
        : [
            "business_details",
            "business_details_2",
            "brand_preferences",
            "brand_services",
            "presence",
            "maps_details",
            "maps_website",
            "website_connect",
            "website_url",
          ].includes(currentStepObj.id)
        ? "h-screen h-[100dvh] max-h-screen overflow-hidden py-1.5 sm:py-2 px-3 sm:px-6 select-none"
        : ["website_photos", "maps_photos", "photos"].includes(currentStepObj.id)
        ? "min-h-screen py-4 sm:py-6 px-3 sm:px-6 overflow-y-auto overflow-x-hidden"
        : "min-h-screen py-2 sm:py-3 lg:py-2.5 px-3 sm:px-6 overflow-y-auto overflow-x-hidden"
    } bg-[#081226] text-[#ededf2] flex flex-col justify-between relative selection:bg-[#be32ff]/30 ${
      ["website_photos", "maps_photos", "photos"].includes(currentStepObj.id) ? "overflow-y-auto" : "overflow-hidden"
    }`}>
      {/* Top right Logout / Exit to Login button */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-6 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/30 text-xs font-medium text-slate-300 hover:text-rose-300 transition-all cursor-pointer backdrop-blur-md shadow-sm"
          title="Log out and return to mobile login"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Log Out</span>
        </button>
      </div>

      {/* Background ambient lighting matching DhandaGrow dark navy & gradient accent theme (hidden on get_started & business_services for exact #081226 background) */}
      {!["get_started", "business_services", "presence", "website_url", "analyzing_site", "photos", "website_photos", "first_thing", "post_maker_pick", "post_maker_ready", "none_details", "none_brand_kit"].includes(currentStepObj.id) && (
        <>
          <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-gradient-to-br from-[#fc9a5d]/20 via-[#f0449b]/15 to-transparent rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/3 -right-32 w-[32rem] h-[32rem] bg-gradient-to-bl from-[#be32ff]/20 via-[#7d36fa]/10 to-transparent rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute -bottom-32 left-1/4 w-[30rem] h-[30rem] bg-gradient-to-tr from-[#f0449b]/15 via-[#be32ff]/10 to-transparent rounded-full blur-[150px] pointer-events-none" />
        </>
      )}

      {/* Bottom Waves matching Designer Screen 1 */}
      {currentStepObj.id === "get_started" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Bottom Left Sunset Gradient Wave (Exact Figma Image 1 Vector 7: Fill #FC9A5D -> #BE32FF 18%, Border 2px #FC9A5D -> #7D36FA 68%) */}
          <svg
            className="absolute bottom-0 left-0 w-[55vw] min-w-[380px] max-w-[700px] h-[36vh] min-h-[220px] max-h-[366px]"
            viewBox="0 0 1033 366"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Exact Figma Vector 7 Colors: Linear Gradient #FC9A5D -> #BE32FF 18% */}
              <linearGradient id="waveSunsetOnboarding" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FC9A5D" stopOpacity="1" />
                <stop offset="100%" stopColor="#BE32FF" stopOpacity="0.18" />
              </linearGradient>
              {/* Exact Figma Vector 7 Borders: 2px Linear Gradient #FC9A5D -> #7D36FA 68% */}
              <linearGradient id="waveBorderSunset" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FC9A5D" stopOpacity="1" />
                <stop offset="100%" stopColor="#7D36FA" stopOpacity="0.68" />
              </linearGradient>
            </defs>
            <path
              d="M 0 0 C 353 78, 706 230, 1033 366 L 0 366 Z"
              fill="url(#waveSunsetOnboarding)"
            />
            {/* 2px stroke matching Figma Vector 7 Border */}
            <path
              d="M 0 0 C 353 78, 706 230, 1033 366"
              stroke="url(#waveBorderSunset)"
              strokeWidth="2"
              fill="none"
            />
          </svg>

          {/* Bottom Right Deep Violet/Blue Wave Layer (Exact Reference Colors & Crest) */}
          <svg
            className="absolute bottom-0 right-0 w-[56vw] min-w-[400px] max-w-[650px] h-[15vh] min-h-[95px] max-h-[130px]"
            viewBox="0 0 600 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="waveVioletRightOnboarding" x1="0%" y1="100%" x2="70%" y2="0%">
                <stop offset="0%" stopColor="#101334" stopOpacity="0.95" />
                <stop offset="45%" stopColor="#261a5c" stopOpacity="0.98" />
                <stop offset="100%" stopColor="#3b2081" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path
              d="M 0 120 C 180 115, 320 22, 450 25 C 510 27, 560 38, 600 42 L 600 120 Z"
              fill="url(#waveVioletRightOnboarding)"
            />
          </svg>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 1: GET STARTED (Designer Screenshot 1)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "get_started" && (
        <div className="w-full max-w-md mx-auto h-full max-h-[100dvh] flex flex-col justify-between items-center text-center pt-8 sm:pt-10 pb-8 sm:pb-10 relative z-10 px-4">
          {/* Top Header / Brand Logo with prominent larger D */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3 pt-1 shrink-0">
            <img
              src="/images/logo-icon.png"
              alt="DhandaGrow"
              className="h-12 sm:h-14 w-auto object-contain drop-shadow-[0_0_15px_rgba(240,68,155,0.45)] select-none shrink-0"
            />
            <div className="flex flex-col justify-center text-left">
              <img
                src="/images/dhandagrow-text-logo.png"
                alt="DhandaGrow AI"
                className="h-7 sm:h-8 w-auto object-contain select-none"
              />
              <p className="text-xs sm:text-[13px] text-white font-normal tracking-wide mt-1">
                India&apos;s AI Business Growth App
              </p>
            </div>
          </div>

          {/* Heading & Subtext */}
          <div className="text-center space-y-2 px-2 mt-4 sm:mt-6 shrink-0">
            <h1 className="text-3xl sm:text-4xl text-white tracking-tight leading-[1.18]">
              <span className="font-normal">Your Business</span><br />
              <span className="font-normal">Deserve to </span>
              <span className="font-bold bg-gradient-to-r from-[#FFA266] via-[#FC9A5D] via-[#FA6E59] to-[#BE32FF] bg-clip-text text-transparent">
                Grow
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xs sm:max-w-sm mx-auto leading-relaxed font-normal">
              Create, market, publish and sell - all with the power of AI.
            </p>
          </div>

          {/* 3D Storefront Illustration with generous space above & below matching screenshot */}
          <div className="relative my-auto flex items-center justify-center shrink min-h-0 pt-5 pb-3">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FA5D42]/10 via-[#E84E8F]/15 to-[#9936F1]/10 blur-2xl rounded-full transform scale-90 -z-0" />
            <img
              src="/images/onboarding-storefront.png"
              alt="DhandaGrow Business Storefront"
              className="w-auto h-auto max-h-[170px] sm:max-h-[190px] max-w-[260px] sm:max-w-[290px] object-contain relative z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] select-none pointer-events-none"
            />
          </div>

          {/* Get Started Button (Exact Image 1 & 2 Colors) */}
          <div className="w-full shrink-0 flex justify-center pt-2">
            <button
              type="button"
              id="get-started-btn"
              onClick={handleGetStarted}
              disabled={isSavingGetStarted}
              className="w-full max-w-[290px] sm:max-w-[340px] h-11 sm:h-12 rounded-full text-white font-medium text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-[#be32ff]/25 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mx-auto px-6"
              style={{
                background: "linear-gradient(90deg, #7d36fa 0%, #be32ff 33%, #f0449b 66%, #fc9a5d 100%)",
                boxShadow: "0 4px 25px rgba(190, 50, 255, 0.35)",
              }}
            >
              {isSavingGetStarted ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
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
        <div className="w-full max-w-5xl mx-auto py-4 sm:py-6 flex flex-col justify-between min-h-[540px] sm:min-h-[580px] animate-in fade-in duration-400 relative z-10 px-4 sm:px-6">
          <div>
            {/* Top Bar: Back button + Long Gradient Progress Bar (Image 4) */}
            <div className="flex items-center w-full mb-6">
              <button
                type="button"
                onClick={handleServicesBack}
                aria-label="Go back"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-slate-700/60"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
              <div className="flex-1 h-1.5 sm:h-2 bg-slate-800 rounded-full overflow-hidden ml-4 sm:ml-6">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] via-[#be32ff] to-[#7d36fa] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(240,68,155,0.5)]"
                  style={{ width: "25%" }}
                />
              </div>
            </div>

            {/* Heading & Subtitle Area (Image 4) */}
            <div className="mb-6 text-left">
              <h1 className="text-2xl sm:text-3xl font-normal text-white tracking-tight">
                Choose your{" "}
                <span className="font-normal bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] via-[#be32ff] to-[#7d36fa] bg-clip-text text-transparent">
                  business services
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-normal">
                Select the tool you want to use for your business
              </p>
            </div>

            {/* Services Cards: 4 Top Row + 4 Bottom Row (with Coming Soon state) */}
            <div className="space-y-4 sm:space-y-6 my-3 sm:my-4">
              {/* Row 1: Top 4 Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                {BUSINESS_SERVICES_OPTIONS.slice(0, 4).map((srv) => {
                  const isComingSoon = Boolean((srv as any).comingSoon);
                  const isSelected = !isComingSoon && selectedServices.includes(srv.id);
                  const IconComp = srv.icon;
                  return (
                    <div
                      key={srv.id}
                      id={`service-card-${srv.id}`}
                      onClick={() => {
                        if (!isComingSoon) {
                          handleToggleService(srv.id);
                        }
                      }}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-start min-h-[150px] sm:min-h-[164px] relative select-none ${
                        isComingSoon
                          ? "bg-[#0d1424]/70 border-slate-800/60 opacity-60 cursor-not-allowed"
                          : isSelected
                            ? "bg-[#141B34] border-2 border-[#BE32FF] shadow-[0_0_20px_rgba(190,50,255,0.3)] ring-1 ring-[#BE32FF]/50 cursor-pointer"
                            : "bg-[#10172B] border-slate-800 hover:border-slate-700 hover:bg-[#131C36] cursor-pointer"
                      }`}
                    >
                      <div className="flex items-start justify-between w-full mb-3.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${srv.iconBg} ${isComingSoon ? "opacity-60" : ""}`}>
                          <IconComp className={`w-5 h-5 ${srv.iconColor}`} fill="currentColor" fillOpacity={0.25} />
                        </div>
                        {isComingSoon && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gradient-to-r from-[#be32ff]/20 to-[#f0449b]/20 text-purple-200 border border-purple-500/30 shadow-xs">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-start">
                        <h3 className={`text-sm sm:text-base font-normal tracking-normal leading-snug ${isComingSoon ? "text-slate-400" : "text-white"}`}>
                          {srv.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-slate-400 mt-1.5 leading-snug font-normal line-clamp-2">
                          {srv.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Row 2: Bottom 4 Cards (Leads, CRM, AI Marketing Agent as Coming Soon) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                {BUSINESS_SERVICES_OPTIONS.slice(4).map((srv) => {
                  const isComingSoon = Boolean((srv as any).comingSoon);
                  const isSelected = !isComingSoon && selectedServices.includes(srv.id);
                  const IconComp = srv.icon;
                  return (
                    <div
                      key={srv.id}
                      id={`service-card-${srv.id}`}
                      onClick={() => {
                        if (!isComingSoon) {
                          handleToggleService(srv.id);
                        }
                      }}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-start min-h-[150px] sm:min-h-[164px] relative select-none ${
                        isComingSoon
                          ? "bg-[#0d1424]/70 border-slate-800/60 opacity-60 cursor-not-allowed"
                          : isSelected
                            ? "bg-[#141B34] border-2 border-[#BE32FF] shadow-[0_0_20px_rgba(190,50,255,0.3)] ring-1 ring-[#BE32FF]/50 cursor-pointer"
                            : "bg-[#10172B] border-slate-800 hover:border-slate-700 hover:bg-[#131C36] cursor-pointer"
                      }`}
                    >
                      <div className="flex items-start justify-between w-full mb-3.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${srv.iconBg} ${isComingSoon ? "opacity-60" : ""}`}>
                          <IconComp className={`w-5 h-5 ${srv.iconColor}`} fill="currentColor" fillOpacity={0.25} />
                        </div>
                        {isComingSoon && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gradient-to-r from-[#be32ff]/20 to-[#f0449b]/20 text-purple-200 border border-purple-500/30 shadow-xs">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-start">
                        <h3 className={`text-sm sm:text-base font-normal tracking-normal leading-snug ${isComingSoon ? "text-slate-400" : "text-white"}`}>
                          {srv.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-slate-400 mt-1.5 leading-snug font-normal line-clamp-2">
                          {srv.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Validation & Centered Continue Button (Image 4) */}
          <div className="pt-6 pb-4 flex flex-col items-center">
            {servicesError && (
              <div className="mb-3 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-center flex items-center justify-center gap-1.5 animate-in fade-in max-w-sm w-full">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{servicesError}</span>
              </div>
            )}
            <button
              type="button"
              id="services-continue-btn"
              onClick={handleServicesContinue}
              disabled={isSavingServices || selectedServices.length === 0}
              className={`w-full max-w-sm h-12 sm:h-13 rounded-full font-semibold text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#be32ff]/25 ${selectedServices.length > 0 && !isSavingServices
                  ? "bg-gradient-to-r from-[#7d36fa] via-[#be32ff] via-[#f0449b] to-[#fc9a5d] hover:brightness-110 active:scale-[0.98] text-white"
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
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
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
        <div className="w-full max-w-5xl lg:max-w-6xl mx-auto pt-1 sm:pt-2 pb-2 flex flex-col justify-start animate-in fade-in duration-400 relative z-10 px-4 sm:px-6">
          <div>
            {/* Top Bar: Back button + Long Gradient Progress Bar (Image 5) */}
            <div className="flex items-center w-full mb-3 sm:mb-4">
              <button
                type="button"
                onClick={handlePresenceBack}
                aria-label="Go back"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-slate-700/60"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
              <div className="flex-1 h-1.5 sm:h-2 bg-slate-800 rounded-full overflow-hidden ml-4 sm:ml-6">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] via-[#be32ff] to-[#7d36fa] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(240,68,155,0.5)]"
                  style={{ width: "50%" }}
                />
              </div>
            </div>

            {/* Heading & Subtitle Area (Image 5) */}
            <div className="mb-3 sm:mb-4 text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-white tracking-tight">
                What does your{" "}
                <span className="font-normal bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] via-[#be32ff] to-[#7d36fa] bg-clip-text text-transparent">
                  business
                </span>{" "}
                live online?
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-1 font-normal">
                Choose how you want your business to establish and grow its online presence
              </p>
            </div>

            {/* 5 Presence Cards (Symmetric 5-card layout with centered 5th card of identical width) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5 my-2 sm:my-3">
              {ONLINE_PRESENCE_OPTIONS.map((opt) => {
                const isSelected =
                  selectedOnlinePresence === opt.id ||
                  (opt.id === "marketplace" && selectedOnlinePresence === "marketplace_seller") ||
                  (opt.id === "b2b" && selectedOnlinePresence === "wholesale_b2b") ||
                  (opt.id === "none" && selectedOnlinePresence === "no_online_presence");
                const IconComp = opt.icon;
                const isNone = opt.id === "none";
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectPresence(opt.id)}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer relative overflow-hidden flex items-start gap-3.5 min-h-[82px] sm:min-h-[88px] ${isNone ? "md:col-span-2 md:w-[calc(50%-0.4375rem)] md:mx-auto w-full" : ""} ${isSelected
                        ? "bg-[#141B34] border-2 border-[#BE32FF] shadow-[0_0_20px_rgba(190,50,255,0.3)] ring-1 ring-[#BE32FF]/50"
                        : "bg-[#10172B] border-slate-800 hover:border-slate-700 hover:bg-[#131C36]"
                      }`}
                  >
                    <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${opt.iconBg || "bg-white/10"}`}>
                      <IconComp className={`w-5 h-5 sm:w-5.5 sm:h-5.5 ${opt.iconColor || "text-white"}`} fill="currentColor" fillOpacity={0.25} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base sm:text-lg font-medium text-white tracking-tight">
                          {opt.title}
                        </h3>
                      </div>

                      {opt.desc && (
                        <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-tight font-normal line-clamp-1">
                          {opt.desc}
                        </p>
                      )}

                      {opt.logos && (
                        <div className="mt-2 flex items-center">
                          <img
                            src={opt.logos}
                            alt={opt.logosAlt}
                            className="h-5.5 sm:h-6 w-auto object-contain select-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* None of these - something else (Image 5) */}
            <div className="text-center pt-2 pb-0.5">
              <button
                type="button"
                onClick={() => handleSelectPresence("other")}
                className={`text-sm sm:text-base transition-all cursor-pointer ${selectedOnlinePresence === "other" || selectedOnlinePresence === "something_else"
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] via-[#be32ff] to-[#7d36fa] font-bold underline underline-offset-4"
                    : "text-slate-400 hover:text-white"
                  }`}
              >
                None of these - something else
              </button>
            </div>

            {/* Error Notice */}
            {error && (
              <div className="mt-2 p-2.5 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 animate-in fade-in">
                <span className="font-semibold text-red-400">Notice:</span> {error}
              </div>
            )}
          </div>

          {/* Centered Continue Button (Exact Image 2 Alignment) */}
          <div className="pt-4 sm:pt-6 pb-2 flex flex-col items-center">
            <button
              type="button"
              onClick={handlePresenceContinue}
              disabled={!selectedOnlinePresence || isSavingPresence}
              className={`w-full max-w-sm sm:max-w-md h-12 sm:h-13 rounded-full font-semibold text-base flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-[#be32ff]/25 ${selectedOnlinePresence && !isSavingPresence
                  ? "bg-gradient-to-r from-[#7d36fa] via-[#be32ff] via-[#f0449b] to-[#fc9a5d] text-white hover:brightness-110 active:scale-[0.98] cursor-pointer"
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
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
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
          SCREEN: CONNECT YOUR SOCIAL MEDIA ACCOUNTS (Exact Image 2)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "social_platforms" && (
        <div className="w-full max-w-4xl lg:max-w-5xl mx-auto my-auto py-2 sm:py-4 flex flex-col justify-center animate-in fade-in duration-400 relative z-10 px-4 sm:px-8">
          <div>
            {/* Top Bar: Back button + Full-width Thin Gradient Progress Bar (~35%) */}
            <div className="flex items-center gap-3 w-full mb-4 sm:mb-6">
              <button
                type="button"
                onClick={handleSocialPlatformsBack}
                aria-label="Go back"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/10"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
              <div className="flex-1 h-1.5 sm:h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "35%" }}
                />
              </div>
            </div>

            {/* Heading & Subtitle (Exact Image 2) */}
            <div className="mb-6 sm:mb-8 text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-white tracking-tight">
                Connect your{" "}
                <span className="font-normal bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] bg-clip-text text-transparent">
                  social media accounts
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-normal">
                Link your social media accounts to create, schedule and manage content - all in one place.
              </p>
            </div>

            {/* Accounts Card List */}
            <div className="w-full max-w-2xl sm:max-w-3xl mx-auto rounded-2xl bg-[#0e162b]/90 border border-slate-800/80 divide-y divide-slate-800/80 overflow-hidden shadow-xl">
              {/* Row 1: Instagram */}
              <div
                onClick={() => handleOpenSocialAuth("instagram", "login")}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors hover:bg-white/[0.04] cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden shrink-0 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 44 44" fill="none">
                      <defs>
                        <radialGradient id="igOfficialGradRow" cx="20%" cy="115%" r="135%">
                          <stop offset="0%" stopColor="#fdf497" />
                          <stop offset="5%" stopColor="#fdf497" />
                          <stop offset="45%" stopColor="#fd5949" />
                          <stop offset="60%" stopColor="#d6249f" />
                          <stop offset="90%" stopColor="#285AEB" />
                        </radialGradient>
                      </defs>
                      <rect width="44" height="44" rx="11" fill="url(#igOfficialGradRow)" />
                      <rect x="9.5" y="9.5" width="25" height="25" rx="7" stroke="#ffffff" strokeWidth="2.8" fill="none" />
                      <circle cx="22" cy="22" r="6.2" stroke="#ffffff" strokeWidth="2.8" fill="none" />
                      <circle cx="29.8" cy="14.2" r="1.6" fill="#ffffff" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-normal text-white text-base sm:text-lg block">Instagram</span>
                    {socialHandles.instagram && (
                      <span className="text-[11px] text-slate-400 font-mono block">@{socialHandles.instagram.replace(/^@/, '')}</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleConnectAccount("instagram");
                  }}
                  className={`px-5 sm:px-6 py-2 rounded-full font-medium text-xs sm:text-sm transition-all cursor-pointer ${
                    connectedSocialAccounts.instagram
                      ? "text-white shadow-md shadow-[#f0449b]/25 hover:brightness-110 active:scale-[0.98]"
                      : "bg-[#222c42] hover:bg-[#2b3752] text-slate-200 border border-white/5"
                  }`}
                  style={connectedSocialAccounts.instagram ? { background: "linear-gradient(90deg, #be32ff 0%, #f0449b 100%)" } : {}}
                >
                  {connectedSocialAccounts.instagram ? "Connected" : "Connect"}
                </button>
              </div>

              {/* Row 2: Facebook */}
              <div
                onClick={() => handleOpenSocialAuth("facebook", "login")}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors hover:bg-white/[0.04] cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shrink-0 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 44 44" fill="none">
                      <circle cx="22" cy="22" r="22" fill="#1877F2" />
                      <path
                        d="M29.5 22.8H24.5V38H18.2V22.8H14.8V17.5H18.2V13.8C18.2 9.9 20.7 7.7 24.6 7.7C26.5 7.7 28.1 7.8 28.6 7.9V12.4H25.9C24 12.4 23.6 13.3 23.6 14.7V17.5H28.7L27.9 22.8H29.5Z"
                        fill="#FFFFFF"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-normal text-white text-base sm:text-lg block">Facebook</span>
                    {socialHandles.facebook && (
                      <span className="text-[11px] text-slate-400 font-mono block">@{socialHandles.facebook.replace(/^@/, '')}</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleConnectAccount("facebook");
                  }}
                  className={`px-5 sm:px-6 py-2 rounded-full font-medium text-xs sm:text-sm transition-all cursor-pointer ${
                    connectedSocialAccounts.facebook
                      ? "text-white shadow-md shadow-[#f0449b]/25 hover:brightness-110 active:scale-[0.98]"
                      : "bg-[#222c42] hover:bg-[#2b3752] text-slate-200 border border-white/5"
                  }`}
                  style={connectedSocialAccounts.facebook ? { background: "linear-gradient(90deg, #be32ff 0%, #f0449b 100%)" } : {}}
                >
                  {connectedSocialAccounts.facebook ? "Connected" : "Connect"}
                </button>
              </div>

              {/* Row 3: LinkedIn */}
              <div
                onClick={() => handleOpenSocialAuth("linkedin", "login")}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors hover:bg-white/[0.04] cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shrink-0 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 44 44" fill="none">
                      <rect width="44" height="44" rx="9" fill="#0A66C2" />
                      <path
                        d="M13.2 17.5H18V33H13.2V17.5ZM15.6 9.8C17.1 9.8 18.3 11 18.3 12.5C18.3 14 17.1 15.2 15.6 15.2C14.1 15.2 12.9 14 12.9 12.5C12.9 11 14.1 9.8 15.6 9.8ZM21 17.5H25.6V19.6H25.7C26.3 18.4 27.9 17.1 30.3 17.1C35.2 17.1 36.1 20.3 36.1 24.5V33H31.3V25.3C31.3 23.5 31.2 21.1 28.7 21.1C26.1 21.1 25.8 23.1 25.8 25.2V33H21V17.5Z"
                        fill="#FFFFFF"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-normal text-white text-base sm:text-lg block">LinkedIn</span>
                    {socialHandles.linkedin && (
                      <span className="text-[11px] text-slate-400 font-mono block">@{socialHandles.linkedin.replace(/^@/, '')}</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleConnectAccount("linkedin");
                  }}
                  className={`px-5 sm:px-6 py-2 rounded-full font-medium text-xs sm:text-sm transition-all cursor-pointer ${
                    connectedSocialAccounts.linkedin
                      ? "text-white shadow-md shadow-[#f0449b]/25 hover:brightness-110 active:scale-[0.98]"
                      : "bg-[#222c42] hover:bg-[#2b3752] text-slate-200 border border-white/5"
                  }`}
                  style={connectedSocialAccounts.linkedin ? { background: "linear-gradient(90deg, #be32ff 0%, #f0449b 100%)" } : {}}
                >
                  {connectedSocialAccounts.linkedin ? "Connected" : "Connect"}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-6 sm:pt-8 pb-2 flex flex-col items-center">
            <button
              type="button"
              onClick={handleSocialPlatformsContinue}
              disabled={isSavingSocialPlatforms}
              className="w-full max-w-sm sm:max-w-md h-11 sm:h-12 rounded-full font-semibold text-sm sm:text-base text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#be32ff]/25 hover:opacity-95 active:scale-[0.98]"
              style={{ background: "linear-gradient(90deg, #7d36fa 0%, #be32ff 33%, #f0449b 67%, #fc9a5d 100%)" }}
            >
              {isSavingSocialPlatforms ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 stroke-[2]" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                const firstUnconnected = (["facebook", "linkedin", "instagram"] as const).find(
                  (k) => !connectedSocialAccounts[k]
                ) || "facebook";
                handleOpenSocialAuth(firstUnconnected, "create");
              }}
              className="w-full max-w-sm sm:max-w-md h-10 sm:h-11 mt-3 rounded-full bg-[#182035]/80 hover:bg-[#202b47] border border-white/10 text-xs sm:text-sm text-slate-300 font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Create Account</span>
              <UserPlus className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Create & Connect Social Account Modal */}
          {isCreateAccountModalOpen && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => setIsCreateAccountModalOpen(false)}
            >
              <div
                className="relative w-full max-w-md bg-[#0e162b] border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-white overflow-hidden max-h-[92vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Glow accent */}
                <div className="absolute -top-16 -right-16 w-36 h-36 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {socialAuthModalMode === "login"
                        ? `Log In to ${createAccountPlatform === "instagram" ? "Instagram" : createAccountPlatform === "facebook" ? "Facebook" : "LinkedIn"}`
                        : `Create ${createAccountPlatform === "instagram" ? "Instagram" : createAccountPlatform === "facebook" ? "Facebook" : "LinkedIn"} Account`}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {socialAuthModalMode === "login"
                        ? `Enter your account username/ID and password to link your profile`
                        : `Create a new account for your business and connect it directly`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCreateAccountModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Mode Selector Tabs (Log In vs Create Account) */}
                <div className="mt-4 p-1 bg-black/40 border border-white/10 rounded-xl flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSocialAuthModalMode("login");
                      setSocialAuthError("");
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      socialAuthModalMode === "login"
                        ? "bg-gradient-to-r from-[#7d36fa] to-[#be32ff] text-white shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Log In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSocialAuthModalMode("create");
                      setSocialAuthError("");
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      socialAuthModalMode === "create"
                        ? "bg-gradient-to-r from-[#be32ff] to-[#f0449b] text-white shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create Account</span>
                  </button>
                </div>

                {/* Platform Selector Buttons */}
                <div className="mt-4">
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    Select Social Platform:
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setCreateAccountPlatform("instagram");
                        setCreateAccountHandle(socialHandles.instagram || (businessProfile.business_name ? `@${businessProfile.business_name.toLowerCase().replace(/\s+/g, '')}` : ""));
                        setSocialAuthError("");
                      }}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        createAccountPlatform === "instagram"
                          ? "bg-gradient-to-tr from-[#f09433]/20 via-[#dc2743]/20 to-[#bc1888]/20 border-[#bc1888] shadow-sm ring-1 ring-[#bc1888]/50"
                          : "bg-white/5 border-white/10 hover:bg-white/10 text-slate-300"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 44 44" fill="none">
                          <rect width="44" height="44" rx="10" fill="url(#igOfficialGradRow)" />
                          <rect x="9.5" y="9.5" width="25" height="25" rx="7" stroke="#ffffff" strokeWidth="2.8" fill="none" />
                          <circle cx="22" cy="22" r="6.2" stroke="#ffffff" strokeWidth="2.8" fill="none" />
                          <circle cx="29.8" cy="14.2" r="1.6" fill="#ffffff" />
                        </svg>
                      </div>
                      <span className="text-[11px] font-semibold text-white">Instagram</span>
                      {connectedSocialAccounts.instagram && (
                        <span className="text-[9px] text-emerald-400 font-medium">Linked ✓</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCreateAccountPlatform("facebook");
                        setCreateAccountHandle(socialHandles.facebook || (businessProfile.business_name ? `@${businessProfile.business_name.toLowerCase().replace(/\s+/g, '')}` : ""));
                        setSocialAuthError("");
                      }}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        createAccountPlatform === "facebook"
                          ? "bg-[#1877F2]/20 border-[#1877F2] shadow-sm ring-1 ring-[#1877F2]/50"
                          : "bg-white/5 border-white/10 hover:bg-white/10 text-slate-300"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 44 44" fill="none">
                          <circle cx="22" cy="22" r="22" fill="#1877F2" />
                          <path
                            d="M29.5 22.8H24.5V38H18.2V22.8H14.8V17.5H18.2V13.8C18.2 9.9 20.7 7.7 24.6 7.7C26.5 7.7 28.1 7.8 28.6 7.9V12.4H25.9C24 12.4 23.6 13.3 23.6 14.7V17.5H28.7L27.9 22.8H29.5Z"
                            fill="#FFFFFF"
                          />
                        </svg>
                      </div>
                      <span className="text-[11px] font-semibold text-white">Facebook</span>
                      {connectedSocialAccounts.facebook && (
                        <span className="text-[9px] text-emerald-400 font-medium">Linked ✓</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCreateAccountPlatform("linkedin");
                        setCreateAccountHandle(socialHandles.linkedin || (businessProfile.business_name ? `@${businessProfile.business_name.toLowerCase().replace(/\s+/g, '')}` : ""));
                        setSocialAuthError("");
                      }}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        createAccountPlatform === "linkedin"
                          ? "bg-[#0A66C2]/20 border-[#0A66C2] shadow-sm ring-1 ring-[#0A66C2]/50"
                          : "bg-white/5 border-white/10 hover:bg-white/10 text-slate-300"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 44 44" fill="none">
                          <rect width="44" height="44" rx="8" fill="#0A66C2" />
                          <path
                            d="M13.2 17.5H18V33H13.2V17.5ZM15.6 9.8C17.1 9.8 18.3 11 18.3 12.5C18.3 14 17.1 15.2 15.6 15.2C14.1 15.2 12.9 14 12.9 12.5C12.9 11 14.1 9.8 15.6 9.8ZM21 17.5H25.6V19.6H25.7C26.3 18.4 27.9 17.1 30.3 17.1C35.2 17.1 36.1 20.3 36.1 24.5V33H31.3V25.3C31.3 23.5 31.2 21.1 28.7 21.1C26.1 21.1 25.8 23.1 25.8 25.2V33H21V17.5Z"
                            fill="#FFFFFF"
                          />
                        </svg>
                      </div>
                      <span className="text-[11px] font-semibold text-white">LinkedIn</span>
                      {connectedSocialAccounts.linkedin && (
                        <span className="text-[9px] text-emerald-400 font-medium">Linked ✓</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Form Fields: Log In Mode */}
                {socialAuthModalMode === "login" ? (
                  <div className="mt-4 space-y-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Account Username, Phone or Email <span className="text-pink-400">*</span>
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          type="text"
                          value={createAccountHandle}
                          onChange={(e) => setCreateAccountHandle(e.target.value)}
                          placeholder={
                            createAccountPlatform === "instagram"
                              ? "e.g. @yourbusiness or phone/email"
                              : createAccountPlatform === "facebook"
                              ? "e.g. fb.com/yourpage or email"
                              : "e.g. username@company.com"
                          }
                          className="pl-10 h-10 bg-black/40 border-white/10 text-white placeholder:text-neutral-500 text-xs sm:text-sm rounded-xl focus:border-[#be32ff]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Password <span className="text-pink-400">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          type={showSocialAuthPassword ? "text" : "password"}
                          value={socialAuthPassword}
                          onChange={(e) => setSocialAuthPassword(e.target.value)}
                          placeholder="Enter your account password"
                          className="pl-10 pr-10 h-10 bg-black/40 border-white/10 text-white placeholder:text-neutral-500 text-xs sm:text-sm rounded-xl focus:border-[#be32ff]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSocialAuthPassword(!showSocialAuthPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {showSocialAuthPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      This will securely authenticate and link your {createAccountPlatform === "instagram" ? "Instagram" : createAccountPlatform === "facebook" ? "Facebook" : "LinkedIn"} profile to create and manage social posts automatically.
                    </p>
                  </div>
                ) : (
                  /* Form Fields: Create Account Mode */
                  <div className="mt-4 space-y-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Business / Full Name
                      </label>
                      <Input
                        type="text"
                        value={socialAuthFullName}
                        onChange={(e) => setSocialAuthFullName(e.target.value)}
                        placeholder="e.g. Your Business or Brand Name"
                        className="h-10 bg-black/40 border-white/10 text-white placeholder:text-neutral-500 text-xs sm:text-sm rounded-xl focus:border-[#be32ff]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Desired Username or Handle <span className="text-pink-400">*</span>
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          type="text"
                          value={createAccountHandle}
                          onChange={(e) => setCreateAccountHandle(e.target.value)}
                          placeholder="e.g. @mybusinesshandle"
                          className="pl-10 h-10 bg-black/40 border-white/10 text-white placeholder:text-neutral-500 text-xs sm:text-sm rounded-xl focus:border-[#be32ff]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Email or Mobile
                      </label>
                      <Input
                        type="text"
                        value={socialAuthEmail}
                        onChange={(e) => setSocialAuthEmail(e.target.value)}
                        placeholder="e.g. business@gmail.com"
                        className="h-10 bg-black/40 border-white/10 text-white placeholder:text-neutral-500 text-xs sm:text-sm rounded-xl focus:border-[#be32ff]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Create Password <span className="text-pink-400">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          type={showSocialAuthPassword ? "text" : "password"}
                          value={socialAuthPassword}
                          onChange={(e) => setSocialAuthPassword(e.target.value)}
                          placeholder="Create a secure password"
                          className="pl-10 pr-10 h-10 bg-black/40 border-white/10 text-white placeholder:text-neutral-500 text-xs sm:text-sm rounded-xl focus:border-[#be32ff]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSocialAuthPassword(!showSocialAuthPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {showSocialAuthPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Validation Error Notice */}
                {socialAuthError && (
                  <div className="mt-3 p-2.5 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 animate-in fade-in">
                    <span className="font-semibold text-red-400">Notice:</span> {socialAuthError}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-5 space-y-3">
                  <button
                    type="button"
                    onClick={handleSubmitSocialAuth}
                    disabled={isSubmittingSocialAuth}
                    className="w-full h-11 rounded-full font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#be32ff]/25 hover:brightness-110 active:scale-[0.98]"
                    style={{ background: "linear-gradient(90deg, #7d36fa 0%, #be32ff 33%, #f0449b 67%, #fc9a5d 100%)" }}
                  >
                    {isSubmittingSocialAuth ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Connecting Account...</span>
                      </>
                    ) : socialAuthModalMode === "login" ? (
                      <>
                        <span>Log In &amp; Connect Account</span>
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </>
                    ) : (
                      <>
                        <span>Create &amp; Connect Account</span>
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    {socialAuthModalMode === "login" ? (
                      <p className="text-xs text-slate-400">
                        Don&apos;t have an account on {createAccountPlatform === "instagram" ? "Instagram" : createAccountPlatform === "facebook" ? "Facebook" : "LinkedIn"}?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setSocialAuthModalMode("create");
                            setSocialAuthError("");
                          }}
                          className="text-[#fc9a5d] hover:text-[#f0449b] font-medium underline underline-offset-2 transition-colors cursor-pointer"
                        >
                          Create Account
                        </button>
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setSocialAuthModalMode("login");
                            setSocialAuthError("");
                          }}
                          className="text-[#fc9a5d] hover:text-[#f0449b] font-medium underline underline-offset-2 transition-colors cursor-pointer"
                        >
                          Log In
                        </button>
                      </p>
                    )}
                  </div>

                  <a
                    href={
                      createAccountPlatform === "instagram"
                        ? "https://www.instagram.com/accounts/emailsignup/"
                        : createAccountPlatform === "facebook"
                        ? "https://www.facebook.com/r.php"
                        : "https://www.linkedin.com/signup"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-1.5 flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>Register on official {createAccountPlatform} site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 3: WHAT YOUR WEBSITE? (Exact Image 2 Design)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "website_url" && (
        <div className="w-full max-w-6xl xl:max-w-7xl mx-auto pt-1 sm:pt-2 pb-2 flex flex-col justify-start animate-in fade-in duration-400 relative z-10 px-4 sm:px-8">
          <div>
            {/* Top Bar: Back button + Full-width Thin Gradient Progress Bar (~30%) */}
            <div className="flex items-center gap-3 w-full mb-3 sm:mb-5">
              <button
                type="button"
                onClick={handleWebsiteUrlBack}
                aria-label="Go back"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/10"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
              <div className="flex-1 h-1.5 sm:h-2 bg-slate-800/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] via-[#be32ff] to-[#7d36fa] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(232,78,143,0.5)]"
                  style={{ width: "30%" }}
                />
              </div>
            </div>

            {/* 2-Column Layout (Broad Content Design) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">

              {/* Left Column: Heading, Inputs, Highlights & Action Buttons (Broadened width) */}
              <div className="space-y-3.5 sm:space-y-4 w-full max-w-xl lg:max-w-2xl">
                <div className="space-y-1 mb-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-white tracking-tight leading-tight">
                    What&apos;s your{" "}
                    <span className="font-normal bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] via-[#be32ff] to-[#7d36fa] bg-clip-text text-transparent">
                      website
                    </span>
                    <span className="text-[#9936F1]">?</span>
                  </h1>
                  <p className="text-sm sm:text-base text-slate-400 mt-1.5 font-normal leading-relaxed">
                    We&apos;ll read it for you, so there&apos;s no need to type anything.
                  </p>
                </div>

                {/* Website URL Input (Broad container) */}
                <div className="space-y-1.5">
                  <div className="h-[48px] sm:h-[50px] px-4 sm:px-5 rounded-full bg-[#131728] border border-slate-700/60 focus-within:border-[#9936F1] focus-within:ring-1 focus-within:ring-[#9936F1]/40 transition-all flex items-center gap-2.5 sm:gap-3">
                    <Link2 className="w-4 h-4 -rotate-45 text-slate-400 shrink-0" />
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
                      className="w-full bg-transparent border-none text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none tracking-normal font-normal"
                      autoFocus
                    />
                    {websiteUrl && (
                      <button
                        type="button"
                        onClick={() => setWebsiteUrl("")}
                        className="text-slate-400 hover:text-white transition-colors p-1"
                        aria-label="Clear input"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {websiteUrl && !isValidWebsiteUrl(websiteUrl) && (
                    <p className="text-[11px] text-[#E84E8F] pl-3 font-medium">
                      Please enter a valid website address (e.g. yourbrand.com)
                    </p>
                  )}
                </div>

                {/* OR Divider with subtle line */}
                <div className="relative flex items-center justify-center py-1">
                  <div className="w-full border-t border-slate-700/50" />
                  <span className="absolute bg-[#071226] px-3 text-[10px] sm:text-[11px] font-normal tracking-widest text-slate-500 uppercase">
                    OR
                  </span>
                </div>

                {/* Create Website Button with Gradient Border & Sparkles Icon (Broad) */}
                <div className="p-[1.5px] rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] shadow-sm">
                  <button
                    type="button"
                    onClick={() => handleCreateWebsite("website")}
                    className="w-full h-[44px] sm:h-[46px] rounded-full bg-[#0d1427] hover:bg-[#121c35] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-xs sm:text-sm font-normal text-white cursor-pointer"
                  >
                    <span>Create Website</span>
                    <Sparkles className="w-3.5 h-3.5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
                  </button>
                </div>

                {/* 3 Value Pillars with Icons (AI-Powered | Secure | Grow Faster) */}
                <div className="grid grid-cols-3 divide-x divide-purple-900/40 pt-2.5 pb-1.5 text-left">
                  <div className="flex items-center gap-2 pr-2.5 min-w-0">
                    <Zap className="w-4 h-4 text-[#C084FC] shrink-0" />
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs font-medium text-[#E9D5FF]">AI-Powered</p>
                      <p className="text-[10px] sm:text-[11px] text-[#C084FC]/80 font-normal truncate">Fast &amp; Smart</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 min-w-0">
                    <Shield className="w-4 h-4 text-[#C084FC] shrink-0" />
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs font-medium text-[#E9D5FF]">Secure</p>
                      <p className="text-[10px] sm:text-[11px] text-[#C084FC]/80 font-normal truncate">Your data is safe</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-2.5 min-w-0">
                    <TrendingUp className="w-4 h-4 text-[#C084FC] shrink-0" />
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs font-medium text-[#E9D5FF]">Grow Faster</p>
                      <p className="text-[10px] sm:text-[11px] text-[#C084FC]/80 font-normal truncate">With AI insights</p>
                    </div>
                  </div>
                </div>

                {/* Error Notice */}
                {error && (
                  <div className="p-2.5 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 animate-in fade-in">
                    <span className="font-semibold text-red-400">Notice:</span> {error}
                  </div>
                )}

                {/* Continue Button (Broad width matching the expanded container) */}
                <div className="pt-2">
                  <button
                    type="button"
                    id="website-continue-btn"
                    onClick={handleWebsiteUrlContinue}
                    disabled={!isValidWebsiteUrl(websiteUrl) || isSavingWebsite}
                    className={`w-full h-[48px] sm:h-[50px] rounded-full font-normal text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-lg shadow-[#be32ff]/25 ${isValidWebsiteUrl(websiteUrl) && !isSavingWebsite
                        ? "bg-gradient-to-r from-[#7d36fa] via-[#be32ff] via-[#f0449b] to-[#fc9a5d] text-white hover:brightness-110 active:scale-[0.98]"
                        : "bg-white/10 text-white/40 cursor-not-allowed opacity-60 pointer-events-none"
                      }`}
                  >
                    {isSavingWebsite ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Scanning &amp; Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: 3D Website Artwork (Broadened) */}
              <div className="hidden lg:flex items-center justify-center relative select-none">
                <div className="relative w-full max-w-[420px] lg:max-w-[480px] xl:max-w-[520px] flex items-center justify-center">
                  <img
                    src="/images/website-reading-artwork.png"
                    alt="What's your website?"
                    className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-[0_0_40px_rgba(153,54,241,0.25)] animate-in fade-in duration-500"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 4: READING YOUR WEBSITE (Exact Image 2 Design)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "website_reading" && (
        <div className="w-full max-w-2xl sm:max-w-3xl mx-auto my-auto py-2 sm:py-4 flex flex-col justify-center animate-in fade-in duration-400 relative z-10 px-4 sm:px-6">
          <div>
            {/* Top Header: Back button + Centered Website URL Pill */}
            <div className="relative flex items-center justify-center w-full mb-3 sm:mb-4">
              <button
                type="button"
                onClick={handleWebsiteReadingBack}
                aria-label="Go back"
                className="absolute left-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/10"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>

              {/* Website URL Pill Badge matching Image 2 */}
              <div className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#1b1738]/90 border border-purple-500/40 text-sm sm:text-base text-purple-200 font-medium inline-flex items-center gap-2.5 shadow-[0_0_20px_rgba(190,50,255,0.25)]">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 shrink-0" />
                <span className="truncate">{getDisplayHostname(websiteUrl)}</span>
              </div>
            </div>

            {/* Heading & Subtitle matching Image 2 (scaled up) */}
            <div className="text-center mt-2 sm:mt-3 mb-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight">
                Reading your website
              </h1>
              <p className="text-sm sm:text-base text-slate-400 font-normal mt-1">
                Spotting your audience...
              </p>
            </div>

            {/* 3D Robot Mascot Graphic matching Image 2 (compact & crisp to fit comfortably in viewport) */}
            <div className="relative my-2 sm:my-3 flex items-center justify-center select-none">
              <div className="absolute inset-0 bg-gradient-to-r from-[#9936F1]/25 via-[#7d36fa]/20 to-[#E84E8F]/20 blur-3xl rounded-full transform scale-95 -z-0 pointer-events-none" />
              <img
                src="/images/reading-robot-graphic.png"
                alt="Reading your website"
                className="w-full max-w-[190px] sm:max-w-[220px] lg:max-w-[240px] h-auto object-contain relative z-10 drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] select-none pointer-events-none animate-in zoom-in-95 duration-500"
              />
            </div>

            {/* 2x2 Grid of Status Chips matching Reference Image 2 (compact height) */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full max-w-xl sm:max-w-2xl mx-auto my-2 sm:my-3">
              {/* Chip 1: Brand Voice */}
              <div className="h-10 sm:h-11 px-4 sm:px-5 rounded-full border border-[#a855f7]/70 bg-[#0e162b]/90 shadow-[0_0_15px_rgba(168,85,247,0.15)] flex items-center gap-2.5 transition-all">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] flex items-center justify-center shrink-0 shadow-sm">
                  {analysisProgress.brandVoice.status === "completed" ? (
                    <Check className="w-3 h-3 text-white stroke-[2.5]" />
                  ) : (
                    <RotateCw className="w-3 h-3 text-white animate-spin stroke-[2.5]" />
                  )}
                </div>
                <span className="text-xs sm:text-sm font-medium text-white truncate">Brand Voice</span>
              </div>

              {/* Chip 2: Colors */}
              <div className="h-10 sm:h-11 px-4 sm:px-5 rounded-full border border-[#a855f7]/70 bg-[#0e162b]/90 shadow-[0_0_15px_rgba(168,85,247,0.15)] flex items-center gap-2.5 transition-all">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] flex items-center justify-center shrink-0 shadow-sm">
                  {analysisProgress.colors.status === "completed" ? (
                    <Check className="w-3 h-3 text-white stroke-[2.5]" />
                  ) : (
                    <RotateCw className="w-3 h-3 text-white animate-spin stroke-[2.5]" />
                  )}
                </div>
                <span className="text-xs sm:text-sm font-medium text-white truncate">Colors</span>
              </div>

              {/* Chip 3: Category */}
              <div className="h-10 sm:h-11 px-4 sm:px-5 rounded-full border border-[#a855f7]/70 bg-[#0e162b]/90 shadow-[0_0_15px_rgba(168,85,247,0.15)] flex items-center gap-2.5 transition-all">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] flex items-center justify-center shrink-0 shadow-sm">
                  {analysisProgress.category.status === "completed" ? (
                    <Check className="w-3 h-3 text-white stroke-[2.5]" />
                  ) : (
                    <RotateCw className="w-3 h-3 text-white animate-spin stroke-[2.5]" />
                  )}
                </div>
                <span className="text-xs sm:text-sm font-medium text-white truncate">Category</span>
              </div>

              {/* Chip 4: Photos */}
              <div className="h-10 sm:h-11 px-4 sm:px-5 rounded-full border border-[#a855f7]/70 bg-[#0e162b]/90 shadow-[0_0_15px_rgba(168,85,247,0.15)] flex items-center gap-2.5 transition-all">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] flex items-center justify-center shrink-0 shadow-sm">
                  {analysisProgress.photos.status === "completed" ? (
                    <Check className="w-3 h-3 text-white stroke-[2.5]" />
                  ) : (
                    <RotateCw className="w-3 h-3 text-white animate-spin stroke-[2.5]" />
                  )}
                </div>
                <span className="text-xs sm:text-sm font-medium text-white truncate">Photos</span>
              </div>
            </div>

            {/* Error state alert with Retry and Skip options */}
            {analysisError && (
              <div className="mt-2 p-2.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs sm:text-sm text-red-200 animate-in fade-in max-w-sm mx-auto">
                <p className="font-semibold text-red-400 mb-1.5">{analysisError}</p>
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

          {/* Bottom Action: Continue Button (Always visible & accessible) */}
          <div className="pt-2 sm:pt-3 pb-2 flex justify-center">
            {analysisCompleted ? (
              <button
                type="button"
                id="reading-continue-btn"
                onClick={handleReadingContinue}
                className="w-full max-w-sm sm:max-w-md mx-auto h-11 sm:h-12 rounded-full bg-gradient-to-r from-[#7d36fa] via-[#be32ff] via-[#f0449b] to-[#fc9a5d] hover:brightness-110 active:scale-[0.98] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#be32ff]/25 transition-all cursor-pointer animate-in fade-in"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="w-full max-w-sm sm:max-w-md mx-auto h-11 sm:h-12 rounded-full bg-white/10 text-slate-400 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border border-white/5 opacity-70 cursor-not-allowed"
              >
                <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
                <span>Reading website...</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN: IS THIS YOUR BUSINESS? (Exact Reference Image 2)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "business_details" && (
        <div className="w-full max-w-6xl lg:max-w-7xl xl:max-w-[1400px] mx-auto h-full flex flex-col justify-between animate-in fade-in duration-400 relative z-10 px-4 sm:px-8 lg:px-12 xl:px-16 py-1 overflow-hidden select-none">
          <div className="space-y-3 sm:space-y-3.5">
            {/* Top Header: Back button + Progress bar (~50%) */}
            <div className="flex items-center gap-3 w-full mb-1 sm:mb-1.5">
              <button
                type="button"
                onClick={handleBusinessDetailsBack}
                aria-label="Go back"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 h-2 sm:h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "50%" }}
                />
              </div>
            </div>

            {/* Heading */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-white tracking-tight">
                Is this your <span className="bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] bg-clip-text text-transparent font-normal">business?</span>
              </h1>
            </div>

            {/* Subtitle / Status Message */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#be32ff] font-medium py-0.5">
              <RotateCw className="w-4 h-4 text-[#be32ff] animate-spin shrink-0" />
              <span>Still reading your website, more details filling in</span>
            </div>

            {/* Section Header: Business Details Badge */}
            <div className="flex items-center gap-2.5 pt-0.5 pb-0.5">
              <div className="w-8 h-8 rounded-lg bg-[#3a1d28] border border-[#f0449b]/30 flex items-center justify-center text-[#fc9a5d] shadow-sm">
                <Store className="w-4 h-4 text-[#fc9a5d]" />
              </div>
              <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                Business Details
              </span>
            </div>

            {/* Form Fields: Broad & Clear across the page */}
            <div className="space-y-3 sm:space-y-3.5">
              {/* Field 1: Business Name */}
              <div className="space-y-1.5">
                <label htmlFor="b-name" className="text-sm sm:text-base font-medium text-neutral-200 block">
                  Business Name
                </label>
                <input
                  id="b-name"
                  type="text"
                  value={businessDetails.business_name}
                  onChange={(e) =>
                    setBusinessDetails({ ...businessDetails, business_name: e.target.value })
                  }
                  placeholder="Your business name"
                  className="w-full h-11 sm:h-12 px-4.5 rounded-xl bg-[#13192b] border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#be32ff] text-sm sm:text-base transition-colors"
                />
              </div>

              {/* Field 2: Business Category */}
              <div className="space-y-1.5">
                <label htmlFor="b-category" className="text-sm sm:text-base font-medium text-neutral-200 block">
                  Business Category
                </label>
                <div className="relative">
                  <select
                    id="b-category"
                    value={businessDetails.category || ""}
                    onChange={(e) =>
                      setBusinessDetails({ ...businessDetails, category: e.target.value })
                    }
                    className="w-full h-11 sm:h-12 px-4.5 pr-10 rounded-xl bg-[#13192b] border border-white/10 text-white focus:outline-none focus:border-[#be32ff] text-sm sm:text-base transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#13192b] text-neutral-500">
                      Your category
                    </option>
                    {BUSINESS_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.name} className="bg-[#13192b] text-white">
                        {cat.name}
                      </option>
                    ))}
                    {businessDetails.category &&
                      !BUSINESS_CATEGORIES.some(
                        (c) => c.name.toLowerCase() === (businessDetails.category || "").toLowerCase()
                      ) && (
                        <option value={businessDetails.category} className="bg-[#13192b] text-white">
                          {businessDetails.category}
                        </option>
                      )}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400 pointer-events-none" />
                </div>
              </div>

              {/* Grid 2 Columns: Business Type + Sub - Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Business Type */}
                <div className="space-y-1.5">
                  <label htmlFor="b-type" className="text-sm sm:text-base font-medium text-neutral-200 block">
                    Business Type
                  </label>
                  <div className="relative">
                    <select
                      id="b-type"
                      value={businessDetails.primary_business_type || businessDetails.business_types[0] || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBusinessDetails({
                          ...businessDetails,
                          primary_business_type: val,
                          business_types: val ? [val] : [],
                        });
                      }}
                      className="w-full h-11 sm:h-12 px-4.5 pr-10 rounded-xl bg-[#13192b] border border-white/10 text-white focus:outline-none focus:border-[#be32ff] text-sm sm:text-base transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-[#13192b] text-neutral-500">
                        Your business type
                      </option>
                      <option value="Service / Digital" className="bg-[#13192b] text-white">
                        Service / Digital
                      </option>
                      <option value="Product-based" className="bg-[#13192b] text-white">
                        Product-based
                      </option>
                      <option value="Physical Location" className="bg-[#13192b] text-white">
                        Physical Location
                      </option>
                      <option value="Wholesale / B2B" className="bg-[#13192b] text-white">
                        Wholesale / B2B
                      </option>
                      <option value="Hybrid" className="bg-[#13192b] text-white">
                        Hybrid
                      </option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                {/* Sub - Category */}
                <div className="space-y-1.5">
                  <label htmlFor="b-subcat" className="text-sm sm:text-base font-medium text-neutral-200 block">
                    Sub - Category
                  </label>
                  <div className="relative">
                    <select
                      id="b-subcat"
                      value={businessDetails.sub_category || ""}
                      onChange={(e) =>
                        setBusinessDetails({ ...businessDetails, sub_category: e.target.value })
                      }
                      className="w-full h-11 sm:h-12 px-4.5 pr-10 rounded-xl bg-[#13192b] border border-white/10 text-white focus:outline-none focus:border-[#be32ff] text-sm sm:text-base transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-[#13192b] text-neutral-500">
                        Your sub - category
                      </option>
                      {(() => {
                        const foundCat = BUSINESS_CATEGORIES.find(
                          (c) => c.name.toLowerCase() === (businessDetails.category || "").toLowerCase()
                        );
                        const niches = foundCat
                          ? foundCat.suggestedNiches
                          : [
                              "Custom Software Development & AI",
                              "E-commerce & Retail",
                              "Consulting & Services",
                              "Healthcare & Wellness",
                              "Education & Training",
                              "Manufacturing & Distribution",
                            ];
                        return niches.map((n) => (
                          <option key={n} value={n} className="bg-[#13192b] text-white">
                            {n}
                          </option>
                        ));
                      })()}
                      {businessDetails.sub_category &&
                        !BUSINESS_CATEGORIES.some((c) =>
                          c.suggestedNiches?.includes(businessDetails.sub_category)
                        ) && (
                          <option value={businessDetails.sub_category} className="bg-[#13192b] text-white">
                            {businessDetails.sub_category}
                          </option>
                        )}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Field 5: City */}
              <div className="space-y-1.5">
                <label htmlFor="b-city" className="text-sm sm:text-base font-medium text-neutral-200 block">
                  City
                </label>
                <input
                  id="b-city"
                  type="text"
                  value={businessDetails.city}
                  onChange={(e) =>
                    setBusinessDetails({ ...businessDetails, city: e.target.value })
                  }
                  placeholder="Your city"
                  className="w-full h-11 sm:h-12 px-4.5 rounded-xl bg-[#13192b] border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#be32ff] text-sm sm:text-base transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Bottom Action: Centered Next Button */}
          <div className="flex justify-center pt-4 pb-1">
            <button
              type="button"
              id="details-continue-btn"
              onClick={handleBusinessDetailsContinue}
              disabled={isSavingBusinessDetails}
              className="w-full max-w-sm sm:max-w-md h-11 sm:h-12 rounded-full bg-gradient-to-r from-[#7d36fa] via-[#be32ff] via-[#f0449b] to-[#fc9a5d] hover:brightness-110 active:scale-[0.98] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#be32ff]/25 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(90deg, #7d36fa 0%, #be32ff 33%, #f0449b 67%, #fc9a5d 100%)" }}
            >
              {isSavingBusinessDetails ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN: IS THIS YOUR BUSINESS? (Part 2 - Exact Reference Image 2)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "business_details_2" && (
        <div className="w-full max-w-6xl lg:max-w-7xl xl:max-w-[1400px] mx-auto h-full flex flex-col justify-between animate-in fade-in duration-400 relative z-10 px-4 sm:px-8 lg:px-12 xl:px-16 py-1 overflow-hidden select-none">
          <div className="space-y-3 sm:space-y-3.5">
            {/* Top Header: Back button + Progress bar (~58%) */}
            <div className="flex items-center gap-3 w-full mb-1 sm:mb-1.5">
              <button
                type="button"
                onClick={handleBusinessDetails2Back}
                aria-label="Go back"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 h-2 sm:h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "58%" }}
                />
              </div>
            </div>

            {/* Heading */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-white tracking-tight">
                Is this your <span className="bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] bg-clip-text text-transparent font-normal">business?</span>
              </h1>
            </div>

            {/* Subtitle / Status Message */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#be32ff] font-medium py-0.5">
              <RotateCw className="w-4 h-4 text-[#be32ff] animate-spin shrink-0" />
              <span>Still reading your website, more details filling in</span>
            </div>

            {/* Form Container: Broad & Expanded across the page */}
            <div className="space-y-3 sm:space-y-3.5">
              {/* Row 1: Business Logo (Left) + Actions & Tagline (Right) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                {/* Left: Business Logo */}
                <div className="space-y-1.5">
                  <label className="text-sm sm:text-base font-medium text-neutral-200 block">
                    Business Logo
                  </label>
                  <div className="w-full h-36 sm:h-42 rounded-2xl overflow-hidden bg-[#13192b] border border-white/10 relative flex items-center justify-center shadow-inner group p-2">
                    {businessDetails.logo_url ? (
                      <img
                        src={businessDetails.logo_url}
                        alt="Business Logo"
                        className="w-full h-full object-contain object-center"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1c2e] via-[#13192b] to-[#0c0e18] p-3 text-center">
                        <Store className="w-8 h-8 text-neutral-500 mb-1" />
                        <span className="text-xs text-neutral-400">No logo uploaded</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Change logo, Remove, Tagline */}
                <div className="space-y-2.5 flex flex-col justify-between">
                  {/* Action Buttons */}
                  <div className="space-y-2 pt-0.5">
                    <label className="w-full h-10 sm:h-11 rounded-full bg-[#a825ff] hover:bg-[#b83eff] active:scale-[0.98] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#be32ff]/25 transition-all cursor-pointer">
                      <RotateCw className="w-3.5 h-3.5 text-white" />
                      <span>Change logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleWebsiteLogoUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="w-full h-10 sm:h-11 rounded-full bg-[#182035] hover:bg-[#1f2a44] border border-white/10 active:scale-[0.98] text-neutral-300 hover:text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Remove</span>
                    </button>
                  </div>

                  {/* Tagline */}
                  <div className="space-y-1.5">
                    <label htmlFor="b-tagline-p2" className="text-sm sm:text-base font-medium text-neutral-200 block">
                      Tagline
                    </label>
                    <input
                      id="b-tagline-p2"
                      type="text"
                      value={businessDetails.tagline || ""}
                      onChange={(e) =>
                        setBusinessDetails({ ...businessDetails, tagline: e.target.value })
                      }
                      placeholder="Your tagline"
                      className="w-full h-11 sm:h-12 px-4.5 rounded-xl bg-[#13192b] border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#be32ff] text-sm sm:text-base transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Who buys from you + What makes you different (Grid 2 cols) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Who buys from you */}
                <div className="space-y-1.5">
                  <label htmlFor="b-audience-p2" className="text-sm sm:text-base font-medium text-neutral-200 block">
                    Who buys from you
                  </label>
                  <div className="relative">
                    <select
                      id="b-audience-p2"
                      value={businessDetails.target_audience || ""}
                      onChange={(e) =>
                        setBusinessDetails({ ...businessDetails, target_audience: e.target.value })
                      }
                      className="w-full h-11 sm:h-12 px-4.5 pr-10 rounded-xl bg-[#13192b] border border-white/10 text-white focus:outline-none focus:border-[#be32ff] text-sm sm:text-base transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-[#13192b] text-neutral-500">
                        Your customer
                      </option>
                      <option value="Startups, enterprises, and growing businesses" className="bg-[#13192b] text-white">
                        Startups, enterprises, and growing businesses
                      </option>
                      <option value="Retail consumers & families" className="bg-[#13192b] text-white">
                        Retail consumers &amp; families
                      </option>
                      <option value="B2B businesses & corporate clients" className="bg-[#13192b] text-white">
                        B2B businesses &amp; corporate clients
                      </option>
                      <option value="Young professionals & students" className="bg-[#13192b] text-white">
                        Young professionals &amp; students
                      </option>
                      <option value="Local neighborhood customers" className="bg-[#13192b] text-white">
                        Local neighborhood customers
                      </option>
                      {businessDetails.target_audience &&
                        ![
                          "Startups, enterprises, and growing businesses",
                          "Retail consumers & families",
                          "B2B businesses & corporate clients",
                          "Young professionals & students",
                          "Local neighborhood customers",
                        ].includes(businessDetails.target_audience) && (
                          <option value={businessDetails.target_audience} className="bg-[#13192b] text-white">
                            {businessDetails.target_audience}
                          </option>
                        )}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                {/* What makes you different (optional) */}
                <div className="space-y-1.5">
                  <label htmlFor="b-different-p2" className="text-sm sm:text-base font-medium text-neutral-200 block">
                    What makes you different (optional)
                  </label>
                  <div className="relative">
                    <select
                      id="b-different-p2"
                      value={businessDetails.differentiators[0] || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBusinessDetails({
                          ...businessDetails,
                          differentiators: val ? [val] : [],
                        });
                      }}
                      className="w-full h-11 sm:h-12 px-4.5 pr-10 rounded-xl bg-[#13192b] border border-white/10 text-white focus:outline-none focus:border-[#be32ff] text-sm sm:text-base transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-[#13192b] text-neutral-500">
                        Ex - Same day delivery in Pune
                      </option>
                      <option value="Ex - Same day delivery in Pune" className="bg-[#13192b] text-white">
                        Ex - Same day delivery in Pune
                      </option>
                      <option value="Premium quality & handcrafted design" className="bg-[#13192b] text-white">
                        Premium quality &amp; handcrafted design
                      </option>
                      <option value="24/7 dedicated customer support" className="bg-[#13192b] text-white">
                        24/7 dedicated customer support
                      </option>
                      <option value="Fast & free shipping across India" className="bg-[#13192b] text-white">
                        Fast &amp; free shipping across India
                      </option>
                      <option value="Affordable transparent pricing" className="bg-[#13192b] text-white">
                        Affordable transparent pricing
                      </option>
                      {businessDetails.differentiators[0] &&
                        ![
                          "Ex - Same day delivery in Pune",
                          "Premium quality & handcrafted design",
                          "24/7 dedicated customer support",
                          "Fast & free shipping across India",
                          "Affordable transparent pricing",
                        ].includes(businessDetails.differentiators[0]) && (
                          <option value={businessDetails.differentiators[0]} className="bg-[#13192b] text-white">
                            {businessDetails.differentiators[0]}
                          </option>
                        )}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 3: What you sell (optional) */}
              <div className="space-y-1.5">
                <label htmlFor="b-sell-p2" className="text-sm sm:text-base font-medium text-neutral-200 block">
                  What you sell (optional)
                </label>
                <input
                  id="b-sell-p2"
                  type="text"
                  value={
                    businessDetails.products_services?.length > 0
                      ? businessDetails.products_services.join(", ")
                      : ""
                  }
                  onChange={(e) => {
                    const raw = e.target.value;
                    const items = raw
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean);
                    setBusinessDetails({
                      ...businessDetails,
                      products_services: items,
                    });
                  }}
                  placeholder="Menswear, Womenswear, Kidswear, Ethnic Wear, Beauty Products, Footwear"
                  className="w-full h-11 sm:h-12 px-4.5 rounded-xl bg-[#13192b] border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#be32ff] text-sm sm:text-base transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Bottom Action: Centered Next Button */}
          <div className="flex justify-center pt-4 pb-1">
            <button
              type="button"
              id="details2-continue-btn"
              onClick={handleBusinessDetails2Continue}
              disabled={isSavingBusinessDetails2}
              className="w-full max-w-sm sm:max-w-md h-11 sm:h-12 rounded-full bg-gradient-to-r from-[#7d36fa] via-[#be32ff] via-[#f0449b] to-[#fc9a5d] hover:brightness-110 active:scale-[0.98] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#be32ff]/25 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(90deg, #7d36fa 0%, #be32ff 33%, #f0449b 67%, #fc9a5d 100%)" }}
            >
              {isSavingBusinessDetails2 ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN: WHAT'S YOUR BUSINESS LIKE? (Exact Reference Image 1)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "brand_preferences" && (
        <div className="w-full max-w-6xl lg:max-w-7xl xl:max-w-[1400px] mx-auto h-full flex flex-col justify-between animate-in fade-in duration-400 relative z-10 px-4 sm:px-8 lg:px-12 xl:px-16 py-1 overflow-hidden select-none">
          <div className="space-y-3 sm:space-y-3.5">
            {/* Top Header: Back button + Progress bar (~70%) */}
            <div className="flex items-center gap-3 w-full mb-1 sm:mb-1.5">
              <button
                type="button"
                onClick={handleBrandPreferencesBack}
                aria-label="Go back"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 h-2 sm:h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "70%" }}
                />
              </div>
            </div>

            {/* Heading */}
            <div>
              {(() => {
                const fullName = (businessDetails.business_name || "SevenUnique Tech Solution").trim();
                const parts = fullName.split(/\s+/);
                const first = parts[0] || "SevenUnique";
                const rest = parts.slice(1).join(" ");
                return (
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-white tracking-tight">
                    What&apos;s{" "}
                    <span className="bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] bg-clip-text text-transparent font-normal">
                      {first}
                    </span>{" "}
                    {rest ? `${rest} ` : ""}like?
                  </h1>
                );
              })()}
            </div>

            {/* Subtitle / Status Message */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#be32ff] font-medium py-0.5">
              <RotateCw className="w-4 h-4 text-[#be32ff] animate-spin shrink-0" />
              <span>Still reading your website, more details filling in</span>
            </div>

            {/* Section 1: Business Color */}
            <div className="space-y-2 pt-0.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#3a1d28] border border-[#f0449b]/30 flex items-center justify-center text-[#fc9a5d] shadow-sm">
                  <Palette className="w-4 h-4 text-[#fc9a5d]" />
                </div>
                <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Business Color
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 font-normal">
                We&apos;ll use these colors in your design
              </p>

              {/* Color Circles Row with Hex Labels - Broad & Expanded */}
              <div className="flex items-center gap-4 sm:gap-6 pt-1 overflow-x-auto pb-1">
                {brandPreferences.palette.slice(0, 5).map((color, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5 shrink-0">
                    <label
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full relative shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95 block border-2 ${
                        idx === 0
                          ? "border-[#be32ff] ring-2 ring-[#be32ff]/50 shadow-[0_0_12px_rgba(190,50,255,0.4)]"
                          : "border-white/20 hover:border-[#be32ff]/60"
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => handleColorChange(idx, e.target.value)}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                      />
                    </label>
                    <span className="text-xs text-neutral-400 font-mono tracking-tight lowercase">
                      {color.toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Pick your tone (as many as fit) - Broad pills with GT highlight color border */}
            <div className="space-y-2 pt-0.5">
              <label className="text-sm sm:text-base font-medium text-neutral-200 block">
                Pick your tone (as many as fit)
              </label>
              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                {[
                  "Modern", "Fun", "Professional", "Elegant",
                  "Trendy", "Warm", "Festive", "Youthful", "Bold",
                  "Luxurious", "Minimal", "Traditional", "Energetic"
                ]
                  .slice(0, showAllTones ? 13 : 9)
                  .map((tone) => {
                    const isSelected = brandPreferences.tones.includes(tone);
                    return (
                      <button
                        key={tone}
                        type="button"
                        onClick={() => handleToggleTone(tone)}
                        className={`py-2 px-4.5 sm:px-5.5 rounded-full text-sm sm:text-base font-normal transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-[#1f152b] border-2 border-[#be32ff] text-white shadow-[0_0_15px_rgba(190,50,255,0.4)] ring-1 ring-[#be32ff]/60"
                            : "bg-[#13192b] border border-white/10 text-neutral-300 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {tone}
                      </button>
                    );
                  })}
                <button
                  type="button"
                  onClick={() => setShowAllTones(!showAllTones)}
                  className="py-2 px-3 text-sm sm:text-base text-[#be32ff] hover:text-[#d946ef] font-medium transition-colors cursor-pointer"
                >
                  {showAllTones ? "Show less" : "See all"}
                </button>
              </div>
            </div>

            {/* Section 3: What language should we post in? - Broad pills with GT highlight color border */}
            <div className="space-y-2 pt-0.5">
              <label className="text-sm sm:text-base font-medium text-neutral-200 block">
                What language should we post in?
              </label>
              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                {[
                  { id: "hi", name: "Hindi" },
                  { id: "en", name: "English" },
                  { id: "regional", name: "Regional" },
                ].map((lang) => {
                  const isSelected = brandPreferences.language === lang.id || (lang.id === "en" && !brandPreferences.language);
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() =>
                        setBrandPreferences({
                          ...brandPreferences,
                          language: lang.id,
                        })
                      }
                      className={`h-10.5 sm:h-11 px-5 rounded-xl text-sm sm:text-base font-normal transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-[#1f152b] border-2 border-[#be32ff] text-white shadow-[0_0_15px_rgba(190,50,255,0.4)] ring-1 ring-[#be32ff]/60"
                          : "bg-[#13192b] border border-white/10 text-neutral-300 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {lang.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Action: Centered Next Button */}
          <div className="flex justify-center pt-4 pb-1">
            <button
              type="button"
              id="brand-continue-btn"
              onClick={handleBrandPreferencesContinue}
              disabled={isSavingBrandPreferences}
              className="w-full max-w-sm sm:max-w-md h-11 sm:h-12 rounded-full bg-gradient-to-r from-[#7d36fa] via-[#be32ff] via-[#f0449b] to-[#fc9a5d] hover:brightness-110 active:scale-[0.98] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#be32ff]/25 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(90deg, #7d36fa 0%, #be32ff 33%, #f0449b 67%, #fc9a5d 100%)" }}
            >
              {isSavingBrandPreferences ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN: BRAND SERVICES & AUDIENCE (Expanded Broad Layout, Fits 100vh with Zero Scroll)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "brand_services" && (
        <div className="w-full max-w-6xl lg:max-w-7xl xl:max-w-[1400px] mx-auto h-full flex flex-col justify-between animate-in fade-in duration-400 relative z-10 px-4 sm:px-8 lg:px-12 xl:px-16 py-1 overflow-hidden select-none">
          <div className="space-y-3 sm:space-y-3.5">
            {/* Top Header: Back button + Progress bar (~78%) */}
            <div className="flex items-center gap-3 w-full mb-1 sm:mb-1.5">
              <button
                type="button"
                onClick={handleBrandServicesBack}
                aria-label="Go back"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 h-2 sm:h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "78%" }}
                />
              </div>
            </div>

            {/* Heading */}
            <div>
              {(() => {
                const fullName = (businessDetails.business_name || "SevenUnique Tech Solution").trim();
                const parts = fullName.split(/\s+/);
                const first = parts[0] || "SevenUnique";
                const rest = parts.slice(1).join(" ");
                return (
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-white tracking-tight">
                    What&apos;s{" "}
                    <span className="bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] bg-clip-text text-transparent font-normal">
                      {first}
                    </span>{" "}
                    {rest ? `${rest} ` : ""}like?
                  </h1>
                );
              })()}
            </div>

            {/* Subtitle / Status Message */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#be32ff] font-medium py-0.5">
              <RotateCw className="w-4 h-4 text-[#be32ff] animate-spin shrink-0" />
              <span>Still reading your website, more details filling in</span>
            </div>

            {/* Section 1: Target Audience (Broad Full Page Width) */}
            <div className="space-y-2 pt-0.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#fc9a5d] shadow-sm">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#fc9a5d]" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Target Audience
                </h3>
              </div>

              <textarea
                value={businessDetails.target_audience || ""}
                onChange={(e) =>
                  setBusinessDetails({
                    ...businessDetails,
                    target_audience: e.target.value,
                  })
                }
                placeholder="Startups, enterprises, and growing businesses looking for modern tech and web design solutions."
                rows={3}
                className="w-full min-h-[75px] sm:min-h-[85px] p-3.5 sm:p-4 rounded-xl bg-[#13192b] border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#be32ff] text-sm sm:text-base transition-colors resize-none shadow-inner"
              />
            </div>

            {/* Section 2: Services and Products (Broad Full Page Width) */}
            <div className="space-y-2 pt-0.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#fc9a5d] shadow-sm">
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-[#fc9a5d]" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Services and Products
                </h3>
              </div>

              <div className="w-full p-3.5 sm:p-4 rounded-xl bg-[#13192b] border border-white/10 min-h-[95px] flex flex-wrap items-center gap-2.5 shadow-inner">
                {(businessDetails.products_services.length > 0
                  ? businessDetails.products_services
                  : [
                      "Web Design",
                      "Web Design",
                      "Web Design",
                      "Web Design",
                      "Web Design",
                      "Web Design",
                      "Web Design",
                      "Web Design",
                    ]
                ).map((service, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#be32ff]/20 border border-[#be32ff]/40 hover:bg-[#be32ff]/30 text-white text-sm font-semibold shadow-sm transition-all"
                  >
                    <span>{service}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const currentList =
                          businessDetails.products_services.length > 0
                            ? businessDetails.products_services
                            : [
                                "Web Design",
                                "Web Design",
                                "Web Design",
                                "Web Design",
                                "Web Design",
                                "Web Design",
                                "Web Design",
                                "Web Design",
                              ];
                        const next = currentList.filter((_, i) => i !== idx);
                        setBusinessDetails({
                          ...businessDetails,
                          products_services: next,
                        });
                      }}
                      className="text-white/70 hover:text-white transition-colors w-4 h-4 rounded-full bg-white/10 flex items-center justify-center hover:bg-rose-500/80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {/* Add more button */}
                <button
                  type="button"
                  onClick={() => {
                    const newSrv = prompt("Enter product or service name:");
                    if (newSrv && newSrv.trim()) {
                      setBusinessDetails({
                        ...businessDetails,
                        products_services: [
                          ...businessDetails.products_services,
                          newSrv.trim(),
                        ],
                      });
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-white/25 hover:border-white/50 text-neutral-300 hover:text-white text-sm font-medium transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add more</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Action: Centered Save my Brand Button */}
          <div className="flex justify-center pt-3 pb-1">
            <button
              type="button"
              id="brand-services-continue-btn"
              onClick={handleBrandServicesContinue}
              disabled={isSavingBrandServices}
              className="w-full max-w-sm sm:max-w-md h-11 sm:h-12 rounded-full bg-gradient-to-r from-[#7d36fa] via-[#be32ff] via-[#f0449b] to-[#fc9a5d] hover:brightness-110 active:scale-[0.98] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#be32ff]/25 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(90deg, #7d36fa 0%, #be32ff 33%, #f0449b 67%, #fc9a5d 100%)" }}
            >
              {isSavingBrandServices ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Save my Brand</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN: PICK THE PHOTOS WE SHOULD WORK WITH (Exact Reference Image 2)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "website_photos" && (
        <div className="w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto pt-2 pb-14 flex flex-col justify-start relative z-10 px-4 sm:px-8">
          <div className="space-y-6">
            {/* Top Header: Back button + Progress bar (~85%) */}
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
                  style={{ width: "85%" }}
                />
              </div>
            </div>

            {/* Heading & Subtitle (Un-bolded / Normal font) */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-normal text-white tracking-tight">
                Pick the{" "}
                <span className="bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] bg-clip-text text-transparent font-normal">
                  Photos
                </span>{" "}
                we should work with?
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-light">
                Picking your best photos
              </p>
            </div>

            {/* Responsive Photo Grid: 4 cols on lg/desktop, 2-3 on mobile/tablet */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4.5">
              {/* Slot 1: Upload Card */}
              <label className="aspect-[4/3.2] rounded-2xl bg-[#13192b] border border-white/10 hover:border-white/30 hover:bg-[#182035] transition-all flex items-center justify-center gap-2.5 p-4 text-center cursor-pointer group shadow-inner">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                {isUploadingPhoto ? (
                  <Loader2 className="w-5 h-5 text-[#be32ff] animate-spin" />
                ) : (
                  <Upload className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                )}
                <span className="text-sm sm:text-base font-semibold text-white">Upload</span>
              </label>

              {/* Dynamic Website Photos */}
              {websitePhotos.map((photoUrl, idx) => {
                const isSelected = selectedPhotos.includes(photoUrl);
                return (
                  <div
                    key={`${photoUrl}-${idx}`}
                    onClick={() => handleTogglePhoto(photoUrl)}
                    className={`aspect-[4/3.2] rounded-2xl overflow-hidden relative cursor-pointer group transition-all duration-300 border ${
                      isSelected
                        ? "border-purple-500/80 shadow-[0_0_15px_rgba(190,50,255,0.25)] ring-1 ring-purple-500/50"
                        : "border-white/10 opacity-75 hover:opacity-100 hover:border-white/30"
                    }`}
                  >
                    <img
                      src={photoUrl}
                      alt={`Website photo ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // If this photo cannot be loaded, hide its tile gracefully
                        e.currentTarget.parentElement?.classList.add("hidden");
                      }}
                    />

                    {/* Selection Indicator */}
                    <div className="absolute top-2.5 right-2.5">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#fc9a5d] to-[#be32ff] text-white flex items-center justify-center shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-white/40 bg-black/40 backdrop-blur-sm" />
                      )}
                    </div>

                    {/* Remove photo button on hover */}
                    <button
                      type="button"
                      onClick={(e) => handleRemovePhoto(photoUrl, e)}
                      aria-label="Remove photo"
                      className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-black/60 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm shadow-md"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}

              {websitePhotos.length === 0 && (
                <div className="col-span-full py-8 text-center text-neutral-400 text-sm">
                  Fetching photos from your website... Or click &quot;Upload&quot; to add your own brand photos.
                </div>
              )}
            </div>
          </div>

          {/* Bottom Action: Centered "Use these 11 photos →" Button (Exact Image 2) */}
          <div className="flex justify-center pt-8 pb-4">
            <button
              type="button"
              id="photos-continue-btn"
              onClick={handleWebsitePhotosContinue}
              disabled={isSavingPhotos}
              className="w-full max-w-[340px] sm:max-w-[360px] h-10 sm:h-11 rounded-full bg-gradient-to-r from-[#7d36fa] via-[#be32ff] via-[#f0449b] to-[#fc9a5d] hover:brightness-110 active:scale-[0.98] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#be32ff]/25 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(90deg, #7d36fa 0%, #be32ff 33%, #f0449b 67%, #fc9a5d 100%)" }}
            >
              {isSavingPhotos ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Use these {selectedPhotos.length > 0 ? selectedPhotos.length : websitePhotos.length} photos</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
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
        <div className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto pt-2 sm:pt-3 md:pt-4 pb-2 flex flex-col animate-in fade-in duration-400 relative z-10 px-4 sm:px-8 lg:px-12">
          <div className="space-y-4 sm:space-y-5">
            {/* Top Header: Back button + Progress bar (~20%) */}
            <div className="flex items-center gap-3 w-full mb-1 sm:mb-1.5">
              <button
                type="button"
                onClick={handleMapsSearchBack}
                aria-label="Go back"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
              <div className="flex-1 h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "20%" }}
                />
              </div>
            </div>

            {/* Heading & Subtitle (Image 2, 3, 4) */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-white tracking-tight">
                Find your shop on <span className="font-normal bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] bg-clip-text text-transparent">Google Maps</span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-400 font-light mt-1">
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
                  const val = e.target.value;
                  setMapsSearchQuery(val);
                  if (selectedMapsPlace && val !== selectedMapsPlace.name) {
                    setSelectedMapsPlace(null);
                  }
                }}
                placeholder="Search your shop, or paste map link"
                className="h-13 sm:h-14 pl-12 pr-12 rounded-full bg-[#13192b] border-white/10 text-white placeholder:text-neutral-500 text-base sm:text-lg focus:border-[#be32ff] shadow-inner"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              ) : null}
            </div>

            {/* Main Interactive Card: 3 Dynamic States (Image 2, 3, 4) */}
            {selectedMapsPlace ? (
              /* State 4: Selected Shop Card with 3 Photos & Rating (Image 4) */
              <div className="rounded-2xl sm:rounded-3xl bg-[#13192b]/80 border border-[#f0449b]/40 p-3 sm:p-4 space-y-3 shadow-xl ring-1 ring-[#be32ff]/25 animate-in zoom-in-95 duration-200">
                {/* 3 Photos row side-by-side */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 h-28 sm:h-36 rounded-xl overflow-hidden">
                  {(selectedMapsPlace.photos && selectedMapsPlace.photos.length > 0
                    ? selectedMapsPlace.photos.slice(0, 3)
                    : [
                        "/images/places/gt_mall_1.jpg",
                        "/images/places/gt_mall_2.jpg",
                        "/images/places/gt_mall_3.jpg",
                      ]
                  ).map((photoUrl, idx) => (
                    <div key={idx} className="h-full relative overflow-hidden bg-neutral-900 rounded-lg">
                      <img
                        src={photoUrl}
                        alt=""
                        className="w-full h-full object-cover select-none"
                      />
                    </div>
                  ))}
                </div>

                {/* Details + Rating */}
                <div className="flex items-start justify-between gap-3 pt-0.5">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 border border-white/15 text-neutral-300 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#fc9a5d]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-xs sm:text-sm leading-tight truncate">
                        {selectedMapsPlace.name}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-neutral-400 line-clamp-1 mt-0.5">
                        {selectedMapsPlace.address}
                      </p>
                    </div>
                  </div>
                  <div className="px-2.5 sm:px-3 py-1 rounded-full bg-[#3d3215] border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{selectedMapsPlace.rating || 4.5}</span>
                    <span className="text-amber-300/80 font-normal">
                      ({selectedMapsPlace.userRatingCount || 15})
                    </span>
                  </div>
                </div>
              </div>
            ) : mapsSearchResults.length > 0 ? (
              /* State 3: Dynamic Search Autocomplete Results List (Image 3) */
              <div className="rounded-2xl bg-[#13192b]/95 border border-white/10 overflow-hidden divide-y divide-white/10 shadow-2xl max-h-56 sm:max-h-64 overflow-y-auto animate-in fade-in duration-200">
                {mapsSearchResults.map((place) => (
                  <button
                    type="button"
                    key={place.id}
                    onClick={() => handleSelectMapsShop(place)}
                    className="w-full p-3 sm:p-3.5 text-left hover:bg-white/[0.06] transition-colors flex items-start gap-3 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 text-neutral-300 flex items-center justify-center shrink-0 mt-0.5 group-hover:text-white group-hover:border-[#be32ff]/50 transition-colors">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white text-xs sm:text-sm group-hover:text-[#be32ff] transition-colors">
                        {place.name}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-neutral-400 line-clamp-1 mt-0.5">
                        {place.address}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : mapsSearchError ? (
              /* Error State */
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
                  className="text-xs font-semibold text-[#be32ff] hover:underline cursor-pointer"
                >
                  Retry search
                </button>
              </div>
            ) : (
              /* State 2: Can't find it? Helper Card (Image 2) */
              <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#13192b]/60 border border-white/10 space-y-3.5">
                <h3 className="font-bold text-white text-sm sm:text-base">
                  Can&apos;t find it? Paste the Map link instead
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-neutral-300 font-normal">
                  <li className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span>Open the Google Map app</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span>Search your shop name</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span>Tap Share - Copy link</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span>Come back here and paste it above</span>
                  </li>
                </ul>
                <div className="pt-1.5">
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs sm:text-sm font-semibold text-white transition-all border border-white/10 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open Map</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Area (Image 2, 3, 4) */}
          <div className="flex flex-col items-center gap-3 pt-8 sm:pt-12 md:pt-14 pb-2">
            {!selectedMapsPlace && (
              <button
                type="button"
                onClick={() => handleCreateWebsite("google_maps")}
                className="px-6 py-2 rounded-full bg-transparent hover:bg-white/5 border border-white/20 text-white text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Create Website</span>
                <Sparkles className="w-4 h-4 text-white" />
              </button>
            )}

            <button
              type="button"
              id="maps-use-shop-btn"
              onClick={() => {
                if (selectedMapsPlace) {
                  handleUseShopContinue();
                } else {
                  // User clicked Use this Shop without searching: trigger dynamic search with "Gt mall"
                  setMapsSearchQuery("Gt mall");
                }
              }}
              className="w-full max-w-sm sm:max-w-md h-12 sm:h-13 rounded-full bg-gradient-to-r from-[#7d36fa] via-[#be32ff] via-[#f0449b] to-[#fc9a5d] hover:brightness-110 active:scale-[0.98] text-white font-semibold text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg shadow-[#be32ff]/25 transition-all cursor-pointer"
              style={{ background: "linear-gradient(90deg, #7d36fa 0%, #be32ff 33%, #f0449b 67%, #fc9a5d 100%)" }}
            >
              <span>Use this shop</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          GOOGLE MAPS STEP 2: GOT A WEBSITE? (Exact Reference Image 5)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "maps_website" && (
        <div className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto pt-4 sm:pt-6 md:pt-8 pb-4 flex flex-col animate-in fade-in duration-400 relative z-10 px-4 sm:px-8 lg:px-12">
          <div className="space-y-4 sm:space-y-6">
            {/* Top Header: Back button + Progress bar (~40%) */}
            <div className="flex items-center gap-3.5 w-full mb-1 sm:mb-2">
              <button
                type="button"
                onClick={handleMapsWebsiteBack}
                aria-label="Go back"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/10"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 h-2 sm:h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "40%" }}
                />
              </div>
            </div>

            {/* Heading & Subtitle (Un-bolded / Normal font) */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-white tracking-tight">
                Got a website for{" "}
                <span className="bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] bg-clip-text text-transparent font-normal">
                  {selectedMapsPlace?.name || businessProfile.business_name || "GT Mall Jaipur"}
                </span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 font-normal mt-1">
                Your photos and reviews do most of the work
              </p>
            </div>

            {/* Selected Shop Summary Card (Scaled up / Zoomed in) */}
            <div className="p-4 sm:p-5 md:p-6 rounded-2xl bg-[#13192b]/90 border border-white/15 flex items-start gap-4 shadow-md">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/10 border border-white/15 text-neutral-300 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#fc9a5d]" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-white text-base sm:text-lg leading-tight truncate">
                  {selectedMapsPlace?.name || businessProfile.business_name || "GT Mall Jaipur"}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 line-clamp-1 mt-1">
                  {selectedMapsPlace?.address || businessProfile.full_address || "D-Block, Crystal Court, Jawahar Nagar, Jaipur, Rajasthan 302017"}
                </p>
              </div>
            </div>

            {/* Website URL Input Field (Scaled up / Zoomed in) */}
            <div className="relative pt-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center text-neutral-300 text-xs sm:text-sm font-bold pointer-events-none">
                @
              </div>
              <Input
                type="text"
                value={mapsWebsiteUrl}
                onChange={(e) => setMapsWebsiteUrl(e.target.value)}
                placeholder="yourwebsite.com"
                className="h-12 sm:h-14 pl-14 sm:pl-16 pr-5 rounded-2xl bg-[#13192b] border-white/15 text-white placeholder:text-neutral-500 text-sm sm:text-base focus:border-[#be32ff] shadow-inner"
              />
            </div>
          </div>

          {/* Bottom Action Area (Shifted down / Lower placement) */}
          <div className="flex flex-col items-center gap-3 pt-12 sm:pt-20 lg:pt-28 pb-1">
            <button
              type="button"
              id="maps-use-website-btn"
              onClick={() => {
                if (mapsWebsiteUrl && mapsWebsiteUrl.trim()) {
                  handleUseWebsiteContinue();
                } else {
                  handleSkipWebsite();
                }
              }}
              className="w-full max-w-md sm:max-w-lg h-12 sm:h-13 rounded-full bg-gradient-to-r from-[#7d36fa] via-[#be32ff] via-[#f0449b] to-[#fc9a5d] hover:brightness-110 active:scale-[0.98] text-white font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-lg shadow-[#be32ff]/25 transition-all cursor-pointer"
              style={{ background: "linear-gradient(90deg, #7d36fa 0%, #be32ff 33%, #f0449b 67%, #fc9a5d 100%)" }}
            >
              <span>Use this shop</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={handleSkipWebsite}
              className="text-sm sm:text-base text-neutral-400 hover:text-white transition-colors cursor-pointer py-1.5"
            >
              Skip - I don&apos;t have one
            </button>
          </div>
        </div>
      )}

      {currentStepObj.id === "maps_category" && (
        <div className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto pt-4 sm:pt-6 md:pt-8 pb-4 flex flex-col animate-in fade-in duration-400 relative z-10 px-4 sm:px-8 lg:px-12">
          <div className="space-y-6 sm:space-y-8">
            {/* Top Header: Back button + Progress bar (~55%) */}
            <div className="flex items-center gap-3.5 w-full mb-2 sm:mb-3">
              <button
                type="button"
                onClick={handleMapsCategoryBack}
                aria-label="Go back"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/10"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex-1 h-2 sm:h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "55%" }}
                />
              </div>
            </div>

            {/* Heading & Subtitle (Un-bolded / Normal font) */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-white tracking-tight">
                What kind of <span className="bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] bg-clip-text text-transparent font-normal">Business</span> do you run?
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 font-normal mt-1">
                So we know what to make for you
              </p>
            </div>

            {/* Field: Category Dropdown Selector (Scaled up / Zoomed in) */}
            <div className="space-y-2.5 pt-2">
              <Label htmlFor="maps-category-select" className="text-sm sm:text-base font-semibold text-neutral-200">
                Category
              </Label>
              <div className="relative">
                <select
                  id="maps-category-select"
                  value={mapsCategory}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMapsCategory(val);
                    const catObj = BUSINESS_CATEGORIES.find((c) => c.name.toLowerCase() === val.toLowerCase());
                    if (catObj) {
                      setMapsPromotion(catObj.defaultPromote);
                    }
                  }}
                  className="w-full h-12 sm:h-14 px-5 pr-12 rounded-2xl bg-[#13192b] border border-white/15 text-white focus:outline-none focus:border-[#be32ff] text-sm sm:text-base transition-colors appearance-none cursor-pointer shadow-inner"
                >
                  <option value="" disabled className="bg-[#13192b] text-neutral-500">
                    Select a category
                  </option>
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.name} className="bg-[#13192b] text-white py-2">
                      {cat.name}
                    </option>
                  ))}
                  {mapsCategory &&
                    !BUSINESS_CATEGORIES.some(
                      (c) => c.name.toLowerCase() === mapsCategory.toLowerCase()
                    ) && (
                      <option value={mapsCategory} className="bg-[#13192b] text-white py-2">
                        {mapsCategory}
                      </option>
                    )}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Bottom Action: Centered Continue Button (Shifted down / Lower placement) */}
          <div className="flex justify-center pt-16 sm:pt-28 lg:pt-36 pb-2">
            <button
              type="button"
              id="maps-category-continue-btn"
              onClick={handleMapsCategoryContinue}
              disabled={!mapsCategory.trim()}
              className="w-full max-w-md sm:max-w-lg h-12 sm:h-13 rounded-full bg-gradient-to-r from-[#7d36fa] via-[#be32ff] via-[#f0449b] to-[#fc9a5d] hover:brightness-110 active:scale-[0.98] text-white font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-lg shadow-[#be32ff]/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(90deg, #7d36fa 0%, #be32ff 33%, #f0449b 67%, #fc9a5d 100%)" }}
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {currentStepObj.id === "maps_details" && (
        <div className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto pt-1 sm:pt-2 pb-2 flex flex-col justify-start animate-in fade-in duration-400 relative z-10 px-4 sm:px-8 lg:px-12">
          <div className="space-y-2.5 sm:space-y-3">
            {/* Top Header: Back button + Progress bar (~70%) */}
            <div className="flex items-center gap-3 w-full mb-1">
              <button
                type="button"
                onClick={handleMapsDetailsBack}
                aria-label="Go back"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/10"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
              <div className="flex-1 h-2 sm:h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "70%" }}
                />
              </div>
            </div>

            {/* Heading & Subtitle (Un-bolded / Normal font) */}
            <div className="space-y-1 mt-1 mb-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-normal text-white tracking-tight">
                Tell us about your <span className="bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] bg-clip-text text-transparent font-normal">business?</span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-300 font-normal mt-1">
                We&apos;ll use this on every post and ad
              </p>
            </div>

            {/* Form Fields with balanced spacing and clear separation between text and label */}
            <div className="space-y-3 sm:space-y-3.5 pt-0.5">
              {/* Field 1: Business Name (required) */}
              <div className="space-y-2">
                <Label htmlFor="maps-b-name" className="text-xs sm:text-sm font-medium text-neutral-300 block">
                  Business Name <span className="text-rose-500 font-normal">(required)</span>
                </Label>
                <Input
                  id="maps-b-name"
                  type="text"
                  value={businessProfile.business_name}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, business_name: e.target.value })}
                  placeholder="Your business name"
                  className="w-full h-10 sm:h-11 px-4 rounded-xl bg-[#13192b] border border-white/15 text-white placeholder:text-neutral-500 text-xs sm:text-sm focus:border-[#be32ff] transition-colors shadow-inner"
                />
              </div>

              {/* Field 2: What should we promote? (required) */}
              <div className="space-y-2">
                <Label htmlFor="maps-b-promote" className="text-xs sm:text-sm font-medium text-neutral-300 block">
                  What should we promote? <span className="text-rose-500 font-normal">(required)</span>
                </Label>
                <Input
                  id="maps-b-promote"
                  type="text"
                  value={mapsPromotion}
                  onChange={(e) => setMapsPromotion(e.target.value)}
                  placeholder="What you promote"
                  className="w-full h-10 sm:h-11 px-4 rounded-xl bg-[#13192b] border border-white/15 text-white placeholder:text-neutral-500 text-xs sm:text-sm focus:border-[#be32ff] transition-colors shadow-inner"
                />
              </div>

              {/* Grid 2 Columns: What do you sell to? (optional) + What makes you different? (optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4.5">
                {/* Column 1: What do you sell to? (optional) */}
                <div className="space-y-2">
                  <Label htmlFor="maps-b-audience" className="text-xs sm:text-sm font-medium text-neutral-300 block">
                    What do you sell to? (optional)
                  </Label>
                  <div className="relative">
                    <select
                      id="maps-b-audience"
                      value={mapsAudience}
                      onChange={(e) => setMapsAudience(e.target.value)}
                      className="w-full h-10 sm:h-11 px-4 pr-10 rounded-xl bg-[#13192b] border border-white/15 text-white focus:outline-none focus:border-[#be32ff] text-xs sm:text-sm transition-colors appearance-none cursor-pointer shadow-inner"
                    >
                      <option value="" disabled className="bg-[#13192b] text-neutral-500">
                        Your business type
                      </option>
                      <option value="Product-based" className="bg-[#13192b] text-white py-1">
                        Product-based
                      </option>
                      <option value="Service / Digital" className="bg-[#13192b] text-white py-1">
                        Service / Digital
                      </option>
                      <option value="Physical Location" className="bg-[#13192b] text-white py-1">
                        Physical Location
                      </option>
                      <option value="Wholesale / B2B" className="bg-[#13192b] text-white py-1">
                        Wholesale / B2B
                      </option>
                      <option value="Hybrid" className="bg-[#13192b] text-white py-1">
                        Hybrid
                      </option>
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                {/* Column 2: What makes you different? (optional) */}
                <div className="space-y-2">
                  <Label htmlFor="maps-b-diff" className="text-xs sm:text-sm font-medium text-neutral-300 block">
                    What makes you different? (optional)
                  </Label>
                  <Input
                    id="maps-b-diff"
                    type="text"
                    value={mapsDifferentiator}
                    onChange={(e) => setMapsDifferentiator(e.target.value)}
                    placeholder="Different"
                    className="w-full h-10 sm:h-11 px-4 rounded-xl bg-[#13192b] border border-white/15 text-white placeholder:text-neutral-500 text-xs sm:text-sm focus:border-[#be32ff] transition-colors shadow-inner"
                  />
                </div>
              </div>

              {/* Field 4: Logo (optional) */}
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm font-medium text-neutral-300 block">Logo (optional)</Label>
                <label className="w-full h-14 sm:h-16 rounded-xl bg-[#13192b]/60 border border-white/15 hover:border-white/25 transition-all flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden">
                  {mapsLogoUrl ? (
                    <div className="relative w-full h-full p-1.5 flex items-center justify-center">
                      <img src={mapsLogoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveMapsLogo();
                        }}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-neutral-300 hover:text-white cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-neutral-400 group-hover:text-white transition-colors py-1">
                      <Upload className="w-4 h-4 text-neutral-400 group-hover:text-white" />
                      <span className="text-xs sm:text-sm font-medium">Upload</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleMapsLogoUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Bottom Action: Centered Continue Button (Shifted down with comfortable clearance) */}
          <div className="flex justify-center pt-4 sm:pt-5 pb-2">
            <button
              type="button"
              id="maps-details-continue-btn"
              onClick={handleMapsDetailsContinue}
              disabled={!businessProfile.business_name.trim()}
              className="w-full max-w-sm sm:max-w-md h-11 sm:h-12 rounded-full bg-gradient-to-r from-[#7d36fa] via-[#be32ff] via-[#f0449b] to-[#fc9a5d] hover:brightness-110 active:scale-[0.98] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#be32ff]/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(90deg, #7d36fa 0%, #be32ff 33%, #f0449b 67%, #fc9a5d 100%)" }}
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {currentStepObj.id === "maps_photos" && (
        <div className="w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto pt-2 pb-14 flex flex-col justify-start relative z-10 px-4 sm:px-8">
          <div className="space-y-2.5 sm:space-y-3">
            {/* Top Header: Back button + Progress bar (~85%) */}
            <div className="flex items-center gap-3 w-full mb-0.5 sm:mb-1">
              <button
                type="button"
                onClick={handleMapsPhotosBack}
                aria-label="Go back"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
              <div className="flex-1 h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(240,68,155,0.5)]"
                  style={{ width: "85%" }}
                />
              </div>
            </div>

            {/* Heading & Subtitle (Un-bolded / Normal font) */}
            <div className="space-y-0.5">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-normal text-white tracking-tight">
                Pick the photos we should work with
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                Syncing Google Maps photos… you can upload your own now.
              </p>
            </div>

            {/* Informational Status Card */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-500/25 flex items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#be32ff] shrink-0" />
                <span className="font-medium text-white text-xs sm:text-sm">Google Maps details are ready</span>
              </div>
              <span className="text-neutral-400 text-xs">
                {mapsPhotos.length > 0 ? `${mapsPhotos.length} photos loaded` : "Upload photos below"}
              </span>
            </div>

            {/* Photo count indicator & Select All toggle */}
            <div className="flex items-center justify-between pt-0.5 pb-0.5">
              <div className="px-3 py-0.5 rounded-full text-xs font-medium bg-[#be32ff]/15 border border-[#be32ff]/30 text-purple-200 flex items-center gap-2 shadow-sm">
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

            {/* Responsive Photo Grid (Height sized with clean clearance above Continue button) */}
            <div className="w-full">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 pb-2">
                {/* Upload Tile */}
                <label className="aspect-square rounded-2xl border-2 border-dashed border-white/20 bg-white/[0.03] hover:bg-white/[0.06] hover:border-[#be32ff] transition-all flex flex-col items-center justify-center p-3 text-center cursor-pointer group shadow-sm">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleMapsPhotoUpload}
                    className="hidden"
                  />
                  {isUploadingMapsPhoto ? (
                    <Loader2 className="w-6 h-6 text-[#be32ff] animate-spin mb-1.5" />
                  ) : (
                    <Upload className="w-6 h-6 text-[#fc9a5d] group-hover:scale-110 transition-transform mb-1.5" />
                  )}
                  <span className="text-xs font-semibold text-white">Upload a photo</span>
                  <span className="text-[10px] text-neutral-400 mt-0.5">JPG, PNG up to 10MB</span>
                </label>

                {/* Photos List */}
                {mapsPhotos.map((photoUrl, idx) => {
                  const isSelected = selectedMapsPhotos.includes(photoUrl);
                  return (
                    <div
                      key={idx}
                      onClick={() => handleToggleMapsPhoto(photoUrl)}
                      className={`aspect-square rounded-2xl overflow-hidden relative cursor-pointer group transition-all duration-300 ${isSelected
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
                        className="absolute bottom-2.5 right-2.5 w-6 h-6 rounded-full bg-black/60 hover:bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm shadow-md"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Compact Centered Continue Button (Shifted down so it never overlaps photo cards and is 100% unclipped) */}
          <div className="flex justify-center pt-5 sm:pt-7 pb-2">
            <button
              type="button"
              id="maps-photos-continue-btn"
              onClick={handleMapsPhotosContinue}
              disabled={isSavingMapsStep || selectedMapsPhotos.length === 0}
              className={`w-full max-w-sm sm:max-w-md h-10 sm:h-11 rounded-full font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#be32ff]/25 ${selectedMapsPhotos.length > 0 && !isSavingMapsStep
                  ? "bg-gradient-to-r from-[#7d36fa] via-[#be32ff] via-[#f0449b] to-[#fc9a5d] hover:brightness-110 active:scale-[0.98] text-white"
                  : "bg-white/10 text-neutral-500 cursor-not-allowed border border-white/5 opacity-60"
                }`}
              style={{ background: selectedMapsPhotos.length > 0 && !isSavingMapsStep ? "linear-gradient(90deg, #7d36fa 0%, #be32ff 33%, #f0449b 67%, #fc9a5d 100%)" : undefined }}
            >
              {isSavingMapsStep ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving shop photos...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {currentStepObj.id === "marketplace_platforms" && (
        <div className="w-full max-w-4xl lg:max-w-5xl mx-auto my-auto py-1 sm:py-2 flex flex-col justify-center animate-in fade-in duration-400 relative z-10 px-4 sm:px-6">
          <div>
            {/* Top Header: Back button + Long Gradient Progress Bar */}
            <div className="flex items-center w-full mb-3 sm:mb-4">
              <button
                type="button"
                onClick={handleMarketplacePlatformsBack}
                aria-label="Go back"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-slate-700/60"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
              <div className="flex-1 h-1.5 sm:h-2 bg-slate-800 rounded-full overflow-hidden ml-4 sm:ml-6">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] via-[#be32ff] to-[#7d36fa] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(240,68,155,0.5)]"
                  style={{ width: "35%" }}
                />
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-3 sm:mb-4 text-left">
              <h1 className="text-2xl sm:text-3xl font-normal text-white tracking-tight">
                Which marketplaces do you{" "}
                <span className="font-normal bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] via-[#be32ff] to-[#7d36fa] bg-clip-text text-transparent">
                  sell on?
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1 leading-relaxed">
                Pick all that apply.
              </p>
            </div>

            {/* Selectable Cards Grid - Enlarged Box Size (Image 1 Fix) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5 my-2.5 sm:my-3">
              {MARKETPLACE_SELLER_PLATFORMS.map((item) => {
                const isSelected = selectedMarketplaces.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleToggleMarketplace(item.id)}
                    className={`relative flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl transition-all duration-200 border text-center cursor-pointer select-none min-h-[135px] sm:min-h-[150px] ${isSelected
                        ? "bg-[#141B34] border-2 border-[#BE32FF] shadow-[0_0_20px_rgba(190,50,255,0.3)] ring-1 ring-[#BE32FF]/50 scale-[1.02]"
                        : "bg-[#10172B] border-slate-800 hover:border-slate-700 hover:bg-[#131C36]"
                      }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] flex items-center justify-center shadow-md">
                        <Check className="w-3 h-3 text-white stroke-[3]" />
                      </div>
                    )}

                    {/* Logo Tile - Enlarged */}
                    <div className="mb-2.5 shrink-0 flex items-center justify-center">
                      <PlatformIcon
                        id={item.id}
                        name={item.name}
                        className="w-14 h-14 sm:w-16 sm:h-16"
                      />
                    </div>

                    <span className="text-sm sm:text-base font-medium text-white">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Error Notice */}
            {error && (
              <div className="mt-2 p-2.5 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 animate-in fade-in">
                <span className="font-semibold text-red-400">Notice:</span> {error}
              </div>
            )}
          </div>

          {/* Continue Button */}
          <div className="pt-3 sm:pt-4 pb-1 flex justify-center">
            <button
              type="button"
              id="marketplace-platforms-continue-btn"
              onClick={handleMarketplacePlatformsContinue}
              disabled={selectedMarketplaces.length === 0 || isSavingMarketplace}
              className={`w-full max-w-sm h-11 sm:h-12 rounded-full font-semibold text-base flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-[#be32ff]/25 ${selectedMarketplaces.length > 0 && !isSavingMarketplace
                  ? "bg-gradient-to-r from-[#7d36fa] via-[#be32ff] via-[#f0449b] to-[#fc9a5d] text-white hover:brightness-110 active:scale-[0.98] cursor-pointer"
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
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
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
                    className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl transition-all duration-200 border text-center cursor-pointer select-none min-h-[110px] sm:min-h-[125px] ${isSelected
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
              className={`w-full h-13 sm:h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${selectedListings.length > 0 &&
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
          MARKETPLACE STEP 2: WHAT YOUR WEBSITE? (Exact Image 3 Desktop Layout)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "marketplace_website" && (
        <div className="w-full max-w-5xl xl:max-w-6xl mx-auto my-auto py-1 sm:py-2 flex flex-col justify-center animate-in fade-in duration-400 relative z-10 px-4 sm:px-6">
          <div>
            {/* Top Bar: Back button + Full-width Thin Gradient Progress Bar (~40%) */}
            <div className="flex items-center gap-3 w-full mb-3 sm:mb-4 lg:mb-4">
              <button
                type="button"
                onClick={handleMarketplaceWebsiteBack}
                aria-label="Go back"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/10"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
              <div className="flex-1 h-1.5 sm:h-2 bg-slate-800/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] via-[#be32ff] to-[#7d36fa] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(232,78,143,0.5)]"
                  style={{ width: "40%" }}
                />
              </div>
            </div>

            {/* 2-Column Layout matching Image 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">

              {/* Left Column: Heading, Inputs, Highlights & Action Buttons */}
              <div className="space-y-3 sm:space-y-3.5 lg:space-y-4 max-w-lg">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-normal text-white tracking-tight leading-tight">
                    What your{" "}
                    <span className="font-normal bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] via-[#be32ff] to-[#7d36fa] bg-clip-text text-transparent">
                      website
                    </span>
                    <span className="text-[#9936F1]">?</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal leading-relaxed">
                    We&apos;ll read it for you, so there&apos;s no need to type anything.
                  </p>
                </div>

                {/* Website URL Input (Pill container matching Image 2) */}
                <div className="space-y-1.5">
                  <div className="h-[44px] sm:h-[46px] px-3.5 sm:px-4 rounded-full bg-[#131728] border border-slate-700/60 focus-within:border-[#9936F1] focus-within:ring-1 focus-within:ring-[#9936F1]/40 transition-all flex items-center gap-2.5 sm:gap-3">
                    <Link2 className="w-4 h-4 -rotate-45 text-slate-400 shrink-0" />
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
                      placeholder="yourwebsite.com"
                      className="w-full bg-transparent border-none text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none tracking-normal font-normal"
                      autoFocus
                    />
                    {websiteUrl && (
                      <button
                        type="button"
                        onClick={() => setWebsiteUrl("")}
                        className="text-slate-400 hover:text-white transition-colors p-1"
                        aria-label="Clear input"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {websiteUrl && !isValidWebsiteUrl(websiteUrl) && (
                    <p className="text-[11px] text-[#E84E8F] pl-3 font-medium">
                      Please enter a valid website address (e.g. yourbrand.com)
                    </p>
                  )}
                </div>

                {/* OR Divider with subtle line */}
                <div className="relative flex items-center justify-center py-1">
                  <div className="w-full border-t border-slate-700/50" />
                  <span className="absolute bg-[#071226] px-3 text-[10px] sm:text-[11px] font-normal tracking-widest text-slate-500 uppercase">
                    OR
                  </span>
                </div>

                {/* Create Website Button with Gradient Border & Sparkles Icon (Reference Image) */}
                <div className="p-[1.5px] rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] shadow-sm">
                  <button
                    type="button"
                    onClick={() => handleCreateWebsite("marketplace")}
                    className="w-full h-[40px] sm:h-[42px] rounded-full bg-[#0d1427] hover:bg-[#121c35] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-xs sm:text-sm font-normal text-white cursor-pointer"
                  >
                    <span>Create Website</span>
                    <Sparkles className="w-3.5 h-3.5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
                  </button>
                </div>

                {/* 3 Value Pillars with Icons (AI-Powered | Secure | Grow Faster) */}
                <div className="grid grid-cols-3 divide-x divide-purple-900/40 pt-2 pb-1 text-left">
                  <div className="flex items-center gap-2 pr-2.5 min-w-0">
                    <Zap className="w-4 h-4 text-[#C084FC] shrink-0" />
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs font-medium text-[#E9D5FF]">AI-Powered</p>
                      <p className="text-[10px] sm:text-[11px] text-[#C084FC]/80 font-normal truncate">Fast &amp; Smart</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 min-w-0">
                    <Shield className="w-4 h-4 text-[#C084FC] shrink-0" />
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs font-medium text-[#E9D5FF]">Secure</p>
                      <p className="text-[10px] sm:text-[11px] text-[#C084FC]/80 font-normal truncate">Your data is safe</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-2.5 min-w-0">
                    <TrendingUp className="w-4 h-4 text-[#C084FC] shrink-0" />
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs font-medium text-[#E9D5FF]">Grow Faster</p>
                      <p className="text-[10px] sm:text-[11px] text-[#C084FC]/80 font-normal truncate">With AI insights</p>
                    </div>
                  </div>
                </div>

                {/* Error Notice */}
                {error && (
                  <div className="p-2.5 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 animate-in fade-in">
                    <span className="font-semibold text-red-400">Notice:</span> {error}
                  </div>
                )}

                {/* Continue Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    id="marketplace-website-continue-btn"
                    onClick={handleMarketplaceWebsiteContinue}
                    disabled={!isValidWebsiteUrl(websiteUrl) || isSavingMarketplace}
                    className={`w-full max-w-md sm:max-w-lg h-[46px] sm:h-[48px] rounded-full font-normal text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-lg shadow-[#be32ff]/25 ${isValidWebsiteUrl(websiteUrl) && !isSavingMarketplace
                        ? "bg-gradient-to-r from-[#7d36fa] via-[#be32ff] via-[#f0449b] to-[#fc9a5d] text-white hover:brightness-110 active:scale-[0.98]"
                        : "bg-white/10 text-white/40 cursor-not-allowed opacity-60 pointer-events-none"
                      }`}
                  >
                    {isSavingMarketplace ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Scanning &amp; Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: 3D Website Artwork (Exact Image 2 Artwork) */}
              <div className="hidden lg:flex items-center justify-center relative select-none">
                <div className="relative w-full max-w-[380px] lg:max-w-[420px] xl:max-w-[450px] flex items-center justify-center">
                  <img
                    src="/images/website-reading-artwork.png"
                    alt="What your website?"
                    className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-[0_0_40px_rgba(153,54,241,0.25)] animate-in fade-in duration-500"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          WHOLESALE / B2B STEP 1: WHERE DO YOU SELL YOUR PRODUCTS WHOLESALE?
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "b2b_platforms" && (
        <div className="w-full max-w-4xl lg:max-w-5xl mx-auto my-auto py-1 sm:py-2 flex flex-col justify-center animate-in fade-in duration-400 relative z-10 px-4 sm:px-6">
          <div>
            {/* Top Header: Back button + Long Gradient Progress Bar */}
            <div className="flex items-center w-full mb-3 sm:mb-4">
              <button
                type="button"
                onClick={handleB2bPlatformsBack}
                aria-label="Go back"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-slate-700/60"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
              <div className="flex-1 h-1.5 sm:h-2 bg-slate-800 rounded-full overflow-hidden ml-4 sm:ml-6">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] via-[#be32ff] to-[#7d36fa] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(240,68,155,0.5)]"
                  style={{ width: "35%" }}
                />
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-3 sm:mb-4 text-left">
              <h1 className="text-2xl sm:text-3xl font-normal text-white tracking-tight">
                Where do you sell your products wholesale?
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1 leading-relaxed">
                Select all the platforms you use.
              </p>
            </div>

            {/* Selectable Cards Grid - Enlarged Box Size (Image 1 Fix) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5 my-2.5 sm:my-3">
              {B2B_WHOLESALE_PLATFORMS.map((item) => {
                const isSelected = selectedB2bPlatforms.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleToggleB2bPlatform(item.id)}
                    className={`relative flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl transition-all duration-200 border text-center cursor-pointer select-none min-h-[135px] sm:min-h-[150px] ${isSelected
                        ? "bg-[#141B34] border-2 border-[#BE32FF] shadow-[0_0_20px_rgba(190,50,255,0.3)] ring-1 ring-[#BE32FF]/50 scale-[1.02]"
                        : "bg-[#10172B] border-slate-800 hover:border-slate-700 hover:bg-[#131C36]"
                      }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] flex items-center justify-center shadow-md">
                        <Check className="w-3 h-3 text-white stroke-[3]" />
                      </div>
                    )}

                    {/* Logo Tile - Enlarged */}
                    <div className="mb-2.5 shrink-0 flex items-center justify-center">
                      <PlatformIcon
                        id={item.id}
                        name={item.name}
                        className="w-14 h-14 sm:w-16 sm:h-16"
                      />
                    </div>

                    <span className="text-sm sm:text-base font-medium text-white">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Error Notice */}
            {error && (
              <div className="mt-2 p-2.5 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 animate-in fade-in">
                <span className="font-semibold text-red-400">Notice:</span> {error}
              </div>
            )}
          </div>

          {/* Continue Button */}
          <div className="pt-3 sm:pt-4 pb-1 flex justify-center">
            <button
              type="button"
              id="b2b-platforms-continue-btn"
              onClick={handleB2bPlatformsContinue}
              disabled={selectedB2bPlatforms.length === 0 || isSavingB2b}
              className={`w-full max-w-sm h-11 sm:h-12 rounded-full font-semibold text-base flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-[#be32ff]/25 ${selectedB2bPlatforms.length > 0 && !isSavingB2b
                  ? "bg-gradient-to-r from-[#7d36fa] via-[#be32ff] via-[#f0449b] to-[#fc9a5d] text-white hover:brightness-110 active:scale-[0.98] cursor-pointer"
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
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
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
                    className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl transition-all duration-200 border text-center cursor-pointer select-none min-h-[110px] sm:min-h-[125px] ${isSelected
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
              className={`w-full h-13 sm:h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${selectedB2bListings.length > 0 &&
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
        <div className="w-full max-w-5xl xl:max-w-6xl mx-auto my-auto py-1 sm:py-2 flex flex-col justify-center animate-in fade-in duration-400 relative z-10 px-4 sm:px-6">
          <div>
            {/* Top Bar: Back button + Full-width Thin Gradient Progress Bar (~40%) */}
            <div className="flex items-center gap-3 w-full mb-3 sm:mb-4 lg:mb-4">
              <button
                type="button"
                onClick={handleB2bWebsiteBack}
                aria-label="Go back"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-white/10"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
              <div className="flex-1 h-1.5 sm:h-2 bg-slate-800/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] via-[#be32ff] to-[#7d36fa] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(232,78,143,0.5)]"
                  style={{ width: "40%" }}
                />
              </div>
            </div>

            {/* 2-Column Layout matching Image 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">

              {/* Left Column: Heading, Inputs, Highlights & Action Buttons */}
              <div className="space-y-3 sm:space-y-3.5 lg:space-y-4 max-w-lg">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-normal text-white tracking-tight leading-tight">
                    What your{" "}
                    <span className="font-normal bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] via-[#be32ff] to-[#7d36fa] bg-clip-text text-transparent">
                      website
                    </span>
                    <span className="text-[#9936F1]">?</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal leading-relaxed">
                    We&apos;ll read it for you, so there&apos;s no need to type anything.
                  </p>
                </div>

                {/* Website URL Input (Pill container matching Image 2) */}
                <div className="space-y-1.5">
                  <div className="h-[44px] sm:h-[46px] px-3.5 sm:px-4 rounded-full bg-[#131728] border border-slate-700/60 focus-within:border-[#9936F1] focus-within:ring-1 focus-within:ring-[#9936F1]/40 transition-all flex items-center gap-2.5 sm:gap-3">
                    <Link2 className="w-4 h-4 -rotate-45 text-slate-400 shrink-0" />
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
                      placeholder="yourwebsite.com"
                      className="w-full bg-transparent border-none text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none tracking-normal font-normal"
                      autoFocus
                    />
                    {websiteUrl && (
                      <button
                        type="button"
                        onClick={() => setWebsiteUrl("")}
                        className="text-slate-400 hover:text-white transition-colors p-1"
                        aria-label="Clear input"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {websiteUrl && !isValidWebsiteUrl(websiteUrl) && (
                    <p className="text-[11px] text-[#E84E8F] pl-3 font-medium">
                      Please enter a valid website address (e.g. yourbrand.com)
                    </p>
                  )}
                </div>

                {/* OR Divider with subtle line */}
                <div className="relative flex items-center justify-center py-1">
                  <div className="w-full border-t border-slate-700/50" />
                  <span className="absolute bg-[#071226] px-3 text-[10px] sm:text-[11px] font-normal tracking-widest text-slate-500 uppercase">
                    OR
                  </span>
                </div>

                {/* Create Website Button with Gradient Border & Sparkles Icon (Reference Image) */}
                <div className="p-[1.5px] rounded-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] shadow-sm">
                  <button
                    type="button"
                    onClick={() => handleCreateWebsite("b2b")}
                    className="w-full h-[40px] sm:h-[42px] rounded-full bg-[#0d1427] hover:bg-[#121c35] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-xs sm:text-sm font-normal text-white cursor-pointer"
                  >
                    <span>Create Website</span>
                    <Sparkles className="w-3.5 h-3.5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
                  </button>
                </div>

                {/* 3 Value Pillars with Icons (AI-Powered | Secure | Grow Faster) */}
                <div className="grid grid-cols-3 divide-x divide-purple-900/40 pt-2 pb-1 text-left">
                  <div className="flex items-center gap-2 pr-2.5 min-w-0">
                    <Zap className="w-4 h-4 text-[#C084FC] shrink-0" />
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs font-medium text-[#E9D5FF]">AI-Powered</p>
                      <p className="text-[10px] sm:text-[11px] text-[#C084FC]/80 font-normal truncate">Fast &amp; Smart</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 min-w-0">
                    <Shield className="w-4 h-4 text-[#C084FC] shrink-0" />
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs font-medium text-[#E9D5FF]">Secure</p>
                      <p className="text-[10px] sm:text-[11px] text-[#C084FC]/80 font-normal truncate">Your data is safe</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-2.5 min-w-0">
                    <TrendingUp className="w-4 h-4 text-[#C084FC] shrink-0" />
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs font-medium text-[#E9D5FF]">Grow Faster</p>
                      <p className="text-[10px] sm:text-[11px] text-[#C084FC]/80 font-normal truncate">With AI insights</p>
                    </div>
                  </div>
                </div>

                {/* Error Notice */}
                {error && (
                  <div className="p-2.5 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 animate-in fade-in">
                    <span className="font-semibold text-red-400">Notice:</span> {error}
                  </div>
                )}

                {/* Continue Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    id="b2b-website-continue-btn"
                    onClick={handleB2bWebsiteContinue}
                    disabled={!isValidWebsiteUrl(websiteUrl) || isSavingB2b}
                    className={`w-full max-w-md sm:max-w-lg h-[46px] sm:h-[48px] rounded-full font-normal text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-lg shadow-[#be32ff]/25 ${isValidWebsiteUrl(websiteUrl) && !isSavingB2b
                        ? "bg-gradient-to-r from-[#7d36fa] via-[#be32ff] via-[#f0449b] to-[#fc9a5d] text-white hover:brightness-110 active:scale-[0.98]"
                        : "bg-white/10 text-white/40 cursor-not-allowed opacity-60 pointer-events-none"
                      }`}
                  >
                    {isSavingB2b ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Scanning &amp; Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: 3D Website Artwork (Exact Image 2 Artwork) */}
              <div className="hidden lg:flex items-center justify-center relative select-none">
                <div className="relative w-full max-w-[380px] lg:max-w-[420px] xl:max-w-[450px] flex items-center justify-center">
                  <img
                    src="/images/website-reading-artwork.png"
                    alt="What your website?"
                    className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-[0_0_40px_rgba(153,54,241,0.25)] animate-in fade-in duration-500"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          NO ONLINE PRESENCE: BRAND KIT SETUP (Step 1 Basics & Step 2 Logo Studio)
      ══════════════════════════════════════════════════════════════════════ */}
      {(currentStepObj.id === "none_details" || currentStepObj.id === "none_brand_kit") && (
        <div className="w-full max-w-4xl lg:max-w-5xl mx-auto py-2 sm:py-4 px-3 sm:px-6 animate-in fade-in duration-300">
          <BrandKitRegistrationModal
            isOpen={true}
            isModal={false}
            initialStep={currentStepObj.id === "none_brand_kit" ? "logo" : "basics"}
            onBack={handleNoneDetailsBack}
            onStepChange={(st) => {
              if (st === "basics") {
                const idx = activeSteps.findIndex((s) => s.id === "none_details");
                if (idx !== -1) setCurrentStep(idx);
              } else if (st === "logo") {
                const idx = activeSteps.findIndex((s) => s.id === "none_brand_kit");
                if (idx !== -1) setCurrentStep(idx);
              }
            }}
            onClose={() => {
              router.push("/dashboard");
            }}
            onComplete={async () => {
              const nextIdx = activeSteps.findIndex((s) => s.id === "first_thing");
              if (nextIdx !== -1) {
                setCurrentStep(nextIdx);
              } else {
                router.push("/dashboard");
              }
            }}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 4: LET'S MAKE YOUR FIRST THING (Reference Screenshot 3)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "first_thing" && (
        <div className="w-full max-w-4xl mx-auto my-auto py-2 sm:py-4 flex flex-col justify-between min-h-[580px] sm:min-h-[660px] animate-in fade-in duration-400 relative z-10 px-3 sm:px-6">
          <div>
            {/* Top Header: Back button + Progress Indicator (~75%) */}
            <div className="flex items-center gap-3 sm:gap-4 w-full mb-6 sm:mb-8">
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
                  className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] via-[#be32ff] to-[#7d36fa] rounded-full transition-all duration-500"
                  style={{ width: "75%" }}
                />
              </div>
            </div>

            {/* Title & Subtitle (Non-bold as instructed) */}
            <div className="mb-6 sm:mb-8 text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-white tracking-tight">
                Let’s make your{" "}
                <span className="font-normal bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] bg-clip-text text-transparent">
                  first thing
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-normal mt-1.5 sm:mt-2">
                What should we make first for {businessProfile.business_name || businessDetails.business_name || "SevenUnique Tech Solution"}?
              </p>
            </div>

            {/* 4 Cards Grid (2x2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {/* Card 1: Fashionist Studio - Redirects to existing Fashionist Studio Dashboard */}
              <div
                onClick={() => {
                  setFirstThingChoice("fashion_studio");
                  try {
                    sessionStorage.setItem("dhandagrow_photoshoot_active_tab", "avatar");
                    OnboardingService.saveFirstContentChoice("ai_photoshoot").catch(() => {});
                  } catch (_) {}
                  router.push("/ai-photoshoot/avatar");
                }}
                className={`relative rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer flex items-center gap-4 sm:gap-5 select-none ${
                  firstThingChoice === "fashion_studio"
                    ? "border-2 border-[#be32ff] bg-[#121933] shadow-[0_0_24px_rgba(190,50,255,0.25)] ring-1 ring-[#be32ff]/40"
                    : "border border-slate-800/80 bg-[#0e162b] hover:border-slate-700 hover:bg-[#111c36]"
                }`}
              >
                <div className="relative flex items-center shrink-0 w-24 sm:w-28 h-22 sm:h-24">
                  <div className="absolute left-0 w-14 sm:w-16 h-20 sm:h-22 rounded-xl overflow-hidden -rotate-6 shadow-lg border border-white/10 bg-slate-800">
                    <img
                      src="/images/fashion-photoshoot-hero.jpg"
                      alt="Fashion model"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute left-8 sm:left-9 w-14 sm:w-16 h-20 sm:h-22 rounded-xl overflow-hidden rotate-6 shadow-xl border border-white/10 bg-slate-800">
                    <img
                      src="/images/influencer-ootd-post.jpg"
                      alt="Fashion model 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-normal text-white">
                    Fashionist <span className="text-[#fc9a5d]">Studio</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1">
                    Models wearing your products.
                  </p>
                </div>
              </div>

              {/* Card 2: Product Studio - Redirects to existing Product Studio Dashboard */}
              <div
                onClick={() => {
                  setFirstThingChoice("product_studio");
                  try {
                    sessionStorage.setItem("dhandagrow_photoshoot_active_tab", "product");
                    OnboardingService.saveFirstContentChoice("ai_photoshoot").catch(() => {});
                  } catch (_) {}
                  router.push("/ai-photoshoot/product");
                }}
                className={`relative rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer flex items-center gap-4 sm:gap-5 select-none ${
                  firstThingChoice === "product_studio"
                    ? "border-2 border-[#be32ff] bg-[#121933] shadow-[0_0_24px_rgba(190,50,255,0.25)] ring-1 ring-[#be32ff]/40"
                    : "border border-slate-800/80 bg-[#0e162b] hover:border-slate-700 hover:bg-[#111c36]"
                }`}
              >
                <div className="relative flex items-center shrink-0 w-24 sm:w-28 h-22 sm:h-24">
                  <div className="absolute left-0 w-14 sm:w-16 h-20 sm:h-22 rounded-xl overflow-hidden -rotate-6 shadow-lg border border-white/10 bg-slate-800">
                    <img
                      src="/images/product-saffron-serum.jpg"
                      alt="Product bottle"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute left-8 sm:left-9 w-14 sm:w-16 h-20 sm:h-22 rounded-xl overflow-hidden rotate-6 shadow-xl border border-white/10 bg-slate-800">
                    <img
                      src="/images/product-kundan-necklace.jpg"
                      alt="Product jewelry"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-normal text-white">
                    Product <span className="text-[#f0449b]">Studio</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1">
                    Studio - grade, no studio.
                  </p>
                </div>
              </div>

              {/* Card 3: Post Maker - Existing functionality preserved */}
              <div
                onClick={() => setFirstThingChoice("post_maker")}
                className={`relative rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer flex items-center gap-4 sm:gap-5 select-none ${
                  firstThingChoice === "post_maker"
                    ? "border-2 border-[#be32ff] bg-[#121933] shadow-[0_0_24px_rgba(190,50,255,0.25)] ring-1 ring-[#be32ff]/40"
                    : "border border-slate-800/80 bg-[#0e162b] hover:border-slate-700 hover:bg-[#111c36]"
                }`}
              >
                <div className="relative flex items-center shrink-0 w-24 sm:w-28 h-22 sm:h-24">
                  <div className="absolute left-0 w-14 sm:w-16 h-20 sm:h-22 rounded-xl overflow-hidden -rotate-6 shadow-lg border border-white/10 bg-slate-800">
                    <img
                      src="/images/ai-poster-mockup.jpg"
                      alt="Burger poster"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute left-8 sm:left-9 w-14 sm:w-16 h-20 sm:h-22 rounded-xl overflow-hidden rotate-6 shadow-xl border border-white/10 bg-slate-800">
                    <img
                      src="/images/diwali-festive-banner.jpg"
                      alt="Festive poster"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-normal text-white">
                    Post <span className="text-[#be32ff]">Maker</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1">
                    Ready for instagram and whatsapp
                  </p>
                </div>
              </div>

              {/* Card 4: Reel Maker - Coming Soon, cannot be selected */}
              <div
                className="relative rounded-2xl p-4 sm:p-5 border transition-all flex items-center gap-4 sm:gap-5 select-none opacity-60 cursor-not-allowed border-slate-800/80 bg-[#0e162b]"
                title="Reel Maker is Coming Soon"
              >
                <div className="absolute top-3 right-3 z-10">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-gradient-to-r from-[#be32ff]/20 to-[#f0449b]/20 text-purple-200 border border-purple-500/30 shadow-xs">
                    Coming Soon
                  </span>
                </div>
                <div className="relative flex items-center shrink-0 w-24 sm:w-28 h-22 sm:h-24 opacity-60">
                  <div className="absolute left-0 w-14 sm:w-16 h-20 sm:h-22 rounded-xl overflow-hidden -rotate-6 shadow-lg border border-white/10 bg-slate-800">
                    <img
                      src="/images/raw-selfie-woman.jpg"
                      alt="Reel selfie"
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                  <div className="absolute left-8 sm:left-9 w-14 sm:w-16 h-20 sm:h-22 rounded-xl overflow-hidden rotate-6 shadow-xl border border-white/10 bg-slate-800">
                    <img
                      src="/images/ai-reel-formats-showcase.jpg"
                      alt="Reel format"
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-normal text-slate-300">
                    Reel <span className="text-[#7d36fa]/80">Maker</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1">
                    Ready for instagram and youtube shorts.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Centered Continue Button with 4-Color Gradient */}
          <div className="pt-6 sm:pt-8 pb-2 flex flex-col items-center">
            <button
              type="button"
              onClick={handleFirstThingContinue}
              disabled={isSavingFirstThing}
              className="w-full max-w-sm h-12 rounded-full font-normal text-base text-white flex items-center justify-center gap-2 transition-all cursor-pointer bg-gradient-to-r from-[#7d36fa] via-[#be32ff] via-[#f0449b] to-[#fc9a5d] shadow-[0_8px_25px_rgba(190,50,255,0.25)] hover:opacity-95 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSavingFirstThing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 stroke-[2]" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {currentStepObj.id === "post_maker_pick" && (
        <div className="w-full max-w-4xl lg:max-w-5xl mx-auto pt-3 sm:pt-4 pb-2 flex flex-col justify-between animate-in fade-in duration-400 relative z-10 px-3 sm:px-6">
          {isGeneratingPosts ? (
            <>
              {/* ══════════════════════════════════════════════════════════════════════
                 STAGE 1: STUDYING YOUR PHOTO (Image 1)
              ══════════════════════════════════════════════════════════════════════ */}
              {generationStage === "studying" && (
                <div className="flex-1 flex flex-col justify-between py-6 sm:py-10 animate-in fade-in duration-300 w-full max-w-4xl mx-auto">
                  <div className="flex-1 flex flex-col items-center justify-center text-center my-auto">
                    <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-white/15 bg-[#0e162b] shadow-[0_0_50px_rgba(0,0,0,0.6)] flex items-center justify-center p-3 relative overflow-hidden">
                      <img
                        src={businessProfile.business_logo || "/logo.png"}
                        alt="Brand Logo"
                        className="w-full h-full object-contain rounded-full"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/images/dhandagrow-brand-icon.png";
                        }}
                      />
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-white tracking-tight mt-6 sm:mt-8">
                      Studying your photo
                    </h2>

                    <div className="flex items-center gap-3 mt-4">
                      <div className="px-5 py-1.5 rounded-full bg-[#1c1436] border border-[#7d36fa]/30 text-[#c084fc] text-xs sm:text-sm font-normal">
                        {businessProfile.business_category || businessDetails.category || "Testing electronics"}
                      </div>
                      <div className="px-5 py-1.5 rounded-full bg-[#1c1436] border border-[#7d36fa]/30 text-[#c084fc] text-xs sm:text-sm font-normal">
                        Your photos
                      </div>
                    </div>
                  </div>

                  <div className="w-full max-w-4xl mx-auto mt-auto pt-8">
                    <div className="w-full h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(240,68,155,0.4)]"
                        style={{ width: `${generationProgress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      <span className="text-xs sm:text-sm text-slate-400 font-normal">
                        {generationStatusText || "Setting your mood"}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-400 font-normal text-center mt-6">
                      Posting daily on instagram just got easy.
                    </p>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════════════════
                 STAGE 2: YOU JUST TOOK THE FIRST STEP (Image 2)
              ══════════════════════════════════════════════════════════════════════ */}
              {generationStage === "first_step" && (
                <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-10 animate-in fade-in zoom-in-95 duration-400 max-w-2xl mx-auto">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-normal text-white tracking-tight">
                    You just took the first step.
                  </h2>

                  <div className="flex items-center justify-center gap-2 mt-4 text-[#be32ff]">
                    <RotateCw className="w-4 h-4 animate-spin text-[#be32ff]" />
                    <span className="text-sm sm:text-base font-normal">Ads generating</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 font-normal mt-4 leading-relaxed max-w-lg mx-auto">
                    {businessProfile.business_name || businessDetails.business_name || "SevenUnique Tech Solution"} is already one step ahead, while 93% of {(businessProfile.business_category || businessDetails.category || "tech and electronics").toLowerCase()} businesses are yet to explore AI.
                  </p>

                  <p className="text-xs sm:text-sm text-[#be32ff] font-normal mt-12 sm:mt-16">
                    3 posts on the way. Ready for Instagram in under a minute.
                  </p>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════════════════
                 STAGE 3: YOUR DAILY POSTS ARE BEING MADE (Image 3)
              ══════════════════════════════════════════════════════════════════════ */}
              {generationStage === "daily_posts" && (
                <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-10 animate-in fade-in zoom-in-95 duration-400 max-w-2xl mx-auto">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-normal text-white tracking-tight">
                    Your daily posts are being made.
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 font-normal mt-3 leading-relaxed max-w-lg mx-auto">
                    While we finish setting things up, explore our Growth and Pro plans for daily posts, festive content, and ad creatives tailored to your brand voice.
                  </p>

                  {/* Button with exact Image 5 color gradient */}
                  <div className="mt-8 sm:mt-10 w-full max-w-md mx-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setIsGeneratingPosts(false);
                        const readyIdx = activeSteps.findIndex((s) => s.id === "post_maker_ready");
                        const target = readyIdx !== -1 ? readyIdx : currentStep + 1;
                        setCurrentStep(target);
                        if (typeof window !== "undefined") {
                          sessionStorage.setItem("onboarding_step", String(target));
                        }
                      }}
                      className="w-full h-14 rounded-full font-normal text-white flex items-center justify-center gap-3 transition-all cursor-pointer bg-gradient-to-r from-[#7d36fa] via-[#be32ff] via-[#f0449b] to-[#fc9a5d] shadow-[0_8px_30px_rgba(190,50,255,0.35)] hover:opacity-95 active:scale-[0.98] px-6"
                    >
                      <Lock className="w-5 h-5 text-white shrink-0" />
                      <div className="flex flex-col items-start text-left">
                        <span className="text-sm font-medium leading-tight">Your Previews are ready</span>
                        <span className="text-[11px] text-white/80 leading-tight">Upgrade to unlock</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* ══════════════════════════════════════════════════════════════════════
               PICK A PHOTO PER POST SCREEN
            ══════════════════════════════════════════════════════════════════════ */
            <>
              <div>
                <div className="flex items-center gap-3 sm:gap-4 w-full mb-2 sm:mb-3">
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
                      className="h-full bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] via-[#be32ff] to-[#7d36fa] rounded-full transition-all duration-500"
                      style={{ width: "85%" }}
                    />
                  </div>
                </div>

                <div className="mb-2.5 sm:mb-3.5 text-left">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-white tracking-tight">
                    Pick a{" "}
                    <span className="font-normal bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] bg-clip-text text-transparent">
                      photo
                    </span>{" "}
                    per post
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 font-normal mt-1.5 sm:mt-2">
                    We&apos;ll turn your 3 photos into a promo post, a festival post, and an ad post
                  </p>
                </div>

                <div className="space-y-2 sm:space-y-2.5 max-w-4xl mx-auto w-full">
                  <div className="rounded-2xl border border-slate-800/80 bg-[#0e162b] hover:border-slate-700 hover:bg-[#111c36] p-2.5 sm:p-3 flex items-center justify-between gap-4 transition-all">
                    <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                      <img
                        src={promoPhoto || getAvailablePhotos()[0] || DEFAULT_BUSINESS_PHOTOS[0]}
                        alt="Promo post"
                        className="w-14 h-16 sm:w-16 sm:h-18 rounded-xl object-cover bg-slate-800 border border-white/10 shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="font-normal text-white text-base sm:text-lg">Your promo post</h3>
                        <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1">Show off your offer or latest arrival.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActivePhotoChangeTarget("promo");
                        setIsPhotoPickerOpen(true);
                      }}
                      className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#7d36fa] hover:bg-[#6c28ea] text-white text-xs sm:text-sm font-normal cursor-pointer transition-all shrink-0 active:scale-95 shadow-md shadow-[#7d36fa]/20"
                    >
                      Change Photo
                    </button>
                  </div>

                  <div className="rounded-2xl border border-slate-800/80 bg-[#0e162b] hover:border-slate-700 hover:bg-[#111c36] p-2.5 sm:p-3 flex items-center justify-between gap-4 transition-all">
                    <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                      <img
                        src={festivalPhoto || getAvailablePhotos()[1] || DEFAULT_BUSINESS_PHOTOS[1]}
                        alt="Promo post 2"
                        className="w-14 h-16 sm:w-16 sm:h-18 rounded-xl object-cover bg-slate-800 border border-white/10 shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="font-normal text-white text-base sm:text-lg">Your promo post</h3>
                        <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1">Show off your offer or latest arrival.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActivePhotoChangeTarget("festival");
                        setIsPhotoPickerOpen(true);
                      }}
                      className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#7d36fa] hover:bg-[#6c28ea] text-white text-xs sm:text-sm font-normal cursor-pointer transition-all shrink-0 active:scale-95 shadow-md shadow-[#7d36fa]/20"
                    >
                      Change Photo
                    </button>
                  </div>

                  <div className="rounded-2xl border border-slate-800/80 bg-[#0e162b] hover:border-slate-700 hover:bg-[#111c36] p-2.5 sm:p-3 flex items-center justify-between gap-4 transition-all">
                    <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                      <img
                        src={adPhoto || getAvailablePhotos()[2] || DEFAULT_BUSINESS_PHOTOS[2]}
                        alt="Promo post 3"
                        className="w-14 h-16 sm:w-16 sm:h-18 rounded-xl object-cover bg-slate-800 border border-white/10 shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="font-normal text-white text-base sm:text-lg">Your promo post</h3>
                        <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1">Show off your offer or latest arrival.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActivePhotoChangeTarget("ad");
                        setIsPhotoPickerOpen(true);
                      }}
                      className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#7d36fa] hover:bg-[#6c28ea] text-white text-xs sm:text-sm font-normal cursor-pointer transition-all shrink-0 active:scale-95 shadow-md shadow-[#7d36fa]/20"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3 sm:pt-4 pb-1 flex flex-col items-center">
                <button
                  type="button"
                  onClick={handleGeneratePosts}
                  className="w-full max-w-sm sm:max-w-md h-10 sm:h-11 rounded-full font-semibold text-sm sm:text-base text-white flex items-center justify-center gap-2 transition-all cursor-pointer bg-gradient-to-r from-[#7d36fa] via-[#be32ff] via-[#f0449b] to-[#fc9a5d] shadow-lg shadow-[#be32ff]/25 hover:opacity-95 active:scale-[0.98]" style={{ background: "linear-gradient(90deg, #7d36fa 0%, #be32ff 33%, #f0449b 67%, #fc9a5d 100%)" }}
                >
                  <span>Create Posts</span>
                  <ArrowRight className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STAGE 4: 3 POSTS ARE READY (Image 4 Reference)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStepObj.id === "post_maker_ready" && (
        <div className="w-full max-w-3xl mx-auto my-auto py-6 sm:py-10 flex flex-col justify-between min-h-[580px] sm:min-h-[660px] animate-in fade-in duration-400 relative z-10 px-4 sm:px-6">
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            {/* Title & Subtitle */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-white tracking-tight leading-tight">
              {businessProfile.business_name || businessDetails.business_name || "SevenUnique Tech Solution"}’s<br />
              3 posts are ready
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-normal mt-2.5">
              Unlock to download and start posting - captions and hashtags included
            </p>

            {/* Category Pill */}
            <div className="my-5">
              <span className="px-5 py-1.5 rounded-full bg-[#1c1436] border border-[#7d36fa]/30 text-[#c084fc] text-xs sm:text-sm font-normal">
                {businessProfile.business_category || businessDetails.category || "Testing electronics"}
              </span>
            </div>

            {/* 3 Post Cards (1 Blurred with Edit Button, 2 Locked - Image 4) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 w-full max-w-2xl mx-auto my-4">
              {/* Card 1: Blurred Post Preview with Edit Button (redirects to /ai-post) */}
              <div
                className="relative rounded-2xl overflow-hidden aspect-square border-2 border-sky-400/60 bg-slate-900 shadow-[0_0_25px_rgba(56,189,248,0.3)] transition-all group"
              >
                {/* 1st image kept blurred as requested */}
                <img
                  src={promoPhoto || getAvailablePhotos()[0] || DEFAULT_BUSINESS_PHOTOS[3] || "/images/ai-poster-mockup.jpg"}
                  alt="Ready post preview"
                  className="w-full h-full object-cover filter blur-md scale-110 pointer-events-none select-none"
                />

                {/* Lock overlay on the blurred preview */}
                <div
                  onClick={() => setShowPlansModal(true)}
                  className="absolute inset-0 bg-black/40 backdrop-blur-[1px] cursor-pointer flex flex-col items-center justify-center p-4 text-white text-center transition-all hover:bg-black/30"
                >
                  <Lock className="w-6 h-6 text-white mb-2 stroke-[2.2] drop-shadow-md" />
                  <span className="text-sm sm:text-base font-normal drop-shadow">Promo post</span>
                </div>

                {/* Edit Button on the image - redirects to create post in dashboard */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/ai-post");
                  }}
                  className="absolute top-2.5 right-2.5 z-20 px-3 py-1.5 rounded-full bg-black/75 hover:bg-[#be32ff] border border-white/25 hover:border-white/40 text-white text-xs font-medium flex items-center gap-1.5 backdrop-blur-md shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  title="Edit post in Dashboard"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              {/* Card 2: Locked Festive Post (Pink) */}
              <div
                onClick={() => setShowPlansModal(true)}
                className="rounded-2xl aspect-square bg-[#f0449b] shadow-[0_0_25px_rgba(240,68,155,0.3)] flex flex-col items-center justify-center p-4 text-white text-center transition-all cursor-pointer hover:scale-[1.02]"
              >
                <Lock className="w-6 h-6 text-white mb-2 stroke-[2.2]" />
                <span className="text-sm sm:text-base font-normal">Festive post</span>
              </div>

              {/* Card 3: Locked Ad Post (Purple) */}
              <div
                onClick={() => setShowPlansModal(true)}
                className="rounded-2xl aspect-square bg-[#be32ff] shadow-[0_0_25px_rgba(190,50,255,0.3)] flex flex-col items-center justify-center p-4 text-white text-center transition-all cursor-pointer hover:scale-[1.02]"
              >
                <Lock className="w-6 h-6 text-white mb-2 stroke-[2.2]" />
                <span className="text-sm sm:text-base font-normal">Ad post</span>
              </div>
            </div>

            {/* Note below cards */}
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#c084fc] font-normal mt-4">
              <Sparkles className="w-4 h-4 text-[#c084fc]" />
              <span>Captions & hashtags ready to copy</span>
            </div>
          </div>

          {/* Bottom CTA Button with Image 5 Gradient */}
          <div className="pt-6 sm:pt-8 pb-4 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setShowPlansModal(true)}
              className="w-full max-w-sm h-12 rounded-full font-normal text-base text-white flex items-center justify-center gap-2 transition-all cursor-pointer bg-gradient-to-r from-[#7d36fa] via-[#be32ff] via-[#f0449b] to-[#fc9a5d] shadow-[0_8px_25px_rgba(190,50,255,0.25)] hover:opacity-95 active:scale-[0.98]"
            >
              <span>Upgrade to see your output</span>
              <ArrowRight className="w-4 h-4 stroke-[2]" />
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
                            className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${isSelected
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
                            className={`p-3 rounded-xl border text-center text-xs font-medium cursor-pointer transition-all ${isSelected
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
                              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${isSelected
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
                  className={`h-11 px-4 rounded-xl border-white/10 bg-[#0f1015] text-neutral-300 hover:text-white hover:bg-white/5 text-xs font-semibold ${currentStep === 0 ? "opacity-0 pointer-events-none" : ""
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

      {/* Footer (hidden on single-screen steps to ensure zero vertical scroll and zero scrollbars) */}
      {!["get_started", "none_details", "none_brand_kit", "maps_details", "business_details", "business_details_2", "brand_preferences", "brand_services", "presence", "maps_website", "website_connect"].includes(currentStepObj.id) && (
        <footer className="w-full max-w-4xl mx-auto py-1 text-center text-[11px] text-neutral-500 shrink-0 z-10 relative select-none">
          &copy; {new Date().getFullYear()} DhandaGrow AI. Tailored for Indian enterprises and creators.
        </footer>
      )}
    </div>
  );
}
