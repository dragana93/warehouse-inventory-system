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

  it('should configure the layout as the root route with category child', () => {
    expect(routes[0].path).toBe('');
    expect(routes[0].component).toBeDefined();
    const children = routes[0].children as Routes;
    expect(children.some((r) => r.path === 'categories')).toBe(true);
  });
});
