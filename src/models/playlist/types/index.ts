import type { Music } from "../../music/types";

export interface Playlist {
  id: string;
  name: string;
  image_url: string;
  musics?: Music[];
}

export interface CreatePlaylistRequest {
  name: string;
  image_url: string;
}

export interface UpdatePlaylistRequest {
  id: string;
  name?: string;
  image_url?: string;
}
