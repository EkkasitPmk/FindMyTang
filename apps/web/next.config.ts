import type { NextConfig } from "next";
import path from "node:path";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_URL_BACKEND?.replace("/api/v1", "") ??
  "http://localhost:3001";

const devConfig: Partial<NextConfig> =
  process.env.NODE_ENV === "development"
    ? { allowedDevOrigins: ["192.168.1.102"] }
    : {};

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname, "../../"),
  },
  reactCompiler: true,
  ...devConfig,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
