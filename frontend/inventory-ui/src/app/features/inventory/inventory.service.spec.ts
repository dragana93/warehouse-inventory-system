import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { InventoryService } from './inventory.service';
import { InventoryUpdatePayload, InventoryUpdateResult } from '../../models/inventory.model';

const BASE_URL = 'http://localhost:3000/inventory';

const mockResult: InventoryUpdateResult = {
  productId: 1,
  previousQuantity: 50,
  newQuantity: 60,
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
    it('should POST to /inventory/increase with payload', () => {
      const payload: InventoryUpdatePayload = { productId: 1, quantity: 10 };

      service.increase(payload).subscribe((result) => expect(result).toEqual(mockResult));

      const req = httpMock.expectOne(`${BASE_URL}/increase`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(mockResult);
    });
  });

  describe('decrease', () => {
    it('should POST to /inventory/decrease with payload', () => {
      const payload: InventoryUpdatePayload = { productId: 1, quantity: 5 };
      const decreaseResult: InventoryUpdateResult = { ...mockResult, newQuantity: 45 };

      service.decrease(payload).subscribe((result) => expect(result).toEqual(decreaseResult));

      const req = httpMock.expectOne(`${BASE_URL}/decrease`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(decreaseResult);
    });
  });
});
