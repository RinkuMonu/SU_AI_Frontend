// Matches exactly what GET /api/v1/analytics/overview returns from the backend

export interface ContentMetrics {
  posts: number;
  reels: number;
  images: number;
  photoshoots: number;
  captions: number;
}

export interface AIUsageMetrics {
  total_generations: number;
  post_generations: number;
  image_generations: number;
  photoshoot_generations: number;
  reel_generations: number;
  credits_used: number;
}

export interface BusinessMetrics {
  products: number;
  calendars: number;
}

export interface DailyActivity {
  date: string;
  posts: number;
  reels: number;
  ai_generations: number;
}

export interface ExternalMetrics {
  reach: number | null;
  engagement: number | null;
  leads: number | null;
  direct_enquiries?: number | null;
  status: "not_connected" | "connected";
}

export interface MarketingScoreBreakdown {
  content_activity: number;
  ai_usage: number;
  calendar_usage: number;
  product_catalogue: number;
  reel_activity: number;
}

export interface MarketingScore {
  score: number;
  breakdown: MarketingScoreBreakdown;
  formula: string;
}

export interface Recommendation {
  text: string;
  type: "products" | "content" | "reels" | "calendar" | "photoshoots" | "images" | "general";
}

export interface AnalyticsPeriod {
  start: string;
  end: string;
}

// This is the `data` field inside the API response: { success: true, data: AnalyticsData }
export interface AnalyticsData {
  range: string;
  period: AnalyticsPeriod;
  content: ContentMetrics;
  ai_usage: AIUsageMetrics;
  business: BusinessMetrics;
  activity: DailyActivity[];
  external: ExternalMetrics;
  marketing_score: MarketingScore;
  recommendation: Recommendation;
}

// This is the full API response wrapper
export interface AnalyticsApiResponse {
  success: boolean;
  data: AnalyticsData;
}
