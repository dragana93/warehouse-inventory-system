import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { Category, CategoryPayload } from '../../models/category.model';

const BASE_URL = 'http://localhost:3000/categories';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should GET all categories', () => {
      const mock: Category[] = [
        { id: 1, name: 'Electronics' },
        { id: 2, name: 'Clothing' },
      ];

      service.getAll().subscribe((result) => expect(result).toEqual(mock));

      const req = httpMock.expectOne(BASE_URL);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('create', () => {
    it('should POST a new category', () => {
      const payload: CategoryPayload = { name: 'Books' };
      const created: Category = { id: 3, name: 'Books' };

      service.create(payload).subscribe((result) => expect(result).toEqual(created));

      const req = httpMock.expectOne(BASE_URL);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(created);
    });
  });

  describe('update', () => {
    it('should PUT an updated category', () => {
      const payload: CategoryPayload = { name: 'Updated' };
      const updated: Category = { id: 1, name: 'Updated' };

      service.update(1, payload).subscribe((result) => expect(result).toEqual(updated));

      const req = httpMock.expectOne(`${BASE_URL}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(payload);
      req.flush(updated);
    });
  });

  describe('delete', () => {
    it('should DELETE a category by id', () => {
      service.delete(1).subscribe((result) => expect(result).toBeNull());

      const req = httpMock.expectOne(`${BASE_URL}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
