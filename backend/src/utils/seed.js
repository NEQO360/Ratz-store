require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Contact = require('../models/Contact');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Contact.deleteMany();
    console.log('Cleared existing data');

    // --- Users ---
    const admin = await User.create({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@ratzstore.lk',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin'
    });
    console.log('Admin user created:', admin.email);

    // --- Products ---
    const products = await Product.create([
      {
        name: 'Premium Wireless Headphones',
        price: 8999,
        description: 'High-quality wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and professionals.',
        images: ['https://via.placeholder.com/400x400?text=Headphones'],
        inventory: 25,
        categories: ['electronics', 'audio'],
        featured: true
      },
      {
        name: 'Smart Watch Pro',
        price: 24999,
        description: 'Advanced fitness tracking and smartphone integration with heart rate monitor, GPS, and water resistance up to 50m.',
        images: ['https://via.placeholder.com/400x400?text=Smart+Watch'],
        inventory: 15,
        categories: ['electronics', 'wearables'],
        featured: true
      },
      {
        name: 'Portable Speaker',
        price: 5999,
        description: 'Waterproof Bluetooth speaker with 12-hour battery life, 360-degree sound, and built-in microphone for hands-free calls.',
        images: ['https://via.placeholder.com/400x400?text=Speaker'],
        inventory: 30,
        categories: ['electronics', 'audio'],
        featured: true
      },
      {
        name: 'Laptop Stand',
        price: 3999,
        description: 'Ergonomic aluminum laptop stand for better posture. Adjustable height, foldable design, compatible with all laptops up to 17 inches.',
        images: ['https://via.placeholder.com/400x400?text=Laptop+Stand'],
        inventory: 40,
        categories: ['accessories', 'office'],
        featured: true
      },
      {
        name: 'USB-C Hub',
        price: 4599,
        description: '7-in-1 USB-C hub with HDMI 4K, USB 3.0, SD card reader, and 100W power delivery pass-through.',
        images: ['https://via.placeholder.com/400x400?text=USB-C+Hub'],
        inventory: 35,
        categories: ['electronics', 'accessories']
      },
      {
        name: 'Wireless Mouse',
        price: 2999,
        description: 'Ergonomic wireless mouse with silent clicks, 6 programmable buttons, and dual Bluetooth/USB receiver connectivity.',
        images: ['https://via.placeholder.com/400x400?text=Mouse'],
        inventory: 50,
        categories: ['electronics', 'accessories']
      },
      {
        name: 'Mechanical Keyboard',
        price: 12999,
        description: 'RGB mechanical keyboard with hot-swappable switches, PBT keycaps, and programmable macros. N-key rollover.',
        images: ['https://via.placeholder.com/400x400?text=Keyboard'],
        inventory: 20,
        categories: ['electronics', 'office']
      },
      {
        name: 'Phone Case',
        price: 1999,
        description: 'Shockproof protective phone case with military-grade drop protection and slim design. Available for all major models.',
        images: ['https://via.placeholder.com/400x400?text=Phone+Case'],
        inventory: 100,
        categories: ['accessories']
      },
      {
        name: 'Power Bank',
        price: 6999,
        description: '20000mAh power bank with 65W fast charging, USB-C and USB-A ports. Charges laptops and phones simultaneously.',
        images: ['https://via.placeholder.com/400x400?text=Power+Bank'],
        inventory: 45,
        categories: ['electronics', 'accessories']
      },
      {
        name: 'Cable Organizer',
        price: 999,
        description: 'Premium leather cable organizer set. Keep your desk tidy with magnetic cable clips and a roll-up travel pouch.',
        images: ['https://via.placeholder.com/400x400?text=Cable+Organizer'],
        inventory: 60,
        categories: ['accessories', 'office']
      },
      {
        name: 'Desk Lamp',
        price: 7999,
        description: 'LED desk lamp with adjustable color temperature, brightness levels, USB charging port, and memory function.',
        images: ['https://via.placeholder.com/400x400?text=Desk+Lamp'],
        inventory: 22,
        categories: ['electronics', 'office']
      },
      {
        name: 'Webcam HD',
        price: 9999,
        description: '1080p HD webcam with auto-focus, built-in ring light, noise-cancelling microphone, and privacy cover.',
        images: ['https://via.placeholder.com/400x400?text=Webcam'],
        inventory: 18,
        categories: ['electronics', 'office']
      }
    ]);
    console.log(`${products.length} products created`);

    // --- Orders ---
    const orders = await Order.create([
      {
        orderNumber: '10234',
        customer: { name: 'Amal Perera', email: 'amal@example.com', phone: '+94 77 123 4567' },
        items: [
          { product: products[0]._id, name: products[0].name, price: products[0].price, quantity: 1 },
          { product: products[3]._id, name: products[3].name, price: products[3].price, quantity: 2 }
        ],
        total: products[0].price + products[3].price * 2,
        status: 'pending',
        shippingAddress: { street: '123 Galle Road', city: 'Colombo', postalCode: '00300' },
        paymentMethod: 'Credit Card'
      },
      {
        orderNumber: '10235',
        customer: { name: 'Nimal Silva', email: 'nimal@example.com', phone: '+94 71 234 5678' },
        items: [
          { product: products[1]._id, name: products[1].name, price: products[1].price, quantity: 1 }
        ],
        total: products[1].price,
        status: 'processing',
        shippingAddress: { street: '456 Main Street', city: 'Kandy', postalCode: '20000' },
        paymentMethod: 'Cash on Delivery'
      },
      {
        orderNumber: '10236',
        customer: { name: 'Kamala Fernando', email: 'kamala@example.com', phone: '+94 76 345 6789' },
        items: [
          { product: products[6]._id, name: products[6].name, price: products[6].price, quantity: 1 },
          { product: products[5]._id, name: products[5].name, price: products[5].price, quantity: 1 }
        ],
        total: products[6].price + products[5].price,
        status: 'shipped',
        shippingAddress: { street: '789 Temple Road', city: 'Galle', postalCode: '80000' },
        paymentMethod: 'Bank Transfer'
      },
      {
        orderNumber: '10237',
        customer: { name: 'Sunil Jayawardena', email: 'sunil@example.com', phone: '+94 77 456 7890' },
        items: [
          { product: products[2]._id, name: products[2].name, price: products[2].price, quantity: 2 }
        ],
        total: products[2].price * 2,
        status: 'delivered',
        shippingAddress: { street: '321 Lake Road', city: 'Colombo', postalCode: '00500' },
        paymentMethod: 'Credit Card'
      }
    ]);
    console.log(`${orders.length} orders created`);

    // --- Contacts ---
    const contacts = await Contact.create([
      {
        name: 'Kasun Jayawardena',
        email: 'kasun@example.com',
        subject: 'Question about shipping to Galle',
        message: 'Hi, I wanted to know if you deliver to Galle district and what are the shipping charges? Also, how long does it usually take for delivery to Galle?',
        status: 'unread'
      },
      {
        name: 'Dilani Fernando',
        email: 'dilani@example.com',
        subject: 'Bulk order inquiry',
        message: 'We are interested in placing a bulk order for our office. Do you offer any discounts for bulk purchases? We need about 20 wireless headphones.',
        status: 'read'
      },
      {
        name: 'Ruwan Silva',
        email: 'ruwan@example.com',
        subject: 'Product return',
        message: 'I received a damaged product (Order #10231). How can I return it and get a replacement? Please advise on the return process.',
        status: 'replied'
      }
    ]);
    console.log(`${contacts.length} contact messages created`);

    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seedData();
