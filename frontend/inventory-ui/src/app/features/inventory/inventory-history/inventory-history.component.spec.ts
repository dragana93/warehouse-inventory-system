import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { InventoryHistoryComponent } from './inventory-history.component';
import { InventoryService } from '../inventory.service';
import { InventoryHistoryEntry } from '../../../models/inventory.model';

const mockEntries: InventoryHistoryEntry[] = [
  {
    id: 1,
    date: '2026-06-09T10:00:00.000Z',
    product: 'Widget',
    oldQuantity: 50,
    newQuantity: 60,
    action: 'increase',
  },
  {
    id: 2,
    date: '2026-06-08T08:00:00.000Z',
    product: 'Gadget',
    oldQuantity: 20,
    newQuantity: 15,
    action: 'decrease',
  },
  {
    id: 3,
    date: '2026-06-07T06:00:00.000Z',
    product: 'Doohickey',
    oldQuantity: 100,
    newQuantity: 110,
    action: 'increase',
  },
];

async function setup(entries: InventoryHistoryEntry[] = mockEntries, shouldError = false) {
  const mockInventoryService = {
    getHistory: vi.fn().mockReturnValue(
      shouldError ? throwError(() => new Error('Failed')) : of(entries),
    ),
  };

  await TestBed.configureTestingModule({
    imports: [InventoryHistoryComponent],
    providers: [
      provideNoopAnimations(),
      { provide: InventoryService, useValue: mockInventoryService },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(InventoryHistoryComponent);
  fixture.detectChanges();
  await fixture.whenStable();

  return { fixture, component: fixture.componentInstance, mockInventoryService };
}

describe('InventoryHistoryComponent', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should call InventoryService.getHistory on init', async () => {
    const { mockInventoryService } = await setup();
    expect(mockInventoryService.getHistory).toHaveBeenCalledOnce();
  });

  it('should load and display all history entries', async () => {
    const { component } = await setup();
    expect(component.entries().length).toBe(3);
  });

  it('should set loading to false after successful load', async () => {
    const { component } = await setup();
    expect(component.loading()).toBe(false);
  });

  it('should display the correct columns', async () => {
    const { component } = await setup();
    expect(component.columns).toEqual(['date', 'product', 'oldQuantity', 'newQuantity', 'action']);
  });

  it('should render a row for each entry', async () => {
    const { fixture } = await setup();
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tr[mat-row]');
    expect(rows.length).toBe(mockEntries.length);
  });

  it('should display product names in the table', async () => {
    const { fixture } = await setup();
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Widget');
    expect(text).toContain('Gadget');
  });

  it('should display old and new quantities', async () => {
    const { fixture } = await setup();
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('50');
    expect(text).toContain('60');
  });

  describe('error state', () => {
    it('should set loading to false on error', async () => {
      const { component } = await setup([], true);
      expect(component.loading()).toBe(false);
    });

    it('should leave entries empty on error', async () => {
      const { component } = await setup([], true);
      expect(component.entries()).toEqual([]);
    });
  });

  describe('empty state', () => {
    it('should show no-data row when entries are empty', async () => {
      const { fixture } = await setup([]);
      fixture.detectChanges();
      const noData = fixture.nativeElement.querySelector('.no-data');
      expect(noData).not.toBeNull();
    });
  });

  describe('onSort()', () => {
    it('should sort entries by product name ascending', async () => {
      const { component } = await setup();
      component.onSort({ active: 'product', direction: 'asc' });
      const names = component.entries().map((e) => e.product);
      expect(names).toEqual([...names].sort());
    });

    it('should sort entries by product name descending', async () => {
      const { component } = await setup();
      component.onSort({ active: 'product', direction: 'desc' });
      const names = component.entries().map((e) => e.product);
      expect(names).toEqual([...names].sort().reverse());
    });

    it('should sort entries by date ascending', async () => {
      const { component } = await setup();
      component.onSort({ active: 'date', direction: 'asc' });
      const dates = component.entries().map((e) => e.date);
      expect(dates).toEqual([...dates].sort());
    });

    it('should sort entries by action ascending', async () => {
      const { component } = await setup();
      component.onSort({ active: 'action', direction: 'asc' });
      const actions = component.entries().map((e) => e.action);
      expect(actions).toEqual([...actions].sort());
    });

    it('should restore original order when direction is empty', async () => {
      const { component } = await setup();
      component.onSort({ active: 'product', direction: 'asc' });
      component.onSort({ active: 'product', direction: '' });
      expect(component.entries()).toEqual(mockEntries);
    });
  });
});
