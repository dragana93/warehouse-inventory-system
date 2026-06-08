export type AuditAction = 'increase' | 'decrease';

export interface AuditLogEntry {
  id: number;
  productId: number;
  oldQuantity: number;
  newQuantity: number;
  action: AuditAction;
  timestamp: Date;
}

export interface CreateAuditLogDto {
  productId: number;
  oldQuantity: number;
  newQuantity: number;
  action: AuditAction;
}
