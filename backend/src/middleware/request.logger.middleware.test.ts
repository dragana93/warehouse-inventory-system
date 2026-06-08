import { Request, Response, NextFunction } from 'express';
import { requestLogger } from './request.logger.middleware';
import { logger } from '../utils/logger';

jest.mock('../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

const mockLogger = logger as jest.Mocked<typeof logger>;

beforeEach(() => jest.clearAllMocks());

describe('requestLogger', () => {
  it('should call next immediately', () => {
    const req = { method: 'GET', originalUrl: '/test' } as Request;
    const res = { on: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;

    requestLogger(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should log on response finish', () => {
    const req = { method: 'GET', originalUrl: '/test' } as Request;
    let finishCallback: () => void = () => {};
    const res = {
      on: jest.fn((event: string, cb: () => void) => { finishCallback = cb; }),
      statusCode: 200,
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    requestLogger(req, res, next);
    finishCallback();

    expect(mockLogger.info).toHaveBeenCalledWith('Request', expect.objectContaining({
      method: 'GET',
      url: '/test',
      status: 200,
    }));
  });
});
