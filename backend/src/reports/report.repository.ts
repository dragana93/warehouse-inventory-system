import prisma from '../database/database.client';
import { StockReport } from './report.model';

export class ReportRepository {
  async getStockPerCategory(): Promise<StockReport[]> {
    const rows = await prisma.category.findMany({
      include: {
        products: { select: { quantity: true } },
      },
    });
    return rows.map((row) => ({
      category: row.name,
      totalQuantity: row.products.reduce((sum, p) => sum + p.quantity, 0),
    }));
  }
}
