import { getEmissions } from '@/lib/data';
import EmissionPlayer from '@/components/EmissionPlayer';
import Link from 'next/link';

// Revalidation toutes les heures (comme l'accueil)
export const revalidate = 3600;

export default async function EmbedLatestPage() {
  const { emissions } = await getEmissions();
  const latestEmission = emissions[0];

  if (!latestEmission) {
    return <div className="text-white p-4">Aucune émission disponible.</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white overflow-hidden">
      {/* En-tête minimaliste du Widget */}
      <div className="bg-black text-white px-3 py-2 flex justify-between items-center text-xs border-b border-gray-800">
        <span className="font-medium truncate mr-2">
          Émission #{latestEmission.number} - {latestEmission.date}
        </span>
        
        <Link 
          href={`/?id=${latestEmission.number}`} 
          target="_blank" 
          className="text-white hover:text-gray-300 transition-colors whitespace-nowrap flex items-center gap-1 font-medium"
        >
          Tupi or Not
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </Link>
      </div>

      {/* Le Player (Réutilisé) */}
      <EmissionPlayer emission={latestEmission} />
    </div>
  );
}