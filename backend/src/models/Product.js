const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  images: [{
    type: String
  }],
  inventory: {
    type: Number,
    required: true,
    min: [0, 'Inventory cannot be negative'],
    default: 0
  },
  categories: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

productSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ categories: 1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model('Product', productSchema);
