import prisma from '../database/database.client';
import { AuditLogRepository } from '../audit-log/audit-log.repository';

jest.mock('../database/database.client', () => ({
  __esModule: true,
  default: {
    inventoryHistory: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as unknown as {
  inventoryHistory: {
    findMany: jest.Mock;
    create: jest.Mock;
  };
};

const repository = new AuditLogRepository();

const sampleEntry = {
  id: 1,
  productId: 1,
  oldQuantity: 100,
  newQuantity: 80,
  action: 'decrease' as const,
  timestamp: new Date('2026-01-01T00:00:00.000Z'),
  product: { name: 'Widget' },
};

const expectedResponse = {
  id: 1,
  date: '2026-01-01T00:00:00.000Z',
  product: 'Widget',
  oldQuantity: 100,
  newQuantity: 80,
  action: 'decrease',
};

beforeEach(() => jest.clearAllMocks());

describe('AuditLogRepository.create', () => {
  it('should create and return an audit log entry', async () => {
    mockPrisma.inventoryHistory.create.mockResolvedValue(sampleEntry);
    const dto = { productId: 1, oldQuantity: 100, newQuantity: 80, action: 'decrease' as const };

    const result = await repository.create(dto);

    expect(result).toEqual({
      id: 1,
      productId: 1,
      oldQuantity: 100,
      newQuantity: 80,
      action: 'decrease',
      timestamp: new Date('2026-01-01T00:00:00.000Z'),
    });
    expect(mockPrisma.inventoryHistory.create).toHaveBeenCalledWith({ data: dto });
  });
});

describe('AuditLogRepository.findAll', () => {
  it('should return entries ordered by timestamp desc', async () => {
    mockPrisma.inventoryHistory.findMany.mockResolvedValue([sampleEntry]);

    const result = await repository.findAll();

    expect(result).toEqual([expectedResponse]);
    expect(mockPrisma.inventoryHistory.findMany).toHaveBeenCalledWith({
      include: { product: { select: { name: true } } },
      orderBy: { timestamp: 'desc' },
    });
  });
});

describe('AuditLogRepository.findByProductId', () => {
  it('should return entries for a specific product', async () => {
    mockPrisma.inventoryHistory.findMany.mockResolvedValue([sampleEntry]);

    const result = await repository.findByProductId(1);

    expect(result).toEqual([expectedResponse]);
    expect(mockPrisma.inventoryHistory.findMany).toHaveBeenCalledWith({
      where: { productId: 1 },
      include: { product: { select: { name: true } } },
      orderBy: { timestamp: 'desc' },
    });
  });

  it('should return empty array when no history for product', async () => {
    mockPrisma.inventoryHistory.findMany.mockResolvedValue([]);

    const result = await repository.findByProductId(99);

    expect(result).toEqual([]);
  });
});
