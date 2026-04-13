import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { Product } from '../../shared/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="bg-gray-50 min-h-screen">
      <!-- Breadcrumb -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav class="flex items-center gap-2 text-sm text-gray-500">
          <a routerLink="/" class="hover:text-indigo-600 transition-colors">Home</a>
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
          <a routerLink="/products" class="hover:text-indigo-600 transition-colors">Products</a>
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
          <span class="text-gray-900 font-medium truncate max-w-[200px]">{{ product?.name }}</span>
        </nav>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="max-w-7xl mx-auto px-4 py-20 text-center">
        <div class="inline-flex items-center gap-2 text-gray-500">
          <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading product...
        </div>
      </div>

      <!-- Error -->
      <div *ngIf="!loading && !product" class="max-w-7xl mx-auto px-4 py-20 text-center">
        <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Product not found</h3>
        <p class="mt-2 text-gray-500">The product you're looking for doesn't exist or has been removed.</p>
        <a routerLink="/products" class="mt-6 inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-500">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Back to Products
        </a>
      </div>

      <!-- Product Detail -->
      <div *ngIf="!loading && product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="grid grid-cols-1 lg:grid-cols-2">
            <!-- Image Gallery -->
            <div class="p-6 lg:p-8">
              <div class="relative overflow-hidden rounded-xl bg-gray-100 aspect-square">
                <img [src]="selectedImage" 
                     [alt]="product.name"
                     class="w-full h-full object-center object-cover">
                <!-- Badges -->
                <div class="absolute top-3 left-3 flex flex-col gap-2">
                  <span *ngIf="product.featured" 
                        class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-600 text-white shadow-sm">
                    Featured
                  </span>
                  <span *ngIf="product.inventory > 0 && product.inventory <= 5" 
                        class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500 text-white shadow-sm">
                    Only {{ product.inventory }} left!
                  </span>
                  <span *ngIf="product.inventory === 0" 
                        class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-500 text-white shadow-sm">
                    Out of Stock
                  </span>
                </div>
              </div>
              <!-- Thumbnails -->
              <div *ngIf="product.images.length > 1" class="mt-4 flex gap-3 overflow-x-auto pb-2">
                <button *ngFor="let img of product.images; let i = index"
                        (click)="selectedImage = img"
                        class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all"
                        [ngClass]="selectedImage === img ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200 hover:border-gray-300'">
                  <img [src]="img" [alt]="'Image ' + (i + 1)" class="w-full h-full object-cover">
                </button>
              </div>
            </div>

            <!-- Product Info -->
            <div class="p-6 lg:p-8 lg:border-l border-gray-100">
              <!-- Categories -->
              <div class="flex flex-wrap gap-2 mb-3">
                <span *ngFor="let cat of product.categories" 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 capitalize">
                  {{ cat }}
                </span>
              </div>

              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ product.name }}</h1>
              
              <div class="mt-4 flex items-baseline gap-3">
                <span class="text-3xl font-extrabold text-gray-900">{{ product.price | currency:'LKR':'symbol':'1.0-0' }}</span>
                <span *ngIf="product.inventory > 0" class="text-sm font-medium text-green-600">In Stock</span>
                <span *ngIf="product.inventory === 0" class="text-sm font-medium text-red-600">Out of Stock</span>
              </div>

              <!-- Description -->
              <div class="mt-6">
                <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">Description</h3>
                <p class="mt-2 text-gray-600 leading-relaxed whitespace-pre-line">{{ product.description }}</p>
              </div>

              <!-- Details Table -->
              <div class="mt-6 border-t border-gray-100 pt-6">
                <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Product Details</h3>
                <dl class="space-y-3">
                  <div *ngIf="product.countryOfOrigin" class="flex justify-between py-2 border-b border-gray-50">
                    <dt class="text-sm text-gray-500">Country of Origin</dt>
                    <dd class="text-sm font-medium text-gray-900">{{ product.countryOfOrigin }}</dd>
                  </div>
                  <div class="flex justify-between py-2 border-b border-gray-50">
                    <dt class="text-sm text-gray-500">Availability</dt>
                    <dd class="text-sm font-medium" [ngClass]="product.inventory > 0 ? 'text-green-600' : 'text-red-600'">
                      {{ product.inventory > 0 ? product.inventory + ' in stock' : 'Out of stock' }}
                    </dd>
                  </div>
                  <div *ngIf="product.categories.length" class="flex justify-between py-2 border-b border-gray-50">
                    <dt class="text-sm text-gray-500">Categories</dt>
                    <dd class="text-sm font-medium text-gray-900 capitalize">{{ product.categories.join(', ') }}</dd>
                  </div>
                </dl>
              </div>

              <!-- Quantity + Add to Cart -->
              <div class="mt-8 space-y-4">
                <div class="flex items-center gap-4">
                  <label class="text-sm font-medium text-gray-700">Quantity</label>
                  <div class="flex items-center border border-gray-200 rounded-lg">
                    <button (click)="decreaseQty()" 
                            [disabled]="quantity <= 1"
                            class="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                      </svg>
                    </button>
                    <span class="px-4 py-2 text-sm font-semibold text-gray-900 min-w-[3rem] text-center">{{ quantity }}</span>
                    <button (click)="increaseQty()" 
                            [disabled]="quantity >= product.inventory"
                            class="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v12m6-6H6"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <button (click)="addToCart()"
                        [disabled]="product.inventory === 0 || added"
                        class="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold transition-all shadow-sm active:scale-[0.98]"
                        [ngClass]="added 
                          ? 'bg-green-500 text-white' 
                          : product.inventory === 0 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'">
                  <svg *ngIf="!added" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
                  </svg>
                  <svg *ngIf="added" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  {{ added ? 'Added to Cart!' : product.inventory === 0 ? 'Out of Stock' : 'Add to Cart' }}
                </button>
              </div>

              <!-- Shipping Info -->
              <div class="mt-6 bg-gray-50 rounded-xl p-4 space-y-3">
                <div class="flex items-start gap-3">
                  <svg class="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-gray-900">Island-wide Delivery</p>
                    <p class="text-xs text-gray-500">Free shipping on orders over Rs. 5,000</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-gray-900">Cash on Delivery & Bank Transfer</p>
                    <p class="text-xs text-gray-500">Pay when you receive or transfer in advance</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-gray-900">Pickup Available</p>
                    <p class="text-xs text-gray-500">72/4, B Chakkindarama Road, Ratmalana</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  selectedImage = '';
  quantity = 1;
  added = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService,
    private meta: Meta,
    private title: Title
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (!id) {
      this.loading = false;
      return;
    }

    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.selectedImage = product.images[0] || '';
        this.title.setTitle(`${product.name} - Ratz Store`);
        this.meta.updateTag({ name: 'description', content: product.description.substring(0, 160) });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  increaseQty() {
    if (this.product && this.quantity < this.product.inventory) {
      this.quantity++;
    }
  }

  decreaseQty() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (!this.product || this.product.inventory === 0) return;
    this.cartService.addToCart(this.product, this.quantity);
    this.toastService.success(`${this.product.name} added to cart!`);
    this.added = true;
    setTimeout(() => this.added = false, 2000);
  }
}
