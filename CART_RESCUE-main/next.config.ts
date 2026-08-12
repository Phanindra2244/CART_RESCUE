import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow all tunnel domains and local hosts for dev access
  allowedDevOrigins: [
    "*.lhr.life",
    "localhost:3000",
    "127.0.0.1:3000",
  ],
};

export default nextConfig;
