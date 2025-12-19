// src/lib/data.ts
import Papa from 'papaparse';

const EMISSIONS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSufSOVQkT11EZaJAGQ5RbC7E01QFcUmjPUHI8FSNjbqEg7L5tcuUBZzJRKRi0AXoLD5llJe1PP8_8b/pub?gid=43357015&single=true&output=csv';
const PLAYLISTS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSufSOVQkT11EZaJAGQ5RbC7E01QFcUmjPUHI8FSNjbqEg7L5tcuUBZzJRKRi0AXoLD5llJe1PP8_8b/pub?gid=1302606414&single=true&output=csv';

export interface PlaylistItem {
  ordre: number;
  startTime: string;
  artiste: string;
  titre: string;
  proposePar: string;
}

export interface Emission {
  id: string;
  number: number;
  title: string;
  date: string;
  link: string;
  platform: 'mixcloud' | 'archive';
  imageUrl: string | null;
  playlist: PlaylistItem[];
  searchableText: string;
  genres: string[]; // Liste des genres pour l'affichage
}

export interface GlobalTags {
    tag: string;
    count: number;
}

async function fetchCsv(url: string): Promise<any[]> {
    const res = await fetch(`${url}&t=${Date.now()}`, { cache: 'no-store' });
    const csvText = await res.text();
    return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (results: any) => resolve(results.data),
            error: (error: any) => reject(error),
        });
    });
}

export async function getEmissions(): Promise<{ emissions: Emission[], globalTags: GlobalTags[], globalGenres: GlobalTags[] }> {
    const [rawEmissions, rawPlaylists] = await Promise.all([
        fetchCsv(EMISSIONS_URL),
        fetchCsv(PLAYLISTS_URL),
    ]);

    const playlistsMap = new Map<number, PlaylistItem[]>();
    const searchableTextMap = new Map<number, string[]>();
    const globalArtistCounts = new Map<string, number>(); // Compteur Artistes
    const globalGenreCounts = new Map<string, number>(); // Compteur Genres
    const emissionGenresMap = new Map<number, Set<string>>();

    rawPlaylists.forEach((row: any) => {
        const rawNum = row['Emission'] || '';
        const number = parseInt(rawNum.toString().replace(/\D/g, '')) || 0;
        if (number === 0) return;

        const item: PlaylistItem = {
            ordre: parseInt(row['Ordre']) || 0,
            startTime: row['Start Time'] || '',
            artiste: row['Artiste'] || '',
            titre: row['Titre'] || '',
            proposePar: row['Proposé par'] || '',
        };
        
        // --- LOGIQUE GENRE DE LA PLAYLIST ---
        const rawGenres = row['Genre'] || '';
        const genres = rawGenres.split(',').map((g: string) => g.trim()).filter((g: string) => g.length > 0);
        
        if (!emissionGenresMap.has(number)) emissionGenresMap.set(number, new Set());
        const currentEmissionGenres = emissionGenresMap.get(number)!;
        
        genres.forEach((genre: string) => {
            currentEmissionGenres.add(genre);
            // Comptage global des genres
            const tag = genre.toLowerCase();
            globalGenreCounts.set(tag, (globalGenreCounts.get(tag) || 0) + 1);
        });
        // ------------------------------------

        // Ajout à la playlist
        if (!playlistsMap.has(number)) playlistsMap.set(number, []);
        playlistsMap.get(number)!.push(item);

        // Ajout au texte de recherche
        if (!searchableTextMap.has(number)) searchableTextMap.set(number, []);
        searchableTextMap.get(number)!.push(item.artiste, item.titre);

        // LOGIQUE TAGS GLOBAUX (Artistes)
        if (item.artiste) {
            const artistes = item.artiste.split(',').map(a => a.trim()).filter(a => a.length > 0);
            artistes.forEach(artiste => {
                const tag = artiste.toLowerCase();
                globalArtistCounts.set(tag, (globalArtistCounts.get(tag) || 0) + 1);
            });
        }
    });

    const finalEmissions: Emission[] = rawEmissions
        .map((row: any) => {
            const rawNum = row['Numéro'] || '';
            const number = parseInt(rawNum.toString().replace(/\D/g, '')) || 0;
            if (number === 0) return null;

            const rawDate = row['Date'] || '';
            let dateSlug = '';
            if (rawDate.includes('/')) {
                const parts = rawDate.split('/');
                if (parts.length === 3) {
                    const day = parts[0].padStart(2, '0');
                    const month = parts[1].padStart(2, '0');
                    let year = parts[2];
                    if (year.length === 2) year = '20' + year;
                    dateSlug = `${day}-${month}-${year}`;
                }
            }

            const platform = row['Plateforme']?.toLowerCase() === 'mixcloud' ? 'mixcloud' : 'archive';
            let link = row['Lien'] || '';
            if (!link) {
                if (platform === 'archive') {
                    link = `https://archive.org/details/tupi-${number}-${dateSlug}`;
                } else {
                    link = `https://www.mixcloud.com/olivier-guillot2/tupi-or-not-${number}-${dateSlug}/`;
                }
            }
            let imageUrl = null;
            if (platform === 'archive') {
                const archiveId = link.split('/').pop();
                if (archiveId) imageUrl = `https://archive.org/services/img/${archiveId}`;
            }

            let title = `Émission #${number}`;
            const invité = row['Invité'] || '';
            if (invité) {
                title += ` - Invité : ${invité}`;
            }
            
            // Récupération des genres de l'émission
            const genres = Array.from(emissionGenresMap.get(number) || []);

            const playlistSearch = searchableTextMap.get(number)?.join(' ') || '';
            const searchableText = `${title} ${rawDate} ${invité} ${genres.join(' ')} ${playlistSearch}`.toLowerCase();

            return {
                id: number.toString(),
                number: number,
                title: title,
                date: rawDate,
                link: link,
                platform: platform,
                imageUrl: imageUrl,
                playlist: playlistsMap.get(number)?.sort((a, b) => a.ordre - b.ordre) || [],
                searchableText: searchableText,
                genres: genres,
            } as Emission;
        })
        .filter((e): e is Emission => e !== null)
        .sort((a, b) => b.number - a.number);

    // Récupération des images Mixcloud
    const promises = finalEmissions.map(async (emission) => {
        if (emission.platform === 'mixcloud' && !emission.imageUrl) {
            try {
                const oembedUrl = `https://www.mixcloud.com/oembed/?url=${encodeURIComponent(emission.link)}&format=json`;
                const response = await fetch(oembedUrl);
                if (response.ok) {
                    const data = await response.json();
                    if (data.image) {
                        emission.imageUrl = data.image;
                    }
                }
            } catch (err) {
                // Erreur silencieuse
            }
        }
        return emission;
    });

    const finalEmissionsWithImages = await Promise.all(promises);
    
    // Création du tableau de tags globaux (Artistes)
    const globalTags = Array.from(globalArtistCounts.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count); 
        
    // Création du tableau de tags globaux (Genres)
    const globalGenres = Array.from(globalGenreCounts.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);

    return { emissions: finalEmissionsWithImages, globalTags, globalGenres };
}