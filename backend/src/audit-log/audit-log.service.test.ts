import { AuditLogResponse } from './audit-log.model';
import { AuditLogRepository } from './audit-log.repository';
import { AuditLogService } from './audit-log.service';

jest.mock('./audit-log.repository');

const mockRepository = new AuditLogRepository() as jest.Mocked<AuditLogRepository>;
const service = new AuditLogService(mockRepository);

const sampleEntry: AuditLogResponse = {
  id: 1,
  date: '2026-01-01T00:00:00.000Z',
  product: 'Widget',
  oldQuantity: 50,
  newQuantity: 60,
  action: 'increase',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AuditLogService.getAll', () => {
  it('should return all audit log entries', async () => {
    mockRepository.findAll.mockResolvedValue([sampleEntry]);

    const result = await service.getAll();

    expect(result).toEqual([sampleEntry]);
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return an empty array when no entries exist', async () => {
    mockRepository.findAll.mockResolvedValue([]);

    const result = await service.getAll();

    expect(result).toEqual([]);
  });
});

describe('AuditLogService.getByProductId', () => {
  it('should return entries for a specific product', async () => {
    mockRepository.findByProductId.mockResolvedValue([sampleEntry]);

    const result = await service.getByProductId(1);

    expect(result).toEqual([sampleEntry]);
    expect(mockRepository.findByProductId).toHaveBeenCalledWith(1);
  });

  it('should return an empty array when product has no history', async () => {
    mockRepository.findByProductId.mockResolvedValue([]);

    const result = await service.getByProductId(99);

    expect(result).toEqual([]);
    expect(mockRepository.findByProductId).toHaveBeenCalledWith(99);
  });
});
