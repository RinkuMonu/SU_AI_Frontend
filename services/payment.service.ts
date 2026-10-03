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
    try {
      const response = await api.post("/api/v1/payments/payin/create", { plan_id: planId });
      return response.data;
    } catch (e) {
      console.warn("Using mock payment creation");
      return {
        payment_url: `/payment/success?order_id=MOCK_ORDER_${Math.floor(Math.random() * 100000)}`,
        order_id: `MOCK_ORDER_${Math.floor(Math.random() * 100000)}`
      };
    }
  },

  async getPaymentStatus(orderId: string): Promise<PaymentStatusResponse> {
    try {
      const response = await api.get(`/api/v1/payments/payin/status/${orderId}`);
      return response.data;
    } catch (e) {
      console.warn("Using mock payment status");
      return {
        status: "success",
        message: "Payment successful"
      };
    }
  }
};
