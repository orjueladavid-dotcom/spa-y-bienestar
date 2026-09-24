// src/middlewares/notFound.ts — Rutas inexistentes → 404 en JSON (no HTML)

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(404, `Ruta ${req.method} ${req.originalUrl} no encontrada`));
}
