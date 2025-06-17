import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // Set the body size limit for server actions
    },
  },
};

export default nextConfig;
