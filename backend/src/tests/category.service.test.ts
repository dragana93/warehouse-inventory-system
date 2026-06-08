import prisma from '../database/database.client';
import { CategoryRepository } from '../categories/category.repository';

jest.mock('../database/database.client', () => ({
  __esModule: true,
  default: {
    category: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as unknown as {
  category: {
    findMany: jest.Mock;
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
};

const repository = new CategoryRepository();
const sampleCategory = { id: 1, name: 'Beverages' };

beforeEach(() => jest.clearAllMocks());

describe('CategoryRepository.findAll', () => {
  it('should return all categories', async () => {
    mockPrisma.category.findMany.mockResolvedValue([sampleCategory]);

    const result = await repository.findAll();

    expect(result).toEqual([sampleCategory]);
    expect(mockPrisma.category.findMany).toHaveBeenCalledTimes(1);
  });
});

describe('CategoryRepository.findById', () => {
  it('should return a category by id', async () => {
    mockPrisma.category.findUnique.mockResolvedValue(sampleCategory);

    const result = await repository.findById(1);

    expect(result).toEqual(sampleCategory);
    expect(mockPrisma.category.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should return null when not found', async () => {
    mockPrisma.category.findUnique.mockResolvedValue(null);

    const result = await repository.findById(99);

    expect(result).toBeNull();
  });
});

describe('CategoryRepository.create', () => {
  it('should create and return a category', async () => {
    mockPrisma.category.create.mockResolvedValue(sampleCategory);

    const result = await repository.create({ name: 'Beverages' });

    expect(result).toEqual(sampleCategory);
    expect(mockPrisma.category.create).toHaveBeenCalledWith({ data: { name: 'Beverages' } });
  });
});

describe('CategoryRepository.update', () => {
  it('should update and return the category', async () => {
    const updated = { id: 1, name: 'Updated' };
    mockPrisma.category.update.mockResolvedValue(updated);

    const result = await repository.update(1, { name: 'Updated' });

    expect(result).toEqual(updated);
    expect(mockPrisma.category.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { name: 'Updated' },
    });
  });
});

describe('CategoryRepository.delete', () => {
  it('should delete the category', async () => {
    mockPrisma.category.delete.mockResolvedValue(sampleCategory);

    await repository.delete(1);

    expect(mockPrisma.category.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
