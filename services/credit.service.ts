import api from "@/lib/api";
import { CreditBalance, CreditTransaction, Subscription } from "@/types/credits";

export const creditService = {
  async getCredits(): Promise<CreditBalance> {
    try {
      const response = await api.get("/api/v1/credits/me");
      return response.data;
    } catch (error: any) {
      if (error?.response?.status !== 401 && error?.response?.status !== 404) {
        console.warn("Credit API failed, returning fallback data");
      }
      return {
        plan: "FREE",
        credits_total: 50,
        credits_remaining: 50,
        credits_used: 0
      } as CreditBalance;
    }
  },

  async getPricing(): Promise<{
    feature_pricing: Record<string, number>;
    plans: Record<string, any>;
  }> {
    try {
      const res = await api.get("/api/v1/credits/pricing");
      return res.data;
    } catch {
      return {
        feature_pricing: {
          ai_image: 4,
          ai_post: 3,
          ai_caption: 3,
          ai_reel: 5,
          ai_photoshoot: 2,
          website_builder: 2,
        },
        plans: {},
      };
    }
  },

  async deductCredits(action: string, description?: string): Promise<{
    success: boolean;
    credits_remaining: number;
    credits_total: number;
    credits_used: number;
    cost: number;
  }> {
    try {
      const res = await api.post("/api/v1/credits/deduct", { action, description });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("credit-update", { detail: res.data }));
      }
      return res.data;
    } catch (err: any) {
      if (err?.response?.status === 402) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("insufficient-credits", { detail: { action } }));
        }
      }
      throw err;
    }
  },

  notifyCreditChange() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("credit-update"));
    }
  },

  async getCreditHistory(): Promise<CreditTransaction[]> {
    try {
      const response = await api.get("/api/v1/credits/history");
      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data?.transactions)) return response.data.transactions;
      if (Array.isArray(response.data?.data)) return response.data.data;
      return [];
    } catch (error) {
      return [];
    }
  },

  async getSubscription(): Promise<Subscription> {
    try {
      const response = await api.get("/api/v1/subscription/me");
      return response.data;
    } catch (error) {
      return {
        plan: "Free",
        status: "active"
      } as Subscription;
    }
  }
};
