import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ProductEditComponent } from './product-edit.component';
import { ProductService } from '../product.service';
import { CategoryService } from '../../categories/category.service';
import { ProductFormValue } from '../product-form/product-form.component';
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

function createRouteMock(id: string) {
  return {
    snapshot: { paramMap: { get: vi.fn().mockReturnValue(id) } },
  };
}

async function setup(product: Product = mockProduct, routeId = '42') {
  const mockProductService = {
    getById: vi.fn().mockReturnValue(of(product)),
    update: vi.fn().mockReturnValue(of(product)),
  };
  const mockCategoryService = { getAll: vi.fn().mockReturnValue(of([])) };

  await TestBed.configureTestingModule({
    imports: [ProductEditComponent],
    providers: [
      provideRouter([]),
      provideNoopAnimations(),
      { provide: ProductService, useValue: mockProductService },
      { provide: CategoryService, useValue: mockCategoryService },
      { provide: ActivatedRoute, useValue: createRouteMock(routeId) },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(ProductEditComponent);
  fixture.detectChanges();
  await fixture.whenStable();

  const router = TestBed.inject(Router);
  const navigateSpy = vi.spyOn(router, 'navigate');

  return { fixture, component: fixture.componentInstance, mockProductService, navigateSpy };
}

describe('ProductEditComponent', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should load product by id from route on init', async () => {
    const { mockProductService } = await setup(mockProduct, '42');
    expect(mockProductService.getById).toHaveBeenCalledWith(42);
  });

  it('should populate initial signal with product data', async () => {
    const { component } = await setup();
    expect(component.initial()).toEqual({
      code: 'P042',
      name: 'Super Widget',
      price: 19.99,
      categoryId: 1,
      quantity: 75,
    });
  });

  it('should render the product form once product is loaded', async () => {
    const { fixture } = await setup();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-product-form')).not.toBeNull();
  });

  describe('onUpdate()', () => {
    const formValue: ProductFormValue = {
      code: 'P042', name: 'Updated Widget', price: 24.99, categoryId: 2, quantity: 60,
    };

    it('should call ProductService.update with the product id and form value', async () => {
      const { component, mockProductService } = await setup(mockProduct, '42');
      component.onUpdate(formValue);
      expect(mockProductService.update).toHaveBeenCalledWith(42, formValue);
    });

    it('should navigate to /products after update', async () => {
      const { component, navigateSpy } = await setup();
      component.onUpdate(formValue);
      expect(navigateSpy).toHaveBeenCalledWith(['/products']);
    });
  });

  describe('onCancel()', () => {
    it('should navigate to /products on cancel', async () => {
      const { component, navigateSpy } = await setup();
      component.onCancel();
      expect(navigateSpy).toHaveBeenCalledWith(['/products']);
    });
  });
});
