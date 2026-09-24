// src/routes/treatment.routes.ts

import { Router } from 'express';
import * as treatmentController from '../controllers/treatment.controller.js';

const router = Router();

router.get('/', treatmentController.getAll);
router.get('/:id', treatmentController.getById);
router.post('/', treatmentController.create);
router.put('/:id', treatmentController.update);
router.delete('/:id', treatmentController.remove);

export default router;
