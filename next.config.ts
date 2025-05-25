import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
      {
        protocol: "https",
        hostname: "ad83-2a09-bac5-58c2-4d2-00-7b-61.ngrok-free.app",
      },
    ],
  },
};

export default nextConfig;
