import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="space-y-4">
        <h1 className="text-6xl font-black text-gray-900">404</h1>
        <h2 className="text-2xl font-bold text-gray-800">Tupi introuvable</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Il semblerait que cette émission n&apos;existe pas ou ait été déplacée dans les archives profondes.
        </p>
        <div className="pt-6">
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors shadow-lg"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}