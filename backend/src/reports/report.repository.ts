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
      id: row.id,
      name: row.name,
      totalStock: row.products.reduce((sum, p) => sum + p.quantity, 0),
    }));
  }
}
