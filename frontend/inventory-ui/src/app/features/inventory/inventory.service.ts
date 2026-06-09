import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryHistoryEntry, StockUpdateResult } from '../../models/inventory.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/inventory';

  increase(productId: number, amount: number): Observable<StockUpdateResult> {
    return this.http.post<StockUpdateResult>(`${this.baseUrl}/${productId}/increase`, { amount });
  }

  decrease(productId: number, amount: number): Observable<StockUpdateResult> {
    return this.http.post<StockUpdateResult>(`${this.baseUrl}/${productId}/decrease`, { amount });
  }

  getHistory(): Observable<InventoryHistoryEntry[]> {
    return this.http.get<InventoryHistoryEntry[]>(`${this.baseUrl}/history`);
  }
}
