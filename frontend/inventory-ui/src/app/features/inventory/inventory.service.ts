import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryHistoryEntry, InventoryUpdatePayload, InventoryUpdateResult } from '../../models/inventory.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/inventory';

  increase(payload: InventoryUpdatePayload): Observable<InventoryUpdateResult> {
    return this.http.post<InventoryUpdateResult>(`${this.baseUrl}/increase`, payload);
  }

  decrease(payload: InventoryUpdatePayload): Observable<InventoryUpdateResult> {
    return this.http.post<InventoryUpdateResult>(`${this.baseUrl}/decrease`, payload);
  }

  getHistory(): Observable<InventoryHistoryEntry[]> {
    return this.http.get<InventoryHistoryEntry[]>(`${this.baseUrl}/history`);
  }
}
