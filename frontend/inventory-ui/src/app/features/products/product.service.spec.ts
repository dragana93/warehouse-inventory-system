import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product, ProductPayload } from '../../models/product.model';

const BASE_URL = 'http://localhost:3000/products';

const mockProduct: Product = {
  id: 1,
  code: 'P001',
  name: 'Widget',
  price: 9.99,
  quantity: 100,
  categoryId: 1,
  category: { id: 1, name: 'Electronics' },
};

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should GET all products', () => {
      const mock: Product[] = [mockProduct];

      service.getAll().subscribe((result) => expect(result).toEqual(mock));

      const req = httpMock.expectOne(BASE_URL);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('getById', () => {
    it('should GET a single product by id', () => {
      service.getById(1).subscribe((result) => expect(result).toEqual(mockProduct));

      const req = httpMock.expectOne(`${BASE_URL}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });
  });

  describe('create', () => {
    it('should POST a new product', () => {
      const payload: ProductPayload = {
        code: 'P001',
        name: 'Widget',
        price: 9.99,
        quantity: 100,
        categoryId: 1,
      };

      service.create(payload).subscribe((result) => expect(result).toEqual(mockProduct));

      const req = httpMock.expectOne(BASE_URL);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(mockProduct);
    });
  });

  describe('update', () => {
    it('should PUT an updated product', () => {
      const payload: ProductPayload = {
        code: 'P001',
        name: 'Updated Widget',
        price: 12.99,
        quantity: 80,
        categoryId: 1,
      };
      const updated = { ...mockProduct, name: 'Updated Widget' };

      service.update(1, payload).subscribe((result) => expect(result).toEqual(updated));

      const req = httpMock.expectOne(`${BASE_URL}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(payload);
      req.flush(updated);
    });
  });

  describe('delete', () => {
    it('should DELETE a product by id', () => {
      service.delete(1).subscribe((result) => expect(result).toBeNull());

      const req = httpMock.expectOne(`${BASE_URL}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
