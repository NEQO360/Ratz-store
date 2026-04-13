import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-gray-50 min-h-screen">
      <div class="max-w-3xl mx-auto pt-12 pb-24 px-4 sm:px-6 lg:max-w-5xl lg:px-8">
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Shopping Cart</h1>

        <div class="mt-8" *ngIf="!cartService.isEmpty(); else emptyCart">
          <!-- Cart Timer Warning Banner -->
          <div class="mb-6 rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
            <div class="flex-shrink-0 mt-0.5">
              <svg class="h-5 w-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-amber-800">Cart items are reserved for 3 minutes</h3>
              <p class="mt-1 text-sm text-amber-700">Items expire automatically to keep inventory fair. Updating quantity resets the timer.</p>
            </div>
          </div>

          <!-- Cart Items -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <ul role="list" class="divide-y divide-gray-100">
              <li *ngFor="let item of cartService.items(); let i = index" class="p-4 sm:p-6 flex gap-4 hover:bg-gray-50 transition-colors">
                <div class="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-xl overflow-hidden">
                  <img [src]="item.product.images[0]" 
                       [alt]="item.product.name"
                       class="w-full h-full object-center object-cover">
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex justify-between">
                    <h3 class="text-sm font-semibold text-gray-900 truncate pr-2">{{ item.product.name }}</h3>
                    <p class="text-sm font-bold text-gray-900 whitespace-nowrap">{{ item.product.price * item.quantity | currency:'LKR':'symbol':'1.2-2' }}</p>
                  </div>
                  <p class="mt-1 text-sm text-gray-500 hidden sm:block line-clamp-1">{{ item.product.description }}</p>
                  
                  <!-- Timer with color coding -->
                  <div class="mt-2 flex items-center gap-1.5">
                    <svg class="h-3.5 w-3.5" [ngClass]="getTimerColor(item.addedAt)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span class="text-xs font-medium" [ngClass]="getTimerColor(item.addedAt)">
                      {{ cartService.getRemainingTime(item.addedAt) }}
                    </span>
                  </div>

                  <div class="mt-3 flex items-center justify-between">
                    <div class="inline-flex items-center bg-gray-100 rounded-lg">
                      <button (click)="cartService.updateQuantity(item.product.id, item.quantity - 1)"
                              class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-l-lg transition-colors">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                        </svg>
                      </button>
                      <span class="px-3 text-sm font-semibold text-gray-900 tabular-nums">{{ item.quantity }}</span>
                      <button (click)="cartService.updateQuantity(item.product.id, item.quantity + 1)"
                              class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-r-lg transition-colors">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>

                    <button (click)="cartService.removeFromCart(item.product.id)"
                            class="text-sm font-medium text-red-500 hover:text-red-700 transition-colors flex items-center gap-1">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <!-- Order Summary -->
          <div class="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div class="space-y-3">
              <div class="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({{ cartService.itemCount() }} items)</span>
                <span>{{ cartService.total() | currency:'LKR':'symbol':'1.2-2' }}</span>
              </div>
              <div class="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span *ngIf="cartService.total() >= 5000" class="text-green-600 font-medium">FREE</span>
                <span *ngIf="cartService.total() < 5000" class="text-gray-900">Calculated at checkout</span>
              </div>
              <div class="border-t pt-3 flex justify-between text-base font-bold text-gray-900">
                <span>Total</span>
                <span>{{ cartService.total() | currency:'LKR':'symbol':'1.2-2' }}</span>
              </div>
            </div>

            <!-- Free Shipping Progress -->
            <div *ngIf="cartService.total() < 5000" class="mt-4 bg-indigo-50 rounded-lg p-3">
              <div class="flex items-center justify-between text-xs mb-2">
                <span class="text-indigo-700 font-medium">Add {{ 5000 - cartService.total() | currency:'LKR':'symbol':'1.0-0' }} more for free shipping!</span>
                <span class="text-indigo-500">{{ (cartService.total() / 5000 * 100).toFixed(0) }}%</span>
              </div>
              <div class="w-full bg-indigo-200 rounded-full h-1.5">
                <div class="bg-indigo-600 h-1.5 rounded-full transition-all" [style.width.%]="cartService.total() / 5000 * 100"></div>
              </div>
            </div>
            <div *ngIf="cartService.total() >= 5000" class="mt-4 bg-green-50 rounded-lg p-3 flex items-center gap-2">
              <svg class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="text-sm font-medium text-green-700">You qualify for free shipping!</span>
            </div>

            <div class="mt-6">
              <a routerLink="/checkout" class="w-full flex justify-center items-center gap-2 px-6 py-3.5 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                Proceed to Checkout
              </a>
            </div>

            <!-- Payment Methods Info -->
            <div class="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
              <span class="flex items-center gap-1">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                Cash on Delivery
              </span>
              <span class="flex items-center gap-1">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                </svg>
                Bank Transfer
              </span>
            </div>
          </div>

          <div class="mt-4 text-center">
            <a routerLink="/products" class="text-sm font-medium text-indigo-600 hover:text-indigo-500 inline-flex items-center gap-1">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Continue Shopping
            </a>
          </div>
        </div>

        <ng-template #emptyCart>
          <div class="text-center py-20">
            <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Your cart is empty</h3>
            <p class="mt-2 text-gray-500">Looks like you haven't added any items yet.</p>
            <div class="mt-8">
              <a routerLink="/products" 
                 class="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                Start Shopping
              </a>
            </div>
          </div>
        </ng-template>
      </div>
    </div>
  `
})
export class CartComponent implements OnInit, OnDestroy {
  private timerInterval: any;

  constructor(
    public cartService: CartService,
    private meta: Meta,
    private title: Title
  ) {
    this.title.setTitle('Shopping Cart - Ratz Store');
    this.meta.updateTag({ name: 'description', content: 'View and manage items in your shopping cart at Ratz Store.' });
  }

  ngOnInit() {
    this.timerInterval = setInterval(() => {}, 1000);
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  getTimerColor(addedAt: Date): string {
    const elapsed = new Date().getTime() - new Date(addedAt).getTime();
    const remaining = (3 * 60 * 1000) - elapsed;
    if (remaining <= 30000) return 'text-red-500';
    if (remaining <= 60000) return 'text-amber-500';
    return 'text-gray-400';
  }
}
