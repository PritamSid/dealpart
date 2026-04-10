import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    data: {
      eyebrow: 'Welcome back',
      title: 'Dashboard Overview',
      subtitle: 'Monitor sales, products, and customer performance in one place.',
    },
    loadComponent: () =>
      import('../../pages/dashboard-page/dashboard-page.component').then(
        (m) => m.DashboardPageComponent
      ),
  },
];
