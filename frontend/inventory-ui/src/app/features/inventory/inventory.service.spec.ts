import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { InventoryService } from './inventory.service';
import { InventoryHistoryEntry, StockUpdateResult } from '../../models/inventory.model';

const BASE_URL = 'http://localhost:3000/inventory';

const mockStockResult: StockUpdateResult = {
  id: 1,
  quantity: 60,
};

describe('InventoryService', () => {
  let service: InventoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(InventoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('increase', () => {
    it('should POST to /inventory/:productId/increase with amount in body', () => {
      service.increase(1, 10).subscribe((result) => expect(result).toEqual(mockStockResult));

      const req = httpMock.expectOne(`${BASE_URL}/1/increase`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ amount: 10 });
      req.flush(mockStockResult);
    });
  });

  describe('decrease', () => {
    it('should POST to /inventory/:productId/decrease with amount in body', () => {
      const decreaseResult: StockUpdateResult = { id: 1, quantity: 45 };

      service.decrease(1, 5).subscribe((result) => expect(result).toEqual(decreaseResult));

      const req = httpMock.expectOne(`${BASE_URL}/1/decrease`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ amount: 5 });
      req.flush(decreaseResult);
    });
  });

  describe('getHistory', () => {
    it('should GET inventory history', () => {
      const mockHistory: InventoryHistoryEntry[] = [
        {
          id: 1,
          date: '2026-06-09T10:00:00.000Z',
          product: 'Widget',
          oldQuantity: 50,
          newQuantity: 60,
          action: 'increase',
        },
      ];

      service.getHistory().subscribe((result) => expect(result).toEqual(mockHistory));

      const req = httpMock.expectOne(`${BASE_URL}/history`);
      expect(req.request.method).toBe('GET');
      req.flush(mockHistory);
    });
  });
});
