# 🌿 Spay Bienestar — API REST (Semana 05: PostgreSQL + Prisma)

Proyecto del bootcamp **bc-expressjs**. API REST para un centro de bienestar que gestiona **tratamientos** (masajes, faciales, hidroterapia, etc.) organizados por **categorías**. Semana 05: se migra del almacenamiento en memoria a **PostgreSQL con Prisma ORM**.

## 🎯 Dominio

- **Dominio asignado:** Spay Bienestar
- **Recurso principal:** `Treatment` (Tratamiento)
- **Recurso secundario:** `Category` (Categoría) — relación 1:N (una categoría tiene muchos tratamientos)

## 🗂️ Diagrama de entidades

```
┌──────────────────┐        1        N ┌────────────────────────┐
│     Category     │───────────────────│       Treatment        │
├──────────────────┤                   ├────────────────────────┤
│ id (UUID, PK)    │                   │ id (UUID, PK)          │
│ name (unique)    │                   │ name (unique)          │
│ description?     │                   │ description?           │
│ createdAt        │                   │ price (Int, COP)       │
│ updatedAt        │                   │ duration (Int, min)    │
└──────────────────┘                   │ available (Boolean)    │
                                       │ categoryId? (UUID, FK) │
                                       │ createdAt / updatedAt  │
                                       └────────────────────────┘
```

Si se elimina una categoría, sus tratamientos **no se borran**: `categoryId` queda en `NULL`.

## 🧱 Arquitectura en capas

`routes → controllers → services → repositories → Prisma`

| Capa | Responsabilidad |
|---|---|
| routes | Define los endpoints |
| controllers | HTTP: valida con Zod (`safeParse`) y responde; errores a `next(err)` |
| services | Lógica de negocio (`AppError 404` si no existe) |
| repositories | Prisma + traducción de errores (`P2002`, `P2025`, `P2003`) |

Transversal: `AppError`, `errorHandler` (4 parámetros), `notFound`, logger Winston + Morgan.

## 🚀 Cómo ejecutarlo

Requisitos: Node ≥ 22, pnpm, Docker.

```bash
# 1. Levantar PostgreSQL
docker compose up -d

# 2. Instalar dependencias (también ejecuta prisma generate)
pnpm install

# 3. Variables de entorno
cp .env.example .env

# 4. Primera migración (crea prisma/migrations/)
pnpm dlx prisma migrate dev --name init

# 5. Seed (idempotente)
pnpm dlx prisma db seed

# 6. Servidor en desarrollo
pnpm dev
```

Comandos útiles: `pnpm db:studio` (ver la BD en el navegador), `pnpm build`, `pnpm start`.

## 📊 Endpoints

Base: `http://localhost:3000/api/v1/treatments`

| Método | Ruta | Descripción | Status |
|---|---|---|---|
| GET | `/api/v1/treatments?page=1&limit=10` | Listado paginado (incluye categoría) | 200 / 400 |
| GET | `/api/v1/treatments/:id` | Detalle con categoría | 200 / 400 / 404 |
| POST | `/api/v1/treatments` | Crear | 201 / 400 / 409 |
| PUT | `/api/v1/treatments/:id` | Actualizar (campos opcionales) | 200 / 400 / 404 / 409 |
| DELETE | `/api/v1/treatments/:id` | Eliminar | 204 / 400 / 404 |
| GET | `/health` | Estado del servidor | 200 |

### Validaciones (Zod)

| Campo | Regla |
|---|---|
| `name` | string, 3–120 caracteres, único |
| `description` | string ≤ 500, opcional |
| `price` | entero > 0 (COP) |
| `duration` | entero 5–480 (minutos) |
| `available` | boolean, opcional (por defecto `true`) |
| `categoryId` | UUID válido, opcional / `null` |
| `:id` (ruta) | UUID válido |
| `page` / `limit` | enteros positivos; `limit` ≤ 100 (por defecto 1 / 10) |

### Ejemplos

**GET /api/v1/treatments?page=1&limit=2** → `200`
```json
{
  "data": [
    {
      "id": "b7c1f0de-5a34-4c1e-9d2a-7f3e2a1b0c11",
      "name": "Masaje relajante",
      "description": "Masaje de cuerpo completo para liberar tensión",
      "price": 120000,
      "duration": 60,
      "available": true,
      "categoryId": "0a9d3c52-1e77-4a0b-8c55-2d6f9b8e4a10",
      "category": { "id": "0a9d3c52-1e77-4a0b-8c55-2d6f9b8e4a10", "name": "Masajes", "description": "Masajes terapéuticos y de relajación" },
      "createdAt": "2026-09-24T00:00:00.000Z",
      "updatedAt": "2026-09-24T00:00:00.000Z"
    }
  ],
  "total": 7,
  "page": 1,
  "limit": 2
}
```

**POST /api/v1/treatments** → `201`
```json
// request
{ "name": "Piedras calientes", "price": 140000, "duration": 70, "categoryId": "<uuid de una categoría del seed>" }
```

**POST con body inválido** → `400`
```json
{
  "status": "error",
  "message": "Datos inválidos",
  "issues": [{ "path": "price", "message": "El precio debe ser mayor a 0" }]
}
```

**POST con un nombre repetido** → `409`
```json
{ "status": "error", "message": "Ya existe un tratamiento con ese valor" }
```

**GET /:id inexistente** → `404`
```json
{ "status": "error", "message": "Tratamiento no encontrado" }
```

### Mapeo de errores de Prisma

| Código Prisma | Significado | Respuesta |
|---|---|---|
| `P2002` | Violación de unicidad | `409` |
| `P2025` | Registro no encontrado (update/delete) | `404` |
| `P2003` | `categoryId` que no existe | `400` |

## 🌱 Logs del seed

> Pega aquí la salida de `pnpm dlx prisma db seed`.

```
(pendiente: ejecutar el seed y pegar la salida)
```

## 📸 Capturas

> Agrega aquí (o en `docs/`) las capturas de Postman / Thunder Client de los 5 endpoints y de los errores (400, 404, 409).
