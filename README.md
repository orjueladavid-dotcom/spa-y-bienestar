# 🌿 Spay Bienestar - Sistema de Gestión de Tratamientos

Este es un proyecto que hice para la clase de bc-expressjs.
Es una herramienta de línea de comandos que lee datos de un centro de bienestar
desde un archivo JSON y genera un reporte con la información.

---

## 🎯 Mi Dominio: Spay Bienestar

El dominio que me asignaron fue **Spay Bienestar**, un centro de bienestar que ofrece diferentes tratamientos. Adapté el proyecto para trabajar con la entidad **Treatment** (Tratamiento).

---

## ¿Qué hace?

- Lee un archivo `treatments.json` con información de los tratamientos.
- Muestra un resumen en la terminal: total de tratamientos, disponibles/no disponibles, precio promedio, el más caro y el más barato.
- Permite filtrar los tratamientos por categoría usando `--category`.
- Guarda un reporte en formato JSON dentro de la carpeta `output/`.

---

## Tecnologías que usé

- Node.js
- TypeScript
- pnpm (como gestor de paquetes)
- fs/promises para leer y escribir archivos
- commander para manejar argumentos de línea de comandos
## Estructura del proyecto
spa-and-welfare/
├── src/
│ ├── index.ts # Punto de entrada
│ ├── types.ts # Definiciones de tipos
│ ├── fileManager.ts # Lectura/escritura de archivos
│ └── dataProcessor.ts # Lógica de procesamiento
├── data/
│ └── treatments.json # Datos de tratamientos
├── output/
│ └── report.json # Reporte generado
├── tsconfig.json # Configuración de TypeScript
└── package.json # Configuración del proyecto
---

## Entidades del Sistema

### Treatment (Tratamiento)

Cada tratamiento tiene los siguientes campos:

```typescript
interface Treatment {
  id: number;          
  name: string;        
  category: string;    
  price: number;        
  duration: number;     
  available: boolean;   
}

interface Summary {
  totalItems: number;             
  activeItems: number;            
  inactiveItems: number;          
  averagePrice: number;            
  mostExpensive: Treatment | null; 
  cheapest: Treatment | null;      
}

interface Report {
  summary: Summary;              
  filteredItems: Treatment[];    
  filterCategory?: string;       
}
