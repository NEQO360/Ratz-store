import { Injectable, signal, computed, effect } from '@angular/core';
import { Product } from '../shared/models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_EXPIRY_TIME = 3 * 60 * 1000; // 3 minutes
  private readonly STORAGE_KEY = 'ratz_cart';
  
  // Signals for reactive state
  private cartItems = signal<CartItem[]>([]);
  
  // Computed values
  total = computed(() => 
    this.cartItems().reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  );
  
  itemCount = computed(() => 
    this.cartItems().reduce((count, item) => count + item.quantity, 0)
  );
  
  items = computed(() => this.cartItems());
  
  isEmpty = computed(() => this.cartItems().length === 0);

  constructor() {
    // Load cart from localStorage on initialization
    this.loadFromStorage();
    
    // Save to localStorage whenever cart changes
    effect(() => {
      const items = this.cartItems();
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ items }));
      }
    });
    
    // Check for expired items periodically (only in browser)
    if (typeof window !== 'undefined') {
      setInterval(() => this.removeExpiredItems(), 10000); // Check every 10 seconds
    }
  }

  addToCart(product: Product, quantity: number = 1) {
    const currentItems = this.cartItems();
    const existingIndex = currentItems.findIndex(item => item.product.id === product.id);
    
    if (existingIndex >= 0) {
      // Update quantity if item exists
      const updatedItems = [...currentItems];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + quantity,
        addedAt: new Date()
      };
      this.cartItems.set(updatedItems);
    } else {
      // Add new item
      this.cartItems.set([...currentItems, { product, quantity, addedAt: new Date() }]);
    }
  }

  removeFromCart(productId: string) {
    this.cartItems.update(items => items.filter(item => item.product.id !== productId));
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    
    this.cartItems.update(items => 
      items.map(item => 
        item.product.id === productId 
          ? { ...item, quantity, addedAt: new Date() }
          : item
      )
    );
  }

  clearCart() {
    this.cartItems.set([]);
  }

  private loadFromStorage() {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const cart = JSON.parse(stored);
        const now = new Date().getTime();
        
        // Filter out expired items
        const validItems = cart.items.filter((item: CartItem) => {
          const addedTime = new Date(item.addedAt).getTime();
          return now - addedTime < this.CART_EXPIRY_TIME;
        });
        
        this.cartItems.set(validItems);
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }
  }

  private removeExpiredItems() {
    const now = new Date().getTime();
    this.cartItems.update(items => 
      items.filter(item => {
        const addedTime = new Date(item.addedAt).getTime();
        return now - addedTime < this.CART_EXPIRY_TIME;
      })
    );
  }

  getRemainingTime(addedAt: Date): string {
    const now = new Date().getTime();
    const added = new Date(addedAt).getTime();
    const elapsed = now - added;
    const remaining = this.CART_EXPIRY_TIME - elapsed;
    
    if (remaining <= 0) return 'Expired';
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}