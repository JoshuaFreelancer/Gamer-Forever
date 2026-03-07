// src/hooks/useInfiniteCollection.js
import { useInfiniteQuery } from "@tanstack/react-query";
import API from "../services/api";

/**
 * Hook maestro para scroll infinito.
 * @param {string} endpoint - 'genres', 'platforms', o 'developers'
 * @param {string} queryKey - Nombre para la caché (ej: 'genresList')
 * @param {number} pageSize - Cantidad de items por página
 * @param {string} searchTerm - (Opcional) Término de búsqueda para filtrar desde el backend
 */
export const useInfiniteCollection = (
  endpoint,
  queryKey,
  pageSize = 24,
  searchTerm = "",
) => {
  return useInfiniteQuery({
    // 🚀 MAGIA DE CACHÉ: Añadimos `searchTerm` al arreglo.
    // Así, la búsqueda vacía ("") tiene una caché, y buscar "sony" crea otra caché independiente.
    queryKey: [queryKey, endpoint, pageSize, searchTerm],

    queryFn: ({ pageParam = 1 }) => {
      // 🚀 Construimos los parámetros base
      const params = {
        ordering: "-games_count",
        page_size: pageSize,
        page: pageParam,
      };

      // 🚀 Si el usuario escribió algo, inyectamos el parámetro 'search' para la API de RAWG
      if (searchTerm) {
        params.search = searchTerm;
      }

      return API.getCollection(endpoint, params);
    },

    getNextPageParam: (lastPage, allPages) => {
      return lastPage.next ? allPages.length + 1 : undefined;
    },
    staleTime: Infinity,
  });
};
