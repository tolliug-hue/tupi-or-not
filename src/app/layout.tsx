// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SearchProvider } from '@/context/SearchContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  // 1. DÉFINITION DE L'URL OFFICIELLE
  // C'est la base pour tous les liens relatifs et le SEO
  metadataBase: new URL('https://tupiornot.fr'),

  title: 'Tupi or not',
  description: 'Archives complètes de l\'émission Tupi or not',

  // 2. PROTECTION CONTRE LE DUPLICATE CONTENT
  // Cela génère la balise <link rel="canonical" href="https://tupiornot.fr" />
  // Google ignorera désormais l'adresse .vercel.app au profit de ton domaine .fr
  alternates: {
    canonical: '/',
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