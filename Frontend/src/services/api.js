import axios from './axios'; // Importamos la instancia configurada

const API = {
  /**
   * Obtener juegos con parámetros (page, search, genres, etc.)
   */
  getGames: async (params = {}) => {
    // Aquí SÍ dejamos el try/catch si queremos loguear el error específico en consola
    // pero si solo vas a hacer 'throw error', mejor quítalo. 
    // Para mantenerlo limpio, dejamos que el componente maneje el error:
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
   * CORRECCIÓN: Eliminado el try/catch inútil.
   */
  getGameDetails: async (id) => {
    const response = await axios.get(`/games/${id}`);
    return response.data;
  }
};

export default API;