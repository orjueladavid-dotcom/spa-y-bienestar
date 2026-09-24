// src/server.ts — Entry point
// dotenv debe cargarse PRIMERO para que logger y Prisma vean las variables de entorno.

import 'dotenv/config';
import { app } from './app';
import { logger } from './config/logger';
import { prisma } from './lib/prisma';

const PORT = Number(process.env['PORT']) || 3000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Spay Bienestar API en http://localhost:${PORT}`);
  logger.info(`📘 Entorno: ${process.env['NODE_ENV'] ?? 'development'}`);
});

async function shutdown(signal: string): Promise<void> {
  logger.info(`${signal} recibido, cerrando servidor...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));
