// src/schemas/treatments.schema.ts — Validación con Zod para Treatment

import { z } from 'zod';

// Mensajes de validación por defecto en español
z.config(z.locales.es());

export const createTreatmentSchema = z.object({
  name: z.string().trim().min(3, 'El nombre debe tener al menos 3 caracteres').max(120),
  description: z.string().trim().max(500).optional(),
  price: z.number().int('El precio debe ser un entero (COP)').positive('El precio debe ser mayor a 0'),
  duration: z.number().int('La duración debe ser un entero (minutos)').min(5, 'Mínimo 5 minutos').max(480, 'Máximo 480 minutos'),
  // Sin .default(): el valor por defecto (true) lo define Prisma (@default(true)).
  // Así .partial() no vuelve a poner available=true en una actualización parcial.
  available: z.boolean().optional(),
  categoryId: z.uuid('categoryId debe ser un UUID válido').nullable().optional(),
});

export const updateTreatmentSchema = createTreatmentSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, { message: 'Envía al menos un campo para actualizar' });

// Reemplaza al z.coerce.number() de la semana 04: ahora las PK son UUID
export const idParamSchema = z.object({
  id: z.uuid('El id debe ser un UUID válido'),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateTreatmentDto = z.infer<typeof createTreatmentSchema>;
export type UpdateTreatmentDto = z.infer<typeof updateTreatmentSchema>;
