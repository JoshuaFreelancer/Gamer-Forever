import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";

const app = express();

// 🚀 Creamos una lista dinámica leyendo del .env
// El .filter(Boolean) es un truco para ignorar las variables que estén vacías
const allowedOrigins = [
  process.env.FRONTEND_URL_DEV,
  process.env.FRONTEND_URL_PREVIEW,
  process.env.FRONTEND_URL_PROD,
].filter(Boolean);

// --- Middlewares ---
app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
  }),
);
app.use(morgan("dev"));
app.use(express.json());

// --- Rutas ---
app.get("/", (req, res) => {
  res.json({ message: "API Gamer Forever v1.0" });
});

// 👇 Aquí está la magia. Todo lo que venga con /api se va a tus rutas
app.use("/api", routes);

export default app;
