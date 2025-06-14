import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: Date;
}

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
          All ({{ getTotalCount() }})
        </button>
        <button (click)="setFilter('unread')"
                [class.bg-gray-900]="currentFilter === 'unread'"
                [class.text-white]="currentFilter === 'unread'"
                [class.bg-white]="currentFilter !== 'unread'"
                [class.text-gray-700]="currentFilter !== 'unread'"
                class="px-4 py-2 rounded-md text-sm font-medium border border-gray-300">
          Unread ({{ getUnreadCount() }})
        </button>
        <button (click)="setFilter('read')"
                [class.bg-gray-900]="currentFilter === 'read'"
                [class.text-white]="currentFilter === 'read'"
                [class.bg-white]="currentFilter !== 'read'"
                [class.text-gray-700]="currentFilter !== 'read'"
                class="px-4 py-2 rounded-md text-sm font-medium border border-gray-300">
          Read ({{ getReadCount() }})
        </button>
        <button (click)="setFilter('replied')"
                [class.bg-gray-900]="currentFilter === 'replied'"
                [class.text-white]="currentFilter === 'replied'"
                [class.bg-white]="currentFilter !== 'replied'"
                [class.text-gray-700]="currentFilter !== 'replied'"
                class="px-4 py-2 rounded-md text-sm font-medium border border-gray-300">
          Replied ({{ getRepliedCount() }})
        </button>
      </div>

      <!-- Messages List -->
      <div class="space-y-4">
        <div *ngFor="let message of filteredMessages" 
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
                <span>•</span>
                <span>{{ message.email }}</span>
                <span>•</span>
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
                <h4 class="text-sm font-medium text-gray-900">Reply to this message:</h4>
                <div class="mt-2">
                  <textarea [(ngModel)]="replyText"
                            rows="4"
                            placeholder="Type your reply here..."
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"></textarea>
                  <div class="mt-2 flex justify-end">
                    <button (click)="sendReply(message)"
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                      Send Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="filteredMessages.length === 0" class="text-center py-12 bg-white rounded-lg">
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
  messages: Message[] = [];
  filteredMessages: Message[] = [];
  currentFilter: 'all' | 'unread' | 'read' | 'replied' = 'all';
  expandedMessages = new Set<string>();
  replyText = '';

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    // Mock data - replace with API call
    this.messages = [
      {
        _id: '1',
        name: 'Kasun Jayawardena',
        email: 'kasun@example.com',
        subject: 'Question about shipping to Galle',
        message: 'Hi, I wanted to know if you deliver to Galle district and what are the shipping charges? Also, how long does it usually take for delivery to Galle?',
        status: 'unread',
        createdAt: new Date()
      },
      {
        _id: '2',
        name: 'Dilani Fernando',
        email: 'dilani@example.com',
        subject: 'Bulk order inquiry',
        message: 'We are interested in placing a bulk order for our office. Do you offer any discounts for bulk purchases? We need about 20 wireless headphones.',
        status: 'read',
        createdAt: new Date(Date.now() - 3600000)
      },
      {
        _id: '3',
        name: 'Ruwan Silva',
        email: 'ruwan@example.com',
        subject: 'Product return',
        message: 'I received a damaged product (Order #10231). How can I return it and get a replacement? Please advise on the return process.',
        status: 'replied',
        createdAt: new Date(Date.now() - 86400000)
      }
    ];
    this.filterMessages();
  }

  setFilter(filter: 'all' | 'unread' | 'read' | 'replied') {
    this.currentFilter = filter;
    this.filterMessages();
  }

  filterMessages() {
    if (this.currentFilter === 'all') {
      this.filteredMessages = [...this.messages];
    } else {
      this.filteredMessages = this.messages.filter(m => m.status === this.currentFilter);
    }
  }

  toggleMessage(message: Message) {
    if (this.expandedMessages.has(message._id)) {
      this.expandedMessages.delete(message._id);
    } else {
      this.expandedMessages.add(message._id);
      if (message.status === 'unread') {
        message.status = 'read';
        this.filterMessages();
      }
    }
  }

  markAsRead(message: Message, event: Event) {
    event.stopPropagation();
    message.status = 'read';
    this.filterMessages();
    // In real app, make API call
  }

  markAsReplied(message: Message, event: Event) {
    event.stopPropagation();
    message.status = 'replied';
    this.filterMessages();
    // In real app, make API call
  }

  deleteMessage(message: Message, event: Event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this message?')) {
      const index = this.messages.indexOf(message);
      if (index > -1) {
        this.messages.splice(index, 1);
        this.filterMessages();
      }
      // In real app, make API call
    }
  }

  sendReply(message: Message) {
    if (this.replyText.trim()) {
      console.log('Sending reply to:', message.email);
      console.log('Reply text:', this.replyText);
      message.status = 'replied';
      this.replyText = '';
      this.expandedMessages.delete(message._id);
      this.filterMessages();
      // In real app, send email via API
    }
  }

  getTotalCount(): number {
    return this.messages.length;
  }

  getUnreadCount(): number {
    return this.messages.filter(m => m.status === 'unread').length;
  }

  getReadCount(): number {
    return this.messages.filter(m => m.status === 'read').length;
  }

  getRepliedCount(): number {
    return this.messages.filter(m => m.status === 'replied').length;
  }
}