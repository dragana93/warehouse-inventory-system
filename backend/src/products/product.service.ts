import { AppError } from '../middleware/error.middleware';
import { CreateProductDto, Product, ProductListResponse, ProductQuery, UpdateProductDto } from './product.model';
import { ProductRepository } from './product.repository';

export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  async getAll(query: ProductQuery = {}): Promise<ProductListResponse> {
    return this.repository.findAll(query);
  }

  async getById(id: number): Promise<Product> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new AppError(404, `Product with id ${id} not found`);
    }
    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    return this.repository.create(dto);
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new AppError(404, `Product with id ${id} not found`);
    }
    return this.repository.update(id, dto);
  }

  async delete(id: number): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new AppError(404, `Product with id ${id} not found`);
    }
    await this.repository.delete(id);
  }
}
