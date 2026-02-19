import axios from './axios'; // Importamos la instancia configurada

const API = {
  /**
   * Obtener juegos con parámetros (page, search, genres, etc.)
   * CORRECCIÓN: Renombrado a 'getGamesWithParams' para coincidir con SearchBar.jsx
   */
  getGamesWithParams: async (params = {}) => {
    // Axios se encarga de serializar el objeto params en la URL (ej: /games?search=mario&page_size=5)
    const response = await axios.get('/games', { params });
    return response.data;
  },

  /**
   * Obtener juegos populares (Top 5)
   */
  getPopularGames: async () => {
    const params = {
      ordering: '-added', 
      page_size: 5,       
      dates: '2023-01-01,2025-12-31' 
    };

    const response = await axios.get('/games', { params });
    return response.data.results; 
  },

  /**
   * Obtener detalles de un juego por ID
   */
  getGameDetails: async (id) => {
    const response = await axios.get(`/games/${id}`);
    return response.data;
  }
};

export default API;