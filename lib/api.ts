import axios from "axios";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (isLocal) {
      const envUrl = process.env.NEXT_PUBLIC_API_URL;
      if (envUrl && (envUrl.includes("localhost") || envUrl.includes("127.0.0.1"))) {
        return envUrl.replace(/\/docs\/?$/, "").replace(/\/$/, "");
      }
      return "http://localhost:8000";
    }
  }

  let url = process.env.NEXT_PUBLIC_API_URL || "https://api.dhandagrow.com";
  return url.replace(/\/docs\/?$/, "").replace(/\/$/, "");
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors like 401 Unauthorized
    if (error.response?.status === 401 && window.location.pathname !== '/login/user' && window.location.pathname !== '/login/admin') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login/user';
    }
    return Promise.reject(error);
  }
);

export default api;
