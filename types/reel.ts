export interface GenerateReelRequest {
  product_id?: string;
  product_name?: string;
  product_category?: string;
  subcategory?: string;
  product_type?: string;
  generation_mode?: 'product' | 'creative' | 'prompt' | 'veo';
  prompt?: string;
  custom_prompt?: string;
  video_style?: string;
  aspect_ratio?: string;
  festival_theme?: string;
  product_description?: string;
  product_image_url?: string;
  product_images?: string[];
  enhance_image?: boolean;
  image_enhancement_prompt?: string;
  objective: string;
  platform: string;
  language: string;
  duration: number;
  tone?: string;
  voiceover_type?: 'none' | 'ai' | 'upload';
  voice_tone?: string;
  voice_language?: string;
  voice_audio_url?: string;
  background_music?: string;
  captions_enabled?: boolean;
  offer?: string;
  offer_type?: string;
  offer_discount?: string;
  promo_code?: string;
  offer_start_date?: string;
  offer_end_date?: string;
  offer_terms?: string;
  additional_instruction?: string;

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

export interface ReelScene {
  scene_number: number;
  duration_seconds: number;
  visual: string;
  voiceover: string;
  on_screen_text?: string;
  transition?: string;
}

export interface ReelScript {
  title: string;
  objective: string;
  hook: string;
  hook_headline?: string;
  hook_highlight?: string;
  trending_audio?: string;
  creator_name?: string;
  follower_count?: string;
  likes_count?: string;
  comments_count?: string;
  duration_seconds: number;
  language: string;
  tone: string;
  scenes: ReelScene[];
  cta: string;
  caption: string;
  hashtags: string[];
}

export interface ReelGenerationResponse {
  success: boolean;
  job_id?: string;
  status: string;
  message?: string;
}

export interface ReelJobStatus {
  job_id: string;
  status: string; // "queued", "generating_script", "generating_voice", "generating_video", "composing", "completed", "failed"
  progress: number;
  stage: string;
  message?: string;
  video_url?: string;
  thumbnail_url?: string;
  audio_url?: string;
  script?: ReelScript;
  caption?: string;
  hashtags?: string[];
  product_name?: string;
  product_category?: string;
  generation_mode?: 'product' | 'creative';
  festival_theme?: string;
  product_description?: string;
  hook_headline?: string;
  hook_highlight?: string;
  trending_audio?: string;
  creator_name?: string;
  follower_count?: string;
  likes_count?: string;
  comments_count?: string;
}

export interface Reel {
  _id: string;
  user_id: string;
  business_id: string;
  brand_id?: string;
  product_id: string;
  
  objective: string;
  platform: string;
  language: string;
  duration: number;
  
  script?: ReelScript;
  
  voice_url?: string;
  video_url?: string;
  thumbnail_url?: string;
  audio_url?: string;
  
  status: string;
  job_id?: string;
  provider?: string;
  
  caption?: string;
  hashtags?: string[];
  
  created_at: string;
  updated_at: string;
}


