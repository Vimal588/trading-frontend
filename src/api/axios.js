import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5454";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to check if a JWT is expired without external libraries
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return true;
    }
    return false;
  } catch (err) {
    return true;
  }
}

// Request interceptor: checks expiry and attaches Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      if (isTokenExpired(token)) {
        localStorage.removeItem("jwt");
        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/register"
        ) {
          window.location.href = "/login";
        }
      } else if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handles 401 Unauthorized or expired token exceptions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const errorData = error.response?.data;
    const isJwtError =
      status === 401 ||
      (status === 500 &&
        (typeof errorData === "string"
          ? errorData.toLowerCase().includes("jwt")
          : errorData?.message?.toLowerCase()?.includes("jwt")));

    if (isJwtError) {
      const url = error.config?.url || "";
      if (!url.includes("/auth/signin") && !url.includes("/auth/signup")) {
        localStorage.removeItem("jwt");
        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/register"
        ) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
