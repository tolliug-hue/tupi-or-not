// src/components/TagCloud.tsx
'use client';

import { GlobalTags } from '../lib/data';
import { useSearch } from '@/context/SearchContext';

export default function TagCloud({ globalTags }: { globalTags: GlobalTags[] }) {
  const { setSearchTerm } = useSearch();

  const allTags = globalTags;

  // Calcul de la taille de police (pour l'effet "nuage")
  const maxCount = allTags.length > 0 ? allTags[0].count : 1;
  
  // Fonction pour déterminer la taille de police en fonction de la fréquence
  const getFontSize = (count: number) => {
    const minSize = 0.8; // 0.8rem (12.8px)
    const maxSize = 1.5; // 1.5rem (24px)
    
    // Si tous les tags sont uniques (maxCount = 1), on utilise la taille minimale
    if (maxCount === 1) return `${minSize}rem`; 

    // Calcul du ratio basé sur la plage [1, maxCount]
    // On utilise Math.max(1, count) pour éviter les problèmes si count est 0 (même si c'est impossible ici)
    const ratio = (count - 1) / (maxCount - 1);
    
    const size = minSize + (maxSize - minSize) * ratio;
    
    // On s'assure que la taille est au moins minSize
    return `${Math.max(minSize, size)}rem`;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-3">Explorer par Artiste</h3>
      
      {/* Hauteur fixe et barre de défilement */}
      <div className="h-48 overflow-y-auto pr-2">
        <div className="flex flex-wrap gap-x-3 gap-y-2">
          {allTags.map((item, index) => (
            item.tag.length > 0 && (
              <button
                key={index}
                onClick={() => setSearchTerm(item.tag)}
                style={{ fontSize: getFontSize(item.count) }}
                className="text-blue-600 hover:text-blue-800 transition-colors font-semibold cursor-pointer leading-none"
                title={`${item.count} titres de ${item.tag}`}
              >
                {item.tag}
              </button>
            )
          ))}
        </div>
      </div>
    </div>
  );
}