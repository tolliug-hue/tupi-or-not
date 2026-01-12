import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SearchProvider } from '@/context/SearchContext';
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'] });

/**
 * Configuration globale des métadonnées (SEO & Social).
 * Ces valeurs sont appliquées par défaut à toutes les pages,
 * sauf si elles sont surchargées localement (ex: dans page.tsx).
 */
export const metadata: Metadata = {
  // URL de base pour la résolution des liens relatifs (OG Images, Canoniques)
  metadataBase: new URL('https://tupiornot.fr'),

  // Configuration du Titre (Template pour les pages enfants)
  title: {
    default: 'Tupi or Not',
    template: '%s | Tupi or Not'
  },
  description: "L'émission qui mange toutes les musiques. Retrouvez toutes les archives, playlists et invités de l'émission diffusée sur Radio Octopus.",

  // Métadonnées sémantiques
  keywords: ['Radio', 'Musique', 'Archives', 'Podcast', 'Tupi or Not', 'Radio Octopus', 'Eclectique', 'Replay'],
  authors: [{ name: 'Soline Garry' }, { name: 'Olivier Guillot' }],
  creator: 'Tupi or Not',

  // Protection SEO : URL Canonique pour éviter le Duplicate Content (Vercel vs Domaine)
  alternates: {
    canonical: '/',
  },

  // Configuration Open Graph (Facebook, LinkedIn, WhatsApp)
  openGraph: {
    title: 'Tupi or Not',
    description: "L'émission qui mange toutes les musiques. Écoutez les archives et explorez les playlists.",
    url: 'https://tupiornot.fr',
    siteName: 'Tupi or Not',
    locale: 'fr_FR',
    type: 'website',
    // L'image est gérée automatiquement via opengraph-image.png dans src/app/
  },

  // Configuration Twitter / X
  twitter: {
    card: 'summary_large_image',
    title: 'Tupi or Not',
    description: "L'émission qui mange toutes les musiques.",
  },

  // Directives pour les robots d'indexation
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {/* Provider pour la gestion de l'état de recherche global */}
        <SearchProvider>
          {children}
          <Analytics />
        </SearchProvider>
      </body>
    </html>
  );
}