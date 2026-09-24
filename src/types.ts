export interface Treatment {
  id: number;
  name: string;
  category: string;
  price: number;
  duration: number;
  available: boolean;
}

export interface Summary {
  totalItems: number;
  activeItems: number;
  inactiveItems: number;
  averagePrice: number;
  mostExpensive: Treatment | null;
  cheapest: Treatment | null;
}

export interface Report {
  summary: Summary;
  filteredItems: Treatment[];
  filterCategory?: string;
}
