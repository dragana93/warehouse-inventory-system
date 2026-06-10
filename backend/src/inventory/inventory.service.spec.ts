import { InventoryService } from './inventory.service';
import { ProductRepository } from '../products/product.repository';
import { AuditLogRepository } from '../audit-log/audit-log.repository';
import { AppError } from '../middleware/error.middleware';

jest.mock('../products/product.repository');
jest.mock('../audit-log/audit-log.repository');

const MockProductRepo = ProductRepository as jest.MockedClass<typeof ProductRepository>;
const MockAuditRepo = AuditLogRepository as jest.MockedClass<typeof AuditLogRepository>;

describe('InventoryService', () => {
  let service: InventoryService;
  let productRepository: jest.Mocked<ProductRepository>;
  let auditLogRepository: jest.Mocked<AuditLogRepository>;

  const product = { id: 1, code: 'P001', name: 'Cola', price: 1.5, quantity: 10, categoryId: 1 };
  const auditEntry = { id: 1, productId: 1, oldQuantity: 10, newQuantity: 15, action: 'increase' as const, timestamp: new Date() };

  beforeEach(() => {
    MockProductRepo.mockClear();
    MockAuditRepo.mockClear();
    service = new InventoryService(new ProductRepository(), new AuditLogRepository());
    productRepository = MockProductRepo.mock.instances[0] as jest.Mocked<ProductRepository>;
    auditLogRepository = MockAuditRepo.mock.instances[0] as jest.Mocked<AuditLogRepository>;
  });

  describe('increaseStock', () => {
    it('increases stock by the given amount and records an audit log entry', async () => {
      productRepository.findById.mockResolvedValue(product);
      productRepository.updateQuantity.mockResolvedValue({ ...product, quantity: 15 });
      auditLogRepository.create.mockResolvedValue(auditEntry);

      const result = await service.increaseStock(1, { amount: 5 });

      expect(result).toEqual({ id: 1, quantity: 15 });
      expect(productRepository.updateQuantity).toHaveBeenCalledWith(1, 15);
      expect(auditLogRepository.create).toHaveBeenCalledWith({
        productId: 1,
        oldQuantity: 10,
        newQuantity: 15,
        action: 'increase',
      });
    });

    it('throws AppError 404 when product does not exist', async () => {
      productRepository.findById.mockResolvedValue(null);

      await expect(service.increaseStock(99, { amount: 5 })).rejects.toThrow(AppError);
      await expect(service.increaseStock(99, { amount: 5 })).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('decreaseStock', () => {
    it('decreases stock by the given amount and records an audit log entry', async () => {
      productRepository.findById.mockResolvedValue(product);
      productRepository.updateQuantity.mockResolvedValue({ ...product, quantity: 7 });
      auditLogRepository.create.mockResolvedValue({ ...auditEntry, newQuantity: 7, action: 'decrease' });

      const result = await service.decreaseStock(1, { amount: 3 });

      expect(result).toEqual({ id: 1, quantity: 7 });
      expect(productRepository.updateQuantity).toHaveBeenCalledWith(1, 7);
      expect(auditLogRepository.create).toHaveBeenCalledWith({
        productId: 1,
        oldQuantity: 10,
        newQuantity: 7,
        action: 'decrease',
      });
    });

    it('throws AppError 400 when stock would become negative', async () => {
      productRepository.findById.mockResolvedValue(product);

      let error!: AppError;
      await service.decreaseStock(1, { amount: 20 }).catch((e: unknown) => {
        error = e as AppError;
      });

      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(400);
      expect(error.isValidation).toBe(true);
      expect(productRepository.updateQuantity).not.toHaveBeenCalled();
    });

    it('throws AppError 404 when product does not exist', async () => {
      productRepository.findById.mockResolvedValue(null);

      await expect(service.decreaseStock(99, { amount: 1 })).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
