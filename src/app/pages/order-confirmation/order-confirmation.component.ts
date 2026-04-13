import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { OrderService, Order } from '../../services/order.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <!-- Loading -->
      <div *ngIf="loading" class="text-center py-12">
        <p class="text-gray-500">Loading order details...</p>
      </div>

      <!-- Error -->
      <div *ngIf="!loading && !order" class="text-center py-12">
        <p class="text-gray-500">Order not found.</p>
        <a routerLink="/" class="text-indigo-600 hover:text-indigo-500 mt-4 inline-block">Go to Homepage</a>
      </div>

      <!-- Confirmation -->
      <div *ngIf="order">
        <!-- Success Header -->
        <div class="text-center mb-10">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 class="text-3xl font-extrabold text-gray-900">Order Placed Successfully!</h1>
          <p class="mt-2 text-lg text-gray-600">Thank you for your order.</p>
          <p class="mt-1 text-sm text-gray-500">A confirmation email has been sent to <strong>{{ order.customer.email }}</strong></p>
        </div>

        <!-- Order Details -->
        <div class="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div class="px-6 py-4 bg-gray-50 border-b">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-sm text-gray-500">Order Number</p>
                <p class="text-xl font-bold text-gray-900">#{{ order.orderNumber }}</p>
              </div>
              <span [ngClass]="{
                'bg-yellow-100 text-yellow-800': order.status === 'awaiting_payment',
                'bg-blue-100 text-blue-800': order.status === 'pending',
                'bg-indigo-100 text-indigo-800': order.status === 'processing'
              }" class="px-3 py-1 rounded-full text-sm font-medium">
                {{ order.status === 'awaiting_payment' ? 'Awaiting Payment' : (order.status | titlecase) }}
              </span>
            </div>
          </div>

          <!-- Items -->
          <div class="px-6 py-4">
            <h3 class="text-sm font-medium text-gray-900 mb-3">Items Ordered</h3>
            <div class="space-y-3">
              <div *ngFor="let item of order.items" class="flex justify-between text-sm">
                <span class="text-gray-700">{{ item.name }} x {{ item.quantity }}</span>
                <span class="font-medium text-gray-900">{{ item.price * item.quantity | currency:'LKR':'symbol':'1.2-2' }}</span>
              </div>
            </div>
            <div class="border-t mt-4 pt-4 flex justify-between text-base font-medium text-gray-900">
              <span>Total</span>
              <span>{{ order.total | currency:'LKR':'symbol':'1.2-2' }}</span>
            </div>
          </div>

          <!-- Shipping -->
          <div class="px-6 py-4 bg-gray-50 border-t">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-1">Shipping Address</h3>
                <p class="text-sm text-gray-600">{{ order.shippingAddress.street }}</p>
                <p class="text-sm text-gray-600">{{ order.shippingAddress.city }}, {{ order.shippingAddress.postalCode }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-1">Payment Method</h3>
                <p class="text-sm text-gray-600">{{ order.paymentMethod }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Bank Transfer Details -->
        <div *ngIf="order.paymentMethod === 'Bank Transfer'" class="bg-amber-50 border border-amber-300 rounded-lg p-6 mb-6">
          <h3 class="text-lg font-medium text-amber-900 mb-3">Bank Transfer Details</h3>
          <p class="text-sm text-amber-800 mb-4">Please transfer the total amount and use your order number as the payment reference.</p>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-amber-700">Bank:</span>
              <span class="font-medium text-amber-900">Commercial Bank of Ceylon</span>
            </div>
            <div class="flex justify-between">
              <span class="text-amber-700">Account Name:</span>
              <span class="font-medium text-amber-900">Ratz Store (Pvt) Ltd</span>
            </div>
            <div class="flex justify-between">
              <span class="text-amber-700">Account Number:</span>
              <span class="font-medium text-amber-900">1234567890</span>
            </div>
            <div class="flex justify-between">
              <span class="text-amber-700">Branch:</span>
              <span class="font-medium text-amber-900">Colombo 03</span>
            </div>
            <div class="flex justify-between">
              <span class="text-amber-700">Reference:</span>
              <span class="font-bold text-amber-900">Order #{{ order.orderNumber }}</span>
            </div>
            <div class="flex justify-between border-t border-amber-300 pt-2 mt-2">
              <span class="text-amber-700">Amount to Transfer:</span>
              <span class="font-bold text-amber-900 text-lg">{{ order.total | currency:'LKR':'symbol':'1.2-2' }}</span>
            </div>
          </div>
        </div>

        <!-- COD Info -->
        <div *ngIf="order.paymentMethod === 'Cash on Delivery'" class="bg-blue-50 border border-blue-300 rounded-lg p-6 mb-6">
          <h3 class="text-lg font-medium text-blue-900 mb-2">Cash on Delivery</h3>
          <p class="text-sm text-blue-800">
            Please keep <strong>{{ order.total | currency:'LKR':'symbol':'1.2-2' }}</strong> ready when your order arrives.
            Our delivery partner will collect the payment at your doorstep.
          </p>
        </div>

        <!-- Actions -->
        <div class="flex justify-center space-x-4">
          <a routerLink="/" class="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Continue Shopping
          </a>
          <a routerLink="/products" class="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            Browse More Products
          </a>
        </div>
      </div>
    </div>
  `
})
export class OrderConfirmationComponent implements OnInit {
  order: Order | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private meta: Meta,
    private title: Title
  ) {
    this.title.setTitle('Order Confirmation - Ratz Store');
    this.meta.updateTag({ name: 'description', content: 'Your order has been placed successfully.' });
  }

  ngOnInit() {
    const orderId = this.route.snapshot.params['id'];
    if (orderId) {
      this.orderService.getOrderPublic(orderId).subscribe({
        next: (order) => {
          this.order = order;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }
}
