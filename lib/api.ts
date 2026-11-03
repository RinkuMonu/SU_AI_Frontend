import axios, { AxiosError } from "axios";

export const getBaseUrl = () => {
  // Browser context (client-side):
  if (typeof window !== "undefined") {
    // If the browser is running on localhost or 127.0.0.1, always use relative URLs ("")
    // This routes all requests through Next.js rewrite proxy to http://127.0.0.1:8000,
    // completely eliminating Chrome Private Network Access (PNA), CORS preflight, and IPv6 [::1] connection refused issues.
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "0.0.0.0";

    if (isLocalhost) {
      return "";
    }

    // In production or custom remote frontend:
    const publicApi = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_URL;
    if (publicApi) {
      return publicApi.replace(/\/docs\/?$/, "").replace(/\/+$/, "");
    }
    return "";
  }

  // On the server side (SSR / Node.js runtime):
  const backend =
    process.env.INTERNAL_BACKEND_URL ||
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000";

  return backend.replace(/\/docs\/?$/, "").replace(/\/+$/, "");
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 180000, // 3 minutes timeout for heavy AI generation
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
        url.includes("/auth/linkedin") ||
        url.includes("/influencer/onboarding");

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

    // Handle transient network errors: if direct backend URL failed (e.g. uvicorn reload or socket reset), retry once
    const config = error.config as any;
    if (
      (!error.response || error.code === "ERR_NETWORK" || error.message === "Network Error") &&
      config &&
      !config._retry
    ) {
      config._retry = true;
      // If direct backend port failed, fallback to local Next.js proxy rewrite
      if (typeof window !== "undefined" && config.baseURL && config.baseURL.startsWith("http")) {
        config.baseURL = "";
      }
      return new Promise((resolve) => setTimeout(resolve, 800)).then(() => api(config));
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
