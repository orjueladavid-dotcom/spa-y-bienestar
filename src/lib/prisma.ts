// src/lib/prisma.ts — Singleton de PrismaClient
// Evita crear varias conexiones cuando el servidor se recarga en desarrollo (tsx watch).

import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env['NODE_ENV'] === 'production' ? ['warn', 'error'] : ['query', 'warn', 'error'],
  });

if (process.env['NODE_ENV'] !== 'production') {
  globalForPrisma.prisma = prisma;
}
