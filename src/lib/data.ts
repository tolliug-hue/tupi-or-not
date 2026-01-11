import Papa from 'papaparse';
import { Emission, GlobalTags, PlaylistItem } from './types';

// --- CONFIGURATION ---
const CONFIG = {
  URL_EMISSIONS: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSufSOVQkT11EZaJAGQ5RbC7E01QFcUmjPUHI8FSNjbqEg7L5tcuUBZzJRKRi0AXoLD5llJe1PP8_8b/pub?gid=43357015&single=true&output=csv',
  URL_PLAYLISTS: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSufSOVQkT11EZaJAGQ5RbC7E01QFcUmjPUHI8FSNjbqEg7L5tcuUBZzJRKRi0AXoLD5llJe1PP8_8b/pub?gid=1302606414&single=true&output=csv',
  TIMEOUT_MIXCLOUD: 3000, // Réduit à 3s pour accélérer le build
  BATCH_SIZE: 10, // Augmenté car nous allons mettre en cache les requêtes
  REVALIDATE_CSV: 3600, // 1 heure (Mise à jour du Google Sheet)
  REVALIDATE_API: 86400, // 24 heures (les stats ne bougent pas vite)
};

/**
 * Traite une liste d'éléments par lots avec gestion d'erreurs robuste (allSettled)
 */
async function processInBatches<T>(items: T[], batchSize: number, task: (item: T) => Promise<T>): Promise<T[]> {
    const results: T[] = [];
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        // Utilise allSettled pour qu'une erreur ne bloque pas tout le batch
        const batchResults = await Promise.allSettled(batch.map(task));
        
        batchResults.forEach((res, index) => {
            if (res.status === 'fulfilled') {
                results.push(res.value);
            } else {
                // En cas d'erreur, on garde l'item original sans enrichissement
                results.push(batch[index]);
                console.warn(`Erreur enrichissement item ${i + index}:`, res.reason);
            }
        });
    }
    return results;
}

/**
 * Récupère et parse un fichier CSV distant avec Cache Next.js
 */
async function fetchCsv(url: string): Promise<Record<string, string>[]> {
    try {
        // ISR : On ne re-fetch le CSV que toutes les heures
        const res = await fetch(url, { next: { revalidate: CONFIG.REVALIDATE_CSV } }); 
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        const csvText = await res.text();
        
        return new Promise((resolve) => {
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results: Papa.ParseResult<Record<string, string>>) => resolve(results.data),
                error: () => resolve([]), // On ne crash pas, on renvoie vide
            });
        });
    } catch (error) {
        console.error("Erreur critique fetchCsv:", error);
        return [];
    }
}

/**
 * Récupère les statistiques globales d'Archive.org (Bulk)
 */
async function fetchArchiveGlobalStats(ids: string[]): Promise<Record<string, number>> {
    if (ids.length === 0) return {};
    
    // Chunking par 50 pour l'API Archive
    const chunks = [];
    for (let i = 0; i < ids.length; i += 50) {
        chunks.push(ids.slice(i, i + 50));
    }

    const statsMap: Record<string, number> = {};

    for (const chunk of chunks) {
        try {
            const url = `https://be-api.us.archive.org/views/v1/short/${chunk.join(',')}`;
            const res = await fetch(url, { next: { revalidate: CONFIG.REVALIDATE_CSV } });
            if (res.ok) {
                const data = await res.json();
                Object.keys(data).forEach(key => {
                    if (data[key]?.all_time) {
                        statsMap[key] = data[key].all_time;
                    }
                });
            }
        } catch (e) { 
            console.warn("Erreur fetch Archive stats", e);
        }
    }
    return statsMap;
}

/**
 * Fonction principale
 */
export async function getEmissions(): Promise<{ emissions: Emission[], globalTags: GlobalTags[], globalGenres: GlobalTags[] }> {
    const [rawEmissions, rawPlaylists] = await Promise.all([
        fetchCsv(CONFIG.URL_EMISSIONS),
        fetchCsv(CONFIG.URL_PLAYLISTS),
    ]);

    if (!rawEmissions.length) {
        return { emissions: [], globalTags: [], globalGenres: [] };
    }

    const playlistsMap = new Map<number, PlaylistItem[]>();
    const searchableTextMap = new Map<number, string[]>();
    const globalArtistCounts = new Map<string, number>();
    const globalGenreCounts = new Map<string, number>();
    const emissionGenresMap = new Map<number, Set<string>>();

    // 1. Traitement des Playlists
    rawPlaylists.forEach((row: Record<string, string>) => {
        const rawNum = row['Emission'];
        // Parsing robuste du numéro
        const number = typeof rawNum === 'string' ? parseInt(rawNum.replace(/\D/g, '')) : parseInt(rawNum);
        
        if (!number || isNaN(number)) return;

        const item: PlaylistItem = {
            ordre: parseInt(row['Ordre']) || 0,
            startTime: row['Start Time'] || '',
            artiste: row['Artiste']?.trim() || '',
            titre: row['Titre']?.trim() || '',
            proposePar: row['Proposé par'] || '',
        };
        
        // Gestion des Genres
        const rawGenres = row['Genre'] || '';
        if (rawGenres) {
            const genres = rawGenres.split(',').map((g: string) => g.trim()).filter((g: string) => g.length > 0);
            
            if (!emissionGenresMap.has(number)) emissionGenresMap.set(number, new Set());
            const currentEmissionGenres = emissionGenresMap.get(number)!;
            
            genres.forEach((genre: string) => {
                currentEmissionGenres.add(genre);
                const tag = genre.toLowerCase();
                globalGenreCounts.set(tag, (globalGenreCounts.get(tag) || 0) + 1);
            });
        }

        // Mapping Playlist
        if (!playlistsMap.has(number)) playlistsMap.set(number, []);
        playlistsMap.get(number)!.push(item);

        // Mapping Recherche
        if (!searchableTextMap.has(number)) searchableTextMap.set(number, []);
        if (item.artiste) searchableTextMap.get(number)!.push(item.artiste);
        if (item.titre) searchableTextMap.get(number)!.push(item.titre);

        // Compteur Artistes (Tags)
        if (item.artiste) {
            const artistes = item.artiste.split(',').map((a: string) => a.trim()).filter((a: string) => a.length > 0);
            artistes.forEach((artiste: string) => {
                const tag = artiste.toLowerCase();
                globalArtistCounts.set(tag, (globalArtistCounts.get(tag) || 0) + 1);
            });
        }
    });

    // 2. Traitement des Émissions (Base)
    const baseEmissions: Emission[] = rawEmissions
       .map((row: Record<string, string>) => {
            const rawNum = row['Numéro'];
            const number = typeof rawNum === 'string' ? parseInt(rawNum.replace(/\D/g, '')) : parseInt(rawNum);
            
            if (!number || isNaN(number)) return null;

            const rawDate = row['Date'] || '';
            let dateSlug = '';
            // Normalisation de la date pour les URLs
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

            const platform = row['Plateforme']?.toLowerCase().includes('mixcloud') ? 'mixcloud' : 'archive';
            let link = row['Lien'] || '';
            
            // Génération lien par défaut si manquant
            if (!link) {
                if (platform === 'archive') {
                    link = `https://archive.org/details/tupi-${number}-${dateSlug}`;
                } else {
                    link = `https://www.mixcloud.com/olivier-guillot2/tupi-or-not-${number}-${dateSlug}/`;
                }
            }
            
            // Image par défaut Archive.org
            let imageUrl = null;
            if (platform === 'archive') {
                const archiveId = link.split('/').pop();
                if (archiveId) {
                    // Optimisation : on suppose que le jpg existe toujours avec ce nom
                    imageUrl = `https://archive.org/download/${archiveId}/Tupi${number}_itemimage.jpg`;
                }
            }

            let title = `Émission #${number}`;
            const invité = row['Invité'] || '';
            if (invité) title += ` - Invité : ${invité}`;
            
            const theme = row['Theme'] || '';
            const mixcloudLegacy = !!row['Mixcloud Legacy'];

            const genres = Array.from(emissionGenresMap.get(number) || []);
            const playlistSearch = searchableTextMap.get(number)?.join(' ') || '';
            // On pré-calcule le texte de recherche en minuscule pour la perf
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
                mixcloudLegacy: mixcloudLegacy,
            } as Emission;
        })
        .filter((e): e is Emission => e !== null)
        .sort((a, b) => b.number - a.number);

    // --- BULK ARCHIVE STATS ---
    const archiveIds = baseEmissions
        .filter(e => e.platform === 'archive')
        .map(e => e.link.split('/').pop() || '')
        .filter(id => id !== '');
    
    const archiveStatsMap = await fetchArchiveGlobalStats(archiveIds);

    // 3. ENRICHISSEMENT (Mixcloud + Legacy)
    // On utilise processInBatches pour ne pas tuer l'API Mixcloud
    const finalEmissions = await processInBatches(baseEmissions, CONFIG.BATCH_SIZE, async (emission) => {
        
        // A. MIXCLOUD (Standard)
        if (emission.platform === 'mixcloud') {
            try {
                const apiLink = emission.link.replace('www.mixcloud.com', 'api.mixcloud.com');
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MIXCLOUD);
                
                // IMPORTANT : Cache de 24h pour Mixcloud
                const res = await fetch(apiLink, { 
                    signal: controller.signal,
                    next: { revalidate: CONFIG.REVALIDATE_API } 
                });
                clearTimeout(timeoutId);
                
                if (res.ok) {
                    const data = await res.json();
                    if (data.play_count !== undefined) emission.listenCount = data.play_count;
                    if (!emission.imageUrl && data.pictures) {
                        emission.imageUrl = data.pictures.extra_large || data.pictures.large;
                    }
                }
            } catch { /* Fail silently */ }
        }

        // B. ARCHIVE.ORG (Avec Bonus Mixcloud Legacy)
        if (emission.platform === 'archive') {
            const archiveId = emission.link.split('/').pop();
            
            // 1. Stats Archive (Instantané via Map)
            if (archiveId && archiveStatsMap[archiveId]) {
                emission.listenCount = archiveStatsMap[archiveId];
            }

            // 2. Stats Mixcloud Legacy (Si coché)
            if (emission.mixcloudLegacy) {
                try {
                    const dateSlug = emission.date.replace(/\//g, '-');
                    const legacyUrl = `https://api.mixcloud.com/olivier-guillot2/tupi-or-not-${emission.number}-${dateSlug}/`;
                    
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MIXCLOUD);
                    
                    // IMPORTANT : Cache de 24h ici aussi
                    const res = await fetch(legacyUrl, { 
                        signal: controller.signal,
                        next: { revalidate: CONFIG.REVALIDATE_API }
                    });
                    clearTimeout(timeoutId);

                    if (res.ok) {
                        const data = await res.json();
                        if (data.play_count) {
                            emission.listenCount = (emission.listenCount || 0) + data.play_count;
                        }
                    }
                } catch { /* Fail silently */ }
            }
        }
        
        return emission;
    });
    
    // Tri des tags
    const globalTags = Array.from(globalArtistCounts.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count); 
        
    const globalGenres = Array.from(globalGenreCounts.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);

    return { emissions: finalEmissions, globalTags, globalGenres };
}