import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SearchProvider } from '@/context/SearchContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  // 1. DÉFINITION DE L'URL OFFICIELLE
  // C'est la base pour tous les liens relatifs et le SEO
  metadataBase: new URL('https://tupiornot.fr'),

  // 2. TITRE & DESCRIPTION OPTIMISÉS
  title: {
    default: 'Tupi or Not',
    template: '%s | Tupi or Not' // Utile si tu crées d'autres pages un jour (ex: /episode/123)
  },
  description: 'L\'émission qui mange toutes les musiques. Retrouvez toutes les archives, playlists et invités de l\'émission.',

  // 3. PROTECTION CONTRE LE DUPLICATE CONTENT
  // Google ignorera l'adresse .vercel.app au profit de ton domaine .fr
  alternates: {
    canonical: '/',
  },

  // 4. OPEN GRAPH (Pour Facebook, LinkedIn, Discord, WhatsApp...)
  openGraph: {
    title: 'Tupi or Not',
    description: 'L\'émission qui mange toutes les musiques. Écoutez les archives et explorez les playlists.',
    url: 'https://tupiornot.fr',
    siteName: 'Tupi or Not',
    locale: 'fr_FR',
    type: 'website',
    // L'image sera automatiquement détectée si tu as ajouté opengraph-image.png dans src/app/
  },

  // 5. TWITTER CARD (Pour X / Twitter)
  twitter: {
    card: 'summary_large_image', // Affiche une grande image lors du partage
    title: 'Tupi or Not',
    description: 'L\'émission qui mange toutes les musiques.',
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
        {/* On enveloppe toute l'application avec le SearchProvider */}
        <SearchProvider>
          {children}
        </SearchProvider>
      </body>
    </html>
  );
}