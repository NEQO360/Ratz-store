import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from './../../shared/models/product.model';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">
          {{ isEditMode ? 'Edit Product' : 'Add New Product' }}
        </h1>
        <p class="text-gray-600">
          {{ isEditMode ? 'Update product information' : 'Fill in the product details below' }}
        </p>
      </div>

      <form (ngSubmit)="onSubmit()" class="space-y-8 bg-white shadow rounded-lg p-6">
        <!-- Basic Information -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div class="col-span-2">
              <label for="name" class="block text-sm font-medium text-gray-700">
                Product Name <span class="text-red-500">*</span>
              </label>
              <input type="text" 
                     id="name" 
                     name="name"
                     [(ngModel)]="product.name"
                     required
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border">
            </div>

            <div class="col-span-2">
              <label for="description" class="block text-sm font-medium text-gray-700">
                Description <span class="text-red-500">*</span>
              </label>
              <textarea id="description" 
                        name="description"
                        [(ngModel)]="product.description"
                        rows="4"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"></textarea>
            </div>

            <div>
              <label for="price" class="block text-sm font-medium text-gray-700">
                Price (LKR) <span class="text-red-500">*</span>
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-500 sm:text-sm">Rs.</span>
                </div>
                <input type="number" 
                       id="price" 
                       name="price"
                       [(ngModel)]="product.price"
                       min="0"
                       step="0.01"
                       required
                       class="pl-12 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border">
              </div>
            </div>

            <div>
              <label for="inventory" class="block text-sm font-medium text-gray-700">
                Inventory <span class="text-red-500">*</span>
              </label>
              <input type="number" 
                     id="inventory" 
                     name="inventory"
                     [(ngModel)]="product.inventory"
                     min="0"
                     required
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border">
            </div>
          </div>
        </div>

        <!-- Categories -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Categories</h3>
          <div class="space-y-2">
            <div *ngFor="let category of availableCategories" class="flex items-center">
              <input type="checkbox" 
                     [id]="'category-' + category"
                     [checked]="product.categories.includes(category)"
                     (change)="toggleCategory(category)"
                     class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
              <label [for]="'category-' + category" class="ml-2 text-sm text-gray-700 capitalize">
                {{ category }}
              </label>
            </div>
          </div>
        </div>

        <!-- Images -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
          <div class="space-y-4">
            <div *ngFor="let image of product.images; let i = index" class="flex items-center space-x-4">
              <input type="url" 
                     [(ngModel)]="product.images[i]"
                     [name]="'image-' + i"
                     placeholder="https://example.com/image.jpg"
                     class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border">
              <button type="button" 
                      (click)="removeImage(i)"
                      class="text-red-600 hover:text-red-900">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
            <button type="button" 
                    (click)="addImage()"
                    class="text-sm text-indigo-600 hover:text-indigo-500">
              + Add Image URL
            </button>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-4 pt-6 border-t">
          <button type="button" 
                  (click)="cancel()"
                  class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" 
                  [disabled]="isSubmitting"
                  class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
            <span *ngIf="!isSubmitting">{{ isEditMode ? 'Update Product' : 'Create Product' }}</span>
            <span *ngIf="isSubmitting" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          </button>
        </div>
      </form>
    </div>
  `
})
export class AdminProductFormComponent implements OnInit {
  isEditMode = false;
  isSubmitting = false;
  productId?: string;
  
  product: Product = {
    id: '',
    name: '',
    price: 0,
    description: '',
    images: [''],
    inventory: 0,
    categories: []
  };

  availableCategories = ['electronics', 'audio', 'wearables', 'accessories', 'office', 'gadgets'];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.productId = this.route.snapshot.params['id'];
    if (this.productId) {
      this.isEditMode = true;
      this.loadProduct();
    }
  }

  loadProduct() {
    // In real app, fetch from API
    // Simulated data for demo
    if (this.productId === '1') {
      this.product = {
        id: '1',
        name: 'Premium Wireless Headphones',
        price: 8999,
        description: 'High-quality wireless headphones with noise cancellation',
        images: ['https://via.placeholder.com/400x400?text=Headphones'],
        inventory: 25,
        categories: ['electronics', 'audio']
      };
    }
  }

  toggleCategory(category: string) {
    const index = this.product.categories.indexOf(category);
    if (index >= 0) {
      this.product.categories.splice(index, 1);
    } else {
      this.product.categories.push(category);
    }
  }

  addImage() {
    this.product.images.push('');
  }

  removeImage(index: number) {
    if (this.product.images.length > 1) {
      this.product.images.splice(index, 1);
    }
  }

  onSubmit() {
    if (this.isFormValid()) {
      this.isSubmitting = true;
      
      // Simulate API call
      setTimeout(() => {
        if (this.isEditMode) {
          console.log('Updating product:', this.product);
          // API call: this.productService.update(this.productId, this.product)
        } else {
          console.log('Creating product:', this.product);
          // API call: this.productService.create(this.product)
        }
        
        this.router.navigate(['/admin/products']);
      }, 1500);
    }
  }

  isFormValid(): boolean {
    return !!(
      this.product.name &&
      this.product.description &&
      this.product.price > 0 &&
      this.product.inventory >= 0 &&
      this.product.categories.length > 0 &&
      this.product.images.some(img => img.trim() !== '')
    );
  }

  cancel() {
    this.router.navigate(['/admin/products']);
  }
}