import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";

const app = express();

// 🚀 Lista estricta de dominios permitidos leídos del .env
const allowedOrigins = [
  process.env.FRONTEND_URL_DEV,
  process.env.FRONTEND_URL_PREVIEW,
  process.env.FRONTEND_URL_PROD,
].filter(Boolean);

// --- Middlewares ---
app.use(helmet());

// 🛡️ CORS a prueba de balas (Nivel Producción)
app.use(
  cors({
    origin: function (origin, callback) {
      // 1. Permitir peticiones sin 'origin' (como Postman o curl para tus pruebas)
      if (!origin) return callback(null, true);

      // 2. Verificar si el origen está en nuestra lista VIP
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // 3. Si falla, registramos exactamente qué URL intentó entrar (¡Arma secreta para debuggear en Render!)
        console.error(`🚨 CORS bloqueó la petición desde: ${origin}`);
        callback(new Error("Acceso denegado por CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true, // Importante si en el futuro manejas cookies o sesiones
  })
);

app.use(morgan("dev"));
app.use(express.json());

// --- Rutas ---
app.get("/", (req, res) => {
  res.json({ message: "API Gamer Forever v2.0 - Sistemas en línea y protegidos 🟢" });
});

// 👇 Magia de rutas
app.use("/api", routes);

export default app;