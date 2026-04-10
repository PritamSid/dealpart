import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, map, of } from 'rxjs';
import { ApiService } from './api.service';

export type CustomerStatus = 'Active' | 'Inactive' | 'VIP';

export interface CustomerSummaryCard {
  title: string;
  value: string;
  change: string;
  icon: string;
}

export interface CustomerOverviewMetric {
  label: string;
  value: string;
  helper: string;
}

export interface CustomerRow {
  customerId: string;
  name: string;
  email: string;
  phone: string;
  orderCount: number;
  totalSpend: string;
  status: CustomerStatus;
}

export interface CustomerDraft {
  name: string;
  email: string;
  phone: string;
  status: CustomerStatus;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  constructor(private readonly apiService: ApiService) {}

  getCustomerPageData(): {
    summaryCards: CustomerSummaryCard[];
    overviewMetrics: CustomerOverviewMetric[];
    thisWeekSeries: number[];
    lastWeekSeries: number[];
  } {
    return {
      summaryCards: [
        {
          title: 'Total Customers',
          value: '11,040',
          change: '+14.4%',
          icon: 'bi bi-people-fill',
        },
        {
          title: 'New Customers',
          value: '2,370',
          change: '+20%',
          icon: 'bi bi-person-plus-fill',
        },
        {
          title: 'Visitors',
          value: '250K',
          change: '+20%',
          icon: 'bi bi-bar-chart-line-fill',
        },
      ],
      overviewMetrics: [
        { label: 'Active Customers', value: '25k', helper: 'engaged shoppers' },
        { label: 'Repeat Customers', value: '5.6k', helper: 'loyal buyers' },
        { label: 'Shop Visitors', value: '250k', helper: 'monthly traffic' },
        { label: 'Conversion Rate', value: '5.5%', helper: 'storewide average' },
      ],
      thisWeekSeries: [12, 18, 16, 24, 22, 30, 28],
      lastWeekSeries: [10, 14, 13, 18, 19, 23, 21],
    };
  }

  getCustomers(): Observable<CustomerRow[]> {
    return this.apiService.getCustomers();
  }

  getCustomerById(id: string): Observable<CustomerRow | undefined> {
    return this.apiService.getCustomerById(id).pipe(
      map((customer) => (customer ? { ...customer } : undefined))
    );
  }

  addCustomer(customer: CustomerDraft): Observable<CustomerRow> {
    return this.apiService.addCustomer(customer).pipe(delay(150));
  }

  updateCustomer(customer: CustomerRow): Observable<CustomerRow> {
    const normalizedCustomer: CustomerRow = {
      ...customer,
      name: customer.name.trim(),
      email: customer.email.trim().toLowerCase(),
      phone: customer.phone.trim(),
    };

    return this.apiService.updateCustomer(normalizedCustomer.customerId, normalizedCustomer).pipe(delay(150));
  }

  deleteCustomer(id: string): Observable<boolean> {
    return this.apiService.deleteCustomer(id).pipe(
      map(() => true),
      delay(120)
    );
  }
}
