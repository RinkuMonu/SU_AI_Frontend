import api from "@/lib/api";
import { Subscription, CreditTransaction, PlanConfig } from "@/types/subscription";

export const subscriptionService = {
  async getMySubscription(): Promise<Subscription> {
    const response = await api.get("/api/v1/subscription/me");
    return response.data.data;
  },

  async getPlans(): Promise<Record<string, PlanConfig>> {
    const response = await api.get("/api/v1/subscription/plans");
    return response.data.data;
  },

  async upgradePlan(planId: string): Promise<Subscription> {
    const response = await api.post("/api/v1/subscription/upgrade", { plan_id: planId });
    return response.data.data;
  },

  async getCreditTransactions(): Promise<CreditTransaction[]> {
    const response = await api.get("/api/v1/subscription/credits/transactions");
    return response.data.data;
  }
};
