import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { AppError } from '../errors/AppError.js';

const isSecure = process.env.COOKIE_SECURE === 'true';
const sameSite = (process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none') || 'lax';

function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite,
    maxAge: 15 * 60 * 1000, // 15 min
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
  });
}

function clearAuthCookies(res: Response) {
  res.clearCookie('accessToken', { httpOnly: true, secure: isSecure, sameSite });
  res.clearCookie('refreshToken', { httpOnly: true, secure: isSecure, sameSite });
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const body = registerSchema.parse(req.body);
    const result = await authService.register(body);
    setAuthCookies(res, result.accessToken, result.refreshToken);
    res.status(201).json({
      status: 'success',
      data: { user: result.user },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const body = loginSchema.parse(req.body);
    const result = await authService.login(body);
    setAuthCookies(res, result.accessToken, result.refreshToken);
    res.json({
      status: 'success',
      data: { user: result.user },
    });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError(401, 'No autenticado');
    }
    const user = await authService.getMe(req.user.id);
    res.json({ status: 'success', data: { user } });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      throw new AppError(401, 'Refresh token no encontrado');
    }
    const result = await authService.refresh(token);
    setAuthCookies(res, result.accessToken, result.refreshToken);
    res.json({ status: 'success', message: 'Tokens renovados' });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user) {
      await authService.logout(req.user.id);
    }
    clearAuthCookies(res);
    res.json({ status: 'success', message: 'Sesión cerrada' });
  } catch (err) {
    next(err);
  }
}
