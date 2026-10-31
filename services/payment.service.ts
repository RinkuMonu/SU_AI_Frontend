import api from "@/lib/api";

export interface CreatePaymentResponse {
  success?: boolean;
  payment_url: string;
  upi_url?: string;
  order_id: string;
  subscription_id?: string;
  subscription_session_id?: string;
  amount?: number;
  auth_amount?: number;
  recurring_amount?: number;
  plan_name?: string;
  status?: string;
  billing_cycle?: string;
}

export interface PaymentStatusResponse {
  order_id?: string;
  subscription_id?: string;
  status: string; // "success", "active", "initiated", "pending", "failed", "cancelled", "expired"
  amount?: number;
  auth_amount?: number;
  recurring_amount?: number;
  base_amount?: number;
  gst_amount?: number;
  message?: string;
}

export interface PaymentVerifyResponse {
  success: boolean;
  status: string;
  order_id: string;
  subscription_id?: string;
  verified: boolean;
  message: string;
  plan_id?: string;
  amount?: number;
}

export interface PaymentCancelResponse {
  success: boolean;
  status: string;
  order_id: string;
  message: string;
}

export const paymentService = {
  /**
   * Creates a Cashfree recurring subscription & autopay checkout mandate.
   * Directs user to the Cashfree Subscriptions Checkout URL.
   */
  async createPayment(
    planId: string,
    billingCycle: string = "monthly",
    customerPhone?: string
  ): Promise<CreatePaymentResponse> {
    const normalizedPlan = (planId || "").trim().toUpperCase();
    if (normalizedPlan === "FREE") {
      return {
        success: true,
        payment_url: "/subscription",
        order_id: "FREE_PLAN",
        subscription_id: "FREE_PLAN",
        status: "success",
        billing_cycle: "monthly",
      };
    }

    const payload: Record<string, any> = {
      plan_id: normalizedPlan,
      billing_cycle: billingCycle.toLowerCase(),
    };

    if (customerPhone) {
      payload.customer_phone = customerPhone;
    }

    // Call official Cashfree Subscriptions & AutoPay endpoint
    const response = await api.post("/api/v1/payments/subscription/create", payload);
    const data = response.data?.data || response.data;

    const subId = data?.subscription_id || data?.order_id || "";

    if (!data?.payment_url && !subId) {
      throw new Error(data?.detail || "Invalid response received from Cashfree payment service.");
    }

    return {
      success: data.success ?? true,
      payment_url: data.payment_url,
      subscription_id: subId,
      order_id: subId,
      subscription_session_id: data.subscription_session_id,
      amount: data.recurring_amount ?? data.auth_amount ?? data.amount,
      auth_amount: data.auth_amount,
      recurring_amount: data.recurring_amount,
      plan_name: data.plan_name || `${normalizedPlan} Plan`,
      status: data.status || "INITIALIZED",
      billing_cycle: data.billing_cycle || billingCycle,
    };
  },

  /**
   * Fetches the current live status of a Cashfree subscription mandate.
   */
  async getPaymentStatus(orderId: string): Promise<PaymentStatusResponse> {
    if (!orderId) {
      return {
        status: "failed",
        message: "Order or Subscription ID is missing.",
      };
    }

    if (orderId === "FREE_PLAN") {
      return {
        order_id: "FREE_PLAN",
        subscription_id: "FREE_PLAN",
        status: "success",
        amount: 0,
      };
    }

    try {
      // Primary: Cashfree subscription status endpoint
      const response = await api.get(`/api/v1/payments/subscription/status/${orderId}`);
      const data = response.data?.data || response.data;
      const rawStatus = (data.status || "pending").toLowerCase();
      const isSuccess =
        rawStatus === "active" ||
        rawStatus === "success" ||
        rawStatus === "completed";

      return {
        order_id: data.subscription_id || data.order_id || orderId,
        subscription_id: data.subscription_id || orderId,
        status: isSuccess ? "success" : rawStatus,
        amount: data.recurring_amount ?? data.auth_amount ?? data.amount,
        auth_amount: data.auth_amount,
        recurring_amount: data.recurring_amount,
        base_amount: data.base_amount,
        gst_amount: data.gst_amount,
        message:
          isSuccess
            ? "Subscription mandate is active and verified."
            : data.message || `Status: ${data.status}`,
      };
    } catch (e: any) {
      // Fallback for legacy order IDs
      try {
        const fallbackRes = await api.get(`/api/v1/payments/payin/status/${orderId}`);
        const fData = fallbackRes.data?.data || fallbackRes.data;
        const fStatus = (fData.status || "pending").toLowerCase();
        return {
          order_id: fData.order_id || orderId,
          status: fStatus === "active" ? "success" : fStatus,
          amount: fData.amount,
          base_amount: fData.base_amount,
          gst_amount: fData.gst_amount,
          message: fData.message,
        };
      } catch (_) {
        const detail =
          e?.response?.data?.detail || e?.message || "Failed to fetch subscription status";
        return {
          order_id: orderId,
          status: "failed",
          message: detail,
        };
      }
    }
  },

  /**
   * Verifies payment / mandate completion with the server.
   */
  async verifyPayment(orderId: string): Promise<PaymentVerifyResponse> {
    try {
      const response = await api.post("/api/v1/payments/subscription/verify", {
        subscription_id: orderId,
      });
      const data = response.data?.data || response.data;
      const rawStatus = (data.status || "").toLowerCase();
      const isSuccess =
        rawStatus === "active" ||
        rawStatus === "success" ||
        rawStatus === "completed";

      return {
        success: isSuccess,
        status: isSuccess ? "success" : rawStatus || "pending",
        order_id: data.subscription_id || data.order_id || orderId,
        subscription_id: data.subscription_id || orderId,
        verified: isSuccess,
        message:
          data.message ||
          (isSuccess ? "Subscription verified and active!" : "Mandate pending approval"),
        plan_id: data.plan_id,
        amount: data.recurring_amount ?? data.auth_amount ?? data.amount,
      };
    } catch (_) {
      // Fallback to getPaymentStatus check
      const statusRes = await this.getPaymentStatus(orderId);
      const isSuccess =
        statusRes.status === "success" || statusRes.status === "active";
      return {
        success: isSuccess,
        status: statusRes.status,
        order_id: statusRes.order_id || orderId,
        subscription_id: statusRes.subscription_id || orderId,
        verified: isSuccess,
        message:
          statusRes.message ||
          (isSuccess ? "Subscription verified and active!" : "Pending verification"),
        amount: statusRes.amount,
      };
    }
  },

  async cancelPayment(orderId: string): Promise<PaymentCancelResponse> {
    try {
      const response = await api.post("/api/v1/payments/payin/cancel", { order_id: orderId });
      const data = response.data?.data || response.data;
      return {
        success: Boolean(data.success),
        status: data.status || "cancelled",
        order_id: data.order_id || orderId,
        message: data.message || "Subscription cancelled",
      };
    } catch (_) {
      return {
        success: true,
        status: "cancelled",
        order_id: orderId,
        message: "Payment cancelled",
      };
    }
  },
};
