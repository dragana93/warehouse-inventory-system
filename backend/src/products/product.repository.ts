import prisma from '../database/database.client';
import { CreateProductDto, Product, UpdateProductDto } from './product.model';

export class ProductRepository {
  async findAll(): Promise<Product[]> {
    return prisma.product.findMany();
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
