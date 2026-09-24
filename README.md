# 🌿 Spay Bienestar — API REST (Semana 07: Autenticación JWT)

Proyecto del bootcamp **bc-expressjs**. API REST para un centro de bienestar con **autenticación completa** (bcrypt + JWT access/refresh tokens + cookies HttpOnly).

## 🎯 Dominio

- **Dominio asignado:** Spay Bienestar
- **Recurso principal:** `Treatment` (Tratamiento)
- **Recurso secundario:** `Category` (Categoría)
- **Usuario:** `User` (registro, login, roles)

## 🔐 Autenticación

| Endpoint | Método | Descripción | Auth |
|----------|--------|-------------|------|
| `/api/v1/auth/register` | POST | Registro (hash bcrypt) | Público |
| `/api/v1/auth/login` | POST | Login → cookies HttpOnly | Público |
| `/api/v1/auth/me` | GET | Perfil del usuario | Protegido |
| `/api/v1/auth/refresh` | POST | Renueva tokens (rotación) | Cookie refresh |
| `/api/v1/auth/logout` | POST | Invalida refresh + limpia cookies | Protegido |

### Criterios de seguridad implementados

- ✅ Contraseñas hasheadas con bcrypt (salt rounds 10)
- ✅ Secrets distintos (`JWT_ACCESS_SECRET` ≠ `JWT_REFRESH_SECRET`)
- ✅ Tokens solo en cookies HttpOnly (nunca en body ni localStorage)
- ✅ Refresh token hasheado en DB
- ✅ Rotación de refresh token en cada `/refresh`
- ✅ Rutas de recursos protegidas con `authMiddleware`
- ✅ Prevención de user enumeration en registro

## 📊 Endpoints de recursos (protegidos)

### Categories

| Método | Ruta | Status |
|--------|------|--------|
| GET | `/api/v1/categories` | 200 |
| GET | `/api/v1/categories/:id` | 200 / 400 / 404 |
| POST | `/api/v1/categories` | 201 / 400 / 409 |
| PUT | `/api/v1/categories/:id` | 200 / 400 / 404 / 409 |
| DELETE | `/api/v1/categories/:id` | 204 / 400 / 404 |

### Treatments

| Método | Ruta | Status |
|--------|------|--------|
| GET | `/api/v1/treatments?page=1&limit=10` | 200 |
| GET | `/api/v1/treatments/:id` | 200 / 400 / 404 |
| POST | `/api/v1/treatments` | 201 / 400 / 409 |
| PUT | `/api/v1/treatments/:id` | 200 / 400 / 404 / 409 |
| DELETE | `/api/v1/treatments/:id` | 204 / 400 / 404 |

## 🚀 Cómo ejecutarlo

```bash
# 1. Levantar MongoDB
docker compose up -d

# 2. Instalar dependencias
pnpm install

# 3. Variables de entorno
cp .env.example .env
# (opcional) generar secrets reales:
# openssl rand -base64 64

# 4. Seed
pnpm seed

# 5. Servidor
pnpm dev
```

**Usuario demo del seed:**
- Email: `admin@spaybienestar.com`
- Password: `Admin123!`

## 🧪 Flujo de prueba (Postman / Thunder Client)

1. **Register** o **Login** → ver cookies `accessToken` y `refreshToken` (HttpOnly)
2. **GET /auth/me** → perfil del usuario
3. **CRUD de treatments/categories** (las cookies se envían automáticamente)
4. **POST /auth/refresh** → nuevos tokens (rotación)
5. **POST /auth/logout** → cookies limpiadas
6. Intentar CRUD sin cookie → **401**

### Ejemplo Register

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"David","email":"david@test.com","password":"Password123"}' \
  -c cookies.txt
```

### Ejemplo Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@spaybienestar.com","password":"Admin123!"}' \
  -c cookies.txt
```

### Ejemplo recurso protegido

```bash
curl http://localhost:3000/api/v1/treatments \
  -b cookies.txt
```

## 🧱 Arquitectura

```
routes → controllers → services → repositories → Mongoose
```

- Auth: `auth.routes` → `auth.controller` → `auth.service` → `user.repository`
- Treatments / Categories: protegidos con `authMiddleware`

## 📸 Capturas requeridas

- Register exitoso
- Login con cookies en la respuesta
- CRUD completo de treatments (5 operaciones)
- Acceso sin token → 401
- Refresh exitoso → nuevo cookie
- Logout y refresh posterior → 401
