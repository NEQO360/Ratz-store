import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
    };
    quantity: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
  };
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

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
                 (ngModelChange)="filterOrders()"
                 placeholder="Search by order # or customer..."
                 class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border">
        </div>
        <div>
          <select [(ngModel)]="filterStatus"
                  (ngModelChange)="filterOrders()"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border">
            <option value="">All Status</option>
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
                 (ngModelChange)="filterOrders()"
                 class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border">
        </div>
        <div>
          <input type="date" 
                 [(ngModel)]="filterDateTo"
                 (ngModelChange)="filterOrders()"
                 class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border">
        </div>
      </div>

      <!-- Orders Table -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let order of filteredOrders">
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
                <select [(ngModel)]="order.status"
                        (ngModelChange)="updateOrderStatus(order)"
                        [ngClass]="{
                          'bg-yellow-100 text-yellow-800': order.status === 'pending',
                          'bg-blue-100 text-blue-800': order.status === 'processing',
                          'bg-purple-100 text-purple-800': order.status === 'shipped',
                          'bg-green-100 text-green-800': order.status === 'delivered',
                          'bg-red-100 text-red-800': order.status === 'cancelled'
                        }"
                        class="px-2 py-1 text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-offset-0">
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
        <div *ngIf="filteredOrders.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
          <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
        </div>
      </div>

      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">1</span> to <span class="font-medium">{{ filteredOrders.length }}</span> of
              <span class="font-medium">{{ orders.length }}</span> results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Previous
              </button>
              <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
              </button>
              <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
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
  filteredOrders: Order[] = [];
  searchQuery = '';
  filterStatus = '';
  filterDateFrom = '';
  filterDateTo = '';

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    // Mock data - replace with API call
    this.orders = [
      {
        _id: '1',
        orderNumber: '10234',
        customer: {
          name: 'Amal Perera',
          email: 'amal@example.com',
          phone: '+94 77 123 4567'
        },
        items: [
          {
            product: { _id: '1', name: 'Premium Wireless Headphones', price: 8999 },
            quantity: 1
          },
          {
            product: { _id: '2', name: 'Laptop Stand', price: 3999 },
            quantity: 2
          }
        ],
        total: 16997,
        status: 'pending',
        shippingAddress: {
          street: '123 Galle Road',
          city: 'Colombo',
          postalCode: '00300'
        },
        paymentMethod: 'Credit Card',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: '2',
        orderNumber: '10233',
        customer: {
          name: 'Nimal Silva',
          email: 'nimal@example.com',
          phone: '+94 71 234 5678'
        },
        items: [
          {
            product: { _id: '3', name: 'Smart Watch Pro', price: 24999 },
            quantity: 1
          }
        ],
        total: 24999,
        status: 'processing',
        shippingAddress: {
          street: '456 Main Street',
          city: 'Kandy',
          postalCode: '20000'
        },
        paymentMethod: 'Cash on Delivery',
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date()
      }
    ];
    this.filteredOrders = [...this.orders];
  }

  filterOrders() {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = !this.searchQuery || 
        order.orderNumber.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesStatus = !this.filterStatus || order.status === this.filterStatus;
      
      let matchesDate = true;
      if (this.filterDateFrom || this.filterDateTo) {
        const orderDate = new Date(order.createdAt);
        if (this.filterDateFrom) {
          matchesDate = matchesDate && orderDate >= new Date(this.filterDateFrom);
        }
        if (this.filterDateTo) {
          matchesDate = matchesDate && orderDate <= new Date(this.filterDateTo);
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }

  updateOrderStatus(order: Order) {
    console.log('Updating order status:', order._id, order.status);
    // In real app, make API call to update status
    // this.orderService.updateStatus(order._id, order.status).subscribe();
  }
}