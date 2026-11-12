declare module "@cashfreepayments/cashfree-js" {
  export interface CashfreeInstance {
    checkout(options: {
      paymentSessionId: string;
      redirectTarget?: "_self" | "_blank" | "_modal" | HTMLElement;
    }): Promise<{
      error?: { message: string; code?: string };
      redirect?: boolean;
      paymentDetails?: any;
    }>;
    subscriptionsCheckout(options: {
      subsSessionId: string;
      redirectTarget?: "_self" | "_blank" | "_top";
    }): Promise<{
      error?: { message: string; code?: string };
      redirect?: boolean;
    }>;
  }

  export function load(options: {
    mode: "production" | "sandbox";
  }): Promise<CashfreeInstance>;
}
