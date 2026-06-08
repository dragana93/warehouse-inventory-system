export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  code: string;
  name: string;
  price: number;
  quantity: number;
  categoryId: number;
  category?: Category;
}

export interface InventoryHistory {
  id: number;
  productId: number;
  oldQuantity: number;
  newQuantity: number;
  action: string;
  timestamp: string;
  product?: Product;
}
