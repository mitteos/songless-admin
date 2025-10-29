import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchGenres, createGenre, updateGenre, deleteGenre } from "../api";
import type { CreateGenreRequest, UpdateGenreRequest } from "../types";

// Ключи для кэширования запросов
const genreKeys = {
  all: ["genres"] as const,
  lists: () => [...genreKeys.all, "list"] as const,
  details: () => [...genreKeys.all, "detail"] as const,
  detail: (id: string) => [...genreKeys.details(), id] as const,
};

// Основной хук для управления жанрами
export const useGenreStore = () => {
  const queryClient = useQueryClient();

  // Запрос для получения всех жанров
  const genresQuery = useQuery({
    queryKey: genreKeys.lists(),
    queryFn: fetchGenres,
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут
  });

  // Мутация для создания жанра
  const createGenreMutation = useMutation({
    mutationFn: (data: CreateGenreRequest) => createGenre(data),
    onSuccess: () => {
      // Обновляем кэш списка жанров после успешного создания
      queryClient.invalidateQueries({ queryKey: genreKeys.lists() });
    },
    onError: (error) => {
      console.error("Ошибка при создании жанра:", error);
    },
  });

  // Мутация для обновления жанра
  const updateGenreMutation = useMutation({
    mutationFn: (data: UpdateGenreRequest) => updateGenre(data),
    onSuccess: (updatedGenre) => {
      // Обновляем кэш конкретного жанра
      queryClient.setQueryData(genreKeys.detail(updatedGenre.id), updatedGenre);
      // Обновляем кэш списка жанров
      queryClient.invalidateQueries({ queryKey: genreKeys.lists() });
    },
    onError: (error) => {
      console.error("Ошибка при обновлении жанра:", error);
    },
  });

  // Мутация для удаления жанра
  const deleteGenreMutation = useMutation({
    mutationFn: (id: string) => deleteGenre(id),
    onSuccess: (_, deletedId) => {
      // Удаляем жанр из кэша
      queryClient.removeQueries({ queryKey: genreKeys.detail(deletedId) });
      // Обновляем кэш списка жанров
      queryClient.invalidateQueries({ queryKey: genreKeys.lists() });
    },
    onError: (error) => {
      console.error("Ошибка при удалении жанра:", error);
    },
  });

  return {
    // Данные
    genres: genresQuery.data || [],
    isLoading: genresQuery.isLoading,
    isError: genresQuery.isError,
    error: genresQuery.error,

    // Функции для работы с жанрами
    createGenre: createGenreMutation.mutate,
    updateGenre: updateGenreMutation.mutate,
    deleteGenre: deleteGenreMutation.mutate,

    // Состояния загрузки
    isCreating: createGenreMutation.isPending,
    isUpdating: updateGenreMutation.isPending,
    isDeleting: deleteGenreMutation.isPending,

    // Ошибки
    createError: createGenreMutation.error,
    updateError: updateGenreMutation.error,
    deleteError: deleteGenreMutation.error,
  };
};
