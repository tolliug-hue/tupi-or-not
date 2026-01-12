// src/components/MobileMenu.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import AboutModal from './AboutModal';
import { SocialLinks } from './SocialLinks';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* BOUTON BURGER (Visible uniquement sur mobile) */}
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 mr-2 text-white hover:bg-gray-800 rounded-md transition-colors md:hidden"
        aria-label="Ouvrir le menu"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* OVERLAY (Fond sombre) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* LE TIROIR (Sidebar) */}
      <div className={`fixed top-0 left-0 bottom-0 z-50 w-[80%] max-w-sm bg-gray-900 text-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header du tiroir : CROIX À GAUCHE */}
        <div className="p-4 border-b border-gray-800 flex justify-start items-center">
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Fermer le menu"
          >
            {/* Icône Croix */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Contenu du menu (ÉPURÉ) */}
        <div className="p-6 flex flex-col gap-8">
          
          {/* 1. Lien Radio Octopus */}
          <a 
            href="https://radio-octopus.org/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 group"
          >
            <div className="bg-white rounded-full p-1 group-hover:opacity-80 transition-opacity">
               <Image src="/logo-octopus.png" alt="Logo" width={32} height={32} style={{ objectFit: 'contain' }} />
            </div>
            <span className="font-bold text-lg group-hover:text-blue-400 transition-colors">Radio Octopus</span>
          </a>

          {/* 2. À Propos (Le bouton s'intègre ici) */}
          <div className="flex items-start pl-1">
              <AboutModal />
          </div>

          {/* 3. Réseaux Sociaux */}
          <div className="pl-1">
            <SocialLinks />
          </div>

        </div>
        
        {/* Footer du tiroir */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black text-center text-xs text-gray-600 border-t border-gray-800">
            Tupi or Not © {new Date().getFullYear()}
        </div>
      </div>
    </>
  );
}