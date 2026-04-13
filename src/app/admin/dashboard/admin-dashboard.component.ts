import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService, DashboardStats } from '../../services/order.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-6">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p class="text-gray-600">Welcome back! Here's what's happening with your store.</p>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="text-center py-12">
        <div class="inline-flex items-center gap-2 text-gray-500">
          <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading dashboard...
        </div>
      </div>

      <div *ngIf="!loading">
        <!-- Attention Needed Banner -->
        <div *ngIf="stats.pendingOrders > 0 || stats.unreadMessages > 0"
             class="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a *ngIf="stats.pendingOrders > 0" routerLink="/admin/orders"
             class="flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-xl p-4 hover:bg-amber-100 transition-colors group">
            <div class="flex-shrink-0 w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-bold text-amber-900">{{ stats.pendingOrders }} order{{ stats.pendingOrders > 1 ? 's' : '' }} need attention</p>
              <p class="text-xs text-amber-700">Pending or awaiting payment &mdash; click to view</p>
            </div>
            <svg class="ml-auto h-5 w-5 text-amber-400 group-hover:text-amber-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </a>
          <a *ngIf="stats.unreadMessages > 0" routerLink="/admin/messages"
             class="flex items-center gap-4 bg-blue-50 border border-blue-200 rounded-xl p-4 hover:bg-blue-100 transition-colors group">
            <div class="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-bold text-blue-900">{{ stats.unreadMessages }} unread message{{ stats.unreadMessages > 1 ? 's' : '' }}</p>
              <p class="text-xs text-blue-700">Customer inquiries waiting for reply &mdash; click to view</p>
            </div>
            <svg class="ml-auto h-5 w-5 text-blue-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Total Orders</p>
                <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.totalOrders }}</p>
              </div>
              <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Total Revenue</p>
                <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.totalRevenue | currency:'LKR':'symbol':'1.0-0' }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Products</p>
                <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.totalProducts }}</p>
              </div>
              <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500">Customers</p>
                <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.totalCustomers }}</p>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Recent Orders -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 class="text-base font-semibold text-gray-900">Recent Orders</h2>
              <a routerLink="/admin/orders" class="text-sm text-indigo-600 hover:text-indigo-500 font-medium">View all</a>
            </div>
            <div class="divide-y divide-gray-50">
              <a *ngFor="let order of stats.recentOrders" routerLink="/admin/orders"
                 class="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
                <div>
                  <p class="text-sm font-semibold text-gray-900">#{{ order.orderNumber }}</p>
                  <p class="text-xs text-gray-500">{{ order.customer }}</p>
                </div>
                <div class="text-right flex items-center gap-3">
                  <p class="text-sm font-semibold text-gray-900">{{ order.total | currency:'LKR':'symbol':'1.0-0' }}</p>
                  <span [ngClass]="{
                    'bg-orange-100 text-orange-700': order.status === 'awaiting_payment',
                    'bg-yellow-100 text-yellow-700': order.status === 'pending',
                    'bg-blue-100 text-blue-700': order.status === 'processing',
                    'bg-purple-100 text-purple-700': order.status === 'shipped',
                    'bg-green-100 text-green-700': order.status === 'delivered',
                    'bg-red-100 text-red-700': order.status === 'cancelled'
                  }" class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium min-w-[70px] justify-center">
                    {{ order.status === 'awaiting_payment' ? 'Awaiting' : order.status }}
                  </span>
                </div>
              </a>
              <p *ngIf="stats.recentOrders.length === 0" class="text-sm text-gray-500 text-center py-8">No orders yet</p>
            </div>
          </div>

          <!-- Top Products -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 class="text-base font-semibold text-gray-900">Top Products</h2>
              <a routerLink="/admin/products" class="text-sm text-indigo-600 hover:text-indigo-500 font-medium">View all</a>
            </div>
            <div class="divide-y divide-gray-50">
              <div *ngFor="let product of stats.topProducts; let i = index"
                   class="flex items-center justify-between px-6 py-3">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold text-gray-400 w-5 text-center">{{ i + 1 }}</span>
                  <div>
                    <p class="text-sm font-semibold text-gray-900">{{ product.name }}</p>
                    <p class="text-xs text-gray-500">{{ product.sold }} sold</p>
                  </div>
                </div>
                <p class="text-sm font-semibold text-gray-900">{{ product.revenue | currency:'LKR':'symbol':'1.0-0' }}</p>
              </div>
              <p *ngIf="stats.topProducts.length === 0" class="text-sm text-gray-500 text-center py-8">No sales yet</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-base font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <a routerLink="/admin/products/new" class="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all">
              <svg class="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Product
            </a>
            <a routerLink="/admin/orders" class="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all">
              <svg class="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              View Orders
            </a>
            <a routerLink="/admin/messages" class="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all">
              <svg class="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              View Messages
            </a>
            <a routerLink="/admin/products" class="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all">
              <svg class="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
              Manage Products
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  loading = true;
  stats: DashboardStats = {
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    unreadMessages: 0,
    recentOrders: [],
    topProducts: []
  };

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.loading = false;
      }
    });
  }
}
