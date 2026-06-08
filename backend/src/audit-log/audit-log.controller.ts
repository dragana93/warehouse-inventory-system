import { NextFunction, Request, Response } from 'express';
import { AuditLogService } from './audit-log.service';

export class AuditLogController {
  constructor(private readonly service: AuditLogService) {}

  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const entries = await this.service.getAll();
      res.json(entries);
    } catch (error) {
      next(error);
    }
  };

  getByProductId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = Number(req.params['productId']);
      const entries = await this.service.getByProductId(productId);
      res.json(entries);
    } catch (error) {
      next(error);
    }
  };
}
