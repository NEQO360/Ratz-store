import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
  };
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  total: number;
  status: 'awaiting_payment' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
  };
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderListResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Order[];
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  unreadMessages: number;
  recentOrders: {
    _id: string;
    orderNumber: string;
    customer: string;
    total: number;
    status: string;
    createdAt: Date;
  }[];
  topProducts: {
    _id: string;
    name: string;
    sold: number;
    revenue: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  getOrders(options?: {
    status?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Observable<OrderListResponse> {
    let params = new HttpParams();
    if (options?.status) params = params.set('status', options.status);
    if (options?.search) params = params.set('search', options.search);
    if (options?.dateFrom) params = params.set('dateFrom', options.dateFrom);
    if (options?.dateTo) params = params.set('dateTo', options.dateTo);
    if (options?.page) params = params.set('page', options.page.toString());
    if (options?.limit) params = params.set('limit', options.limit.toString());

    return this.http.get<OrderListResponse>(this.apiUrl, { params });
  }

  getOrder(id: string): Observable<Order> {
    return this.http.get<{ success: boolean; data: Order }>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }

  createOrder(order: {
    customer: { name: string; email: string; phone: string };
    items: { product: string; quantity: number }[];
    shippingAddress: { street: string; city: string; postalCode: string };
    paymentMethod: string;
  }): Observable<Order> {
    return this.http.post<{ success: boolean; data: Order }>(this.apiUrl, order).pipe(
      map(res => res.data)
    );
  }

  updateOrderStatus(id: string, status: string): Observable<Order> {
    return this.http.put<{ success: boolean; data: Order }>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      map(res => res.data)
    );
  }

  getOrderPublic(id: string): Observable<Order> {
    return this.http.get<{ success: boolean; data: Order }>(`${this.apiUrl}/lookup/${id}`).pipe(
      map(res => res.data)
    );
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<{ success: boolean; data: DashboardStats }>(`${this.apiUrl}/dashboard-stats`).pipe(
      map(res => res.data)
    );
  }
}
