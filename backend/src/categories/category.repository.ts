import prisma from '../database/database.client';
import { Category, CategorySummary, CreateCategoryDto, UpdateCategoryDto } from './category.model';

export class CategoryRepository {
  async findAll(): Promise<Category[]> {
    return prisma.category.findMany();
  }

  async findById(id: number): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id } });
  }

  async getSummary(): Promise<CategorySummary[]> {
    const rows = await prisma.category.findMany({
      include: {
        products: { select: { quantity: true } },
      },
    });
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      totalStock: row.products.reduce((sum, p) => sum + p.quantity, 0),
    }));
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    return prisma.category.create({ data: dto });
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    return prisma.category.update({ where: { id }, data: dto });
  }

  async delete(id: number): Promise<void> {
    await prisma.category.delete({ where: { id } });
  }
}
