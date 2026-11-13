export interface CashfreeCheckoutOptions {
  paymentSessionId?: string | null;
  environment?: "production" | "sandbox";
  fallbackUrl?: string | null;
}

/**
 * Loads Cashfree JS SDK instance dynamically to prevent Next.js / Turbopack build-time
 * resolution errors if the npm package isn't installed.
 */
async function loadCashfree(mode: "production" | "sandbox"): Promise<any> {
  if (typeof window === "undefined") return null;

  // 1. Try global window.Cashfree if already loaded via script
  if ((window as any).Cashfree) {
    return (window as any).Cashfree({ mode });
  }

  // 2. Try dynamic import of npm package
  try {
    const pkg = await import("@cashfreepayments/cashfree-js");
    if (pkg && typeof pkg.load === "function") {
      return await pkg.load({ mode });
    }
  } catch {
    // Dynamic import failed, fallback to CDN script
  }

  // 3. Fallback: Load official Cashfree SDK v3 via CDN script
  return new Promise((resolve, reject) => {
    const scriptId = "cashfree-js-sdk-v3";
    const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (existing) {
      if ((window as any).Cashfree) {
        resolve((window as any).Cashfree({ mode }));
      } else {
        existing.addEventListener("load", () => {
          if ((window as any).Cashfree) {
            resolve((window as any).Cashfree({ mode }));
          } else {
            reject(new Error("Cashfree SDK failed to initialize"));
          }
        });
        existing.addEventListener("error", reject);
      }
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.onload = () => {
      if ((window as any).Cashfree) {
        resolve((window as any).Cashfree({ mode }));
      } else {
        reject(new Error("Cashfree SDK failed to initialize"));
      }
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
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
      const mode = environment === "production" ? "production" : "sandbox";
      const cashfree = await loadCashfree(mode);

      if (cashfree) {
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
      }
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
