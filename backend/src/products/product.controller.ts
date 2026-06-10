import { NextFunction, Request, Response } from 'express';
import { CreateProductDto, ProductQuery, SortField, SortOrder, UpdateProductDto } from './product.model';

import { ProductService } from './product.service';

export class ProductController {
  constructor(private readonly service: ProductService) {}

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query: ProductQuery = {};
      if (req.query['search']) query.search = String(req.query['search']);
      if (req.query['categoryId']) query.categoryId = Number(req.query['categoryId']);
      if (req.query['code']) query.code = String(req.query['code']);
      if (req.query['sortBy']) query.sortBy = String(req.query['sortBy']) as SortField;
      if (req.query['sortOrder']) query.sortOrder = String(req.query['sortOrder']) as SortOrder;
      if (req.query['page']) query.page = Number(req.query['page']);
      if (req.query['pageSize']) query.pageSize = Number(req.query['pageSize']);
      const result = await this.service.getAll(query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params['id']);
      const product = await this.service.getById(id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await this.service.create(req.body as CreateProductDto);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params['id']);
      const product = await this.service.update(id, req.body as UpdateProductDto);
      res.json(product);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params['id']);
      await this.service.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
