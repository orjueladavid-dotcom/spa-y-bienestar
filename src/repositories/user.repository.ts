import { User } from '../models/user.model.js';
import { AppError } from '../errors/AppError.js';
import type { RegisterDto } from '../schemas/auth.schema.js';

function mapMongoError(err: unknown): never {
  if (err && typeof err === 'object' && 'code' in err && (err as { code: number }).code === 11000) {
    throw new AppError(409, 'Ya existe un usuario con ese email');
  }
  throw err;
}

export async function findByEmail(email: string, includePassword = false) {
  const query = User.findOne({ email });
  if (includePassword) {
    query.select('+password +refreshTokenHash');
  }
  return query.lean();
}

export async function findById(id: string, includeRefreshHash = false) {
  const query = User.findById(id);
  if (includeRefreshHash) {
    query.select('+refreshTokenHash');
  }
  return query.lean();
}

export async function create(data: RegisterDto & { password: string }) {
  try {
    const user = await User.create(data);
    const obj = user.toObject();
    delete (obj as { password?: string }).password;
    delete (obj as { refreshTokenHash?: string }).refreshTokenHash;
    return obj;
  } catch (err) {
    return mapMongoError(err);
  }
}

export async function updateRefreshTokenHash(userId: string, hash: string | null) {
  await User.findByIdAndUpdate(userId, { refreshTokenHash: hash });
}
