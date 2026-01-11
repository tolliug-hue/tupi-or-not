import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['lucide-react'], 
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'lodash'],
  },

  images: {
    // MODIFICATION : Ajout de tailles très fines (180, 200, 360)
    // Pour coller au plus près des 176px de la grille mobile
    imageSizes: [48, 64, 96, 128, 180, 200, 256, 360, 384],
    
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    remotePatterns: [
      { protocol: 'https', hostname: 'archive.org' },
      { protocol: 'https', hostname: '*.archive.org' },
      { protocol: 'https', hostname: 'thumbnailer.mixcloud.com' },
      { protocol: 'https', hostname: 's-media-cache-ak0.pinimg.com' },
    ],
  },
};

export default nextConfig;