import { Routes } from '@angular/router';

export const CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    data: {
      eyebrow: 'Catalog',
      title: 'Discover',
      subtitle: 'Browse trending categories, manage products, and keep your catalog organized.',
    },
    loadComponent: () =>
      import('../../pages/category/category.component').then((m) => m.CategoryComponent),
  },
];
