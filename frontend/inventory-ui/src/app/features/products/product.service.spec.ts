import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product, ProductListResponse, ProductPayload } from '../../models/product.model';

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

const mockListResponse: ProductListResponse = {
  data: [mockProduct],
  total: 1,
  page: 1,
  pageSize: 10,
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
    it('should GET all products and return ProductListResponse', () => {
      service.getAll().subscribe((result) => expect(result).toEqual(mockListResponse));

      const req = httpMock.expectOne(BASE_URL);
      expect(req.request.method).toBe('GET');
      req.flush(mockListResponse);
    });

    it('should include search param when provided', () => {
      service.getAll({ search: 'widget' }).subscribe();
      const req = httpMock.expectOne((r) => r.url === BASE_URL);
      expect(req.request.params.get('search')).toBe('widget');
      req.flush(mockListResponse);
    });

    it('should include categoryId param when provided', () => {
      service.getAll({ categoryId: 2 }).subscribe();
      const req = httpMock.expectOne((r) => r.url === BASE_URL);
      expect(req.request.params.get('categoryId')).toBe('2');
      req.flush(mockListResponse);
    });

    it('should include sortBy and sortOrder params when provided', () => {
      service.getAll({ sortBy: 'name', sortOrder: 'desc' }).subscribe();
      const req = httpMock.expectOne((r) => r.url === BASE_URL);
      expect(req.request.params.get('sortBy')).toBe('name');
      expect(req.request.params.get('sortOrder')).toBe('desc');
      req.flush(mockListResponse);
    });

    it('should include page and pageSize params when provided', () => {
      service.getAll({ page: 2, pageSize: 20 }).subscribe();
      const req = httpMock.expectOne((r) => r.url === BASE_URL);
      expect(req.request.params.get('page')).toBe('2');
      expect(req.request.params.get('pageSize')).toBe('20');
      req.flush(mockListResponse);
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
