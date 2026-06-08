import { TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { CategoryFormDialogComponent } from './category-form-dialog.component';
import { Category } from '../../../models/category.model';

function createDialogRefMock() {
  return { close: vi.fn() };
}

async function setup(dialogData: Category | null) {
  const dialogRefMock = createDialogRefMock();
  await TestBed.configureTestingModule({
    imports: [CategoryFormDialogComponent],
    providers: [
      provideNoopAnimations(),
      { provide: MatDialogRef, useValue: dialogRefMock },
      { provide: MAT_DIALOG_DATA, useValue: dialogData },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(CategoryFormDialogComponent);
  fixture.detectChanges();
  return { fixture, dialogRefMock };
}

describe('CategoryFormDialogComponent — Add mode', () => {
  it('should create', async () => {
    const { fixture } = await setup(null);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should set isEditMode to false when no data', async () => {
    const { fixture } = await setup(null);
    expect(fixture.componentInstance.isEditMode).toBe(false);
  });

  it('should display Add Category title', async () => {
    const { fixture } = await setup(null);
    await fixture.whenStable();
    const title = fixture.nativeElement.querySelector('[mat-dialog-title]') as HTMLElement;
    expect(title.textContent).toContain('Add Category');
  });

  it('should have empty name field', async () => {
    const { fixture } = await setup(null);
    expect(fixture.componentInstance.form.controls.name.value).toBe('');
  });

  it('should be invalid when name is empty', async () => {
    const { fixture } = await setup(null);
    expect(fixture.componentInstance.form.invalid).toBe(true);
  });

  it('should be valid when name has a value', async () => {
    const { fixture } = await setup(null);
    fixture.componentInstance.form.controls.name.setValue('Books');
    expect(fixture.componentInstance.form.valid).toBe(true);
  });

  it('should close with payload on valid submit', async () => {
    const { fixture, dialogRefMock } = await setup(null);
    fixture.componentInstance.form.controls.name.setValue('Books');
    fixture.componentInstance.submit();
    expect(dialogRefMock.close).toHaveBeenCalledWith({ name: 'Books' });
  });

  it('should not close on invalid submit', async () => {
    const { fixture, dialogRefMock } = await setup(null);
    fixture.componentInstance.submit();
    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });

  it('should close with no value on cancel', async () => {
    const { fixture, dialogRefMock } = await setup(null);
    fixture.componentInstance.cancel();
    expect(dialogRefMock.close).toHaveBeenCalledWith();
  });
});

describe('CategoryFormDialogComponent — Edit mode', () => {
  const existingCategory: Category = { id: 1, name: 'Electronics' };

  it('should set isEditMode to true when data is provided', async () => {
    const { fixture } = await setup(existingCategory);
    expect(fixture.componentInstance.isEditMode).toBe(true);
  });

  it('should display Edit Category title', async () => {
    const { fixture } = await setup(existingCategory);
    await fixture.whenStable();
    const title = fixture.nativeElement.querySelector('[mat-dialog-title]') as HTMLElement;
    expect(title.textContent).toContain('Edit Category');
  });

  it('should pre-fill name field with existing category name', async () => {
    const { fixture } = await setup(existingCategory);
    expect(fixture.componentInstance.form.controls.name.value).toBe('Electronics');
  });

  it('should close with updated payload on submit', async () => {
    const { fixture, dialogRefMock } = await setup(existingCategory);
    fixture.componentInstance.form.controls.name.setValue('Electronics Updated');
    fixture.componentInstance.submit();
    expect(dialogRefMock.close).toHaveBeenCalledWith({ name: 'Electronics Updated' });
  });
});
