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
        credits_total: 5,
        credits_remaining: 5,
        credits_used: 0
      } as CreditBalance;
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
