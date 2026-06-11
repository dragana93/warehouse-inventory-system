import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Product } from '../../../models/product.model';
import { ProductService } from '../product.service';

type SortableField = 'code' | 'name' | 'price' | 'quantity';

@Component({
  selector: 'app-product-list',
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
    MatProgressSpinnerModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);

  readonly columns = ['code', 'name', 'category', 'price', 'quantity', 'actions'];

  private readonly allProducts = signal<Product[]>([]);
  readonly search = signal('');
  readonly categoryFilter = signal('');
  readonly loading = signal(false);
  private readonly sortField = signal('');
  private readonly sortDir = signal<'asc' | 'desc'>('asc');
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);

  readonly categoryNames = computed(() => [
    ...new Set(this.allProducts().map((p) => p.category?.name).filter((name): name is string => !!name)),
  ]);

  readonly filteredProducts = computed(() => {
    let list = this.allProducts();
    const q = this.search().toLowerCase();
    if (q) {
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q),
      );
    }
    const cat = this.categoryFilter();
    if (cat) {
      list = list.filter((p) => p.category?.name === cat);
    }
    const field = this.sortField();
    if (field) {
      const dir = this.sortDir();
      list = [...list].sort((a, b) => {
        const av = field === 'category' ? (a.category?.name ?? '') : a[field as SortableField];
        const bv = field === 'category' ? (b.category?.name ?? '') : b[field as SortableField];
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return dir === 'asc' ? cmp : -cmp;
      });
    }
    return list;
  });

  readonly pagedProducts = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredProducts().slice(start, start + this.pageSize());
  });

  ngOnInit(): void {
    this.loadProducts();
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

  private loadProducts(): void {
    this.loading.set(true);
    this.productService.getAll().subscribe({
      next: (response) => {
        this.allProducts.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
