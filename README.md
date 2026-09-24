# 🌿 Spay Bienestar — API REST (Semana 06: MongoDB + Mongoose)

Proyecto del bootcamp **bc-expressjs**. API REST para un centro de bienestar que gestiona **tratamientos** organizados por **categorías**. Semana 06: se usa **MongoDB con Mongoose** (en lugar de Prisma/PostgreSQL).

## 🎯 Dominio

- **Dominio asignado:** Spay Bienestar
- **Recurso principal:** `Treatment` (Tratamiento)
- **Recurso secundario:** `Category` (Categoría) — relación por referencia (`ObjectId`) + `populate()`

## 🗂️ Diagrama de entidades

```
┌──────────────────┐                    ┌────────────────────────┐
│     Category     │                    │       Treatment        │
├──────────────────┤                    ├────────────────────────┤
│ _id (ObjectId)   │◄───────────────────│ category (ObjectId)    │
│ name (unique)    │      ref +         │ name (unique)          │
│ description?     │      populate()    │ description?           │
│ createdAt        │                    │ price (Number, COP)    │
│ updatedAt        │                    │ duration (Number, min) │
└──────────────────┘                    │ available (Boolean)    │
                                        │ createdAt / updatedAt  │
                                        └────────────────────────┘
```

## 🧱 Arquitectura en capas

`routes → controllers → services → repositories → Mongoose`

| Capa | Responsabilidad |
|------|-----------------|
| routes | Define los endpoints |
| controllers | HTTP: valida con Zod y responde; errores a `next(err)` |
| services | Lógica de negocio (`AppError 404` si no existe) |
| repositories | Mongoose + traducción de errores (`11000`, `CastError`) |

Transversal: `AppError`, `errorHandler` (4 parámetros), `notFound`, logger Winston + Morgan.

## 🚀 Cómo ejecutarlo

Requisitos: Node ≥ 22, pnpm, Docker.

```bash
# 1. Levantar MongoDB
docker compose up -d

# 2. Instalar dependencias
pnpm install

# 3. Variables de entorno
cp .env.example .env

# 4. Seed (limpia e inserta datos demo)
pnpm seed

# 5. Servidor en desarrollo
pnpm dev
```

Servidor en `http://localhost:3000`.

## 📊 Endpoints

### Categories (secundaria)

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| GET | `/api/v1/categories` | Listar todas | 200 |
| GET | `/api/v1/categories/:id` | Obtener por ID | 200 / 400 / 404 |
| POST | `/api/v1/categories` | Crear | 201 / 400 / 409 |
| PUT | `/api/v1/categories/:id` | Actualizar | 200 / 400 / 404 / 409 |
| DELETE | `/api/v1/categories/:id` | Eliminar | 204 / 400 / 404 |

### Treatments (principal — con populate)

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| GET | `/api/v1/treatments?page=1&limit=10` | Listado paginado + populate | 200 / 400 |
| GET | `/api/v1/treatments/:id` | Detalle con categoría | 200 / 400 / 404 |
| POST | `/api/v1/treatments` | Crear | 201 / 400 / 409 |
| PUT | `/api/v1/treatments/:id` | Actualizar | 200 / 400 / 404 / 409 |
| DELETE | `/api/v1/treatments/:id` | Eliminar | 204 / 400 / 404 |
| GET | `/health` | Estado del servidor | 200 |

### Validaciones (Zod)

| Campo | Regla |
|-------|-------|
| `name` (Treatment) | string, 3–120 caracteres, único |
| `description` | string ≤ 500, opcional |
| `price` | entero > 0 (COP) |
| `duration` | entero 5–480 (minutos) |
| `available` | boolean, opcional (default `true`) |
| `category` | ObjectId válido (24 hex) |
| `:id` | ObjectId válido |
| `page` / `limit` | enteros positivos; `limit` ≤ 100 |

### Ejemplo de respuesta (GET /api/v1/treatments)

```json
{
  "data": [
    {
      "_id": "66f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Masaje relajante",
      "description": "Masaje de cuerpo completo para liberar tensión",
      "price": 120000,
      "duration": 60,
      "available": true,
      "category": {
        "_id": "66f1a2b3c4d5e6f7a8b9c0d0",
        "name": "Masajes",
        "description": "Masajes terapéuticos y de relajación"
      },
      "createdAt": "2026-09-24T00:00:00.000Z",
      "updatedAt": "2026-09-24T00:00:00.000Z"
    }
  ],
  "total": 7,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### Mapeo de errores de MongoDB

| Código / Error | Significado | Respuesta |
|----------------|-------------|-----------|
| `11000` | Violación de unicidad | `409` |
| `CastError` | ObjectId inválido | `400` |
| `null` (findById) | Registro no encontrado | `404` |

## 🌱 Seed

```bash
pnpm seed
```

Inserta 5 categorías y 7 tratamientos. Al re-ejecutar limpia las colecciones primero.

## 📸 Capturas

> Agrega aquí (o en `docs/`) las capturas de Postman / Thunder Client de los endpoints y de los errores (400, 404, 409).
