import { Routes } from '@angular/router';

export const TRANSACTION_ROUTES: Routes = [
  {
    path: '',
    data: {
      eyebrow: 'Payments',
      title: 'Transaction',
      subtitle: 'Track revenue, payment methods, and order status across your ecommerce dashboard.',
    },
    loadComponent: () =>
      import('../../pages/transaction/transaction.component').then((m) => m.TransactionComponent),
  },
];
