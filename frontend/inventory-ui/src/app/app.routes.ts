import { Routes } from '@angular/router';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { ProductNewComponent } from './features/products/product-new/product-new.component';
import { ProductEditComponent } from './features/products/product-edit/product-edit.component';
import { ProductDetailComponent } from './features/products/product-detail/product-detail.component';
import { CategoryListComponent } from './features/categories/category-list/category-list.component';
import { InventoryHistoryComponent } from './features/inventory/inventory-history/inventory-history.component';
import { ReportsComponent } from './features/reports/reports/reports.component';

export const routes: Routes = [
  { path: 'products', component: ProductListComponent },
  { path: 'products/new', component: ProductNewComponent },
  { path: 'products/edit/:id', component: ProductEditComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'categories', component: CategoryListComponent },
  { path: 'inventory/history', component: InventoryHistoryComponent },
  { path: 'reports', component: ReportsComponent },
  { path: '', redirectTo: 'products', pathMatch: 'full' },
];
