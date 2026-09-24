import { Router } from 'express';
import * as categoryController from '../controllers/category.controller.js';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Lectura: cualquier usuario autenticado
router.get('/', authMiddleware, categoryController.getAll);
router.get('/:id', authMiddleware, categoryController.getById);

// Escritura: autenticado
router.post('/', authMiddleware, categoryController.create);
router.put('/:id', authMiddleware, categoryController.update);

// Eliminar: solo admin
router.delete('/:id', authMiddleware, requireRole('admin'), categoryController.remove);

export default router;
