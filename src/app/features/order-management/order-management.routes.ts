import { Routes } from '@angular/router';

export const ORDER_MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    data: {
      eyebrow: 'Operations',
      title: 'Order Management',
      subtitle: 'Track, review, and manage incoming orders with live demo data.',
    },
    loadComponent: () =>
      import('../../pages/order-management/order-management.component').then(
        (m) => m.OrderManagementComponent
      ),
  },
];
