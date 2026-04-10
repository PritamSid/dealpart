import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import {
  CustomerDraft,
  CustomerRow,
  CustomerService,
  CustomerStatus,
} from '../../services/customer.service';

Chart.register(...registerables);

type RangeOption = 'This week' | 'Last week';
type CustomerModalMode = 'details' | 'add' | 'edit' | 'delete' | null;

@Component({
  selector: 'app-customer',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="customer-page">
      @if (flashMessage()) {
        <div
          class="alert d-flex align-items-center justify-content-between gap-2 mb-3"
          [class.alert-success]="flashTone() === 'success'"
          [class.alert-danger]="flashTone() === 'danger'"
        >
          <span>{{ flashMessage() }}</span>
          <button class="btn-close" type="button" aria-label="Close alert" (click)="dismissFlash()"></button>
        </div>
      }

      @if (error()) {
        <div class="alert alert-danger mb-3" role="alert">
          <strong>Error:</strong> {{ error() }}
          <button class="btn btn-sm btn-outline-danger mt-2" (click)="retry()">Retry</button>
        </div>
      }

      @if (isLoading()) {
        <div class="d-flex align-items-center justify-content-center" style="min-height: 300px;">
          <div class="text-center">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Loading customers...</p>
          </div>
        </div>
      } @else {
        <div class="row g-3 mb-3">
          <div class="col-12 col-xxl-4">
            <div class="d-grid gap-3 h-100">
              @for (card of customerData.summaryCards; track card.title) {
                <article class="summary-card">
                  <div class="summary-icon">
                    <i [class]="card.icon"></i>
                  </div>
                  <div>
                    <p class="summary-label mb-1">{{ card.title }}</p>
                    <h3 class="summary-value mb-1">{{ card.value }}</h3>
                    <span class="summary-growth">{{ card.change }}</span>
                  </div>
                </article>
              }
            </div>
          </div>

          <div class="col-12 col-xxl-8">
            <section class="overview-card h-100">
              <div class="section-head mb-3">
                <div>
                  <p class="section-kicker mb-1">Insights</p>
                  <h3 class="section-title mb-1">Customer Overview</h3>
                  <p class="section-text mb-0">
                    Monitor retention, repeat buyers, and overall visitor conversion trends.
                  </p>
                </div>

                <div class="range-toggle">
                  @for (option of rangeOptions; track option) {
                    <button
                      class="range-btn"
                      type="button"
                    [class.active]="selectedRange() === option"
                    (click)="setRange(option)"
                  >
                    {{ option }}
                  </button>
                }
              </div>
            </div>

            <div class="metric-grid mb-3">
              @for (metric of customerData.overviewMetrics; track metric.label) {
                <div class="metric-tile">
                  <small>{{ metric.label }}</small>
                  <strong>{{ metric.value }}</strong>
                  <span>{{ metric.helper }}</span>
                </div>
              }
            </div>

            <div class="chart-wrap">
              <canvas #customerChart></canvas>
            </div>
          </section>
        </div>
      </div>

      <section class="table-card">
        <div class="table-head mb-3">
          <div>
            <p class="section-kicker mb-1">Directory</p>
            <h3 class="section-title mb-1">Customer List</h3>
            <p class="section-text mb-0">A modern overview of shopper activity and account status.</p>
          </div>

          <div class="table-actions">
            <span class="chip"><i class="bi bi-stars"></i> Live demo data</span>
            <span class="chip subtle">{{ customers().length }} profiles</span>
            <button class="btn btn-success rounded-pill px-3" type="button" (click)="openAddModal()">
              <i class="bi bi-person-plus-fill me-2"></i>
              Add Customer
            </button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table align-middle mb-0 customer-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Order Count</th>
                <th>Total Spend</th>
                <th>Status</th>
                <th class="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              @for (customer of pagedCustomers(); track customer.customerId) {
                <tr>
                  <td class="fw-semibold">{{ customer.customerId }}</td>
                  <td>
                    <span class="fw-semibold d-block">{{ customer.name }}</span>
                    <small class="text-muted">{{ customer.email }}</small>
                  </td>
                  <td>{{ customer.phone }}</td>
                  <td>{{ customer.orderCount }} orders</td>
                  <td class="fw-semibold">{{ customer.totalSpend }}</td>
                  <td>
                    <span
                      class="status-pill"
                      [class.inactive]="customer.status === 'Inactive'"
                      [class.vip]="customer.status === 'VIP'"
                    >
                      <span class="status-dot"></span>
                      {{ customer.status }}
                    </span>
                  </td>
                  <td>
                    <div class="row-actions">
                      <button
                        class="action-btn"
                        type="button"
                        [attr.aria-label]="'View ' + customer.name"
                        (click)="openDetails(customer.customerId)"
                      >
                        <i class="bi bi-chat-dots"></i>
                      </button>
                      <button
                        class="action-btn edit"
                        type="button"
                        [attr.aria-label]="'Edit ' + customer.name"
                        (click)="openEditModal(customer)"
                      >
                        <i class="bi bi-pencil-square"></i>
                      </button>
                      <button
                        class="action-btn danger"
                        type="button"
                        [attr.aria-label]="'Delete ' + customer.name"
                        (click)="promptDelete(customer)"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="text-center py-4 text-muted">No customers available.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="pagination-bar mt-3">
          <button
            class="btn btn-outline-success rounded-pill px-3"
            type="button"
            (click)="prevPage()"
            [disabled]="page() === 1"
          >
            Previous
          </button>

          <div class="page-pills">
            @for (pageNumber of visiblePages(); track pageNumber) {
              <button
                class="page-pill"
                type="button"
                [class.active]="page() === pageNumber"
                (click)="selectPage(pageNumber)"
              >
                {{ pageNumber }}
              </button>
            }

            @if (totalPages() > visiblePages()[visiblePages().length - 1]) {
              <span class="page-ellipsis">...</span>
              <button class="page-pill" type="button" (click)="selectPage(totalPages())">
                {{ totalPages() }}
              </button>
            }
          </div>

          <button
            class="btn btn-success rounded-pill px-3"
            type="button"
            (click)="nextPage()"
            [disabled]="page() === totalPages()"
          >
            Next
          </button>
        </div>
      </section>

      @if (modalMode()) {
        <div class="modal-backdrop fade show"></div>
      }

      @if (modalMode() === 'details' && selectedCustomer(); as customer) {
        <div class="modal fade show d-block" tabindex="-1" aria-modal="true" role="dialog">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content customer-modal">
              <div class="modal-header border-0 pb-0">
                <div>
                  <p class="section-kicker mb-1">Profile</p>
                  <h4 class="modal-title mb-0">Customer Details</h4>
                </div>
                <button class="btn-close" type="button" aria-label="Close modal" (click)="closeModal()"></button>
              </div>

              <div class="modal-body pt-3">
                <div class="customer-profile-card mb-3">
                  <div class="customer-avatar">{{ customerInitials(customer.name) }}</div>
                  <div>
                    <h5 class="mb-1">{{ customer.name }}</h5>
                    <p class="text-muted mb-1">{{ customer.email }}</p>
                    <span
                      class="status-pill"
                      [class.inactive]="customer.status === 'Inactive'"
                      [class.vip]="customer.status === 'VIP'"
                    >
                      <span class="status-dot"></span>
                      {{ customer.status }}
                    </span>
                  </div>
                </div>

                <div class="details-grid">
                  <div class="detail-tile">
                    <small>Phone</small>
                    <strong>{{ customer.phone }}</strong>
                  </div>
                  <div class="detail-tile">
                    <small>Total Orders</small>
                    <strong>{{ customer.orderCount }}</strong>
                  </div>
                  <div class="detail-tile">
                    <small>Total Spend</small>
                    <strong>{{ customer.totalSpend }}</strong>
                  </div>
                  <div class="detail-tile">
                    <small>Customer ID</small>
                    <strong>{{ customer.customerId }}</strong>
                  </div>
                </div>
              </div>

              <div class="modal-footer border-0 pt-0">
                <button class="btn btn-outline-success rounded-pill px-3" type="button" (click)="closeModal()">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      @if (modalMode() === 'add' || modalMode() === 'edit') {
        <div class="modal fade show d-block" tabindex="-1" aria-modal="true" role="dialog">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content customer-modal">
              <div class="modal-header border-0 pb-0">
                <div>
                  <p class="section-kicker mb-1">Manage</p>
                  <h4 class="modal-title mb-0">
                    {{ modalMode() === 'edit' ? 'Edit Customer' : 'Add Customer' }}
                  </h4>
                </div>
                <button class="btn-close" type="button" aria-label="Close modal" (click)="closeModal()"></button>
              </div>

              <form [formGroup]="customerForm" (ngSubmit)="saveCustomer()" novalidate>
                <div class="modal-body pt-3">
                  <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input class="form-control" type="text" formControlName="name" />
                    @if (customerForm.controls.name.invalid && customerForm.controls.name.touched) {
                      <small class="text-danger">Please enter a valid customer name.</small>
                    }
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input class="form-control" type="email" formControlName="email" />
                    @if (customerForm.controls.email.invalid && customerForm.controls.email.touched) {
                      <small class="text-danger">Please enter a valid email address.</small>
                    }
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Phone</label>
                    <input class="form-control" type="text" formControlName="phone" />
                    @if (customerForm.controls.phone.invalid && customerForm.controls.phone.touched) {
                      <small class="text-danger">Phone number is required.</small>
                    }
                  </div>

                  <div>
                    <label class="form-label">Status</label>
                    <select class="form-select" formControlName="status">
                      @for (status of statusOptions; track status) {
                        <option [value]="status">{{ status }}</option>
                      }
                    </select>
                  </div>
                </div>

                <div class="modal-footer border-0 pt-0">
                  <button class="btn btn-outline-secondary rounded-pill px-3" type="button" (click)="closeModal()">
                    Cancel
                  </button>
                  <button class="btn btn-success rounded-pill px-3" type="submit" [disabled]="customerForm.invalid">
                    {{ modalMode() === 'edit' ? 'Save Changes' : 'Add Customer' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      }

      @if (modalMode() === 'delete' && selectedCustomer(); as customer) {
        <div class="modal fade show d-block" tabindex="-1" aria-modal="true" role="dialog">
          <div class="modal-dialog modal-dialog-centered modal-sm">
            <div class="modal-content customer-modal">
              <div class="modal-body text-center p-4">
                <div class="delete-icon mb-3">
                  <i class="bi bi-exclamation-triangle"></i>
                </div>
                <h5 class="mb-2">Delete Customer</h5>
                <p class="text-muted mb-3">
                  Are you sure you want to delete this customer?<br />
                  <strong>{{ customer.name }}</strong>
                </p>
                <div class="d-flex justify-content-center gap-2 flex-wrap">
                  <button class="btn btn-outline-secondary rounded-pill px-3" type="button" (click)="closeModal()">
                    Cancel
                  </button>
                  <button class="btn btn-danger rounded-pill px-3" type="button" (click)="confirmDelete()">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      }
    </section>
  `,
  styles: [
    `
      .customer-page {
        display: block;
      }

      .summary-card,
      .overview-card,
      .table-card,
      .customer-modal {
        background: #ffffff;
        border: 1px solid #e5efe8;
        border-radius: 24px;
        box-shadow: 0 20px 45px rgba(15, 23, 42, 0.06);
      }

      .summary-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 1.1rem;
      }

      .summary-icon,
      .delete-icon {
        width: 3rem;
        height: 3rem;
        border-radius: 16px;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, #ecf8f1, #dff4e8);
        color: #279360;
        font-size: 1.15rem;
      }

      .delete-icon {
        margin-inline: auto;
        background: #fff5e9;
        color: #d98b1f;
      }

      .summary-label,
      .section-kicker {
        color: #6f8479;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-weight: 700;
      }

      .summary-value,
      .section-title {
        color: #183b2b;
        font-weight: 800;
      }

      .summary-growth {
        color: #1f8f5d;
        font-weight: 700;
      }

      .overview-card,
      .table-card {
        padding: 1.1rem;
      }

      .section-head,
      .table-head,
      .pagination-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .section-text {
        color: #6f8479;
      }

      .range-toggle {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.25rem;
        border-radius: 999px;
        background: #f3f8f5;
        border: 1px solid #e4eee7;
      }

      .range-btn {
        border: 0;
        background: transparent;
        padding: 0.55rem 0.9rem;
        border-radius: 999px;
        color: #496152;
        font-weight: 700;
      }

      .range-btn.active {
        background: #1f8f5d;
        color: #ffffff;
      }

      .metric-grid,
      .details-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0.75rem;
      }

      .metric-tile,
      .detail-tile {
        background: #f8fcf9;
        border: 1px solid #e7f0ea;
        border-radius: 16px;
        padding: 0.85rem;
        display: grid;
        gap: 0.2rem;
      }

      .metric-tile small,
      .metric-tile span,
      .detail-tile small {
        color: #73877d;
      }

      .metric-tile strong,
      .detail-tile strong {
        color: #183b2b;
        font-size: 1.15rem;
      }

      .chart-wrap {
        height: 300px;
      }

      .table-actions {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        flex-wrap: wrap;
      }

      .chip {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.4rem 0.7rem;
        border-radius: 999px;
        background: #ecf8f1;
        color: #1f8f5d;
        font-size: 0.82rem;
        font-weight: 700;
      }

      .chip.subtle {
        background: #f4f8f5;
        color: #61746a;
      }

      .customer-table th {
        color: #6e8378;
        font-size: 0.79rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border-bottom-color: #edf3ef;
      }

      .customer-table td {
        color: #254435;
        border-bottom-color: #f1f5f3;
      }

      .customer-table tbody tr {
        transition:
          background 0.2s ease,
          transform 0.2s ease;
      }

      .customer-table tbody tr:hover {
        background: #f8fcf9;
        transform: translateY(-1px);
      }

      .status-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.32rem 0.7rem;
        border-radius: 999px;
        background: #e9f8ef;
        color: #188553;
        font-weight: 700;
        font-size: 0.8rem;
      }

      .status-pill.inactive {
        background: #fff0f0;
        color: #dc4c64;
      }

      .status-pill.vip {
        background: #fff7e8;
        color: #d38a12;
      }

      .status-dot {
        width: 0.45rem;
        height: 0.45rem;
        border-radius: 50%;
        background: currentColor;
      }

      .row-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.45rem;
      }

      .action-btn {
        width: 2.1rem;
        height: 2.1rem;
        border-radius: 10px;
        border: 1px solid #dbe9df;
        background: #f8fcf9;
        color: #4a6455;
        transition:
          transform 0.2s ease,
          background 0.2s ease;
      }

      .action-btn:hover {
        transform: translateY(-1px);
        background: #eef7f1;
      }

      .action-btn.edit {
        color: #2f7de1;
        background: #eef5ff;
        border-color: #d8e6ff;
      }

      .action-btn.danger {
        color: #c34055;
        background: #fff5f6;
        border-color: #f2d6dc;
      }

      .page-pills {
        display: flex;
        align-items: center;
        gap: 0.45rem;
        flex-wrap: wrap;
        justify-content: center;
      }

      .page-pill {
        width: 2.2rem;
        height: 2.2rem;
        border-radius: 999px;
        border: 1px solid #dbe9df;
        background: #ffffff;
        color: #476152;
        font-weight: 700;
      }

      .page-pill.active {
        background: #1f8f5d;
        border-color: #1f8f5d;
        color: #ffffff;
      }

      .page-ellipsis {
        color: #7d9087;
        font-weight: 700;
        padding: 0 0.15rem;
      }

      .customer-profile-card {
        display: flex;
        align-items: center;
        gap: 0.9rem;
        padding: 1rem;
        border-radius: 18px;
        background: #f8fcf9;
        border: 1px solid #e7f0ea;
      }

      .customer-avatar {
        width: 3.25rem;
        height: 3.25rem;
        border-radius: 16px;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, #2f9e69, #6fd19a);
        color: #ffffff;
        font-weight: 800;
      }

      .form-label {
        color: #264433;
        font-weight: 600;
      }

      .form-control,
      .form-select {
        border-color: #dbe9df;
      }

      .form-control:focus,
      .form-select:focus {
        border-color: #58b982;
        box-shadow: 0 0 0 0.2rem rgba(47, 158, 105, 0.15);
      }

      .modal {
        background: rgba(15, 23, 42, 0.3);
      }

      @media (max-width: 1199.98px) {
        .metric-grid,
        .details-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 767.98px) {
        .overview-card,
        .table-card {
          padding: 0.9rem;
        }

        .metric-grid,
        .details-grid {
          grid-template-columns: 1fr;
        }

        .chart-wrap {
          height: 240px;
        }

        .pagination-bar,
        .customer-profile-card {
          flex-direction: column;
          align-items: stretch;
        }
      }
    `,
  ],
})
export class CustomerComponent implements AfterViewInit, OnDestroy {
  private readonly customerService = inject(CustomerService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('customerChart') private chartRef?: ElementRef<HTMLCanvasElement>;

  protected readonly customerData = this.customerService.getCustomerPageData();
  protected readonly rangeOptions: RangeOption[] = ['This week', 'Last week'];
  protected readonly statusOptions: CustomerStatus[] = ['Active', 'Inactive', 'VIP'];
  protected readonly selectedRange = signal<RangeOption>('This week');
  protected readonly customers = signal<CustomerRow[]>([]);
  protected readonly page = signal(1);
  protected readonly modalMode = signal<CustomerModalMode>(null);
  protected readonly selectedCustomer = signal<CustomerRow | null>(null);
  protected readonly flashMessage = signal('');
  protected readonly flashTone = signal<'success' | 'danger'>('success');
  protected readonly error = signal<string | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly activeSeries = computed(() =>
    this.selectedRange() === 'This week'
      ? this.customerData.thisWeekSeries
      : this.customerData.lastWeekSeries
  );
  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.customers().length / 6)));
  protected readonly visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.page();
    const start = Math.max(1, Math.min(current - 2, Math.max(1, total - 4)));
    const end = Math.min(total, start + 4);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  });
  protected readonly pagedCustomers = computed(() => {
    const start = (this.page() - 1) * 6;
    return this.customers().slice(start, start + 6);
  });
  protected readonly customerForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    status: ['Active' as CustomerStatus, [Validators.required]],
  });

  private chart?: Chart;

  constructor() {
    this.customerService
      .getCustomers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (customers) => {
          this.customers.set(customers);
          this.error.set(null);
          this.isLoading.set(false);

          if (this.page() > this.totalPages()) {
            this.page.set(this.totalPages());
          }
        },
        error: (err: unknown) => {
          console.error('Failed to load customers from API', err);
          const errorMessage = (err as any)?.error?.message || (err as any)?.message || 'Failed to load customers. Please check if the backend API is running on http://localhost:3000/api/customers';
          this.error.set(errorMessage);
          this.customers.set([]);
          this.isLoading.set(false);
        },
      });

    effect(() => {
      const data = [...this.activeSeries()];

      if (!this.chart) {
        return;
      }

      this.chart.data.datasets[0].data = data;
      this.chart.update();
    });
  }

  ngAfterViewInit(): void {
    const canvas = this.chartRef?.nativeElement;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) {
      return;
    }

    const gradient = context.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(47, 158, 105, 0.35)');
    gradient.addColorStop(1, 'rgba(47, 158, 105, 0.03)');

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            data: this.activeSeries(),
            borderColor: '#2f9e69',
            backgroundColor: gradient,
            fill: true,
            tension: 0.35,
            borderWidth: 3,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: '#6f8479' },
          },
          y: {
            beginAtZero: true,
            grid: { color: '#eef4ef' },
            border: { display: false },
            ticks: { color: '#6f8479' },
          },
        },
      },
    };

    this.chart = new Chart(canvas, config);
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  protected setRange(range: RangeOption): void {
    this.selectedRange.set(range);
  }

  protected retry(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.customers.set([]);
    
    this.customerService
      .getCustomers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (customers) => {
          this.customers.set(customers);
          this.error.set(null);
          this.isLoading.set(false);

          if (this.page() > this.totalPages()) {
            this.page.set(this.totalPages());
          }
        },
        error: (err: unknown) => {
          console.error('Failed to load customers from API', err);
          const errorMessage = (err as any)?.error?.message || (err as any)?.message || 'Failed to load customers. Please check if the backend API is running on http://localhost:3000/api/customers';
          this.error.set(errorMessage);
          this.customers.set([]);
          this.isLoading.set(false);
        },
      });
  }

  protected selectPage(pageNumber: number): void {
    this.page.set(pageNumber);
  }

  protected prevPage(): void {
    this.page.update((value) => Math.max(1, value - 1));
  }

  protected nextPage(): void {
    this.page.update((value) => Math.min(this.totalPages(), value + 1));
  }

  protected openDetails(customerId: string): void {
    this.customerService
      .getCustomerById(customerId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((customer) => {
        if (!customer) {
          this.showFlash('Customer not found.', 'danger');
          return;
        }

        this.selectedCustomer.set(customer);
        this.modalMode.set('details');
      });
  }

  protected openAddModal(): void {
    this.selectedCustomer.set(null);
    this.customerForm.reset({
      name: '',
      email: '',
      phone: '',
      status: 'Active',
    });
    this.modalMode.set('add');
  }

  protected openEditModal(customer: CustomerRow): void {
    this.selectedCustomer.set(customer);
    this.customerForm.reset({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: customer.status,
    });
    this.modalMode.set('edit');
  }

  protected promptDelete(customer: CustomerRow): void {
    this.selectedCustomer.set(customer);
    this.modalMode.set('delete');
  }

  protected saveCustomer(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    const formValue = this.customerForm.getRawValue() as CustomerDraft;

    if (this.modalMode() === 'edit' && this.selectedCustomer()) {
      const payload: CustomerRow = {
        ...this.selectedCustomer()!,
        ...formValue,
      };

      this.customerService
        .updateCustomer(payload)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((updatedCustomer) => {
          this.customers.update((current) =>
            current.map((item) =>
              item.customerId === updatedCustomer.customerId ? updatedCustomer : item
            )
          );
          this.closeModal();
          this.showFlash('Customer updated');
        });

      return;
    }

    this.customerService
      .addCustomer(formValue)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((newCustomer) => {
        this.customers.update((current) => [newCustomer, ...current]);
        this.page.set(1);
        this.closeModal();
        this.showFlash('Customer added successfully');
      });
  }

  protected confirmDelete(): void {
    const customer = this.selectedCustomer();

    if (!customer) {
      return;
    }

    this.customerService
      .deleteCustomer(customer.customerId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.customers.update((current) => current.filter((item) => item.customerId !== customer.customerId));
        this.closeModal();
        this.showFlash('Customer deleted');
      });
  }

  protected closeModal(): void {
    this.modalMode.set(null);
    this.selectedCustomer.set(null);
    this.customerForm.reset({
      name: '',
      email: '',
      phone: '',
      status: 'Active',
    });
  }

  protected dismissFlash(): void {
    this.flashMessage.set('');
  }

  protected customerInitials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('')
      .slice(0, 2);
  }

  private showFlash(message: string, tone: 'success' | 'danger' = 'success'): void {
    this.flashTone.set(tone);
    this.flashMessage.set(message);
  }
}
