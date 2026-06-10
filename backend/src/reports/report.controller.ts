import { NextFunction, Request, Response } from 'express';
import { ReportService } from './report.service';

export class ReportController {
  constructor(private readonly service: ReportService) {}

  getStockPerCategory = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const report = await this.service.getStockPerCategory();
      res.json(report);
    } catch (error) {
      next(error);
    }
  };
}
