import { Injectable, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

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
  success: boolean;
  token: string;
  user: AdminUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'admin_token';
  private readonly USER_KEY = 'admin_user';
  private readonly API_URL = environment.apiUrl;

  private currentUser = signal<AdminUser | null>(null);
  private token = signal<string | null>(null);

  isAuthenticated = computed(() => !!this.token());
  user = computed(() => this.currentUser());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadAuthState();

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
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/admin/login`, credentials).pipe(
      tap(response => {
        this.token.set(response.token);
        this.currentUser.set(response.user);
      }),
      catchError(error => {
        let message = 'Invalid credentials';
        if (typeof error.error === 'string') {
          message = error.error;
        } else if (typeof error.error?.error === 'string') {
          message = error.error.error;
        } else if (typeof error.error?.message === 'string') {
          message = error.error.message;
        } else if (error.status === 0) {
          message = 'Unable to reach server. Please try again.';
        }
        return throwError(() => new Error(message));
      })
    );
  }

  logout(): void {
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/admin/login']);
  }

  validateToken(): Observable<boolean> {
    const token = this.token();
    if (!token) {
      return of(false);
    }

    return this.http.get<{ success: boolean; valid: boolean }>(`${this.API_URL}/auth/validate`).pipe(
      map(response => response.valid),
      catchError(() => {
        this.logout();
        return of(false);
      })
    );
  }

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
