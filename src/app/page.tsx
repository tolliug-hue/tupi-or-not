// src/app/page.tsx
import { getEmissions } from '@/lib/data';
import EmissionList from '../components/EmissionList';
import SearchBar from '../components/SearchBar';
import TagExplorer from '@/components/TagExplorer';
import AboutModal from '@/components/AboutModal';
import { SocialLinks } from '@/components/SocialLinks';
import MobileMenu from '@/components/MobileMenu';
import Image from 'next/image';

export const revalidate = 3600;

export default async function Home() {
  const { emissions, globalTags, globalGenres } = await getEmissions();

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900 font-sans">

      <header className="sticky top-0 z-40 shadow-xl">

        {/* SUPPRESSION DE LA TOP BAR ICI (Le code est plus propre) */}

        {/* MAIN HEADER */}
        <div className="bg-black p-4 border-b border-gray-600 text-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">

            {/* BLOC GAUCHE : Burger + Logo + Titre */}
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

            {/* CENTRE : RECHERCHE */}
            <div className="w-full md:w-auto md:flex-1 md:max-w-md">
              <SearchBar />
            </div>

            {/* BLOC DROIT : Navigation + Compteur (Desktop uniquement) */}
            {/* On utilise flex-col pour empiler les liens au-dessus du compteur */}
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

      {/* EXPLORATEUR DE TAGS */}
      <div className="max-w-7xl mx-auto p-6 pt-4 -mt-4 pb-2 sticky top-[132px] md:top-[74px] z-30 bg-gray-100 transition-all">
        <TagExplorer 
            artistTags={globalTags} 
            genreTags={globalGenres} 
        />
      </div>

      {/* CORPS DE PAGE */}
      <div className="max-w-7xl mx-auto px-6 pb-6 pt-1 mt-0">
        <EmissionList initialEmissions={emissions} />
      </div>
    </main>
  );
}