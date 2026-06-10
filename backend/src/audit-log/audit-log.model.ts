export type AuditAction = 'increase' | 'decrease';

export interface AuditLogEntry {
  id: number;
  productId: number;
  oldQuantity: number;
  newQuantity: number;
  action: AuditAction;
  timestamp: Date;
}

// Shape returned by the API — matches the frontend InventoryHistoryEntry model
export interface AuditLogResponse {
  id: number;
  date: string;
  product: string;
  oldQuantity: number;
  newQuantity: number;
  action: AuditAction;
}

export interface CreateAuditLogDto {
  productId: number;
  oldQuantity: number;
  newQuantity: number;
  action: AuditAction;
}
