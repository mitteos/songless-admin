import { api } from "../../../api";
import type { Year, CreateYearRequest, UpdateYearRequest } from "../types";

export const fetchYears = async (): Promise<Year[]> => {
  const response = await api.get("/year");
  return response.data;
};

export const fetchYearById = async (id: string): Promise<Year> => {
  const response = await api.get(`/year/${id}`);
  return response.data;
};

export const createYear = async (data: CreateYearRequest): Promise<Year> => {
  const response = await api.post("/year", data);
  return response.data;
};

export const updateYear = async (data: UpdateYearRequest): Promise<Year> => {
  const { id, ...updateData } = data;
  const response = await api.put(`/year/${id}`, updateData);
  return response.data;
};

export const deleteYear = async (id: string): Promise<void> => {
  await api.delete(`/year/${id}`);
};
