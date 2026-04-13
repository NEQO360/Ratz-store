import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: Date;
}

export interface ContactListResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  counts: {
    total: number;
    unread: number;
    read: number;
    replied: number;
  };
  data: ContactMessage[];
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = `${environment.apiUrl}/contact`;

  constructor(private http: HttpClient) {}

  submitContact(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Observable<ContactMessage> {
    return this.http.post<{ success: boolean; data: ContactMessage }>(this.apiUrl, data).pipe(
      map(res => res.data)
    );
  }

  getMessages(options?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Observable<ContactListResponse> {
    let params = new HttpParams();
    if (options?.status) params = params.set('status', options.status);
    if (options?.page) params = params.set('page', options.page.toString());
    if (options?.limit) params = params.set('limit', options.limit.toString());

    return this.http.get<ContactListResponse>(this.apiUrl, { params });
  }

  updateMessageStatus(id: string, status: string): Observable<ContactMessage> {
    return this.http.put<{ success: boolean; data: ContactMessage }>(
      `${this.apiUrl}/${id}/status`, { status }
    ).pipe(map(res => res.data));
  }

  replyToMessage(id: string, reply: string): Observable<ContactMessage> {
    return this.http.post<{ success: boolean; data: ContactMessage }>(
      `${this.apiUrl}/${id}/reply`, { reply }
    ).pipe(map(res => res.data));
  }

  deleteMessage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
