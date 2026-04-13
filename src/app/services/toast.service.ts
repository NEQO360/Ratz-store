import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  icon?: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  toasts = signal<Toast[]>([]);

  show(message: string, type: Toast['type'] = 'info', duration = 3000) {
    const toast: Toast = { id: this.nextId++, message, type, duration };
    this.toasts.update(t => [...t, toast]);
    if (duration > 0) {
      setTimeout(() => this.dismiss(toast.id), duration);
    }
  }

  success(message: string, duration = 3000) { this.show(message, 'success', duration); }
  error(message: string, duration = 4000) { this.show(message, 'error', duration); }
  warning(message: string, duration = 4000) { this.show(message, 'warning', duration); }
  info(message: string, duration = 3000) { this.show(message, 'info', duration); }

  dismiss(id: number) {
    this.toasts.update(t => t.filter(toast => toast.id !== id));
  }
}
