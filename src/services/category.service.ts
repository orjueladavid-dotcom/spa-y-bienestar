import * as categoryRepo from '../repositories/category.repository.js';
import { AppError } from '../errors/AppError.js';
import type { CreateCategoryDto, UpdateCategoryDto } from '../schemas/category.schema.js';

export async function getAll() {
  return categoryRepo.findAll();
}

export async function getById(id: string) {
  const category = await categoryRepo.findById(id);
  if (!category) {
    throw new AppError(404, 'Categoría no encontrada');
  }
  return category;
}

export async function create(data: CreateCategoryDto) {
  return categoryRepo.create(data);
}

export async function update(id: string, data: UpdateCategoryDto) {
  const category = await categoryRepo.update(id, data);
  if (!category) {
    throw new AppError(404, 'Categoría no encontrada');
  }
  return category;
}

export async function remove(id: string) {
  const deleted = await categoryRepo.remove(id);
  if (!deleted) {
    throw new AppError(404, 'Categoría no encontrada');
  }
}
