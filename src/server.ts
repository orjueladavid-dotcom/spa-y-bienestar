import 'dotenv/config';
import { app } from './app.js';
import { connectDB } from './lib/mongoose.js';
import { logger } from './config/logger.js';

const PORT = Number(process.env.PORT) || 3000;

async function bootstrap() {
  await connectDB();

  const server = app.listen(PORT, () => {
    logger.info(`🌿 Spay Bienestar API (RBAC + Security) en http://localhost:${PORT}`);
  });

  const shutdown = (signal: string) => {
    logger.info(`${signal} recibido. Cerrando servidor...`);
    server.close(() => {
      logger.info('Servidor cerrado correctamente');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.error('Error al iniciar el servidor', err);
  process.exit(1);
});
