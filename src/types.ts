export interface Treatment {
  id: number;
  name: string;
  category: string;
  price: number;
  duration: number;
  available: boolean;
  createdAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
