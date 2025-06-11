import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { CartService } from '../../services/cart.service';
import { Product } from '../../shared/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];

  constructor(
    private cartService: CartService,
    private meta: Meta,
    private title: Title
  ) {
    this.title.setTitle('Ratz Store - Your One-Stop Shop for Quality Products');
    this.meta.addTags([
      { name: 'description', content: 'Welcome to Ratz Store. Discover amazing products at great prices with fast shipping and excellent customer service.' },
      { name: 'keywords', content: 'online store, shopping, quality products, best prices' }
    ]);
  }

  ngOnInit() {
    // Mock featured products - in real app, this would come from a service
    this.featuredProducts = this.generateFeaturedProducts();
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    // You could add a toast notification here
  }

  private generateFeaturedProducts(): Product[] {
    return [
      {
        id: 'feat-1',
        name: 'Premium Wireless Headphones',
        price: 79.99,
        description: 'High-quality wireless headphones with noise cancellation',
        images: ['https://via.placeholder.com/400x400?text=Headphones'],
        inventory: 25,
        categories: ['electronics', 'audio']
      },
      {
        id: 'feat-2',
        name: 'Smart Watch Pro',
        price: 199.99,
        description: 'Advanced fitness tracking and smartphone integration',
        images: ['https://via.placeholder.com/400x400?text=Smart+Watch'],
        inventory: 15,
        categories: ['electronics', 'wearables']
      },
      {
        id: 'feat-3',
        name: 'Portable Speaker',
        price: 49.99,
        description: 'Waterproof Bluetooth speaker with 12-hour battery life',
        images: ['https://via.placeholder.com/400x400?text=Speaker'],
        inventory: 30,
        categories: ['electronics', 'audio']
      },
      {
        id: 'feat-4',
        name: 'Laptop Stand',
        price: 34.99,
        description: 'Ergonomic aluminum laptop stand for better posture',
        images: ['https://via.placeholder.com/400x400?text=Laptop+Stand'],
        inventory: 40,
        categories: ['accessories', 'office']
      }
    ];
  }
}