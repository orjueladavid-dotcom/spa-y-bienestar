// src/schemas/treatment.schema.ts — Validación Zod para Treatment

import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createTreatmentSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es obligatorio' })
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(120, 'El nombre no puede superar 120 caracteres'),
  description: z
    .string()
    .trim()
    .max(500, 'La descripción no puede superar 500 caracteres')
    .optional(),
  price: z
    .number({ required_error: 'El precio es obligatorio' })
    .int('El precio debe ser un entero')
    .positive('El precio debe ser mayor a 0'),
  duration: z
    .number({ required_error: 'La duración es obligatoria' })
    .int('La duración debe ser un entero')
    .min(5, 'La duración mínima es 5 minutos')
    .max(480, 'La duración máxima es 480 minutos'),
  available: z.boolean().optional().default(true),
  category: z
    .string({ required_error: 'La categoría es obligatoria' })
    .regex(objectIdRegex, 'ID de categoría inválido'),
});

export const updateTreatmentSchema = createTreatmentSchema.partial();

export const treatmentIdSchema = z.object({
  id: z.string().regex(objectIdRegex, 'ID de tratamiento inválido'),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateTreatmentDto = z.infer<typeof createTreatmentSchema>;
export type UpdateTreatmentDto = z.infer<typeof updateTreatmentSchema>;
