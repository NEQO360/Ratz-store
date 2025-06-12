import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Shopping Cart</h1>
      
      <div class="mt-12" *ngIf="!cartService.isEmpty(); else emptyCart">
        <div class="flow-root">
          <ul role="list" class="-my-6 divide-y divide-gray-200">
            <li *ngFor="let item of cartService.items()" class="py-6 flex">
              <div class="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                <img [src]="item.product.images[0]" 
                     [alt]="item.product.name"
                     class="w-full h-full object-center object-cover">
              </div>

              <div class="ml-4 flex-1 flex flex-col">
                <div>
                  <div class="flex justify-between text-base font-medium text-gray-900">
                    <h3>{{ item.product.name }}</h3>
                    <p class="ml-4">{{ item.product.price * item.quantity | currency:'LKR':'symbol':'1.2-2' }}</p>
                  </div>
                  <p class="mt-1 text-sm text-gray-500">{{ item.product.description }}</p>
                  <p class="mt-1 text-xs text-gray-400">
                    Expires in: {{ cartService.getRemainingTime(item.addedAt) }}
                  </p>
                </div>
                <div class="flex-1 flex items-end justify-between text-sm">
                  <div class="flex items-center">
                    <button (click)="cartService.updateQuantity(item.product.id, item.quantity - 1)"
                            class="text-gray-500 hover:text-gray-700">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                      </svg>
                    </button>
                    <span class="mx-2 text-gray-700">{{ item.quantity }}</span>
                    <button (click)="cartService.updateQuantity(item.product.id, item.quantity + 1)"
                            class="text-gray-500 hover:text-gray-700">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  <button (click)="cartService.removeFromCart(item.product.id)"
                          class="font-medium text-indigo-600 hover:text-indigo-500">
                    Remove
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div class="border-t border-gray-200 py-6 px-4 sm:px-6">
          <div class="flex justify-between text-base font-medium text-gray-900">
            <p>Total</p>
            <p>{{ cartService.total() | currency:'LKR':'symbol':'1.2-2' }}</p>
          </div>
          <p class="mt-0.5 text-sm text-gray-500">Shipping calculated based on location at checkout.</p>
          <div class="mt-6">
            <button class="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              Checkout
            </button>
          </div>
        </div>
      </div>

      <ng-template #emptyCart>
        <div class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
          <p class="mt-1 text-sm text-gray-500">Start adding some items to your cart!</p>
          <div class="mt-6">
            <a routerLink="/products" 
               class="text-base font-medium text-indigo-600 hover:text-indigo-500">
              Continue Shopping
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </div>
        </div>
      </ng-template>
    </div>
  `
})
export class CartComponent {
  constructor(
    public cartService: CartService,
    private meta: Meta,
    private title: Title
  ) {
    this.title.setTitle('Shopping Cart - Ratz Store');
    this.meta.updateTag({ name: 'description', content: 'View and manage items in your shopping cart at Ratz Store.' });
  }
}