import prisma from "../utils/prisma";
import { AppError } from "../middleware/error.middleware";

export interface CreateProductDto {
  code: string;
  name: string;
  price: number;
  quantity: number;
  categoryId: number;
}

export class ProductService {
  async getAll() {
    return prisma.product.findMany({ include: { category: true } });
  }

  async getById(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) throw new AppError(404, "Product not found");
    return product;
  }

  async create(data: CreateProductDto) {
    return prisma.product.create({ data });
  }

  async update(id: number, data: Partial<CreateProductDto>) {
    await this.getById(id);
    return prisma.product.update({ where: { id }, data });
  }

  async delete(id: number) {
    await this.getById(id);
    return prisma.product.delete({ where: { id } });
  }
}
