import { TestBed } from '@angular/core/testing';
import { provideRouter, Routes } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should contain a router outlet', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });

  describe('route configuration', () => {
    let children: Routes;

    beforeEach(() => {
      expect(routes[0].path).toBe('');
      expect(routes[0].component).toBeDefined();
      children = routes[0].children as Routes;
    });

    it('should define child routes', () => {
      expect(children).toBeDefined();
      expect(children.length).toBeGreaterThan(0);
    });

    it('should include the products route', () => {
      expect(children.some((r) => r.path === 'products')).toBe(true);
    });

    it('should include the products/new route', () => {
      expect(children.some((r) => r.path === 'products/new')).toBe(true);
    });

    it('should include the products/edit/:id route', () => {
      expect(children.some((r) => r.path === 'products/edit/:id')).toBe(true);
    });

    it('should include the products/:id route', () => {
      expect(children.some((r) => r.path === 'products/:id')).toBe(true);
    });

    it('should include the categories route', () => {
      expect(children.some((r) => r.path === 'categories')).toBe(true);
    });

    it('should include the inventory/update route', () => {
      expect(children.some((r) => r.path === 'inventory/update')).toBe(true);
    });

    it('should include the inventory/history route', () => {
      expect(children.some((r) => r.path === 'inventory/history')).toBe(true);
    });

    it('should include the reports route', () => {
      expect(children.some((r) => r.path === 'reports')).toBe(true);
    });

    it('should redirect the empty path to products', () => {
      const defaultRoute = children.find((r) => r.path === '' && r.redirectTo);
      expect(defaultRoute).toBeDefined();
      expect(defaultRoute?.redirectTo).toBe('products');
    });
  });
});
