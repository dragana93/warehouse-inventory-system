import { AuditLogResponse } from './audit-log.model';
import { AuditLogRepository } from './audit-log.repository';

export class AuditLogService {
  constructor(private readonly repository: AuditLogRepository) {}

  async getAll(): Promise<AuditLogResponse[]> {
    return this.repository.findAll();
  }

  async getByProductId(productId: number): Promise<AuditLogResponse[]> {
    return this.repository.findByProductId(productId);
  }
}
