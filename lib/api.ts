import axios from "axios";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (isLocal) {
      const envUrl = process.env.NEXT_PUBLIC_API_URL;
      if (envUrl && (envUrl.includes("localhost") || envUrl.includes("127.0.0.1") || envUrl.includes("ngrok"))) {
        return envUrl.replace(/\/docs\/?$/, "").replace(/\/$/, "");
      }
      return "http://127.0.0.1:8000";
    }
  }

  let url = process.env.NEXT_PUBLIC_API_URL || "https://api.dhandagrow.com";
  return url.replace(/\/docs\/?$/, "").replace(/\/$/, "");
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
