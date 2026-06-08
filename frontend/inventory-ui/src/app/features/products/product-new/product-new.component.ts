import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductFormComponent, ProductFormValue } from '../product-form/product-form.component';

@Component({
  selector: 'app-product-new',
  standalone: true,
  imports: [ProductFormComponent],
  template: `
    <app-product-form
      title="New Product"
      (submitted)="onCreate($event)"
      (cancelled)="onCancel()"
    ></app-product-form>
  `,
})
export class ProductNewComponent {
  constructor(private readonly router: Router) {}

  onCreate(value: ProductFormValue): void {
    // TODO: call ProductService.create(value)
    void this.router.navigate(['/products']);
  }

  onCancel(): void {
    void this.router.navigate(['/products']);
  }
}
