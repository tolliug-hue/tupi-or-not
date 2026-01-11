// src/components/AboutModal.tsx
'use client';

import { useState } from 'react';

export default function AboutModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* LE BOUTON D'OUVERTURE (Style Lien) */}
      <button 
        onClick={() => setIsOpen(true)}
        // MODIFICATIONS :
        // - text-white : Blanc pur
        // - text-sm : Taille standard (plus lisible sans le cadre)
        // - hover:underline : Souligné au survol pour montrer que c'est cliquable
        // - Retrait de : border, uppercase, px-2, py-1, text-gray-400
        className="text-sm font-bold text-white hover:text-gray-300 transition-colors"
      >
        À propos
      </button>

      {/* LA MODALE (Inchangée) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white text-gray-900 w-full max-w-2xl rounded-xl shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header de la modale */}
            <div className="bg-gray-100 p-4 flex justify-between items-center border-b">
              <h2 className="font-bold text-xl">À propos de l&apos;émission</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Contenu */}
            <div className="p-6 space-y-4 text-sm sm:text-base leading-relaxed overflow-y-auto max-h-[70vh]">
              <p>
                <span className="font-bold">Tupi or not</span>, revendiquant l&apos;héritage du mouvement anthropophage de l&apos;agitateur-poète Oswald de Andrade, est une sorte de cadavre exquis musical réalisé en ping-pong à deux.
              </p>
              <p>
                Les animateurs viennent chacun avec des musiques à faire découvrir à l&apos;autre et l&apos;émission alterne écoute et discussions – réactions à chaud sur ce qui vient d&apos;être joué. Jazz, Pop, Electro, World musique, Musique savante, Hip Hop, Folk, Soul, Musique expérimentale… nul genre n&apos;est à priori exclu.
              </p>
              <p>
                Régulièrement, les animateurs recevront un invité qui se prêtera au jeu et apportera quelques musiques à faire découvrir aux animateurs et donc aux auditeurs.
              </p>
              
              <hr className="border-gray-200 my-4" />
              
              <p className="text-gray-600 italic text-sm">
                Émission mensuelle d&apos;une heure co-animée par <span className="font-semibold text-gray-800">Soline Garry</span> et <span className="font-semibold text-gray-800">Olivier Guillot</span>, programmée dimanche à 20h et jeudi à 21h (une semaine sur deux) sur <a href="http://radio-octopus.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-bold">radio-octopus.org</a>.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}