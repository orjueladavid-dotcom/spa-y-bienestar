// src/controllers/treatments.controller.ts — Capa HTTP (controladores delgados)
// Validan con safeParse → 400 con issues[]; cualquier otro error va a next(err).

import { Request, Response, NextFunction } from 'express';
import type { ZodError } from 'zod';
import * as service from '../services/treatments.service';
import {
  createTreatmentSchema,
  updateTreatmentSchema,
  idParamSchema,
  paginationSchema,
} from '../schemas/treatments.schema';
import { formatZodIssues } from '../middlewares/errorHandler';

function badRequest(res: Response, error: ZodError): void {
  res.status(400).json({ status: 'error', message: 'Datos inválidos', issues: formatZodIssues(error) });
}

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = paginationSchema.safeParse(req.query);
    if (!query.success) return badRequest(res, query.error);

    const result = await service.listTreatments(query.data.page, query.data.limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const params = idParamSchema.safeParse(req.params);
    if (!params.success) return badRequest(res, params.error);

    const treatment = await service.getTreatment(params.data.id);
    res.json(treatment);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = createTreatmentSchema.safeParse(req.body);
    if (!body.success) return badRequest(res, body.error);

    const treatment = await service.createTreatment(body.data);
    res.status(201).json(treatment);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const params = idParamSchema.safeParse(req.params);
    if (!params.success) return badRequest(res, params.error);

    const body = updateTreatmentSchema.safeParse(req.body);
    if (!body.success) return badRequest(res, body.error);

    const treatment = await service.updateTreatment(params.data.id, body.data);
    res.json(treatment);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const params = idParamSchema.safeParse(req.params);
    if (!params.success) return badRequest(res, params.error);

    await service.deleteTreatment(params.data.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
