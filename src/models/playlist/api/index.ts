import { api } from "../../../api";
import type { Playlist, UpdatePlaylistRequest } from "../types";

export const fetchPlaylists = async (): Promise<Playlist[]> => {
  const response = await api.get("/playlist");
  return response.data;
};

export const fetchPlaylistById = async (id: string): Promise<Playlist> => {
  const response = await api.get(`/playlist/${id}`);
  return response.data;
};

export const createPlaylist = async (data: FormData): Promise<Playlist> => {
  const response = await api.post("/playlist", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updatePlaylist = async (
  data: UpdatePlaylistRequest
): Promise<Playlist> => {
  const { id, ...updateData } = data;
  const response = await api.put(`/playlist/${id}`, updateData);
  return response.data;
};

export const deletePlaylist = async (id: string): Promise<void> => {
  await api.delete(`/playlist/${id}`);
};
