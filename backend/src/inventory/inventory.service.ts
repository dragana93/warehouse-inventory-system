import { AppError } from '../middleware/error.middleware';
import { ProductRepository } from '../products/product.repository';
import { StockUpdateDto, StockUpdateResult } from './inventory.model';

export class InventoryService {
  constructor(private readonly productRepository: ProductRepository) {}

  async increaseStock(productId: number, dto: StockUpdateDto): Promise<StockUpdateResult> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new AppError(404, `Product with id ${productId} not found`);
    }
    const updated = await this.productRepository.updateQuantity(
      productId,
      product.quantity + dto.amount
    );
    return { id: updated.id, quantity: updated.quantity };
  }

  async decreaseStock(productId: number, dto: StockUpdateDto): Promise<StockUpdateResult> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new AppError(404, `Product with id ${productId} not found`);
    }
    const newQuantity = product.quantity - dto.amount;
    if (newQuantity < 0) {
      throw new AppError(400, 'Stock cannot be negative', true);
    }
    const updated = await this.productRepository.updateQuantity(productId, newQuantity);
    return { id: updated.id, quantity: updated.quantity };
  }
}
