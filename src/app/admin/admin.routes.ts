import { Routes } from '@angular/router';
import { authGuard } from './../guards/auth.guard';

export const adminRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/admin-login.component').then(m => m.AdminLoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./products/admin-products.component').then(m => m.AdminProductsComponent)
      },
     {
        path: 'products/new',
        loadComponent: () => import('./products/admin-product-form.component').then(m => m.AdminProductFormComponent)
      },
      {
        path: 'products/edit/:id',
        loadComponent: () => import('./products/admin-product-form.component').then(m => m.AdminProductFormComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./orders/admin-orders.component').then(m => m.AdminOrdersComponent)
      },
      {
        path: 'orders/:id',
        loadComponent: () => import('./orders/admin-orders.component').then(m => m.AdminOrdersComponent)
      },
    //   {
    //     path: 'customers',
    //     loadComponent: () => import('./customers/admin-customers.component').then(m => m.AdminCustomersComponent)
    //   },
      {
        path: 'messages',
        loadComponent: () => import('./messages/admin-messages.component').then(m => m.AdminMessagesComponent)
      },
    //   {
    //     path: 'settings',
    //     loadComponent: () => import('./settings/admin-settings.component').then(m => m.AdminSettingsComponent)
    //   },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];