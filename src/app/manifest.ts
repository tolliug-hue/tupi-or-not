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
        src: '/icon-v3.png', // Nouveau nom
        sizes: '512x512',    // On précise la taille exacte (mieux que 'any')
        type: 'image/png',
        purpose: 'any',      // Usage standard (carré)
      },
      {
        src: '/icon-v3.png', // La même image
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable', // Usage adaptatif (Rond/Goutte/etc.)
      },
    ],
  };
}