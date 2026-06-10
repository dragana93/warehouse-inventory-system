import { Router } from 'express';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

const repository = new ProductRepository();
const service = new ProductService(repository);
const controller = new ProductController(service);

const router = Router();

router.get(['', '/'], controller.getAll);
router.get('/:id', controller.getById);
router.post(['', '/'], controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
