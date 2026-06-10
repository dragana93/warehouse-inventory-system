import { Router } from 'express';
import { CategoryRepository } from './category.repository';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

const repository = new CategoryRepository();
const service = new CategoryService(repository);
const controller = new CategoryController(service);

const router = Router();

router.get(['', '/'], controller.getAll);
router.get('/summary', controller.getSummary);
router.post(['', '/'], controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
