const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: String,
  team: String,
  price: Number,
  size: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  imageUrl: String
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'USA' }
  },
  deliveryMethod: {
    type: {
      type: String,
      enum: ['standard', 'express', 'rider'],
      required: true
    },
    name: String,
    price: Number,
    estimatedTime: String
  },
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rider'
  },
  paymentMethod: {
    type: String,
    required: true,
    default: 'card'
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  subtotal: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  trackingNumber: String,
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);