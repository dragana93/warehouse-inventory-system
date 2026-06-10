import { StockReport } from './report.model';
import { ReportRepository } from './report.repository';
import { ReportService } from './report.service';

jest.mock('./report.repository');

const mockRepository = new ReportRepository() as jest.Mocked<ReportRepository>;
const service = new ReportService(mockRepository);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ReportService.getStockPerCategory', () => {
  it('should return stock totals per category', async () => {
    const report: StockReport[] = [
      { category: 'Beverages', totalQuantity: 120 },
      { category: 'Snacks', totalQuantity: 80 },
    ];
    mockRepository.getStockPerCategory.mockResolvedValue(report);

    const result = await service.getStockPerCategory();

    expect(result).toEqual(report);
    expect(mockRepository.getStockPerCategory).toHaveBeenCalledTimes(1);
  });

  it('should return an empty array when no categories exist', async () => {
    mockRepository.getStockPerCategory.mockResolvedValue([]);

    const result = await service.getStockPerCategory();

    expect(result).toEqual([]);
  });

  it('should return zero totalQuantity for a category with no products', async () => {
    const report: StockReport[] = [{ category: 'Empty', totalQuantity: 0 }];
    mockRepository.getStockPerCategory.mockResolvedValue(report);

    const result = await service.getStockPerCategory();

    expect(result[0]).toMatchObject({ totalQuantity: 0 });
  });
});
