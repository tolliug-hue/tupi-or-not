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
        src: '/icon-final.png', // On garde ton image actuelle
        sizes: '512x512',
        type: 'image/png',
        // RETOUR AU STANDARD W3C :
        // On dit : "Cette image sert à tout (any) ET elle est découpable (maskable)"
        purpose: 'any maskable' as any, 
      },
    ],
  };
}