// types/database.ts
export interface Music {
  id: string;
  title: string;
  artist: string;
  audio_url: string;
  duration: number;
  alternative_titles: string[];
  is_active: boolean;
  created_at: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  cover_image_url: string;
  is_featured: boolean;
  created_at: string;
}

export interface PlaylistMusic {
  playlist_id: string;
  music_id: string;
  position: number;
}
