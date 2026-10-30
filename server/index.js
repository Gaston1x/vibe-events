import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRouter from "./routes/auth.js";
import { config, validateEnvironment } from "./config.js";

validateEnvironment();

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin: config.clientOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: "30kb" }));
app.use(morgan("dev"));

app.use(
  "/api/auth/login",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Demasiados intentos de inicio de sesión. Espera 15 minutos." },
  }),
);

app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 80,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Demasiados intentos. Intenta de nuevo en unos minutos." },
  }),
  authRouter,
);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "vibe-events-api" });
});

app.use((_req, res) => {
  res.status(404).json({ message: "Ruta no encontrada." });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Error interno del servidor." });
});

app.listen(config.port, () => {
  console.log(`Vibe Events API listening on http://127.0.0.1:${config.port}`);
});
