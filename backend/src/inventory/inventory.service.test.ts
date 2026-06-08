import { AppError } from '../middleware/error.middleware';
import { Product } from '../products/product.model';
import { ProductRepository } from '../products/product.repository';
import { InventoryService } from './inventory.service';

jest.mock('../products/product.repository');

const mockRepository = new ProductRepository() as jest.Mocked<ProductRepository>;
const service = new InventoryService(mockRepository);

const sampleProduct: Product = {
  id: 1,
  code: 'PROD-001',
  name: 'Widget',
  price: 9.99,
  quantity: 50,
  categoryId: 1,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('InventoryService.increaseStock', () => {
  it('should increase stock by the given amount', async () => {
    mockRepository.findById.mockResolvedValue(sampleProduct);
    mockRepository.updateQuantity.mockResolvedValue({ ...sampleProduct, quantity: 60 });

    const result = await service.increaseStock(1, { amount: 10 });

    expect(result).toEqual({ id: 1, quantity: 60 });
    expect(mockRepository.findById).toHaveBeenCalledWith(1);
    expect(mockRepository.updateQuantity).toHaveBeenCalledWith(1, 60);
  });

  it('should throw 404 AppError when product does not exist', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(service.increaseStock(99, { amount: 10 })).rejects.toThrow(AppError);
    await expect(service.increaseStock(99, { amount: 10 })).rejects.toMatchObject({
      statusCode: 404,
    });
    expect(mockRepository.updateQuantity).not.toHaveBeenCalled();
  });
});

describe('InventoryService.decreaseStock', () => {
  it('should decrease stock by the given amount', async () => {
    mockRepository.findById.mockResolvedValue(sampleProduct);
    mockRepository.updateQuantity.mockResolvedValue({ ...sampleProduct, quantity: 40 });

    const result = await service.decreaseStock(1, { amount: 10 });

    expect(result).toEqual({ id: 1, quantity: 40 });
    expect(mockRepository.findById).toHaveBeenCalledWith(1);
    expect(mockRepository.updateQuantity).toHaveBeenCalledWith(1, 40);
  });

  it('should decrease stock to zero', async () => {
    mockRepository.findById.mockResolvedValue(sampleProduct);
    mockRepository.updateQuantity.mockResolvedValue({ ...sampleProduct, quantity: 0 });

    const result = await service.decreaseStock(1, { amount: 50 });

    expect(result).toEqual({ id: 1, quantity: 0 });
    expect(mockRepository.updateQuantity).toHaveBeenCalledWith(1, 0);
  });

  it('should throw 400 AppError when decrease would result in negative quantity', async () => {
    mockRepository.findById.mockResolvedValue(sampleProduct);

    await expect(service.decreaseStock(1, { amount: 51 })).rejects.toThrow(AppError);
    await expect(service.decreaseStock(1, { amount: 51 })).rejects.toMatchObject({
      statusCode: 400,
    });
    expect(mockRepository.updateQuantity).not.toHaveBeenCalled();
  });

  it('should throw 404 AppError when product does not exist', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(service.decreaseStock(99, { amount: 10 })).rejects.toThrow(AppError);
    await expect(service.decreaseStock(99, { amount: 10 })).rejects.toMatchObject({
      statusCode: 404,
    });
    expect(mockRepository.updateQuantity).not.toHaveBeenCalled();
  });
});
