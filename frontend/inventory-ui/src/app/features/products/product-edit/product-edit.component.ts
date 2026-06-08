import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductFormComponent, ProductFormValue } from '../product-form/product-form.component';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-edit',
  imports: [ProductFormComponent],
  template: `
    @if (initial()) {
      <app-product-form
        title="Edit Product"
        [initial]="initial()!"
        (submitted)="onUpdate($event)"
        (cancelled)="onCancel()"
      />
    }
  `,
})
export class ProductEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);

  readonly initial = signal<ProductFormValue | null>(null);

  private productId = 0;

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getById(this.productId).subscribe((product) => {
      this.initial.set({
        code: product.code,
        name: product.name,
        price: product.price,
        categoryId: product.categoryId,
        quantity: product.quantity,
      });
    });
  }

  onUpdate(value: ProductFormValue): void {
    this.productService.update(this.productId, value).subscribe(() => {
      void this.router.navigate(['/products']);
    });
  }

  onCancel(): void {
    void this.router.navigate(['/products']);
  }
}
