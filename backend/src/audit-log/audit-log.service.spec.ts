import { AuditLogService } from './audit-log.service';
import { AuditLogRepository } from './audit-log.repository';

jest.mock('./audit-log.repository');

const MockRepo = AuditLogRepository as jest.MockedClass<typeof AuditLogRepository>;

describe('AuditLogService', () => {
  let service: AuditLogService;
  let repository: jest.Mocked<AuditLogRepository>;

  const entry = {
    id: 1,
    productId: 1,
    oldQuantity: 10,
    newQuantity: 15,
    action: 'increase' as const,
    timestamp: new Date(),
  };

  beforeEach(() => {
    MockRepo.mockClear();
    service = new AuditLogService(new AuditLogRepository());
    repository = MockRepo.mock.instances[0] as jest.Mocked<AuditLogRepository>;
  });

  describe('getAll', () => {
    it('returns all audit log entries', async () => {
      repository.findAll.mockResolvedValue([entry]);

      const result = await service.getAll();

      expect(result).toEqual([entry]);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('returns empty array when there are no entries', async () => {
      repository.findAll.mockResolvedValue([]);

      const result = await service.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('getByProductId', () => {
    it('returns entries for the given product id', async () => {
      repository.findByProductId.mockResolvedValue([entry]);

      const result = await service.getByProductId(1);

      expect(result).toEqual([entry]);
      expect(repository.findByProductId).toHaveBeenCalledWith(1);
    });

    it('returns empty array when product has no history', async () => {
      repository.findByProductId.mockResolvedValue([]);

      const result = await service.getByProductId(99);

      expect(result).toEqual([]);
    });
  });
});
