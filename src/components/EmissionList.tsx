// src/components/EmissionList.tsx
'use client';

import { useState, useMemo } from 'react';
import { Emission, PlaylistItem } from '@/lib/types';
import { useSearch } from '@/context/SearchContext';
import Image from 'next/image';

export default function EmissionList({ initialEmissions }: { initialEmissions: Emission[] }) {
  const [selectedEmission, setSelectedEmission] = useState<Emission | null>(null);
  
  // 1. PERF : Pagination pour alléger le DOM initial (12 éléments)
  const [visibleCount, setVisibleCount] = useState(12);
  
  const { searchTerm } = useSearch();

  const getArchiveId = (link: string) => {
    const parts = link.split('/');
    return parts[parts.length - 1] || parts[parts.length - 2];
  };

  const closeModal = () => {
    setSelectedEmission(null);
  };

  // --- LOGIQUE DE FILTRAGE ---
  const filteredEmissions = useMemo(() => {
    if (!searchTerm) {
      return initialEmissions;
    }
    const lowerCaseSearch = searchTerm.toLowerCase();
    
    return initialEmissions.filter(emission => {
      return emission.searchableText.includes(lowerCaseSearch);
    });
  }, [initialEmissions, searchTerm]);

  // 2. PERF : On coupe la liste pour n'afficher que les éléments visibles
  const displayedEmissions = filteredEmissions.slice(0, visibleCount);

  // Fonction pour charger plus d'émissions
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  // Composant PlaylistDisplay
  const PlaylistDisplay = ({ playlist }: { playlist: PlaylistItem[] }) => {
    const getGoogleSearchLink = (query: string) => {
      return `https://www.google.com/search?q=${encodeURIComponent(query + ' artiste musique')}`;
    };

    const getMusicBrainzRecordingLink = (artiste: string, titre: string) => {
      const query = `${titre} AND artist:${artiste}`;
      return `https://musicbrainz.org/search?query=${encodeURIComponent(query)}&type=recording`;
    };

    const getDiscogsSearchLink = (artiste: string, titre: string) => {
      return `https://www.discogs.com/search/?q=${encodeURIComponent(`${artiste} - ${titre}`)}&type=all`;
    };

    return (
      <div className="p-4 bg-white text-sm">
        <h4 className="font-bold text-gray-800 mb-2 border-b pb-1">Playlist ({playlist.length} titres)</h4>
        {playlist.length === 0 ? (
          <p className="text-gray-500 italic">Playlist non disponible pour cette émission.</p>
        ) : (
          <ul className="space-y-0.5">
            {playlist.map((item, index) => (
              <li key={index} className="flex flex-col border-b border-gray-100 pb-1.5">
                
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-2 text-gray-900">
                    <a 
                      href={getGoogleSearchLink(item.artiste)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-600 hover:underline"
                      title={`Rechercher ${item.artiste} sur Google`}
                    >
                      {item.artiste}
                    </a> 
                    <span className="text-gray-700"> - </span>
                    <span className="text-gray-700">
                      {item.titre}
                    </span>
                    {/* 3. A11Y : Contrastes renforcés (gray-600 au lieu de 500) */}
                    {item.proposePar && <span className="text-gray-600 italic ml-1">({item.proposePar})</span>}
                  </div>
                  {/* 3. A11Y : Contrastes renforcés */}
                  <div className="text-xs text-gray-600 flex-shrink-0 text-right font-mono">
                    {item.startTime}
                  </div>
                </div>

                <div className="mt-1 flex space-x-2 text-xs">
                    {/* 3. A11Y : Contrastes renforcés pour les liens */}
                    <a href={getMusicBrainzRecordingLink(item.artiste, item.titre)} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 hover:underline" title="Rechercher l'enregistrement sur MusicBrainz">[MusicBrainz]</a>
                    <a href={getDiscogsSearchLink(item.artiste, item.titre)} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 hover:underline" title="Rechercher sur Discogs (Marketplace)">[Discogs]</a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <>
      {/* GRILLE DES ÉMISSIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        
        {displayedEmissions.map((emission, index) => (
          <article 
            key={emission.id} 
            className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 flex flex-col group"
          >
            {/* ZONE VISUELLE (Clic = Lecture) */}
            <button 
              className="aspect-square bg-gray-200 cursor-pointer overflow-hidden relative w-full" 
              onClick={() => setSelectedEmission(emission)}
            >
              {emission.imageUrl ? (
                <Image 
                  src={emission.imageUrl} 
                  alt={emission.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  // 4. PERF : Priorité LCP pour les 4 premières images
                  priority={index < 4}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-600">
                   <span className="text-4xl font-bold opacity-30">#{emission.id}</span>
                </div>
              )}

              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <svg className="w-5 h-5 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              
              {/* 5. A11Y : Badge Plateforme avec contraste renforcé (700 au lieu de 600) */}
              <span className={`absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded text-white z-20 ${
                emission.platform === 'archive' ? 'bg-blue-700' : 'bg-orange-700'
              }`}>
                {emission.platform === 'archive' ? 'ARCHIVE' : 'MIXCLOUD'}
              </span>
            </button>

            {/* TEXTE */}
            <div className="p-3 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <div className="text-base font-bold text-gray-900">
                  {emission.date}
                </div>
              </div>
              <h2 className="text-base font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
                {emission.title}
              </h2>
              <a 
                href={emission.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto block w-full text-center bg-gray-100 text-gray-700 py-1.5 rounded hover:bg-gray-200 transition-colors text-xs font-bold border border-gray-200"
              >
                DÉTAILS
              </a>
            </div>
          </article>
        ))}
        
        {/* Message si aucune émission trouvée */}
        {filteredEmissions.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-600">
                <p className="text-xl font-semibold">Aucune émission trouvée pour "{searchTerm}".</p>
                <p className="text-sm mt-2">Essayez un autre mot-clé (invité, artiste, titre).</p>
            </div>
        )}
      </div>

      {/* BOUTON "VOIR PLUS" */}
      {visibleCount < filteredEmissions.length && (
        <div className="mt-8 flex justify-center pb-8">
          <button 
            onClick={handleLoadMore}
            className="px-6 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors shadow-lg"
          >
            Voir plus d'émissions ({filteredEmissions.length - visibleCount} restantes)
          </button>
        </div>
      )}

      {/* MODALE LECTEUR */}
      {selectedEmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={closeModal}>
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl relative animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            
            {/* HEADER MODALE */}
            <div className="bg-gray-100 p-4 flex justify-between items-start border-b sticky top-0 z-10">
              <h3 className="font-bold text-xl text-gray-900 leading-tight pr-4">
                  {selectedEmission.title} - {selectedEmission.date}
              </h3>
              
              <button onClick={closeModal} className="text-gray-500 hover:text-red-600 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* ZONE PLAYER UNIFIÉE */}
            <div className="bg-black flex flex-col justify-center items-center w-full">
              
              {/* IMAGE MODALE */}
              {selectedEmission.imageUrl && (
                <div className="w-full h-48 bg-black relative border-b border-gray-800">
                  <Image 
                    src={selectedEmission.imageUrl} 
                    alt={selectedEmission.title}
                    fill
                    className="object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* IFRAME LECTEUR */}
              {selectedEmission.platform === 'mixcloud' ? (
                <iframe 
                  width="100%" 
                  height="60" 
                  src={`https://player-widget.mixcloud.com/widget/iframe/?hide_artwork=1&mini=1&light=0&autoplay=1&feed=${encodeURIComponent(selectedEmission.link)}`} 
                  frameBorder="0" 
                  allow="encrypted-media; fullscreen; autoplay; idle-detection; speaker-selection; web-share"
                  className="bg-black"
                ></iframe>
              ) : (
                <iframe 
                  src={`https://archive.org/embed/${getArchiveId(selectedEmission.link)}&autoplay=1`} 
                  width="100%" 
                  height="60" 
                  frameBorder="0" 
                  allow="autoplay"
                  className="bg-black"
                ></iframe>
              )}
            </div>

            {/* PLAYLIST */}
            <PlaylistDisplay playlist={selectedEmission.playlist} />

            {/* Footer */}
            <div className="p-4 text-center bg-gray-50 text-sm border-t sticky bottom-0 z-10">
              <a href={selectedEmission.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Voir la page originale sur {selectedEmission.platform === 'archive' ? 'Archive.org' : 'Mixcloud'}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}