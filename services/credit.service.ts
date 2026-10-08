import api from "@/lib/api";
import { CreditBalance, CreditTransaction, Subscription } from "@/types/credits";

export const creditService = {
  async getCredits(): Promise<CreditBalance> {
    try {
      const response = await api.get("/api/v1/credits/me");
      return response.data;
    } catch (error) {
      console.warn("Credit API failed, returning mock data");
      return {
        plan: "FREE",
        credits_total: 100,
        credits_remaining: 100,
        credits_used: 0
      } as CreditBalance;
    }
  },

  async getCreditHistory(): Promise<CreditTransaction[]> {
    try {
      const response = await api.get("/api/v1/credits/history");
      return response.data;
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
