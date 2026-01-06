'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo } from 'react';

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  debouncedSearchTerm: string; // C'est celui-ci que la liste doit écouter !
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  resetFilters: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 1. Logique de Debounce (Anti-Lag)
  // On attend 300ms après la dernière frappe avant de lancer le filtrage lourd
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // 2. Reset global (utile pour un bouton "Tout effacer")
  const resetFilters = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setSelectedTag(null);
  };

  // 3. Memoization pour éviter les re-rendus inutiles du Provider
  const value = useMemo(() => ({
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    selectedTag,
    setSelectedTag,
    resetFilters
  }), [searchTerm, debouncedSearchTerm, selectedTag]);

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};