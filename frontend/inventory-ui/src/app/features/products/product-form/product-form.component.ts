import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../categories/category.service';

export interface ProductFormValue {
  code: string;
  name: string;
  price: number;
  categoryId: number;
  quantity: number;
}

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);

  readonly title = input<string>('Product');
  readonly initial = input<ProductFormValue | null>(null);
  readonly submitted = output<ProductFormValue>();
  readonly cancelled = output<void>();

  readonly categories = signal<Category[]>([]);

  readonly form = this.fb.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    price: [null as number | null, [Validators.required, Validators.min(0.01)]],
    categoryId: [null as number | null, Validators.required],
    quantity: [null as number | null, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    this.categoryService.getAll().subscribe((cats) => this.categories.set(cats));

    const init = this.initial();
    if (init) {
      this.form.setValue({
        code: init.code,
        name: init.name,
        price: init.price,
        categoryId: init.categoryId,
        quantity: init.quantity,
      });
    }
  }

  submit(): void {
    if (this.form.valid) {
      this.submitted.emit(this.form.value as ProductFormValue);
    } else {
      this.form.markAllAsTouched();
    }
  }

  cancel(): void {
    this.cancelled.emit();
  }
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  template: `
    <div class="container">
      <h1>{{ title() }}</h1>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
        <mat-form-field appearance="outline">
          <mat-label>Code</mat-label>
          <input matInput formControlName="code" />
          @if (form.controls['code'].invalid && form.controls['code'].touched) {
            <mat-error>Code is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
          @if (form.controls['name'].invalid && form.controls['name'].touched) {
            <mat-error>Name is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Price</mat-label>
          <input matInput type="number" formControlName="price" />
          @if (form.controls['price'].hasError('required') && form.controls['price'].touched) {
            <mat-error>Price is required</mat-error>
          } @else if (form.controls['price'].hasError('min') && form.controls['price'].touched) {
            <mat-error>Price must be greater than 0</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Category</mat-label>
          <mat-select formControlName="categoryId">
            <!-- TODO: populate from CategoryService -->
            <mat-option [value]="1">Beverages</mat-option>
            <mat-option [value]="2">Snacks</mat-option>
            <mat-option [value]="3">Household</mat-option>
          </mat-select>
          @if (form.controls['categoryId'].invalid && form.controls['categoryId'].touched) {
            <mat-error>Category is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Quantity</mat-label>
          <input matInput type="number" formControlName="quantity" />
          @if (form.controls['quantity'].hasError('required') && form.controls['quantity'].touched) {
            <mat-error>Quantity is required</mat-error>
          } @else if (form.controls['quantity'].hasError('min') && form.controls['quantity'].touched) {
            <mat-error>Quantity cannot be negative</mat-error>
          }
        </mat-form-field>

        <div class="actions">
          <button mat-button type="button" (click)="cancelled.emit()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Save</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container { padding: 24px; max-width: 480px; }
    .form { display: flex; flex-direction: column; gap: 8px; }
    .actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 8px; }
  `],
})
export class ProductFormComponent implements OnInit {
  readonly title = input<string>('Product');
  readonly initial = input<ProductFormValue | null>(null);
  readonly submitted = output<ProductFormValue>();
  readonly cancelled = output<void>();

  form!: FormGroup;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    const init = this.initial();
    this.form = this.fb.group({
      code:       [init?.code ?? '',         Validators.required],
      name:       [init?.name ?? '',         Validators.required],
      price:      [init?.price ?? null,      [Validators.required, Validators.min(0.01)]],
      categoryId: [init?.categoryId ?? null, Validators.required],
      quantity:   [init?.quantity ?? null,   [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitted.emit(this.form.value as ProductFormValue);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
