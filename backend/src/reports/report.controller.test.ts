import { NextFunction, Request, Response } from 'express';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { StockReport } from './report.model';

jest.mock('./report.service');

const mockService = new ReportService({} as never) as jest.Mocked<ReportService>;
const controller = new ReportController(mockService);

const mockReq = {} as Request;
const mockRes = { json: jest.fn() } as unknown as Response;
const mockNext = jest.fn() as NextFunction;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ReportController.getStockPerCategory', () => {
  it('should return stock report as JSON', async () => {
    const report: StockReport[] = [
      { id: 1, name: 'Beverages', totalStock: 120 },
      { id: 2, name: 'Snacks', totalStock: 80 },
    ];
    mockService.getStockPerCategory.mockResolvedValue(report);

    await controller.getStockPerCategory(mockReq, mockRes, mockNext);

    expect(mockService.getStockPerCategory).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith(report);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next with error when service throws', async () => {
    const error = new Error('DB failure');
    mockService.getStockPerCategory.mockRejectedValue(error);

    await controller.getStockPerCategory(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
    expect(mockRes.json).not.toHaveBeenCalled();
  });
});
