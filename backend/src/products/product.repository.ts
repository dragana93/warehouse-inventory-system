import prisma from '../database/database.client';
import { CreateProductDto, Product, ProductQuery, UpdateProductDto } from './product.model';

export class ProductRepository {
  async findAll(query: ProductQuery = {}): Promise<Product[]> {
    const where: { categoryId?: number; code?: string } = {};
    if (query.categoryId !== undefined) where.categoryId = query.categoryId;
    if (query.code !== undefined) where.code = query.code;

    const orderBy: { name?: 'asc' | 'desc'; quantity?: 'asc' | 'desc' } = {};
    if (query.sortBy) orderBy[query.sortBy] = query.sortOrder ?? 'asc';

    return prisma.product.findMany({ where, orderBy });
  }

  async findById(id: number): Promise<Product | null> {
    return prisma.product.findUnique({ where: { id } });
  }

  async create(dto: CreateProductDto): Promise<Product> {
    return prisma.product.create({ data: dto });
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    return prisma.product.update({ where: { id }, data: dto });
  }

  async updateQuantity(id: number, quantity: number): Promise<Product> {
    return prisma.product.update({ where: { id }, data: { quantity } });
  }

  async delete(id: number): Promise<void> {
    await prisma.product.delete({ where: { id } });
  }
}
