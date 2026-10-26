export interface GeneratedContent {
  _id: string;
  userId?: string;
  businessId?: string;
  type: 'Instagram Post' | 'Instagram Caption' | 'Facebook Post' | 'LinkedIn Post' | 'Promotional Content' | 'Festival Post' | 'Product Advertisement' | 'Reel Script' | 'Ad Copy' | string;
  platform: 'Instagram' | 'Facebook' | 'LinkedIn' | 'YouTube' | string;
  language: string;
  tone: string;
  productId?: string;
  targetAudience?: string;
  topic?: string;
  callToAction?: string;
  additionalInstructions?: string;
  
  // Results
  title: string;
  caption: string;
  hashtags: string[];
  suggestions: string[];
  
  status: 'Draft' | 'Scheduled' | 'Published';
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  image_url?: string;
  media_url?: string;
  [key: string]: any;
}

export interface GenerateContentRequest {
  type: string;
  platform: string;
  language: string;
  tone: string;
  productId?: string;
  targetAudience?: string;
  topic?: string;
  callToAction?: string;
  additionalInstructions?: string;

  // Product-based content creation fields
  productName?: string;
  productDescription?: string;
  features?: string;
  price?: string | number;
  campaignObjective?: string;
  productImages?: string[];

  // Brand Kit properties
  use_brand_kit?: boolean;
  brand_kit_id?: string;
  brand_name?: string;
  brand_colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  brand_font?: string;
  brand_tone?: string;
  logo_url?: string;
  include_logo?: boolean;
}

export interface GeneratePostRequest {
  product_id: string;
  product_ids?: string[];
  platform: string;
  objective: string;
  language: string;
  additional_instruction?: string;
  reference_images?: string[];

  // Brand Kit properties
  use_brand_kit?: boolean;
  brand_kit_id?: string;
  brand_name?: string;
  brand_colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  brand_font?: string;
  brand_tone?: string;
  logo_url?: string;
  include_logo?: boolean;

  // Additional options & content type
  content_type?: string;
  include_text_on_image?: boolean;
  include_offer?: boolean;
  offer_text?: string;
  generate_captions?: boolean;
  generate_hashtags?: boolean;
}

export interface GeneratedPost {
  product_id: string;
  platform: string;
  objective: string;

  headline: string;
  caption: string;
  call_to_action: string;

  hashtags: string[];

  creative_direction?: string;
  image_url?: string;
  media_url?: string;
}
