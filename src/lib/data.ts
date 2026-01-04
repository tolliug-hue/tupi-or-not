// src/lib/data.ts
import Papa from 'papaparse';
import { Emission, GlobalTags, PlaylistItem } from './types';

const EMISSIONS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSufSOVQkT11EZaJAGQ5RbC7E01QFcUmjPUHI8FSNjbqEg7L5tcuUBZzJRKRi0AXoLD5llJe1PP8_8b/pub?gid=43357015&single=true&output=csv';
const PLAYLISTS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSufSOVQkT11EZaJAGQ5RbC7E01QFcUmjPUHI8FSNjbqEg7L5tcuUBZzJRKRi0AXoLD5llJe1PP8_8b/pub?gid=1302606414&single=true&output=csv';

// SUPPRESSION DE LA LISTE EN DUR (C'est le CSV qui pilote maintenant)

// --- UTILITAIRES ---

async function processInBatches<T>(items: T[], batchSize: number, task: (item: T) => Promise<T>): Promise<T[]> {
    const results: T[] = [];
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map(task));
        results.push(...batchResults);
    }
    return results;
}

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

async function fetchArchiveGlobalStats(ids: string[]): Promise<Record<string, number>> {
    if (ids.length === 0) return {};
    const chunks = [];
    for (let i = 0; i < ids.length; i += 50) {
        chunks.push(ids.slice(i, i + 50));
    }
    const statsMap: Record<string, number> = {};
    for (const chunk of chunks) {
        try {
            const url = `https://be-api.us.archive.org/views/v1/short/${chunk.join(',')}`;
            const res = await fetch(url, { next: { revalidate: 3600 } });
            if (res.ok) {
                const data = await res.json();
                Object.keys(data).forEach(key => {
                    if (data[key] && data[key].all_time) {
                        statsMap[key] = data[key].all_time;
                    }
                });
            }
        } catch (e) { /* Ignore */ }
    }
    return statsMap;
}

// --- FONCTION PRINCIPALE ---

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
            
            let imageUrl = null;
            if (platform === 'archive') {
                const archiveId = link.split('/').pop();
                if (archiveId) {
                    const filename = `Tupi${number}_itemimage.jpg`;
                    imageUrl = `https://archive.org/download/${archiveId}/${filename}`;
                }
            }

            let title = `Émission #${number}`;
            const invité = row['Invité'] || '';
            if (invité) {
                title += ` - Invité : ${invité}`;
            }
            const theme = row['Theme'] || '';
            
            // NOUVEAU : Lecture de la colonne "Mixcloud Legacy"
            // Si la case contient quelque chose (ex: "OUI"), c'est true. Sinon false.
            const mixcloudLegacy = !!row['Mixcloud Legacy'];

            const genres = Array.from(emissionGenresMap.get(number) || []);
            const playlistSearch = searchableTextMap.get(number)?.join(' ') || '';
            const searchableText = `${title} ${rawDate} ${invité} ${theme} ${genres.join(' ')} ${playlistSearch}`.toLowerCase();

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
                theme: theme,
                listenCount: 0,
                mixcloudLegacy: mixcloudLegacy, // On stocke l'info
            } as Emission;
        })
        .filter((e): e is Emission => e !== null)
        .sort((a, b) => b.number - a.number);

    // --- BULK ARCHIVE STATS ---
    const archiveIds = finalEmissions
        .filter(e => e.platform === 'archive')
        .map(e => e.link.split('/').pop() || '')
        .filter(id => id !== '');
    
    const archiveStatsMap = await fetchArchiveGlobalStats(archiveIds);

    // 3. ENRICHISSEMENT
    const finalEmissionsWithStats = await processInBatches(finalEmissions, 5, async (emission) => {
        
        // A. MIXCLOUD (Standard)
        if (emission.platform === 'mixcloud') {
            try {
                const apiLink = emission.link.replace('www.mixcloud.com', 'api.mixcloud.com');
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 4000);
                const res = await fetch(apiLink, { signal: controller.signal });
                clearTimeout(timeoutId);
                
                if (res.ok) {
                    const data = await res.json();
                    if (data.play_count !== undefined) emission.listenCount = data.play_count;
                    if (!emission.imageUrl && data.pictures) {
                        emission.imageUrl = data.pictures.extra_large || data.pictures.large;
                    }
                }
            } catch (err) { /* Ignore */ }
        }

        // B. ARCHIVE.ORG (Avec Bonus Mixcloud Legacy piloté par le CSV)
        if (emission.platform === 'archive') {
            const archiveId = emission.link.split('/').pop();
            
            // 1. Stats Archive
            if (archiveId && archiveStatsMap[archiveId]) {
                emission.listenCount = archiveStatsMap[archiveId];
            }

            // 2. Stats Mixcloud Legacy (Si coché dans le CSV)
            // MODIF : On utilise la propriété de l'objet au lieu de la liste en dur
            if (emission.mixcloudLegacy) {
                try {
                    const dateSlug = emission.date.replace(/\//g, '-');
                    const legacyUrl = `https://api.mixcloud.com/olivier-guillot2/tupi-or-not-${emission.number}-${dateSlug}/`;
                    
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 3000);
                    const res = await fetch(legacyUrl, { signal: controller.signal });
                    clearTimeout(timeoutId);

                    if (res.ok) {
                        const data = await res.json();
                        if (data.play_count) {
                            emission.listenCount = (emission.listenCount || 0) + data.play_count;
                        }
                    }
                } catch (e) { /* Ignore */ }
            }
        }
        
        return emission;
    });
    
    const globalTags = Array.from(globalArtistCounts.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count); 
        
    const globalGenres = Array.from(globalGenreCounts.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);

    return { emissions: finalEmissionsWithStats, globalTags, globalGenres };
}