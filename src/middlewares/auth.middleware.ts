import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from '../errors/AppError.js';

/** Autenticación: verifica access token en cookie HttpOnly */
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

/**
 * Autorización RBAC: requiere que el usuario tenga uno de los roles indicados.
 * Debe usarse DESPUÉS de authMiddleware.
 *
 * Uso: requireRole('admin')  |  requireRole('admin', 'user')
 */
export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError(401, 'No autenticado'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new AppError(403, 'No tienes permiso para realizar esta acción'));
      return;
    }

    next();
  };
}
