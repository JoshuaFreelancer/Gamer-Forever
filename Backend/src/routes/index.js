import { Router } from 'express';
import gamesRoutes from './games.routes.js';

const router = Router();

// Aquí defines las sub-rutas.
// Si alguien entra a /games, lo mandamos al archivo de juegos.
router.use('/games', gamesRoutes);

// Ejemplo futuro:
// router.use('/users', usersRoutes);
// router.use('/auth', authRoutes);

export default router;