import api from "@/lib/api";

export interface CreatePaymentResponse {
  payment_url: string;
  order_id: string;
}

export interface PaymentStatusResponse {
  status: string; // "success", "pending", "failed", "cancelled", etc.
  message?: string;
}

export const paymentService = {
  async createPayment(planId: string): Promise<CreatePaymentResponse> {
    const response = await api.post("/api/v1/payments/payin/create", { plan_id: planId });
    return response.data;
  },

  async getPaymentStatus(orderId: string): Promise<PaymentStatusResponse> {
    const response = await api.get(`/api/v1/payments/payin/status/${orderId}`);
    return response.data;
  }
};
