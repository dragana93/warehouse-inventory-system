export interface Product {
  id: number;
  code: string;
  name: string;
  price: number;
  quantity: number;
  categoryId: number;
}

export type SortField = 'name' | 'quantity';
export type SortOrder = 'asc' | 'desc';

export interface ProductQuery {
  categoryId?: number;
  code?: string;
  sortBy?: SortField;
  sortOrder?: SortOrder;
}

export interface CreateProductDto {
  code: string;
  name: string;
  price: number;
  quantity: number;
  categoryId: number;
}

export interface UpdateProductDto {
  code: string;
  name: string;
  price: number;
  quantity: number;
  categoryId: number;
}
