// src/lib/data.ts
import Papa from 'papaparse';
import { Emission, GlobalTags, PlaylistItem } from './types';

const EMISSIONS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSufSOVQkT11EZaJAGQ5RbC7E01QFcUmjPUHI8FSNjbqEg7L5tcuUBZzJRKRi0AXoLD5llJe1PP8_8b/pub?gid=43357015&single=true&output=csv';
const PLAYLISTS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSufSOVQkT11EZaJAGQ5RbC7E01QFcUmjPUHI8FSNjbqEg7L5tcuUBZzJRKRi0AXoLD5llJe1PP8_8b/pub?gid=1302606414&single=true&output=csv';

async function fetchCsv(url: string): Promise<any[]> {
    const res = await fetch(url); 
    if (!res.ok) throw new Error(`Erreur fetch CSV: ${res.statusText}`);
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
    const globalArtistCounts = new Map<string, number>();
    const globalGenreCounts = new Map<string, number>();
    const emissionGenresMap = new Map<number, Set<string>>();

    // 1. Traitement des Playlists (Inchangé)
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
        
        const rawGenres = row['Genre'] || '';
        const genres = rawGenres.split(',').map((g: string) => g.trim()).filter((g: string) => g.length > 0);
        
        if (!emissionGenresMap.has(number)) emissionGenresMap.set(number, new Set());
        const currentEmissionGenres = emissionGenresMap.get(number)!;
        
        genres.forEach((genre: string) => {
            currentEmissionGenres.add(genre);
            const tag = genre.toLowerCase();
            globalGenreCounts.set(tag, (globalGenreCounts.get(tag) || 0) + 1);
        });

        if (!playlistsMap.has(number)) playlistsMap.set(number, []);
        playlistsMap.get(number)!.push(item);

        if (!searchableTextMap.has(number)) searchableTextMap.set(number, []);
        searchableTextMap.get(number)!.push(item.artiste, item.titre);

        if (item.artiste) {
            const artistes = item.artiste.split(',').map(a => a.trim()).filter(a => a.length > 0);
            artistes.forEach(artiste => {
                const tag = artiste.toLowerCase();
                globalArtistCounts.set(tag, (globalArtistCounts.get(tag) || 0) + 1);
            });
        }
    });

    // 2. Traitement des Émissions
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
            
            // --- NOUVELLE LOGIQUE D'IMAGE DIRECTE ---
            let imageUrl = null;
            
            if (platform === 'archive') {
                const archiveId = link.split('/').pop();
                // CONSTRUCTION DIRECTE DE L'URL HD
                // Hypothèse : Le fichier s'appelle toujours "TupiXX_itemimage.jpg"
                // Pas d'appel API, c'est instantané.
                if (archiveId) {
                    const filename = `Tupi${number}_itemimage.jpg`;
                    imageUrl = `https://archive.org/download/${archiveId}/${filename}`;
                }
            }
            // ----------------------------------------

            let title = `Émission #${number}`;
            const invité = row['Invité'] || '';
            if (invité) {
                title += ` - Invité : ${invité}`;
            }
            
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

    // 3. RÉCUPÉRATION ASYNCHRONE (Uniquement pour Mixcloud maintenant)
    // On n'a plus besoin de batching complexe car on ne traite que les quelques émissions Mixcloud
    const finalEmissionsWithImages = await Promise.all(
        finalEmissions.map(async (emission) => {
            
            // Seul Mixcloud a besoin d'un fetch pour trouver son image
            if (emission.platform === 'mixcloud' && !emission.imageUrl) {
                try {
                    const oembedUrl = `https://www.mixcloud.com/oembed/?url=${encodeURIComponent(emission.link)}&format=json`;
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 3000); 
                    
                    const response = await fetch(oembedUrl, { signal: controller.signal });
                    clearTimeout(timeoutId);

                    if (response.ok) {
                        const data = await response.json();
                        if (data.image) emission.imageUrl = data.image;
                    }
                } catch (err) {
                    // Erreur silencieuse
                }
            }
            // Pour Archive, l'URL est déjà construite plus haut, on ne fait rien.

            return emission;
        })
    );
    
    const globalTags = Array.from(globalArtistCounts.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count); 
        
    const globalGenres = Array.from(globalGenreCounts.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);

    return { emissions: finalEmissionsWithImages, globalTags, globalGenres };
}