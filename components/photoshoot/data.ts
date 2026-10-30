import { AIModelProfile, EnhancementStyle, PhotographyStyleOption, ProductCategory } from "./types";

export interface CategoryInfo {
  id: ProductCategory;
  label: string;
  sublabel: string;
  iconName: string;
  suitableForModel: boolean;
}

export const PRODUCT_CATEGORIES: CategoryInfo[] = [
  {
    id: "mens_clothing",
    label: "Men's Clothing",
    sublabel: "Shirts, T-shirts, Suits, Kurtas & Trousers",
    iconName: "Shirt",
    suitableForModel: true,
  },
  {
    id: "womens_clothing",
    label: "Women's Clothing",
    sublabel: "Sarees, Dresses, Tops, Kurtis & Lehengas",
    iconName: "Sparkles",
    suitableForModel: true,
  },
  {
    id: "unisex_clothing",
    label: "Unisex Clothing",
    sublabel: "Hoodies, Jackets, Streetwear & Activewear",
    iconName: "Layers",
    suitableForModel: true,
  },
  {
    id: "beauty_cosmetics",
    label: "Beauty & Cosmetics",
    sublabel: "Skincare, Makeup, Perfumes & Serums",
    iconName: "Smile",
    suitableForModel: true,
  },
  {
    id: "jewellery_accessories",
    label: "Jewellery & Accessories",
    sublabel: "Necklaces, Rings, Watches & Handbags",
    iconName: "Gem",
    suitableForModel: true,
  },
  {
    id: "food_beverage",
    label: "Food & Beverage",
    sublabel: "Packaged foods, Tea, Coffee, Snacks & Bottles",
    iconName: "Coffee",
    suitableForModel: false,
  },
  {
    id: "electronics",
    label: "Electronics",
    sublabel: "Headphones, Gadgets, Cases & Smart tech",
    iconName: "Smartphone",
    suitableForModel: false,
  },
  {
    id: "home_decor",
    label: "Home Decor",
    sublabel: "Vases, Cushions, Clocks & Art pieces",
    iconName: "Home",
    suitableForModel: false,
  },
  {
    id: "candles",
    label: "Candles",
    sublabel: "Scented candles, Wax melts & Holders",
    iconName: "Flame",
    suitableForModel: false,
  },
  {
    id: "other",
    label: "Other Products",
    sublabel: "Stationery, Gifts, Handmade & Unique goods",
    iconName: "Package",
    suitableForModel: false,
  },
];

export interface EnhancementStyleInfo {
  id: EnhancementStyle;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  lightingType: string;
  idealFor: string;
  accentColor: string;
  previewUrl: string;
}

export const ENHANCEMENT_STYLES: EnhancementStyleInfo[] = [
  {
    id: "studio_premium",
    name: "Studio Premium",
    tagline: "Commercial Softbox Lighting & True Reflections",
    description: "Crisp studio lighting with natural soft shadows, true-to-life colors, and balanced commercial clarity.",
    badge: "Most Popular",
    lightingType: "5600K Daylight Balanced",
    idealFor: "All products, catalogs & hero landing pages",
    accentColor: "from-blue-500 to-indigo-600",
    previewUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
  },
  {
    id: "luxury_cinematic",
    name: "Luxury Cinematic",
    tagline: "Dramatic Rim Light & Deep Luxury Contrast",
    description: "High-contrast editorial mood with subtle gold rim-lighting, atmospheric depth, and luxury advertising flair.",
    badge: "Editorial High-End",
    lightingType: "Moody 3200K Tungsten & Rim Light",
    idealFor: "Jewelry, luxury fashion, perfumes & premium gifts",
    accentColor: "from-amber-500 to-rose-600",
    previewUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
  },
  {
    id: "marketplace_white",
    name: "Marketplace White",
    tagline: "100% Amazon & Flipkart Compliant White Background",
    description: "Pristine pure white (#FFFFFF) background with realistic drop shadow, meeting strict ecommerce guidelines.",
    badge: "Ecommerce Standard",
    lightingType: "Uniform Pure High-Key White",
    idealFor: "Amazon, Flipkart, Meesho, Shopify product catalogs",
    accentColor: "from-emerald-500 to-teal-600",
    previewUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
  },
];

export const AI_MODELS: AIModelProfile[] = [
  {
    id: "model_m_01",
    name: "Aryan",
    gender: "male",
    ethnicity: "Indian / South Asian",
    specialty: "Athleisure & Casual Fashion",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
    description: "Athletic build, modern sharp hairstyle. Ideal for t-shirts, sportswear, hoodies and smart casuals.",
    tags: ["Athletic", "Modern Casual", "Urban"],
    recommendedCategories: ["mens_clothing", "unisex_clothing"],
  },
  {
    id: "model_m_02",
    name: "Kabir",
    gender: "male",
    ethnicity: "Indian / South Asian",
    specialty: "Formal, Executive & Bespoke Suits",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    description: "Distinguished gentleman look, groomed beard. Ideal for formal shirts, blazers, suits and luxury watches.",
    tags: ["Executive", "Formal", "Sophisticated"],
    recommendedCategories: ["mens_clothing", "jewellery_accessories"],
  },
  {
    id: "model_m_03",
    name: "Rohan",
    gender: "male",
    ethnicity: "Indian / South Asian",
    specialty: "Traditional Kurtas & Streetwear",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
    description: "Youthful vibrant energy. Perfect for festive ethnic wear, Nehru jackets, oversized tees and sunglasses.",
    tags: ["Ethnic", "Youth", "Streetwear"],
    recommendedCategories: ["mens_clothing", "unisex_clothing"],
  },
  {
    id: "model_f_01",
    name: "Ananya",
    gender: "female",
    ethnicity: "Indian / South Asian",
    specialty: "Ethnic, Sarees & Bridal Couture",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
    description: "Graceful features and classical Indian styling. Perfect for silk sarees, lehengas, dupattas and bridal wear.",
    tags: ["Bridal", "Traditional", "Graceful"],
    recommendedCategories: ["womens_clothing", "jewellery_accessories"],
  },
  {
    id: "model_f_02",
    name: "Meera",
    gender: "female",
    ethnicity: "Indian / South Asian",
    specialty: "Contemporary Western & Chic Casual",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
    description: "Trendy, cosmopolitan aesthetic. Ideal for dresses, blazers, western tops, denim and lifestyle brands.",
    tags: ["Chic", "Western", "High Street"],
    recommendedCategories: ["womens_clothing", "unisex_clothing", "beauty_cosmetics"],
  },
  {
    id: "model_f_03",
    name: "Diya",
    gender: "female",
    ethnicity: "Indian / South Asian",
    specialty: "Jewelry, Beauty & Editorial Glamour",
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
    description: "Flawless skin and high-fashion editorial presence. Ideal for necklaces, earrings, cosmetics and skincare.",
    tags: ["Editorial", "Skincare", "Fine Jewelry"],
    recommendedCategories: ["jewellery_accessories", "beauty_cosmetics", "womens_clothing"],
  },
];

export const MODEL_POSES_CLOTHING: PhotographyStyleOption[] = [
  {
    id: "pose_front_view",
    name: "Front View",
    category: "model",
    description: "Direct full-length view showing complete front silhouette and drape.",
    badge: "Essential",
    previewUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    recommendedFor: ["mens_clothing", "womens_clothing", "unisex_clothing"],
  },
  {
    id: "pose_back_view",
    name: "Back View",
    category: "model",
    description: "Showcasing the back cut, zipper, embroidery or rear styling.",
    badge: "Design Detail",
    previewUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80",
    recommendedFor: ["mens_clothing", "womens_clothing", "unisex_clothing"],
  },
  {
    id: "pose_side_view",
    name: "Side View",
    category: "model",
    description: "Profile silhouette showing the garment's fit and side profile.",
    badge: "Fit Perspective",
    previewUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
    recommendedFor: ["mens_clothing", "womens_clothing", "unisex_clothing"],
  },
  {
    id: "pose_sitting",
    name: "Sitting Pose",
    category: "model",
    description: "Seated elegantly on a designer chair or steps, demonstrating natural comfort.",
    badge: "Lifestyle Look",
    previewUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
    recommendedFor: ["mens_clothing", "womens_clothing", "unisex_clothing"],
  },
  {
    id: "pose_walking",
    name: "Walking Pose",
    category: "model",
    description: "Dynamic in-motion stride capturing fabric flow and active energy.",
    badge: "In Motion",
    previewUrl: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=600&q=80",
    recommendedFor: ["mens_clothing", "womens_clothing", "unisex_clothing"],
  },
  {
    id: "pose_editorial",
    name: "Editorial Fashion Pose",
    category: "model",
    description: "Vogue-inspired high-fashion posture with artistic lighting and angles.",
    badge: "Campaign Hero",
    previewUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
    recommendedFor: ["mens_clothing", "womens_clothing", "unisex_clothing"],
  },
];

export const MODEL_POSES_JEWELLERY: PhotographyStyleOption[] = [
  {
    id: "pose_jewel_closeup",
    name: "Close-up Model Shot",
    category: "model",
    description: "Tight macro framing on earrings, necklace or ring with soft radiant skin blur.",
    badge: "Macro Focus",
    previewUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
    recommendedFor: ["jewellery_accessories", "beauty_cosmetics"],
  },
  {
    id: "pose_jewel_front_portrait",
    name: "Front Portrait",
    category: "model",
    description: "Centered regal portrait highlighting necklace neckline and matching earrings.",
    badge: "Classic Portrait",
    previewUrl: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=600&q=80",
    recommendedFor: ["jewellery_accessories"],
  },
  {
    id: "pose_jewel_side_portrait",
    name: "Side Portrait",
    category: "model",
    description: "Graceful head-turn angle accentuating earrings, maang tikka or hair accessories.",
    badge: "Profile Angle",
    previewUrl: "https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?w=600&q=80",
    recommendedFor: ["jewellery_accessories"],
  },
  {
    id: "pose_jewel_lifestyle",
    name: "Lifestyle Pose",
    category: "model",
    description: "Casual golden daylight shot showcasing jewelry paired with chic daily styling.",
    badge: "Everyday Luxury",
    previewUrl: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=600&q=80",
    recommendedFor: ["jewellery_accessories", "beauty_cosmetics"],
  },
];

export const PRODUCT_ONLY_STYLES: PhotographyStyleOption[] = [
  {
    id: "style_clean_hero",
    name: "Clean Hero Product Shot",
    category: "product_only",
    description: "Floating or podium centerpiece shot with balanced studio key lights and subtle glow.",
    badge: "Bestseller",
    previewUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    recommendedFor: ["mens_clothing", "womens_clothing", "unisex_clothing", "beauty_cosmetics", "jewellery_accessories", "food_beverage", "electronics", "home_decor", "candles", "other"],
  },
  {
    id: "style_lifestyle_placement",
    name: "Lifestyle Product Placement",
    category: "product_only",
    description: "Placed organically in a real-world setting: marble tabletop, designer cafe, or aesthetic room.",
    badge: "Social Media Ready",
    previewUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    recommendedFor: ["food_beverage", "home_decor", "candles", "beauty_cosmetics", "electronics", "other"],
  },
  {
    id: "style_top_down_flatlay",
    name: "Top-Down Flat Lay",
    category: "product_only",
    description: "Editorial bird's-eye 90-degree flat lay surrounded by curated color-matched props.",
    badge: "Instagram Favorite",
    previewUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
    recommendedFor: ["mens_clothing", "womens_clothing", "unisex_clothing", "beauty_cosmetics", "food_beverage", "candles"],
  },
  {
    id: "style_closeup_detail",
    name: "Close-up Detail Shot",
    category: "product_only",
    description: "Macro-lens focus highlighting intricate texture, stitching, logo embossing, or packaging typography.",
    badge: "Quality Proof",
    previewUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80",
    recommendedFor: ["jewellery_accessories", "electronics", "candles", "home_decor", "beauty_cosmetics", "other"],
  },
  {
    id: "style_luxury_studio",
    name: "Luxury Studio Composition",
    category: "product_only",
    description: "Geometric stone pedestals, warm golden-hour beams, and sophisticated architectural shadows.",
    badge: "High Conversion",
    previewUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80",
    recommendedFor: ["beauty_cosmetics", "jewellery_accessories", "candles", "food_beverage", "electronics", "home_decor"],
  },
  {
    id: "style_creative_campaign",
    name: "Creative Campaign Photography",
    category: "product_only",
    description: "Bold artistic background with floating botanical elements, dramatic color wash, or clean smoke effect.",
    badge: "Ad Campaign",
    previewUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
    recommendedFor: ["food_beverage", "beauty_cosmetics", "electronics", "candles", "jewellery_accessories", "other"],
  },
];

export const PRESET_PROMPTS = [
  "Soft natural golden hour sunlight on neutral warm sand podium with minimalist architectural arches",
  "Luxury dark onyx stone pedestal with subtle gold rim-lighting and blurred bokeh background",
  "Pristine white marble bathroom counter with fresh botanical green leaves and morning sunlight",
  "Vibrant festive Indian setting with warm marigold petals, brass lanterns, and gentle festive glow",
  "Modern Scandinavian oak wood table with soft overcast daylight and artisanal ceramic accents",
  "High-energy urban neon street background with shallow depth of field and premium cinematic blur",
];

export function categoryIdToBackendName(cat: ProductCategory): string {
  switch (cat) {
    case "mens_clothing":
      return "Men's Clothing";
    case "womens_clothing":
      return "Women's Clothing";
    case "unisex_clothing":
      return "Unisex Clothing";
    case "beauty_cosmetics":
      return "Beauty & Cosmetics";
    case "jewellery_accessories":
      return "Jewellery & Accessories";
    case "food_beverage":
      return "Food & Beverage";
    case "electronics":
      return "Electronics";
    case "home_decor":
      return "Home Decor";
    case "candles":
      return "Candles";
    default:
      return "Other Products";
  }
}

export function backendNameToCategoryId(name?: string): ProductCategory {
  if (!name) return "womens_clothing";
  const lower = name.toLowerCase();
  if (lower.includes("men") && !lower.includes("women")) return "mens_clothing";
  if (lower.includes("women")) return "womens_clothing";
  if (lower.includes("unisex")) return "unisex_clothing";
  if (lower.includes("jewel") || lower.includes("accessory")) return "jewellery_accessories";
  if (lower.includes("beauty") || lower.includes("cosmetic")) return "beauty_cosmetics";
  if (lower.includes("food") || lower.includes("beverage")) return "food_beverage";
  if (lower.includes("electronic") || lower.includes("gadget")) return "electronics";
  if (lower.includes("decor") || lower.includes("home")) return "home_decor";
  if (lower.includes("candle")) return "candles";
  return "other";
}


