import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductService, CreateProductDto } from './product.service';
import { Product } from '../models/models';

describe('ProductService', () => {
  let service: ProductService;
  let http: HttpTestingController;
  const apiUrl = 'http://localhost:3000/api/products';

  const mockProduct: Product = {
    id: 1,
    code: 'PRD-001',
    name: 'Water Bottle',
    price: 1.5,
    quantity: 100,
    categoryId: 1,
    category: { id: 1, name: 'Beverages' },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ProductService],
    });
    service = TestBed.inject(ProductService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getAll() sends GET and returns products', () => {
    service.getAll().subscribe(result => {
      expect(result).toEqual([mockProduct]);
    });

    http.expectOne(apiUrl).flush([mockProduct]);
  });

  it('getById() sends GET to correct URL', () => {
    service.getById(1).subscribe(result => {
      expect(result).toEqual(mockProduct);
    });

    http.expectOne(`${apiUrl}/1`).flush(mockProduct);
  });

  it('create() sends POST with product data', () => {
    const dto: CreateProductDto = {
      code: 'PRD-001',
      name: 'Water Bottle',
      price: 1.5,
      quantity: 100,
      categoryId: 1,
    };

    service.create(dto).subscribe(result => {
      expect(result).toEqual(mockProduct);
    });

    const req = http.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(mockProduct);
  });

  it('update() sends PUT with partial data', () => {
    const updated = { ...mockProduct, name: 'Updated Bottle' };

    service.update(1, { name: 'Updated Bottle' }).subscribe(result => {
      expect(result).toEqual(updated);
    });

    const req = http.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updated);
  });

  it('delete() sends DELETE to correct URL', () => {
    service.delete(1).subscribe();

    const req = http.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
