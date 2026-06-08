import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { InventoryService } from './inventory.service';
import { InventoryHistory } from '../models/models';

describe('InventoryService', () => {
  let service: InventoryService;
  let http: HttpTestingController;
  const apiUrl = 'http://localhost:3000/api/inventory';

  const mockHistory: InventoryHistory = {
    id: 1,
    productId: 1,
    oldQuantity: 100,
    newQuantity: 80,
    action: 'SALE',
    timestamp: '2026-06-08T10:00:00.000Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), InventoryService],
    });
    service = TestBed.inject(InventoryService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getHistory() sends GET to history endpoint', () => {
    service.getHistory().subscribe(result => {
      expect(result).toEqual([mockHistory]);
    });

    http.expectOne(`${apiUrl}/history`).flush([mockHistory]);
  });

  it('updateStock() sends PATCH with quantity and action', () => {
    service.updateStock(1, 80, 'SALE').subscribe();

    const req = http.expectOne(`${apiUrl}/stock/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ newQuantity: 80, action: 'SALE' });
    req.flush({ product: {}, history: mockHistory });
  });
});
