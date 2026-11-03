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
  MessageSquare
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

  // 5. DEFAULT / OTHER
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
  const logoUrl = typeof data.logo === "string" ? data.logo : data.logo?.url || null;
  const primaryColor = data.theme?.primary || "#4F46E5";
  const secondaryColor = data.theme?.secondary || "#4338CA";
  const accentColor = data.theme?.accent || "#EC4899";
  const fontFamily = data.theme?.font || "Outfit";

  let bodyHtml = "";

  pages.forEach((page: any) => {
    if (!page.sections || !Array.isArray(page.sections)) return;

    page.sections.forEach((section: WebsiteSection, idx: number) => {
      const sectionType = (section.type || "section").toLowerCase();
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

        bodyHtml += `
          <section id="${sectionId}" class="relative bg-white overflow-hidden border-b border-gray-100">
            <div class="max-w-7xl mx-auto">
              <div class="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-12 sm:pt-16 md:pt-20 px-4 sm:px-6 lg:px-8">
                <main class="mt-6 sm:mt-10 mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
                  <div class="text-center lg:text-left">
                    <span class="inline-block px-3 py-1 text-xs font-bold rounded-full bg-primary/10 text-primary mb-3 sm:mb-4 tracking-wider uppercase">${escapeHtml(bCategory)}</span>
                    <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight font-extrabold text-gray-900 leading-tight">
                      <span class="block text-primary">${sTitle || bName}</span>
                    </h1>
                    ${sSubtitle || sDesc ? `<p class="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">${sSubtitle || sDesc}</p>` : ""}
                    <div class="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4">
                      ${
                        section.cta
                          ? `<a href="#contact" class="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 border border-transparent text-sm sm:text-base font-semibold rounded-xl text-white bg-primary hover:bg-secondary transition shadow-lg shadow-primary/25">${escapeHtml(section.cta)}</a>`
                          : `<a href="#contact" class="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 border border-transparent text-sm sm:text-base font-semibold rounded-xl text-white bg-primary hover:bg-secondary transition shadow-lg shadow-primary/25">Explore Now</a>`
                      }
                      ${
                        section.secondary_cta
                          ? `<a href="#about" class="w-full sm:w-auto inline-flex items-center justify-center px-5 sm:px-6 py-3 sm:py-3.5 border border-gray-200 text-sm sm:text-base font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition">${escapeHtml(section.secondary_cta)}</a>`
                          : ""
                      }
                    </div>
                  </div>
                </main>
              </div>
            </div>
            <div class="w-full lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 mt-6 lg:mt-0">
              <img class="h-56 sm:h-72 md:h-88 lg:h-full w-full object-cover shadow-inner" src="${heroImg}" alt="${sTitle || bName}" loading="eager" />
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
        bodyHtml += `
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
                            <button onclick="alert('Inquiry for: ${itemTitle.replace(/'/g, "\\'")}')" class="px-4 py-2 text-xs font-semibold rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition">Select</button>
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
        bodyHtml += `
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
        bodyHtml += `
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

        bodyHtml += `
          <section id="about" class="py-12 sm:py-16 md:py-24 bg-white border-b border-gray-100">
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

        bodyHtml += `
          <section id="contact" class="py-12 sm:py-16 md:py-24 bg-white border-b border-gray-100">
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
                  <button type="submit" class="w-full py-3 px-6 rounded-xl text-white font-semibold bg-primary hover:bg-secondary transition shadow-md text-sm sm:text-base">Send Inquiry</button>
                </form>
              </div>
            </div>
          </section>
        `;
      }

      // 7. GENERIC SECTION FALLBACK
      else {
        bodyHtml += `
          <section id="${sectionId}" class="py-12 sm:py-16 bg-white border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              ${sTitle ? `<h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900">${sTitle}</h2>` : ""}
              ${sDesc ? `<p class="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">${sDesc}</p>` : ""}
            </div>
          </section>
        `;
      }
    });
  });

  const navSections = (pages[0]?.sections || [])
    .filter((s: any) => s.title && s.type !== "hero")
    .map((s: any) => ({
      title: escapeHtml(s.title),
      id: `section-${s.title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`
    }));

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
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        html { scroll-behavior: smooth; }
        body { font-family: '${fontFamily}', sans-serif; }
      </style>
    </head>
    <body class="bg-gray-50 text-gray-900 antialiased selection:bg-primary selection:text-white">
      <nav class="bg-white/95 backdrop-blur-md shadow-xs sticky top-0 z-50 border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16 sm:h-20 items-center">
            <div class="flex-shrink-0 flex items-center gap-2 sm:gap-3">
              ${
                logoUrl
                  ? `<img src="${logoUrl}" alt="${bName}" class="h-8 sm:h-10 w-auto object-contain" />`
                  : `<span class="text-xl sm:text-2xl font-black text-primary tracking-tight">${bName}</span>`
              }
            </div>
            <div class="hidden md:flex items-center space-x-6 lg:space-x-8">
              ${navSections
                .map(
                  (nav: any) =>
                    `<a href="#${nav.id}" class="text-gray-600 hover:text-primary text-xs sm:text-sm font-semibold transition">${nav.title}</a>`
                )
                .join("")}
              <a href="#contact" class="bg-primary text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold hover:bg-secondary transition shadow-md shadow-primary/20 text-xs sm:text-sm">Contact</a>
            </div>
            <div class="md:hidden flex items-center">
              <a href="#contact" class="bg-primary text-white px-4 py-1.5 rounded-lg font-bold text-xs">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      ${bodyHtml}

      <footer class="bg-gray-950 text-gray-400 border-t border-gray-800">
        <div class="max-w-7xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 text-center sm:text-left">
            <div>
              <h3 class="text-xl sm:text-2xl font-black text-white mb-2 sm:mb-3">${bName}</h3>
              <p class="text-xs sm:text-sm leading-relaxed">${escapeHtml(data.tagline || `Quality products and exceptional service tailored to you.`)}</p>
            </div>
            <div>
              <h4 class="text-xs sm:text-sm font-bold uppercase tracking-wider text-white mb-3 sm:mb-4">Quick Links</h4>
              <ul class="space-y-2 text-xs sm:text-sm">
                ${navSections.slice(0, 4).map((nav: any) => `<li><a href="#${nav.id}" class="hover:text-white transition">${nav.title}</a></li>`).join("")}
                <li><a href="#contact" class="hover:text-white transition">Contact</a></li>
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

      if (data.generatedSiteData) {
        setGeneratedSiteData(data.generatedSiteData);
        localStorage.setItem("website_builder_site_data", JSON.stringify(data.generatedSiteData));
        setVersionHistory([
          {
            version: 1,
            label: "Restored Draft",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            data: data.generatedSiteData
          }
        ]);
        if (data.generatedSiteData.business_name) {
          setBusinessContext((prev) => ({
            ...prev,
            businessName: data.generatedSiteData?.business_name,
            businessCategory: data.generatedSiteData?.business_category,
            selectedTemplateId: data.generatedSiteData?.template_id,
            selectedTemplateName: data.generatedSiteData?.template_name,
            onboardingStep: "step7_generated"
          }));
        }
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

    // STEP 5: Additional business-specific question -> Got answer -> Step 6 (Summarize & Confirm)
    if (currentStep === "step5_industry_questions") {
      const updatedCtx: BusinessContext = {
        ...businessContext,
        industryDetails: userText,
        onboardingStep: "step6_confirmation"
      };
      setBusinessContext(updatedCtx);

      const summaryText = `Here is a summary of your website details:
• **Business**: ${updatedCtx.businessName || "My Business"} (${updatedCtx.businessCategory || "Business"})
• **Offerings**: ${updatedCtx.productsServices || "Standard products & services"}
• **Design Template**: ${updatedCtx.selectedTemplateName || "Modern Pro"}
• **Special Features**: ${userText}

Shall I generate your custom website draft now?`;

      const aiReply: ChatMessage = {
        id: `step-6-${Date.now()}`,
        role: "ai",
        content: summaryText,
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

    const generatedSite: GeneratedSiteData = {
      business_name: bName,
      business_category: category,
      template_id: tId,
      template_name: tName,
      theme: {
        primary: isFlower ? "#E11D48" : isGym ? "#DC2626" : isRestaurant ? "#D97706" : isClothing ? "#7C3AED" : "#4F46E5",
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

    // 1. Change theme color
    if (lower.includes("color") || lower.includes("theme") || lower.includes("background")) {
      let newColor = "#4F46E5";
      if (lower.includes("blue")) newColor = "#2563EB";
      else if (lower.includes("green") || lower.includes("emerald")) newColor = "#059669";
      else if (lower.includes("violet") || lower.includes("purple")) newColor = "#7C3AED";
      else if (lower.includes("rose") || lower.includes("red") || lower.includes("pink")) newColor = "#E11D48";
      else if (lower.includes("dark") || lower.includes("black")) newColor = "#18181B";
      else if (lower.includes("gold") || lower.includes("amber")) newColor = "#D97706";

      if (!updatedSite.theme) updatedSite.theme = {};
      updatedSite.theme.primary = newColor;
      updatedSite.theme.secondary = newColor;
      appliedChangeDesc = `Updated the primary theme color to ${newColor}.`;
    }

    // 2. Change hero image
    else if (lower.includes("hero image") || lower.includes("header image") || lower.includes("cover image")) {
      const heroSection = updatedSite.pages?.[0]?.sections?.find((s: any) => s.type === "hero");
      if (heroSection) {
        heroSection.image_url = resolveImageUrl(
          undefined,
          updatedSite.business_category || "flower",
          "hero",
          `${instruction} fresh daylight`,
          updatedSite.business_name
        );
        appliedChangeDesc = "Updated the hero image with fresh, category-specific photography.";
      }
    }

    // 3. Change product/bouquets images
    else if (lower.includes("image") || lower.includes("photo") || lower.includes("picture")) {
      const prodSection = updatedSite.pages?.[0]?.sections?.find(
        (s: any) => s.type === "products" || s.type === "bouquets" || s.type === "menu"
      );
      if (prodSection?.items) {
        prodSection.items.forEach((item: any, i: number) => {
          item.image_url = resolveImageUrl(
            undefined,
            updatedSite.business_category || "flower",
            "products",
            `${item.title} ${instruction} ${i}`,
            updatedSite.business_name
          );
        });
        appliedChangeDesc = "Replaced section images with new category-matched imagery.";
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

    // 5. Add a section (e.g. Gallery)
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
              onClick={() => handleSend("Change hero image to fresh floral photography")}
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
              onClick={() => handleSend("Change the primary theme color to emerald green")}
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
        <div className="h-14 border-b border-white/10 flex items-center justify-between px-3 sm:px-6 bg-[#0B0F19] shrink-0 gap-2">
          
          {/* Left Toolbar Items: Credits / Badges */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="text-[11px] sm:text-xs px-2 sm:px-2.5 py-1 bg-teal-500/10 border border-teal-500/30 text-teal-300 rounded-lg font-bold flex items-center gap-1 shrink-0">
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-400 shrink-0" />
              <span className="hidden sm:inline">10 Credits / Generation</span>
              <span className="sm:hidden">10 Credits</span>
            </span>

            {isFinalized && (
              <span className="text-[11px] sm:text-xs px-2 sm:px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg font-bold flex items-center gap-1 shrink-0">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Finalized</span>
              </span>
            )}

            {creditDeductionToast && (
              <span className="hidden md:flex text-xs px-2.5 py-1 bg-purple-500/20 border border-purple-500/40 text-purple-200 rounded-lg font-bold animate-in fade-in items-center gap-1.5 shadow-lg shadow-purple-950/40 truncate">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{creditDeductionToast}</span>
              </span>
            )}
          </div>

          {/* Center Toolbar Items: Device Screen Size Switchers */}
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
