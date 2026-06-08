import prisma from "../utils/prisma";
import { AppError } from "../middleware/error.middleware";

export class InventoryService {
  async getHistory() {
    return prisma.inventoryHistory.findMany({
      include: { product: true },
      orderBy: { timestamp: "desc" },
    });
  }

  async updateStock(productId: number, newQuantity: number, action: string) {
    if (newQuantity < 0) {
      throw new AppError(400, "Stock cannot go below zero", true);
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new AppError(404, "Product not found");

    const [updatedProduct, history] = await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: { quantity: newQuantity },
      }),
      prisma.inventoryHistory.create({
        data: {
          productId,
          oldQuantity: product.quantity,
          newQuantity,
          action,
        },
      }),
    ]);

    return { product: updatedProduct, history };
  }
}
