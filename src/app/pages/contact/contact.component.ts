import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  contactForm: ContactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  showSuccessMessage = false;
  isSubmitting = false;

  contactInfo = [
    {
      icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      title: 'Email',
      details: 'support@ratzstore.com',
      subtext: 'We\'ll respond within 24 hours'
    },
    {
      icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
      title: 'Phone',
      details: '+94 11 234 5678',
      subtext: 'Mon-Fri 9AM-6PM IST'
    },
    {
      icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
      title: 'Office',
      details: '123 Galle Road',
      subtext: 'Colombo 03, Sri Lanka'
    }
  ];

  faqs = [
    {
      question: 'What are your shipping times?',
      answer: 'We offer free shipping within Colombo for orders over Rs. 5,000. For other areas in Sri Lanka, standard shipping takes 2-3 business days, while express shipping takes 1 business day.'
    },
    {
      question: 'Do you offer returns?',
      answer: 'Yes! We offer a 30-day return policy for all unused items in their original packaging. See our return policy for more details.'
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email. You can use this to track your package on our website or the carrier\'s site.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes! We ship islandwide across Sri Lanka. Delivery times vary by location - Colombo and suburbs (1-2 days), other major cities (2-3 days), and remote areas (3-5 days).'
    }
  ];

  constructor(
    private meta: Meta,
    private title: Title
  ) {
    this.title.setTitle('Contact Us - Ratz Store');
    this.meta.addTags([
      { name: 'description', content: 'Get in touch with Ratz Store. We\'re here to help with any questions about products, orders, or general inquiries.' },
      { name: 'keywords', content: 'contact, support, customer service, help, questions' }
    ]);
  }

  onSubmit() {
    if (this.isFormValid()) {
      this.isSubmitting = true;
      
      // Simulate API call
      setTimeout(() => {
        console.log('Form submitted:', this.contactForm);
        this.showSuccessMessage = true;
        this.isSubmitting = false;
        this.resetForm();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 5000);
      }, 1500);
    }
  }

  isFormValid(): boolean {
    return !!(
      this.contactForm.name &&
      this.contactForm.email &&
      this.isValidEmail(this.contactForm.email) &&
      this.contactForm.subject &&
      this.contactForm.message
    );
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  resetForm() {
    this.contactForm = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }
}