import { Injectable } from '@angular/core';

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

export interface ProductCategory {
  name: string;
  total: string;
}

export interface NewProductItem {
  name: string;
  category: string;
  price: string;
  stock: string;
  icon: string;
  tone: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardDataService {
  getDashboardData() {
    return {
      statsCards: [
        {
          title: 'Total Sales',
          value: '$350K',
          change: '+10.4%',
          meta: 'from last month',
          icon: 'bi bi-currency-dollar',
          tone: 'success' as const,
        },
        {
          title: 'Total Orders',
          value: '10.7K',
          change: '+14.4%',
          meta: 'new orders this week',
          icon: 'bi bi-bag-check',
          tone: 'primary' as const,
        },
        {
          title: 'Pending',
          value: '509 users',
          change: '+2.1%',
          meta: 'awaiting fulfillment',
          icon: 'bi bi-hourglass-split',
          tone: 'warning' as const,
        },
        {
          title: 'Canceled',
          value: '94',
          change: '-14.4%',
          meta: 'better than last week',
          icon: 'bi bi-x-circle',
          tone: 'danger' as const,
        },
      ],
      weeklyMetrics: [
        { label: 'Customers', value: '52k' },
        { label: 'Total Products', value: '3.5k' },
        { label: 'Stock Products', value: '2.5k' },
        { label: 'Out of Stock', value: '0.5k' },
        { label: 'Revenue', value: '250k' },
      ],
      weeklySeries: [22, 28, 24, 35, 31, 42, 38],
      activityUsers: '21.5K',
      activityBars: [6, 10, 8, 14, 12, 18, 15, 21, 16, 19],
      countrySales: [
        { country: 'USA', sales: '$98.5K', change: '+12.8%', positive: true, progress: 84 },
        { country: 'Brazil', sales: '$74.2K', change: '+8.3%', positive: true, progress: 67 },
        {
          country: 'Australia',
          sales: '$61.9K',
          change: '-3.2%',
          positive: false,
          progress: 53,
        },
      ],
      transactions: [
        {
          no: 1,
          customerId: 'CUST-10234',
          orderDate: '31 Mar 2026',
          status: 'Paid' as const,
          amount: '$1,240.00',
        },
        {
          no: 2,
          customerId: 'CUST-10235',
          orderDate: '30 Mar 2026',
          status: 'Pending' as const,
          amount: '$840.00',
        },
        {
          no: 3,
          customerId: 'CUST-10236',
          orderDate: '30 Mar 2026',
          status: 'Paid' as const,
          amount: '$2,150.00',
        },
        {
          no: 4,
          customerId: 'CUST-10237',
          orderDate: '29 Mar 2026',
          status: 'Pending' as const,
          amount: '$410.00',
        },
        {
          no: 5,
          customerId: 'CUST-10238',
          orderDate: '29 Mar 2026',
          status: 'Paid' as const,
          amount: '$1,090.00',
        },
      ],
      topProducts: [
        {
          name: 'Smart Watch X2',
          subtitle: 'Wearables',
          price: '$299',
          icon: 'bi bi-smartwatch',
          tone: 'mint',
        },
        {
          name: 'Minimal Desk Lamp',
          subtitle: 'Home',
          price: '$89',
          icon: 'bi bi-lightbulb',
          tone: 'peach',
        },
        {
          name: 'Street Hoodie',
          subtitle: 'Fashion',
          price: '$119',
          icon: 'bi bi-stars',
          tone: 'sky',
        },
      ],
      bestSelling: [
        {
          name: 'Wireless Earbuds Pro',
          totalOrders: '1,245',
          status: 'Stock' as const,
          price: '$129',
        },
        { name: 'Canvas Backpack', totalOrders: '918', status: 'Stock' as const, price: '$74' },
        {
          name: 'Bluetooth Speaker Mini',
          totalOrders: '684',
          status: 'Stock out' as const,
          price: '$96',
        },
      ],
      categories: [
        { name: 'Electronic', total: '186 items' },
        { name: 'Fashion', total: '124 items' },
        { name: 'Home', total: '96 items' },
      ],
      newProducts: [
        {
          name: 'Noise Cancel Headset',
          category: 'Electronic',
          price: '$220',
          stock: '14 in stock',
          icon: 'bi bi-headphones',
          tone: 'mint',
        },
        {
          name: 'Layered Linen Shirt',
          category: 'Fashion',
          price: '$68',
          stock: '22 in stock',
          icon: 'bi bi-person-badge',
          tone: 'sky',
        },
        {
          name: 'Nordic Coffee Set',
          category: 'Home',
          price: '$94',
          stock: '8 in stock',
          icon: 'bi bi-cup-hot',
          tone: 'peach',
        },
      ],
    };
  }
}
