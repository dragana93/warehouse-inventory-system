import prisma from '../database/database.client';
import { AuditLogEntry, CreateAuditLogDto } from './audit-log.model';

export class AuditLogRepository {
  async create(dto: CreateAuditLogDto): Promise<AuditLogEntry> {
    const entry = await prisma.inventoryHistory.create({ data: dto });
    return entry as AuditLogEntry;
  }

  async findAll(): Promise<AuditLogEntry[]> {
    const entries = await prisma.inventoryHistory.findMany({ orderBy: { timestamp: 'desc' } });
    return entries as AuditLogEntry[];
  }

  async findByProductId(productId: number): Promise<AuditLogEntry[]> {
    const entries = await prisma.inventoryHistory.findMany({
      where: { productId },
      orderBy: { timestamp: 'desc' },
    });
    return entries as AuditLogEntry[];
  }
}
