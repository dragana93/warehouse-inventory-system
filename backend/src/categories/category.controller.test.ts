import { NextFunction, Request, Response } from 'express';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category, CategorySummary } from './category.model';

jest.mock('./category.service');

const mockService = new CategoryService({} as never) as jest.Mocked<CategoryService>;
const controller = new CategoryController(mockService);

const mockRes = {
  json: jest.fn(),
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
} as unknown as Response;
const mockNext = jest.fn() as NextFunction;

const sampleCategory: Category = { id: 1, name: 'Beverages' };

beforeEach(() => {
  jest.clearAllMocks();
});

describe('CategoryController.getAll', () => {
  it('should return all categories as JSON', async () => {
    mockService.getAll.mockResolvedValue([sampleCategory]);
    const req = {} as Request;

    await controller.getAll(req, mockRes, mockNext);

    expect(mockService.getAll).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith([sampleCategory]);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next with error when service throws', async () => {
    const error = new Error('failure');
    mockService.getAll.mockRejectedValue(error);
    const req = {} as Request;

    await controller.getAll(req, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
    expect(mockRes.json).not.toHaveBeenCalled();
  });
});

describe('CategoryController.getSummary', () => {
  it('should return category summary as JSON', async () => {
    const summary: CategorySummary[] = [{ id: 1, name: 'Beverages', totalStock: 120 }];
    mockService.getSummary.mockResolvedValue(summary);
    const req = {} as Request;

    await controller.getSummary(req, mockRes, mockNext);

    expect(mockService.getSummary).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith(summary);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next with error when service throws', async () => {
    const error = new Error('failure');
    mockService.getSummary.mockRejectedValue(error);
    const req = {} as Request;

    await controller.getSummary(req, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

describe('CategoryController.create', () => {
  it('should return 201 with created category', async () => {
    mockService.create.mockResolvedValue(sampleCategory);
    const req = { body: { name: 'Beverages' } } as Request;

    await controller.create(req, mockRes, mockNext);

    expect(mockService.create).toHaveBeenCalledWith({ name: 'Beverages' });
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(sampleCategory);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next with error when service throws', async () => {
    const error = new Error('failure');
    mockService.create.mockRejectedValue(error);
    const req = { body: { name: 'X' } } as Request;

    await controller.create(req, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

describe('CategoryController.update', () => {
  it('should return updated category as JSON', async () => {
    const updated: Category = { id: 1, name: 'Updated' };
    mockService.update.mockResolvedValue(updated);
    const req = { params: { id: '1' }, body: { name: 'Updated' } } as unknown as Request;

    await controller.update(req, mockRes, mockNext);

    expect(mockService.update).toHaveBeenCalledWith(1, { name: 'Updated' });
    expect(mockRes.json).toHaveBeenCalledWith(updated);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next with error when service throws', async () => {
    const error = new Error('not found');
    mockService.update.mockRejectedValue(error);
    const req = { params: { id: '99' }, body: { name: 'X' } } as unknown as Request;

    await controller.update(req, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

describe('CategoryController.delete', () => {
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
    const error = new Error('not found');
    mockService.delete.mockRejectedValue(error);
    const req = { params: { id: '99' } } as unknown as Request;

    await controller.delete(req, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
