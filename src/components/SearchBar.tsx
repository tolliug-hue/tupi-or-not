// src/components/SearchBar.tsx
'use client';

import { useSearch } from '../context/SearchContext';

export default function SearchBar() {
  const { searchTerm, setSearchTerm } = useSearch();

  // Fonction pour réinitialiser la recherche
  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Rechercher par artiste, invité, date..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        // On ajoute un padding à droite pour le bouton "X"
        className="w-full p-2 pl-10 pr-10 rounded-lg text-gray-900 bg-white border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
      />
      
      {/* Icône de loupe (à gauche) */}
      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      
      {/* Bouton "X" (à droite) - Apparaît uniquement si searchTerm est non vide */}
      {searchTerm && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 hover:text-gray-800 transition-colors"
          title="Effacer la recherche"
        >
          {/* Icône X (Croix) */}
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      )}
    </div>
  );
}