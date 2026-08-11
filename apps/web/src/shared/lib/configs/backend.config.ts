export const BACKEND_URL =
  process.env.NEXT_PUBLIC_URL_BACKEND?.replace("/api/v1", "") ??
  "http://localhost:3001";
