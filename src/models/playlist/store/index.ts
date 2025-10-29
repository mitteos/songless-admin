import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPlaylist,
  deletePlaylist,
  fetchPlaylists,
  updatePlaylist,
} from "../api";
import type { UpdatePlaylistRequest } from "../types";

// Ключи для кэширования запросов
const playlistKeys = {
  all: ["playlists"] as const,
  lists: () => [...playlistKeys.all, "list"] as const,
  details: () => [...playlistKeys.all, "detail"] as const,
  detail: (id: string) => [...playlistKeys.details(), id] as const,
};

// Основной хук для управления жанрами
export const usePlaylistStore = () => {
  const queryClient = useQueryClient();

  // Запрос для получения всех жанров
  const playlistsQuery = useQuery({
    queryKey: playlistKeys.lists(),
    queryFn: fetchPlaylists,
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут
  });

  // Мутация для создания жанра
  const createPlaylistMutation = useMutation({
    mutationFn: (data: FormData) => createPlaylist(data),
    onSuccess: () => {
      // Обновляем кэш списка жанров после успешного создания
      queryClient.invalidateQueries({ queryKey: playlistKeys.lists() });
    },
    onError: (error) => {
      console.error("Ошибка при создании плейлиста:", error);
    },
  });

  // Мутация для обновления жанра
  const updatePlaylistMutation = useMutation({
    mutationFn: (data: UpdatePlaylistRequest) => updatePlaylist(data),
    onSuccess: (updatedPlaylist) => {
      // Обновляем кэш конкретного жанра
      queryClient.setQueryData(
        playlistKeys.detail(updatedPlaylist.id),
        updatedPlaylist
      );
      // Обновляем кэш списка жанров
      queryClient.invalidateQueries({ queryKey: playlistKeys.lists() });
    },
    onError: (error) => {
      console.error("Ошибка при обновлении жанра:", error);
    },
  });

  // Мутация для удаления жанра
  const deletePlaylistMutation = useMutation({
    mutationFn: (id: string) => deletePlaylist(id),
    onSuccess: (_, deletedId) => {
      // Удаляем жанр из кэша
      queryClient.removeQueries({ queryKey: playlistKeys.detail(deletedId) });
      // Обновляем кэш списка жанров
      queryClient.invalidateQueries({ queryKey: playlistKeys.lists() });
    },
    onError: (error) => {
      console.error("Ошибка при удалении плейлиста:", error);
    },
  });

  return {
    // Данные
    playlists: playlistsQuery.data || [],
    isLoading: playlistsQuery.isLoading,
    isError: playlistsQuery.isError,
    error: playlistsQuery.error,

    // Функции для работы с жанрами
    createPlaylist: createPlaylistMutation.mutateAsync,
    updatePlaylist: updatePlaylistMutation.mutate,
    deletePlaylist: deletePlaylistMutation.mutate,

    // Состояния загрузки
    isCreating: createPlaylistMutation.isPending,
    isUpdating: updatePlaylistMutation.isPending,
    isDeleting: deletePlaylistMutation.isPending,

    // Ошибки
    createError: createPlaylistMutation.error,
    updateError: updatePlaylistMutation.error,
    deleteError: deletePlaylistMutation.error,
  };
};
