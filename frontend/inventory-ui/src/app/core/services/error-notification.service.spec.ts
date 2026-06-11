import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorNotificationService } from './error-notification.service';

describe('ErrorNotificationService', () => {
  let service: ErrorNotificationService;
  let snackBarOpen: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    snackBarOpen = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        ErrorNotificationService,
        { provide: MatSnackBar, useValue: { open: snackBarOpen } },
      ],
    });

    service = TestBed.inject(ErrorNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call snackBar.open with the error message', () => {
    service.showError('Something went wrong');

    expect(snackBarOpen).toHaveBeenCalledWith(
      'Something went wrong',
      'Dismiss',
      expect.objectContaining({
        duration: 5000,
        panelClass: ['error-snackbar'],
      }),
    );
  });

  it('should use bottom center position', () => {
    service.showError('Error');

    expect(snackBarOpen).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.objectContaining({
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      }),
    );
  });
});
