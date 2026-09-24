import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { connectDB } from './lib/mongoose.js';
import { User } from './models/user.model.js';
import { Category } from './models/category.model.js';
import { Treatment } from './models/treatment.model.js';

async function seed() {
  await connectDB();

  console.log('🌱 Limpiando colecciones...');
  await Treatment.deleteMany({});
  await Category.deleteMany({});
  await User.deleteMany({});

  console.log('👤 Creando usuario admin...');
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await User.create({
    name: 'Admin Spay',
    email: 'admin@spaybienestar.com',
    password: hashedPassword,
    role: 'admin',
  });

  console.log('📂 Insertando categorías...');
  const categories = await Category.insertMany([
    { name: 'Masajes', description: 'Masajes terapéuticos y de relajación' },
    { name: 'Faciales', description: 'Cuidado y limpieza de la piel del rostro' },
    { name: 'Corporales', description: 'Exfoliaciones y envolturas corporales' },
    { name: 'Hidroterapia', description: 'Circuitos y terapias con agua' },
    { name: 'Aromaterapia', description: 'Terapias con aceites esenciales' },
  ]);

  const categoryMap = new Map(categories.map((c) => [c.name, c._id]));

  console.log('💆 Insertando tratamientos...');
  await Treatment.insertMany([
    {
      name: 'Masaje relajante',
      category: categoryMap.get('Masajes'),
      price: 120000,
      duration: 60,
      description: 'Masaje de cuerpo completo para liberar tensión',
      available: true,
      createdBy: admin._id,
    },
    {
      name: 'Masaje descontracturante',
      category: categoryMap.get('Masajes'),
      price: 150000,
      duration: 60,
      description: 'Trabajo profundo en cuello, espalda y hombros',
      available: true,
      createdBy: admin._id,
    },
    {
      name: 'Limpieza facial profunda',
      category: categoryMap.get('Faciales'),
      price: 95000,
      duration: 75,
      description: 'Limpieza, exfoliación y mascarilla hidratante',
      available: true,
      createdBy: admin._id,
    },
    {
      name: 'Facial antiedad',
      category: categoryMap.get('Faciales'),
      price: 180000,
      duration: 90,
      description: 'Tratamiento con sérum de ácido hialurónico',
      available: true,
      createdBy: admin._id,
    },
    {
      name: 'Exfoliación corporal',
      category: categoryMap.get('Corporales'),
      price: 110000,
      duration: 45,
      description: 'Exfoliación con sales marinas y aceites',
      available: true,
      createdBy: admin._id,
    },
    {
      name: 'Circuito de hidroterapia',
      category: categoryMap.get('Hidroterapia'),
      price: 85000,
      duration: 90,
      description: 'Jacuzzi, turco y sauna guiados',
      available: true,
      createdBy: admin._id,
    },
    {
      name: 'Aromaterapia con lavanda',
      category: categoryMap.get('Aromaterapia'),
      price: 70000,
      duration: 40,
      description: 'Sesión de relajación con aceites esenciales',
      available: false,
      createdBy: admin._id,
    },
  ]);

  const [totalUsers, totalCategories, totalTreatments] = await Promise.all([
    User.countDocuments(),
    Category.countDocuments(),
    Treatment.countDocuments(),
  ]);

  console.log(`✅ Seed completado:`);
  console.log(`   👤 ${totalUsers} usuario(s) — email: admin@spaybienestar.com / password: Admin123!`);
  console.log(`   📂 ${totalCategories} categorías`);
  console.log(`   💆 ${totalTreatments} tratamientos`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
