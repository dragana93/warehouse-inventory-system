import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { AppError } from '../middleware/error.middleware';
import { CreateProductDto, UpdateProductDto } from './product.model';

jest.mock('./product.repository');

const MockRepo = ProductRepository as jest.MockedClass<typeof ProductRepository>;

describe('ProductService', () => {
  let service: ProductService;
  let repository: jest.Mocked<ProductRepository>;

  const product = { id: 1, code: 'P001', name: 'Cola', price: 1.5, quantity: 10, categoryId: 1 };

  beforeEach(() => {
    MockRepo.mockClear();
    service = new ProductService(new ProductRepository());
    repository = MockRepo.mock.instances[0] as jest.Mocked<ProductRepository>;
  });

  describe('getAll', () => {
    it('returns paginated product list', async () => {
      const response = { data: [product], total: 1, page: 1, pageSize: 10 };
      repository.findAll.mockResolvedValue(response);

      const result = await service.getAll({ search: 'cola' });

      expect(result).toEqual(response);
      expect(repository.findAll).toHaveBeenCalledWith({ search: 'cola' });
    });

    it('uses default empty query', async () => {
      const response = { data: [], total: 0, page: 1, pageSize: 10 };
      repository.findAll.mockResolvedValue(response);

      const result = await service.getAll();

      expect(result).toEqual(response);
      expect(repository.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('getById', () => {
    it('returns product when found', async () => {
      repository.findById.mockResolvedValue(product);

      const result = await service.getById(1);

      expect(result).toEqual(product);
    });

    it('throws AppError 404 when product does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getById(99)).rejects.toThrow(AppError);
      await expect(service.getById(99)).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('create', () => {
    it('creates and returns a new product', async () => {
      const dto: CreateProductDto = { code: 'P001', name: 'Cola', price: 1.5, quantity: 10, categoryId: 1 };
      repository.create.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto);

      expect(result).toMatchObject(dto);
      expect(repository.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('updates an existing product', async () => {
      const dto: UpdateProductDto = { code: 'P001', name: 'Cola Updated', price: 2.0, quantity: 10, categoryId: 1 };
      repository.findById.mockResolvedValue(product);
      repository.update.mockResolvedValue({ ...product, ...dto });

      const result = await service.update(1, dto);

      expect(result.name).toBe('Cola Updated');
      expect(repository.update).toHaveBeenCalledWith(1, dto);
    });

    it('throws AppError 404 when product does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update(99, {} as UpdateProductDto)).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('delete', () => {
    it('deletes an existing product', async () => {
      repository.findById.mockResolvedValue(product);
      repository.delete.mockResolvedValue(undefined);

      await expect(service.delete(1)).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('throws AppError 404 when product does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.delete(99)).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
