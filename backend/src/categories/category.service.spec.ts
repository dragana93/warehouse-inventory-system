import { CategoryService } from './category.service';
import { CategoryRepository } from './category.repository';
import { AppError } from '../middleware/error.middleware';

jest.mock('./category.repository');

const MockRepo = CategoryRepository as jest.MockedClass<typeof CategoryRepository>;

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: jest.Mocked<CategoryRepository>;

  beforeEach(() => {
    MockRepo.mockClear();
    service = new CategoryService(new CategoryRepository());
    repository = MockRepo.mock.instances[0] as jest.Mocked<CategoryRepository>;
  });

  describe('getAll', () => {
    it('returns all categories from repository', async () => {
      const categories = [{ id: 1, name: 'Beverages' }];
      repository.findAll.mockResolvedValue(categories);

      const result = await service.getAll();

      expect(result).toEqual(categories);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getSummary', () => {
    it('returns category summary from repository', async () => {
      const summary = [{ id: 1, name: 'Beverages', totalStock: 120 }];
      repository.getSummary.mockResolvedValue(summary);

      const result = await service.getSummary();

      expect(result).toEqual(summary);
      expect(repository.getSummary).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('creates and returns a new category', async () => {
      const dto = { name: 'Snacks' };
      const created = { id: 2, name: 'Snacks' };
      repository.create.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(result).toEqual(created);
      expect(repository.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('updates an existing category', async () => {
      const existing = { id: 1, name: 'Old Name' };
      const updated = { id: 1, name: 'New Name' };
      repository.findById.mockResolvedValue(existing);
      repository.update.mockResolvedValue(updated);

      const result = await service.update(1, { name: 'New Name' });

      expect(result).toEqual(updated);
      expect(repository.update).toHaveBeenCalledWith(1, { name: 'New Name' });
    });

    it('throws AppError 404 when category does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update(99, { name: 'X' })).rejects.toThrow(AppError);
      await expect(service.update(99, { name: 'X' })).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('delete', () => {
    it('deletes an existing category', async () => {
      repository.findById.mockResolvedValue({ id: 1, name: 'Beverages' });
      repository.delete.mockResolvedValue(undefined);

      await expect(service.delete(1)).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('throws AppError 404 when category does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.delete(99)).rejects.toThrow(AppError);
      await expect(service.delete(99)).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
