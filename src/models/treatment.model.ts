// src/models/treatment.model.ts — Entidad principal (referencia a Category)

import { Schema, model, Document, Types } from 'mongoose';

export interface ITreatment extends Document {
  name: string;
  description?: string;
  price: number;
  duration: number;
  available: boolean;
  category: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const treatmentSchema = new Schema<ITreatment>(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      unique: true,
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [120, 'El nombre no puede superar 120 caracteres'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'La descripción no puede superar 500 caracteres'],
    },
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [1, 'El precio debe ser mayor a 0'],
    },
    duration: {
      type: Number,
      required: [true, 'La duración es obligatoria'],
      min: [5, 'La duración mínima es 5 minutos'],
      max: [480, 'La duración máxima es 480 minutos'],
    },
    available: {
      type: Boolean,
      default: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'La categoría es obligatoria'],
    },
  },
  { timestamps: true },
);

export const Treatment = model<ITreatment>('Treatment', treatmentSchema);
