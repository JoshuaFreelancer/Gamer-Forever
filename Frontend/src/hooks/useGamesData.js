// src/hooks/useGamesData.js
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import API from "../services/api"; // 🚀 Todo pasa por tu servidor Node.js ahora

// --- 1. HOOK: DETALLES DEL JUEGO ---
export const useGameDetails = (id) => {
  return useQuery({
    queryKey: ["gameDetailsData", id],
    queryFn: () => API.getGameDetails(id),
    staleTime: 1000 * 60 * 60 * 24, // 24 horas de caché (los datos históricos casi no cambian)
    enabled: !!id, // Solo se ejecuta si hay un ID válido
  });
};

// --- 2. HOOK: LISTADO DE JUEGOS PAGINADO ---
export const useGames = (page, pageSize = 9) => {
  return useQuery({
    queryKey: ["gamesList", page, pageSize],
    queryFn: () =>
      API.getGames({
        ordering: "-added",
        dates: "2023-01-01,2025-12-31",
        page_size: pageSize,
        page: page,
      }),
    placeholderData: keepPreviousData, // Evita parpadeos al cambiar de página
    staleTime: 1000 * 60 * 60, // 1 hora de caché
  });
};

// --- 3. HOOK: JUEGOS POPULARES (HERO) ---
export const usePopularGames = () => {
  return useQuery({
    queryKey: ["popularGames"],
    queryFn: API.getPopularGames,
    staleTime: 1000 * 60 * 10, // 10 minutos de caché, perfecto para destacados
  });
};
