import { Request, Response, NextFunction } from 'express';
import { AppError, errorMiddleware } from './error.middleware';
import { logger } from '../utils/logger';

jest.mock('../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

const mockLogger = logger as jest.Mocked<typeof logger>;

function makeRes(): Partial<Response> & { status: jest.Mock; json: jest.Mock } {
  const res = { status: jest.fn(), json: jest.fn() } as unknown as Partial<Response> & {
    status: jest.Mock;
    json: jest.Mock;
  };
  res.status.mockReturnValue(res);
  return res;
}

const req = {} as Request;
const next = jest.fn() as NextFunction;

beforeEach(() => jest.clearAllMocks());

describe('AppError', () => {
  it('should set statusCode and message', () => {
    const err = new AppError(404, 'Not found');
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('Not found');
    expect(err.isValidation).toBe(false);
    expect(err.name).toBe('AppError');
  });

  it('should set isValidation when provided', () => {
    const err = new AppError(400, 'Bad request', true);
    expect(err.isValidation).toBe(true);
  });
});

describe('errorMiddleware', () => {
  it('should return status and message for AppError', () => {
    const res = makeRes();
    const err = new AppError(404, 'Not found');

    errorMiddleware(err, req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not found' });
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should call logger.warn for validation AppError', () => {
    const res = makeRes();
    const err = new AppError(400, 'Stock cannot be negative', true);

    errorMiddleware(err, req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockLogger.warn).toHaveBeenCalled();
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it('should return 500 for unknown errors', () => {
    const res = makeRes();
    const err = new Error('Unexpected failure');

    errorMiddleware(err, req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    expect(mockLogger.error).toHaveBeenCalled();
  });
});
