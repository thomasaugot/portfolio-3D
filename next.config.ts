import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build settings
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Performance optimizations
  compress: true,

  experimental: {
    // Tree-shake heavy packages for smaller bundles
    optimizePackageImports: [
      "gsap",
      "three",
      "lucide-react",
      "react-icons",
    ],
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    // Temporarily keep Medium domains for downloading images
    // Remove after images are downloaded and paths updated in DB
    remotePatterns: [
      {
        protocol: "https",
        hostname: "miro.medium.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn-images-1.medium.com",
        pathname: "/**",
      },
    ],
  },

  // Headers for caching static assets
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.glb",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
