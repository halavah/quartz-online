import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  // Enable standalone output for Docker
  output: 'standalone',
  // Disable strict plugin warnings for now
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;