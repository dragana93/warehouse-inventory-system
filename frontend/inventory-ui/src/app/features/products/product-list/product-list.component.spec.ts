import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProductListComponent } from './product-list.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

describe('ProductListComponent', () => {
  let fixture: ComponentFixture<ProductListComponent>;
  let component: ProductListComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent, RouterModule.forRoot([]), FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('displays all expected columns', () => {
    expect(component.columns).toEqual(['code', 'name', 'category', 'price', 'quantity', 'actions']);
  });

  it('starts with empty search and no category filter', () => {
    expect(component.search()).toBe('');
    expect(component.categoryFilter()).toBe('');
  });

  it('pagedProducts returns empty array when no products loaded', () => {
    expect(component.pagedProducts()).toEqual([]);
  });
});
