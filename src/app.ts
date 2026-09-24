import express from 'express';
import { morganMiddleware } from './config/logger.js';
import treatmentsRouter from './routes/treatments.routes.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Orden: logging → parsers → rutas → notFound → errorHandler
app.use(morganMiddleware);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/treatments', treatmentsRouter);

app.use(notFound);
app.use(errorHandler);

export { app };
