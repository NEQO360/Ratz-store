import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';
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
    private productService: ProductService,
    private toastService: ToastService,
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
    this.productService.getFeaturedProducts().subscribe({
      next: (products) => this.featuredProducts = products,
      error: (err) => console.error('Error loading featured products:', err)
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.toastService.success(`${product.name} added to cart!`);
  }
}
