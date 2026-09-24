import * as repo from '../repositories/treatments.repository.js';
import type {
  Treatment,
  CreateTreatmentDto,
  UpdateTreatmentDto,
  PaginatedResult,
} from '../types.js';

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export async function listTreatments(
  page: number,
  limit: number,
): Promise<PaginatedResult<Treatment>> {
  const all = await repo.findAll();
  const total = all.length;
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);

  return { data, total, page, limit };
}

export async function getTreatment(id: number): Promise<Treatment> {
  const treatment = await repo.findById(id);
  if (!treatment) {
    throw new NotFoundError(`Treatment ${id} not found`);
  }
  return treatment;
}

export async function createTreatment(
  data: CreateTreatmentDto,
): Promise<Treatment> {
  return repo.create(data);
}

export async function updateTreatment(
  id: number,
  data: UpdateTreatmentDto,
): Promise<Treatment> {
  const updated = await repo.update(id, data);
  if (!updated) {
    throw new NotFoundError(`Treatment ${id} not found`);
  }
  return updated;
}

export async function deleteTreatment(id: number): Promise<void> {
  const deleted = await repo.remove(id);
  if (!deleted) {
    throw new NotFoundError(`Treatment ${id} not found`);
  }
}
