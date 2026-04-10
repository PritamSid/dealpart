import { Routes } from '@angular/router';

export const CUSTOMERS_ROUTES: Routes = [
  {
    path: '',
    data: {
      eyebrow: 'CRM',
      title: 'Customer Management',
      subtitle: 'Review customer growth, loyalty, and support activity with live demo data.',
    },
    loadComponent: () =>
      import('../../pages/customer/customer.component').then((m) => m.CustomerComponent),
  },
];
