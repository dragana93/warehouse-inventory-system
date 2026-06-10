import { NextFunction, Request, Response } from 'express';
import { AuditLogController } from './audit-log.controller';
import { AuditLogService } from './audit-log.service';
import { AuditLogEntry } from './audit-log.model';

jest.mock('./audit-log.service');

const mockService = new AuditLogService({} as never) as jest.Mocked<AuditLogService>;
const controller = new AuditLogController(mockService);

const mockRes = { json: jest.fn() } as unknown as Response;
const mockNext = jest.fn() as NextFunction;

const sampleEntry: AuditLogEntry = {
  id: 1,
  productId: 1,
  oldQuantity: 50,
  newQuantity: 60,
  action: 'increase',
  timestamp: new Date('2026-01-01T00:00:00Z'),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AuditLogController.getAll', () => {
  it('should return all audit log entries as JSON', async () => {
    mockService.getAll.mockResolvedValue([sampleEntry]);
    const req = {} as Request;

    await controller.getAll(req, mockRes, mockNext);

    expect(mockService.getAll).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith([sampleEntry]);
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

describe('AuditLogController.getByProductId', () => {
  it('should return entries for the given product as JSON', async () => {
    mockService.getByProductId.mockResolvedValue([sampleEntry]);
    const req = { params: { productId: '1' } } as unknown as Request;

    await controller.getByProductId(req, mockRes, mockNext);

    expect(mockService.getByProductId).toHaveBeenCalledWith(1);
    expect(mockRes.json).toHaveBeenCalledWith([sampleEntry]);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next with error when service throws', async () => {
    const error = new Error('failure');
    mockService.getByProductId.mockRejectedValue(error);
    const req = { params: { productId: '99' } } as unknown as Request;

    await controller.getByProductId(req, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
    expect(mockRes.json).not.toHaveBeenCalled();
  });
});
