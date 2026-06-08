import { Component, computed, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface Product {
  id: number;
  code: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    CurrencyPipe,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="container">
      <div class="header">
        <h1>Products</h1>
        <a mat-raised-button color="primary" routerLink="/products/new">Add Product</a>
      </div>

      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Search</mat-label>
          <input matInput [ngModel]="search()" (ngModelChange)="search.set($event)" placeholder="Name or code" />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Category</mat-label>
          <mat-select [ngModel]="categoryFilter()" (ngModelChange)="categoryFilter.set($event)">
            <mat-option value="">All</mat-option>
            @for (cat of categories(); track cat) {
              <mat-option [value]="cat">{{ cat }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </div>

      <table mat-table [dataSource]="pagedProducts()" matSort (matSortChange)="onSort($event)">
        <ng-container matColumnDef="code">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Code</th>
          <td mat-cell *matCellDef="let p">{{ p.code }}</td>
        </ng-container>
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
          <td mat-cell *matCellDef="let p">{{ p.name }}</td>
        </ng-container>
        <ng-container matColumnDef="category">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Category</th>
          <td mat-cell *matCellDef="let p">{{ p.category }}</td>
        </ng-container>
        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Price</th>
          <td mat-cell *matCellDef="let p">{{ p.price | currency }}</td>
        </ng-container>
        <ng-container matColumnDef="quantity">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Quantity</th>
          <td mat-cell *matCellDef="let p">{{ p.quantity }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let p">
            <a mat-icon-button [routerLink]="['/products', p.id]"><mat-icon>visibility</mat-icon></a>
            <a mat-icon-button [routerLink]="['/products/edit', p.id]"><mat-icon>edit</mat-icon></a>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns"></tr>
      </table>

      <mat-paginator
        [length]="filteredProducts().length"
        [pageSize]="pageSize()"
        [pageSizeOptions]="[10, 25, 50]"
        (page)="onPage($event)"
      ></mat-paginator>
    </div>
  `,
  styles: [`
    .container { padding: 24px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .filters { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 8px; }
    table { width: 100%; }
  `],
})
export class ProductListComponent implements OnInit {
  readonly columns = ['code', 'name', 'category', 'price', 'quantity', 'actions'];

  private readonly allProducts = signal<Product[]>([]);
  readonly search = signal('');
  readonly categoryFilter = signal('');
  private readonly sortField = signal('');
  private readonly sortDir = signal<'asc' | 'desc'>('asc');
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);

  readonly categories = computed(() => [...new Set(this.allProducts().map(p => p.category))]);

  readonly filteredProducts = computed(() => {
    let list = this.allProducts();
    const q = this.search().toLowerCase();
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q));
    const cat = this.categoryFilter();
    if (cat) list = list.filter(p => p.category === cat);
    const field = this.sortField();
    if (field) {
      list = [...list].sort((a, b) => {
        const av = a[field as keyof Product];
        const bv = b[field as keyof Product];
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return this.sortDir() === 'asc' ? cmp : -cmp;
      });
    }
    return list;
  });

  readonly pagedProducts = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredProducts().slice(start, start + this.pageSize());
  });

  ngOnInit(): void {
    // TODO: inject and call ProductService
  }

  onSort(sort: Sort): void {
    this.sortField.set(sort.active);
    this.sortDir.set((sort.direction as 'asc' | 'desc') || 'asc');
    this.pageIndex.set(0);
  }

  onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }
}
