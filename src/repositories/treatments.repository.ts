// src/repositories/treatments.repository.ts — Acceso a datos con Prisma
// Aquí se traducen los errores de Prisma a AppError:
//   P2002 (unique)      → 409
//   P2025 (no existe)   → 404
//   P2003 (FK inválida) → 400 (categoryId que no existe)

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { prisma } from '../lib/prisma';
import { AppError } from '../errors/AppError';
import type { CreateTreatmentDto, UpdateTreatmentDto } from '../schemas/treatments.schema';

const include = { category: true } as const;

function mapPrismaError(err: unknown): never {
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') throw new AppError(409, 'Ya existe un tratamiento con ese valor');
    if (err.code === 'P2025') throw new AppError(404, 'Tratamiento no encontrado');
    if (err.code === 'P2003') throw new AppError(400, 'La categoría indicada no existe');
  }
  throw err;
}

export async function findAll(page: number, limit: number) {
  const [data, total] = await Promise.all([
    prisma.treatment.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include,
    }),
    prisma.treatment.count(),
  ]);
  return { data, total, page, limit };
}

export async function findById(id: string) {
  return prisma.treatment.findUnique({ where: { id }, include });
}

export async function create(data: CreateTreatmentDto) {
  try {
    return await prisma.treatment.create({ data, include });
  } catch (err) {
    return mapPrismaError(err);
  }
}

export async function update(id: string, data: UpdateTreatmentDto) {
  try {
    return await prisma.treatment.update({ where: { id }, data, include });
  } catch (err) {
    return mapPrismaError(err);
  }
}

export async function remove(id: string): Promise<void> {
  try {
    await prisma.treatment.delete({ where: { id } });
  } catch (err) {
    mapPrismaError(err);
  }
}
