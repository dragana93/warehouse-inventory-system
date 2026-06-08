import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProductFormComponent } from './product-form.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('ProductFormComponent', () => {
  let fixture: ComponentFixture<ProductFormComponent>;
  let component: ProductFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormComponent, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Validators', () => {
    it('form is invalid when empty', () => {
      expect(component.form.valid).toBeFalse();
    });

    it('code is required', () => {
      const ctrl = component.form.controls['code'];
      ctrl.setValue('');
      expect(ctrl.hasError('required')).toBeTrue();
    });

    it('name is required', () => {
      const ctrl = component.form.controls['name'];
      ctrl.setValue('');
      expect(ctrl.hasError('required')).toBeTrue();
    });

    it('price is required', () => {
      const ctrl = component.form.controls['price'];
      ctrl.setValue(null);
      expect(ctrl.hasError('required')).toBeTrue();
    });

    it('price must be greater than 0', () => {
      const ctrl = component.form.controls['price'];
      ctrl.setValue(0);
      expect(ctrl.hasError('min')).toBeTrue();
    });

    it('price accepts positive value', () => {
      const ctrl = component.form.controls['price'];
      ctrl.setValue(1.5);
      expect(ctrl.valid).toBeTrue();
    });

    it('quantity is required', () => {
      const ctrl = component.form.controls['quantity'];
      ctrl.setValue(null);
      expect(ctrl.hasError('required')).toBeTrue();
    });

    it('quantity cannot be negative', () => {
      const ctrl = component.form.controls['quantity'];
      ctrl.setValue(-1);
      expect(ctrl.hasError('min')).toBeTrue();
    });

    it('quantity allows zero', () => {
      const ctrl = component.form.controls['quantity'];
      ctrl.setValue(0);
      expect(ctrl.hasError('min')).toBeFalse();
    });

    it('categoryId is required', () => {
      const ctrl = component.form.controls['categoryId'];
      ctrl.setValue(null);
      expect(ctrl.hasError('required')).toBeTrue();
    });

    it('form is valid when all fields are correctly filled', () => {
      component.form.setValue({
        code: 'PRD-001',
        name: 'Water Bottle',
        price: 1.5,
        categoryId: 1,
        quantity: 100,
      });
      expect(component.form.valid).toBeTrue();
    });
  });

  describe('onSubmit', () => {
    it('emits submitted event when form is valid', () => {
      const spy = jasmine.createSpy('submitted');
      component.submitted.subscribe(spy);

      component.form.setValue({
        code: 'PRD-001',
        name: 'Water Bottle',
        price: 1.5,
        categoryId: 1,
        quantity: 100,
      });

      component.onSubmit();

      expect(spy).toHaveBeenCalledWith({
        code: 'PRD-001',
        name: 'Water Bottle',
        price: 1.5,
        categoryId: 1,
        quantity: 100,
      });
    });

    it('does not emit when form is invalid', () => {
      const spy = jasmine.createSpy('submitted');
      component.submitted.subscribe(spy);

      component.onSubmit();

      expect(spy).not.toHaveBeenCalled();
    });

    it('marks all fields as touched when submitted invalid', () => {
      component.onSubmit();

      Object.values(component.form.controls).forEach(ctrl => {
        expect(ctrl.touched).toBeTrue();
      });
    });
  });
});
