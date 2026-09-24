import type { Treatment, CreateTreatmentDto, UpdateTreatmentDto } from './types.js';

let treatments: Treatment[] = [
  {
    id: 1,
    name: 'Masaje relajante',
    category: 'Masajes',
    price: 120000,
    duration: 60,
    available: true,
  },
  {
    id: 2,
    name: 'Masaje descontracturante',
    category: 'Masajes',
    price: 150000,
    duration: 60,
    available: true,
  },
  {
    id: 3,
    name: 'Limpieza facial profunda',
    category: 'Faciales',
    price: 95000,
    duration: 75,
    available: true,
  },
  {
    id: 4,
    name: 'Facial antiedad',
    category: 'Faciales',
    price: 180000,
    duration: 90,
    available: true,
  },
  {
    id: 5,
    name: 'Exfoliación corporal',
    category: 'Corporales',
    price: 110000,
    duration: 45,
    available: true,
  },
  {
    id: 6,
    name: 'Circuito de hidroterapia',
    category: 'Hidroterapia',
    price: 85000,
    duration: 90,
    available: true,
  },
  {
    id: 7,
    name: 'Aromaterapia con lavanda',
    category: 'Aromaterapia',
    price: 70000,
    duration: 40,
    available: false,
  },
];

let nextId = 8;

export function getAll(): Treatment[] {
  return treatments;
}

export function getById(id: number): Treatment | undefined {
  return treatments.find((t) => t.id === id);
}

export function create(data: CreateTreatmentDto): Treatment {
  const treatment: Treatment = { id: nextId++, ...data };
  treatments.push(treatment);
  return treatment;
}

export function update(id: number, data: UpdateTreatmentDto): Treatment | undefined {
  const index = treatments.findIndex((t) => t.id === id);
  if (index === -1) return undefined;

  treatments[index] = { id, ...data };
  return treatments[index];
}

export function remove(id: number): boolean {
  const index = treatments.findIndex((t) => t.id === id);
  if (index === -1) return false;

  treatments.splice(index, 1);
  return true;
}
