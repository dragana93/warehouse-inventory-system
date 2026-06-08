import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryHistory } from '../models/models';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly apiUrl = 'http://localhost:3000/api/inventory';

  constructor(private readonly http: HttpClient) {}

  getHistory(): Observable<InventoryHistory[]> {
    return this.http.get<InventoryHistory[]>(`${this.apiUrl}/history`);
  }

  updateStock(productId: number, newQuantity: number, action: string): Observable<{ product: unknown; history: InventoryHistory }> {
    return this.http.patch<{ product: unknown; history: InventoryHistory }>(
      `${this.apiUrl}/stock/${productId}`,
      { newQuantity, action }
    );
  }
}
