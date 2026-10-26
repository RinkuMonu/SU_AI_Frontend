import { BrandKit } from "@/types/brand";
import { Business } from "@/types";

export interface ColorPreset {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

export const CURATED_COLOR_PRESETS: ColorPreset[] = [
  {
    name: "DhandhaGrow Signature",
    primary: "#BE32FF",
    secondary: "#F0449B",
    accent: "#FC9A5D",
  },
  {
    name: "Royal Purple & Gold",
    primary: "#7D35FA",
    secondary: "#F43F5E",
    accent: "#FBBF24",
  },
  {
    name: "Oceanic Cyan & Indigo",
    primary: "#06B6D4",
    secondary: "#3B82F6",
    accent: "#6366F1",
  },
  {
    name: "Emerald Luxury",
    primary: "#059669",
    secondary: "#10B981",
    accent: "#F59E0B",
  },
  {
    name: "Sunset Orange & Crimson",
    primary: "#EA580C",
    secondary: "#E11D48",
    accent: "#FDE047",
  },
  {
    name: "Sleek Monochrome & Neon",
    primary: "#0F172A",
    secondary: "#64748B",
    accent: "#38BDF8",
  },
];

export const SUPPORTED_FONTS = [
  { name: "Inter", category: "Modern Sans", sample: "Clean & contemporary UI typography" },
  { name: "Roboto", category: "Geometric Sans", sample: "Versatile, highly legible workhorse" },
  { name: "Poppins", category: "Rounded Sans", sample: "Friendly, modern consumer brands" },
  { name: "Montserrat", category: "Classic Sans", sample: "Bold, editorial & urban aesthetic" },
  { name: "Playfair Display", category: "Elegant Serif", sample: "Luxury, fashion & boutique appeal" },
  { name: "Lato", category: "Warm Sans", sample: "Balanced proportions and warmth" },
  { name: "Open Sans", category: "Neutral Sans", sample: "Approachable and clear across screens" },
];

export const BUSINESS_TYPES = [
  "Retail Store / Shop",
  "D2C Brand",
  "Wholesale / Distributor",
  "Manufacturer",
  "Service Provider / Agency",
  "Restaurant / Cafe / Food",
  "Healthcare / Clinic",
  "Individual / Sole Proprietor",
  "Private Limited Company",
  "Other",
];

export const BUSINESS_MODELS = [
  "B2C (Business to Consumer)",
  "B2B (Business to Business)",
  "D2C (Direct to Consumer)",
  "B2B2C (Multi-tier)",
  "Hybrid / Multi-model",
];

export const SELLING_MODELS = [
  "Physical Store / Outlet Only",
  "Online Store / E-commerce Only",
  "Omnichannel (Physical + Online)",
  "Social Media Selling (Instagram/Facebook)",
  "Third-Party Marketplaces (Amazon/Flipkart)",
  "Direct Field Sales",
];

export const BUSINESS_CATEGORIES = [
  { value: "clothing", label: "Clothing & Apparel" },
  { value: "jewellery", label: "Jewellery & Accessories" },
  { value: "restaurant", label: "Restaurant, Cafe & Bakeries" },
  { value: "salon", label: "Salon, Spa & Beauty Care" },
  { value: "electronics", label: "Electronics & Mobile Appliances" },
  { value: "grocery", label: "Grocery & Supermarket" },
  { value: "fitness", label: "Gym & Fitness Centers" },
  { value: "real_estate", label: "Real Estate & Architecture" },
  { value: "doctor", label: "Doctor & Healthcare Clinic" },
  { value: "education", label: "Coaching & Education" },
  { value: "other", label: "Other Local Business" },
];

export const AUDIENCE_AGE_GROUPS = [
  "15 - 25",
  "25 - 35",
  "35 - 50",
  "50 +",
];

export const GENDER_OPTIONS = [
  "All (Men & Women)",
  "Primarily Women",
  "Primarily Men",
  "Youth & Teenagers",
  "Kids & Parents",
];

export const CUSTOMER_TYPES = [
  "End Consumers (Everyday Shoppers)",
  "Young Working Professionals",
  "Families & Homemakers",
  "Students & Youth",
  "Corporate & Business Clients",
  "Retailers & Bulk Buyers",
];

export const LOCATION_FOCUS_OPTIONS = [
  "Local / Neighborhood (Within 5-10 km)",
  "City-wide",
  "Regional / State-wide",
  "Pan-India",
  "International / Global",
];

/**
 * Validates whether a hex code is valid 3- or 6-digit hex color
 */
export function isValidHex(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

/**
 * Normalizes hex string with '#' prefix
 */
export function formatHex(hex: string): string {
  if (!hex) return "#000000";
  let cleaned = hex.trim();
  if (!cleaned.startsWith("#")) {
    cleaned = "#" + cleaned;
  }
  return cleaned.toUpperCase();
}

/**
 * Determines whether a Brand Kit is considered complete
 */
export function isBrandKitComplete(brandKit: BrandKit | null, business?: Business | null): boolean {
  if (!brandKit) return false;
  const hasColors = Boolean(brandKit.primary_color && brandKit.secondary_color);
  const hasFont = Boolean(brandKit.font);
  const hasName = Boolean(business?.name || brandKit.business_name);
  return Boolean(hasColors && hasFont && hasName);
}

export interface BrandKitSectionStatus {
  id: string;
  name: string;
  completed: boolean;
  score: number;
  weight: number;
  missingFields: string[];
}

export interface BrandKitProgress {
  percentage: number;
  remainingPercentage: number;
  isComplete: boolean;
  sections: BrandKitSectionStatus[];
  completedSections: string[];
  pendingSections: string[];
}

/**
 * Calculates dynamic Brand Kit completion percentage and completed/pending sections.
 */
export function calculateBrandKitCompletion(
  brandKit: Partial<BrandKit> | null,
  business?: Partial<Business> | null
): BrandKitProgress {
  if (!brandKit && !business) {
    return {
      percentage: 0,
      remainingPercentage: 100,
      isComplete: false,
      sections: [
        { id: "basics", name: "Business Basics", completed: false, score: 0, weight: 25, missingFields: ["Business Name", "Category", "Description"] },
        { id: "logo", name: "Brand Logo", completed: false, score: 0, weight: 25, missingFields: ["Logo Image"] },
        { id: "identity", name: "Colors & Typography", completed: false, score: 0, weight: 25, missingFields: ["Brand Colors", "Font", "Tone"] },
        { id: "audience", name: "Audience & Market", completed: false, score: 0, weight: 25, missingFields: ["Target Audience", "Location Focus"] },
      ],
      completedSections: [],
      pendingSections: ["Business Basics", "Brand Logo", "Colors & Typography", "Audience & Market"],
    };
  }

  // 1. Basics (Weight: 25%)
  const hasName = Boolean(brandKit?.business_name?.trim() || business?.name?.trim());
  const hasDesc = Boolean(brandKit?.business_description?.trim() || brandKit?.brand_description?.trim() || business?.description?.trim());
  const hasCat = Boolean(brandKit?.business_category || business?.category);
  let basicsScore = 0;
  const basicsMissing: string[] = [];
  if (hasName) basicsScore += 15; else basicsMissing.push("Business Name");
  if (hasDesc) basicsScore += 5; else basicsMissing.push("Description");
  if (hasCat) basicsScore += 5; else basicsMissing.push("Category");
  const basicsCompleted = basicsScore >= 20;

  // 2. Logo (Weight: 25%)
  const hasLogo = Boolean(brandKit?.logo_url?.trim());
  const logoScore = hasLogo ? 25 : 0;
  const logoMissing: string[] = hasLogo ? [] : ["Logo Image"];
  const logoCompleted = hasLogo;

  // 3. Colors & Typography (Weight: 25%)
  const hasPrimary = Boolean(brandKit?.primary_color);
  const hasSecondary = Boolean(brandKit?.secondary_color);
  const hasFont = Boolean(brandKit?.font);
  const hasTone = Boolean(brandKit?.tone);
  let identityScore = 0;
  const identityMissing: string[] = [];
  if (hasPrimary && hasSecondary) identityScore += 15; else identityMissing.push("Brand Colors");
  if (hasFont) identityScore += 5; else identityMissing.push("Typography");
  if (hasTone) identityScore += 5; else identityMissing.push("Brand Tone");
  const identityCompleted = identityScore >= 20;

  // 4. Audience & Market (Weight: 25%)
  const hasAudience = Boolean(brandKit?.target_audience || brandKit?.age_group || brandKit?.gender);
  const hasModel = Boolean(brandKit?.customer_type || brandKit?.location_focus || brandKit?.business_model);
  let audienceScore = 0;
  const audienceMissing: string[] = [];
  if (hasAudience) audienceScore += 15; else audienceMissing.push("Target Demographics");
  if (hasModel) audienceScore += 10; else audienceMissing.push("Customer Type / Location");
  const audienceCompleted = audienceScore >= 15;

  const totalScore = Math.min(100, Math.max(0, basicsScore + logoScore + identityScore + audienceScore));
  const remainingPercentage = 100 - totalScore;

  const sections: BrandKitSectionStatus[] = [
    { id: "basics", name: "Business Basics", completed: basicsCompleted, score: basicsScore, weight: 25, missingFields: basicsMissing },
    { id: "logo", name: "Brand Logo", completed: logoCompleted, score: logoScore, weight: 25, missingFields: logoMissing },
    { id: "identity", name: "Colors & Typography", completed: identityCompleted, score: identityScore, weight: 25, missingFields: identityMissing },
    { id: "audience", name: "Audience & Market", completed: audienceCompleted, score: audienceScore, weight: 25, missingFields: audienceMissing },
  ];

  const completedSections = sections.filter(s => s.completed).map(s => s.name);
  const pendingSections = sections.filter(s => !s.completed).map(s => s.name);

  return {
    percentage: totalScore,
    remainingPercentage,
    isComplete: totalScore >= 75 && Boolean(hasName && (hasPrimary || hasFont)),
    sections,
    completedSections,
    pendingSections,
  };
}

/**
 * Generates an SVG data-URI monogram logo fallback using brand colors and initials
 */
export function createSvgLogoFallback(
  name: string,
  primaryColor: string = "#BE32FF",
  secondaryColor: string = "#F0449B"
): string {
  const cleanName = (name || "Brand").trim();
  const words = cleanName.split(/\s+/).filter(Boolean);
  const initial = words[0]?.charAt(0)?.toUpperCase() || "B";
  const secondInitial = words.length > 1 ? words[1]?.charAt(0)?.toUpperCase() : "";
  const monogram = secondInitial ? `${initial}${secondInitial}` : initial;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primaryColor}"/>
        <stop offset="100%" stop-color="${secondaryColor}"/>
      </linearGradient>
      <linearGradient id="glowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="512" height="512" rx="128" fill="url(#bgGrad)"/>
    <circle cx="256" cy="256" r="180" fill="none" stroke="#ffffff" stroke-width="12" stroke-opacity="0.25" stroke-dasharray="8 8"/>
    <circle cx="256" cy="256" r="150" fill="url(#glowGrad)"/>
    <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Inter, system-ui, -apple-system, sans-serif" font-weight="900" font-size="160" fill="#ffffff" letter-spacing="-2">${monogram}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
