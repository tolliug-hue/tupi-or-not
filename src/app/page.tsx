import { getEmissions } from '@/lib/data';
import EmissionList from '../components/EmissionList';
import SearchBar from '../components/SearchBar';
import TagExplorer from '@/components/TagExplorer';
import AboutModal from '@/components/AboutModal';
import { SocialLinks } from '@/components/SocialLinks';
import MobileMenu from '@/components/MobileMenu';
import Image from 'next/image';
import { Suspense } from 'react';
import { Metadata, ResolvingMetadata } from 'next';

/**
 * Configuration ISR (Incremental Static Regeneration).
 * La page est régénérée au maximum une fois par heure côté serveur.
 */
export const revalidate = 3600; 

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

/**
 * Génère dynamiquement les métadonnées SEO et Open Graph.
 * Permet d'afficher la pochette et le titre d'une émission spécifique
 * lors du partage sur les réseaux sociaux (via ?id=XX).
 */
export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  
  const { id } = await searchParams;
  const { emissions } = await getEmissions();

  // Recherche de l'émission ciblée par l'URL
  const emission = id ? emissions.find((e) => e.number.toString() === id) : null;

  // CAS 1 : Partage d'une émission spécifique
  if (emission && emission.imageUrl) {
    return {
      title: `Tupi or Not #${emission.number} - ${emission.title}`,
      description: `Émission du ${emission.date} : ${emission.title}. Retrouvez la playlist et les statistiques sur tupiornot.fr.`,
      openGraph: {
        images: [emission.imageUrl],
        title: `Tupi or Not #${emission.number}`,
        description: `Écoute l'émission du ${emission.date}`,
        url: `https://tupiornot.fr?id=${emission.number}`,
      },
      // Surcharge de l'URL canonique pour éviter que Facebook n'utilise celle de l'accueil
      alternates: {
        canonical: `https://tupiornot.fr?id=${emission.number}`,
      },
    };
  }

  // CAS 2 : Page d'accueil par défaut
  // On redéfinit les métadonnées ici car cette fonction remplace celle du layout
  return {
    title: 'Tupi or Not',
    description: "L'émission qui mange toutes les musiques. Retrouvez toutes les archives, playlists et statistiques de l'émission diffusée sur Radio Octopus.",
    alternates: {
      canonical: 'https://tupiornot.fr',
    },
    openGraph: {
      title: 'Tupi or Not',
      description: "L'émission qui mange toutes les musiques",
      url: 'https://tupiornot.fr',
      type: 'website',
    }
  };
}

/**
 * Page d'accueil (Server Component).
 * Orchestre l'affichage du Header, de l'Explorateur et de la Grille.
 */
export default async function Home() {
  const { emissions, globalTags, globalGenres } = await getEmissions();

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      
      {/* --- HEADER (Sticky) --- */}
      <header className="sticky top-0 z-40 shadow-xl">
        <div className="bg-black p-4 border-b border-gray-600 text-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* GAUCHE : Navigation & Identité */}
            <div className="flex items-center w-full md:w-auto justify-start">
              {/* MENU BURGER (Mobile uniquement) */}
              <div className="md:hidden">
                <MobileMenu />
              </div>
            {/* LOGO */}
              <a href="https://radio-octopus.org/" target="_blank" className="mr-3 shrink-0" style={{ filter: 'invert(1)' }}>
                <Image src="/logo-octopus.png" alt="Logo" width={42} height={42} priority />
              </a>
              {/* TITRE */}
               <div className="flex flex-col">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tighter leading-none">
                  TUPI OR NOT
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-400 italic mt-0.5">
                  L'émission qui mange toutes les musiques
                </p>
              </div>
            </div>

            {/* CENTRE : Recherche */}
            <div className="w-full md:w-auto md:flex-1 md:max-w-md">
              <SearchBar />
            </div>
            
            {/* DROITE : Liens & Compteur (Desktop) */}
            <div className="hidden md:flex flex-col items-end gap-1">
              {/* Ligne 1 : Navigation */}
              <div className="flex items-center gap-3">
                 <AboutModal />
                 <div className="w-px h-3 bg-gray-700"></div>
                 <SocialLinks />
              </div>
               {/* Ligne 2 : Compteur */}
              <div className="text-xs text-gray-300 font-mono">
                {emissions.length} émissions archivées
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* --- EXPLORATEUR DE TAGS (Sticky sous le header) --- */}
      {/* 
        NOTE CSS : 
        - top-[132px] (Mobile) et top-[74px] (Desktop) correspondent à la hauteur du Header.
        - -mt-4 (Marge négative) permet de glisser le bloc sous le header pour éviter le saut au scroll.
      */}
      <div className="max-w-7xl mx-auto px-6 pt-4 -mt-4 pb-2 sticky top-[132px] md:top-[74px] z-30 bg-gray-100 transition-all">
        <TagExplorer 
            artistTags={globalTags} 
            genreTags={globalGenres} 
        />
      </div>

      {/* --- CORPS DE PAGE (Grille) --- */}
      {/* pt-1 compense le décalage visuel dû au -mt-4 du bloc précédent */}
      <div className="max-w-7xl mx-auto px-6 pb-6 pt-1 mt-0">
        {/* Suspense est requis car EmissionList utilise useSearchParams (Client Side) */}
        <Suspense fallback={<div className="text-center py-10">Chargement...</div>}>
          <EmissionList initialEmissions={emissions} />
        </Suspense>
      </div>
    </main>
  );
}