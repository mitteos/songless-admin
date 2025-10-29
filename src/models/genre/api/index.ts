import { api } from "../../../api";
import type { Genre, CreateGenreRequest, UpdateGenreRequest } from "../types";

export const fetchGenres = async (): Promise<Genre[]> => {
  const response = await api.get("/genre");
  return response.data;
};

export const fetchGenreById = async (id: string): Promise<Genre> => {
  const response = await api.get(`/genre/${id}`);
  return response.data;
};

export const createGenre = async (data: CreateGenreRequest): Promise<Genre> => {
  const response = await api.post("/genre", data);
  return response.data;
};

export const updateGenre = async (data: UpdateGenreRequest): Promise<Genre> => {
  const { id, ...updateData } = data;
  const response = await api.put(`/genre/${id}`, updateData);
  return response.data;
};

export const deleteGenre = async (id: string): Promise<void> => {
  await api.delete(`/genre/${id}`);
};
