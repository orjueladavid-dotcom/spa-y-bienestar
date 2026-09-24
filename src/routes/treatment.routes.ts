import { Router } from 'express';
import * as treatmentController from '../controllers/treatment.controller.js';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Lectura: cualquier usuario autenticado
router.get('/', authMiddleware, treatmentController.getAll);
router.get('/:id', authMiddleware, treatmentController.getById);

// Crear / actualizar: autenticado
router.post('/', authMiddleware, treatmentController.create);
router.put('/:id', authMiddleware, treatmentController.update);

// Eliminar: solo admin
router.delete('/:id', authMiddleware, requireRole('admin'), treatmentController.remove);

export default router;
