import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { CategoryListComponent } from './features/categories/category-list/category-list.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'categories', component: CategoryListComponent },
    ],
  },
];
