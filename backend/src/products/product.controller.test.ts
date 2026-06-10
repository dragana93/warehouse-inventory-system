import { NextFunction, Request, Response } from 'express';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product, ProductListResponse } from './product.model';

jest.mock('./product.service');

const mockService = new ProductService({} as never) as jest.Mocked<ProductService>;
const controller = new ProductController(mockService);

const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
const mockNext = jest.fn() as NextFunction;

const sampleProduct: Product = {
  id: 1,
  code: 'PROD-001',
  name: 'Widget',
  price: 9.99,
  quantity: 100,
  categoryId: 1,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ProductController.getAll', () => {
  it('should return paginated products with no query params', async () => {
    const response: ProductListResponse = { data: [sampleProduct], total: 1, page: 1, pageSize: 10 };
    mockService.getAll.mockResolvedValue(response);
    const req = { query: {} } as Request;

    await controller.getAll(req, mockRes, mockNext);

    expect(mockService.getAll).toHaveBeenCalledWith({});
    expect(mockRes.json).toHaveBeenCalledWith(response);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should parse and pass search query param', async () => {
    const response: ProductListResponse = { data: [], total: 0, page: 1, pageSize: 10 };
    mockService.getAll.mockResolvedValue(response);
    const req = { query: { search: 'widget' } } as unknown as Request;

    await controller.getAll(req, mockRes, mockNext);

    expect(mockService.getAll).toHaveBeenCalledWith(expect.objectContaining({ search: 'widget' }));
  });

  it('should parse and pass categoryId query param', async () => {
    const response: ProductListResponse = { data: [sampleProduct], total: 1, page: 1, pageSize: 10 };
    mockService.getAll.mockResolvedValue(response);
    const req = { query: { categoryId: '2' } } as unknown as Request;

    await controller.getAll(req, mockRes, mockNext);

    expect(mockService.getAll).toHaveBeenCalledWith(expect.objectContaining({ categoryId: 2 }));
  });

  it('should parse and pass code query param', async () => {
    const response: ProductListResponse = { data: [sampleProduct], total: 1, page: 1, pageSize: 10 };
    mockService.getAll.mockResolvedValue(response);
    const req = { query: { code: 'PROD-001' } } as unknown as Request;

    await controller.getAll(req, mockRes, mockNext);

    expect(mockService.getAll).toHaveBeenCalledWith(expect.objectContaining({ code: 'PROD-001' }));
  });

  it('should parse and pass valid sortBy and sortOrder', async () => {
    const response: ProductListResponse = { data: [sampleProduct], total: 1, page: 1, pageSize: 10 };
    mockService.getAll.mockResolvedValue(response);
    const req = { query: { sortBy: 'name', sortOrder: 'desc' } } as unknown as Request;

    await controller.getAll(req, mockRes, mockNext);

    expect(mockService.getAll).toHaveBeenCalledWith(
      expect.objectContaining({ sortBy: 'name', sortOrder: 'desc' })
    );
  });

  it('should ignore invalid sortBy value', async () => {
    const response: ProductListResponse = { data: [sampleProduct], total: 1, page: 1, pageSize: 10 };
    mockService.getAll.mockResolvedValue(response);
    const req = { query: { sortBy: 'invalid' } } as unknown as Request;

    await controller.getAll(req, mockRes, mockNext);

    const callArg = mockService.getAll.mock.calls[0]?.[0] ?? {};
    expect(callArg).not.toHaveProperty('sortBy');
  });

  it('should parse and pass page and pageSize', async () => {
    const response: ProductListResponse = { data: [], total: 0, page: 2, pageSize: 5 };
    mockService.getAll.mockResolvedValue(response);
    const req = { query: { page: '2', pageSize: '5' } } as unknown as Request;

    await controller.getAll(req, mockRes, mockNext);

    expect(mockService.getAll).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2, pageSize: 5 })
    );
  });

  it('should call next with error when service throws', async () => {
    const error = new Error('failure');
    mockService.getAll.mockRejectedValue(error);
    const req = { query: {} } as Request;

    await controller.getAll(req, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
    expect(mockRes.json).not.toHaveBeenCalled();
  });
});

describe('ProductController.getById', () => {
  it('should return product as JSON', async () => {
    mockService.getById.mockResolvedValue(sampleProduct);
    const req = { params: { id: '1' } } as unknown as Request;

    await controller.getById(req, mockRes, mockNext);

    expect(mockService.getById).toHaveBeenCalledWith(1);
    expect(mockRes.json).toHaveBeenCalledWith(sampleProduct);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next with error when service throws', async () => {
    const error = new Error('not found');
    mockService.getById.mockRejectedValue(error);
    const req = { params: { id: '99' } } as unknown as Request;

    await controller.getById(req, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

describe('ProductController.create', () => {
  it('should return 201 with created product', async () => {
    mockService.create.mockResolvedValue(sampleProduct);
    const req = { body: { code: 'PROD-001', name: 'Widget', price: 9.99, quantity: 100, categoryId: 1 } } as Request;

    await controller.create(req, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(sampleProduct);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next with error when service throws', async () => {
    const error = new Error('create failure');
    mockService.create.mockRejectedValue(error);
    const req = { body: {} } as Request;

    await controller.create(req, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

describe('ProductController.update', () => {
  it('should return updated product as JSON', async () => {
    const updated = { ...sampleProduct, name: 'Updated' };
    mockService.update.mockResolvedValue(updated);
    const req = { params: { id: '1' }, body: updated } as unknown as Request;

    await controller.update(req, mockRes, mockNext);

    expect(mockService.update).toHaveBeenCalledWith(1, updated);
    expect(mockRes.json).toHaveBeenCalledWith(updated);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next with error when service throws', async () => {
    const error = new Error('update failure');
    mockService.update.mockRejectedValue(error);
    const req = { params: { id: '99' }, body: {} } as unknown as Request;

    await controller.update(req, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

describe('ProductController.delete', () => {
  it('should return 204 with no body', async () => {
    mockService.delete.mockResolvedValue();
    const req = { params: { id: '1' } } as unknown as Request;

    await controller.delete(req, mockRes, mockNext);

    expect(mockService.delete).toHaveBeenCalledWith(1);
    expect(mockRes.status).toHaveBeenCalledWith(204);
    expect(mockRes.send).toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next with error when service throws', async () => {
    const error = new Error('delete failure');
    mockService.delete.mockRejectedValue(error);
    const req = { params: { id: '99' } } as unknown as Request;

    await controller.delete(req, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
