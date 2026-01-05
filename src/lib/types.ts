/**
 * Représente un élément individuel (morceau) dans la playlist d'une émission.
 */
export interface PlaylistItem {
  ordre: number;
  startTime: string;
  artiste: string;
  titre: string;
  proposePar: string;
}

/**
 * Représente une émission complète avec ses métadonnées et sa playlist.
 */
export interface Emission {
  id: string;
  /** Numéro séquentiel de l'émission */
  number: number;
  title: string;
  /** Date de diffusion au format JJ/MM/AAAA */
  date: string;
  /** Lien vers la page originale (Mixcloud ou Archive.org) */
  link: string;
  platform: 'mixcloud' | 'archive';
  /** URL de l'image de couverture (HD si disponible) */
  imageUrl: string | null;
  playlist: PlaylistItem[];
  /** Chaîne concaténée pour la recherche textuelle (Titre + Artistes + Genres + Thème) */
  searchableText: string;
  genres: string[];
  /** Thématique principale de l'émission */
  theme: string;
  /** 
   * Nombre d'écoutes récupéré via API (Mixcloud) ou Scraping (Archive).
   * Inclut le cumul Mixcloud+Archive pour les émissions migrées (Legacy).
   */
  listenCount?: number;
  /** Indique si l'émission a été migrée manuellement (voir colonne CSV) */
  mixcloudLegacy: boolean;
}

/**
 * Structure pour le nuage de tags (Artistes ou Genres).
 */
export interface GlobalTags {
    tag: string;
    count: number;
}