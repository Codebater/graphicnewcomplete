import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['mongoose'],
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
};

export default nextConfig;
