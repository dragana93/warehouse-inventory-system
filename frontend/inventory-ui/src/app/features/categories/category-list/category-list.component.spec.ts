import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { CategoryListComponent } from './category-list.component';
import { CategoryService } from '../category.service';
import { Category, CategoryPayload } from '../../../models/category.model';

const mockCategories: Category[] = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Clothing' },
];

function createDialogMock(afterClosedValue: unknown) {
  const dialogRef = { afterClosed: vi.fn().mockReturnValue(of(afterClosedValue)) };
  const dialog = { open: vi.fn().mockReturnValue(dialogRef) };
  return dialog;
}

describe('CategoryListComponent', () => {
  let mockCategoryService: {
    getAll: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockCategoryService = {
      getAll: vi.fn().mockReturnValue(of(mockCategories)),
      create: vi.fn().mockReturnValue(of({ id: 3, name: 'Books' })),
      update: vi.fn().mockReturnValue(of({ id: 1, name: 'Updated' })),
      delete: vi.fn().mockReturnValue(of(undefined)),
    };
  });

  async function createComponent(dialogMock: { open: ReturnType<typeof vi.fn> }) {
    await TestBed.configureTestingModule({
      imports: [CategoryListComponent],
      providers: [
        provideNoopAnimations(),
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: MatDialog, useValue: dialogMock },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(CategoryListComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('should create', async () => {
    const fixture = await createComponent({ open: vi.fn() });
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should load categories on init', async () => {
    const fixture = await createComponent({ open: vi.fn() });
    await fixture.whenStable();
    expect(mockCategoryService.getAll).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.categories()).toEqual(mockCategories);
  });

  it('should display loading spinner while loading', async () => {
    const fixture = await createComponent({ open: vi.fn() });
    // loading starts true then resolves synchronously with of()
    await fixture.whenStable();
    expect(fixture.componentInstance.loading()).toBe(false);
  });

  it('should render a row for each category', async () => {
    const fixture = await createComponent({ open: vi.fn() });
    await fixture.whenStable();
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tr[mat-row]');
    expect(rows.length).toBe(mockCategories.length);
  });

  it('should call create and reload when add dialog returns payload', async () => {
    const payload: CategoryPayload = { name: 'Books' };
    const dialogMock = createDialogMock(payload);
    const fixture = await createComponent(dialogMock);
    await fixture.whenStable();

    fixture.componentInstance.openAddDialog();

    expect(dialogMock.open).toHaveBeenCalled();
    expect(mockCategoryService.create).toHaveBeenCalledWith(payload);
    expect(mockCategoryService.getAll).toHaveBeenCalledTimes(2);
  });

  it('should not call create when add dialog is cancelled', async () => {
    const dialogMock = createDialogMock(undefined);
    const fixture = await createComponent(dialogMock);
    await fixture.whenStable();
    mockCategoryService.getAll.mockClear();

    fixture.componentInstance.openAddDialog();

    expect(mockCategoryService.create).not.toHaveBeenCalled();
    expect(mockCategoryService.getAll).not.toHaveBeenCalled();
  });

  it('should call update and reload when edit dialog returns payload', async () => {
    const payload: CategoryPayload = { name: 'Updated' };
    const dialogMock = createDialogMock(payload);
    const fixture = await createComponent(dialogMock);
    await fixture.whenStable();

    fixture.componentInstance.openEditDialog(mockCategories[0]);

    expect(mockCategoryService.update).toHaveBeenCalledWith(1, payload);
    expect(mockCategoryService.getAll).toHaveBeenCalledTimes(2);
  });

  it('should not call update when edit dialog is cancelled', async () => {
    const dialogMock = createDialogMock(undefined);
    const fixture = await createComponent(dialogMock);
    await fixture.whenStable();
    mockCategoryService.getAll.mockClear();

    fixture.componentInstance.openEditDialog(mockCategories[0]);

    expect(mockCategoryService.update).not.toHaveBeenCalled();
    expect(mockCategoryService.getAll).not.toHaveBeenCalled();
  });

  it('should call delete and reload when delete dialog is confirmed', async () => {
    const dialogMock = createDialogMock(true);
    const fixture = await createComponent(dialogMock);
    await fixture.whenStable();

    fixture.componentInstance.openDeleteDialog(mockCategories[0]);

    expect(mockCategoryService.delete).toHaveBeenCalledWith(1);
    expect(mockCategoryService.getAll).toHaveBeenCalledTimes(2);
  });

  it('should not call delete when delete dialog is cancelled', async () => {
    const dialogMock = createDialogMock(false);
    const fixture = await createComponent(dialogMock);
    await fixture.whenStable();
    mockCategoryService.getAll.mockClear();

    fixture.componentInstance.openDeleteDialog(mockCategories[0]);

    expect(mockCategoryService.delete).not.toHaveBeenCalled();
    expect(mockCategoryService.getAll).not.toHaveBeenCalled();
  });

  it('should open edit dialog with the selected category data', async () => {
    const dialogMock = createDialogMock(undefined);
    const fixture = await createComponent(dialogMock);
    await fixture.whenStable();

    fixture.componentInstance.openEditDialog(mockCategories[0]);

    expect(dialogMock.open).toHaveBeenCalledWith(expect.anything(), {
      data: mockCategories[0],
    });
  });

  it('should open delete dialog with the category name', async () => {
    const dialogMock = createDialogMock(false);
    const fixture = await createComponent(dialogMock);
    await fixture.whenStable();

    fixture.componentInstance.openDeleteDialog(mockCategories[0]);

    expect(dialogMock.open).toHaveBeenCalledWith(expect.anything(), {
      data: { name: 'Electronics' },
    });
  });
});
