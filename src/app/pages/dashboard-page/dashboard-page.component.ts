import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AddProductComponent } from '../../components/add-product/add-product.component';
import { BestSellingTableComponent } from '../../components/best-selling-table/best-selling-table.component';
import { SalesByCountryComponent } from '../../components/sales-by-country/sales-by-country.component';
import { StatCardComponent } from '../../components/stat-card/stat-card.component';
import { TopProductsComponent } from '../../components/top-products/top-products.component';
import { TransactionsTableComponent } from '../../components/transactions-table/transactions-table.component';
import { UserActivityComponent } from '../../components/user-activity/user-activity.component';
import { WeeklyReportComponent } from '../../components/weekly-report/weekly-report.component';
import { ApiService, DashboardData } from '../../services/api.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    CommonModule,
    StatCardComponent,
    WeeklyReportComponent,
    UserActivityComponent,
    SalesByCountryComponent,
    TransactionsTableComponent,
    TopProductsComponent,
    BestSellingTableComponent,
    AddProductComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="dashboard() as dashboard; else loading">
      <div class="dashboard-page">
        <div class="row g-3">
        @for (item of dashboard.statsCards; track item.title) {
          <div class="col-12 col-sm-6 col-xxl-3">
            <app-stat-card [data]="item"></app-stat-card>
          </div>
        }
      </div>

      <div class="row g-3 mt-1">
        <div class="col-12 col-xxl-8">
          <app-weekly-report
            [summary]="dashboard.weeklyMetrics"
            [chartData]="dashboard.weeklySeries"
          ></app-weekly-report>
        </div>

        <div class="col-12 col-md-6 col-xxl-4">
          <div class="d-grid gap-3 h-100">
            <app-user-activity
              [totalUsers]="dashboard.activityUsers"
              [activityData]="dashboard.activityBars"
            ></app-user-activity>

            <app-sales-by-country [countries]="dashboard.countrySales"></app-sales-by-country>
          </div>
        </div>
      </div>

      <div class="row g-3 mt-1">
        <div class="col-12 col-xl-8">
          <app-transactions-table [transactions]="dashboard.transactions"></app-transactions-table>
        </div>

        <div class="col-12 col-xl-4">
          <app-top-products [products]="dashboard.topProducts"></app-top-products>
        </div>
      </div>

      <div class="row g-3 mt-1">
        <div class="col-12 col-xl-7">
          <app-best-selling-table [products]="dashboard.bestSelling"></app-best-selling-table>
        </div>

        <div class="col-12 col-xl-5">
          <app-add-product
            [categories]="dashboard.categories"
            [products]="dashboard.newProducts"
          ></app-add-product>
        </div>
      </div>
    </div>
  </ng-container>
  <ng-template #loading>
    <div class="d-flex align-items-center justify-content-center" style="min-height: 200px;">
      @if (error()) {
        <div class="alert alert-danger w-100" role="alert">
          <h4 class="alert-heading">Failed to load dashboard</h4>
          <p>{{ error() }}</p>
          <hr>
          <p class="mb-0">
            <button class="btn btn-sm btn-outline-danger" (click)="retry()">
              Retry
            </button>
          </p>
        </div>
      } @else {
        <div class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">Loading dashboard...</p>
        </div>
      }
    </div>
  </ng-template>
  `,
})
export class DashboardPageComponent {
  private readonly apiService = inject(ApiService);
  protected readonly dashboard = signal<DashboardData | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly isLoading = signal(true);

  constructor() {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.dashboard.set(null);
    
    this.apiService.getDashboard()
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (data) => {
          this.dashboard.set(data);
          this.error.set(null);
        },
        error: (err) => {
          console.error('Dashboard loading error:', err);
          const errorMessage = err?.error?.message || err?.message || 'Failed to load dashboard data. Please check if the backend API is running on http://localhost:3000/api/dashboard';
          this.error.set(errorMessage);
          this.dashboard.set(null);
        }
      });
  }

  protected retry(): void {
    this.loadDashboard();
  }
}
