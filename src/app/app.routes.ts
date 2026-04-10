import { Routes } from '@angular/router';
import { authChildGuard, authGuard } from './guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth-page/auth-page.component').then((m) => m.AuthPageComponent),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authChildGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },
      {
        path: 'add-products',
        loadChildren: () =>
          import('./features/add-products/add-products.routes').then((m) => m.ADD_PRODUCTS_ROUTES),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./features/categories/categories.routes').then((m) => m.CATEGORIES_ROUTES),
      },
      {
        path: 'transaction',
        loadChildren: () =>
          import('./features/transaction/transaction.routes').then((m) => m.TRANSACTION_ROUTES),
      },
      {
        path: 'customers',
        loadChildren: () =>
          import('./features/customers/customers.routes').then((m) => m.CUSTOMERS_ROUTES),
      },
      {
        path: 'admin-role',
        loadChildren: () =>
          import('./features/admin-role/admin-role.routes').then((m) => m.ADMIN_ROLE_ROUTES),
      },
      {
        path: 'order-management',
        loadChildren: () =>
          import('./features/order-management/order-management.routes').then(
            (m) => m.ORDER_MANAGEMENT_ROUTES
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
