import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';
import { Product } from '../../shared/models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="bg-gray-50 min-h-screen">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
        <!-- Page Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Products</h1>
          <p class="mt-2 text-gray-500">Browse our full collection of quality products</p>
        </div>

        <!-- Search & Filter Bar -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input type="text" 
                   [(ngModel)]="searchQuery"
                   (ngModelChange)="onSearch()"
                   placeholder="Search products..."
                   class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="text-center py-20">
          <div class="inline-flex items-center gap-2 text-gray-500">
            <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading products...
          </div>
        </div>

        <!-- Product Grid -->
        <div *ngIf="!loading && products.length > 0" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div *ngFor="let product of products" 
               class="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all duration-300">
            <a [routerLink]="['/product', product._id || product.id]" class="block relative overflow-hidden bg-gray-100 aspect-square cursor-pointer">
              <img [src]="product.images[0]" 
                   [alt]="product.name"
                   class="w-full h-full object-center object-cover group-hover:scale-105 transition-transform duration-500">
              <div class="absolute top-3 left-3 flex flex-col gap-2">
                <span *ngIf="product.inventory && product.inventory <= 5 && product.inventory > 0" 
                      class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500 text-white shadow-sm">
                  Only {{ product.inventory }} left!
                </span>
                <span *ngIf="product.inventory === 0" 
                      class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-500 text-white shadow-sm">
                  Out of Stock
                </span>
                <span *ngIf="product.featured" 
                      class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-600 text-white shadow-sm">
                  Featured
                </span>
              </div>
            </a>
            <div class="p-4">
              <a [routerLink]="['/product', product._id || product.id]" class="block">
                <h3 class="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{{ product.name }}</h3>
              </a>
              <p class="mt-1 text-sm text-gray-500 line-clamp-2 min-h-[2.5rem]">{{ product.description }}</p>
              <div class="mt-3 flex items-center justify-between">
                <p class="text-lg font-bold text-gray-900">{{ product.price | currency:'LKR':'symbol':'1.0-0' }}</p>
                <button (click)="addToCart(product)"
                        [disabled]="product.inventory === 0 || addedProducts[product.id || product._id || '']"
                        class="inline-flex items-center gap-1.5 text-sm font-medium rounded-lg px-3 py-2 transition-all shadow-sm active:scale-95 disabled:cursor-not-allowed"
                        [ngClass]="addedProducts[product.id || product._id || ''] 
                          ? 'bg-green-500 text-white' 
                          : product.inventory === 0 
                            ? 'bg-gray-200 text-gray-400' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'">
                  <svg *ngIf="!addedProducts[product.id || product._id || '']" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  <svg *ngIf="addedProducts[product.id || product._id || '']" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  {{ addedProducts[product.id || product._id || ''] ? 'Added!' : product.inventory === 0 ? 'Sold Out' : 'Add' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && products.length === 0" class="text-center py-20">
          <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">No products found</h3>
          <p class="mt-2 text-gray-500">Try a different search term.</p>
        </div>
      </div>
    </div>
  `
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  searchQuery = '';
  loading = true;
  addedProducts: { [key: string]: boolean } = {};

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private toastService: ToastService,
    private meta: Meta,
    private title: Title
  ) {
    this.title.setTitle('Products - Ratz Store');
    this.meta.addTags([
      { name: 'description', content: 'Browse our wide selection of quality products at Ratz Store.' },
      { name: 'keywords', content: 'products, shopping, online store, quality goods' }
    ]);
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts({ search: this.searchQuery || undefined }).subscribe({
      next: (res) => {
        this.products = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.loading = false;
      }
    });
  }

  onSearch() {
    this.loadProducts();
  }

  addToCart(product: Product) {
    const pid = product.id || product._id || '';
    this.cartService.addToCart(product, 1);
    this.toastService.success(`${product.name} added to cart!`);

    this.addedProducts[pid] = true;
    setTimeout(() => {
      this.addedProducts[pid] = false;
    }, 1500);
  }
}
