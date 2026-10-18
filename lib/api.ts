import axios from "axios";

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

  return backend.replace(/\/docs\/?$/, "").replace(/\/+$/, "");
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

api.interceptors.request.use(
  (config) => {
    let token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (!token && typeof document !== "undefined") {
      const match = document.cookie.match(/(?:^|;\s*)access_token=([^;]*)/);
      if (match) token = match[1];
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors like 401 Unauthorized
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const path = window.location.pathname;
      const isPublicRoute =
        path === "/login/user" ||
        path === "/login/admin" ||
        path === "/signup" ||
        path === "/onboarding" ||
        path === "/verify-email";

      if (!isPublicRoute) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/login/user";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
