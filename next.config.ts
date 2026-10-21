import type { NextConfig } from "next";

// Baseline security headers applied to every response.
// NOTE: A strict Content-Security-Policy is intentionally omitted here because
// the app relies on inline JSON-LD scripts, inline styles and third-party
// map/leaflet assets. Add CSP separately with a nonce once it can be tested.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Automatically upgrade any insecure HTTP resource requests to HTTPS
  { key: "Content-Security-Policy", value: "upgrade-insecure-requests" },
];

const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  cacheComponents: true,
  partialPrefetching: true,
  // ─── ISR / Vercel Free Tier Optimisation ───────────────────────────────────
  // `expireTime` sets the stale-while-revalidate window for ISR pages.
  // 1 year (31536000 s) means CDN serves cached pages for as long as possible
  // before re-generating — minimises ISR Writes on Vercel free hobby plan.
  expireTime: 31536000,
  // Allow LAN devices (e.g. a phone on the same network) to load dev-only
  // assets like /_next/hmr while testing mobile responsiveness.
  allowedDevOrigins: ["10.53.2.103", "172.26.71.103"],
  images: {
    // Next.js 16 restricts optimization quality values by default to [75].
    // Declare the qualities used by the app so `quality={95}` is honored.
    qualities: [75, 95],
    formats: ["image/avif", "image/webp"],
    // ─── Reduce Image Optimization Cache Writes ──────────────────────────
    // Keep transformed images in Vercel's edge cache for 30 days (2592000 s).
    // Fewer cache misses = fewer Image Cache Writes consumed from the 100K
    // free quota. Without this the default TTL is very short.
    minimumCacheTTL: 2592000,
    // Limit concurrent image optimization workers to reduce Function CPU usage
    // (Fluid Active CPU) on the free hobby plan.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "uma-travels.com",
          },
        ],
        destination: "https://www.uma-travels.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
