/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
  },
  async headers() {
    const staticAssetCache = "public, max-age=31536000, immutable";
    const htmlCache = "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400";

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; " +
              "script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'unsafe-inline' 'unsafe-eval'; " +
              "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; " +
              "img-src 'self' data: blob: https: https://www.googleadservices.com; " +
              "font-src 'self' https://fonts.gstatic.com data:; " +
              "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://adservice.google.com https://www.googleadservices.com https://ip-api.com https://ipwho.is https://www.googleapis.com https://fonts.googleapis.com; " +
              "frame-src 'self' https://www.googletagmanager.com https://td.doubleclick.net; " +
              "frame-ancestors 'self'; " +
              "base-uri 'self'; " +
              "form-action 'self'; " +
              "manifest-src 'self'; " +
              "worker-src 'self'; " +
              "upgrade-insecure-requests",
          },
        ],
      },
      {
        source: "/((?!_next/static|_next/image|.*\\..*).*)",
        headers: [
          { key: "Cache-Control", value: htmlCache },
          { key: "Vary", value: "Accept-Encoding" },
        ],
      },
      {
        source: "/:path*(manifest.json|manifest.webmanifest)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/:all*(ico|svg|jpg|jpeg|png|gif|webp|avif)",
        headers: [
          { key: "Cache-Control", value: staticAssetCache },
        ],
      },
      {
        source: "/:all*(woff|woff2|ttf|otf|eot)",
        headers: [
          { key: "Cache-Control", value: staticAssetCache },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.googletagmanager.com" },
      { protocol: "https", hostname: "www.google-analytics.com" },
      { protocol: "https", hostname: "ip-api.com" },
      { protocol: "https", hostname: "ipwho.is" },
      { protocol: "https", hostname: "fonts.googleapis.com" },
      { protocol: "https", hostname: "fonts.gstatic.com" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

module.exports = nextConfig;
