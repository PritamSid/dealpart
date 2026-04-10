import { Routes } from '@angular/router';

export const ADMIN_ROLE_ROUTES: Routes = [
  {
    path: '',
    data: {
      eyebrow: 'Administration',
      title: 'About section',
      subtitle: 'Manage admin profile details, social connections, and password settings from one workspace.',
    },
    loadComponent: () =>
      import('../../pages/admin-role/admin-role.component').then((m) => m.AdminRoleComponent),
  },
];
