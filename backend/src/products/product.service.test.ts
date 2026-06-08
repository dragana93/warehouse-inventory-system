import { AppError } from '../middleware/error.middleware';
import { Product, ProductQuery } from './product.model';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';

jest.mock('./product.repository');

const mockRepository = new ProductRepository() as jest.Mocked<ProductRepository>;
const service = new ProductService(mockRepository);

const sampleProduct: Product = {
  id: 1,
  code: 'PROD-001',
  name: 'Widget',
  price: 9.99,
  quantity: 100,
  categoryId: 1,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ProductService.getAll', () => {
  it('should return all products with no query', async () => {
    mockRepository.findAll.mockResolvedValue([sampleProduct]);

    const result = await service.getAll();

    expect(result).toEqual([sampleProduct]);
    expect(mockRepository.findAll).toHaveBeenCalledWith({});
  });

  it('should return an empty array when no products exist', async () => {
    mockRepository.findAll.mockResolvedValue([]);

    const result = await service.getAll();

    expect(result).toEqual([]);
  });

  it('should pass categoryId filter to repository', async () => {
    mockRepository.findAll.mockResolvedValue([sampleProduct]);
    const query: ProductQuery = { categoryId: 1 };

    await service.getAll(query);

    expect(mockRepository.findAll).toHaveBeenCalledWith(query);
  });

  it('should pass code filter to repository', async () => {
    mockRepository.findAll.mockResolvedValue([sampleProduct]);
    const query: ProductQuery = { code: 'PROD-001' };

    await service.getAll(query);

    expect(mockRepository.findAll).toHaveBeenCalledWith(query);
  });

  it('should pass sortBy name to repository', async () => {
    mockRepository.findAll.mockResolvedValue([sampleProduct]);
    const query: ProductQuery = { sortBy: 'name', sortOrder: 'asc' };

    await service.getAll(query);

    expect(mockRepository.findAll).toHaveBeenCalledWith(query);
  });

  it('should pass sortBy quantity to repository', async () => {
    mockRepository.findAll.mockResolvedValue([sampleProduct]);
    const query: ProductQuery = { sortBy: 'quantity', sortOrder: 'desc' };

    await service.getAll(query);

    expect(mockRepository.findAll).toHaveBeenCalledWith(query);
  });
});

describe('ProductService.getById', () => {
  it('should return the product when it exists', async () => {
    mockRepository.findById.mockResolvedValue(sampleProduct);

    const result = await service.getById(1);

    expect(result).toEqual(sampleProduct);
    expect(mockRepository.findById).toHaveBeenCalledWith(1);
  });

  it('should throw 404 AppError when product does not exist', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(service.getById(99)).rejects.toThrow(AppError);
    await expect(service.getById(99)).rejects.toMatchObject({ statusCode: 404 });
  });
});

describe('ProductService.create', () => {
  it('should create and return a new product', async () => {
    mockRepository.create.mockResolvedValue(sampleProduct);

    const dto = { code: 'PROD-001', name: 'Widget', price: 9.99, quantity: 100, categoryId: 1 };
    const result = await service.create(dto);

    expect(result).toEqual(sampleProduct);
    expect(mockRepository.create).toHaveBeenCalledWith(dto);
  });
});

describe('ProductService.update', () => {
  it('should update and return the product when it exists', async () => {
    const updated: Product = { ...sampleProduct, name: 'Updated Widget' };
    mockRepository.findById.mockResolvedValue(sampleProduct);
    mockRepository.update.mockResolvedValue(updated);

    const dto = { code: 'PROD-001', name: 'Updated Widget', price: 9.99, quantity: 100, categoryId: 1 };
    const result = await service.update(1, dto);

    expect(result).toEqual(updated);
    expect(mockRepository.findById).toHaveBeenCalledWith(1);
    expect(mockRepository.update).toHaveBeenCalledWith(1, dto);
  });

  it('should throw 404 AppError when product does not exist', async () => {
    mockRepository.findById.mockResolvedValue(null);

    const dto = { code: 'X', name: 'X', price: 0, quantity: 0, categoryId: 1 };
    await expect(service.update(99, dto)).rejects.toThrow(AppError);
    await expect(service.update(99, dto)).rejects.toMatchObject({ statusCode: 404 });
    expect(mockRepository.update).not.toHaveBeenCalled();
  });
});

describe('ProductService.delete', () => {
  it('should delete the product when it exists', async () => {
    mockRepository.findById.mockResolvedValue(sampleProduct);
    mockRepository.delete.mockResolvedValue(undefined);

    await service.delete(1);

    expect(mockRepository.findById).toHaveBeenCalledWith(1);
    expect(mockRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw 404 AppError when product does not exist', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(service.delete(99)).rejects.toThrow(AppError);
    await expect(service.delete(99)).rejects.toMatchObject({ statusCode: 404 });
    expect(mockRepository.delete).not.toHaveBeenCalled();
  });
});
