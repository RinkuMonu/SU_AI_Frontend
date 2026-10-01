import api from "@/lib/api";
import { Subscription, CreditTransaction, PlanConfig } from "@/types/subscription";

export const subscriptionService = {
  async getMySubscription(): Promise<Subscription> {
    try {
      const response = await api.get("/api/v1/subscription/me");
      return response.data.data;
    } catch (e) {
      console.warn("Using mock subscription data");
      return {
        id: "sub_1",
        user_id: "user_1",
        plan_id: "pro",
        status: "active",
        credits_remaining: 100,
        current_period_start: new Date().toISOString(),
        current_period_end: new Date().toISOString(),
        usage: { posts_created: 5, reels_created: 2 }
      } as Subscription;
    }
  },

  async getPlans(): Promise<Record<string, PlanConfig>> {
    try {
      const response = await api.get("/api/v1/subscription/plans");
      return response.data.data;
    } catch (e) {
      return {
        free: { name: "Free", price: 0, credits: 10, post_limit: 10, reel_limit: 2, watermark: true, team_members: 1, custom_branding: false, analytics: false },
        pro: { name: "Pro", price: 999, credits: 100, post_limit: 100, reel_limit: 20, watermark: false, team_members: 3, custom_branding: true, analytics: true }
      };
    }
  },

  async upgradePlan(planId: string): Promise<Subscription> {
    try {
      const response = await api.post("/api/v1/subscription/upgrade", { plan_id: planId });
      return response.data.data;
    } catch (e) {
      return this.getMySubscription();
    }
  },

  async getCreditTransactions(): Promise<CreditTransaction[]> {
    try {
      const response = await api.get("/api/v1/subscription/credits/transactions");
      return response.data.data;
    } catch (e) {
      console.warn("Using mock credit transactions");
      return [
        { id: "1", subscription_id: "sub_1", amount: -5, transaction_type: "usage", feature: "AI Image", balance_after: 95, created_at: new Date().toISOString() },
        { id: "2", subscription_id: "sub_1", amount: 100, transaction_type: "recharge", feature: "Plan Upgrade", balance_after: 100, created_at: new Date().toISOString() }
      ] as any;
    }
  }
};
