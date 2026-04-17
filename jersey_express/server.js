const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock product data with real images and GHS prices
const products = [
  { 
    _id: '1', 
    name: "Home Jersey 2026", 
    team: "Manchester United", 
    type: "club", 
    price: 30.00, 
    description: "Official Manchester United home jersey for 2026 season.",
    badge: "MUFC", 
    imageUrl: "https://assets.manutd.com/AssetPicker/images/0/0/10/126/687707/L_H_20_1_2007443098_1.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 50,
    category: "home",
    season: "2026"
  },
  { 
    _id: '2', 
    name: "Away Jersey 2026", 
    team: "Real Madrid", 
    type: "club", 
    price: 30.00, 
    description: "Official Real Madrid away jersey for 2026 season.",
    badge: "RMCF", 
    imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/real-madrid-24-25-away-jersey.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 45,
    category: "away",
    season: "2026"
  },
  { 
    _id: '3', 
    name: "Third Kit 2026", 
    team: "Barcelona", 
    type: "club", 
    price: 30.00, 
    description: "Official Barcelona third kit for 2026 season.",
    badge: "FCB", 
    imageUrl: "https://www.fcbarcelona.com/fcbarcelona/photo/2023/06/15/blazers/2023-24_Third_Kit.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 40,
    category: "third",
    season: "2026"
  },
  { 
    _id: '4', 
    name: "Home Jersey 2026", 
    team: "Bayern Munich", 
    type: "club", 
    price: 30.00, 
    description: "Official Bayern Munich home jersey for 2026 season.",
    badge: "FCB", 
    imageUrl: "https://shop.fcbayern.com/media/image/20/87/6f/FCB-Home-Jersey-2024-25_1_600x600.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 35,
    category: "home",
    season: "2026"
  },
  { 
    _id: '5', 
    name: "World Cup Home", 
    team: "Argentina", 
    type: "nation", 
    price: 30.00, 
    description: "Argentina national team home jersey. Features three stars.",
    badge: "ARG", 
    imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/argentina-24-home-jersey.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 60,
    category: "home",
    season: "2026"
  },
  { 
    _id: '6', 
    name: "World Cup Away", 
    team: "Brazil", 
    type: "nation", 
    price: 30.00, 
    description: "Brazil national team away jersey.",
    badge: "BRA", 
    imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/brazil-24-away-jersey.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 55,
    category: "away",
    season: "2026"
  },
  { 
    _id: '7', 
    name: "Euro Home", 
    team: "France", 
    type: "nation", 
    price: 30.00, 
    description: "France national team home jersey.",
    badge: "FRA", 
    imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/france-24-home-jersey.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 48,
    category: "home",
    season: "2026"
  },
  { 
    _id: '8', 
    name: "Home Jersey", 
    team: "England", 
    type: "nation", 
    price: 30.00, 
    description: "England national team home jersey.",
    badge: "ENG", 
    imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/england-24-home-jersey.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 52,
    category: "home",
    season: "2026"
  }
];

// Delivery options
const deliveryOptions = [
  { id: 'standard', name: 'Standard Delivery', price: 5.99, estimatedTime: '3-5 days' },
  { id: 'express', name: 'Express Delivery', price: 12.99, estimatedTime: '1-2 days' },
  { id: 'rider', name: 'Personal Rider', price: 15.99, estimatedTime: 'Same day' }
];

// Riders
const riders = [
  { _id: '1', name: 'John Smith', vehicle: 'Motorcycle', rating: 4.9, available: true },
  { _id: '2', name: 'Mike Johnson', vehicle: 'Scooter', rating: 4.8, available: true },
  { _id: '3', name: 'David Lee', vehicle: 'Bike', rating: 4.7, available: true }
];

// Orders storage
let orders = [];

// ============== ROUTES ==============

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Jersey Shop API is running' });
});

// Get all products
app.get('/api/products', (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.page) || 1;
  
  let filteredProducts = [...products];
  
  // Filter by type
  if (req.query.type) {
    filteredProducts = filteredProducts.filter(p => p.type === req.query.type);
  }
  
  // Search
  if (req.query.keyword) {
    const keyword = req.query.keyword.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.team.toLowerCase().includes(keyword) ||
      p.name.toLowerCase().includes(keyword)
    );
  }
  
  // Pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  res.json({
    products: paginatedProducts,
    page,
    pages: Math.ceil(filteredProducts.length / pageSize),
    total: filteredProducts.length
  });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p._id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Get products by type
app.get('/api/products/type/:type', (req, res) => {
  const filtered = products.filter(p => p.type === req.params.type);
  res.json(filtered);
});

// Search products
app.get('/api/products/search', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json(products);
  
  const searchTerm = q.toLowerCase();
  const filtered = products.filter(p => 
    p.team.toLowerCase().includes(searchTerm) ||
    p.name.toLowerCase().includes(searchTerm)
  );
  res.json(filtered);
});

// Get delivery options
app.get('/api/delivery/options', (req, res) => {
  res.json(deliveryOptions);
});

// Get available riders
app.get('/api/delivery/riders/available', (req, res) => {
  res.json(riders.filter(r => r.available));
});

// Create order
app.post('/api/orders', (req, res) => {
  const orderNumber = 'JER-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  
  const order = {
    _id: (orders.length + 1).toString(),
    orderNumber,
    ...req.body,
    status: 'pending',
    createdAt: new Date()
  };
  
  orders.push(order);
  res.status(201).json(order);
});

// Get order by ID
app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o._id === req.params.id || o.orderNumber === req.params.id);
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

// User login (mock)
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  res.json({
    _id: '1',
    name: 'Test User',
    email: email,
    token: 'mock_jwt_token'
  });
});

// User register (mock)
app.post('/api/users/register', (req, res) => {
  const { name, email, password } = req.body;
  res.status(201).json({
    _id: '1',
    name: name,
    email: email,
    token: 'mock_jwt_token'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🛍️  Products: http://localhost:${PORT}/api/products\n`);
});
const axios = require('axios'); // Add this at the top with other imports

// Add these after your existing routes:

// ============== PAYSTACK ROUTES ==============

// Initialize Paystack transaction
app.post('/api/payments/initialize', async (req, res) => {
  try {
    const { email, amount, orderId, currency = 'GHS' } = req.body;
    
    // Paystack expects amount in pesewas (1 GHS = 100 pesewas)
    const amountInPesewas = Math.round(amount * 100);
    
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amountInPesewas,
        currency,
        reference: `JER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        metadata: {
          orderId: orderId,
          custom_fields: [
            {
              display_name: 'Order Type',
              variable_name: 'order_type',
              value: 'Jersey Purchase'
            }
          ]
        },
        callback_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/order-confirmation`
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    res.json({
      success: true,
      data: response.data.data
    });
  } catch (error) {
    console.error('Paystack initialization error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Payment initialization failed'
    });
  }
});

// Verify Paystack payment
app.get('/api/payments/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );
    
    const { status, data } = response.data;
    
    if (status && data.status === 'success') {
      // Payment successful - update order status in your database
      const orderId = data.metadata?.orderId;
      
      // Find and update the order (mock example)
      const order = orders.find(o => o._id === orderId || o.orderNumber === orderId);
      if (order) {
        order.status = 'processing';
        order.paymentResult = {
          reference: data.reference,
          status: data.status,
          amount: data.amount / 100,
          paidAt: data.paid_at
        };
      }
      
      res.json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          reference: data.reference,
          amount: data.amount / 100,
          currency: data.currency,
          orderId: orderId
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
});

// Paystack webhook (for production)
app.post('/api/payments/webhook', (req, res) => {
  // Verify webhook signature (important for security!)
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(401).json({ message: 'Invalid signature' });
  }
  
  const event = req.body;
  
  // Handle different event types
  switch (event.event) {
    case 'charge.success':
      // Update order status to paid
      console.log('Payment successful:', event.data.reference);
      break;
    case 'charge.failed':
      // Handle failed payment
      console.log('Payment failed:', event.data.reference);
      break;
    default:
      console.log('Unhandled event:', event.event);
  }
  
  res.sendStatus(200);
});