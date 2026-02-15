'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Emission } from '@/lib/types'; // PlaylistItem n'est plus nécessaire ici
import { useSearch } from '@/context/SearchContext';
import Image from 'next/image';
import EmissionPlayer from './EmissionPlayer'; // IMPORT DU NOUVEAU COMPOSANT

/**
 * Composant principal affichant la grille des émissions
 */
export default function EmissionList({ initialEmissions }: { initialEmissions: Emission[] }) {
  // Récupération des paramètres d'URL (pour le Deep Linking)
  const searchParams = useSearchParams();
  const emissionIdFromUrl = searchParams.get('id');

  // --- 1. INITIALISATION (Lazy State) ---
  // On tente de récupérer l'émission dès le départ pour l'affichage initial (SSR/Hydration)
  const [selectedEmission, setSelectedEmission] = useState<Emission | null>(() => {
    if (emissionIdFromUrl) {
      return initialEmissions.find(e => e.number.toString() === emissionIdFromUrl) || null;
    }
    return null;
  });

  // Pagination : On commence par 12 éléments pour alléger le DOM initial
  const [visibleCount, setVisibleCount] = useState(12);

    // État pour le feedback du bouton partage
  const [isCopied, setIsCopied] = useState(false);
  
  // On récupère les valeurs optimisées du Context
  const { debouncedSearchTerm, selectedTag } = useSearch();


  // Fonction pour ouvrir une émission (Clic Carte)
  const openEmission = (emission: Emission) => {
    setSelectedEmission(emission);
        // BONUS UX : On met à jour l'URL sans recharger la page
    window.history.pushState(null, '', `?id=${emission.number}`);
  };

  // Fonction pour fermer
  const closeModal = () => {
    setSelectedEmission(null);
        // On nettoie l'URL
    window.history.pushState(null, '', window.location.pathname);
  };

  // 2. SYNCHRONISATION URL -> MODALE
  useEffect(() => {
    // On utilise setTimeout pour sortir du cycle de rendu synchrone.
    // Cela corrige l'erreur "Calling setState synchronously within an effect".
    const timer = setTimeout(() => {
      if (emissionIdFromUrl) {
        const target = initialEmissions.find(e => e.number.toString() === emissionIdFromUrl);
        // On ne met à jour QUE si c'est différent (évite les boucles)
        if (target && target.id !== selectedEmission?.id) {
           setSelectedEmission(target);
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [emissionIdFromUrl, initialEmissions, selectedEmission]);

  // 3. LOGIQUE DE FILTRAGE
  const filteredEmissions = useMemo(() => {
    return initialEmissions.filter(emission => {
            // 1. Filtre par Tag
      if (selectedTag && !emission.genres.some(g => g.toLowerCase() === selectedTag.toLowerCase())) {
        return false;
      }
      // 2. Filtre par Texte (Recherche intelligente "AND")
      if (debouncedSearchTerm) {
        // On récupère le texte de recherche pré-calculé (minuscule)
        const lowerSearchText = emission.searchableText;
        // On découpe la recherche utilisateur en mots (ex: "Rock Beatles" -> ["rock", "beatles"])
        const searchTerms = debouncedSearchTerm
        .toLowerCase()
        .split(' ')
        .filter(term => term.trim() !== ''); // On enlève les espaces vides
        
        // On vérifie que CHAQUE mot tapé est présent dans le texte de l'émission
        // .every() renvoie true seulement si toutes les conditions sont remplies
        if (!searchTerms.every(term => lowerSearchText.includes(term))) {
          return false;
        }
      }
      return true;
    });
  }, [initialEmissions, debouncedSearchTerm, selectedTag]);

  // --- 4. RESET PAGINATION Reset de la pagination quand les filtres changent (UX) ---
  useEffect(() => {
        // Ici aussi, setTimeout est nécessaire car debouncedSearchTerm change après le rendu
    const timer = setTimeout(() => setVisibleCount(12), 0);
    return () => clearTimeout(timer);
  }, [debouncedSearchTerm, selectedTag]);

// Pagination : On coupe la liste pour n'afficher que les éléments visibles
  const displayedEmissions = filteredEmissions.slice(0, visibleCount);
  
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  // La fonction de partage
  const handleShareEmission = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche de fermer la modale ou de cliquer ailleurs
    if (!selectedEmission) return;
    
    const shareData = {
      title: `Tupi or Not - ${selectedEmission.title}`,
      text: `Écoute l'émission ${selectedEmission.title} de Tupi or Not !`,
                 // On génère le lien avec l'ID
      url: `https://tupiornot.fr?id=${selectedEmission.number}`,
    };
   
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.warn('Share failed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.warn('Clipboard failed:', err);
       }
    }
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
             {/* BOUTON GLOBAL (Image + Texte). */}
            <button
              className="w-full h-full flex flex-col text-left focus:outline-none"
              onClick={() => openEmission(emission)}
            >              
            {/* ZONE VISUELLE */}
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
               {/* TEXTE */}
              <div className="px-2 py-1 flex-1 flex flex-col w-full">
                <div className="flex justify-between items-center mb-0.5">
                  <div className="text-xs font-bold text-gray-900">{emission.date}</div>
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
            <p className="text-xl font-semibold">Aucune émission trouvée.</p>
            {selectedTag && <p className="text-sm mt-2">Filtre actif : <span className="font-bold">{selectedTag}</span></p>}
            {debouncedSearchTerm && <p className="text-sm mt-1">Recherche : &quot;{debouncedSearchTerm}&quot;</p>}
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
            Voir plus d&apos;émissions ({filteredEmissions.length - visibleCount} restantes)
          </button>
        </div>
      )}

      {/* MODALE LECTEUR */}
      {selectedEmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={closeModal}>
          {/* CONTENEUR PRINCIPAL */}
          <div
            className="bg-white w-full max-w-lg rounded-xl shadow-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >

             {/* 1. HEADER (Fixe) */}
            <div className="bg-gray-100 px-4 py-1 flex justify-between items-center border-b flex-shrink-0 z-10">
              <h3 className="font-bold text-lg text-gray-900 leading-tight pr-4">
                {selectedEmission.title} - {selectedEmission.date}
              </h3>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* BOUTON PARTAGER */}
                <button
                  onClick={handleShareEmission}
                  className="text-gray-800 hover:text-blue-600 p-1.5 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                  title="Partager cette émission"
                >
                  {isCopied ? (
                    // Icône Check (Succès)
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                      // ICÔNE bouton partager : Carré avec flèche (Identique au Header)
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  )}
                </button>
                 {/* BOUTON FERMER */}
                <button onClick={closeModal} className="text-gray-800 hover:text-red-600 p-1.5 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            {/* C'EST ICI QUE ÇA CHANGE : On utilise le composant Player */}
            <div className="overflow-y-auto flex-1 bg-white">
               <EmissionPlayer emission={selectedEmission} />
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