import { registerAs } from "@nestjs/config";

export default registerAs("cookie", () => ({
  secret:
    process.env.COOKIE_SECRET || "super-secret-cookie-key-for-development",
  domain: process.env.COOKIE_DOMAIN || undefined,
  secure: process.env.COOKIE_SECURE === "true",
  sameSite:
    (process.env.COOKIE_SAME_SITE as "lax" | "strict" | "none") || "lax",
}));
