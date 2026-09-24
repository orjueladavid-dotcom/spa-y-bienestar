import express, { type Request, type Response, type NextFunction } from 'express';
import treatmentsRouter from './routes/treatments.routes.js';

const app = express();

app.use(express.json());

// Logger personalizado
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`);
  });
  next();
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/treatments', treatmentsRouter);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found', message: 'Ruta no encontrada' });
});

// Error handler global
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error no controlado:', err.message);
  res.status(500).json({ error: 'Internal Server Error', message: 'Error interno del servidor' });
});

export { app };
