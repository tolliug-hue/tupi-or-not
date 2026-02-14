import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {
    // OPTIMISATION VERCEL QUOTA :
    // On ne garde que 4 tailles stratégiques.
    // 180px (Mobile 2 colonnes), 256px (Tablette), 360px (Desktop), 384px (Max)
    imageSizes: [180, 256, 360, 384],
    
     // On garde les breakpoints standards
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