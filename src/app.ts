import express, { type Request, type Response, type NextFunction } from 'express';
import treatmentsRouter from './routes/treatments.routes.js';

const app = express();

// 1. Parseo de body JSON
app.use(express.json());

// 2. Logger personalizado — método, URL, status y tiempo
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`);
  });

  next();
});

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 3. Rutas
app.use('/api/v1/treatments', treatmentsRouter);

// 4. Handler 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// 5. Error handler global (4 parámetros)
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error no controlado:', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

export { app };
