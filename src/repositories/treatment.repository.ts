import { Treatment } from '../models/treatment.model.js';
import { AppError } from '../errors/AppError.js';
import type { CreateTreatmentDto, UpdateTreatmentDto } from '../schemas/treatment.schema.js';

function mapMongoError(err: unknown): never {
  if (err && typeof err === 'object' && 'code' in err && (err as { code: number }).code === 11000) {
    throw new AppError(409, 'Ya existe un tratamiento con ese nombre');
  }
  if (err && typeof err === 'object' && 'name' in err && (err as { name: string }).name === 'CastError') {
    throw new AppError(400, 'ID inválido');
  }
  throw err;
}

export async function findAll(page: number, limit: number) {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Treatment.find()
      .populate('category', 'name description')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Treatment.countDocuments(),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;
  return { data, total, page, limit, totalPages };
}

export async function findById(id: string) {
  try {
    return await Treatment.findById(id)
      .populate('category', 'name description')
      .populate('createdBy', 'name email')
      .lean();
  } catch (err) {
    return mapMongoError(err);
  }
}

export async function create(data: CreateTreatmentDto & { createdBy?: string }) {
  try {
    const treatment = await Treatment.create(data);
    return treatment.populate([
      { path: 'category', select: 'name description' },
      { path: 'createdBy', select: 'name email' },
    ]);
  } catch (err) {
    return mapMongoError(err);
  }
}

export async function update(id: string, data: UpdateTreatmentDto) {
  try {
    return await Treatment.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate('category', 'name description')
      .populate('createdBy', 'name email')
      .lean();
  } catch (err) {
    return mapMongoError(err);
  }
}

export async function remove(id: string): Promise<boolean> {
  try {
    const result = await Treatment.findByIdAndDelete(id);
    return result !== null;
  } catch (err) {
    return mapMongoError(err);
  }
}
