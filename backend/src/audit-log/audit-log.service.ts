import { AuditLogEntry } from './audit-log.model';
import { AuditLogRepository } from './audit-log.repository';

export class AuditLogService {
  constructor(private readonly repository: AuditLogRepository) {}

  async getAll(): Promise<AuditLogEntry[]> {
    return this.repository.findAll();
  }

  async getByProductId(productId: number): Promise<AuditLogEntry[]> {
    return this.repository.findByProductId(productId);
  }
}
