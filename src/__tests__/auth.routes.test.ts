/**
 * Integration tests — /api/v1/auth
 * Supertest + MongoDB Memory Server
 */

import { setupTestDB, teardownTestDB, clearDB, app, request } from './setup.js';

beforeAll(async () => {
  process.env.JWT_ACCESS_SECRET = 'test_access_secret_min_32_chars_long_xxxxxx';
  process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_min_32_chars_long_xxxxx';
  process.env.JWT_ACCESS_EXPIRES_IN = '15m';
  process.env.JWT_REFRESH_EXPIRES_IN = '7d';
  process.env.COOKIE_SECURE = 'false';
  process.env.COOKIE_SAME_SITE = 'lax';
  process.env.CORS_ORIGINS = 'http://localhost:3000';
  process.env.NODE_ENV = 'test';
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

afterEach(async () => {
  await clearDB();
});

describe('Auth routes (integration)', () => {
  describe('POST /api/v1/auth/register', () => {
    it('201 — registra usuario válido', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'David',
          email: 'david@test.com',
          password: 'Password123',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.user.email).toBe('david@test.com');
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('400 — datos inválidos (Zod)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'A', email: 'not-email', password: '123' });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'David', email: 'david@test.com', password: 'Password123' });
    });

    it('200 — login correcto con cookies', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'david@test.com', password: 'Password123' });

      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe('david@test.com');
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('401 — credenciales incorrectas', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'david@test.com', password: 'wrong' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('200 — perfil del usuario autenticado', async () => {
      const register = await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'David', email: 'david@test.com', password: 'Password123' });

      const cookies = register.headers['set-cookie'] as string[];

      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Cookie', cookies);

      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe('david@test.com');
    });

    it('401 — sin cookie', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('200 — cierra sesión', async () => {
      const register = await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'David', email: 'david@test.com', password: 'Password123' });

      const cookies = register.headers['set-cookie'] as string[];

      const res = await request(app)
        .post('/api/v1/auth/logout')
        .set('Cookie', cookies);

      expect(res.status).toBe(200);
    });
  });
});
