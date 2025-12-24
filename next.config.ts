import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  // Enable standalone output for Docker
  output: 'export',
  // Disable strict plugin warnings for now
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;