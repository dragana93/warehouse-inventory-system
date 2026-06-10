import prisma from '../database/database.client';
import { AuditAction, AuditLogEntry, AuditLogResponse, CreateAuditLogDto } from './audit-log.model';

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

function toAuditLogResponse(row: {
  id: number;
  oldQuantity: number;
  newQuantity: number;
  action: string;
  timestamp: Date;
  product: { name: string };
}): AuditLogResponse {
  return {
    id: row.id,
    date: row.timestamp.toISOString(),
    product: row.product.name,
    oldQuantity: row.oldQuantity,
    newQuantity: row.newQuantity,
    action: row.action as AuditAction,
  };
}

export class AuditLogRepository {
  async create(dto: CreateAuditLogDto): Promise<AuditLogEntry> {
    const entry = await prisma.inventoryHistory.create({ data: dto });
    return toAuditLogEntry(entry);
  }

  async findAll(): Promise<AuditLogResponse[]> {
    const entries = await prisma.inventoryHistory.findMany({
      include: { product: { select: { name: true } } },
      orderBy: { timestamp: 'desc' },
    });
    return entries.map(toAuditLogResponse);
  }

  async findByProductId(productId: number): Promise<AuditLogResponse[]> {
    const entries = await prisma.inventoryHistory.findMany({
      where: { productId },
      include: { product: { select: { name: true } } },
      orderBy: { timestamp: 'desc' },
    });
    return entries.map(toAuditLogResponse);
  }
}
