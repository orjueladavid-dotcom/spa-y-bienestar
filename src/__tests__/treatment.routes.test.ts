/**
 * Integration tests — /api/v1/treatments
 * Supertest + MongoDB Memory Server + RBAC
 */

import { setupTestDB, teardownTestDB, clearDB, app, request, loginAs } from './setup.js';
import { Category } from '../models/category.model.js';

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

async function createCategory() {
  const cat = await Category.create({
    name: 'Masajes',
    description: 'Masajes terapéuticos',
  });
  return cat;
}

describe('Treatment routes (integration)', () => {
  it('GET /api/v1/treatments → 401 sin token', async () => {
    const res = await request(app).get('/api/v1/treatments');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/treatments → 200 con array (auth)', async () => {
    const { cookies } = await loginAs('user@test.com', 'Password123');
    const res = await request(app)
      .get('/api/v1/treatments')
      .set('Cookie', cookies);

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.total).toBe(0);
  });

  it('POST /api/v1/treatments → 201 con datos válidos', async () => {
    const { cookies } = await loginAs('user@test.com', 'Password123');
    const cat = await createCategory();

    const res = await request(app)
      .post('/api/v1/treatments')
      .set('Cookie', cookies)
      .send({
        name: 'Masaje relajante',
        price: 120000,
        duration: 60,
        category: String(cat._id),
        available: true,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Masaje relajante');
  });

  it('POST /api/v1/treatments → 400 con datos inválidos (Zod)', async () => {
    const { cookies } = await loginAs('user@test.com', 'Password123');

    const res = await request(app)
      .post('/api/v1/treatments')
      .set('Cookie', cookies)
      .send({ name: 'X', price: -10 });

    expect(res.status).toBe(400);
  });

  it('POST /api/v1/treatments → 401 sin token', async () => {
    const res = await request(app)
      .post('/api/v1/treatments')
      .send({ name: 'Masaje', price: 100, duration: 30, category: '507f1f77bcf86cd799439011' });

    expect(res.status).toBe(401);
  });

  it('GET /api/v1/treatments/:id → 200 con tratamiento existente', async () => {
    const { cookies } = await loginAs('user@test.com', 'Password123');
    const cat = await createCategory();

    const created = await request(app)
      .post('/api/v1/treatments')
      .set('Cookie', cookies)
      .send({
        name: 'Facial antiedad',
        price: 180000,
        duration: 90,
        category: String(cat._id),
      });

    const id = created.body.data._id;

    const res = await request(app)
      .get(`/api/v1/treatments/${id}`)
      .set('Cookie', cookies);

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Facial antiedad');
  });

  it('GET /api/v1/treatments/:id → 404 con ID inexistente', async () => {
    const { cookies } = await loginAs('user@test.com', 'Password123');

    const res = await request(app)
      .get('/api/v1/treatments/507f1f77bcf86cd799439099')
      .set('Cookie', cookies);

    expect(res.status).toBe(404);
  });

  it('PUT /api/v1/treatments/:id → 200 actualiza', async () => {
    const { cookies } = await loginAs('user@test.com', 'Password123');
    const cat = await createCategory();

    const created = await request(app)
      .post('/api/v1/treatments')
      .set('Cookie', cookies)
      .send({
        name: 'Masaje profundo',
        price: 100000,
        duration: 45,
        category: String(cat._id),
      });

    const id = created.body.data._id;

    const res = await request(app)
      .put(`/api/v1/treatments/${id}`)
      .set('Cookie', cookies)
      .send({ price: 130000 });

    expect(res.status).toBe(200);
    expect(res.body.data.price).toBe(130000);
  });

  it('DELETE /api/v1/treatments/:id → 403 si no es admin', async () => {
    const { cookies } = await loginAs('user@test.com', 'Password123', 'User Demo', 'user');
    const cat = await createCategory();

    const created = await request(app)
      .post('/api/v1/treatments')
      .set('Cookie', cookies)
      .send({
        name: 'Aromaterapia',
        price: 70000,
        duration: 40,
        category: String(cat._id),
      });

    const id = created.body.data._id;

    const res = await request(app)
      .delete(`/api/v1/treatments/${id}`)
      .set('Cookie', cookies);

    expect(res.status).toBe(403);
  });

  it('DELETE /api/v1/treatments/:id → 204 si es admin', async () => {
    const { cookies } = await loginAs('admin@test.com', 'Admin1234!', 'Admin', 'admin');
    const cat = await createCategory();

    const created = await request(app)
      .post('/api/v1/treatments')
      .set('Cookie', cookies)
      .send({
        name: 'Hidroterapia',
        price: 85000,
        duration: 90,
        category: String(cat._id),
      });

    const id = created.body.data._id;

    const res = await request(app)
      .delete(`/api/v1/treatments/${id}`)
      .set('Cookie', cookies);

    expect(res.status).toBe(204);
  });
});
