import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryStockReport } from '../../models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/reports';

  getStockByCategory(): Observable<CategoryStockReport[]> {
    return this.http.get<CategoryStockReport[]>(`${this.baseUrl}/stock`);
  }
}
