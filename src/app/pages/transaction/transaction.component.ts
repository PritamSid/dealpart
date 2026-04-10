import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';

type TransactionTab = 'all' | 'completed' | 'pending' | 'canceled';
type TransactionStatus = 'Complete' | 'Pending' | 'Canceled';

interface SummaryCard {
  title: string;
  value: string;
  growth: string;
  subtitle: string;
  icon: string;
  accent: 'success' | 'warning' | 'danger' | 'primary';
}

interface TransactionRow {
  customerId: string;
  name?: string;
  date?: string;
  total: string;
  method?: 'CC' | 'PayPal' | 'Bank';
  status: TransactionStatus;
}

@Component({
  selector: 'app-transaction',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss',
})
export class TransactionComponent {
  protected readonly summaryCards = signal<SummaryCard[]>([]);
  protected readonly transactions = signal<TransactionRow[]>([]);
  protected readonly apiService = inject(ApiService);

  constructor() {
    this.apiService.getTransactions().subscribe((response) => {
      this.summaryCards.set([
        {
          title: 'Total Revenue',
          value: response.summary.totalRevenue,
          growth: '↑ 14.4%',
          subtitle: 'Last 7 days',
          icon: 'bi bi-currency-dollar',
          accent: 'success',
        },
        {
          title: 'Completed Transactions',
          value: `${response.summary.completedTransactions}`,
          growth: '↑ 20%',
          subtitle: 'Last 7 days',
          icon: 'bi bi-check2-circle',
          accent: 'primary',
        },
        {
          title: 'Pending Transactions',
          value: `${response.summary.pendingTransactions}`,
          growth: '85%',
          subtitle: 'Last 7 days',
          icon: 'bi bi-hourglass-split',
          accent: 'warning',
        },
        {
          title: 'Failed Transactions',
          value: `${response.summary.failedTransactions}`,
          growth: '15%',
          subtitle: 'Last 7 days',
          icon: 'bi bi-x-circle',
          accent: 'danger',
        },
      ]);
      this.transactions.set(response.transactions);
    });
  }

  protected readonly transactionTabs = [
    { label: 'All order', value: 'all' as const, count: 240 },
    { label: 'Completed', value: 'completed' as const },
    { label: 'Pending', value: 'pending' as const },
    { label: 'Canceled', value: 'canceled' as const },
  ];

  protected readonly paginationPages = [1, 2, 3, 4, 5];
  protected readonly totalPages = 24;
  protected readonly activeTab = signal<TransactionTab>('all');
  protected readonly activePage = signal(1);

  protected setActiveTab(tab: TransactionTab): void {
    this.activeTab.set(tab);
    this.activePage.set(1);
    this.loadTransactions();
  }

  protected setPage(page: number): void {
    this.activePage.set(page);
    this.loadTransactions();
  }

  protected previousPage(): void {
    this.activePage.update((value) => Math.max(1, value - 1));
    this.loadTransactions();
  }

  protected nextPage(): void {
    this.activePage.update((value) => Math.min(this.totalPages, value + 1));
    this.loadTransactions();
  }

  private loadTransactions(): void {
    const status = this.activeTab() === 'all' ? null : this.activeTab();
    this.apiService.getTransactions(status, this.activePage()).subscribe((response) => {
      this.summaryCards.set([
        {
          title: 'Total Revenue',
          value: response.summary.totalRevenue,
          growth: '↑ 14.4%',
          subtitle: 'Last 7 days',
          icon: 'bi bi-currency-dollar',
          accent: 'success',
        },
        {
          title: 'Completed Transactions',
          value: `${response.summary.completedTransactions}`,
          growth: '↑ 20%',
          subtitle: 'Last 7 days',
          icon: 'bi bi-check2-circle',
          accent: 'primary',
        },
        {
          title: 'Pending Transactions',
          value: `${response.summary.pendingTransactions}`,
          growth: '85%',
          subtitle: 'Last 7 days',
          icon: 'bi bi-hourglass-split',
          accent: 'warning',
        },
        {
          title: 'Failed Transactions',
          value: `${response.summary.failedTransactions}`,
          growth: '15%',
          subtitle: 'Last 7 days',
          icon: 'bi bi-x-circle',
          accent: 'danger',
        },
      ]);
      this.transactions.set(response.transactions);
    });
  }
}
