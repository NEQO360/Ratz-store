import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <!-- Announcement Bar -->
    @if (!announcementDismissed()) {
      <div class="bg-indigo-600 text-white text-center text-sm py-2 px-4 relative">
        <div class="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <svg class="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          <span>Free shipping on orders over <strong>Rs. 5,000</strong> &mdash; Island-wide delivery!</span>
        </div>
        <button (click)="dismissAnnouncement()" class="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    }

    <!-- Main Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center gap-2 group">
              <div class="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-700 transition-colors">
                <span class="text-white font-bold text-lg">R</span>
              </div>
              <span class="text-xl font-bold text-gray-900 hidden sm:block">Ratz Store</span>
            </a>
          </div>

          <!-- Desktop Nav -->
          <div class="hidden md:flex md:items-center md:space-x-1">
            <a routerLink="/" routerLinkActive="text-indigo-600 bg-indigo-50" 
               [routerLinkActiveOptions]="{exact: true}"
               class="text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
              Home
            </a>
            <a routerLink="/products" routerLinkActive="text-indigo-600 bg-indigo-50"
               class="text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
              Products
            </a>
            <a routerLink="/contact" routerLinkActive="text-indigo-600 bg-indigo-50"
               class="text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
              Contact
            </a>
          </div>

          <!-- Right Side -->
          <div class="flex items-center gap-2">
            <!-- Cart -->
            <a routerLink="/cart" class="relative p-2 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              @if (cartService.itemCount() > 0) {
                <span class="absolute -top-0.5 -right-0.5 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-bounce-once">
                  {{ cartService.itemCount() }}
                </span>
              }
            </a>

            <!-- Mobile Menu Button -->
            <button (click)="toggleMobileMenu()" class="md:hidden p-2 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
              <svg *ngIf="!mobileMenuOpen()" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              <svg *ngIf="mobileMenuOpen()" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <!-- Mobile Menu -->
      @if (mobileMenuOpen()) {
        <div class="md:hidden border-t border-gray-100 bg-white shadow-lg">
          <div class="px-4 py-3 space-y-1">
            <a routerLink="/" (click)="closeMobileMenu()" routerLinkActive="text-indigo-600 bg-indigo-50" 
               [routerLinkActiveOptions]="{exact: true}"
               class="block px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
              Home
            </a>
            <a routerLink="/products" (click)="closeMobileMenu()" routerLinkActive="text-indigo-600 bg-indigo-50"
               class="block px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
              Products
            </a>
            <a routerLink="/contact" (click)="closeMobileMenu()" routerLinkActive="text-indigo-600 bg-indigo-50"
               class="block px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
              Contact
            </a>
            <a routerLink="/cart" (click)="closeMobileMenu()" routerLinkActive="text-indigo-600 bg-indigo-50"
               class="block px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
              Cart
              @if (cartService.itemCount() > 0) {
                <span class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {{ cartService.itemCount() }}
                </span>
              }
            </a>
          </div>
        </div>
      }
    </header>
  `,
  styles: [`
    @keyframes bounceOnce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.3); }
    }
    :host ::ng-deep .animate-bounce-once {
      animation: bounceOnce 0.3s ease-out;
    }
  `]
})
export class HeaderComponent {
  mobileMenuOpen = signal(false);
  announcementDismissed = signal(false);

  constructor(public cartService: CartService) {}

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  dismissAnnouncement() {
    this.announcementDismissed.set(true);
  }
}
