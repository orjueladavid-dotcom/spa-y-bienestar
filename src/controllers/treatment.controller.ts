import { Request, Response, NextFunction } from 'express';
import * as treatmentService from '../services/treatment.service.js';
import {
  createTreatmentSchema,
  updateTreatmentSchema,
  treatmentIdSchema,
  paginationSchema,
} from '../schemas/treatment.schema.js';
import { AppError } from '../errors/AppError.js';

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const result = await treatmentService.getAll(page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = treatmentIdSchema.parse(req.params);
    const data = await treatmentService.getById(id);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError(401, 'No autenticado');
    }
    const body = createTreatmentSchema.parse(req.body);
    const data = await treatmentService.create(body, req.user.id);
    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = treatmentIdSchema.parse(req.params);
    const body = updateTreatmentSchema.parse(req.body);
    const data = await treatmentService.update(id, body);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = treatmentIdSchema.parse(req.params);
    await treatmentService.remove(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
