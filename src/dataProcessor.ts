import type { Treatment, Summary, Report } from './types.js';

export function calculateSummary(items: Treatment[]): Summary {
  const totalItems = items.length;
  const activeItems = items.filter((t) => t.available).length;
  const inactiveItems = totalItems - activeItems;

  const averagePrice =
    totalItems === 0
      ? 0
      : Math.round(items.reduce((sum, t) => sum + t.price, 0) / totalItems);

  let mostExpensive: Treatment | null = null;
  let cheapest: Treatment | null = null;

  for (const item of items) {
    if (!mostExpensive || item.price > mostExpensive.price) {
      mostExpensive = item;
    }
    if (!cheapest || item.price < cheapest.price) {
      cheapest = item;
    }
  }

  return {
    totalItems,
    activeItems,
    inactiveItems,
    averagePrice,
    mostExpensive,
    cheapest,
  };
}

export function filterByCategory(
  items: Treatment[],
  category: string,
): Treatment[] {
  return items.filter(
    (t) => t.category.toLowerCase() === category.toLowerCase(),
  );
}

export function getAvailableCategories(items: Treatment[]): string[] {
  return [...new Set(items.map((t) => t.category))].sort();
}

export function buildReport(
  allItems: Treatment[],
  category?: string,
): Report {
  let filteredItems = allItems;

  if (category) {
    filteredItems = filterByCategory(allItems, category);

    if (filteredItems.length === 0) {
      const available = getAvailableCategories(allItems);
      console.warn(`⚠️  No se encontraron tratamientos en la categoría "${category}"`);
      console.warn(`   Categorías disponibles: ${available.join(', ')}`);
    }
  }

  const summary = calculateSummary(filteredItems);

  return {
    summary,
    filteredItems,
    ...(category ? { filterCategory: category } : {}),
  };
}

export function printSummary(report: Report): void {
  const { summary, filterCategory } = report;

  console.log('\n🌿 ===== Spay Bienestar — Resumen de Tratamientos =====\n');

  if (filterCategory) {
    console.log(`🔍 Filtro aplicado: categoría "${filterCategory}"\n`);
  }

  console.log(`📦 Total de tratamientos : ${summary.totalItems}`);
  console.log(`✅ Disponibles           : ${summary.activeItems}`);
  console.log(`❌ No disponibles        : ${summary.inactiveItems}`);
  console.log(`💰 Precio promedio       : $${summary.averagePrice.toLocaleString('es-CO')} COP`);

  if (summary.mostExpensive) {
    console.log(
      `🔝 Más caro              : ${summary.mostExpensive.name} ($${summary.mostExpensive.price.toLocaleString('es-CO')})`,
    );
  }

  if (summary.cheapest) {
    console.log(
      `🔻 Más barato            : ${summary.cheapest.name} ($${summary.cheapest.price.toLocaleString('es-CO')})`,
    );
  }

  console.log('\n======================================================\n');
}
