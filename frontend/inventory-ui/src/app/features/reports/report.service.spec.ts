import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ReportService } from './report.service';
import { CategoryStockReport } from '../../models/report.model';

describe('ReportService', () => {
  let service: ReportService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ReportService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getStockByCategory() should GET /reports/stock', () => {
    const mock: CategoryStockReport[] = [
      { category: 'Beverages', totalQuantity: 120 },
      { category: 'Snacks', totalQuantity: 80 },
    ];

    service.getStockByCategory().subscribe((data) => {
      expect(data).toEqual(mock);
    });

    const req = http.expectOne('http://localhost:3000/reports/stock');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });
});
