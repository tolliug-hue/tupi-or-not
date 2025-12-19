// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SearchProvider } from '@/context/SearchContext'; // Import du Provider

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tupi or not - Archives',
  description: 'Archives complètes de l\'émission Tupi or not',
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