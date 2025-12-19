// src/components/TagExplorer.tsx
'use client';

import { useState } from 'react';
import { GlobalTags } from '@/lib/data'; // CORRECTION : Utilisation de l'alias @/
import { useSearch } from '@/context/SearchContext';

// Définition des couleurs pour les tags
const TAG_COLORS = {
    ARTIST: { bg: 'bg-blue-100', text: 'text-blue-800', hover: 'hover:bg-blue-200' },
    GENRE: { bg: 'bg-green-100', text: 'text-green-800', hover: 'hover:bg-green-200' },
};

export default function TagExplorer({ artistTags, genreTags }: { artistTags: GlobalTags[], genreTags: GlobalTags[] }) {
  const { setSearchTerm } = useSearch();
  const [activeTab, setActiveTab] = useState<'artist' | 'genre'>('artist');
  const [isOpen, setIsOpen] = useState(true); 

  // Détermine le jeu de tags et les couleurs actifs
  const activeTags = activeTab === 'artist' ? artistTags : genreTags;
  const colors = activeTab === 'artist' ? TAG_COLORS.ARTIST : TAG_COLORS.GENRE;
  
  // Calcul de la taille de police (pour l'effet "nuage")
  const maxCount = activeTags.length > 0 ? activeTags[0].count : 1;
  
  const getFontSize = (count: number) => {
    const minSize = 1.0; 
    const maxSize = 1.8; 
    if (maxCount === 1) return `${minSize}rem`; 
    const ratio = (count - 1) / (maxCount - 1);
    const size = minSize + (maxSize - minSize) * ratio;
    return `${Math.max(minSize, size)}rem`;
  };

  // --- LOGIQUE DE CLIC SUR LES BOUTONS ---
  const handleTabClick = (tab: 'artist' | 'genre') => {
    if (activeTab === tab) {
      setIsOpen(!isOpen);
    } else {
      setActiveTab(tab);
      setIsOpen(true);
    }
  };
  // ------------------------------------------------

  // Composant de rendu du nuage
  const TagCloudContent = () => (
    <div className="flex flex-wrap gap-x-3 gap-y-2">
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

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
      
      {/* HEADER (Boutons de bascule et Toggle) */}
      <div className="p-4 flex justify-between items-center border-b border-gray-200 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        
        {/* Boutons de Bascule (Tabs) */}
        <div className="flex space-x-2">
          <button 
            onClick={(e) => { e.stopPropagation(); handleTabClick('artist'); }}
            className={`text-lg font-bold px-3 py-1 rounded transition-colors ${activeTab === 'artist' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Explorer par Artiste
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleTabClick('genre'); }}
            className={`text-lg font-bold px-3 py-1 rounded transition-colors ${activeTab === 'genre' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Explorer par Genre
          </button>
        </div>
        
        {/* Icône de Toggle (Flèche) */}
        <svg className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
      </div>

      {/* CONTENU (Accordéon) */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="p-4">
          <div className="h-48 overflow-y-auto pr-2">
            <TagCloudContent />
          </div>
        </div>
      </div>
    </div>
  );
}