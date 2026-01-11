'use client';

import { useState } from 'react';
import { GlobalTags } from '@/lib/types';
import { useSearch } from '@/context/SearchContext';

// Définition des couleurs pour les tags
const TAG_COLORS = {
    ARTIST: { bg: 'bg-blue-100', text: 'text-blue-800', hover: 'hover:bg-blue-200' },
    GENRE: { bg: 'bg-green-100', text: 'text-green-800', hover: 'hover:bg-green-200' },
};

/**
 * Composant d'exploration par nuage de mots-clés (Artistes ou Genres).
 * Utilise un accordéon pour économiser l'espace vertical.
 */
export default function TagExplorer({ artistTags, genreTags }: { artistTags: GlobalTags[], genreTags: GlobalTags[] }) {
  const { setSearchTerm } = useSearch();
  const [activeTab, setActiveTab] = useState<'artist' | 'genre'>('artist');
  
  // Fermé par défaut pour alléger le chargement initial (LCP/TBT)
  const [isOpen, setIsOpen] = useState(false); 

  // Détermine le jeu de tags et les couleurs actifs
  const activeTags = activeTab === 'artist' ? artistTags : genreTags;
  const colors = activeTab === 'artist' ? TAG_COLORS.ARTIST : TAG_COLORS.GENRE;
  
  // Calcul de la taille de police (pour l'effet "nuage")
  const maxCount = activeTags.length > 0 ? activeTags[0].count : 1;
  
  /**
   * Calcule une taille de police proportionnelle à la fréquence du tag.
   * @param count Nombre d'occurrences du tag
   */
  const getFontSize = (count: number) => {
    const minSize = 0.75; 
    const maxSize = 1.5; 
    if (maxCount === 1) return `${minSize}rem`; 
    const ratio = (count - 1) / (maxCount - 1);
    const size = minSize + (maxSize - minSize) * ratio;
    return `${Math.max(minSize, size)}rem`;
  };

  // --- LOGIQUE DE CLIC ---
  const handleTabClick = (tab: 'artist' | 'genre') => {
    // Si on clique sur l'onglet déjà actif, on toggle l'ouverture
    if (activeTab === tab) {
      setIsOpen(!isOpen);
    } else {
      // Sinon on change d'onglet et on force l'ouverture
      setActiveTab(tab);
      setIsOpen(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      
      {/* HEADER */}
      {/* Structure DIV > BUTTON pour éviter l'erreur d'hydratation "Button in Button" */}
      <div 
        className="p-2 flex justify-between items-center border-b border-gray-200 w-full cursor-pointer hover:bg-gray-50 transition-colors" 
        onClick={() => setIsOpen(!isOpen)}
      >
        
        {/* Boutons de Bascule (Tabs) */}
        <div className="flex space-x-2">
          <button 
            onClick={(e) => { e.stopPropagation(); handleTabClick('artist'); }}
            className={`text-sm font-bold px-3 py-1 rounded transition-colors ${activeTab === 'artist' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Explorer par Artiste
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleTabClick('genre'); }}
            className={`text-sm font-bold px-3 py-1 rounded transition-colors ${activeTab === 'genre' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Explorer par Genre
          </button>
        </div>
        
        {/* Icône de Toggle (Flèche) */}
        <button 
            className="p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={(e) => {
                e.stopPropagation(); 
                setIsOpen(!isOpen);
            }}
            aria-label={isOpen ? "Réduire" : "Agrandir"}
        >
            <svg className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
        </button>
      </div>

      {/* CONTENU (Accordéon) */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="p-2">
          <div className="h-32 md:h-48 overflow-y-auto pr-1">
            {/* Rendu conditionnel. Si c'est fermé, React ne génère pas les centaines de boutons dans le DOM. */}
            {isOpen && (
              <TagCloudContent 
                activeTags={activeTags}
                colors={colors}
                setSearchTerm={setSearchTerm}
                getFontSize={getFontSize}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant de rendu du nuage EXTRAIT (Pour éviter la re-création au render) ---

type TagCloudProps = {
  activeTags: GlobalTags[];
  colors: { bg: string; text: string; hover: string };
  setSearchTerm: (term: string) => void;
  getFontSize: (count: number) => string;
};

const TagCloudContent = ({ activeTags, colors, setSearchTerm, getFontSize }: TagCloudProps) => (
  <div className="flex flex-wrap gap-1">
    {activeTags.map((item, index) => (
      item.tag.length > 0 && (
        <button
          key={index}
          onClick={() => {
              setSearchTerm(item.tag);
          }}
          style={{ fontSize: getFontSize(item.count) }}
          className={`text-sm transition-colors font-semibold cursor-pointer leading-none ${colors.text} ${colors.bg} ${colors.hover} px-2 py-1 rounded-full`}
          title={`${item.count} titres de ${item.tag}`}
        >
          {item.tag}
        </button>
      )
    ))}
  </div>
);