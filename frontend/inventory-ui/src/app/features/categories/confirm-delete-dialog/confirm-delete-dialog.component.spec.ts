import { TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog.component';

async function setup() {
  const dialogRefMock = { close: vi.fn() };
  await TestBed.configureTestingModule({
    imports: [ConfirmDeleteDialogComponent],
    providers: [
      provideNoopAnimations(),
      { provide: MatDialogRef, useValue: dialogRefMock },
      { provide: MAT_DIALOG_DATA, useValue: { name: 'Electronics' } },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(ConfirmDeleteDialogComponent);
  fixture.detectChanges();
  return { fixture, dialogRefMock };
}

describe('ConfirmDeleteDialogComponent', () => {
  it('should create', async () => {
    const { fixture } = await setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display the category name in the dialog', async () => {
    const { fixture } = await setup();
    await fixture.whenStable();
    const content = fixture.nativeElement as HTMLElement;
    expect(content.textContent).toContain('Electronics');
  });

  it('should close with true on confirm', async () => {
    const { fixture, dialogRefMock } = await setup();
    fixture.componentInstance.confirm();
    expect(dialogRefMock.close).toHaveBeenCalledWith(true);
  });

  it('should close with false on cancel', async () => {
    const { fixture, dialogRefMock } = await setup();
    fixture.componentInstance.cancel();
    expect(dialogRefMock.close).toHaveBeenCalledWith(false);
  });

  it('should expose the injected data', async () => {
    const { fixture } = await setup();
    expect(fixture.componentInstance.data).toEqual({ name: 'Electronics' });
  });

  it('should close with false when Cancel button is clicked in the DOM', async () => {
    const { fixture, dialogRefMock } = await setup();
    await fixture.whenStable();
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const cancelButton = Array.from(buttons).find((b: any) =>
      b.textContent.trim() === 'Cancel',
    ) as HTMLButtonElement;

    expect(cancelButton).toBeTruthy();
    cancelButton.click();
    fixture.detectChanges();

    expect(dialogRefMock.close).toHaveBeenCalledWith(false);
  });

  it('should close with true when Delete button is clicked in the DOM', async () => {
    const { fixture, dialogRefMock } = await setup();
    await fixture.whenStable();
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const deleteButton = Array.from(buttons).find((b: any) =>
      b.textContent.trim() === 'Delete',
    ) as HTMLButtonElement;

    expect(deleteButton).toBeTruthy();
    deleteButton.click();
    fixture.detectChanges();

    expect(dialogRefMock.close).toHaveBeenCalledWith(true);
  });

  it('should display the static warning text about the action being irreversible', async () => {
    const { fixture } = await setup();
    await fixture.whenStable();
    const content = fixture.nativeElement as HTMLElement;
    expect(content.textContent).toContain('This action cannot be undone');
  });
});
