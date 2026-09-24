// src/app.ts — Configuración de Express
// Orden importante: logging → parsers → rutas → notFound → errorHandler

import express from 'express';
import { morganMiddleware } from './config/logger';
import treatmentsRouter from './routes/treatments.routes';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(morganMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/treatments', treatmentsRouter);

app.use(notFound);
app.use(errorHandler);

export { app };
