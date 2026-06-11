export interface Product {
  id: number;
  code: string;
  name: string;
  price: number;
  quantity: number;
  categoryId: number;
  category?: { id: number; name: string };
}

export interface ProductPayload {
  code: string;
  name: string;
  price: number;
  quantity: number;
  categoryId: number;
}

export type SortField = 'name' | 'quantity';
export type SortOrder = 'asc' | 'desc';

export interface ProductQuery {
  search?: string;
  categoryId?: number;
  code?: string;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  page?: number;
  pageSize?: number;
}

export interface ProductListResponse {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
}
