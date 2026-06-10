import { AppError } from '../middleware/error.middleware';
import { AuditLogRepository } from '../audit-log/audit-log.repository';
import { ProductRepository } from '../products/product.repository';
import { StockUpdateDto, StockUpdateResult } from './inventory.model';

export class InventoryService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async increaseStock(productId: number, dto: StockUpdateDto): Promise<StockUpdateResult> {
    if (dto.amount <= 0) {
      throw new AppError(400, 'Amount must be greater than zero', true);
    }
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new AppError(404, `Product with id ${productId} not found`);
    }
    const newQuantity = product.quantity + dto.amount;
    const updated = await this.productRepository.updateQuantity(productId, newQuantity);
    await this.auditLogRepository.create({
      productId,
      oldQuantity: product.quantity,
      newQuantity: updated.quantity,
      action: 'increase',
    });
    return { id: updated.id, quantity: updated.quantity };
  }

  async decreaseStock(productId: number, dto: StockUpdateDto): Promise<StockUpdateResult> {
    if (dto.amount <= 0) {
      throw new AppError(400, 'Amount must be greater than zero', true);
    }
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new AppError(404, `Product with id ${productId} not found`);
    }
    const newQuantity = product.quantity - dto.amount;
    if (newQuantity < 0) {
      throw new AppError(400, 'Stock cannot be negative', true);
    }
    const updated = await this.productRepository.updateQuantity(productId, newQuantity);
    await this.auditLogRepository.create({
      productId,
      oldQuantity: product.quantity,
      newQuantity: updated.quantity,
      action: 'decrease',
    });
    return { id: updated.id, quantity: updated.quantity };
  }
}

