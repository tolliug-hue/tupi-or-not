import { getEmissions } from '@/lib/data';
import EmissionPlayer from '@/components/EmissionPlayer';
import Link from 'next/link';

export const revalidate = 3600;

// Cette fonction permet à Next.js de connaître tous les IDs possibles au build (Performance)
export async function generateStaticParams() {
  const { emissions } = await getEmissions();
  return emissions.map((emission) => ({
    id: emission.number.toString(),
  }));
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function EmbedIdPage({ params }: Props) {
  const { id } = await params;
  const { emissions } = await getEmissions();
  const emission = emissions.find((e) => e.number.toString() === id);

  if (!emission) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 p-4 text-sm text-center">
        Émission #{id} introuvable.
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white overflow-hidden">
      {/* En-tête minimaliste */}
     <div className="bg-black text-white px-3 py-2 flex justify-between items-center text-xs border-b border-gray-800">
        <span className="font-medium truncate mr-2">
          Émission #{emission.number} - {emission.date}
        </span>
        <Link 
          href={`/?id=${emission.number}`} 
          target="_blank" 
          className="text-white hover:text-gray-300 transition-colors whitespace-nowrap flex items-center gap-1 font-medium"
        >
          Tupi or Not
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </Link>
      </div>

      {/* Le Player */}
      <EmissionPlayer emission={emission} />
    </div>
  );
}