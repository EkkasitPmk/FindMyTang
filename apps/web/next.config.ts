import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ["192.168.1.181"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gvxpkkitejwqavmlrren.supabase.co",
      },
    ],
  },
};

export default nextConfig;
