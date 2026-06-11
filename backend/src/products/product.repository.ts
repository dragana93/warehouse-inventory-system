import prisma from '../database/database.client';
import { CreateProductDto, Product, ProductListResponse, ProductQuery, UpdateProductDto } from './product.model';

export class ProductRepository {
  async findAll(query: ProductQuery = {}): Promise<ProductListResponse> {
    const where: { name?: { contains: string }; categoryId?: number; code?: string } = {};
    if (query.search !== undefined) where.name = { contains: query.search };
    if (query.categoryId !== undefined) where.categoryId = query.categoryId;
    if (query.code !== undefined) where.code = query.code;

    const orderBy: { name?: 'asc' | 'desc'; quantity?: 'asc' | 'desc' } = {};
    if (query.sortBy) orderBy[query.sortBy] = query.sortOrder ?? 'asc';

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy, skip, take: pageSize, include: { category: true } }),
      prisma.product.count({ where }),
    ]);

    return { data, total, page, pageSize };
  }

  async findById(id: number): Promise<Product | null> {
    return prisma.product.findUnique({ where: { id }, include: { category: true } });
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
