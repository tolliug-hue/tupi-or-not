import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tupi or Not',
    short_name: 'Tupi',
    description: "L'émission qui mange toutes les musiques",
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        // Double cast via 'unknown'
        // 1. La valeur réelle est 'any maskable'
        // 2. On passe par 'unknown' pour resetter le type
        // 3. On dit à TS que c'est du type 'maskable' (qu'il accepte)
        purpose: 'any maskable' as unknown as 'maskable',
      },
    ],
  };
}