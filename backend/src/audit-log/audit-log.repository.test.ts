import prisma from '../database/database.client';
import { AuditLogRepository } from './audit-log.repository';

jest.mock('../database/database.client', () => ({
  __esModule: true,
  default: {
    inventoryHistory: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as unknown as {
  inventoryHistory: {
    create: jest.Mock;
    findMany: jest.Mock;
  };
};

const repository = new AuditLogRepository();

const sampleEntry = {
  id: 1,
  productId: 1,
  oldQuantity: 50,
  newQuantity: 60,
  action: 'increase' as const,
  timestamp: new Date('2026-01-01T00:00:00Z'),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AuditLogRepository.create', () => {
  it('should create and return an audit log entry', async () => {
    mockPrisma.inventoryHistory.create.mockResolvedValue(sampleEntry);

    const dto = { productId: 1, oldQuantity: 50, newQuantity: 60, action: 'increase' as const };
    const result = await repository.create(dto);

    expect(result).toEqual(sampleEntry);
    expect(mockPrisma.inventoryHistory.create).toHaveBeenCalledWith({ data: dto });
  });
});

describe('AuditLogRepository.findAll', () => {
  it('should return all entries ordered by timestamp descending', async () => {
    mockPrisma.inventoryHistory.findMany.mockResolvedValue([sampleEntry]);

    const result = await repository.findAll();

    expect(result).toEqual([sampleEntry]);
    expect(mockPrisma.inventoryHistory.findMany).toHaveBeenCalledWith({
      orderBy: { timestamp: 'desc' },
    });
  });
});

describe('AuditLogRepository.findByProductId', () => {
  it('should return entries for the given product ordered by timestamp descending', async () => {
    mockPrisma.inventoryHistory.findMany.mockResolvedValue([sampleEntry]);

    const result = await repository.findByProductId(1);

    expect(result).toEqual([sampleEntry]);
    expect(mockPrisma.inventoryHistory.findMany).toHaveBeenCalledWith({
      where: { productId: 1 },
      orderBy: { timestamp: 'desc' },
    });
  });
});
