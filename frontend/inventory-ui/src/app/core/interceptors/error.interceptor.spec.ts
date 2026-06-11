import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { errorInterceptor } from './error.interceptor';
import { ErrorNotificationService } from '../services/error-notification.service';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let showErrorSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    showErrorSpy = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: ErrorNotificationService, useValue: { showError: showErrorSpy } },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should pass through successful requests without calling showError', () => {
    http.get('/api/test').subscribe();
    httpMock.expectOne('/api/test').flush({ ok: true });
    expect(showErrorSpy).not.toHaveBeenCalled();
  });

  it('should show connection error for status 0', () => {
    http.get('/api/test').subscribe({ error: () => {} });
    httpMock.expectOne('/api/test').flush(null, { status: 0, statusText: 'Unknown Error' });
    expect(showErrorSpy).toHaveBeenCalledWith(
      'Unable to connect to the server. Please check your connection.',
    );
  });

  it('should use API message from error.message if present', () => {
    http.get('/api/test').subscribe({ error: () => {} });
    httpMock.expectOne('/api/test').flush(
      { message: 'Product not found' },
      { status: 404, statusText: 'Not Found' },
    );
    expect(showErrorSpy).toHaveBeenCalledWith('Product not found');
  });

  it('should show user-friendly message for 400 when no API message', () => {
    http.get('/api/test').subscribe({ error: () => {} });
    httpMock.expectOne('/api/test').flush({}, { status: 400, statusText: 'Bad Request' });
    expect(showErrorSpy).toHaveBeenCalledWith('Invalid request. Please check your input.');
  });

  it('should show user-friendly message for 404 when no API message', () => {
    http.get('/api/test').subscribe({ error: () => {} });
    httpMock.expectOne('/api/test').flush({}, { status: 404, statusText: 'Not Found' });
    expect(showErrorSpy).toHaveBeenCalledWith('The requested resource was not found.');
  });

  it('should show user-friendly message for 409', () => {
    http.get('/api/test').subscribe({ error: () => {} });
    httpMock.expectOne('/api/test').flush({}, { status: 409, statusText: 'Conflict' });
    expect(showErrorSpy).toHaveBeenCalledWith(
      'A conflict occurred. The resource may already exist.',
    );
  });

  it('should show user-friendly message for 500', () => {
    http.get('/api/test').subscribe({ error: () => {} });
    httpMock.expectOne('/api/test').flush({}, { status: 500, statusText: 'Server Error' });
    expect(showErrorSpy).toHaveBeenCalledWith(
      'A server error occurred. Please try again later.',
    );
  });

  it('should show generic message for unknown status codes', () => {
    http.get('/api/test').subscribe({ error: () => {} });
    httpMock.expectOne('/api/test').flush({}, { status: 503, statusText: 'Service Unavailable' });
    expect(showErrorSpy).toHaveBeenCalledWith('An unexpected error occurred (503).');
  });

  it('should re-throw the error after handling', () => new Promise<void>((resolve) => {
    http.get('/api/test').subscribe({
      error: (err: unknown) => {
        expect(err).toBeTruthy();
        resolve();
      },
    });
    httpMock.expectOne('/api/test').flush({}, { status: 500, statusText: 'Server Error' });
  }));
});
