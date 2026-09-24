// src/services/treatment.service.ts — Lógica de negocio Treatment

import * as treatmentRepo from '../repositories/treatment.repository.js';
import * as categoryRepo from '../repositories/category.repository.js';
import { AppError } from '../errors/AppError.js';
import type { CreateTreatmentDto, UpdateTreatmentDto } from '../schemas/treatment.schema.js';

export async function getAll(page: number, limit: number) {
  return treatmentRepo.findAll(page, limit);
}

export async function getById(id: string) {
  const treatment = await treatmentRepo.findById(id);
  if (!treatment) {
    throw new AppError(404, 'Tratamiento no encontrado');
  }
  return treatment;
}

export async function create(data: CreateTreatmentDto) {
  // Verificar que la categoría exista
  const category = await categoryRepo.findById(data.category);
  if (!category) {
    throw new AppError(400, 'La categoría indicada no existe');
  }
  return treatmentRepo.create(data);
}

export async function update(id: string, data: UpdateTreatmentDto) {
  if (data.category) {
    const category = await categoryRepo.findById(data.category);
    if (!category) {
      throw new AppError(400, 'La categoría indicada no existe');
    }
  }

  const treatment = await treatmentRepo.update(id, data);
  if (!treatment) {
    throw new AppError(404, 'Tratamiento no encontrado');
  }
  return treatment;
}

export async function remove(id: string) {
  const deleted = await treatmentRepo.remove(id);
  if (!deleted) {
    throw new AppError(404, 'Tratamiento no encontrado');
  }
}
