import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  teamMembers = [
    {
      name: 'John Doe',
      role: 'Founder & CEO',
      image: 'https://via.placeholder.com/300x300?text=John',
      bio: 'With over 15 years of experience in e-commerce, John founded Ratz Store to bring quality products to customers worldwide.'
    },
    {
      name: 'Jane Smith',
      role: 'Head of Operations',
      image: 'https://via.placeholder.com/300x300?text=Jane',
      bio: 'Jane ensures smooth operations and excellent customer service across all departments.'
    },
    {
      name: 'Mike Johnson',
      role: 'Head of Marketing',
      image: 'https://via.placeholder.com/300x300?text=Mike',
      bio: 'Mike leads our marketing efforts to connect with customers and showcase our amazing products.'
    },
    {
      name: 'Sarah Williams',
      role: 'Customer Success Manager',
      image: 'https://via.placeholder.com/300x300?text=Sarah',
      bio: 'Sarah is dedicated to ensuring every customer has a fantastic shopping experience.'
    }
  ];

  values = [
    {
      title: 'Quality First',
      description: 'We carefully select each product to ensure it meets our high standards.',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      title: 'Customer Focus',
      description: 'Your satisfaction is our top priority. We\'re here to help every step of the way.',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
    },
    {
      title: 'Innovation',
      description: 'We continuously improve our platform to provide the best shopping experience.',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z'
    },
    {
      title: 'Integrity',
      description: 'We believe in honest, transparent business practices and fair pricing.',
      icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3'
    }
  ];

  constructor(
    private meta: Meta,
    private title: Title
  ) {
    this.title.setTitle('About Us - Ratz Store');
    this.meta.addTags([
      { name: 'description', content: 'Learn about Ratz Store, our mission, values, and the team dedicated to bringing you quality products.' },
      { name: 'keywords', content: 'about us, company, team, mission, values' }
    ]);
  }
}