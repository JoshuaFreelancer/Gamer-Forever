// Backend/src/controllers/games.controller.js
import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 });

export const getGames = async (req, res) => {
  try {
    const cacheKey = req.originalUrl;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    const params = new URLSearchParams({
      key: process.env.RAWG_API_KEY,
      ...req.query
    });

    const response = await axios.get(`${process.env.RAWG_BASE_URL}/games`, { params });
    
    cache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener juegos', details: error.message });
  }
};