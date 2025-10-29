import { api } from "../../../api";
import type { Music, UpdateMusicRequest } from "../types";

export const fetchMusic = async (): Promise<Music[]> => {
  const response = await api.get("/music");
  return response.data;
};

export const fetchMusicById = async (id: string): Promise<Music> => {
  const response = await api.get(`/music/${id}`);
  return response.data;
};

export const createMusic = async (data: FormData): Promise<Music> => {
  const response = await api.post("/music", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const createManyMusic = async (data: FormData): Promise<Music[]> => {
  const response = await api.post("/music/many", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateMusic = async (data: UpdateMusicRequest): Promise<Music> => {
  const { id, ...updateData } = data;
  const response = await api.put(`/music/${id}`, updateData);
  return response.data;
};

export const deleteMusic = async (id: string): Promise<void> => {
  await api.delete(`/music/${id}`);
};
