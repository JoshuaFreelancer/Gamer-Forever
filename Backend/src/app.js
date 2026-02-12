import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';

const app = express();

// --- Middlewares ---
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(morgan('dev'));
app.use(express.json());

// --- Rutas ---
app.get('/', (req, res) => {
  res.json({ message: 'API Gamer Forever v1.0' });
});

// 👇 Aquí está la magia. Todo lo que venga con /api se va a tu index.js
app.use('/api', routes);

export default app;