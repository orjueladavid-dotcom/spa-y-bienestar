import { app } from './app.js';
import { logger } from './config/logger.js';

const PORT = Number(process.env['PORT']) || 3000;

const server = app.listen(PORT, () => {
  logger.info(`🌿 Spay Bienestar API (Semana 04) en http://localhost:${PORT}`);
  logger.info(`   Entorno: ${process.env['NODE_ENV'] ?? 'development'}`);
});

function shutdown(signal: string): void {
  logger.info(`${signal} recibido. Cerrando servidor...`);
  server.close(() => {
    logger.info('Servidor cerrado correctamente.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
