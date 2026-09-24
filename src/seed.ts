// src/seed.ts — Datos iniciales de Spay Bienestar
// Ejecutar con: pnpm seed
// Limpia las colecciones e inserta datos demo (idempotente al re-ejecutar).

import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './lib/mongoose.js';
import { Category } from './models/category.model.js';
import { Treatment } from './models/treatment.model.js';

const categoriesData = [
  { name: 'Masajes', description: 'Masajes terapéuticos y de relajación' },
  { name: 'Faciales', description: 'Cuidado y limpieza de la piel del rostro' },
  { name: 'Corporales', description: 'Exfoliaciones y envolturas corporales' },
  { name: 'Hidroterapia', description: 'Circuitos y terapias con agua' },
  { name: 'Aromaterapia', description: 'Terapias con aceites esenciales' },
];

const treatmentsData = [
  {
    name: 'Masaje relajante',
    categoryName: 'Masajes',
    price: 120000,
    duration: 60,
    description: 'Masaje de cuerpo completo para liberar tensión',
    available: true,
  },
  {
    name: 'Masaje descontracturante',
    categoryName: 'Masajes',
    price: 150000,
    duration: 60,
    description: 'Trabajo profundo en cuello, espalda y hombros',
    available: true,
  },
  {
    name: 'Limpieza facial profunda',
    categoryName: 'Faciales',
    price: 95000,
    duration: 75,
    description: 'Limpieza, exfoliación y mascarilla hidratante',
    available: true,
  },
  {
    name: 'Facial antiedad',
    categoryName: 'Faciales',
    price: 180000,
    duration: 90,
    description: 'Tratamiento con sérum de ácido hialurónico',
    available: true,
  },
  {
    name: 'Exfoliación corporal',
    categoryName: 'Corporales',
    price: 110000,
    duration: 45,
    description: 'Exfoliación con sales marinas y aceites',
    available: true,
  },
  {
    name: 'Circuito de hidroterapia',
    categoryName: 'Hidroterapia',
    price: 85000,
    duration: 90,
    description: 'Jacuzzi, turco y sauna guiados',
    available: true,
  },
  {
    name: 'Aromaterapia con lavanda',
    categoryName: 'Aromaterapia',
    price: 70000,
    duration: 40,
    description: 'Sesión de relajación con aceites esenciales',
    available: false,
  },
];

async function seed() {
  await connectDB();

  console.log('🌱 Limpiando colecciones...');
  await Treatment.deleteMany({});
  await Category.deleteMany({});

  console.log('📂 Insertando categorías...');
  const categories = await Category.insertMany(categoriesData);
  const categoryMap = new Map(categories.map((c) => [c.name, c._id]));

  console.log('💆 Insertando tratamientos...');
  const treatmentsToInsert = treatmentsData.map(({ categoryName, ...rest }) => ({
    ...rest,
    category: categoryMap.get(categoryName)!,
  }));

  await Treatment.insertMany(treatmentsToInsert);

  const [totalCategories, totalTreatments] = await Promise.all([
    Category.countDocuments(),
    Treatment.countDocuments(),
  ]);

  console.log(`✅ Seed completado: ${totalCategories} categorías y ${totalTreatments} tratamientos`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
