/**
 * Unit tests — auth.service.ts
 * Aislados con mocks de user.repository y bcrypt/jwt
 */

import { AppError } from '../errors/AppError.js';

// Mocks ANTES de importar el service
jest.mock('../repositories/user.repository.js', () => ({
  findByEmail: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  updateRefreshTokenHash: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn(),
}));

jest.mock('../utils/jwt.js', () => ({
  signAccessToken: jest.fn().mockReturnValue('access_token'),
  signRefreshToken: jest.fn().mockReturnValue('refresh_token'),
  verifyRefreshToken: jest.fn(),
}));

import * as userRepo from '../repositories/user.repository.js';
import bcrypt from 'bcrypt';
import * as jwt from '../utils/jwt.js';
import * as authService from '../services/auth.service.js';

const mockUser = {
  _id: '507f1f77bcf86cd799439011',
  name: 'David',
  email: 'david@test.com',
  password: 'hashed_password',
  role: 'user',
  refreshTokenHash: 'hashed_refresh',
};

describe('AuthService (unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── register ──────────────────────────────────────────────────────
  describe('register', () => {
    it('crea un usuario y devuelve tokens', async () => {
      (userRepo.findByEmail as jest.Mock).mockResolvedValue(null);
      (userRepo.create as jest.Mock).mockResolvedValue(mockUser);
      (userRepo.updateRefreshTokenHash as jest.Mock).mockResolvedValue(undefined);

      const result = await authService.register({
        name: 'David',
        email: 'david@test.com',
        password: 'Password123',
      });

      expect(userRepo.create).toHaveBeenCalled();
      expect(result.user.email).toBe('david@test.com');
      expect(result.accessToken).toBe('access_token');
      expect(result.refreshToken).toBe('refresh_token');
    });

    it('lanza 409 si el email ya existe', async () => {
      (userRepo.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        authService.register({
          name: 'David',
          email: 'david@test.com',
          password: 'Password123',
        }),
      ).rejects.toMatchObject({ statusCode: 409 });
    });
  });

  // ── login ─────────────────────────────────────────────────────────
  describe('login', () => {
    it('devuelve tokens con credenciales válidas', async () => {
      (userRepo.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (userRepo.updateRefreshTokenHash as jest.Mock).mockResolvedValue(undefined);

      const result = await authService.login({
        email: 'david@test.com',
        password: 'Password123',
      });

      expect(result.user.email).toBe('david@test.com');
      expect(result.accessToken).toBe('access_token');
    });

    it('lanza 401 con email inexistente', async () => {
      (userRepo.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.login({ email: 'no@test.com', password: 'x' }),
      ).rejects.toMatchObject({ statusCode: 401 });
    });

    it('lanza 401 con contraseña incorrecta', async () => {
      (userRepo.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({ email: 'david@test.com', password: 'wrong' }),
      ).rejects.toMatchObject({ statusCode: 401 });
    });
  });

  // ── getMe ─────────────────────────────────────────────────────────
  describe('getMe', () => {
    it('devuelve el usuario', async () => {
      (userRepo.findById as jest.Mock).mockResolvedValue(mockUser);

      const user = await authService.getMe(mockUser._id);
      expect(user.email).toBe('david@test.com');
    });

    it('lanza 404 si no existe', async () => {
      (userRepo.findById as jest.Mock).mockResolvedValue(null);

      await expect(authService.getMe('nonexistent')).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  // ── logout ────────────────────────────────────────────────────────
  describe('logout', () => {
    it('invalida el refresh token hash', async () => {
      (userRepo.updateRefreshTokenHash as jest.Mock).mockResolvedValue(undefined);

      await authService.logout(mockUser._id);
      expect(userRepo.updateRefreshTokenHash).toHaveBeenCalledWith(mockUser._id, null);
    });
  });

  // ── refresh ───────────────────────────────────────────────────────
  describe('refresh', () => {
    it('renueva tokens con refresh válido', async () => {
      (jwt.verifyRefreshToken as jest.Mock).mockReturnValue({
        id: mockUser._id,
        email: mockUser.email,
        role: mockUser.role,
      });
      (userRepo.findById as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (userRepo.updateRefreshTokenHash as jest.Mock).mockResolvedValue(undefined);

      const result = await authService.refresh('valid_refresh_token');
      expect(result.accessToken).toBe('access_token');
      expect(result.refreshToken).toBe('refresh_token');
    });

    it('lanza 401 si no hay hash en DB', async () => {
      (jwt.verifyRefreshToken as jest.Mock).mockReturnValue({
        id: mockUser._id,
        email: mockUser.email,
        role: mockUser.role,
      });
      (userRepo.findById as jest.Mock).mockResolvedValue({
        ...mockUser,
        refreshTokenHash: null,
      });

      await expect(authService.refresh('token')).rejects.toMatchObject({
        statusCode: 401,
      });
    });
  });
});
