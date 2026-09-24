// src/app.ts — Configuración de Express
// Orden: logging → parsers → rutas → notFound → errorHandler

import express from 'express';
import { morganMiddleware } from './config/logger.js';
import categoryRouter from './routes/category.routes.js';
import treatmentRouter from './routes/treatment.routes.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(morganMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/treatments', treatmentRouter);

app.use(notFound);
app.use(errorHandler);

export { app };
