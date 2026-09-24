export interface Treatment {
  id: number;
  name: string;
  category: string;
  price: number;
  duration: number;
  available: boolean;
  createdAt: string;
}

export type CreateTreatmentDto = Omit<Treatment, 'id' | 'createdAt'>;
export type UpdateTreatmentDto = CreateTreatmentDto;

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface DataResponse<T> {
  data: T;
}

export interface ErrorResponse {
  error: string;
  message: string;
}
