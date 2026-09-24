// src/controllers/category.controller.ts

import { Request, Response, NextFunction } from 'express';
import * as categoryService from '../services/category.service.js';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
} from '../schemas/category.schema.js';

export async function getAll(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await categoryService.getAll();
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = categoryIdSchema.parse(req.params);
    const data = await categoryService.getById(id);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const body = createCategorySchema.parse(req.body);
    const data = await categoryService.create(body);
    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = categoryIdSchema.parse(req.params);
    const body = updateCategorySchema.parse(req.body);
    const data = await categoryService.update(id, body);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = categoryIdSchema.parse(req.params);
    await categoryService.remove(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
