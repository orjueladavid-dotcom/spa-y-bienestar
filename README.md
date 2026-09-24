# 🌿 Spay Bienestar — API REST (Semana 09: Testing)

Proyecto del bootcamp **bc-expressjs**. Suite de tests con **Jest + Supertest + mongodb-memory-server**.

## 🎯 Dominio

- **Dominio:** Spay Bienestar
- **Recursos:** Treatment, Category, User
- **Roles:** `user` | `admin`

## 🧪 Tests incluidos

| Archivo | Tipo | Qué cubre |
|---------|------|-----------|
| `auth.service.test.ts` | Unit | register, login, getMe, logout, refresh (mocks) |
| `treatment.service.test.ts` | Unit | getAll, getById, create, update, remove (mocks) |
| `auth.routes.test.ts` | Integration | register, login, me, logout + cookies |
| `treatment.routes.test.ts` | Integration | CRUD + 401/403/404 + RBAC admin |

## 🚀 Cómo ejecutarlo

```bash
# Instalar (incluye jest, supertest, mongodb-memory-server)
pnpm install

# Correr todos los tests
pnpm test

# Con cobertura
pnpm test:coverage

# Watch mode
pnpm test:watch
```

**No necesitas Docker ni Mongo real** — los integration tests usan `mongodb-memory-server`.

## 📊 Umbral de cobertura (jest.config.ts)

```
statements : 70%
branches   : 60%
functions  : 70%
lines      : 70%
```

## 📁 Estructura de tests

```
src/__tests__/
├── setup.ts                    # MongoMemoryServer + helpers
├── auth.service.test.ts        # Unit — auth
├── treatment.service.test.ts   # Unit — treatments
├── auth.routes.test.ts         # Integration — /auth
└── treatment.routes.test.ts    # Integration — /treatments + RBAC
```

## 🔐 Seguridad (heredada de semana 08)

- Helmet, CORS whitelist, rate limiting, mongo-sanitize
- JWT + cookies HttpOnly
- RBAC: DELETE solo admin

## 👤 Seed (opcional, para desarrollo manual)

```bash
docker compose up -d
pnpm seed
pnpm dev
```

| Email | Password | Rol |
|-------|----------|-----|
| admin@spaybienestar.com | Admin123! | admin |
| user@spaybienestar.com | User1234! | user |
