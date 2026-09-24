import { Category } from '../models/category.model.js';
import { AppError } from '../errors/AppError.js';
import type { CreateCategoryDto, UpdateCategoryDto } from '../schemas/category.schema.js';

function mapMongoError(err: unknown): never {
  if (err && typeof err === 'object' && 'code' in err && (err as { code: number }).code === 11000) {
    throw new AppError(409, 'Ya existe una categoría con ese nombre');
  }
  if (err && typeof err === 'object' && 'name' in err && (err as { name: string }).name === 'CastError') {
    throw new AppError(400, 'ID de categoría inválido');
  }
  throw err;
}

export async function findAll() {
  return Category.find().sort({ createdAt: -1 }).lean();
}

export async function findById(id: string) {
  try {
    return await Category.findById(id).lean();
  } catch (err) {
    return mapMongoError(err);
  }
}

export async function create(data: CreateCategoryDto) {
  try {
    const category = await Category.create(data);
    return category.toObject();
  } catch (err) {
    return mapMongoError(err);
  }
}

export async function update(id: string, data: UpdateCategoryDto) {
  try {
    return await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  } catch (err) {
    return mapMongoError(err);
  }
}

export async function remove(id: string): Promise<boolean> {
  try {
    const result = await Category.findByIdAndDelete(id);
    return result !== null;
  } catch (err) {
    return mapMongoError(err);
  }
}
