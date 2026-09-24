import type { Request, Response, NextFunction } from 'express';
import * as service from '../services/treatments.service.js';
import {
  createTreatmentSchema,
  updateTreatmentSchema,
  idParamSchema,
  paginationSchema,
} from '../schemas/treatments.schema.js';
import { formatZodIssues } from '../middlewares/errorHandler.js';
import type { ZodError } from 'zod';

function badRequest(res: Response, error: ZodError): void {
  res.status(400).json({
    status: 'error',
    message: 'Datos inválidos',
    issues: formatZodIssues(error),
  });
}

export async function getAll(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const query = paginationSchema.safeParse(req.query);
    if (!query.success) return badRequest(res, query.error);

    const result = await service.listTreatments(query.data.page, query.data.limit);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = idParamSchema.safeParse(req.params);
    if (!params.success) return badRequest(res, params.error);

    const treatment = await service.getTreatment(params.data.id);
    res.status(200).json({ data: treatment });
  } catch (err) {
    next(err);
  }
}

export async function create(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = createTreatmentSchema.safeParse(req.body);
    if (!body.success) return badRequest(res, body.error);

    const treatment = await service.createTreatment(body.data);
    res.status(201).json({ data: treatment });
  } catch (err) {
    next(err);
  }
}

export async function update(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = idParamSchema.safeParse(req.params);
    if (!params.success) return badRequest(res, params.error);

    const body = updateTreatmentSchema.safeParse(req.body);
    if (!body.success) return badRequest(res, body.error);

    const treatment = await service.updateTreatment(params.data.id, body.data);
    res.status(200).json({ data: treatment });
  } catch (err) {
    next(err);
  }
}

export async function remove(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = idParamSchema.safeParse(req.params);
    if (!params.success) return badRequest(res, params.error);

    await service.deleteTreatment(params.data.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
