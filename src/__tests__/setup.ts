// src/__tests__/setup.ts — MongoDB Memory Server + helpers

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app.js';
import request from 'supertest';

let mongoServer: MongoMemoryServer;

export async function setupTestDB() {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}

export async function teardownTestDB() {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
}

export async function clearDB() {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
}

/** Helper: registrar y loguear, devolver agent con cookies */
export async function loginAs(
  email: string,
  password: string,
  name = 'Test User',
  role: 'user' | 'admin' = 'user',
) {
  // Register
  await request(app)
    .post('/api/v1/auth/register')
    .send({ name, email, password });

  // Si queremos admin, actualizamos el rol directamente
  if (role === 'admin') {
    const { User } = await import('../models/user.model.js');
    await User.updateOne({ email }, { role: 'admin' });
  }

  // Login
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ email, password });

  const cookies = res.headers['set-cookie'] as string[] | undefined;
  return { res, cookies: cookies ?? [] };
}

export { app, request };
