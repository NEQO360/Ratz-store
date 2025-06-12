import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { CartService } from '../../services/cart.service';
import { Product } from '../../shared/models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white">
      <div class="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-8">Products</h1>
        
        <!-- Search Bar -->
        <div class="mb-8">
          <input type="text" 
                 [(ngModel)]="searchQuery"
                 (ngModelChange)="filterProducts()"
                 placeholder="Search products..."
                 class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
        </div>

        <div class="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          <div *ngFor="let product of filteredProducts" class="group">
            <div class="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
              <img [src]="product.images[0]" 
                   [alt]="product.name"
                   class="w-full h-64 object-center object-cover group-hover:opacity-75">
            </div>
            <h3 class="mt-4 text-sm text-gray-700">{{ product.name }}</h3>
            <p class="mt-1 text-lg font-medium text-gray-900">{{ product.price | currency:'LKR':'symbol':'1.2-2' }}</p>
            <p class="mt-1 text-sm text-gray-500 line-clamp-2">{{ product.description }}</p>
            <button (click)="addToCart(product)"
                    class="mt-4 w-full bg-indigo-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery = '';

  constructor(
    private cartService: CartService,
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
    this.products = this.generateMockProducts();
    this.filteredProducts = [...this.products];
  }

  filterProducts() {
    const query = this.searchQuery.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.categories.some(cat => cat.toLowerCase().includes(query))
    );
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product, 1);
  }

  private generateMockProducts(): Product[] {
    return Array.from({ length: 12 }, (_, i) => ({
      id: `prod-${i + 1}`,
      name: `Product ${i + 1}`,
      price: Math.floor(Math.random() * 10000) + 1000,
      description: `High quality product with excellent features. Perfect for your needs.`,
      images: [`https://via.placeholder.com/300x300?text=Product+${i + 1}`],
      inventory: Math.floor(Math.random() * 50) + 10,
      categories: ['electronics', 'gadgets']
    }));
  }
}