import { z } from 'zod';

export const createTreatmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(120, 'El nombre no puede superar 120 caracteres'),
  category: z
    .string()
    .trim()
    .min(2, 'La categoría debe tener al menos 2 caracteres'),
  price: z
    .number()
    .int('El precio debe ser un entero (COP)')
    .positive('El precio debe ser mayor a 0'),
  duration: z
    .number()
    .int('La duración debe ser un entero (minutos)')
    .min(5, 'Mínimo 5 minutos')
    .max(480, 'Máximo 480 minutos'),
  available: z.boolean().optional().default(true),
});

export const updateTreatmentSchema = createTreatmentSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Envía al menos un campo para actualizar',
  });

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive('El id debe ser un número positivo'),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateTreatmentDto = z.infer<typeof createTreatmentSchema>;
export type UpdateTreatmentDto = z.infer<typeof updateTreatmentSchema>;
