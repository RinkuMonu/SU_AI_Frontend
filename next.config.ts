import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*',
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
