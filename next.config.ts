import type { NextConfig } from "next";

const getBackendUrl = () => {
  let url =
    process.env.INTERNAL_BACKEND_URL ||
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000";
  url = url.replace(/\/docs\/?$/, "").replace(/\/+$/, "");
  return url.replace(/^http:\/\/localhost(?=[:/]|$)/i, "http://127.0.0.1");
};

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_CLIENT_ID:
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      "260412504334-00s4ah5tslv9rgso3g86fcb079bb84nr.apps.googleusercontent.com",
    NEXT_PUBLIC_GOOGLE_REDIRECT_URI:
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ||
      "https://api.dhandagrow.com/api/v1/auth/google/callback",
    NEXT_PUBLIC_API_URL:
      (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/^http:\/\/localhost(?=[:/]|$)/i, "http://127.0.0.1"),
  },
  turbopack: {
    root: __dirname,
  },
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    const backendUrl = getBackendUrl();
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/login/user',
        permanent: true,
      },
      {
        source: '/social-platforms/instagram/social-platforms/facebook',
        destination: '/social-platforms/instagram',
        permanent: false,
      },
      {
        source: '/reel-creator',
        destination: '/create/reel',
        permanent: true,
      },
      {
        source: '/role-selection',
        destination: '/select-role',
        permanent: false,
      },
      {
        source: '/dashboard/creator',
        destination: '/influencer',
        permanent: false,
      },
      {
        source: '/dashboard/business',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
