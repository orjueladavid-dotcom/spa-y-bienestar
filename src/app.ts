import express from 'express';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import { morganMiddleware } from './config/logger.js';
import {
  helmetMiddleware,
  corsMiddleware,
  generalLimiter,
} from './config/security.js';
import authRouter from './routes/auth.routes.js';
import categoryRouter from './routes/category.routes.js';
import treatmentRouter from './routes/treatment.routes.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// ── Capas de seguridad (orden importante) ──────────────────────────
app.use(helmetMiddleware);          // Headers de seguridad
app.use(corsMiddleware);            // CORS con whitelist
app.use(generalLimiter);            // Rate limit general
app.use(morganMiddleware);
app.use(express.json({ limit: '10kb' })); // Limitar tamaño body
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());           // Prevenir NoSQL injection ($gt, $ne, etc.)

// ── Health ─────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Rutas ──────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/treatments', treatmentRouter);

// ── Errores ────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export { app };
