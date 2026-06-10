import prisma from '../database/database.client';
import { AuditAction, AuditLogEntry, CreateAuditLogDto } from './audit-log.model';

function toAuditLogEntry(row: {
  id: number;
  productId: number;
  oldQuantity: number;
  newQuantity: number;
  action: string;
  timestamp: Date;
}): AuditLogEntry {
  return {
    id: row.id,
    productId: row.productId,
    oldQuantity: row.oldQuantity,
    newQuantity: row.newQuantity,
    action: row.action as AuditAction,
    timestamp: row.timestamp,
  };
}

export class AuditLogRepository {
  async create(dto: CreateAuditLogDto): Promise<AuditLogEntry> {
    const entry = await prisma.inventoryHistory.create({ data: dto });
    return toAuditLogEntry(entry);
  }

  async findAll(): Promise<AuditLogEntry[]> {
    const entries = await prisma.inventoryHistory.findMany({ orderBy: { timestamp: 'desc' } });
    return entries.map(toAuditLogEntry);
  }

  async findByProductId(productId: number): Promise<AuditLogEntry[]> {
    const entries = await prisma.inventoryHistory.findMany({
      where: { productId },
      orderBy: { timestamp: 'desc' },
    });
    return entries.map(toAuditLogEntry);
  }
}
