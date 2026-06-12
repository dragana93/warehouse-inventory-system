import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { InventoryUpdateComponent } from './inventory-update.component';
import { InventoryService } from '../inventory.service';
import { ProductService } from '../../products/product.service';
import { Product, ProductListResponse } from '../../../models/product.model';

const mockProducts: Product[] = [
  {
    id: 1, code: 'P001', name: 'Widget', price: 9.99,
    quantity: 50, categoryId: 1, category: { id: 1, name: 'Electronics' },
  },
  {
    id: 2, code: 'P002', name: 'Gadget', price: 24.99,
    quantity: 10, categoryId: 2, category: { id: 2, name: 'Clothing' },
  },
];

const mockListResponse: ProductListResponse = {
  data: mockProducts,
  total: mockProducts.length,
  page: 1,
  pageSize: 10,
};

async function setup() {
  const mockProductService = { getAll: vi.fn().mockReturnValue(of(mockListResponse)) };
  const mockInventoryService = {
    increase: vi.fn().mockReturnValue(of({ id: 1, quantity: 60 })),
    decrease: vi.fn().mockReturnValue(of({ id: 1, quantity: 45 })),
  };

  await TestBed.configureTestingModule({
    imports: [InventoryUpdateComponent],
    providers: [
      provideNoopAnimations(),
      { provide: ProductService, useValue: mockProductService },
      { provide: InventoryService, useValue: mockInventoryService },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(InventoryUpdateComponent);
  fixture.detectChanges();
  await fixture.whenStable();

  return { fixture, component: fixture.componentInstance, mockProductService, mockInventoryService };
}

describe('InventoryUpdateComponent', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should load products on init', async () => {
    const { component, mockProductService } = await setup();
    expect(mockProductService.getAll).toHaveBeenCalledOnce();
    expect(component.products()).toEqual(mockProducts);
  });

  it('should default action to "increase"', async () => {
    const { component } = await setup();
    expect(component.form.controls.action.value).toBe('increase');
  });

  it('should be invalid when form is empty', async () => {
    const { component } = await setup();
    component.form.controls.productId.setValue(null);
    component.form.controls.quantity.setValue(null);
    expect(component.form.invalid).toBe(true);
  });

  describe('selectedProduct', () => {
    it('should return null when no product is selected', async () => {
      const { component } = await setup();
      expect(component.selectedProduct()).toBeNull();
    });

    it('should return the matching product when productId is set', async () => {
      const { component } = await setup();
      component.form.controls.productId.setValue(1);
      expect(component.selectedProduct()).toEqual(mockProducts[0]);
    });
  });

  describe('validation — quantity', () => {
    it('should error when quantity is 0', async () => {
      const { component } = await setup();
      component.form.controls.quantity.setValue(0);
      component.form.controls.quantity.markAsTouched();
      expect(component.form.controls.quantity.hasError('min')).toBe(true);
    });

    it('should error when quantity is negative', async () => {
      const { component } = await setup();
      component.form.controls.quantity.setValue(-1);
      component.form.controls.quantity.markAsTouched();
      expect(component.form.controls.quantity.hasError('min')).toBe(true);
    });

    it('should be valid when quantity is 1 or more', async () => {
      const { component } = await setup();
      component.form.controls.quantity.setValue(5);
      expect(component.form.controls.quantity.valid).toBe(true);
    });
  });

  describe('submit() — validation', () => {
    it('should mark all fields as touched when form is invalid', async () => {
      const { component } = await setup();
      component.submit();
      expect(component.form.controls.productId.touched).toBe(true);
      expect(component.form.controls.quantity.touched).toBe(true);
    });

    it('should not call inventory service when form is invalid', async () => {
      const { component, mockInventoryService } = await setup();
      component.submit();
      expect(mockInventoryService.increase).not.toHaveBeenCalled();
      expect(mockInventoryService.decrease).not.toHaveBeenCalled();
    });

    it('should set exceedsStock error when decrease amount exceeds current stock', async () => {
      const { component } = await setup();
      component.form.controls.productId.setValue(2); // quantity = 10
      component.form.controls.action.setValue('decrease');
      component.form.controls.quantity.setValue(20); // more than 10
      component.submit();
      expect(component.form.controls.quantity.hasError('exceedsStock')).toBe(true);
    });

    it('should not set exceedsStock error when decrease does not exceed current stock', async () => {
      const { component, mockInventoryService } = await setup();
      component.form.controls.productId.setValue(1); // quantity = 50
      component.form.controls.action.setValue('decrease');
      component.form.controls.quantity.setValue(10);
      component.submit();
      expect(mockInventoryService.decrease).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('submit() — increase', () => {
    it('should call InventoryService.increase with correct payload', async () => {
      const { component, mockInventoryService } = await setup();
      component.form.controls.productId.setValue(1);
      component.form.controls.action.setValue('increase');
      component.form.controls.quantity.setValue(10);
      component.submit();
      expect(mockInventoryService.increase).toHaveBeenCalledWith(1, 10);
    });

    it('should set result signal on success', async () => {
      const { component } = await setup();
      component.form.controls.productId.setValue(1);
      component.form.controls.action.setValue('increase');
      component.form.controls.quantity.setValue(10);
      component.submit();
      expect(component.result()).toEqual({ productId: 1, previousQuantity: 50, newQuantity: 60 });
    });

    it('should reset the form after successful increase', async () => {
      const { component } = await setup();
      component.form.controls.productId.setValue(1);
      component.form.controls.action.setValue('increase');
      component.form.controls.quantity.setValue(10);
      component.submit();
      expect(component.form.controls.productId.value).toBeNull();
      expect(component.form.controls.quantity.value).toBeNull();
    });
  });

  describe('submit() — decrease', () => {
    it('should call InventoryService.decrease with correct payload', async () => {
      const { component, mockInventoryService } = await setup();
      component.form.controls.productId.setValue(1);
      component.form.controls.action.setValue('decrease');
      component.form.controls.quantity.setValue(5);
      component.submit();
      expect(mockInventoryService.decrease).toHaveBeenCalledWith(1, 5);
    });
  });

  describe('submit() — server error', () => {
    it('should set serverError signal when service returns error', async () => {
      const mockProductService = { getAll: vi.fn().mockReturnValue(of(mockListResponse)) };
      const mockInventoryService = {
        increase: vi.fn().mockReturnValue(
          throwError(() => ({ error: { message: 'Stock update failed' } })),
        ),
        decrease: vi.fn().mockReturnValue(of({})),
      };

      await TestBed.configureTestingModule({
        imports: [InventoryUpdateComponent],
        providers: [
          provideNoopAnimations(),
          { provide: ProductService, useValue: mockProductService },
          { provide: InventoryService, useValue: mockInventoryService },
        ],
      }).compileComponents();

      const fixture = TestBed.createComponent(InventoryUpdateComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      const component = fixture.componentInstance;

      component.form.controls.productId.setValue(1);
      component.form.controls.action.setValue('increase');
      component.form.controls.quantity.setValue(10);
      component.submit();

      expect(component.serverError()).toBe('Stock update failed');
    });
  });

  describe('reset()', () => {
    it('should clear result and reset form', async () => {
      const { component } = await setup();
      component.form.controls.productId.setValue(1);
      component.form.controls.action.setValue('increase');
      component.form.controls.quantity.setValue(10);
      component.submit();

      component.reset();

      expect(component.result()).toBeNull();
      expect(component.serverError()).toBeNull();
      expect(component.form.controls.productId.value).toBeNull();
    });
  });

  describe('template interactions', () => {
    it('should trigger submit() via DOM form submit event', async () => {
      const { fixture, component } = await setup();
      const submitSpy = vi.spyOn(component, 'submit');
      const form = fixture.nativeElement.querySelector('form');
      form.dispatchEvent(new Event('submit'));
      fixture.detectChanges();
      expect(submitSpy).toHaveBeenCalled();
    });

    it('should render success banner in DOM after successful submit', async () => {
      const { fixture, component } = await setup();
      component.form.controls.productId.setValue(1);
      component.form.controls.action.setValue('increase');
      component.form.controls.quantity.setValue(10);
      component.submit();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const banner = fixture.nativeElement.querySelector('.success-banner');
      expect(banner).toBeTruthy();
      expect(banner.textContent).toContain('50');
      expect(banner.textContent).toContain('60');
    });

    it('should call reset() via DOM "Update another" button click in success banner', async () => {
      const { fixture, component } = await setup();
      component.form.controls.productId.setValue(1);
      component.form.controls.action.setValue('increase');
      component.form.controls.quantity.setValue(10);
      component.submit();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const resetSpy = vi.spyOn(component, 'reset');
      const resetBtn = fixture.nativeElement.querySelector('.success-banner button');
      resetBtn.click();
      fixture.detectChanges();

      expect(resetSpy).toHaveBeenCalled();
      expect(component.result()).toBeNull();
    });

    it('should show product required error in DOM when productId is touched and empty', async () => {
      const { fixture, component } = await setup();
      component.form.controls.productId.markAsTouched();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const errors = fixture.nativeElement.querySelectorAll('mat-error');
      const texts = Array.from(errors).map((e: any) => e.textContent.trim());
      expect(texts.some((t) => t.includes('Product is required'))).toBe(true);
    });

    it('should show quantity required error in DOM when quantity is touched and null', async () => {
      const { fixture, component } = await setup();
      component.form.controls.quantity.setValue(null);
      component.form.controls.quantity.markAsTouched();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const errors = fixture.nativeElement.querySelectorAll('mat-error');
      const texts = Array.from(errors).map((e: any) => e.textContent.trim());
      expect(texts.some((t) => t.includes('Quantity is required'))).toBe(true);
    });

    it('should show quantity min error in DOM when quantity is 0 and touched', async () => {
      const { fixture, component } = await setup();
      component.form.controls.quantity.setValue(0);
      component.form.controls.quantity.markAsTouched();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const errors = fixture.nativeElement.querySelectorAll('mat-error');
      const texts = Array.from(errors).map((e: any) => e.textContent.trim());
      expect(texts.some((t) => t.includes('Quantity must be at least 1'))).toBe(true);
    });

    it('should show exceedsStock error in DOM after attempting to decrease more than stock', async () => {
      const { fixture, component } = await setup();
      component.form.controls.productId.setValue(2); // quantity = 10
      component.form.controls.action.setValue('decrease');
      component.form.controls.quantity.setValue(20);
      component.submit();
      component.form.controls.quantity.markAsTouched();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const errors = fixture.nativeElement.querySelectorAll('mat-error');
      const texts = Array.from(errors).map((e: any) => e.textContent.trim());
      expect(texts.some((t) => t.includes('Available stock'))).toBe(true);
    });

    it('should show server error paragraph in DOM when serverError signal is set', async () => {
      const { fixture, component } = await setup();
      component.serverError.set('Something went wrong');
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const el = fixture.nativeElement.querySelector('.server-error');
      expect(el).toBeTruthy();
      expect(el.textContent.trim()).toBe('Something went wrong');
    });
  });

  describe('branch coverage — ?? fallbacks', () => {
    it('should use 0 as current stock when selectedProduct() is null (productId not found)', async () => {
      const { component, mockInventoryService } = await setup();
      // productId 999 does not exist in mockProducts — selectedProduct() returns null
      component.form.controls.productId.setValue(999);
      component.form.controls.action.setValue('increase');
      component.form.controls.quantity.setValue(5);
      component.submit();
      // current = null?.quantity ?? 0 === 0; increase proceeds normally
      expect(mockInventoryService.increase).toHaveBeenCalledWith(999, 5);
    });

    it('should use fallback error message when error object has no message property', async () => {
      const mockProductServiceLocal = { getAll: vi.fn().mockReturnValue(of(mockListResponse)) };
      const mockInventoryServiceLocal = {
        increase: vi.fn().mockReturnValue(throwError(() => ({}))),
        decrease: vi.fn().mockReturnValue(of({})),
      };

      await TestBed.configureTestingModule({
        imports: [InventoryUpdateComponent],
        providers: [
          provideNoopAnimations(),
          { provide: ProductService, useValue: mockProductServiceLocal },
          { provide: InventoryService, useValue: mockInventoryServiceLocal },
        ],
      }).compileComponents();

      const fixture = TestBed.createComponent(InventoryUpdateComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      const component = fixture.componentInstance;

      component.form.controls.productId.setValue(1);
      component.form.controls.action.setValue('increase');
      component.form.controls.quantity.setValue(10);
      component.submit();

      expect(component.serverError()).toBe('An error occurred. Please try again.');
    });
  });
});
