import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product } from '../shared/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products'; // Your backend URL

  constructor(private http: HttpClient) {}

  // Get all products
  getProducts(): Observable<Product[]> {
    // For now, return mock data
    // Replace with: return this.http.get<Product[]>(this.apiUrl);
    
    const mockProducts: Product[] = Array.from({ length: 12 }, (_, i) => ({
      id: `prod-${i + 1}`,
      name: this.getProductName(i),
      price: this.getProductPrice(i),
      description: 'High quality product with excellent features. Perfect for your needs.',
      images: [`https://via.placeholder.com/300x300?text=Product+${i + 1}`],
      inventory: Math.floor(Math.random() * 50) + 10,
      categories: this.getProductCategories(i)
    }));
    
    return of(mockProducts);
  }

  // Get single product
  getProduct(id: string): Observable<Product | undefined> {
    // Replace with: return this.http.get<Product>(`${this.apiUrl}/${id}`);
    return this.getProducts().pipe(
      map(products => products.find(p => p.id === id))
    );
  }

  // Create product (admin)
  createProduct(product: Product): Observable<Product> {
    // return this.http.post<Product>(this.apiUrl, product);
    return of({ ...product, id: 'new-' + Date.now() });
  }

  // Update product (admin)
  updateProduct(id: string, product: Product): Observable<Product> {
    // return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
    return of(product);
  }

  // Delete product (admin)
  deleteProduct(id: string): Observable<void> {
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
    return of(undefined);
  }

  // Search products
  searchProducts(query: string): Observable<Product[]> {
    // return this.http.get<Product[]>(`${this.apiUrl}/search?q=${query}`);
    return this.getProducts().pipe(
      map(products => products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }

  // Helper methods for mock data
  private getProductName(index: number): string {
    const names = [
      'Premium Wireless Headphones',
      'Smart Watch Pro',
      'Portable Speaker',
      'Laptop Stand',
      'USB-C Hub',
      'Wireless Mouse',
      'Mechanical Keyboard',
      'Phone Case',
      'Power Bank',
      'Cable Organizer',
      'Desk Lamp',
      'Webcam HD'
    ];
    return names[index % names.length];
  }

  private getProductPrice(index: number): number {
    const prices = [8999, 24999, 5999, 3999, 4599, 2999, 12999, 1999, 6999, 999, 7999, 9999];
    return prices[index % prices.length];
  }

  private getProductCategories(index: number): string[] {
    const categories = [
      ['electronics', 'audio'],
      ['electronics', 'wearables'],
      ['electronics', 'audio'],
      ['accessories', 'office'],
      ['electronics', 'accessories'],
      ['electronics', 'accessories'],
      ['electronics', 'office'],
      ['accessories'],
      ['electronics', 'accessories'],
      ['accessories', 'office'],
      ['electronics', 'office'],
      ['electronics', 'office']
    ];
    return categories[index % categories.length];
  }
}

// Add this import to the service file
import { map } from 'rxjs/operators';