import { Injectable, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

export interface AdminUser {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'superadmin';
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: AdminUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'admin_token';
  private readonly USER_KEY = 'admin_user';
  private readonly API_URL = 'http://localhost:3000/api'; // Update with your backend URL
  
  // Signals for reactive state
  private currentUser = signal<AdminUser | null>(null);
  private token = signal<string | null>(null);
  
  // Computed values
  isAuthenticated = computed(() => !!this.token());
  user = computed(() => this.currentUser());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Load saved auth state on initialization
    this.loadAuthState();
    
    // Save auth state whenever it changes
    effect(() => {
      const token = this.token();
      const user = this.currentUser();
      
      if (token && user) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.TOKEN_KEY, token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        }
      } else {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(this.TOKEN_KEY);
          localStorage.removeItem(this.USER_KEY);
        }
      }
    });
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    // For demo purposes, simulate API call
    // Replace with actual HTTP call: return this.http.post<AuthResponse>(`${this.API_URL}/auth/admin/login`, credentials)
    
    return of({
      token: 'demo-jwt-token-' + Date.now(),
      user: {
        _id: '507f1f77bcf86cd799439011',
        email: credentials.email,
        name: 'Admin User',
        role: 'admin' as const,
        createdAt: new Date()
      }
    }).pipe(
      tap(response => {
        this.token.set(response.token);
        this.currentUser.set(response.user);
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error('Invalid credentials'));
      })
    );
  }

  logout(): void {
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/admin/login']);
  }

  // Check if token is valid (for route guards)
  validateToken(): Observable<boolean> {
    const token = this.token();
    if (!token) {
      return of(false);
    }
    
    // In real app, validate token with backend
    // return this.http.get<{valid: boolean}>(`${this.API_URL}/auth/validate`)
    //   .pipe(map(response => response.valid));
    
    // For demo, just check if token exists
    return of(true);
  }

  // Get auth header for API requests
  getAuthHeader(): { [key: string]: string } {
    const token = this.token();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  private loadAuthState(): void {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem(this.TOKEN_KEY);
      const savedUser = localStorage.getItem(this.USER_KEY);
      
      if (savedToken && savedUser) {
        try {
          const user = JSON.parse(savedUser);
          this.token.set(savedToken);
          this.currentUser.set(user);
        } catch (error) {
          console.error('Error loading auth state:', error);
          this.logout();
        }
      }
    }
  }
}