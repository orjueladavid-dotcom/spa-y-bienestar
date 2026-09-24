import bcrypt from 'bcrypt';
import * as userRepo from '../repositories/user.repository.js';
import { AppError } from '../errors/AppError.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  type TokenPayload,
} from '../utils/jwt.js';
import type { RegisterDto, LoginDto } from '../schemas/auth.schema.js';

const SALT_ROUNDS = 10;

function toPayload(user: { _id: unknown; email: string; role: string }): TokenPayload {
  return {
    id: String(user._id),
    email: user.email,
    role: user.role,
  };
}

export async function register(data: RegisterDto) {
  const existing = await userRepo.findByEmail(data.email);
  if (existing) {
    // Prevenir user enumeration: mismo mensaje genérico
    throw new AppError(409, 'No se pudo completar el registro');
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
  const user = await userRepo.create({
    ...data,
    password: hashedPassword,
  });

  const payload = toPayload(user);
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const refreshHash = await bcrypt.hash(refreshToken, SALT_ROUNDS);
  await userRepo.updateRefreshTokenHash(String(user._id), refreshHash);

  return {
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
}

export async function login(data: LoginDto) {
  const user = await userRepo.findByEmail(data.email, true);
  if (!user || !user.password) {
    throw new AppError(401, 'Credenciales inválidas');
  }

  const valid = await bcrypt.compare(data.password, user.password);
  if (!valid) {
    throw new AppError(401, 'Credenciales inválidas');
  }

  const payload = toPayload(user);
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const refreshHash = await bcrypt.hash(refreshToken, SALT_ROUNDS);
  await userRepo.updateRefreshTokenHash(String(user._id), refreshHash);

  return {
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
}

export async function refresh(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);

  const user = await userRepo.findById(payload.id, true);
  if (!user || !user.refreshTokenHash) {
    throw new AppError(401, 'Refresh token inválido');
  }

  const valid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
  if (!valid) {
    // Posible reuso → invalidar
    await userRepo.updateRefreshTokenHash(payload.id, null);
    throw new AppError(401, 'Refresh token inválido');
  }

  const newPayload = toPayload(user);
  const newAccessToken = signAccessToken(newPayload);
  const newRefreshToken = signRefreshToken(newPayload);

  // Rotación: invalidar el anterior
  const newHash = await bcrypt.hash(newRefreshToken, SALT_ROUNDS);
  await userRepo.updateRefreshTokenHash(payload.id, newHash);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

export async function logout(userId: string) {
  await userRepo.updateRefreshTokenHash(userId, null);
}

export async function getMe(userId: string) {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new AppError(404, 'Usuario no encontrado');
  }
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
