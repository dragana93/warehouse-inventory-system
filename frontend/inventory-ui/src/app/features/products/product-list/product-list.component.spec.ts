import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../product.service';
import { Product, ProductListResponse } from '../../../models/product.model';

const mockProducts: Product[] = [
  {
    id: 1,
    code: 'P001',
    name: 'Widget',
    price: 9.99,
    quantity: 50,
    categoryId: 1,
    category: { id: 1, name: 'Electronics' },
  },
  {
    id: 2,
    code: 'P002',
    name: 'Gadget',
    price: 24.99,
    quantity: 20,
    categoryId: 2,
    category: { id: 2, name: 'Clothing' },
  },
  {
    id: 3,
    code: 'P003',
    name: 'Doohickey',
    price: 4.99,
    quantity: 200,
    categoryId: 1,
    category: { id: 1, name: 'Electronics' },
  },
];

function makeResponse(products: Product[]): ProductListResponse {
  return { data: products, total: products.length, page: 1, pageSize: 10 };
}

async function createComponent(products: Product[] = mockProducts) {
  const mockService = { getAll: vi.fn().mockReturnValue(of(makeResponse(products))) };

  await TestBed.configureTestingModule({
    imports: [ProductListComponent],
    providers: [
      provideRouter([]),
      provideNoopAnimations(),
      { provide: ProductService, useValue: mockService },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(ProductListComponent);
  fixture.detectChanges();
  await fixture.whenStable();
  return { fixture, component: fixture.componentInstance, mockService };
}

describe('ProductListComponent', () => {
  it('should create', async () => {
    const { component } = await createComponent();
    expect(component).toBeTruthy();
  });

  it('should display all expected columns', async () => {
    const { component } = await createComponent();
    expect(component.columns).toEqual(['code', 'name', 'category', 'price', 'quantity', 'actions']);
  });

  it('should call ProductService.getAll on init', async () => {
    const { mockService } = await createComponent();
    expect(mockService.getAll).toHaveBeenCalledOnce();
  });

  it('should load all products', async () => {
    const { component } = await createComponent();
    expect(component.filteredProducts().length).toBe(3);
  });

  it('should start with empty search and no category filter', async () => {
    const { component } = await createComponent();
    expect(component.search()).toBe('');
    expect(component.categoryFilter()).toBe('');
  });

  it('should derive unique category names from products', async () => {
    const { component } = await createComponent();
    expect(component.categoryNames()).toEqual(
      expect.arrayContaining(['Electronics', 'Clothing']),
    );
    expect(component.categoryNames().length).toBe(2);
  });

  it('should paginate products (pageSize default 10)', async () => {
    const { component } = await createComponent();
    expect(component.pagedProducts().length).toBe(3);
  });

  it('should return empty paged products when no products loaded', async () => {
    const { component } = await createComponent([]);
    expect(component.pagedProducts()).toEqual([]);
  });

  describe('search filtering', () => {
    it('should filter by name', async () => {
      const { component } = await createComponent();
      component.search.set('widget');
      const results = component.filteredProducts();
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('Widget');
    });

    it('should filter by code', async () => {
      const { component } = await createComponent();
      component.search.set('P002');
      const results = component.filteredProducts();
      expect(results.length).toBe(1);
      expect(results[0].code).toBe('P002');
    });

    it('should be case-insensitive', async () => {
      const { component } = await createComponent();
      component.search.set('GADGET');
      expect(component.filteredProducts().length).toBe(1);
    });

    it('should return all products when search is cleared', async () => {
      const { component } = await createComponent();
      component.search.set('widget');
      component.search.set('');
      expect(component.filteredProducts().length).toBe(3);
    });
  });

  describe('category filtering', () => {
    it('should filter by category name', async () => {
      const { component } = await createComponent();
      component.categoryFilter.set('Electronics');
      const results = component.filteredProducts();
      expect(results.length).toBe(2);
      expect(results.every((p) => p.category?.name === 'Electronics')).toBe(true);
    });

    it('should show all when categoryFilter is empty', async () => {
      const { component } = await createComponent();
      component.categoryFilter.set('Electronics');
      component.categoryFilter.set('');
      expect(component.filteredProducts().length).toBe(3);
    });
  });

  describe('sorting', () => {
    it('should sort by name ascending', async () => {
      const { component } = await createComponent();
      component.onSort({ active: 'name', direction: 'asc' });
      const names = component.filteredProducts().map((p) => p.name);
      expect(names).toEqual([...names].sort());
    });

    it('should sort by name descending', async () => {
      const { component } = await createComponent();
      component.onSort({ active: 'name', direction: 'desc' });
      const names = component.filteredProducts().map((p) => p.name);
      expect(names).toEqual([...names].sort().reverse());
    });

    it('should sort by quantity ascending', async () => {
      const { component } = await createComponent();
      component.onSort({ active: 'quantity', direction: 'asc' });
      const qtys = component.filteredProducts().map((p) => p.quantity);
      expect(qtys).toEqual([...qtys].sort((a, b) => a - b));
    });

    it('should reset to page 0 when sorting changes', async () => {
      const { component } = await createComponent();
      component.pageIndex.set(2);
      component.onSort({ active: 'name', direction: 'asc' });
      expect(component.pageIndex()).toBe(0);
    });
  });

  describe('pagination', () => {
    it('should update pageIndex and pageSize on page event', async () => {
      const { component } = await createComponent();
      component.onPage({ pageIndex: 1, pageSize: 25, length: 100 });
      expect(component.pageIndex()).toBe(1);
      expect(component.pageSize()).toBe(25);
    });

    it('should slice results according to current page', async () => {
      const many: Product[] = Array.from({ length: 15 }, (_, i) => ({
        ...mockProducts[0],
        id: i + 1,
        code: `P${i}`,
        name: `Product ${i}`,
      }));
      const { component } = await createComponent(many);
      expect(component.pagedProducts().length).toBe(10);
      component.onPage({ pageIndex: 1, pageSize: 10, length: 15 });
      expect(component.pagedProducts().length).toBe(5);
    });
  });
});

