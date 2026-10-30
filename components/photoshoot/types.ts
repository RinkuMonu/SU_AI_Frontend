export type ProductCategory =
  | "mens_clothing"
  | "womens_clothing"
  | "unisex_clothing"
  | "beauty_cosmetics"
  | "jewellery_accessories"
  | "food_beverage"
  | "electronics"
  | "home_decor"
  | "candles"
  | "other";

export type ImageAngle = "front" | "back" | "side" | "closeup" | "other";

export interface PhotoshootUploadedImage {
  id: string;
  name: string;
  size: number;
  url: string;
  previewUrl: string;
  angle: ImageAngle;
  file?: File;
  uploadedAt: string;
  backendImageId?: string;
}

export type EnhancementStyle = "studio_premium" | "luxury_cinematic" | "marketplace_white";

export interface EnhancedVariation {
  id: string;
  sourceImageId?: string;
  style: EnhancementStyle;
  styleName: string;
  originalUrl: string;
  enhancedUrl: string;
  description: string;
  aspectRatio: string;
  isRegenerating?: boolean;
}

export interface AIModelProfile {
  id: string;
  name: string;
  gender: "male" | "female" | "unisex";
  ethnicity: string;
  specialty: string;
  avatarUrl: string;
  description: string;
  tags: string[];
  recommendedCategories: ProductCategory[];
}

export interface PhotographyStyleOption {
  id: string;
  name: string;
  category: "model" | "product_only" | "both";
  description: string;
  badge: string;
  previewUrl: string;
  recommendedFor: ProductCategory[];
}

export interface PhotoshootFinalResult {
  id: string;
  imageUrl: string;
  title: string;
  prompt: string;
  styleName: string;
  modelUsed?: string;
  resolution: string;
  selected: boolean;
  createdAt: string;
  isSaved?: boolean;
  isRegenerating?: boolean;
  isFailed?: boolean;
  errorMessage?: string;
}

export interface PhotoshootWorkflowState {
  step: 1 | 2 | 3 | 4 | 5;
  sessionId: string | null;
  uploadedImages: PhotoshootUploadedImage[];
  productCategory: ProductCategory;
  productName: string;
  productColor: string;
  enhancementStyle: EnhancementStyle;
  enhancedVariations: EnhancedVariation[];
  selectedEnhancedIds: string[];
  withModel: boolean;
  selectedModelId: string | null;
  selectedStyles: string[];
  customPrompt: string;
  isEnhancing: boolean;
  isGenerating: boolean;
  generationProgress: number;
  generationStage: string;
  finalResults: PhotoshootFinalResult[];
  selectedResultIds: string[];
  detectedAnalysis?: any;
}

