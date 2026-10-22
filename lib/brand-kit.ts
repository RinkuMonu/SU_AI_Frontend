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
  "Social Media Selling (Instagram/WhatsApp)",
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
