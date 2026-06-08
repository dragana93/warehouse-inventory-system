import prisma from '../database/database.client';
import { Category, CreateCategoryDto, UpdateCategoryDto } from './category.model';

export class CategoryRepository {
  async findAll(): Promise<Category[]> {
    return prisma.category.findMany();
  }

  async findById(id: number): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id } });
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
