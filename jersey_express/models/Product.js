const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  team: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['club', 'nation'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: '/uploads/default-jersey.jpg'
  },
  badge: {
    type: String,
    required: true
  },
  sizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  }],
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: ['home', 'away', 'third', 'special'],
    default: 'home'
  },
  season: {
    type: String,
    default: '2026'
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);