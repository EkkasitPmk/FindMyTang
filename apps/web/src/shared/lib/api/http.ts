import axios from "axios";

const http = axios.create({
  baseURL:
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_URL_BACKEND
      : "/api/v1",
  timeout: 15000,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const MAX_QUEUE_SIZE = 50;

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom, i) => {
    if (error) {
      prom.reject(error);
    } else {
      // stagger re-fires by 10ms each to avoid simultaneous burst while keeping delay low
      setTimeout(() => prom.resolve(), i * 10);
    }
  });
  failedQueue = [];
};

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 429) {
      const { toast } = await import("react-toastify");
      toast.error(
        error.response?.data?.message ||
          "คุณส่งคำขอถี่เกินไป กรุณารอสักครู่แล้วลองใหม่อีกครั้ง (Too Many Requests)",
      );
      throw error;
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      if (isRefreshing) {
        if (failedQueue.length >= MAX_QUEUE_SIZE) {
          // Queue full — reject immediately to avoid building up indefinitely
          throw error;
        }
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => http(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(`/api/v1/auth/refresh`, {}, { withCredentials: true });
        processQueue(null);
        return http(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }

    throw error;
  },
);

export default http;
