// src/middlewares/errorHandler.ts — Manejo centralizado de errores
// IMPORTANTE: Express reconoce un error handler solo si la función tiene EXACTAMENTE 4 parámetros.

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';
import { logger } from '../config/logger';

export function formatZodIssues(error: ZodError): { path: string; message: string }[] {
  return error.issues.map((issue) => ({
    path: issue.path.map(String).join('.'),
    message: issue.message,
  }));
}

// JSON malformado en el body (lo lanza express.json())
function isBodyParseError(err: unknown): boolean {
  return typeof err === 'object' && err !== null && (err as { type?: string }).type === 'entity.parse.failed';
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    logger.warn(`400 ${req.method} ${req.originalUrl} - Validación fallida`);
    res.status(400).json({ status: 'error', message: 'Datos inválidos', issues: formatZodIssues(err) });
    return;
  }

  if (err instanceof AppError) {
    logger.warn(`${err.statusCode} ${req.method} ${req.originalUrl} - ${err.message}`);
    res.status(err.statusCode).json({ status: 'error', message: err.message });
    return;
  }

  if (isBodyParseError(err)) {
    logger.warn(`400 ${req.method} ${req.originalUrl} - JSON malformado`);
    res.status(400).json({ status: 'error', message: 'El cuerpo de la petición no es un JSON válido' });
    return;
  }

  logger.error(`500 ${req.method} ${req.originalUrl} - ${err instanceof Error ? (err.stack ?? err.message) : String(err)}`);
  res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
}
