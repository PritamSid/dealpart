import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, OnInit, signal } from '@angular/core';
import { ApiService, OrderItem } from '../../services/api.service';
import { finalize } from 'rxjs';

type OrderStatus = 'Paid' | 'Pending' | 'Shipped' | 'Canceled';
type StatusFilter = 'All' | OrderStatus;

@Component({
  selector: 'app-order-management',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss'],
})
export class OrderManagementComponent implements OnInit {
  protected readonly statusOptions: StatusFilter[] = ['All', 'Paid', 'Pending', 'Shipped', 'Canceled'];

  protected readonly page = signal(1);
  protected readonly selectedStatus = signal<StatusFilter>('All');
  protected readonly searchTerm = signal('');
  protected readonly error = signal<string | null>(null);
  protected readonly isLoading = signal(true);

  private readonly pageSize = 5;

  protected readonly orders = signal<OrderItem[]>([]);

  constructor(private readonly apiService: ApiService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.orders.set([]);

    this.apiService.getOrders()
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (data: OrderItem[]) => {
          this.orders.set(data);
          this.error.set(null);
          this.page.set(1);
        },
        error: (err: unknown) => {
          console.error('Failed to load orders from API', err);
          const errorMessage = (err as any)?.error?.message || (err as any)?.message || 'Failed to load orders. Please check if the backend API is running on http://localhost:3000/api/orders';
          this.error.set(errorMessage);
          this.orders.set([]);
        },
      });
  }

  protected retry(): void {
    this.loadOrders();
  }

  protected readonly filteredOrders = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();

    return this.orders().filter((order) => {
      const matchesStatus = status === 'All' || order.status === status;
      const matchesQuery =
        !query ||
        order.orderNo.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query);

      return matchesStatus && matchesQuery;
    });
  });

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredOrders().length / this.pageSize))
  );

  protected readonly pagedOrders = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filteredOrders().slice(start, start + this.pageSize);
  });

  protected readonly startItem = computed(() =>
    this.filteredOrders().length === 0 ? 0 : (this.page() - 1) * this.pageSize + 1
  );

  protected readonly endItem = computed(() =>
    Math.min(this.page() * this.pageSize, this.filteredOrders().length)
  );

  protected readonly summaryCards = computed(() => {
    const orders = this.filteredOrders();
    const paid = orders.filter((item) => item.status === 'Paid').length;
    const pending = orders.filter((item) => item.status === 'Pending').length;
    const shipped = orders.filter((item) => item.status === 'Shipped').length;
    const canceled = orders.filter((item) => item.status === 'Canceled').length;

    return [
      { title: 'Total Orders', value: `${orders.length}`, change: '+12.4%', negative: false },
      { title: 'Paid Orders', value: `${paid}`, change: '+8.1%', negative: false },
      { title: 'Pending', value: `${pending}`, change: '+4.0%', negative: false },
      { title: 'Canceled', value: `${canceled}`, change: `-${Math.max(1, canceled)}.0%`, negative: true },
      { title: 'Shipped', value: `${shipped}`, change: '+6.8%', negative: false },
    ].slice(0, 4);
  });

  protected updateSearch(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value ?? '';
    this.searchTerm.set(value);
    this.page.set(1);
  }

  protected updateStatus(event: Event): void {
    const value = ((event.target as HTMLSelectElement | null)?.value ?? 'All') as StatusFilter;
    this.selectedStatus.set(value);
    this.page.set(1);
  }

  protected nextPage(): void {
    this.page.update((value) => Math.min(value + 1, this.totalPages()));
  }

  protected prevPage(): void {
    this.page.update((value) => Math.max(value - 1, 1));
  }
}
