import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { InventoryHistoryEntry } from '../../../models/inventory.model';
import { InventoryService } from '../inventory.service';

@Component({
  selector: 'app-inventory-history',
  imports: [DatePipe, MatTableModule, MatSortModule, MatProgressSpinnerModule],
  templateUrl: './inventory-history.component.html',
  styleUrl: './inventory-history.component.scss',
})
export class InventoryHistoryComponent implements OnInit {
  private readonly inventoryService = inject(InventoryService);

  readonly columns = ['date', 'product', 'oldQuantity', 'newQuantity', 'action'];
  readonly entries = signal<InventoryHistoryEntry[]>([]);
  readonly loading = signal(false);

  private allEntries: InventoryHistoryEntry[] = [];

  ngOnInit(): void {
    this.loading.set(true);
    this.inventoryService.getHistory().subscribe({
      next: (data) => {
        this.allEntries = data;
        this.entries.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onSort(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      this.entries.set([...this.allEntries]);
      return;
    }

    const dir = sort.direction === 'asc' ? 1 : -1;
    const sorted = [...this.allEntries].sort((a, b) => {
      const field = sort.active as keyof InventoryHistoryEntry;
      const av = a[field];
      const bv = b[field];
      return av < bv ? -dir : av > bv ? dir : 0;
    });
    this.entries.set(sorted);
  }
}
