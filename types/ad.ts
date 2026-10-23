export type AdPlatform =
  | "instagram"
  | "facebook"
  | "google"


export type AdObjective =
  | "product_promotion"
  | "sales"
  | "awareness"
  | "engagement"
  | "lead_generation";

export interface AdRequest {
  product_id?: string;
  content_id?: string;
  platform: AdPlatform;
  objective: AdObjective;
  language: string;
  target_audience?: string;
  additional_instruction?: string;
  cta?: string;
}

export interface AdResponse {
  id: string;
  headline: string;
  primary_text: string;
  description: string;
  cta: string;
  hashtags: string[];
  creative_url: string;
}
