// src/components/EmissionList.tsx
'use client';

import { useState, useMemo } from 'react';
import { Emission, PlaylistItem } from '@/lib/types'; // Import depuis types (Sprint 9)
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
                    {item.proposePar && <span className="text-gray-600 italic ml-1">({item.proposePar})</span>}
                  </div>
                  <div className="text-xs text-gray-600 flex-shrink-0 text-right font-mono">
                    {item.startTime}
                  </div>
                </div>

                <div className="mt-1 flex space-x-2 text-xs">
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">

        {displayedEmissions.map((emission, index) => (
          <article
            key={emission.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 flex flex-col group"
          >
            {/* 
                MODIFICATION SPRINT 27 : 
                Un seul grand bouton qui contient TOUT (Image + Texte).
            */}
            <button
              className="w-full h-full flex flex-col text-left focus:outline-none"
              onClick={() => setSelectedEmission(emission)}
            >
              {/* ZONE VISUELLE (Devenue une simple DIV) */}
              <div className="aspect-square bg-gray-200 overflow-hidden relative w-full">
                {emission.imageUrl ? (
                  <Image
                    src={emission.imageUrl}
                    alt={emission.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    priority={index < 4}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-600">
                    <span className="text-4xl font-bold opacity-30">#{emission.id}</span>
                  </div>
                )}

                {/* Overlay Play au survol */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <svg className="w-5 h-5 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* TEXTE (Maintenant à l'intérieur du bouton) */}
              <div className="px-2 py-1 flex-1 flex flex-col w-full">
                <div className="flex justify-between items-center mb-0.5">
                  <div className="text-xs font-bold text-gray-900">
                    {emission.date}
                  </div>
                  {/* Compteur d'écoutes */}
                  {emission.listenCount !== undefined && (
                    <div className="flex items-center text-[10px] font-bold text-gray-900 bg-gray-200 px-2 py-0.5 rounded-full ml-2" title={`${emission.listenCount} écoutes`}>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                      </svg>
                      {emission.listenCount}
                    </div>
                  )}
                </div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900 leading-tight line-clamp-2">
                  {emission.title}
                </h2>
                {emission.theme && (
                  <p className="text-xs text-gray-600 mt-1 leading-snug line-clamp-2">
                    {emission.theme}
                  </p>
                )}
              </div>
            </button>
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

          {/* CONTENEUR PRINCIPAL : Flex Column + Overflow Hidden pour préserver les coins arrondis */}
          <div
            className="bg-white w-full max-w-lg rounded-xl shadow-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >

            {/* 1. HEADER (Fixe) */}
            <div className="bg-gray-100 px-4 py-1 flex justify-between items-center border-b flex-shrink-0 z-10">
              <h3 className="font-bold text-lg text-gray-900 leading-tight pr-4">
                {selectedEmission.title} - {selectedEmission.date}
              </h3>

              <button onClick={closeModal} className="text-gray-500 hover:text-red-600 p-1.5 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* 2. ZONE SCROLLABLE (Player + Playlist) */}
            <div className="overflow-y-auto flex-1 bg-white">

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

                {/* ZONE LECTEUR (Conteneur de 60px centré) */}
                <div className="w-full h-[60px] flex items-center justify-center bg-black">

                  {selectedEmission.platform === 'mixcloud' ? (
                    <iframe
                      width="100%"
                      height="60"
                      src={`https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&hide_artwork=1&feed=${encodeURIComponent(selectedEmission.link)}`}
                      allow="encrypted-media; fullscreen; autoplay; idle-detection; speaker-selection; web-share"
                      className="bg-black border-0"
                    ></iframe>
                  ) : (
                    <iframe
                      src={`https://archive.org/embed/${getArchiveId(selectedEmission.link)}`}
                      width="100%"
                      height="30"
                      allow="encrypted-media; fullscreen; autoplay; picture-in-picture"
                      className="bg-black border-0"
                    ></iframe>
                  )}

                </div>
              </div>

              {/* PLAYLIST */}
              <PlaylistDisplay playlist={selectedEmission.playlist} />
            </div>

            {/* 3. FOOTER (Fixe) */}
            <div className="p-4 text-center bg-gray-50 text-sm border-t flex-shrink-0 z-10">
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