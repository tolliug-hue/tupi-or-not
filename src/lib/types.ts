// src/lib/types.ts

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
  genres: string[];
  theme: string;
  listenCount?: number;
  mixcloudLegacy: boolean;
}

export interface GlobalTags {
    tag: string;
    count: number;
}