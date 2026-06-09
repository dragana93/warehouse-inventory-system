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

