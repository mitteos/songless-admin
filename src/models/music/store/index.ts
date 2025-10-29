import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createManyMusic,
  createMusic,
  deleteMusic,
  fetchMusic,
  updateMusic,
} from "../api";
import type { UpdateMusicRequest } from "../types";

// Ключи для кэширования запросов
const musicKeys = {
  all: ["music"] as const,
  lists: () => [...musicKeys.all, "list"] as const,
  details: () => [...musicKeys.all, "detail"] as const,
  detail: (id: string) => [...musicKeys.details(), id] as const,
};

// Основной хук для управления жанрами
export const useMusicStore = () => {
  const queryClient = useQueryClient();

  // Запрос для получения всех жанров
  const musicQuery = useQuery({
    queryKey: musicKeys.lists(),
    queryFn: fetchMusic,
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут
  });

  // Мутация для создания жанра
  const createMusicMutation = useMutation({
    mutationFn: (data: FormData) => createMusic(data),
    onSuccess: () => {
      // Обновляем кэш списка жанров после успешного создания
      queryClient.invalidateQueries({ queryKey: musicKeys.lists() });
    },
    onError: (error) => {
      console.error("Ошибка при создании музыки:", error);
    },
  });

  const createManyMusicMutation = useMutation({
    mutationFn: (data: FormData) => createManyMusic(data),
    onSuccess: () => {
      // Обновляем кэш списка жанров после успешного создания
      queryClient.invalidateQueries({ queryKey: musicKeys.lists() });
    },
    onError: (error) => {
      console.error("Ошибка при загрузке множества музыки:", error);
    },
  });

  // Мутация для обновления жанра
  const updateMusicMutation = useMutation({
    mutationFn: (data: UpdateMusicRequest) => updateMusic(data),
    onSuccess: (updatedMusic) => {
      // Обновляем кэш конкретного жанра
      queryClient.setQueryData(musicKeys.detail(updatedMusic.id), updatedMusic);
      // Обновляем кэш списка жанров
      queryClient.invalidateQueries({ queryKey: musicKeys.lists() });
    },
    onError: (error) => {
      console.error("Ошибка при обновлении музыки:", error);
    },
  });

  // Мутация для удаления жанра
  const deleteMusicMutation = useMutation({
    mutationFn: (id: string) => deleteMusic(id),
    onSuccess: (_, deletedId) => {
      // Удаляем жанр из кэша
      queryClient.removeQueries({ queryKey: musicKeys.detail(deletedId) });
      // Обновляем кэш списка жанров
      queryClient.invalidateQueries({ queryKey: musicKeys.lists() });
    },
    onError: (error) => {
      console.error("Ошибка при удалении музыки:", error);
    },
  });

  return {
    // Данные
    musics: musicQuery.data || [],
    isLoading: musicQuery.isLoading,
    isError: musicQuery.isError,
    error: musicQuery.error,

    // Функции для работы с жанрами
    createMusic: createMusicMutation.mutate,
    createManyMusic: createManyMusicMutation.mutateAsync,
    updateMusic: updateMusicMutation.mutate,
    deleteMusic: deleteMusicMutation.mutate,

    // Состояния загрузки
    isCreating: createMusicMutation.isPending,
    isUpdating: updateMusicMutation.isPending,
    isDeleting: deleteMusicMutation.isPending,
    isManyUploading: createManyMusicMutation.isPending,

    // Ошибки
    createError: createMusicMutation.error,
    updateError: updateMusicMutation.error,
    deleteError: deleteMusicMutation.error,
  };
};
