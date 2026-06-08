import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { Category, CategoryPayload } from '../../../models/category.model';
import { CategoryService } from '../category.service';
import { CategoryFormDialogComponent } from '../category-form-dialog/category-form-dialog.component';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-category-list',
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly dialog = inject(MatDialog);

  readonly categories = signal<Category[]>([]);
  readonly loading = signal(false);
  readonly displayedColumns = ['name', 'actions'];

  ngOnInit(): void {
    this.loadCategories();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(CategoryFormDialogComponent);
    dialogRef.afterClosed().subscribe((payload: CategoryPayload | undefined) => {
      if (payload) {
        this.categoryService.create(payload).subscribe(() => this.loadCategories());
      }
    });
  }

  openEditDialog(category: Category): void {
    const dialogRef = this.dialog.open(CategoryFormDialogComponent, { data: category });
    dialogRef.afterClosed().subscribe((payload: CategoryPayload | undefined) => {
      if (payload) {
        this.categoryService.update(category.id, payload).subscribe(() => this.loadCategories());
      }
    });
  }

  openDeleteDialog(category: Category): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: { name: category.name },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.categoryService.delete(category.id).subscribe(() => this.loadCategories());
      }
    });
  }

  private loadCategories(): void {
    this.loading.set(true);
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
