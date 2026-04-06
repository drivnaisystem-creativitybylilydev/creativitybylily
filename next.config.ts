import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Temporarily disable TypeScript errors during builds
  },
  images: {
    formats: ["image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128],
    qualities: [40, 50, 60, 70, 75, 80, 90, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  serverExternalPackages: ["square"],
  experimental: {
    optimizePackageImports: ["@/data/gallery"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default withNextIntl(nextConfig);
