import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductFormComponent, ProductFormValue } from '../product-form/product-form.component';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [ProductFormComponent],
  template: `
    @if (initial()) {
      <app-product-form
        title="Edit Product"
        [initial]="initial()!"
        (submitted)="onUpdate($event)"
        (cancelled)="onCancel()"
      ></app-product-form>
    }
  `,
})
export class ProductEditComponent implements OnInit {
  readonly initial = signal<ProductFormValue | null>(null);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    // TODO: load product by id from ProductService and set initial()
    void id;
  }

  onUpdate(value: ProductFormValue): void {
    // TODO: call ProductService.update(id, value)
    void this.router.navigate(['/products']);
  }

  onCancel(): void {
    void this.router.navigate(['/products']);
  }
}
