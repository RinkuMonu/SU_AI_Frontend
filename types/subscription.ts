export type PlanConfig = {
  name: string;
  tagline?: string;
  description?: string;
  price: number;
  base_price?: number;
  gst_rate?: number;
  gst_percent?: number;
  gst_amount?: number;
  total_price?: number;
  currency: string;
  billing_cycle: string;
  credits: number;
  post_limit: number;
  reel_limit: number;
  team_members: number;
  brand_profiles?: number;
  watermark: boolean;
  multiple_businesses: boolean;
  api_access: boolean;
  white_label: boolean;
  features: string[];
  bullet_points?: string[];
  custom_branding?: boolean;
  analytics?: boolean;
  is_legacy?: boolean;
};

export type SubscriptionUsage = {
  posts_created: number;
  reels_created: number;
  month?: string;
};

export type Subscription = {
  id?: string;
  user_id?: string;
  plan_id: string;
  status: string;
  credits_remaining: number;
  usage: SubscriptionUsage;
  plan_details?: PlanConfig;
  current_period_end?: string;
};

export type CreditTransaction = {
  id?: string;
  action: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  description?: string;
  created_at: string;
};
