import { Routes } from '@angular/router';

export const ADD_PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    data: {
      eyebrow: 'Catalog',
      title: 'Add New Product',
      subtitle:
        'Create polished product listings, pricing rules, inventory details, and media from one workspace.',
    },
    loadComponent: () =>
      import('../../pages/add-products/add-products.component').then((m) => m.AddProductsComponent),
  },
];
