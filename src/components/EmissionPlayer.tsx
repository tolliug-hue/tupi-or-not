'use client';

import Image from 'next/image';
import { Emission, PlaylistItem } from '@/lib/types';

/**
 * Composant autonome affichant le lecteur audio, la pochette et la playlist.
 * Utilisé dans la Modale (Site) et dans la page Embed (Widget).
 */
export default function EmissionPlayer({ emission }: { emission: Emission }) {
  
  const getArchiveId = (link: string) => {
    const parts = link.split('/');
    return parts[parts.length - 1] || parts[parts.length - 2];
  };

  return (
    <div className="flex flex-col w-full bg-white">
      
      {/* ZONE PLAYER (Image + Iframe) */}
      <div className="bg-black flex flex-col justify-center items-center w-full">
        
        {/* Image de couverture */}
        {emission.imageUrl && (
          <div className="w-full h-48 bg-black relative border-b border-gray-800">
            <Image
              src={emission.imageUrl}
              alt={emission.title}
              fill
              className="object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Iframe Lecteur */}
        <div className="w-full h-[60px] flex items-center justify-center bg-black">
          {emission.platform === 'mixcloud' ? (
            <iframe
              width="100%"
              height="60"
              src={`https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&hide_artwork=1&feed=${encodeURIComponent(emission.link)}`}
              allow="encrypted-media; fullscreen; autoplay; idle-detection; speaker-selection; web-share"
              className="bg-black border-0"
            ></iframe>
          ) : (
            <iframe
              src={`https://archive.org/embed/${getArchiveId(emission.link)}`}
              width="100%"
              height="30"
              allow="encrypted-media; fullscreen; autoplay; picture-in-picture"
              className="bg-black border-0"
            ></iframe>
          )}
        </div>
      </div>

      {/* PLAYLIST */}
      <PlaylistDisplay playlist={emission.playlist} />
    </div>
  );
}

// Sous-composant Playlist (Déplacé ici car il appartient au Player)
const PlaylistDisplay = ({ playlist }: { playlist: PlaylistItem[] }) => {
  const getGoogleSearchLink = (query: string) => `https://www.google.com/search?q=${encodeURIComponent(query + ' artiste musique')}`;
  const getMusicBrainzRecordingLink = (artiste: string, titre: string) => `https://musicbrainz.org/search?query=${encodeURIComponent(`${titre} AND artist:${artiste}`)}&type=recording`;
  const getDiscogsSearchLink = (artiste: string, titre: string) => `https://www.discogs.com/search/?q=${encodeURIComponent(`${artiste} - ${titre}`)}&type=all`;

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
                  <a href={getGoogleSearchLink(item.artiste)} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">
                    {item.artiste}
                  </a>
                  <span className="text-gray-700"> - {item.titre}</span>
                  {item.proposePar && <span className="text-gray-600 italic ml-1">({item.proposePar})</span>}
                </div>
                <div className="text-xs text-gray-600 flex-shrink-0 text-right font-normal tracking-tight tabular-nums">
                  {item.startTime}
                </div>
              </div>
              <div className="mt-1 flex space-x-2 text-xs">
                <a href={getMusicBrainzRecordingLink(item.artiste, item.titre)} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 hover:underline">[MusicBrainz]</a>
                <a href={getDiscogsSearchLink(item.artiste, item.titre)} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 hover:underline">[Discogs]</a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};