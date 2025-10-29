import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createYear, deleteYear, fetchYears, updateYear } from "../api";
import type { CreateYearRequest, UpdateYearRequest } from "../types";

// Ключи для кэширования запросов
const yearKeys = {
  all: ["years"] as const,
  lists: () => [...yearKeys.all, "list"] as const,
  details: () => [...yearKeys.all, "detail"] as const,
  detail: (id: string) => [...yearKeys.details(), id] as const,
};

// Основной хук для управления жанрами
export const useYearStore = () => {
  const queryClient = useQueryClient();

  // Запрос для получения всех жанров
  const yearsQuery = useQuery({
    queryKey: yearKeys.lists(),
    queryFn: fetchYears,
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут
  });

  // Мутация для создания жанра
  const createYearMutation = useMutation({
    mutationFn: (data: CreateYearRequest) => createYear(data),
    onSuccess: () => {
      // Обновляем кэш списка жанров после успешного создания
      queryClient.invalidateQueries({ queryKey: yearKeys.lists() });
    },
    onError: (error) => {
      console.error("Ошибка при создании жанра:", error);
    },
  });

  // Мутация для обновления жанра
  const updateYearMutation = useMutation({
    mutationFn: (data: UpdateYearRequest) => updateYear(data),
    onSuccess: (updatedYear) => {
      // Обновляем кэш конкретного жанра
      queryClient.setQueryData(yearKeys.detail(updatedYear.id), updatedYear);
      // Обновляем кэш списка жанров
      queryClient.invalidateQueries({ queryKey: yearKeys.lists() });
    },
    onError: (error) => {
      console.error("Ошибка при обновлении года:", error);
    },
  });

  // Мутация для удаления жанра
  const deleteYearMutation = useMutation({
    mutationFn: (id: string) => deleteYear(id),
    onSuccess: (_, deletedId) => {
      // Удаляем жанр из кэша
      queryClient.removeQueries({ queryKey: yearKeys.detail(deletedId) });
      // Обновляем кэш списка жанров
      queryClient.invalidateQueries({ queryKey: yearKeys.lists() });
    },
    onError: (error) => {
      console.error("Ошибка при удалении года:", error);
    },
  });

  return {
    // Данные
    years: yearsQuery.data || [],
    isLoading: yearsQuery.isLoading,
    isError: yearsQuery.isError,
    error: yearsQuery.error,

    // Функции для работы с жанрами
    createYear: createYearMutation.mutate,
    updateYear: updateYearMutation.mutate,
    deleteYear: deleteYearMutation.mutate,

    // Состояния загрузки
    isCreating: createYearMutation.isPending,
    isUpdating: updateYearMutation.isPending,
    isDeleting: deleteYearMutation.isPending,

    // Ошибки
    createError: createYearMutation.error,
    updateError: updateYearMutation.error,
    deleteError: deleteYearMutation.error,
  };
};
