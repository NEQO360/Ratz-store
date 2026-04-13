import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService, ContactMessage } from '../../services/contact.service';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Messages</h1>
        <p class="text-gray-600">Customer inquiries from the contact form</p>
      </div>

      <!-- Filters -->
      <div class="mb-6 flex space-x-4">
        <button (click)="setFilter('all')"
                [class.bg-gray-900]="currentFilter === 'all'"
                [class.text-white]="currentFilter === 'all'"
                [class.bg-white]="currentFilter !== 'all'"
                [class.text-gray-700]="currentFilter !== 'all'"
                class="px-4 py-2 rounded-md text-sm font-medium border border-gray-300">
          All ({{ counts.total }})
        </button>
        <button (click)="setFilter('unread')"
                [class.bg-gray-900]="currentFilter === 'unread'"
                [class.text-white]="currentFilter === 'unread'"
                [class.bg-white]="currentFilter !== 'unread'"
                [class.text-gray-700]="currentFilter !== 'unread'"
                class="px-4 py-2 rounded-md text-sm font-medium border border-gray-300">
          Unread ({{ counts.unread }})
        </button>
        <button (click)="setFilter('read')"
                [class.bg-gray-900]="currentFilter === 'read'"
                [class.text-white]="currentFilter === 'read'"
                [class.bg-white]="currentFilter !== 'read'"
                [class.text-gray-700]="currentFilter !== 'read'"
                class="px-4 py-2 rounded-md text-sm font-medium border border-gray-300">
          Read ({{ counts.read }})
        </button>
        <button (click)="setFilter('replied')"
                [class.bg-gray-900]="currentFilter === 'replied'"
                [class.text-white]="currentFilter === 'replied'"
                [class.bg-white]="currentFilter !== 'replied'"
                [class.text-gray-700]="currentFilter !== 'replied'"
                class="px-4 py-2 rounded-md text-sm font-medium border border-gray-300">
          Replied ({{ counts.replied }})
        </button>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="text-center py-12">
        <p class="text-gray-500">Loading messages...</p>
      </div>

      <!-- Messages List -->
      <div *ngIf="!loading" class="space-y-4">
        <div *ngFor="let message of messages" 
             class="bg-white shadow rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
             (click)="toggleMessage(message)">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3">
                <h3 class="text-lg font-medium text-gray-900">{{ message.subject }}</h3>
                <span [ngClass]="{
                  'bg-yellow-100 text-yellow-800': message.status === 'unread',
                  'bg-gray-100 text-gray-800': message.status === 'read',
                  'bg-green-100 text-green-800': message.status === 'replied'
                }" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ message.status }}
                </span>
              </div>
              <div class="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                <span>{{ message.name }}</span>
                <span>&#8226;</span>
                <span>{{ message.email }}</span>
                <span>&#8226;</span>
                <span>{{ message.createdAt | date:'MMM d, y h:mm a' }}</span>
              </div>
              <p class="mt-2 text-gray-600">{{ message.message }}</p>
            </div>
            <div class="ml-4 flex-shrink-0 flex items-center space-x-2">
              <button (click)="markAsRead(message, $event)"
                      *ngIf="message.status === 'unread'"
                      class="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                Mark as Read
              </button>
              <button (click)="markAsReplied(message, $event)"
                      *ngIf="message.status === 'read'"
                      class="text-green-600 hover:text-green-900 text-sm font-medium">
                Mark as Replied
              </button>
              <button (click)="deleteMessage(message, $event)"
                      class="text-red-600 hover:text-red-900 text-sm font-medium">
                Delete
              </button>
            </div>
          </div>
          
          <!-- Expanded Message Details -->
          <div *ngIf="expandedMessages.has(message._id)" class="mt-4 pt-4 border-t border-gray-200">
            <div class="space-y-4">
              <div>
                <h4 class="text-sm font-medium text-gray-900">Reply to {{ message.name }} ({{ message.email }}):</h4>
                <p class="mt-1 text-xs text-gray-500">This will send an email to the customer with your reply.</p>
                <div class="mt-2">
                  <textarea [(ngModel)]="replyText"
                            rows="4"
                            placeholder="Type your reply here..."
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"></textarea>
                  <div class="mt-2 flex items-center justify-between">
                    <span *ngIf="replySending" class="text-sm text-gray-500 flex items-center gap-1">
                      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                    <span *ngIf="!replySending"></span>
                    <button (click)="sendReply(message)"
                            [disabled]="replySending || !replyText.trim()"
                            class="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      Send Reply via Email
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && messages.length === 0" class="text-center py-12 bg-white rounded-lg">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No messages</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ currentFilter === 'all' ? 'No messages have been received yet.' : 'No ' + currentFilter + ' messages.' }}
        </p>
      </div>
    </div>
  `
})
export class AdminMessagesComponent implements OnInit {
  messages: ContactMessage[] = [];
  loading = true;
  currentFilter: string = 'all';
  expandedMessages = new Set<string>();
  replyText = '';
  replySending = false;
  counts = { total: 0, unread: 0, read: 0, replied: 0 };

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.loading = true;
    this.contactService.getMessages({
      status: this.currentFilter === 'all' ? undefined : this.currentFilter
    }).subscribe({
      next: (res) => {
        this.messages = res.data;
        this.counts = res.counts;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading messages:', err);
        this.loading = false;
      }
    });
  }

  setFilter(filter: string) {
    this.currentFilter = filter;
    this.loadMessages();
  }

  toggleMessage(message: ContactMessage) {
    if (this.expandedMessages.has(message._id)) {
      this.expandedMessages.delete(message._id);
    } else {
      this.expandedMessages.add(message._id);
      if (message.status === 'unread') {
        this.markAsRead(message);
      }
    }
  }

  markAsRead(message: ContactMessage, event?: Event) {
    event?.stopPropagation();
    this.contactService.updateMessageStatus(message._id, 'read').subscribe({
      next: (updated) => {
        message.status = updated.status;
        this.loadMessages();
      },
      error: (err) => console.error('Error updating message:', err)
    });
  }

  markAsReplied(message: ContactMessage, event?: Event) {
    event?.stopPropagation();
    this.contactService.updateMessageStatus(message._id, 'replied').subscribe({
      next: (updated) => {
        message.status = updated.status;
        this.loadMessages();
      },
      error: (err) => console.error('Error updating message:', err)
    });
  }

  deleteMessage(message: ContactMessage, event: Event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this message?')) {
      this.contactService.deleteMessage(message._id).subscribe({
        next: () => this.loadMessages(),
        error: (err) => console.error('Error deleting message:', err)
      });
    }
  }

  sendReply(message: ContactMessage) {
    if (!this.replyText.trim()) return;
    this.replySending = true;
    this.contactService.replyToMessage(message._id, this.replyText.trim()).subscribe({
      next: () => {
        this.replyText = '';
        this.replySending = false;
        this.expandedMessages.delete(message._id);
        this.loadMessages();
      },
      error: (err) => {
        console.error('Error sending reply:', err);
        this.replySending = false;
      }
    });
  }
}
