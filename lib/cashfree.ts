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
  // If running on localhost / 127.0.0.1 in production mode, Cashfree JS SDK blocks
  // with "http://localhost:3000/ is not enabled or approved. Please whitelist your domain..."
  // because Cashfree does not whitelist localhost in the production dashboard.
  // Directly redirecting to Cashfree's official hosted checkout URL bypasses the SDK domain block!
  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");

  if (isLocalhost && environment === "production" && fallbackUrl) {
    window.location.href = fallbackUrl;
    return;
  }

  if (paymentSessionId) {
    try {
      const cashfree = await load({
        mode: environment === "production" ? "production" : "sandbox",
      });

      if (paymentSessionId.startsWith("sub_session_")) {
        // Official Cashfree AutoPay & Recurring Subscriptions mandate checkout
        await cashfree.subscriptionsCheckout({
          subsSessionId: paymentSessionId,
          redirectTarget: "_self", // Directly redirects current browser window to Cashfree AutoPay
        });
      } else {
        // Standard Cashfree Order checkout
        await cashfree.checkout({
          paymentSessionId,
          redirectTarget: "_self",
        });
      }
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
