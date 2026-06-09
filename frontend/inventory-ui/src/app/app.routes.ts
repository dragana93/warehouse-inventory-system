import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { CategoryListComponent } from './features/categories/category-list/category-list.component';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { ProductDetailComponent } from './features/products/product-detail/product-detail.component';
import { ProductNewComponent } from './features/products/product-new/product-new.component';
import { ProductEditComponent } from './features/products/product-edit/product-edit.component';
import { InventoryUpdateComponent } from './features/inventory/inventory-update/inventory-update.component';
import { InventoryHistoryComponent } from './features/inventory/inventory-history/inventory-history.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'products', component: ProductListComponent },
      { path: 'products/new', component: ProductNewComponent },
      { path: 'products/edit/:id', component: ProductEditComponent },
      { path: 'products/:id', component: ProductDetailComponent },
      { path: 'categories', component: CategoryListComponent },
      { path: 'inventory/update', component: InventoryUpdateComponent },
      { path: 'inventory/history', component: InventoryHistoryComponent },
      { path: '', redirectTo: 'products', pathMatch: 'full' },
    ],
  },
];
