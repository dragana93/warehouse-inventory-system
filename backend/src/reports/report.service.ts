import { StockReport } from './report.model';
import { ReportRepository } from './report.repository';

export class ReportService {
  constructor(private readonly repository: ReportRepository) {}

  async getStockPerCategory(): Promise<StockReport[]> {
    return this.repository.getStockPerCategory();
  }
}
