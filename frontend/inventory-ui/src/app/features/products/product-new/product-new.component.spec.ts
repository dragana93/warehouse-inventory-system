import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ProductNewComponent } from './product-new.component';
import { ProductService } from '../product.service';
import { CategoryService } from '../../categories/category.service';
import { ProductFormComponent, ProductFormValue } from '../product-form/product-form.component';
import { Product, ProductListResponse } from '../../../models/product.model';

const mockProduct: Product = {
  id: 1,
  code: 'P001',
  name: 'Widget',
  price: 9.99,
  quantity: 50,
  categoryId: 1,
  category: { id: 1, name: 'Electronics' },
};

const mockListResponse: ProductListResponse = {
  data: [mockProduct],
  total: 1,
  page: 1,
  pageSize: 10,
};

async function setup() {
  const mockProductService = {
    create: vi.fn().mockReturnValue(of(mockProduct)),
    getAll: vi.fn().mockReturnValue(of(mockListResponse)),
  };
  const mockCategoryService = { getAll: vi.fn().mockReturnValue(of([])) };

  await TestBed.configureTestingModule({
    imports: [ProductNewComponent],
    providers: [
      provideRouter([]),
      provideNoopAnimations(),
      { provide: ProductService, useValue: mockProductService },
      { provide: CategoryService, useValue: mockCategoryService },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(ProductNewComponent);
  fixture.detectChanges();
  await fixture.whenStable();

  const router = TestBed.inject(Router);
  const navigateSpy = vi.spyOn(router, 'navigate');

  return { fixture, component: fixture.componentInstance, mockProductService, navigateSpy };
}

describe('ProductNewComponent', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should render the product form', async () => {
    const { fixture } = await setup();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-product-form')).not.toBeNull();
  });

  it('should pass "New Product" as title to the form', async () => {
    const { fixture } = await setup();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1?.textContent?.trim()).toBe('New Product');
  });

  describe('onCreate()', () => {
    const formValue: ProductFormValue = {
      code: 'P001', name: 'Widget', price: 9.99, categoryId: 1, quantity: 50,
    };

    it('should call ProductService.create with the form value', async () => {
      const { component, mockProductService } = await setup();
      component.onCreate(formValue);
      expect(mockProductService.create).toHaveBeenCalledWith(formValue);
    });

    it('should navigate to /products after creation', async () => {
      const { component, navigateSpy } = await setup();
      component.onCreate(formValue);
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

  describe('template interactions', () => {
    const formValue: ProductFormValue = {
      code: 'P001', name: 'Widget', price: 9.99, categoryId: 1, quantity: 50,
    };

    it('should call onCreate() when app-product-form emits submitted event', async () => {
      const { fixture, component, mockProductService } = await setup();
      fixture.detectChanges();
      await fixture.whenStable();

      const onCreateSpy = vi.spyOn(component, 'onCreate');
      const formDebugEl = fixture.debugElement.query(By.directive(ProductFormComponent));
      expect(formDebugEl).toBeTruthy();
      formDebugEl.triggerEventHandler('submitted', formValue);
      fixture.detectChanges();

      expect(onCreateSpy).toHaveBeenCalledWith(formValue);
      expect(mockProductService.create).toHaveBeenCalledWith(formValue);
    });

    it('should call onCancel() when app-product-form emits cancelled event', async () => {
      const { fixture, component, navigateSpy } = await setup();
      fixture.detectChanges();
      await fixture.whenStable();

      const onCancelSpy = vi.spyOn(component, 'onCancel');
      const formDebugEl = fixture.debugElement.query(By.directive(ProductFormComponent));
      expect(formDebugEl).toBeTruthy();
      formDebugEl.triggerEventHandler('cancelled', null);
      fixture.detectChanges();

      expect(onCancelSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['/products']);
    });
  });
});
