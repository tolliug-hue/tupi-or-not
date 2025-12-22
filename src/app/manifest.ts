import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tupi or Not',
    short_name: 'Tupi',
    description: "L'émission qui mange toutes les musiques",
    start_url: '/',
    display: 'standalone',
    background_color: '#000000', // Noir (Identité Tupi)
    theme_color: '#000000',      // Noir
    icons: [
      {
        src: '/icon', // Next.js sert automatiquement le fichier src/app/icon.png ici
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}