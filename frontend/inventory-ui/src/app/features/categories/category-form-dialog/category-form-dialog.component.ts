import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Category, CategoryPayload } from '../../../models/category.model';

@Component({
  selector: 'app-category-form-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './category-form-dialog.component.html',
})
export class CategoryFormDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CategoryFormDialogComponent>);
  private readonly fb = inject(FormBuilder);
  readonly data = inject<Category | null>(MAT_DIALOG_DATA);

  readonly isEditMode = !!this.data;

  readonly form = this.fb.group({
    name: [this.data?.name ?? '', Validators.required],
  });

  submit(): void {
    if (this.form.valid) {
      const payload: CategoryPayload = { name: this.form.controls.name.value! };
      this.dialogRef.close(payload);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
