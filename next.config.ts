import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      // Vercel Blob storage (admin uploads / featured images)
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
    ],
  },
};

export default nextConfig;
