import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="bg-gray-50 min-h-screen">
      <div class="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <!-- Breadcrumb -->
        <nav class="flex items-center text-sm text-gray-500 mb-8">
          <a routerLink="/cart" class="hover:text-indigo-600 transition-colors">Cart</a>
          <svg class="mx-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
          <span class="text-gray-900 font-medium">Checkout</span>
        </nav>

        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 mb-2">Checkout</h1>
        <p class="text-gray-500 mb-8">Complete your order details below</p>

        <!-- Empty Cart -->
        <div *ngIf="cartService.isEmpty()" class="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
          <p class="mt-4 text-gray-500">Your cart is empty.</p>
          <a routerLink="/products" class="mt-4 inline-block text-indigo-600 hover:text-indigo-500 font-medium">Browse Products</a>
        </div>

        <form *ngIf="!cartService.isEmpty()" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Secure Checkout Banner -->
          <div class="rounded-xl bg-green-50 border border-green-200 p-4 flex items-start gap-3">
            <svg class="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <div>
              <h3 class="text-sm font-semibold text-green-800">Secure Checkout</h3>
              <p class="text-sm text-green-700">Your information is safe. We'll send a confirmation email with your order details.</p>
            </div>
          </div>

          <!-- Cart Expiry Reminder -->
          <div class="rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
            <svg class="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <h3 class="text-sm font-semibold text-amber-800">Complete your order soon</h3>
              <p class="text-sm text-amber-700">Cart items are reserved for 3 minutes. Fill in your details and place the order before they expire.</p>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg class="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              Order Summary
            </h2>
            <div class="space-y-3">
              <div *ngFor="let item of cartService.items()" class="flex justify-between text-sm">
                <span class="text-gray-700">{{ item.product.name }} <span class="text-gray-400">x {{ item.quantity }}</span></span>
                <span class="font-medium text-gray-900">{{ item.product.price * item.quantity | currency:'LKR':'symbol':'1.2-2' }}</span>
              </div>
              <div class="border-t pt-3 flex justify-between text-base font-bold text-gray-900">
                <span>Total</span>
                <span>{{ cartService.total() | currency:'LKR':'symbol':'1.2-2' }}</span>
              </div>
            </div>
          </div>

          <!-- Customer Info -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg class="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Customer Information
            </h2>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="sm:col-span-2">
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" id="name" name="name" [(ngModel)]="customer.name" required
                       class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5 border">
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" id="email" name="email" [(ngModel)]="customer.email" required
                       class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5 border">
              </div>
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input type="tel" id="phone" name="phone" [(ngModel)]="customer.phone" required
                       placeholder="+94 7X XXX XXXX"
                       class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5 border">
              </div>
            </div>
          </div>

          <!-- Shipping Address -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg class="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Shipping Address
            </h2>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="sm:col-span-2">
                <label for="street" class="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                <input type="text" id="street" name="street" [(ngModel)]="shippingAddress.street" required
                       class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5 border">
              </div>
              <div>
                <label for="city" class="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input type="text" id="city" name="city" [(ngModel)]="shippingAddress.city" required
                       class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5 border">
              </div>
              <div>
                <label for="postalCode" class="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                <input type="text" id="postalCode" name="postalCode" [(ngModel)]="shippingAddress.postalCode" required
                       class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5 border">
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg class="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              Payment Method
            </h2>
            <div class="space-y-3">
              <label class="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all"
                     [class.border-indigo-500]="paymentMethod === 'Cash on Delivery'"
                     [class.bg-indigo-50]="paymentMethod === 'Cash on Delivery'"
                     [class.border-gray-200]="paymentMethod !== 'Cash on Delivery'">
                <input type="radio" name="paymentMethod" value="Cash on Delivery" [(ngModel)]="paymentMethod"
                       class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300">
                <div class="ml-3">
                  <span class="block text-sm font-semibold text-gray-900">Cash on Delivery</span>
                  <span class="block text-sm text-gray-500">Pay when your order arrives at your doorstep</span>
                </div>
              </label>
              <label class="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all"
                     [class.border-indigo-500]="paymentMethod === 'Bank Transfer'"
                     [class.bg-indigo-50]="paymentMethod === 'Bank Transfer'"
                     [class.border-gray-200]="paymentMethod !== 'Bank Transfer'">
                <input type="radio" name="paymentMethod" value="Bank Transfer" [(ngModel)]="paymentMethod"
                       class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300">
                <div class="ml-3">
                  <span class="block text-sm font-semibold text-gray-900">Bank Transfer</span>
                  <span class="block text-sm text-gray-500">Transfer to our bank account &mdash; details shown after placing order</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Error -->
          <div *ngIf="errorMessage" class="rounded-xl bg-red-50 border border-red-200 p-4 flex items-start gap-3">
            <svg class="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-sm text-red-800">{{ errorMessage }}</p>
          </div>

          <!-- Submit -->
          <div class="flex items-center justify-between pt-2">
            <a routerLink="/cart" class="text-sm text-indigo-600 hover:text-indigo-500 font-medium flex items-center gap-1">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Back to Cart
            </a>
            <button type="submit" [disabled]="isSubmitting"
                    class="px-8 py-3.5 border border-transparent text-base font-semibold rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all">
              <span *ngIf="!isSubmitting" class="flex items-center gap-2">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Place Order &mdash; {{ cartService.total() | currency:'LKR':'symbol':'1.2-2' }}
              </span>
              <span *ngIf="isSubmitting" class="flex items-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Placing Order...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CheckoutComponent implements OnInit {
  customer = { name: '', email: '', phone: '' };
  shippingAddress = { street: '', city: '', postalCode: '' };
  paymentMethod = 'Cash on Delivery';
  isSubmitting = false;
  errorMessage = '';

  constructor(
    public cartService: CartService,
    private orderService: OrderService,
    private toastService: ToastService,
    private router: Router,
    private meta: Meta,
    private title: Title
  ) {
    this.title.setTitle('Checkout - Ratz Store');
    this.meta.updateTag({ name: 'description', content: 'Complete your purchase at Ratz Store.' });
  }

  ngOnInit() {
    if (this.cartService.isEmpty()) {
      this.router.navigate(['/cart']);
    }
  }

  onSubmit() {
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill in all required fields.';
      this.toastService.warning('Please fill in all required fields.');
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const items = this.cartService.items().map(item => ({
      product: item.product._id || item.product.id,
      quantity: item.quantity
    }));

    this.orderService.createOrder({
      customer: this.customer,
      items,
      shippingAddress: this.shippingAddress,
      paymentMethod: this.paymentMethod
    }).subscribe({
      next: (order) => {
        this.cartService.clearCart();
        this.toastService.success('Order placed successfully!');
        this.router.navigate(['/order-confirmation', order._id]);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to place order. Please try again.';
        this.toastService.error(this.errorMessage);
        this.isSubmitting = false;
      }
    });
  }

  private isFormValid(): boolean {
    return !!(
      this.customer.name &&
      this.customer.email &&
      this.customer.phone &&
      this.shippingAddress.street &&
      this.shippingAddress.city &&
      this.shippingAddress.postalCode &&
      this.paymentMethod
    );
  }
}
