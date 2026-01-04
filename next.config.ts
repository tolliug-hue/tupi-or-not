import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimisation JS
  transpilePackages: ['lucide-react'], 
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'lodash'],
  },

  // CONFIGURATION IMAGES OPTIMISÉE
  images: {
    // 1. On définit des tailles précises pour les appareils mobiles
    // Cela permet à Next.js de générer des images de 256px et 384px (parfait pour ta grille)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // 2. On garde les tailles standards pour les grands écrans
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // 3. Domaines autorisés (Inchangé)
    remotePatterns: [
      { protocol: 'https', hostname: 'archive.org' },
      { protocol: 'https', hostname: '*.archive.org' },
      { protocol: 'https', hostname: 'thumbnailer.mixcloud.com' },
      { protocol: 'https', hostname: 's-media-cache-ak0.pinimg.com' },
    ],
  },
};

export default nextConfig;