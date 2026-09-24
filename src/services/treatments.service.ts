// src/services/treatments.service.ts — Lógica de negocio

import * as repo from '../repositories/treatments.repository';
import { AppError } from '../errors/AppError';
import type { CreateTreatmentDto, UpdateTreatmentDto } from '../schemas/treatments.schema';

export function listTreatments(page: number, limit: number) {
  return repo.findAll(page, limit);
}

export async function getTreatment(id: string) {
  const treatment = await repo.findById(id);
  if (!treatment) {
    throw new AppError(404, 'Tratamiento no encontrado');
  }
  return treatment;
}

export function createTreatment(data: CreateTreatmentDto) {
  return repo.create(data);
}

export function updateTreatment(id: string, data: UpdateTreatmentDto) {
  return repo.update(id, data);
}

export function deleteTreatment(id: string): Promise<void> {
  return repo.remove(id);
}
