import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ProductFormComponent, ProductFormValue } from './product-form.component';
import { CategoryService } from '../../categories/category.service';
import { Category } from '../../../models/category.model';
import { ReactiveFormsModule } from '@angular/forms';

const mockCategories: Category[] = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Clothing' },
];

async function setup(initial: ProductFormValue | null = null) {
  const mockCategoryService = { getAll: vi.fn().mockReturnValue(of(mockCategories)) };

  await TestBed.configureTestingModule({
    imports: [ProductFormComponent],
    providers: [
      provideNoopAnimations(),
      { provide: CategoryService, useValue: mockCategoryService },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(ProductFormComponent);
  fixture.componentRef.setInput('initial', initial);
  fixture.detectChanges();
  await fixture.whenStable();
  return { fixture, component: fixture.componentInstance, mockCategoryService };
}

describe('ProductFormComponent', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should load categories from CategoryService on init', async () => {
    const { component, mockCategoryService } = await setup();
    expect(mockCategoryService.getAll).toHaveBeenCalledOnce();
    expect(component.categories()).toEqual(mockCategories);
  });

  describe('initial values (create mode)', () => {
    it('should have empty form fields when no initial value provided', async () => {
      const { component } = await setup();
      expect(component.form.controls.code.value).toBe('');
      expect(component.form.controls.name.value).toBe('');
      expect(component.form.controls.price.value).toBeNull();
      expect(component.form.controls.categoryId.value).toBeNull();
      expect(component.form.controls.quantity.value).toBeNull();
    });

    it('should be invalid when all fields are empty', async () => {
      const { component } = await setup();
      expect(component.form.invalid).toBe(true);
    });
  });

  describe('initial values (edit mode)', () => {
    const initial: ProductFormValue = {
      code: 'P001', name: 'Widget', price: 9.99, categoryId: 1, quantity: 50,
    };

    it('should pre-fill form with initial values', async () => {
      const { component } = await setup(initial);
      expect(component.form.controls.code.value).toBe('P001');
      expect(component.form.controls.name.value).toBe('Widget');
      expect(component.form.controls.price.value).toBe(9.99);
      expect(component.form.controls.categoryId.value).toBe(1);
      expect(component.form.controls.quantity.value).toBe(50);
    });

    it('should be valid when all initial values are provided', async () => {
      const { component } = await setup(initial);
      expect(component.form.valid).toBe(true);
    });
  });

  describe('validation — required fields', () => {
    it('should mark code as required when empty', async () => {
      const { component } = await setup();
      component.form.controls.code.setValue('');
      component.form.controls.code.markAsTouched();
      expect(component.form.controls.code.hasError('required')).toBe(true);
    });

    it('should mark name as required when empty', async () => {
      const { component } = await setup();
      component.form.controls.name.setValue('');
      component.form.controls.name.markAsTouched();
      expect(component.form.controls.name.hasError('required')).toBe(true);
    });

    it('should mark categoryId as required when not selected', async () => {
      const { component } = await setup();
      component.form.controls.categoryId.markAsTouched();
      expect(component.form.controls.categoryId.hasError('required')).toBe(true);
    });
  });

  describe('validation — price', () => {
    it('should be invalid when price is 0', async () => {
      const { component } = await setup();
      component.form.controls.price.setValue(0);
      expect(component.form.controls.price.hasError('min')).toBe(true);
    });

    it('should be invalid when price is negative', async () => {
      const { component } = await setup();
      component.form.controls.price.setValue(-5);
      expect(component.form.controls.price.hasError('min')).toBe(true);
    });

    it('should be valid when price is greater than 0', async () => {
      const { component } = await setup();
      component.form.controls.price.setValue(0.01);
      expect(component.form.controls.price.valid).toBe(true);
    });
  });

  describe('validation — quantity', () => {
    it('should be invalid when quantity is negative', async () => {
      const { component } = await setup();
      component.form.controls.quantity.setValue(-1);
      expect(component.form.controls.quantity.hasError('min')).toBe(true);
    });

    it('should be valid when quantity is 0', async () => {
      const { component } = await setup();
      component.form.controls.quantity.setValue(0);
      expect(component.form.controls.quantity.valid).toBe(true);
    });

    it('should be valid when quantity is positive', async () => {
      const { component } = await setup();
      component.form.controls.quantity.setValue(100);
      expect(component.form.controls.quantity.valid).toBe(true);
    });
  });

  describe('submit()', () => {
    const validValues = {
      code: 'P001', name: 'Widget', price: 9.99, categoryId: 1, quantity: 50,
    };

    it('should emit submitted event with form value when valid', async () => {
      const { component } = await setup();
      const emitted: ProductFormValue[] = [];
      component.submitted.subscribe((v) => emitted.push(v));
      component.form.setValue(validValues);
      component.submit();
      expect(emitted.length).toBe(1);
      expect(emitted[0]).toEqual(validValues);
    });

    it('should not emit submitted when form is invalid', async () => {
      const { component } = await setup();
      const emitted: ProductFormValue[] = [];
      component.submitted.subscribe((v) => emitted.push(v));
      component.submit();
      expect(emitted.length).toBe(0);
    });

    it('should mark all fields as touched on invalid submit', async () => {
      const { component } = await setup();
      component.submit();
      expect(component.form.controls.code.touched).toBe(true);
      expect(component.form.controls.name.touched).toBe(true);
      expect(component.form.controls.price.touched).toBe(true);
      expect(component.form.controls.categoryId.touched).toBe(true);
      expect(component.form.controls.quantity.touched).toBe(true);
    });
  });

  describe('cancel()', () => {
    it('should emit cancelled event', async () => {
      const { component } = await setup();
      let emitted = false;
      component.cancelled.subscribe(() => (emitted = true));
      component.cancel();
      expect(emitted).toBe(true);
    });
  });
});

