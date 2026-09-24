# 🌿 Spay Bienestar — Semana 03: Arquitectura en Capas

API REST con Express 5 y TypeScript aplicando arquitectura en 4 capas:

`routes → controllers → services → repositories`

Datos en memoria (sin base de datos).

## 🎯 Dominio

**Spay Bienestar** — centro de bienestar.

Entidad principal: **Treatment** (Tratamiento).

```typescript
interface Treatment {
  id: number;
  name: string;
  category: string;
  price: number;      // COP
  duration: number;   // minutos
  available: boolean;
  createdAt: string;
}
```

## Arquitectura

| Capa | Responsabilidad |
|------|-----------------|
| **routes** | Solo mapea URL → controller |
| **controllers** | Extraer datos → llamar service → responder (thin) |
| **services** | Lógica de negocio, paginación, NotFoundError |
| **repositories** | Única capa que toca el store. Métodos async + copias defensivas |

## Endpoints

| Método | Ruta | Status | Respuesta |
|--------|------|--------|-----------|
| GET | `/api/v1/treatments?page=1&limit=5` | 200 | `{ data, total, page, limit }` |
| GET | `/api/v1/treatments/:id` | 200 | `{ data: { ... } }` |
| POST | `/api/v1/treatments` | 201 | `{ data: { ... } }` |
| PUT | `/api/v1/treatments/:id` | 200 | `{ data: { ... } }` |
| DELETE | `/api/v1/treatments/:id` | 204 | (sin body) |
| GET | `/health` | 200 | `{ status, timestamp }` |

### Errores

```json
// 404
{ "error": "Not Found", "message": "Treatment 999 not found" }

// 400
{ "error": "Bad Request", "message": "Campos requeridos: name, category, price, duration" }
```

## Estructura

```
spa-y-bienestar/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── types.ts
│   ├── routes/
│   │   └── treatments.routes.ts
│   ├── controllers/
│   │   └── treatments.controller.ts
│   ├── services/
│   │   └── treatments.service.ts
│   └── repositories/
│       └── treatments.repository.ts
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Cómo ejecutarlo

```bash
pnpm install
pnpm dev
```

## Ejemplos curl

```bash
# Listar paginado
curl "http://localhost:3000/api/v1/treatments?page=1&limit=3"

# Obtener por ID
curl http://localhost:3000/api/v1/treatments/1

# Crear
curl -X POST http://localhost:3000/api/v1/treatments \
  -H "Content-Type: application/json" \
  -d '{"name":"Masaje con piedras","category":"Masajes","price":180000,"duration":75,"available":true}'

# Actualizar
curl -X PUT http://localhost:3000/api/v1/treatments/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Masaje relajante premium","category":"Masajes","price":140000,"duration":60,"available":true}'

# Eliminar
curl -X DELETE http://localhost:3000/api/v1/treatments/1
```

## Decisiones de diseño

- Repository con `structuredClone` para copias defensivas
- Service lanza `NotFoundError` (sin conocer Express)
- Controller traduce NotFoundError → 404 JSON
- Paginación en service con `page` y `limit` (defaults 1 y 10)
- Contratos de respuesta consistentes (`data` wrapper / paginated)
