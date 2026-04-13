import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none" aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="pointer-events-auto max-w-sm w-full shadow-lg rounded-xl overflow-hidden transform transition-all duration-300 animate-slide-in"
             [ngClass]="{
               'bg-green-50 border border-green-200': toast.type === 'success',
               'bg-red-50 border border-red-200': toast.type === 'error',
               'bg-amber-50 border border-amber-200': toast.type === 'warning',
               'bg-blue-50 border border-blue-200': toast.type === 'info'
             }">
          <div class="p-4 flex items-start gap-3">
            <!-- Icon -->
            <div class="flex-shrink-0 mt-0.5">
              @switch (toast.type) {
                @case ('success') {
                  <svg class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                }
                @case ('error') {
                  <svg class="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                }
                @case ('warning') {
                  <svg class="h-5 w-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                }
                @case ('info') {
                  <svg class="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                }
              }
            </div>
            <p class="text-sm font-medium"
               [ngClass]="{
                 'text-green-800': toast.type === 'success',
                 'text-red-800': toast.type === 'error',
                 'text-amber-800': toast.type === 'warning',
                 'text-blue-800': toast.type === 'info'
               }">{{ toast.message }}</p>
            <button (click)="toastService.dismiss(toast.id)"
                    class="ml-auto flex-shrink-0 rounded-md p-1 hover:bg-black/5 transition-colors">
              <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(100%); }
      to { opacity: 1; transform: translateX(0); }
    }
    :host ::ng-deep .animate-slide-in {
      animation: slideIn 0.3s ease-out;
    }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
