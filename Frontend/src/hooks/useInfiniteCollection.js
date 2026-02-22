// src/hooks/useInfiniteCollection.js
import { useInfiniteQuery } from "@tanstack/react-query";
import API from "../services/api";

/**
 * Hook maestro para scroll infinito.
 * @param {string} endpoint - 'genres', 'platforms', o 'developers'
 * @param {string} queryKey - Nombre para la caché (ej: 'genresList')
 * @param {number} pageSize - Cantidad de items por página
 */
export const useInfiniteCollection = (endpoint, queryKey, pageSize = 24) => {
  return useInfiniteQuery({
    queryKey: [queryKey, endpoint, pageSize],
    queryFn: ({ pageParam = 1 }) =>
      API.getCollection(endpoint, {
        ordering: "-games_count",
        page_size: pageSize,
        page: pageParam,
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.next ? allPages.length + 1 : undefined;
    },
    staleTime: Infinity, // Tu backend ya tiene NodeCache, pero esto evita que React vuelva a pedir.
  });
};
