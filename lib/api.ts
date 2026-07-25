import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://hiresense-backend-0l38.onrender.com";

const api = axios.create({ baseURL: API_BASE_URL });

// ---- request interceptor: attach JWT (unchanged from your original) ----
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---- NEW: response interceptor for consistent error handling + 401 redirect ----
let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;

      if (!refreshToken) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        return Promise.reject(normalizeError(error));
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingQueue.push(() => resolve(api(originalRequest)));
        });
      }

      isRefreshing = true;
      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });
        localStorage.setItem("token", data.access_token);
        pendingQueue.forEach((cb) => cb());
        pendingQueue = [];
        isRefreshing = false;
        return api(originalRequest);
      } catch {
        isRefreshing = false;
        localStorage.removeItem("token");
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(normalizeError(error));
      }
    }

    return Promise.reject(normalizeError(error));
  }
);

// ---- NEW: consistent error shape used across all pages ----
export interface ApiError {
  status: number | null;
  message: string;
}

export function normalizeError(error: AxiosError): ApiError {
  if (error.response) {
    const data: any = error.response.data;
    return {
      status: error.response.status,
      message: data?.detail || data?.message || "Something went wrong. Please try again.",
    };
  }
  if (error.request) {
    return { status: null, message: "Network error — check your connection." };
  }
  return { status: null, message: error.message || "Unexpected error." };
}

export default api;