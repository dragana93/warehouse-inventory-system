import { AppError } from '../middleware/error.middleware';
import { Category } from './category.model';
import { CategoryRepository } from './category.repository';
import { CategoryService } from './category.service';

jest.mock('./category.repository');

const mockRepository = new CategoryRepository() as jest.Mocked<CategoryRepository>;
const service = new CategoryService(mockRepository);

const sampleCategory: Category = { id: 1, name: 'Electronics' };

beforeEach(() => {
  jest.clearAllMocks();
});

describe('CategoryService.getAll', () => {
  it('should return all categories', async () => {
    mockRepository.findAll.mockResolvedValue([sampleCategory]);

    const result = await service.getAll();

    expect(result).toEqual([sampleCategory]);
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return an empty array when no categories exist', async () => {
    mockRepository.findAll.mockResolvedValue([]);

    const result = await service.getAll();

    expect(result).toEqual([]);
  });
});

describe('CategoryService.create', () => {
  it('should create and return a new category', async () => {
    mockRepository.create.mockResolvedValue(sampleCategory);

    const result = await service.create({ name: 'Electronics' });

    expect(result).toEqual(sampleCategory);
    expect(mockRepository.create).toHaveBeenCalledWith({ name: 'Electronics' });
  });
});

describe('CategoryService.update', () => {
  it('should update and return the category when it exists', async () => {
    const updated: Category = { id: 1, name: 'Updated' };
    mockRepository.findById.mockResolvedValue(sampleCategory);
    mockRepository.update.mockResolvedValue(updated);

    const result = await service.update(1, { name: 'Updated' });

    expect(result).toEqual(updated);
    expect(mockRepository.findById).toHaveBeenCalledWith(1);
    expect(mockRepository.update).toHaveBeenCalledWith(1, { name: 'Updated' });
  });

  it('should throw 404 AppError when category does not exist', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(service.update(99, { name: 'X' })).rejects.toThrow(AppError);
    await expect(service.update(99, { name: 'X' })).rejects.toMatchObject({
      statusCode: 404,
    });
    expect(mockRepository.update).not.toHaveBeenCalled();
  });
});

describe('CategoryService.delete', () => {
  it('should delete the category when it exists', async () => {
    mockRepository.findById.mockResolvedValue(sampleCategory);
    mockRepository.delete.mockResolvedValue(undefined);

    await service.delete(1);

    expect(mockRepository.findById).toHaveBeenCalledWith(1);
    expect(mockRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw 404 AppError when category does not exist', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(service.delete(99)).rejects.toThrow(AppError);
    await expect(service.delete(99)).rejects.toMatchObject({
      statusCode: 404,
    });
    expect(mockRepository.delete).not.toHaveBeenCalled();
  });
});
