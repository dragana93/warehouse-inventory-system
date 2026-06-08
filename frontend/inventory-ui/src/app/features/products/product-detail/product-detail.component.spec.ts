import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { ProductDetailComponent } from './product-detail.component';
import { ProductService } from '../product.service';
import { Product } from '../../../models/product.model';

const mockProduct: Product = {
  id: 42,
  code: 'P042',
  name: 'Super Widget',
  price: 19.99,
  quantity: 75,
  categoryId: 1,
  category: { id: 1, name: 'Electronics' },
};

function createActivatedRouteMock(id: string) {
  return {
    snapshot: { paramMap: { get: vi.fn().mockReturnValue(id) } },
  };
}

async function setup(
  product: Product | null,
  routeId = '42',
  shouldError = false,
) {
  const mockService = {
    getById: vi.fn().mockReturnValue(
      shouldError ? throwError(() => new Error('Not found')) : of(product),
    ),
  };

  await TestBed.configureTestingModule({
    imports: [ProductDetailComponent],
    providers: [
      provideRouter([]),
      provideNoopAnimations(),
      { provide: ProductService, useValue: mockService },
      { provide: ActivatedRoute, useValue: createActivatedRouteMock(routeId) },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(ProductDetailComponent);
  fixture.detectChanges();
  await fixture.whenStable();
  return { fixture, component: fixture.componentInstance, mockService };
}

describe('ProductDetailComponent', () => {
  it('should create', async () => {
    const { component } = await setup(mockProduct);
    expect(component).toBeTruthy();
  });

  it('should call ProductService.getById with the route id', async () => {
    const { mockService } = await setup(mockProduct, '42');
    expect(mockService.getById).toHaveBeenCalledWith(42);
  });

  it('should set product signal after successful load', async () => {
    const { component } = await setup(mockProduct);
    expect(component.product()).toEqual(mockProduct);
  });

  it('should set loading to false after load', async () => {
    const { component } = await setup(mockProduct);
    expect(component.loading()).toBe(false);
  });

  it('should display product code', async () => {
    const { fixture } = await setup(mockProduct);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('P042');
  });

  it('should display product name', async () => {
    const { fixture } = await setup(mockProduct);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Super Widget');
  });

  it('should display product price formatted as currency', async () => {
    const { fixture } = await setup(mockProduct);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('19.99');
  });

  it('should display product quantity', async () => {
    const { fixture } = await setup(mockProduct);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('75');
  });

  it('should display category name', async () => {
    const { fixture } = await setup(mockProduct);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Electronics');
  });

  it('should display an edit link pointing to the edit route', async () => {
    const { fixture } = await setup(mockProduct);
    fixture.detectChanges();
    const editLink = fixture.nativeElement.querySelector('a[href="/products/edit/42"]');
    expect(editLink).not.toBeNull();
  });

  describe('error state', () => {
    it('should set error signal when service returns error', async () => {
      const { component } = await setup(null, '42', true);
      expect(component.error()).toBeTruthy();
    });

    it('should display error message in the template', async () => {
      const { fixture } = await setup(null, '42', true);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('not found');
    });

    it('should set loading to false on error', async () => {
      const { component } = await setup(null, '42', true);
      expect(component.loading()).toBe(false);
    });

    it('should not render product card on error', async () => {
      const { fixture } = await setup(null, '42', true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('mat-card')).toBeNull();
    });
  });
});
