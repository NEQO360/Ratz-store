import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { OrderService } from './../../services/order.service';
import { ContactService } from './../../services/contact.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-gray-100">
      <!-- Sidebar -->
      <div class="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transition-transform duration-300 transform" 
           [class.-translate-x-full]="!sidebarOpen"
           [class.translate-x-0]="sidebarOpen">
        <div class="flex h-16 items-center justify-between px-6">
          <h2 class="text-xl font-semibold text-white">Ratz Admin</h2>
          <button (click)="toggleSidebar()" class="lg:hidden text-gray-400 hover:text-white">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <nav class="mt-8 px-6">
          <a routerLink="/admin/dashboard" 
             routerLinkActive="bg-gray-800 text-white"
             class="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white mb-2">
            <svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Dashboard
          </a>
          
          <a routerLink="/admin/products" 
             routerLinkActive="bg-gray-800 text-white"
             class="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white mb-2">
            <svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            Products
          </a>
          
          <a routerLink="/admin/orders" 
             routerLinkActive="bg-gray-800 text-white"
             class="flex items-center justify-between px-4 py-3 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white mb-2">
            <span class="flex items-center">
              <svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              Orders
            </span>
            <span *ngIf="pendingOrders > 0" class="bg-amber-500 text-white text-xs font-bold rounded-full h-5 min-w-[20px] flex items-center justify-center px-1.5">
              {{ pendingOrders }}
            </span>
          </a>
          
          <a routerLink="/admin/messages" 
             routerLinkActive="bg-gray-800 text-white"
             class="flex items-center justify-between px-4 py-3 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white mb-2">
            <span class="flex items-center">
              <svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              Messages
            </span>
            <span *ngIf="unreadMessages > 0" class="bg-blue-500 text-white text-xs font-bold rounded-full h-5 min-w-[20px] flex items-center justify-center px-1.5">
              {{ unreadMessages }}
            </span>
          </a>
          
          <!-- Store Link -->
          <a routerLink="/" 
             class="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white mb-2">
            <svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
            View Store
          </a>
        </nav>
        
        <div class="absolute bottom-0 w-full px-6 py-4 border-t border-gray-800">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                <span class="text-sm font-medium text-white">{{ getUserInitials() }}</span>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-white">{{ authService.user()?.name }}</p>
                <p class="text-xs text-gray-400">{{ authService.user()?.email }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="lg:pl-64">
        <!-- Header -->
        <header class="bg-white shadow-sm">
          <div class="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button (click)="toggleSidebar()" class="lg:hidden text-gray-500 hover:text-gray-900">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            
            <div class="flex items-center space-x-4">
              <a routerLink="/" 
                 target="_blank"
                 class="text-sm text-gray-500 hover:text-gray-900 flex items-center">
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                View Store
              </a>
              
              <button (click)="logout()" 
                      class="text-sm text-gray-500 hover:text-gray-900 flex items-center">
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>

    <!-- Mobile sidebar backdrop -->
    <div *ngIf="sidebarOpen" 
         (click)="toggleSidebar()"
         class="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"></div>
  `
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  sidebarOpen = true;
  pendingOrders = 0;
  unreadMessages = 0;
  private pollInterval: any;

  constructor(
    public authService: AuthService,
    private orderService: OrderService,
    private contactService: ContactService
  ) {}

  ngOnInit() {
    this.loadCounts();
    this.pollInterval = setInterval(() => this.loadCounts(), 30000);
  }

  ngOnDestroy() {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  loadCounts() {
    this.orderService.getDashboardStats().subscribe({
      next: (data) => {
        this.pendingOrders = data.pendingOrders || 0;
        this.unreadMessages = data.unreadMessages || 0;
      },
      error: () => {}
    });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }

  getUserInitials(): string {
    const name = this.authService.user()?.name || '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}
