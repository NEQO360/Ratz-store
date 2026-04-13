import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService, Order } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="p-6">
      <!-- Back link -->
      <a routerLink="/admin/orders" class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-6">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Back to Orders
      </a>

      <!-- Loading -->
      <div *ngIf="loading" class="text-center py-20">
        <div class="inline-flex items-center gap-2 text-gray-500">
          <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading order...
        </div>
      </div>

      <!-- Error -->
      <div *ngIf="!loading && !order" class="text-center py-20">
        <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Order not found</h3>
        <a routerLink="/admin/orders" class="mt-4 inline-flex text-indigo-600 font-medium hover:text-indigo-500">Back to Orders</a>
      </div>

      <!-- Order Detail -->
      <div *ngIf="!loading && order">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Order #{{ order.orderNumber }}</h1>
            <p class="text-sm text-gray-500 mt-1">Placed on {{ order.createdAt | date:'MMMM d, y \'at\' h:mm a' }}</p>
          </div>
          <div class="flex items-center gap-3">
            <select [(ngModel)]="order.status"
                    (ngModelChange)="updateStatus($event)"
                    class="rounded-lg border-gray-300 text-sm font-medium px-4 py-2 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    [ngClass]="{
                      'bg-orange-50 text-orange-700': order.status === 'awaiting_payment',
                      'bg-yellow-50 text-yellow-700': order.status === 'pending',
                      'bg-blue-50 text-blue-700': order.status === 'processing',
                      'bg-purple-50 text-purple-700': order.status === 'shipped',
                      'bg-green-50 text-green-700': order.status === 'delivered',
                      'bg-red-50 text-red-700': order.status === 'cancelled'
                    }">
              <option value="awaiting_payment">Awaiting Payment</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Order Items (left 2/3) -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Items Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">Order Items</h2>
              </div>
              <div class="divide-y divide-gray-100">
                <div *ngFor="let item of order.items" class="flex items-center gap-4 px-6 py-4">
                  <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img *ngIf="item.product?.images?.length" 
                         [src]="item.product.images[0]" 
                         [alt]="item.name"
                         class="w-full h-full object-cover">
                    <div *ngIf="!item.product?.images?.length" class="w-full h-full flex items-center justify-center">
                      <svg class="h-8 w-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</p>
                    <p class="text-sm text-gray-500">{{ item.price | currency:'LKR':'symbol':'1.0-0' }} x {{ item.quantity }}</p>
                  </div>
                  <div class="text-sm font-semibold text-gray-900">
                    {{ item.price * item.quantity | currency:'LKR':'symbol':'1.0-0' }}
                  </div>
                </div>
              </div>
              <!-- Total -->
              <div class="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div class="flex justify-between items-center">
                  <span class="text-base font-semibold text-gray-900">Total</span>
                  <span class="text-xl font-bold text-gray-900">{{ order.total | currency:'LKR':'symbol':'1.0-0' }}</span>
                </div>
              </div>
            </div>

            <!-- Timeline / Activity -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">Order Timeline</h2>
              </div>
              <div class="px-6 py-4">
                <div class="flow-root">
                  <ul class="-mb-4">
                    <li class="pb-4 relative" *ngIf="order.status === 'delivered'">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                          </svg>
                        </div>
                        <p class="text-sm text-gray-700">Order <span class="font-medium">delivered</span></p>
                      </div>
                    </li>
                    <li class="pb-4 relative" *ngIf="order.status === 'shipped' || order.status === 'delivered'">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <svg class="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8"/>
                          </svg>
                        </div>
                        <p class="text-sm text-gray-700">Order <span class="font-medium">shipped</span></p>
                      </div>
                    </li>
                    <li class="pb-4 relative" *ngIf="['processing','shipped','delivered'].includes(order.status)">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                          </svg>
                        </div>
                        <p class="text-sm text-gray-700">Order is being <span class="font-medium">processed</span></p>
                      </div>
                    </li>
                    <li class="pb-4 relative" *ngIf="['pending','processing','shipped','delivered'].includes(order.status)">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                          <svg class="h-4 w-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                        </div>
                        <p class="text-sm text-gray-700">Payment confirmed, order <span class="font-medium">pending</span></p>
                      </div>
                    </li>
                    <li class="relative" *ngIf="order.status === 'awaiting_payment'">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                          <svg class="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1"/>
                          </svg>
                        </div>
                        <p class="text-sm text-gray-700"><span class="font-medium">Awaiting payment</span> from customer</p>
                      </div>
                    </li>
                    <li class="relative" *ngIf="order.status === 'cancelled'">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                          <svg class="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </div>
                        <p class="text-sm text-gray-700">Order <span class="font-medium text-red-600">cancelled</span></p>
                      </div>
                    </li>
                    <li class="relative">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                          </svg>
                        </div>
                        <div>
                          <p class="text-sm text-gray-700">Order <span class="font-medium">placed</span></p>
                          <p class="text-xs text-gray-400">{{ order.createdAt | date:'MMM d, y h:mm a' }}</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar (right 1/3) -->
          <div class="space-y-6">
            <!-- Customer Info -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">Customer</h2>
              </div>
              <div class="px-6 py-4 space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span class="text-sm font-semibold text-indigo-600">{{ order.customer.name.charAt(0) }}</span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ order.customer.name }}</p>
                    <p class="text-xs text-gray-500">Customer</p>
                  </div>
                </div>
                <div class="pt-2 space-y-2">
                  <div class="flex items-center gap-2 text-sm">
                    <svg class="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <a [href]="'mailto:' + order.customer.email" class="text-indigo-600 hover:text-indigo-500 truncate">{{ order.customer.email }}</a>
                  </div>
                  <div *ngIf="order.customer.phone" class="flex items-center gap-2 text-sm">
                    <svg class="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <a [href]="'tel:' + order.customer.phone" class="text-gray-700">{{ order.customer.phone }}</a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Shipping Address -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">Shipping Address</h2>
              </div>
              <div class="px-6 py-4">
                <p class="text-sm text-gray-700">{{ order.shippingAddress.street }}</p>
                <p class="text-sm text-gray-700">{{ order.shippingAddress.city }}, {{ order.shippingAddress.postalCode }}</p>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">Payment</h2>
              </div>
              <div class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                  </svg>
                  <span class="text-sm font-medium text-gray-900">{{ order.paymentMethod }}</span>
                </div>
                <div class="mt-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        [ngClass]="{
                          'bg-orange-100 text-orange-700': order.status === 'awaiting_payment',
                          'bg-green-100 text-green-700': order.status !== 'awaiting_payment' && order.status !== 'cancelled',
                          'bg-red-100 text-red-700': order.status === 'cancelled'
                        }">
                    {{ order.status === 'awaiting_payment' ? 'Payment Pending' : order.status === 'cancelled' ? 'Cancelled' : 'Payment Received' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminOrderDetailComponent implements OnInit {
  order: Order | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (!id) {
      this.loading = false;
      return;
    }

    this.orderService.getOrder(id).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  updateStatus(newStatus: string) {
    if (!this.order) return;
    this.orderService.updateOrderStatus(this.order._id, newStatus).subscribe({
      next: (updated) => {
        if (this.order) this.order.status = updated.status;
        this.toastService.success(`Order status updated to ${newStatus}`);
      },
      error: () => {
        this.toastService.error('Failed to update order status');
      }
    });
  }
}
