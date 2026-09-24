import type { Treatment } from '../types.js';
import type { CreateTreatmentDto, UpdateTreatmentDto } from '../schemas/treatments.schema.js';

let treatments: Treatment[] = [
  {
    id: 1,
    name: 'Masaje relajante',
    category: 'Masajes',
    price: 120000,
    duration: 60,
    available: true,
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 2,
    name: 'Masaje descontracturante',
    category: 'Masajes',
    price: 150000,
    duration: 60,
    available: true,
    createdAt: '2026-01-11T10:00:00.000Z',
  },
  {
    id: 3,
    name: 'Limpieza facial profunda',
    category: 'Faciales',
    price: 95000,
    duration: 75,
    available: true,
    createdAt: '2026-01-12T10:00:00.000Z',
  },
  {
    id: 4,
    name: 'Facial antiedad',
    category: 'Faciales',
    price: 180000,
    duration: 90,
    available: true,
    createdAt: '2026-01-13T10:00:00.000Z',
  },
  {
    id: 5,
    name: 'Exfoliación corporal',
    category: 'Corporales',
    price: 110000,
    duration: 45,
    available: true,
    createdAt: '2026-01-14T10:00:00.000Z',
  },
  {
    id: 6,
    name: 'Circuito de hidroterapia',
    category: 'Hidroterapia',
    price: 85000,
    duration: 90,
    available: true,
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 7,
    name: 'Aromaterapia con lavanda',
    category: 'Aromaterapia',
    price: 70000,
    duration: 40,
    available: false,
    createdAt: '2026-01-16T10:00:00.000Z',
  },
];

let nextId = 8;

function clone<T>(value: T): T {
  return structuredClone(value);
}

export async function findAll(): Promise<Treatment[]> {
  return clone(treatments);
}

export async function findById(id: number): Promise<Treatment | undefined> {
  const found = treatments.find((t) => t.id === id);
  return found ? clone(found) : undefined;
}

export async function create(data: CreateTreatmentDto): Promise<Treatment> {
  const treatment: Treatment = {
    id: nextId++,
    ...data,
    createdAt: new Date().toISOString(),
  };
  treatments.push(treatment);
  return clone(treatment);
}

export async function update(
  id: number,
  data: UpdateTreatmentDto,
): Promise<Treatment | undefined> {
  const index = treatments.findIndex((t) => t.id === id);
  if (index === -1) return undefined;

  const existing = treatments[index]!;
  treatments[index] = {
    ...existing,
    ...data,
    id,
  };
  return clone(treatments[index]);
}

export async function remove(id: number): Promise<boolean> {
  const index = treatments.findIndex((t) => t.id === id);
  if (index === -1) return false;
  treatments.splice(index, 1);
  return true;
}
