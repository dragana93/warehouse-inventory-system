import { Request, Response, NextFunction } from 'express';
import { AppError, errorMiddleware } from './error.middleware';

jest.mock('../utils/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

const mockReq = {} as Request;
const mockNext = jest.fn() as NextFunction;

function mockRes(): jest.Mocked<Response> {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as jest.Mocked<Response>;
  return res;
}

describe('AppError', () => {
  it('sets statusCode and message', () => {
    const error = new AppError(404, 'Not found');
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Not found');
    expect(error.isValidation).toBe(false);
    expect(error.name).toBe('AppError');
  });

  it('sets isValidation flag when provided', () => {
    const error = new AppError(400, 'Bad input', true);
    expect(error.isValidation).toBe(true);
  });
});

describe('errorMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 with message for a validation AppError', () => {
    const res = mockRes();
    const err = new AppError(400, 'Stock cannot be negative', true);

    errorMiddleware(err, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Stock cannot be negative' });
  });

  it('returns 404 with message for a non-validation AppError', () => {
    const res = mockRes();
    const err = new AppError(404, 'Category not found');

    errorMiddleware(err, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Category not found' });
  });

  it('returns 500 with generic message for an unknown error', () => {
    const res = mockRes();
    const err = new Error('Unexpected crash');

    errorMiddleware(err, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});
