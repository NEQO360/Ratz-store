import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../shared/models/product.model';
import { environment } from '../../environments/environment';

export interface ProductListResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Product[];
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(options?: {
    search?: string;
    category?: string;
    featured?: boolean;
    sort?: string;
    page?: number;
    limit?: number;
  }): Observable<ProductListResponse> {
    let params = new HttpParams();
    if (options?.search) params = params.set('search', options.search);
    if (options?.category) params = params.set('category', options.category);
    if (options?.featured) params = params.set('featured', 'true');
    if (options?.sort) params = params.set('sort', options.sort);
    if (options?.page) params = params.set('page', options.page.toString());
    if (options?.limit) params = params.set('limit', options.limit.toString());

    return this.http.get<ProductListResponse>(this.apiUrl, { params });
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.getProducts({ featured: true, limit: 4 }).pipe(
      map(res => res.data)
    );
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }

  getAdminProducts(): Observable<Product[]> {
    return this.http.get<{ success: boolean; count: number; data: Product[] }>(
      `${this.apiUrl}/admin/all`
    ).pipe(map(res => res.data));
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<ProductResponse>(this.apiUrl, product).pipe(
      map(res => res.data)
    );
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.put<ProductResponse>(`${this.apiUrl}/${id}`, product).pipe(
      map(res => res.data)
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
