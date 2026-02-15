import type { Metadata } from 'next';

// On empêche l'indexation des iframes par Google (SEO Duplicate Content protection)
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-transparent flex flex-col justify-center">
      {children}
    </div>
  );
}