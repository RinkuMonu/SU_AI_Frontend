"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Mic,
  Send,
  Globe,
  Layout,
  Palette,
  Phone,
  MapPin,
  Store,
  ChevronRight,
  Settings,
  CheckCircle2,
  RotateCcw,
  Clock,
  ArrowRight,
  Plus,
  Trash2,
  Maximize2,
  Minimize2,
  Download,
  Zap,
  FileText,
  ExternalLink,
  Sparkles,
  Lock,
  ChevronDown,
  Check,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  MessageSquare,
  X,
  Type
} from "lucide-react";
import {
  websiteBuilderService,
  ChatMessage,
  GeneratedSiteData,
  WebsiteSection,
  WebsiteSectionItem
} from "@/services/website-builder.service";

/* -------------------------------------------------------------------------- */
/*                               TYPE DEFINITIONS                             */
/* -------------------------------------------------------------------------- */

export type OnboardingStep =
  | "step1_category_products"
  | "step2_business_name"
  | "step3_design_preference"
  | "step4_template_selection"
  | "step5_industry_questions"
  | "step5_logo_check"
  | "step6_confirmation"
  | "step7_generated";

export interface BusinessContext {
  businessCategory?: string;
  productsServices?: string;
  businessName?: string;
  designPreference?: "recommend" | "direct";
  selectedTemplateId?: string;
  selectedTemplateName?: string;
  industryDetails?: string;
  logo?: string;
  logoStatus?: "uploaded" | "generated" | "available";
  brandColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  location?: string;
  phone?: string;
  email?: string;
  onboardingStep: OnboardingStep;
}

interface VersionItem {
  version: number;
  label: string;
  timestamp: string;
  data: GeneratedSiteData;
}

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  tag: string;
}

/* -------------------------------------------------------------------------- */
/*                     INDUSTRY TEMPLATES CATALOG (STEP 4)                    */
/* -------------------------------------------------------------------------- */

const INDUSTRY_TEMPLATES: Record<string, TemplateOption[]> = {
  flower: [
    {
      id: "floral-elegance",
      name: "Floral Elegance",
      description: "Modern luxury floral studio with pastel tones and boutique bouquet showcases.",
      primaryColor: "#E11D48",
      tag: "Boutique & Luxury"
    },
    {
      id: "bloom-blossom",
      name: "Bloom & Blossom",
      description: "Vibrant artisan catalog with seasonal flower collections & local delivery options.",
      primaryColor: "#D946EF",
      tag: "Catalog & Delivery"
    },
    {
      id: "botanical-garden",
      name: "Botanical Garden",
      description: "Organic, nature-first layout highlighting lush green plants, potted flowers, and plant care.",
      primaryColor: "#059669",
      tag: "Eco & Plants"
    }
  ],
  gym: [
    {
      id: "iron-forge-fitness",
      name: "Iron Forge Fitness",
      description: "High-intensity athletic aesthetic with bold typography, workout schedules, and trainer profiles.",
      primaryColor: "#DC2626",
      tag: "Strength & Athletic"
    },
    {
      id: "pulse-athletics",
      name: "Pulse Athletics",
      description: "Sleek modern fitness studio with membership plans, group classes, and free pass booking.",
      primaryColor: "#2563EB",
      tag: "Studio & Classes"
    },
    {
      id: "zenith-wellness",
      name: "Zenith Wellness & Gym",
      description: "Holistic health & body conditioning with facility tours, nutrition coaching, and modern amenities.",
      primaryColor: "#0D9488",
      tag: "Wellness & Cardio"
    }
  ],
  restaurant: [
    {
      id: "artisan-bistro",
      name: "Artisan Bistro",
      description: "Warm, ambient culinary layout with categorized digital menu and chef's specials.",
      primaryColor: "#D97706",
      tag: "Fine Dining"
    },
    {
      id: "urban-gourmet",
      name: "Urban Gourmet",
      description: "Chic contemporary restaurant with photo-rich dish cards, online orders, and table bookings.",
      primaryColor: "#B91C1C",
      tag: "Chic & Modern"
    },
    {
      id: "rustic-table",
      name: "Rustic Table",
      description: "Cozy farm-to-table dining aesthetic highlighting fresh seasonal ingredients and hospitality.",
      primaryColor: "#4D7C0F",
      tag: "Farm to Table"
    }
  ],
  clothing: [
    {
      id: "haute-minimalist",
      name: "Haute Minimalist",
      description: "High-fashion lookbook aesthetic with lookbook grids, seasonal drop banners, and clean styling.",
      primaryColor: "#18181B",
      tag: "Editorial & Chic"
    },
    {
      id: "urban-threads",
      name: "Urban Threads",
      description: "Contemporary streetwear and casual clothing storefront with product filters and trending badges.",
      primaryColor: "#4F46E5",
      tag: "Streetwear"
    },
    {
      id: "velvet-silk",
      name: "Velvet & Silk",
      description: "Luxury boutique showcasing elegant eveningwear, accessories, and bespoke tailoring.",
      primaryColor: "#7C3AED",
      tag: "Luxury Boutique"
    }
  ],
  default: [
    {
      id: "pro-modern",
      name: "Apex Modern Pro",
      description: "Clean, responsive business architecture with hero banner, service pillars, and inquiry form.",
      primaryColor: "#4F46E5",
      tag: "Recommended"
    },
    {
      id: "creative-showcase",
      name: "Creative Vanguard",
      description: "Bold visual layouts, vibrant gradients, and feature highlights tailored for modern businesses.",
      primaryColor: "#7C3AED",
      tag: "Dynamic"
    },
    {
      id: "clean-corporate",
      name: "Horizon Minimal",
      description: "Sophisticated corporate styling prioritizing trust, clear value propositions, and easy contact.",
      primaryColor: "#0284C7",
      tag: "Minimalist"
    }
  ]
};

const getTemplatesForCategory = (category?: string): TemplateOption[] => {
  if (!category) return INDUSTRY_TEMPLATES.default;
  const c = category.toLowerCase();
  if (c.includes("flower") || c.includes("florist") || c.includes("bouquet") || c.includes("plant")) {
    return INDUSTRY_TEMPLATES.flower;
  }
  if (c.includes("gym") || c.includes("fitness") || c.includes("workout") || c.includes("crossfit") || c.includes("trainer")) {
    return INDUSTRY_TEMPLATES.gym;
  }
  if (c.includes("restaurant") || c.includes("cafe") || c.includes("food") || c.includes("bistro") || c.includes("bakery") || c.includes("pizza") || c.includes("dining")) {
    return INDUSTRY_TEMPLATES.restaurant;
  }
  if (c.includes("cloth") || c.includes("boutique") || c.includes("fashion") || c.includes("apparel") || c.includes("dress")) {
    return INDUSTRY_TEMPLATES.clothing;
  }
  return INDUSTRY_TEMPLATES.default;
};

/* -------------------------------------------------------------------------- */
/*                     INDUSTRY QUESTIONS MAPPING (STEP 5)                    */
/* -------------------------------------------------------------------------- */

const getIndustrySpecificQuestion = (category?: string, name?: string): string => {
  const c = (category || "").toLowerCase();
  const b = name || "your business";

  if (c.includes("flower") || c.includes("florist")) {
    return `For ${b}, do you provide same-day local delivery or event decoration (like weddings and parties), and what are your most popular flower arrangements?`;
  }
  if (c.includes("gym") || c.includes("fitness")) {
    return `For ${b}, what types of memberships or training programs do you offer (e.g. monthly pass, personal training, group HIIT/yoga), and what are your operating hours?`;
  }
  if (c.includes("restaurant") || c.includes("cafe") || c.includes("dining")) {
    return `For ${b}, do you accept online table reservations or takeout orders, and what are 2 or 3 of your signature dishes or chef specialties?`;
  }
  if (c.includes("cloth") || c.includes("boutique") || c.includes("fashion")) {
    return `For ${b}, what collections or clothing categories do you feature (e.g. women's wear, seasonal arrivals, custom tailoring), and do you offer nationwide shipping?`;
  }
  return `For ${b}, what key features, service packages, or unique selling points would you like to prominently display on your website?`;
};

/* -------------------------------------------------------------------------- */
/*                     IMAGE PROMPTS & RELEVANCY MAP (CRITICAL)               */
/* -------------------------------------------------------------------------- */

const getCategorySafeImageQuery = (
  category: string,
  sectionType: string,
  itemTitle?: string,
  businessName?: string
): string => {
  const c = category.toLowerCase();
  const cleanItem = (itemTitle || "").replace(/[^a-zA-Z0-9\s]/g, "").trim();

  // 1. FLOWER SHOP
  if (c.includes("flower") || c.includes("florist") || c.includes("bouquet")) {
    if (sectionType === "hero") {
      return "fresh colorful flower bouquet artisan floral arrangement florist boutique daylight";
    }
    if (sectionType === "products" || sectionType === "bouquets") {
      return cleanItem
        ? `fresh ${cleanItem} flower arrangement handcrafted bouquet florist quality`
        : "fresh romantic red roses luxury pink tulips pastel flower bouquet floral";
    }
    if (sectionType === "gallery") {
      return "blooming vibrant flowers botanical garden floristry workshop bouquets";
    }
    return "artisan florist studio fresh flowers flower shop storefront blooms";
  }

  // 2. GYM / FITNESS
  if (c.includes("gym") || c.includes("fitness") || c.includes("workout") || c.includes("crossfit")) {
    if (sectionType === "hero") {
      return "modern athletic gym training area heavy dumbbells fitness equipment motivation workout";
    }
    if (sectionType === "programs" || sectionType === "products" || sectionType === "classes") {
      return cleanItem
        ? `intense ${cleanItem} workout session modern gym equipment fitness training`
        : "crossfit barbell workout personal fitness training gym kettlebells";
    }
    if (sectionType === "gallery" || sectionType === "facilities") {
      return "state of the art fitness center modern gym interior weights training facility";
    }
    return "dedicated fitness training coach in modern athletic gym facility";
  }

  // 3. RESTAURANT / CAFE
  if (c.includes("restaurant") || c.includes("cafe") || c.includes("food") || c.includes("bistro")) {
    if (sectionType === "hero") {
      return "exquisite gourmet restaurant cuisine plating warm ambient dining room table setting";
    }
    if (sectionType === "menu" || sectionType === "products" || sectionType === "dishes") {
      return cleanItem
        ? `delicious fresh culinary ${cleanItem} gourmet dish restaurant plating appetizing`
        : "artisan pasta stone baked pizza gourmet entree fresh herbs restaurant dish";
    }
    if (sectionType === "gallery" || sectionType === "atmosphere") {
      return "charming restaurant dining room ambient candlelit evening tables hospitality";
    }
    return "executive chef preparing fine dining meal in restaurant kitchen";
  }

  // 4. CLOTHING / BOUTIQUE
  if (c.includes("cloth") || c.includes("boutique") || c.includes("fashion") || c.includes("apparel")) {
    if (sectionType === "hero") {
      return "elegant fashion boutique interior stylish clothing racks chic apparel display daylight";
    }
    if (sectionType === "products" || sectionType === "collections") {
      return cleanItem
        ? `stylish ${cleanItem} designer apparel contemporary boutique fashion clothing`
        : "designer dress luxury silk fabric modern fashion clothing collection";
    }
    return "trendy boutique clothing store contemporary fashion design";
  }

  // 5. SERVERS / CLOUD HOSTING / IT
  if (c.includes("server") || c.includes("cloud") || c.includes("host") || c.includes("datacenter") || c.includes("data center") || c.includes("vps")) {
    if (sectionType === "hero") {
      return "high tech modern data center server racks glowing blue LED fiber optic enterprise infrastructure";
    }
    if (sectionType === "services" || sectionType === "products") {
      return cleanItem
        ? `enterprise ${cleanItem} cloud infrastructure server racks hardware high tech`
        : "dedicated bare metal server racks high speed cloud computing data center";
    }
    if (sectionType === "gallery") {
      return "secure tier 4 data center enterprise network server room blue LED";
    }
    return "cloud enterprise server infrastructure network engineer data center";
  }

  // 6. DEFAULT / OTHER
  return `${businessName || "business"} ${category} ${cleanItem || sectionType} professional storefront`;
};

const resolveImageUrl = (
  explicitUrl: string | undefined,
  category: string,
  sectionType: string,
  itemTitle?: string,
  businessName?: string,
  width = 800,
  height = 600
): string => {
  if (explicitUrl && typeof explicitUrl === "string" && explicitUrl.trim() !== "") {
    if (
      !explicitUrl.includes("photo-1551434678-e076c223a692") &&
      !explicitUrl.includes("source.unsplash.com")
    ) {
      return explicitUrl.trim();
    }
  }

  const query = getCategorySafeImageQuery(category, sectionType, itemTitle, businessName);
  const encoded = encodeURIComponent(query);
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&nologo=true`;
};

/* -------------------------------------------------------------------------- */
/*                     DYNAMIC VECTOR SVG LOGO GENERATOR                      */
/* -------------------------------------------------------------------------- */

const generateDynamicSvgLogo = (
  businessName: string,
  category: string = "",
  primaryColor: string = "#4F46E5"
): string => {
  const cleanName = (businessName || "Business").trim();
  const words = cleanName.split(/\s+/);
  const initials = words.length > 1 ? (words[0][0] + words[1][0]).toUpperCase() : cleanName.slice(0, 2).toUpperCase() || "B";
  const color = primaryColor && primaryColor.startsWith("#") ? primaryColor : "#4F46E5";
  const c = (category || "").toLowerCase();

  let iconSvg = "";
  if (c.includes("medical") || c.includes("clinic") || c.includes("pharmacy") || c.includes("chemist") || c.includes("doctor") || c.includes("dawai")) {
    iconSvg = `<circle cx="50" cy="50" r="46" fill="${color}" /><circle cx="50" cy="50" r="41" fill="none" stroke="#ffffff" stroke-width="2.5" opacity="0.4" /><path d="M42 26 H58 V42 H74 V58 H58 V74 H42 V58 H26 V42 H42 Z" fill="#ffffff" /><circle cx="50" cy="50" r="6" fill="${color}" />`;
  } else if (c.includes("gym") || c.includes("fitness") || c.includes("workout") || c.includes("yoga")) {
    iconSvg = `<rect width="100" height="100" rx="24" fill="${color}" /><rect x="20" y="44" width="60" height="12" rx="6" fill="#ffffff" /><rect x="14" y="32" width="12" height="36" rx="5" fill="#ffffff" /><rect x="74" y="32" width="12" height="36" rx="5" fill="#ffffff" /><rect x="26" y="37" width="6" height="26" rx="3" fill="#ffffff" opacity="0.85" /><rect x="68" y="37" width="6" height="26" rx="3" fill="#ffffff" opacity="0.85" />`;
  } else if (c.includes("flower") || c.includes("florist") || c.includes("floral") || c.includes("bloom")) {
    iconSvg = `<circle cx="50" cy="50" r="46" fill="${color}" /><circle cx="50" cy="34" r="14" fill="#ffffff" opacity="0.9" /><circle cx="66" cy="50" r="14" fill="#ffffff" opacity="0.9" /><circle cx="50" cy="66" r="14" fill="#ffffff" opacity="0.9" /><circle cx="34" cy="50" r="14" fill="#ffffff" opacity="0.9" /><circle cx="50" cy="50" r="11" fill="#FBBF24" />`;
  } else if (c.includes("sweet") || c.includes("mithai") || c.includes("bakery") || c.includes("cafe") || c.includes("dessert")) {
    iconSvg = `<rect width="100" height="100" rx="24" fill="${color}" /><path d="M30 40 Q50 20 70 40 Q80 60 70 75 Q50 85 30 75 Q20 60 30 40 Z" fill="#ffffff" opacity="0.95" /><circle cx="50" cy="30" r="6" fill="#EF4444" /><text x="50" y="66" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="${color}" text-anchor="middle">${initials}</text>`;
  } else if (c.includes("stationery") || c.includes("book") || c.includes("pen")) {
    iconSvg = `<rect width="100" height="100" rx="24" fill="${color}" /><path d="M22 32 Q50 26 50 72 Q50 26 78 32 V74 Q50 68 50 74 Q50 68 22 74 Z" fill="#ffffff" /><line x1="50" y1="30" x2="50" y2="72" stroke="${color}" stroke-width="3" />`;
  } else if (c.includes("server") || c.includes("cloud") || c.includes("host") || c.includes("vps") || c.includes("datacenter") || c.includes("data center")) {
    iconSvg = `<rect width="100" height="100" rx="24" fill="${color}" /><rect x="22" y="24" width="56" height="14" rx="4" fill="#ffffff" /><circle cx="30" cy="31" r="2.5" fill="${color}" /><circle cx="38" cy="31" r="2.5" fill="${color}" /><rect x="22" y="43" width="56" height="14" rx="4" fill="#ffffff" /><circle cx="30" cy="50" r="2.5" fill="${color}" /><circle cx="38" cy="50" r="2.5" fill="${color}" /><rect x="22" y="62" width="56" height="14" rx="4" fill="#ffffff" /><circle cx="30" cy="69" r="2.5" fill="${color}" /><circle cx="38" cy="69" r="2.5" fill="${color}" />`;
  } else if (c.includes("farm") || c.includes("resort") || c.includes("nature") || c.includes("villa")) {
    iconSvg = `<rect width="100" height="100" rx="24" fill="${color}" /><circle cx="70" cy="30" r="12" fill="#FBBF24" /><path d="M30 75 L50 35 L70 75 Z" fill="#ffffff" opacity="0.9" /><rect x="47" y="65" width="6" height="15" fill="#ffffff" />`;
  } else {
    iconSvg = `<rect width="100" height="100" rx="24" fill="${color}" /><circle cx="50" cy="50" r="38" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.4" /><text x="50" y="61" font-family="Arial, sans-serif" font-size="30" font-weight="bold" fill="#ffffff" text-anchor="middle">${initials}</text>`;
  }

  const rawSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">${iconSvg}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(rawSvg)}`;
};

/* -------------------------------------------------------------------------- */
/*                     CATEGORY CONFLICT DETECTOR (REQ 5)                     */
/* -------------------------------------------------------------------------- */

const checkCategoryConflict = (
  instruction: string,
  category: string
): { hasConflict: boolean; reason?: string } => {
  const lowerInst = instruction.toLowerCase();
  const c = category.toLowerCase();

  const isFloral = c.includes("flower") || c.includes("florist");
  const isGym = c.includes("gym") || c.includes("fitness");
  const isRestaurant = c.includes("restaurant") || c.includes("food") || c.includes("cafe");

  if (isFloral) {
    if (
      lowerInst.includes("sports car") ||
      lowerInst.includes("automobile") ||
      lowerInst.includes("crypto") ||
      lowerInst.includes("car repair") ||
      lowerInst.includes("smartphone repair")
    ) {
      return {
        hasConflict: true,
        reason: "Your website is for a Flower Shop. Adding vehicles or electronics conflicts with your floral business."
      };
    }
  }

  if (isGym) {
    if (
      lowerInst.includes("fast food") ||
      lowerInst.includes("flower bouquet") ||
      lowerInst.includes("wedding florist")
    ) {
      return {
        hasConflict: true,
        reason: "Your website is for a Gym & Fitness Center. This content conflicts with your fitness brand."
      };
    }
  }

  if (isRestaurant) {
    if (
      lowerInst.includes("car repair") ||
      lowerInst.includes("gym equipment") ||
      lowerInst.includes("weightlifting")
    ) {
      return {
        hasConflict: true,
        reason: "Your website is for a Restaurant/Dining establishment. This content conflicts with your culinary theme."
      };
    }
  }

  return { hasConflict: false };
};

/* -------------------------------------------------------------------------- */
/*                       HTML BUILDER & RENDERER ENGINE                       */
/* -------------------------------------------------------------------------- */

const escapeHtml = (unsafe?: string): string => {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const generateHtmlFromJSON = (rawData: any): string => {
  if (!rawData) return "";

  let data = rawData;
  if (typeof rawData === "string") {
    try {
      data = JSON.parse(rawData);
    } catch {
      return rawData;
    }
  }

  if (data.html && typeof data.html === "string") return data.html;

  const pages = Array.isArray(data) ? data : data.pages ? data.pages : [data];
  if (!pages || pages.length === 0) {
    return "<h1 style='padding:2rem;text-align:center;'>No website draft available yet</h1>";
  }

  const bName = escapeHtml(data.business_name || "My Business");
  const bCategory = data.business_category || "Business";
  const theme = data.theme || {};
  const primaryColor = theme.primary || theme.primary_color || "#4F46E5";
  const secondaryColor = theme.secondary || theme.secondary_color || "#4338CA";
  const accentColor = theme.accent || theme.accent_color || "#EC4899";
  const fontFamily = theme.font || theme.font_family || "Outfit";
  const buttonColor = theme.button_color || theme.buttonColor || primaryColor;
  const buttonTextColor = theme.button_text_color || theme.buttonTextColor || "#ffffff";
  const buttonHoverColor = theme.button_hover || theme.buttonHoverColor || secondaryColor;
  const buttonRadius = theme.button_radius || theme.buttonRadius || "0.75rem";

  // Gather all available sections across all incoming pages
  const allIncomingSections: WebsiteSection[] = [];
  pages.forEach((p: any) => {
    if (Array.isArray(p.sections)) {
      allIncomingSections.push(...p.sections);
    }
  });

  const navbarSection = allIncomingSections.find((s: any) => s.type === "navbar");
  const rawLogo = (typeof data.logo === "string" && data.logo) ? data.logo : data.logo?.url || navbarSection?.logo || null;
  const logoUrl = rawLogo || generateDynamicSvgLogo(bName, bCategory, primaryColor);

  const existingPageMap = new Map<string, any>();
  pages.forEach((p: any) => {
    if (p.name) existingPageMap.set(p.name.toLowerCase(), p);
  });

  const isRetail = ["shop", "store", "flower", "sweet", "boutique", "bakery", "jewel"].some((w) =>
    bCategory.toLowerCase().includes(w)
  );
  const serviceTabName = isRetail ? "Products" : "Services";

  // Guaranteed 4-page multi-page website model
  const resolvedPages: { name: string; id: string; sections: WebsiteSection[] }[] = [];

  // 1. HOME PAGE
  const rawHomePage = existingPageMap.get("home");
  let homeSections: WebsiteSection[] = [];
  if (rawHomePage?.sections?.length) {
    homeSections = rawHomePage.sections.filter((s: any) => s.type !== "navbar" && s.type !== "footer");
  }

  // Ensure hero is present
  if (!homeSections.some((s) => s.type === "hero")) {
    const existingHero = allIncomingSections.find((s: any) => s.type === "hero");
    homeSections.unshift(existingHero || {
      type: "hero",
      title: `${bName}`,
      subtitle: `Discover unmatched craftsmanship, authentic dedication, and exquisite quality in every detail.`,
      cta: "Explore Offerings",
      secondary_cta: "Our Story"
    });
  }

  const catLower = bCategory.toLowerCase();

  // 1. Stats Bar (Metrics)
  if (!homeSections.some((s) => s.type === "stats" || s.type === "metrics")) {
    let statsItems: any[] = [];
    if (catLower.includes("server") || catLower.includes("cloud") || catLower.includes("host")) {
      statsItems = [
        { label: "Uptime SLA", value: "99.99%", description: "Guaranteed high availability" },
        { label: "Active Deployments", value: "5,000+", description: "Deployed worldwide" },
        { label: "Port Speeds", value: "10 Gbps", description: "Ultra-low latency uplinks" },
        { label: "Support", value: "24/7/365", description: "Expert technical assistance" }
      ];
    } else if (catLower.includes("flower") || catLower.includes("florist")) {
      statsItems = [
        { label: "Fresh Daily Blooms", value: "100%", description: "Handpicked morning blossoms" },
        { label: "Bouquets Crafted", value: "15,000+", description: "Artistic floral arrangements" },
        { label: "Express Delivery", value: "Same-Day", description: "Guaranteed on-time arrival" },
        { label: "Customer Rating", value: "4.9 ★", description: "Top-rated local florist" }
      ];
    } else if (catLower.includes("sweet") || catLower.includes("mithai") || catLower.includes("bakery")) {
      statsItems = [
        { label: "Pure Ingredients", value: "100%", description: "Traditional pure desi ghee" },
        { label: "Signature Delicacies", value: "60+", description: "Traditional & festive treats" },
        { label: "Happy Customers", value: "25,000+", description: "Spreading sweetness everyday" },
        { label: "Daily Preparation", value: "Fresh Batch", description: "Crafted fresh every morning" }
      ];
    } else if (catLower.includes("medical") || catLower.includes("clinic") || catLower.includes("pharma")) {
      statsItems = [
        { label: "Certified Medicines", value: "100%", description: "Authentic & quality verified" },
        { label: "Years of Trust", value: "15+ Years", description: "Dedicated healthcare services" },
        { label: "Availability", value: "24/7", description: "Ready for urgent prescriptions" },
        { label: "Families Served", value: "20,000+", description: "Trusted community pharmacy" }
      ];
    } else {
      statsItems = [
        { label: "Quality Guarantee", value: "100%", description: "Uncompromised excellence" },
        { label: "Satisfied Clients", value: "10,000+", description: "Delivering lasting value" },
        { label: "Turnaround Time", value: "Prompt", description: "Fast & dedicated response" },
        { label: "Customer Rating", value: "4.9 ★", description: "Verified positive reviews" }
      ];
    }
    const heroIndex = homeSections.findIndex((s) => s.type === "hero");
    homeSections.splice(heroIndex + 1, 0, {
      type: "stats",
      title: "Key Highlights",
      subtitle: `Why customers choose ${bName}`,
      items: statsItems
    });
  }

  // 2. Features / Signature Highlights
  if (!homeSections.some((s) => ["features", "facilities", "services", "products"].includes(s.type))) {
    const existingFeatures = allIncomingSections.find((s: any) =>
      ["features", "facilities", "services", "products"].includes(s.type)
    );
    homeSections.push(existingFeatures || {
      type: "features",
      title: "Signature Highlights",
      subtitle: `Experience the best of ${bCategory} at ${bName}`,
      items: [
        { title: "Premium Quality", description: `Uncompromising standards across all our ${bCategory} offerings.` },
        { title: "Personalized Care", description: "Attentive service tailored specifically to your unique needs." },
        { title: "Trusted Craft", description: "Passionate professionals devoted to exceptional results." }
      ]
    });
  }

  // 3. Brand Story & Craftsmanship preview (About)
  if (!homeSections.some((s) => ["about", "story"].includes(s.type))) {
    const existingAbout = allIncomingSections.find((s: any) => ["about", "story"].includes(s.type));
    homeSections.push(existingAbout || {
      type: "about",
      title: `Welcome to ${bName}`,
      subtitle: "Devoted to Craftsmanship & Excellence",
      description: `At ${bName}, our journey is rooted in an unwavering passion for superior quality and genuine customer care. Every single day, we strive to bring you the finest ${bCategory} solutions with uncompromised integrity, warm service, and attention to detail.`
    });
  }

  // 4. Testimonials
  if (!homeSections.some((s) => ["testimonials", "reviews"].includes(s.type))) {
    let testItems: any[] = [];
    if (catLower.includes("server") || catLower.includes("cloud") || catLower.includes("host")) {
      testItems = [
        { name: "Vikram Malhotra", role: "CTO, CloudScale", rating: 5, quote: `${bName} delivered incredible stability with zero downtime. Deployment was instant and network speeds exceeded all expectations.` },
        { name: "Sneha Sen", role: "Lead Systems Architect", rating: 5, quote: "Rock-solid infrastructure and responsive 24/7 technical support. Truly enterprise grade service." },
        { name: "Rohan Mehra", role: "Startup Founder", rating: 5, quote: `Migrating to ${bName} reduced our latency dramatically. Highly recommended for production workloads.` }
      ];
    } else if (catLower.includes("flower") || catLower.includes("florist")) {
      testItems = [
        { name: "Pooja Sharma", role: "Verified Customer", rating: 5, quote: `The floral arrangement from ${bName} was breathtaking! Fresh blooms that stayed vibrant for over a week.` },
        { name: "Amit Verma", role: "Anniversary Order", rating: 5, quote: "Flawless same-day delivery and gorgeous presentation. My wife absolutely loved the bouquet!" },
        { name: "Kavita Rao", role: "Event Coordinator", rating: 5, quote: `${bName} handled our venue floral decor with such artistry and elegance. Truly spectacular.` }
      ];
    } else if (catLower.includes("sweet") || catLower.includes("mithai") || catLower.includes("bakery")) {
      testItems = [
        { name: "Rajesh Gupta", role: "Regular Patron", rating: 5, quote: `Authentic taste, rich aroma of pure ghee, and heavenly sweets. ${bName} is our family's favorite for every celebration.` },
        { name: "Neha Kapoor", role: "Festival Shopper", rating: 5, quote: "Ordered custom gift boxes for Diwali and every guest called to compliment the extraordinary flavors." },
        { name: "Manish Joshi", role: "Sweet Lover", rating: 5, quote: `Freshness you can taste in every single bite. The craftsmanship at ${bName} is truly unmatched.` }
      ];
    } else if (catLower.includes("medical") || catLower.includes("clinic") || catLower.includes("pharma")) {
      testItems = [
        { name: "Suresh Singhal", role: "Local Resident", rating: 5, quote: `${bName} is our most trusted pharmacy. They always have genuine medicines in stock and provide caring assistance.` },
        { name: "Dr. Sunita Nair", role: "Healthcare Professional", rating: 5, quote: "Reliable, hygienic, and extremely helpful staff. Emergency prescriptions are fulfilled promptly without delay." },
        { name: "Arjun Saxena", role: "Caregiver", rating: 5, quote: `Doorstep delivery and patient guidance from ${bName} have been an absolute blessing for our family.` }
      ];
    } else {
      testItems = [
        { name: "Priya Sharma", role: "Verified Client", rating: 5, quote: `The experience with ${bName} has been phenomenal. Top quality, attentive staff, and outstanding professionalism.` },
        { name: "Rahul Verma", role: "Repeat Customer", rating: 5, quote: "Super impressed by their consistency and attention to detail. Would recommend to anyone without hesitation." },
        { name: "Ananya Patel", role: "Community Member", rating: 5, quote: `Fast, friendly, and dependable every time. ${bName} sets the gold standard in ${bCategory || "service"}.` }
      ];
    }
    homeSections.push({
      type: "testimonials",
      title: "What Our Customers Say",
      subtitle: `Real experiences from people who love ${bName}`,
      items: testItems
    });
  }

  // 5. Frequently Asked Questions
  if (!homeSections.some((s) => ["faq", "faqs"].includes(s.type))) {
    let faqItems: any[] = [];
    if (catLower.includes("server") || catLower.includes("cloud") || catLower.includes("host")) {
      faqItems = [
        { question: "How quickly are dedicated and cloud servers deployed?", answer: "Most standard server instances are provisioned instantly within 5 to 15 minutes following order confirmation." },
        { question: "Is DDoS protection and firewall security included?", answer: "Yes, automated enterprise multi-layer DDoS mitigation and advanced firewall filtering are standard on all servers." },
        { question: "Do I receive full root and IPMI / KVM access?", answer: "Absolutely. You get 100% root/administrator access and out-of-band management console control." },
        { question: "What level of customer and technical support is provided?", answer: "Our dedicated system engineers provide round-the-clock 24/7/365 assistance via ticket and priority chat." }
      ];
    } else if (catLower.includes("flower") || catLower.includes("florist")) {
      faqItems = [
        { question: "How fresh are your flowers and arrangements?", answer: "We hand-select fresh morning blossoms directly from verified growers every single day to ensure lasting vibrancy." },
        { question: "Can I place custom orders for specific bouquets or events?", answer: `Yes! ${bName} specializes in custom designed bouquets, festive hampers, and full event floral styling.` },
        { question: "Do you provide same-day flower delivery?", answer: "Yes, we offer express same-day doorstep delivery for orders placed before our afternoon cutoff." },
        { question: "How can I keep my flowers fresh for longer?", answer: "Trim stems slightly at an angle, change the vase water every two days, and keep flowers away from direct sunlight." }
      ];
    } else if (catLower.includes("sweet") || catLower.includes("mithai") || catLower.includes("bakery")) {
      faqItems = [
        { question: "Are your sweets prepared fresh daily?", answer: "Yes, all our sweets and delicacies are freshly prepared every morning using pure ingredients and traditional recipes." },
        { question: "Do you accept bulk orders for weddings and festivals?", answer: `Yes, ${bName} provides personalized bulk gift boxes and event catering for weddings, corporate gifts, and festivals.` },
        { question: "What is the typical shelf life of your offerings?", answer: "Dry and roasted varieties typically last 2 to 3 weeks, while milk-based sweets are best enjoyed within 3 to 5 days." },
        { question: "Do you offer sugar-free or dietary-conscious options?", answer: "Yes, we craft special sugar-free and dry-fruit-only selections to cater to health-conscious patrons." }
      ];
    } else if (catLower.includes("medical") || catLower.includes("clinic") || catLower.includes("pharma")) {
      faqItems = [
        { question: "Are all medications and health supplies verified and genuine?", answer: "100%. We source strictly from authorized pharmaceutical distributors with verified batch certificates." },
        { question: "Do you offer prescription fulfillment and consultations?", answer: "Yes, our qualified pharmacists review your prescription carefully and guide you on dosage and instructions." },
        { question: "Do you provide home delivery for essential medicines?", answer: "Yes, we offer prompt doorstep delivery across our local coverage area for your convenience." },
        { question: "What are your operating hours for urgent needs?", answer: `${bName} operates extended daily hours and provides on-call emergency healthcare assistance.` }
      ];
    } else {
      faqItems = [
        { question: `How can I inquire about products or services at ${bName}?`, answer: "You can reach us directly through our Contact form, visit our location, or call our customer service desk." },
        { question: "Do you provide customized solutions tailored to specific needs?", answer: "Yes! We work closely with each client to provide personalized recommendations and custom packages." },
        { question: "What is your commitment to quality and satisfaction?", answer: "We back every offering with a 100% satisfaction guarantee, ensuring uncompromised standards." },
        { question: "What are your standard turnaround or delivery times?", answer: "We prioritize fast, efficient fulfillment and will keep you updated every step of the way." }
      ];
    }
    homeSections.push({
      type: "faq",
      title: "Frequently Asked Questions",
      subtitle: `Helpful answers to common questions about ${bName}`,
      items: faqItems
    });
  }

  // 6. Call to Action Banner
  if (!homeSections.some((s) => ["cta", "banner"].includes(s.type))) {
    homeSections.push({
      type: "cta",
      title: `Ready to Experience the Best in ${bCategory}?`,
      subtitle: `Connect with ${bName} today. We are here to deliver exceptional quality, personalized care, and lasting satisfaction.`,
      cta: "Contact Us Today",
      secondary_cta: `Explore ${serviceTabName}`
    });
  }

  resolvedPages.push({ name: "Home", id: "home", sections: homeSections });

  // 2. ABOUT PAGE
  const rawAboutPage = existingPageMap.get("about");
  let aboutSections: WebsiteSection[] = [];
  if (rawAboutPage?.sections?.length) {
    aboutSections = rawAboutPage.sections.filter((s: any) => s.type !== "navbar" && s.type !== "footer");
  } else {
    const existingAbout = allIncomingSections.find((s: any) => ["about", "story"].includes(s.type));
    const aboutStory = existingAbout || {
      type: "about",
      title: `Our Story & Mission`,
      subtitle: `Dedicated to excellence in ${bCategory}`,
      description: `At ${bName}, our journey is built upon a profound passion for excellence. We believe in delivering genuine value, personal attention, and memorable experiences for every customer who walks through our doors or visits us online.`
    };
    const aboutFeatures = {
      type: "features",
      title: "Our Guiding Values",
      subtitle: "The principles that define our craft and customer experience",
      items: [
        { title: "Authenticity & Care", description: "Every offering is created and handled with true dedication." },
        { title: "Customer Focused", description: "Your satisfaction and joy inspire everything we do." },
        { title: "Continuous Excellence", description: "Constantly refining our standards to bring you the very best." }
      ]
    };
    const existingGallery = allIncomingSections.find((s: any) => ["gallery", "portfolio"].includes(s.type));
    aboutSections = [aboutStory, aboutFeatures];
    if (existingGallery) aboutSections.push(existingGallery);
  }
  resolvedPages.push({ name: "About", id: "about", sections: aboutSections });

  // 3. SERVICES / PRODUCTS PAGE
  const rawServicePage =
    existingPageMap.get("services") ||
    existingPageMap.get("products") ||
    existingPageMap.get(serviceTabName.toLowerCase());
  let serviceSections: WebsiteSection[] = [];
  if (rawServicePage?.sections?.length) {
    serviceSections = rawServicePage.sections.filter((s: any) => s.type !== "navbar" && s.type !== "footer");
  } else {
    const existingProducts = allIncomingSections.find((s: any) =>
      ["products", "menu", "bouquets", "catalog", "programs", "offerings"].includes(s.type)
    );
    const prodSection = existingProducts || {
      type: "products",
      title: `Featured ${serviceTabName}`,
      subtitle: `Explore our specialized ${bCategory} catalog and offerings`,
      items: [
        {
          title: "Signature Selection",
          description: `Our most beloved, handcrafted ${bCategory} offering.`,
          price: "Inquire for quote"
        },
        {
          title: "Premium Choice",
          description: "Elevated quality and bespoke attention to every single detail.",
          price: "Inquire for quote"
        },
        {
          title: "Custom Tailored Package",
          description: "Designed specifically according to your personal requirements.",
          price: "Custom quote"
        },
        {
          title: "Seasonal Special",
          description: "Freshly curated, timely, and always crafted with the utmost care.",
          price: "Inquire for quote"
        }
      ]
    };
    const gallery = allIncomingSections.find((s: any) => ["gallery", "portfolio"].includes(s.type)) || {
      type: "gallery",
      title: "Showcase Gallery",
      subtitle: `A visual glimpse into ${bName}`,
      items: [
        { title: "Showcase One" },
        { title: "Showcase Two" },
        { title: "Showcase Three" },
        { title: "Showcase Four" }
      ]
    };
    serviceSections = [prodSection, gallery];
  }
  resolvedPages.push({
    name: serviceTabName,
    id: serviceTabName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    sections: serviceSections
  });

  // 4. CONTACT PAGE
  const rawContactPage = existingPageMap.get("contact");
  let contactSections: WebsiteSection[] = [];
  if (rawContactPage?.sections?.length) {
    contactSections = rawContactPage.sections.filter((s: any) => s.type !== "navbar" && s.type !== "footer");
  } else {
    const existingContact = allIncomingSections.find((s: any) => s.type === "contact");
    const contactSec = existingContact || {
      type: "contact",
      title: "Contact & Inquiries",
      subtitle: `We are here to assist you. Get in touch with ${bName} today.`,
      hours: "Monday - Saturday: 9:00 AM - 8:00 PM"
    };
    contactSections = [contactSec];
  }
  resolvedPages.push({ name: "Contact", id: "contact", sections: contactSections });

  // Navigation tabs derived from guaranteed pages
  const navTabs = resolvedPages.map((p) => ({
    name: escapeHtml(p.name),
    id: p.id
  }));

  let pagesBodyHtml = "";

  resolvedPages.forEach((page, pIdx) => {
    let pageSectionsHtml = "";

    page.sections.forEach((section: WebsiteSection, idx: number) => {
      const sectionType = (section.type || "section").toLowerCase();
      // Skip redundant navbar and footer sections in page body
      if (sectionType === "navbar" || sectionType === "footer") return;

      const rawTitle = section.title || section.name || "";
      const sTitle = escapeHtml(rawTitle);
      const sSubtitle = escapeHtml(section.subtitle || "");
      const sDesc = escapeHtml(section.description || section.content || "");
      const sectionId = rawTitle
        ? `section-${rawTitle.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`
        : `section-${sectionType}-${idx}`;

      // 1. HERO SECTION
      if (sectionType === "hero") {
        const heroImg = resolveImageUrl(section.image_url, bCategory, "hero", rawTitle, data.business_name, 1200, 700);

        pageSectionsHtml += `
          <section id="${sectionId}" class="relative bg-gradient-to-b from-gray-50/70 to-white py-10 sm:py-16 md:py-20 border-b border-gray-100 overflow-hidden">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
                <div class="text-center md:text-left">
                  <span class="inline-block px-3 py-1 text-xs font-bold rounded-full bg-primary/10 text-primary mb-3 sm:mb-4 tracking-wider uppercase">${escapeHtml(bCategory)}</span>
                  <h1 class="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                    <span class="block text-primary">${sTitle || bName}</span>
                  </h1>
                  ${sSubtitle || sDesc ? `<p class="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl mx-auto md:mx-0">${sSubtitle || sDesc}</p>` : ""}
                  <div class="mt-6 sm:mt-8 flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4">
                    <button type="button" onclick="switchWebsitePage('contact')" class="inline-flex items-center justify-center px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl text-white font-semibold bg-primary hover:bg-secondary transition shadow-lg shadow-primary/25 text-xs sm:text-sm cursor-pointer">
                      ${escapeHtml(section.cta || "Explore Now")}
                    </button>
                    ${
                      section.secondary_cta
                        ? `<button type="button" onclick="switchWebsitePage('about')" class="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition text-xs sm:text-sm cursor-pointer">${escapeHtml(section.secondary_cta)}</button>`
                        : ""
                    }
                  </div>
                  <div class="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center md:justify-start gap-3 sm:gap-5 text-[11px] sm:text-xs text-gray-500 font-medium">
                    <span class="flex items-center gap-1"><span class="text-amber-500 font-bold">★</span> 4.9/5 Rating</span>
                    <span>•</span>
                    <span class="flex items-center gap-1"><span class="text-emerald-500 font-bold">✓</span> Verified Quality</span>
                    <span>•</span>
                    <span class="flex items-center gap-1"><span class="text-primary font-bold">⚡</span> Prompt Service</span>
                  </div>
                </div>
                <div class="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100 aspect-video md:aspect-[4/3] bg-gray-100 max-h-96">
                  <img src="${heroImg}" alt="${sTitle || bName}" class="w-full h-full object-cover transition duration-700 hover:scale-105" loading="eager" />
                </div>
              </div>
            </div>
          </section>
        `;
      }

      // 1b. STATS / METRICS BAR
      else if (sectionType === "stats" || sectionType === "metrics") {
        const items = section.items || [];
        pageSectionsHtml += `
          <section id="${sectionId}" class="py-8 sm:py-12 bg-gray-50/80 border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                ${items
                  .map((stat: any) => {
                    const val = escapeHtml(stat.value || "100%");
                    const lbl = escapeHtml(stat.label || stat.title || "Quality");
                    const desc = escapeHtml(stat.description || "");
                    return `
                      <div class="p-4 sm:p-6 bg-white rounded-2xl border border-gray-100 text-center shadow-xs hover:border-primary/30 hover:shadow-md transition duration-300">
                        <div class="text-2xl sm:text-3xl md:text-4xl font-black text-primary tracking-tight">${val}</div>
                        <div class="mt-1 text-xs sm:text-sm font-bold text-gray-900">${lbl}</div>
                        ${desc ? `<p class="mt-1 text-[11px] sm:text-xs text-gray-500 leading-snug">${desc}</p>` : ""}
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          </section>
        `;
      }

      // 2. PRODUCTS / BOUQUETS / MENU / CATALOG / ITEMS
      else if (
        sectionType === "products" ||
        sectionType === "menu" ||
        sectionType === "bouquets" ||
        sectionType === "catalog" ||
        sectionType === "programs" ||
        sectionType === "items" ||
        sectionType === "offerings"
      ) {
        const items = section.items || [];
        pageSectionsHtml += `
          <section id="${sectionId}" class="py-12 sm:py-16 md:py-24 bg-gray-50/70 border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="text-center max-w-3xl mx-auto">
                <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">${sTitle || "Featured Offerings"}</h2>
                ${sSubtitle ? `<p class="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">${sSubtitle}</p>` : ""}
              </div>
              <div class="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                ${items
                  .map((item: WebsiteSectionItem, itemIdx: number) => {
                    const itemTitle = escapeHtml(item.title || item.name || `Option ${itemIdx + 1}`);
                    const itemDesc = escapeHtml(item.description || "");
                    const itemPrice = escapeHtml(item.price || "");
                    const itemImg = resolveImageUrl(item.image_url, bCategory, sectionType, item.title || item.name, data.business_name, 600, 450);

                    return `
                      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col">
                        <div class="relative h-48 sm:h-56 bg-gray-100 overflow-hidden">
                          <img class="w-full h-full object-cover transition duration-500 hover:scale-105" src="${itemImg}" alt="${itemTitle}" loading="lazy" />
                          ${itemPrice ? `<span class="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary shadow">${itemPrice}</span>` : ""}
                        </div>
                        <div class="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 class="text-lg sm:text-xl font-bold text-gray-900">${itemTitle}</h3>
                            ${itemDesc ? `<p class="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">${itemDesc}</p>` : ""}
                          </div>
                          <div class="mt-4 sm:mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                            ${itemPrice ? `<span class="text-base sm:text-lg font-bold text-primary">${itemPrice}</span>` : `<span></span>`}
                            <button onclick="alert('Inquiry for: ${itemTitle.replace(/'/g, "\\'")}')" class="px-4 py-2 text-xs font-semibold rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition cursor-pointer">Select</button>
                          </div>
                        </div>
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          </section>
        `;
      }

      // 3. FEATURES / SERVICES / FACILITIES
      else if (sectionType === "features" || sectionType === "services" || sectionType === "facilities") {
        const items = section.items || [];
        pageSectionsHtml += `
          <section id="${sectionId}" class="py-12 sm:py-16 md:py-20 bg-white border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="text-center max-w-3xl mx-auto">
                <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">${sTitle || "Why Choose Us"}</h2>
                ${sSubtitle ? `<p class="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600">${sSubtitle}</p>` : ""}
              </div>
              <div class="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                ${items
                  .map((item: WebsiteSectionItem, itemIdx: number) => {
                    const itemTitle = escapeHtml(item.title || item.name || `Feature ${itemIdx + 1}`);
                    const itemDesc = escapeHtml(item.description || "");
                    const itemImg = item.image_url ? resolveImageUrl(item.image_url, bCategory, sectionType, item.title, data.business_name, 500, 320) : null;

                    return `
                      <div class="p-6 sm:p-8 bg-gray-50/80 rounded-2xl border border-gray-100 hover:border-primary/30 transition duration-300">
                        ${itemImg ? `<div class="mb-4 sm:mb-5 h-36 sm:h-44 rounded-xl overflow-hidden"><img src="${itemImg}" alt="${itemTitle}" class="w-full h-full object-cover" loading="lazy" /></div>` : `<div class="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base sm:text-lg mb-4 sm:mb-5">✓</div>`}
                        <h3 class="text-lg sm:text-xl font-bold text-gray-900">${itemTitle}</h3>
                        ${itemDesc ? `<p class="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed">${itemDesc}</p>` : ""}
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          </section>
        `;
      }

      // 4. GALLERY / PORTFOLIO
      else if (sectionType === "gallery" || sectionType === "portfolio") {
        const items = section.items || [];
        pageSectionsHtml += `
          <section id="${sectionId}" class="py-12 sm:py-16 md:py-24 bg-gray-50 border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="text-center max-w-3xl mx-auto">
                <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">${sTitle || "Visual Gallery"}</h2>
                ${sSubtitle ? `<p class="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600">${sSubtitle}</p>` : ""}
              </div>
              <div class="mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                ${items
                  .map((item: WebsiteSectionItem, itemIdx: number) => {
                    const itemTitle = escapeHtml(item.title || item.name || `Photo ${itemIdx + 1}`);
                    const itemImg = resolveImageUrl(item.image_url, bCategory, "gallery", item.title || item.name, data.business_name, 600, 600);

                    return `
                      <div class="relative group rounded-xl overflow-hidden aspect-square shadow-sm bg-gray-200">
                        <img src="${itemImg}" alt="${itemTitle}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" loading="lazy" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-2 sm:p-4">
                          <span class="text-white text-xs sm:text-sm font-semibold truncate">${itemTitle}</span>
                        </div>
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          </section>
        `;
      }

      // 5. ABOUT SECTION
      else if (sectionType === "about" || sectionType === "story") {
        const aboutImg = resolveImageUrl(section.image_url, bCategory, "about", "workshop", data.business_name, 800, 600);

        pageSectionsHtml += `
          <section id="${sectionId}" class="py-12 sm:py-16 md:py-24 bg-white border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
                <div>
                  <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">${sTitle || `About ${bName}`}</h2>
                  ${sSubtitle ? `<p class="mt-2 sm:mt-3 text-base sm:text-lg font-medium text-primary">${sSubtitle}</p>` : ""}
                  <div class="mt-4 sm:mt-6 text-gray-600 space-y-3 sm:space-y-4 text-sm sm:text-base leading-relaxed">
                    <p>${sDesc || `At ${bName}, we are dedicated to providing the highest quality ${escapeHtml(bCategory)} offerings. We strive for excellence, personal care, and customer satisfaction.`}</p>
                  </div>
                </div>
                <div class="mt-4 sm:mt-8 lg:mt-0">
                  <div class="relative rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl">
                    <img class="w-full h-56 sm:h-72 md:h-96 object-cover" src="${aboutImg}" alt="${sTitle || bName}" loading="lazy" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        `;
      }

      // 6. CONTACT SECTION
      else if (sectionType === "contact") {
        const address = escapeHtml(section.address || data.address || "");
        const phone = escapeHtml(section.phone || data.phone || "");
        const email = escapeHtml(section.email || data.email || "");
        const hours = escapeHtml(section.hours || data.hours || "");

        pageSectionsHtml += `
          <section id="${sectionId}" class="py-12 sm:py-16 md:py-24 bg-white border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
                <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">${sTitle || "Contact & Inquiries"}</h2>
                <p class="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg text-gray-600">${sSubtitle || sDesc || `Reach out to ${bName}. We look forward to serving you.`}</p>
              </div>
              <div class="max-w-xl mx-auto bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
                ${
                  address || phone || email || hours
                    ? `
                  <div class="space-y-2 sm:space-y-3 mb-6 text-xs sm:text-sm text-gray-700">
                    ${address ? `<p class="flex items-center gap-2"><span class="font-bold text-primary">Location:</span> ${address}</p>` : ""}
                    ${phone ? `<p class="flex items-center gap-2"><span class="font-bold text-primary">Phone:</span> ${phone}</p>` : ""}
                    ${email ? `<p class="flex items-center gap-2"><span class="font-bold text-primary">Email:</span> ${email}</p>` : ""}
                    ${hours ? `<p class="flex items-center gap-2"><span class="font-bold text-primary">Hours:</span> ${hours}</p>` : ""}
                  </div>
                `
                    : ""
                }
                <form onsubmit="event.preventDefault(); alert('Message sent successfully!');" class="space-y-3 sm:space-y-4">
                  <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1">Your Name</label>
                    <input type="text" required placeholder="Full Name" class="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1">Email / Phone</label>
                    <input type="text" required placeholder="contact@example.com" class="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1">How can we help?</label>
                    <textarea rows="3" required placeholder="Tell us what you need..." class="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
                  </div>
                  <button type="submit" class="w-full py-3 px-6 rounded-xl text-white font-semibold bg-primary hover:bg-secondary transition shadow-md text-sm sm:text-base cursor-pointer">Send Inquiry</button>
                </form>
              </div>
            </div>
          </section>
        `;
      }

      // 7. TESTIMONIALS / REVIEWS
      else if (sectionType === "testimonials" || sectionType === "reviews") {
        const items = section.items || [];
        pageSectionsHtml += `
          <section id="${sectionId}" class="py-12 sm:py-16 md:py-24 bg-gray-50/70 border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
                <span class="inline-block px-3 py-1 text-xs font-bold rounded-full bg-primary/10 text-primary mb-3 tracking-wider uppercase">Customer Love</span>
                <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">${sTitle || "What Our Customers Say"}</h2>
                ${sSubtitle ? `<p class="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600">${sSubtitle}</p>` : `<p class="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">Hear directly from clients who trust ${bName} every day.</p>`}
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                ${items
                  .map((item: any, i: number) => {
                    const ratingNum = item.rating || 5;
                    const stars = "★".repeat(ratingNum) + "☆".repeat(Math.max(0, 5 - ratingNum));
                    const authorName = escapeHtml(item.name || item.author || `Client ${i + 1}`);
                    const authorRole = escapeHtml(item.role || item.title || "Verified Customer");
                    const quoteText = escapeHtml(item.quote || item.text || item.description || "Outstanding quality and service!");
                    const initial = authorName.charAt(0).toUpperCase();

                    return `
                      <div class="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between">
                        <div>
                          <div class="flex items-center gap-1 text-amber-400 text-sm sm:text-base mb-4 tracking-wider">
                            ${stars}
                          </div>
                          <p class="text-xs sm:text-sm text-gray-700 leading-relaxed italic">"${quoteText}"</p>
                        </div>
                        <div class="mt-6 pt-4 border-t border-gray-50 flex items-center gap-3">
                          <div class="w-10 h-10 rounded-full bg-primary/10 text-primary font-extrabold flex items-center justify-center text-sm shadow-xs">
                            ${initial}
                          </div>
                          <div>
                            <h4 class="text-xs sm:text-sm font-bold text-gray-900">${authorName}</h4>
                            <p class="text-[11px] sm:text-xs text-gray-500">${authorRole}</p>
                          </div>
                        </div>
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          </section>
        `;
      }

      // 8. FAQ SECTION
      else if (sectionType === "faq" || sectionType === "faqs") {
        const items = section.items || [];
        pageSectionsHtml += `
          <section id="${sectionId}" class="py-12 sm:py-16 md:py-24 bg-white border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
                <span class="inline-block px-3 py-1 text-xs font-bold rounded-full bg-primary/10 text-primary mb-3 tracking-wider uppercase">Answers & Support</span>
                <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">${sTitle || "Frequently Asked Questions"}</h2>
                ${sSubtitle ? `<p class="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600">${sSubtitle}</p>` : `<p class="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">Quick answers to common questions about our products and services.</p>`}
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
                ${items
                  .map((item: any, i: number) => {
                    const question = escapeHtml(item.question || item.title || `Question ${i + 1}`);
                    const answer = escapeHtml(item.answer || item.description || item.content || "");
                    return `
                      <div class="p-5 sm:p-7 bg-gray-50/80 rounded-2xl border border-gray-100 hover:border-primary/40 hover:bg-white transition duration-200">
                        <h3 class="text-sm sm:text-base font-bold text-gray-900 flex items-start gap-2.5">
                          <span class="text-primary font-black shrink-0">Q.</span>
                          <span>${question}</span>
                        </h3>
                        ${answer ? `<p class="mt-2.5 text-xs sm:text-sm text-gray-600 leading-relaxed pl-6">${answer}</p>` : ""}
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          </section>
        `;
      }

      // 9. CTA BANNER
      else if (sectionType === "cta" || sectionType === "banner") {
        pageSectionsHtml += `
          <section id="${sectionId}" class="py-14 sm:py-20 bg-gradient-to-r from-gray-900 via-primary/95 to-gray-900 text-white relative overflow-hidden">
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
              <span class="inline-block px-3 py-1 text-xs font-bold rounded-full bg-white/10 text-white mb-3 sm:mb-4 tracking-wider uppercase border border-white/20">Get Started</span>
              <h2 class="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight">${sTitle || `Ready to experience ${bName}?`}</h2>
              <p class="mt-3 sm:mt-5 text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
                ${sSubtitle || sDesc || `Connect with us today for personalized solutions, orders, or consultations.`}
              </p>
              <div class="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
                <button type="button" onclick="switchWebsitePage('contact')" class="inline-flex items-center justify-center px-7 sm:px-9 py-3 sm:py-3.5 rounded-xl font-bold bg-white text-gray-900 hover:bg-gray-100 transition shadow-xl text-xs sm:text-sm cursor-pointer">
                  ${escapeHtml(section.cta || "Contact Us Today")}
                </button>
                ${
                  section.secondary_cta
                    ? `<button type="button" onclick="switchWebsitePage('${serviceTabName.toLowerCase().replace(/[^a-z0-9]/g, "-")}')" class="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold border border-white/30 text-white hover:bg-white/10 transition text-xs sm:text-sm cursor-pointer">${escapeHtml(section.secondary_cta)}</button>`
                    : ""
                }
              </div>
            </div>
          </section>
        `;
      }

      // 10. GENERIC SECTION FALLBACK
      else {
        pageSectionsHtml += `
          <section id="${sectionId}" class="py-12 sm:py-16 bg-white border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              ${sTitle ? `<h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900">${sTitle}</h2>` : ""}
              ${sDesc ? `<p class="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">${sDesc}</p>` : ""}
            </div>
          </section>
        `;
      }
    });

    pagesBodyHtml += `
      <div id="page-view-${page.id}" class="website-page-view ${pIdx === 0 ? "" : "hidden"}">
        ${pageSectionsHtml}
      </div>
    `;
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${bName}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <script>
        tailwind.config = {
          theme: {
            extend: {
              colors: {
                primary: '${primaryColor}',
                secondary: '${secondaryColor}',
                accent: '${accentColor}'
              }
            }
          }
        }
      </script>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600;700&family=Lato:wght@300;400;700&family=Montserrat:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap');
        
        :root {
          --primary-color: ${primaryColor};
          --secondary-color: ${secondaryColor};
          --accent-color: ${accentColor};
          --btn-bg: ${buttonColor};
          --btn-text: ${buttonTextColor};
          --btn-hover: ${buttonHoverColor};
          --btn-radius: ${buttonRadius};
          --font-family: '${fontFamily}', sans-serif;
        }

        html { scroll-behavior: smooth; }
        body { font-family: var(--font-family); }
        h1, h2, h3, h4, .font-heading { font-family: var(--font-family); }

        /* Button styling overrides */
        .bg-primary, .site-btn-primary, button.cta-btn, button[type="submit"] {
          background-color: var(--btn-bg) !important;
          color: var(--btn-text) !important;
          border-radius: var(--btn-radius) !important;
        }
        .bg-primary:hover, .site-btn-primary:hover, button.cta-btn:hover, button[type="submit"]:hover {
          background-color: var(--btn-hover) !important;
          filter: brightness(0.95);
        }
        .text-primary { color: var(--primary-color) !important; }
        .border-primary { border-color: var(--primary-color) !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      </style>
    </head>
    <body class="bg-gray-50 text-gray-900 antialiased selection:bg-primary selection:text-white min-h-screen flex flex-col justify-between">
      <!-- Navbar with Desktop Tabs and Mobile Toggle -->
      <nav class="bg-white/95 backdrop-blur-md shadow-xs sticky top-0 z-50 border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16 sm:h-20 items-center">
            <!-- Brand Logo & Name side by side -->
            <div class="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer shrink-0" onclick="switchWebsitePage('home')">
              ${
                logoUrl
                  ? `<img src="${logoUrl}" alt="${bName}" class="h-8 sm:h-10 w-auto object-contain rounded-md" />`
                  : `<div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-sm sm:text-base bg-primary shadow-xs">${bName.charAt(0).toUpperCase()}</div>`
              }
              <span class="text-base sm:text-xl font-extrabold text-gray-900 tracking-tight">${bName}</span>
            </div>

            <!-- Desktop Navigation Tabs (Hidden on mobile) -->
            <div class="hidden md:flex items-center space-x-1 lg:space-x-3">
              ${navTabs
                .filter((t) => t.id !== "contact")
                .map(
                  (tab: any, idx: number) =>
                    `<button type="button" onclick="switchWebsitePage('${tab.id}')" data-nav-id="${tab.id}" class="nav-tab-btn px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                      idx === 0
                        ? "text-primary bg-primary/10 font-bold"
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    }">${tab.name}</button>`
                )
                .join("")}
              <button type="button" onclick="switchWebsitePage('contact')" data-nav-id="contact" class="nav-tab-btn ml-3 bg-primary text-white px-4 sm:px-5 py-2 rounded-xl font-bold hover:bg-secondary transition shadow-md shadow-primary/20 text-xs sm:text-sm whitespace-nowrap cursor-pointer">
                Contact
              </button>
            </div>

            <!-- Mobile Hamburger Toggle Button (Visible on mobile only) -->
            <div class="flex items-center md:hidden">
              <button type="button" id="mobile-menu-btn" onclick="toggleMobileNavbar()" aria-label="Toggle navigation menu" class="p-2 rounded-lg text-gray-700 hover:text-primary hover:bg-gray-100 transition focus:outline-none cursor-pointer">
                <svg id="hamburger-svg" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg id="close-svg" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Dropdown Drawer -->
        <div id="mobile-menu-dropdown" class="hidden md:hidden border-t border-gray-100 bg-white/98 backdrop-blur-md px-4 pt-2 pb-4 space-y-1 shadow-lg">
          ${navTabs
            .map(
              (tab: any, idx: number) =>
                `<button type="button" onclick="switchWebsitePage('${tab.id}'); toggleMobileNavbar(false);" data-nav-id="${tab.id}" class="nav-tab-btn block w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  idx === 0
                    ? "text-primary bg-primary/10 font-bold"
                    : "text-gray-700 hover:text-primary hover:bg-gray-50"
                }">${tab.name}</button>`
            )
            .join("")}
        </div>
      </nav>

      <main class="flex-1">
        ${pagesBodyHtml}
      </main>

      <footer class="bg-gray-950 text-gray-400 border-t border-gray-800">
        <div class="max-w-7xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 text-center sm:text-left">
            <div>
              <div class="flex items-center gap-2 mb-3 justify-center sm:justify-start">
                ${logoUrl ? `<img src="${logoUrl}" alt="${bName}" class="h-6 w-auto object-contain" />` : ""}
                <h3 class="text-xl sm:text-2xl font-black text-white">${bName}</h3>
              </div>
              <p class="text-xs sm:text-sm leading-relaxed">${escapeHtml(data.tagline || `Quality products and exceptional service tailored to you.`)}</p>
            </div>
            <div>
              <h4 class="text-xs sm:text-sm font-bold uppercase tracking-wider text-white mb-3 sm:mb-4">Pages & Links</h4>
              <ul class="space-y-2 text-xs sm:text-sm">
                ${navTabs.map((tab: any) => `<li><button type="button" onclick="switchWebsitePage('${tab.id}')" class="hover:text-white transition text-xs sm:text-sm cursor-pointer">${tab.name}</button></li>`).join("")}
              </ul>
            </div>
            <div class="sm:col-span-2 md:col-span-1">
              <h4 class="text-xs sm:text-sm font-bold uppercase tracking-wider text-white mb-3 sm:mb-4">About</h4>
              <p class="text-xs sm:text-sm leading-relaxed">${bCategory ? `${bName} is your trusted ${escapeHtml(bCategory)}.` : `Dedicated to outstanding quality and customer satisfaction.`}</p>
            </div>
          </div>
          <div class="border-t border-gray-900 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-xs text-gray-500">
            &copy; ${new Date().getFullYear()} ${bName}. All rights reserved.
          </div>
        </div>
      </footer>

      <script>
        function toggleMobileNavbar(forcedState) {
          var menu = document.getElementById('mobile-menu-dropdown');
          var burger = document.getElementById('hamburger-svg');
          var close = document.getElementById('close-svg');
          if (!menu) return;
          var isOpen = !menu.classList.contains('hidden');
          var shouldOpen = typeof forcedState === 'boolean' ? forcedState : !isOpen;
          if (shouldOpen) {
            menu.classList.remove('hidden');
            if (burger) burger.classList.add('hidden');
            if (close) close.classList.remove('hidden');
          } else {
            menu.classList.add('hidden');
            if (burger) burger.classList.remove('hidden');
            if (close) close.classList.add('hidden');
          }
        }

        function switchWebsitePage(targetId) {
          var cleanId = (targetId || 'home').toLowerCase().replace(/[^a-z0-9]/g, '-');
          var views = document.querySelectorAll('.website-page-view');
          var targetView = document.getElementById('page-view-' + cleanId);

          if (!targetView) {
            targetView = document.querySelector('[id*="page-view-' + cleanId + '"]');
          }

          if (targetView) {
            views.forEach(function(v) { v.classList.add('hidden'); });
            targetView.classList.remove('hidden');
          } else {
            // Keep first view visible and scroll to section anchor
            if (views.length > 0) {
              views.forEach(function(v, i) {
                if (i === 0) v.classList.remove('hidden');
                else v.classList.add('hidden');
              });
            }
            var targetSec = document.getElementById(targetId) || document.getElementById('section-' + cleanId);
            if (targetSec) {
              targetSec.scrollIntoView({ behavior: 'smooth' });
            }
          }

          // Update active state on nav buttons (desktop and mobile)
          var buttons = document.querySelectorAll('.nav-tab-btn');
          buttons.forEach(function(btn) {
            if (btn.getAttribute('data-nav-id') === cleanId) {
              btn.classList.add('text-primary', 'bg-primary/10', 'font-bold');
              btn.classList.remove('text-gray-600', 'text-gray-700', 'hover:bg-gray-50');
            } else {
              btn.classList.remove('text-primary', 'bg-primary/10', 'font-bold');
              btn.classList.add('text-gray-600', 'hover:bg-gray-50');
            }
          });

          // Close mobile menu if open
          toggleMobileNavbar(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        window.addEventListener('message', function(e) {
          if (e.data && e.data.action === 'switchPage') {
            switchWebsitePage(e.data.pageId);
          }
        });
      </script>
    </body>
    </html>
  `;
};

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

const GENERATION_STEPS = [
  "Structuring website sections & navigation",
  "Applying selected industry template",
  "Generating responsive layouts and content",
  "Curating authentic, category-specific imagery",
  "Final quality & responsiveness check"
];

export default function WebsiteBuilderPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [siteId, setSiteId] = useState<string | null>(null);
  const [language, setLanguage] = useState<string | null>("English");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [generatedSiteData, setGeneratedSiteData] = useState<GeneratedSiteData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [creditDeductionToast, setCreditDeductionToast] = useState<string | null>(null);
  const [isFinalized, setIsFinalized] = useState(false);

  // Responsive Device Preview & Viewport State
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activePreviewPage, setActivePreviewPage] = useState<string>("home");

  const handleSwitchPreviewPage = (pageName: string) => {
    const cleanId = (pageName || "home").toLowerCase().replace(/[^a-z0-9]/g, "-");
    setActivePreviewPage(cleanId);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ action: "switchPage", pageId: cleanId }, "*");
    }
  };
  const [activeMobileView, setActiveMobileView] = useState<"chat" | "preview">("chat");

  // Business Context State (Requirements 1, 2, 3)
  const [businessContext, setBusinessContext] = useState<BusinessContext>({
    onboardingStep: "step1_category_products"
  });

  // Version History State
  const [currentVersion, setCurrentVersion] = useState(1);
  const [versionHistory, setVersionHistory] = useState<VersionItem[]>([]);
  const [showVersionDropdown, setShowVersionDropdown] = useState(false);
  const [exportLoading, setExportLoading] = useState<"pdf" | "zip" | null>(null);

  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isInitializingRef = useRef(false);

  // File Upload for Logo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleSend("I uploaded my logo", { action: "upload_logo", base64: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const recordVersion = useCallback((newData: GeneratedSiteData, label: string) => {
    setCurrentVersion((prevVer) => {
      const nextVer = prevVer + 1;
      setVersionHistory((prevHist) => [
        ...prevHist,
        {
          version: nextVer,
          label,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          data: newData
        }
      ]);
      return nextVer;
    });
  }, []);

  // Save State to LocalStorage (Req 2 & 6)
  const saveStateToStorage = useCallback(
    (
      sId: string | null,
      ctx: BusinessContext,
      msgs: ChatMessage[],
      siteData: GeneratedSiteData | null
    ) => {
      if (sId) localStorage.setItem("website_builder_session_id", sId);
      localStorage.setItem("website_builder_context", JSON.stringify(ctx));
      localStorage.setItem("website_builder_messages", JSON.stringify(msgs));
      if (siteData) {
        localStorage.setItem("website_builder_site_data", JSON.stringify(siteData));
      }
    },
    []
  );

  // Theme & Styling Customizer State
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [themeActiveTab, setThemeActiveTab] = useState<"colors" | "fonts" | "buttons">("colors");

  // Direct Theme Customization Handler
  const updateWebsiteTheme = useCallback((
    themeUpdates: Partial<{
      primary: string;
      secondary: string;
      accent: string;
      font: string;
      button_color: string;
      button_text_color: string;
      button_radius: string;
    }>,
    label: string = "Theme Customization"
  ) => {
    setGeneratedSiteData((prevSite) => {
      if (!prevSite) return null;
      const updated: GeneratedSiteData = JSON.parse(JSON.stringify(prevSite));
      if (!updated.theme) updated.theme = {};
      Object.assign(updated.theme, themeUpdates);

      // If primary color changed, also update the SVG logo if it's dynamic
      if (themeUpdates.primary && (!updated.logo || (typeof updated.logo === "string" && updated.logo.startsWith("data:image/svg+xml")))) {
        const bCat = updated.business_category || businessContext.businessCategory || "Business";
        const bName = updated.business_name || businessContext.businessName || "My Business";
        const newLogo = generateDynamicSvgLogo(bName, bCat, themeUpdates.primary);
        updated.logo = newLogo;
        if (updated.pages) {
          updated.pages.forEach((p: any) => {
            if (p.sections) {
              p.sections.forEach((s: any) => {
                if (s.type === "navbar" || s.type === "footer") {
                  s.logo = newLogo;
                }
              });
            }
          });
        }
      }

      recordVersion(updated, label);
      saveStateToStorage(sessionId, businessContext, messages, updated);

      if (sessionId && /^[0-9a-fA-F]{24}$/.test(sessionId)) {
        websiteBuilderService.editWebsite(sessionId, `Apply ${label}`, updated).catch((e) => {
          console.warn("Background theme sync error", e);
        });
      }

      setCreditDeductionToast(`🎨 Applied ${label}!`);
      setTimeout(() => setCreditDeductionToast(null), 3000);
      return updated;
    });
  }, [businessContext, sessionId, messages, recordVersion, saveStateToStorage]);

  /* -------------------------------------------------------------------------- */
  /*                       SESSION INITIALIZATION & RESTORATION                 */
  /* -------------------------------------------------------------------------- */

  const startNewSession = async (lang = "English") => {
    try {
      setLoading(true);
      const data = await websiteBuilderService.startSession(lang);
      if (data?.sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem("website_builder_session_id", data.sessionId);
        setLanguage(data.language || lang);
        setIsFinalized(false);
        setCurrentVersion(1);
        setVersionHistory([]);

        const initialCtx: BusinessContext = {
          onboardingStep: "step1_category_products"
        };
        setBusinessContext(initialCtx);

        // Backend messages are the single source of truth - no duplicate greetings
        const initialMsgs: ChatMessage[] =
          data.messages && data.messages.length > 0
            ? data.messages
            : [
                {
                  id: "welcome-step-1",
                  role: "ai",
                  content:
                    "Welcome to DhandaGrow AI Website Builder! What type of business do you run, and what products or services do you offer?"
                }
              ];

        setMessages(initialMsgs);
        saveStateToStorage(data.sessionId, initialCtx, initialMsgs, null);
        return data;
      }
    } catch (e) {
      console.error("Backend startSession error, using fallback", e);
      const localId = "local-" + Date.now();
      setSessionId(localId);
      const initialCtx: BusinessContext = { onboardingStep: "step1_category_products" };
      setBusinessContext(initialCtx);
      const initialMsg: ChatMessage = {
        id: "welcome-step-1",
        role: "ai",
        content: "Welcome to DhandaGrow AI Website Builder! What type of business do you run, and what products or services do you offer?"
      };
      setMessages([initialMsg]);
      saveStateToStorage(localId, initialCtx, [initialMsg], null);
    } finally {
      setLoading(false);
    }
  };

  const loadSession = async (id: string) => {
    try {
      setLoading(true);

      const storedCtx = localStorage.getItem("website_builder_context");
      const storedMsgs = localStorage.getItem("website_builder_messages");
      const storedSite = localStorage.getItem("website_builder_site_data");

      if (storedCtx) {
        try {
          setBusinessContext(JSON.parse(storedCtx));
        } catch {}
      }

      if (storedSite) {
        try {
          const parsedSite = JSON.parse(storedSite);
          setGeneratedSiteData(parsedSite);
          setVersionHistory([
            {
              version: 1,
              label: "Restored Draft",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              data: parsedSite
            }
          ]);
        } catch {}
      }

      const data = await websiteBuilderService.getSession(id);
      if (!data) {
        if (storedMsgs) {
          try {
            setMessages(JSON.parse(storedMsgs));
            return;
          } catch {}
        }
        await startNewSession(language || "English");
        return;
      }

      setSessionId(data.sessionId);
      if (data.siteId) setSiteId(data.siteId);
      if (data.language) setLanguage(data.language);

      let siteToUse = data.generatedSiteData;
      if ((!siteToUse || !siteToUse.pages || siteToUse.pages.length === 0) && data.siteId) {
        try {
          const fetchedSite = await websiteBuilderService.getSite(data.siteId);
          if (fetchedSite && fetchedSite.pages && fetchedSite.pages.length > 0) {
            siteToUse = fetchedSite;
          }
        } catch {}
      }

      if (siteToUse && siteToUse.pages && siteToUse.pages.length > 0) {
        setGeneratedSiteData(siteToUse);
        localStorage.setItem("website_builder_site_data", JSON.stringify(siteToUse));
        setVersionHistory([
          {
            version: 1,
            label: "Restored Draft",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            data: siteToUse
          }
        ]);
        if (siteToUse.business_name) {
          setBusinessContext((prev) => ({
            ...prev,
            businessName: siteToUse?.business_name,
            businessCategory: siteToUse?.business_category,
            selectedTemplateId: siteToUse?.template_id,
            selectedTemplateName: siteToUse?.template_name,
            onboardingStep: "step7_generated"
          }));
        }
      } else if (storedSite) {
        try {
          const parsed = JSON.parse(storedSite);
          if (parsed && parsed.pages && parsed.pages.length > 0) {
            setGeneratedSiteData(parsed);
          }
        } catch {}
      }

      if (data.messages && data.messages.length > 0) {
        setMessages(data.messages);
      } else if (storedMsgs) {
        try {
          setMessages(JSON.parse(storedMsgs));
        } catch {}
      }
    } catch (e) {
      console.warn("Failed to load session from backend, using local cache", e);
      const storedMsgs = localStorage.getItem("website_builder_messages");
      if (storedMsgs) {
        try {
          setMessages(JSON.parse(storedMsgs));
        } catch {}
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isInitializingRef.current) return;
    isInitializingRef.current = true;

    const init = async () => {
      const savedSessionId = localStorage.getItem("website_builder_session_id");
      if (savedSessionId && /^[0-9a-fA-F]{24}$/.test(savedSessionId)) {
        setSessionId(savedSessionId);
        await loadSession(savedSessionId);
      } else {
        await startNewSession("English");
      }
    };
    init();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* -------------------------------------------------------------------------- */
  /*                          CLEAR & RESET SESSION                             */
  /* -------------------------------------------------------------------------- */

  const handleClear = async () => {
    try {
      setLoading(true);
      let clearedMessages: ChatMessage[] | null = null;
      if (sessionId && /^[0-9a-fA-F]{24}$/.test(sessionId)) {
        const res = await websiteBuilderService.clearSession(sessionId);
        if (res?.messages && res.messages.length > 0) {
          clearedMessages = res.messages;
        }
      }
      localStorage.removeItem("website_builder_site_data");
      localStorage.removeItem("website_builder_context");
      localStorage.removeItem("website_builder_messages");
      setGeneratedSiteData(null);
      setSiteId(null);
      setIsFinalized(false);
      setVersionHistory([]);
      setCurrentVersion(1);

      const resetCtx: BusinessContext = {
        onboardingStep: "step1_category_products"
      };
      setBusinessContext(resetCtx);

      const initialMsgs: ChatMessage[] = clearedMessages || [
        {
          id: "welcome-step-1",
          role: "ai",
          content:
            "Welcome to DhandaGrow AI Website Builder! What type of business do you run, and what products or services do you offer?"
        }
      ];
      setMessages(initialMsgs);
      saveStateToStorage(sessionId, resetCtx, initialMsgs, null);
      setActiveMobileView("chat");
    } catch (e) {
      console.warn("Clear session call error", e);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                    STEP-BY-STEP CONVERSATION FLOW (REQ 1)                  */
  /* -------------------------------------------------------------------------- */

  const advanceOnboarding = async (userText: string, actionData?: any) => {
    const currentStep = businessContext.onboardingStep;
    const lower = userText.trim().toLowerCase();

    // STEP 1: Ask business type & products/services -> Got answer -> Transition to Step 2
    if (currentStep === "step1_category_products") {
      let detectedCategory = "Business";
      if (lower.includes("flower") || lower.includes("florist") || lower.includes("bouquet")) {
        detectedCategory = "Flower Shop";
      } else if (lower.includes("gym") || lower.includes("fitness") || lower.includes("workout")) {
        detectedCategory = "Gym & Fitness";
      } else if (lower.includes("restaurant") || lower.includes("cafe") || lower.includes("food") || lower.includes("dining") || lower.includes("bistro")) {
        detectedCategory = "Restaurant";
      } else if (lower.includes("cloth") || lower.includes("boutique") || lower.includes("apparel") || lower.includes("fashion")) {
        detectedCategory = "Clothing Boutique";
      } else if (lower.includes("dental") || lower.includes("clinic") || lower.includes("doctor")) {
        detectedCategory = "Dental Clinic";
      } else {
        detectedCategory = userText.split(/[.,]/)[0].trim() || "Business";
      }

      const updatedCtx: BusinessContext = {
        ...businessContext,
        businessCategory: detectedCategory,
        productsServices: userText,
        onboardingStep: "step2_business_name"
      };
      setBusinessContext(updatedCtx);

      const aiReply: ChatMessage = {
        id: `step-2-${Date.now()}`,
        role: "ai",
        content: `Got it! A ${detectedCategory} offering ${userText}. What is the name of your business?`
      };

      setMessages((prev) => [...prev, aiReply]);
      saveStateToStorage(sessionId, updatedCtx, [...messages, { id: `${Date.now()}`, role: "user", content: userText }, aiReply], generatedSiteData);
      return;
    }

    // STEP 2: Ask business name -> Got answer -> Transition to Step 3
    if (currentStep === "step2_business_name") {
      const bName = userText.replace(/^(my business name is|it is called|the name is|name:|it's)\s*/i, "").trim();

      const updatedCtx: BusinessContext = {
        ...businessContext,
        businessName: bName,
        onboardingStep: "step3_design_preference"
      };
      setBusinessContext(updatedCtx);

      const aiReply: ChatMessage = {
        id: `step-3-${Date.now()}`,
        role: "ai",
        content: `Nice to meet you, ${bName}! Would you like me to recommend curated design templates tailored for your ${updatedCtx.businessCategory || "business"}, or build directly?`,
        options: [
          { label: "✨ Recommend Designs", action: "recommend_designs" },
          { label: "⚡ Build Directly", action: "build_directly" }
        ]
      };

      setMessages((prev) => [...prev, aiReply]);
      saveStateToStorage(sessionId, updatedCtx, [...messages, { id: `${Date.now()}`, role: "user", content: userText }, aiReply], generatedSiteData);
      return;
    }

    // STEP 3: Design Preference ("Recommend Designs" vs "Build Directly") -> Transition to Step 4 or 5
    if (currentStep === "step3_design_preference") {
      const wantsTemplates = actionData?.action === "recommend_designs" || lower.includes("recommend") || lower.includes("design") || lower.includes("explore");

      if (wantsTemplates) {
        const templates = getTemplatesForCategory(businessContext.businessCategory);

        const updatedCtx: BusinessContext = {
          ...businessContext,
          designPreference: "recommend",
          onboardingStep: "step4_template_selection"
        };
        setBusinessContext(updatedCtx);

        const aiReply: ChatMessage = {
          id: `step-4-${Date.now()}`,
          role: "ai",
          type: "template_selection",
          content: `Here are 3 handpicked templates designed specifically for a ${businessContext.businessCategory || "business"} like ${businessContext.businessName || "yours"}. Which design do you prefer?`,
          options: templates.map((t) => ({
            id: t.id,
            name: t.name,
            label: `${t.name} (${t.tag})`,
            description: t.description,
            action: "select_template"
          }))
        };

        setMessages((prev) => [...prev, aiReply]);
        saveStateToStorage(sessionId, updatedCtx, [...messages, { id: `${Date.now()}`, role: "user", content: userText }, aiReply], generatedSiteData);
        return;
      } else {
        // Direct build
        const defaultTemplates = getTemplatesForCategory(businessContext.businessCategory);
        const autoSelected = defaultTemplates[0];

        const updatedCtx: BusinessContext = {
          ...businessContext,
          designPreference: "direct",
          selectedTemplateId: autoSelected.id,
          selectedTemplateName: autoSelected.name,
          onboardingStep: "step5_industry_questions"
        };
        setBusinessContext(updatedCtx);

        const q = getIndustrySpecificQuestion(businessContext.businessCategory, businessContext.businessName);
        const aiReply: ChatMessage = {
          id: `step-5-${Date.now()}`,
          role: "ai",
          content: `Great! We'll use the ${autoSelected.name} layout. ${q}`
        };

        setMessages((prev) => [...prev, aiReply]);
        saveStateToStorage(sessionId, updatedCtx, [...messages, { id: `${Date.now()}`, role: "user", content: userText }, aiReply], generatedSiteData);
        return;
      }
    }

    // STEP 4: Template Selection -> Got selection -> Ask Step 5 industry question
    if (currentStep === "step4_template_selection") {
      const templateId = actionData?.templateId || "floral-elegance";
      const templateName = actionData?.templateName || userText.replace(/^(i select the|select)\s*/i, "").replace(/\s*template\.?$/i, "");

      const updatedCtx: BusinessContext = {
        ...businessContext,
        selectedTemplateId: templateId,
        selectedTemplateName: templateName,
        onboardingStep: "step5_industry_questions"
      };
      setBusinessContext(updatedCtx);

      const q = getIndustrySpecificQuestion(businessContext.businessCategory, businessContext.businessName);
      const aiReply: ChatMessage = {
        id: `step-5-${Date.now()}`,
        role: "ai",
        content: `Excellent choice! Selected "${templateName}". Now, to personalize your content: ${q}`
      };

      setMessages((prev) => [...prev, aiReply]);
      saveStateToStorage(sessionId, updatedCtx, [...messages, { id: `${Date.now()}`, role: "user", content: userText }, aiReply], generatedSiteData);
      return;
    }

    // STEP 5: Additional business-specific question -> Got answer -> Step 5b (Ask about logo)
    if (currentStep === "step5_industry_questions") {
      const updatedCtx: BusinessContext = {
        ...businessContext,
        industryDetails: userText,
        onboardingStep: "step5_logo_check"
      };
      setBusinessContext(updatedCtx);

      const bName = updatedCtx.businessName || "your business";
      const logoQuestion = `Do you already have a logo for "${bName}", or would you like me to auto-generate a custom AI logo for your shop?`;

      const aiReply: ChatMessage = {
        id: `step-logo-${Date.now()}`,
        role: "ai",
        content: logoQuestion,
        options: [
          { label: "📁 I Have a Logo (Upload)", action: "upload_logo" },
          { label: "✨ Auto-Generate AI Logo", action: "generate_logo" },
          { label: "⚡ Continue with Monogram", action: "monogram_logo" }
        ]
      };

      setMessages((prev) => [...prev, aiReply]);
      saveStateToStorage(sessionId, updatedCtx, [...messages, { id: `${Date.now()}`, role: "user", content: userText }, aiReply], generatedSiteData);
      return;
    }

    // STEP 5b: Logo Check -> Upload or Auto-Generate -> Step 6 (Summarize & Confirm)
    if (currentStep === "step5_logo_check") {
      const bName = businessContext.businessName || "My Business";
      const bCat = businessContext.businessCategory || "Business";
      const primaryColor = businessContext.brandColors?.primary || "#4F46E5";

      if (actionData?.action === "upload_logo" && actionData?.base64) {
        const updatedCtx: BusinessContext = {
          ...businessContext,
          logo: actionData.base64,
          logoStatus: "uploaded",
          onboardingStep: "step6_confirmation"
        };
        setBusinessContext(updatedCtx);

        const summaryText = `Here is a summary of your website details:
• **Business**: ${updatedCtx.businessName || "My Business"} (${updatedCtx.businessCategory || "Business"})
• **Offerings**: ${updatedCtx.productsServices || "Standard products & services"}
• **Design Template**: ${updatedCtx.selectedTemplateName || "Modern Pro"}
• **Logo**: Uploaded Custom Logo
• **Special Features**: ${updatedCtx.industryDetails || "Standard"}

Shall I generate your custom website draft now?`;

        const aiReply: ChatMessage = {
          id: `step-6-${Date.now()}`,
          role: "ai",
          content: `Your logo for "${bName}" has been uploaded successfully!\n\n${summaryText}`,
          options: [
            { label: "🚀 Confirm & Generate Website", action: "confirm_and_generate" },
            { label: "✏️ Change Details", action: "change_details" }
          ]
        };

        setMessages((prev) => [...prev, aiReply]);
        saveStateToStorage(sessionId, updatedCtx, [...messages, { id: `${Date.now()}`, role: "user", content: userText }, aiReply], generatedSiteData);
        return;
      }

      const hasNegation = ["nahi", "nhi", "no", "not", "dont", "don't", "na", "without"].some((w) => lower.includes(w));
      const wantsGenerate = hasNegation || ["generate", "bana", "make", "create", "monogram", "skip", "auto", "new", "naya"].some((w) => lower.includes(w)) || actionData?.action === "generate_logo" || actionData?.action === "monogram_logo";
      const userHasLogo = !wantsGenerate && (["have", "upload", "paas hai", "mera logo", "file", "haan", "yes"].some((w) => lower.includes(w)) || actionData?.action === "upload_logo");

      if (userHasLogo) {
        fileInputRef.current?.click();
        const uploadPromptMsg: ChatMessage = {
          id: `upload-prompt-${Date.now()}`,
          role: "ai",
          content: `Please select and upload your logo file for "${bName}":`,
          options: [
            { label: "📁 Upload Logo File", action: "upload_logo" },
            { label: "✨ Auto-Generate AI Logo", action: "generate_logo" }
          ]
        };
        setMessages((prev) => [...prev, uploadPromptMsg]);
        return;
      }

      // Auto-generate customized SVG logo
      const generatedLogo = generateDynamicSvgLogo(bName, bCat, primaryColor);
      const updatedCtx: BusinessContext = {
        ...businessContext,
        logo: generatedLogo,
        logoStatus: "generated",
        onboardingStep: "step6_confirmation"
      };
      setBusinessContext(updatedCtx);

      const summaryText = `Here is a summary of your website details:
• **Business**: ${updatedCtx.businessName || "My Business"} (${updatedCtx.businessCategory || "Business"})
• **Offerings**: ${updatedCtx.productsServices || "Standard products & services"}
• **Design Template**: ${updatedCtx.selectedTemplateName || "Modern Pro"}
• **Logo**: AI Generated Custom Logo Ready
• **Special Features**: ${updatedCtx.industryDetails || "Standard"}

Shall I generate your custom website draft now?`;

      const aiReply: ChatMessage = {
        id: `step-6-${Date.now()}`,
        role: "ai",
        content: `I've generated a stylish custom logo for "${bName}"!\n\n${summaryText}`,
        options: [
          { label: "🚀 Confirm & Generate Website", action: "confirm_and_generate" },
          { label: "✏️ Change Details", action: "change_details" }
        ]
      };

      setMessages((prev) => [...prev, aiReply]);
      saveStateToStorage(sessionId, updatedCtx, [...messages, { id: `${Date.now()}`, role: "user", content: userText }, aiReply], generatedSiteData);
      return;
    }

    // STEP 6: Confirmation -> Generate
    if (currentStep === "step6_confirmation") {
      if (actionData?.action === "change_details" || lower.includes("change") || lower.includes("edit")) {
        const resetToStep2: BusinessContext = {
          ...businessContext,
          onboardingStep: "step2_business_name"
        };
        setBusinessContext(resetToStep2);
        const aiReply: ChatMessage = {
          id: `redo-step-2-${Date.now()}`,
          role: "ai",
          content: "No problem! What would you like your business name to be?"
        };
        setMessages((prev) => [...prev, aiReply]);
        return;
      }

      await triggerWebsiteGeneration();
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                       WEBSITE GENERATION TRIGGER (REQ 3)                   */
  /* -------------------------------------------------------------------------- */

  const triggerWebsiteGeneration = async () => {
    setIsGenerating(true);
    setLoading(true);
    setGenerationProgress(["Analyzing business requirements & design preferences"]);

    const category = businessContext.businessCategory || "Business";
    const bName = businessContext.businessName || "My Business";
    const tId = businessContext.selectedTemplateId || "floral-elegance";
    const tName = businessContext.selectedTemplateName || "Curated Template";
    const details = businessContext.industryDetails || "";
    const offerings = businessContext.productsServices || "";

    let pages: any[] = [];
    const isFlower = category.toLowerCase().includes("flower") || category.toLowerCase().includes("florist");
    const isGym = category.toLowerCase().includes("gym") || category.toLowerCase().includes("fitness");
    const isRestaurant = category.toLowerCase().includes("restaurant") || category.toLowerCase().includes("food") || category.toLowerCase().includes("cafe");
    const isClothing = category.toLowerCase().includes("cloth") || category.toLowerCase().includes("boutique") || category.toLowerCase().includes("fashion");

    if (isFlower) {
      pages = [
        {
          name: "Home",
          sections: [
            {
              type: "hero",
              title: `Fresh Floral Artistry at ${bName}`,
              subtitle: `Handcrafted bouquets, seasonal blooms, and tailored event styling. ${details ? details : "Delivering beauty to every doorstep."}`,
              cta: "Order Fresh Bouquets",
              secondary_cta: "Our Story"
            },
            {
              type: "products",
              title: "Signature Bouquets & Arrangements",
              subtitle: "Freshly cut and arranged with care every morning",
              items: [
                { title: "Velvet Red Roses", description: "Premium long-stem red roses in luxury box wrapping.", price: "$45" },
                { title: "Springtime Tulips", description: "Crisp, vibrant assorted seasonal tulips.", price: "$35" },
                { title: "Orchid & Lily Symphony", description: "Exotic white lilies paired with gentle orchids.", price: "$55" },
                { title: "Pastel Meadow Bouquet", description: "Soft romantic wildflowers for birthdays & celebrations.", price: "$40" },
                { title: "Custom Wedding Styling", description: "Bridal bouquets and celebration centerpieces.", price: "Custom" },
                { title: "Botanical Potted Plant", description: "Long-lasting indoor greenery in ceramic pot.", price: "$30" }
              ]
            },
            {
              type: "features",
              title: "The Bloom Garden Promise",
              subtitle: "Why our customers adore our flowers",
              items: [
                { title: "Same-Day Delivery", description: "Hand-delivered in water packs to maintain peak freshness." },
                { title: "Direct from Farms", description: "Ethically sourced blooms picked at optimal blossom times." },
                { title: "Artisan Florists", description: "Every stem carefully arranged by seasoned floristry artists." }
              ]
            },
            {
              type: "gallery",
              title: "Our Floral Gallery",
              subtitle: "A glimpse into our recent floral creations",
              items: [
                { title: "Bridal Roses" },
                { title: "Seasonal Blossom" },
                { title: "Pastel Bouquet" },
                { title: "Boutique Display" }
              ]
            },
            {
              type: "about",
              title: `The Story of ${bName}`,
              subtitle: "Passion for botanical elegance",
              description: `${bName} was founded with a single mission: bringing everyday happiness through nature's most delicate blossoms. Whether celebrating milestones or brightening quiet days, our flowers speak directly to the heart.`
            },
            {
              type: "contact",
              title: "Visit Our Flower Shop",
              subtitle: "Stop by our storefront or place your order online."
            }
          ]
        }
      ];
    } else if (isGym) {
      pages = [
        {
          name: "Home",
          sections: [
            {
              type: "hero",
              title: `Transform Your Body at ${bName}`,
              subtitle: `Premier strength training, dynamic group fitness, and world-class equipment. ${details ? details : "Join the ultimate community."}`,
              cta: "Claim Free Day Pass",
              secondary_cta: "View Memberships"
            },
            {
              type: "programs",
              title: "Training Programs & Classes",
              subtitle: "Engineered for maximum athletic performance",
              items: [
                { title: "Functional Strength & Barbell", description: "Core compound lifts and progressive overload.", price: "$75/mo" },
                { title: "High-Intensity Interval Training", description: "Calorie-burning cardio and metabolic conditioning.", price: "$65/mo" },
                { title: "Personal Coaching", description: "1-on-1 customized workout and nutrition roadmaps.", price: "$50/session" },
                { title: "Mobility & Athletic Recovery", description: "Dynamic stretching, foam rolling, and injury prevention.", price: "Included" }
              ]
            },
            {
              type: "facilities",
              title: "World-Class Gym Facilities",
              subtitle: "Everything you need to surpass your goals",
              items: [
                { title: "Olympic Lifting Platforms", description: "Certified competition bars and bumper plates." },
                { title: "Cardio & Turf Track", description: "Sled tracks, assault bikes, and curved treadmills." },
                { title: "Sauna & Cold Plunge", description: "Rapid muscle recovery and wellness facilities." }
              ]
            },
            {
              type: "gallery",
              title: "Workout Gallery",
              subtitle: "Glimpses of our high-energy workout floor",
              items: [
                { title: "Heavy Deadlifts" },
                { title: "Kettlebell Conditioning" },
                { title: "Turf Sprinting" },
                { title: "Locker & Recovery" }
              ]
            },
            {
              type: "contact",
              title: "Start Your Fitness Journey",
              subtitle: "Visit our front desk for a guided tour or sign up online."
            }
          ]
        }
      ];
    } else if (isRestaurant) {
      pages = [
        {
          name: "Home",
          sections: [
            {
              type: "hero",
              title: `Authentic Flavors at ${bName}`,
              subtitle: `Handcrafted cuisine, cozy ambiance, and unforgettable culinary experiences. ${details ? details : "Reserved for genuine food lovers."}`,
              cta: "Reserve a Table",
              secondary_cta: "Explore Menu"
            },
            {
              type: "menu",
              title: "Chef's Signature Menu",
              subtitle: "Prepared fresh daily using authentic local ingredients",
              items: [
                { title: "Artisan Truffle Pasta", description: "Handmade tagliolini with shaved black truffles & aged parmesan.", price: "$24" },
                { title: "Wood-Fired Margherita", description: "San Marzano tomatoes, buffalo mozzarella, and fresh basil.", price: "$18" },
                { title: "Charred Prime Ribeye", description: "Rosemary garlic butter, roasted asparagus, and potato puree.", price: "$36" },
                { title: "Signature Tiramisu", description: "Espresso soaked savoiardi and whipped mascarpone cream.", price: "$12" }
              ]
            },
            {
              type: "gallery",
              title: "Culinary Gallery",
              subtitle: "A visual preview of our dishes and dining room",
              items: [
                { title: "Signature Dish" },
                { title: "Dining Room" },
                { title: "Chef Plating" },
                { title: "Dessert Special" }
              ]
            },
            {
              type: "about",
              title: `The Heritage of ${bName}`,
              subtitle: "Craftsmanship in every bite",
              description: `At ${bName}, our kitchen honors centuries of traditional culinary techniques combined with modern gastronomy. Every plate reflects our commitment to exceptional ingredients and warm hospitality.`
            },
            {
              type: "contact",
              title: "Reservations & Location",
              subtitle: "Book your table online or call us directly."
            }
          ]
        }
      ];
    } else {
      pages = [
        {
          name: "Home",
          sections: [
            {
              type: "hero",
              title: `${bName} - Exceptional ${category}`,
              subtitle: `${offerings}. ${details ? details : "Dedicated to superior quality and client satisfaction."}`,
              cta: "Get In Touch",
              secondary_cta: "Our Services"
            },
            {
              type: "features",
              title: "What We Offer",
              subtitle: "Tailored solutions for your everyday needs",
              items: [
                { title: "Premium Quality", description: "Crafted to meet the highest industry benchmarks." },
                { title: "Customer Focused", description: "Dedicated support and individualized attention." },
                { title: "Fast Delivery", description: "Dependable, prompt, and hassle-free execution." }
              ]
            },
            {
              type: "about",
              title: `About ${bName}`,
              description: `${bName} was founded to provide outstanding ${category} services. We prioritize trust, high standards, and long-term customer relationships.`
            },
            {
              type: "contact",
              title: "Connect With Us",
              subtitle: "Send us a message or schedule a consultation."
            }
          ]
        }
      ];
    }

    const sitePrimaryColor = isFlower ? "#E11D48" : isGym ? "#DC2626" : isRestaurant ? "#D97706" : isClothing ? "#7C3AED" : "#4F46E5";
    const activeLogo = businessContext.logo || generateDynamicSvgLogo(bName, category, sitePrimaryColor);

    const generatedSite: GeneratedSiteData = {
      business_name: bName,
      business_category: category,
      template_id: tId,
      template_name: tName,
      logo: activeLogo,
      theme: {
        primary: sitePrimaryColor,
        secondary: isFlower ? "#BE123C" : isGym ? "#B91C1C" : isRestaurant ? "#B45309" : isClothing ? "#6D28D9" : "#4338CA",
        accent: "#EC4899",
        font: "Outfit"
      },
      pages
    };

    try {
      if (sessionId && /^[0-9a-fA-F]{24}$/.test(sessionId)) {
        try {
          const res = await websiteBuilderService.sendMessage(sessionId, "Generate website", {
            action: "generate",
            templateId: tId,
            templateName: tName,
            business_name: bName,
            business_category: category,
            industry_details: details
          });
          if (res?.generatedSiteData) {
            const merged: GeneratedSiteData = {
              ...generatedSite,
              ...res.generatedSiteData,
              pages: res.generatedSiteData.pages && res.generatedSiteData.pages.length > 0 ? res.generatedSiteData.pages : generatedSite.pages
            };
            setGeneratedSiteData(merged);
            saveStateToStorage(sessionId, { ...businessContext, onboardingStep: "step7_generated" }, messages, merged);
            recordVersion(merged, "Generated Website");
            setSiteId(res.siteId || null);
            setIsGenerating(false);
            setLoading(false);
            setActiveMobileView("preview");
            return;
          }
        } catch (apiErr) {
          console.warn("Backend generate API fallback to frontend engine", apiErr);
        }
      }

      setGeneratedSiteData(generatedSite);
      const updatedCtx: BusinessContext = { ...businessContext, onboardingStep: "step7_generated" };
      setBusinessContext(updatedCtx);

      const successMsg: ChatMessage = {
        id: `generated-${Date.now()}`,
        role: "ai",
        content: `🎉 Congratulations! Your custom ${category} website for **${bName}** has been generated! Check out the live preview on the right. What would you like to tweak (e.g. "Change hero image", "Update website colors", "Add a section")?`
      };

      setMessages((prev) => [...prev, successMsg]);
      saveStateToStorage(sessionId, updatedCtx, [...messages, successMsg], generatedSite);
      recordVersion(generatedSite, "Initial Generated Website");
      window.dispatchEvent(new Event("credit-update"));
      setCreditDeductionToast("⚡ 10 Credits deducted for AI Website Generation");
      setTimeout(() => setCreditDeductionToast(null), 5000);
      setActiveMobileView("preview");
    } finally {
      setIsGenerating(false);
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                  NATURAL WEBSITE EDITING & REVISION (REQ 5)                */
  /* -------------------------------------------------------------------------- */

  const applyLocalPrecisionEdit = (instruction: string) => {
    if (!generatedSiteData) return;
    const lower = instruction.toLowerCase();
    const updatedSite: GeneratedSiteData = JSON.parse(JSON.stringify(generatedSiteData));
    let appliedChangeDesc = "Updated your website.";

    // 0. Update or Generate Logo
    if (lower.includes("logo") || lower.includes("monogram") || lower.includes("لوगो") || lower.includes("लोगो")) {
      const bCat = updatedSite.business_category || businessContext.businessCategory || "Business";
      const bName = updatedSite.business_name || businessContext.businessName || "My Business";
      const primColor = updatedSite.theme?.primary || "#4F46E5";
      const newLogo = generateDynamicSvgLogo(bName, bCat, primColor);

      updatedSite.logo = newLogo;
      if (updatedSite.pages) {
        updatedSite.pages.forEach((p: any) => {
          if (p.sections) {
            p.sections.forEach((s: any) => {
              if (s.type === "navbar" || s.type === "footer") {
                s.logo = newLogo;
              }
            });
          }
        });
      }
      appliedChangeDesc = `Generated and applied a brand new category-tailored logo for "${bName}". It is now clearly visible in your website header and footer.`;
    }

    // 1. Change Button Styling / Button Colors
    else if (lower.includes("button") || lower.includes("btn") || lower.includes("बटन")) {
      if (!updatedSite.theme) updatedSite.theme = {};

      const hexMatch = instruction.match(/#(?:[0-9a-fA-F]{3}){1,2}\b/);
      let btnBg = hexMatch ? hexMatch[0] : "";
      if (!btnBg) {
        if (lower.includes("emerald") || lower.includes("green")) btnBg = "#059669";
        else if (lower.includes("blue") || lower.includes("ocean")) btnBg = "#0284C7";
        else if (lower.includes("indigo")) btnBg = "#4F46E5";
        else if (lower.includes("rose") || lower.includes("red")) btnBg = "#DC2626";
        else if (lower.includes("orange") || lower.includes("coral")) btnBg = "#EA580C";
        else if (lower.includes("amber") || lower.includes("gold") || lower.includes("yellow")) btnBg = "#D97706";
        else if (lower.includes("purple") || lower.includes("violet")) btnBg = "#7C3AED";
        else if (lower.includes("pink")) btnBg = "#EC4899";
        else if (lower.includes("black") || lower.includes("dark")) btnBg = "#18181B";
      }
      if (btnBg) {
        updatedSite.theme.button_color = btnBg;
        updatedSite.theme.buttonColor = btnBg;
      }

      if (lower.includes("white text") || lower.includes("text white")) {
        updatedSite.theme.button_text_color = "#ffffff";
      } else if (lower.includes("dark text") || lower.includes("black text")) {
        updatedSite.theme.button_text_color = "#111827";
      }

      if (lower.includes("pill") || lower.includes("capsule") || lower.includes("rounded-full")) {
        updatedSite.theme.button_radius = "9999px";
      } else if (lower.includes("square") || lower.includes("sharp")) {
        updatedSite.theme.button_radius = "0px";
      } else if (lower.includes("rounded") || lower.includes("soft")) {
        updatedSite.theme.button_radius = "12px";
      }

      appliedChangeDesc = "Updated button colors and styling.";
    }

    // 2. Change Font Theme / Typography
    else if (lower.includes("font") || lower.includes("typeface") || lower.includes("typography") || lower.includes("फ़ॉन्ट") || lower.includes("फॉन्ट")) {
      if (!updatedSite.theme) updatedSite.theme = {};
      let chosenFont = "Outfit";
      if (lower.includes("poppins")) chosenFont = "Poppins";
      else if (lower.includes("inter")) chosenFont = "Inter";
      else if (lower.includes("playfair")) chosenFont = "Playfair Display";
      else if (lower.includes("montserrat")) chosenFont = "Montserrat";
      else if (lower.includes("roboto")) chosenFont = "Roboto";
      else if (lower.includes("jakarta")) chosenFont = "Plus Jakarta Sans";
      else if (lower.includes("cinzel")) chosenFont = "Cinzel";
      else if (lower.includes("lato")) chosenFont = "Lato";
      else if (lower.includes("serif")) chosenFont = "Playfair Display";
      else if (lower.includes("sans")) chosenFont = "Inter";

      updatedSite.theme.font = chosenFont;
      updatedSite.theme.font_family = chosenFont;
      appliedChangeDesc = `Updated the font theme to ${chosenFont}.`;
    }

    // 3. Change theme color
    else if (lower.includes("color") || lower.includes("theme") || lower.includes("background") || lower.includes("rang") || lower.includes("रंग")) {
      const hexMatch = instruction.match(/#(?:[0-9a-fA-F]{3}){1,2}\b/);
      let detectedColor = hexMatch ? hexMatch[0] : "";
      let detectedName = "";

      if (!detectedColor) {
        if (lower.includes("blue") || lower.includes("ocean") || lower.includes("नीला")) { detectedColor = "#0284C7"; detectedName = "Sapphire Blue"; }
        else if (lower.includes("emerald") || lower.includes("green") || lower.includes("हरा")) { detectedColor = "#059669"; detectedName = "Emerald Green"; }
        else if (lower.includes("purple") || lower.includes("violet") || lower.includes("बैंगनी")) { detectedColor = "#7C3AED"; detectedName = "Royal Purple"; }
        else if (lower.includes("red") || lower.includes("rose") || lower.includes("crimson") || lower.includes("लाल")) { detectedColor = "#DC2626"; detectedName = "Crimson Red"; }
        else if (lower.includes("orange") || lower.includes("sunset") || lower.includes("संतरी") || lower.includes("नारंगी")) { detectedColor = "#EA580C"; detectedName = "Sunset Orange"; }
        else if (lower.includes("gold") || lower.includes("amber") || lower.includes("yellow") || lower.includes("पीला")) { detectedColor = "#D97706"; detectedName = "Warm Amber"; }
        else if (lower.includes("black") || lower.includes("dark") || lower.includes("काला")) { detectedColor = "#18181B"; detectedName = "Minimal Dark"; }
        else if (lower.includes("indigo")) { detectedColor = "#4F46E5"; detectedName = "Modern Indigo"; }
        else if (lower.includes("teal")) { detectedColor = "#0D9488"; detectedName = "Teal"; }
        else if (lower.includes("cyan")) { detectedColor = "#06B6D4"; detectedName = "Cyan"; }
        else if (lower.includes("pink") || lower.includes("गुलाबी")) { detectedColor = "#EC4899"; detectedName = "Pink"; }
      }

      // If user asks to update/change color without naming a specific color, prompt them with color options!
      if (!detectedColor) {
        const askColorMsg: ChatMessage = {
          id: `ask-color-${Date.now()}`,
          role: "ai",
          content: "Which color would you like for your website? You can pick from the curated palettes below or open the custom color picker:",
          options: [
            { label: "🔵 Sapphire Blue", action: "set_theme_color", color: "#0284C7", name: "Sapphire Blue" },
            { label: "🟣 Royal Purple", action: "set_theme_color", color: "#7C3AED", name: "Royal Purple" },
            { label: "🟠 Sunset Orange", action: "set_theme_color", color: "#EA580C", name: "Sunset Orange" },
            { label: "🔴 Crimson Red", action: "set_theme_color", color: "#DC2626", name: "Crimson Red" },
            { label: "🟢 Emerald Green", action: "set_theme_color", color: "#059669", name: "Emerald Green" },
            { label: "⚫ Minimal Dark", action: "set_theme_color", color: "#18181B", name: "Minimal Dark" },
            { label: "🎨 Open Color Customizer", action: "open_theme_modal", tab: "colors" }
          ]
        };
        setMessages((prev) => [...prev, askColorMsg]);
        return;
      }

      if (!updatedSite.theme) updatedSite.theme = {};
      updatedSite.theme.primary = detectedColor;
      updatedSite.theme.secondary = detectedColor;
      if (!updatedSite.theme.button_color) {
        updatedSite.theme.button_color = detectedColor;
      }
      appliedChangeDesc = `Updated the primary theme color to ${detectedName || detectedColor}.`;
    }

    // 2. Change hero image
    else if (lower.includes("hero image") || lower.includes("header image") || lower.includes("cover image")) {
      const heroSection = updatedSite.pages?.[0]?.sections?.find((s: any) => s.type === "hero");
      if (heroSection) {
        const bCat = updatedSite.business_category || businessContext.businessCategory || "business";
        const bName = updatedSite.business_name || businessContext.businessName || "My Business";
        heroSection.image_url = resolveImageUrl(
          undefined,
          bCat,
          "hero",
          `${bName} ${bCat} professional photography daylight high resolution`,
          bName
        );
        appliedChangeDesc = `Updated the hero image with fresh photography tailored to ${bName} (${bCat}).`;
      }
    }

    // 3. Change product/bouquets images
    else if (lower.includes("image") || lower.includes("photo") || lower.includes("picture")) {
      const bCat = updatedSite.business_category || businessContext.businessCategory || "business";
      const bName = updatedSite.business_name || businessContext.businessName || "My Business";
      const prodSection = updatedSite.pages?.[0]?.sections?.find(
        (s: any) => s.type === "products" || s.type === "bouquets" || s.type === "menu" || s.type === "features"
      );
      if (prodSection?.items) {
        prodSection.items.forEach((item: any, i: number) => {
          item.image_url = resolveImageUrl(
            undefined,
            bCat,
            prodSection.type,
            `${item.title} ${bCat} ${i}`,
            bName
          );
        });
        appliedChangeDesc = `Replaced section images with new category-matched imagery for ${bCat}.`;
      }
    }

    // 4. Update hero title/headline
    else if (lower.includes("hero") || lower.includes("headline") || lower.includes("punchier")) {
      const heroSection = updatedSite.pages?.[0]?.sections?.find((s: any) => s.type === "hero");
      if (heroSection) {
        heroSection.title = `The Finest ${updatedSite.business_category || "Offerings"} at ${updatedSite.business_name}`;
        heroSection.subtitle = "Handcrafted with unmatched care, devotion, and beauty for every occasion.";
        appliedChangeDesc = "Refined the hero section headline and subtitle to be more captivating.";
      }
    }

    // 5. Expand Homepage Content
    else if (
      lower.includes("content") ||
      lower.includes("homepage") ||
      lower.includes("home page") ||
      lower.includes("more") ||
      lower.includes("richer") ||
      lower.includes("aur content") ||
      lower.includes("zyada content")
    ) {
      appliedChangeDesc = `Enriched your Homepage with key business metrics, signature highlights, brand story preview, customer reviews, frequently asked questions, and a high-converting call-to-action banner!`;
    }

    // 6. Add a section (e.g. Gallery)
    else if (lower.includes("gallery") || lower.includes("add")) {
      const existingGallery = updatedSite.pages?.[0]?.sections?.find((s: any) => s.type === "gallery");
      if (!existingGallery) {
        updatedSite.pages?.[0]?.sections?.push({
          type: "gallery",
          title: "Featured Gallery",
          subtitle: "Explore our latest work and creations",
          items: [
            { title: "Highlight One" },
            { title: "Highlight Two" },
            { title: "Highlight Three" },
            { title: "Highlight Four" }
          ]
        });
        appliedChangeDesc = "Added a new visual gallery showcase section.";
      } else {
        appliedChangeDesc = "Refreshed the gallery section items.";
      }
    }

    setGeneratedSiteData(updatedSite);
    recordVersion(updatedSite, `Edit: ${instruction.slice(0, 20)}`);
    saveStateToStorage(sessionId, businessContext, messages, updatedSite);

    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        role: "ai",
        content: `✨ ${appliedChangeDesc} Your live preview on the right has been updated.`
      }
    ]);
  };

  const handleWebsiteModification = async (instruction: string, force = false) => {
    if (!generatedSiteData) {
      setLoading(false);
      return;
    }

    // Client-side conflict pre-check if not forcing
    if (!force) {
      const conflict = checkCategoryConflict(
        instruction,
        generatedSiteData.business_category || businessContext.businessCategory || "Business"
      );
      if (conflict.hasConflict) {
        const conflictMsg: ChatMessage = {
          id: `conflict-${Date.now()}`,
          role: "ai",
          content: `⚠️ ${conflict.reason} Would you like me to apply this anyway, or keep your website aligned with your ${
            generatedSiteData.business_category || "current"
          } theme?`,
          options: [
            { label: "Proceed anyway", action: "force_edit", instruction },
            { label: "Cancel & keep theme", action: "cancel_edit" }
          ]
        };
        setMessages((prev) => [...prev, conflictMsg]);
        setLoading(false);
        return;
      }
    }

    if (sessionId && /^[0-9a-fA-F]{24}$/.test(sessionId)) {
      try {
        const editRes = await websiteBuilderService.editWebsite(sessionId, instruction, generatedSiteData);
        if (editRes) {
          if (editRes.action === "ask_color") {
            const askMsg: ChatMessage = {
              id: `color-${Date.now()}`,
              role: "ai",
              content: editRes.message,
              options: editRes.options
            };
            setMessages((prev) => [...prev, askMsg]);
            setLoading(false);
            return;
          }

          if (editRes.action === "clarification_required" && !force) {
            const conflictMsg: ChatMessage = {
              id: `conflict-${Date.now()}`,
              role: "ai",
              content: `⚠️ ${editRes.message} Would you like me to apply this anyway, or keep your website aligned with your theme?`,
              options: [
                { label: "Proceed anyway", action: "force_edit", instruction },
                { label: "Cancel & keep theme", action: "cancel_edit" }
              ]
            };
            setMessages((prev) => [...prev, conflictMsg]);
            setLoading(false);
            return;
          }

          if (editRes.updated_state && editRes.action !== "error") {
            setGeneratedSiteData(editRes.updated_state);
            recordVersion(editRes.updated_state, `Edit: ${instruction.slice(0, 20)}`);
            saveStateToStorage(sessionId, businessContext, messages, editRes.updated_state);
            setMessages((prev) => [
              ...prev,
              {
                id: `edit-${Date.now()}`,
                role: "ai",
                content: editRes.message || "I've updated the website according to your instruction."
              }
            ]);
            setCreditDeductionToast("✨ Website updated via AI Edit");
            setTimeout(() => setCreditDeductionToast(null), 4000);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Backend editWebsite fallback to local precision editor", err);
      }
    }

    applyLocalPrecisionEdit(instruction);
    setLoading(false);
  };

  /* -------------------------------------------------------------------------- */
  /*                            MAIN SEND HANDLER                               */
  /* -------------------------------------------------------------------------- */

  const handleSend = async (customMessage?: string, dataPayload?: any) => {
    const textToSend = (customMessage !== undefined ? customMessage : input).trim();
    if (!textToSend && !dataPayload) return;

    // Direct action for Brand Kit redirect
    if (dataPayload?.action === "open_brand_kit") {
      window.open("/brand-kit", "_blank");
      return;
    }

    const lower = textToSend.toLowerCase();

    if (lower === "new project" || lower === "start over" || lower === "clear" || lower === "start fresh") {
      await handleClear();
      return;
    }

    const userMsg: ChatMessage = {
      id: `${Date.now()}`,
      role: "user",
      content:
        textToSend ||
        (dataPayload?.templateName
          ? `Selected ${dataPayload.templateName}`
          : dataPayload?.label || "Continue"),
      data: dataPayload
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // If website is already generated, route instructions to edit engine
    if (
      generatedSiteData &&
      businessContext.onboardingStep === "step7_generated" &&
      !dataPayload?.action?.startsWith("step") &&
      dataPayload?.action !== "edit_details"
    ) {
      if (dataPayload?.action === "force_edit") {
        await handleWebsiteModification(dataPayload.instruction || textToSend, true);
        return;
      }
      if (dataPayload?.action === "cancel_edit") {
        setMessages((prev) => [
          ...prev,
          { id: `${Date.now()}`, role: "ai", content: "Understood! Maintained your existing website theme." }
        ]);
        setLoading(false);
        return;
      }
      await handleWebsiteModification(textToSend, false);
      return;
    }

    // Onboarding flow: delegate to backend process_chat
    try {
      if (sessionId && /^[0-9a-fA-F]{24}$/.test(sessionId)) {
        if (dataPayload?.action === "generate" || dataPayload?.action === "confirm_and_generate") {
          setIsGenerating(true);
        }

        const res = await websiteBuilderService.sendMessage(sessionId, textToSend, dataPayload);

        if (res) {
          if (res.siteId) {
            setSiteId(res.siteId);
          }

          if (res.generatedSiteData) {
            setGeneratedSiteData(res.generatedSiteData);
            recordVersion(res.generatedSiteData, "Generated Website");
            setActiveMobileView("preview");
            window.dispatchEvent(new Event("credit-update"));
            setCreditDeductionToast("⚡ 10 Credits deducted for AI Website Generation");
            setTimeout(() => setCreditDeductionToast(null), 5000);

            if (res.generatedSiteData.business_name) {
              setBusinessContext((prev) => ({
                ...prev,
                businessName: res.generatedSiteData?.business_name,
                businessCategory: res.generatedSiteData?.business_category,
                selectedTemplateId: res.generatedSiteData?.template_id,
                selectedTemplateName: res.generatedSiteData?.template_name,
                onboardingStep: "step7_generated"
              }));
            }
          }

          if (res.messages && res.messages.length > 0) {
            setMessages(res.messages);
            saveStateToStorage(
              sessionId,
              businessContext,
              res.messages,
              res.generatedSiteData || generatedSiteData
            );
          } else if (res.message) {
            const aiMsg: ChatMessage = {
              id: `ai-${Date.now()}`,
              role: "ai",
              content: res.message,
              type: res.type as any,
              data: res.data
            };
            setMessages((prev) => [...prev, aiMsg]);
          }

          if (res.data?.category || res.data?.business_category) {
            setBusinessContext((prev) => ({
              ...prev,
              businessCategory: res.data.category || res.data.business_category
            }));
          }
          if (res.data?.business_name) {
            setBusinessContext((prev) => ({
              ...prev,
              businessName: res.data.business_name
            }));
          }
        }
      } else {
        await advanceOnboarding(textToSend, dataPayload);
      }
    } catch (err: any) {
      console.warn("Website builder sendMessage backend error, using local advance fallback:", err);
      await advanceOnboarding(textToSend, dataPayload);
    } finally {
      setIsGenerating(false);
      setLoading(false);
    }
  };

  const handleOptionSelect = (option: any) => {
    if (option.action === "set_theme_color" && option.color) {
      updateWebsiteTheme({ primary: option.color, secondary: option.secondary || option.color }, `Theme Color: ${option.name || option.color}`);
      setMessages((prev) => [
        ...prev,
        {
          id: `color-${Date.now()}`,
          role: "ai",
          content: `✨ Updated the primary theme color to ${option.name || option.color}. Your live preview on the right has been updated.`
        }
      ]);
      return;
    }
    if (option.action === "open_theme_modal") {
      setShowThemeModal(true);
      if (option.tab) setThemeActiveTab(option.tab);
      return;
    }
    if (option.action === "upload_logo") {
      fileInputRef.current?.click();
      return;
    }
    if (option.action === "open_brand_kit") {
      window.open("/brand-kit", "_blank");
      return;
    }
    if (option.action === "check_logo_again") {
      handleSend("I have created my logo in Brand Kit", { action: "check_logo_again" });
      return;
    }
    if (option.action === "recommend" || option.action === "recommend_designs") {
      handleSend("Recommend design templates", { action: "recommend" });
      return;
    }
    if (option.action === "build_directly") {
      handleSend("Build directly", { action: "build_directly" });
      return;
    }
    if (option.action === "select_template") {
      handleSend(`I select the ${option.name || option.label} template.`, {
        action: "select_template",
        templateId: option.id,
        templateName: option.name
      });
      return;
    }
    if (option.action === "generate" || option.action === "confirm_and_generate") {
      handleSend("Confirm and generate website", { action: "generate" });
      return;
    }
    if (option.action === "edit_details" || option.action === "change_details") {
      handleSend("I want to edit details", { action: "edit_details" });
      return;
    }
    handleSend(option.label || option.name, { action: option.action, ...option });
  };

  /* -------------------------------------------------------------------------- */
  /*                             FINALIZATION & EXPORTS                         */
  /* -------------------------------------------------------------------------- */

  const handleFinalizeWebsite = async () => {
    if (!generatedSiteData) return;
    try {
      setLoading(true);
      if (sessionId && /^[0-9a-fA-F]{24}$/.test(sessionId)) {
        await websiteBuilderService.finalizeWebsite(sessionId);
      }
      setIsFinalized(true);
      setCreditDeductionToast("🎉 Website Finalized! All sections locked and ready for export.");
      window.dispatchEvent(new Event("credit-update"));
      setTimeout(() => setCreditDeductionToast(null), 5000);
    } catch (e) {
      setIsFinalized(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreVersion = async (targetVersion: number) => {
    const found = versionHistory.find((v) => v.version === targetVersion);
    if (!found) return;

    setGeneratedSiteData(found.data);
    setCurrentVersion(targetVersion);
    setShowVersionDropdown(false);
    saveStateToStorage(sessionId, businessContext, messages, found.data);

    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        role: "ai",
        content: `🔄 Restored website to Version ${targetVersion} (${found.label}).`
      }
    ]);
  };

  const handleExportZip = async () => {
    if (!generatedSiteData) return;
    setExportLoading("zip");
    try {
      const htmlContent = generateHtmlFromJSON(generatedSiteData);
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      zip.file("index.html", htmlContent);
      zip.file(
        "README.md",
        `# ${generatedSiteData.business_name || "Website"}\n\nGenerated with DhandaGrow AI.\nOpen index.html in any browser.`
      );
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(generatedSiteData.business_name || "website").toLowerCase().replace(/[^a-z0-9]/g, "_")}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("ZIP export error", e);
    } finally {
      setExportLoading(null);
    }
  };

  const handleExportPdf = async () => {
    if (!generatedSiteData) return;
    setExportLoading("pdf");
    try {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.focus();
        iframeRef.current.contentWindow.print();
      } else {
        window.print();
      }
    } finally {
      setExportLoading(null);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => setInput(event.results[0][0].transcript);
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full bg-[#0B0F19] overflow-hidden text-gray-200">
      
      {/* MOBILE / TABLET VIEW SWITCHER BAR (< 1024px) */}
      <div className="lg:hidden flex items-center justify-between px-3 sm:px-4 py-2 bg-[#111827] border-b border-white/10 shrink-0 z-30">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-white truncate max-w-[140px] sm:max-w-[200px]">
            {businessContext.businessName || "AI Website Builder"}
          </span>
        </div>
        
        {/* Toggle between Chat and Preview on mobile */}
        <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/10 text-xs">
          <button
            onClick={() => setActiveMobileView("chat")}
            className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 font-medium ${
              activeMobileView === "chat"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat & AI</span>
          </button>
          <button
            onClick={() => setActiveMobileView("preview")}
            className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 font-medium relative ${
              activeMobileView === "preview"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
            {generatedSiteData && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5"></span>
            )}
          </button>
        </div>
      </div>

      {/* LEFT PANE: AI CONVERSATION & ONBOARDING */}
      <div
        className={`${
          activeMobileView === "chat" ? "flex" : "hidden"
        } lg:flex w-full lg:w-[420px] xl:w-[460px] lg:min-w-[380px] lg:max-w-[490px] flex-col border-r border-white/10 bg-[#111827] z-10 relative shadow-2xl h-full overflow-hidden`}
      >
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

        {/* Chat Pane Header */}
        <div className="p-3.5 sm:p-4 border-b border-white/10 bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-pink-900/40 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              AI Website Builder
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 truncate max-w-[200px] sm:max-w-none">
              {businessContext.businessName ? `${businessContext.businessName} (${businessContext.businessCategory || "Business"})` : "7-Step Guided Creator"}
            </p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleClear}
              title="Reset conversation and data"
              className="text-xs px-2 sm:px-2.5 py-1 sm:py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-gray-300 transition cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={() => {
                handleClear();
                startNewSession(language || "English");
              }}
              title="Start brand new project"
              className="text-xs px-2 sm:px-2.5 py-1 sm:py-1.5 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-medium transition cursor-pointer"
            >
              New Project
            </button>
          </div>
        </div>

        {/* Persistent Business Context Indicator */}
        {businessContext.businessName && (
          <div className="px-3.5 sm:px-4 py-2 bg-purple-950/40 border-b border-white/5 flex items-center justify-between text-xs shrink-0">
            <span className="text-purple-300 font-medium flex items-center gap-1.5 truncate">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="truncate">{businessContext.businessName}</span>
              {businessContext.businessCategory && <span className="opacity-75 hidden sm:inline">· {businessContext.businessCategory}</span>}
            </span>
            {businessContext.selectedTemplateName && (
              <span className="text-[10px] sm:text-[11px] px-2 py-0.5 bg-white/10 text-gray-300 rounded font-medium truncate max-w-[120px] sm:max-w-[150px]">
                {businessContext.selectedTemplateName}
              </span>
            )}
          </div>
        )}

        {/* Chat History Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 custom-scrollbar space-y-3 sm:space-y-4">
          {messages.map((msg, i) => {
            const isUser = msg.role === "user";
            return (
              <div key={msg.id || i} className={`flex flex-col ${isUser ? "items-end" : "items-start"} mb-2.5 sm:mb-3`}>
                <div
                  className={`p-3 sm:p-3.5 rounded-2xl max-w-[94%] sm:max-w-[90%] text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? "bg-[#7C3AED] text-white shadow-md shadow-purple-900/30"
                      : "bg-white/10 text-gray-200 border border-white/5"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {/* Brand Kit Logo Creation Banner */}
                {msg.data?.brand_kit_required && (
                  <div className="mt-2.5 p-3 sm:p-3.5 bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-purple-950/40 border border-purple-500/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 w-full">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-purple-500/20 rounded-lg text-purple-300 shrink-0">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Brand Kit Logo Required</p>
                        <p className="text-[11px] text-gray-300">
                          Create and save your logo in Brand Kit so we can feature it on your website header.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => window.open("/brand-kit", "_blank")}
                      className="w-full sm:w-auto px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
                    >
                      <span>Open Brand Kit</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Option Chips / Template Cards */}
                {msg.options && msg.options.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2 w-full">
                    {msg.options.map((opt: any, idx: number) => {
                      const isTemplate = opt.action === "select_template";
                      const isSelected = businessContext.selectedTemplateId === opt.id;

                      if (isTemplate) {
                        return (
                          <button
                            key={idx}
                            onClick={() => handleOptionSelect(opt)}
                            className={`w-full text-left p-2.5 sm:p-3 rounded-xl border transition cursor-pointer flex flex-col gap-1 ${
                              isSelected
                                ? "bg-purple-900/40 border-purple-400 shadow-md shadow-purple-950/50"
                                : "bg-white/5 hover:bg-white/10 border-white/10"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                                {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
                                {opt.name}
                              </span>
                              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                                {opt.label?.split("(")[1]?.replace(")", "") || "Template"}
                              </span>
                            </div>
                            <p className="text-[11px] sm:text-xs text-gray-400 leading-snug">{opt.description}</p>
                          </button>
                        );
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleOptionSelect(opt)}
                          className="px-3 py-1.5 sm:py-2 bg-[#7C3AED]/20 hover:bg-[#7C3AED]/40 border border-[#7C3AED]/40 text-[#C4B5FD] hover:text-white rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-1"
                        >
                          {opt.label || opt.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 p-3 bg-purple-950/30 border border-purple-500/20 rounded-2xl max-w-[85%] text-xs text-purple-300">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></div>
              <span>{isGenerating ? "Crafting business website..." : "AI is thinking..."}</span>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Suggestion Chips When Site Exists */}
        {generatedSiteData && (
          <div className="px-3 sm:px-4 py-2 border-t border-white/5 bg-[#0e1422] flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar shrink-0">
            <button
              onClick={() => {
                const bCat = generatedSiteData?.business_category || businessContext.businessCategory || "business";
                handleSend(`Change hero image to fresh ${bCat} photography`);
              }}
              className="text-[10px] sm:text-[11px] whitespace-nowrap px-2.5 py-1 bg-white/5 hover:bg-white/10 text-gray-300 rounded-md border border-white/10 transition cursor-pointer"
            >
              🖼️ Change Hero Image
            </button>
            <button
              onClick={() => handleSend("Make the hero section punchier and more compelling")}
              className="text-[10px] sm:text-[11px] whitespace-nowrap px-2.5 py-1 bg-white/5 hover:bg-white/10 text-gray-300 rounded-md border border-white/10 transition cursor-pointer"
            >
              ✨ Revise Headline
            </button>
            <button
              onClick={() => handleSend("Update website colors")}
              className="text-[10px] sm:text-[11px] whitespace-nowrap px-2.5 py-1 bg-white/5 hover:bg-white/10 text-gray-300 rounded-md border border-white/10 transition cursor-pointer"
            >
              🎨 Update Colors
            </button>
            <button
              onClick={() => handleSend("Add a featured gallery section")}
              className="text-[10px] sm:text-[11px] whitespace-nowrap px-2.5 py-1 bg-white/5 hover:bg-white/10 text-gray-300 rounded-md border border-white/10 transition cursor-pointer"
            >
              ➕ Add Gallery
            </button>
          </div>
        )}

        {/* Chat Input Area */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-[#0B0F19] shrink-0">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                generatedSiteData
                  ? "Describe modifications (e.g. 'Change colors to green')..."
                  : businessContext.onboardingStep === "step1_category_products"
                  ? "Describe business type & offerings..."
                  : businessContext.onboardingStep === "step2_business_name"
                  ? "Enter business name..."
                  : "Type your response..."
              }
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 sm:py-3 pl-3.5 sm:pl-4 pr-16 sm:pr-20 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <div className="absolute right-1.5 sm:right-2 flex items-center gap-1 sm:gap-1.5">
              <button
                type="button"
                onClick={startListening}
                title="Voice input"
                className={`p-1.5 sm:p-2 rounded-full transition cursor-pointer ${
                  isListening ? "bg-red-500 text-white animate-pulse" : "text-gray-400 hover:text-white"
                }`}
              >
                <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                title="Send"
                className="p-1.5 sm:p-2 bg-purple-600 rounded-full text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANE: LIVE PREVIEW & TOOLBAR */}
      <div
        className={`${
          activeMobileView === "preview" ? "flex" : "hidden"
        } lg:flex flex-1 flex-col bg-[#050505] relative h-full overflow-hidden ${
          isFullscreen ? "fixed inset-0 z-[100] !flex" : ""
        }`}
      >
        {/* Preview Toolbar */}
        <div className="h-14 border-b border-white/10 flex items-center justify-between px-2 sm:px-4 md:px-6 bg-[#0B0F19] shrink-0 gap-2 overflow-x-auto no-scrollbar">
          
          {/* Left Toolbar Items: Credits / Badges */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <span className="text-[11px] sm:text-xs px-2 sm:px-2.5 py-1 bg-teal-500/10 border border-teal-500/30 text-teal-300 rounded-lg font-bold flex items-center gap-1 shrink-0">
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-400 shrink-0" />
              <span className="hidden xl:inline">10 Credits / Generation</span>
              <span className="xl:hidden">10 Credits</span>
            </span>

            {isFinalized && (
              <span className="text-[11px] sm:text-xs px-2 sm:px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg font-bold flex items-center gap-1 shrink-0">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Finalized</span>
              </span>
            )}

            {creditDeductionToast && (
              <span className="hidden 2xl:flex text-xs px-2.5 py-1 bg-purple-500/20 border border-purple-500/40 text-purple-200 rounded-lg font-bold animate-in fade-in items-center gap-1.5 shadow-lg shadow-purple-950/40 truncate shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{creditDeductionToast}</span>
              </span>
            )}
          </div>

          {/* Center Toolbar Items: Multi-Page Switcher & Device Screen Size Switchers */}
          <div className="flex items-center gap-2 shrink-0">
            {generatedSiteData?.pages && generatedSiteData.pages.length > 1 && (
              <div className="hidden md:flex items-center bg-black/40 p-0.5 rounded-lg border border-white/10 gap-0.5">
                {generatedSiteData.pages.map((p: any, idx: number) => {
                  const pageId = (p.name || `page-${idx + 1}`).toLowerCase().replace(/[^a-z0-9]/g, "-");
                  const isAct = activePreviewPage === pageId || (!activePreviewPage && idx === 0);
                  return (
                    <button
                      key={p.name || idx}
                      onClick={() => handleSwitchPreviewPage(p.name)}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                        isAct ? "bg-purple-600 text-white shadow-xs" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {p.name}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="hidden sm:flex items-center bg-black/40 p-0.5 rounded-lg border border-white/10">
              <button
                onClick={() => setPreviewDevice("desktop")}
                title="Desktop viewport (100% width)"
                className={`p-1.5 rounded-md transition ${
                  previewDevice === "desktop" ? "bg-purple-600 text-white shadow-xs" : "text-gray-400 hover:text-white"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreviewDevice("tablet")}
                title="Tablet viewport (768px width)"
                className={`p-1.5 rounded-md transition ${
                  previewDevice === "tablet" ? "bg-purple-600 text-white shadow-xs" : "text-gray-400 hover:text-white"
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreviewDevice("mobile")}
                title="Mobile viewport (375px width)"
                className={`p-1.5 rounded-md transition ${
                  previewDevice === "mobile" ? "bg-purple-600 text-white shadow-xs" : "text-gray-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Toolbar Items: Actions, Exports, Fullscreen */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Version History Dropdown */}
            {versionHistory.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowVersionDropdown(!showVersionDropdown)}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 text-xs font-medium text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition cursor-pointer"
                  title="Version history and restore"
                >
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>v{currentVersion}</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {showVersionDropdown && (
                  <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-[#1F2937] border border-white/15 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="text-[11px] font-semibold text-gray-400 px-2 py-1 uppercase tracking-wider">
                      Version History
                    </div>
                    <div className="max-h-52 overflow-y-auto space-y-1 mt-1 custom-scrollbar">
                      {versionHistory.map((item) => (
                        <button
                          key={item.version}
                          onClick={() => handleRestoreVersion(item.version)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition cursor-pointer ${
                            item.version === currentVersion
                              ? "bg-purple-600 text-white font-semibold"
                              : "text-gray-300 hover:bg-white/10"
                          }`}
                        >
                          <div className="truncate">
                            <span className="font-bold">v{item.version}</span>
                            <span className="ml-1 text-[11px] opacity-80 truncate">{item.label}</span>
                          </div>
                          <span className="text-[10px] opacity-60 ml-2 whitespace-nowrap">{item.timestamp}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Live View link */}
            {siteId && (
              <a
                href={`/preview/${siteId}`}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition cursor-pointer"
                title="Open live preview in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden md:inline">Live View</span>
              </a>
            )}

            {/* Export PDF */}
            {generatedSiteData && (
              <button
                onClick={handleExportPdf}
                disabled={exportLoading === "pdf"}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 text-xs font-medium text-gray-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition cursor-pointer disabled:opacity-50"
                title="Export website as PDF"
              >
                <FileText className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden xl:inline">{exportLoading === "pdf" ? "Exporting..." : "Export PDF"}</span>
              </button>
            )}

            {/* Export ZIP */}
            {generatedSiteData && (
              <button
                onClick={handleExportZip}
                disabled={exportLoading === "zip"}
                className="flex items-center gap-1 px-2.5 py-1 sm:py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-md shadow-blue-600/20 cursor-pointer disabled:opacity-50"
                title="Download HTML/CSS ZIP archive"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{exportLoading === "zip" ? "Zipping..." : "ZIP"}</span>
              </button>
            )}

            {/* Finalize Button */}
            <button
              onClick={handleFinalizeWebsite}
              disabled={isFinalized || !generatedSiteData}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded-lg transition shadow-md cursor-pointer ${
                isFinalized
                  ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 cursor-default"
                  : "text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
              title="Finalize website"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isFinalized ? "Finalized" : "Finalize"}</span>
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 sm:p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Theme & Styling Customizer Panel */}
        {showThemeModal && generatedSiteData && (
          <div className="bg-[#111827] border-b border-purple-500/30 p-3 sm:p-4 text-white z-30 animate-in fade-in slide-in-from-top-2 shadow-2xl">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-purple-400" />
                  <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                    Website Theme & Styling Customizer
                  </span>
                </div>
                {/* Customizer Tabs */}
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
                  <button
                    onClick={() => setThemeActiveTab("colors")}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer flex items-center gap-1 ${
                      themeActiveTab === "colors" ? "bg-purple-600 text-white shadow-xs" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Palette className="w-3 h-3" />
                    <span>Theme Colors</span>
                  </button>
                  <button
                    onClick={() => setThemeActiveTab("fonts")}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer flex items-center gap-1 ${
                      themeActiveTab === "fonts" ? "bg-purple-600 text-white shadow-xs" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Type className="w-3 h-3" />
                    <span>Font Theme</span>
                  </button>
                  <button
                    onClick={() => setThemeActiveTab("buttons")}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer flex items-center gap-1 ${
                      themeActiveTab === "buttons" ? "bg-purple-600 text-white shadow-xs" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <span>🔘 Buttons</span>
                  </button>
                </div>
                <button
                  onClick={() => setShowThemeModal(false)}
                  className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* TAB 1: THEME COLORS */}
              {themeActiveTab === "colors" && (
                <div className="space-y-3">
                  <div className="text-xs text-gray-400">
                    Select a curated color palette or pick custom hex colors. Changes reflect immediately on your live website.
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { name: "Indigo Classic", primary: "#4F46E5", secondary: "#4338CA" },
                      { name: "Ocean Sapphire", primary: "#0284C7", secondary: "#0369A1" },
                      { name: "Emerald Nature", primary: "#059669", secondary: "#047857" },
                      { name: "Crimson Rose", primary: "#E11D48", secondary: "#BE123C" },
                      { name: "Warm Sunset", primary: "#EA580C", secondary: "#C2410C" },
                      { name: "Royal Violet", primary: "#7C3AED", secondary: "#6D28D9" },
                      { name: "Amber Gold", primary: "#D97706", secondary: "#B45309" },
                      { name: "Midnight Slate", primary: "#18181B", secondary: "#09090B" },
                    ].map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => updateWebsiteTheme({ primary: p.primary, secondary: p.secondary }, `${p.name} Colors`)}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-left transition cursor-pointer ${
                          generatedSiteData.theme?.primary === p.primary
                            ? "bg-purple-600/20 border-purple-500 shadow-xs"
                            : "bg-white/5 hover:bg-white/10 border-white/10"
                        }`}
                      >
                        <div className="flex items-center -space-x-1 shrink-0">
                          <span className="w-4 h-4 rounded-full border border-black/30" style={{ backgroundColor: p.primary }} />
                          <span className="w-4 h-4 rounded-full border border-black/30" style={{ backgroundColor: p.secondary }} />
                        </div>
                        <span className="text-xs font-medium text-gray-200 truncate">{p.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-white/10 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-gray-300 font-medium">Custom Primary Color:</span>
                      <input
                        type="color"
                        value={generatedSiteData.theme?.primary || "#4F46E5"}
                        onChange={(e) => updateWebsiteTheme({ primary: e.target.value }, "Custom Primary Color")}
                        className="w-7 h-7 rounded border border-white/20 bg-transparent cursor-pointer"
                      />
                      <span className="font-mono text-[11px] text-gray-400">{generatedSiteData.theme?.primary || "#4F46E5"}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-gray-300 font-medium">Custom Secondary Color:</span>
                      <input
                        type="color"
                        value={generatedSiteData.theme?.secondary || "#4338CA"}
                        onChange={(e) => updateWebsiteTheme({ secondary: e.target.value }, "Custom Secondary Color")}
                        className="w-7 h-7 rounded border border-white/20 bg-transparent cursor-pointer"
                      />
                      <span className="font-mono text-[11px] text-gray-400">{generatedSiteData.theme?.secondary || "#4338CA"}</span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: FONT THEME */}
              {themeActiveTab === "fonts" && (
                <div className="space-y-3">
                  <div className="text-xs text-gray-400">
                    Choose the typography font for your website headings and body text.
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { font: "Outfit", tag: "Modern Geometric", style: "font-sans" },
                      { font: "Poppins", tag: "Friendly & Bold", style: "font-sans font-bold" },
                      { font: "Inter", tag: "Tech & Corporate", style: "font-sans tracking-tight" },
                      { font: "Playfair Display", tag: "Luxury Serif", style: "font-serif italic" },
                      { font: "Montserrat", tag: "Contemporary", style: "font-sans uppercase" },
                      { font: "Roboto", tag: "Balanced Classic", style: "font-sans" },
                      { font: "Plus Jakarta Sans", tag: "Clean Modern", style: "font-sans" },
                      { font: "Cinzel", tag: "Regal Classical", style: "font-serif" },
                    ].map((f, idx) => (
                      <button
                        key={idx}
                        onClick={() => updateWebsiteTheme({ font: f.font }, `${f.font} Font`)}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          (generatedSiteData.theme?.font || "Outfit") === f.font
                            ? "bg-purple-600/20 border-purple-500 shadow-xs"
                            : "bg-white/5 hover:bg-white/10 border-white/10"
                        }`}
                      >
                        <span className={`text-sm text-white ${f.style}`}>{f.font}</span>
                        <span className="text-[10px] text-gray-400 mt-1">{f.tag}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: BUTTON COLORS & SHAPE */}
              {themeActiveTab === "buttons" && (
                <div className="space-y-3">
                  <div className="text-xs text-gray-400">
                    Customize button background color, button text color, and corner radius across your whole website.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Button Background Color */}
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 space-y-2">
                      <div className="text-xs font-semibold text-gray-300">Button Background</div>
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {[
                          { name: "Theme Primary", color: generatedSiteData.theme?.primary || "#4F46E5" },
                          { name: "Emerald", color: "#059669" },
                          { name: "Rose", color: "#E11D48" },
                          { name: "Coral", color: "#EA580C" },
                          { name: "Amber", color: "#D97706" },
                          { name: "Violet", color: "#7C3AED" },
                          { name: "Dark", color: "#18181B" },
                        ].map((b, idx) => (
                          <button
                            key={idx}
                            title={b.name}
                            onClick={() => updateWebsiteTheme({ button_color: b.color }, `Button Color ${b.name}`)}
                            className="w-6 h-6 rounded-full border border-black/30 hover:scale-110 transition cursor-pointer shrink-0"
                            style={{ backgroundColor: b.color }}
                          />
                        ))}
                        <label className="flex items-center gap-1 cursor-pointer ml-1">
                          <input
                            type="color"
                            value={generatedSiteData.theme?.button_color || generatedSiteData.theme?.primary || "#4F46E5"}
                            onChange={(e) => updateWebsiteTheme({ button_color: e.target.value }, "Custom Button Color")}
                            className="w-6 h-6 rounded border border-white/20 bg-transparent cursor-pointer"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Button Text Color */}
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 space-y-2">
                      <div className="text-xs font-semibold text-gray-300">Button Text Color</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateWebsiteTheme({ button_text_color: "#ffffff" }, "White Button Text")}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition cursor-pointer bg-white text-gray-900 ${
                            (generatedSiteData.theme?.button_text_color || "#ffffff") === "#ffffff" ? "ring-2 ring-purple-400" : "opacity-80"
                          }`}
                        >
                          White Text
                        </button>
                        <button
                          onClick={() => updateWebsiteTheme({ button_text_color: "#111827" }, "Dark Button Text")}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border border-gray-600 transition cursor-pointer bg-gray-950 text-white ${
                            generatedSiteData.theme?.button_text_color === "#111827" ? "ring-2 ring-purple-400" : "opacity-80"
                          }`}
                        >
                          Dark Text
                        </button>
                      </div>
                    </div>

                    {/* Button Shape */}
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 space-y-2">
                      <div className="text-xs font-semibold text-gray-300">Button Corner Shape</div>
                      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                        {[
                          { label: "💊 Pill", radius: "9999px" },
                          { label: "🔲 Soft", radius: "12px" },
                          { label: "▫️ Subtle", radius: "6px" },
                          { label: "⬛ Square", radius: "0px" },
                        ].map((sh, idx) => (
                          <button
                            key={idx}
                            onClick={() => updateWebsiteTheme({ button_radius: sh.radius }, `${sh.label} Buttons`)}
                            className={`py-1 px-2 rounded-md font-medium border text-center transition cursor-pointer ${
                              (generatedSiteData.theme?.button_radius || "12px") === sh.radius
                                ? "bg-purple-600/30 border-purple-400 text-purple-200"
                                : "bg-white/5 hover:bg-white/10 border-white/10 text-gray-300"
                            }`}
                          >
                            {sh.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Live Button Preview Box */}
                  <div className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-white/10 mt-1">
                    <span className="text-xs text-gray-400">Live Button Preview:</span>
                    <button
                      type="button"
                      style={{
                        backgroundColor: generatedSiteData.theme?.button_color || generatedSiteData.theme?.primary || "#4F46E5",
                        color: generatedSiteData.theme?.button_text_color || "#ffffff",
                        borderRadius: generatedSiteData.theme?.button_radius || "12px",
                      }}
                      className="px-5 py-2 font-bold text-xs shadow-md transition"
                    >
                      Explore Offerings →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Live Website Canvas Area */}
        <div className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 flex items-center justify-center custom-scrollbar bg-[#050505]">
          {generatedSiteData ? (
            <div
              className={`transition-all duration-300 h-full bg-white shadow-2xl overflow-hidden border border-gray-800 flex flex-col ${
                previewDevice === "mobile"
                  ? "w-[375px] max-w-full my-auto ring-8 ring-gray-900 rounded-[32px]"
                  : previewDevice === "tablet"
                  ? "w-[768px] max-w-full my-auto ring-6 ring-gray-900 rounded-[24px]"
                  : "w-full rounded-xl"
              }`}
            >
              {/* Optional Device Bezel Top Notch on Mobile Preview */}
              {previewDevice === "mobile" && (
                <div className="w-full h-5 bg-gray-900 flex justify-center items-center shrink-0">
                  <div className="w-16 h-3 bg-black rounded-full"></div>
                </div>
              )}

              <iframe
                ref={iframeRef}
                srcDoc={generateHtmlFromJSON(generatedSiteData)}
                className="w-full flex-1 bg-white border-0"
                title="Website Live Preview"
              />
            </div>
          ) : (
            <div className="text-center text-gray-500 flex flex-col items-center max-w-md p-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Globe className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-300">Live Website Preview</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Follow the 7-step guided conversation on the left to describe your business, select a curated design
                template, and generate your live website draft.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
