import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    // Use remotePatterns instead of domains for better security
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images2.thanhnien.vn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kingvillavungtau.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'odwintravel.vn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cafefcdn.com',
        pathname: '/**',
      },
      { 
        protocol: 'https',
        hostname: 'vielimousine.com',
        pathname: '/**',
      },
      { 
        protocol: 'https',
        hostname: 'bazantravel.com',
        pathname: '/**',
      }
    ],
    // Configure allowed quality values
    qualities: [60, 75, 80, 85],
    // Enable WebP and AVIF formats for better compression
    formats: ['image/webp', 'image/avif'],
    // Optimize responsive images with srcset
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable lazy loading by default with cache
    minimumCacheTTL: 60,
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
