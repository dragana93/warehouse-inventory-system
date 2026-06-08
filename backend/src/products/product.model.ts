export interface Product {
  id: number;
  code: string;
  name: string;
  price: number;
  quantity: number;
  categoryId: number;
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
