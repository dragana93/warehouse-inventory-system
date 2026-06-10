import { CategoryRepository } from './category.repository';
import prisma from '../database/database.client';

jest.mock('../database/database.client');

describe('CategoryRepository', () => {
  let repository: CategoryRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new CategoryRepository();
  });

  describe('findAll', () => {
    it('returns all categories', async () => {
      const categories = [{ id: 1, name: 'Beverages' }];
      (prisma.category.findMany as jest.Mock).mockResolvedValue(categories);

      const result = await repository.findAll();

      expect(result).toEqual(categories);
      expect(prisma.category.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('returns category when found', async () => {
      const category = { id: 1, name: 'Beverages' };
      (prisma.category.findUnique as jest.Mock).mockResolvedValue(category);

      const result = await repository.findById(1);

      expect(result).toEqual(category);
      expect(prisma.category.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('returns null when not found', async () => {
      (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findById(99);

      expect(result).toBeNull();
    });
  });

  describe('getSummary', () => {
    it('returns summary with totalStock summed from product quantities', async () => {
      (prisma.category.findMany as jest.Mock).mockResolvedValue([
        { id: 1, name: 'Beverages', products: [{ quantity: 50 }, { quantity: 70 }] },
        { id: 2, name: 'Snacks', products: [] },
      ]);

      const result = await repository.getSummary();

      expect(result).toEqual([
        { id: 1, name: 'Beverages', totalStock: 120 },
        { id: 2, name: 'Snacks', totalStock: 0 },
      ]);
    });
  });

  describe('create', () => {
    it('creates and returns a new category', async () => {
      const dto = { name: 'Snacks' };
      const created = { id: 2, name: 'Snacks' };
      (prisma.category.create as jest.Mock).mockResolvedValue(created);

      const result = await repository.create(dto);

      expect(result).toEqual(created);
      expect(prisma.category.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('update', () => {
    it('updates and returns the category', async () => {
      const updated = { id: 1, name: 'Updated' };
      (prisma.category.update as jest.Mock).mockResolvedValue(updated);

      const result = await repository.update(1, { name: 'Updated' });

      expect(result).toEqual(updated);
      expect(prisma.category.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { name: 'Updated' } });
    });
  });

  describe('delete', () => {
    it('deletes the category', async () => {
      (prisma.category.delete as jest.Mock).mockResolvedValue({});

      await repository.delete(1);

      expect(prisma.category.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
