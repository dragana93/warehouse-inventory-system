import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CategoryService } from './category.service';
import { Category } from '../models/models';

describe('CategoryService', () => {
  let service: CategoryService;
  let http: HttpTestingController;
  const apiUrl = 'http://localhost:3000/api/categories';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), CategoryService],
    });
    service = TestBed.inject(CategoryService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getAll() sends GET and returns categories', () => {
    const categories: Category[] = [{ id: 1, name: 'Beverages' }];

    service.getAll().subscribe(result => {
      expect(result).toEqual(categories);
    });

    http.expectOne(apiUrl).flush(categories);
  });

  it('getById() sends GET to correct URL', () => {
    const category: Category = { id: 1, name: 'Beverages' };

    service.getById(1).subscribe(result => {
      expect(result).toEqual(category);
    });

    http.expectOne(`${apiUrl}/1`).flush(category);
  });

  it('create() sends POST with data', () => {
    const category: Category = { id: 2, name: 'Snacks' };

    service.create({ name: 'Snacks' }).subscribe(result => {
      expect(result).toEqual(category);
    });

    const req = http.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'Snacks' });
    req.flush(category);
  });

  it('update() sends PUT with data', () => {
    const updated: Category = { id: 1, name: 'Drinks' };

    service.update(1, { name: 'Drinks' }).subscribe(result => {
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
