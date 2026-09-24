# 🌿 Spay Bienestar — Semana 02: Express Intro

API REST con Express 5 y TypeScript para gestionar los tratamientos de un centro de bienestar. Datos en memoria (sin base de datos).

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
}
```

## Endpoints

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| GET | `/api/v1/treatments` | Listar todos | 200 |
| GET | `/api/v1/treatments/:id` | Obtener por ID | 200 / 404 |
| POST | `/api/v1/treatments` | Crear | 201 / 400 |
| PUT | `/api/v1/treatments/:id` | Actualizar | 200 / 400 / 404 |
| DELETE | `/api/v1/treatments/:id` | Eliminar | 204 / 404 |
| GET | `/health` | Estado del servidor | 200 |

## Middlewares

1. `express.json()` — parseo de body
2. Logger personalizado — método, URL, status y tiempo de respuesta
3. Handler 404 — rutas no encontradas
4. Error handler global — 4 parámetros, siempre último

## Estructura

```
spa-y-bienestar/
├── src/
│   ├── app.ts                    # Express + middlewares + rutas
│   ├── server.ts                 # Entry point + graceful shutdown
│   ├── types.ts                  # Interface Treatment
│   ├── store.ts                  # CRUD en memoria
│   └── routes/
│       └── treatments.routes.ts  # 5 endpoints
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

Servidor en `http://localhost:3000`.

## Ejemplos con curl

```bash
# Listar
curl http://localhost:3000/api/v1/treatments

# Crear
curl -X POST http://localhost:3000/api/v1/treatments \
  -H "Content-Type: application/json" \
  -d '{"name":"Masaje con piedras","category":"Masajes","price":180000,"duration":75,"available":true}'

# Obtener por ID
curl http://localhost:3000/api/v1/treatments/1

# Actualizar
curl -X PUT http://localhost:3000/api/v1/treatments/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Masaje relajante premium","category":"Masajes","price":140000,"duration":60,"available":true}'

# Eliminar
curl -X DELETE http://localhost:3000/api/v1/treatments/1
```

## Decisiones de diseño

- Store en memoria con array + autoincremento de IDs
- Seed inicial con 7 tratamientos de distintas categorías
- Validación básica de campos requeridos en POST/PUT (sin Zod aún — llega en semana 04)
- Separación `app.ts` / `server.ts` para facilitar testing futuro
- Graceful shutdown con SIGTERM e SIGINT
