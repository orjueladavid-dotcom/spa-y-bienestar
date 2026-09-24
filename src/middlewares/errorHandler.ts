import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';
import { logger } from '../config/logger.js';

function formatZodIssues(error: ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.map(String).join('.'),
    message: issue.message,
  }));
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // CORS error
  if (err instanceof Error && err.message.startsWith('Origen no permitido')) {
    res.status(403).json({ status: 'error', message: err.message });
    return;
  }

  if (err instanceof ZodError) {
    logger.warn(`400 ${req.method} ${req.originalUrl} - Validación fallida`);
    res.status(400).json({
      status: 'error',
      message: 'Datos inválidos',
      issues: formatZodIssues(err),
    });
    return;
  }

  if (err instanceof AppError) {
    logger.warn(`${err.statusCode} ${req.method} ${req.originalUrl} - ${err.message}`);
    res.status(err.statusCode).json({ status: 'error', message: err.message });
    return;
  }

  // En producción no exponer stack
  const isProd = process.env.NODE_ENV === 'production';
  logger.error(
    `500 ${req.method} ${req.originalUrl} - ${err instanceof Error ? (err.stack ?? err.message) : String(err)}`,
  );
  res.status(500).json({
    status: 'error',
    message: isProd ? 'Error interno del servidor' : (err instanceof Error ? err.message : 'Error interno'),
  });
}
