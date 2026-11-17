export interface CashfreeCheckoutOptions {
  paymentSessionId?: string | null;
  environment?: "production" | "sandbox";
  fallbackUrl?: string | null;
  redirectTarget?: "_modal" | "_self";
}

export interface CashfreeCheckoutResult {
  status: "SUCCESS" | "FAILED" | "CANCELLED" | "REDIRECTED";
  error?: string;
  paymentDetails?: any;
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
 * Initiates direct Cashfree hosted checkout page redirection.
 * Launches the official Cashfree JS SDK v3 or submits the authentic Cashfree POST form,
 * completely avoiding "client session is invalid" errors caused by unauthenticated GET hash navigation.
 */
export async function launchCashfreeCheckout({
  paymentSessionId,
  environment = "production",
  fallbackUrl,
  redirectTarget = "_self",
}: CashfreeCheckoutOptions): Promise<CashfreeCheckoutResult> {
  if (typeof window === "undefined") {
    return { status: "FAILED", error: "Window undefined" };
  }

  const mode = environment === "production" ? "production" : "sandbox";

  // 1. Prioritize official Cashfree JS SDK v3 checkout
  if (paymentSessionId) {
    try {
      const cashfree = await loadCashfree(mode);
      if (cashfree) {
        if (paymentSessionId.startsWith("sub_session_")) {
          const res = await cashfree.subscriptionsCheckout({
            subsSessionId: paymentSessionId,
            redirectTarget,
          });

          if (res?.error) {
            const isAborted =
              res.error.code === "user_dropped_error" ||
              res.error.message?.toLowerCase().includes("user aborted") ||
              res.error.message?.toLowerCase().includes("cancelled");
            return {
              status: isAborted ? "CANCELLED" : "FAILED",
              error: isAborted
                ? "Payment was cancelled. You have not been charged."
                : res.error.message || "Payment could not be completed.",
            };
          }
          if (res?.paymentDetails?.paymentStatus === "SUCCESS") {
            return { status: "SUCCESS", paymentDetails: res.paymentDetails };
          }
          return { status: "REDIRECTED" };
        } else {
          const res = await cashfree.checkout({
            paymentSessionId,
            redirectTarget,
          });

          if (res?.error) {
            const isAborted =
              res.error.code === "user_dropped_error" ||
              res.error.message?.toLowerCase().includes("user aborted") ||
              res.error.message?.toLowerCase().includes("cancelled");
            return {
              status: isAborted ? "CANCELLED" : "FAILED",
              error: isAborted
                ? "Payment was cancelled. You have not been charged."
                : res.error.message || "Payment could not be completed.",
            };
          }

          if (res?.paymentDetails?.paymentStatus === "SUCCESS") {
            return { status: "SUCCESS", paymentDetails: res.paymentDetails };
          }

          if (res?.paymentDetails?.paymentStatus === "FAILED") {
            return {
              status: "FAILED",
              error: "Payment was not successful. Please try again.",
            };
          }

          return { status: "REDIRECTED" };
        }
      }
    } catch (err: any) {
      console.warn("Cashfree JS SDK launch failed, falling back to direct POST form:", err);
    }

    // 2. Direct POST Form Submission Fallback:
    // Cashfree strictly expects an HTTP POST request to /order/ with form-encoded `payment_session_id`.
    try {
      const isSub = paymentSessionId.startsWith("sub_session_");
      const actionUrl =
        mode === "production"
          ? isSub
            ? "https://payments.cashfree.com/subscriptions/"
            : "https://payments.cashfree.com/order/"
          : isSub
          ? "https://payments-test.cashfree.com/subscriptions/"
          : "https://payments-test.cashfree.com/order/";

      const form = document.createElement("form");
      form.method = "POST";
      form.action = actionUrl;
      form.style.display = "none";

      const fields: Record<string, string> = isSub
        ? {
            subs_session_id: paymentSessionId,
            form_id: "form_subs_id_atom",
            x_request_id: "x_request_id_form_subs_atom",
            platform: "c",
          }
        : {
            payment_session_id: paymentSessionId,
            form_id: "form_id_atom",
            x_request_id: "x_request_id_form_atom",
            platform: "c",
          };

      try {
        fields.browser_meta = btoa(JSON.stringify({ userAgent: navigator.userAgent }));
      } catch (_) {}

      for (const [key, val] of Object.entries(fields)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = val;
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
      return { status: "REDIRECTED" };
    } catch (formErr) {
      console.warn("Cashfree form submission fallback failed:", formErr);
    }
  }

  // 3. Fallback direct URL if valid (excluding any broken /order/# URLs)
  if (
    fallbackUrl &&
    !fallbackUrl.includes("/order/#") &&
    !fallbackUrl.includes("/subscriptions/#")
  ) {
    window.location.href = fallbackUrl;
    return { status: "REDIRECTED" };
  }

  throw new Error("Unable to open Cashfree payment checkout. Please retry.");
}
