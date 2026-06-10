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
      { id: 1, name: 'Beverages', totalStock: 120 },
      { id: 2, name: 'Snacks', totalStock: 80 },
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

  it('should return zero totalStock for a category with no products', async () => {
    const report: StockReport[] = [{ id: 1, name: 'Empty', totalStock: 0 }];
    mockRepository.getStockPerCategory.mockResolvedValue(report);

    const result = await service.getStockPerCategory();

    expect(result[0]).toMatchObject({ totalStock: 0 });
  });
});
