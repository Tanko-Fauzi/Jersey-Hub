const Order = require('../models/Order');
const Product = require('../models/Product');
const Rider = require('../models/Rider');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      subtotal,
      deliveryFee,
      total
    } = req.body;
    
    if (!items || items.length === 0) {
      res.status(400);
      throw new Error('No order items');
    }
    
    // Generate unique order number
    const orderNumber = 'JER-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Verify stock and update
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404);
        throw new Error(`Product ${item.product} not found`);
      }
      if (product.stock < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for ${product.name}`);
      }
      product.stock -= item.quantity;
      await product.save();
    }
    
    // Find available rider if delivery method is rider
    let riderId = null;
    if (deliveryMethod.type === 'rider') {
      const availableRider = await Rider.findOne({ available: true });
      if (availableRider) {
        riderId = availableRider._id;
        availableRider.available = false;
        availableRider.currentOrder = null; // Will be updated after order creation
        await availableRider.save();
      }
    }
    
    const order = new Order({
      user: req.body.userId || null,
      orderNumber,
      items,
      shippingAddress,
      deliveryMethod,
      rider: riderId,
      paymentMethod,
      subtotal,
      deliveryFee,
      total,
      status: 'pending'
    });
    
    const createdOrder = await order.save();
    
    // Update rider with order if assigned
    if (riderId) {
      await Rider.findByIdAndUpdate(riderId, { currentOrder: createdOrder._id });
    }
    
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('rider', 'name phone vehicle rating');
    
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Public (with email)
const getMyOrders = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    const orders = await Order.find({ 'shippingAddress.email': email })
      .populate('rider', 'name phone vehicle rating')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('rider', 'name phone vehicle')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (order) {
      order.status = status;
      
      if (status === 'delivered') {
        order.deliveredAt = Date.now();
        
        // Free up rider if assigned
        if (order.rider) {
          const rider = await Rider.findById(order.rider);
          if (rider) {
            rider.available = true;
            rider.totalDeliveries += 1;
            rider.completedOrders.push(order._id);
            rider.currentOrder = null;
            await rider.save();
          }
        }
      }
      
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Assign rider to order
// @route   PUT /api/orders/:id/rider
// @access  Private/Admin
const assignRider = async (req, res) => {
  try {
    const { riderId } = req.body;
    const order = await Order.findById(req.params.id);
    const rider = await Rider.findById(riderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }
    
    if (!rider.available) {
      return res.status(400).json({ message: 'Rider is not available' });
    }
    
    // Update previous rider if exists
    if (order.rider) {
      await Rider.findByIdAndUpdate(order.rider, { 
        available: true, 
        currentOrder: null 
      });
    }
    
    order.rider = riderId;
    rider.available = false;
    rider.currentOrder = order._id;
    
    await order.save();
    await rider.save();
    
    res.json({ message: 'Rider assigned successfully', order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update tracking number
// @route   PUT /api/orders/:id/tracking
// @access  Private/Admin
const updateTracking = async (req, res) => {
  try {
    const { trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (order) {
      order.trackingNumber = trackingNumber;
      if (!trackingNumber) {
        order.status = 'shipped';
      }
      
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  assignRider,
  updateTracking
};