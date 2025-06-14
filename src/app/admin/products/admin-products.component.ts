import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from './../../shared/models/product.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="p-6">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Products</h1>
          <p class="text-gray-600">Manage your product inventory</p>
        </div>
        <a routerLink="/admin/products/new" 
           class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Product
        </a>
      </div>

      <!-- Search and Filter -->
      <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="sm:col-span-2">
          <input type="text" 
                 [(ngModel)]="searchQuery"
                 (ngModelChange)="filterProducts()"
                 placeholder="Search products..."
                 class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border">
        </div>
        <div>
          <select [(ngModel)]="filterCategory"
                  (ngModelChange)="filterProducts()"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border">
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="audio">Audio</option>
            <option value="wearables">Wearables</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>
      </div>

      <!-- Products Table -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inventory
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
            <tr *ngFor="let product of filteredProducts">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <img class="h-10 w-10 rounded-full object-cover" 
                         [src]="product.images[0]" 
                         [alt]="product.name">
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                    <div class="text-sm text-gray-500">{{ product.categories.join(', ') }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ product.price | currency:'LKR':'symbol':'1.0-0' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ product.inventory }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span [ngClass]="{
                  'bg-green-100 text-green-800': product.inventory > 10,
                  'bg-yellow-100 text-yellow-800': product.inventory > 0 && product.inventory <= 10,
                  'bg-red-100 text-red-800': product.inventory === 0
                }" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ getStockStatus(product.inventory) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a [routerLink]="['/admin/products/edit', product.id]" 
                   class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</a>
                <button (click)="deleteProduct(product)" 
                        class="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Empty State -->
        <div *ngIf="filteredProducts.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No products found</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
          <div class="mt-6">
            <a routerLink="/admin/products/new" 
               class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Product
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery = '';
  filterCategory = '';

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    // Mock data - replace with API call
    this.products = [
      {
        id: '1',
        name: 'Premium Wireless Headphones',
        price: 8999,
        description: 'High-quality wireless headphones with noise cancellation',
        images: ['https://via.placeholder.com/400x400?text=Headphones'],
        inventory: 25,
        categories: ['electronics', 'audio']
      },
      {
        id: '2',
        name: 'Smart Watch Pro',
        price: 24999,
        description: 'Advanced fitness tracking and smartphone integration',
        images: ['https://via.placeholder.com/400x400?text=Smart+Watch'],
        inventory: 8,
        categories: ['electronics', 'wearables']
      },
      {
        id: '3',
        name: 'Portable Speaker',
        price: 5999,
        description: 'Waterproof Bluetooth speaker with 12-hour battery life',
        images: ['https://via.placeholder.com/400x400?text=Speaker'],
        inventory: 0,
        categories: ['electronics', 'audio']
      }
    ];
    this.filteredProducts = [...this.products];
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchQuery || 
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesCategory = !this.filterCategory || 
        product.categories.includes(this.filterCategory);
      
      return matchesSearch && matchesCategory;
    });
  }

  getStockStatus(inventory: number): string {
    if (inventory === 0) return 'Out of Stock';
    if (inventory <= 10) return 'Low Stock';
    return 'In Stock';
  }

  deleteProduct(product: Product) {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      // In real app, make API call to delete
      console.log('Deleting product:', product.id);
      this.products = this.products.filter(p => p.id !== product.id);
      this.filterProducts();
    }
  }
}