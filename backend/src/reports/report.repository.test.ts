import prisma from '../database/database.client';
import { ReportRepository } from './report.repository';

jest.mock('../database/database.client', () => ({
  __esModule: true,
  default: {
    category: {
      findMany: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as unknown as {
  category: { findMany: jest.Mock };
};

const repository = new ReportRepository();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ReportRepository.getStockPerCategory', () => {
  it('should return stock totals aggregated per category', async () => {
    mockPrisma.category.findMany.mockResolvedValue([
      { id: 1, name: 'Beverages', products: [{ quantity: 80 }, { quantity: 40 }] },
      { id: 2, name: 'Snacks', products: [{ quantity: 80 }] },
    ]);

    const result = await repository.getStockPerCategory();

    expect(result).toEqual([
      { category: 'Beverages', totalQuantity: 120 },
      { category: 'Snacks', totalQuantity: 80 },
    ]);
  });

  it('should return zero totalQuantity for a category with no products', async () => {
    mockPrisma.category.findMany.mockResolvedValue([
      { id: 1, name: 'Empty', products: [] },
    ]);

    const result = await repository.getStockPerCategory();

    expect(result).toEqual([{ category: 'Empty', totalQuantity: 0 }]);
  });

  it('should return an empty array when no categories exist', async () => {
    mockPrisma.category.findMany.mockResolvedValue([]);

    const result = await repository.getStockPerCategory();

    expect(result).toEqual([]);
  });
});
