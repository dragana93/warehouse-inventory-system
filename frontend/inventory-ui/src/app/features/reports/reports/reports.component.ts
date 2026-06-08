import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

interface CategorySummary {
  category: string;
  totalItems: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <div class="container">
      <h1>Category Report</h1>
      <div class="cards">
        @for (entry of summary(); track entry.category) {
          <mat-card class="summary-card">
            <mat-card-header>
              <mat-card-title>{{ entry.category }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p class="total">{{ entry.totalItems }} items</p>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 24px; }
    .cards { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 16px; }
    .summary-card { min-width: 200px; }
    .total { font-size: 2rem; font-weight: 600; margin: 8px 0 0; }
  `],
})
export class ReportsComponent implements OnInit {
  readonly summary = signal<CategorySummary[]>([]);

  ngOnInit(): void {
    // TODO: load from ReportService
  }
}
