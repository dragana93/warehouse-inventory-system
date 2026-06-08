import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

interface HistoryEntry {
  id: number;
  timestamp: string;
  product: string;
  oldQuantity: number;
  newQuantity: number;
  action: string;
}

@Component({
  selector: 'app-inventory-history',
  standalone: true,
  imports: [DatePipe, MatTableModule, MatSortModule],
  template: `
    <div class="container">
      <h1>Inventory History</h1>

      <table mat-table [dataSource]="entries()" matSort>
        <ng-container matColumnDef="timestamp">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
          <td mat-cell *matCellDef="let e">{{ e.timestamp | date:'short' }}</td>
        </ng-container>
        <ng-container matColumnDef="product">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Product</th>
          <td mat-cell *matCellDef="let e">{{ e.product }}</td>
        </ng-container>
        <ng-container matColumnDef="oldQuantity">
          <th mat-header-cell *matHeaderCellDef>Old Quantity</th>
          <td mat-cell *matCellDef="let e">{{ e.oldQuantity }}</td>
        </ng-container>
        <ng-container matColumnDef="newQuantity">
          <th mat-header-cell *matHeaderCellDef>New Quantity</th>
          <td mat-cell *matCellDef="let e">{{ e.newQuantity }}</td>
        </ng-container>
        <ng-container matColumnDef="action">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Action</th>
          <td mat-cell *matCellDef="let e">{{ e.action }}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns"></tr>
      </table>
    </div>
  `,
  styles: [`
    .container { padding: 24px; }
    table { width: 100%; }
  `],
})
export class InventoryHistoryComponent implements OnInit {
  readonly columns = ['timestamp', 'product', 'oldQuantity', 'newQuantity', 'action'];
  readonly entries = signal<HistoryEntry[]>([]);

  ngOnInit(): void {
    // TODO: load from InventoryService
  }
}
