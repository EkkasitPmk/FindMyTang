import axios, { type InternalAxiosRequestConfig } from "axios";

const API_BASE_PATH = "/api/v1";
const isBrowser = typeof window !== "undefined";
const backendUrl = process.env.NEXT_PUBLIC_URL_BACKEND;

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
};

const http = axios.create({
  baseURL: isBrowser ? API_BASE_PATH : backendUrl,
  timeout: 15000,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: isBrowser ? API_BASE_PATH : backendUrl,
  timeout: 15000,
  withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;

const refreshAccessToken = () => {
  refreshPromise ??= refreshClient
    .post("/auth/refresh")
    .then(() => undefined)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

const shouldSkipAuthRefresh = (config: RetryableRequestConfig) =>
  config.skipAuthRefresh ||
  ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout"].some(
    (path) => config.url?.includes(path),
  );

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (error.response?.status === 429 && isBrowser) {
      const { toast } = await import("react-toastify");
      toast.error(
        error.response?.data?.message ||
          "คุณส่งคำขอถี่เกินไป กรุณารอสักครู่แล้วลองใหม่อีกครั้ง (Too Many Requests)",
      );
      throw error;
    }

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !shouldSkipAuthRefresh(originalRequest)
    ) {
      originalRequest._retry = true;
      await refreshAccessToken();
      return http(originalRequest);
    }

    throw error;
  },
);

export default http;
