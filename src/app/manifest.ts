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
        src: '/icon-final.png', // NOUVEAU NOM
        sizes: 'any',           // On remet 'any' pour être sûr
        type: 'image/png',
        purpose: 'any',         // Pour les contextes normaux
      },
      {
        src: '/icon-final.png', // NOUVEAU NOM
        sizes: 'any',
        type: 'image/png',
        purpose: 'maskable',    // C'est ça que Lawnchair doit voir !
      },
    ],
  };
}