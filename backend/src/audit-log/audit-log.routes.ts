import { Router } from 'express';
import { AuditLogRepository } from './audit-log.repository';
import { AuditLogService } from './audit-log.service';
import { AuditLogController } from './audit-log.controller';

const repository = new AuditLogRepository();
const service = new AuditLogService(repository);
const controller = new AuditLogController(service);

const router = Router();

router.get('/', controller.getAll);
router.get('/:productId', controller.getByProductId);

export default router;
