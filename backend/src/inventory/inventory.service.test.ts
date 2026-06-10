import { AppError } from '../middleware/error.middleware';
import { AuditLogRepository } from '../audit-log/audit-log.repository';
import { Product } from '../products/product.model';
import { ProductRepository } from '../products/product.repository';
import { InventoryService } from './inventory.service';

jest.mock('../products/product.repository');
jest.mock('../audit-log/audit-log.repository');

const mockRepository = new ProductRepository() as jest.Mocked<ProductRepository>;
const mockAuditLogRepository = new AuditLogRepository() as jest.Mocked<AuditLogRepository>;
const service = new InventoryService(mockRepository, mockAuditLogRepository);

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
  mockAuditLogRepository.create.mockResolvedValue({
    id: 1,
    productId: 1,
    oldQuantity: 50,
    newQuantity: 60,
    action: 'increase',
    timestamp: new Date(),
  });
});

describe('InventoryService.increaseStock', () => {
  it('should increase stock by the given amount', async () => {
    mockRepository.findById.mockResolvedValue(sampleProduct);
    mockRepository.updateQuantity.mockResolvedValue({ ...sampleProduct, quantity: 60 });

    const result = await service.increaseStock(1, { amount: 10 });

    expect(result).toEqual({ id: 1, quantity: 60 });
    expect(mockRepository.findById).toHaveBeenCalledWith(1);
    expect(mockRepository.updateQuantity).toHaveBeenCalledWith(1, 60);
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith({
      productId: 1,
      oldQuantity: 50,
      newQuantity: 60,
      action: 'increase',
    });
  });

  it('should throw 400 AppError when amount is zero', async () => {
    await expect(service.increaseStock(1, { amount: 0 })).rejects.toThrow(AppError);
    await expect(service.increaseStock(1, { amount: 0 })).rejects.toMatchObject({ statusCode: 400 });
    expect(mockRepository.findById).not.toHaveBeenCalled();
  });

  it('should throw 400 AppError when amount is negative', async () => {
    await expect(service.increaseStock(1, { amount: -5 })).rejects.toThrow(AppError);
    await expect(service.increaseStock(1, { amount: -5 })).rejects.toMatchObject({ statusCode: 400 });
    expect(mockRepository.findById).not.toHaveBeenCalled();
  });

  it('should throw 404 AppError when product does not exist', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(service.increaseStock(99, { amount: 10 })).rejects.toThrow(AppError);
    await expect(service.increaseStock(99, { amount: 10 })).rejects.toMatchObject({
      statusCode: 404,
    });
    expect(mockRepository.updateQuantity).not.toHaveBeenCalled();
    expect(mockAuditLogRepository.create).not.toHaveBeenCalled();
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
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith({
      productId: 1,
      oldQuantity: 50,
      newQuantity: 40,
      action: 'decrease',
    });
  });

  it('should decrease stock to zero', async () => {
    mockRepository.findById.mockResolvedValue(sampleProduct);
    mockRepository.updateQuantity.mockResolvedValue({ ...sampleProduct, quantity: 0 });

    const result = await service.decreaseStock(1, { amount: 50 });

    expect(result).toEqual({ id: 1, quantity: 0 });
    expect(mockRepository.updateQuantity).toHaveBeenCalledWith(1, 0);
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith({
      productId: 1,
      oldQuantity: 50,
      newQuantity: 0,
      action: 'decrease',
    });
  });

  it('should throw 400 AppError when amount is zero', async () => {
    await expect(service.decreaseStock(1, { amount: 0 })).rejects.toThrow(AppError);
    await expect(service.decreaseStock(1, { amount: 0 })).rejects.toMatchObject({ statusCode: 400 });
    expect(mockRepository.findById).not.toHaveBeenCalled();
  });

  it('should throw 400 AppError when amount is negative', async () => {
    await expect(service.decreaseStock(1, { amount: -5 })).rejects.toThrow(AppError);
    await expect(service.decreaseStock(1, { amount: -5 })).rejects.toMatchObject({ statusCode: 400 });
    expect(mockRepository.findById).not.toHaveBeenCalled();
  });

  it('should throw 400 AppError when decrease would result in negative quantity', async () => {
    mockRepository.findById.mockResolvedValue(sampleProduct);

    await expect(service.decreaseStock(1, { amount: 51 })).rejects.toThrow(AppError);
    await expect(service.decreaseStock(1, { amount: 51 })).rejects.toMatchObject({
      statusCode: 400,
    });
    expect(mockRepository.updateQuantity).not.toHaveBeenCalled();
    expect(mockAuditLogRepository.create).not.toHaveBeenCalled();
  });

  it('should throw 404 AppError when product does not exist', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(service.decreaseStock(99, { amount: 10 })).rejects.toThrow(AppError);
    await expect(service.decreaseStock(99, { amount: 10 })).rejects.toMatchObject({
      statusCode: 404,
    });
    expect(mockRepository.updateQuantity).not.toHaveBeenCalled();
    expect(mockAuditLogRepository.create).not.toHaveBeenCalled();
  });
});
