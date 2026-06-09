import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { ReportsComponent } from './reports.component';
import { ReportService } from '../report.service';
import { CategoryStockReport } from '../../../models/report.model';

const mockEntries: CategoryStockReport[] = [
  { category: 'Beverages', totalQuantity: 120 },
  { category: 'Snacks', totalQuantity: 80 },
  { category: 'Household', totalQuantity: 50 },
];

async function setup(entries: CategoryStockReport[] = mockEntries, shouldError = false) {
  const mockReportService = {
    getStockByCategory: vi.fn().mockReturnValue(
      shouldError ? throwError(() => new Error('Server error')) : of(entries),
    ),
  };

  await TestBed.configureTestingModule({
    imports: [ReportsComponent],
    providers: [
      provideNoopAnimations(),
      { provide: ReportService, useValue: mockReportService },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(ReportsComponent);
  fixture.detectChanges();
  await fixture.whenStable();

  return { fixture, component: fixture.componentInstance, mockReportService };
}

describe('ReportsComponent', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should call ReportService.getStockByCategory on init', async () => {
    const { mockReportService } = await setup();
    expect(mockReportService.getStockByCategory).toHaveBeenCalledOnce();
  });

  it('should load all category stock entries', async () => {
    const { component } = await setup();
    expect(component.entries().length).toBe(3);
  });

  it('should set loading to false after successful load', async () => {
    const { component } = await setup();
    expect(component.loading()).toBe(false);
  });

  it('should display a card for each category', async () => {
    const { fixture } = await setup();
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('mat-card');
    expect(cards.length).toBe(mockEntries.length);
  });

  it('should display category names', async () => {
    const { fixture } = await setup();
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Beverages');
    expect(text).toContain('Snacks');
    expect(text).toContain('Household');
  });

  it('should display stock totals', async () => {
    const { fixture } = await setup();
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('120');
    expect(text).toContain('80');
    expect(text).toContain('50');
  });

  describe('error state', () => {
    it('should set loading to false on error', async () => {
      const { component } = await setup([], true);
      expect(component.loading()).toBe(false);
    });

    it('should set error signal to true on failure', async () => {
      const { component } = await setup([], true);
      expect(component.error()).toBe(true);
    });

    it('should display error message', async () => {
      const { fixture } = await setup([], true);
      fixture.detectChanges();
      const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
      expect(text).toContain('Failed to load report');
    });
  });

  describe('empty state', () => {
    it('should show no-data message when entries are empty', async () => {
      const { fixture } = await setup([]);
      fixture.detectChanges();
      const noData = fixture.nativeElement.querySelector('.no-data');
      expect(noData).not.toBeNull();
    });

    it('should display no cards when entries are empty', async () => {
      const { fixture } = await setup([]);
      fixture.detectChanges();
      const cards = fixture.nativeElement.querySelectorAll('mat-card');
      expect(cards.length).toBe(0);
    });
  });
});
