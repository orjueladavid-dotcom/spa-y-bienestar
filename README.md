# 🌿 Spay Bienestar — API REST (Semana 08: Autorización y Seguridad)

Proyecto del bootcamp **bc-expressjs**. API REST segura con **RBAC**, **Helmet**, **CORS**, **rate limiting** y **sanitización** contra NoSQL injection.

## 🎯 Dominio

- **Dominio:** Spay Bienestar
- **Recursos:** Treatment (principal), Category (secundaria), User (auth)
- **Roles:** `user` | `admin`

## 🔐 Tabla de roles y permisos

| Acción | user | admin |
|--------|------|-------|
| Register / Login | ✅ | ✅ |
| GET treatments / categories | ✅ | ✅ |
| POST / PUT treatments / categories | ✅ | ✅ |
| DELETE treatments / categories | ❌ | ✅ |
| GET /auth/me | ✅ | ✅ |
| Logout / Refresh | ✅ | ✅ |

## 🛡️ Capas de seguridad

| Capa | Tecnología | Qué protege |
|------|------------|-------------|
| Headers HTTP | **Helmet** | XSS, clickjacking, MIME sniffing, HSTS |
| CORS | **cors** con whitelist | Orígenes no autorizados |
| Rate limit general | **express-rate-limit** (200/15min) | Abuso de API |
| Rate limit auth | **express-rate-limit** (20/15min) | Brute force en login/register |
| Sanitización | **express-mongo-sanitize** | NoSQL injection (`$gt`, `$ne`…) |
| Auth | JWT + cookies HttpOnly | Identidad |
| Authz (RBAC) | `requireRole('admin')` | Permisos por rol |

## 📊 Endpoints

### Auth

| Método | Ruta | Acceso |
|--------|------|--------|
| POST | `/api/v1/auth/register` | Público (rate limit) |
| POST | `/api/v1/auth/login` | Público (rate limit) |
| GET | `/api/v1/auth/me` | Autenticado |
| POST | `/api/v1/auth/refresh` | Cookie refresh |
| POST | `/api/v1/auth/logout` | Autenticado |

### Categories / Treatments

| Método | Ruta | Acceso |
|--------|------|--------|
| GET | `/api/v1/categories` · `/treatments` | Autenticado |
| GET | `.../:id` | Autenticado |
| POST | `...` | Autenticado |
| PUT | `.../:id` | Autenticado |
| DELETE | `.../:id` | **Solo admin** |

## 🚀 Cómo ejecutarlo

```bash
docker compose up -d
pnpm install
cp .env.example .env
pnpm seed
pnpm dev
```

**Usuarios del seed:**
| Email | Password | Rol |
|-------|----------|-----|
| `admin@spaybienestar.com` | `Admin123!` | admin |
| (puedes registrar más con POST /auth/register) | | user |

## 🧪 Pruebas de seguridad

1. **Headers Helmet** — inspeccionar respuesta de cualquier endpoint:
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: SAMEORIGIN`
   - `Content-Security-Policy: ...`

2. **Rate limit auth** — hacer >20 POST `/auth/login` en 15 min → **429**

3. **RBAC**:
   - Login como `user` → DELETE treatment → **403**
   - Login como `admin` → DELETE treatment → **204**
   - Sin cookie → cualquier ruta protegida → **401**

4. **CORS** — request desde origen no listado en `CORS_ORIGINS` → bloqueado

5. **NoSQL injection** — body con `{ "email": { "$gt": "" } }` → sanitizado, no funciona

## 📸 Capturas requeridas

- Header `X-Content-Type-Options: nosniff`
- 429 al superar rate limit en auth
- 401 sin token
- 403 con rol `user` en DELETE
- 200/204 con rol `admin` en DELETE
- CRUD completo de treatments
