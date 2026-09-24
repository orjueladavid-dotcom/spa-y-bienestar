import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from '../errors/AppError.js';

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.accessToken;

  if (!token) {
    next(new AppError(401, 'No autenticado. Debes iniciar sesión'));
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch (err) {
    next(err);
  }
}
