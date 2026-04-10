import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface StatCard {
  title: string;
  value: string;
  change: string;
  meta: string;
  icon: string;
  tone: 'success' | 'primary' | 'warning' | 'danger';
}

export interface WeeklyMetric {
  label: string;
  value: string;
}

export interface CountrySale {
  country: string;
  sales: string;
  change: string;
  positive: boolean;
  progress: number;
}

export interface TransactionItem {
  no: number;
  customerId: string;
  orderDate: string;
  status: 'Paid' | 'Pending' | 'Complete' | 'Canceled';
  amount: string;
}

export interface TopProductItem {
  name: string;
  subtitle: string;
  price: string;
  icon: string;
  tone: string;
}

export interface BestSellingItem {
  name: string;
  totalOrders: string;
  status: 'Stock' | 'Stock out' | 'In Stock' | 'Out of Stock';
  price: string;
}

export interface CategoryItem {
  name: string;
  total: string;
}

export interface OrderItem {
  no: number;
  orderNo: string;
  customer: string;
  date: string;
  status: 'Paid' | 'Pending' | 'Shipped' | 'Canceled';
  payment: 'Card' | 'PayPal' | 'Bank';
  amount: string;
}

export interface CustomerRow {
  customerId: string;
  name: string;
  email: string;
  phone: string;
  orderCount: number;
  totalSpend: string;
  status: 'Active' | 'Inactive' | 'VIP';
}

export interface CustomerDraft {
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'VIP';
}

export interface NewProductItem {
  name: string;
  category: string;
  price: string;
  stock: string;
  icon: string;
  tone: string;
}

export interface DashboardData {
  statsCards: StatCard[];
  weeklyMetrics: WeeklyMetric[];
  weeklySeries: number[];
  activityUsers: string;
  activityBars: number[];
  countrySales: CountrySale[];
  transactions: TransactionItem[];
  topProducts: TopProductItem[];
  bestSelling: BestSellingItem[];
  categories: CategoryItem[];
  newProducts: NewProductItem[];
}

export interface TransactionRow {
  customerId: string;
  name?: string;
  date?: string;
  total: string;
  method?: 'CC' | 'PayPal' | 'Bank';
  status: 'Complete' | 'Pending' | 'Canceled';
}

export interface TransactionResponse {
  summary: {
    totalRevenue: string;
    completedTransactions: number;
    pendingTransactions: number;
    failedTransactions: number;
  };
  transactions: TransactionRow[];
  page: number;
  totalPages: number;
}

export interface ProductRow {
  no: number;
  name: string;
  createdDate: string;
  orderCount: number;
  icon: string;
  status: string;
  category: string;
  tab?: 'all' | 'featured' | 'sale' | 'out-of-stock';
}

export interface CategoryCard {
  name: string;
  icon: string;
  accent: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = '/api';

  constructor(private readonly http: HttpClient) {}

  getDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.baseUrl}/dashboard`);
  }

  getProducts(tab = 'all'): Observable<ProductRow[]> {
    const params = new HttpParams().set('tab', tab);
    return this.http.get<ProductRow[]>(`${this.baseUrl}/products`, { params });
  }

  getCategories(): Observable<CategoryCard[]> {
    return this.http.get<CategoryCard[]>(`${this.baseUrl}/categories`);
  }

  getTransactions(status: string | null = null, page = 1): Observable<TransactionResponse> {
    let params = new HttpParams().set('page', page.toString());
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<TransactionResponse>(`${this.baseUrl}/transactions`, { params });
  }

  getOrders(): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(`${this.baseUrl}/orders`);
  }

  getCustomers(): Observable<CustomerRow[]> {
    return this.http.get<CustomerRow[]>(`${this.baseUrl}/customers`);
  }

  getCustomerById(id: string): Observable<CustomerRow> {
    return this.http.get<CustomerRow>(`${this.baseUrl}/customers/${id}`);
  }

  addCustomer(customer: CustomerDraft): Observable<CustomerRow> {
    return this.http.post<CustomerRow>(`${this.baseUrl}/customers`, customer);
  }

  updateCustomer(customerId: string, customer: CustomerDraft): Observable<CustomerRow> {
    return this.http.put<CustomerRow>(`${this.baseUrl}/customers/${customerId}`, customer);
  }

  deleteCustomer(customerId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/customers/${customerId}`);
  }

  addProduct(payload: Partial<ProductRow>): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${this.baseUrl}/products`, payload);
  }
}
