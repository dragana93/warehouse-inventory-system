import { NextFunction, Request, Response } from 'express';
import { StockUpdateDto } from './inventory.model';
import { InventoryService } from './inventory.service';

export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  increaseStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = Number(req.params['productId']);
      const result = await this.service.increaseStock(productId, req.body as StockUpdateDto);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  decreaseStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = Number(req.params['productId']);
      const result = await this.service.decreaseStock(productId, req.body as StockUpdateDto);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
