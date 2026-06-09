import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Product } from '../../../models/product.model';
import { InventoryAction, InventoryUpdateResult } from '../../../models/inventory.model';
import { InventoryService } from '../inventory.service';
import { ProductService } from '../../products/product.service';

function maxDecreaseValidator(currentQty: () => number): ValidatorFn {
  return (control: AbstractControl) => {
    const value = Number(control.value);
    if (isNaN(value) || value <= 0) return null;
    if (currentQty() !== null && value > currentQty()) {
      return { exceedsStock: { available: currentQty(), requested: value } };
    }
    return null;
  };
}

@Component({
  selector: 'app-inventory-update',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './inventory-update.component.html',
  styleUrl: './inventory-update.component.scss',
})
export class InventoryUpdateComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly inventoryService = inject(InventoryService);

  readonly products = signal<Product[]>([]);
  readonly loading = signal(false);
  readonly result = signal<InventoryUpdateResult | null>(null);
  readonly serverError = signal<string | null>(null);

  readonly selectedProduct = computed(() =>
    this.products().find((p) => p.id === this.form.controls.productId.value) ?? null,
  );

  readonly form = this.fb.group({
    productId: [null as number | null, Validators.required],
    action: ['increase' as InventoryAction, Validators.required],
    quantity: [null as number | null, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.productService.getAll().subscribe((products) => this.products.set(products));

    // Re-validate quantity when action or product changes
    this.form.controls.action.valueChanges.subscribe(() =>
      this.form.controls.quantity.updateValueAndValidity(),
    );
    this.form.controls.productId.valueChanges.subscribe(() =>
      this.form.controls.quantity.updateValueAndValidity(),
    );
  }

  submit(): void {
    this.serverError.set(null);
    this.result.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { productId, action, quantity } = this.form.value;

    // Client-side: prevent decrease below 0
    const current = this.selectedProduct()?.quantity ?? 0;
    if (action === 'decrease' && quantity! > current) {
      this.form.controls.quantity.setErrors({ exceedsStock: { available: current, requested: quantity } });
      return;
    }

    const previousQuantity = current;
    this.loading.set(true);
    const operation$ = action === 'increase'
      ? this.inventoryService.increase(productId!, quantity!)
      : this.inventoryService.decrease(productId!, quantity!);

    operation$.subscribe({
      next: (res) => {
        this.result.set({ productId: res.id, previousQuantity, newQuantity: res.quantity });
        this.loading.set(false);
        this.form.reset({ action: 'increase' });
      },
      error: (err: { error?: { message?: string } }) => {
        this.serverError.set(err?.error?.message ?? 'An error occurred. Please try again.');
        this.loading.set(false);
      },
    });
  }

  reset(): void {
    this.result.set(null);
    this.serverError.set(null);
    this.form.reset({ action: 'increase' });
  }
}
