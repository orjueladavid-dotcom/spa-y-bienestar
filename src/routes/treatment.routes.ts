import { Router } from 'express';
import * as treatmentController from '../controllers/treatment.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Todas las rutas de tratamientos requieren autenticación
router.use(authMiddleware);

router.get('/', treatmentController.getAll);
router.get('/:id', treatmentController.getById);
router.post('/', treatmentController.create);
router.put('/:id', treatmentController.update);
router.delete('/:id', treatmentController.remove);

export default router;
