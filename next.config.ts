import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'archive.org',
      },
      {
        protocol: 'https',
        hostname: '*.archive.org', // Important : couvre tous les serveurs de stockage (ia800000, etc.)
      },
      {
        protocol: 'https',
        hostname: 'thumbnailer.mixcloud.com',
      },
      {
        protocol: 'https',
        hostname: 's-media-cache-ak0.pinimg.com', // Parfois utilisé par d'anciennes images Mixcloud
      },
    ],
  },
};

export default nextConfig;