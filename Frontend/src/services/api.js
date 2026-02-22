import axios from './axios'; 

const API = {
  getGames: async (params = {}) => {
    const response = await axios.get('/games', { params });
    return response.data;
  },

  getPopularGames: async () => {
    const params = {
      ordering: '-added', 
      page_size: 5,       
      dates: '2023-01-01,2025-12-31' 
    };
    const response = await axios.get('/games', { params });
    return response.data.results; 
  },

  getGameDetails: async (id) => {
    const response = await axios.get(`/games/details/${id}`); 
    return response.data;
  },

  // 🚀 CORRECCIÓN: Ahora apuntamos al nuevo puente universal de nuestro backend
  getCollection: async (endpoint, params = {}) => {
    const response = await axios.get(`/games/collection/${endpoint}`, { params });
    return response.data;
  }
};

export default API;