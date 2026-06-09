export type InventoryAction = 'increase' | 'decrease';

export interface InventoryUpdatePayload {
  productId: number;
  quantity: number;
}

export interface InventoryUpdateResult {
  productId: number;
  previousQuantity: number;
  newQuantity: number;
}
