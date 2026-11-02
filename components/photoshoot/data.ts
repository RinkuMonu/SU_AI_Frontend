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
    id: "food_beverage",
    label: "Food, Spices & Groceries",
    sublabel: "Salt, Spices, Packaged foods, Snacks, Tea, Coffee & Bottles",
    iconName: "Coffee",
    suitableForModel: false,
  },
  {
    id: "crockery_kitchenware",
    label: "Crockery & Kitchenware",
    sublabel: "Dinner sets, Ceramic plates, Bowls, Cutlery & Cookware",
    iconName: "Layers",
    suitableForModel: false,
  },
  {
    id: "furniture_living",
    label: "Furniture & Living",
    sublabel: "Chairs, Tables, Desks, Sofas & Home furnishings",
    iconName: "Home",
    suitableForModel: false,
  },
  {
    id: "jewellery_accessories",
    label: "Jewellery & Watches",
    sublabel: "Necklaces, Rings, Earrings, Bangles & Luxury watches",
    iconName: "Gem",
    suitableForModel: true,
  },
  {
    id: "beauty_cosmetics",
    label: "Beauty & Cosmetics",
    sublabel: "Skincare, Makeup, Perfumes, Serums & Lotions",
    iconName: "Smile",
    suitableForModel: true,
  },
  {
    id: "electronics",
    label: "Electronics & Gadgets",
    sublabel: "Headphones, Speakers, Smartphones, Cases & Smart tech",
    iconName: "Smartphone",
    suitableForModel: false,
  },
  {
    id: "clothing",
    label: "Clothing & Apparel",
    sublabel: "Shirts, T-shirts, Sarees, Dresses, Hoodies & Activewear",
    iconName: "Shirt",
    suitableForModel: true,
  },
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
    id: "home_decor",
    label: "Home Decor & Accents",
    sublabel: "Vases, Cushions, Clocks, Wall art & Sculptures",
    iconName: "Home",
    suitableForModel: false,
  },
  {
    id: "candles",
    label: "Candles & Fragrances",
    sublabel: "Scented candles, Wax melts, Diffusers & Holders",
    iconName: "Flame",
    suitableForModel: false,
  },
  {
    id: "other",
    label: "Other Products",
    sublabel: "Stationery, Gifts, Handmade crafts & Custom goods",
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
    id: "style_luxury_studio",
    name: "Luxury Studio",
    category: "product_only",
    description: "Centered hero podium with balanced commercial daylight softboxes, polished reflections, and pure studio clarity.",
    badge: "Studio Grade",
    previewUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    recommendedFor: ["food_beverage", "crockery_kitchenware", "furniture_living", "jewellery_accessories", "beauty_cosmetics", "electronics", "home_decor", "candles", "clothing", "other"],
  },
  {
    id: "style_cinematic",
    name: "Cinematic",
    category: "product_only",
    description: "Warm dramatic lighting, rich chiaroscuro contrast, and shallow cinematic depth of field creating an arresting luxury mood.",
    badge: "Atmospheric",
    previewUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
    recommendedFor: ["food_beverage", "crockery_kitchenware", "furniture_living", "jewellery_accessories", "beauty_cosmetics", "electronics", "home_decor", "candles", "clothing", "other"],
  },
  {
    id: "style_premium_minimal",
    name: "Premium Minimal",
    category: "product_only",
    description: "Clean pastel or travertine podiums, geometric negative space, architectural lines, and soft diffused shadows.",
    badge: "Minimalist",
    previewUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80",
    recommendedFor: ["food_beverage", "crockery_kitchenware", "furniture_living", "jewellery_accessories", "beauty_cosmetics", "electronics", "home_decor", "candles", "clothing", "other"],
  },
  {
    id: "style_lifestyle",
    name: "Lifestyle",
    category: "product_only",
    description: "Placed organically in an authentic upscale setting: marble tabletop, designer kitchen, cafe counter, or living space.",
    badge: "Authentic Staging",
    previewUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    recommendedFor: ["food_beverage", "crockery_kitchenware", "furniture_living", "jewellery_accessories", "beauty_cosmetics", "electronics", "home_decor", "candles", "clothing", "other"],
  },
  {
    id: "style_ecommerce_white",
    name: "E-commerce White Background",
    category: "product_only",
    description: "Pure #FFFFFF clean seamless white background with natural drop shadow, 100% compliant with Amazon and Flipkart standards.",
    badge: "Amazon / Flipkart",
    previewUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    recommendedFor: ["food_beverage", "crockery_kitchenware", "furniture_living", "jewellery_accessories", "beauty_cosmetics", "electronics", "home_decor", "candles", "clothing", "other"],
  },
  {
    id: "style_editorial",
    name: "Editorial",
    category: "product_only",
    description: "Art-directed still life styling for premium magazines with curated textures, linen drapery, and evocative shadows.",
    badge: "Vogue Catalog",
    previewUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80",
    recommendedFor: ["food_beverage", "crockery_kitchenware", "furniture_living", "jewellery_accessories", "beauty_cosmetics", "electronics", "home_decor", "candles", "clothing", "other"],
  },
  {
    id: "style_creative_commercial",
    name: "Creative Commercial",
    category: "product_only",
    description: "Bold brand campaign visual with vibrant color-blocked studio backdrops, dynamic lighting, and razor-sharp clarity.",
    badge: "Brand Campaign",
    previewUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
    recommendedFor: ["food_beverage", "crockery_kitchenware", "furniture_living", "jewellery_accessories", "beauty_cosmetics", "electronics", "home_decor", "candles", "clothing", "other"],
  },
  {
    id: "style_natural_photography",
    name: "Natural Photography",
    category: "product_only",
    description: "Soft golden morning sunlight filtering through botanical leaves with organic wood, stone textures, and authentic warm bokeh.",
    badge: "Sunlit Botanical",
    previewUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
    recommendedFor: ["food_beverage", "crockery_kitchenware", "furniture_living", "jewellery_accessories", "beauty_cosmetics", "electronics", "home_decor", "candles", "clothing", "other"],
  },
  {
    id: "style_product_showcase",
    name: "Product Showcase",
    category: "product_only",
    description: "Hero centerpiece presentation on an elevated plinth highlighting packaging design, fine craftsmanship, and true material finish.",
    badge: "Hero Feature",
    previewUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80",
    recommendedFor: ["food_beverage", "crockery_kitchenware", "furniture_living", "jewellery_accessories", "beauty_cosmetics", "electronics", "home_decor", "candles", "clothing", "other"],
  },
];

export const PRESET_PROMPTS = [
  "Make the background more luxurious with marble textures and subtle architectural accents",
  "Use soft golden lighting with warm natural shadows and crisp highlights",
  "Create a premium product advertisement with clean commercial studio presentation",
  "Keep the original product colour, texture, and label details completely unchanged",
  "Show the product in a modern lifestyle setting with elegant ambient daylight",
  "Position on a minimalist travertine stone pedestal with soft botanical shadows",
];

export function categoryIdToBackendName(cat: ProductCategory): string {
  switch (cat) {
    case "food_beverage":
      return "Food & Beverage";
    case "crockery_kitchenware":
      return "Crockery & Kitchenware";
    case "furniture_living":
      return "Furniture & Living";
    case "jewellery_accessories":
      return "Jewellery & Accessories";
    case "beauty_cosmetics":
      return "Beauty & Cosmetics";
    case "electronics":
      return "Electronics";
    case "clothing":
      return "Clothing";
    case "mens_clothing":
      return "Men's Clothing";
    case "womens_clothing":
      return "Women's Clothing";
    case "unisex_clothing":
      return "Unisex Clothing";
    case "home_decor":
      return "Home Decor";
    case "candles":
      return "Candles";
    default:
      return "Other Products";
  }
}

export function backendNameToCategoryId(name?: string): ProductCategory {
  if (!name) return "food_beverage";
  const lower = name.toLowerCase();
  if (lower.includes("crockery") || lower.includes("kitchen") || lower.includes("cookware")) return "crockery_kitchenware";
  if (lower.includes("furniture") || lower.includes("chair") || lower.includes("table")) return "furniture_living";
  if (lower.includes("salt") || lower.includes("spice") || lower.includes("food") || lower.includes("beverage")) return "food_beverage";
  if (lower.includes("jewel") || lower.includes("accessory") || lower.includes("watch")) return "jewellery_accessories";
  if (lower.includes("beauty") || lower.includes("cosmetic") || lower.includes("skincare")) return "beauty_cosmetics";
  if (lower.includes("electronic") || lower.includes("gadget") || lower.includes("phone")) return "electronics";
  if (lower.includes("candle") || lower.includes("fragrance")) return "candles";
  if (lower.includes("decor") || lower.includes("home")) return "home_decor";
  if (lower.includes("men") && !lower.includes("women")) return "mens_clothing";
  if (lower.includes("women")) return "womens_clothing";
  if (lower.includes("cloth") || lower.includes("apparel")) return "clothing";
  return "other";
}


