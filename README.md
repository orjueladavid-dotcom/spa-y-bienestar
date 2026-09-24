# 🌿 Spay Bienestar — Semana 01: Node.js Fundamentals

CLI de línea de comandos que lee los tratamientos de un centro de bienestar desde un archivo JSON, genera un resumen y permite filtrar por categoría.

## 🎯 Dominio

**Spay Bienestar** — centro de bienestar que ofrece tratamientos (masajes, faciales, corporales, hidroterapia y aromaterapia).

Entidad principal: **Treatment** (Tratamiento).

## ¿Qué hace?

- Lee `data/treatments.json`
- Muestra resumen: total, disponibles/no disponibles, precio promedio, más caro y más barato
- Filtra por categoría con `--category`
- Guarda el reporte en `output/report.json`

## Tecnologías

- Node.js 22+
- TypeScript (strict)
- pnpm
- fs/promises
- commander

## Estructura

```
spa-y-bienestar/
├── src/
│   ├── index.ts
│   ├── types.ts
│   ├── fileManager.ts
│   └── dataProcessor.ts
├── data/
│   └── treatments.json
├── output/
│   └── report.json
├── package.json
└── tsconfig.json
```

## Cómo ejecutarlo

```bash
pnpm install
pnpm dev                          # todos los tratamientos
pnpm dev -- --category Masajes    # filtrar por categoría
pnpm build && pnpm start          # versión compilada
```

## Ejemplo de salida

```
🌿 ===== Spay Bienestar — Resumen de Tratamientos =====

📦 Total de tratamientos : 12
✅ Disponibles           : 10
❌ No disponibles        : 2
💰 Precio promedio       : $114.583 COP
🔝 Más caro              : Masaje con piedras calientes ($180.000)
🔻 Más barato            : Baño de vapor ($60.000)
```

## Entidad Treatment

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
