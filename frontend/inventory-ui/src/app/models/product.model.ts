export interface Product {
  id: number;
  code: string;
  name: string;
  price: number;
  quantity: number;
  categoryId: number;
  category: { id: number; name: string };
}

export interface ProductPayload {
  code: string;
  name: string;
  price: number;
  quantity: number;
  categoryId: number;
}
