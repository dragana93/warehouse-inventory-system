export type InventoryAction = 'increase' | 'decrease';

export interface StockUpdateResult {
  id: number;
  quantity: number;
}

export interface InventoryUpdateResult {
  productId: number;
  previousQuantity: number;
  newQuantity: number;
}

export interface InventoryHistoryEntry {
  id: number;
  date: string;
  product: string;
  oldQuantity: number;
  newQuantity: number;
  action: InventoryAction;
}
