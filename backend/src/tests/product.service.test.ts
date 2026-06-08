import prisma from '../database/database.client';
import { ProductRepository } from '../products/product.repository';

jest.mock('../database/database.client', () => ({
  __esModule: true,
  default: {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as unknown as {
  product: {
    findMany: jest.Mock;
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
};

const repository = new ProductRepository();

const sampleProduct = {
  id: 1,
  code: 'PRD-001',
  name: 'Water Bottle',
  price: 1.5,
  quantity: 100,
  categoryId: 1,
};

beforeEach(() => jest.clearAllMocks());

describe('ProductRepository.findAll', () => {
  it('should return all products', async () => {
    mockPrisma.product.findMany.mockResolvedValue([sampleProduct]);

    const result = await repository.findAll();

    expect(result).toEqual([sampleProduct]);
    expect(mockPrisma.product.findMany).toHaveBeenCalledTimes(1);
  });

  it('should pass categoryId filter', async () => {
    mockPrisma.product.findMany.mockResolvedValue([sampleProduct]);

    await repository.findAll({ categoryId: 1 });

    expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { categoryId: 1 } })
    );
  });

  it('should pass code filter', async () => {
    mockPrisma.product.findMany.mockResolvedValue([sampleProduct]);

    await repository.findAll({ code: 'PRD-001' });

    expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { code: 'PRD-001' } })
    );
  });

  it('should pass sortBy name', async () => {
    mockPrisma.product.findMany.mockResolvedValue([sampleProduct]);

    await repository.findAll({ sortBy: 'name', sortOrder: 'asc' });

    expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { name: 'asc' } })
    );
  });
});

describe('ProductRepository.findById', () => {
  it('should return the product when found', async () => {
    mockPrisma.product.findUnique.mockResolvedValue(sampleProduct);

    const result = await repository.findById(1);

    expect(result).toEqual(sampleProduct);
    expect(mockPrisma.product.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should return null when not found', async () => {
    mockPrisma.product.findUnique.mockResolvedValue(null);

    const result = await repository.findById(99);

    expect(result).toBeNull();
  });
});

describe('ProductRepository.create', () => {
  it('should create and return a product', async () => {
    mockPrisma.product.create.mockResolvedValue(sampleProduct);
    const dto = { code: 'PRD-001', name: 'Water Bottle', price: 1.5, quantity: 100, categoryId: 1 };

    const result = await repository.create(dto);

    expect(result).toEqual(sampleProduct);
    expect(mockPrisma.product.create).toHaveBeenCalledWith({ data: dto });
  });
});

describe('ProductRepository.update', () => {
  it('should update and return the product', async () => {
    const updated = { ...sampleProduct, name: 'Updated' };
    mockPrisma.product.update.mockResolvedValue(updated);
    const dto = { code: 'PRD-001', name: 'Updated', price: 1.5, quantity: 100, categoryId: 1 };

    const result = await repository.update(1, dto);

    expect(result).toEqual(updated);
    expect(mockPrisma.product.update).toHaveBeenCalledWith({ where: { id: 1 }, data: dto });
  });
});

describe('ProductRepository.updateQuantity', () => {
  it('should update only the quantity', async () => {
    const updated = { ...sampleProduct, quantity: 50 };
    mockPrisma.product.update.mockResolvedValue(updated);

    const result = await repository.updateQuantity(1, 50);

    expect(result).toEqual(updated);
    expect(mockPrisma.product.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { quantity: 50 } });
  });
});

describe('ProductRepository.delete', () => {
  it('should delete the product', async () => {
    mockPrisma.product.delete.mockResolvedValue(sampleProduct);

    await repository.delete(1);

    expect(mockPrisma.product.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
