import api from "@/lib/api";

export interface CreatePaymentResponse {
  success?: boolean;
  payment_url: string;
  order_id: string;
  status?: string;
  billing_cycle?: string;
}

export interface PaymentStatusResponse {
  order_id?: string;
  status: string; // "success", "initiated", "pending", "failed", "cancelled", "expired"
  amount?: number;
  base_amount?: number;
  gst_amount?: number;
  message?: string;
}

export const paymentService = {
  async createPayment(planId: string, billingCycle: string = "monthly"): Promise<CreatePaymentResponse> {
    const normalizedPlan = (planId || "").trim().toUpperCase();
    if (normalizedPlan === "FREE") {
      return {
        success: true,
        payment_url: "/subscription",
        order_id: "FREE_PLAN",
        status: "success",
        billing_cycle: "monthly"
      };
    }

    const payload = {
      plan_id: normalizedPlan,
      billing_cycle: billingCycle.toLowerCase()
    };

    const response = await api.post("/api/v1/payments/payin/create", payload);
    const data = response.data?.data || response.data;

    if (!data?.payment_url && !data?.order_id) {
      throw new Error(data?.detail || "Invalid response received from payment service.");
    }

    return {
      success: data.success ?? true,
      payment_url: data.payment_url,
      order_id: data.order_id,
      status: data.status || "pending",
      billing_cycle: data.billing_cycle || billingCycle
    };
  },

  async getPaymentStatus(orderId: string): Promise<PaymentStatusResponse> {
    if (!orderId) {
      return {
        status: "failed",
        message: "Order ID is missing."
      };
    }

    if (orderId === "FREE_PLAN") {
      return {
        order_id: "FREE_PLAN",
        status: "success",
        amount: 0
      };
    }

    try {
      const response = await api.get(`/api/v1/payments/payin/status/${orderId}`);
      const data = response.data?.data || response.data;
      return {
        order_id: data.order_id || orderId,
        status: (data.status || "pending").toLowerCase(),
        amount: data.amount,
        base_amount: data.base_amount,
        gst_amount: data.gst_amount,
        message: data.message
      };
    } catch (e: any) {
      const status = e?.response?.status;
      const detail = e?.response?.data?.detail || e?.message || "Failed to fetch payment status";
      if (status === 404) {
        return {
          order_id: orderId,
          status: "not_found",
          message: "Payment order not found."
        };
      }
      return {
        order_id: orderId,
        status: "failed",
        message: detail
      };
    }
  }
};

