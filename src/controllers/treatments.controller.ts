import type { Request, Response, NextFunction } from 'express';
import * as service from '../services/treatments.service.js';
import { NotFoundError } from '../services/treatments.service.js';
import type { CreateTreatmentDto } from '../types.js';

export async function getAll(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const page = Math.max(1, Number(req.query['page']) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query['limit']) || 10));

    const result = await service.listTreatments(page, limit);
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
    const id = Number(req.params['id']);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: 'Bad Request', message: 'El id debe ser un número' });
      return;
    }

    const treatment = await service.getTreatment(id);
    res.status(200).json({ data: treatment });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ error: 'Not Found', message: err.message });
      return;
    }
    next(err);
  }
}

export async function create(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = req.body as Partial<CreateTreatmentDto>;

    if (!body.name || !body.category || body.price == null || body.duration == null) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Campos requeridos: name, category, price, duration',
      });
      return;
    }

    const treatment = await service.createTreatment({
      name: body.name,
      category: body.category,
      price: Number(body.price),
      duration: Number(body.duration),
      available: body.available ?? true,
    });

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
    const id = Number(req.params['id']);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: 'Bad Request', message: 'El id debe ser un número' });
      return;
    }

    const body = req.body as Partial<CreateTreatmentDto>;

    if (!body.name || !body.category || body.price == null || body.duration == null) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Campos requeridos: name, category, price, duration',
      });
      return;
    }

    const treatment = await service.updateTreatment(id, {
      name: body.name,
      category: body.category,
      price: Number(body.price),
      duration: Number(body.duration),
      available: body.available ?? true,
    });

    res.status(200).json({ data: treatment });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ error: 'Not Found', message: err.message });
      return;
    }
    next(err);
  }
}

export async function remove(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = Number(req.params['id']);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: 'Bad Request', message: 'El id debe ser un número' });
      return;
    }

    await service.deleteTreatment(id);
    res.status(204).send();
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ error: 'Not Found', message: err.message });
      return;
    }
    next(err);
  }
}
