import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. OPTIMISATION JS (Pour le score Lighthouse)
  // Cela permet de réduire la taille du bundle envoyé au navigateur
  transpilePackages: ['lucide-react'], 
  
  experimental: {
    // Optimise les imports pour ne charger que ce qui est utilisé
    optimizePackageImports: ['lucide-react', 'date-fns', 'lodash'],
  },

  // 2. CONFIGURATION IMAGES (Inchangée)
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