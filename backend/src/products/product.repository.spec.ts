import { ProductRepository } from './product.repository';
import prisma from '../database/database.client';

jest.mock('../database/database.client');

describe('ProductRepository', () => {
  let repository: ProductRepository;

  const product = { id: 1, code: 'P001', name: 'Cola', price: 1.5, quantity: 10, categoryId: 1 };

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new ProductRepository();
  });

  describe('findAll', () => {
    it('returns paginated result with no query filters', async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue([product]);
      (prisma.product.count as jest.Mock).mockResolvedValue(1);

      const result = await repository.findAll();

      expect(result).toEqual({ data: [product], total: 1, page: 1, pageSize: 10 });
      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 10, include: { category: true } })
      );
    });

    it('filters by search, categoryId, and code', async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue([product]);
      (prisma.product.count as jest.Mock).mockResolvedValue(1);

      await repository.findAll({ search: 'cola', categoryId: 1, code: 'P001' });

      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { name: { contains: 'cola' }, categoryId: 1, code: 'P001' },
        })
      );
    });

    it('applies sorting', async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.product.count as jest.Mock).mockResolvedValue(0);

      await repository.findAll({ sortBy: 'name', sortOrder: 'desc' });

      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { name: 'desc' } })
      );
    });

    it('applies pagination with custom page and pageSize', async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.product.count as jest.Mock).mockResolvedValue(25);

      const result = await repository.findAll({ page: 3, pageSize: 5 });

      expect(result.page).toBe(3);
      expect(result.pageSize).toBe(5);
      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 5 })
      );
    });
  });

  describe('findById', () => {
    it('returns the product when found', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(product);

      const result = await repository.findById(1);

      expect(result).toEqual(product);
      expect(prisma.product.findUnique).toHaveBeenCalledWith({ where: { id: 1 }, include: { category: true } });
    });

    it('returns null when not found', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findById(99);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('creates and returns the product', async () => {
      const dto = { code: 'P001', name: 'Cola', price: 1.5, quantity: 10, categoryId: 1 };
      (prisma.product.create as jest.Mock).mockResolvedValue({ id: 1, ...dto });

      const result = await repository.create(dto);

      expect(result).toMatchObject(dto);
      expect(prisma.product.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('update', () => {
    it('updates and returns the product', async () => {
      const dto = { code: 'P001', name: 'Cola Updated', price: 2.0, quantity: 5, categoryId: 1 };
      (prisma.product.update as jest.Mock).mockResolvedValue({ id: 1, ...dto });

      const result = await repository.update(1, dto);

      expect(result.name).toBe('Cola Updated');
      expect(prisma.product.update).toHaveBeenCalledWith({ where: { id: 1 }, data: dto });
    });
  });

  describe('updateQuantity', () => {
    it('updates only the quantity field', async () => {
      (prisma.product.update as jest.Mock).mockResolvedValue({ ...product, quantity: 20 });

      const result = await repository.updateQuantity(1, 20);

      expect(result.quantity).toBe(20);
      expect(prisma.product.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { quantity: 20 } });
    });
  });

  describe('delete', () => {
    it('deletes the product', async () => {
      (prisma.product.delete as jest.Mock).mockResolvedValue({});

      await repository.delete(1);

      expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
