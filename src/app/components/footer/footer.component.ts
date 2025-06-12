import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-gray-800">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">About</h3>
            <ul class="mt-4 space-y-4">
              <li>
                <a routerLink="/about" class="text-base text-gray-300 hover:text-white">
                  Company
                </a>
              </li>
              <li>
                <a routerLink="/contact" class="text-base text-gray-300 hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">Shop</h3>
            <ul class="mt-4 space-y-4">
              <li>
                <a routerLink="/products" class="text-base text-gray-300 hover:text-white">
                  All Products
                </a>
              </li>
              <li>
                <a routerLink="/cart" class="text-base text-gray-300 hover:text-white">
                  Cart
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">Customer Service</h3>
            <ul class="mt-4 space-y-4">
              <li>
                <a href="#" class="text-base text-gray-300 hover:text-white">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" class="text-base text-gray-300 hover:text-white">
                  Returns
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">Follow Us</h3>
            <ul class="mt-4 space-y-4">
              <li>
                <a href="#" class="text-base text-gray-300 hover:text-white">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" class="text-base text-gray-300 hover:text-white">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="mt-8 border-t border-gray-700 pt-8">
          <p class="text-base text-gray-400 text-center">
            &copy; 2025 Ratz Store Sri Lanka. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}