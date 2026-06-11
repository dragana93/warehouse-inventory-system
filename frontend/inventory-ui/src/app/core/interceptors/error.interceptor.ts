import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorNotificationService } from '../services/error-notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(ErrorNotificationService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const message = extractErrorMessage(error);
        notificationService.showError(message);
      }
      return throwError(() => error);
    })
  );
};

function extractErrorMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'Unable to connect to the server. Please check your connection.';
  }

  const apiMessage = (error.error as { message?: string })?.message;
  if (apiMessage) {
    return apiMessage;
  }

  switch (error.status) {
    case 400: return 'Invalid request. Please check your input.';
    case 404: return 'The requested resource was not found.';
    case 409: return 'A conflict occurred. The resource may already exist.';
    case 422: return 'Validation failed. Please check your input.';
    case 500: return 'A server error occurred. Please try again later.';
    default:  return `An unexpected error occurred (${error.status}).`;
  }
}
