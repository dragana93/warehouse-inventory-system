import prisma from "../utils/prisma";

export class CategoryService {
  async getAll() {
    return prisma.category.findMany({ include: { products: false } });
  }

  async getById(id: number) {
    return prisma.category.findUnique({ where: { id } });
  }

  async create(data: { name: string }) {
    return prisma.category.create({ data });
  }

  async update(id: number, data: { name: string }) {
    return prisma.category.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.category.delete({ where: { id } });
  }
}
