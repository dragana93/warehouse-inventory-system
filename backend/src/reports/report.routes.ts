import { Router } from 'express';
import { ReportRepository } from './report.repository';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';

const repository = new ReportRepository();
const service = new ReportService(repository);
const controller = new ReportController(service);

const router = Router();

router.get('/stock', controller.getStockPerCategory);

export default router;
