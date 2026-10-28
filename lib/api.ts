import axios, { AxiosError } from "axios";

export const getBaseUrl = () => {
  // In the browser, ALWAYS use empty string "" so that all requests are relative same-origin.
  // Next.js rewrites in next.config.ts will securely forward /api/:path* to the backend server-side.
  // This guarantees the real backend IP, domain, ngrok tunnel, and port are 100% hidden in DevTools/Inspect!
  if (typeof window !== "undefined") {
    return "";
  }

  // On the server side (SSR / Node.js runtime):
  const backend =
    process.env.INTERNAL_BACKEND_URL ||
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000";

  return backend
    .replace(/\/docs\/?$/, "")
    .replace(/\/+$/, "")
    .replace(/^http:\/\/localhost(?=[:/]|$)/i, "http://127.0.0.1");
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

/**
 * Sanitize token string by validating and stripping duplicate 'Bearer ' prefixes.
 * Returns null if token is invalid, empty, or string literals like "undefined" / "null".
 */
export const sanitizeToken = (token: any): string | null => {
  if (!token || typeof token !== "string") return null;
  const trimmed = token.trim();
  if (
    trimmed === "" ||
    trimmed === "undefined" ||
    trimmed === "null" ||
    trimmed === "[object Object]"
  ) {
    return null;
  }
  return trimmed.replace(/^Bearer\s+/i, "").trim();
};

api.interceptors.request.use(
  (config) => {
    // If Authorization header is already present, sanitize it
    if (config.headers.Authorization && typeof config.headers.Authorization === "string") {
      const sanitized = sanitizeToken(config.headers.Authorization);
      if (sanitized) {
        config.headers.Authorization = `Bearer ${sanitized}`;
      } else {
        delete config.headers.Authorization;
      }
    } else {
      // Look up token from localStorage and cookies
      let rawToken: string | null = null;
      if (typeof window !== "undefined") {
        rawToken = localStorage.getItem("access_token") || localStorage.getItem("token");
        // Clean up malformed tokens in localStorage immediately
        if (rawToken && !sanitizeToken(rawToken)) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("token");
          rawToken = null;
        }
      }

      if (!rawToken && typeof document !== "undefined") {
        const match = document.cookie.match(/(?:^|;\s*)(?:access_token|token)=([^;]*)/);
        if (match) rawToken = match[1];
      }

      const cleanToken = sanitizeToken(rawToken);
      if (cleanToken) {
        config.headers.Authorization = `Bearer ${cleanToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Module-level guard to avoid multiple parallel redirect loops on 401
let isRedirecting = false;

export const isPublicRoute = (path: string): boolean => {
  if (!path) return true;
  if (path === "/") return true;

  const publicPrefixes = [
    "/login",
    "/signup",
    "/onboarding",
    "/select-role",
    "/role-selection",
    "/verify-",
    "/features",
    "/pricing",
    "/about",
    "/careers",
    "/blog",
    "/contact",
    "/help",
    "/download",
    "/legal",
    "/privacy",
    "/terms",
    "/refund",
    "/cookies",
    "/sitemap",
    "/vision",
    "/mission",
    "/cancellation-",
  ];

  return publicPrefixes.some((prefix) => path.startsWith(prefix));
};

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized globally
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const url = String(error.config?.url || "");
      const path = window.location.pathname || "/";

      // 1. If this was an explicit login / verification / password attempt, do NOT auto-redirect or clear session
      const isAuthAction =
        url.includes("/auth/login") ||
        url.includes("/auth/verify-otp") ||
        url.includes("/auth/signup") ||
        url.includes("/auth/change-password") ||
        url.includes("/auth/send-otp") ||
        url.includes("/auth/google") ||
        url.includes("/auth/facebook") ||
        url.includes("/auth/instagram") ||
        url.includes("/auth/linkedin");

      // 2. Mark error as handled so global unhandledrejection listener knows not to crash
      (error as any).__isHandled401 = true;

      if (!isAuthAction) {
        // Clear stale credentials
        try {
          localStorage.removeItem("access_token");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          if (typeof document !== "undefined") {
            document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
          }
        } catch (_) {}

        // If on a protected route, safely redirect once to login
        if (!isPublicRoute(path) && !isRedirecting) {
          isRedirecting = true;
          try {
            sessionStorage.setItem("auth_redirect_after", window.location.pathname + window.location.search);
          } catch (_) {}

          setTimeout(() => {
            window.location.replace("/login/user");
          }, 100);
        }
      }
    }

    return Promise.reject(error);
  }
);

// Install unhandledrejection listener in browser to prevent Turbopack runtime error overlay on handled 401s
if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    if (
      reason &&
      (reason.isAxiosError || reason.name === "AxiosError" || axios.isAxiosError(reason)) &&
      (reason.response?.status === 401 || reason.status === 401 || reason.__isHandled401)
    ) {
      // Prevent Next.js Turbopack development overlay from interrupting the user experience
      event.preventDefault();
    }
  });
}

export default api;
