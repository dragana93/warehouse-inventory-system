import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProductFormComponent, ProductFormValue } from '../product-form/product-form.component';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-new',
  imports: [ProductFormComponent],
  template: `
    <app-product-form
      title="New Product"
      (submitted)="onCreate($event)"
      (cancelled)="onCancel()"
    />
  `,
})
export class ProductNewComponent {
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);

  onCreate(value: ProductFormValue): void {
    this.productService.create(value).subscribe(() => {
      void this.router.navigate(['/products']);
    });
  }

  onCancel(): void {
    void this.router.navigate(['/products']);
  }
}
