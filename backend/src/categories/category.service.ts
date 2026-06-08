import { AppError } from '../middleware/error.middleware';
import { Category, CreateCategoryDto, UpdateCategoryDto } from './category.model';
import { CategoryRepository } from './category.repository';

export class CategoryService {
  constructor(private readonly repository: CategoryRepository) {}

  async getAll(): Promise<Category[]> {
    return this.repository.findAll();
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    return this.repository.create(dto);
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new AppError(404, `Category with id ${id} not found`);
    }
    return this.repository.update(id, dto);
  }

  async delete(id: number): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new AppError(404, `Category with id ${id} not found`);
    }
    await this.repository.delete(id);
  }
}
