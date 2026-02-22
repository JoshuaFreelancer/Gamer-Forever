import { Router } from 'express';
// 🚀 Importamos AMBAS funciones del controlador
import { getGames, getGameDetailsCombined, getCollection } from '../controllers/games.controller.js'; 

const router = Router();

// Esta ruta responderá a: /api/games/ (Listados, búsquedas, géneros)
router.get('/', getGames); 

// Esta ruta responderá a: /api/games/details/:id (Los detalles combinados)
router.get('/details/:id', getGameDetailsCombined);

// 🚀 NUEVA RUTA DINÁMICA: Atrapa /api/games/collection/genres, /platforms, etc.
router.get('/collection/:endpoint', getCollection);

export default router;