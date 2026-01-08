import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // Temporarily disable ESLint during builds
  },
  typescript: {
    ignoreBuildErrors: true, // Temporarily disable TypeScript errors during builds
  },
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128],
    qualities: [40, 50, 60, 70, 75, 80, 90, 100],
  },
  experimental: {
    optimizePackageImports: ['@/data/gallery'],
    serverComponentsExternalPackages: ['square'], // Don't bundle Square SDK
  },
  compiler: {
    removeConsole: false, // Keep console logs for debugging
  },
};

export default nextConfig;
