export interface Music {
  id: string;
  name: string;
  author: string;
  audio_url: string;
  genreId: number;
  yearId: number;
  createdAt: string;
}

export interface CreateMusicRequest {
  name: string;
  author: string;
  audio: File[];
  genre_id: number;
  year_id: number;
}

export interface UpdateMusicRequest {
  id: string;
  name?: string;
  author?: string;
  audio_url?: string;
  genre_id?: number;
  year_id?: number;
}
