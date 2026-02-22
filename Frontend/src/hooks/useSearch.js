// src/hooks/useSearch.js
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import API from "../services/api"; // 🚀 Todo pasa por tu servidor ahora

// --- 1. HOOK: PREVISUALIZACIÓN RÁPIDA (Para el SearchBar del NavBar) ---
export const useSearchPreview = (debouncedQuery) => {
  return useQuery({
    queryKey: ["searchPreview", debouncedQuery],
    queryFn: async () => {
      // Reutilizamos el endpoint general pasándole el parámetro de búsqueda
      const response = await API.getGames({
        search: debouncedQuery,
        page_size: 5,
      });
      return response.results || [];
    },
    enabled: debouncedQuery.trim().length > 0, // Solo se ejecuta si hay texto
    staleTime: 1000 * 60 * 5, // 5 minutos de caché
  });
};

// --- 2. HOOK: PÁGINA COMPLETA DE RESULTADOS (/search) ---
export const useSearchResults = (filters) => {
  return useQuery({
    queryKey: ["searchResults", filters],
    queryFn: () => {
      // Mapeamos los filtros del frontend a los parámetros exactos de RAWG
      const params = {
        page_size: 12,
        page: filters.page || 1,
        // Usamos el spread operator y cortocircuitos lógicos para agregar propiedades
        // solo si existen, evitando enviar "search=undefined" a la API
        ...(filters.query && { search: filters.query }),
        ...(filters.sort && { ordering: filters.sort }),
        ...(filters.platforms && { platforms: filters.platforms }),
        ...(filters.genres && { genres: filters.genres }),
        ...(filters.developers && { developers: filters.developers }),
      };

      return API.getGames(params);
    },
    placeholderData: keepPreviousData, // Evita que la pantalla parpadee al cambiar de página o filtro
    staleTime: 1000 * 60 * 5, // 5 minutos de caché
  });
};
