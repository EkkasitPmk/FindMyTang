import axios from "axios";

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_BACKEND,
  timeout: 15000,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => http(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_URL_BACKEND}/auth/refresh`,
          {},
          { withCredentials: true },
        );
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
