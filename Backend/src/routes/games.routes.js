import { Router } from 'express';
import { getGames } from '../controllers/games.controller.js'; // Vamos a hacerlo bien con controlador

const router = Router();

// Esta ruta responderá a: /api/games/
router.get('/', getGames); 

// Esta responderá a: /api/games/:id
// router.get('/:id', getGameDetails);

export default router;