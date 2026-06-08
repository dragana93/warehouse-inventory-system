import { Router } from 'express';
import { AuditLogRepository } from '../audit-log/audit-log.repository';
import { ProductRepository } from '../products/product.repository';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';

const productRepository = new ProductRepository();
const auditLogRepository = new AuditLogRepository();
const service = new InventoryService(productRepository, auditLogRepository);
const controller = new InventoryController(service);

const router = Router();

router.post('/:productId/increase', controller.increaseStock);
router.post('/:productId/decrease', controller.decreaseStock);

export default router;
