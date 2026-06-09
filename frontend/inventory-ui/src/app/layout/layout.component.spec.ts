import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { of } from 'rxjs';
import { LayoutComponent } from './layout.component';

function createBreakpointObserverMock(matches: boolean) {
  return { observe: vi.fn().mockReturnValue(of({ matches })) };
}

describe('LayoutComponent', () => {
  describe('on desktop', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LayoutComponent],
        providers: [
          provideRouter([]),
          provideNoopAnimations(),
          { provide: BreakpointObserver, useValue: createBreakpointObserverMock(false) },
        ],
      }).compileComponents();
    });

    it('should create', () => {
      const fixture = TestBed.createComponent(LayoutComponent);
      fixture.detectChanges();
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('should display the toolbar with app title', async () => {
      const fixture = TestBed.createComponent(LayoutComponent);
      await fixture.whenStable();
      const toolbar = fixture.nativeElement.querySelector('mat-toolbar') as HTMLElement;
      expect(toolbar.textContent).toContain('Warehouse Inventory System');
    });

    it('should render all five navigation items', async () => {
      const fixture = TestBed.createComponent(LayoutComponent);
      await fixture.whenStable();
      const navLinks = fixture.nativeElement.querySelectorAll('mat-nav-list a');
      expect(navLinks.length).toBe(5);
    });

    it('should include Products in navigation', async () => {
      const fixture = TestBed.createComponent(LayoutComponent);
      await fixture.whenStable();
      const navList = fixture.nativeElement.querySelector('mat-nav-list') as HTMLElement;
      expect(navList.textContent).toContain('Products');
    });

    it('should include Categories in navigation', async () => {
      const fixture = TestBed.createComponent(LayoutComponent);
      await fixture.whenStable();
      const navList = fixture.nativeElement.querySelector('mat-nav-list') as HTMLElement;
      expect(navList.textContent).toContain('Categories');
    });

    it('should include Inventory Update in navigation', async () => {
      const fixture = TestBed.createComponent(LayoutComponent);
      await fixture.whenStable();
      const navList = fixture.nativeElement.querySelector('mat-nav-list') as HTMLElement;
      expect(navList.textContent).toContain('Inventory Update');
    });

    it('should include Inventory History in navigation', async () => {
      const fixture = TestBed.createComponent(LayoutComponent);
      await fixture.whenStable();
      const navList = fixture.nativeElement.querySelector('mat-nav-list') as HTMLElement;
      expect(navList.textContent).toContain('Inventory History');
    });

    it('should include Reports in navigation', async () => {
      const fixture = TestBed.createComponent(LayoutComponent);
      await fixture.whenStable();
      const navList = fixture.nativeElement.querySelector('mat-nav-list') as HTMLElement;
      expect(navList.textContent).toContain('Reports');
    });

    it('should set isMobile to false', () => {
      const fixture = TestBed.createComponent(LayoutComponent);
      fixture.detectChanges();
      expect(fixture.componentInstance.isMobile()).toBe(false);
    });

    it('should not show the hamburger menu button on desktop', async () => {
      const fixture = TestBed.createComponent(LayoutComponent);
      await fixture.whenStable();
      const menuButton = fixture.nativeElement.querySelector('mat-toolbar button');
      expect(menuButton).toBeNull();
    });
  });

  describe('on mobile', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LayoutComponent],
        providers: [
          provideRouter([]),
          provideNoopAnimations(),
          { provide: BreakpointObserver, useValue: createBreakpointObserverMock(true) },
        ],
      }).compileComponents();
    });

    it('should set isMobile to true', () => {
      const fixture = TestBed.createComponent(LayoutComponent);
      fixture.detectChanges();
      expect(fixture.componentInstance.isMobile()).toBe(true);
    });

    it('should show the hamburger menu button on mobile', async () => {
      const fixture = TestBed.createComponent(LayoutComponent);
      await fixture.whenStable();
      const menuButton = fixture.nativeElement.querySelector('mat-toolbar button');
      expect(menuButton).not.toBeNull();
    });
  });
});
