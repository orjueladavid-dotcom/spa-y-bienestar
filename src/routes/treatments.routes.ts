import { Router, type Request, type Response } from 'express';
import * as store from '../store.js';
import type { CreateTreatmentDto } from '../types.js';

const router = Router();

// GET /api/v1/treatments — listar todos
router.get('/', (_req: Request, res: Response) => {
  const treatments = store.getAll();
  res.status(200).json(treatments);
});

// GET /api/v1/treatments/:id — obtener por ID
router.get('/:id', (req: Request, res: Response) => {
  const id = Number(req.params['id']);

  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'El id debe ser un número' });
    return;
  }

  const treatment = store.getById(id);
  if (!treatment) {
    res.status(404).json({ error: 'Tratamiento no encontrado' });
    return;
  }

  res.status(200).json(treatment);
});

// POST /api/v1/treatments — crear
router.post('/', (req: Request, res: Response) => {
  const body = req.body as Partial<CreateTreatmentDto>;

  if (!body.name || !body.category || body.price == null || body.duration == null) {
    res.status(400).json({
      error: 'Campos requeridos: name, category, price, duration',
    });
    return;
  }

  const treatment = store.create({
    name: body.name,
    category: body.category,
    price: Number(body.price),
    duration: Number(body.duration),
    available: body.available ?? true,
  });

  res.status(201).json(treatment);
});

// PUT /api/v1/treatments/:id — actualizar completo
router.put('/:id', (req: Request, res: Response) => {
  const id = Number(req.params['id']);

  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'El id debe ser un número' });
    return;
  }

  const body = req.body as Partial<CreateTreatmentDto>;

  if (!body.name || !body.category || body.price == null || body.duration == null) {
    res.status(400).json({
      error: 'Campos requeridos: name, category, price, duration',
    });
    return;
  }

  const updated = store.update(id, {
    name: body.name,
    category: body.category,
    price: Number(body.price),
    duration: Number(body.duration),
    available: body.available ?? true,
  });

  if (!updated) {
    res.status(404).json({ error: 'Tratamiento no encontrado' });
    return;
  }

  res.status(200).json(updated);
});

// DELETE /api/v1/treatments/:id — eliminar
router.delete('/:id', (req: Request, res: Response) => {
  const id = Number(req.params['id']);

  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'El id debe ser un número' });
    return;
  }

  const deleted = store.remove(id);
  if (!deleted) {
    res.status(404).json({ error: 'Tratamiento no encontrado' });
    return;
  }

  res.status(204).send();
});

export default router;
