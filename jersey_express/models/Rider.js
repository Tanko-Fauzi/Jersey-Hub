const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  vehicle: {
    type: String,
    required: true
  },
  licensePlate: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 5.0
  },
  totalDeliveries: {
    type: Number,
    default: 0
  },
  available: {
    type: Boolean,
    default: true
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  currentOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  completedOrders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

riderSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model('Rider', riderSchema);