import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService, Order } from '../../services/order.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="p-6">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Orders</h1>
        <p class="text-gray-600">Manage customer orders</p>
      </div>

      <!-- Filters -->
      <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <input type="text" 
                 [(ngModel)]="searchQuery"
                 (ngModelChange)="loadOrders()"
                 placeholder="Search by order # or customer..."
                 class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border">
        </div>
        <div>
          <select [(ngModel)]="filterStatus"
                  (ngModelChange)="loadOrders()"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border">
            <option value="">All Status</option>
            <option value="awaiting_payment">Awaiting Payment</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <input type="date" 
                 [(ngModel)]="filterDateFrom"
                 (ngModelChange)="loadOrders()"
                 class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border">
        </div>
        <div>
          <input type="date" 
                 [(ngModel)]="filterDateTo"
                 (ngModelChange)="loadOrders()"
                 class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border">
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="text-center py-12">
        <p class="text-gray-500">Loading orders...</p>
      </div>

      <!-- Orders Table -->
      <div *ngIf="!loading" class="bg-white shadow overflow-hidden sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let order of orders">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">#{{ order.orderNumber }}</div>
                <div class="text-sm text-gray-500">{{ order.items.length }} items</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ order.customer.name }}</div>
                <div class="text-sm text-gray-500">{{ order.customer.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ order.createdAt | date:'MMM d, y' }}</div>
                <div class="text-sm text-gray-500">{{ order.createdAt | date:'h:mm a' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ order.total | currency:'LKR':'symbol':'1.0-0' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select [ngModel]="order.status"
                        (ngModelChange)="updateOrderStatus(order, $event)"
                        [ngClass]="{
                          'bg-orange-100 text-orange-800': order.status === 'awaiting_payment',
                          'bg-yellow-100 text-yellow-800': order.status === 'pending',
                          'bg-blue-100 text-blue-800': order.status === 'processing',
                          'bg-purple-100 text-purple-800': order.status === 'shipped',
                          'bg-green-100 text-green-800': order.status === 'delivered',
                          'bg-red-100 text-red-800': order.status === 'cancelled'
                        }"
                        class="px-2 py-1 text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-offset-0">
                  <option value="awaiting_payment">Awaiting Payment</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a [routerLink]="['/admin/orders', order._id]" 
                   class="text-indigo-600 hover:text-indigo-900">View Details</a>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Empty State -->
        <div *ngIf="orders.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
          <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
        </div>
      </div>

      <!-- Pagination -->
      <div *ngIf="!loading && totalPages > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-0">
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing page <span class="font-medium">{{ currentPage }}</span> of
              <span class="font-medium">{{ totalPages }}</span>
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 1"
                      class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                Previous
              </button>
              <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage === totalPages"
                      class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  searchQuery = '';
  filterStatus = '';
  filterDateFrom = '';
  filterDateTo = '';
  currentPage = 1;
  totalPages = 1;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getOrders({
      search: this.searchQuery || undefined,
      status: this.filterStatus || undefined,
      dateFrom: this.filterDateFrom || undefined,
      dateTo: this.filterDateTo || undefined,
      page: this.currentPage
    }).subscribe({
      next: (res) => {
        this.orders = res.data;
        this.totalPages = res.pages;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.loading = false;
      }
    });
  }

  updateOrderStatus(order: Order, newStatus: string) {
    this.orderService.updateOrderStatus(order._id, newStatus).subscribe({
      next: (updated) => {
        order.status = updated.status;
      },
      error: (err) => console.error('Error updating order status:', err)
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadOrders();
    }
  }
}
