// prisma/seed.ts — Datos iniciales de Spay Bienestar
// Ejecutar con: pnpm dlx prisma db seed   (o: pnpm db:seed)
// Es IDEMPOTENTE: usa upsert por nombre (campo @unique), así que se puede
// ejecutar varias veces sin duplicar datos.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { name: 'Masajes', description: 'Masajes terapéuticos y de relajación' },
  { name: 'Faciales', description: 'Cuidado y limpieza de la piel del rostro' },
  { name: 'Corporales', description: 'Exfoliaciones y envolturas corporales' },
  { name: 'Hidroterapia', description: 'Circuitos y terapias con agua' },
  { name: 'Aromaterapia', description: 'Terapias con aceites esenciales' },
];

const treatments = [
  { name: 'Masaje relajante', category: 'Masajes', price: 120000, duration: 60, description: 'Masaje de cuerpo completo para liberar tensión' },
  { name: 'Masaje descontracturante', category: 'Masajes', price: 150000, duration: 60, description: 'Trabajo profundo en cuello, espalda y hombros' },
  { name: 'Limpieza facial profunda', category: 'Faciales', price: 95000, duration: 75, description: 'Limpieza, exfoliación y mascarilla hidratante' },
  { name: 'Facial antiedad', category: 'Faciales', price: 180000, duration: 90, description: 'Tratamiento con sérum de ácido hialurónico' },
  { name: 'Exfoliación corporal', category: 'Corporales', price: 110000, duration: 45, description: 'Exfoliación con sales marinas y aceites' },
  { name: 'Circuito de hidroterapia', category: 'Hidroterapia', price: 85000, duration: 90, description: 'Jacuzzi, turco y sauna guiados', available: true },
  { name: 'Aromaterapia con lavanda', category: 'Aromaterapia', price: 70000, duration: 40, description: 'Sesión de relajación con aceites esenciales', available: false },
];

async function main(): Promise<void> {
  console.log('🌱 Iniciando seed de Spay Bienestar...');

  const categoryIds = new Map<string, string>();

  for (const c of categories) {
    const category = await prisma.category.upsert({
      where: { name: c.name },
      update: { description: c.description },
      create: c,
    });
    categoryIds.set(category.name, category.id);
    console.log(`  📂 Categoría "${category.name}" → ${category.id}`);
  }

  for (const t of treatments) {
    const { category, ...fields } = t;
    const data = { ...fields, categoryId: categoryIds.get(category) ?? null };
    const treatment = await prisma.treatment.upsert({
      where: { name: t.name },
      update: data,
      create: data,
    });
    console.log(`  💆 Tratamiento "${treatment.name}" → ${treatment.id}`);
  }

  const [totalCategories, totalTreatments] = await Promise.all([
    prisma.category.count(),
    prisma.treatment.count(),
  ]);
  console.log(`✅ ${totalCategories} categorías y ${totalTreatments} tratamientos en la base de datos`);
}

main()
  .catch((err: unknown) => {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
