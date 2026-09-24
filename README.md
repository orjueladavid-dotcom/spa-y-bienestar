# 🌿 Spay Bienestar — Semana 04: Validación, Errores y Logging

API REST con Express 5, TypeScript, **Zod**, **AppError**, **Winston** y **Morgan**.

Arquitectura en capas: `routes → controllers → services → repositories`

## 🎯 Dominio

**Spay Bienestar** — centro de bienestar.

Entidad: **Treatment** (Tratamiento).

## Validaciones Zod

| Campo | Regla |
|-------|-------|
| `name` | string, 3–120 caracteres |
| `category` | string, mínimo 2 caracteres |
| `price` | entero positivo (COP) |
| `duration` | entero 5–480 (minutos) |
| `available` | boolean opcional (default `true`) |
| `:id` | número entero positivo |
| `page` / `limit` | enteros positivos; limit ≤ 100 |

## Endpoints

| Método | Ruta | Status |
|--------|------|--------|
| GET | `/api/v1/treatments?page=1&limit=10` | 200 |
| GET | `/api/v1/treatments/:id` | 200 / 400 / 404 |
| POST | `/api/v1/treatments` | 201 / 400 |
| PUT | `/api/v1/treatments/:id` | 200 / 400 / 404 |
| DELETE | `/api/v1/treatments/:id` | 204 / 400 / 404 |
| GET | `/health` | 200 |

### Respuestas de error

```json
// 400 validación Zod
{
  "status": "error",
  "message": "Datos inválidos",
  "issues": [{ "path": "price", "message": "El precio debe ser mayor a 0" }]
}

// 404
{ "status": "error", "message": "Tratamiento 999 no encontrado" }
```

## Estructura

```
src/
├── config/logger.ts
├── errors/AppError.ts
├── middlewares/
│   ├── errorHandler.ts
│   └── notFound.ts
├── schemas/treatments.schema.ts
├── repositories/treatments.repository.ts
├── services/treatments.service.ts
├── controllers/treatments.controller.ts
├── routes/treatments.routes.ts
├── types.ts
├── app.ts
└── server.ts
```

## Cómo ejecutarlo

```bash
pnpm install
pnpm dev
```

## Ejemplos

```bash
# POST inválido → 400 con issues
curl -X POST http://localhost:3000/api/v1/treatments \
  -H "Content-Type: application/json" \
  -d '{"name":"X","price":-10}'

# GET id inexistente → 404
curl http://localhost:3000/api/v1/treatments/999

# GET id no numérico → 400
curl http://localhost:3000/api/v1/treatments/abc

# Ruta inexistente → 404 JSON
curl http://localhost:3000/api/v1/otra-cosa
```
