// src/app/page.tsx
import { getEmissions } from '@/lib/data';
import { Emission, GlobalTags } from '@/lib/types';
import EmissionList from '../components/EmissionList';
import SearchBar from '../components/SearchBar';
import TagExplorer from '@/components/TagExplorer';
import Image from 'next/image';

// Activation de l'ISR pour 1 heure (3600 secondes)
export const revalidate = 3600; 

export default async function Home() {
  const { emissions, globalTags, globalGenres } = await getEmissions();

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      {/* HEADER (Inchangé) */}
      <header 
        className="p-6 shadow-xl sticky top-0 z-40 border-b border-gray-700 text-white relative h-36 bg-black" 
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10 h-full">
          
          {/* TITRE ET LOGO */}
          <div className="flex items-center flex-shrink-0">
            <div className="mr-4" style={{ filter: 'invert(1) brightness(1.5)' }}>
              <Image
                src="/logo-octopus.png"
                alt="Logo Radio Octopus"
                width={48}
                height={48}
                priority
              />
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <h1 className="text-4xl font-extrabold tracking-tighter">
                TUPI OR NOT
              </h1>
              <p className="text-sm text-gray-400 mt-1 italic">
                L'émission qui mange toutes les musiques
              </p>
            </div>
          </div>
          
          {/* BARRE DE RECHERCHE */}
          <div className="w-full sm:w-auto sm:flex-1 sm:max-w-md">
            <SearchBar />
          </div>

          {/* COMPTEUR */}
          <div className="text-sm text-gray-400 hidden sm:block flex-shrink-0">
            {emissions.length} émissions archivées
          </div>
        </div>
      </header>

      {/* EXPLORATEUR DE TAGS UNIQUE (PERSISTANT) */}
      <div className="max-w-7xl mx-auto p-6 pt-4 sticky top-36 z-30 bg-gray-100">
        <TagExplorer 
            artistTags={globalTags} 
            genreTags={globalGenres} 
        />
      </div>

      {/* CORPS DE PAGE */}
      <div className="max-w-7xl mx-auto p-6 pt-0">
        <EmissionList initialEmissions={emissions} />
      </div>
    </main>
  );
}