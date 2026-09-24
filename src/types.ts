export interface Treatment {
  id: number;
  name: string;
  category: string;
  price: number;
  duration: number;
  available: boolean;
}

export type CreateTreatmentDto = Omit<Treatment, 'id'>;
export type UpdateTreatmentDto = CreateTreatmentDto;
