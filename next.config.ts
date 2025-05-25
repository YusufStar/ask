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
        hostname: "th2f8prs-8000.euw.devtunnels.ms",
      },
    ],
  },
};

export default nextConfig;
