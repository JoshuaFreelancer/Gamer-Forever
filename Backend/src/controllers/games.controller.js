import axios from "axios";
import NodeCache from "node-cache";

// Inicializamos la caché
const cache = new NodeCache({ stdTTL: 3600 });

// --- 1. FUNCIÓN ORIGINAL: OBTENER LISTA DE JUEGOS ---
export const getGames = async (req, res) => {
  try {
    const cacheKey = req.originalUrl;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    const params = new URLSearchParams({
      key: process.env.RAWG_API_KEY,
      ...req.query,
    });

    const response = await axios.get(`${process.env.RAWG_BASE_URL}/games`, {
      params,
    });

    cache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener juegos", details: error.message });
  }
};

// --- 2. NUEVA FUNCIÓN: OBTENER DETALLES COMBINADOS ---
export const getGameDetailsCombined = async (req, res) => {
  const { id } = req.params;
  const cacheKey = `/api/games/details/${id}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) return res.json(cachedData);

  try {
    const params = new URLSearchParams({ key: process.env.RAWG_API_KEY });
    const baseUrl = process.env.RAWG_BASE_URL;

    // EL BACKEND HACE EL TRABAJO SUCIO
    const [detailsRes, screenshotsRes, moviesRes] = await Promise.allSettled([
      axios.get(`${baseUrl}/games/${id}?${params}`),
      axios.get(`${baseUrl}/games/${id}/screenshots?${params}`),
      axios.get(`${baseUrl}/games/${id}/movies?${params}`),
    ]);

    if (detailsRes.status === "rejected") {
      return res.status(404).json({ error: "Juego no encontrado" });
    }

    // Empaquetamos todo en un solo JSON
    const combinedData = {
      ...detailsRes.value.data,
      extraScreenshots:
        screenshotsRes.status === "fulfilled"
          ? screenshotsRes.value.data.results
          : [],
      extraMovies:
        moviesRes.status === "fulfilled" ? moviesRes.value.data.results : [],
    };

    cache.set(cacheKey, combinedData); // Lo guardamos en RAM del servidor
    res.json(combinedData);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener detalles del juego" });
  }
};

export const getCollection = async (req, res) => {
  try {
    // Extraemos la colección dinámica de la URL (ej: 'genres', 'platforms')
    const { endpoint } = req.params;
    const cacheKey = req.originalUrl;
    const cachedData = cache.get(cacheKey);

    if (cachedData) return res.json(cachedData);

    const params = new URLSearchParams({
      key: process.env.RAWG_API_KEY,
      ...req.query,
    });

    // Petición dinámica a RAWG
    const response = await axios.get(
      `${process.env.RAWG_BASE_URL}/${endpoint}`,
      { params },
    );

    cache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error al obtener la colección: ${req.params.endpoint}` });
  }
};
