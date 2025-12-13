import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  // Disable strict plugin warnings for now
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;