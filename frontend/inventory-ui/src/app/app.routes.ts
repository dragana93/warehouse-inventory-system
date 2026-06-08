import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { CategoryListComponent } from './features/categories/category-list/category-list.component';
import { ProductListComponent } from './features/products/product-list/product-list.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'products', component: ProductListComponent },
      { path: 'categories', component: CategoryListComponent },
      { path: '', redirectTo: 'products', pathMatch: 'full' },
    ],
  },
];
