import { load } from "@cashfreepayments/cashfree-js";

export interface CashfreeCheckoutOptions {
  paymentSessionId?: string | null;
  environment?: "production" | "sandbox";
  fallbackUrl?: string | null;
}

/**
 * Initiates direct Cashfree checkout redirection using the official Cashfree JS SDK v3.
 * Eliminates "client session is invalid" errors by establishing an authenticated session handshake.
 */
export async function launchCashfreeCheckout({
  paymentSessionId,
  environment = "production",
  fallbackUrl,
}: CashfreeCheckoutOptions): Promise<void> {
  if (paymentSessionId) {
    try {
      const cashfree = await load({
        mode: environment === "production" ? "production" : "sandbox",
      });

      await cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_self", // Directly redirects current browser window to Cashfree checkout
      });
      return;
    } catch (err) {
      console.warn("Cashfree JS SDK launch failed, falling back to direct URL:", err);
    }
  }

  // Fallback to direct redirect URL if provided
  if (fallbackUrl && typeof window !== "undefined") {
    window.location.href = fallbackUrl;
    return;
  }

  throw new Error("Unable to open Cashfree payment checkout. Please retry.");
}
