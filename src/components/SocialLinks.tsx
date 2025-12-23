// src/components/SocialLinks.tsx

export const SocialLinks = () => (
  <div className="flex items-center gap-4">
    {/* Facebook */}
    {/* MODIF : text-white au lieu de text-gray-400 */}
    <a href="https://www.facebook.com/emissiontupiornot" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#1877F2] transition-colors" title="Facebook">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
    </a>
    
    {/* Mail */}
    {/* MODIF : text-white au lieu de text-gray-400 */}
    <a href="mailto:contact@radio-octopus.org" className="text-white hover:text-gray-300 transition-colors" title="Nous contacter">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    </a>
  </div>
);