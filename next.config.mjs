/** @type {import('next').NextConfig} */
const nextConfig = {
  // React 19 strict mode for better development warnings
  reactStrictMode: true,

  // Disable x-powered-by header for security
  poweredByHeader: false,

  // Image optimization settings
  images: {
    formats: ["image/avif", "image/webp"],
    // Disable image caching issues in development
    minimumCacheTTL: 60,
    // Allow images from Vercel Blob storage
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },

  // Experimental features
  experimental: {
    // Optimize CSS loading (requires 'critters' package)
    optimizeCss: true,
  },

  // Headers for caching control
  async headers() {
    return [
      {
        // Cache static assets aggressively in production
        source: "/icons/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.svg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Prevent caching of API routes
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
        ],
      },
    ];
  },

  // Disable file tracing for faster builds if not needed
  outputFileTracingIncludes: {},

  // Logging configuration
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
