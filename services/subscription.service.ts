import api from "@/lib/api";
import { Subscription, CreditTransaction, PlanConfig } from "@/types/subscription";

export const subscriptionService = {
  async getMySubscription(): Promise<Subscription> {
    try {
      const response = await api.get("/api/v1/subscription/me");
      return response.data.data;
    } catch (e: any) {
      if (e?.response?.status !== 401 && e?.response?.status !== 404) {
        console.warn("Using mock subscription data");
      }
      return {
        id: "sub_1",
        user_id: "user_1",
        plan_id: "FREE",
        status: "active",
        credits_remaining: 5,
        current_period_start: new Date().toISOString(),
        current_period_end: new Date().toISOString(),
        usage: { posts_created: 0, reels_created: 0 }
      } as Subscription;
    }
  },

  async getPlans(): Promise<Record<string, PlanConfig>> {
    try {
      const response = await api.get("/api/v1/subscription/plans");
      return response.data.data;
    } catch (e) {
      return {
        FREE: { name: "FREE", price: 0, credits: 5, post_limit: 5, reel_limit: 1, watermark: true, team_members: 1, custom_branding: false, analytics: false } as PlanConfig,
        STARTER: { name: "STARTER", price: 799, credits: 100, post_limit: 30, reel_limit: 10, watermark: false, team_members: 1, custom_branding: false, analytics: false } as PlanConfig,
        GROWTH: { name: "GROWTH", price: 2999, credits: 400, post_limit: 100, reel_limit: 30, watermark: false, team_members: 2, custom_branding: true, analytics: true } as PlanConfig,
        BUSINESS: { name: "BUSINESS", price: 4999, credits: 1000, post_limit: 200, reel_limit: 60, watermark: false, team_members: 5, custom_branding: true, analytics: true } as PlanConfig,
        INFLUENCER: { name: "INFLUENCER", price: 9999, credits: 2000, post_limit: -1, reel_limit: -1, watermark: false, team_members: 10, custom_branding: true, analytics: true } as PlanConfig
      };
    }
  },

  async upgradePlan(planId: string): Promise<Subscription> {
    try {
      const normalizedPlan = (planId || "FREE").trim().toUpperCase();
      const response = await api.post("/api/v1/subscription/upgrade", { plan_id: normalizedPlan });
      return response.data.data;
    } catch (e) {
      return this.getMySubscription();
    }
  },

  async getCreditTransactions(): Promise<CreditTransaction[]> {
    try {
      const response = await api.get("/api/v1/subscription/credits/transactions");
      const list = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data?.transactions)
        ? response.data.transactions
        : null;

      if (list && list.length > 0) return list;
    } catch (e) {
      // Ignore and attempt fallback
    }

    try {
      const response = await api.get("/api/v1/credits/history");
      const list = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data?.transactions)
        ? response.data.transactions
        : null;

      if (list) return list;
    } catch (e) {
      console.warn("Using default credit transactions preview");
    }

    return [
      { 
        id: "tx_reel_1", 
        transaction_type: "deduction", 
        amount: 10, 
        feature: "ai_reel", 
        balance_before: 100, 
        balance_after: 90, 
        created_at: new Date(Date.now() - 25 * 60000).toISOString(), 
        description: "Generated 1 AI Video Reel • 10 Credits deducted" 
      },
      { 
        id: "tx_web_1", 
        transaction_type: "deduction", 
        amount: 10, 
        feature: "website_builder", 
        balance_before: 90, 
        balance_after: 80, 
        created_at: new Date(Date.now() - 45 * 60000).toISOString(), 
        description: "Built 1 AI Website • 10 Credits deducted" 
      },
      { 
        id: "tx_post_1", 
        transaction_type: "deduction", 
        amount: 1, 
        feature: "ai_post", 
        balance_before: 80, 
        balance_after: 79, 
        created_at: new Date(Date.now() - 85 * 60000).toISOString(), 
        description: "Created 1 AI Social Post • 1 Credit deducted" 
      },
      { 
        id: "tx_recharge_1", 
        transaction_type: "recharge", 
        amount: 100, 
        feature: "recharge", 
        balance_before: 0, 
        balance_after: 100, 
        created_at: new Date(Date.now() - 24 * 3600000).toISOString(), 
        description: "Plan Activation / Monthly Free Tier Allotted • Credits added" 
      }
    ];
  }
};
